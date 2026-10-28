// Position manifest for the Accounts Executive (R01).
// Tasks = docs/accounts_executive/01_accounts_executive_tasks_and_responsibilities.md §4 (revised 26-Oct-2026
// against the shared engine docs of Oct 1, 2026): 3 responsibilities, 23 tasks (T1–T23) in 4 areas (§11.1–11.4).

import {
  ArrowLeftRight,
  BadgePercent,
  BadgeIndianRupee,
  Banknote,
  ClipboardCheck,
  FileWarning,
  PackageX,
  Boxes,
  CalendarCheck,
  Coins,
  FileMinus,
  FilePlus,
  FileSearch,
  FileText,
  Gauge,
  Landmark,
  ListChecks,
  Package,
  ReceiptText,
  Scale,
  ScrollText,
  Truck,
  UserCog,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { AreaId, TaskId } from '../domain/types';
import type { ReportId } from '../store/navigation';
import type { Accent } from '../ui';

export const POSITION = {
  title: 'Accounts Executive',
  roleId: 'R01',
  owner: 'Vijay',
};

export type ResponsibilityId = 'R1' | 'R2' | 'R3';

export const RESPONSIBILITIES: { id: ResponsibilityId; title: string; why: string }[] = [
  { id: 'R1', title: 'Record purchases, notes and advances correctly', why: 'Every invoice, bill and note that arrived is posted against its original document with the right tax, once any match variance is approved; every stock write-off has its ITC reversal.' },
  { id: 'R2', title: 'Keep vendor, customer and item finance data right', why: 'No party or item is used with missing or wrong finance fields; every change is checked before it applies.' },
  { id: 'R3', title: 'Close stock and AR/AP correctly each period', why: 'At each month end the control accounts agree with their open items or every break is explained, and the provisions, revaluations, variances and bank stock statement are drafted from the books on time.' },
];

export type TaskType = 'Record' | 'Make' | 'Ask' | 'Run a batch';

export interface TaskItem {
  code: TaskId;
  area: AreaId;
  responsibility: ResponsibilityId;
  title: string;
  description: string;
  cadence: string;
  type: TaskType;
  icon: LucideIcon;
  accent: Accent;
  /** Who checks it, in one line. */
  checker: string;
}

export const TASKS: TaskItem[] = [
  { code: 'T1', area: 'purchase', responsibility: 'R1', title: 'Post a purchase voucher', description: 'Invoices and Bills of Entry: tax, due date, posted once the Procurement Officer\'s variance is approved.', cadence: 'Daily', type: 'Record', icon: ReceiptText, accent: 'blue', checker: 'Accounts Manager' },
  { code: 'T2', area: 'purchase', responsibility: 'R1', title: 'Post a service bill', description: 'Matched contractor bills against the confirmed milestone; route a bill with no confirmation.', cadence: 'Monthly', type: 'Record', icon: Wrench, accent: 'teal', checker: 'Accounts Manager' },
  { code: 'T3', area: 'purchase', responsibility: 'R1', title: 'Allocate landed cost', description: 'Spread freight and duty over the material it belongs to.', cadence: 'As needed', type: 'Make', icon: Truck, accent: 'slate', checker: 'Accounts Manager' },
  { code: 'T4', area: 'purchase', responsibility: 'R1', title: 'Raise a debit note', description: 'Returns after QC rejection, rate or quantity differences.', cadence: 'As needed', type: 'Make', icon: FileMinus, accent: 'red', checker: 'Accounts Manager' },
  { code: 'T5', area: 'purchase', responsibility: 'R1', title: 'Book a supplier credit note', description: 'Against the original voucher, never reducing a return twice.', cadence: 'As needed', type: 'Record', icon: FilePlus, accent: 'amber', checker: 'Accounts Manager · Compliance' },
  { code: 'T6', area: 'purchase', responsibility: 'R1', title: 'Request a tax override', description: 'When the derived GST, TDS or RCM is wrong for a voucher.', cadence: 'As needed', type: 'Ask', icon: BadgePercent, accent: 'violet', checker: 'Compliance Officer' },
  { code: 'T7', area: 'purchase', responsibility: 'R2', title: 'Vendor finance fields', description: 'Terms, ledger and bank details (with call-back evidence) for new and changed vendors.', cadence: 'As needed', type: 'Make', icon: UserCog, accent: 'teal', checker: 'Accounts Manager · Finance Controller' },
  { code: 'T19', area: 'purchase', responsibility: 'R3', title: 'GRN-not-invoiced provision', description: 'Provide for goods received with no invoice at the cut-off.', cadence: 'Month end', type: 'Run a batch', icon: FileWarning, accent: 'amber', checker: 'Accounts Manager' },
  { code: 'T8', area: 'inventory', responsibility: 'R2', title: 'Item accounting fields', description: 'Create items from Stores\' requests: HSN, GST and ledgers.', cadence: 'As requested', type: 'Make', icon: Package, accent: 'blue', checker: 'Accounts Manager' },
  { code: 'T9', area: 'inventory', responsibility: 'R3', title: 'Resolve stock reconciliation breaks', description: 'Stock vs the stock ledger, every break explained.', cadence: 'Month end', type: 'Run a batch', icon: Scale, accent: 'amber', checker: 'Accounts Manager' },
  { code: 'T10', area: 'inventory', responsibility: 'R3', title: 'Draft the expired-stock provision', description: 'Slow-moving, expired and below-cost stock.', cadence: 'Quarter end', type: 'Make', icon: Boxes, accent: 'red', checker: 'Accounts Manager · Finance Controller' },
  { code: 'T11', area: 'inventory', responsibility: 'R3', title: 'Post the periodic close', description: 'Closing stock and COGS, in Periodic mode only.', cadence: 'Month end', type: 'Run a batch', icon: CalendarCheck, accent: 'slate', checker: 'Accounts Manager' },
  { code: 'T20', area: 'inventory', responsibility: 'R3', title: 'Review standard cost variances', description: 'Price and usage variances on items costed at standard.', cadence: 'Month end', type: 'Run a batch', icon: ClipboardCheck, accent: 'violet', checker: 'Accounts Manager' },
  { code: 'T21', area: 'inventory', responsibility: 'R3', title: 'Prepare the bank stock statement', description: 'Stock statement for the Cash Credit account, from the book valuation.', cadence: 'Monthly', type: 'Run a batch', icon: Banknote, accent: 'teal', checker: 'Accounts Manager · Compliance tracks' },
  { code: 'T22', area: 'inventory', responsibility: 'R1', title: 'ITC reversal on written-off stock', description: 'Reverse the input tax credit on an approved write-off.', cadence: 'Per write-off', type: 'Record', icon: PackageX, accent: 'red', checker: 'Compliance Officer' },
  { code: 'T12', area: 'sales', responsibility: 'R2', title: 'Customer finance fields', description: 'Credit limits the Credit Controller recommends, credit days, billing instructions.', cadence: 'As needed', type: 'Make', icon: Users, accent: 'violet', checker: 'Credit Controller · Accounts Manager' },
  { code: 'T13', area: 'sales', responsibility: 'R1', title: 'Record an advance', description: 'Link a customer advance to its order; flag GST on advance.', cadence: 'Per advance', type: 'Record', icon: Wallet, accent: 'teal', checker: 'Accounts Manager · Billing told' },
  { code: 'T14', area: 'arap', responsibility: 'R3', title: 'Match 26AS/AIS', description: 'TDS customers deducted, against the books; escalate or write off what does not match.', cadence: 'Quarterly', type: 'Run a batch', icon: FileSearch, accent: 'blue', checker: 'Accounts Manager · Finance Controller (write-off)' },
  { code: 'T15', area: 'arap', responsibility: 'R3', title: 'Draft the provision run', description: 'Doubtful-debt provision from the matrix and specific items.', cadence: 'Month end', type: 'Run a batch', icon: Coins, accent: 'amber', checker: 'Accounts Manager · Finance Controller' },
  { code: 'T23', area: 'arap', responsibility: 'R3', title: 'Draft the FX revaluation', description: 'Foreign-currency open items at the month-end rate.', cadence: 'Month end', type: 'Run a batch', icon: BadgeIndianRupee, accent: 'blue', checker: 'Accounts Manager' },
  { code: 'T16', area: 'arap', responsibility: 'R1', title: 'Prepare a netting document', description: 'Set off a party that is both customer and vendor.', cadence: 'As needed', type: 'Make', icon: ArrowLeftRight, accent: 'slate', checker: 'Accounts Manager' },
  { code: 'T17', area: 'arap', responsibility: 'R2', title: 'Vendor Udyam (MSME) data', description: 'Udyam number and category, which set the 45-day rule.', cadence: 'As needed', type: 'Record', icon: Landmark, accent: 'violet', checker: 'Accounts Manager' },
  { code: 'T18', area: 'arap', responsibility: 'R3', title: 'Run the AR/AP reconciliation', description: 'Control accounts vs open items, every break explained.', cadence: 'Month end', type: 'Run a batch', icon: Gauge, accent: 'red', checker: 'Accounts Manager' },
];

export const taskOf = (code: TaskId) => TASKS.find((t) => t.code === code)!;

export interface ReportItem {
  id: ReportId;
  title: string;
  description: string;
  icon: LucideIcon;
  section: 'task' | 'party';
}

export const REPORT_SECTIONS: { id: ReportItem['section']; title: string; description: string }[] = [
  { id: 'party', title: 'Party reports', description: 'One vendor or customer at a time: everything posted, sent and changed.' },
  { id: 'task', title: 'Task registers', description: 'Every document a task made or posted, by area, with who checked it.' },
];

export const REPORTS: ReportItem[] = [
  { id: 'purchase', title: 'Purchase Register', description: 'T1, T2, T3. Vouchers, service bills and landed cost, with the variances Procurement raised and checks.', icon: ReceiptText, section: 'task' },
  { id: 'notes', title: 'Notes Register', description: 'T4, T5, T22. Debit notes, supplier credit notes and ITC reversals on written-off stock.', icon: FileText, section: 'task' },
  { id: 'masters', title: 'Master Changes', description: 'T7, T8, T12, T17. Vendor, item and customer finance fields, through to approval.', icon: UserCog, section: 'task' },
  { id: 'advances', title: 'Advances', description: 'T13. Customer advances, their orders and GST on advance.', icon: Wallet, section: 'task' },
  { id: 'close', title: 'Month-end Close', description: 'T9–T11, T14, T15, T18–T21, T23. Runs, breaks, provisions and statements, by month.', icon: ListChecks, section: 'task' },
  { id: 'party', title: 'Party Ledger', description: 'Pick a vendor or customer: every item, message and change.', icon: Users, section: 'party' },
  { id: 'approval-log', title: 'Approval Log', description: 'Append-only trail of every action, including refused attempts.', icon: ScrollText, section: 'task' },
];
