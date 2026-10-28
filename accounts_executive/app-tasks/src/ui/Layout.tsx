import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';

/** Page header: where am I, what is this page, what can I do (ui reference §6). */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  onBack,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      {onBack && (
        <button className="page-header__back" onClick={onBack} aria-label="Back">
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="page-header__text">
        {eyebrow && <div className="page-header__eyebrow">{eyebrow}</div>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}

/** Desktop list → detail: the list stays visible while an item is open (nav depth 2). */
export function MasterDetail({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <div className="master-detail">
      <div className="master-detail__list">{list}</div>
      <div className="master-detail__detail">{detail}</div>
    </div>
  );
}

/** Detail pane: scrolling body with one sticky action bar at the bottom. */
export function DetailPane({ header, children, actions }: { header?: ReactNode; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="detail-pane">
      {header && <div className="detail-pane__header">{header}</div>}
      <div className="detail-pane__body">{children}</div>
      {actions && <div className="detail-pane__actions">{actions}</div>}
    </div>
  );
}

export function Section({ title, aside, children }: { title?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="section">
      {(title || aside) && (
        <div className="section__head">
          {title && <h3 className="section__title">{title}</h3>}
          {aside && <div className="section__aside">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Panel({ children, padded = true }: { children: ReactNode; padded?: boolean }) {
  return <div className={`panel${padded ? ' panel--padded' : ''}`}>{children}</div>;
}
