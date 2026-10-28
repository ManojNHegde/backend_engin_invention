// The shared biscuit-plant scenario, from the Accounts Executive's side (docs/reference-company/full-scenario.md).
// "event" = another role acts (mocked, played from the panel). "you" = Teja's own step in the app.
// Steps with no scenario step are marked ILLUSTRATIVE in their `step`.

import type { ISODateTime } from '../domain/types';
import type { AppState } from '../store/appStore';
import { ACTORS, ME, who } from '../store/actors';
import type { NavTarget } from '../store/navigation';

export interface TimelineItem {
  id: string;
  kind: 'event' | 'you';
  at: ISODateTime;
  step: string;
  actor: string;
  title: string;
  expect: string;
  blocked?: (s: AppState) => string | null;
  run?: (s: AppState) => void;
  alt?: { label: string; run: (s: AppState) => void };
  optional?: boolean;
  skip?: (s: AppState) => string | null;
  done?: (s: AppState) => boolean;
  go?: NavTarget | ((s: AppState) => NavTarget);
}

const item = (s: AppState, id: string) => s.work.find((w) => w.id === id);
/** Sent on (to a checker, or closed). */
export const sent = (s: AppState, id: string) => {
  const w = item(s, id);
  return !!w && w.status !== 'Open' && w.status !== 'Returned';
};
const withChecker = (s: AppState, id: string, step = 0) => item(s, id)?.status === 'Sent' && item(s, id)?.step === step;
const by = (k: keyof typeof ACTORS) => `${ACTORS[k].name} · ${ACTORS[k].role}`;
const you = `${ME.name} · you`;
const needSent = (s: AppState, ids: string[], what: string) => (ids.every((id) => item(s, id)?.status === 'Sent') ? null : `Do "${what}" first`);

export const TIMELINE: TimelineItem[] = [
  // ---------- Mon 05-Oct ----------
  {
    id: 'ev-adv', kind: 'event', at: '2026-10-05T12:00', step: 'B1-06', actor: by('hema'),
    title: 'SO-6 raised for C-04; its ₹59,000 advance of 03-Oct is on account',
    expect: 'T13 badge 1. Healthy Bite Foods paid ₹59,000 on 03-Oct; SO-6 is a ₹1,06,200 co-packing service order.',
    run: (s) => s.sim.arrive('ADV-0311', '2026-10-05T12:00'),
  },
  {
    id: 'you-adv', kind: 'you', at: '2026-10-05T14:00', step: 'B4-10', actor: you,
    title: 'Record the advance against SO-6 and flag GST on advance (T13)',
    expect: 'GST on advance suggested Yes (a service): ₹9,000 included on ₹50,000. Send: Rajan checks; Pooja (Billing) is told to issue the receipt voucher.',
    done: (s) => sent(s, 'ADV-0311'),
    go: { tab: 'tasks', screen: 'T13', id: 'ADV-0311' },
  },
  // ---------- Tue 06-Oct ----------
  {
    id: 'ev-sb', kind: 'event', at: '2026-10-06T10:00', step: 'A2-04', actor: by('kiran'),
    title: "Matches Shakti Manpower's September bill, ₹2,65,000, to WO-0021 and raises the variance",
    expect: 'T2 "With others": the September milestone is confirmed at ₹2,40,000 by the Packing Head, so the bill is ₹25,000 (10.4%) above it. Kiran raised the variance; it is with Rajan. Remaining contract value ₹14,40,000.',
    run: (s) => s.sim.arrive('SB-0021-09', '2026-10-06T10:00'),
  },
  {
    id: 'ev-sb-var', kind: 'event', at: '2026-10-06T11:00', step: 'A2-04', actor: by('rajan'),
    title: 'Decides the service-bill variance: post the confirmed ₹2,40,000',
    expect: 'SB-0021-09 comes back to Needs me: "Variance approved: post SB-0021-09". The ₹25,000 waits for the Packing Head.',
    run: (s) => s.sim.decideVariance('SB-0021-09', 'Post the confirmed ₹2,40,000; ₹25,000 held until the Packing Head confirms it'),
  },
  {
    id: 'you-sb', kind: 'you', at: '2026-10-06T11:30', step: 'A2-04', actor: you,
    title: 'Post the service bill against the confirmed milestone (T2)',
    expect: 'Before the decision it is stopped: "Variance not yet approved". Now: the expense ledger is suggested; post and send to Rajan, who approves the bill.',
    done: (s) => sent(s, 'SB-0021-09'),
    go: { tab: 'tasks', screen: 'T2', id: 'SB-0021-09' },
  },
  {
    id: 'ev-adv-ok', kind: 'event', at: '2026-10-06T12:00', step: 'B4-10', actor: `${by('rajan')} · ${by('pooja')}`,
    title: 'Rajan approves the advance; Pooja issues the GST receipt voucher',
    expect: 'ADV-0311 Approved. Updates: "approved by Rajan".',
    blocked: (s) => needSent(s, ['ADV-0311'], 'Record the advance'),
    skip: (s) => (item(s, 'ADV-0311')?.status === 'Approved' ? 'Already approved' : null),
    run: (s) => s.sim.checkerDecides('ADV-0311', true, 'GST on advance ₹9,000; receipt voucher RV-0012 issued by Pooja'),
  },
  // ---------- Wed 07-Oct ----------
  {
    id: 'ev-pv407', kind: 'event', at: '2026-10-07T09:30', step: 'A1-06 · A1-08', actor: by('ravi'),
    title: "Scans Vendor C's sugar invoice (PO 0407), corrects the OCR quantity and raises the ₹17,900 variance",
    expect: 'T1 "With others": OCR read the quantity as 18,000 at 61%; Ravi corrected it to 10,000 (A1-08). Variance ₹17,900 raised by Ravi, with Rajan (A1-06). T3: the ₹3,000 freight on it is to be allocated.',
    run: (s) => {
      s.sim.arrive('PV-0407', '2026-10-07T09:30');
      s.sim.arrive('LC-0407', '2026-10-07T09:30');
    },
  },
  {
    id: 'ev-var407', kind: 'event', at: '2026-10-07T09:45', step: 'A1-06', actor: by('rajan'),
    title: "Approves Ravi's sugar variance: short supply, rate revision and freight",
    expect: 'PV-0407 comes back to Needs me: "Variance approved: post PV-0407".',
    run: (s) => s.sim.decideVariance('PV-0407', 'Accepted: short supply, rate revision, freight'),
  },
  {
    id: 'you-pv407', kind: 'you', at: '2026-10-07T10:00', step: 'A1-06', actor: you,
    title: 'Post the sugar voucher once its variance is approved (T1)',
    expect: 'Shown, not typed: variance ₹17,900 = quantity 150 kg × ₹46.80 = ₹7,020 (1.52%) + rate 9,850 kg × ₹0.80 = ₹7,880 (1.74%) + freight ₹3,000, raised by Ravi and approved by Rajan. You add the tax lines and due date (21-Nov, 45 days) and send the voucher to Rajan.',
    done: (s) => sent(s, 'PV-0407'),
    go: { tab: 'tasks', screen: 'T1', id: 'PV-0407' },
  },
  {
    id: 'you-lc407', kind: 'you', at: '2026-10-07T10:30', step: 'A1-06', actor: you,
    title: 'Allocate the ₹3,000 freight over the 9,850 kg received (T3)',
    expect: '₹3,000 ÷ 9,850 kg = ₹0.3046 a kg. Stopped until the sugar voucher is posted.',
    done: (s) => sent(s, 'LC-0407'),
    go: { tab: 'tasks', screen: 'T3', id: 'LC-0407' },
  },
  {
    id: 'ev-venh', kind: 'event', at: '2026-10-07T11:00', step: 'A1-17', actor: by('ravi'),
    title: 'Proposes Vendor H, Malnad Cocoa Traders (MSME, micro)',
    expect: 'T7: identity from Business Core; you complete credit days, ledger, bank details and the call-back evidence.',
    run: (s) => s.sim.arrive('VEN-H', '2026-10-07T11:00'),
  },
  {
    id: 'you-venh', kind: 'you', at: '2026-10-07T15:00', step: 'A1-17', actor: you,
    title: "Complete Vendor H's finance fields (T7)",
    expect: 'MSME: more than 45 days is stopped; Vendor C\'s bank account is refused as a duplicate; penny-drop matches; no call-back evidence is stopped. Goes to Rajan, then Usha for the bank details.',
    done: (s) => sent(s, 'VEN-H'),
    go: { tab: 'tasks', screen: 'T7', id: 'VEN-H' },
  },
  // ---------- Thu 08-Oct ----------
  {
    id: 'ev-venh-ok', kind: 'event', at: '2026-10-08T10:00', step: 'A1-17', actor: `${by('rajan')} · ${by('usha')}`,
    title: 'Rajan approves Vendor H at 10:00; Usha approves the bank details',
    expect: 'Vendor H is in the master. Its Udyam number arrives to verify (T17).',
    blocked: (s) => needSent(s, ['VEN-H'], "Complete Vendor H's finance fields"),
    skip: (s) => (item(s, 'VEN-H')?.status === 'Approved' ? 'Already approved' : null),
    run: (s) => {
      s.sim.advanceTo('2026-10-08T10:00');
      if (withChecker(s, 'VEN-H', 0)) s.sim.checkerDecides('VEN-H', true, 'Terms and ledger approved');
      s.sim.checkerDecides('VEN-H', true, 'Bank details approved after penny-drop');
      s.sim.arrive('UDY-H', '2026-10-08T10:05');
    },
  },
  {
    id: 'ev-fc25', kind: 'event', at: '2026-10-08T12:00', step: 'A1-10', actor: by('suresh'),
    title: 'Food colour, 25 kg from a local trader, ₹8,500: no PO',
    expect: 'T1: no PO (a reason, read by Ravi); unregistered vendor, so reverse charge is suggested.',
    run: (s) => s.sim.arrive('PV-FC25', '2026-10-08T12:00'),
  },
  {
    id: 'you-fc25', kind: 'you', at: '2026-10-08T12:30', step: 'A1-10', actor: you,
    title: 'Post the food-colour bill without a PO (T1)',
    expect: 'Posted normally, no checker; Ravi\'s exception list shows "no PO, ₹8,500".',
    done: (s) => item(s, 'PV-FC25')?.status === 'Done',
    go: { tab: 'tasks', screen: 'T1', id: 'PV-FC25' },
  },
  {
    id: 'you-ovr', kind: 'you', at: '2026-10-08T13:00', step: 'T6 (ILLUSTRATIVE)', actor: you,
    title: 'Request a tax override: no reverse charge on the food colour (T6)',
    expect: 'From the voucher: "Request tax override (T6)". A reason is required; it goes to Venkat (Compliance Officer).',
    done: (s) => sent(s, 'OVR-FC25'),
    go: (s) => (item(s, 'OVR-FC25') ? { tab: 'tasks', screen: 'T6', id: 'OVR-FC25' } : { tab: 'tasks', screen: 'T1', id: 'PV-FC25' }),
  },
  {
    id: 'ev-ovr-ok', kind: 'event', at: '2026-10-08T16:00', step: 'T6 (ILLUSTRATIVE)', actor: by('venkat'),
    title: 'Venkat grants the override',
    expect: 'OVR-FC25 Approved; logged on the Approval Log.',
    blocked: (s) => needSent(s, ['OVR-FC25'], 'Request a tax override'),
    skip: (s) => (item(s, 'OVR-FC25')?.status === 'Approved' ? 'Already decided' : null),
    run: (s) => s.sim.checkerDecides('OVR-FC25', true, 'Not a notified item under 9(4): no reverse charge'),
    alt: { label: 'Refuse instead', run: (s) => s.sim.checkerDecides('OVR-FC25', false, 'Keep reverse charge until the HSN is confirmed') },
  },
  // ---------- Fri 09-Oct ----------
  {
    id: 'ev-rajan1', kind: 'event', at: '2026-10-09T11:00', step: 'A1-06 · A2-04', actor: by('rajan'),
    title: 'Rajan approves the sugar voucher, the freight allocation and the service bill',
    expect: 'All three Approved. (Alternative: he returns the sugar voucher, and it comes back to Needs me with his reason.)',
    blocked: (s) => needSent(s, ['PV-0407', 'LC-0407', 'SB-0021-09'], 'Post the sugar voucher, allocate the freight and post the service bill'),
    skip: (s) => (['PV-0407', 'LC-0407', 'SB-0021-09'].every((id) => item(s, id)?.status === 'Approved') ? 'Already approved' : null),
    run: (s) => {
      s.sim.advanceTo('2026-10-09T11:00');
      s.sim.checkerDecides('PV-0407', true, 'Voucher approved');
      s.sim.checkerDecides('LC-0407', true);
      s.sim.checkerDecides('SB-0021-09', true, 'Service bill approved at the confirmed ₹2,40,000');
    },
    alt: {
      label: 'Return the sugar voucher instead',
      run: (s) => {
        s.sim.advanceTo('2026-10-09T11:00');
        s.sim.checkerDecides('PV-0407', false, 'Narration: quote the rate-revision letter from Vendor C');
      },
    },
  },
  {
    id: 'ev-ret', kind: 'event', at: '2026-10-09T15:00', step: 'A4-07', actor: by('suresh'),
    title: 'Returns the rejected sugar: 100 kg to Vendor C, 400 kg to Vendor B',
    expect: 'T4: two debit notes due, pre-filled from QC. Sunil holds ₹20,160 on Vendor B\'s invoice until its debit note exists.',
    run: (s) => {
      s.sim.arrive('DN-0407', '2026-10-09T15:00');
      s.sim.arrive('DN-0403', '2026-10-09T15:00');
    },
  },
  {
    id: 'you-dn', kind: 'you', at: '2026-10-09T16:00', step: 'A4-07', actor: you,
    title: 'Raise both debit notes (T4)',
    expect: 'Vendor C 100 kg × ₹46 = ₹4,600 + GST ₹230; Vendor B 400 kg × ₹48 = ₹19,200 + GST ₹960. More than rejected is stopped. Sunil is told.',
    done: (s) => sent(s, 'DN-0407') && sent(s, 'DN-0403'),
    go: { tab: 'tasks', screen: 'T4', id: 'DN-0407' },
  },
  // ---------- Mon 12-Oct ----------
  {
    id: 'ev-dn-ok', kind: 'event', at: '2026-10-12T10:00', step: 'A4-07 · A3', actor: `${by('rajan')} · ${by('sunil')}`,
    title: "Rajan approves both debit notes; Sunil releases the hold on Vendor B's invoice",
    expect: 'DN-0407 and DN-0403 Approved; the ₹20,160 dispute is settled.',
    blocked: (s) => needSent(s, ['DN-0407', 'DN-0403'], 'Raise both debit notes'),
    skip: (s) => (['DN-0407', 'DN-0403'].every((id) => item(s, id)?.status === 'Approved') ? 'Already approved' : null),
    run: (s) => {
      s.sim.advanceTo('2026-10-12T10:00');
      s.sim.checkerDecides('DN-0407', true);
      s.sim.checkerDecides('DN-0403', true);
      s.sim.sunilReleasesHold('2026-10-12T10:30');
    },
  },
  {
    id: 'ev-limits', kind: 'event', at: '2026-10-12T14:30', step: 'B3-04', actor: by('farid'),
    title: 'Recommends new limits: C-01 ₹18,00,000, C-02 ₹9,60,000',
    expect: 'T12: two limit edits to enter, each with Farid\'s reason.',
    run: (s) => {
      s.sim.arrive('CL-C01', '2026-10-12T14:30');
      s.sim.arrive('CL-C02', '2026-10-12T14:30');
    },
  },
  {
    id: 'you-limits', kind: 'you', at: '2026-10-12T15:00', step: 'B3-04 · T5', actor: you,
    title: 'Enter both limits on the customer record (T12)',
    expect: 'Same as now is stopped; different from the recommendation asks a reason (read by Farid). Goes to Farid (checks), then Rajan (confirms).',
    done: (s) => sent(s, 'CL-C01') && sent(s, 'CL-C02'),
    go: { tab: 'tasks', screen: 'T12', id: 'CL-C02' },
  },
  {
    id: 'ev-limits-ok', kind: 'event', at: '2026-10-12T17:00', step: 'T5 · B3-04', actor: `${by('farid')} · ${by('rajan')}`,
    title: 'Farid agrees to both edits; Rajan confirms them',
    expect: 'Customer master: C-01 ₹18,00,000, C-02 ₹9,60,000.',
    blocked: (s) => needSent(s, ['CL-C01', 'CL-C02'], 'Enter both limits'),
    skip: (s) => (['CL-C01', 'CL-C02'].every((id) => item(s, id)?.status === 'Approved') ? 'Already confirmed' : null),
    run: (s) => {
      s.sim.advanceTo('2026-10-12T17:00');
      ['CL-C01', 'CL-C02'].forEach((id) => {
        if (withChecker(s, id, 0)) s.sim.checkerDecides(id, true, 'Agreed: matches my recommendation');
        s.sim.checkerDecides(id, true, 'Confirmed');
      });
    },
  },
  // ---------- Tue 13-Oct ----------
  {
    id: 'ev-item', kind: 'event', at: '2026-10-13T10:00', step: 'A4-13', actor: by('suresh'),
    title: 'New Item Request: "Printed laminate film"',
    expect: 'T8: closest existing item PM-001; HSN 3920 and 18% suggested; code PM-003.',
    run: (s) => s.sim.arrive('ITM-PM003', '2026-10-13T10:00'),
  },
  {
    id: 'you-item', kind: 'you', at: '2026-10-13T11:00', step: 'A4-13', actor: you,
    title: 'Create PM-003 and send it for approval (T8)',
    expect: 'An existing code is stopped; HSN 3920 at another rate asks a reason. Rajan approves; Suresh is told.',
    done: (s) => sent(s, 'ITM-PM003'),
    go: { tab: 'tasks', screen: 'T8', id: 'ITM-PM003' },
  },
  {
    id: 'ev-cocoa', kind: 'event', at: '2026-10-13T15:00', step: 'A1-14 · A4', actor: by('suresh'),
    title: 'Vendor H invoices the 300 kg of cocoa (PO 0424), with ₹1,500 freight',
    expect: 'T1: ₹1,23,600 + freight ₹1,500 (on the PO, not a variance) + GST. MSME micro: due 28-Oct (Net 15). T3: the freight to allocate.',
    run: (s) => {
      s.sim.arrive('PV-0424', '2026-10-13T15:00');
      s.sim.arrive('LC-0424', '2026-10-13T15:00');
    },
  },
  {
    id: 'you-cocoa', kind: 'you', at: '2026-10-13T16:00', step: 'A1-14', actor: you,
    title: 'Post the cocoa voucher and allocate its freight (T1, T3)',
    expect: 'Matches within tolerance; MSME warning with the due date; ₹1,500 ÷ 300 kg = ₹5 a kg.',
    done: (s) => sent(s, 'PV-0424') && sent(s, 'LC-0424'),
    go: { tab: 'tasks', screen: 'T1', id: 'PV-0424' },
  },
  // ---------- Wed 14-Oct ----------
  {
    id: 'ev-maida', kind: 'event', at: '2026-10-14T10:00', step: 'A1 hand-off', actor: `${by('ravi')} · Vendor A`,
    title: "Vendor A's maida invoice for 51,000 kg arrives twice: scanned by Ravi, who raises the variance, and emailed to accounts",
    expect: 'T1: 51,000 kg on a 50,000 kg PO, 2.0% over (inside the 2% GRN tolerance, above the 0.5% match tolerance): Ravi raises the ₹38,900 variance, with Rajan. Crosses ₹50 lakh with Vendor A: TDS. The emailed copy is a duplicate, in Needs me.',
    run: (s) => {
      s.sim.arrive('PV-0420', '2026-10-14T10:00');
      s.sim.arrive('PV-0420-B', '2026-10-14T10:05');
    },
  },
  {
    id: 'ev-var420', kind: 'event', at: '2026-10-14T10:30', step: 'A1 hand-off', actor: by('rajan'),
    title: "Approves Ravi's maida variance (over-delivery accepted at the gate)",
    expect: 'PV-0420 comes back to Needs me.',
    run: (s) => s.sim.decideVariance('PV-0420', 'Accepted: 1,000 kg over-delivery inside the GRN tolerance'),
  },
  {
    id: 'you-maida', kind: 'you', at: '2026-10-14T11:00', step: 'A1 hand-off', actor: you,
    title: 'Post the maida voucher and discard the duplicate (T1)',
    expect: 'Variance ₹38,900 (1,000 kg × ₹38.90), approved. TDS ₹1,604: 0.1% on ₹16,03,900 above ₹50 lakh. The duplicate: same vendor and invoice number, discarded.',
    done: (s) => sent(s, 'PV-0420') && item(s, 'PV-0420-B')?.status === 'Discarded',
    go: { tab: 'tasks', screen: 'T1', id: 'PV-0420' },
  },
  {
    id: 'ev-cn', kind: 'event', at: '2026-10-14T15:00', step: 'T5 (ILLUSTRATIVE)', actor: 'Vendor C',
    title: 'Vendor C sends a credit note for the 100 kg returned',
    expect: 'T5: DN-0407 already covers the same return, so you must say how to book it.',
    run: (s) => s.sim.arrive('CN-VC91', '2026-10-14T15:00'),
  },
  {
    id: 'you-cn', kind: 'you', at: '2026-10-14T16:00', step: 'T5 (ILLUSTRATIVE)', actor: you,
    title: 'Book the credit note against DN-0407 (T5)',
    expect: 'Linked to DN-0407: no second reduction. ITC ₹230 to reverse, flagged to Venkat.',
    done: (s) => sent(s, 'CN-VC91'),
    go: { tab: 'tasks', screen: 'T5', id: 'CN-VC91' },
  },
  // ---------- Thu 15-Oct onwards ----------
  {
    id: 'ev-so6', kind: 'event', at: '2026-10-15T10:00', step: 'B4-10', actor: by('pooja'),
    title: 'SO-6 is cancelled before supply; Pooja issues the refund voucher',
    expect: 'The advance on T13 shows "refunded". Update only.',
    run: (s) => s.sim.cancelSo6('2026-10-15T10:00'),
  },
  {
    id: 'ev-26as', kind: 'event', at: '2026-10-20T10:00', step: 'T14 (ILLUSTRATIVE)', actor: by('system'),
    title: '26AS for Q2 (Jul–Sep) is available',
    expect: 'T14: run the match. Two lines settle; C-05 deducted but did not deposit; C-06 differs by ₹100.',
    run: (s) => s.sim.arrive('TDS-Q2', '2026-10-20T10:00'),
  },
  {
    id: 'you-26as', kind: 'you', at: '2026-10-20T11:00', step: 'T14 (ILLUSTRATIVE)', actor: you,
    title: 'Run the 26AS match and decide the two open lines (T14)',
    expect: 'Run, then choose per line. A write-off or accepting the 26AS amount needs a reason.',
    done: (s) => sent(s, 'TDS-Q2'),
    go: { tab: 'tasks', screen: 'T14', id: 'TDS-Q2' },
  },
  {
    id: 'ev-nrv', kind: 'event', at: '2026-10-28T09:00', step: 'T10 (ILLUSTRATIVE)', actor: by('system'),
    title: 'SMP batch SM-2604 expires with 100 kg in stock',
    expect: 'T10: provision ₹29,800 suggested (100 kg × ₹298).',
    run: (s) => s.sim.arrive('NRV-OCT', '2026-10-28T09:00'),
  },
  {
    id: 'you-nrv', kind: 'you', at: '2026-10-28T10:00', step: 'T10 (ILLUSTRATIVE)', actor: you,
    title: 'Draft the expired-stock provision (T10)',
    expect: 'Anything less than 100% needs a reason. Goes to Rajan (review), then Usha (approve).',
    done: (s) => sent(s, 'NRV-OCT'),
    go: { tab: 'tasks', screen: 'T10', id: 'NRV-OCT' },
  },
  {
    id: 'ev-wo', kind: 'event', at: '2026-10-29T11:00', step: 'T22 (ILLUSTRATIVE)', actor: `${by('suresh')} · ${by('anand')}`,
    title: 'Suresh writes off the 100 kg of expired SMP; Anand approves the write-off',
    expect: 'T22: ITC ₹1,490 to reverse (5% on ₹29,800).',
    run: (s) => s.sim.arrive('ITC-WO-2604', '2026-10-29T11:00'),
  },
  {
    id: 'you-wo', kind: 'you', at: '2026-10-29T12:00', step: 'T22 (ILLUSTRATIVE)', actor: you,
    title: 'Book the ITC reversal on the written-off SMP (T22)',
    expect: 'ITC ₹1,490 computed; goes to Venkat (Compliance Officer).',
    done: (s) => sent(s, 'ITC-WO-2604'),
    go: { tab: 'tasks', screen: 'T22', id: 'ITC-WO-2604' },
  },
  {
    id: 'ev-me', kind: 'event', at: '2026-10-31T17:00', step: 'Month end', actor: 'Calendar',
    title: 'Month end: the October close opens',
    expect: 'T19, T9, T20, T21, T15, T23 and T18 are ready to run (and T11 in Periodic mode).',
    run: (s) => s.sim.monthEnd('2026-10-31T17:00'),
  },
  {
    id: 'you-me', kind: 'you', at: '2026-10-31T18:00', step: 'Month end (ILLUSTRATIVE)', actor: you,
    title: 'Run the October close: GRN-not-invoiced, stock, standard cost, bank statement, provision, FX and AR/AP (T19, T9, T20, T21, T15, T23, T18)',
    expect: 'GRN-not-invoiced: 2 GRNs (₹2,22,000 vanilla; cartons explained). Stock: 2 breaks (cocoa freight, food colour). Cartons ₹3,500 price variance. Stock statement excludes the expired SMP. FX gain ₹4,272 on SO-3. AR/AP agrees if DN-0403 was approved.',
    done: (s) => MONTH_END_IDS.every((id) => sent(s, id)),
    go: { tab: 'tasks', screen: 'T19', id: 'GRNI-OCT' },
  },
];

/** The October close (the month-end runs), in the order they are done. */
export const MONTH_END_IDS = ['GRNI-OCT', 'REC-STK-OCT', 'STD-OCT', 'STMT-OCT', 'PROV-OCT', 'FX-OCT', 'REC-ARAP-OCT'];

export interface RefusalTest {
  id: string;
  title: string;
  run: (s: AppState) => void;
}

/** Refusal tests: each must be refused and leave an entry on the Approval Log (Full scenario Part C). */
export const REFUSAL_TESTS: RefusalTest[] = [
  { id: 'C-07', title: 'Teja edits Vendor C, then approves a voucher against Vendor C', run: (s) => s.sim.attempt('teja', 'PV-0407', 'Approve purchase voucher', 'The maker of a vendor change cannot approve its vouchers; the Accounts Manager approves (C-07).') },
  { id: 'AE-1', title: 'Teja approves her own purchase voucher', run: (s) => s.sim.attempt('teja', 'PV-0407', 'Approve own voucher', 'Maker cannot check her own work. Sent to the Accounts Manager instead.') },
  { id: 'AE-2', title: "Teja changes Vendor C's bank account without the Finance Controller", run: (s) => s.sim.attempt('teja', 'Vendor C', 'Change bank account', 'Bank-detail changes go to the Finance Controller (§11.1).') },
  { id: 'AE-3', title: "Teja edits C-02's ship-to pincode", run: (s) => s.sim.attempt('teja', 'C-02 Chennai Retail Mart', 'Edit ship-to pincode', 'Identity (name, PAN, GSTIN, address) belongs to Business Core, not the finance fields.') },
  { id: 'C-13', title: "Pooja (Billing Executive) edits C-02's credit days", run: (s) => s.sim.attempt('pooja', 'C-02 Chennai Retail Mart', 'Edit credit days', 'Finance fields belong to the Accounts Executive; Billing applies them but cannot change them (C-13).') },
  { id: 'AE-4', title: "Teja changes C-01's credit limit with no recommendation", run: (s) => s.sim.attempt('teja', 'C-01 Sri Lakshmi Distributors', 'Edit credit limit', 'A credit-limit edit needs the Credit Controller\'s recommendation and check.') },
  { id: 'AE-5', title: 'Teja issues a sales invoice', run: (s) => s.sim.attempt('teja', 'SO-1', 'Issue sales invoice', 'Sales invoices and notes are issued by the Billing Executive (§10.1, moved on 1-Oct).') },
  { id: 'AE-6', title: 'Teja posts the maida voucher before its variance is approved', run: (s) => s.sim.attempt('teja', 'PV-0420', 'Post purchase voucher', 'The Procurement Officer raises the match variance and the Accounts Manager approves it before posting (§1.1, §12.1).') },
  { id: 'AE-7', title: 'Teja changes the costing method of an item', run: (s) => s.sim.attempt('teja', 'PM-001 Laminate film roll', 'Change costing method', 'The costing method is an accounting policy: the Accounts Manager proposes, the Finance Controller approves (§12.2).') },
];

/** Work other roles can send at any time (not on the timeline). */
export const ANY_TIME: { id: string; template: string; label: string; actor: string }[] = [
  { id: 'net', template: 'NET-C04', label: 'Same PAN on Healthy Bite Foods as customer and vendor (T16, ILLUSTRATIVE)', actor: 'System' },
  { id: 'udyd', template: 'UDY-D', label: 'Vendor D has not answered the Udyam request (T17, ILLUSTRATIVE)', actor: 'System' },
];

export const STEPS = TIMELINE.filter((i) => !i.optional);
export const stepNumber = (item: TimelineItem) => STEPS.indexOf(item) + 1;

export function nextItem(s: AppState): { item: TimelineItem; blockedBy: string | null } | null {
  for (const item of TIMELINE) {
    if (item.skip?.(s)) continue;
    if (item.kind === 'you') {
      if (!item.done!(s)) return { item, blockedBy: null };
      continue;
    }
    if (item.optional || s.played.includes(item.id)) continue;
    return { item, blockedBy: item.blocked?.(s) ?? null };
  }
  return null;
}

export function isDone(item: TimelineItem, s: AppState): boolean {
  if (item.skip?.(s)) return true;
  return item.kind === 'you' ? item.done!(s) : s.played.includes(item.id);
}

export const checkerLabel = (k: Parameters<typeof who>[0]) => who(k);
