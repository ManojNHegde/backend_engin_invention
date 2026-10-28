// One queue across all 23 tasks (the cards' "Held by"). Every open item lands in one group by whose move it is:
//   me      — Needs me: arrived, or returned by a checker
//   others  — Waiting on others: with a checker, or waiting for a variance approval, shown with who and since when
//   coming  — Coming up: month end, quarter end, MSME due dates, my reminders
// Derived from state only; the work is done on the task screens.

import { addDays, daysBetween, fmtDate } from '../domain/dates';
import { ruleSummary } from '../domain/myRules';
import { inr } from '../domain/money';
import { specOf } from '../domain/tasks';
import type { ISODate, ISODateTime, TaskId, Tone } from '../domain/types';
import { ACTORS, who } from './actors';
import { ctxOf, type AppState } from './appStore';
import { AREA_OF, AREAS } from './areas';
import type { NavTarget } from './navigation';
import { MONTH_END_WORK, isMine, isWithOthers, monthEndDate, payablesDue, today, workItems } from './selectors';

export type QueueGroup = 'me' | 'others' | 'coming';
export type QueueKind = 'Purchase' | 'Inventory' | 'Sales' | 'AR/AP' | 'My rule';
export const QUEUE_KINDS: QueueKind[] = ['Purchase', 'Inventory', 'Sales', 'AR/AP', 'My rule'];

export const COMING_UP_DAYS = 30;

export interface QueueItem {
  key: string;
  group: QueueGroup;
  kind: QueueKind;
  task: TaskId | 'Rules';
  target: NavTarget;
  title: string;
  what: string;
  holder: string;
  at: ISODateTime | ISODate;
  tone: Tone;
  action: string;
}

const kindOf = (t: TaskId): QueueKind => AREAS.find((a) => a.id === AREA_OF[t])!.title as QueueKind;

export function queueItems(s: AppState): QueueItem[] {
  const c = ctxOf(s);
  const t = today(s);
  const items: QueueItem[] = [];

  workItems(s).forEach((w) => {
    const base = { key: `w-${w.id}`, kind: kindOf(w.task), task: w.task, target: { tab: 'tasks', screen: w.task, id: w.id } as NavTarget, title: `${w.id} · ${w.title}` };
    const what = specOf(w)?.summary(w, c) ?? '';
    if (isMine(w))
      items.push({
        ...base,
        group: 'me',
        what: w.status === 'Returned' ? `Returned by ${ACTORS[w.chain[w.step]]?.name ?? 'the checker'}: "${w.checkerNote}" · ${what}` : what,
        holder: 'You',
        at: w.arrivedAt,
        tone: w.status === 'Returned' ? 'critical' : 'warning',
        action: w.status === 'Returned' ? 'Correct' : 'Open',
      });
    else if (isWithOthers(w))
      items.push({
        ...base,
        group: 'others',
        what: w.waitingOn ? `${w.waitingFor}: waiting for approval before you post · ${what}` : what,
        holder: who(w.waitingOn ?? w.chain[w.step]),
        at: w.waitingOn ? w.arrivedAt : (w.history[w.history.length - 1]?.at ?? w.sentAt ?? w.arrivedAt),
        tone: 'normal',
        action: 'Open',
      });
  });

  // Month end and quarter end, before their work exists.
  const me = monthEndDate(s);
  MONTH_END_WORK
    .filter((m) => !s.work.some((w) => w.id === m.id))
    .forEach((m) =>
      items.push({ key: `me-${m.id}`, group: 'coming', kind: kindOf(m.task), task: m.task, target: { tab: 'tasks', screen: m.task, id: null }, title: `${m.task} · ${m.label}`, what: `Month-end close on ${fmtDate(me)}`, holder: 'You, later', at: me, tone: 'info', action: 'Open' }),
    );
  if (!s.work.some((w) => w.id === 'TDS-Q2'))
    items.push({ key: 'q-tds', group: 'coming', kind: 'AR/AP', task: 'T14', target: { tab: 'tasks', screen: 'T14', id: null }, title: 'T14 · 26AS/AIS match for Q2', what: 'The Q2 statement (Jul–Sep) is expected around the 20th', holder: 'You, later', at: '2026-10-20', tone: 'info', action: 'Open' });

  // MSME vendor dues (Coming up, earlier with my rule).
  const warn = s.myRules.find((r) => r.kind === 'msmeWarn' && r.status === 'Active' && !r.paused && r.until >= t);
  const warnDays = warn ? Number(warn.value) : 7;
  payablesDue(s)
    .filter((p) => p.msme && p.due >= t && p.due <= addDays(t, Math.max(warnDays, COMING_UP_DAYS)))
    .forEach((p) =>
      items.push({
        key: `msme-${p.w.id}`,
        group: 'coming',
        kind: 'Purchase',
        task: 'T1',
        target: { tab: 'tasks', screen: 'T1', id: p.w.id },
        title: `${p.w.id} · ${p.vendor?.name}`,
        what: `MSME due: pay ${inr(p.total)} by ${fmtDate(p.due)} (Payables pays; you posted it)${warn ? ` · your warning ${warn.value} days before` : ''}`,
        holder: 'Payables Executive',
        at: p.due,
        tone: daysBetween(t, p.due) <= warnDays ? 'warning' : 'info',
        action: 'Open',
      }),
    );

  // My rules: reminders, and rules waiting for the Accounts Manager.
  s.myRules
    .filter((r) => !r.removed)
    .forEach((r) => {
      const base = { key: `mr-${r.id}`, kind: 'My rule' as const, task: 'Rules' as const, target: { tab: 'rules', id: r.id } as NavTarget, title: `${r.id} · ${ruleSummary(r)}` };
      if (r.kind === 'remind' && r.status === 'Active' && !r.paused) {
        if (r.firedAt) items.push({ ...base, group: 'me', what: `Reminder: "${r.value}"`, holder: 'You', at: r.firedAt, tone: 'warning', action: 'Open' });
        else items.push({ ...base, group: 'coming', what: `Reminder on ${fmtDate(r.until)}`, holder: 'You, later', at: r.until, tone: 'info', action: 'Open' });
      } else if (r.status === 'PendingAM') items.push({ ...base, group: 'others', what: `Until ${fmtDate(r.until)} · "${r.reason}"`, holder: who('rajan'), at: r.setAt, tone: 'normal', action: 'Open' });
    });

  return items.filter((i) => i.group !== 'coming' || String(i.at).slice(0, 10) <= addDays(t, COMING_UP_DAYS));
}

const toneRank: Record<Tone, number> = { critical: 0, warning: 1, info: 2, normal: 3, success: 4 };

/** Needs me: returned first, then oldest. Waiting: oldest first. Coming up: soonest first. */
export function sortQueue(items: QueueItem[], group: QueueGroup): QueueItem[] {
  return [...items].sort((a, b) => {
    if (group === 'me' && toneRank[a.tone] !== toneRank[b.tone]) return toneRank[a.tone] - toneRank[b.tone];
    return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
  });
}

export function queueCounts(s: AppState): Record<QueueGroup, number> {
  const all = queueItems(s);
  return { me: all.filter((i) => i.group === 'me').length, others: all.filter((i) => i.group === 'others').length, coming: all.filter((i) => i.group === 'coming').length };
}

export function dueLabel(date: ISODate, todayIso: ISODate): string {
  const d = daysBetween(todayIso, date.slice(0, 10));
  if (d === 0) return 'today';
  if (d > 0) return `in ${d} day${d === 1 ? '' : 's'}`;
  return `${-d} day${d === -1 ? '' : 's'} late`;
}
