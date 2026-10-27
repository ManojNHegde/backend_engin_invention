// Customer / vendor onboarding (03_party_onboarding_design.md).
// Decided 27-Oct: nothing arrives from Procurement or Sales in the system. They hand the Accounts Executive a
// PAPER form (with copies of the GST certificate, PAN, cancelled cheque), and the AE types everything in:
// the party's details AND the finance details. So every field on the request is editable by the AE.
//   Party            our party master (party_master.*): created when the request is approved
//   Request, Account the onboarding request (maker–checker) and the active party account

import type { ISODate, ISODateTime } from '../domain/types';

export type Side = 'payable' | 'receivable';

export type ActorKey = 'teja' | 'rajan' | 'usha' | 'venkat' | 'farid' | 'ravi' | 'kiran' | 'arun' | 'system' | 'bank' | 'gst';

// ---------- Party master (ours) ----------

export type GstStatus = 'active' | 'suspended' | 'cancelled';

export interface PartyGstin {
  value: string;
  stateCode: string; // 'KA'
  status: GstStatus;
}

export interface PartyRole {
  type: 'supplier' | 'customer';
  since: ISODate;
  enteredBy: ActorKey; // the AE who typed it in
  formFrom?: ActorKey; // who handed over the paper form
  formNo?: string;
}

export interface Party {
  partyId: string;
  kind: 'organization' | 'person';
  legalName: string;
  tradeName?: string;
  pan: string | null;
  gstins: PartyGstin[];
  address: { line: string; city: string; stateCode: string; pincode: string; country: string };
  contactPerson?: string;
  email?: string;
  phones: string[];
  roles: PartyRole[];
}

/** A paper form on the AE's desk (mock only: what is written on it, so the walkthrough can copy from it). */
export interface PaperForm {
  key: string;
  side: Side;
  from: ActorKey;
  formNo: string;
  title: string;
  note: string;
  values: Values;
  attachments: string[];
}

// ---------- The request and the account (Finance) ----------

export type FieldValue = string | number | boolean | null;
export type Values = Record<string, FieldValue>;

export interface Suggestion {
  value: FieldValue;
  why: string;
}

export type RequestStatus = 'draft' | 'submitted' | 'returned' | 'active' | 'sent_back';

export type Block = 'party' | 'bank' | 'credit_limit' | 'tax';

/** One block of a submitted request, routed to one checker (party_account_change). */
export interface Change {
  id: string;
  block: Block;
  label: string;
  checker: ActorKey;
  status: 'pending' | 'approved' | 'returned';
  after: Values;
  decidedAt?: ISODateTime;
  reason?: string;
}

export interface PennyDrop {
  result: 'pass' | 'name_mismatch';
  nameAtBank: string;
  matchPct: number;
  at: ISODateTime;
  /** account|ifsc the result is for: a later edit makes it stale. */
  forKey: string;
}

/** GST portal check of the GSTIN the AE typed. */
export interface GstCheck {
  status: GstStatus;
  nameAtGst: string;
  at: ISODateTime;
  /** The GSTIN this result is for: a later edit makes it stale. */
  forValue: string;
}

export interface HistoryLine {
  at: ISODateTime;
  by: ActorKey;
  text: string;
}

/** One onboarding of one party account (party_account_request). */
export interface Request {
  id: string;
  side: Side;
  status: RequestStatus;
  /** Who handed over the paper form (Procurement Officer / Sales Executive). */
  from: ActorKey;
  formNo: string;
  /** When the AE opened it (the paper reached the desk). */
  arrivedAt: ISODateTime;
  /** An existing party the AE chose to use (found by PAN / GSTIN). Null: a new party is created on approval. */
  partyId: string | null;
  /** Mock only: the paper form this request was typed from. */
  paper?: string;
  values: Values;
  gstCheck?: GstCheck;
  pennyDrop?: PennyDrop;
  changes: Change[];
  returnedReason?: string;
  /** The form was returned to whoever handed it over (party already exists, GSTIN cancelled …). */
  sentBack?: { to: ActorKey; reason: string; at: ISODateTime };
  submittedAt?: ISODateTime;
  activatedAt?: ISODateTime;
  accountId?: string;
  dirty?: boolean;
  history: HistoryLine[];
}

/** An active party account (accounting.account leaf + accounting.party + satellites, as one view). */
export interface Account {
  accountId: string;
  partyId: string;
  side: Side;
  name: string;
  under: string;
  category: string;
  creditDays: number | null;
  creditLimit: number | null;
  msme: 'yes' | 'no' | 'unknown' | null;
  msmeCategory?: string | null;
  udyam: string | null;
  sec43bh: boolean | null;
  bankLast4: string | null;
  bankAccountNo?: string;
  bankSince: ISODate | null;
  activatedAt: ISODate;
  requestId?: string;
}

// ---------- The walkthrough's link to the backend design ----------

export type LogKind = 'api' | 'event' | 'db';

export interface LogEntry {
  id: number;
  at: ISODateTime;
  kind: LogKind;
  actor: ActorKey;
  line: string; // "POST /party-account-requests" · "party.role.added" · "INSERT party_master.party"
  detail?: string;
}

export interface Notice {
  id: string;
  at: ISODateTime;
  tone: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  body: string;
  requestId?: string;
  read: boolean;
}
