// "Rules on this task": which of my rules change a task, shown on its card (Tasks → My tasks).

import { SlidersHorizontal } from 'lucide-react';
import { dateOf } from '../../domain/dates';
import { ruleSummary, ruleType } from '../../domain/myRules';
import type { TaskId } from '../../domain/types';
import { useApp } from '../../store/appStore';

export function RulesOnTask({ task }: { task: TaskId }) {
  const s = useApp();
  const t = dateOf(s.now);
  const live = s.myRules.filter((r) => !r.removed && r.status === 'Active' && !r.paused && r.until >= t && (ruleType(r.kind).task === task || r.task === task));
  if (live.length === 0) return null;
  const vendor = (id?: string) => (id ? s.vendors.find((v) => v.id === id)?.name : undefined);
  return (
    <button className="task-card__rules" onClick={() => s.navigate({ tab: 'rules', id: live[0].id })}>
      <SlidersHorizontal size={14} aria-hidden />
      <span>{live.length === 1 ? `Rule on: ${ruleSummary(live[0], vendor(live[0].vendorId))}` : `${live.length} rules on this task`}</span>
    </button>
  );
}
