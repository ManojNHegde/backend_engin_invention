// Small building blocks shared by the onboarding screens.

import type { ReactNode } from 'react';
import { Check, Code2 } from 'lucide-react';
import { fmtDateTime } from '../../domain/dates';
import { StatusPill, type Tone } from '../../ui';
import { ACTORS, STATES, who } from '../catalogue';
import type { Origin } from '../rules';
import type { Party, Side, Request } from '../types';

export const ORIGIN_LABEL: Record<Origin, string> = {
  worked: 'Worked out',
  changed: 'Changed by you',
  waits: 'Waiting',
  typed: 'Typed',
  empty: 'To type',
};

export function OriginBadge({ origin, children }: { origin: Origin; children?: ReactNode }) {
  return <span className={`ob-badge ob-badge--${origin}`}>{children ?? ORIGIN_LABEL[origin]}</span>;
}

/** Which backend call a button makes. Mock only: nothing is sent. */
export function ApiHint({ children }: { children: ReactNode }) {
  return (
    <span className="ob-api" title="The API call this action makes in the backend design (not called in the mock)">
      <Code2 size={12} aria-hidden />
      {children}
    </span>
  );
}

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

export interface Step {
  label: string;
  detail?: string;
  at?: string;
  state: 'done' | 'current' | 'todo';
}

export function StatusSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={`${s.label}-${i}`} className={`steps__item is-${s.state}`}>
          <span className="steps__dot" aria-hidden>
            {s.state === 'done' && <Check size={12} />}
          </span>
          <span className="steps__text">
            <span className="steps__label">{s.label}</span>
            {s.detail && <span className="steps__detail">{s.detail}</span>}
            {s.at && <span className="steps__detail">{fmtDateTime(s.at)}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export const STATUS: Record<Request['status'], { label: string; tone: Tone }> = {
  draft: { label: 'Needs me', tone: 'warning' },
  returned: { label: 'Returned', tone: 'critical' },
  submitted: { label: 'With checkers', tone: 'info' },
  active: { label: 'Active', tone: 'success' },
  sent_back: { label: 'Form returned', tone: 'normal' },
};

export function StatusOf({ r }: { r: Request }) {
  const s = STATUS[r.status];
  return <StatusPill tone={s.tone}>{s.label}</StatusPill>;
}

/** A party as the master holds it, read-only (Vendors & customers list). */
export function IdentityBlock({ p, side }: { p: Party; side: Side }) {
  const role = p.roles.find((x) => x.type === (side === 'payable' ? 'supplier' : 'customer'));
  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Legal name', value: p.legalName },
    ...(p.tradeName ? [{ label: 'Trade name', value: p.tradeName }] : []),
    { label: 'Party id', value: <span className="mono">{p.partyId}</span> },
    { label: 'PAN', value: p.pan ? <span className="mono">{p.pan}</span> : '—' },
    ...p.gstins.map((g) => ({
      label: `GSTIN · ${STATES[g.stateCode]?.name ?? g.stateCode}`,
      value: (
        <span className="inline-gap">
          <span className="mono">{g.value}</span>
          <StatusPill tone={g.status === 'active' ? 'success' : g.status === 'suspended' ? 'warning' : 'critical'}>{g.status}</StatusPill>
        </span>
      ),
    })),
    { label: 'Address', value: [p.address.line, p.address.city, p.address.pincode].filter(Boolean).join(', ') || '—' },
    { label: 'Contact', value: p.contactPerson ?? '—' },
    { label: 'Email', value: p.email ?? '—' },
    { label: 'Phone', value: p.phones.join(' · ') || '—' },
  ];
  return (
    <div className="ob-identity">
      <div className="ob-identity__grid">
        {rows.map((r) => (
          <div key={r.label} className="ob-identity__row">
            <span className="ob-identity__label">{r.label}</span>
            <span className="ob-identity__value">{r.value}</span>
          </div>
        ))}
      </div>
      {role && (
        <div className="ob-identity__why">
          <p>
            <strong>{side === 'payable' ? 'Supplier' : 'Customer'} of our company</strong> since {role.since} · typed in by {who(role.enteredBy)}
            {role.formFrom ? ` from ${ACTORS[role.formFrom].name}'s paper form${role.formNo ? ` ${role.formNo}` : ''}` : ''}
          </p>
        </div>
      )}
    </div>
  );
}

export const actorName = (k: keyof typeof ACTORS) => ACTORS[k].name;
