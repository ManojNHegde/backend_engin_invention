// T7 — Complete and maintain vendor finance fields: the whole task screen.
//
//   left   the vendor requests: Needs me · With checkers · Done
//   right  1 Who the vendor is (Business Core, read-only)
//          2 What changes (terms, ledger, bank details)
//          3 Bank evidence (penny-drop, call-back) — only when the bank account is new or changed
//          4 The checks, live: Stop · Warn · OK
//          5 Who checks it, and where it stands
//   foot   one action: Save & send for checking (blocked while any Stop is open)

import { Check as CheckIcon, CheckCheck, CircleX, Landmark, Send, TriangleAlert, UserCog } from 'lucide-react';
import { Button, Callout, DetailPane, EmptyState, Field, KeyValue, ListGroup, ListItem, MasterDetail, PageHeader, Section, StatusPill, TextInput, type Tone } from '../../ui';
import { bankChanged, checkers, DEMO_ACCOUNTS, LEDGERS, pennyDrop, runChecks, STAGE_LABEL, stops, type CheckResult, type RequestKind, type Stage, type VendorRequest } from './model';
import { useT7 } from './store';
import './t7.css';

const KIND_LABEL: Record<RequestKind, string> = { new: 'New vendor', bank: 'Bank change', terms: 'Terms / ledger' };
const STAGE_TONE: Record<Stage, Tone> = { draft: 'warning', 'with-am': 'info', 'with-fc': 'info', applied: 'success', returned: 'critical' };
const CHECKER_NAME = { rajan: 'Rajan (Accounts Manager)', usha: 'Usha (Finance Controller)' } as const;

const isMine = (r: VendorRequest) => r.stage === 'draft' || r.stage === 'returned';
const isWithOthers = (r: VendorRequest) => r.stage === 'with-am' || r.stage === 'with-fc';

export function VendorFinanceScreen() {
  const { requests, selectedId, select, reset } = useT7();
  const mine = requests.filter(isMine);
  const others = requests.filter(isWithOthers);
  const done = requests.filter((r) => r.stage === 'applied');
  const current = requests.find((r) => r.id === selectedId) ?? null;

  const row = (r: VendorRequest) => (
    <ListItem
      key={r.id}
      title={r.identity.name}
      subtitle={r.summary}
      meta={`${KIND_LABEL[r.kind]} · from ${r.proposedBy.split(' (')[0]} · ${r.proposedOn.slice(8)}-Oct`}
      right={<StatusPill tone={STAGE_TONE[r.stage]}>{STAGE_LABEL[r.stage]}</StatusPill>}
      selected={r.id === selectedId}
      onClick={() => select(r.id)}
    />
  );

  return (
    <>
      <PageHeader
        title="Vendor finance fields"
        eyebrow={<span className="code-tag">T7 · R2</span>}
        subtitle="Set the terms, ledger and bank details of a new or changed vendor. The vendor's identity comes from Business Core and is not edited here."
        actions={
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset demo
          </Button>
        }
      />
      <MasterDetail
        list={
          <>
            <ListGroup title="Needs me" count={mine.length}>
              {mine.length ? mine.map(row) : <p className="t7-none">Nothing waiting for you.</p>}
            </ListGroup>
            <ListGroup title="With checkers" count={others.length}>
              {others.length ? others.map(row) : <p className="t7-none">Nothing with a checker.</p>}
            </ListGroup>
            <ListGroup title="Done" count={done.length}>
              {done.map(row)}
            </ListGroup>
          </>
        }
        detail={current ? <RequestDetail key={current.id} req={current} /> : <EmptyState icon={UserCog} title="Pick a vendor request" text="New vendors proposed by Procurement and changes to a vendor's terms or bank details appear on the left." />}
      />
    </>
  );
}

function RequestDetail({ req }: { req: VendorRequest }) {
  const { edit, send, decide } = useT7();
  const editable = req.stage === 'draft' || req.stage === 'returned';
  const checks = runChecks(req);
  const open = stops(checks);
  const f = req.fields;
  const bank = bankChanged(req);
  const route = checkers(req);

  return (
    <DetailPane
      header={
        <div className="t7-head">
          <div>
            <h2 className="t7-head__title">{req.identity.name}</h2>
            <p className="t7-head__sub">
              {req.summary} · {req.proposedBy}
            </p>
          </div>
          <div className="t7-head__pills">
            <StatusPill tone="normal">{KIND_LABEL[req.kind]}</StatusPill>
            <StatusPill tone={STAGE_TONE[req.stage]}>{STAGE_LABEL[req.stage]}</StatusPill>
          </div>
        </div>
      }
      actions={
        editable ? (
          <>
            <span className="t7-foot-note">{open.length ? `${open.length} thing${open.length > 1 ? 's' : ''} to fix before you can send` : `Goes to ${route.map((k) => CHECKER_NAME[k].split(' (')[0]).join(' and ')}`}</span>
            <span className="spacer" />
            <Button variant="primary" icon={Send} disabled={open.length > 0} onClick={() => send(req.id)}>
              Save &amp; send for checking
            </Button>
          </>
        ) : undefined
      }
    >
      {req.stage === 'returned' && (
        <Callout tone="critical" title="Returned to you">
          {req.history[req.history.length - 1].what}. Fix it below and send again.
        </Callout>
      )}

      <Section title="1 · Who the vendor is" aside="from Business Core · not edited here">
        <KeyValue
          columns={3}
          items={[
            { label: 'Name', value: req.identity.name },
            { label: 'GSTIN', value: req.identity.gstin ?? 'None (unregistered)' },
            { label: 'PAN', value: req.identity.pan },
            { label: 'State', value: req.identity.state },
            { label: 'Supplies', value: req.identity.supplies },
            { label: 'MSME', value: req.identity.msme ? `Yes, ${req.identity.msme}` : 'No', tone: req.identity.msme ? 'info' : undefined },
          ]}
        />
      </Section>

      <Section title="2 · What changes" aside={req.current ? 'master today → what you set' : 'new vendor'}>
        <div className="t7-grid">
          <Field label="Credit days" required hint={`Usual terms: Net ${req.usualTerms}${req.quoteTerms !== null ? ` · quotation: Net ${req.quoteTerms}` : ''}`}>
            <TextInput
              type="number"
              min={0}
              value={f.creditDays}
              disabled={!editable}
              onChange={(e) => edit(req.id, { creditDays: e.target.value === '' ? '' : Number(e.target.value) })}
            />
          </Field>
          <Field label="Ledger" required>
            <select className="input" value={f.ledger} disabled={!editable} onChange={(e) => edit(req.id, { ledger: e.target.value })}>
              <option value="">Choose…</option>
              {LEDGERS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Bank account number" required hint="Checked by penny-drop. Bank details go to the Finance Controller.">
            <TextInput value={f.bankAccount} disabled={!editable} inputMode="numeric" onChange={(e) => edit(req.id, { bankAccount: e.target.value.replace(/\D/g, '') })} />
          </Field>
          <Field label="IFSC" required>
            <TextInput value={f.ifsc} disabled={!editable} onChange={(e) => edit(req.id, { ifsc: e.target.value.toUpperCase() })} />
          </Field>
        </div>
        {req.current && (
          <p className="t7-was">
            Master today: Net {req.current.creditDays} · {req.current.ledger} · {req.current.bankAccount || 'no bank account'} {req.current.ifsc}
          </p>
        )}
        {editable && DEMO_ACCOUNTS[req.id] && (
          <div className="t7-demo">
            <span className="t7-demo__tag">DEMO</span> bank details to try:
            {DEMO_ACCOUNTS[req.id].map((d) => (
              <button key={d.label} type="button" className="reason-chip" onClick={() => edit(req.id, { bankAccount: d.account, ifsc: d.ifsc })}>
                {d.label}
              </button>
            ))}
          </div>
        )}
      </Section>

      {bank && (
        <Section title="3 · Bank evidence" aside="needed whenever the bank account is new or changed">
          <PennyDropLine req={req} />
          <div className="t7-grid">
            <Field label="Call-back: confirmed with the vendor by" required hint="Name of the person at the vendor who confirmed the account.">
              <TextInput value={f.callBackBy} disabled={!editable} onChange={(e) => edit(req.id, { callBackBy: e.target.value })} />
            </Field>
            <Field label="Call-back: date" required>
              <TextInput type="date" value={f.callBackOn} disabled={!editable} onChange={(e) => edit(req.id, { callBackOn: e.target.value })} />
            </Field>
          </div>
        </Section>
      )}

      <Section title={`${bank ? '4' : '3'} · Checks`} aside={open.length ? `${open.length} Stop` : 'nothing stops you'}>
        <ul className="t7-checks">
          {checks.map((c) => (
            <li key={c.id} className={`t7-check t7-check--${c.result}`}>
              <CheckGlyph result={c.result} />
              <div>
                <p className="t7-check__title">{c.title}</p>
                {c.detail && <p className="t7-check__detail">{c.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
        <p className="t7-was">Rule: you edit the vendor's fields, so you cannot approve this vendor's vouchers (maker ≠ checker).</p>
      </Section>

      <Section title={`${bank ? '5' : '4'} · Who checks it`}>
        <ol className="t7-steps">
          <li className={`t7-step${req.stage === 'draft' || req.stage === 'returned' ? ' is-now' : ' is-done'}`}>
            <span className="t7-step__dot" />
            <div>
              <p className="t7-step__title">Teja (Accounts Executive) saves and sends</p>
              <p className="t7-step__sub">Terms, ledger and bank details</p>
            </div>
          </li>
          {route.map((k, i) => {
            const state = req.stage === 'applied' ? 'is-done' : req.stage === 'with-am' && k === 'rajan' ? 'is-now' : req.stage === 'with-fc' ? (k === 'rajan' ? 'is-done' : 'is-now') : '';
            return (
              <li key={k} className={`t7-step ${state}`}>
                <span className="t7-step__dot" />
                <div>
                  <p className="t7-step__title">{CHECKER_NAME[k]} checks</p>
                  <p className="t7-step__sub">{k === 'rajan' ? 'Terms and ledger' : 'Bank details, with the penny-drop and call-back evidence'}</p>
                  {state === 'is-now' && (
                    <div className="t7-demo">
                      <span className="t7-demo__tag">DEMO</span>
                      <Button size="sm" variant="primary" icon={CheckCheck} onClick={() => decide(req.id, k, true)}>
                        {k === 'rajan' ? 'Rajan' : 'Usha'} approves
                      </Button>
                      <Button size="sm" onClick={() => decide(req.id, k, false, 'please re-check the account with the vendor')}>
                        Returns it
                      </Button>
                    </div>
                  )}
                </div>
                <span className="t7-step__n">{i + 1}</span>
              </li>
            );
          })}
          <li className={`t7-step${req.stage === 'applied' ? ' is-done' : ''}`}>
            <span className="t7-step__dot" />
            <div>
              <p className="t7-step__title">Applied to the vendor</p>
              <p className="t7-step__sub">Bills and payments use the new fields from here</p>
            </div>
          </li>
        </ol>
        <details className="t7-history">
          <summary>History ({req.history.length})</summary>
          <ul>
            {req.history.map((h, i) => (
              <li key={i}>
                <span className="num">{h.at}</span> · {h.who}: {h.what}
              </li>
            ))}
          </ul>
        </details>
      </Section>
    </DetailPane>
  );
}

function CheckGlyph({ result }: { result: CheckResult }) {
  if (result === 'stop') return <CircleX size={16} className="t7-check__icon" aria-label="Stop" />;
  if (result === 'warn') return <TriangleAlert size={16} className="t7-check__icon" aria-label="Warn" />;
  return <CheckIcon size={16} className="t7-check__icon" aria-label="OK" />;
}

function PennyDropLine({ req }: { req: VendorRequest }) {
  const pd = pennyDrop(req, req.fields);
  const text =
    pd.state === 'idle' ? 'Enter a valid account number and IFSC to run the penny-drop.' : pd.state === 'not-found' ? 'The bank cannot find this account.' : `Name at bank: ${pd.holder}${pd.state === 'match' ? ' (matches)' : ' (does not match)'}`;
  return (
    <p className={`t7-penny t7-penny--${pd.state}`}>
      <Landmark size={15} aria-hidden /> {text}
    </p>
  );
}
