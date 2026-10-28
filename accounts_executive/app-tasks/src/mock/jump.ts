// Jump to any scenario step: reset, then replay every earlier step automatically.
// Other roles' events run as in the timeline; Teja's own steps use the scenario's standard choices.

import type { BatchData } from '../domain/tasks';
import type { FieldValue } from '../domain/types';
import { useApp, type AppState } from '../store/appStore';
import { STEPS, TIMELINE, isDone, nextItem, stepNumber, type TimelineItem } from './scenario';

export { STEPS };

const st = () => useApp.getState();

/** Fill an item's form and send it (Teja's standard answer). */
export function fillAndSend(id: string, values: Record<string, FieldValue> = {}) {
  const w = st().work.find((x) => x.id === id);
  if (!w || !(w.status === 'Open' || w.status === 'Returned')) return;
  if (Array.isArray((w.data as Partial<BatchData>).lines) && !(w.data as unknown as BatchData).ran) st().runBatch(id);
  Object.entries(values).forEach(([k, v]) => st().setValue(id, k, v));
  st().sendItem(id);
}

/** Teja's standard action for each "you" step (the answer key). */
export const AUTO: Record<string, () => void> = {
  'you-adv': () => fillAndSend('ADV-0311'),
  'you-sb': () => fillAndSend('SB-0021-09'),
  'you-pv407': () => fillAndSend('PV-0407', { narration: 'Sugar PO 0407; variance approved by Rajan' }),
  'you-lc407': () => fillAndSend('LC-0407'),
  'you-venh': () => fillAndSend('VEN-H', { creditDays: 45, ledger: 'Sundry Creditors – Raw material', bankAccount: '50200098765432', ifsc: 'CNRB0001234', callBack: 'Called Malnad Cocoa on +91 98450 00000, 07-Oct 14:30: account confirmed' }),
  'you-fc25': () => fillAndSend('PV-FC25', { noPoReason: 'Small local purchase for a trial batch; no PO was raised' }),
  'you-ovr': () => {
    st().startOverride('PV-FC25');
    fillAndSend('OVR-FC25', { asked: 'No reverse charge: not a notified purchase from an unregistered person', why: 'Food colour is not a notified item for reverse charge on purchases from an unregistered person' });
  },
  'you-dn': () => {
    fillAndSend('DN-0407');
    fillAndSend('DN-0403');
  },
  'you-limits': () => {
    fillAndSend('CL-C01');
    fillAndSend('CL-C02');
  },
  'you-item': () => fillAndSend('ITM-PM003'),
  'you-cocoa': () => {
    fillAndSend('PV-0424');
    fillAndSend('LC-0424');
  },
  'you-maida': () => {
    fillAndSend('PV-0420');
    fillAndSend('PV-0420-B', { duplicate: 'It is a duplicate: discard it' });
  },
  'you-cn': () => fillAndSend('CN-VC91', { howToBook: 'Against our debit note: no second reduction' }),
  'you-26as': () => fillAndSend('TDS-Q2'),
  'you-nrv': () => fillAndSend('NRV-OCT'),
  'you-wo': () => fillAndSend('ITC-WO-2604'),
  'you-me': () => {
    fillAndSend('GRNI-OCT', { 'line:g648': 'Explain: no provision', 'why:line:g648': 'Invoice arrived 31-Oct; posted in T1, so no provision' });
    fillAndSend('REC-STK-OCT');
    fillAndSend('STD-OCT');
    fillAndSend('STMT-OCT');
    fillAndSend('PROV-OCT');
    fillAndSend('FX-OCT');
    fillAndSend('REC-ARAP-OCT', { 'why:line:ap': 'Debit note DN-0403 is with the Accounts Manager; clears when approved' });
  },
};

export function currentStep(s: AppState): number {
  const next = nextItem(s);
  if (!next) return STEPS.length + 1;
  return stepNumber(next.item);
}

export function playItem(item: TimelineItem) {
  if (item.kind === 'event') {
    if (item.blocked?.(st())) return;
    item.run!(st());
    st().sim.markPlayed(item.id);
  } else {
    st().sim.advanceTo(item.at);
    AUTO[item.id]?.();
  }
}

/** Reset and replay steps 1 … target-1, leaving `target` as the next step. */
export function jumpTo(target: number) {
  st().sim.reset();
  let before = new Set<string>();
  let captured = false;
  for (const item of TIMELINE.filter((i) => !i.optional && stepNumber(i) < target)) {
    if (!captured && stepNumber(item) === target - 1) {
      before = new Set(st().notifications.map((n) => n.id));
      captured = true;
    }
    if (!isDone(item, st())) playItem(item);
  }
  const first = STEPS[target - 1];
  if (first) st().sim.advanceTo(first.at);
  useApp.setState((s) => ({
    toasts: [],
    nav: { ...s.nav, tab: 'dashboard' },
    notifications: s.notifications.map((n) => (before.has(n.id) ? { ...n, read: true, dismissed: n.dismissed || n.tone === 'info' || n.tone === 'success' } : n)),
  }));
  st().toast(
    'info',
    target > STEPS.length ? 'Jumped to the end of the scenario' : `Jumped to step ${target} of ${STEPS.length}`,
    target > 1 ? `Steps 1–${Math.min(target - 1, STEPS.length)} were played automatically.` : 'Scenario reset to the start.',
  );
}
