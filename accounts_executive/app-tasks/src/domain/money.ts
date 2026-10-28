const inrFormat = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹12,35,800 */
export function inr(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return inrFormat.format(Math.round(value));
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}
