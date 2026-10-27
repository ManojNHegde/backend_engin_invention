// Reference lists. The categories, constitutions and the 43B(h) relevance are copied from the finance repo
// (aikyat-finance apps/operations/.../ledger_form_rules.dart, from the CA's Customer and Vendor Master
// onboarding workbooks). The keys are what the backend stores; the labels are what a person reads.

import type { ActorKey, Side } from './types';

export interface Actor {
  name: string;
  role: string;
}

export const ACTORS: Record<ActorKey, Actor> = {
  teja: { name: 'Teja', role: 'Accounts Executive' },
  rajan: { name: 'Rajan', role: 'Accounts Manager' },
  usha: { name: 'Usha', role: 'Finance Controller' },
  venkat: { name: 'Venkat', role: 'Compliance Officer' },
  farid: { name: 'Farid', role: 'Credit Controller' },
  ravi: { name: 'Ravi', role: 'Procurement Officer' },
  kiran: { name: 'Kiran', role: 'Contracts & Services Procurement Officer' },
  arun: { name: 'Arun', role: 'Sales Executive' },
  system: { name: 'System', role: 'Aikyat Finance' },
  bank: { name: 'Bank', role: 'Penny-drop service' },
  gst: { name: 'GST portal', role: 'GSTIN search' },
};

export const ME: ActorKey = 'teja';
export const who = (k: ActorKey) => `${ACTORS[k].name} (${ACTORS[k].role})`;

/** Who can hand over a paper form, by side. */
export const FORM_FROM: Record<Side, ActorKey[]> = { payable: ['ravi', 'kiran'], receivable: ['arun'] };

/** GST state codes (first two digits of a GSTIN) for the states in this walkthrough. */
export const STATES: Record<string, { code: string; name: string }> = {
  KA: { code: '29', name: 'Karnataka' },
  TN: { code: '33', name: 'Tamil Nadu' },
  KL: { code: '32', name: 'Kerala' },
  MH: { code: '27', name: 'Maharashtra' },
  TS: { code: '36', name: 'Telangana' },
  AP: { code: '37', name: 'Andhra Pradesh' },
  GA: { code: '30', name: 'Goa' },
  DL: { code: '07', name: 'Delhi' },
  GJ: { code: '24', name: 'Gujarat' },
};
export const STATE_OPTIONS: Record<string, string> = Object.fromEntries(Object.entries(STATES).map(([k, v]) => [k, `${v.name} (${v.code})`]));
export const stateOfGstin = (gstin: string) => Object.entries(STATES).find(([, v]) => v.code === gstin.slice(0, 2))?.[0] ?? null;
export const OUR_STATE = 'KA';

export const SIDE_LABEL: Record<Side, string> = { payable: 'Vendor', receivable: 'Customer' };

export const CREDITOR_CATEGORIES: Record<string, string> = {
  goods_msme: 'Creditors for Goods – MSME',
  goods_non_msme: 'Creditors for Goods – Non-MSME',
  capital_goods: 'Creditors – Capital Goods / Fixed Assets',
  consultants: 'Creditors – Consultants & Professionals',
  contractors: 'Creditors – Contractors (Works/Civil/Labour)',
  manpower_security: 'Creditors – Manpower & Security Services',
  freight_gta: 'Creditors – Freight & Transportation (GTA)',
  commission_brokerage: 'Creditors – Commission & Brokerage Agents',
  rent_immovable: 'Creditors – Rent (Immovable Property)',
  advertising: 'Creditors – Advertising & Marketing Agencies',
  it_software: 'Creditors – IT / Software / SaaS Subscriptions',
  insurance: 'Creditors – Insurance',
  utilities: 'Creditors – Utilities (Electricity/Telecom/Internet)',
  directors: 'Creditors – Directors',
  related_party: 'Creditors – Related Party / Group Company',
  loans_icd: 'Creditors – Loans & Inter-Corporate Deposits',
  employee_reimbursement: 'Creditors – Employee Reimbursement / Imprest',
  ecommerce_operators: 'Creditors – E-commerce Operators',
  government_statutory: 'Creditors – Government / Statutory Bodies',
  international_import: 'Creditors – International / Import (Non-Resident)',
};

export const DEBTOR_CATEGORIES: Record<string, string> = {
  domestic_b2b_regular: 'Domestic B2B Trade Debtor – Regular',
  domestic_b2c_retail: 'Domestic B2C Debtor (Retail/Walk-in)',
  domestic_b2g: 'Domestic B2G Debtor (Government / PSU)',
  export_goods: 'Export Debtor – Goods',
  export_services: 'Export Debtor – Services',
  sez_unit: 'SEZ Unit / Developer Debtor',
  deemed_export: 'Deemed Export Debtor (EOU / Advance Authorisation / EPCG)',
  ecommerce_marketplace: 'E-commerce Marketplace Debtor (sales via ECO)',
  related_party_domestic: 'Related Party / Intercompany Debtor (Domestic)',
  related_party_overseas: 'Related Party / Intercompany Debtor (Overseas / Group)',
  dealer_distributor: 'Dealer / Distributor Debtor',
  scrap_specified_goods: 'Sale of Scrap / Specified Goods Debtor',
  luxury_goods: 'Sale of Luxury Goods Debtor',
  tour_package: 'Overseas Tour Package Debtor',
  composition_scheme: 'Composition Scheme Debtor',
  employee_advances: 'Employee Debtor (staff advances / recoveries)',
};

export const categoriesFor = (side: Side) => (side === 'payable' ? CREDITOR_CATEGORIES : DEBTOR_CATEGORIES);

export const CONSTITUTIONS: Record<string, string> = {
  individual: 'Individual',
  proprietorship: 'Proprietorship',
  partnership: 'Partnership',
  llp: 'LLP',
  company: 'Company',
  trust_society: 'Trust / Society',
  government: 'Government',
  other: 'Other',
};

export const RESIDENT: Record<string, string> = { resident: 'Resident', non_resident: 'Non-Resident' };
export const MSME_STATUS: Record<string, string> = { yes: 'Yes', no: 'No', unknown: 'Asked, not known yet' };
export const MSME_CATEGORY: Record<string, string> = { micro: 'Micro', small: 'Small', medium: 'Medium' };
export const YES_NO: Record<string, string> = { yes: 'Yes', no: 'No' };
export const CURRENCIES: Record<string, string> = { INR: 'INR', USD: 'USD', EUR: 'EUR', GBP: 'GBP' };
export const PO_RULES: Record<string, string> = { every_invoice: 'PO number on every invoice', none: 'No PO reference needed' };
export const DELIVERY: Record<string, string> = { email: 'Email', portal: 'Customer portal upload', with_goods: 'Copy with the goods', courier: 'Courier' };

/** Sec 43B(h): does the 45-day clock bind this payable? The category settles it for about half the list. */
export type Sec43bh = 'applies' | 'not_applicable' | 'if_msme' | 'verify';
export const SEC_43BH: Record<string, { outcome: Sec43bh; words: string }> = {
  goods_msme: { outcome: 'applies', words: 'Pay within 45 days (or the agreed period, max 45) or the expense is disallowed.' },
  goods_non_msme: { outcome: 'not_applicable', words: 'Not applicable.' },
  capital_goods: { outcome: 'if_msme', words: 'Applicable if the vendor is MSME.' },
  consultants: { outcome: 'if_msme', words: 'Applicable if the consultant is MSME-registered.' },
  contractors: { outcome: 'if_msme', words: 'Applicable if the contractor is MSME.' },
  manpower_security: { outcome: 'if_msme', words: 'Applicable if MSME.' },
  freight_gta: { outcome: 'if_msme', words: 'Applicable if MSME.' },
  commission_brokerage: { outcome: 'if_msme', words: 'Applicable if MSME.' },
  rent_immovable: { outcome: 'not_applicable', words: 'Not applicable — a landlord is not a goods or service MSME vendor.' },
  advertising: { outcome: 'if_msme', words: 'Applicable if MSME.' },
  it_software: { outcome: 'not_applicable', words: 'Generally not applicable.' },
  insurance: { outcome: 'not_applicable', words: 'Not applicable.' },
  utilities: { outcome: 'not_applicable', words: 'Not applicable.' },
  directors: { outcome: 'not_applicable', words: 'Not applicable.' },
  related_party: { outcome: 'verify', words: 'Rarely applicable — verify.' },
  loans_icd: { outcome: 'not_applicable', words: 'Not applicable.' },
  employee_reimbursement: { outcome: 'not_applicable', words: 'Not applicable.' },
  ecommerce_operators: { outcome: 'if_msme', words: 'Applicable if MSME.' },
  government_statutory: { outcome: 'not_applicable', words: 'Not applicable.' },
  international_import: { outcome: 'not_applicable', words: 'Not applicable.' },
};

/** The header ("Under") a category puts the account in. Headers are rows in accounting.account (is_postable = false). */
export function underFor(side: Side, category: string): string {
  if (side === 'payable') {
    if (category === 'goods_msme' || category === 'goods_non_msme') return 'Trade Payables › Goods';
    if (category === 'capital_goods') return 'Trade Payables › Capital Goods';
    if (category === 'related_party') return 'Trade Payables › Related Parties';
    if (category === 'international_import') return 'Trade Payables › Import';
    return 'Trade Payables › Services & Expenses';
  }
  if (['export_goods', 'export_services', 'sez_unit', 'deemed_export'].includes(category)) return 'Trade Receivables › Export & SEZ';
  if (category.startsWith('related_party')) return 'Trade Receivables › Related Parties';
  if (category === 'domestic_b2b_regular' || category === 'dealer_distributor' || category === 'domestic_b2g') return 'Trade Receivables › Domestic';
  return 'Trade Receivables › Other';
}

export const HEADERS_PAYABLE = ['Trade Payables › Goods', 'Trade Payables › Capital Goods', 'Trade Payables › Services & Expenses', 'Trade Payables › Related Parties', 'Trade Payables › Import'];
export const HEADERS_RECEIVABLE = ['Trade Receivables › Domestic', 'Trade Receivables › Export & SEZ', 'Trade Receivables › Related Parties', 'Trade Receivables › Other'];

/** PAN 4th letter → holder type (Income-tax PAN structure). */
export function constitutionFromPan(pan: string | null): { value: string; why: string } | null {
  if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return null;
  const c = pan[3];
  const map: Record<string, [string, string]> = {
    C: ['company', 'C = company'],
    F: ['partnership', 'F = firm (covers partnerships and LLPs: check which)'],
    P: ['individual', 'P = individual (a proprietor uses their own PAN)'],
    H: ['other', 'H = HUF'],
    T: ['trust_society', 'T = trust'],
    G: ['government', 'G = government'],
    A: ['other', 'A = association of persons'],
  };
  const m = map[c];
  return m ? { value: m[0], why: `PAN ${pan}: 4th letter ${m[1]}` } : null;
}
