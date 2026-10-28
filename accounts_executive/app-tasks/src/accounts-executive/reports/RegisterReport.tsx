// Task registers: each task that makes or posts something writes rows into one of these.
// Every register has a period (incl. financial year), an area and party filter, sortable columns and CSV export.

import { useState, type ReactNode } from 'react';
import { ScrollText } from 'lucide-react';
import { fmtDateTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { specOf } from '../../domain/tasks';
import type { ISODateTime, TaskId, WorkItem } from '../../domain/types';
import { ACTORS, who } from '../../store/actors';
import { ctxOf, useApp, type AppState } from '../../store/appStore';
import { AREA_OF } from '../../store/areas';
import type { ReportId } from '../../store/navigation';
import { DataTable, EmptyState, KeyValue, PageHeader, Sheet, StatusPill, type Column, type KV, type Tone } from '../../ui';
import { statusOf } from '../labels';
import { REPORTS } from '../manifest';
import { inRange, rangeTag, type Range } from './period';
import { AreaFilter, downloadCsv, ExportButton, PartyFilter, PeriodPicker } from './ReportControls';
import type { ReportPeriodProps } from './types';

interface Row {
  key: string;
  at: ISODateTime;
  partyId: string | null;
  task: TaskId | null;
  values: Record<string, string | number>;
  cells?: Record<string, ReactNode>;
  detail: KV[];
}

type RegisterId = Exclude<ReportId, 'party'>;

const TASKS_OF: Record<Exclude<RegisterId, 'approval-log'>, TaskId[]> = {
  purchase: ['T1', 'T2', 'T3', 'T6'],
  notes: ['T4', 'T5', 'T22'],
  masters: ['T7', 'T8', 'T12', 'T17'],
  advances: ['T13', 'T16'],
  close: ['T9', 'T10', 'T11', 'T14', 'T15', 'T18', 'T19', 'T20', 'T21', 'T23'],
};

interface ColDef {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  byDate?: boolean;
}

const COLUMNS: ColDef[] = [
  { key: 'when', header: 'Arrived', byDate: true },
  { key: 'id', header: 'Item' },
  { key: 'task', header: 'Task' },
  { key: 'title', header: 'What' },
  { key: 'party', header: 'Party' },
  { key: 'amount', header: 'Amount', align: 'right' },
  { key: 'summary', header: 'Detail' },
  { key: 'status', header: 'Status' },
  { key: 'checked', header: 'Checked by' },
];

const LOG_COLUMNS: ColDef[] = [
  { key: 'when', header: 'When', byDate: true },
  { key: 'entity', header: 'Entity' },
  { key: 'action', header: 'Action' },
  { key: 'actor', header: 'Actor' },
  { key: 'outcome', header: 'Outcome' },
  { key: 'detail', header: 'Detail' },
];

function itemRows(s: AppState, tasks: TaskId[]): Row[] {
  const c = ctxOf(s);
  return s.work
    .filter((w) => tasks.includes(w.task))
    .map((w: WorkItem) => {
      const st = statusOf(w);
      const spec = specOf(w);
      const approvals = w.history.filter((h) => h.action === 'Approved' || h.action === 'Returned');
      const checked = approvals.map((h) => `${ACTORS[h.by].name} ${h.action.toLowerCase()}`).join(', ');
      return {
        key: w.id,
        at: w.arrivedAt,
        partyId: w.partyId,
        task: w.task,
        values: { when: fmtDateTime(w.arrivedAt), id: w.id, task: w.task, title: w.title, party: w.partyName, amount: w.amount ?? '', summary: spec ? spec.summary(w, c) : w.ref, status: st.label, checked },
        cells: { amount: w.amount !== null ? inr(w.amount) : '—', status: <StatusPill tone={st.tone}>{st.label}</StatusPill>, summary: <span className="wrap">{spec ? spec.summary(w, c) : w.ref}</span>, checked: checked || '—' },
        detail: [
          { label: 'Item', value: `${w.id} · ${w.title}` },
          { label: 'Task', value: w.task },
          { label: 'Party', value: w.partyName },
          { label: 'Reference', value: w.ref },
          { label: 'Amount', value: inr(w.amount) },
          { label: 'Arrived', value: `${fmtDateTime(w.arrivedAt)} from ${who(w.from)}` },
          { label: 'Status', value: st.label, tone: st.tone },
          ...w.history.map((h, i) => ({ label: `${i + 1}. ${fmtDateTime(h.at)}`, value: `${who(h.by)}: ${h.action}${h.note ? ` · "${h.note}"` : ''}` })),
        ],
      };
    });
}

function logRows(s: AppState): Row[] {
  return s.log.map((l) => {
    const item = l.itemId ? s.work.find((w) => w.id === l.itemId) : s.work.find((w) => w.id === l.entity);
    return {
      key: l.id,
      at: l.at,
      partyId: item?.partyId ?? null,
      task: item?.task ?? null,
      values: { when: fmtDateTime(l.at), entity: l.entity, action: l.action, actor: who(l.actor), outcome: l.outcome, detail: l.detail ?? '' },
      cells: { outcome: <StatusPill tone={l.outcome === 'OK' ? 'success' : 'critical'}>{l.outcome}</StatusPill>, detail: <span className="wrap">{l.detail ?? '—'}</span> },
      detail: [
        { label: 'Entry', value: l.id },
        { label: 'When', value: fmtDateTime(l.at) },
        { label: 'Entity', value: l.entity },
        { label: 'Action', value: l.action },
        { label: 'Actor', value: who(l.actor) },
        { label: 'Outcome', value: l.outcome, tone: l.outcome === 'OK' ? ('success' as Tone) : ('critical' as Tone) },
        { label: 'Message to', value: l.to?.map(who).join(', ') ?? '—' },
        { label: 'Detail', value: l.detail ?? '—' },
      ],
    };
  });
}

export function RegisterReport({ id, period, setPeriod, range }: { id: RegisterId } & ReportPeriodProps & { range: Range }) {
  const s = useApp();
  const [area, setArea] = useState('');
  const [partyId, setPartyId] = useState('');
  const meta = REPORTS.find((r) => r.id === id)!;
  const isLog = id === 'approval-log';
  const cols = isLog ? LOG_COLUMNS : COLUMNS;
  const all = isLog ? logRows(s) : itemRows(s, TASKS_OF[id]);
  const rows = all
    .filter((r) => inRange(r.at, range) && (!partyId || r.partyId === partyId) && (!area || (r.task && AREA_OF[r.task] === area)))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  const parties = [...new Map(all.filter((r) => r.partyId).map((r) => [r.partyId!, { id: r.partyId!, name: String(r.values.party ?? r.partyId) }])).values()];
  const selected = rows.find((r) => r.key === s.nav.reports.id) ?? null;
  const columns: Column<Row>[] = cols.map((c) => ({
    key: c.key,
    header: c.header,
    align: c.align,
    render: (r) => r.cells?.[c.key] ?? (r.values[c.key] === '' ? '—' : r.values[c.key]),
    sortValue: (r) => (c.byDate ? r.at : r.values[c.key]),
  }));
  const summary = isLog
    ? [
        { label: 'Entries', value: rows.length },
        { label: 'Refused attempts', value: rows.filter((r) => r.values.outcome === 'Refused').length, tone: 'critical' as Tone },
      ]
    : [
        { label: 'Items', value: rows.length },
        { label: 'With checkers', value: rows.filter((r) => String(r.values.status).startsWith('With')).length, tone: 'info' as Tone },
        { label: 'Approved or done', value: rows.filter((r) => ['Approved', 'Done'].includes(String(r.values.status))).length, tone: 'success' as Tone },
        { label: 'Amount', value: inr(rows.reduce((a, r) => a + (typeof r.values.amount === 'number' ? r.values.amount : 0), 0)) },
      ];

  return (
    <div className="screen-fill">
      <PageHeader onBack={s.back} eyebrow={<span>Reports · {isLog ? 'Audit trail' : 'Task registers'}</span>} title={meta.title} subtitle={meta.description} />
      <div className="report-toolbar">
        <PeriodPicker value={period} onChange={setPeriod} range={range} />
        <AreaFilter value={area} onChange={setArea} />
        <PartyFilter parties={parties} value={partyId} onChange={setPartyId} />
        <span className="spacer" />
        <span className="muted small-note">Click a column header to sort</span>
        <ExportButton
          disabled={rows.length === 0}
          onClick={() =>
            downloadCsv(
              `${id}_${partyId || 'all'}_${rangeTag(range)}.csv`,
              cols.map((c) => c.header),
              rows.map((r) => cols.map((c) => r.values[c.key])),
            )
          }
        />
      </div>
      <div className="stat-row">
        {summary.map((x) => (
          <div key={x.label} className="stat">
            <span className={`stat__value num${'tone' in x && x.tone ? ` tone-${x.tone}` : ''}`}>{x.value}</span>
            <span className="stat__label">{x.label}</span>
          </div>
        ))}
      </div>
      <DataTable
        key={id}
        columns={columns}
        rows={rows}
        rowKey={(r) => r.key}
        onRowClick={(r) => s.select(r.key)}
        selectedKey={selected?.key}
        empty={<EmptyState icon={ScrollText} title="Nothing in this period" text="Widen the period (e.g. This financial year), clear the filters, or play the scenario." />}
      />
      <Sheet open={!!selected} onClose={() => s.select(null)} title={selected ? `${meta.title} · ${selected.key}` : ''} description="Read-only">
        {selected && <KeyValue columns={1} items={selected.detail} />}
      </Sheet>
    </div>
  );
}
