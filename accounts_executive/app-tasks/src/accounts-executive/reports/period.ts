// Report periods: calendar periods, Indian financial year (Apr–Mar) and a custom range.

import { addDays, fmtDate } from '../../domain/dates';
import type { ISODate, ISODateTime } from '../../domain/types';

export type PeriodKey = 'today' | 'week' | 'month' | 'quarter' | 'fy' | 'prev-fy' | 'year' | 'all' | 'custom';

export interface Period {
  key: PeriodKey;
  /** Custom range only */
  from?: ISODate;
  to?: ISODate;
}

export interface Range {
  from: ISODate | null;
  to: ISODate | null;
  label: string;
}

export const PERIOD_OPTIONS: { value: PeriodKey; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: 'This quarter (FY)' },
  { value: 'fy', label: 'This financial year' },
  { value: 'prev-fy', label: 'Previous financial year' },
  { value: 'year', label: 'This calendar year' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom range…' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/** Start year of the financial year containing a date (FY 2026-27 starts 01-Apr-2026). */
export const fyStartYear = (date: ISODate) => {
  const [y, m] = date.split('-').map(Number);
  return m >= 4 ? y : y - 1;
};
export const fyLabel = (startYear: number) => `FY ${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;

export function resolvePeriod(p: Period, today: ISODate): Range {
  const [y, m] = today.split('-').map(Number);
  switch (p.key) {
    case 'today':
      return { from: today, to: today, label: fmtDate(today) };
    case 'week': {
      const dow = (new Date(`${today}T00:00:00Z`).getUTCDay() + 6) % 7; // Monday = 0
      const from = addDays(today, -dow);
      const to = addDays(from, 6);
      return { from, to, label: `${fmtDate(from)} – ${fmtDate(to)}` };
    }
    case 'month':
      return { from: iso(y, m, 1), to: iso(y, m, lastDay(y, m)), label: `${MONTHS[m - 1]} ${y}` };
    case 'quarter': {
      const fy = fyStartYear(today);
      const q = Math.floor(((m + 8) % 12) / 3); // Apr–Jun = 0
      const startMonth = ((q * 3 + 3) % 12) + 1;
      const startYear = startMonth >= 4 ? fy : fy + 1;
      const endMonth = startMonth + 2;
      return {
        from: iso(startYear, startMonth, 1),
        to: iso(startYear, endMonth, lastDay(startYear, endMonth)),
        label: `Q${q + 1} ${fyLabel(fy)} (${MONTHS[startMonth - 1]}–${MONTHS[endMonth - 1]} ${startYear})`,
      };
    }
    case 'fy':
    case 'prev-fy': {
      const fy = fyStartYear(today) - (p.key === 'prev-fy' ? 1 : 0);
      return { from: iso(fy, 4, 1), to: iso(fy + 1, 3, 31), label: `${fyLabel(fy)} (01-Apr-${fy} – 31-Mar-${fy + 1})` };
    }
    case 'year':
      return { from: iso(y, 1, 1), to: iso(y, 12, 31), label: `Calendar ${y}` };
    case 'custom': {
      const from = p.from ?? null;
      const to = p.to ?? null;
      return { from, to, label: `${from ? fmtDate(from) : 'Start'} – ${to ? fmtDate(to) : 'Today'}` };
    }
    default:
      return { from: null, to: null, label: 'All time' };
  }
}

export function inRange(at: ISODateTime | ISODate, r: Range): boolean {
  const d = at.slice(0, 10);
  return (!r.from || d >= r.from) && (!r.to || d <= r.to);
}

/** Short tag for file names, e.g. "FY2026-27" or "2026-10-01_2026-10-31". */
export function rangeTag(r: Range): string {
  if (!r.from && !r.to) return 'all-time';
  return `${r.from ?? 'start'}_${r.to ?? 'today'}`;
}
