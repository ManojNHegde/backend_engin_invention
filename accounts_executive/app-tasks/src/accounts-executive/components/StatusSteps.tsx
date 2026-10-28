import { Check } from 'lucide-react';
import { fmtDateTime } from '../../domain/dates';

export interface Step {
  label: string;
  detail?: string;
  at?: string;
  state: 'done' | 'current' | 'todo';
}

/** Vertical progress: who has done what, who has it now, who is next. */
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
