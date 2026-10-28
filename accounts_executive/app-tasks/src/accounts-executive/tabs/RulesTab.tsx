// Rules page: everything about my standing rules in one place.
//   My rules        — every rule I set: running, waiting for the Accounts Manager, turned off, ended
//   What I can set  — each rule type, the task it changes and who sets it (✅ me · 🟠 Accounts Manager · ❌ never),
//                     and the rules never allowed for this role (Try = refused and logged)
// Also the company rules each check uses (read-only).

import { useEffect, useState } from 'react';
import { Ban, BellOff, CalendarClock, Check, Hourglass, Plus, Power, ShieldAlert, SlidersHorizontal, Trash2, X } from 'lucide-react';
import { addDays, dateOf, fmtDate, fmtDateTime } from '../../domain/dates';
import { inr } from '../../domain/money';
import { NOT_ALLOWED, RULE_TYPES, ruleSummary, type RuleDraft } from '../../domain/myRules';
import type { MyRule } from '../../domain/types';
import { useApp } from '../../store/appStore';
import { Button, DetailPane, EmptyState, KeyValue, KpiCard, ListGroup, ListItem, MasterDetail, PageHeader, Section, SegmentedControl, StatusPill } from '../../ui';
import { DetailHead } from '../components/DetailHead';
import { RuleDialog } from '../rules/RuleDialog';
import { taskOf } from '../manifest';
import '../rules/rules.css';

type View = 'mine' | 'catalog';

const levelMark = (line: string) => (/not allowed/i.test(line) ? '❌' : /accounts manager/i.test(line) ? '🟠' : '✅');

export function RulesTab() {
  const s = useApp();
  const [view, setView] = useState<View>('mine');
  const [preset, setPreset] = useState<Partial<RuleDraft> | null>(null);
  const t = dateOf(s.now);

  useEffect(() => {
    if (s.nav.rules.id) setView('mine');
  }, [s.nav.rules.id]);

  const shown = s.myRules.filter((r) => !r.removed);
  const running = shown.filter((r) => r.status === 'Active' && !r.paused && r.until >= t);
  const waiting = shown.filter((r) => r.status === 'PendingAM');
  const ending = running.filter((r) => r.until <= addDays(t, 7));
  const vendor = (id?: string) => (id ? s.vendors.find((v) => v.id === id)?.name : undefined);
  const stateOf = (r: MyRule): { label: string; tone: 'success' | 'warning' | 'critical' | 'normal' | 'info' } =>
    r.status === 'PendingAM' ? { label: 'Waiting for Rajan', tone: 'warning' } : r.status === 'RejectedByAM' ? { label: 'Rejected', tone: 'critical' } : r.status === 'Ended' || r.until < t ? { label: 'Ended', tone: 'normal' } : r.paused ? { label: 'Turned off', tone: 'normal' } : { label: 'Running', tone: 'success' };
  const picked = shown.find((r) => r.id === s.nav.rules.id) ?? shown[0];

  return (
    <div className={view === 'catalog' ? 'rules-page' : 'rules-page screen-fill'}>
      <PageHeader
        title="Rules"
        subtitle="Standing rules for your own work. A rule can make your work quieter or stricter; it can never skip a check or the checker."
        actions={
          <>
            <SegmentedControl<View>
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'mine', label: `My rules${shown.length ? ` (${shown.length})` : ''}` },
                { value: 'catalog', label: 'What I can set' },
              ]}
            />
            <Button variant="primary" icon={Plus} onClick={() => setPreset({})}>
              Set a rule
            </Button>
          </>
        }
      />

      <div className="kpi-strip rules-kpis">
        <KpiCard icon={BellOff} label="Running" value={running.length} context={running.length ? running.map((r) => r.id).join(', ') : 'None running'} onClick={() => setView('mine')} />
        <KpiCard icon={Hourglass} label="Waiting for Rajan" value={waiting.length} status={waiting.length ? { tone: 'warning', label: 'Accounts Manager approval' } : undefined} context="Rules that loosen a warning" onClick={() => setView('mine')} />
        <KpiCard icon={CalendarClock} label="Ending in 7 days" value={ending.length} context={ending.length ? ending.map((r) => r.id).join(', ') : 'Nothing ending soon'} onClick={() => setView('mine')} />
        <KpiCard icon={SlidersHorizontal} label="Company OCR flag" value={`${s.rules.ocrFlagPct}%`} context={`Match tolerance qty ${s.rules.matchQtyTolPct}% · rate ${s.rules.matchRateTolPct}%`} onClick={() => setView('catalog')} />
      </div>

      {view === 'mine' &&
        (shown.length === 0 ? (
          <EmptyState icon={SlidersHorizontal} title="No rules yet" text="Set a rule to flag OCR fields more strictly, warn earlier on the TDS threshold or MSME dues, or remind you before month end." action={<Button variant="primary" icon={Plus} onClick={() => setPreset({})}>Set a rule</Button>} />
        ) : (
          <MasterDetail
            list={
              <ListGroup title="My rules" count={shown.length}>
                {shown.map((r) => {
                  const st = stateOf(r);
                  return <ListItem key={r.id} selected={r.id === picked?.id} onClick={() => s.navigate({ tab: 'rules', id: r.id })} title={`${r.id} · ${ruleSummary(r, vendor(r.vendorId))}`} subtitle={`Until ${fmtDate(r.until)}`} right={<StatusPill tone={st.tone}>{st.label}</StatusPill>} />;
                })}
              </ListGroup>
            }
            detail={
              picked && (
                <DetailPane
                  header={<DetailHead eyebrow={`${picked.id} · set ${fmtDateTime(picked.setAt)}`} title={ruleSummary(picked, vendor(picked.vendorId))} right={<StatusPill tone={stateOf(picked).tone}>{stateOf(picked).label}</StatusPill>} />}
                  actions={
                    <>
                      <span className="spacer" />
                      {picked.status === 'Active' && picked.until >= t && (picked.paused ? <Button icon={Power} onClick={() => s.turnMyRuleOn(picked.id)}>Turn on</Button> : <Button icon={Power} onClick={() => s.turnMyRuleOff(picked.id)}>Turn off</Button>)}
                      {picked.status === 'Active' && picked.until >= t && (
                        <Button icon={X} onClick={() => s.endMyRule(picked.id)}>
                          End now
                        </Button>
                      )}
                      {(picked.status !== 'Active' || picked.until < t) && (
                        <Button variant="ghost" icon={Trash2} onClick={() => s.removeMyRule(picked.id)}>
                          Remove from list
                        </Button>
                      )}
                    </>
                  }
                >
                  <KeyValue
                    columns={1}
                    items={[
                      { label: 'Changes', value: RULE_TYPES.find((x) => x.kind === picked.kind)!.task === 'Any' ? 'Any task (a reminder)' : `${RULE_TYPES.find((x) => x.kind === picked.kind)!.task} ${taskOf(RULE_TYPES.find((x) => x.kind === picked.kind)!.task as 'T1').title}` },
                      { label: 'Until', value: fmtDate(picked.until) },
                      { label: 'Why', value: picked.reason },
                      { label: 'Who set it', value: picked.decidedBy ? `You, approved by Rajan (Accounts Manager)` : picked.status === 'PendingAM' ? 'You; waiting for Rajan' : 'You' },
                      ...(picked.firedAt ? [{ label: 'Reminded', value: fmtDateTime(picked.firedAt) }] : []),
                    ]}
                  />
                </DetailPane>
              )
            }
          />
        ))}

      {view === 'catalog' && (
        <>
          <Section title="What I can set">
            <div className="rule-cards">
              {RULE_TYPES.map((r) => (
                <article key={r.kind} className="rule-card">
                  <header className="rule-card__head">
                    <Check size={18} className="tone-success" aria-hidden />
                    <h3>{r.title}</h3>
                  </header>
                  <p className="rule-card__what">{r.what}</p>
                  <ul className="rule-card__levels">
                    {r.limits(s.rules).map((line) => (
                      <li key={line}>
                        <span aria-hidden>{levelMark(line)}</span> {line}
                      </li>
                    ))}
                  </ul>
                  <footer className="rule-card__foot">
                    <span className="small-note muted">Changes {r.task === 'Any' ? 'any task' : `${r.task} ${taskOf(r.task).title}`}</span>
                    <span className="spacer" />
                    <Button size="sm" variant="primary" icon={Plus} onClick={() => setPreset({ kind: r.kind })}>
                      Set
                    </Button>
                  </footer>
                </article>
              ))}
            </div>
          </Section>
          <Section title="What I cannot set">
            <p className="small-note muted">These would skip a check or the checker. Trying one is refused and recorded on the Approval Log. Each has an allowed way instead.</p>
            <ul className="never-list">
              {NOT_ALLOWED.map((n) => (
                <li key={n.id} className="never-item">
                  <Ban size={18} className="tone-critical" aria-hidden />
                  <span className="never-item__text">
                    <strong>{n.title}</strong>
                    <span className="small-note muted">{n.why}</span>
                    <span className="small-note">
                      <strong>Instead:</strong> {n.instead.label}
                    </span>
                  </span>
                  <span className="never-item__actions">
                    {n.instead.target && <Button size="sm" onClick={() => s.navigate(n.instead.target!)}>Do this instead</Button>}
                    <Button size="sm" variant="ghost" icon={ShieldAlert} onClick={() => s.tryNotAllowedRule(n.id)}>
                      Try
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Company rules the checks use (read-only)">
            <KeyValue
              columns={2}
              items={[
                { label: 'Three-way-match tolerance', value: `Quantity ${s.rules.matchQtyTolPct}% · rate ${s.rules.matchRateTolPct}%` },
                { label: 'OCR low-confidence flag', value: `Below ${s.rules.ocrFlagPct}%` },
                { label: 'TDS on purchase of goods', value: `${s.rules.tdsRatePct}% above ${inr(s.rules.tdsThreshold)} a year per vendor` },
                { label: 'MSME payment limit', value: `${s.rules.msmeMaxDays} days` },
                { label: 'Tax override: Finance Controller too', value: `Above ${inr(s.rules.overrideFcThreshold)}` },
                { label: 'Inventory accounting', value: s.rules.inventoryMethod },
              ]}
            />
          </Section>
        </>
      )}

      <RuleDialog open={preset !== null} onClose={() => setPreset(null)} preset={preset ?? undefined} onSet={(id) => id && s.navigate({ tab: 'rules', id })} />
    </div>
  );
}
