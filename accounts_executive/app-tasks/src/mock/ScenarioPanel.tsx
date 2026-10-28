// Scenario simulator (MOCK ONLY): plays what other roles do in the shared scenario, lets the checkers
// answer (Rajan, Usha, Venkat, Farid stand in for the approval mechanism still to be designed),
// runs refusal tests and edits company rules. Not part of the product.

import { useState } from 'react';
import { ArrowRight, Check, Circle, FlaskConical, MessageSquare, Play, RotateCcw, ShieldAlert, SlidersHorizontal, User, UserCheck } from 'lucide-react';
import { fmtDay, fmtTime } from '../domain/dates';
import { ruleSummary } from '../domain/myRules';
import { ACTORS } from '../store/actors';
import { useApp, type AppState } from '../store/appStore';
import { Button, Dialog, Field, Sheet, TextInput } from '../ui';
import { ANY_TIME, REFUSAL_TESTS, TIMELINE, isDone, nextItem, stepNumber, type TimelineItem } from './scenario';
import { STEPS, currentStep, jumpTo } from './jump';
import './scenario.css';

function useRunner() {
  const s = useApp();
  const runEvent = (item: TimelineItem, alt = false) => {
    (alt ? item.alt!.run : item.run!)(useApp.getState());
    useApp.getState().sim.markPlayed(item.id);
  };
  const goTo = (item: TimelineItem) => {
    s.sim.advanceTo(item.at);
    if (item.go) s.navigate(typeof item.go === 'function' ? item.go(useApp.getState()) : item.go);
  };
  return { runEvent, goTo };
}

export function ScenarioPanel() {
  const s = useApp();
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { runEvent, goTo } = useRunner();
  const next = nextItem(s);
  const doneCount = STEPS.filter((i) => isDone(i, s)).length;

  const quickAction = () => {
    if (!next) return setOpen(true);
    if (next.item.kind === 'you') goTo(next.item);
    else if (!next.blockedBy) runEvent(next.item);
    else setOpen(true);
  };

  return (
    <>
      <div className="sim-launcher">
        <button className="sim-launcher__open" onClick={() => setOpen(true)}>
          <FlaskConical size={16} aria-hidden />
          <span className="sim-launcher__label">
            <span className="sim-launcher__tag">MOCK · Scenario {doneCount}/{STEPS.length}</span>
            <span className="sim-launcher__next">{next ? `${next.item.kind === 'you' ? 'Your turn' : 'Next'}: ${next.item.title}` : 'Scenario complete'}</span>
          </span>
        </button>
        {next && (
          <button className="sim-launcher__play" onClick={quickAction} disabled={next.item.kind === 'event' && !!next.blockedBy} title={next.item.kind === 'you' ? 'Go to this step' : next.blockedBy ?? 'Play next event'} aria-label={next.item.kind === 'you' ? 'Go to this step' : 'Play next event'}>
            {next.item.kind === 'you' ? <ArrowRight size={16} /> : <Play size={16} />}
          </button>
        )}
        <StepPicker />
      </div>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        width={560}
        title="Scenario simulator"
        description="MOCK ONLY. Plays what other roles do in the shared biscuit-plant scenario. Your own steps are done in the app itself."
        footer={
          <Button variant="destructive" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
            Reset scenario
          </Button>
        }
      >
        <div className="sim-jump">
          <span>Jump to any step. Earlier steps, including yours, are played automatically.</span>
          <StepPicker />
        </div>
        {next && (
          <div className={`sim-next${next.item.kind === 'you' ? ' sim-next--you' : ''}`}>
            <p className="sim-next__label">{next.item.kind === 'you' ? 'Your turn' : 'Next event'}</p>
            <p className="sim-next__title">{next.item.title}</p>
            <p className="sim-next__meta">
              Step {stepNumber(next.item)} · {next.item.actor} · {fmtDay(next.item.at)} {fmtTime(next.item.at)}
            </p>
            <p className="sim-next__expect">
              <strong>Expected:</strong> {next.item.expect}
            </p>
            <div className="sim-next__actions">
              {next.item.kind === 'you' ? (
                <Button
                  variant="primary"
                  icon={ArrowRight}
                  onClick={() => {
                    goTo(next.item);
                    setOpen(false);
                  }}
                >
                  Go there
                </Button>
              ) : (
                <>
                  <Button variant="primary" icon={Play} disabled={!!next.blockedBy} onClick={() => runEvent(next.item)}>
                    Play event
                  </Button>
                  {next.blockedBy && <span className="sim-blocked">{next.blockedBy}</span>}
                </>
              )}
            </div>
          </div>
        )}

        <CheckersQueue />
        <PendingRules />
        <AnyTime />

        <h3 className="sim-heading">Timeline</h3>
        <Timeline
          s={s}
          onRun={runEvent}
          onGo={(i) => {
            goTo(i);
            setOpen(false);
          }}
        />

        <h3 className="sim-heading">
          <ShieldAlert size={14} aria-hidden /> Refusal tests
        </h3>
        <p className="sim-help">Each attempt must be refused and leave an entry in Reports → Approval Log.</p>
        <div className="sim-tests">
          {REFUSAL_TESTS.map((t) => (
            <div key={t.id} className="sim-test">
              <span className="sim-step">{t.id}</span>
              <span className="sim-test__title">{t.title}</span>
              <Button size="sm" onClick={() => t.run(useApp.getState())}>
                Try
              </Button>
            </div>
          ))}
        </div>

        <h3 className="sim-heading">
          <SlidersHorizontal size={14} aria-hidden /> Company rules
        </h3>
        <p className="sim-help">Change a value: the checks must follow without a code change (e.g. rate tolerance 1% → 2%, or switch to Periodic).</p>
        <RulesEditor />
      </Sheet>

      <Dialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset the scenario?"
        description="All work items, messages and log entries are cleared and the clock returns to Mon 05-Oct-2026, 09:00."
        footer={
          <>
            <Button onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                s.sim.reset();
                setConfirmReset(false);
                setOpen(false);
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
}

function Timeline({ s, onRun, onGo }: { s: AppState; onRun: (i: TimelineItem, alt?: boolean) => void; onGo: (i: TimelineItem) => void }) {
  const days = Array.from(new Set(TIMELINE.map((i) => i.at.slice(0, 10))));
  const next = nextItem(s);
  return (
    <div className="sim-timeline">
      {days.map((d) => (
        <section key={d}>
          <h4 className="sim-day">{fmtDay(d)}</h4>
          {TIMELINE.filter((i) => i.at.startsWith(d)).map((i) => {
            const done = isDone(i, s);
            const skipped = i.skip?.(s) ?? null;
            const isNext = next?.item.id === i.id;
            const blockedBy = i.kind === 'event' && !done ? i.blocked?.(s) ?? null : null;
            return (
              <div key={i.id} className={`sim-item${done ? ' is-done' : ''}${isNext ? ' is-next' : ''}${i.kind === 'you' ? ' is-you' : ''}`}>
                <span className="sim-item__icon" aria-hidden>
                  {done ? <Check size={14} /> : i.kind === 'you' ? <User size={14} /> : <Circle size={10} />}
                </span>
                <div className="sim-item__main">
                  <div className="sim-item__top">
                    <span className="sim-num num">#{stepNumber(i)}</span>
                    <span className="sim-item__time num">{fmtTime(i.at)}</span>
                    <span className="sim-step">{i.step}</span>
                    <span className="sim-item__actor">{i.actor}</span>
                  </div>
                  <p className="sim-item__title">{i.title}</p>
                  <p className="sim-item__expect">{i.expect}</p>
                  {skipped && <p className="sim-skipped">Skipped: {skipped}</p>}
                  {!isNext && (
                    <button className="sim-jump-link" onClick={() => jumpTo(stepNumber(i))}>
                      Jump here
                    </button>
                  )}
                  {!done && (
                    <div className="sim-item__actions">
                      {i.kind === 'you' ? (
                        <Button size="sm" icon={ArrowRight} onClick={() => onGo(i)}>
                          Go there
                        </Button>
                      ) : (
                        <>
                          <Button size="sm" icon={Play} disabled={!!blockedBy} onClick={() => onRun(i)}>
                            Play
                          </Button>
                          {i.alt && (
                            <Button size="sm" variant="ghost" disabled={!!blockedBy} onClick={() => onRun(i, true)}>
                              {i.alt.label}
                            </Button>
                          )}
                          {blockedBy && <span className="sim-blocked">{blockedBy}</span>}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

/** Everything sent and waiting on a checker, and match variances waiting for the Accounts Manager:
 *  the checker answers here (stub of the approval mechanism). */
function CheckersQueue() {
  const s = useApp();
  const waiting = s.work.filter((w) => w.status === 'Sent');
  const variances = s.work.filter((w) => w.status === 'Open' && w.waitingOn);
  if (waiting.length === 0 && variances.length === 0) return null;
  return (
    <>
      <h3 className="sim-heading">
        <UserCheck size={14} aria-hidden /> Checkers: items waiting for them (any time)
      </h3>
      <p className="sim-help">Stand-in for the one approval mechanism (to design with the Accounts Manager's owner). Approve passes it to the next checker, if any.</p>
      <div className="sim-tests">
        {variances.map((w) => (
          <div key={`var-${w.id}`} className="sim-test">
            <span className="sim-step">{ACTORS[w.waitingOn!].name}</span>
            <span className="sim-test__title">
              {w.id} · {w.waitingFor} (before Teja posts)
            </span>
            <Button size="sm" variant="primary" onClick={() => s.sim.decideVariance(w.id, 'Approved')}>
              Approve variance
            </Button>
          </div>
        ))}
        {waiting.map((w) => {
          const k = w.chain[w.step];
          return (
            <div key={w.id} className="sim-test">
              <span className="sim-step">{ACTORS[k].name}</span>
              <span className="sim-test__title">
                {w.id} · {w.title}
              </span>
              <Button size="sm" variant="primary" onClick={() => s.sim.checkerDecides(w.id, true)}>
                Approve
              </Button>
              <Button size="sm" onClick={() => s.sim.checkerDecides(w.id, false, 'Please check the figures and resend')}>
                Return
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function PendingRules() {
  const s = useApp();
  const pending = s.myRules.filter((r) => r.status === 'PendingAM');
  if (pending.length === 0) return null;
  const vendor = (id?: string) => (id ? s.vendors.find((v) => v.id === id)?.name : undefined);
  return (
    <>
      <h3 className="sim-heading">
        <UserCheck size={14} aria-hidden /> Rajan (Accounts Manager): Teja's rules to approve
      </h3>
      <div className="sim-tests">
        {pending.map((r) => (
          <div key={r.id} className="sim-test">
            <span className="sim-step">{r.id}</span>
            <span className="sim-test__title">
              {ruleSummary(r, vendor(r.vendorId))}: "{r.reason}"
            </span>
            <Button size="sm" variant="primary" onClick={() => s.sim.decideRule(r.id, true)}>
              Approve
            </Button>
            <Button size="sm" onClick={() => s.sim.decideRule(r.id, false)}>
              Reject
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

function AnyTime() {
  const s = useApp();
  return (
    <>
      <h3 className="sim-heading">
        <MessageSquare size={14} aria-hidden /> Work that can arrive any time
      </h3>
      <div className="sim-tests">
        {ANY_TIME.map((a) => {
          const sentAlready = s.work.some((w) => w.id === a.template);
          return (
            <div key={a.id} className="sim-test">
              <span className="sim-step">{a.actor}</span>
              <span className="sim-test__title">{a.label}</span>
              <Button size="sm" disabled={sentAlready} onClick={() => s.sim.arrive(a.template, s.now)}>
                {sentAlready ? 'Sent' : 'Send'}
              </Button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function RulesEditor() {
  const rules = useApp((s) => s.rules);
  const setRules = useApp((s) => s.sim.setRules);
  const num = (v: string) => (v === '' || Number.isNaN(Number(v)) ? null : Number(v));
  return (
    <div className="sim-rules">
      <Field label="Match tolerance: quantity %">
        <TextInput type="number" step="0.1" value={rules.matchQtyTolPct} onChange={(e) => num(e.target.value) !== null && setRules({ matchQtyTolPct: num(e.target.value)! })} />
      </Field>
      <Field label="Match tolerance: rate %">
        <TextInput type="number" step="0.1" value={rules.matchRateTolPct} onChange={(e) => num(e.target.value) !== null && setRules({ matchRateTolPct: num(e.target.value)! })} />
      </Field>
      <Field label="OCR flag below %">
        <TextInput type="number" value={rules.ocrFlagPct} onChange={(e) => num(e.target.value) !== null && setRules({ ocrFlagPct: num(e.target.value)! })} />
      </Field>
      <Field label="TDS threshold (₹)">
        <TextInput type="number" value={rules.tdsThreshold} onChange={(e) => num(e.target.value) !== null && setRules({ tdsThreshold: num(e.target.value)! })} />
      </Field>
      <Field label="MSME maximum days">
        <TextInput type="number" value={rules.msmeMaxDays} onChange={(e) => num(e.target.value) !== null && setRules({ msmeMaxDays: num(e.target.value)! })} />
      </Field>
      <Field label="Inventory accounting">
        <select className="input" value={rules.inventoryMethod} onChange={(e) => setRules({ inventoryMethod: e.target.value as 'Perpetual' | 'Periodic' })}>
          <option>Perpetual</option>
          <option>Periodic</option>
        </select>
      </Field>
    </div>
  );
}

function StepPicker() {
  const s = useApp();
  const step = currentStep(s);
  return (
    <select className="sim-picker" aria-label="Jump to scenario step" value={step} onChange={(e) => jumpTo(Number(e.target.value))} title="Jump to any step">
      {STEPS.map((item, i) => (
        <option key={item.id} value={i + 1}>
          {`Step ${i + 1}/${STEPS.length} · ${item.kind === 'you' ? 'You' : item.actor.split(' · ')[0]}: ${item.title}`}
        </option>
      ))}
      <option value={STEPS.length + 1}>End: scenario complete</option>
    </select>
  );
}
