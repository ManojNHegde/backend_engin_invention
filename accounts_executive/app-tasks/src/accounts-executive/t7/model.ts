// T7 — Complete and maintain vendor finance fields.
// Pure data and rules for this one task; no UI. Mock data from the biscuit-plant scenario.
//
// The task in one line: a vendor (new, or already in the books) needs its finance fields set or
// changed — credit terms, ledger, bank account. Identity (name, PAN, GSTIN) belongs to Business
// Core and is only shown. Bank details go to the Finance Controller as well, and only with
// penny-drop and call-back evidence.

import { seedVendors } from '../../mock/seed';

export type RequestKind = 'new' | 'bank' | 'terms';
export type CheckResult = 'stop' | 'warn' | 'ok';
export type Stage = 'draft' | 'with-am' | 'with-fc' | 'applied' | 'returned';

export interface Identity {
  name: string;
  legalName: string; // the name the bank must show on penny-drop
  gstin: string | null;
  pan: string;
  state: string;
  supplies: string;
  msme: 'micro' | 'small' | 'medium' | null;
}

export interface FinanceFields {
  creditDays: number | '';
  ledger: string;
  bankAccount: string;
  ifsc: string;
  callBackBy: string;
  callBackOn: string;
}

export interface VendorRequest {
  id: string;
  kind: RequestKind;
  proposedBy: string;
  proposedOn: string;
  summary: string;
  identity: Identity;
  /** What the master holds today (null for a new vendor). */
  current: FinanceFields | null;
  usualTerms: number;
  /** Terms on the quotation / PO that triggered the proposal. */
  quoteTerms: number | null;
  fields: FinanceFields;
  stage: Stage;
  history: { at: string; who: string; what: string }[];
}

export interface Check {
  id: string;
  result: CheckResult;
  title: string;
  detail?: string;
}

export const MSME_MAX_DAYS = 45;
export const LEDGERS = ['Sundry Creditors – Raw material', 'Sundry Creditors – Packing material', 'Sundry Creditors – Services'];
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const STAGE_LABEL: Record<Stage, string> = {
  draft: 'Needs me',
  'with-am': 'With Rajan',
  'with-fc': 'With Usha',
  applied: 'Applied',
  returned: 'Returned',
};

const blank: FinanceFields = { creditDays: '', ledger: '', bankAccount: '', ifsc: '', callBackBy: '', callBackOn: '' };

function current(id: string): FinanceFields {
  const v = seedVendors.find((x) => x.id === id)!;
  return { creditDays: v.creditDays, ledger: v.ledger, bankAccount: v.bankAccount ?? '', ifsc: v.ifsc ?? '', callBackBy: '', callBackOn: '' };
}

function identityOf(id: string, legalName?: string): Identity {
  const v = seedVendors.find((x) => x.id === id)!;
  return { name: v.name, legalName: legalName ?? v.name, gstin: v.gstin, pan: v.pan, state: v.state, supplies: v.supplies, msme: v.msme };
}

export function seedRequests(): VendorRequest[] {
  return [
    {
      id: 'VR-H',
      kind: 'new',
      proposedBy: 'Ravi (Procurement Officer)',
      proposedOn: '2026-10-07',
      summary: 'New vendor proposed from quotation QTN-0003',
      identity: { name: 'Malnad Cocoa Traders (Vendor H)', legalName: 'Malnad Cocoa Traders', gstin: '29AAHFM0000A1Z5', pan: 'AAHFM0000A', state: 'KA', supplies: 'Cocoa powder', msme: 'micro' },
      current: null,
      usualTerms: 45,
      quoteTerms: 15,
      fields: { ...blank, creditDays: 45 },
      stage: 'draft',
      history: [{ at: '2026-10-07 09:40', who: 'Ravi', what: 'Proposed the vendor in Business Core' }],
    },
    {
      id: 'VR-B',
      kind: 'bank',
      proposedBy: 'Ravi (Procurement Officer)',
      proposedOn: '2026-10-08',
      summary: 'Vendor B wrote that its account has moved to a new bank',
      identity: identityOf('V-B'),
      current: current('V-B'),
      usualTerms: 45,
      quoteTerms: null,
      fields: current('V-B'),
      stage: 'draft',
      history: [{ at: '2026-10-08 11:15', who: 'Ravi', what: 'Forwarded the vendor\'s letter with the new account' }],
    },
    {
      id: 'VR-D',
      kind: 'terms',
      proposedBy: 'Ravi (Procurement Officer)',
      proposedOn: '2026-10-08',
      summary: 'Vendor D agreed shorter terms in the renewed rate contract',
      identity: identityOf('V-D'),
      current: current('V-D'),
      usualTerms: 45,
      quoteTerms: 30,
      fields: { ...current('V-D'), creditDays: 30 },
      stage: 'draft',
      history: [{ at: '2026-10-08 12:05', who: 'Ravi', what: 'Sent the renewed rate contract' }],
    },
    {
      id: 'VR-E',
      kind: 'terms',
      proposedBy: 'Ravi (Procurement Officer)',
      proposedOn: '2026-10-01',
      summary: 'Ledger corrected to packing material',
      identity: identityOf('V-E'),
      current: current('V-E'),
      usualTerms: 45,
      quoteTerms: null,
      fields: { ...current('V-E'), ledger: 'Sundry Creditors – Packing material' },
      stage: 'applied',
      history: [
        { at: '2026-10-01 10:00', who: 'Ravi', what: 'Asked for the ledger change' },
        { at: '2026-10-01 14:30', who: 'Teja', what: 'Saved and sent for checking' },
        { at: '2026-10-02 09:10', who: 'Rajan', what: 'Approved' },
      ],
    },
  ];
}

// ---------- the bank's side (mock penny-drop) ----------

/** What the bank shows as the account holder. Unknown account → the bank cannot find it. */
const BANK: Record<string, string> = {
  '50100777000111': 'MALNAD COCOA TRADERS',
  '50100777000222': 'M C TRADERS PRIVATE LIMITED',
  '50100888000333': 'VENDOR B',
};
for (const v of seedVendors) if (v.bankAccount) BANK[v.bankAccount] = v.name.toUpperCase();

export const DEMO_ACCOUNTS: Record<string, { label: string; account: string; ifsc: string }[]> = {
  'VR-H': [
    { label: 'Valid account, name matches', account: '50100777000111', ifsc: 'HDFC0001234' },
    { label: 'Name at bank differs', account: '50100777000222', ifsc: 'HDFC0001234' },
    { label: 'Already used by Vendor C', account: '50100234567811', ifsc: 'ICIC0004321' },
  ],
  'VR-B': [
    { label: 'New account, name matches', account: '50100888000333', ifsc: 'SBIN0012345' },
    { label: 'Account not found at bank', account: '50100999999999', ifsc: 'SBIN0012345' },
  ],
};

const norm = (s: string) => s.toUpperCase().replace(/\(.*?\)/g, '').replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

export type PennyDrop = { state: 'idle' } | { state: 'not-found' } | { state: 'match'; holder: string } | { state: 'mismatch'; holder: string };

export function pennyDrop(req: VendorRequest, f: FinanceFields): PennyDrop {
  const acct = f.bankAccount.trim();
  const ifsc = f.ifsc.trim().toUpperCase();
  if (!acct || !IFSC.test(ifsc)) return { state: 'idle' };
  const holder = BANK[acct];
  if (!holder) return { state: 'not-found' };
  return norm(holder) === norm(req.identity.legalName) ? { state: 'match', holder } : { state: 'mismatch', holder };
}

// ---------- what the request changes ----------

export const bankChanged = (r: VendorRequest) =>
  r.kind === 'new' || r.fields.bankAccount.trim() !== (r.current?.bankAccount ?? '') || r.fields.ifsc.trim().toUpperCase() !== (r.current?.ifsc ?? '');

export const termsChanged = (r: VendorRequest) => r.kind === 'new' || r.fields.creditDays !== r.current?.creditDays || r.fields.ledger !== r.current?.ledger;

/** Who has to check: Accounts Manager for terms and ledger, the Finance Controller as well for bank details. */
export function checkers(r: VendorRequest): ('rajan' | 'usha')[] {
  return bankChanged(r) ? ['rajan', 'usha'] : ['rajan'];
}

// ---------- the checks (Stop · Warn · OK) ----------

export function runChecks(r: VendorRequest): Check[] {
  const f = r.fields;
  const out: Check[] = [];
  const days = typeof f.creditDays === 'number' ? f.creditDays : 0;

  if (!days) out.push({ id: 'days', result: 'stop', title: 'Enter the credit days' });
  if (!f.ledger) out.push({ id: 'ledger', result: 'stop', title: 'Map the ledger' });

  if (!bankChanged(r)) {
    out.push({ id: 'bank', result: 'ok', title: 'Bank details unchanged', detail: 'Only terms or ledger change, so the Finance Controller is not needed.' });
  } else {
    const acct = f.bankAccount.trim();
    const ifsc = f.ifsc.trim().toUpperCase();
    if (!acct || !ifsc) out.push({ id: 'bank', result: 'stop', title: 'Enter the bank account and IFSC' });
    else if (!IFSC.test(ifsc)) out.push({ id: 'bank', result: 'stop', title: `IFSC ${ifsc} is not valid`, detail: '4 letters, 0, then 6 letters or digits.' });
    else {
      const other = seedVendors.find((v) => v.bankAccount === acct && v.name !== r.identity.name);
      const pd = pennyDrop(r, f);
      if (other) out.push({ id: 'bank', result: 'stop', title: `Account already used by ${other.name}`, detail: 'The same bank account on two vendors is not allowed.' });
      else if (pd.state === 'not-found') out.push({ id: 'bank', result: 'stop', title: 'Penny-drop failed: the bank cannot find this account' });
      else if (pd.state === 'mismatch') out.push({ id: 'bank', result: 'stop', title: `Name at bank "${pd.holder}" does not match "${r.identity.legalName}"` });
      else if (pd.state === 'match') out.push({ id: 'bank', result: 'ok', title: `Penny-drop: name at bank ${pd.holder}, matches` });
    }
    if (!f.callBackBy.trim() || !f.callBackOn) out.push({ id: 'callback', result: 'stop', title: 'Call-back evidence missing', detail: 'Who confirmed the account with the vendor, and when. The Finance Controller reads this.' });
    else out.push({ id: 'callback', result: 'ok', title: `Confirmed with the vendor by ${f.callBackBy.trim()} on ${f.callBackOn}` });
  }

  if (r.identity.msme) {
    if (days > MSME_MAX_DAYS) out.push({ id: 'msme', result: 'stop', title: `More than ${MSME_MAX_DAYS} days for an MSME vendor`, detail: 'The MSMED Act limit.' });
    else out.push({ id: 'msme', result: 'warn', title: `MSME (${r.identity.msme}): pay within ${MSME_MAX_DAYS} days of acceptance` });
  }
  if (days && r.quoteTerms !== null && days !== r.quoteTerms)
    out.push({ id: 'terms', result: 'warn', title: `The quotation says Net ${r.quoteTerms} days`, detail: 'The quotation terms apply to that PO; the master holds the vendor\'s usual terms.' });

  return out;
}

export const stops = (c: Check[]) => c.filter((x) => x.result === 'stop');
