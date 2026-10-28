import type { ReactNode } from 'react';

/** Header of a detail pane: context line, title, status and key amount on the right. */
export function DetailHead({ eyebrow, title, right }: { eyebrow: ReactNode; title: string; right?: ReactNode }) {
  return (
    <div className="detail-head">
      <div>
        <p className="detail-head__eyebrow">{eyebrow}</p>
        <h2 className="detail-head__title">{title}</h2>
      </div>
      {right && <div className="detail-head__right">{right}</div>}
    </div>
  );
}
