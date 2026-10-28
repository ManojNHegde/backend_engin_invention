// End-to-end scenario test: plays the Accounts Executive's side of the shared scenario through the store
// (other roles = timeline events, Teja = her standard answers) and checks the answer keys and the checks.
// Then renders every tab, task screen and report to catch runtime errors.

import { beforeEach, describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AccountsExecutiveApp } from '../accounts-executive/AccountsExecutiveApp';
import { TASKS } from '../accounts-executive/manifest';
import { blockers, pvFigures } from '../domain/tasks';
import type { TaskId } from '../domain/types';
import { ctxOf, useApp } from '../store/appStore';
import type { ReportId } from '../store/navigation';
import { queueItems } from '../store/queue';
import { AUTO, fillAndSend, jumpTo, playItem } from './jump';
import { MONTH_END_IDS, REFUSAL_TESTS, STEPS, TIMELINE, nextItem } from './scenario';

const st = () => useApp.getState();
const item = (id: string) => st().work.find((w) => w.id === id)!;
const play = (id: string) => playItem(TIMELINE.find((i) => i.id === id)!);
const blocks = (id: string) => blockers(item(id), ctxOf(st()));

beforeEach(() => st().sim.reset());

describe('Accounts Executive scenario', () => {
  it('T13: the advance is flagged for GST and goes to Rajan, Pooja told', () => {
    play('ev-adv');
    expect(queueItems(st()).filter((q) => q.group === 'me').map((q) => q.task)).toEqual(['T13']);
    play('you-adv');
    expect(item('ADV-0311').status).toBe('Sent');
    expect(item('ADV-0311').chain).toEqual(['rajan']);
    expect(item('ADV-0311').cc).toEqual(['pooja']);
  });

  it('T2: the Contracts & Services variance waits for Rajan; then the bill posts at the milestone', () => {
    play('ev-sb');
    const q = queueItems(st()).find((x) => x.key === 'w-SB-0021-09')!;
    expect(q.group).toBe('others');
    expect(q.holder).toContain('Rajan');
    expect(blocks('SB-0021-09')).toContain('Variance not yet approved by the Accounts Manager');
    play('ev-sb-var');
    expect(queueItems(st()).find((x) => x.key === 'w-SB-0021-09')!.group).toBe('me');
    expect(blocks('SB-0021-09')).toEqual([]);
    play('you-sb');
    expect(item('SB-0021-09').status).toBe('Sent');
    expect(item('SB-0021-09').chain).toEqual(['rajan']);
  });

  it('T1/T3: Ravi captured the sugar invoice and raised the ₹17,900 variance; Teja posts once Rajan approves', () => {
    play('ev-pv407');
    // Ravi corrected the OCR quantity: no OCR field for Teja to confirm, and nothing to type.
    expect(blocks('PV-0407')).toEqual(['Variance not yet approved by the Accounts Manager']);
    expect(queueItems(st()).find((x) => x.key === 'w-PV-0407')!.group).toBe('others');
    expect(blocks('LC-0407')).toContain('Post the material voucher PV-0407 first (T1)');
    const f = pvFigures(item('PV-0407'), item('PV-0407').values, ctxOf(st()));
    expect(f.qty).toBe(10_000);
    expect(Math.round(f.match!.total)).toBe(17_900);
    expect(f.due.date).toBe('2026-11-21');
    play('ev-var407');
    expect(blocks('PV-0407')).toEqual([]);
    expect(st().notifications[0].title).toBe('Variance approved: post PV-0407');
    play('you-pv407');
    play('you-lc407');
    expect(item('PV-0407').status).toBe('Sent');
    expect(item('LC-0407').status).toBe('Sent');
    expect(st().vendors.find((v) => v.id === 'V-C')!.fyPurchases).toBe(38_00_000 + 4_71_000);
  });

  it('T1: OCR fields are confirmed only on a document Teja keyed herself', () => {
    st().setMyRule({ kind: 'ocrStricter', value: 96, days: 30, reason: 'many misreads' });
    play('ev-cocoa');
    expect(blocks('PV-0424').some((b) => b.startsWith('Quantity read at 95%'))).toBe(true);
    st().confirmField('PV-0424', 'qty');
    expect(blocks('PV-0424').some((b) => b.startsWith('Quantity'))).toBe(false);
  });

  it('T7: Vendor H — duplicate bank account refused, MSME limit enforced, two checkers', () => {
    play('ev-venh');
    st().setValue('VEN-H', 'ledger', 'Sundry Creditors – Raw material');
    st().setValue('VEN-H', 'bankAccount', '50100234567811');
    st().setValue('VEN-H', 'ifsc', 'ICIC0004321');
    expect(blocks('VEN-H')).toContain('Account already used by Vendor C');
    st().setValue('VEN-H', 'creditDays', 60);
    expect(blocks('VEN-H')).toContain('More than 45 days for an MSME vendor');
    expect(blocks('VEN-H')).toContain('Call-back evidence is required');
    play('you-venh');
    expect(item('VEN-H').chain).toEqual(['rajan', 'usha']);
    play('ev-venh-ok');
    expect(item('VEN-H').status).toBe('Approved');
    expect(st().vendors.find((v) => v.id === 'V-H')?.approved).toBe(true);
  });

  it('T1/T6: no-PO voucher closes with no checker; the RCM override goes to Venkat', () => {
    play('ev-fc25');
    play('you-fc25');
    expect(item('PV-FC25').status).toBe('Done');
    expect(item('PV-FC25').cc).toEqual(['ravi']);
    play('you-ovr');
    expect(item('OVR-FC25').status).toBe('Sent');
    expect(item('OVR-FC25').chain).toEqual(['venkat']);
  });

  it('T4/T5: debit notes need the posted voucher; the credit note must not reduce twice', () => {
    play('ev-ret');
    expect(blocks('DN-0407')).toContain('Post the original voucher PV-0407 first (T1)');
    expect(blocks('DN-0403')).toEqual([]);
    st().setValue('DN-0403', 'qty', 500);
    expect(blocks('DN-0403')).toContain('More than rejected (400 kg)');
    st().setValue('DN-0403', 'qty', 400);
    play('ev-pv407');
    play('ev-var407');
    fillAndSend('PV-0407');
    play('you-dn');
    expect(item('DN-0403').cc).toEqual(['sunil']);
    play('ev-cn');
    expect(blocks('CN-VC91')[0]).toMatch(/already reduces this vendor/);
    play('you-cn');
    expect(item('CN-VC91').status).toBe('Sent');
  });

  it('T12: the limit edit goes to Farid, then Rajan, and changes the master', () => {
    play('ev-limits');
    st().setValue('CL-C02', 'newValue', 10_00_000);
    expect(blocks('CL-C02')).toContain('Same as the current limit');
    st().setValue('CL-C02', 'newValue', 9_60_000);
    play('you-limits');
    expect(item('CL-C02').chain).toEqual(['farid', 'rajan']);
    play('ev-limits-ok');
    expect(st().customers.find((c) => c.id === 'C-02')!.creditLimit).toBe(9_60_000);
    expect(st().customers.find((c) => c.id === 'C-01')!.creditLimit).toBe(18_00_000);
  });

  it('T1: maida crosses the TDS threshold; the emailed copy is a duplicate', () => {
    play('ev-maida');
    const f = pvFigures(item('PV-0420'), item('PV-0420').values, ctxOf(st()));
    expect(f.tds.tds).toBe(1_604);
    expect(Math.round(f.match!.total)).toBe(38_900);
    expect(blocks('PV-0420-B')).toContain('Same vendor and invoice number as PV-0420');
    expect(blocks('PV-0420')).toContain('Variance not yet approved by the Accounts Manager');
    play('ev-var420');
    play('you-maida');
    expect(item('PV-0420').status).toBe('Sent');
    expect(item('PV-0420-B').status).toBe('Discarded');
  });

  it('a returned item comes back to Needs me with the reason', () => {
    play('ev-pv407');
    play('ev-var407');
    fillAndSend('PV-0407');
    st().sim.checkerDecides('PV-0407', false, 'Attach the rate-revision letter');
    expect(item('PV-0407').status).toBe('Returned');
    const q = queueItems(st()).find((x) => x.key === 'w-PV-0407')!;
    expect(q.group).toBe('me');
    expect(q.tone).toBe('critical');
  });

  it('rules: stricter OCR is mine; quieting a warning needs Rajan; loosening is refused', () => {
    expect(st().setMyRule({ kind: 'ocrStricter', value: 90, days: 30, reason: 'test' })).not.toBeNull();
    expect(st().myRules[0].status).toBe('Active');
    st().setMyRule({ kind: 'quietDuplicate', value: 30, vendorId: 'V-A', days: 30, reason: 'monthly rent' });
    expect(st().myRules[0].status).toBe('PendingAM');
    expect(st().setMyRule({ kind: 'ocrStricter', value: 70, days: 30, reason: 'too many flags' })).toBeNull();
    expect(st().log[0].outcome).toBe('Refused');
  });

  it('plays the whole timeline to the end with the standard answers', () => {
    for (let guard = 0; guard < 200 && nextItem(st()); guard++) {
      const n = nextItem(st())!;
      expect(n.blockedBy, `${n.item.id} should not be blocked`).toBeNull();
      playItem(n.item);
      if (n.item.kind === 'you') expect(n.item.done!(st()), `${n.item.id} should be done after its standard answer`).toBe(true);
    }
    expect(nextItem(st())).toBeNull();
    expect(Object.keys(AUTO).length).toBe(TIMELINE.filter((i) => i.kind === 'you').length);
    MONTH_END_IDS.forEach((id) => expect(item(id).status, id).toBe('Sent'));
    expect(item('ITC-WO-2604').status).toBe('Sent');
  });

  it('month end: provision and FX are two tasks with different checkers; T19–T21 open too', () => {
    jumpTo(STEPS.findIndex((i) => i.id === 'ev-me') + 2);
    expect(MONTH_END_IDS.map((id) => item(id).task)).toEqual(['T19', 'T9', 'T20', 'T21', 'T15', 'T23', 'T18']);
    fillAndSend('PROV-OCT');
    fillAndSend('FX-OCT');
    expect(item('PROV-OCT').chain).toEqual(['rajan', 'usha']);
    expect(item('FX-OCT').chain).toEqual(['rajan']);
    expect(item('FX-OCT').data.lines).toHaveLength(1);
    fillAndSend('STMT-OCT');
    expect(item('STMT-OCT').cc).toEqual(['venkat']);
    st().runBatch('GRNI-OCT');
    st().setValue('GRNI-OCT', 'line:g648', 'Explain: no provision');
    expect(blocks('GRNI-OCT').some((b) => b.includes('give a reason'))).toBe(true);
  });

  it('T22: the ITC on written-off stock is computed and goes to the Compliance Officer', () => {
    play('ev-wo');
    expect(item('ITC-WO-2604').values).toBeDefined();
    play('you-wo');
    expect(item('ITC-WO-2604').chain).toEqual(['venkat']);
    expect(item('ITC-WO-2604').amount).toBe(1_490);
  });

  it('T14: an unclaimable write-off goes on to the Finance Controller; an escalation tells Compliance', () => {
    play('ev-26as');
    st().runBatch('TDS-Q2');
    st().setValue('TDS-Q2', 'line:c05', 'Write off as unclaimable (Finance Controller)');
    st().setValue('TDS-Q2', 'why:line:c05', 'Customer closed; certificate never deposited');
    fillAndSend('TDS-Q2');
    expect(item('TDS-Q2').chain).toEqual(['rajan', 'usha']);
  });

  it('refusal tests are refused and logged', () => {
    REFUSAL_TESTS.forEach((t) => t.run(st()));
    expect(st().log.filter((l) => l.outcome === 'Refused')).toHaveLength(REFUSAL_TESTS.length);
  });

  it('jump replays earlier steps', () => {
    jumpTo(10);
    expect(STEPS.indexOf(nextItem(st())!.item) + 1).toBe(10);
  });

  it('renders every tab, task screen and report without errors', () => {
    jumpTo(STEPS.length + 1);
    const tabs = ['dashboard', 'tasks', 'reports', 'rules', 'cnc'] as const;
    tabs.forEach((tab) => {
      useApp.setState((s) => ({ nav: { ...s.nav, tab } }));
      expect(renderToString(<AccountsExecutiveApp />).length).toBeGreaterThan(1000);
    });
    TASKS.forEach((t) => {
      st().work
        .filter((w) => w.task === t.code)
        .concat([undefined as never])
        .forEach((w) => {
          useApp.setState((s) => ({ nav: { ...s.nav, tab: 'tasks', tasks: { screen: t.code as TaskId, id: w?.id ?? null } } }));
          const html = renderToString(<AccountsExecutiveApp />);
          expect(html).toContain(t.title.replace(/&/g, '&amp;'));
          if (w) expect(html).toContain(w.id);
        });
    });
    (['purchase', 'notes', 'masters', 'advances', 'close', 'party', 'approval-log'] as ReportId[]).forEach((r) => {
      useApp.setState((s) => ({ nav: { ...s.nav, tab: 'reports', reports: { screen: r, id: null } } }));
      expect(renderToString(<AccountsExecutiveApp />).length).toBeGreaterThan(1000);
    });
  });
});
