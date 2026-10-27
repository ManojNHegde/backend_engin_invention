import type { ISODate, ISODateTime } from './types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toUTC(date: ISODate): number {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function dateOf(dt: ISODateTime | ISODate): ISODate {
  return dt.slice(0, 10);
}

export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((toUTC(to) - toUTC(from)) / 86_400_000);
}

export function addMonths(date: ISODate, months: number): ISODate {
  const d = new Date(toUTC(date));
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function addDays(date: ISODate, days: number): ISODate {
  return new Date(toUTC(date) + days * 86_400_000).toISOString().slice(0, 10);
}

/** 05-Oct-2026 */
export function fmtDate(date: ISODate | ISODateTime | null | undefined): string {
  if (!date) return '—';
  const d = new Date(toUTC(date));
  return `${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}-${d.getUTCFullYear()}`;
}

/** Mon 05-Oct */
export function fmtDay(date: ISODate | ISODateTime): string {
  const d = new Date(toUTC(date));
  return `${DAYS[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')}-${MONTHS[d.getUTCMonth()]}`;
}

/** Mon 05-Oct-2026, 16:00 */
export function fmtDateTime(dt: ISODateTime): string {
  const time = dt.length > 10 ? dt.slice(11, 16) : '';
  const d = new Date(toUTC(dt));
  return `${DAYS[d.getUTCDay()]} ${fmtDate(dt)}${time ? `, ${time}` : ''}`;
}

export function fmtTime(dt: ISODateTime): string {
  return dt.length > 10 ? dt.slice(11, 16) : '';
}

/** "now", "3 h ago", "2 days ago" relative to the scenario clock. */
export function relTime(at: ISODateTime, now: ISODateTime): string {
  const mins = Math.round((Date.parse(`${now}:00Z`) - Date.parse(`${at}:00Z`)) / 60_000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
