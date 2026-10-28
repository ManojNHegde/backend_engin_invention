// Create a vendor: the whole task screen.
//
//   left   the paper forms handed over by Procurement: Needs me · With checkers · Done
//   middle the form the executive types, block by block, from the paper form
//            1 Paper form · 2 Party details · 3 Finance details · 4 MSME / Udyam · 5 Bank
//            6 Worked out by the system (editable if wrong)
//   right  every check, live: Stop · Return the form · Warn · OK, and who checks which part
//   foot   Submit (blocked while a Stop is open) · Return the form

import { useState } from 'react';
import { BadgeCheck, CheckCheck, CircleX, Check as CheckIcon, FilePlus2, FileText, Landmark, Send, Undo2, TriangleAlert, Undo } from 'lucide-react';
import { Button, Callout, DetailPane, EmptyState, Field, KeyValue, ListGroup, ListItem, MasterDetail, PageHeader, Section, StatusPill, TextInput, type Tone } from '../../ui';
import { CATEGORIES, CHECKER_NAME, CHECKER_PART, DEMO_BANK, derive, mustReturn, PAPER_SHOWS, penNeedsCallBack, runChecks, stops, type Checker, type Level, type Stage, type Typed, type VendorRequest } from './model';
import { useVendorCreate } from './store';
import '../t7/t7.css';
import './vendor-create.css';

const STAGE_LABEL: Record<Stage, string> = { draft: 'Needs me', submitted: 'With checkers', 'sent-back': 'Returned', active: 'Active' };
const STAGE_TONE: Record<Stage, Tone> = { draft: 'warning', submitted: 'info', 'sent-back': 'critical', active: 'success' };
const CHECKERS: Checker[] = ['rajan', 'usha', 'venkat'];

export function CreateVendorScreen() {
  const { requests, selectedId, select, open, reset } = useVendorCreate();
  const current = requests.find((r) => r.id === selectedId) ?? null;
  const row = (r: VendorRequest) => (
    <ListItem
      key={r.id}
      title={r.typed.legalName || 'New vendor (not typed yet)'}
      subtitle={`Form ${r.formNo} · from ${r.handedBy.split(' (')[0]}`}
      meta={`handed over ${r.handedOn.slice(8)}-Oct`}
      right={<StatusPill tone={STAGE_TONE[r.stage]}>{STAGE_LABEL[r.stage]}</StatusPill>}
      selected={r.id === selectedId}
      onClick={() => select(r.id)}
    />
  );
  const group = (title: string, list: VendorRequest[], none: string) => (
    <ListGroup title={title} count={list.length}>
      {list.length ? list.map(row) : <p className="t7-none">{none}</p>}
    </ListGroup>
  );
  return (
    <>
      <PageHeader
        title="Create a vendor"
        eyebrow={<span className="code-tag">Not in the role file yet</span>}
        subtitle="Procurement hands over a paper vendor form. You type everything in, check the GSTIN and the bank account, and send it to the checkers. The vendor exists once all of them approve."
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={reset}>
              Reset demo
            </Button>
            <Button variant="primary" size="sm" icon={FilePlus2} onClick={open}>
              New from a paper form
            </Button>
          </>
        }
      />
      <MasterDetail
        list={
          <>
            {group('Needs me', requests.filter((r) => r.stage === 'draft'), 'No paper forms waiting.')}
            {group('With checkers', requests.filter((r) => r.stage === 'submitted'), 'Nothing with the checkers.')}
            {group('Done', requests.filter((r) => r.stage === 'active' || r.stage === 'sent-back'), 'Nothing done yet.')}
          </>
        }
        detail={current ? <Detail key={current.id} req={current} /> : <EmptyState icon={FileText} title="Pick a paper form" text="Or press “New from a paper form” to start a blank one." />}
      />
    </>
  );
}

function Detail({ req }: { req: VendorRequest }) {
  const { edit, checkGst, runPenny, submit, returnForm, fillFromPaper, clear, approve } = useVendorCreate();
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState('');
  const editable = req.stage === 'draft';
  const t = req.typed;
  const d = derive(t);
  const checks = runChecks(req);
  const open = stops(checks);
  const forceReturn = mustReturn(checks);
  const set = (patch: Partial<Typed>) => edit(req.id, patch);
  const text = (key: keyof Typed, label: string, o: { required?: boolean; hint?: string; upper?: boolean; digits?: boolean } = {}) => (
    <Field label={label} required={o.required} hint={o.hint}>
      <TextInput
        value={String(t[key] ?? '')}
        disabled={!editable}
        onChange={(e) => set({ [key]: o.upper ? e.target.value.toUpperCase() : o.digits ? e.target.value.replace(/\D/g, '') : e.target.value } as Partial<Typed>)}
      />
    </Field>
  );
  const portal = req.gst && req.gst.gstin === t.gstin.trim().toUpperCase() ? req.gst : null;
  const penny = req.penny && req.penny.account === t.bankAccount.trim() && req.penny.ifsc === t.ifsc.trim().toUpperCase() ? req.penny : null;

  return (
    <DetailPane
      header={
        <div className="t7-head">
          <div>
            <h2 className="t7-head__title">{t.legalName || 'New vendor'}</h2>
            <p className="t7-head__sub">
              Paper form {req.formNo} · handed over by {req.handedBy}
            </p>
          </div>
          <div className="t7-head__pills">
            <StatusPill tone={STAGE_TONE[req.stage]}>{STAGE_LABEL[req.stage]}</StatusPill>
          </div>
        </div>
      }
      actions={
        editable ? (
          <>
            {returning ? (
              <>
                <TextInput placeholder="Why you are returning it" value={note} onChange={(e) => setNote(e.target.value)} style={{ maxWidth: 360 }} />
                <Button variant="destructive" icon={Undo2} disabled={!note.trim()} onClick={() => returnForm(req.id, note.trim())}>
                  Return the form
                </Button>
                <Button variant="ghost" onClick={() => setReturning(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="t7-foot-note">{open.length ? `${open.length} thing${open.length > 1 ? 's' : ''} to fix before you can submit` : 'Goes to Rajan, Usha and Venkat'}</span>
                <span className="spacer" />
                <Button variant={forceReturn ? 'destructive' : 'secondary'} icon={Undo2} onClick={() => setReturning(true)}>
                  Return the form
                </Button>
                <Button variant="primary" icon={Send} disabled={open.length > 0} onClick={() => submit(req.id)}>
                  Submit for checking
                </Button>
              </>
            )}
          </>
        ) : undefined
      }
    >
      {req.stage === 'sent-back' && (
        <Callout tone="critical" title={`Returned to ${req.handedBy.split(' (')[0]}`}>
          {req.sentBackNote}. No party and no account were created.
        </Callout>
      )}
      {req.stage === 'active' && (
        <Callout tone="success" title={`Vendor ${req.vendorId} is active`}>
          The party and its account <strong>{d.header} › {d.accountName}</strong> now exist. Bills can be posted to it.
        </Callout>
      )}

      <div className="vc-cols">
        <div className="vc-form">
          <Section title="1 · The paper form" aside="the form is paper: nothing was entered in the system">
            <div className="vc-paper">
              <FileText size={16} aria-hidden />
              <div>
                <p className="vc-paper__title">Copies attached: GST certificate · PAN · cancelled cheque · quotation</p>
                <p className="vc-paper__text">{PAPER_SHOWS[req.formNo] ?? 'A new paper form. Type what it says.'}</p>
              </div>
            </div>
            {editable && (
              <div className="t7-demo">
                <span className="t7-demo__tag">DEMO</span>
                <Button size="sm" onClick={() => fillFromPaper(req.id)}>
                  Fill everything from this paper form
                </Button>
                <Button size="sm" variant="ghost" onClick={() => clear(req.id)}>
                  Clear
                </Button>
              </div>
            )}
          </Section>

          <Section title="2 · Party details" aside="who the vendor is">
            <div className="t7-grid">
              {text('legalName', 'Legal name', { required: true })}
              {text('tradeName', 'Trade name')}
              {text('pan', 'PAN', { required: true, upper: true, hint: 'From the PAN card copy' })}
              <Field label="GSTIN" hint="Characters 3 to 12 must be the PAN. Leave empty if unregistered.">
                <div className="vc-inline">
                  <TextInput value={t.gstin} disabled={!editable} onChange={(e) => set({ gstin: e.target.value.toUpperCase() })} />
                  <Button size="sm" icon={BadgeCheck} disabled={!editable || !t.gstin.trim()} onClick={() => checkGst(req.id)}>
                    Check on GST portal
                  </Button>
                </div>
                {portal && <span className={`vc-note vc-note--${portal.status === 'Active' ? 'ok' : 'bad'}`}>{portal.status}{portal.name ? ` · ${portal.name}` : ''}</span>}
              </Field>
              <div className="vc-span">{text('address', 'Address', { required: true })}</div>
              {text('city', 'City', { required: true })}
              {text('pin', 'PIN', { required: true, digits: true })}
              {text('contactPerson', 'Contact person')}
              {text('phone', 'Phone')}
              {text('email', 'Email')}
            </div>
          </Section>

          <Section title="3 · Finance details" aside="how we account for the vendor">
            <div className="t7-grid">
              <Field label="Category" required hint="What the form says they supply. It decides the header, TDS and 43B(h).">
                <select className="input" value={t.category} disabled={!editable} onChange={(e) => set({ category: e.target.value })}>
                  <option value="">Choose…</option>
                  {Object.keys(CATEGORIES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Credit days" required hint="From the form or quotation">
                <TextInput type="number" min={0} value={t.creditDays} disabled={!editable} onChange={(e) => set({ creditDays: e.target.value === '' ? '' : Number(e.target.value) })} />
              </Field>
              <Field label="Related party?" hint="Blank means nobody has said.">
                <select className="input" value={t.related} disabled={!editable} onChange={(e) => set({ related: e.target.value as Typed['related'] })}>
                  <option value="">Not said</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title="4 · MSME / Udyam" aside="from the Udyam certificate copy">
            <div className="t7-grid">
              <Field label="Is the vendor an MSME?" required>
                <select className="input" value={t.msme} disabled={!editable} onChange={(e) => set({ msme: e.target.value as Typed['msme'] })}>
                  <option value="">Choose…</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Asked, not known yet</option>
                </select>
              </Field>
              {t.msme === 'yes' && (
                <>
                  <Field label="MSME category" required>
                    <select className="input" value={t.msmeCategory} disabled={!editable} onChange={(e) => set({ msmeCategory: e.target.value as Typed['msmeCategory'] })}>
                      <option value="">Choose…</option>
                      <option>Micro</option>
                      <option>Small</option>
                      <option>Medium</option>
                    </select>
                  </Field>
                  {text('udyam', 'Udyam number', { required: true, upper: true, hint: 'UDYAM-KR-03-0012345' })}
                </>
              )}
            </div>
          </Section>

          <Section title="5 · Bank" aside="from the cancelled cheque">
            <div className="t7-grid">
              {text('bankAccount', 'Account number', { required: true, digits: true })}
              {text('ifsc', 'IFSC', { required: true, upper: true })}
              {text('beneficiary', 'Beneficiary name', { required: true })}
              <Field label="Penny-drop" hint="The bank sends back the name on the account.">
                <div className="vc-inline">
                  <Button size="sm" icon={Landmark} disabled={!editable || !t.bankAccount.trim() || !t.ifsc.trim()} onClick={() => runPenny(req.id)}>
                    Run the penny-drop
                  </Button>
                </div>
                {penny && <span className={`vc-note vc-note--${penny.holder ? 'ok' : 'bad'}`}>{penny.holder ? `Name at bank: ${penny.holder}` : 'The bank cannot find this account'}</span>}
              </Field>
            </div>
            {editable && (
              <div className="t7-demo">
                <span className="t7-demo__tag">DEMO</span> bank details to try:
                {DEMO_BANK.map((b) => (
                  <button key={b.label} type="button" className="reason-chip" onClick={() => set({ bankAccount: b.account, ifsc: b.ifsc })}>
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            {penNeedsCallBack(req) && (
              <div className="vc-callback">
                <p className="vc-callback__title">The name at the bank differs: call the vendor and note it</p>
                <div className="t7-grid">
                  {text('callBackWho', 'Who you called', { required: true })}
                  {text('callBackNumber', 'Number you used', { required: true })}
                  <Field label="Date" required>
                    <TextInput type="date" value={t.callBackOn} disabled={!editable} onChange={(e) => set({ callBackOn: e.target.value })} />
                  </Field>
                  <Field label="Where the number came from">
                    <label className="vc-check">
                      <input type="checkbox" checked={t.callBackSameEmail} disabled={!editable} onChange={(e) => set({ callBackSameEmail: e.target.checked })} /> Same email as the bank details
                    </label>
                  </Field>
                </div>
              </div>
            )}
          </Section>

          <Section title="6 · Worked out by the system" aside="from what you typed · change it only if it is wrong">
            <div className="t7-grid">
              <Field label="State" hint="From the first two digits of the GSTIN">
                <TextInput value={d.state} disabled={!editable} onChange={(e) => set({ stateOverride: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Constitution" hint="From the 4th letter of the PAN">
                <TextInput value={d.constitution} disabled={!editable} onChange={(e) => set({ constitutionOverride: e.target.value })} />
              </Field>
              <Field label="Account name in the books" hint="Trade name, or legal name">
                <TextInput value={d.accountName} disabled={!editable} onChange={(e) => set({ accountNameOverride: e.target.value })} />
              </Field>
            </div>
            <KeyValue
              columns={3}
              items={[
                { label: 'Under (header)', value: d.header || '—' },
                { label: 'Resident', value: d.resident || '—' },
                { label: 'Bill-by-bill', value: d.billByBill },
                { label: '43B(h) 45-day clock', value: d.sec43bh === null ? '—' : d.sec43bh ? 'Applies' : 'Does not apply' },
                { label: 'TDS (set by Venkat)', value: d.tds || '—' },
              ]}
            />
          </Section>
        </div>

        <aside className="vc-side">
          <Section title="Checks" aside={open.length ? `${open.length} Stop` : 'nothing stops you'}>
            <ul className="t7-checks">
              {checks.length === 0 && <li className="t7-check t7-check--warn"><TriangleAlert size={16} className="t7-check__icon" /><div><p className="t7-check__title">Nothing typed yet</p></div></li>}
              {checks.map((c) => (
                <li key={c.id} className={`t7-check t7-check--${c.level === 'return' ? 'stop' : c.level}`}>
                  <Glyph level={c.level} />
                  <div>
                    <p className="t7-check__title">{c.title}</p>
                    {c.detail && <p className="t7-check__detail">{c.detail}</p>}
                    {c.level === 'return' && <p className="t7-check__detail"><strong>Return the form</strong> to Procurement: it cannot be set up.</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Who checks what">
            <ol className="t7-steps">
              {CHECKERS.map((k) => {
                const done = req.parts[k] === 'approved';
                return (
                  <li key={k} className={`t7-step${done ? ' is-done' : req.stage === 'submitted' ? ' is-now' : ''}`}>
                    <span className="t7-step__dot" />
                    <div>
                      <p className="t7-step__title">{CHECKER_NAME[k]}</p>
                      <p className="t7-step__sub">{CHECKER_PART[k]}</p>
                      {req.stage === 'submitted' && !done && (
                        <div className="t7-demo">
                          <span className="t7-demo__tag">DEMO</span>
                          <Button size="sm" variant="primary" icon={CheckCheck} onClick={() => approve(req.id, k)}>
                            {k === 'rajan' ? 'Rajan' : k === 'usha' ? 'Usha' : 'Venkat'} approves
                          </Button>
                        </div>
                      )}
                    </div>
                    <span className="t7-step__n" />
                  </li>
                );
              })}
              <li className={`t7-step${req.stage === 'active' ? ' is-done' : ''}`}>
                <span className="t7-step__dot" />
                <div>
                  <p className="t7-step__title">Vendor created</p>
                  <p className="t7-step__sub">When all three approve: the party, its account and its terms</p>
                </div>
                <span className="t7-step__n" />
              </li>
            </ol>
            <p className="t7-was">Rule: you type it, so you cannot be the one who approves it (maker ≠ checker).</p>
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
        </aside>
      </div>
    </DetailPane>
  );
}

function Glyph({ level }: { level: Level }) {
  if (level === 'stop') return <CircleX size={16} className="t7-check__icon" aria-label="Stop" />;
  if (level === 'return') return <Undo size={16} className="t7-check__icon" aria-label="Return the form" />;
  if (level === 'warn') return <TriangleAlert size={16} className="t7-check__icon" aria-label="Warn" />;
  return <CheckIcon size={16} className="t7-check__icon" aria-label="OK" />;
}
