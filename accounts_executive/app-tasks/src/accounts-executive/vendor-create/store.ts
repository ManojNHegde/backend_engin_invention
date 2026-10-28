// Create-a-vendor state: the paper forms and what each person has done with them. Local to this task.

import { create } from 'zustand';
import { allApproved, gstPortal, newRequest, PAPER, pennyDrop, runChecks, seedRequests, stops, type Checker, type Typed, type VendorRequest } from './model';

interface State {
  requests: VendorRequest[];
  selectedId: string;
  counter: number;
  select: (id: string) => void;
  open: () => void;
  edit: (id: string, patch: Partial<Typed>) => void;
  checkGst: (id: string) => void;
  runPenny: (id: string) => void;
  submit: (id: string) => boolean;
  returnForm: (id: string, note: string) => void;
  /** Demo helpers. */
  fillFromPaper: (id: string) => void;
  clear: (id: string) => void;
  approve: (id: string, by: Checker) => void;
  reset: () => void;
}

const stamp = () => '2026-10-08 ' + new Date().toTimeString().slice(0, 5);
const update = (list: VendorRequest[], id: string, fn: (r: VendorRequest) => VendorRequest) => list.map((r) => (r.id === id ? fn(r) : r));
const editable = (r: VendorRequest) => r.stage === 'draft';
const NAME: Record<Checker, string> = { rajan: 'Rajan', usha: 'Usha', venkat: 'Venkat' };

export const useVendorCreate = create<State>((set, get) => ({
  requests: seedRequests(),
  selectedId: 'PF-0412',
  counter: 0,
  select: (id) => set({ selectedId: id }),
  open: () =>
    set((s) => {
      const r = newRequest(s.counter + 1);
      return { requests: [r, ...s.requests], selectedId: r.id, counter: s.counter + 1 };
    }),
  edit: (id, patch) => set((s) => ({ requests: update(s.requests, id, (r) => (editable(r) ? { ...r, typed: { ...r.typed, ...patch } } : r)) })),
  checkGst: (id) => set((s) => ({ requests: update(s.requests, id, (r) => (editable(r) && r.typed.gstin.trim() ? { ...r, gst: gstPortal(r.typed.gstin) } : r)) })),
  runPenny: (id) => set((s) => ({ requests: update(s.requests, id, (r) => (editable(r) && r.typed.bankAccount.trim() && r.typed.ifsc.trim() ? { ...r, penny: pennyDrop(r.typed.bankAccount, r.typed.ifsc) } : r)) })),
  submit: (id) => {
    const r = get().requests.find((x) => x.id === id);
    if (!r || !editable(r) || stops(runChecks(r)).length) return false;
    set((s) => ({
      requests: update(s.requests, id, (x) => ({
        ...x,
        stage: 'submitted',
        parts: { rajan: 'pending', usha: 'pending', venkat: 'pending' },
        history: [...x.history, { at: stamp(), who: 'Teja', what: 'Submitted. Split into three parts: Rajan, Usha and Venkat each check their own' }],
      })),
    }));
    return true;
  },
  returnForm: (id, note) =>
    set((s) => ({
      requests: update(s.requests, id, (r) =>
        editable(r)
          ?{ ...r, stage: 'sent-back', sentBackNote: note, history: [...r.history, { at: stamp(), who: 'Teja', what: `Returned the form to ${r.handedBy.split(' (')[0]}: ${note}. No party and no account were created` }] }
          : r,
      ),
    })),
  fillFromPaper: (id) => set((s) => ({ requests: update(s.requests, id, (r) => (editable(r) ? { ...r, typed: { ...r.typed, ...(PAPER[r.formNo] ?? PAPER['PF-0412']) } } : r)) })),
  clear: (id) => set((s) => ({ requests: update(s.requests, id, (r) => (editable(r) ? { ...r, ...seedFor() } : r)) })),
  approve: (id, by) =>
    set((s) => ({
      requests: update(s.requests, id, (r) => {
        if (r.stage !== 'submitted') return r;
        const next: VendorRequest = { ...r, parts: { ...r.parts, [by]: 'approved' }, history: [...r.history, { at: stamp(), who: NAME[by], what: 'Approved their part' }] };
        return allApproved(next)
          ? { ...next, stage: 'active', vendorId: `V-${next.formNo.slice(-3)}`, history: [...next.history, { at: stamp(), who: 'System', what: 'All parts approved: party and account created. Vendor is active' }] }
          : next;
      }),
    })),
  reset: () => set({ requests: seedRequests(), selectedId: 'PF-0412', counter: 0 }),
}));

function seedFor(): Pick<VendorRequest, 'typed' | 'gst' | 'penny'> {
  const fresh = newRequest(0);
  return { typed: fresh.typed, gst: null, penny: null };
}
