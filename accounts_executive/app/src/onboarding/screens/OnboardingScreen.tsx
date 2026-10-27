// The one task: set up a party account (vendor or customer), typed in from a PAPER form (decided 27-Oct).
// Procurement / Sales hand over the form; nothing arrives in the system from them. A full-screen workspace:
//   left    the requests (Needs me · With checkers · Done) and "+ New from a paper form"; collapses to a rail
//   top     what you have typed so far: name, PAN, GSTIN (with its portal check), the form it came from
//   middle  Party details · Finance details (both typed by you, all editable) · Worked out by the system
//           (a table: edit a row only if wrong) · tax tagging · checkers · history
//   right   full height: every field (✓ / missing), errors, warnings; Submit / Save / Return the form pinned

import { useState } from 'react';
import { Banknote, Bot, Check, ChevronsLeft, ChevronsRight, Circle, CheckCheck, CornerUpLeft, FileText, Link2, Pencil, Plus, Save, Search, Send, Trash2, Undo2, Unlink, UserPlus } from 'lucide-react';
import { fmtDateTime, relTime } from '../../domain/dates';
import { Button, Callout, Dialog, EmptyState, ReasonChips, SegmentedControl, StatusPill, TextArea, TextInput } from '../../ui';
import { ACTORS, FORM_FROM, ME, SIDE_LABEL, who } from '../catalogue';
import { checksOf, display, fieldsIn, GSTIN_RE, isEmpty, isMissing, optionsOf, originOf, PARTY_KEYS, stops, suggestionsOf, taxTagging, WORKED_FROM, type CheckResult, type FieldDef } from '../rules';
import { PAPERS, papersFor } from '../seed';
import { isMine, isWithOthers, partyOf, requestOf, titleOf, useOnboarding } from '../store';
import type { ActorKey, Request, Side } from '../types';
import { ApiHint, OriginBadge, StatusOf, StatusSteps, type Step } from './parts';

const API = '/party-account-requests';

export function OnboardingScreen() {
  const s = useOnboarding();
  const [collapsed, setCollapsed] = useState(false);
  const [creating, setCreating] = useState(false);
  const sorted = [...s.requests].sort((a, b) => b.arrivedAt.localeCompare(a.arrivedAt));
  const mine = sorted.filter(isMine);
  const others = sorted.filter(isWithOthers);
  const done = sorted.filter((r) => !isMine(r) && !isWithOthers(r));
  const selected = requestOf(s, s.nav.requestId) ?? mine[0] ?? others[0] ?? done[0] ?? null;

  const row = (r: Request) => {
    const name = titleOf(r);
    const when = r.status === 'submitted' ? `sent ${relTime(r.submittedAt!, s.now)}` : r.status === 'active' ? `active ${relTime(r.activatedAt!, s.now)}` : r.status === 'sent_back' ? `returned ${relTime(r.sentBack!.at, s.now)}` : relTime(r.arrivedAt, s.now);
    const tone = r.status === 'returned' ? 'critical' : r.status === 'draft' ? 'warning' : r.status === 'active' ? 'success' : r.status === 'submitted' ? 'info' : 'normal';
    return (
      <button key={r.id} className={`ob-rail__item${r.id === selected?.id ? ' is-selected' : ''}`} onClick={() => s.navigate('onboarding', r.id)} title={`${name} · ${r.id}`}>
        <span className={`ob-rail__dot bg-${tone}`} aria-hidden />
        {collapsed ? (
          <span className="ob-rail__initials">{name.slice(0, 2).toUpperCase()}</span>
        ) : (
          <span className="ob-rail__text">
            <span className="ob-rail__name">{name}</span>
            <span className="ob-rail__meta">
              {SIDE_LABEL[r.side]} · {r.formNo} · {ACTORS[r.from].name} · {when}
            </span>
          </span>
        )}
      </button>
    );
  };
  const group = (title: string, list: Request[], empty: string) => (
    <section className="ob-rail__group">
      {!collapsed && (
        <h3 className="ob-rail__title">
          {title} <span className="ob-rail__count">{list.length}</span>
        </h3>
      )}
      {list.length === 0 && !collapsed && <p className="ob-rail__empty">{empty}</p>}
      {list.map(row)}
    </section>
  );

  return (
    <div className="ob-ws">
      <nav className={`ob-rail${collapsed ? ' is-collapsed' : ''}`} aria-label="Onboarding requests">
        <div className="ob-rail__head">
          {!collapsed && (
            <span className="ob-rail__task">
              <span className="code-tag">T7 · T12 · T17</span>
              <strong>Set up a party account</strong>
            </span>
          )}
          <button className="ob-rail__toggle" onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? 'Show the list' : 'Hide the list'} title={collapsed ? 'Show the list' : 'Hide the list'}>
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          </button>
        </div>
        <div className="ob-rail__new">
          {collapsed ? (
            <button className="ob-rail__toggle" onClick={() => setCreating(true)} aria-label="New from a paper form" title="New from a paper form">
              <Plus size={16} />
            </button>
          ) : (
            <Button variant="primary" icon={Plus} block onClick={() => setCreating(true)}>
              New from a paper form
            </Button>
          )}
        </div>
        <div className="ob-rail__scroll">
          {group('Needs me', mine, 'Nothing open. A paper form on your desk? Start it with "New".')}
          {group('With checkers', others, 'Nothing with a checker.')}
          {done.length > 0 && group('Done', done, '')}
        </div>
      </nav>
      {selected ? (
        <RequestWorkspace key={selected.id} r={selected} />
      ) : (
        <div className="ob-req ob-req--empty">
          <EmptyState icon={UserPlus} title="No onboarding open" text="When Procurement or Sales hand you a vendor / customer form, start it with New." />
        </div>
      )}
      <NewDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}

/** "+ New": which form is in your hand. */
function NewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useOnboarding();
  const [side, setSide] = useState<Side>('payable');
  const [from, setFrom] = useState<ActorKey>('ravi');
  const [formNo, setFormNo] = useState('');
  const [paper, setPaper] = useState('');
  const used = new Set(s.requests.map((r) => r.paper).filter(Boolean));
  const samples = papersFor(side).filter((p) => !used.has(p.key));
  const pick = (k: string) => {
    setPaper(k);
    const p = PAPERS[k];
    if (p) {
      setFrom(p.from);
      setFormNo(p.formNo);
    }
  };
  const changeSide = (v: Side) => {
    setSide(v);
    setFrom(FORM_FROM[v][0]);
    setPaper('');
    setFormNo('');
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="New from a paper form"
      description="Procurement / Sales hand you a filled-in form with copies of the GST certificate, PAN and cheque. You type it all in here."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!formNo.trim()}
            onClick={() => {
              s.createRequest({ side, from, formNo: formNo.trim(), paper: paper || null });
              setPaper('');
              setFormNo('');
              onClose();
            }}
          >
            Open it
          </Button>
        </>
      }
    >
      <div className="sheet-stack">
        <div className="field">
          <span className="field__label">The form is for a</span>
          <SegmentedControl label="Side" value={side} onChange={changeSide} options={[{ value: 'payable', label: 'New vendor' }, { value: 'receivable', label: 'New customer' }]} />
        </div>
        <div className="field ob-demo-field">
          <span className="field__label">
            <span className="ob-launcher__tag">DEMO</span> Which paper is on your desk?
          </span>
          <select className="input" value={paper} onChange={(e) => pick(e.target.value)}>
            <option value="">A blank form (type your own)</option>
            {samples.map((p) => (
              <option key={p.key} value={p.key}>
                {p.formNo} · {p.title} (from {ACTORS[p.from].name})
              </option>
            ))}
          </select>
          <span className="field__hint">Mock only: shows the paper beside the form so you can copy from it.</span>
        </div>
        <div className="ob-two-col">
          <label className="field">
            <span className="field__label">
              Handed over by<span className="field__req"> *</span>
            </span>
            <select className="input" value={from} onChange={(e) => setFrom(e.target.value as ActorKey)}>
              {FORM_FROM[side].map((k) => (
                <option key={k} value={k}>
                  {who(k)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">
              Form number<span className="field__req"> *</span>
            </span>
            <TextInput value={formNo} placeholder={side === 'payable' ? 'VRF-0109' : 'CRF-0021'} onChange={(e) => setFormNo(e.target.value.toUpperCase())} />
          </label>
        </div>
        <ApiHint>POST {API}</ApiHint>
      </div>
    </Dialog>
  );
}

function RequestWorkspace({ r }: { r: Request }) {
  const s = useOnboarding();
  const editable = isMine(r);
  const checks = checksOf(r, s);
  const [returning, setReturning] = useState<string | null>(null);
  const [sendingBack, setSendingBack] = useState(false);
  const [showPaper, setShowPaper] = useState(!!r.paper && editable);
  const party = fieldsIn(r, 'party');
  const finance = fieldsIn(r, 'finance');
  const worked = fieldsIn(r, 'worked');
  const formErrors = checks.filter((c) => c.sendBack);
  const usable = checks.filter((c) => c.usePartyId && !r.partyId);
  const linked = partyOf(s, r.partyId);

  return (
    <div className="ob-req">
      <RequestHeader r={r} showPaper={showPaper} onTogglePaper={() => setShowPaper((x) => !x)} />

      <div className="ob-req__body">
        {showPaper && r.paper && <PaperPanel r={r} onClose={() => setShowPaper(false)} />}

        <div className="ob-req__main">
          {editable && formErrors.length > 0 && (
            <Callout tone="critical" title="This form cannot be set up">
              <ul className="ob-plain">
                {formErrors.map((c) => (
                  <li key={c.title}>
                    <strong>{c.title}.</strong> {c.detail}
                  </li>
                ))}
              </ul>
              <div className="ob-row">
                <Button variant="destructive" icon={Undo2} onClick={() => setSendingBack(true)}>
                  Return the form to {ACTORS[r.from].name}
                </Button>
                <ApiHint>POST {API}/{r.id}/send-back</ApiHint>
              </div>
            </Callout>
          )}
          {editable &&
            usable.map((c) => {
              const p = partyOf(s, c.usePartyId!)!;
              return (
                <Callout key={c.title} tone={c.level === 'stop' ? 'warning' : 'info'} title={c.title}>
                  {c.detail} {p.legalName} · PAN {p.pan ?? '—'} · {p.address.city || '—'} · {p.roles.map((x) => x.type).join(', ') || 'no role yet'}.
                  <div className="ob-row">
                    <Button icon={Link2} onClick={() => s.useParty(r.id, p.partyId)}>
                      Use {p.partyId}
                    </Button>
                    <ApiHint>GET /parties?gstin=…&amp;pan=…</ApiHint>
                  </div>
                </Callout>
              );
            })}
          {r.status === 'returned' && (
            <Callout tone="critical" title="Returned to you">
              {r.returnedReason}. Fix it and resubmit: parts already approved stay approved unless you change them.
            </Callout>
          )}
          {r.status === 'sent_back' && (
            <Callout tone="info" title={`Form returned to ${who(r.sentBack!.to)} · ${fmtDateTime(r.sentBack!.at)}`}>
              "{r.sentBack!.reason}". No party and no account were created.
            </Callout>
          )}
          {r.status === 'active' && (
            <Callout tone="success" title={`Active since ${fmtDateTime(r.activatedAt!)}`}>
              Party <strong>{r.partyId}</strong>, account <strong>{r.accountId}</strong> under {String(r.values.under)}. {r.side === 'payable' ? 'Purchase can post vouchers to it.' : 'Sales can confirm orders.'}
            </Callout>
          )}

          <section className="ob-sec">
            <header className="ob-sec__head">
              <h3>1 · Party details</h3>
              <span className="subtle small-note">{linked ? `From the party master (${linked.partyId}): locked here.` : 'From the paper form. They become the party master when approved.'}</span>
              {linked && editable && (
                <button className="link-btn" onClick={() => s.unlinkParty(r.id)}>
                  <Unlink size={12} aria-hidden /> Not this party
                </button>
              )}
            </header>
            <div className="ob-grid">
              {party.map((f) => (
                <FieldRow key={f.key} f={f} r={r} locked={!editable || !!linked} />
              ))}
            </div>
            <GstinCheck r={r} editable={editable && !linked} />
          </section>

          <section className="ob-sec">
            <header className="ob-sec__head">
              <h3>2 · Finance details</h3>
              <span className="subtle small-note">Also from the form and its attachments (cheque, Udyam certificate).</span>
            </header>
            <div className="ob-grid">
              {finance.map((f) => (
                <FieldRow key={f.key} f={f} r={r} locked={!editable} />
              ))}
            </div>
            {r.side === 'payable' && <PennyDrop r={r} editable={editable} />}
          </section>

          <section className="ob-sec">
            <header className="ob-sec__head">
              <h3>3 · Worked out by the system</h3>
              <span className="subtle small-note">From what you typed. Check them; edit one only if it is wrong.</span>
            </header>
            <WorkedTable fields={worked} r={r} readOnly={!editable} />
          </section>

          <section className="ob-sec">
            <header className="ob-sec__head">
              <h3>4 · Tax tagging</h3>
              <span className="subtle small-note">Venkat (Compliance Officer) tags this after you submit. Shown so you can spot a wrong category.</span>
            </header>
            <ul className="ob-plain">
              {taxTagging(r).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {r.changes.length > 0 && (
            <section className="ob-sec">
              <header className="ob-sec__head">
                <h3>Checkers</h3>
                <span className="subtle small-note">Each one sees and approves only their part. Rajan checks the party details against the scanned form.</span>
              </header>
              <ul className="ob-changes">
                {r.changes.map((c) => (
                  <li key={c.id} className="ob-change">
                    <span className="ob-change__main">
                      <span className="ob-change__title">
                        {c.label} → {who(c.checker)}
                      </span>
                      <span className="subtle small-note">
                        {c.decidedAt ? fmtDateTime(c.decidedAt) : 'Waiting'}
                        {c.reason ? ` · "${c.reason}"` : ''}
                      </span>
                    </span>
                    <StatusPill tone={c.status === 'approved' ? 'success' : c.status === 'returned' ? 'critical' : 'warning'}>{c.status === 'pending' ? 'Waiting' : c.status === 'approved' ? 'Approved' : 'Returned'}</StatusPill>
                    {c.status === 'pending' && r.status !== 'active' && (
                      <span className="ob-sim">
                        <button className="ob-sim__btn" onClick={() => s.decide(r.id, c.id, true)} title="Mock only: play the checker">
                          <CheckCheck size={14} aria-hidden /> {ACTORS[c.checker].name} approves
                        </button>
                        <button className="ob-sim__btn" onClick={() => setReturning(c.id)} title="Mock only: play the checker">
                          <CornerUpLeft size={14} aria-hidden /> returns
                        </button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <details className="ob-sec ob-history-box">
            <summary>History ({r.history.length})</summary>
            <ul className="ob-history">
              {[...r.history].reverse().map((h, i) => (
                <li key={i}>
                  <span className="subtle">{fmtDateTime(h.at)}</span> · <strong>{ACTORS[h.by].name}</strong> · {h.text}
                </li>
              ))}
            </ul>
          </details>
        </div>

        <aside className="ob-side">
          {editable ? (
            <Checklist r={r} groups={[['Party details', party], ['Finance details', finance], ['Worked out', worked]]} checks={checks} onSendBack={() => setSendingBack(true)} />
          ) : (
            <div className="ob-side__scroll">
              <p className="ob-aside__title">Progress</p>
              <StatusSteps steps={stepsOf(r)} />
            </div>
          )}
        </aside>
      </div>

      <ReasonDialog
        open={returning !== null}
        title={returning ? `${ACTORS[r.changes.find((c) => c.id === returning)!.checker].name} returns this part` : ''}
        description="Mock only: you are playing the checker. It goes back to the Accounts Executive with this reason."
        chips={['PAN typed does not match the PAN card copy', 'Wrong category for this supplier', 'Cancelled cheque does not match the account']}
        action="Return"
        onClose={() => setReturning(null)}
        onConfirm={(reason) => {
          s.decide(r.id, returning!, false, reason);
          setReturning(null);
        }}
      />
      <ReasonDialog
        open={sendingBack}
        title={`Return the form to ${who(r.from)}`}
        description="Nothing is created. They get the paper back with your comment (and see it in the system)."
        chips={formErrors.length ? formErrors.map((c) => `${c.title}. ${c.detail ?? ''}`.trim()) : ['GST certificate copy is missing', 'Form not signed', 'Cancelled cheque not attached']}
        action="Return the form"
        onClose={() => setSendingBack(false)}
        onConfirm={(reason) => {
          s.sendBack(r.id, reason);
          setSendingBack(false);
        }}
      />
    </div>
  );
}

/** The workspace header: what you have typed so far, and the form it came from. */
function RequestHeader({ r, showPaper, onTogglePaper }: { r: Request; showPaper: boolean; onTogglePaper: () => void }) {
  const s = useOnboarding();
  const linked = partyOf(s, r.partyId);
  const v = r.values;
  const g = r.gstCheck && r.gstCheck.forValue === v.gstin ? r.gstCheck : null;
  return (
    <header className="ob-req__head">
      <div className="ob-req__titlerow">
        <div>
          <p className="ob-req__eyebrow">
            {r.id} · New {SIDE_LABEL[r.side].toLowerCase()} · paper form <strong>{r.formNo}</strong> from {who(r.from)} · opened {fmtDateTime(r.arrivedAt)}
          </p>
          <h2 className={`ob-req__title${isEmpty(v.legalName) ? ' subtle' : ''}`}>{titleOf(r)}</h2>
        </div>
        <span className="inline-gap">
          {r.paper && (
            <Button size="sm" icon={FileText} onClick={onTogglePaper}>
              {showPaper ? 'Hide the paper' : 'Show the paper'}
            </Button>
          )}
          <StatusOf r={r} />
        </span>
      </div>
      <div className="ob-req__facts">
        <span>
          <span className="subtle">PAN</span> <span className="mono">{String(v.pan || '—')}</span>
        </span>
        <span className="inline-gap">
          <span className="subtle">GSTIN</span> <span className="mono">{String(v.gstin || '—')}</span>
          {!isEmpty(v.gstin) && (g ? <StatusPill tone={g.status === 'active' ? 'success' : g.status === 'suspended' ? 'warning' : 'critical'}>{g.status}</StatusPill> : <StatusPill tone="normal">not checked</StatusPill>)}
        </span>
        <span>{[v.city, v.state].filter((x) => !isEmpty(x)).join(', ') || <span className="subtle">city —</span>}</span>
        <span>{String(v.phone || '')}</span>
        <span className="inline-gap">
          <span className="subtle">Party</span>
          {linked ? (
            <>
              <span className="mono">{linked.partyId}</span> <span className="subtle">(already in the master)</span>
            </>
          ) : r.partyId ? (
            <span className="mono">{r.partyId}</span>
          ) : (
            <span className="subtle">new · created when approved</span>
          )}
        </span>
      </div>
    </header>
  );
}

/** Mock only: the paper form on the desk, to copy from. */
function PaperPanel({ r, onClose }: { r: Request; onClose: () => void }) {
  const s = useOnboarding();
  const p = PAPERS[r.paper!];
  const lines: [string, string][] = Object.entries(p.values).map(([k, v]) => [LABEL[k] ?? k, k === 'creditLimit' ? `₹${Number(v).toLocaleString('en-IN')}` : String(OPTION_WORDS[String(v)] ?? v)]);
  return (
    <aside className="ob-paper" aria-label="Paper form">
      <div className="ob-paper__bar">
        <span className="ob-launcher__tag">DEMO</span>
        <span className="small-note">The paper on your desk</span>
        <button className="link-btn" onClick={onClose}>
          Hide
        </button>
      </div>
      <div className="ob-paper__sheet">
        <p className="ob-paper__head">{r.side === 'payable' ? 'VENDOR REGISTRATION FORM' : 'CUSTOMER REGISTRATION FORM'}</p>
        <p className="ob-paper__no">
          No. {p.formNo} · from {ACTORS[p.from].name}
        </p>
        <dl className="ob-paper__list">
          {lines.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <p className="ob-paper__note">"{p.note}"</p>
        <p className="ob-paper__att">Attached: {p.attachments.join(' · ')}</p>
        <p className="ob-paper__sign">Signed: {ACTORS[p.from].name}</p>
      </div>
      {isMine(r) && (
        <button className="ob-sim__btn ob-paper__type" onClick={() => s.typeFromPaper(r.id)} title="Mock only">
          <Pencil size={14} aria-hidden /> Type it all in for me
        </button>
      )}
    </aside>
  );
}

const LABEL: Record<string, string> = {
  legalName: 'Name',
  tradeName: 'Trade name',
  pan: 'PAN',
  gstin: 'GSTIN',
  addressLine: 'Address',
  city: 'City',
  pincode: 'PIN',
  contactPerson: 'Contact',
  phone: 'Phone',
  email: 'Email',
  category: 'Supplies / buys',
  relatedParty: 'Related to us?',
  creditDays: 'Credit days',
  creditLimit: 'Credit limit',
  msmeStatus: 'MSME?',
  msmeCategory: 'MSME type',
  bankAccountNo: 'Bank A/c',
  ifsc: 'IFSC',
  beneficiary: 'A/c name',
  poRule: 'PO on invoice',
  delivery: 'Send invoices by',
};
const OPTION_WORDS: Record<string, string> = {
  goods_msme: 'Goods (MSME)',
  goods_non_msme: 'Goods',
  domestic_b2b_regular: 'Bakery chain, B2B',
  dealer_distributor: 'Distributor',
  yes: 'Yes',
  no: 'No',
  micro: 'Micro',
  every_invoice: 'Yes, every invoice',
  none: 'Not needed',
  email: 'Email',
};

function control(f: FieldDef, r: Request, disabled: boolean, set: (v: string | number | boolean | null) => void) {
  const v = r.values[f.key];
  if (f.kind === 'select') {
    return (
      <select className="input" value={String(v ?? '')} disabled={disabled} onChange={(e) => set(e.target.value)}>
        <option value="">Choose…</option>
        {Object.entries(optionsOf(f, r)).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>
    );
  }
  if (f.kind === 'switch') {
    return (
      <label className="ob-check">
        <input type="checkbox" checked={!!v} disabled={disabled} onChange={(e) => set(e.target.checked)} /> {v ? 'Yes' : 'No'}
      </label>
    );
  }
  if (f.kind === 'number') {
    return (
      <span className="field-row">
        {f.unit === '₹' && <span className="subtle">₹</span>}
        <TextInput inputMode="numeric" disabled={disabled} value={v === null || v === undefined ? '' : String(v)} onChange={(e) => set(e.target.value === '' ? '' : Number(e.target.value.replace(/[^0-9]/g, '')))} />
        {f.unit && f.unit !== '₹' && <span className="subtle">{f.unit}</span>}
      </span>
    );
  }
  return <TextInput value={String(v ?? '')} disabled={disabled} placeholder={f.placeholder} onChange={(e) => set(f.upper ? e.target.value.toUpperCase().replace(/\s/g, '') : e.target.value)} />;
}

function FieldRow({ f, r, locked }: { f: FieldDef; r: Request; locked: boolean }) {
  const s = useOnboarding();
  const required = f.required?.(r.values, r);
  const missing = !locked && isMissing(f, r);
  return (
    <div className={`field ob-field${f.wide ? ' ob-field--wide' : ''}${missing ? ' is-missing' : ''}`}>
      <span className="field__label">
        {f.label}
        {required ? <span className="field__req"> *</span> : <span className="subtle"> (optional)</span>}
      </span>
      {control(f, r, locked, (v) => s.setValue(r.id, f.key, v))}
      {f.hint && !locked && <span className="field__hint">{f.hint}</span>}
    </div>
  );
}

function GstinCheck({ r, editable }: { r: Request; editable: boolean }) {
  const s = useOnboarding();
  const gstin = String(r.values.gstin ?? '');
  const ready = GSTIN_RE.test(gstin);
  const g = r.gstCheck;
  const stale = g && g.forValue !== gstin;
  if (isEmpty(r.values.gstin) && !g) return null;
  return (
    <div className="ob-penny">
      {editable && (
        <span className="inline-gap">
          <Button size="sm" icon={Search} disabled={!ready} onClick={() => s.checkGstin(r.id)}>
            {g ? 'Check the GSTIN again' : 'Check the GSTIN on the GST portal'}
          </Button>
          {!ready && <span className="subtle small-note">Type a full 15-character GSTIN first.</span>}
          <ApiHint>POST {API}/{r.id}/gstin-checks</ApiHint>
        </span>
      )}
      {g && (
        <span className={`ob-penny__result tone-${stale ? 'warning' : g.status === 'active' ? 'success' : 'critical'}`}>
          <Bot size={14} aria-hidden /> {stale ? 'Out of date: the GSTIN changed. ' : ''}GST portal: <strong>{g.status}</strong> · {g.nameAtGst}
        </span>
      )}
    </div>
  );
}

/** Values the system worked out, as one compact table: value · from what · Edit. Only a row you open becomes an input. */
function WorkedTable({ fields, r, readOnly }: { fields: FieldDef[]; r: Request; readOnly?: boolean }) {
  const s = useOnboarding();
  const [editing, setEditing] = useState<string[]>([]);
  const sugs = suggestionsOf(r, s.accounts);
  const locked = (f: FieldDef) => !!r.partyId && PARTY_KEYS.includes(f.key);
  return (
    <table className="ob-sugg">
      <tbody>
        {fields.map((f) => {
          const origin = originOf(f, r, s.accounts);
          const open = !readOnly && !locked(f) && (editing.includes(f.key) || origin === 'empty');
          const why = origin === 'waits' ? `Filled in when you type ${WORKED_FROM[f.key]?.words}` : origin === 'empty' ? 'Could not be worked out: choose it' : sugs[f.key]?.why;
          return (
            <tr key={f.key} className={origin === 'changed' ? 'is-changed' : origin === 'empty' && isMissing(f, r) ? 'is-missing' : undefined}>
              <th scope="row">{f.label}</th>
              <td className="ob-sugg__value">{open ? control(f, r, false, (v) => s.setValue(r.id, f.key, v)) : <span className={isEmpty(r.values[f.key]) && f.kind !== 'switch' ? 'subtle' : undefined}>{origin === 'waits' ? '—' : display(f, r)}</span>}</td>
              {!readOnly && (
                <>
                  <td className="ob-sugg__why">
                    {origin === 'changed' ? <OriginBadge origin="changed" /> : null} {why}
                  </td>
                  <td className="ob-sugg__act">
                    {origin === 'changed' && (
                      <button className="link-btn" onClick={() => s.useSuggestion(r.id, f.key)}>
                        Undo
                      </button>
                    )}
                    {origin !== 'waits' && origin !== 'empty' && !locked(f) && (
                      <button className="link-btn" onClick={() => setEditing((e) => (open ? e.filter((k) => k !== f.key) : [...e, f.key]))}>
                        {open ? 'Done' : <><Pencil size={12} aria-hidden /> Edit</>}
                      </button>
                    )}
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PennyDrop({ r, editable }: { r: Request; editable: boolean }) {
  const s = useOnboarding();
  const ready = !isEmpty(r.values.bankAccountNo) && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(r.values.ifsc ?? ''));
  const pd = r.pennyDrop;
  const stale = pd && pd.forKey !== `${r.values.bankAccountNo}|${r.values.ifsc}`;
  return (
    <div className="ob-penny">
      {editable && (
        <span className="inline-gap">
          <Button size="sm" icon={Banknote} disabled={!ready} onClick={() => s.runPennyDrop(r.id)}>
            {pd ? 'Run penny-drop again' : 'Run penny-drop'}
          </Button>
          {!ready && <span className="subtle small-note">Enter the account number and IFSC first.</span>}
          <ApiHint>POST {API}/{r.id}/bank-verifications</ApiHint>
        </span>
      )}
      {pd && (
        <span className={`ob-penny__result tone-${stale ? 'warning' : pd.result === 'pass' ? 'success' : 'critical'}`}>
          <Bot size={14} aria-hidden /> {stale ? 'Out of date: the account or IFSC changed. ' : ''}Bank says <strong>{pd.nameAtBank}</strong> · {pd.matchPct}% name match
        </span>
      )}
    </div>
  );
}

/** Right column, always visible: every field and its value, then what blocks, then the buttons. */
function Checklist({ r, groups, checks, onSendBack }: { r: Request; groups: [string, FieldDef[]][]; checks: CheckResult[]; onSendBack: () => void }) {
  const s = useOnboarding();
  const blocking = stops(checks);
  const fixable = blocking.filter((c) => !c.sendBack && !c.title.startsWith('Still to fill'));
  const warns = checks.filter((c) => c.level === 'warn');
  const formProblem = blocking.some((c) => c.sendBack);
  const all = groups.flatMap(([, f]) => f);
  const waits = (f: FieldDef) => f.group === 'worked' && originOf(f, r, s.accounts) === 'waits';
  const missing = all.filter((f) => isMissing(f, r) && !waits(f)).length;
  const item = (f: FieldDef) => {
    const empty = isEmpty(r.values[f.key]) && f.kind !== 'switch';
    const need = f.required?.(r.values, r) && !waits(f);
    return (
      <li key={f.key} className={empty && need ? 'is-missing' : undefined}>
        {empty ? need ? <Circle size={13} aria-hidden className="tone-warning" /> : <Circle size={13} aria-hidden className="subtle" /> : <Check size={13} aria-hidden className="tone-success" />}
        <span className="ob-list__label">{f.label.replace(/\?$/, '').replace(/ \(.*\)$/, '')}</span>
        <span className="ob-list__value">{empty ? (need ? 'missing' : waits(f) ? `after ${WORKED_FROM[f.key]?.words.replace('the ', '')}` : '—') : display(f, r)}</span>
      </li>
    );
  };
  return (
    <>
      <div className="ob-side__scroll">
        <p className="ob-aside__title">
          Your entries {missing ? <span className="tone-warning">· {missing} missing</span> : <span className="tone-success">· complete</span>}
        </p>
        {groups.map(([title, fields]) => (
          <div key={title}>
            <p className="ob-aside__sub">{title}</p>
            <ul className={`ob-checklist${title === 'Worked out' ? ' ob-checklist--muted' : ''}`}>{fields.map(item)}</ul>
          </div>
        ))}

        {fixable.length > 0 && (
          <>
            <p className="ob-aside__sub tone-critical">To fix before submit</p>
            <ul className="ob-plain ob-plain--tight">
              {fixable.map((c) => (
                <li key={c.title} title={c.detail}>
                  {c.title}
                </li>
              ))}
            </ul>
          </>
        )}
        {warns.length > 0 && (
          <>
            <p className="ob-aside__sub tone-warning">Warnings (you can still submit)</p>
            <ul className="ob-plain ob-plain--tight">
              {warns.map((c) => (
                <li key={c.title} title={c.detail}>
                  {c.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="ob-side__actions">
        <Button variant="primary" icon={Send} block disabled={blocking.length > 0} onClick={() => s.submit(r.id)}>
          {r.status === 'returned' ? 'Resubmit' : 'Submit for checking'}
        </Button>
        <span className="subtle small-note">{formProblem ? 'Blocked: this form cannot be set up. Return it.' : blocking.length ? `${missing ? `${missing} field${missing > 1 ? 's' : ''} missing` : 'Fix the items above'}` : `Goes to ${r.side === 'payable' ? 'Rajan, Usha, Venkat' : 'Rajan, Farid, Venkat'}, each their part.`}</span>
        <Button icon={Save} block disabled={!r.dirty} onClick={() => s.saveDraft(r.id)}>
          Save draft
        </Button>
        <Button variant={formProblem ? 'destructive' : 'ghost'} icon={Undo2} block onClick={onSendBack}>
          Return the form to {ACTORS[r.from].name}
        </Button>
        {r.status === 'draft' && r.changes.length === 0 && (
          <button className="link-btn ob-discard" onClick={() => s.discard(r.id)}>
            <Trash2 size={12} aria-hidden /> Opened by mistake: discard
          </button>
        )}
      </div>
    </>
  );
}

function stepsOf(r: Request): Step[] {
  const steps: Step[] = [
    { label: `Paper form ${r.formNo} from ${who(r.from)}`, at: r.arrivedAt, state: 'done' },
    { label: `${ACTORS[ME].name} types it in and submits`, at: r.submittedAt ?? r.sentBack?.at, state: r.status === 'draft' || r.status === 'returned' ? 'current' : 'done' },
  ];
  if (r.status === 'sent_back') {
    steps.push({ label: `Form returned to ${ACTORS[r.sentBack!.to].name}`, detail: r.sentBack!.reason, at: r.sentBack!.at, state: 'done' });
    return steps;
  }
  for (const c of r.changes) steps.push({ label: `${ACTORS[c.checker].name}: ${c.label.toLowerCase()}`, at: c.decidedAt, detail: c.status === 'returned' ? `Returned: ${c.reason}` : undefined, state: c.status === 'approved' ? 'done' : r.status === 'submitted' ? 'current' : 'todo' });
  steps.push({ label: 'Party and account active', detail: r.accountId ? `${r.partyId} · ${r.accountId} · ${String(r.values.under)}` : undefined, at: r.activatedAt, state: r.status === 'active' ? 'done' : 'todo' });
  return steps;
}

function ReasonDialog({ open, title, description, chips, action, onClose, onConfirm }: { open: boolean; title: string; description: string; chips: string[]; action: string; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason.trim());
              setReason('');
            }}
          >
            {action}
          </Button>
        </>
      }
    >
      <ReasonChips options={chips} onPick={setReason} />
      <TextArea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Your comment" />
    </Dialog>
  );
}
