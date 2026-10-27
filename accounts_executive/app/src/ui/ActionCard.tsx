// Actions tab card: icon + colour + short verb title + badge (foundry-ui-shell-spec §3).

import type { LucideIcon } from 'lucide-react';

export type Accent = 'blue' | 'red' | 'amber' | 'violet' | 'teal' | 'slate';

export function ActionCard({
  icon: Icon,
  accent,
  title,
  description,
  code,
  cadence,
  badge,
  onClick,
}: {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  description?: string;
  code?: string;
  cadence?: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button className={`action-card action-card--${accent}`} onClick={onClick}>
      <span className="action-card__top">
        <span className="action-card__icon">
          <Icon size={22} aria-hidden />
        </span>
        {!!badge && (
          <span className="action-card__badge" aria-label={`${badge} pending`}>
            {badge}
          </span>
        )}
      </span>
      <span className="action-card__title">{title}</span>
      {description && <span className="action-card__desc">{description}</span>}
      {(code || cadence) && (
        <span className="action-card__meta">
          {code && <span className="action-card__code">{code}</span>}
          {cadence && <span>{cadence}</span>}
        </span>
      )}
    </button>
  );
}

/** Report entry card: same style as action cards, no badge. */
export function ReportCard({ icon: Icon, title, description, onClick }: { icon: LucideIcon; title: string; description: string; onClick: () => void }) {
  return (
    <button className="action-card action-card--slate action-card--report" onClick={onClick}>
      <span className="action-card__top">
        <span className="action-card__icon">
          <Icon size={22} aria-hidden />
        </span>
      </span>
      <span className="action-card__title">{title}</span>
      <span className="action-card__desc">{description}</span>
    </button>
  );
}
