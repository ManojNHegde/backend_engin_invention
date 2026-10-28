// Accounting calculations used by the tasks. Pure and tested (accounting.test.ts).
// Figures follow the scenario answer keys where a step exists (A1-06, A2-04, A4-07, B4-10).

import { addDays } from './dates';

/** Three-way match: PO, GRN, invoice. The match uses the received quantity, capped at the PO quantity
 *  (A1-06: sugar 10,000 ordered, 9,850 received, 10,000 invoiced; A1 hand-off: maida 51,000 received on a 50,000 PO). */
export function matchVariance(m: { poQty: number; poRate: number; grnQty: number; invQty: number; invRate: number; other: number }) {
  const base = Math.min(m.grnQty, m.poQty);
  const qtyDiff = m.invQty - base;
  const qtyVar = qtyDiff * m.invRate;
  const qtyPct = base ? (qtyDiff / base) * 100 : 0;
  const rateVar = base * (m.invRate - m.poRate);
  const ratePct = m.poRate ? ((m.invRate - m.poRate) / m.poRate) * 100 : 0;
  const total = qtyVar + rateVar + m.other;
  return { base, qtyDiff, qtyVar, qtyPct, rateVar, ratePct, other: m.other, total };
}

export type Match = ReturnType<typeof matchVariance>;

/** Is any part of the variance outside the company's tolerance? Other charges not on the PO always are. */
export function aboveTolerance(v: Match, qtyTolPct: number, rateTolPct: number): boolean {
  return Math.abs(v.qtyPct) > qtyTolPct || Math.abs(v.ratePct) > rateTolPct || v.other > 0;
}

/** TDS on purchase of goods: once a vendor's purchases in the year cross the threshold, tax the excess. */
export function tdsOnPurchase(fyBefore: number, amount: number, threshold: number, ratePct: number) {
  const after = fyBefore + amount;
  const excess = Math.max(0, after - Math.max(threshold, fyBefore));
  return { after, crosses: fyBefore < threshold && after > threshold, applies: after > threshold, excess, tds: Math.round((excess * ratePct) / 100), pctOfThreshold: (after / threshold) * 100 };
}

/** Payment due date: the vendor's credit days, but never later than the MSMED Act limit for a micro or small vendor. */
export function dueDate(from: string, creditDays: number, msme: boolean, msmeMaxDays: number) {
  const days = msme ? Math.min(creditDays, msmeMaxDays) : creditDays;
  return { days, date: addDays(from, days), cappedByMsme: msme && creditDays > msmeMaxDays };
}

/** GST included in an advance (B4-10): ₹59,000 at 18% → ₹9,000 tax on ₹50,000. */
export function gstInAdvance(amount: number, ratePct: number) {
  const tax = Math.round((amount * ratePct) / (100 + ratePct));
  return { taxable: amount - tax, tax };
}

/** Landed cost per unit (A1-06 freight ₹3,000 over 9,850 kg). */
export function perUnit(charge: number, qty: number) {
  return qty ? charge / qty : 0;
}

/** FX revaluation of an open foreign-currency item. */
export function fxRevaluation(foreign: number, bookedRate: number, closingRate: number) {
  return Math.round(foreign * (closingRate - bookedRate));
}

export const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const UDYAM = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
