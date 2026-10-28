// T17 state: the open Udyam requests and what each person has done with them. Local to this task.

import { create } from 'zustand';
import { needsChecker, runChecks, seedRequests, stops, type Fields, type UdyamRequest } from './model';

interface T17State {
  requests: UdyamRequest[];
  selectedId: string;
  select: (id: string) => void;
  edit: (id: string, patch: Partial<Fields>) => void;
  send: (id: string) => boolean;
  /** Demo: play Rajan's decision. */
  decide: (id: string, approve: boolean) => void;
  /** Demo: put everything back as on 08-Oct. */
  reset: () => void;
}

const stamp = () => '2026-10-08 ' + new Date().toTimeString().slice(0, 5);
const update = (list: UdyamRequest[], id: string, fn: (r: UdyamRequest) => UdyamRequest) => list.map((r) => (r.id === id ? fn(r) : r));

export const useT17 = create<T17State>((set, get) => ({
  requests: seedRequests(),
  selectedId: 'UR-H',
  select: (id) => set({ selectedId: id }),
  edit: (id, patch) => set((s) => ({ requests: update(s.requests, id, (r) => (r.stage === 'draft' || r.stage === 'returned' ? { ...r, fields: { ...r.fields, ...patch } } : r)) })),
  send: (id) => {
    const r = get().requests.find((x) => x.id === id);
    if (!r || stops(runChecks(r)).length) return false;
    set((s) => ({
      requests: update(s.requests, id, (x) =>
        needsChecker(x)
          ? { ...x, stage: 'with-am', history: [...x.history, { at: stamp(), who: 'Teja', what: 'Saved and sent for checking to Rajan' }] }
          : { ...x, stage: 'reminded', reminders: x.reminders + 1, history: [...x.history, { at: stamp(), who: 'Teja', what: 'Reminder sent to the vendor' }] },
      ),
    }));
    return true;
  },
  decide: (id, approve) =>
    set((s) => ({
      requests: update(s.requests, id, (r) =>
        approve
          ? { ...r, stage: 'applied', history: [...r.history, { at: stamp(), who: 'Rajan', what: 'Approved. Udyam data applied to the vendor' }] }
          : { ...r, stage: 'returned', history: [...r.history, { at: stamp(), who: 'Rajan', what: 'Returned: please check the certificate again' }] },
      ),
    })),
  reset: () => set({ requests: seedRequests(), selectedId: 'UR-H' }),
}));
