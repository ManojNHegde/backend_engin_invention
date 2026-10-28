import { describe, expect, it } from 'vitest';
import { checkers, runChecks, seedRequests, stops, type VendorRequest } from './model';

const get = (id: string): VendorRequest => seedRequests().find((r) => r.id === id)!;
const withFields = (r: VendorRequest, patch: Partial<VendorRequest['fields']>): VendorRequest => ({ ...r, fields: { ...r.fields, ...patch } });
const stopIds = (r: VendorRequest) => stops(runChecks(r)).map((c) => c.id);

describe('T7 vendor finance fields', () => {
  it('a new vendor cannot be sent as it arrives', () => {
    expect(stopIds(get('VR-H'))).toEqual(expect.arrayContaining(['ledger', 'bank', 'callback']));
  });

  it('a new vendor with a matching account, ledger and call-back can be sent, and both checkers see it', () => {
    const r = withFields(get('VR-H'), { ledger: 'Sundry Creditors – Raw material', bankAccount: '50100777000111', ifsc: 'HDFC0001234', callBackBy: 'Mr Gowda', callBackOn: '2026-10-08' });
    expect(stopIds(r)).toEqual([]);
    expect(checkers(r)).toEqual(['rajan', 'usha']);
  });

  it('stops on a name mismatch, an account used by another vendor, and an account the bank cannot find', () => {
    const base = withFields(get('VR-H'), { ledger: 'Sundry Creditors – Raw material', callBackBy: 'x', callBackOn: '2026-10-08' });
    expect(runChecks(withFields(base, { bankAccount: '50100777000222', ifsc: 'HDFC0001234' })).find((c) => c.id === 'bank')?.title).toMatch(/does not match/);
    expect(runChecks(withFields(base, { bankAccount: '50100234567811', ifsc: 'ICIC0004321' })).find((c) => c.id === 'bank')?.title).toMatch(/already used by Vendor C/);
    expect(runChecks(withFields(base, { bankAccount: '50100999999999', ifsc: 'HDFC0001234' })).find((c) => c.id === 'bank')?.title).toMatch(/cannot find/);
  });

  it('an MSME vendor is stopped above 45 days and warned at or below', () => {
    const r = withFields(get('VR-H'), { ledger: 'x', bankAccount: '50100777000111', ifsc: 'HDFC0001234', callBackBy: 'x', callBackOn: '2026-10-08' });
    expect(stopIds(withFields(r, { creditDays: 60 }))).toContain('msme');
    expect(runChecks(withFields(r, { creditDays: 45 })).find((c) => c.id === 'msme')?.result).toBe('warn');
  });

  it('a terms-only change needs no bank evidence and goes to the Accounts Manager alone', () => {
    const r = get('VR-D');
    expect(stopIds(r)).toEqual([]);
    expect(checkers(r)).toEqual(['rajan']);
  });

  it('a bank change needs the call-back and goes to the Finance Controller too', () => {
    const r = withFields(get('VR-B'), { bankAccount: '50100888000333', ifsc: 'SBIN0012345' });
    expect(stopIds(r)).toEqual(['callback']);
    expect(checkers(r)).toEqual(['rajan', 'usha']);
  });
});
