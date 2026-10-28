// Answer keys from the full scenario (A1-06, A1 hand-off, A2-04, B4-10).

import { describe, expect, it } from 'vitest';
import { aboveTolerance, dueDate, fxRevaluation, gstInAdvance, matchVariance, perUnit, tdsOnPurchase } from './accounting';

describe('three-way match', () => {
  it('A1-06 sugar: variance ₹17,900 split quantity, rate, freight', () => {
    const v = matchVariance({ poQty: 10_000, poRate: 46, grnQty: 9_850, invQty: 10_000, invRate: 46.8, other: 3_000 });
    expect(Math.round(v.qtyVar)).toBe(7_020);
    expect(v.qtyPct).toBeCloseTo(1.52, 2);
    expect(Math.round(v.rateVar)).toBe(7_880);
    expect(v.ratePct).toBeCloseTo(1.74, 2);
    expect(Math.round(v.total)).toBe(17_900);
    expect(aboveTolerance(v, 0.5, 1)).toBe(true);
  });
  it('maida: 51,000 kg on a 50,000 kg PO is 2.0% over and routes', () => {
    const v = matchVariance({ poQty: 50_000, poRate: 38.9, grnQty: 51_000, invQty: 51_000, invRate: 38.9, other: 0 });
    expect(Math.round(v.qtyVar)).toBe(38_900);
    expect(v.qtyPct).toBeCloseTo(2, 5);
    expect(aboveTolerance(v, 0.5, 1)).toBe(true);
  });
  it('cocoa: exact match is within tolerance', () => {
    const v = matchVariance({ poQty: 300, poRate: 412, grnQty: 300, invQty: 300, invRate: 412, other: 0 });
    expect(v.total).toBe(0);
    expect(aboveTolerance(v, 0.5, 1)).toBe(false);
  });
});

describe('tax and dates', () => {
  it('TDS on purchase: Vendor A crosses ₹50 lakh with the maida invoice', () => {
    const t = tdsOnPurchase(46_20_000, 19_83_900, 50_00_000, 0.1);
    expect(t.crosses).toBe(true);
    expect(t.excess).toBe(16_03_900);
    expect(t.tds).toBe(1_604);
  });
  it('TDS: Vendor C stays below the threshold (85%)', () => {
    const t = tdsOnPurchase(38_00_000, 4_71_000, 50_00_000, 0.1);
    expect(t.applies).toBe(false);
    expect(Math.round(t.pctOfThreshold)).toBe(85);
  });
  it('MSME due date never later than 45 days', () => {
    expect(dueDate('2026-10-13', 15, true, 45)).toEqual({ days: 15, date: '2026-10-28', cappedByMsme: false });
    expect(dueDate('2026-10-13', 60, true, 45).days).toBe(45);
    expect(dueDate('2026-10-07', 45, false, 45).date).toBe('2026-11-21');
  });
  it('B4-10 GST included in the ₹59,000 advance at 18%', () => {
    expect(gstInAdvance(59_000, 18)).toEqual({ taxable: 50_000, tax: 9_000 });
  });
  it('landed cost and FX', () => {
    expect(perUnit(3_000, 9_850)).toBeCloseTo(0.3046, 4);
    expect(perUnit(1_500, 300)).toBe(5);
    expect(fxRevaluation(10_680, 88, 88.4)).toBe(4_272);
  });
});
