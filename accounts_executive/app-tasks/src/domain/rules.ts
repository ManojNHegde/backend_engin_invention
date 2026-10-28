import type { CompanyRules } from './types';

/**
 * Company rules (Full scenario §2 "Company rules", plus illustrative values for this role).
 * Changed at runtime from the scenario panel: behaviour must follow without code changes.
 */
export const defaultRules: CompanyRules = {
  // Three-way-match tolerance (PO, GRN, invoice)
  matchQtyTolPct: 0.5,
  matchRateTolPct: 1,
  // OCR low-confidence flag
  ocrFlagPct: 80,
  // TDS on purchase of goods: ₹50 lakh a year per vendor, 0.1% on the excess (Section 393 payment code; legacy 194Q)
  tdsThreshold: 50_00_000,
  tdsRatePct: 0.1,
  // MSMED Act: at most 45 days with a written agreement
  msmeMaxDays: 45,
  // Illustrative: a tax override above this also goes to the Finance Controller; same for netting
  overrideFcThreshold: 1_00_000,
  nettingFcThreshold: 5_00_000,
  // Run 1 Perpetual, Run 2 Periodic
  inventoryMethod: 'Perpetual',
  // A rule that loosens a warning: up to 30 days, with the Accounts Manager
  ruleMaxDays: 30,
};
