// Party Ledger: one vendor or customer at a time — its finance fields, every item this role handled
// for it, and every message and change on the Approval Log.

import { useState } from 'react';
import { fmtDate, fmtDateTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { ACTORS } from '../../store/actors';
import { useApp } from '../../store/appStore';
import { DetailPane, KeyValue, ListGroup, ListItem, MasterDetail, PageHeader, Section, StatusPill } from '../../ui';
import { DetailHead } from '../components/DetailHead';
import { statusOf } from '../labels';

export function PartyLedger() {
  const s = useApp();
  const parties = [
    ...s.vendors.map((v) => ({ id: v.id, name: v.name, kind: 'Vendor' as const })),
    ...s.customers.map((c) => ({ id: c.id, name: c.name, kind: 'Customer' as const })),
  ];
  const [picked, setPicked] = useState<string>(s.nav.reports.id && parties.some((p) => p.id === s.nav.reports.id) ? s.nav.reports.id : 'V-C');
  const p = parties.find((x) => x.id === picked) ?? parties[0];
  const items = s.work.filter((w) => w.partyId === p.id).sort((a, b) => (a.arrivedAt < b.arrivedAt ? 1 : -1));
  const ids = new Set(items.map((w) => w.id));
  const log = s.log.filter((l) => (l.itemId && ids.has(l.itemId)) || ids.has(l.entity) || l.entity.startsWith(p.id));
  const v = s.vendors.find((x) => x.id === p.id);
  const c = s.customers.find((x) => x.id === p.id);
  const count = (id: string) => s.work.filter((w) => w.partyId === id).length;

  return (
    <div className="screen-fill">
      <PageHeader onBack={s.back} eyebrow={<span>Reports · Party reports</span>} title="Party Ledger" subtitle="Pick a vendor or customer: its finance fields, every item and every message." />
      <MasterDetail
        list={
          <>
            {(['Vendor', 'Customer'] as const).map((k) => (
              <ListGroup key={k} title={`${k}s`} count={parties.filter((x) => x.kind === k).length}>
                {parties
                  .filter((x) => x.kind === k)
                  .map((x) => (
                    <ListItem key={x.id} selected={x.id === p.id} onClick={() => setPicked(x.id)} title={x.name} subtitle={x.id} right={count(x.id) ? <StatusPill tone="info">{count(x.id)}</StatusPill> : undefined} />
                  ))}
              </ListGroup>
            ))}
          </>
        }
        detail={
          <DetailPane header={<DetailHead eyebrow={`${p.kind} ${p.id}`} title={p.name} />}>
            <Section title="Finance fields" aside="kept by this role; identity from Business Core">
              {v ? (
                <KeyValue
                  items={[
                    { label: 'GSTIN', value: v.gstin ?? 'Unregistered' },
                    { label: 'Credit days', value: `${v.creditDays} days` },
                    { label: 'Ledger', value: v.ledger },
                    { label: 'Bank', value: v.bankAccount ? `•••• ${v.bankAccount.slice(-4)} · ${v.ifsc}` : '—' },
                    { label: 'MSME', value: v.msme ? `${v.msme}${v.udyam ? ` · ${v.udyam}` : ''}` : 'No / not known' },
                    { label: 'Purchases this year', value: inr(v.fyPurchases) },
                  ]}
                />
              ) : c ? (
                <KeyValue
                  items={[
                    { label: 'Credit limit', value: c.creditLimit === null ? 'Advance only' : inr(c.creditLimit) },
                    { label: 'Credit days', value: `${c.creditDays} days` },
                    { label: 'Ledger', value: c.ledger },
                    { label: 'Billing instructions', value: c.billingInstructions },
                  ]}
                />
              ) : null}
            </Section>
            <Section title="Items" aside={`${items.length}`}>
              {items.length === 0 ? (
                <p className="small-note muted">Nothing handled for this party in the scenario yet.</p>
              ) : (
                <KeyValue
                  columns={1}
                  items={items.map((w) => ({
                    label: `${fmtDate(w.arrivedAt)} · ${w.task} · ${w.id}`,
                    value: (
                      <button className="link-btn" onClick={() => s.navigate({ tab: 'tasks', screen: w.task, id: w.id })}>
                        {w.title} · {inr(w.amount)} · {statusOf(w).label}
                      </button>
                    ),
                  }))}
                />
              )}
            </Section>
            <Section title="Log" aside="append-only">
              {log.length === 0 ? (
                <p className="small-note muted">No entries.</p>
              ) : (
                <KeyValue columns={1} items={log.map((l) => ({ label: `${fmtDateTime(l.at)} · ${ACTORS[l.actor].name}`, value: `${l.action}${l.detail ? ` · "${l.detail}"` : ''}`, tone: l.outcome === 'Refused' ? 'critical' : undefined }))} />
              )}
            </Section>
          </DetailPane>
        }
      />
    </div>
  );
}
