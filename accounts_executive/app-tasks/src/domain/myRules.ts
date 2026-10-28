// My rules: standing rules the Accounts Executive sets for her own work (the cards' "Rules allowed" rows).
// Principle (same as every role): a rule can make the work quieter or stricter; it can never skip a check,
// skip the checker or loosen a control. Who sets it: ✅ myself · 🟠 Accounts Manager · ❌ never.

import type { CompanyRules, MyRule, MyRuleKind, TaskId } from './types';
import type { NavTarget } from '../store/navigation';

export interface RuleDraft {
  kind: MyRuleKind;
  value: string | number;
  vendorId?: string;
  task?: TaskId;
  days: number;
  reason: string;
}

export type RuleLevel = 'self' | 'am' | 'never';

export interface RuleType {
  kind: MyRuleKind;
  title: string;
  what: string;
  task: TaskId | 'Any';
  /** The levels, one line each, for the catalog. */
  limits: (r: CompanyRules) => string[];
  check: (d: RuleDraft, r: CompanyRules) => { level: RuleLevel; why: string };
  defaultValue: (r: CompanyRules) => string | number;
  valueLabel: string;
}

export const RULE_TYPES: RuleType[] = [
  {
    kind: 'ocrStricter',
    title: 'Flag OCR fields at a stricter level',
    what: 'Scanned fields below my level must be confirmed before a voucher is posted.',
    task: 'T1',
    limits: (r) => [`Above the company's ${r.ocrFlagPct}%: set it myself`, `At or below ${r.ocrFlagPct}%: not allowed (it would loosen the check)`],
    check: (d, r) => (Number(d.value) > r.ocrFlagPct ? { level: 'self', why: 'Stricter than the company level' } : { level: 'never', why: `Not above the company's ${r.ocrFlagPct}%: it would loosen the OCR check` }),
    defaultValue: () => 90,
    valueLabel: 'Flag below (%)',
  },
  {
    kind: 'tdsAlert',
    title: 'Alert me earlier on the TDS threshold',
    what: "Warn on a voucher when the vendor's purchases this year reach my % of the ₹50 lakh threshold.",
    task: 'T1',
    limits: () => ['Any level below 100%: set it myself'],
    check: (d) => (Number(d.value) > 0 && Number(d.value) < 100 ? { level: 'self', why: 'An earlier warning only' } : { level: 'never', why: 'Give a % between 1 and 99' }),
    defaultValue: () => 80,
    valueLabel: 'Alert at (% of threshold)',
  },
  {
    kind: 'msmeWarn',
    title: 'Warn me before an MSME due date',
    what: 'Show MSME vendor dues in Coming up this many days before the due date.',
    task: 'T1',
    limits: () => ['Any number of days: set it myself'],
    check: () => ({ level: 'self', why: 'An earlier warning only' }),
    defaultValue: () => 7,
    valueLabel: 'Days before',
  },
  {
    kind: 'remind',
    title: 'Remind me',
    what: 'A reminder on a date, for any task (month-end, a pending confirmation, a vendor to chase).',
    task: 'Any',
    limits: () => ['Set it myself'],
    check: () => ({ level: 'self', why: 'A reminder changes nothing' }),
    defaultValue: () => 'Month-end close: reconciliations and runs',
    valueLabel: 'Reminder text',
  },
  {
    kind: 'defaultBasis',
    title: 'Default apportionment basis',
    what: 'Landed cost (T3) opens with this basis; I can still change it on each charge.',
    task: 'T3',
    limits: () => ['Set it myself'],
    check: () => ({ level: 'self', why: 'A default only' }),
    defaultValue: () => 'Quantity',
    valueLabel: 'Basis',
  },
  {
    kind: 'quietDuplicate',
    title: 'Quiet the same-amount warning for a vendor',
    what: 'A vendor that bills the same amount every month (rent, AMC) stops raising the "same amount" warning. Same invoice number is always stopped.',
    task: 'T1',
    limits: (r) => [`Up to ${r.ruleMaxDays} days: Accounts Manager approves`, `Longer: not allowed`],
    check: (d, r) => (d.days <= r.ruleMaxDays ? { level: 'am', why: 'It loosens a warning: the Accounts Manager approves' } : { level: 'never', why: `Longer than ${r.ruleMaxDays} days` }),
    defaultValue: () => 30,
    valueLabel: 'Days',
  },
];

export const ruleType = (k: MyRuleKind) => RULE_TYPES.find((t) => t.kind === k)!;

/** Rules this role may never set, each with what to do instead. */
export const NOT_ALLOWED: { id: string; title: string; why: string; instead: { label: string; target?: NavTarget } }[] = [
  { id: 'autopost', title: 'Post small vouchers with no checker', why: 'Skips the Accounts Manager: every voucher with a PO is checked.', instead: { label: 'Open T1 and post with a note', target: { tab: 'tasks', screen: 'T1', id: null } } },
  { id: 'variance', title: 'Post a voucher before its match variance is approved', why: 'The Procurement Officer raises the variance and the Accounts Manager approves it before posting (shared work list §12.1).', instead: { label: 'Open T1: it waits in "With others" until Rajan approves', target: { tab: 'tasks', screen: 'T1', id: null } } },
  { id: 'bank', title: 'Change vendor bank details without the Finance Controller', why: 'Bank changes are the Finance Controller\'s check, not the Accounts Manager\'s.', instead: { label: 'Send the change through T7', target: { tab: 'tasks', screen: 'T7', id: null } } },
  { id: 'own', title: 'Approve my own voucher or note', why: 'The maker never checks her own work (C-07).', instead: { label: 'Send it to the Accounts Manager' } },
  { id: 'limit', title: 'Change a credit limit nobody recommended', why: 'The Credit Controller reviews limits; the Accounts Manager confirms.', instead: { label: 'Wait for a recommendation (T12)', target: { tab: 'tasks', screen: 'T12', id: null } } },
  { id: 'tax', title: 'Override the derived tax myself', why: 'Only the Compliance Officer grants a tax or TDS override.', instead: { label: 'Request it in T6', target: { tab: 'tasks', screen: 'T6', id: null } } },
];

export function ruleSummary(r: Pick<MyRule, 'kind' | 'value' | 'vendorId'>, vendorName?: string): string {
  switch (r.kind) {
    case 'ocrStricter':
      return `Flag OCR fields below ${r.value}%`;
    case 'tdsAlert':
      return `Alert at ${r.value}% of the TDS threshold`;
    case 'msmeWarn':
      return `Warn ${r.value} days before MSME due dates`;
    case 'remind':
      return `Remind me: ${r.value}`;
    case 'defaultBasis':
      return `Landed cost by ${String(r.value).toLowerCase()}`;
    case 'quietDuplicate':
      return `Quiet the same-amount warning for ${vendorName ?? r.vendorId}`;
  }
}
