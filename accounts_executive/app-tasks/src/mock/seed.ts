// Seed data for the Accounts Executive mockup: the biscuit plant of the shared scenario
// (docs/reference-company/full-scenario.md §2), seen from the accounts side.
// Identifiers are synthetic fixture data. Values with no scenario step are marked ILLUSTRATIVE.

import type { BatchData, CustomerData, ItcWriteOffData, LandedData, PvData, ServiceData } from '../domain/tasks';
import { fxRevaluation } from '../domain/accounting';
import type { ActorKey, BatchLine, Customer, Item, ISODateTime, TaskId, Vendor, WorkItem } from '../domain/types';

export const SCENARIO_START: ISODateTime = '2026-10-05T09:00';

export const seedVendors: Vendor[] = [
  { id: 'V-A', name: 'Vendor A', state: 'KA', gstin: '29AAACV1001A1Z5', pan: 'AAACV1001A', creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234560011', ifsc: 'HDFC0001234', msme: null, udyam: null, fyPurchases: 46_20_000, approved: true, supplies: 'Maida' },
  { id: 'V-B', name: 'Vendor B', state: 'KA', gstin: '29AAACV1002B1Z3', pan: 'AAACV1002B', creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234560022', ifsc: 'HDFC0001234', msme: null, udyam: null, fyPurchases: 18_40_000, approved: true, supplies: 'Maida, sugar' },
  { id: 'V-C', name: 'Vendor C', state: 'KA', gstin: '29AAACV1003C1Z1', pan: 'AAACV1003C', creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234567811', ifsc: 'ICIC0004321', msme: null, udyam: null, fyPurchases: 38_00_000, approved: true, supplies: 'Sugar, maida' },
  { id: 'V-D', name: 'Vendor D', state: 'KA', gstin: '29AAACV1004D1Z9', pan: 'AAACV1004D', creditDays: 45, ledger: 'Sundry Creditors – Packing material', bankAccount: '50100234560044', ifsc: 'SBIN0012345', msme: null, udyam: null, fyPurchases: 21_00_000, approved: true, supplies: 'Laminate film' },
  { id: 'V-E', name: 'Vendor E', state: 'KA', gstin: '29AAACV1005E1Z7', pan: 'AAACV1005E', creditDays: 45, ledger: 'Sundry Creditors – Packing material', bankAccount: '50100234560055', ifsc: 'SBIN0012345', msme: 'small', udyam: 'UDYAM-KR-03-0004455', fyPurchases: 9_10_000, approved: true, supplies: 'Corrugated cartons' },
  { id: 'V-F', name: 'Vendor F', state: 'KA', gstin: '29AAACV1006F1Z5', pan: 'AAACV1006F', creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234560066', ifsc: 'CNRB0001111', msme: null, udyam: null, fyPurchases: 2_25_000, approved: true, supplies: 'Vanilla flavour' },
  { id: 'V-G', name: 'Vendor G', state: 'GJ', gstin: '24AAACV1007G1Z2', pan: 'AAACV1007G', creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234560077', ifsc: 'UTIB0002222', msme: null, udyam: null, fyPurchases: 31_00_000, approved: true, supplies: 'Skimmed milk powder' },
  { id: 'V-J', name: 'Vendor J', state: 'KL', gstin: '32AAACV1009J1Z6', pan: 'AAACV1009J', creditDays: 30, ledger: 'Sundry Creditors – Raw material', bankAccount: '50100234560099', ifsc: 'FDRL0003333', msme: null, udyam: null, fyPurchases: 4_00_000, approved: true, supplies: 'Cocoa powder' },
  { id: 'V-LT', name: 'Local trader (food colour)', state: 'KA', gstin: null, pan: 'ABCPL1234T', creditDays: 0, ledger: 'Sundry Creditors – Raw material', bankAccount: null, ifsc: null, msme: null, udyam: null, fyPurchases: 0, approved: true, supplies: 'Food colour' },
  { id: 'V-SM', name: 'Shakti Manpower', state: 'KA', gstin: '29AAACS2001S1Z4', pan: 'AAACS2001S', creditDays: 30, ledger: 'Sundry Creditors – Services', bankAccount: '50100234561201', ifsc: 'HDFC0001234', msme: null, udyam: null, fyPurchases: 12_00_000, approved: true, supplies: 'Packing-line manpower (WO-0021)' },
  { id: 'V-HB', name: 'Healthy Bite Foods (packing services)', state: 'KA', gstin: '29AAJCH0000H1Z8', pan: 'AAJCH0000H', creditDays: 30, ledger: 'Sundry Creditors – Services', bankAccount: '50100234561301', ifsc: 'KKBK0004444', msme: null, udyam: null, fyPurchases: 36_000, approved: true, supplies: 'Packing services (ILLUSTRATIVE)' },
];

/** Vendor H is not in the master on 05-Oct; Ravi proposes it on 07-Oct (A1-17). */
export const VENDOR_H = { id: 'V-H', name: 'Malnad Cocoa Traders (Vendor H)', state: 'KA', gstin: '29AAHFM0000A1Z5', pan: 'AAHFM0000A', msme: 'micro' as const, supplies: 'Cocoa powder', phone: '+91 98450 00000' };

export const seedCustomers: Customer[] = [
  { id: 'C-01', name: 'Sri Lakshmi Distributors', state: 'KA', creditLimit: 15_00_000, creditDays: 30, ledger: 'Sundry Debtors – Trade', billingInstructions: 'PO reference on every invoice · email' },
  { id: 'C-02', name: 'Chennai Retail Mart', state: 'TN', creditLimit: 10_00_000, creditDays: 45, ledger: 'Sundry Debtors – Trade', billingInstructions: 'Customer portal upload · format B' },
  { id: 'C-03', name: 'Gulf Snack Imports LLC', state: 'UAE', creditLimit: null, creditDays: 0, ledger: 'Sundry Debtors – Export', billingInstructions: 'USD invoice under LUT · courier copy' },
  { id: 'C-04', name: 'Healthy Bite Foods', state: 'KA', creditLimit: 3_00_000, creditDays: 15, ledger: 'Sundry Debtors – Services', billingInstructions: 'Milestone invoices · email' },
  { id: 'C-05', name: 'Namma Bakes', state: 'KA', creditLimit: 5_00_000, creditDays: 30, ledger: 'Sundry Debtors – Trade', billingInstructions: 'Copy with goods' },
  { id: 'C-06', name: 'Kerala Traders', state: 'KL', creditLimit: 5_00_000, creditDays: 30, ledger: 'Sundry Debtors – Trade', billingInstructions: 'Email' },
];

export const seedItems: Item[] = [
  { code: 'RM-001', name: 'Maida', uom: 'kg', hsn: '1101', gstRate: 5, costing: 'Moving average', group: 'Raw material', stockLedger: 'Stock – Raw material' },
  { code: 'RM-002', name: 'Sugar', uom: 'kg', hsn: '1701', gstRate: 5, costing: 'Moving average', group: 'Raw material', stockLedger: 'Stock – Raw material' },
  { code: 'RM-003', name: 'Skimmed milk powder', uom: 'kg', hsn: '0402', gstRate: 5, costing: 'FIFO', group: 'Raw material', stockLedger: 'Stock – Raw material' },
  { code: 'RM-004', name: 'Vanilla flavour', uom: 'litre', hsn: '3302', gstRate: 18, costing: 'Moving average', group: 'Raw material', stockLedger: 'Stock – Raw material' },
  { code: 'RM-005', name: 'Cocoa powder', uom: 'kg', hsn: '1805', gstRate: 5, costing: 'Moving average', group: 'Raw material', stockLedger: 'Stock – Raw material' },
  { code: 'PM-001', name: 'Laminate film roll', uom: 'kg', hsn: '3920', gstRate: 18, costing: 'Moving average', group: 'Packing material', stockLedger: 'Stock – Packing material' },
  // ILLUSTRATIVE: cartons costed at standard, so T20 has a variance to review
  { code: 'PM-002', name: 'Corrugated carton', uom: 'nos', hsn: '4819', gstRate: 18, costing: 'Standard', group: 'Packing material', stockLedger: 'Stock – Packing material' },
];

// ---------- documents that arrive (one template per work item) ----------

type Template = Pick<WorkItem, 'id' | 'task' | 'kind' | 'title' | 'partyId' | 'partyName' | 'ref' | 'amount' | 'from' | 'data' | 'values'> & { dueOn?: string };

const line = (id: string, label: string, detail: string, amount: number, options: string[] = ['—'], needsReason: string[] = [], auto = false): BatchLine => ({ id, label, detail, amount, options, needsReason, auto });

export const TEMPLATES: Record<string, Template> = {
  // T13 — B1-06, B4-10: C-04's ₹59,000 advance of 03-Oct, for service order SO-6
  'ADV-0311': {
    id: 'ADV-0311', task: 'T13', kind: 'advance', title: 'Advance ₹59,000 · Healthy Bite Foods', partyId: 'C-04', partyName: 'Healthy Bite Foods', ref: 'SO-6', amount: 59_000, from: 'hema',
    data: { customerId: 'C-04', receipt: 'RCPT-0311', receivedOn: '2026-10-03', amount: 59_000, soId: 'SO-6', soValue: 1_06_200, service: true, gstPct: 18 },
    values: { so: 'SO-6', gstOnAdvance: 'Yes' },
  },
  // T2 — A2-04: Shakti Manpower's September bill, ₹25,000 above the confirmed milestone.
  // Kiran (Contracts & Services) matched it and raised the variance; Rajan decides it before Teja posts.
  'SB-0021-09': {
    id: 'SB-0021-09', task: 'T2', kind: 'service', title: 'September bill · Shakti Manpower', partyId: 'V-SM', partyName: 'Shakti Manpower', ref: 'WO-0021', amount: 2_65_000, from: 'kiran',
    data: {
      vendorId: 'V-SM',
      wo: { no: 'WO-0021', title: 'Packing-line manpower, 40 workers, 5% retention', monthly: 2_40_000, total: 28_80_000, billedBefore: 12_00_000, milestone: 'September', confirmed: 2_40_000, confirmedBy: 'Packing Head' },
      invoice: { no: 'SMP/26-27/0918', amount: 2_65_000, gstPct: 18 },
      suggestedLedger: 'Contract labour – Packing',
      variance: { raisedBy: 'kiran', reason: 'Invoice ₹25,000 (10.4%) above the confirmed September milestone', raisedAt: '2026-10-06T10:00' },
    } satisfies ServiceData,
    values: { ledger: 'Contract labour – Packing' },
  },
  // T1 — A1-06, A1-08: sugar from Vendor C, PO 0407. Ravi (Procurement Officer) scanned it, corrected the
  // quantity OCR read as 18,000 at 61%, and raised the ₹17,900 variance; Rajan approves it before Teja posts.
  'PV-0407': {
    id: 'PV-0407', task: 'T1', kind: 'pv', title: 'Sugar invoice · Vendor C', partyId: 'V-C', partyName: 'Vendor C', ref: 'PO 0407', amount: 4_71_000, from: 'ravi',
    data: {
      vendorId: 'V-C', itemName: 'RM-002 Sugar', uom: 'kg',
      po: { no: '0407', qty: 10_000, rate: 46 }, grn: { no: 'GRN-0612', qty: 9_850, on: '2026-10-06' },
      invoice: { no: 'VC/2627/1183', date: '2026-10-06', qty: 10_000, rate: 46.8, other: 3_000, otherLabel: 'freight', gstPct: 5, gstin: '29AAACV1003C1Z1' },
      ocr: { invoiceNo: 98, gstin: 99, rate: 96, qty: 61 },
      capturedBy: 'ravi',
      ocrNote: 'Quantity read as 18,000 at 61%; Ravi corrected it to 10,000 from the scan',
      variance: { raisedBy: 'ravi', reason: 'Short supply, rate revision and freight added', raisedAt: '2026-10-07T09:30' },
    } satisfies PvData,
    values: { invoiceNo: 'VC/2627/1183', qty: 10_000, rate: 46.8 },
  },
  // T3 — the ₹3,000 freight on the sugar invoice, not on the PO
  'LC-0407': {
    id: 'LC-0407', task: 'T3', kind: 'landed', title: 'Freight ₹3,000 · sugar from Vendor C', partyId: 'V-C', partyName: 'Vendor C', ref: 'PV-0407', amount: 3_000, from: 'system',
    data: { voucherId: 'PV-0407', vendorName: 'Vendor C', charge: 3_000, label: 'Freight on invoice VC/2627/1183', qty: 9_850, uom: 'kg', value: 4_53_100 } satisfies LandedData,
    values: { basis: 'Quantity' },
  },
  // T7 — A1-17: Vendor H proposed by Ravi
  'VEN-H': {
    id: 'VEN-H', task: 'T7', kind: 'vendor', title: 'New vendor · Malnad Cocoa Traders (H)', partyId: 'V-H', partyName: VENDOR_H.name, ref: 'QTN-0003', amount: null, from: 'ravi',
    data: { proposal: VENDOR_H, quoteTerms: 15, usualTerms: 45 },
    values: { creditDays: 45, ledger: '', bankAccount: '', ifsc: '', callBack: '' },
  },
  // T1 — A1-10: 25 kg food colour from a local trader, no PO
  'PV-FC25': {
    id: 'PV-FC25', task: 'T1', kind: 'pv', title: 'Food colour bill · local trader (no PO)', partyId: 'V-LT', partyName: 'Local trader (food colour)', ref: 'No PO', amount: 8_500, from: 'suresh',
    data: { vendorId: 'V-LT', itemName: 'Food colour, 25 kg', uom: 'kg', invoice: { no: 'LT-0142', date: '2026-10-08', qty: 25, rate: 340, other: 0, gstPct: 5, gstin: null }, noPo: true, capturedBy: 'teja' } satisfies PvData,
    values: { invoiceNo: 'LT-0142', qty: 25, rate: 340, noPoReason: '' },
  },
  // T4 — A4-07: debit notes for the QC rejections
  'DN-0407': {
    id: 'DN-0407', task: 'T4', kind: 'debit', title: 'Debit note · Vendor C · 100 kg sugar', partyId: 'V-C', partyName: 'Vendor C', ref: 'PO 0407', amount: 4_830, from: 'suresh',
    data: { vendorId: 'V-C', voucherId: 'PV-0407', po: '0407', rejectedQty: 100, rate: 46, gstPct: 5, uom: 'kg', qcReason: '2 wet and lumpy bags (Divya, QC)' },
    values: { type: 'Return', qty: 100, narration: '' },
  },
  'DN-0403': {
    id: 'DN-0403', task: 'T4', kind: 'debit', title: 'Debit note · Vendor B · 400 kg sugar', partyId: 'V-B', partyName: 'Vendor B', ref: 'PO 0403', amount: 20_160, from: 'suresh',
    data: { vendorId: 'V-B', voucherId: 'PV-0403', voucherPostedBefore: true, po: '0403', rejectedQty: 400, rate: 48, gstPct: 5, uom: 'kg', qcReason: 'Water damage, 8 wet bags (Divya, QC)', holdAmount: 20_160 },
    values: { type: 'Return', qty: 400, narration: '' },
  },
  // T12 — the Credit Controller's recommendations of 12-Oct (B3-04)
  'CL-C01': {
    id: 'CL-C01', task: 'T12', kind: 'customer', title: 'Credit limit · Sri Lakshmi Distributors', partyId: 'C-01', partyName: 'Sri Lakshmi Distributors', ref: 'Limit review 12-Oct', amount: 18_00_000, from: 'farid',
    data: { customerId: 'C-01', field: 'Credit limit', current: 15_00_000, recommended: 18_00_000, recommendedWhy: 'As per suggested limit: ₹15,00,000 a month × 1.0 × band A 1.2' } satisfies CustomerData,
    values: { newValue: 18_00_000, note: '' },
  },
  'CL-C02': {
    id: 'CL-C02', task: 'T12', kind: 'customer', title: 'Credit limit · Chennai Retail Mart', partyId: 'C-02', partyName: 'Chennai Retail Mart', ref: 'Limit review 12-Oct', amount: 9_60_000, from: 'farid',
    data: { customerId: 'C-02', field: 'Credit limit', current: 10_00_000, recommended: 9_60_000, recommendedWhy: 'As per suggested limit: ₹8,00,000 × 1.5 × band B 1.0 × 0.8 (dishonour in 90 days)' } satisfies CustomerData,
    values: { newValue: 9_60_000, note: '' },
  },
  // T8 — A4-13: New Item Request "Printed laminate film"
  'ITM-PM003': {
    id: 'ITM-PM003', task: 'T8', kind: 'item', title: 'New item · Printed laminate film', partyId: null, partyName: 'Suresh (Stores)', ref: 'NIR-0007', amount: null, from: 'suresh',
    data: { request: 'Printed laminate film', closest: 'PM-001 Laminate film roll', uom: 'kg' },
    values: { code: 'PM-003', name: 'Printed laminate film', hsn: '3920', gstRate: '18', costing: 'Moving average', group: 'Packing material', stockLedger: 'Stock – Packing material' },
  },
  // T1 — PO 0424: 300 kg cocoa from Vendor H, freight extra at actuals (estimated ₹1,500 on the PO). Teja scans it herself.
  'PV-0424': {
    id: 'PV-0424', task: 'T1', kind: 'pv', title: 'Cocoa invoice · Vendor H', partyId: 'V-H', partyName: VENDOR_H.name, ref: 'PO 0424', amount: 1_25_100, from: 'suresh',
    data: {
      vendorId: 'V-H', itemName: 'RM-005 Cocoa powder', uom: 'kg',
      po: { no: '0424', qty: 300, rate: 412, freightOnPo: 1_500 }, grn: { no: 'GRN-0631', qty: 300, on: '2026-10-13' },
      invoice: { no: 'MCT/118', date: '2026-10-13', qty: 300, rate: 412, other: 1_500, otherLabel: 'freight (on the PO)', gstPct: 5, gstin: '29AAHFM0000A1Z5' },
      ocr: { invoiceNo: 97, gstin: 99, rate: 98, qty: 95 },
      capturedBy: 'teja',
    } satisfies PvData,
    values: { invoiceNo: 'MCT/118', qty: 300, rate: 412 },
  },
  'LC-0424': {
    id: 'LC-0424', task: 'T3', kind: 'landed', title: 'Freight ₹1,500 · cocoa from Vendor H', partyId: 'V-H', partyName: VENDOR_H.name, ref: 'PV-0424', amount: 1_500, from: 'system',
    data: { voucherId: 'PV-0424', vendorName: 'Vendor H', charge: 1_500, label: 'Freight extra at actuals (PO 0424)', qty: 300, uom: 'kg', value: 1_23_600 } satisfies LandedData,
    values: { basis: 'Quantity' },
  },
  // T1 — PO 0420: maida 51,000 kg on a 50,000 kg PO (A1 hand-off: 2.0% over, routes); crosses the TDS threshold.
  // Ravi raises the variance; Rajan approves it before Teja posts.
  'PV-0420': {
    id: 'PV-0420', task: 'T1', kind: 'pv', title: 'Maida invoice · Vendor A', partyId: 'V-A', partyName: 'Vendor A', ref: 'PO 0420', amount: 19_83_900, from: 'ravi',
    data: {
      vendorId: 'V-A', itemName: 'RM-001 Maida', uom: 'kg',
      po: { no: '0420', qty: 50_000, rate: 38.9 }, grn: { no: 'GRN-0620', qty: 51_000, on: '2026-10-09' },
      invoice: { no: 'VA/26/2291', date: '2026-10-13', qty: 51_000, rate: 38.9, other: 0, gstPct: 5, gstin: '29AAACV1001A1Z5' },
      ocr: { invoiceNo: 99, gstin: 99, rate: 97, qty: 94 },
      capturedBy: 'ravi',
      variance: { raisedBy: 'ravi', reason: 'Over-delivery of 1,000 kg accepted at the gate (inside the 2% GRN tolerance)', raisedAt: '2026-10-14T10:00' },
    } satisfies PvData,
    values: { invoiceNo: 'VA/26/2291', qty: 51_000, rate: 38.9 },
  },
  // The same invoice, emailed to accounts as well as scanned by Procurement (duplicate check); Teja keys this copy
  'PV-0420-B': {
    id: 'PV-0420-B', task: 'T1', kind: 'pv', title: 'Maida invoice · Vendor A (emailed copy)', partyId: 'V-A', partyName: 'Vendor A', ref: 'PO 0420', amount: 19_83_900, from: 'vendor',
    data: {
      vendorId: 'V-A', itemName: 'RM-001 Maida', uom: 'kg',
      po: { no: '0420', qty: 50_000, rate: 38.9 }, grn: { no: 'GRN-0620', qty: 51_000, on: '2026-10-09' },
      invoice: { no: 'VA/26/2291', date: '2026-10-13', qty: 51_000, rate: 38.9, other: 0, gstPct: 5, gstin: '29AAACV1001A1Z5' },
      ocr: { invoiceNo: 99, gstin: 99, rate: 99, qty: 99 },
      duplicateOf: 'PV-0420',
      capturedBy: 'teja',
    } satisfies PvData,
    values: { invoiceNo: 'VA/26/2291', qty: 51_000, rate: 38.9, duplicate: '' },
  },
  // T5 — ILLUSTRATIVE: Vendor C's credit note for the 100 kg already covered by DN-0407
  'CN-VC91': {
    id: 'CN-VC91', task: 'T5', kind: 'creditNote', title: 'Credit note · Vendor C · 100 kg sugar', partyId: 'V-C', partyName: 'Vendor C', ref: 'PV-0407', amount: 4_600, from: 'vendor',
    data: { vendorId: 'V-C', cnNo: 'VC/CN/0091', voucherRef: 'PV-0407', qty: 100, rate: 46, gstPct: 5, forWhat: '100 kg sugar returned (PO 0407)' },
    values: { howToBook: '' },
  },
  // T14 — ILLUSTRATIVE: 26AS for Q2 (Jul–Sep)
  'TDS-Q2': {
    id: 'TDS-Q2', task: 'T14', kind: 'tds26as', title: '26AS/AIS · Q2 FY 2026-27', partyId: null, partyName: 'Income-tax portal', ref: 'Q2 Jul–Sep', amount: null, from: 'system',
    data: {
      ran: false, intro: '26AS for Jul–Sep available', gate: ['Q2 statement downloaded from the portal', 'Customer TDS certificates received'],
      lines: [
        line('c01', 'C-01 Sri Lakshmi Distributors', '194Q · ₹2,500 in 26AS = books', 2_500, ['—'], [], true),
        line('c04', 'C-04 Healthy Bite Foods', '194C · ₹1,440 in 26AS = books', 1_440, ['—'], [], true),
        line('c05', 'C-05 Namma Bakes', 'Deducted ₹600 per its certificate, not in 26AS: not deposited', 600, ['Ask the customer to deposit it', 'Escalate to tax (Compliance Officer)', 'Write off as unclaimable (Finance Controller)'], ['Escalate to tax (Compliance Officer)', 'Write off as unclaimable (Finance Controller)']),
        line('c06', 'C-06 Kerala Traders', '26AS ₹900, books ₹1,000', 1_000, ['Ask the customer', 'Accept the 26AS amount'], ['Accept the 26AS amount']),
      ],
    } satisfies BatchData,
    values: {},
  },
  // T10 — ILLUSTRATIVE: SMP batch SM-2604 expires on 28-Oct with 100 kg left
  'NRV-OCT': {
    id: 'NRV-OCT', task: 'T10', kind: 'nrv', title: 'Expired stock provision · October', partyId: null, partyName: 'Stock', ref: 'SM-2604', amount: 29_800, from: 'system',
    data: {
      ran: true, intro: 'Expired and slow-moving stock', gate: [],
      lines: [
        line('sm2604', 'SMP batch SM-2604', '100 kg left at expiry on 28-Oct × ₹298', 29_800, ['Provide 100%', 'Provide 50%', 'No provision'], ['Provide 50%', 'No provision']),
        line('none', 'Slow-moving and below cost', 'Nothing else found: FG-102 sells at ₹990 against cost ₹820', 0, ['—'], [], true),
      ],
    } satisfies BatchData,
    values: {},
  },
  // T16 — ILLUSTRATIVE: the same PAN on a customer and a vendor
  'NET-C04': {
    id: 'NET-C04', task: 'T16', kind: 'netting', title: 'Netting · Healthy Bite Foods', partyId: 'C-04', partyName: 'Healthy Bite Foods', ref: 'PAN AAJCH0000H', amount: 36_000, from: 'system',
    data: { customerId: 'C-04', vendorName: 'Healthy Bite Foods (packing services)', pan: 'AAJCH0000H', receivable: 84_960, payable: 36_000, linked: false },
    values: { amount: 36_000 },
  },
  // T22 — ILLUSTRATIVE: the expired SMP batch is written off by Stores and approved by Anand (Inventory Controller)
  'ITC-WO-2604': {
    id: 'ITC-WO-2604', task: 'T22', kind: 'itcWo', title: 'ITC reversal · SMP batch SM-2604 written off', partyId: null, partyName: 'Stock', ref: 'WO-STK-0009', amount: 1_490, from: 'anand',
    data: { writeOffNo: 'WO-STK-0009', item: 'RM-003 Skimmed milk powder', batch: 'SM-2604', qty: 100, uom: 'kg', value: 29_800, gstPct: 5, reason: 'Expired 28-Oct', madeBy: 'suresh', approvedBy: 'anand', itcTaken: true } satisfies ItcWriteOffData,
    values: { note: '' },
  },
  // T17 — Vendor H's Udyam number to verify; ILLUSTRATIVE: Vendor D has not answered
  'UDY-H': {
    id: 'UDY-H', task: 'T17', kind: 'udyam', title: 'Udyam number · Vendor H', partyId: 'V-H', partyName: VENDOR_H.name, ref: 'MSME micro', amount: null, from: 'ravi',
    data: { vendorId: 'V-H', mode: 'verify', given: 'UDYAM-KR-03-0012345' },
    values: { udyam: 'UDYAM-KR-03-0012345', category: 'Micro' },
  },
  'UDY-D': {
    id: 'UDY-D', task: 'T17', kind: 'udyam', title: 'Udyam request unanswered · Vendor D', partyId: 'V-D', partyName: 'Vendor D', ref: 'Asked 15-Sep', amount: null, from: 'system',
    data: { vendorId: 'V-D', mode: 'missing' },
    values: { action: '' },
  },
};

/** Month-end work, created on the last day (ILLUSTRATIVE figures). */
export function monthEndTemplates(s: { work: WorkItem[]; rules: { inventoryMethod: string } }): Template[] {
  const dn403 = s.work.find((w) => w.id === 'DN-0403');
  const out: Template[] = [
    {
      id: 'REC-STK-OCT', task: 'T9', kind: 'stockRecon', title: 'Stock reconciliation · October', partyId: null, partyName: 'Stock', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end stock reconciliation', gate: ['All GRNs to 31-Oct posted', 'Issues to production posted', 'Landed cost allocated'],
        lines: [
          line('cocoa', 'RM-005 Cocoa powder', 'Stock at ₹412/kg; ledger includes ₹1,500 freight (₹5/kg): landed cost posted after the GRN', 1_500, ['Fix: revalue the GRN with the landed cost', 'Carry to next month'], ['Carry to next month']),
          line('colour', 'Food colour, 25 kg (no PO)', 'Stock +25 kg at ₹0; the voucher went to expense', 8_500, ['Fix: move ₹8,500 to stock', 'Leave as expense', 'Carry to next month'], ['Leave as expense', 'Carry to next month']),
          line('maida', 'RM-001 Maida', 'Stock and ledger agree', 0, ['—'], [], true),
        ],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'PROV-OCT', task: 'T15', kind: 'provision', title: 'Provision run · October', partyId: null, partyName: 'AR/AP', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end doubtful-debt provision', gate: ['Provision matrix loaded', 'Receipts to 31-Oct allocated'],
        lines: [
          line('c06', 'Provision · C-06 Kerala Traders', '₹1,60,000 overdue 41 days × 5% (matrix, 31–60 days)', 8_000, ['—'], [], true),
          line('c06s', 'Specific provision · C-06 bounced cheque (INV-0388)', 'Matrix gives 5%; a bounced cheque may call for more. Rajan reviews specific provisions before Usha.', 8_000, ['Keep the matrix 5%', 'Provide specifically 50%'], ['Provide specifically 50%']),
        ],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'FX-OCT', task: 'T23', kind: 'fxReval', title: 'FX revaluation · October', partyId: null, partyName: 'AR/AP', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end FX revaluation of open items', gate: ['Month-end rate: ₹88.40 per USD (rate source)', 'Foreign-currency open items listed'],
        lines: [line('fx', 'FX · C-03 Gulf Snack Imports (SO-3)', `USD 10,680 booked at ₹88.00, closes at ₹88.40: gain`, fxRevaluation(10_680, 88, 88.4), ['—'], [], true)],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'GRNI-OCT', task: 'T19', kind: 'grni', title: 'GRN-not-invoiced provision · October', partyId: null, partyName: 'Purchase', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end purchase cut-off', gate: ['All GRNs to 31-Oct posted', "Rajan's cut-off list ready"],
        lines: [
          line('g655', 'GRN-0655 · Vendor F · vanilla flavour', '120 litre received 29-Oct × ₹1,850 (PO value); no invoice yet', 2_22_000, ['Provide at PO value', 'Explain: no provision'], ['Explain: no provision']),
          line('g648', 'GRN-0648 · Vendor E · corrugated cartons', '5,000 nos received 30-Oct; invoice came in 31-Oct after the cut-off', 61_000, ['Provide at PO value', 'Explain: no provision'], ['Explain: no provision']),
        ],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'STD-OCT', task: 'T20', kind: 'stdCost', title: 'Standard cost variances · October', partyId: null, partyName: 'Stock', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end standard cost review', gate: ['Purchases and issues to 31-Oct posted', 'Standard costs for October loaded'],
        lines: [
          line('pm002p', 'PM-002 Corrugated carton · price', 'Bought at ₹12.20 against standard ₹11.50: 5,000 nos × ₹0.70', 3_500, ['Explain: vendor rate revision', 'Explain: other'], ['Explain: other']),
          line('pm002u', 'PM-002 Corrugated carton · usage', 'Issued as per the standard per case', 0, ['—'], [], true),
        ],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'STMT-OCT', task: 'T21', kind: 'stockStmt', title: 'Bank stock statement · October (CC account)', partyId: null, partyName: 'Bank (Cash Credit)', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Stock statement for the Cash Credit account, due to the bank on 07-Nov', gate: ['October inventory valuation done', 'Expired stock identified'],
        lines: [
          line('rm', 'Raw material', 'From the book valuation at 31-Oct', 18_40_000, ['—'], [], true),
          line('pm', 'Packing material', 'From the book valuation at 31-Oct', 2_10_000, ['—'], [], true),
          line('fg', 'Finished goods', 'From the book valuation at 31-Oct', 4_10_000, ['—'], [], true),
          line('smp', 'Expired SMP batch SM-2604', '100 kg, ₹29,800: expired 28-Oct', 29_800, ['Exclude from the statement (expired)', 'Include'], ['Include']),
        ],
      } satisfies BatchData,
      values: {},
    },
    {
      id: 'REC-ARAP-OCT', task: 'T18', kind: 'arapRecon', title: 'AR/AP reconciliation · October', partyId: null, partyName: 'AR/AP', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Month-end AR/AP reconciliation', gate: ['All vouchers and notes to 31-Oct posted', 'Receipts allocated'],
        lines: [
          dn403?.status === 'Approved'
            ? line('ap', 'Payables control vs open items', 'Agree', 0, ['—'], [], true)
            : line('ap', 'Payables control vs open items', 'Break ₹20,160: debit note DN-0403 not approved yet; the open item is still on hold', 20_160, ['Carry to next month', 'Fix: post the debit note'], ['Carry to next month']),
          line('ar', 'Receivables control vs open items', 'Agree', 0, ['—'], [], true),
          line('adv', 'Customer advances', 'C-04 ₹59,000 refunded 15-Oct; nothing left on account', 0, ['—'], [], true),
        ],
      } satisfies BatchData,
      values: {},
    },
  ];
  if (s.rules.inventoryMethod === 'Periodic')
    out.push({
      id: 'PER-OCT', task: 'T11', kind: 'periodicClose', title: 'Periodic close · October', partyId: null, partyName: 'Stock', ref: 'Oct 2026', amount: null, from: 'calendar',
      data: {
        ran: false, intro: 'Closing stock and COGS', gate: ['Count of 31-Oct entered', 'Valued at moving average'],
        lines: [
          line('close', 'Closing stock', 'Valued at moving average', 24_60_000, ['—'], [], true),
          line('cogs', 'Cost of goods sold', 'Opening + purchases − closing', 31_20_000, ['—'], [], true),
          line('var', 'Change from September', 'Higher maida and cocoa purchases', 2_10_000, ['—'], [], true),
        ],
      } satisfies BatchData,
      values: {},
    });
  return out;
}

/** History before the scenario starts, so reports have a past. */
export const OPENING: { id: string; task: TaskId; title: string; partyId: string; partyName: string; ref: string; amount: number; at: string; by: ActorKey }[] = [
  { id: 'PV-0403', task: 'T1', title: 'Sugar invoice · Vendor B (on Payables hold)', partyId: 'V-B', partyName: 'Vendor B', ref: 'PO 0403', amount: 2_40_000, at: '2026-10-02T11:00', by: 'teja' },
  { id: 'PV-0398', task: 'T1', title: 'Laminate film invoice · Vendor D', partyId: 'V-D', partyName: 'Vendor D', ref: 'PO 0388', amount: 3_12_000, at: '2026-09-28T15:00', by: 'teja' },
  { id: 'SB-0021-08', task: 'T2', title: 'August bill · Shakti Manpower', partyId: 'V-SM', partyName: 'Shakti Manpower', ref: 'WO-0021', amount: 2_40_000, at: '2026-09-07T10:00', by: 'teja' },
];
