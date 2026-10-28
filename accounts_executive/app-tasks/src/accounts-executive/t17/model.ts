// T17 — Create a vendor's Udyam data.
// Pure data and rules for this one task; no UI. Mock data from the biscuit-plant scenario.
//
// The task in one line: a vendor's Udyam (MSME) registration is put on its record — number,
// status and category — so that MSMED due dates compute (an MSME vendor must be paid within 45
// days). It starts when a vendor gives or changes its number, or has not answered the request.

import { seedVendors } from '../../mock/seed';

export type Trigger = 'given' | 'changed' | 'unanswered';
export type Category = 'Micro' | 'Small' | 'Medium';
export type Stage = 'draft' | 'with-am' | 'reminded' | 'applied' | 'returned';
export type CheckResult = 'stop' | 'warn' | 'ok';
export type Action = '' | 'remind' | 'not-msme';

export interface Fields {
  number: string;
  category: Category | '';
  action: Action;
  reason: string;
}

export interface UdyamRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  /** The name the Udyam certificate should carry. */
  legalName: string;
  trigger: Trigger;
  summary: string;
  onRecord: { udyam: string | null; category: Category | null };
  /** What the vendor's certificate says, shown to copy from. The executive types the data in. */
  certificate: string | null;
  askedOn: string;
  reminders: number;
  creditDays: number;
  fields: Fields;
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
export const CHASE_AFTER_DAYS = 7;
export const CATEGORIES: Category[] = ['Micro', 'Small', 'Medium'];
export const UDYAM_FORMAT = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;

export const STAGE_LABEL: Record<Stage, string> = {
  draft: 'Needs me',
  'with-am': 'With Rajan',
  reminded: 'Coming up',
  applied: 'Applied',
  returned: 'Returned',
};

export const TRIGGER_LABEL: Record<Trigger, string> = { given: 'Number given', changed: 'Registration changed', unanswered: 'No answer' };

const blank: Fields = { number: '', category: '', action: '', reason: '' };

const vendor = (id: string) => seedVendors.find((v) => v.id === id)!;

export function seedRequests(): UdyamRequest[] {
  const e = vendor('V-E');
  return [
    {
      id: 'UR-H',
      vendorId: 'V-H',
      vendorName: 'Malnad Cocoa Traders (Vendor H)',
      legalName: 'Malnad Cocoa Traders',
      trigger: 'given',
      summary: 'Gave its Udyam number in reply to our request',
      onRecord: { udyam: null, category: null },
      askedOn: '2026-10-07',
      reminders: 0,
      creditDays: 45,
      certificate: 'UDYAM-KR-03-0012345 · Micro · Malnad Cocoa Traders',
      fields: { ...blank },
      stage: 'draft',
      history: [{ at: '2026-10-08 09:20', who: 'Ravi', what: 'Forwarded the vendor\'s Udyam certificate' }],
    },
    {
      id: 'UR-E',
      vendorId: 'V-E',
      vendorName: e.name,
      legalName: e.name,
      trigger: 'changed',
      summary: 'Sent a new certificate: it has grown out of Small',
      onRecord: { udyam: e.udyam, category: 'Small' },
      askedOn: '2026-10-01',
      reminders: 0,
      creditDays: e.creditDays,
      certificate: 'UDYAM-KR-03-0004455 · Medium · Vendor E',
      fields: { ...blank },
      stage: 'draft',
      history: [{ at: '2026-10-08 11:45', who: 'Ravi', what: 'Forwarded the updated certificate' }],
    },
    {
      id: 'UR-D',
      vendorId: 'V-D',
      vendorName: 'Vendor D',
      legalName: 'Vendor D',
      trigger: 'unanswered',
      summary: 'Asked on 15-Sep, still no answer',
      onRecord: { udyam: null, category: null },
      askedOn: '2026-09-15',
      reminders: 1,
      creditDays: vendor('V-D').creditDays,
      certificate: null,
      fields: { ...blank },
      stage: 'draft',
      history: [
        { at: '2026-09-15 10:00', who: 'System', what: 'Udyam request sent to the vendor' },
        { at: '2026-09-29 10:00', who: 'Teja', what: 'Reminder sent' },
      ],
    },
    {
      id: 'UR-J',
      vendorId: 'V-J',
      vendorName: 'Vendor J',
      legalName: 'Vendor J',
      trigger: 'given',
      summary: 'Udyam number recorded',
      onRecord: { udyam: 'UDYAM-KL-07-0020001', category: 'Micro' },
      askedOn: '2026-09-10',
      reminders: 0,
      creditDays: vendor('V-J').creditDays,
      certificate: null,
      fields: { ...blank, number: 'UDYAM-KL-07-0020001', category: 'Micro' },
      stage: 'applied',
      history: [
        { at: '2026-09-20 15:00', who: 'Teja', what: 'Saved and sent for checking' },
        { at: '2026-09-21 09:30', who: 'Rajan', what: 'Approved' },
      ],
    },
  ];
}

// ---------- the Udyam portal (mock) ----------

export type PortalRecord = { name: string; category: Category; status: 'Active' | 'Cancelled' };

const PORTAL: Record<string, PortalRecord> = {
  'UDYAM-KR-03-0012345': { name: 'MALNAD COCOA TRADERS', category: 'Micro', status: 'Active' },
  'UDYAM-KR-03-0004455': { name: 'VENDOR E', category: 'Medium', status: 'Active' },
  'UDYAM-KR-03-0077777': { name: 'SHREE GANESH INDUSTRIES', category: 'Micro', status: 'Active' },
  'UDYAM-KR-03-0099999': { name: 'MALNAD COCOA TRADERS', category: 'Micro', status: 'Cancelled' },
  'UDYAM-KL-07-0020001': { name: 'VENDOR J', category: 'Micro', status: 'Active' },
};

export const DEMO_NUMBERS: Record<string, { label: string; number: string; category?: Category }[]> = {
  'UR-H': [
    { label: 'Valid, name matches', number: 'UDYAM-KR-03-0012345', category: 'Micro' },
    { label: 'Registered to someone else', number: 'UDYAM-KR-03-0077777', category: 'Micro' },
    { label: 'Cancelled registration', number: 'UDYAM-KR-03-0099999', category: 'Micro' },
    { label: 'Not a valid format', number: 'UDYAM-KR-3-12345' },
    { label: 'Already on Vendor E', number: 'UDYAM-KR-03-0004455', category: 'Small' },
  ],
};

const norm = (s: string) => s.toUpperCase().replace(/\(.*?\)/g, '').replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

export const portalLookup = (number: string): PortalRecord | null => PORTAL[number.trim().toUpperCase()] ?? null;

// ---------- what it changes ----------

export const isNumberTask = (r: UdyamRequest) => r.trigger !== 'unanswered';

/** Days a bill from this vendor can run, once the category is known. */
export function dueDays(creditDays: number, msme: boolean) {
  return msme ? Math.min(creditDays, MSME_MAX_DAYS) : creditDays;
}

export const needsChecker = (r: UdyamRequest) => !(r.trigger === 'unanswered' && r.fields.action === 'remind');

export const sendLabel = (r: UdyamRequest) => (needsChecker(r) ? 'Save & send for checking' : 'Send reminder');

// ---------- the checks ----------

export function runChecks(r: UdyamRequest): Check[] {
  const f = r.fields;
  const out: Check[] = [];

  if (!isNumberTask(r)) {
    if (!f.action) return [{ id: 'action', result: 'stop', title: 'Choose what to do' }];
    if (f.action === 'remind') {
      const next = r.reminders >= 2 ? 'This is the third ask: also tell Procurement.' : undefined;
      return [{ id: 'remind', result: next ? 'warn' : 'ok', title: 'A reminder goes to the vendor; nothing changes on the record', detail: next }];
    }
    if (!f.reason.trim()) out.push({ id: 'reason', result: 'stop', title: 'Say how you know it is not an MSME', detail: 'For example: the vendor\'s signed declaration, with its date. Rajan reads this.' });
    else out.push({ id: 'reason', result: 'warn', title: 'Recorded as not an MSME: the 45-day limit will not apply', detail: 'Rajan checks your reason before it is applied.' });
    return out;
  }

  const n = f.number.trim().toUpperCase();
  if (!n) return [{ id: 'format', result: 'stop', title: 'Enter the Udyam number' }];
  if (!UDYAM_FORMAT.test(n)) return [{ id: 'format', result: 'stop', title: 'Udyam number format is not valid', detail: 'UDYAM-<state>-<2 digits>-<7 digits>, for example UDYAM-KR-03-0012345.' }];
  out.push({ id: 'format', result: 'ok', title: 'Number format is valid' });

  const other = seedVendors.find((v) => v.udyam === n && v.id !== r.vendorId);
  if (other) out.push({ id: 'dup', result: 'stop', title: `This number is already on ${other.name}`, detail: 'One Udyam number belongs to one vendor.' });

  const p = portalLookup(n);
  if (!p) out.push({ id: 'portal', result: 'stop', title: 'The Udyam portal has no registration with this number' });
  else {
    if (p.status !== 'Active') out.push({ id: 'portal', result: 'stop', title: `Registration is ${p.status.toLowerCase()} on the portal`, detail: 'A cancelled registration does not make a vendor an MSME.' });
    else out.push({ id: 'portal', result: 'ok', title: `Portal: active, registered to ${p.name}, ${p.category}` });
    if (norm(p.name) !== norm(r.legalName)) out.push({ id: 'name', result: 'stop', title: `Registered to "${p.name}", not "${r.legalName}"`, detail: 'Ask the vendor for its own certificate.' });
  }

  if (!f.category) out.push({ id: 'category', result: 'stop', title: 'Choose the category' });
  else if (p && f.category !== p.category) out.push({ id: 'category', result: 'stop', title: `The portal shows ${p.category}, you chose ${f.category}` });

  return out;
}

export const stops = (c: Check[]) => c.filter((x) => x.result === 'stop');
