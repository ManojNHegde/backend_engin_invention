// What the request holds, what the system works out from what you typed, what is checked, and who checks what.
// Pure functions over the state: the screens only render what these return (design doc §3, §6).
// Everything is typed by the Accounts Executive from the paper form (decided 27-Oct): there is no "shown from
// another role" any more. The system only WORKS OUT values from what you typed (state from the GSTIN,
// constitution from the PAN, header from the category …), and you can edit those too.

import { inr } from '../domain/money';
import {
  ACTORS,
  categoriesFor,
  CONSTITUTIONS,
  constitutionFromPan,
  CURRENCIES,
  DELIVERY,
  HEADERS_PAYABLE,
  HEADERS_RECEIVABLE,
  MSME_CATEGORY,
  MSME_STATUS,
  OUR_STATE,
  PO_RULES,
  RESIDENT,
  SEC_43BH,
  STATE_OPTIONS,
  STATES,
  stateOfGstin,
  underFor,
  YES_NO,
} from './catalogue';
import type { Account, ActorKey, Block, FieldValue, Party, Request, Side, Suggestion, Values } from './types';

// ---------- Fields ----------

export type Section = 'party' | 'contact' | 'account' | 'counterparty' | 'terms' | 'msme' | 'bank' | 'billing';

/** Where a field sits on the screen. */
export type Group = 'party' | 'finance' | 'worked';

export interface FieldDef {
  key: string;
  label: string;
  section: Section;
  group: Group;
  kind: 'text' | 'number' | 'select' | 'switch';
  options?: Record<string, string> | ((r: Request) => Record<string, string>);
  sides: Side[];
  required?: (v: Values, r: Request) => boolean;
  visible?: (v: Values, r: Request) => boolean;
  placeholder?: string;
  hint?: string;
  unit?: string;
  upper?: boolean;
  wide?: boolean;
}

const always = () => true;
const isYes = (k: string) => (v: Values) => v[k] === 'yes';
const both: Side[] = ['payable', 'receivable'];
const mismatch = (_v: Values, r: Request) => r.pennyDrop?.result === 'name_mismatch';

export const FIELDS: FieldDef[] = [
  // Party details: copied from the paper form. Become the party master on approval.
  { key: 'legalName', label: 'Legal name', section: 'party', group: 'party', kind: 'text', sides: both, required: always, wide: true, hint: 'As on the GST certificate / PAN.' },
  { key: 'tradeName', label: 'Trade name', section: 'party', group: 'party', kind: 'text', sides: both, placeholder: 'Only if different' },
  { key: 'pan', label: 'PAN', section: 'party', group: 'party', kind: 'text', sides: both, required: (v) => v.resident !== 'non_resident', placeholder: 'AAAAA0000A', upper: true },
  { key: 'gstin', label: 'GSTIN', section: 'party', group: 'party', kind: 'text', sides: both, placeholder: '29AAAAA0000A1Z5', upper: true, hint: 'Leave blank if the party is not GST-registered.' },
  { key: 'addressLine', label: 'Address', section: 'contact', group: 'party', kind: 'text', sides: both, required: always, wide: true },
  { key: 'city', label: 'City', section: 'contact', group: 'party', kind: 'text', sides: both, required: always },
  { key: 'pincode', label: 'PIN code', section: 'contact', group: 'party', kind: 'text', sides: both, required: (v) => v.resident !== 'non_resident', placeholder: '560001' },
  { key: 'contactPerson', label: 'Contact person', section: 'contact', group: 'party', kind: 'text', sides: both },
  { key: 'phone', label: 'Phone', section: 'contact', group: 'party', kind: 'text', sides: both, required: always, placeholder: '+91 …' },
  { key: 'email', label: 'Email', section: 'contact', group: 'party', kind: 'text', sides: both, required: (_v, r) => r.side === 'receivable', placeholder: 'accounts@…' },

  // Finance details: also from the paper form (and its attachments), typed by you.
  { key: 'category', label: 'Category', section: 'counterparty', group: 'finance', kind: 'select', options: (r) => categoriesFor(r.side), sides: both, required: always, wide: true },
  { key: 'relatedParty', label: 'Related party?', section: 'counterparty', group: 'finance', kind: 'select', options: YES_NO, sides: both, required: always, hint: 'Ind AS 24. Blank means "nobody has said".' },
  { key: 'creditDays', label: 'Credit days', section: 'terms', group: 'finance', kind: 'number', sides: both, required: always, unit: 'days' },
  { key: 'creditLimit', label: 'Credit limit', section: 'terms', group: 'finance', kind: 'number', sides: ['receivable'], required: always, unit: '₹', hint: 'As written on the form. Farid (Credit Controller) checks it.' },
  { key: 'msmeStatus', label: 'MSME?', section: 'msme', group: 'finance', kind: 'select', options: MSME_STATUS, sides: ['payable'], required: always },
  { key: 'msmeCategory', label: 'MSME category', section: 'msme', group: 'finance', kind: 'select', options: MSME_CATEGORY, sides: ['payable'], visible: isYes('msmeStatus'), required: isYes('msmeStatus') },
  { key: 'udyam', label: 'Udyam number', section: 'msme', group: 'finance', kind: 'text', sides: ['payable'], visible: isYes('msmeStatus'), placeholder: 'UDYAM-KA-00-0000000', upper: true, hint: 'No certificate yet? Leave blank: a reminder goes to the vendor.' },
  { key: 'bankAccountNo', label: 'Bank account number', section: 'bank', group: 'finance', kind: 'text', sides: ['payable'], required: always, hint: 'From the cancelled cheque.' },
  { key: 'ifsc', label: 'IFSC', section: 'bank', group: 'finance', kind: 'text', sides: ['payable'], required: always, placeholder: 'ABCD0123456', upper: true },
  { key: 'beneficiary', label: 'Beneficiary name', section: 'bank', group: 'finance', kind: 'text', sides: ['payable'], required: always },
  {
    key: 'callBackNumber',
    label: 'Call-back: number you called',
    section: 'bank',
    group: 'finance',
    kind: 'select',
    options: (r) => ({ ...(isEmpty(r.values.phone) ? {} : { [String(r.values.phone)]: `${r.values.phone} · on the paper form` }), email: '+91 90000 11111 · given in an email with the bank details' }),
    sides: ['payable'],
    visible: mismatch,
    required: mismatch,
    hint: 'Needed because the name at the bank does not match.',
  },
  { key: 'callBackPerson', label: 'Call-back: who confirmed', section: 'bank', group: 'finance', kind: 'text', sides: ['payable'], visible: mismatch, required: mismatch },
  { key: 'poRule', label: 'PO reference', section: 'billing', group: 'finance', kind: 'select', options: PO_RULES, sides: ['receivable'], required: always },
  { key: 'delivery', label: 'Send invoices by', section: 'billing', group: 'finance', kind: 'select', options: DELIVERY, sides: ['receivable'], required: always },
  { key: 'invoiceFormat', label: 'Invoice format note', section: 'billing', group: 'finance', kind: 'text', sides: ['receivable'], placeholder: 'Optional' },

  // Worked out by the system from what you typed. You can still edit them.
  { key: 'state', label: 'State', section: 'contact', group: 'worked', kind: 'select', options: STATE_OPTIONS, sides: both, required: (v) => v.resident !== 'non_resident' },
  { key: 'accountName', label: 'Account name (as it shows in the books)', section: 'account', group: 'worked', kind: 'text', sides: both, required: always },
  {
    key: 'under',
    label: 'Under (header)',
    section: 'account',
    group: 'worked',
    kind: 'select',
    options: (r) => Object.fromEntries((r.side === 'payable' ? HEADERS_PAYABLE : HEADERS_RECEIVABLE).map((h) => [h, h])),
    sides: both,
    required: always,
  },
  { key: 'constitution', label: 'Constitution', section: 'counterparty', group: 'worked', kind: 'select', options: CONSTITUTIONS, sides: both, required: always },
  { key: 'resident', label: 'Resident status', section: 'counterparty', group: 'worked', kind: 'select', options: RESIDENT, sides: both, required: always },
  { key: 'currency', label: 'Currency', section: 'terms', group: 'worked', kind: 'select', options: CURRENCIES, sides: both, required: always },
  { key: 'billByBill', label: 'Track bill by bill', section: 'terms', group: 'worked', kind: 'switch', sides: both },
  { key: 'sec43bh', label: '43B(h) 45-day clock applies?', section: 'msme', group: 'worked', kind: 'select', options: YES_NO, sides: ['payable'], required: always },
];

/** Party details: locked when you use a party that is already in the master (they come from there). */
export const PARTY_KEYS = FIELDS.filter((f) => f.group === 'party').map((f) => f.key).concat('state');

export const fieldsFor = (r: Request) => FIELDS.filter((f) => f.sides.includes(r.side) && (!f.visible || f.visible(r.values, r)));
export const fieldsIn = (r: Request, g: Group) => fieldsFor(r).filter((f) => f.group === g);

export const optionsOf = (f: FieldDef, r: Request) => (typeof f.options === 'function' ? f.options(r) : f.options ?? {});

export const isEmpty = (v: FieldValue | undefined) => v === null || v === undefined || v === '';
const str = (v: FieldValue | undefined) => (isEmpty(v) ? '' : String(v).trim());

export const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const UDYAM = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// ---------- Worked out by the system ----------

/** What each worked-out field is worked out from: while those are all empty, it waits for them. */
export const WORKED_FROM: Record<string, { keys: string[]; words: string }> = {
  state: { keys: ['gstin'], words: 'the GSTIN' },
  accountName: { keys: ['legalName'], words: 'the legal name' },
  under: { keys: ['category'], words: 'the category' },
  constitution: { keys: ['pan'], words: 'the PAN' },
  resident: { keys: ['pan', 'gstin'], words: 'the PAN or GSTIN' },
  currency: { keys: [], words: '' },
  billByBill: { keys: [], words: '' },
  sec43bh: { keys: ['category'], words: 'the category' },
};

/** Values the system works out from what you typed. They follow their source until you change them yourself. */
export function suggestionsOf(r: Request, accounts: Account[] = []): Record<string, Suggestion> {
  const v = r.values;
  const s: Record<string, Suggestion> = {};
  const gstin = str(v.gstin);
  const pan = str(v.pan);
  const name = str(v.legalName);

  const st = GSTIN_RE.test(gstin) ? stateOfGstin(gstin) : null;
  if (st) s.state = { value: st, why: `GSTIN starts with ${gstin.slice(0, 2)}: ${STATES[st].name}` };

  if (name) {
    const other = r.partyId ? accounts.find((a) => a.partyId === r.partyId && a.side !== r.side) : undefined;
    const base = str(v.tradeName) || name;
    s.accountName = other
      ? { value: `${base} (${r.side === 'payable' ? 'vendor' : 'customer'})`, why: `"${other.name}" is already its ${other.side === 'payable' ? 'vendor' : 'customer'} account` }
      : { value: base, why: str(v.tradeName) ? 'The trade name you typed' : 'The legal name you typed' };
  }

  const c = constitutionFromPan(pan);
  if (c) s.constitution = c;
  if (PAN_RE.test(pan) || GSTIN_RE.test(gstin)) s.resident = { value: 'resident', why: 'Has an Indian PAN / GSTIN' };
  s.currency = { value: 'INR', why: 'Indian party: blank would also mean INR' };
  s.billByBill = { value: true, why: 'Trade party: bills are settled one by one' };

  const cat = str(v.category);
  if (cat) s.under = { value: underFor(r.side, cat), why: `From the category: ${categoriesFor(r.side)[cat]}` };
  if (r.side === 'payable' && cat) {
    const rel = SEC_43BH[cat];
    const msme = v.msmeStatus;
    let value: FieldValue = '';
    if (rel?.outcome === 'applies') value = 'yes';
    else if (rel?.outcome === 'not_applicable') value = 'no';
    else if (rel?.outcome === 'if_msme') value = msme === 'yes' ? 'yes' : msme === 'no' ? 'no' : '';
    s.sec43bh = { value, why: `CA's table for this category: ${rel?.words ?? '—'}${rel?.outcome === 'if_msme' ? ` MSME = ${msme || 'not answered'}.` : ''}` };
  }
  return s;
}

/**
 * After a change, worked-out fields that still hold their old suggestion (or nothing) take the new one.
 * A value you changed yourself is never overwritten.
 */
export function follow(r: Request, before: Record<string, Suggestion>, accounts: Account[] = []) {
  const after = suggestionsOf(r, accounts);
  for (const k of Object.keys(WORKED_FROM)) {
    const a = after[k];
    if (!a) continue;
    const cur = r.values[k];
    const b = before[k]?.value;
    if ((isEmpty(cur) || cur === b) && a.value !== cur) r.values[k] = a.value;
  }
}

export type Origin = 'worked' | 'changed' | 'waits' | 'typed' | 'empty';

export function originOf(f: FieldDef, r: Request, accounts: Account[] = []): Origin {
  const v = r.values[f.key];
  if (f.group === 'worked') {
    const sug = suggestionsOf(r, accounts)[f.key];
    if (sug && !isEmpty(sug.value)) return v === sug.value ? 'worked' : 'changed';
    const src = WORKED_FROM[f.key]?.keys ?? [];
    if (isEmpty(v)) return src.length && src.every((k) => isEmpty(r.values[k])) ? 'waits' : 'empty';
    return 'typed';
  }
  return isEmpty(v) && f.kind !== 'switch' ? 'empty' : 'typed';
}

/** A required field that is still empty (a worked-out field waiting for its source does not count yet). */
export const isMissing = (f: FieldDef, r: Request) => !!f.required?.(r.values, r) && isEmpty(r.values[f.key]) && f.kind !== 'switch';

// ---------- Tax tagging (Compliance Officer's, after you submit) ----------

const TDS_BY_CATEGORY: Record<string, string> = {
  goods_msme: '194Q, once purchases from this vendor cross ₹50 lakh in the year',
  goods_non_msme: '194Q, once purchases from this vendor cross ₹50 lakh in the year',
  contractors: '194C (1% individual / HUF, 2% others)',
  manpower_security: '194C (1% individual / HUF, 2% others)',
  freight_gta: '194C; GST under reverse charge unless the GTA charges forward',
  consultants: '194J',
  commission_brokerage: '194H',
  rent_immovable: '194-I',
};

export function taxTagging(r: Request): string[] {
  const st = str(r.values.state);
  const supply = isEmpty(r.values.gstin) ? 'unregistered: check RCM' : st ? (st === OUR_STATE ? 'intra-state (CGST + SGST)' : 'inter-state (IGST)') : 'state not known yet';
  const cat = str(r.values.category);
  if (r.side === 'payable') {
    return [`TDS: ${TDS_BY_CATEGORY[cat] ?? (cat ? 'none expected for this category' : 'pick a category first')}`, `GST: regular, forward charge, ${supply}`, 'ITC: eligible (not blocked under 17(5))'];
  }
  return [`GST: regular B2B, ${supply}`, 'TCS: none', 'E-invoice: yes (our turnover is above the limit)'];
}

// ---------- Checks (design doc §6) ----------

export interface CheckResult {
  level: 'stop' | 'warn' | 'ok';
  title: string;
  detail?: string;
  /** The form itself cannot be set up (party already set up, GSTIN cancelled …): return it to whoever handed it over. */
  sendBack?: boolean;
  /** The party is already in the master: use it instead of creating it again. */
  usePartyId?: string;
}

export interface CheckCtx {
  parties: Party[];
  accounts: Account[];
}

const SIDE_WORD = (side: Side) => (side === 'payable' ? 'vendor' : 'customer');

export function checksOf(r: Request, ctx: CheckCtx): CheckResult[] {
  const v = r.values;
  const out: CheckResult[] = [];
  const pan = str(v.pan);
  const gstin = str(v.gstin);
  const linked = r.partyId ? ctx.parties.find((p) => p.partyId === r.partyId) ?? null : null;

  // What you typed from the paper: formats and consistency.
  if (pan && !PAN_RE.test(pan)) out.push({ level: 'stop', title: 'PAN is not valid', detail: '5 letters, 4 digits, 1 letter (AAAAA0000A).' });
  if (gstin && !GSTIN_RE.test(gstin)) out.push({ level: 'stop', title: 'GSTIN is not valid', detail: '15 characters: state code, PAN, entity number, Z, check character.' });
  else if (gstin && PAN_RE.test(pan) && gstin.slice(2, 12) !== pan) out.push({ level: 'stop', title: 'GSTIN does not belong to this PAN', detail: `Characters 3–12 of the GSTIN are ${gstin.slice(2, 12)}; the PAN is ${pan}. One of them is copied wrong.` });
  if (gstin && GSTIN_RE.test(gstin) && !isEmpty(v.state) && stateOfGstin(gstin) && stateOfGstin(gstin) !== v.state) out.push({ level: 'stop', title: 'State does not match the GSTIN', detail: `The GSTIN is a ${STATES[stateOfGstin(gstin)!].name} registration.` });
  if (!isEmpty(v.pincode) && !/^\d{6}$/.test(str(v.pincode))) out.push({ level: 'stop', title: 'PIN code must be 6 digits' });
  if (!gstin && PAN_RE.test(pan)) out.push({ level: 'warn', title: 'No GSTIN: an unregistered party', detail: r.side === 'payable' ? 'Its bills come under reverse charge where that applies, with no ITC.' : 'Invoices go out as to an unregistered person.' });

  // GST portal: the GSTIN you typed must be checked, like a bank account.
  if (GSTIN_RE.test(gstin)) {
    const g = r.gstCheck;
    if (!g) out.push({ level: 'stop', title: 'Check the GSTIN on the GST portal', detail: 'Confirms it is real, active, and in this name.' });
    else if (g.forValue !== gstin) out.push({ level: 'stop', title: 'GSTIN changed after the portal check: check it again' });
    else {
      if (g.status === 'cancelled') out.push({ level: 'stop', sendBack: true, title: `GSTIN ${gstin} is cancelled on the GST portal`, detail: 'We cannot invoice or take ITC on a cancelled GSTIN.' });
      else if (g.status === 'suspended') out.push({ level: 'warn', title: `GSTIN ${gstin} is suspended`, detail: 'Hold ITC on its bills until it is active again.' });
      else out.push({ level: 'ok', title: `GSTIN active on the GST portal`, detail: g.nameAtGst });
      const words = new Set(str(v.legalName).toUpperCase().split(/\s+/).filter(Boolean));
      const hit = g.nameAtGst.split(/\s+/).filter((w) => words.has(w)).length;
      if (words.size && hit / Math.max(g.nameAtGst.split(/\s+/).length, 1) < 0.8) out.push({ level: 'warn', title: `Name on the GST portal is "${g.nameAtGst}"`, detail: 'Different from the legal name you typed. Use the name on the portal unless the form says otherwise.' });
    }
  }

  // Already in the party master? Search by GSTIN, then PAN.
  if (linked) {
    const same = ctx.accounts.find((a) => a.partyId === linked.partyId && a.side === r.side && a.requestId !== r.id);
    if (same) out.push({ level: 'stop', sendBack: true, title: `Already set up: ${linked.legalName} is our ${SIDE_WORD(r.side)}`, detail: `Account ${same.name} (${same.accountId}). Nothing new to create.` });
    out.push({ level: 'ok', title: `Uses party ${linked.partyId} from the master`, detail: 'Party details come from the master; no new party is created.' });
    const other = ctx.accounts.find((a) => a.partyId === linked.partyId && a.side !== r.side);
    if (other) out.push({ level: 'ok', title: `Also our ${SIDE_WORD(other.side)}`, detail: `${other.name} (${other.accountId}). A second account on the other side.` });
  } else {
    const byGst = gstin ? ctx.parties.find((p) => p.gstins.some((g) => g.value === gstin)) : undefined;
    if (byGst) {
      const acct = ctx.accounts.find((a) => a.partyId === byGst.partyId && a.side === r.side);
      if (acct) out.push({ level: 'stop', sendBack: true, title: `Already set up: GSTIN ${gstin} is ${byGst.legalName} (${byGst.partyId})`, detail: `It is our ${SIDE_WORD(r.side)} already: ${acct.name} (${acct.accountId}). Nothing new to create.` });
      else out.push({ level: 'stop', usePartyId: byGst.partyId, title: `GSTIN ${gstin} is already in the party master: ${byGst.partyId} ${byGst.legalName}`, detail: 'Use that party instead of creating it a second time.' });
    }
    if (pan && !byGst) {
      for (const p of ctx.parties.filter((x) => x.pan === pan)) out.push({ level: 'warn', usePartyId: p.partyId, title: `Same PAN as ${p.partyId} "${p.legalName}"`, detail: 'Can be right (one company, another state). If it is the same party, use it.' });
    }
  }

  const name = str(v.accountName).toLowerCase();
  const clash = name && ctx.accounts.find((a) => a.name.toLowerCase() === name && a.requestId !== r.id);
  if (clash) out.push({ level: 'stop', title: `Account name "${v.accountName}" already exists (${clash.accountId})`, detail: 'Account names are unique in the books. Change the name, e.g. add the city.' });

  const missing = fieldsFor(r).filter((f) => isMissing(f, r) && !(f.group === 'worked' && originOf(f, r, ctx.accounts) === 'waits'));
  if (missing.length) out.push({ level: 'stop', title: `Still to fill: ${missing.map((f) => f.label.replace(/\?$/, '').replace(/ \(.*\)$/, '')).join(' · ')}` });

  if (r.side === 'payable') {
    if (v.category === 'goods_non_msme' && v.msmeStatus === 'yes') out.push({ level: 'stop', title: 'Category says Non-MSME, but MSME = Yes', detail: 'Pick "Creditors for Goods – MSME".' });
    if (v.category === 'goods_msme' && v.msmeStatus === 'no') out.push({ level: 'stop', title: 'Category says MSME, but MSME = No' });
    if (v.msmeStatus === 'unknown') out.push({ level: 'warn', title: 'MSME not known yet', detail: 'A reminder goes to the vendor when you submit. Until answered, the 45-day clock may apply.' });
    if (v.msmeStatus === 'yes' && isEmpty(v.udyam)) out.push({ level: 'warn', title: 'Udyam number not received yet', detail: 'A reminder goes to the vendor. The MSME register shows it as pending.' });
    if (!isEmpty(v.udyam) && !UDYAM.test(str(v.udyam))) out.push({ level: 'stop', title: 'Udyam number is not in the UDYAM-XX-00-0000000 format' });
    if (v.sec43bh === 'yes' && Number(v.creditDays) > 45) out.push({ level: 'stop', title: `${v.creditDays} credit days for an MSME vendor`, detail: 'MSMED Act / 43B(h): at most 45 days, or the expense is disallowed.' });

    const acct = str(v.bankAccountNo);
    if (acct) {
      const used = ctx.accounts.find((a) => a.bankAccountNo === acct && a.partyId !== r.partyId);
      if (used) out.push({ level: 'stop', sendBack: true, title: `Bank account already used by ${used.name}`, detail: 'Two parties with one bank account is the first sign of a diverted payment.' });
    }
    if (!isEmpty(v.ifsc) && !IFSC.test(str(v.ifsc))) out.push({ level: 'stop', title: 'IFSC is not valid', detail: '4 letters, a 0, then 6 letters or digits.' });
    const key = `${acct}|${v.ifsc ?? ''}`;
    if (acct && IFSC.test(str(v.ifsc))) {
      if (!r.pennyDrop) out.push({ level: 'stop', title: 'Run the penny-drop', detail: 'The Finance Controller approves bank details only after verification.' });
      else if (r.pennyDrop.forKey !== key) out.push({ level: 'stop', title: 'Bank details changed after the penny-drop: run it again' });
      else if (r.pennyDrop.result === 'pass') out.push({ level: 'ok', title: `Penny-drop passed: ${r.pennyDrop.nameAtBank} (${r.pennyDrop.matchPct}% name match)` });
      else {
        out.push({ level: 'warn', title: `Penny-drop name mismatch: bank says ${r.pennyDrop.nameAtBank} (${r.pennyDrop.matchPct}%)`, detail: 'A call-back on the number from the paper form is required.' });
        if (v.callBackNumber === 'email') out.push({ level: 'stop', title: 'Call-back number came from an email with the bank details', detail: 'Call the number on the paper form, not one the email gave you.' });
      }
    }
  }

  if (r.side === 'receivable' && v.currency !== 'INR' && str(v.category).startsWith('domestic')) out.push({ level: 'warn', title: 'Domestic customer billed in a foreign currency?' });
  return out;
}

export const stops = (c: CheckResult[]) => c.filter((x) => x.level === 'stop');

// ---------- Who checks what (party_account_change) ----------

export interface Route {
  block: Block;
  label: string;
  checker: ActorKey;
  keys: string[];
}

export function routesFor(side: Side): Route[] {
  const party = ['legalName', 'tradeName', 'pan', 'gstin', 'addressLine', 'city', 'state', 'pincode', 'contactPerson', 'phone', 'email'];
  const base = [...party, 'accountName', 'under', 'category', 'constitution', 'resident', 'relatedParty', 'creditDays', 'billByBill', 'currency'];
  if (side === 'payable') {
    return [
      { block: 'party', label: 'Party details, account, terms, MSME', checker: 'rajan', keys: [...base, 'msmeStatus', 'msmeCategory', 'udyam', 'sec43bh'] },
      { block: 'bank', label: 'Bank details', checker: 'usha', keys: ['bankAccountNo', 'ifsc', 'beneficiary', 'callBackNumber', 'callBackPerson'] },
      { block: 'tax', label: 'GST / TDS tagging', checker: 'venkat', keys: [] },
    ];
  }
  return [
    { block: 'party', label: 'Party details, account, terms, billing', checker: 'rajan', keys: [...base, 'poRule', 'delivery', 'invoiceFormat'] },
    { block: 'credit_limit', label: 'Credit limit', checker: 'farid', keys: ['creditLimit'] },
    { block: 'tax', label: 'GST / TCS tagging', checker: 'venkat', keys: [] },
  ];
}

export const checkerLine = (side: Side) => routesFor(side).map((r) => `${ACTORS[r.checker].name} (${r.label.toLowerCase()})`).join(' · ');

/** Human value of a field for read-only display. */
export function display(f: FieldDef, r: Request): string {
  const v = r.values[f.key];
  if (f.kind === 'switch') return v ? 'Yes' : 'No';
  if (isEmpty(v)) return '—';
  if (f.key === 'creditLimit') return inr(Number(v));
  if (f.key === 'bankAccountNo') return mask(String(v));
  const opts = optionsOf(f, r);
  return opts[String(v)] ?? `${v}${f.unit && f.unit !== '₹' ? ` ${f.unit}` : ''}`;
}

export const mask = (acct: string) => (acct.length > 4 ? `•••• ${acct.slice(-4)}` : acct);

/** The party-detail values of a party already in the master (used when you link to it). */
export function partyValues(p: Party): Values {
  return {
    legalName: p.legalName,
    tradeName: p.tradeName ?? '',
    pan: p.pan ?? '',
    gstin: p.gstins[0]?.value ?? '',
    addressLine: p.address.line,
    city: p.address.city,
    state: p.address.stateCode,
    pincode: p.address.pincode,
    contactPerson: p.contactPerson ?? '',
    phone: p.phones[0] ?? '',
    email: p.email ?? '',
  };
}
