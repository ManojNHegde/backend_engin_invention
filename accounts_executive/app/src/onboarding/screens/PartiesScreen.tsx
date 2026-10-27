// Vendors & customers: every active party account, one row per party and side.
// Party details come from our party master; the rest is Finance's.

import { useState } from 'react';
import { inr } from '../../domain/money';
import { fmtDate } from '../../domain/dates';
import { Callout, DataTable, KeyValue, PageHeader, Section, SegmentedControl, Sheet, StatusPill, type Column } from '../../ui';
import { categoriesFor, MSME_CATEGORY } from '../catalogue';
import { partyOf, useOnboarding } from '../store';
import type { Account } from '../types';
import { IdentityBlock } from './parts';

type Filter = 'all' | 'payable' | 'receivable';

export function PartiesScreen() {
  const s = useOnboarding();
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<string | null>(null);
  const rows = s.accounts.filter((a) => filter === 'all' || a.side === filter);
  const sel = s.accounts.find((a) => a.accountId === open) ?? null;

  const cols: Column<Account>[] = [
    { key: 'name', header: 'Account', render: (a) => <span className="cell-stack"><strong>{a.name}</strong><span className="subtle small-note">{a.accountId} · {a.partyId}</span></span>, sortValue: (a) => a.name },
    { key: 'side', header: 'Side', render: (a) => (a.side === 'payable' ? 'Vendor' : 'Customer'), sortValue: (a) => a.side },
    { key: 'under', header: 'Under', render: (a) => a.under, sortValue: (a) => a.under },
    { key: 'cat', header: 'Category', render: (a) => categoriesFor(a.side)[a.category] ?? a.category },
    { key: 'terms', header: 'Terms', render: (a) => `${a.creditDays ?? '—'} days${a.side === 'receivable' ? ` · ${inr(a.creditLimit)}` : ''}`, align: 'right', sortValue: (a) => a.creditDays ?? 0 },
    {
      key: 'msme',
      header: 'MSME',
      render: (a) =>
        a.side === 'receivable' ? '—' : a.msme === 'yes' ? (a.udyam ? <StatusPill tone="success">{MSME_CATEGORY[a.msmeCategory ?? ''] ?? 'Yes'}</StatusPill> : <StatusPill tone="warning">Yes · no Udyam</StatusPill>) : a.msme === 'unknown' ? <StatusPill tone="warning">Not known</StatusPill> : 'No',
    },
    { key: 'bank', header: 'Bank', render: (a) => (a.bankLast4 ? `•••• ${a.bankLast4}${a.bankSince && a.bankSince >= '2026-09-15' ? ' · new' : ''}` : '—') },
    { key: 'since', header: 'Active since', render: (a) => fmtDate(a.activatedAt), sortValue: (a) => a.activatedAt },
  ];

  return (
    <div className="screen-fill ob-page">
      <PageHeader
        title="Vendors & customers"
        subtitle="Every active party account. One party can have two accounts: Healthy Bite Foods is our customer and our vendor (one party P-0042, two accounts)."
        actions={<SegmentedControl label="Show" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All' }, { value: 'payable', label: 'Vendors' }, { value: 'receivable', label: 'Customers' }]} />}
      />
      <DataTable columns={cols} rows={rows} rowKey={(a) => a.accountId} onRowClick={(a) => setOpen(a.accountId)} selectedKey={open} defaultSort={{ key: 'since', dir: 'desc' }} />
      <Sheet open={!!sel} onClose={() => setOpen(null)} title={sel?.name ?? ''} description={sel ? `${sel.accountId} · ${sel.side === 'payable' ? 'vendor' : 'customer'} account` : ''} width={560}>
        {sel && (
          <div className="sheet-stack">
            <Section title="Party (party master)">
              <IdentityBlock p={partyOf(s, sel.partyId)!} side={sel.side} />
            </Section>
            <Section title="Finance (this account)">
              <KeyValue
                columns={1}
                items={[
                  { label: 'Under', value: sel.under },
                  { label: 'Category', value: categoriesFor(sel.side)[sel.category] ?? sel.category },
                  { label: 'Credit days', value: sel.creditDays ?? '—' },
                  ...(sel.side === 'receivable' ? [{ label: 'Credit limit', value: inr(sel.creditLimit) }] : []),
                  ...(sel.side === 'payable'
                    ? [
                        { label: 'MSME', value: sel.msme === 'yes' ? `${MSME_CATEGORY[sel.msmeCategory ?? ''] ?? 'Yes'} · ${sel.udyam ?? 'Udyam not received'}` : sel.msme ?? '—' },
                        { label: '43B(h) 45-day clock', value: sel.sec43bh === null ? 'Not confirmed' : sel.sec43bh ? 'Applies' : 'Does not apply' },
                        { label: 'Bank', value: sel.bankLast4 ? `•••• ${sel.bankLast4} since ${fmtDate(sel.bankSince)}` : '—' },
                      ]
                    : []),
                ]}
              />
            </Section>
            <Callout tone="info" title="Change something?">
              A change opens a new request of kind "change" (POST /party-accounts/{sel.accountId}/change-requests) and goes to the same checkers. Not built in this mock yet.
            </Callout>
          </div>
        )}
      </Sheet>
    </div>
  );
}
