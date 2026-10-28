// T17 — Create a vendor's Udyam data: the whole task screen.
//
//   left   the vendors: Needs me · With Rajan · Coming up (reminded) · Done
//   right  1 The vendor and what the record says today
//          2 What you fill in: the number and category, or — when the vendor has not answered —
//            what to do about it
//          3 What it changes (the 45-day rule, the MSME register)
//          4 The checks, live: Stop · Warn · OK
//          5 Who checks it
//   foot   one action: Save & send for checking, or Send reminder

import { BadgeCheck, CheckCheck, CircleX, Send, TriangleAlert, Check as CheckIcon, FileBadge } from 'lucide-react';
import { Button, Callout, DetailPane, EmptyState, Field, KeyValue, ListGroup, ListItem, MasterDetail, PageHeader, Section, StatusPill, TextInput, type Tone } from '../../ui';
import { CATEGORIES, CHASE_AFTER_DAYS, DEMO_NUMBERS, dueDays, isNumberTask, MSME_MAX_DAYS, needsChecker, portalLookup, runChecks, sendLabel, STAGE_LABEL, stops, TRIGGER_LABEL, type CheckResult, type Stage, type UdyamRequest } from './model';
import { useT17 } from './store';
import '../t7/t7.css';

const STAGE_TONE: Record<Stage, Tone> = { draft: 'warning', 'with-am': 'info', reminded: 'normal', applied: 'success', returned: 'critical' };
const isMine = (r: UdyamRequest) => r.stage === 'draft' || r.stage === 'returned';

export function UdyamScreen() {
  const { requests, selectedId, select, reset } = useT17();
  const current = requests.find((r) => r.id === selectedId) ?? null;

  const row = (r: UdyamRequest) => (
    <ListItem
      key={r.id}
      title={r.vendorName}
      subtitle={r.summary}
      meta={`${TRIGGER_LABEL[r.trigger]}${r.stage === 'reminded' ? ` · chase again in ${CHASE_AFTER_DAYS} days` : ''}`}
      right={<StatusPill tone={STAGE_TONE[r.stage]}>{STAGE_LABEL[r.stage]}</StatusPill>}
      selected={r.id === selectedId}
      onClick={() => select(r.id)}
    />
  );
  const group = (title: string, list: UdyamRequest[], none: string) => (
    <ListGroup title={title} count={list.length}>
      {list.length ? list.map(row) : <p className="t7-none">{none}</p>}
    </ListGroup>
  );

  return (
    <>
      <PageHeader
        title="Create a vendor's Udyam data"
        eyebrow={<span className="code-tag">T17 · R2</span>}
        subtitle="Put a vendor's Udyam (MSME) number, category and status on its record, so that payment due dates follow the 45-day rule. Chase the vendors who have not answered."
        actions={
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset demo
          </Button>
        }
      />
      <MasterDetail
        list={
          <>
            {group('Needs me', requests.filter(isMine), 'Nothing waiting for you.')}
            {group('With Rajan', requests.filter((r) => r.stage === 'with-am'), 'Nothing with the checker.')}
            {group('Coming up', requests.filter((r) => r.stage === 'reminded'), 'No reminders waiting for an answer.')}
            {group('Done', requests.filter((r) => r.stage === 'applied'), 'Nothing done yet.')}
          </>
        }
        detail={current ? <Detail key={current.id} req={current} /> : <EmptyState icon={FileBadge} title="Pick a vendor" text="Vendors who gave or changed an Udyam number, or have not answered, appear on the left." />}
      />
    </>
  );
}

function Detail({ req }: { req: UdyamRequest }) {
  const { edit, send, decide } = useT17();
  const editable = req.stage === 'draft' || req.stage === 'returned';
  const checks = runChecks(req);
  const open = stops(checks);
  const f = req.fields;
  const number = isNumberTask(req);
  const portal = number ? portalLookup(f.number) : null;
  const isMsme = number ? !!f.category : false;
  const days = dueDays(req.creditDays, isMsme);

  return (
    <DetailPane
      header={
        <div className="t7-head">
          <div>
            <h2 className="t7-head__title">{req.vendorName}</h2>
            <p className="t7-head__sub">{req.summary}</p>
          </div>
          <div className="t7-head__pills">
            <StatusPill tone="normal">{TRIGGER_LABEL[req.trigger]}</StatusPill>
            <StatusPill tone={STAGE_TONE[req.stage]}>{STAGE_LABEL[req.stage]}</StatusPill>
          </div>
        </div>
      }
      actions={
        editable ? (
          <>
            <span className="t7-foot-note">{open.length ? `${open.length} thing${open.length > 1 ? 's' : ''} to fix before you can send` : needsChecker(req) ? 'Goes to Rajan' : 'No checker needed for a reminder'}</span>
            <span className="spacer" />
            <Button variant="primary" icon={Send} disabled={open.length > 0} onClick={() => send(req.id)}>
              {sendLabel(req)}
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
      {req.stage === 'reminded' && (
        <Callout tone="info" title="Waiting for the vendor">
          A reminder went out. It comes back to you in {CHASE_AFTER_DAYS} days if there is still no answer.
        </Callout>
      )}

      <Section title="1 · The vendor today">
        <KeyValue
          columns={3}
          items={[
            { label: 'Vendor', value: req.vendorName },
            { label: 'MSME on record', value: req.onRecord.category ? `Yes, ${req.onRecord.category}` : 'Not known', tone: req.onRecord.category ? 'info' : 'warning' },
            { label: 'Udyam number on record', value: req.onRecord.udyam ?? 'None' },
            { label: 'Asked on', value: `${req.askedOn.slice(8)}-${req.askedOn.slice(5, 7)}` },
            { label: 'Reminders sent', value: String(req.reminders) },
            { label: 'Credit days', value: `Net ${req.creditDays}` },
            ...(req.certificate ? [{ label: 'Certificate from the vendor', value: req.certificate }] : []),
          ]}
        />
      </Section>

      <Section title="2 · What you fill in" aside={number ? 'type it in from the certificate' : undefined}>
        {number ? (
          <>
            <div className="t7-grid">
              <Field label="Udyam number" required hint="UDYAM-KR-03-0012345">
                <TextInput value={f.number} disabled={!editable} onChange={(e) => edit(req.id, { number: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Category" required hint={portal ? `The portal shows ${portal.category}` : 'As on the certificate'}>
                <select className="input" value={f.category} disabled={!editable} onChange={(e) => edit(req.id, { category: e.target.value as typeof f.category })}>
                  <option value="">Choose…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            {editable && DEMO_NUMBERS[req.id] && (
              <div className="t7-demo">
                <span className="t7-demo__tag">DEMO</span> numbers to try:
                {DEMO_NUMBERS[req.id].map((d) => (
                  <button key={d.label} type="button" className="reason-chip" onClick={() => edit(req.id, { number: d.number, category: d.category ?? '' })}>
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="t7-grid">
            <Field label="What to do" required>
              <select className="input" value={f.action} disabled={!editable} onChange={(e) => edit(req.id, { action: e.target.value as typeof f.action })}>
                <option value="">Choose…</option>
                <option value="remind">Send a reminder to the vendor</option>
                <option value="not-msme">Record: not an MSME (declaration received)</option>
              </select>
            </Field>
            {f.action === 'not-msme' && (
              <Field label="How you know" required hint="Rajan reads this.">
                <TextInput value={f.reason} disabled={!editable} onChange={(e) => edit(req.id, { reason: e.target.value })} />
              </Field>
            )}
          </div>
        )}
      </Section>

      <Section title="3 · What it changes">
        {number ? (
          <ul className="t7-effects">
            <li>
              <BadgeCheck size={15} aria-hidden /> {isMsme ? `Bills from this vendor fall due within ${days} days of acceptance${req.creditDays > MSME_MAX_DAYS ? ` (credit days Net ${req.creditDays} are capped at ${MSME_MAX_DAYS})` : ''}.` : 'Choose the category to see the due days.'}
            </li>
            <li>
              <BadgeCheck size={15} aria-hidden /> The Compliance Officer's MSME register picks up the number and category.
            </li>
          </ul>
        ) : f.action === 'not-msme' ? (
          <ul className="t7-effects">
            <li>
              <BadgeCheck size={15} aria-hidden /> No 45-day limit: bills follow Net {req.creditDays}.
            </li>
          </ul>
        ) : (
          <ul className="t7-effects">
            <li>
              <BadgeCheck size={15} aria-hidden /> Nothing on the vendor's record changes yet. Until it answers, bills follow Net {req.creditDays}.
            </li>
          </ul>
        )}
      </Section>

      <Section title="4 · Checks" aside={open.length ? `${open.length} Stop` : 'nothing stops you'}>
        <ul className="t7-checks">
          {checks.map((c) => (
            <li key={c.id} className={`t7-check t7-check--${c.result}`}>
              <Glyph result={c.result} />
              <div>
                <p className="t7-check__title">{c.title}</p>
                {c.detail && <p className="t7-check__detail">{c.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="5 · Who checks it">
        <ol className="t7-steps">
          <li className={`t7-step${editable ? ' is-now' : ' is-done'}`}>
            <span className="t7-step__dot" />
            <div>
              <p className="t7-step__title">Teja (Accounts Executive) saves {needsChecker(req) ? 'and sends' : 'the reminder'}</p>
            </div>
          </li>
          {needsChecker(req) && (
            <li className={`t7-step${req.stage === 'applied' ? ' is-done' : req.stage === 'with-am' ? ' is-now' : ''}`}>
              <span className="t7-step__dot" />
              <div>
                <p className="t7-step__title">Rajan (Accounts Manager) checks</p>
                <p className="t7-step__sub">{number ? 'The number, category and the portal result' : 'Your reason for recording the vendor as not an MSME'}</p>
                {req.stage === 'with-am' && (
                  <div className="t7-demo">
                    <span className="t7-demo__tag">DEMO</span>
                    <Button size="sm" variant="primary" icon={CheckCheck} onClick={() => decide(req.id, true)}>
                      Rajan approves
                    </Button>
                    <Button size="sm" onClick={() => decide(req.id, false)}>
                      Returns it
                    </Button>
                  </div>
                )}
              </div>
            </li>
          )}
          <li className={`t7-step${req.stage === 'applied' ? ' is-done' : ''}`}>
            <span className="t7-step__dot" />
            <div>
              <p className="t7-step__title">{needsChecker(req) ? 'Applied to the vendor' : 'Chase again if no answer'}</p>
              <p className="t7-step__sub">{needsChecker(req) ? 'The 45-day rule and the MSME register use it from here' : `Comes back to you in ${CHASE_AFTER_DAYS} days`}</p>
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

function Glyph({ result }: { result: CheckResult }) {
  if (result === 'stop') return <CircleX size={16} className="t7-check__icon" aria-label="Stop" />;
  if (result === 'warn') return <TriangleAlert size={16} className="t7-check__icon" aria-label="Warn" />;
  return <CheckIcon size={16} className="t7-check__icon" aria-label="OK" />;
}
