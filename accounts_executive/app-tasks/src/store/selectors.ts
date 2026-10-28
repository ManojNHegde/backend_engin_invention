// Derived views of the state, shared by the pages. Never stored.

import { addDays, dateOf } from '../domain/dates';
import { pvFigures, type PvData } from '../domain/tasks';
import type { AreaId, TaskId, WorkItem } from '../domain/types';
import { ctxOf, type AppState } from './appStore';
import { AREA_OF } from './areas';

export const today = (s: AppState) => dateOf(s.now);

/** Real work items (not the history posted before the scenario). */
export const workItems = (s: AppState) => s.work.filter((w) => w.kind !== 'opening');

/** My move: arrived or returned, and nobody else has to act first. */
export const isMine = (w: WorkItem) => (w.status === 'Open' || w.status === 'Returned') && !w.waitingOn;
/** With a checker, or open but waiting for someone else first (e.g. a variance with the Accounts Manager). */
export const isWithOthers = (w: WorkItem) => w.status === 'Sent' || (w.status === 'Open' && !!w.waitingOn);
export const isClosed = (w: WorkItem) => w.status === 'Approved' || w.status === 'Done' || w.status === 'Discarded';

export const itemsOf = (s: AppState, task: TaskId) => s.work.filter((w) => w.task === task);

/** Badge on each task card: items waiting for me. */
export function taskBadges(s: AppState): Partial<Record<TaskId, number>> {
  const out: Partial<Record<TaskId, number>> = {};
  workItems(s)
    .filter(isMine)
    .forEach((w) => (out[w.task] = (out[w.task] ?? 0) + 1));
  return out;
}

export function areaCounts(s: AppState): Record<AreaId, { me: number; others: number; done: number }> {
  const out = { purchase: { me: 0, others: 0, done: 0 }, inventory: { me: 0, others: 0, done: 0 }, sales: { me: 0, others: 0, done: 0 }, arap: { me: 0, others: 0, done: 0 } };
  workItems(s).forEach((w) => {
    const a = out[AREA_OF[w.task]];
    if (isMine(w)) a.me += 1;
    else if (isWithOthers(w)) a.others += 1;
    else a.done += 1;
  });
  return out;
}

export const tasksBadge = (s: AppState) => workItems(s).filter(isMine).length;
export const rulesBadge = (s: AppState) => s.myRules.filter((r) => r.kind === 'remind' && r.firedAt && r.status === 'Active').length;

/** Match variances on my vouchers (raised by Procurement, approved by the Accounts Manager). */
export function routedVariances(s: AppState) {
  const c = ctxOf(s);
  return s.work
    .filter((w) => w.kind === 'pv' && w.status !== 'Discarded' && !!(w.data as unknown as PvData).variance)
    .map((w) => ({ w, f: pvFigures(w, w.values, c) }))
    .filter((x) => x.f.above && x.f.match);
}

/** Posted purchases still to be paid, with their due dates (MSME first). */
export function payablesDue(s: AppState) {
  const c = ctxOf(s);
  return s.work
    .filter((w) => w.kind === 'pv' && (w.status === 'Sent' || w.status === 'Approved' || w.status === 'Done'))
    .map((w) => {
      const f = pvFigures(w, w.values, c);
      const d = w.data as unknown as PvData;
      return { w, vendor: f.vendor, due: f.due.date, days: f.due.days, total: f.total, msme: !!f.vendor?.msme, invoice: d.invoice.no };
    })
    .sort((a, b) => Number(b.msme) - Number(a.msme) || (a.due < b.due ? -1 : 1));
}

/** The month-end runs (shown before they exist as "Coming up"). */
export const MONTH_END_WORK: { id: string; task: TaskId; label: string }[] = [
  { id: 'GRNI-OCT', task: 'T19', label: 'GRN-not-invoiced provision' },
  { id: 'REC-STK-OCT', task: 'T9', label: 'Stock reconciliation' },
  { id: 'STD-OCT', task: 'T20', label: 'Standard cost variances' },
  { id: 'STMT-OCT', task: 'T21', label: 'Bank stock statement' },
  { id: 'PROV-OCT', task: 'T15', label: 'Provision run' },
  { id: 'FX-OCT', task: 'T23', label: 'FX revaluation' },
  { id: 'REC-ARAP-OCT', task: 'T18', label: 'AR/AP reconciliation' },
];

/** Month-end close: every run and whether each is done (sent or approved). */
export function monthEndStatus(s: AppState) {
  const ids: { id: string; task: TaskId; label: string }[] = [
    ...MONTH_END_WORK,
    { id: 'NRV-OCT', task: 'T10', label: 'Expired-stock provision' },
    { id: 'TDS-Q2', task: 'T14', label: '26AS/AIS match (Q2)' },
  ];
  if (s.rules.inventoryMethod === 'Periodic') ids.splice(2, 0, { id: 'PER-OCT', task: 'T11', label: 'Periodic close' });
  return ids.map((x) => {
    const w = s.work.find((i) => i.id === x.id);
    const state = !w ? 'not yet' : w.status === 'Approved' ? 'approved' : w.status === 'Sent' ? 'with checker' : 'to do';
    return { ...x, w, state };
  });
}

export const monthEndDate = (s: AppState) => {
  const [y, m] = today(s).split('-').map(Number);
  return addDays(`${m === 12 ? y + 1 : y}-${String((m % 12) + 1).padStart(2, '0')}-01`, -1);
};
