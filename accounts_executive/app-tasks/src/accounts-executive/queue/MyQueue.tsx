// My queue: every open item across T1–T23 and my rules in one list, split by whose move it is.
// Rows open the task screen where the work is done. The kind filter is the area.

import { CalendarClock, Check, ChevronRight, Hourglass, Inbox, UserRound } from 'lucide-react';
import { dateOf, fmtDate, relTime } from '../../domain/dates';
import { useApp } from '../../store/appStore';
import { COMING_UP_DAYS, QUEUE_KINDS, dueLabel, queueItems, sortQueue, type QueueGroup, type QueueItem } from '../../store/queue';
import { Button, Chip, EmptyState } from '../../ui';
import { TASKS } from '../manifest';
import '../reports/reports.css';
import './queue.css';

const GROUPS: { id: QueueGroup; label: string; hint: string }[] = [
  { id: 'me', label: 'Needs me', hint: 'Your move. Returned items first, then the oldest.' },
  { id: 'others', label: 'Waiting on others', hint: 'With a checker: who has it and since when.' },
  { id: 'coming', label: 'Coming up', hint: `Not urgent yet: month end, the quarter's 26AS, MSME due dates and your reminders in the next ${COMING_UP_DAYS} days.` },
];

const EMPTY: Record<QueueGroup, { title: string; text: string }> = {
  me: { title: "You're all caught up", text: 'Invoices, bills, returns, new vendors and items, limit recommendations and month-end runs appear here.' },
  others: { title: 'Nothing with a checker', text: 'What you send to the Accounts Manager, Finance Controller, Compliance Officer or Credit Controller waits here.' },
  coming: { title: 'Nothing coming up', text: 'Month end, quarter end and MSME due dates appear here.' },
};

const taskTitle = (t: QueueItem['task']) => (t === 'Rules' ? 'My rules' : TASKS.find((x) => x.code === t)?.title ?? t);

export function MyQueue() {
  const s = useApp();
  const { group, kind } = s.queueUi;
  const all = queueItems(s);
  const inGroup = all.filter((i) => i.group === group);
  const shown = sortQueue(kind === 'all' ? inGroup : inGroup.filter((i) => i.kind === kind), group);
  const count = (g: QueueGroup) => all.filter((i) => i.group === g).length;
  const meta = GROUPS.find((g) => g.id === group)!;

  return (
    <div className="queue">
      <div className="tabs" role="tablist" aria-label="Whose move">
        {GROUPS.map((g) => (
          <button key={g.id} role="tab" aria-selected={g.id === group} className={`tabs__tab${g.id === group ? ' is-active' : ''}`} onClick={() => s.setQueueUi({ group: g.id, kind: 'all' })}>
            {g.id === 'me' ? <UserRound size={15} aria-hidden /> : g.id === 'others' ? <Hourglass size={15} aria-hidden /> : <CalendarClock size={15} aria-hidden />}
            {g.label}
            <span className={`tabs__count${g.id === 'me' && count('me') > 0 ? ' queue__count--hot' : ''}`}>{count(g.id)}</span>
          </button>
        ))}
      </div>

      <div className="queue__bar">
        <p className="small-note muted">{meta.hint}</p>
        <div className="chip-row" role="group" aria-label="Filter by area">
          <button className={`filter-chip${kind === 'all' ? ' is-active' : ''}`} onClick={() => s.setQueueUi({ kind: 'all' })}>
            All {inGroup.length}
          </button>
          {QUEUE_KINDS.map((k) => {
            const n = inGroup.filter((i) => i.kind === k).length;
            return (
              <button key={k} className={`filter-chip${kind === k ? ' is-active' : ''}`} disabled={n === 0} onClick={() => s.setQueueUi({ kind: k })}>
                {k} {n}
              </button>
            );
          })}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="queue__empty">
          <EmptyState icon={group === 'me' ? Check : Inbox} title={EMPTY[group].title} text={EMPTY[group].text} />
        </div>
      ) : (
        <ul className="queue__list">
          {shown.map((i) => (
            <QueueRow key={i.key} item={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function QueueRow({ item: i }: { item: QueueItem }) {
  const s = useApp();
  const open = () => s.navigate(i.target);
  const at = String(i.at).length > 10 ? String(i.at) : `${i.at}T00:00`;
  const when = i.group === 'coming' ? `Due ${dueLabel(String(i.at), dateOf(s.now))} · ${fmtDate(i.at)}` : i.group === 'others' ? `since ${relTime(at, s.now)}` : `waiting ${relTime(at, s.now).replace(' ago', '')}`;
  return (
    <li className={`queue-row queue-row--${i.tone}`}>
      <span className="queue-row__kind">
        <Chip tone={i.tone === 'normal' ? undefined : i.tone}>{i.kind}</Chip>
        <span className="queue-row__wf" title={taskTitle(i.task)}>
          {i.task === 'Rules' ? 'Rules' : i.task} · {taskTitle(i.task)}
        </span>
      </span>
      <button className="queue-row__main" onClick={open}>
        <span className="queue-row__title">{i.title}</span>
        <span className="queue-row__what">{i.what}</span>
      </button>
      <span className="queue-row__holder">
        <span className="queue-row__who">{i.holder}</span>
        <span className="queue-row__when num">{when.replace('waiting now', 'just now')}</span>
      </span>
      <span className="queue-row__action">
        <Button size="sm" variant={i.group === 'me' ? 'primary' : 'secondary'} onClick={open}>
          {i.action}
          <ChevronRight size={14} aria-hidden />
        </Button>
      </span>
    </li>
  );
}
