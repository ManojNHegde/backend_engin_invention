import { beforeEach, describe, expect, it } from 'vitest';
import { checksOf, stops } from './rules';
import { requestOf, useOnboarding } from './store';

const st = () => useOnboarding.getState();
const req = (id: string) => requestOf(st(), id)!;
const checks = (id: string) => checksOf(req(id), st());
const stopTitles = (id: string) => stops(checks(id)).map((c) => c.title);
const set = (id: string, values: Record<string, string | number>) => Object.entries(values).forEach(([k, v]) => st().setValue(id, k, v));

/** Malnad, everything from Ravi's paper form, checked on the GST portal and by penny-drop. */
function readyMalnad() {
  st().typeFromPaper('REQ-0101');
  st().checkGstin('REQ-0101');
  st().runPennyDrop('REQ-0101');
}

describe('vendor from a paper form: Malnad Cocoa Traders', () => {
  beforeEach(() => st().reset());

  it('party details typed from the form; the system works out state, constitution and account name', () => {
    const r = req('REQ-0101');
    expect(r.status).toBe('draft');
    expect(r.partyId).toBeNull();
    expect(r.values.state).toBe('KA'); // GSTIN starts with 29
    expect(r.values.constitution).toBe('partnership'); // PAN 4th letter F
    expect(r.values.accountName).toBe('Malnad Cocoa Traders');
    expect(stopTitles('REQ-0101')).toContain('Still to fill: Category · Related party · Credit days · MSME · Bank account number · IFSC · Beneficiary name');
    expect(stopTitles('REQ-0101')).toContain('Check the GSTIN on the GST portal');
  });

  it('every field is editable, and copying mistakes are caught', () => {
    st().setValue('REQ-0101', 'legalName', 'Malnad Cocoa Traders LLP');
    expect(req('REQ-0101').values.accountName).toBe('Malnad Cocoa Traders LLP'); // follows until you change it
    st().setValue('REQ-0101', 'pan', 'AAHFM0000B');
    expect(stopTitles('REQ-0101')).toContain('GSTIN does not belong to this PAN');
    st().setValue('REQ-0101', 'pan', 'AAHFM0000A');
    st().setValue('REQ-0101', 'state', 'TN');
    expect(stopTitles('REQ-0101')).toContain('State does not match the GSTIN');
  });

  it('the category sets the header and the 43B(h) answer', () => {
    set('REQ-0101', { category: 'goods_msme' });
    expect(req('REQ-0101').values.under).toBe('Trade Payables › Goods');
    expect(req('REQ-0101').values.sec43bh).toBe('yes');
  });

  it('stops: MSME mismatch, more than 45 days, a bank account used by Vendor A', () => {
    readyMalnad();
    st().setValue('REQ-0101', 'category', 'goods_non_msme');
    expect(stopTitles('REQ-0101')).toContain('Category says Non-MSME, but MSME = Yes');
    st().setValue('REQ-0101', 'category', 'goods_msme');
    st().setValue('REQ-0101', 'creditDays', 60);
    expect(stopTitles('REQ-0101')).toContain('60 credit days for an MSME vendor');
    st().setValue('REQ-0101', 'bankAccountNo', '50100012345678');
    expect(stopTitles('REQ-0101')).toContain('Bank account already used by Vendor A');
  });

  it('a penny-drop name mismatch needs a call-back on the number from the form, not an email one', () => {
    readyMalnad();
    st().setValue('REQ-0101', 'bankAccountNo', '777700001234');
    expect(stopTitles('REQ-0101')).toContain('Bank details changed after the penny-drop: run it again');
    st().runPennyDrop('REQ-0101');
    expect(req('REQ-0101').pennyDrop!.result).toBe('name_mismatch');
    set('REQ-0101', { callBackNumber: 'email', callBackPerson: 'Mr Gowda' });
    expect(stopTitles('REQ-0101')).toContain('Call-back number came from an email with the bank details');
    st().setValue('REQ-0101', 'callBackNumber', '+91 98450 00000');
    expect(stopTitles('REQ-0101')).toEqual([]);
  });

  it('submit → three checkers → a NEW party in the master and an active account', () => {
    readyMalnad();
    expect(stopTitles('REQ-0101')).toEqual([]);
    st().submit('REQ-0101');
    const r = req('REQ-0101');
    expect(r.status).toBe('submitted');
    expect(r.changes.map((c) => c.checker)).toEqual(['rajan', 'usha', 'venkat']);
    expect(r.changes[0].after.pan).toBe('AAHFM0000A'); // Rajan checks the party details too
    r.changes.forEach((c) => st().decide('REQ-0101', c.id, true));
    const done = req('REQ-0101');
    expect(done.status).toBe('active');
    const party = st().parties.find((p) => p.partyId === done.partyId)!;
    expect(party.legalName).toBe('Malnad Cocoa Traders');
    expect(party.gstins[0]).toEqual({ value: '29AAHFM0000A1Z5', stateCode: 'KA', status: 'active' });
    expect(party.roles[0]).toMatchObject({ type: 'supplier', formFrom: 'ravi', formNo: 'VRF-0107' });
    const acct = st().accounts.find((a) => a.partyId === party.partyId)!;
    expect(acct.under).toBe('Trade Payables › Goods');
    expect(st().log.some((e) => e.line === 'INSERT party_master.party')).toBe(true);
    expect(st().log.some((e) => e.line === 'finance.party_account.activated')).toBe(true);
  });

  it('a returned part comes back; approved parts stay approved on resubmit', () => {
    readyMalnad();
    st().submit('REQ-0101');
    const [party, bank] = req('REQ-0101').changes;
    st().decide('REQ-0101', party.id, true);
    st().decide('REQ-0101', bank.id, false, 'Cancelled cheque does not match the account');
    expect(req('REQ-0101').status).toBe('returned');
    st().setValue('REQ-0101', 'beneficiary', 'Malnad Cocoa Traders (firm)');
    st().submit('REQ-0101');
    const after = req('REQ-0101').changes;
    expect(after.find((c) => c.block === 'party')!.status).toBe('approved');
    expect(after.find((c) => c.block === 'bank')!.status).toBe('pending');
  });
});

describe('customers from paper forms, and parties already in the master', () => {
  beforeEach(() => st().reset());

  it('Coastal Bakes: same PAN as an old party (a warning), checked by Farid, goes live', () => {
    const id = st().createRequest({ side: 'receivable', from: 'arun', formNo: 'CRF-0019', paper: 'coastal' });
    expect(req(id).values.legalName ?? '').toBe('');
    st().typeFromPaper(id);
    st().checkGstin(id);
    expect(req(id).values.under).toBe('Trade Receivables › Domestic');
    expect(req(id).values.constitution).toBe('company');
    expect(checks(id).some((c) => c.level === 'warn' && c.title.includes('Same PAN as P-0088') && c.usePartyId === 'P-0088')).toBe(true);
    expect(stopTitles(id)).toEqual([]);
    st().submit(id);
    expect(req(id).changes.map((c) => c.checker)).toEqual(['rajan', 'farid', 'venkat']);
    req(id).changes.forEach((c) => st().decide(id, c.id, true));
    expect(st().accounts.find((a) => a.requestId === id)!.creditLimit).toBe(4_00_000);
  });

  it('Sri Lakshmi (Mysuru): the GSTIN is already our customer, so the form goes back to Arun', () => {
    const id = st().createRequest({ side: 'receivable', from: 'arun', formNo: 'CRF-0020', paper: 'lakshmi' });
    st().typeFromPaper(id);
    const stop = stops(checks(id)).find((c) => c.sendBack)!;
    expect(stop.title).toBe('Already set up: GSTIN 29AAKFS0000S1Z2 is Sri Lakshmi Distributors (P-0031)');
    const before = st().parties.length;
    st().sendBack(id, 'Same GSTIN as Sri Lakshmi Distributors (C-01): add the depot as a location instead');
    expect(req(id).status).toBe('sent_back');
    expect(req(id).sentBack!.to).toBe('arun');
    expect(st().parties.length).toBe(before);
    expect(st().log.some((e) => e.line === 'finance.party_account.sent_back')).toBe(true);
  });

  it('using a party from the master locks its details', () => {
    const id = st().createRequest({ side: 'receivable', from: 'arun', formNo: 'CRF-0019', paper: 'coastal' });
    st().typeFromPaper(id);
    st().useParty(id, 'P-0088');
    expect(req(id).partyId).toBe('P-0088');
    expect(req(id).values.legalName).toBe('Coastal Bakes & Confectioners');
    st().setValue(id, 'legalName', 'Something else');
    expect(req(id).values.legalName).toBe('Coastal Bakes & Confectioners');
  });

  it('Healthy Bite: one party, a customer account already; the vendor account adds a role, no new party', () => {
    const r = req('REQ-0100');
    expect(r.partyId).toBe('P-0042');
    expect(r.values.accountName).toBe('Healthy Bite Foods (vendor)');
    expect(checks('REQ-0100').some((c) => c.title === 'Also our customer')).toBe(true);
    const before = st().parties.length;
    st().decide('REQ-0100', 'CHG-0100-2', true);
    expect(st().parties.length).toBe(before);
    expect(st().accounts.filter((a) => a.partyId === 'P-0042').map((a) => a.side).sort()).toEqual(['payable', 'receivable']);
    expect(st().parties.find((p) => p.partyId === 'P-0042')!.roles.map((x) => x.type)).toEqual(['customer', 'supplier']);
  });
});
