import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Tone } from './Feedback';

// ---------- Key/value list ----------

export interface KV {
  label: string;
  value: ReactNode;
  tone?: Tone;
  strong?: boolean;
}

export function KeyValue({ items, columns = 2 }: { items: KV[]; columns?: 1 | 2 | 3 }) {
  return (
    <dl className={`kv kv--${columns}`}>
      {items.map((i) => (
        <div key={i.label} className="kv__row">
          <dt className="kv__label">{i.label}</dt>
          <dd className={`kv__value num${i.tone ? ` tone-${i.tone}` : ''}${i.strong ? ' kv__value--strong' : ''}`}>{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------- Ledger-style breakdown (A + B + C = Total) ----------

export function Breakdown({ rows, total, footer }: { rows: { label: string; value: string; muted?: boolean }[]; total: { label: string; value: string; tone?: Tone }; footer?: ReactNode }) {
  return (
    <div className="breakdown">
      {rows.map((r) => (
        <div key={r.label} className={`breakdown__row${r.muted ? ' is-muted' : ''}`}>
          <span>{r.label}</span>
          <span className="num">{r.value}</span>
        </div>
      ))}
      <div className={`breakdown__row breakdown__total${total.tone ? ` tone-${total.tone}` : ''}`}>
        <span>{total.label}</span>
        <span className="num">{total.value}</span>
      </div>
      {footer && <div className="breakdown__footer">{footer}</div>}
    </div>
  );
}

// ---------- Meter (utilisation) ----------

export function Meter({ value, tone = 'info', label }: { value: number; tone?: Tone; label?: string }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="meter" role="meter" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={`meter__fill bg-${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}

// ---------- Trend (sparkline + values) ----------

export function Trend({ values, unit = '', tone = 'normal', compact }: { values: number[]; unit?: string; tone?: Tone; compact?: boolean }) {
  if (values.length === 0) return <span className="subtle">—</span>;
  const w = 64;
  const h = 20;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`).join(' ');
  return (
    <span className="trend">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className={`trend__svg stroke-${tone}`}>
        <polyline points={pts} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="num">
        {compact ? `${values[values.length - 1]}${unit}` : `${values.join(' → ')}${unit}`}
      </span>
    </span>
  );
}

// ---------- List item (master list rows) ----------

export function ListItem({
  title,
  subtitle,
  meta,
  right,
  tone,
  selected,
  onClick,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  tone?: Tone;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button className={`list-item${selected ? ' is-selected' : ''}`} onClick={onClick} aria-current={selected || undefined}>
      {tone && <span className={`list-item__dot bg-${tone}`} aria-hidden />}
      <span className="list-item__main">
        <span className="list-item__title">{title}</span>
        {subtitle && <span className="list-item__subtitle">{subtitle}</span>}
        {meta && <span className="list-item__meta">{meta}</span>}
      </span>
      {right && <span className="list-item__right">{right}</span>}
    </button>
  );
}

export function ListGroup({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="list-group">
      <h3 className="list-group__title">
        {title}
        {count !== undefined && <span className="list-group__count">{count}</span>}
      </h3>
      <div className="list-group__items">{children}</div>
    </section>
  );
}

// ---------- Data table ----------

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** Makes the column sortable (click the header). */
  sortValue?: (row: T) => string | number;
}

export type SortState = { key: string; dir: 'asc' | 'desc' };

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  selectedKey,
  empty,
  defaultSort,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedKey?: string | null;
  empty?: ReactNode;
  defaultSort?: SortState;
}) {
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null);
  if (rows.length === 0 && empty) return <>{empty}</>;
  const col = sort ? columns.find((c) => c.key === sort.key && c.sortValue) : undefined;
  const sorted = col
    ? [...rows].sort((a, b) => {
        const x = col.sortValue!(a);
        const y = col.sortValue!(b);
        const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'en', { numeric: true });
        return sort!.dir === 'asc' ? cmp : -cmp;
      })
    : rows;
  const toggle = (key: string) =>
    setSort((cur) => (cur?.key === key ? { key, dir: cur.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  style={{ width: c.width, textAlign: c.align ?? 'left' }}
                  aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {c.sortValue ? (
                    <button className={`th-sort${active ? ' is-active' : ''}${c.align === 'right' ? ' th-sort--right' : ''}`} onClick={() => toggle(c.key)} title="Sort">
                      {c.header}
                      {active ? sort!.dir === 'asc' ? <ArrowUp size={12} aria-hidden /> : <ArrowDown size={12} aria-hidden /> : <ArrowUpDown size={12} aria-hidden className="th-sort__idle" />}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const key = rowKey(r);
            return (
              <tr
                key={key}
                className={`${onRowClick ? 'is-clickable' : ''}${selectedKey === key ? ' is-selected' : ''}`}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(r) : undefined}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
