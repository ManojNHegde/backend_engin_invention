// Backend view: what the clicks in this walkthrough would do in the real backend.
//   left   the log: API calls, events, table writes, in order
//   right  the tables as they stand now (party master and Finance), from the mock state

import { useState } from 'react';
import { fmtDateTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { DataTable, PageHeader, SegmentedControl, type Column } from '../../ui';
import { ACTORS } from '../catalogue';
import { mask } from '../rules';
import { useOnboarding } from '../store';
import type { LogEntry } from '../types';

type KindFilter = 'all' | LogEntry['kind'];

type Row = Record<string, string>;
interface TableDef {
  id: string;
  owner: 'Party master (new)' | 'Finance (existing)' | 'Finance (new)';
  rows: (s: ReturnType<typeof useOnboarding.getState>) => Row[];
}

const yes = (b: boolean | null | undefined) => (b === null || b === undefined ? 'NULL' : b ? 'true' : 'false');

const TABLES: TableDef[] = [
  { id: 'party_master.party', owner: 'Party master (new)', rows: (s) => s.parties.map((p) => ({ id: p.partyId, party_kind: p.kind, legal_name: p.legalName, trade_name: p.tradeName ?? 'NULL', status: 'active' })) },
  {
    id: 'party_master.party_tax_id',
    owner: 'Party master (new)',
    rows: (s) =>
      s.parties.flatMap((p) => [
        ...(p.pan ? [{ party_id: p.partyId, scheme: 'PAN', value: p.pan, state_code: 'NULL', gst_status: 'NULL' }] : []),
        ...p.gstins.map((g) => ({ party_id: p.partyId, scheme: 'GSTIN', value: g.value, state_code: g.stateCode, gst_status: g.status })),
      ]),
  },
  { id: 'party_master.party_location', owner: 'Party master (new)', rows: (s) => s.parties.filter((p) => p.address.city).map((p) => ({ party_id: p.partyId, kind: 'registered', address_lines: p.address.line || 'NULL', city: p.address.city, state_code: p.address.stateCode || 'NULL', postal_code: p.address.pincode || 'NULL' })) },
  { id: 'party_master.party_contact', owner: 'Party master (new)', rows: (s) => s.parties.filter((p) => p.phones.length || p.email).map((p) => ({ party_id: p.partyId, name: p.contactPerson ?? 'NULL', purpose: 'primary', email: p.email ?? 'NULL', phone: p.phones[0] ?? 'NULL' })) },
  { id: 'party_master.party_role', owner: 'Party master (new)', rows: (s) => s.parties.flatMap((p) => p.roles.map((x) => ({ party_id: p.partyId, legal_entity_id: 'LE-1', role: x.type, entered_by: ACTORS[x.enteredBy].name, form_from: x.formFrom ? ACTORS[x.formFrom].name : 'NULL', form_no: x.formNo ?? 'NULL', valid_from: x.since }))) },
  {
    id: 'accounting_txn.party_account_request',
    owner: 'Finance (new)',
    rows: (s) => s.requests.map((r) => ({ id: r.id, party_id: r.partyId ?? 'NULL', side: r.side, kind: 'onboard', status: r.status, form_no: r.formNo, form_from: ACTORS[r.from].name, made_by: 'Teja', submitted_at: r.submittedAt ?? 'NULL', account_id: r.accountId ?? 'NULL' })),
  },
  {
    id: 'accounting_txn.party_account_change',
    owner: 'Finance (new)',
    rows: (s) => s.requests.flatMap((r) => r.changes.map((c) => ({ id: c.id, request_id: r.id, block: c.block, checker_role: ACTORS[c.checker].role, status: c.status, decided_at: c.decidedAt ?? 'NULL', reason: c.reason ?? 'NULL' }))),
  },
  {
    id: 'accounting_txn.bank_verification',
    owner: 'Finance (new)',
    rows: (s) =>
      s.requests.flatMap((r) => [
        ...(r.pennyDrop ? [{ request_id: r.id, method: 'penny_drop', result: r.pennyDrop.result, name_match_pct: String(r.pennyDrop.matchPct), done_at: r.pennyDrop.at }] : []),
        ...(r.values.callBackNumber && r.submittedAt ? [{ request_id: r.id, method: 'call_back', result: 'pass', name_match_pct: 'NULL', done_at: r.submittedAt }] : []),
      ]),
  },
  { id: 'accounting.account (party leaves)', owner: 'Finance (existing)', rows: (s) => s.accounts.map((a) => ({ id: a.accountId, name: a.name, parent: a.under, type: a.side === 'payable' ? 'liability' : 'asset', is_postable: 'true' })) },
  { id: 'accounting.party', owner: 'Finance (existing)', rows: (s) => s.accounts.map((a) => ({ account_id: a.accountId, party_id: a.partyId, bank_details: '→ party_bank_account' })) },
  {
    id: 'accounting_txn.party_terms',
    owner: 'Finance (existing)',
    rows: (s) => s.accounts.map((a) => ({ account_id: a.accountId, credit_period_days: a.creditDays === null ? 'NULL' : String(a.creditDays), bill_by_bill: 'true', credit_limit: a.creditLimit === null ? 'NULL' : inr(a.creditLimit), currency: 'INR' })),
  },
  { id: 'accounting_txn.party_classification', owner: 'Finance (existing)', rows: (s) => s.accounts.map((a) => ({ account_id: a.accountId, party_category: a.category, is_related_party: 'false' })) },
  {
    id: 'accounting_txn.party_compliance_status',
    owner: 'Finance (existing)',
    rows: (s) => s.accounts.filter((a) => a.side === 'payable').map((a) => ({ account_id: a.accountId, msme_status: a.msme ?? 'NULL', msme_category: a.msmeCategory ?? 'NULL', udyam_number: a.udyam ?? 'NULL', sec_43b_h_applies: yes(a.sec43bh) })),
  },
  { id: 'accounting_txn.party_bank_account', owner: 'Finance (new)', rows: (s) => s.accounts.filter((a) => a.bankLast4).map((a) => ({ account_id: a.accountId, bank_account_no: mask(a.bankAccountNo ?? a.bankLast4!), since: a.bankSince ?? 'NULL', until: 'NULL' })) },
];

export function BackendScreen() {
  const s = useOnboarding();
  const [kind, setKind] = useState<KindFilter>('all');
  const [table, setTable] = useState('accounting_txn.party_account_request');
  const entries = [...s.log].reverse().filter((e) => kind === 'all' || e.kind === kind);
  const def = TABLES.find((t) => t.id === table)!;
  const rows = def.rows(s);
  const cols: Column<Row>[] = Object.keys(rows[0] ?? { '(no rows yet)': '' }).map((k) => ({ key: k, header: k, render: (r) => <span className={r[k] === 'NULL' ? 'subtle' : undefined}>{r[k]}</span> }));

  return (
    <div className="ob-page">
      <PageHeader title="Backend view" subtitle="Mock only. What each click in the walkthrough would call, publish and write. Nothing here is sent anywhere: it is the backend design (doc 03, §4–5) played against the UX." />
      <div className="ob-backend">
        <section className="ob-backend__log">
          <div className="ob-backend__bar">
            <h3 className="section__title">What happened</h3>
            <SegmentedControl label="Show" value={kind} onChange={setKind} options={[{ value: 'all', label: 'All' }, { value: 'api', label: 'API' }, { value: 'event', label: 'Events' }, { value: 'db', label: 'Tables' }]} />
          </div>
          <ol className="ob-log">
            {entries.map((e) => (
              <li key={e.id} className={`ob-log__item ob-log__item--${e.kind}`}>
                <span className="ob-log__kind">{e.kind === 'api' ? 'API' : e.kind === 'event' ? 'EVENT' : 'TABLE'}</span>
                <span className="ob-log__main">
                  <span className="ob-log__line">{e.line}</span>
                  {e.detail && <span className="ob-log__detail">{e.detail}</span>}
                </span>
                <span className="ob-log__meta">
                  {ACTORS[e.actor].name}
                  <br />
                  {fmtDateTime(e.at).slice(4)}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <section className="ob-backend__tables">
          <div className="ob-backend__bar">
            <h3 className="section__title">Tables now</h3>
            <select className="input ob-table-pick" value={table} onChange={(e) => setTable(e.target.value)}>
              {(['Party master (new)', 'Finance (existing)', 'Finance (new)'] as const).map((o) => (
                <optgroup key={o} label={o === 'Party master (new)' ? 'Party master: new, ours (doc 03 §4.1)' : o === 'Finance (existing)' ? 'Finance: already in aikyat-finance' : 'Finance: new, doc 03 §4.3'}>
                  {TABLES.filter((t) => t.owner === o).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.id}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <p className="subtle small-note">
            {def.owner === 'Party master (new)' ? 'Ours (doc 03 §4.1). Written when a request is approved, from what the Accounts Executive typed off the paper form.' : def.owner === 'Finance (new)' ? 'Proposed in doc 03 §4.3: the onboarding workflow tables.' : 'Exists today in aikyat-finance; keyed by (legal_entity_id, account_id).'} {rows.length} rows.
          </p>
          <DataTable columns={cols} rows={rows} rowKey={(r) => Object.values(r).join('|')} />
        </section>
      </div>
    </div>
  );
}
