// The 4 areas of the role and which task sits in which (01_accounts_executive_tasks_and_responsibilities.md §3).

import type { AreaId, TaskId } from '../domain/types';

export const AREAS: { id: AreaId; title: string; ref: string; what: string }[] = [
  { id: 'purchase', title: 'Purchase', ref: '§11.1', what: 'Vendor invoices, service bills, landed cost, debit and credit notes, vendor finance fields, GRN-not-invoiced provision.' },
  { id: 'inventory', title: 'Inventory', ref: '§11.2', what: 'Item accounting fields, stock reconciliation, expired-stock provision, periodic close, standard cost, bank stock statement, ITC on write-offs.' },
  { id: 'sales', title: 'Sales', ref: '§11.3', what: 'Customer finance fields and credit-limit edits, advances against sales orders.' },
  { id: 'arap', title: 'AR/AP', ref: '§11.4', what: '26AS/AIS, provision run, FX revaluation, netting, MSME data, the AR/AP reconciliation.' },
];

export const AREA_OF: Record<TaskId, AreaId> = {
  T1: 'purchase', T2: 'purchase', T3: 'purchase', T4: 'purchase', T5: 'purchase', T6: 'purchase', T7: 'purchase', T19: 'purchase',
  T8: 'inventory', T9: 'inventory', T10: 'inventory', T11: 'inventory', T20: 'inventory', T21: 'inventory', T22: 'inventory',
  T12: 'sales', T13: 'sales',
  T14: 'arap', T15: 'arap', T23: 'arap', T16: 'arap', T17: 'arap', T18: 'arap',
};
