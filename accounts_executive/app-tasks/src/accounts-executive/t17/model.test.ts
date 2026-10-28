import { describe, expect, it } from 'vitest';
import { dueDays, needsChecker, runChecks, seedRequests, stops, type UdyamRequest } from './model';

const get = (id: string): UdyamRequest => seedRequests().find((r) => r.id === id)!;
const withFields = (r: UdyamRequest, patch: Partial<UdyamRequest['fields']>): UdyamRequest => ({ ...r, fields: { ...r.fields, ...patch } });
const stopIds = (r: UdyamRequest) => stops(runChecks(r)).map((c) => c.id);
const typedH = () => withFields(get('UR-H'), { number: 'UDYAM-KR-03-0012345', category: 'Micro' });

describe('T17 create a vendor\'s Udyam data', () => {
  it('starts empty: the executive types the data in, nothing is pre-filled', () => {
    expect(get('UR-H').fields).toMatchObject({ number: '', category: '' });
    expect(get('UR-E').fields).toMatchObject({ number: '', category: '' });
    expect(stopIds(get('UR-H'))).toEqual(['format']);
  });

  it('a matching, active number with the portal category can be sent', () => {
    expect(stopIds(typedH())).toEqual([]);
    expect(needsChecker(typedH())).toBe(true);
  });

  it('stops on a bad format, an unknown number, a cancelled registration, another vendor\'s name and a number already used', () => {
    const h = typedH();
    expect(stopIds(withFields(h, { number: 'UDYAM-KR-3-12345' }))).toEqual(['format']);
    expect(stopIds(withFields(h, { number: 'UDYAM-KR-03-0000001' }))).toContain('portal');
    expect(stopIds(withFields(h, { number: 'UDYAM-KR-03-0099999' }))).toContain('portal');
    expect(stopIds(withFields(h, { number: 'UDYAM-KR-03-0077777' }))).toContain('name');
    expect(stopIds(withFields(h, { number: 'UDYAM-KR-03-0004455', category: 'Small' }))).toContain('dup');
  });

  it('stops when the category is missing or differs from the portal', () => {
    const h = typedH();
    expect(stopIds(withFields(h, { category: '' }))).toEqual(['category']);
    expect(stopIds(withFields(h, { category: 'Small' }))).toEqual(['category']);
  });

  it('a changed registration must follow the portal: Vendor E typed as Small is stopped until it is Medium', () => {
    const e = withFields(get('UR-E'), { number: 'UDYAM-KR-03-0004455', category: 'Small' });
    expect(stopIds(e)).toEqual(['category']);
    expect(stopIds(withFields(e, { category: 'Medium' }))).toEqual([]);
  });

  it('a vendor that has not answered: choose an action; a reminder needs no checker; "not an MSME" needs a reason and a checker', () => {
    const d = get('UR-D');
    expect(stopIds(d)).toEqual(['action']);
    const remind = withFields(d, { action: 'remind' });
    expect(stopIds(remind)).toEqual([]);
    expect(needsChecker(remind)).toBe(false);
    const not = withFields(d, { action: 'not-msme' });
    expect(stopIds(not)).toEqual(['reason']);
    expect(stopIds(withFields(not, { reason: 'Signed declaration of 06-Oct' }))).toEqual([]);
    expect(needsChecker(not)).toBe(true);
  });

  it('an MSME vendor\'s bills are capped at 45 days; others follow their credit days', () => {
    expect(dueDays(60, true)).toBe(45);
    expect(dueDays(30, true)).toBe(30);
    expect(dueDays(60, false)).toBe(60);
  });
});
