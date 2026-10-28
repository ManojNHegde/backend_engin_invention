// The task engine: for each kind of work item, what the record shows (facts), what is filled in (fields),
// what is checked (Stop · Reason · Warn) and who checks it next (chain).
// One screen serves all 23 tasks (02_accounts_executive_designed_ui.md §1): the screen only renders this.

import { addDays, dateOf, fmtDate } from './dates';
import { IFSC, UDYAM, aboveTolerance, dueDate, fxRevaluation, gstInAdvance, matchVariance, perUnit, tdsOnPurchase } from './accounting';
import { inr } from './money';
import type { ActorKey, BatchLine, Check, CompanyRules, Customer, Fact, FactSection, FieldDef, FieldValue, Item, MyRule, Variance, Vendor, WorkItem } from './types';

export interface Ctx {
  rules: CompanyRules;
  vendors: Vendor[];
  customers: Customer[];
  items: Item[];
  work: WorkItem[];
  myRules: MyRule[];
  now: string;
}

// ---------- document data, by kind ----------

export interface PvData {
  vendorId: string;
  itemName: string;
  uom: string;
  po?: { no: string; qty: number; rate: number; freightOnPo?: number };
  grn?: { no: string; qty: number; on: string };
  invoice: { no: string; date: string; qty: number; rate: number; other: number; otherLabel?: string; gstPct: number; gstin: string | null };
  /** OCR confidence per field (%). Absent = keyed by hand. */
  ocr?: Partial<Record<'invoiceNo' | 'qty' | 'rate' | 'gstin', number>>;
  /** Who keyed or scanned the document (shared work list §12.1: "whoever keys the source document").
   *  Only when it is me do I confirm the OCR fields; otherwise they are shown as captured. */
  capturedBy: ActorKey;
  /** What the capturer corrected (e.g. a misread quantity). */
  ocrNote?: string;
  /** The match variance, raised by the Procurement Officer and approved by the Accounts Manager before posting. */
  variance?: Variance;
  noPo?: boolean;
  duplicateOf?: string;
  /** The vendor's purchases this year when the invoice arrived (snapshot, for the TDS threshold). */
  fyBefore?: number;
}
export interface ServiceData {
  vendorId: string;
  wo: { no: string; title: string; monthly: number; total: number; billedBefore: number; milestone: string; confirmed: number; confirmedBy: string };
  invoice: { no: string; amount: number; gstPct: number };
  suggestedLedger: string;
  /** No service completion confirmation: mine to route as an exception. */
  noConfirmation?: boolean;
  /** Above the milestone: raised by the Contracts & Services Officer, decided by the Accounts Manager. */
  variance?: Variance;
}
export interface LandedData {
  voucherId: string;
  vendorName: string;
  charge: number;
  label: string;
  qty: number;
  uom: string;
  value: number;
}
export interface DebitData {
  vendorId: string;
  voucherId: string;
  /** For a voucher posted before the scenario (not a work item). */
  voucherPostedBefore?: boolean;
  po: string;
  rejectedQty: number;
  rate: number;
  gstPct: number;
  uom: string;
  qcReason: string;
  holdAmount?: number;
}
export interface CreditNoteData {
  vendorId: string;
  cnNo: string;
  voucherRef: string;
  qty: number;
  rate: number;
  gstPct: number;
  forWhat: string;
}
export interface OverrideData {
  voucherId: string;
  vendorName: string;
  amount: number;
  derived: string;
  derivedWhy: string;
}
export interface VendorData {
  proposal: Pick<Vendor, 'id' | 'name' | 'state' | 'gstin' | 'pan' | 'msme' | 'supplies'> & { phone: string };
  quoteTerms: number;
  usualTerms: number;
}
export interface ItemData {
  request: string;
  closest: string;
  uom: string;
}
export interface CustomerData {
  customerId: string;
  field: 'Credit limit';
  current: number;
  recommended: number;
  recommendedWhy: string;
}
export interface AdvanceData {
  customerId: string;
  receipt: string;
  receivedOn: string;
  amount: number;
  soId: string;
  soValue: number;
  service: boolean;
  gstPct: number;
  refunded?: boolean;
}
export interface BatchData {
  ran: boolean;
  /** "Run" gate: what must be ready before the press. */
  gate: string[];
  lines: BatchLine[];
  intro: string;
}
export interface NettingData {
  customerId: string;
  vendorName: string;
  pan: string;
  receivable: number;
  payable: number;
  linked: boolean;
}
export interface UdyamData {
  vendorId: string;
  mode: 'verify' | 'missing';
  given?: string;
}
export interface ItcWriteOffData {
  writeOffNo: string;
  item: string;
  batch: string;
  qty: number;
  uom: string;
  value: number;
  gstPct: number;
  reason: string;
  madeBy: ActorKey;
  approvedBy: ActorKey;
  itcTaken: boolean;
}

// ---------- helpers ----------

const vendorOf = (c: Ctx, id: string) => c.vendors.find((v) => v.id === id);
const customerOf = (c: Ctx, id: string) => c.customers.find((x) => x.id === id);
const workOf = (c: Ctx, id: string) => c.work.find((w) => w.id === id);
const posted = (w: WorkItem | undefined) => !!w && (w.status === 'Sent' || w.status === 'Approved' || w.status === 'Done');
const num = (v: FieldValue | undefined) => (typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^0-9.]/g, '')) || 0);
const str = (v: FieldValue | undefined) => String(v ?? '').trim();
const pct = (n: number) => `${n.toFixed(2)}%`;

/** The OCR flag level: the company's, or my stricter rule. */
export function ocrFlagLevel(c: Ctx): number {
  const mine = c.myRules.find((r) => r.kind === 'ocrStricter' && r.status === 'Active' && !r.paused && r.until >= dateOf(c.now));
  return Math.max(c.rules.ocrFlagPct, mine ? Number(mine.value) : 0);
}

function liveRule(c: Ctx, kind: MyRule['kind'], vendorId?: string) {
  return c.myRules.find((r) => r.kind === kind && r.status === 'Active' && !r.paused && r.until >= dateOf(c.now) && (!vendorId || r.vendorId === vendorId));
}

/** The variance as it reached me: who raised it, and whether the Accounts Manager has approved it. */
function varianceRows(v: Variance | undefined): Fact[] {
  if (!v) return [];
  return [
    { label: 'Variance raised by', value: `${v.raisedBy === 'ravi' ? 'Ravi (Procurement Officer)' : 'Kiran (Contracts & Services Officer)'}: ${v.reason}`, source: 'from Procurement' },
    v.approvedBy
      ? { label: 'Approved by', value: `Rajan (Accounts Manager)${v.decision ? `: ${v.decision}` : ''}`, source: 'from the Accounts Manager', tone: 'success' }
      : { label: 'Approval', value: 'With Rajan (Accounts Manager): post once approved', tone: 'warning' },
  ];
}

function varianceCheck(v: Variance | undefined, above: boolean, raiser: string): Check | null {
  if (v && !v.approvedBy) return { id: 'variance', result: 'stop', title: 'Variance not yet approved by the Accounts Manager', detail: `${raiser} raised it: "${v.reason}". The voucher waits; it comes back to Needs me when Rajan approves.` };
  if (v) return { id: 'variance', result: 'ok', title: `Variance approved by Rajan${v.decision ? `: ${v.decision}` : ''}`, detail: `Raised by ${raiser}. You post; you do not explain it again.` };
  if (above) return { id: 'variance', result: 'stop', title: 'Variance above tolerance, not raised yet', detail: `${raiser} raises the match variance; the Accounts Manager approves it before posting.` };
  return null;
}

/** Purchase-voucher figures, from the document and what Teja entered. */
export function pvFigures(item: WorkItem, values: Record<string, FieldValue>, c: Ctx) {
  const d = item.data as unknown as PvData;
  const qty = values.qty !== undefined ? num(values.qty) : d.invoice.qty;
  const rate = values.rate !== undefined ? num(values.rate) : d.invoice.rate;
  const goods = qty * rate;
  const taxable = goods + d.invoice.other;
  const gst = Math.round((taxable * d.invoice.gstPct) / 100);
  const match = d.po && d.grn ? matchVariance({ poQty: d.po.qty, poRate: d.po.rate, grnQty: d.grn.qty, invQty: qty, invRate: rate, other: Math.max(0, d.invoice.other - (d.po.freightOnPo ?? 0)) }) : null;
  const above = match ? aboveTolerance(match, c.rules.matchQtyTolPct, c.rules.matchRateTolPct) : false;
  const v = vendorOf(c, d.vendorId);
  const tds = tdsOnPurchase(d.fyBefore ?? v?.fyPurchases ?? 0, taxable, c.rules.tdsThreshold, c.rules.tdsRatePct);
  const due = dueDate(dateOf(item.arrivedAt), v?.creditDays ?? 45, !!v?.msme, c.rules.msmeMaxDays);
  return { qty, rate, goods, taxable, gst, total: taxable + gst, match, above, tds, due, vendor: v };
}

// ---------- the spec of each kind ----------

export interface Spec {
  facts: (item: WorkItem, c: Ctx) => FactSection[];
  fields: (item: WorkItem, values: Record<string, FieldValue>, c: Ctx) => FieldDef[];
  checks: (item: WorkItem, values: Record<string, FieldValue>, c: Ctx) => Check[];
  /** Who checks, in order. Empty = no checker: the task ends when sent. */
  chain: (item: WorkItem, values: Record<string, FieldValue>, c: Ctx) => ActorKey[];
  /** Told, not asked to act. */
  cc?: (item: WorkItem, values: Record<string, FieldValue>, c: Ctx) => ActorKey[];
  sendLabel: (item: WorkItem, values: Record<string, FieldValue>, c: Ctx) => string;
  /** One line for lists and the queue. */
  summary: (item: WorkItem, c: Ctx) => string;
  /** The send discards the item instead (a duplicate). */
  discards?: (values: Record<string, FieldValue>) => boolean;
}

const batchLinesChecks = (item: WorkItem, values: Record<string, FieldValue>, reader: ActorKey): Check[] => {
  const d = item.data as unknown as BatchData;
  if (!d.ran) return [{ id: 'run', result: 'stop', title: 'Run it first', detail: 'Press Run: the system works out every line, then you decide the ones it could not settle.' }];
  const out: Check[] = [];
  d.lines
    .filter((l) => !l.auto)
    .forEach((l) => {
      const choice = str(values[`line:${l.id}`]) || l.options[0];
      if (l.needsReason.includes(choice)) out.push({ id: `line:${l.id}`, result: 'reason', title: `${l.label}: ${choice}`, detail: 'Say why.', reader, field: `why:line:${l.id}` });
    });
  if (out.length === 0) out.push({ id: 'lines', result: 'ok', title: `${d.lines.length} line${d.lines.length === 1 ? '' : 's'} settled` });
  return out;
};

const batchFacts = (item: WorkItem, title: string): FactSection[] => {
  const d = item.data as unknown as BatchData;
  return [
    { title: 'Before the run', rows: d.gate.map((g) => ({ label: g, value: 'Ready', tone: 'success' as const })) },
    ...(d.ran
      ? [{ title, aside: 'ready calculation', rows: [{ label: 'Lines', value: String(d.lines.length) }, { label: 'Settled by the run', value: String(d.lines.filter((l) => l.auto).length) }, { label: 'For you to decide', value: String(d.lines.filter((l) => !l.auto).length), strong: true }] }]
      : []),
  ];
};

export const SPECS: Record<string, Spec> = {
  // ===================== T1 Post a purchase voucher =====================
  pv: {
    facts: (item, c) => {
      const d = item.data as unknown as PvData;
      const f = pvFigures(item, item.values, c);
      const sections: FactSection[] = [
        {
          title: 'Invoice',
          aside: `${d.ocr ? 'read by OCR' : 'keyed by hand'} · captured by ${d.capturedBy === 'teja' ? 'you' : d.capturedBy === 'ravi' ? 'Ravi (Procurement Officer)' : d.capturedBy === 'suresh' ? 'Suresh (Stores)' : d.capturedBy}`,
          rows: [
            { label: 'Vendor', value: `${f.vendor?.name ?? d.vendorId}${f.vendor?.gstin ? '' : ' · unregistered'}` },
            ...(d.ocrNote ? [{ label: 'Corrected at capture', value: d.ocrNote, source: 'from Procurement' }] : []),
            { label: 'Item', value: `${d.itemName}` },
            { label: 'Invoice date', value: fmtDate(d.invoice.date) },
            { label: 'GSTIN on invoice', value: d.invoice.gstin ?? 'None', source: d.ocr?.gstin ? `OCR ${d.ocr.gstin}%` : undefined },
          ],
        },
      ];
      if (d.po && d.grn && f.match) {
        const m = f.match;
        sections.push({
          title: 'Match: PO · GRN · invoice',
          aside: `tolerance qty ${c.rules.matchQtyTolPct}% · rate ${c.rules.matchRateTolPct}%`,
          rows: [
            { label: `PO ${d.po.no}`, value: `${d.po.qty.toLocaleString('en-IN')} ${d.uom} × ${inr(d.po.rate)} = ${inr(d.po.qty * d.po.rate)}` },
            { label: `GRN ${d.grn.no} (${fmtDate(d.grn.on)})`, value: `${d.grn.qty.toLocaleString('en-IN')} ${d.uom} received` },
            { label: 'Invoice', value: `${f.qty.toLocaleString('en-IN')} ${d.uom} × ${inr(f.rate)}${d.invoice.other ? ` + ${inr(d.invoice.other)} ${d.invoice.otherLabel ?? 'other'}` : ''} = ${inr(f.taxable)}` },
            { label: 'Quantity difference', value: `${m.qtyDiff.toLocaleString('en-IN')} ${d.uom} × ${inr(f.rate)} = ${inr(m.qtyVar)} (${pct(m.qtyPct)})`, source: 'formula', tone: Math.abs(m.qtyPct) > c.rules.matchQtyTolPct ? 'warning' : undefined },
            { label: 'Rate difference', value: `${m.base.toLocaleString('en-IN')} ${d.uom} × ${inr(f.rate - d.po.rate)} = ${inr(m.rateVar)} (${pct(m.ratePct)})`, source: 'formula', tone: Math.abs(m.ratePct) > c.rules.matchRateTolPct ? 'warning' : undefined },
            { label: 'Other charges not on the PO', value: inr(m.other), source: 'formula', tone: m.other > 0 ? 'warning' : undefined },
            { label: 'Variance', value: inr(m.total), strong: true, tone: f.above ? 'warning' : 'success' },
            ...varianceRows(d.variance),
          ],
        });
      }
      sections.push({
        title: 'Tax and due date',
        aside: 'policy engine',
        rows: [
          { label: 'Taxable value', value: inr(f.taxable) },
          { label: `GST ${d.invoice.gstPct}%${f.vendor?.gstin ? '' : ' (reverse charge suggested)'}`, value: inr(f.gst), source: 'ready calculation' },
          { label: 'Invoice total', value: inr(f.total), strong: true },
          {
            label: 'TDS on purchase (₹50 lakh)',
            value: f.tds.applies ? `${inr(f.tds.tds)} on ${inr(f.tds.excess)} above the threshold` : `Not yet: ${inr(f.tds.after)} this year (${Math.round(f.tds.pctOfThreshold)}%)`,
            source: 'ready calculation',
            tone: f.tds.applies ? 'warning' : undefined,
          },
          { label: 'Due date', value: `${fmtDate(f.due.date)} (${f.due.days} days${f.vendor?.msme ? `, MSME ${f.vendor.msme}` : ''})`, source: 'formula' },
        ],
      });
      return sections;
    },
    fields: (item) => {
      const d = item.data as unknown as PvData;
      const out: FieldDef[] = [];
      // Keyed by someone else: what they captured is shown, not typed again.
      const mine = d.capturedBy === 'teja';
      const ocr = mine ? d.ocr : undefined;
      const hint = mine ? undefined : 'As captured by the Procurement Officer or Stores.';
      if (d.duplicateOf) out.push({ key: 'duplicate', label: 'This looks like a duplicate', input: 'select', options: ['It is a duplicate: discard it', 'Not a duplicate: post it'], required: true });
      out.push({ key: 'invoiceNo', label: 'Invoice number', input: 'text', confidence: ocr?.invoiceNo, required: mine, readOnly: !mine, hint });
      out.push({ key: 'qty', label: `Quantity (${d.uom})`, input: 'number', confidence: ocr?.qty, required: mine, readOnly: !mine, hint });
      out.push({ key: 'rate', label: `Rate per ${d.uom}`, input: 'money', confidence: ocr?.rate, required: mine, readOnly: !mine, hint });
      if (d.noPo) out.push({ key: 'noPoReason', label: 'Why there is no PO', input: 'textarea', required: true, hint: 'Listed for Ravi (Procurement Officer) as a "no PO" exception.' });
      out.push({ key: 'narration', label: 'Narration', input: 'textarea' });
      return out;
    },
    checks: (item, values, c) => {
      const d = item.data as unknown as PvData;
      const f = pvFigures(item, values, c);
      const out: Check[] = [];
      if (f.vendor && !f.vendor.approved) out.push({ id: 'vendor', result: 'stop', title: `${f.vendor.name} is not an approved vendor yet`, detail: 'Its finance fields are with the checkers (T7). Post once it is approved.' });
      if (d.duplicateOf) {
        const ans = str(values.duplicate);
        if (!ans) out.push({ id: 'dup', result: 'stop', title: `Same vendor and invoice number as ${d.duplicateOf}`, detail: 'The same invoice came in twice (scanned and emailed). Say whether it is a duplicate.' });
        else out.push({ id: 'dup', result: ans.startsWith('Not') ? 'reason' : 'ok', title: ans.startsWith('Not') ? 'You say it is not a duplicate' : 'Duplicate: it will be discarded, nothing is posted', reader: 'rajan' });
      } else out.push({ id: 'dup', result: 'ok', title: 'No duplicate', detail: 'Same vendor + same invoice number, or same amount within a short window, including number variants.' });
      const level = ocrFlagLevel(c);
      (['invoiceNo', 'qty', 'rate'] as const).forEach((k) => {
        const conf = d.capturedBy === 'teja' ? d.ocr?.[k] : undefined;
        if (conf === undefined || conf >= level) return;
        const label = k === 'invoiceNo' ? 'Invoice number' : k === 'qty' ? 'Quantity' : 'Rate';
        if (!values[`ok:${k}`]) out.push({ id: `ocr:${k}`, result: 'stop', title: `${label} read at ${conf}%: confirm it`, detail: `Below the ${level}% flag level${level > c.rules.ocrFlagPct ? ' (your stricter rule)' : ''}. Check it against the scan and correct it if needed.` });
        else out.push({ id: `ocr:${k}`, result: 'ok', title: `${label} confirmed by you` });
      });
      if (d.po && f.match && f.qty > d.po.qty * 1.1) out.push({ id: 'qty', result: 'warn', title: `Quantity ${f.qty.toLocaleString('en-IN')} is far above the PO (${d.po.qty.toLocaleString('en-IN')})`, detail: 'Check the scan: OCR may have misread it.' });
      const vc = varianceCheck(d.variance, f.above, 'Ravi (Procurement Officer)');
      if (vc) out.push(vc);
      else if (f.match) out.push({ id: 'variance', result: 'ok', title: 'Matches the PO and GRN within tolerance' });
      if (d.noPo) out.push({ id: 'nopo', result: 'reason', title: 'No PO for this purchase', detail: 'Allowed: posted normally and listed for the Procurement Officer.', reader: 'ravi', field: 'noPoReason' });
      if (f.vendor?.gstin && d.invoice.gstin && f.vendor.gstin !== d.invoice.gstin) out.push({ id: 'gstin', result: 'stop', title: 'GSTIN on the invoice differs from the vendor record' });
      else if (f.vendor?.gstin) out.push({ id: 'gstin', result: 'ok', title: 'GSTIN matches the vendor record' });
      if (f.vendor && !f.vendor.gstin) out.push({ id: 'rcm', result: 'warn', title: 'Unregistered vendor: reverse charge (RCM) suggested', detail: 'If RCM does not apply to this purchase, request a tax override (T6) from the Compliance Officer.' });
      if (f.tds.crosses) out.push({ id: 'tds', result: 'warn', title: `Crosses ₹50 lakh with ${f.vendor?.name}: TDS ${inr(f.tds.tds)}`, detail: `This year ${inr(f.tds.after)}; ${c.rules.tdsRatePct}% on ${inr(f.tds.excess)} (Section 393 payment code; legacy 194Q). Added to the voucher.` });
      else {
        const alert = liveRule(c, 'tdsAlert');
        if (alert && !f.tds.applies && f.tds.pctOfThreshold >= Number(alert.value))
          out.push({ id: 'tds', result: 'warn', title: `${Math.round(f.tds.pctOfThreshold)}% of the TDS threshold with ${f.vendor?.name}`, detail: `Your alert at ${alert.value}% (${alert.id}). TDS starts above ${inr(c.rules.tdsThreshold)}.` });
      }
      if (f.vendor?.msme) out.push({ id: 'msme', result: 'warn', title: `MSME (${f.vendor.msme}): pay by ${fmtDate(f.due.date)}`, detail: `Credit days ${f.vendor.creditDays}, never more than ${c.rules.msmeMaxDays} for an MSME vendor (MSMED Act).` });
      return out;
    },
    chain: (item) => ((item.data as unknown as PvData).noPo ? [] : ['rajan']),
    cc: (item) => ((item.data as unknown as PvData).noPo ? ['ravi'] : []),
    sendLabel: (item, values) => {
      const d = item.data as unknown as PvData;
      if (d.duplicateOf && str(values.duplicate).startsWith('It is')) return 'Discard duplicate';
      if (d.noPo) return 'Post (no checker)';
      return 'Post & send to Accounts Manager';
    },
    summary: (item, c) => {
      const d = item.data as unknown as PvData;
      const f = pvFigures(item, item.values, c);
      if (d.duplicateOf) return `Possible duplicate of ${d.duplicateOf} · ${inr(f.taxable)}`;
      if (d.noPo) return `No PO · ${inr(f.taxable)}`;
      const v = d.variance ? (d.variance.approvedBy ? ' · variance approved' : ' · variance with Rajan') : '';
      return `${d.po?.no ? `PO ${d.po.no} · ` : ''}${inr(f.taxable)}${f.above && f.match ? ` · variance ${inr(f.match.total)}` : ''}${v}`;
    },
    discards: (values) => str(values.duplicate).startsWith('It is'),
  },

  // ===================== T2 Post a service bill =====================
  service: {
    facts: (item) => {
      const d = item.data as unknown as ServiceData;
      const over = d.invoice.amount - d.wo.confirmed;
      const remaining = d.wo.total - d.wo.billedBefore - d.wo.confirmed;
      return [
        {
          title: `Works Order ${d.wo.no}`,
          aside: 'matched by Contracts & Services Procurement',
          rows: [
            { label: 'Contract', value: d.wo.title },
            { label: 'Value', value: `${inr(d.wo.monthly)} a month · ${inr(d.wo.total)} in all` },
            { label: `${d.wo.milestone} milestone`, value: d.noConfirmation ? 'No completion confirmation yet' : `${inr(d.wo.confirmed)} confirmed by ${d.wo.confirmedBy}`, tone: d.noConfirmation ? 'warning' : undefined },
            { label: 'Remaining after this milestone', value: inr(remaining), source: 'formula' },
          ],
        },
        {
          title: `Invoice ${d.invoice.no}`,
          rows: [
            { label: 'Amount before GST', value: inr(d.invoice.amount), strong: true },
            { label: `GST ${d.invoice.gstPct}%`, value: inr((d.invoice.amount * d.invoice.gstPct) / 100), source: 'ready calculation' },
            { label: 'Above the confirmed milestone', value: over > 0 ? `${inr(over)} (${((over / d.wo.confirmed) * 100).toFixed(1)}%)` : 'No', tone: over > 0 ? 'warning' : 'success', source: 'formula' },
            ...varianceRows(d.variance),
          ],
        },
      ];
    },
    fields: (item) => [
      { key: 'ledger', label: 'Expense ledger', input: 'select', options: ['Contract labour – Packing', 'Contract labour – Production', 'Repairs and maintenance', 'Housekeeping'], required: true, hint: 'Suggested from past postings for this vendor.' },
      ...((item.data as unknown as ServiceData).noConfirmation
        ? [{ key: 'outcome', label: 'What to do', input: 'select' as const, options: ['Post and send', 'Route as exception'], required: true, hint: 'No confirmation: route it as an exception.' }]
        : []),
    ],
    checks: (item, values) => {
      const d = item.data as unknown as ServiceData;
      const over = d.invoice.amount - d.wo.confirmed;
      const outcome = str(values.outcome);
      const out: Check[] = [];
      if (!str(values.ledger)) out.push({ id: 'ledger', result: 'stop', title: 'Pick the expense ledger' });
      if (d.noConfirmation) {
        if (!outcome) out.push({ id: 'confirm', result: 'stop', title: 'No completion confirmation: choose post or route' });
        else if (outcome === 'Post and send') out.push({ id: 'confirm', result: 'stop', title: 'No completion confirmation: a bill is never posted as normal without one', detail: 'Route it as an exception to the Accounts Manager.' });
        else out.push({ id: 'confirm', result: 'reason', title: 'Routed as exception: no completion confirmation', reader: 'rajan' });
      } else out.push({ id: 'confirm', result: 'ok', title: `${d.wo.milestone} milestone confirmed by ${d.wo.confirmedBy}` });
      const vc = varianceCheck(d.variance, over > 0, 'Kiran (Contracts & Services Officer)');
      if (vc) out.push(vc);
      if (d.invoice.amount > d.wo.total - d.wo.billedBefore) out.push({ id: 'contract', result: 'stop', title: 'Above the remaining contract value' });
      else out.push({ id: 'contract', result: 'ok', title: 'Within the remaining contract value' });
      return out;
    },
    chain: () => ['rajan'],
    sendLabel: (_i, values) => (str(values.outcome) === 'Route as exception' ? 'Route to Accounts Manager' : 'Post & send to Accounts Manager'),
    summary: (item) => {
      const d = item.data as unknown as ServiceData;
      const over = d.invoice.amount - d.wo.confirmed;
      const v = d.variance ? (d.variance.approvedBy ? ' · variance decided' : ' · variance with Rajan') : '';
      return `${d.wo.no} · ${inr(d.invoice.amount)}${over > 0 ? ` · ${inr(over)} above milestone` : ''}${d.noConfirmation ? ' · no confirmation' : ''}${v}`;
    },
  },

  // ===================== T3 Allocate landed cost =====================
  landed: {
    facts: (item, c) => {
      const d = item.data as unknown as LandedData;
      const v = workOf(c, d.voucherId);
      const basis = str(item.values.basis) || 'Quantity';
      return [
        {
          title: 'Charge',
          rows: [
            { label: d.label, value: inr(d.charge), strong: true },
            { label: 'Material voucher', value: `${d.voucherId} · ${d.vendorName} · ${v ? (posted(v) ? 'posted' : 'not posted yet') : '—'}` },
            { label: 'Material received', value: `${d.qty.toLocaleString('en-IN')} ${d.uom} · ${inr(d.value)}` },
          ],
        },
        {
          title: 'Result',
          aside: 'formula',
          rows:
            basis === 'Value'
              ? [{ label: 'Added to the material value', value: `${((d.charge / d.value) * 100).toFixed(2)}% of ${inr(d.value)}`, strong: true }]
              : [{ label: `Per ${d.uom}`, value: `${inr(d.charge)} ÷ ${d.qty.toLocaleString('en-IN')} = ₹${perUnit(d.charge, d.qty).toFixed(4)}`, strong: true }],
        },
      ];
    },
    fields: () => [{ key: 'basis', label: 'Apportion by', input: 'select', options: ['Quantity', 'Weight', 'Value'], required: true }],
    checks: (item, _values, c) => {
      const d = item.data as unknown as LandedData;
      const v = workOf(c, d.voucherId);
      return [posted(v) ? { id: 'voucher', result: 'ok', title: `Voucher ${d.voucherId} is posted` } : { id: 'voucher', result: 'stop', title: `Post the material voucher ${d.voucherId} first (T1)` }];
    },
    chain: () => ['rajan'],
    sendLabel: () => 'Allocate & send to Accounts Manager',
    summary: (item) => {
      const d = item.data as unknown as LandedData;
      return `${inr(d.charge)} over ${d.qty.toLocaleString('en-IN')} ${d.uom} · ${d.vendorName}`;
    },
  },

  // ===================== T4 Raise a debit note =====================
  debit: {
    facts: (item, c) => {
      const d = item.data as unknown as DebitData;
      const v = vendorOf(c, d.vendorId);
      const qty = num(item.values.qty);
      return [
        {
          title: 'From the return document',
          aside: 'from Stores (pre-filled from the QC rejection)',
          rows: [
            { label: 'Vendor', value: v?.name ?? d.vendorId },
            { label: 'Original voucher', value: `${d.voucherId} · PO ${d.po}` },
            { label: 'Rejected and returned', value: `${d.rejectedQty.toLocaleString('en-IN')} ${d.uom} · ${d.qcReason}` },
            { label: 'Rate on the voucher', value: inr(d.rate) },
          ],
        },
        {
          title: 'Debit note',
          aside: 'formula',
          rows: [
            { label: 'Value', value: `${qty.toLocaleString('en-IN')} ${d.uom} × ${inr(d.rate)} = ${inr(qty * d.rate)}` },
            { label: `GST ${d.gstPct}%`, value: inr(Math.round((qty * d.rate * d.gstPct) / 100)) },
            { label: 'Total', value: inr(qty * d.rate + Math.round((qty * d.rate * d.gstPct) / 100)), strong: true },
          ],
        },
      ];
    },
    fields: (item) => [
      { key: 'type', label: 'Type', input: 'select', options: ['Return', 'Price', 'Quantity'], required: true },
      { key: 'qty', label: `Quantity (${(item.data as unknown as DebitData).uom})`, input: 'number', required: true, hint: 'Pre-filled from the QC rejection.' },
      { key: 'narration', label: 'Narration', input: 'textarea' },
    ],
    checks: (item, values, c) => {
      const d = item.data as unknown as DebitData;
      const qty = num(values.qty);
      const out: Check[] = [];
      if (qty <= 0) out.push({ id: 'qty', result: 'stop', title: 'Enter the quantity' });
      else if (qty > d.rejectedQty) out.push({ id: 'qty', result: 'stop', title: `More than rejected (${d.rejectedQty.toLocaleString('en-IN')} ${d.uom})` });
      else out.push({ id: 'qty', result: 'ok', title: 'Quantity within what QC rejected' });
      const voucherOk = d.voucherPostedBefore || posted(workOf(c, d.voucherId));
      out.push(voucherOk ? { id: 'voucher', result: 'ok', title: `Against voucher ${d.voucherId}` } : { id: 'voucher', result: 'stop', title: `Post the original voucher ${d.voucherId} first (T1)` });
      if (d.holdAmount) out.push({ id: 'hold', result: 'warn', title: `Sunil (Payables) holds ${inr(d.holdAmount)} on this vendor's invoice`, detail: 'He is told when you send, so the hold can be released once the debit note exists.' });
      return out;
    },
    chain: () => ['rajan'],
    cc: (item) => ((item.data as unknown as DebitData).holdAmount ? ['sunil'] : []),
    sendLabel: () => 'Raise & send to Accounts Manager',
    summary: (item) => {
      const d = item.data as unknown as DebitData;
      return `${d.rejectedQty.toLocaleString('en-IN')} ${d.uom} × ${inr(d.rate)} = ${inr(d.rejectedQty * d.rate)} + GST`;
    },
  },

  // ===================== T5 Book a supplier credit note =====================
  creditNote: {
    facts: (item, c) => {
      const d = item.data as unknown as CreditNoteData;
      const dn = c.work.find((w) => w.task === 'T4' && w.partyId === d.vendorId && posted(w));
      const value = d.qty * d.rate;
      return [
        {
          title: `Credit note ${d.cnNo}`,
          aside: 'read by OCR',
          rows: [
            { label: 'For', value: d.forWhat },
            { label: 'Value', value: inr(value) },
            { label: `GST ${d.gstPct}% (ITC to reverse)`, value: inr(Math.round((value * d.gstPct) / 100)) },
            { label: 'Against voucher', value: d.voucherRef },
          ],
        },
        { title: 'Debit notes for the same return', rows: [{ label: 'Already raised', value: dn ? `${dn.id} · ${inr(dn.amount)} (${dn.status === 'Approved' ? 'approved' : 'with the Accounts Manager'})` : 'None', tone: dn ? 'warning' : undefined }] },
      ];
    },
    fields: () => [{ key: 'howToBook', label: 'How to book it', input: 'select', options: ['Against our debit note: no second reduction', 'Extra reduction: the vendor allowed more'], hint: 'Asked only when a debit note already covers the same return.' }],
    checks: (item, values, c) => {
      const d = item.data as unknown as CreditNoteData;
      const dn = c.work.find((w) => w.task === 'T4' && w.partyId === d.vendorId && posted(w));
      const how = str(values.howToBook);
      const out: Check[] = [];
      if (dn && !how) out.push({ id: 'overlap', result: 'stop', title: `Debit note ${dn.id} already reduces this vendor for the same return`, detail: 'Say how to book this note, so the same return is not reduced twice.' });
      else if (dn && how.startsWith('Extra')) out.push({ id: 'overlap', result: 'reason', title: 'Booked as an extra reduction on top of the debit note', reader: 'rajan' });
      else if (dn) out.push({ id: 'overlap', result: 'ok', title: `Linked to ${dn.id}: no second reduction` });
      else out.push({ id: 'overlap', result: 'warn', title: 'No debit note for this return yet', detail: 'This note will be the only reduction for it.' });
      out.push({ id: 'itc', result: 'warn', title: `ITC of ${inr(Math.round((d.qty * d.rate * d.gstPct) / 100))} to reverse`, detail: 'Flagged to Venkat (Compliance Officer).' });
      return out;
    },
    chain: () => ['rajan'],
    cc: () => ['venkat'],
    sendLabel: () => 'Book & send to Accounts Manager',
    summary: (item) => `${(item.data as unknown as CreditNoteData).cnNo} · ${inr(item.amount)}`,
  },

  // ===================== T6 Request a tax or TDS override =====================
  override: {
    facts: (item) => {
      const d = item.data as unknown as OverrideData;
      return [
        {
          title: 'What the policy engine derived',
          aside: 'ready calculation',
          rows: [
            { label: 'Voucher', value: `${d.voucherId} · ${d.vendorName} · ${inr(d.amount)}` },
            { label: 'Derived', value: d.derived, strong: true },
            { label: 'Why', value: d.derivedWhy },
          ],
        },
      ];
    },
    fields: () => [
      { key: 'asked', label: 'Tax you ask for', input: 'select', options: ['No reverse charge: not a notified purchase from an unregistered person', 'A different GST rate', 'A different TDS section'], required: true },
      { key: 'why', label: 'Reason', input: 'textarea', required: true, hint: 'Read by Venkat (Compliance Officer). Logged whatever the outcome.' },
    ],
    checks: (item, values, c) => {
      const d = item.data as unknown as OverrideData;
      const out: Check[] = [];
      if (!str(values.asked)) out.push({ id: 'asked', result: 'stop', title: 'Pick the tax you ask for' });
      if (!str(values.why)) out.push({ id: 'why', result: 'stop', title: 'A reason is required' });
      if (d.amount > c.rules.overrideFcThreshold) out.push({ id: 'fc', result: 'warn', title: 'Above the value threshold: the Finance Controller decides too' });
      if (out.length === 0) out.push({ id: 'ready', result: 'ok', title: 'Ready to send to the Compliance Officer' });
      return out;
    },
    chain: (item, _v, c) => ((item.data as unknown as OverrideData).amount > c.rules.overrideFcThreshold ? ['venkat', 'usha'] : ['venkat']),
    sendLabel: () => 'Send request to Compliance Officer',
    summary: (item) => `${(item.data as unknown as OverrideData).derived} · ${inr(item.amount)}`,
  },

  // ===================== T7 Vendor finance fields =====================
  vendor: {
    facts: (item) => {
      const d = item.data as unknown as VendorData;
      const p = d.proposal;
      return [
        {
          title: 'Identity',
          aside: 'from Business Core · not edited here',
          rows: [
            { label: 'Name', value: p.name },
            { label: 'GSTIN · PAN', value: `${p.gstin ?? 'None'} · ${p.pan}` },
            { label: 'State', value: p.state },
            { label: 'Supplies', value: p.supplies },
            { label: 'MSME', value: p.msme ? `Yes, ${p.msme}` : 'No', tone: p.msme ? 'info' : undefined },
          ],
        },
        { title: 'Terms', rows: [{ label: 'Usual payment terms', value: `Net ${d.usualTerms} days` }, { label: 'On the quotation and PO', value: `Net ${d.quoteTerms} days` }] },
      ];
    },
    fields: () => [
      { key: 'creditDays', label: 'Credit days', input: 'number', required: true },
      { key: 'ledger', label: 'Ledger', input: 'select', options: ['Sundry Creditors – Raw material', 'Sundry Creditors – Packing material', 'Sundry Creditors – Services'], required: true },
      { key: 'bankAccount', label: 'Bank account number', input: 'text', required: true, hint: 'Checked by penny-drop. Bank details go to the Finance Controller.' },
      { key: 'ifsc', label: 'IFSC', input: 'text', required: true },
      { key: 'callBack', label: 'Call-back evidence', input: 'text', required: true, hint: 'Who confirmed the account with the vendor, and when. Read by the Finance Controller.' },
    ],
    checks: (item, values, c) => {
      const d = item.data as unknown as VendorData;
      const out: Check[] = [];
      const days = num(values.creditDays);
      const acct = str(values.bankAccount);
      const ifsc = str(values.ifsc).toUpperCase();
      if (!str(values.ledger)) out.push({ id: 'ledger', result: 'stop', title: 'Map the ledger' });
      if (!acct || !ifsc) out.push({ id: 'bank', result: 'stop', title: 'Enter the bank account and IFSC' });
      else if (!IFSC.test(ifsc)) out.push({ id: 'bank', result: 'stop', title: `IFSC ${ifsc} is not valid`, detail: '4 letters, 0, then 6 letters or digits.' });
      else {
        const other = c.vendors.find((v) => v.bankAccount === acct && v.id !== d.proposal.id);
        if (other) out.push({ id: 'bank', result: 'stop', title: `Account already used by ${other.name}`, detail: 'The same bank account on two vendors is not allowed.' });
        else out.push({ id: 'bank', result: 'ok', title: `Penny-drop: name at bank ${d.proposal.name.toUpperCase()}, matches` });
      }
      if (d.proposal.msme && days > c.rules.msmeMaxDays) out.push({ id: 'msme', result: 'stop', title: `More than ${c.rules.msmeMaxDays} days for an MSME vendor` });
      else if (d.proposal.msme) out.push({ id: 'msme', result: 'warn', title: `MSME (${d.proposal.msme}): pay within ${c.rules.msmeMaxDays} days of acceptance` });
      if (days && days !== d.quoteTerms) out.push({ id: 'terms', result: 'warn', title: `The quotation and PO say Net ${d.quoteTerms} days`, detail: 'The PO terms apply to that PO; the master holds the vendor\'s usual terms.' });
      return out;
    },
    chain: () => ['rajan', 'usha'],
    sendLabel: () => 'Save & send for checking',
    summary: (item) => {
      const d = item.data as unknown as VendorData;
      return `New vendor proposed · ${d.proposal.supplies}${d.proposal.msme ? ` · MSME ${d.proposal.msme}` : ''}`;
    },
  },

  // ===================== T8 Item accounting fields =====================
  item: {
    facts: (item) => {
      const d = item.data as unknown as ItemData;
      return [
        {
          title: 'New Item Request',
          aside: 'from the Stores / Inventory Officer',
          rows: [
            { label: 'Asked for', value: d.request },
            { label: 'Closest existing item', value: d.closest, source: 'duplicate check', tone: 'warning' },
            { label: 'Unit', value: d.uom },
          ],
        },
      ];
    },
    fields: () => [
      { key: 'code', label: 'Item code', input: 'text', required: true },
      { key: 'name', label: 'Item name', input: 'text', required: true },
      { key: 'hsn', label: 'HSN', input: 'text', required: true, hint: 'Suggested from the description and similar items.' },
      { key: 'gstRate', label: 'GST rate', input: 'select', options: ['5', '12', '18'], required: true },
      { key: 'costing', label: 'Costing method', input: 'select', options: ['Moving average', 'FIFO', 'Standard'], readOnly: true, hint: "From the item group: the Accounts Manager's policy, not changed here." },
      { key: 'group', label: 'Item group', input: 'select', options: ['Raw material', 'Packing material', 'Finished goods'], required: true },
      { key: 'stockLedger', label: 'Stock ledger', input: 'select', options: ['Stock – Raw material', 'Stock – Packing material', 'Stock – Finished goods'], required: true },
    ],
    checks: (_item, values, c) => {
      const out: Check[] = [];
      const code = str(values.code);
      if (!code) out.push({ id: 'code', result: 'stop', title: 'Enter the item code' });
      else if (c.items.some((i) => i.code === code)) out.push({ id: 'code', result: 'stop', title: `${code} already exists` });
      else out.push({ id: 'code', result: 'ok', title: `${code} is free` });
      if (!str(values.hsn)) out.push({ id: 'hsn', result: 'stop', title: 'Enter the HSN' });
      else if (str(values.hsn).startsWith('3920') && str(values.gstRate) !== '18') out.push({ id: 'hsn', result: 'reason', title: `HSN 3920 is usually 18%, not ${str(values.gstRate)}%`, reader: 'rajan' });
      out.push({ id: 'dup', result: 'warn', title: 'Close to an existing item', detail: 'Suresh says the printed variant is distinct from the plain roll.' });
      return out;
    },
    chain: () => ['rajan'],
    cc: () => ['suresh'],
    sendLabel: () => 'Create & send for approval',
    summary: (item) => `"${(item.data as unknown as ItemData).request}" · closest ${(item.data as unknown as ItemData).closest.split(' ')[0]}`,
  },

  // ===================== Runs: T9 · T14 · T18 · T19 · T20 with a decision per line; T10 lines; T11 · T15 · T21 · T23 =====================
  stockRecon: {
    facts: (item) => batchFacts(item, 'Breaks: stock vs stock ledger'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Send to Accounts Manager',
    summary: (item) => batchSummary(item, 'break'),
  },
  nrv: {
    facts: (item) => {
      const d = item.data as unknown as BatchData;
      return [{ title: 'Suggested provision', aside: 'ready calculation: ageing, expiry, price below cost', rows: d.lines.map((l) => ({ label: l.label, value: `${inr(l.amount)} · ${l.detail}` })) }];
    },
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan', 'usha'],
    sendLabel: () => 'Send draft for review',
    summary: (item) => batchSummary(item, 'line'),
  },
  periodicClose: {
    facts: (item) => batchFacts(item, 'Closing stock and COGS'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Post & send to Accounts Manager',
    summary: () => 'Closing stock and cost of goods sold for the month',
  },
  tds26as: {
    facts: (item) => batchFacts(item, '26AS/AIS lines'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    // An unclaimable write-off goes on to the Finance Controller (§22.4); an escalation is told to the Compliance Officer (§21.4).
    chain: (item, values) => (lineChoices(item, values).some((x) => x.startsWith('Write off')) ? ['rajan', 'usha'] : ['rajan']),
    cc: (item, values) => (lineChoices(item, values).some((x) => x.startsWith('Escalate')) ? ['venkat'] : []),
    sendLabel: () => 'Send to Accounts Manager',
    summary: (item) => batchSummary(item, 'line'),
  },
  provision: {
    facts: (item) => batchFacts(item, 'Provision run'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan', 'usha'],
    sendLabel: () => 'Send run for checking',
    summary: () => 'Doubtful-debt provision for the month',
  },
  fxReval: {
    facts: (item) => batchFacts(item, 'FX revaluation of open items'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Send to Accounts Manager',
    summary: () => 'Foreign-currency open items revalued at month end',
  },
  grni: {
    facts: (item) => batchFacts(item, 'GRNs with no invoice at the cut-off'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Book & send to Accounts Manager',
    summary: (item) => batchSummary(item, 'GRN'),
  },
  stdCost: {
    facts: (item) => batchFacts(item, 'Purchase-price and usage variances'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Send review to Accounts Manager',
    summary: (item) => batchSummary(item, 'variance'),
  },
  stockStmt: {
    facts: (item) => batchFacts(item, 'Stock statement from the book valuation'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    cc: () => ['venkat'],
    sendLabel: () => 'Send for confirmation',
    summary: (item) => `${(item.data as unknown as BatchData).intro}${(item.data as unknown as BatchData).ran ? '' : ' · not run yet'}`,
  },
  arapRecon: {
    facts: (item) => batchFacts(item, 'Control accounts vs open items'),
    fields: () => [],
    checks: (item, values) => batchLinesChecks(item, values, 'rajan'),
    chain: () => ['rajan'],
    sendLabel: () => 'Send to Accounts Manager',
    summary: (item) => batchSummary(item, 'break'),
  },

  // ===================== T12 Customer finance fields =====================
  customer: {
    facts: (item, c) => {
      const d = item.data as unknown as CustomerData;
      const cu = customerOf(c, d.customerId);
      return [
        {
          title: 'Customer',
          aside: 'identity from Business Core',
          rows: [
            { label: 'Customer', value: `${d.customerId} · ${cu?.name ?? ''}` },
            { label: 'Credit days', value: `${cu?.creditDays ?? '—'} days` },
            { label: 'Ledger', value: cu?.ledger ?? '—' },
            { label: 'Billing instructions', value: cu?.billingInstructions ?? '—' },
          ],
        },
        {
          title: 'Recommendation',
          aside: 'from the Credit Controller',
          rows: [
            { label: 'Current limit', value: inr(d.current) },
            { label: 'Recommended by Farid', value: inr(d.recommended), strong: true },
            { label: 'His reason', value: d.recommendedWhy },
          ],
        },
      ];
    },
    fields: () => [
      { key: 'newValue', label: 'New credit limit', input: 'money', required: true, hint: 'Pre-filled from the recommendation.' },
      { key: 'note', label: 'Note', input: 'textarea' },
    ],
    checks: (item, values) => {
      const d = item.data as unknown as CustomerData;
      const v = num(values.newValue);
      const out: Check[] = [];
      if (!v) out.push({ id: 'value', result: 'stop', title: 'Enter the new limit' });
      else if (v === d.current) out.push({ id: 'value', result: 'stop', title: 'Same as the current limit' });
      else if (v !== d.recommended) out.push({ id: 'value', result: 'reason', title: `Differs from the recommendation (${inr(d.recommended)})`, reader: 'farid' });
      else out.push({ id: 'value', result: 'ok', title: 'Matches the Credit Controller\'s recommendation' });
      out.push({ id: 'chain', result: 'ok', title: 'The Credit Controller checks it, then the Accounts Manager confirms' });
      return out;
    },
    chain: () => ['farid', 'rajan'],
    sendLabel: () => 'Save & send to Credit Controller',
    summary: (item) => {
      const d = item.data as unknown as CustomerData;
      return `Credit limit ${inr(d.current)} → ${inr(d.recommended)} (recommended)`;
    },
  },

  // ===================== T13 Advance against an SO =====================
  advance: {
    facts: (item, c) => {
      const d = item.data as unknown as AdvanceData;
      const g = gstInAdvance(d.amount, d.gstPct);
      const cu = customerOf(c, d.customerId);
      return [
        {
          title: 'Receipt',
          aside: 'from Collections (recorded on account)',
          rows: [
            { label: 'Customer', value: `${d.customerId} · ${cu?.name ?? ''}` },
            { label: 'Receipt', value: `${d.receipt} · ${fmtDate(d.receivedOn)}` },
            { label: 'Amount', value: inr(d.amount), strong: true },
          ],
        },
        {
          title: `Sales order ${d.soId}`,
          rows: [
            { label: 'Order value', value: inr(d.soValue) },
            { label: 'Kind', value: d.service ? 'Service (co-packing)' : 'Goods' },
            { label: `GST included in the advance (${d.gstPct}%)`, value: d.service ? `${inr(g.tax)} on ${inr(g.taxable)}` : 'Not due on goods', source: 'formula' },
            ...(d.refunded ? [{ label: 'Status', value: 'Order cancelled; refund voucher issued by Billing', tone: 'warning' as const }] : []),
          ],
        },
      ];
    },
    fields: () => [
      { key: 'so', label: 'Sales order', input: 'select', options: ['SO-6'], required: true },
      { key: 'gstOnAdvance', label: 'GST on advance', input: 'select', options: ['Yes', 'No'], required: true, hint: 'Suggested: yes for a service.' },
    ],
    checks: (item, values) => {
      const d = item.data as unknown as AdvanceData;
      const out: Check[] = [];
      if (d.service && str(values.gstOnAdvance) === 'No') out.push({ id: 'gst', result: 'reason', title: 'A service advance usually carries GST', reader: 'rajan' });
      else if (str(values.gstOnAdvance) === 'Yes') out.push({ id: 'gst', result: 'ok', title: 'Flagged: Pooja (Billing Executive) issues the GST receipt voucher' });
      if (d.amount > d.soValue) out.push({ id: 'amount', result: 'warn', title: 'Advance is more than the order' });
      else out.push({ id: 'amount', result: 'ok', title: 'Adjusts automatically when the order is invoiced' });
      return out;
    },
    chain: () => ['rajan'],
    cc: (_i, values) => (str(values.gstOnAdvance) === 'Yes' ? ['pooja'] : []),
    sendLabel: () => 'Link & send to Accounts Manager',
    summary: (item) => {
      const d = item.data as unknown as AdvanceData;
      return `${inr(d.amount)} received ${fmtDate(d.receivedOn)} for ${d.soId}${d.refunded ? ' · refunded' : ''}`;
    },
  },

  // ===================== T16 Netting =====================
  netting: {
    facts: (item, c) => {
      const d = item.data as unknown as NettingData;
      const cu = customerOf(c, d.customerId);
      return [
        {
          title: 'Same party on both sides',
          aside: `PAN ${d.pan}`,
          rows: [
            { label: `Customer ${d.customerId} · ${cu?.name ?? ''}`, value: `${inr(d.receivable)} receivable` },
            { label: `Vendor · ${d.vendorName}`, value: `${inr(d.payable)} payable` },
            { label: 'Net', value: `${inr(Math.abs(d.receivable - d.payable))} ${d.receivable >= d.payable ? 'receivable' : 'payable'}`, source: 'formula', strong: true },
            { label: 'Linked in Business Core', value: d.linked ? 'Yes' : 'No: a link suggestion goes with this', tone: d.linked ? undefined : 'warning' },
            { label: 'Set-off rule', value: "The Compliance Officer's payment-recognition rule", source: 'from the Compliance Officer' },
          ],
        },
      ];
    },
    fields: () => [{ key: 'amount', label: 'Amount to set off', input: 'money', required: true }],
    checks: (item, values, c) => {
      const d = item.data as unknown as NettingData;
      const a = num(values.amount);
      const max = Math.min(d.receivable, d.payable);
      const out: Check[] = [];
      if (a <= 0) out.push({ id: 'amount', result: 'stop', title: 'Enter the amount' });
      else if (a > max) out.push({ id: 'amount', result: 'stop', title: `More than the smaller balance (${inr(max)})` });
      else out.push({ id: 'amount', result: 'ok', title: 'Within both balances' });
      if (!d.linked) out.push({ id: 'link', result: 'warn', title: 'Not linked yet: a link suggestion is sent to Business Core' });
      if (a > c.rules.nettingFcThreshold) out.push({ id: 'fc', result: 'warn', title: 'Above the netting threshold: the Finance Controller checks too' });
      return out;
    },
    chain: (_i, values, c) => (num(values.amount) > c.rules.nettingFcThreshold ? ['rajan', 'usha'] : ['rajan']),
    sendLabel: () => 'Prepare & send for checking',
    summary: (item) => {
      const d = item.data as unknown as NettingData;
      return `Receivable ${inr(d.receivable)} · payable ${inr(d.payable)}`;
    },
  },

  // ===================== T17 Udyam data =====================
  udyam: {
    facts: (item, c) => {
      const d = item.data as unknown as UdyamData;
      const v = vendorOf(c, d.vendorId);
      return [
        {
          title: 'Vendor',
          rows: [
            { label: 'Vendor', value: v?.name ?? d.vendorId },
            { label: 'MSME on record', value: v?.msme ? `Yes, ${v.msme}` : 'Not known', tone: v?.msme ? 'info' : 'warning' },
            { label: 'Udyam number on record', value: v?.udyam ?? 'None' },
            ...(d.given ? [{ label: 'Given by the vendor', value: d.given }] : []),
          ],
        },
      ];
    },
    fields: (item) =>
      (item.data as unknown as UdyamData).mode === 'verify'
        ? [
            { key: 'udyam', label: 'Udyam number', input: 'text', required: true, hint: 'UDYAM-KR-03-0012345' },
            { key: 'category', label: 'Category', input: 'select', options: ['Micro', 'Small', 'Medium'], required: true },
          ]
        : [{ key: 'action', label: 'What to do', input: 'select', options: ['Send a reminder to the vendor', 'Record: not an MSME (declaration received)'], required: true }],
    checks: (item, values) => {
      const d = item.data as unknown as UdyamData;
      if (d.mode === 'verify') {
        const u = str(values.udyam).toUpperCase();
        return [UDYAM.test(u) ? { id: 'format', result: 'ok', title: 'Udyam number format and status checked' } : { id: 'format', result: 'stop', title: 'Udyam number format is not valid', detail: 'UDYAM-<state>-<2 digits>-<7 digits>' }];
      }
      const a = str(values.action);
      if (!a) return [{ id: 'action', result: 'stop', title: 'Choose what to do' }];
      return a.startsWith('Record') ? [{ id: 'record', result: 'reason', title: 'Recorded as not an MSME', reader: 'rajan' }] : [{ id: 'remind', result: 'ok', title: 'A reminder goes to the vendor; nothing changes on the record' }];
    },
    chain: (item, values) => ((item.data as unknown as UdyamData).mode === 'missing' && str(values.action).startsWith('Send') ? [] : ['rajan']),
    sendLabel: (item, values) => ((item.data as unknown as UdyamData).mode === 'missing' && str(values.action).startsWith('Send') ? 'Send reminder' : 'Save & send for checking'),
    summary: (item) => ((item.data as unknown as UdyamData).mode === 'verify' ? 'Udyam number to verify' : 'No answer to the Udyam request'),
  },

  // ===================== T22 ITC reversal on written-off stock =====================
  itcWo: {
    facts: (item) => {
      const d = item.data as unknown as ItcWriteOffData;
      const itc = Math.round((d.value * d.gstPct) / 100);
      return [
        {
          title: `Write-off ${d.writeOffNo}`,
          aside: 'from Stores, approved by the Inventory Controller',
          rows: [
            { label: 'Item and batch', value: `${d.item} · ${d.batch}` },
            { label: 'Written off', value: `${d.qty.toLocaleString('en-IN')} ${d.uom} · ${inr(d.value)} · ${d.reason}` },
            { label: 'Made by · approved by', value: `${d.madeBy === 'suresh' ? 'Suresh (Stores)' : d.madeBy} · ${d.approvedBy === 'anand' ? 'Anand (Inventory Controller)' : d.approvedBy}` },
          ],
        },
        {
          title: 'ITC to reverse',
          aside: 'ready calculation · Sec 17(5)',
          rows: [
            { label: 'ITC taken on the goods', value: d.itcTaken ? `${d.gstPct}% on purchase` : 'None', tone: d.itcTaken ? undefined : 'info' },
            { label: 'To reverse', value: d.itcTaken ? `${inr(d.value)} × ${d.gstPct}% = ${inr(itc)}` : '₹0', strong: true, source: 'formula' },
          ],
        },
      ];
    },
    fields: () => [{ key: 'note', label: 'Note', input: 'textarea' }],
    checks: (item) => {
      const d = item.data as unknown as ItcWriteOffData;
      return [
        { id: 'approved', result: 'ok', title: 'The write-off is approved' },
        d.itcTaken
          ? { id: 'itc', result: 'warn', title: `ITC ${inr(Math.round((d.value * d.gstPct) / 100))} reversed against the write-off`, detail: 'Checked by Venkat (Compliance Officer).' }
          : { id: 'itc', result: 'warn', title: 'No ITC was taken on these goods: nothing to reverse' },
      ];
    },
    chain: () => ['venkat'],
    sendLabel: () => 'Book & send to Compliance Officer',
    summary: (item) => {
      const d = item.data as unknown as ItcWriteOffData;
      return `${d.writeOffNo} · ITC ${inr(Math.round((d.value * d.gstPct) / 100))} to reverse`;
    },
  },
};

/** The choice made on each line of a run (the default where none is picked). */
function lineChoices(item: WorkItem, values: Record<string, FieldValue>): string[] {
  const d = item.data as unknown as BatchData;
  if (!d.ran) return [];
  return d.lines.filter((l) => !l.auto).map((l) => str(values[`line:${l.id}`]) || l.options[0]);
}

function batchSummary(item: WorkItem, noun: string) {
  const d = item.data as unknown as BatchData;
  if (!d.ran) return `${d.intro} · not run yet`;
  const open = d.lines.filter((l) => !l.auto).length;
  return `${d.lines.length} ${noun}${d.lines.length === 1 ? '' : 's'}${open ? ` · ${open} to decide` : ''}`;
}

export const specOf = (item: WorkItem) => SPECS[item.kind];

/** Is a check answered? A stop never is; a reason is once its value is filled. */
export function isMet(check: Check, values: Record<string, FieldValue>): boolean {
  if (check.result === 'stop') return false;
  if (check.result === 'reason') return str(values[check.field ?? `why:${check.id}`]) !== '';
  return true;
}

/** What still blocks sending. Required fields count too. */
export function blockers(item: WorkItem, c: Ctx, values = item.values): string[] {
  const spec = specOf(item);
  // Discarding a duplicate needs only the answer that it is one.
  if (spec.discards?.(values)) return [];
  const fields = spec.fields(item, values, c);
  const fieldKeys = new Set(fields.map((f) => f.key));
  const out: string[] = [];
  fields.forEach((f) => {
    if (f.required && !f.readOnly && str(values[f.key]) === '') out.push(`${f.label} is required`);
  });
  spec.checks(item, values, c).forEach((ch) => {
    if (isMet(ch, values)) return;
    if (ch.result === 'stop') out.push(ch.title);
    // A reason answered by a form field is already listed as a required field.
    else if (!fieldKeys.has(ch.field ?? '')) out.push(`${ch.title}: give a reason`);
  });
  return [...new Set(out)];
}

/** The checks that ask for a free-text reason (not answered by a form field). */
export function reasonChecks(item: WorkItem, c: Ctx, values = item.values): Check[] {
  const spec = specOf(item);
  const fieldKeys = new Set(spec.fields(item, values, c).map((f) => f.key));
  return spec.checks(item, values, c).filter((ch) => ch.result === 'reason' && !fieldKeys.has(ch.field ?? ''));
}

/** Coming-up date for a month-end item. */
export const monthEnd = (date: string) => {
  const [y, m] = date.split('-').map(Number);
  return addDays(`${m === 12 ? y + 1 : y}-${String((m % 12) + 1).padStart(2, '0')}-01`, -1);
};

export { fxRevaluation };
