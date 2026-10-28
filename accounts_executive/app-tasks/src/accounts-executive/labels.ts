import type { CheckResult, ItemStatus, Tone } from '../domain/types';
import { ACTORS } from '../store/actors';
import type { WorkItem } from '../domain/types';

export function statusOf(w: WorkItem): { label: string; tone: Tone } {
  const by: Record<ItemStatus, { label: string; tone: Tone }> = {
    Open: w.waitingOn ? { label: `Waiting: ${w.waitingFor ?? 'approval'} (${ACTORS[w.waitingOn].name})`, tone: 'info' } : { label: 'Needs you', tone: 'warning' },
    Returned: { label: `Returned by ${ACTORS[w.chain[w.step]]?.name ?? 'checker'}`, tone: 'critical' },
    Sent: { label: `With ${ACTORS[w.chain[w.step]]?.name ?? 'checker'} (${ACTORS[w.chain[w.step]]?.role ?? ''})`, tone: 'info' },
    Approved: { label: 'Approved', tone: 'success' },
    Done: { label: 'Done', tone: 'success' },
    Discarded: { label: 'Discarded', tone: 'normal' },
  };
  return by[w.status];
}

export const CHECK_LABEL: Record<CheckResult, { label: string; tone: Tone }> = {
  stop: { label: 'Stop', tone: 'critical' },
  reason: { label: 'Reason', tone: 'warning' },
  warn: { label: 'Warn', tone: 'info' },
  ok: { label: 'OK', tone: 'success' },
};
