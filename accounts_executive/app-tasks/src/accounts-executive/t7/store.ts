// T7 state: the open requests and what each person has done with them. Local to this task.

import { create } from 'zustand';
import { bankChanged, checkers, runChecks, seedRequests, stops, type FinanceFields, type VendorRequest } from './model';

interface T7State {
  requests: VendorRequest[];
  selectedId: string;
  select: (id: string) => void;
  edit: (id: string, patch: Partial<FinanceFields>) => void;
  send: (id: string) => boolean;
  /** Demo: play a checker's decision. */
  decide: (id: string, by: 'rajan' | 'usha', approve: boolean, reason?: string) => void;
  /** Demo: put everything back as on 08-Oct. */
  reset: () => void;
}

const stamp = () => '2026-10-08 ' + new Date().toTimeString().slice(0, 5);

const update = (list: VendorRequest[], id: string, fn: (r: VendorRequest) => VendorRequest) => list.map((r) => (r.id === id ? fn(r) : r));

export const useT7 = create<T7State>((set, get) => ({
  requests: seedRequests(),
  selectedId: 'VR-H',
  select: (id) => set({ selectedId: id }),
  edit: (id, patch) =>
    set((s) => ({ requests: update(s.requests, id, (r) => (r.stage === 'draft' || r.stage === 'returned' ? { ...r, fields: { ...r.fields, ...patch } } : r)) })),
  send: (id) => {
    const r = get().requests.find((x) => x.id === id);
    if (!r || stops(runChecks(r)).length) return false;
    set((s) => ({
      requests: update(s.requests, id, (x) => ({
        ...x,
        stage: 'with-am',
        history: [...x.history, { at: stamp(), who: 'Teja', what: `Saved and sent for checking to ${checkers(x).map((k) => (k === 'rajan' ? 'Rajan' : 'Usha')).join(' and ')}` }],
      })),
    }));
    return true;
  },
  decide: (id, by, approve, reason) =>
    set((s) => ({
      requests: update(s.requests, id, (r) => {
        const name = by === 'rajan' ? 'Rajan' : 'Usha';
        if (!approve) return { ...r, stage: 'returned', history: [...r.history, { at: stamp(), who: name, what: `Returned${reason ? `: ${reason}` : ''}` }] };
        const needsFc = by === 'rajan' && bankChanged(r);
        return {
          ...r,
          stage: needsFc ? 'with-fc' : 'applied',
          history: [...r.history, { at: stamp(), who: name, what: needsFc ? 'Approved terms and ledger; bank details go to Usha' : 'Approved. Finance fields applied to the vendor' }],
        };
      }),
    })),
  reset: () => set({ requests: seedRequests(), selectedId: 'VR-H' }),
}));
