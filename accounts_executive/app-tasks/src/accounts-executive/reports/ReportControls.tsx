// Shared report controls: period picker (incl. financial year and custom range), area and party filters, CSV export.

import { CalendarRange, Download, Layers, Users } from 'lucide-react';
import { Button } from '../../ui';
import { AREAS } from '../../store/areas';
import { PERIOD_OPTIONS, type Period, type PeriodKey, type Range } from './period';

export function PeriodPicker({ value, onChange, range }: { value: Period; onChange: (p: Period) => void; range: Range }) {
  return (
    <div className="rc-period">
      <label className="rc-select">
        <CalendarRange size={15} aria-hidden />
        <select aria-label="Period" value={value.key} onChange={(e) => onChange({ ...value, key: e.target.value as PeriodKey })}>
          {PERIOD_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      {value.key === 'custom' && (
        <span className="rc-range">
          <input type="date" className="input rc-date" aria-label="From" value={value.from ?? ''} onChange={(e) => onChange({ ...value, from: e.target.value || undefined })} />
          <span className="muted">to</span>
          <input type="date" className="input rc-date" aria-label="To" value={value.to ?? ''} onChange={(e) => onChange({ ...value, to: e.target.value || undefined })} />
        </span>
      )}
      <span className="rc-range-label">{range.label}</span>
    </div>
  );
}

export function AreaFilter({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <label className="rc-select">
      <Layers size={15} aria-hidden />
      <select aria-label="Area" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All areas</option>
        {AREAS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.title}
          </option>
        ))}
      </select>
    </label>
  );
}

export function PartyFilter({ parties, value, onChange }: { parties: { id: string; name: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <label className="rc-select">
      <Users size={15} aria-hidden />
      <select aria-label="Party" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All parties</option>
        {parties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ExportButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button icon={Download} onClick={onClick} disabled={disabled}>
      Export CSV
    </Button>
  );
}

/** Downloads rows as a CSV file (opens in Excel). */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
