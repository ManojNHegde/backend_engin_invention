// Domain types for the Accounts Executive position app.
// Pure data shapes only — no UI or state concerns.

export type ISODate = string; // 'YYYY-MM-DD'
export type ISODateTime = string; // 'YYYY-MM-DDTHH:mm'
export type Tone = 'normal' | 'success' | 'warning' | 'critical' | 'info';

/** The 4 areas of the role (reference roles §11.1–11.4). */
export type AreaId = 'purchase' | 'inventory' | 'sales' | 'arap';

export type TaskId =
  | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9'
  | 'T10' | 'T11' | 'T12' | 'T13' | 'T14' | 'T15' | 'T16' | 'T17' | 'T18'
  | 'T19' | 'T20' | 'T21' | 'T22' | 'T23';

/** People in the scenario, by key (see store/actors.ts). */
export type ActorKey =
  | 'teja' | 'rajan' | 'usha' | 'venkat' | 'sunil' | 'ravi' | 'suresh' | 'kiran'
  | 'farid' | 'arun' | 'pooja' | 'hema' | 'anand' | 'system' | 'calendar' | 'vendor';

// ---------- masters ----------

export interface Vendor {
  id: string;
  name: string;
  state: string;
  gstin: string | null; // null = unregistered
  pan: string;
  creditDays: number;
  ledger: string;
  bankAccount: string | null;
  ifsc: string | null;
  msme: 'micro' | 'small' | 'medium' | null;
  udyam: string | null;
  /** Purchases so far in the financial year (for the TDS purchase-of-goods threshold). */
  fyPurchases: number;
  approved: boolean;
  supplies: string;
}

export interface Customer {
  id: string;
  name: string;
  state: string;
  creditLimit: number | null; // null = advance only
  creditDays: number;
  ledger: string;
  billingInstructions: string;
}

export interface Item {
  code: string;
  name: string;
  uom: string;
  hsn: string;
  gstRate: number;
  costing: 'Moving average' | 'FIFO' | 'Standard';
  group: string;
  stockLedger: string;
}

// ---------- work items: one per piece of work a task acts on ----------

export type ItemStatus =
  | 'Open' // arrived, my move
  | 'Sent' // with a checker
  | 'Returned' // checker sent it back: my move again
  | 'Approved' // every checker agreed
  | 'Done' // finished with no checker (e.g. a no-PO voucher, a reminder sent)
  | 'Discarded'; // e.g. a duplicate invoice

export type FieldValue = string | number;

export interface WorkItem {
  id: string;
  task: TaskId;
  /** Which form the item uses (see domain/tasks.ts). */
  kind: string;
  title: string;
  partyId: string | null;
  partyName: string;
  /** PO, GRN, WO, SO … the document it refers to. */
  ref: string;
  amount: number | null;
  arrivedAt: ISODateTime;
  from: ActorKey;
  /** The document as it arrived (read-only facts). */
  data: Record<string, unknown>;
  /** The form: pre-filled values plus what Teja entered. `why:<check>` holds a reason; `ok:<field>` confirms a flagged field. */
  values: Record<string, FieldValue>;
  status: ItemStatus;
  /** Checkers in order, decided when sent. */
  chain: ActorKey[];
  /** Index in `chain` of the checker who has it now. */
  step: number;
  /** Told, not asked to act. */
  cc: ActorKey[];
  sentAt?: ISODateTime;
  closedAt?: ISODateTime;
  /** Last word from a checker (a return reason, an approval note). */
  checkerNote?: string;
  history: { at: ISODateTime; by: ActorKey; action: string; note?: string }[];
  /** For "Coming up": when it falls due. */
  dueOn?: ISODate;
  /** Open, but someone else must act first (e.g. the Accounts Manager approving a match variance). */
  waitingOn?: ActorKey;
  waitingFor?: string;
}

/** A three-way-match variance on a voucher or service bill. Raised by Procurement (goods) or
 *  Contracts & Services (services), approved by the Accounts Manager before the voucher is posted. */
export interface Variance {
  raisedBy: ActorKey;
  reason: string;
  raisedAt: ISODateTime;
  approvedBy?: ActorKey;
  approvedAt?: ISODateTime;
  /** The Accounts Manager's decision, e.g. "Post the confirmed ₹2,40,000". */
  decision?: string;
}

export type CheckResult = 'stop' | 'reason' | 'warn' | 'ok';

export interface Check {
  id: string;
  result: CheckResult;
  title: string;
  detail?: string;
  /** Who reads the reason (every reason needs a named reader). */
  reader?: ActorKey;
  /** For a reason: the form value that answers it (default `why:<id>`). */
  field?: string;
}

export interface Fact {
  label: string;
  value: string;
  /** formula · ready calculation · from <role> */
  source?: string;
  tone?: Tone;
  strong?: boolean;
}

export interface FactSection {
  title: string;
  aside?: string;
  rows: Fact[];
}

export type FieldInput = 'text' | 'textarea' | 'money' | 'number' | 'select' | 'date';

export interface FieldDef {
  key: string;
  label: string;
  input: FieldInput;
  options?: string[];
  required?: boolean;
  hint?: string;
  /** OCR confidence (%) when the value was read from a scan. */
  confidence?: number;
  readOnly?: boolean;
}

/** One line of a batch (a reconciliation break, a 26AS line, a provision line). */
export interface BatchLine {
  id: string;
  label: string;
  detail: string;
  amount: number;
  /** Already settled by the run (auto-matched): no decision needed. */
  auto?: boolean;
  /** Choices for this line; the first is the default. */
  options: string[];
  /** Choices that need a reason. */
  needsReason: string[];
}

export interface LogEntry {
  id: string;
  at: ISODateTime;
  entity: string;
  action: string;
  actor: ActorKey;
  outcome: 'OK' | 'Refused';
  detail?: string;
  task?: TaskId | 'Rules';
  /** Messages: who it went to and who was told. Present only when the entry is a message. */
  to?: ActorKey[];
  cc?: ActorKey[];
  itemId?: string;
}

export interface CompanyRules {
  matchQtyTolPct: number;
  matchRateTolPct: number;
  ocrFlagPct: number;
  tdsThreshold: number;
  tdsRatePct: number;
  msmeMaxDays: number;
  overrideFcThreshold: number;
  nettingFcThreshold: number;
  inventoryMethod: 'Perpetual' | 'Periodic';
  /** Rules that loosen a warning: the longest the Accounts Manager may approve. */
  ruleMaxDays: number;
}

// ---------- my rules ----------

export type MyRuleKind = 'remind' | 'ocrStricter' | 'tdsAlert' | 'msmeWarn' | 'quietDuplicate' | 'defaultBasis';

export interface MyRule {
  id: string;
  kind: MyRuleKind;
  /** % (OCR, TDS), days (MSME warn, quiet), basis, or the reminder text. */
  value: string | number;
  vendorId?: string;
  task?: TaskId;
  until: ISODate;
  reason: string;
  status: 'Active' | 'PendingAM' | 'RejectedByAM' | 'Ended';
  paused?: boolean;
  removed?: boolean;
  setAt: ISODateTime;
  decidedBy?: ActorKey;
  firedAt?: ISODateTime;
}

export interface SuggestionOutcome {
  id: string;
  outcome: 'taken' | 'notNow';
  at: ISODateTime;
  /** The figures it was based on, so it can come back when they change. */
  basis: string;
}
