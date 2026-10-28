// Desktop dashboard building blocks (BI-style): a 12-column grid of tiles,
// a KPI card for the top strip, and a legend for charts.

import type { ReactNode } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { toneIcon, type Tone } from './Feedback';

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="tile-grid">{children}</div>;
}

/** A visual container on the dashboard: title, optional subtitle and header actions. */
export function Tile({
  title,
  subtitle,
  actions,
  span = 12,
  children,
  flush,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  span?: 3 | 4 | 5 | 6 | 7 | 8 | 12;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className={`tile tile--span-${span}`}>
      <header className="tile__head">
        <div>
          <h2 className="tile__title">{title}</h2>
          {subtitle && <p className="tile__subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="tile__actions">{actions}</div>}
      </header>
      <div className={`tile__body${flush ? ' tile__body--flush' : ''}`}>{children}</div>
    </section>
  );
}

/** KPI card: label, headline value, context line, optional status and progress. */
export function KpiCard({
  label,
  value,
  context,
  status,
  progress,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: ReactNode;
  context?: ReactNode;
  status?: { tone: Exclude<Tone, 'normal'>; label: string };
  progress?: { value: number; tone: Tone };
  icon?: LucideIcon;
  onClick?: () => void;
}) {
  const StatusIcon = status ? toneIcon[status.tone] : null;
  return (
    <button className={`kpi-card${status ? ` kpi-card--${status.tone}` : ''}`} onClick={onClick} disabled={!onClick}>
      <span className="kpi-card__top">
        <span className="kpi-card__label">
          {Icon && <Icon size={15} aria-hidden />}
          {label}
        </span>
        {onClick && <ChevronRight size={16} className="kpi-card__chev" aria-hidden />}
      </span>
      <span className="kpi-card__value num">{value}</span>
      {progress && (
        <span className="kpi-card__progress" aria-hidden>
          <span className={`kpi-card__progress-fill bg-${progress.tone}`} style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }} />
        </span>
      )}
      <span className="kpi-card__foot">
        {status && StatusIcon && (
          <span className={`kpi-card__status tone-${status.tone}`}>
            <StatusIcon size={14} aria-hidden />
            {status.label}
          </span>
        )}
        {context && <span className="kpi-card__context">{context}</span>}
      </span>
    </button>
  );
}

export function Legend({ items }: { items: { label: string; swatch: string; pattern?: boolean }[] }) {
  return (
    <span className="legend">
      {items.map((i) => (
        <span key={i.label} className="legend__item">
          <span className={`legend__swatch${i.pattern ? ' legend__swatch--hatch' : ''}`} style={i.pattern ? undefined : { background: i.swatch }} aria-hidden />
          {i.label}
        </span>
      ))}
    </span>
  );
}
