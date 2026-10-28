// One task screen for all 23 tasks (02_accounts_executive_designed_ui.md §1):
//   left   the task's items: Needs me · With checkers · Done
//   right  the item: the record (facts) · the run and its lines (Run a batch) · what you fill in (form)
//          · the checks (Stop · Reason · Warn) · progress with the checkers · the conversation (CnC)
// What each part holds comes from domain/tasks.ts; this screen only renders it.

import { ArrowRight, BadgePercent, CheckCheck, ClipboardList, MessagesSquare, Play, Send } from 'lucide-react';
import { dateOf, fmtDateTime, relTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { blockers, isMet, ocrFlagLevel, reasonChecks, specOf, type BatchData, type PvData } from '../../domain/tasks';
import type { Check, FieldDef, FieldValue, TaskId, Variance, WorkItem } from '../../domain/types';
import { ACTORS, who } from '../../store/actors';
import { ctxOf, useApp } from '../../store/appStore';
import { messagesAbout } from '../../store/cnc';
import { isMine, isWithOthers } from '../../store/selectors';
import { Button, Callout, DetailPane, EmptyState, Field, KeyValue, ListGroup, ListItem, MasterDetail, MoneyInput, Section, StatusPill, TextArea, TextInput } from '../../ui';
import { DetailHead } from '../components/DetailHead';
import { StatusSteps, type Step } from '../components/StatusSteps';
import { TaskFrame } from '../components/TaskFrame';
import { CHECK_LABEL, statusOf } from '../labels';
import { taskOf } from '../manifest';

const EMPTY_TEXT: Partial<Record<TaskId, string>> = {
  T6: 'A tax override starts from a voucher: open the voucher in T1 and choose "Request tax override".',
  T9: 'The stock reconciliation is ready to run at month end.',
  T10: 'The expired and slow-moving provision is drafted at quarter end, or when a batch expires in stock.',
  T11: 'Only in Periodic mode (company switch in the Scenario panel), at month end.',
  T14: 'The 26AS/AIS match starts when the quarter\'s statement is available.',
  T15: 'The provision run is ready at month end.',
  T18: 'The AR/AP reconciliation is ready to run at month end.',
  T19: 'The GRN-not-invoiced provision is ready at month end, from the purchase cut-off list.',
  T20: 'The standard cost review is ready at month end (only items costed at standard).',
  T21: 'The bank stock statement is ready at month end, from the inventory valuation.',
  T22: 'An ITC reversal arrives when a stock write-off is approved.',
  T23: 'The FX revaluation is ready at month end, when foreign-currency open items exist.',
};

export function TaskScreen({ code }: { code: TaskId }) {
  const s = useApp();
  const items = s.work.filter((w) => w.task === code);
  const mine = items.filter(isMine);
  const others = items.filter(isWithOthers);
  const closed = items.filter((w) => !isMine(w) && !isWithOthers(w));
  const selectedId = s.nav.tasks.id && items.some((w) => w.id === s.nav.tasks.id) ? s.nav.tasks.id : mine[0]?.id ?? others[0]?.id ?? closed[0]?.id ?? null;
  const item = items.find((w) => w.id === selectedId) ?? null;
  const c = ctxOf(s);

  const row = (w: WorkItem) => {
    const st = statusOf(w);
    const spec = specOf(w);
    return (
      <ListItem
        key={w.id}
        tone={w.status === 'Returned' ? 'critical' : w.status === 'Open' ? 'warning' : undefined}
        selected={w.id === selectedId}
        onClick={() => s.select(w.id)}
        title={`${w.id} · ${w.title}`}
        subtitle={spec ? spec.summary(w, c) : `${w.ref} · ${inr(w.amount)}`}
        meta={`${w.status === 'Sent' ? 'Sent' : 'Arrived'} ${relTime(w.status === 'Sent' ? (w.sentAt ?? w.arrivedAt) : w.arrivedAt, s.now)} · from ${ACTORS[w.from].name}`}
        right={!isMine(w) && <StatusPill tone={st.tone}>{st.label}</StatusPill>}
      />
    );
  };

  const list = (
    <>
      <ListGroup title="Needs me" count={mine.length}>
        {mine.length === 0 && <p className="list-empty">Nothing waiting for you.</p>}
        {mine.map(row)}
      </ListGroup>
      <ListGroup title="With others" count={others.length}>
        {others.length === 0 && <p className="list-empty">Nothing with a checker or waiting on a variance.</p>}
        {others.map(row)}
      </ListGroup>
      {closed.length > 0 && (
        <ListGroup title="Done" count={closed.length}>
          {closed.map(row)}
        </ListGroup>
      )}
    </>
  );

  return (
    <TaskFrame code={code}>
      <MasterDetail
        list={list}
        detail={item ? <ItemDetail item={item} /> : <EmptyState icon={ClipboardList} title="Nothing here yet" text={EMPTY_TEXT[code] ?? 'Work for this task appears here when it arrives. Play the scenario to bring it in.'} />}
      />
    </TaskFrame>
  );
}

function ItemDetail({ item }: { item: WorkItem }) {
  const s = useApp();
  const c = ctxOf(s);
  const spec = specOf(item);
  const st = statusOf(item);

  if (!spec) {
    return (
      <DetailPane header={<DetailHead eyebrow={`${item.id} · posted before the scenario`} title={item.title} right={<StatusPill tone={st.tone}>{st.label}</StatusPill>} />}>
        <KeyValue items={[{ label: 'Reference', value: item.ref }, { label: 'Amount', value: inr(item.amount) }, { label: 'Party', value: item.partyName }, { label: 'Posted', value: fmtDateTime(item.arrivedAt) }]} />
      </DetailPane>
    );
  }

  const editable = isMine(item);
  const facts = spec.facts(item, c);
  const fields = spec.fields(item, item.values, c);
  const checks = spec.checks(item, item.values, c);
  const blocks = editable ? blockers(item, c) : [];
  const freeReasons = reasonChecks(item, c);
  const batch = Array.isArray((item.data as Partial<BatchData>).lines) ? (item.data as unknown as BatchData) : null;
  const pv = item.kind === 'pv' ? (item.data as unknown as PvData) : null;
  const canOverride = !!pv && !c.vendors.find((v) => v.id === pv.vendorId)?.gstin;
  const overrideItem = s.work.find((w) => w.task === 'T6' && w.ref === item.id);
  const label = spec.sendLabel(item, item.values, c);
  const set = (key: string, v: FieldValue) => s.setValue(item.id, key, v);

  return (
    <DetailPane
      header={
        <DetailHead
          eyebrow={`${item.id} · ${item.ref} · from ${who(item.from)} · ${fmtDateTime(item.arrivedAt)}`}
          title={item.title}
          right={
            <>
              <StatusPill tone={st.tone}>{st.label}</StatusPill>
              {item.amount !== null && <span className="detail-head__amount num">{inr(item.amount)}</span>}
            </>
          }
        />
      }
      actions={
        editable || canOverride ? (
          <>
            {editable ? <span className="action-note">{blocks.length ? `Before sending: ${blocks[0]}${blocks.length > 1 ? ` (+${blocks.length - 1} more)` : ''}` : `Ready. ${spec.chain(item, item.values, c).length ? `Goes to ${spec.chain(item, item.values, c).map((k) => ACTORS[k].name).join(' → ')}.` : 'No checker: it is done when you send it.'}`}</span> : <span className="action-note">Posted. If the derived tax does not fit, ask the Compliance Officer.</span>}
            <span className="spacer" />
            {canOverride && (
              <Button icon={BadgePercent} onClick={() => s.startOverride(item.id)}>
                {overrideItem ? `Open ${overrideItem.id}` : 'Request tax override (T6)'}
              </Button>
            )}
            {editable && (
              <Button variant="primary" icon={Send} disabled={blocks.length > 0} title={blocks[0]} onClick={() => s.sendItem(item.id)}>
                {label}
              </Button>
            )}
          </>
        ) : undefined
      }
    >
      {item.status === 'Open' && item.waitingOn && (
        <Callout tone="info" title={`Waiting for ${who(item.waitingOn)}`}>
          {item.waitingFor}. You post it once the Accounts Manager approves the variance; it comes back to Needs me then.
        </Callout>
      )}
      {item.status === 'Returned' && (
        <Callout tone="critical" title={`Returned by ${who(item.chain[item.step])}`}>
          "{item.checkerNote}" Correct it and send it again.
        </Callout>
      )}

      {facts.map((sec) => (
        <Section key={sec.title} title={sec.title} aside={sec.aside}>
          <KeyValue
            columns={sec.rows.length > 4 ? 1 : 2}
            items={sec.rows.map((r) => ({
              label: r.label,
              tone: r.tone,
              strong: r.strong,
              value: (
                <span className="fact">
                  {r.value}
                  {r.source && <span className="fact__src">{r.source}</span>}
                </span>
              ),
            }))}
          />
        </Section>
      ))}

      {batch && <BatchPanel item={item} batch={batch} editable={editable} />}

      {fields.length > 0 && (
        <Section title="What you fill in" aside={editable ? 'Pre-filled from what arrived; change only what differs' : 'As sent'}>
          <div className="form-grid">
            {fields.map((f) => (
              <FormField key={f.key} item={item} f={f} editable={editable} onChange={set} level={ocrFlagLevel(c)} />
            ))}
          </div>
        </Section>
      )}

      <Section title="Checks" aside="Stop: can't send · Reason: say why · Warn: shown, then continue">
        <ul className="check-list">
          {checks.map((ch) => (
            <CheckRow key={ch.id} ch={ch} item={item} editable={editable} free={freeReasons.some((x) => x.id === ch.id)} onChange={set} />
          ))}
        </ul>
      </Section>

      <Section title="Progress">
        <StatusSteps steps={progress(item, spec.chain(item, item.values, c))} />
      </Section>

      <Conversation itemId={item.id} />
    </DetailPane>
  );
}

function progress(w: WorkItem, expected: (typeof w.chain)[number][]): Step[] {
  const steps: Step[] = [{ label: `Arrived from ${who(w.from)}`, at: w.arrivedAt, state: 'done' }];
  const v = (w.data as { variance?: Variance }).variance;
  if (v) {
    steps.push({ label: `Variance raised by ${who(v.raisedBy)}`, detail: `"${v.reason}"`, at: v.raisedAt, state: 'done' });
    steps.push(v.approvedBy ? { label: `Variance approved by ${who(v.approvedBy)}`, detail: v.decision ? `"${v.decision}"` : undefined, at: v.approvedAt, state: 'done' } : { label: `Variance with ${who('rajan')}`, state: 'current' });
  }
  const sent = w.status !== 'Open';
  const chain = sent && w.chain.length ? w.chain : expected;
  const youDone = w.status !== 'Open' && w.status !== 'Returned';
  steps.push({
    label: w.status === 'Discarded' ? 'Discarded by you (duplicate)' : youDone ? 'Done by you' : w.status === 'Returned' ? 'Back with you to correct' : 'You fill it in and send',
    at: youDone ? w.sentAt : undefined,
    state: youDone ? 'done' : w.waitingOn ? 'todo' : 'current',
  });
  if (w.status === 'Discarded') return steps;
  chain.forEach((k, i) => {
    const decided = w.history.find((h, j) => h.by === k && (h.action === 'Approved' || h.action === 'Returned') && j > 0 && (!w.sentAt || h.at >= w.sentAt));
    const isCurrent = w.status === 'Sent' && w.step === i;
    const done = (w.status === 'Approved' || (w.status === 'Sent' && i < w.step)) && !!decided;
    steps.push({
      label: done ? `${decided!.action} by ${who(k)}` : isCurrent ? `With ${who(k)}` : who(k),
      detail: done && decided!.note ? `"${decided!.note}"` : undefined,
      at: done ? decided!.at : undefined,
      state: done ? 'done' : isCurrent ? 'current' : 'todo',
    });
  });
  if (w.cc.length) steps.push({ label: `Told: ${w.cc.map(who).join(', ')}`, state: sent ? 'done' : 'todo' });
  return steps;
}

function FormField({ item, f, editable, onChange, level }: { item: WorkItem; f: FieldDef; editable: boolean; onChange: (k: string, v: FieldValue) => void; level: number }) {
  const s = useApp();
  const v = item.values[f.key];
  const flagged = f.confidence !== undefined && f.confidence < level;
  const confirmed = !!item.values[`ok:${f.key}`];
  const hint = (
    <>
      {f.confidence !== undefined && (
        <span className={flagged && !confirmed ? 'tone-critical' : 'muted'}>
          OCR {f.confidence}%{flagged ? (confirmed ? ' · confirmed' : ` · below ${level}%: confirm or correct`) : ''}
        </span>
      )}
      {f.confidence !== undefined && f.hint ? ' · ' : ''}
      {f.hint}
    </>
  );
  if (!editable) return <Field label={f.label} hint={hint}><span className="field__value">{v === '' || v === undefined ? '—' : f.input === 'money' ? inr(Number(v)) : String(v)}</span></Field>;
  return (
    <Field label={f.label} required={f.required} hint={hint}>
      <span className="field-row">
        {f.input === 'select' ? (
          <select className="input" value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value)}>
            <option value="">Choose…</option>
            {f.options!.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : f.input === 'textarea' ? (
          <TextArea value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value)} />
        ) : f.input === 'money' ? (
          <MoneyInput value={v === '' || v === undefined ? '' : Number(v)} onChange={(x) => onChange(f.key, x)} />
        ) : f.input === 'number' ? (
          <TextInput type="number" value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value === '' ? '' : Number(e.target.value))} />
        ) : (
          <TextInput type={f.input === 'date' ? 'date' : 'text'} value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value)} />
        )}
        {flagged && !confirmed && (
          <Button size="sm" icon={CheckCheck} onClick={() => s.confirmField(item.id, f.key)}>
            Confirm
          </Button>
        )}
      </span>
    </Field>
  );
}

function CheckRow({ ch, item, editable, free, onChange }: { ch: Check; item: WorkItem; editable: boolean; free: boolean; onChange: (k: string, v: FieldValue) => void }) {
  const l = CHECK_LABEL[ch.result];
  const met = isMet(ch, item.values);
  const key = ch.field ?? `why:${ch.id}`;
  return (
    <li className={`check-row check-row--${ch.result}${ch.result === 'reason' && met ? ' is-met' : ''}`}>
      <StatusPill tone={l.tone}>{l.label}</StatusPill>
      <div className="check-row__text">
        <span className="check-row__title">{ch.title}</span>
        {ch.detail && <span className="check-row__detail">{ch.detail}</span>}
        {ch.reader && <span className="check-row__reader">Read by {who(ch.reader)}</span>}
        {free &&
          (editable ? (
            <TextInput placeholder="Your reason" value={String(item.values[key] ?? '')} onChange={(e) => onChange(key, e.target.value)} />
          ) : (
            <span className="check-row__detail">"{String(item.values[key] ?? '')}"</span>
          ))}
      </div>
    </li>
  );
}

function BatchPanel({ item, batch, editable }: { item: WorkItem; batch: BatchData; editable: boolean }) {
  const s = useApp();
  if (!batch.ran)
    return (
      <Section title="Run" aside="A gate first, one press, then each line">
        <p className="small-note muted">{batch.intro}. Everything below is ready; press Run and the system works out every line.</p>
        {editable && (
          <div>
            <Button variant="primary" icon={Play} onClick={() => s.runBatch(item.id)}>
              Run
            </Button>
          </div>
        )}
      </Section>
    );
  return (
    <Section title="Lines" aside={`${batch.lines.filter((l) => l.auto).length} settled by the run · ${batch.lines.filter((l) => !l.auto).length} for you`}>
      <ul className="batch-list">
        {batch.lines.map((l) => {
          const choice = String(item.values[`line:${l.id}`] ?? '') || l.options[0];
          const needs = !l.auto && l.needsReason.includes(choice);
          return (
            <li key={l.id} className={`batch-line${l.auto ? ' is-auto' : ''}`}>
              <div className="batch-line__main">
                <span className="batch-line__label">{l.label}</span>
                <span className="batch-line__detail">{l.detail}</span>
              </div>
              <span className="batch-line__amount num">{l.amount ? inr(l.amount) : '—'}</span>
              <div className="batch-line__decide">
                {l.auto ? (
                  <StatusPill tone="success">Settled by the run</StatusPill>
                ) : editable ? (
                  <select className="input" value={choice} onChange={(e) => s.setValue(item.id, `line:${l.id}`, e.target.value)}>
                    {l.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>{choice}</span>
                )}
                {needs &&
                  (editable ? (
                    <TextInput placeholder="Why (read by the Accounts Manager)" value={String(item.values[`why:line:${l.id}`] ?? '')} onChange={(e) => s.setValue(item.id, `why:line:${l.id}`, e.target.value)} />
                  ) : (
                    <span className="small-note muted">"{String(item.values[`why:line:${l.id}`] ?? '')}"</span>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Conversation({ itemId }: { itemId: string }) {
  const s = useApp();
  const msgs = messagesAbout(s, itemId);
  return (
    <Section title="Conversation (CnC)" aside="Messages the task sent and received">
      {msgs.length === 0 ? (
        <p className="cnc-panel">
          <MessagesSquare size={16} aria-hidden /> Nothing yet. Sending this item writes the message to its checker.
        </p>
      ) : (
        <ol className="conv-list">
          {msgs.map((m) => (
            <li key={m.id} className={`conv-msg${m.mine ? ' is-mine' : ''}`}>
              <span className="conv-msg__route">
                <b>{m.mine ? 'You' : m.from.name}</b> <ArrowRight size={12} aria-hidden /> {m.to.map((p) => (p.key === 'teja' ? 'You' : p.name)).join(', ')}
                {m.cc.length > 0 && <span className="muted"> · told {m.cc.map((p) => (p.key === 'teja' ? 'you' : p.name)).join(', ')}</span>}
                <span className="conv-msg__time">{fmtDateTime(m.at)}</span>
              </span>
              <span className="conv-msg__title">{m.title}</span>
              {m.text && <span className="conv-msg__text">"{m.text}"</span>}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

export const taskTitle = (code: TaskId) => `${code} ${taskOf(code).title}`;
export const isToday = (at: string, now: string) => dateOf(at) === dateOf(now);
