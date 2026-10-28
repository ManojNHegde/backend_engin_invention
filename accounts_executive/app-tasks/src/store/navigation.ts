// Navigation model of the top-bar shell: menu → screen → selected item (max depth 2).
// Menu: Dashboard · Tasks · Reports · Rules · CnC. Task screens are the task ids T1–T23.

import type { TaskId } from '../domain/types';

export type TabId = 'dashboard' | 'tasks' | 'reports' | 'rules' | 'cnc';
export type ReportId = 'purchase' | 'notes' | 'masters' | 'advances' | 'close' | 'party' | 'approval-log';

export interface NavState {
  tab: TabId;
  tasks: { screen: TaskId | null; id: string | null };
  reports: { screen: ReportId | null; id: string | null };
  rules: { id: string | null };
}

export type NavTarget =
  | { tab: 'dashboard' }
  | { tab: 'cnc' }
  | { tab: 'tasks'; screen?: TaskId | null; id?: string | null }
  | { tab: 'reports'; screen?: ReportId | null; id?: string | null }
  | { tab: 'rules'; id?: string | null };

export const initialNav: NavState = {
  tab: 'dashboard',
  tasks: { screen: null, id: null },
  reports: { screen: null, id: null },
  rules: { id: null },
};

/** Apply a target to the navigation state (used by navigate and by opening a notification). */
export function applyTarget(nav: NavState, t: NavTarget) {
  nav.tab = t.tab;
  if (t.tab === 'tasks' && 'screen' in t) nav.tasks = { screen: t.screen ?? null, id: t.id ?? null };
  if (t.tab === 'reports' && 'screen' in t) nav.reports = { screen: t.screen ?? null, id: t.id ?? null };
  if (t.tab === 'rules' && 'id' in t) nav.rules = { id: t.id ?? null };
}
