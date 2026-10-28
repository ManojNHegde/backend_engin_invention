// Dashboard tiles of this role:
//   AreaBoard     — the 4 areas side by side: what needs me, what is with checkers, the oldest open items
//   PayablesWatch — what I posted that Payables must pay, MSME vendors first (from the vouchers' due dates)
//   WorklistTile  — My queue by whose move it is, then each task with work
//   MonthEndTile  — the close checklist: each run and where it is

import { ChevronRight } from 'lucide-react';
import { daysBetween, fmtDate } from '../../domain/dates';
import { inr } from '../../domain/money';
import { specOf } from '../../domain/tasks';
import { ctxOf, useApp } from '../../store/appStore';
import { AREA_OF, AREAS } from '../../store/areas';
import { queueCounts } from '../../store/queue';
import { areaCounts, isMine, monthEndDate, monthEndStatus, payablesDue, taskBadges, today, workItems } from '../../store/selectors';
import { DataTable, StatusPill, Tile } from '../../ui';
import { TASKS } from '../manifest';
import '../queue/queue.css';

export function AreaBoard() {
  const s = useApp();
  const counts = areaCounts(s);
  const c = ctxOf(s);
  const open = workItems(s).filter(isMine);
  return (
    <Tile span={8} title="My work by area" subtitle="The 4 areas of §11.1–11.4. Open an item to work on it.">
      <div className="area-board">
        {AREAS.map((a) => {
          const n = counts[a.id];
          const top = open
            .filter((w) => AREA_OF[w.task] === a.id)
            .sort((x, y) => (x.status === 'Returned' ? -1 : y.status === 'Returned' ? 1 : x.arrivedAt < y.arrivedAt ? -1 : 1))
            .slice(0, 3);
          return (
            <section key={a.id} className="area-card">
              <header className="area-card__head">
                <span className="code-tag">{a.ref}</span>
                <h3>{a.title}</h3>
              </header>
              <div className="area-card__nums">
                <span className={n.me ? 'is-hot' : ''}>
                  <b className="num">{n.me}</b> needs me
                </span>
                <span>
                  <b className="num">{n.others}</b> with checkers
                </span>
                <span>
                  <b className="num">{n.done}</b> done
                </span>
              </div>
              <ul className="area-card__list">
                {top.length === 0 && <li className="muted small-note">Nothing open.</li>}
                {top.map((w) => (
                  <li key={w.id}>
                    <button onClick={() => s.navigate({ tab: 'tasks', screen: w.task, id: w.id })}>
                      <span className="code-tag">{w.task}</span>
                      <span className="area-card__item">
                        <span>{w.title}</span>
                        <span className="muted small-note">{w.status === 'Returned' ? `Returned: "${w.checkerNote}"` : specOf(w)?.summary(w, c)}</span>
                      </span>
                      <ChevronRight size={14} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Tile>
  );
}

export function PayablesWatch() {
  const s = useApp();
  const t = today(s);
  const rows = payablesDue(s);
  return (
    <Tile span={7} flush title="Posted purchases: due dates" subtitle="What you posted that Payables must pay. MSME vendors first: never later than 45 days.">
      <DataTable
        rowKey={(r) => r.w.id}
        rows={rows}
        onRowClick={(r) => s.navigate({ tab: 'tasks', screen: r.w.task, id: r.w.id })}
        empty={<p className="sugg-none">Nothing posted yet in this scenario.</p>}
        columns={[
          {
            key: 'v',
            header: 'Vendor',
            render: (r) => (
              <span className="cell-stack">
                <strong>{r.vendor?.name}</strong>
                <span className="subtle">
                  {r.w.id} · {r.invoice}
                </span>
              </span>
            ),
          },
          { key: 't', header: 'Total', align: 'right', render: (r) => inr(r.total) },
          { key: 'd', header: 'Due', render: (r) => `${fmtDate(r.due)} (${r.days} days)` },
          {
            key: 'l',
            header: 'In',
            render: (r) => {
              const d = daysBetween(t, r.due);
              return <span className={d <= 7 ? 'tone-warning' : ''}>{d < 0 ? `${-d} days late` : `${d} days`}</span>;
            },
          },
          { key: 'm', header: 'MSME', render: (r) => (r.msme ? <StatusPill tone="warning">MSME</StatusPill> : <span className="subtle">—</span>) },
          { key: 's', header: 'Voucher', render: (r) => <StatusPill tone={r.w.status === 'Approved' || r.w.status === 'Done' ? 'success' : 'info'}>{r.w.status === 'Sent' ? 'With Rajan' : r.w.status === 'Done' ? 'Posted' : 'Approved'}</StatusPill> },
        ]}
      />
    </Tile>
  );
}

export function WorklistTile() {
  const s = useApp();
  const badges = taskBadges(s);
  const q = queueCounts(s);
  const cells = [
    { group: 'me' as const, label: 'Needs me', value: q.me },
    { group: 'others' as const, label: 'Waiting on others', value: q.others },
    { group: 'coming' as const, label: 'Coming up', value: q.coming },
  ];
  const withWork = TASKS.filter((t) => badges[t.code]);
  return (
    <Tile span={5} flush title="My worklist" subtitle="My queue by whose move it is, then each task with work">
      <div className="qsum">
        {cells.map((c) => (
          <button key={c.group} className="qsum__cell" onClick={() => s.openQueue(c.group)} aria-label={`${c.label}: ${c.value}. Open My queue`}>
            <span className="qsum__label">{c.label}</span>
            <span className={`qsum__value${c.group === 'me' && c.value > 0 ? ' is-hot' : ''}`}>{c.value}</span>
          </button>
        ))}
      </div>
      <div className="wl">
        {withWork.length === 0 && <p className="sugg-none">No task has work waiting for you.</p>}
        {withWork.map((w) => {
          const Icon = w.icon;
          return (
            <button
              key={w.code}
              className={`wl__row action-card--${w.accent}`}
              onClick={() => {
                s.setQueueUi({ view: 'tasks' });
                s.navigate({ tab: 'tasks', screen: w.code, id: null });
              }}
            >
              <span className="wl__icon">
                <Icon size={16} aria-hidden />
              </span>
              <span className="wl__title">
                {w.code} · {w.title}
              </span>
              <span className="wl__cadence">{AREAS.find((a) => a.id === w.area)?.title}</span>
              <span className="wl__count num has-work">{badges[w.code]}</span>
              <ChevronRight size={16} className="wl__chev" aria-hidden />
            </button>
          );
        })}
      </div>
    </Tile>
  );
}

export function MonthEndTile() {
  const s = useApp();
  const rows = monthEndStatus(s);
  const end = monthEndDate(s);
  const done = rows.filter((r) => r.state === 'approved' || r.state === 'with checker').length;
  const tone = (st: string) => (st === 'approved' ? 'success' : st === 'with checker' ? 'info' : st === 'to do' ? 'warning' : 'normal');
  return (
    <Tile span={5} title="Month-end close" subtitle={`${done} of ${rows.length} done or with a checker · close on ${fmtDate(end)} (${Math.max(0, daysBetween(today(s), end))} days)`}>
      <ul className="close-list">
        {rows.map((r) => (
          <li key={r.id}>
            <button onClick={() => s.navigate({ tab: 'tasks', screen: r.task, id: r.w ? r.id : null })}>
              <span className="code-tag">{r.task}</span>
              <span className="close-list__label">{r.label}</span>
              <StatusPill tone={tone(r.state)}>{r.state}</StatusPill>
            </button>
          </li>
        ))}
      </ul>
    </Tile>
  );
}
