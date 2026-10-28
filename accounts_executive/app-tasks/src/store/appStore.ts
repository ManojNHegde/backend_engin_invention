// Application state for the Accounts Executive mockup.
// - Teja's actions: what the signed-in Accounts Executive does (fill in, send, run, rules).
// - "sim" actions: what other roles do (mocked; played from the scenario panel). The checkers' answers
//   (Rajan, Usha, Venkat, Farid) stand in for the one approval mechanism still to be designed with the
//   Accounts Manager's owner. Match variances are raised by Ravi (Procurement) or Kiran (Contracts &
//   Services) and approved by Rajan before Teja posts (shared work list §1.1, §2.1, §12.1).
// Every state change writes an Approval Log entry (append-only). A log entry with `to` is a message (CnC).

import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Draft } from 'immer';
import { addDays, dateOf } from '../domain/dates';
import { inr } from '../domain/money';
import { NOT_ALLOWED, ruleSummary, ruleType, type RuleDraft } from '../domain/myRules';
import { defaultRules } from '../domain/rules';
import { blockers, pvFigures, specOf, type BatchData, type Ctx, type CustomerData, type PvData, type UdyamData, type VendorData } from '../domain/tasks';
import type { ActorKey, CompanyRules, Customer, FieldValue, ISODateTime, Item, LogEntry, MyRule, SuggestionOutcome, TaskId, Tone, Variance, Vendor, WorkItem } from '../domain/types';
import { OPENING, SCENARIO_START, TEMPLATES, VENDOR_H, monthEndTemplates, seedCustomers, seedItems, seedVendors } from '../mock/seed';
import { ACTORS, who } from './actors';
import { applyTarget, initialNav, type NavState, type NavTarget } from './navigation';
import type { QueueGroup, QueueKind } from './queue';

export interface AppNotification {
  id: string;
  at: ISODateTime;
  tone: Exclude<Tone, 'normal'>;
  title: string;
  body: string;
  link?: NavTarget;
  read: boolean;
  dismissed: boolean;
}

export interface Toast {
  id: number;
  tone: Exclude<Tone, 'normal'>;
  title: string;
  body?: string;
}

interface Data {
  now: ISODateTime;
  rules: CompanyRules;
  vendors: Vendor[];
  customers: Customer[];
  items: Item[];
  work: WorkItem[];
  log: LogEntry[];
  notifications: AppNotification[];
  myRules: MyRule[];
  suggestionLog: SuggestionOutcome[];
  played: string[];
  seen: string[];
  seq: number;
}

export interface QueueUi {
  view: 'queue' | 'tasks';
  group: QueueGroup;
  kind: QueueKind | 'all';
}

export interface AppState extends Data {
  nav: NavState;
  toasts: Toast[];
  queueUi: QueueUi;
  setQueueUi: (patch: Partial<QueueUi>) => void;
  openQueue: (group: QueueGroup) => void;

  navigate: (target: NavTarget) => void;
  select: (id: string | null) => void;
  back: () => void;
  toast: (tone: Toast['tone'], title: string, body?: string) => void;
  dismissToast: (id: number) => void;
  markSeen: (id: string) => void;
  openNotification: (id: string) => void;
  markAllRead: () => void;
  dismissAlert: (id: string) => void;

  // Teja's work on an item
  setValue: (itemId: string, key: string, value: FieldValue) => void;
  confirmField: (itemId: string, key: string) => void;
  runBatch: (itemId: string) => void;
  /** Send the item on: to its checker, or close it when it has none. Refused while something blocks it. */
  sendItem: (itemId: string, note?: string) => boolean;
  /** T6: start a tax-override request from a voucher. */
  startOverride: (voucherId: string) => string | null;

  // My rules
  setMyRule: (draft: RuleDraft) => string | null;
  turnMyRuleOff: (ruleId: string) => void;
  turnMyRuleOn: (ruleId: string) => void;
  endMyRule: (ruleId: string) => void;
  removeMyRule: (ruleId: string) => void;
  tryNotAllowedRule: (id: string) => void;
  recordSuggestion: (id: string, outcome: SuggestionOutcome['outcome'], basis: string) => void;

  sim: {
    arrive: (templateId: string, at: ISODateTime) => void;
    /** The checker who has the item now approves, or returns it with a reason. */
    checkerDecides: (itemId: string, approve: boolean, note?: string) => void;
    /** Rajan approves the match variance Ravi or Kiran raised on a voucher or bill; it comes back to Teja to post. */
    decideVariance: (itemId: string, decision?: string) => void;
    decideRule: (ruleId: string, approve: boolean) => void;
    sunilReleasesHold: (at: ISODateTime) => void;
    cancelSo6: (at: ISODateTime) => void;
    monthEnd: (at: ISODateTime) => void;
    attempt: (actor: ActorKey, entity: string, action: string, detail: string) => void;
    markPlayed: (eventId: string) => void;
    advanceTo: (at: ISODateTime) => void;
    setRules: (rules: Partial<CompanyRules>) => void;
    reset: () => void;
  };
}

type S = Draft<AppState>;

// ---------- seed ----------

function openingLog(): LogEntry[] {
  return OPENING.map((o, i) => ({ id: `OPEN-${i}`, at: o.at, entity: o.id, action: `Posted ${inr(o.amount)} (before the scenario)`, actor: o.by, outcome: 'OK' as const, task: o.task })).sort((a, b) => (a.at < b.at ? 1 : -1));
}

function openingWork(): WorkItem[] {
  return OPENING.map((o) => ({
    id: o.id,
    task: o.task,
    kind: 'opening',
    title: o.title,
    partyId: o.partyId,
    partyName: o.partyName,
    ref: o.ref,
    amount: o.amount,
    arrivedAt: o.at,
    from: 'system' as ActorKey,
    data: {},
    values: {},
    status: 'Approved' as const,
    chain: ['rajan' as ActorKey],
    step: 1,
    cc: [],
    sentAt: o.at,
    closedAt: o.at,
    history: [{ at: o.at, by: o.by, action: 'Posted before the scenario' }],
  }));
}

function seedData(): Data {
  return {
    now: SCENARIO_START,
    rules: structuredClone(defaultRules),
    vendors: structuredClone(seedVendors),
    customers: structuredClone(seedCustomers),
    items: structuredClone(seedItems),
    work: openingWork(),
    log: openingLog(),
    notifications: [],
    myRules: [],
    suggestionLog: [],
    played: [],
    seen: [],
    seq: 0,
  };
}

// ---------- helpers (on the immer draft) ----------

export const ctxOf = (s: Pick<Data, 'rules' | 'vendors' | 'customers' | 'items' | 'work' | 'myRules' | 'now'>): Ctx => ({
  rules: s.rules,
  vendors: s.vendors,
  customers: s.customers,
  items: s.items,
  work: s.work,
  myRules: s.myRules,
  now: s.now,
});

function nextId(s: S, prefix: string): string {
  s.seq += 1;
  return `${prefix}-${String(s.seq).padStart(3, '0')}`;
}

function advance(s: S, at: ISODateTime) {
  if (at > s.now) s.now = at;
  fireReminders(s);
}

function writeLog(s: S, e: Omit<LogEntry, 'id' | 'at' | 'outcome'> & { outcome?: LogEntry['outcome'] }) {
  s.log.unshift({ outcome: 'OK', ...e, id: nextId(s, 'L'), at: s.now });
}

function notify(s: S, tone: AppNotification['tone'], title: string, body: string, link?: NavTarget) {
  s.notifications.unshift({ id: nextId(s, 'N'), at: s.now, tone, title, body, link, read: false, dismissed: false });
}

const linksTo = (itemId: string) => (n: AppNotification) => n.link?.tab === 'tasks' && n.link.id === itemId;

/** Alerts that asked for work on an item go away once the work is done. */
function resolveAlerts(s: S, itemId: string) {
  s.notifications.forEach((n) => {
    if (linksTo(itemId)(n as AppNotification) && (n.tone === 'warning' || n.tone === 'critical')) {
      n.dismissed = true;
      n.read = true;
    }
  });
}

const itemOf = (s: S, id: string) => s.work.find((w) => w.id === id);
const taskLink = (w: Pick<WorkItem, 'task' | 'id'>): NavTarget => ({ tab: 'tasks', screen: w.task, id: w.id });

/** What happens in the masters when the last checker approves. */
function applyApproval(s: S, w: Draft<WorkItem>) {
  if (w.kind === 'vendor') {
    const d = w.data as unknown as VendorData;
    const existing = s.vendors.find((v) => v.id === d.proposal.id);
    const v: Vendor = {
      id: d.proposal.id,
      name: d.proposal.name,
      state: d.proposal.state,
      gstin: d.proposal.gstin,
      pan: d.proposal.pan,
      creditDays: Number(w.values.creditDays),
      ledger: String(w.values.ledger),
      bankAccount: String(w.values.bankAccount),
      ifsc: String(w.values.ifsc).toUpperCase(),
      msme: d.proposal.msme,
      udyam: null,
      fyPurchases: 0,
      approved: true,
      supplies: d.proposal.supplies,
    };
    if (existing) Object.assign(existing, v);
    else s.vendors.push(v);
  }
  if (w.kind === 'customer') {
    const d = w.data as unknown as CustomerData;
    const c = s.customers.find((x) => x.id === d.customerId);
    if (c) c.creditLimit = Number(w.values.newValue);
  }
  if (w.kind === 'item') {
    s.items.push({
      code: String(w.values.code),
      name: String(w.values.name),
      uom: 'kg',
      hsn: String(w.values.hsn),
      gstRate: Number(w.values.gstRate),
      costing: String(w.values.costing) as Item['costing'],
      group: String(w.values.group),
      stockLedger: String(w.values.stockLedger),
    });
  }
  if (w.kind === 'udyam' && (w.data as unknown as UdyamData).mode === 'verify') {
    const v = s.vendors.find((x) => x.id === (w.data as unknown as UdyamData).vendorId);
    if (v) {
      v.udyam = String(w.values.udyam).toUpperCase();
      v.msme = String(w.values.category).toLowerCase() as Vendor['msme'];
    }
  }
}

function fireReminders(s: S) {
  const t = dateOf(s.now);
  s.myRules
    .filter((r) => r.kind === 'remind' && r.status === 'Active' && !r.paused && !r.firedAt && r.until <= t)
    .forEach((r) => {
      r.firedAt = s.now;
      notify(s, 'warning', 'Reminder', String(r.value), { tab: 'rules', id: r.id });
    });
}

let toastSeq = 0;
function pushToast(s: S, tone: Toast['tone'], title: string, body?: string) {
  toastSeq += 1;
  s.toasts.push({ id: toastSeq, tone, title, body });
  if (s.toasts.length > 4) s.toasts.shift();
}

function createItem(s: S, templateId: string): Draft<WorkItem> | null {
  const t = TEMPLATES[templateId];
  if (!t || s.work.some((w) => w.id === t.id)) return null;
  const item: WorkItem = { ...structuredClone(t), arrivedAt: s.now, status: 'Open', chain: [], step: 0, cc: [], history: [{ at: s.now, by: t.from, action: 'Arrived' }] };
  if (item.kind === 'pv') {
    const d = item.data as unknown as PvData;
    d.fyBefore = s.vendors.find((v) => v.id === d.vendorId)?.fyPurchases ?? 0;
  }
  // A variance raised by Procurement waits for the Accounts Manager before Teja can post.
  const v = (item.data as { variance?: Variance }).variance;
  if (v && !v.approvedBy) {
    item.waitingOn = 'rajan';
    item.waitingFor = `Variance raised by ${ACTORS[v.raisedBy].name}`;
  }
  if (item.kind === 'landed') {
    const basis = s.myRules.find((r) => r.kind === 'defaultBasis' && r.status === 'Active' && !r.paused);
    if (basis) item.values.basis = String(basis.value);
  }
  s.work.unshift(item);
  return s.work[0];
}

const ARRIVAL: Record<string, { tone: AppNotification['tone']; title: (w: WorkItem) => string; body: (w: WorkItem) => string }> = {
  advance: { tone: 'warning', title: () => 'Advance received for SO-6', body: () => 'Healthy Bite Foods paid ₹59,000 on 03-Oct for service order SO-6. Link it and flag GST on advance (T13).' },
  service: { tone: 'info', title: () => 'Service bill matched: Shakti Manpower', body: () => 'September bill ₹2,65,000 against WO-0021, ₹25,000 above the confirmed milestone. Kiran raised the variance; it is with Rajan. Post once he decides (T2).' },
  pv: {
    tone: 'warning',
    title: (w) => `Invoice arrived: ${w.partyName}`,
    body: (w) => (w.waitingOn ? `${w.ref} · ${inr(w.amount)}. ${w.waitingFor}, with Rajan; post once approved (T1).` : `${w.ref} · ${inr(w.amount)}. Post it (T1).`),
  },
  landed: { tone: 'warning', title: (w) => `Freight to allocate: ${inr(w.amount)}`, body: (w) => `${w.title}. Spread it over the material voucher (T3).` },
  vendor: { tone: 'warning', title: () => 'New vendor proposed: Malnad Cocoa Traders', body: () => 'Ravi (Procurement Officer) proposed Vendor H, an MSME. Complete its finance fields (T7).' },
  debit: { tone: 'warning', title: (w) => `Return sent: debit note due · ${w.partyName}`, body: (w) => `${w.title.split(' · ').slice(2).join(' · ')} returned after QC rejection (T4).` },
  customer: { tone: 'warning', title: (w) => `Limit recommended: ${w.partyName}`, body: (w) => `Farid (Credit Controller) recommends ${inr(w.amount)}. Enter it on the customer record (T12).` },
  item: { tone: 'warning', title: () => 'New item requested: Printed laminate film', body: () => 'Suresh (Stores) asks for a new item; closest existing is PM-001 (T8).' },
  creditNote: { tone: 'warning', title: () => 'Supplier credit note: Vendor C', body: () => 'VC/CN/0091 for 100 kg sugar. Book it (T5).' },
  tds26as: { tone: 'warning', title: () => '26AS for Q2 is available', body: () => 'Match it against the books (T14).' },
  nrv: { tone: 'warning', title: () => 'SMP batch SM-2604 expired with stock', body: () => '100 kg left at expiry on 28-Oct. Draft the provision (T10).' },
  netting: { tone: 'info', title: () => 'Same PAN on a customer and a vendor', body: () => 'Healthy Bite Foods is both. Prepare a netting document if balances are to be set off (T16).' },
  udyam: { tone: 'info', title: (w) => w.title, body: (w) => `${w.partyName}: MSME data (T17).` },
  itcWo: { tone: 'warning', title: () => 'Write-off approved: ITC to reverse', body: () => 'Anand (Inventory Controller) approved the write-off of 100 kg expired SMP (SM-2604). Book the ITC reversal (T22).' },
};

// ---------- store ----------

const memory = new Map<string, string>();
const memoryStorage: StateStorage = {
  getItem: (k) => memory.get(k) ?? null,
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

export const useApp = create<AppState>()(
  persist(
    immer((set, get, api) => {
      // Server rendering (the render test) reads the live state, not the initial one. The app never renders on a server.
      (api as unknown as { getServerState: () => AppState }).getServerState = () => api.getState();
      return {
      ...seedData(),
      nav: initialNav,
      toasts: [],
      queueUi: { view: 'queue', group: 'me', kind: 'all' },
      setQueueUi: (patch) => set((s) => void Object.assign(s.queueUi, patch)),
      openQueue: (group) =>
        set((s) => {
          s.queueUi = { view: 'queue', group, kind: 'all' };
          applyTarget(s.nav, { tab: 'tasks', screen: null, id: null });
        }),

      navigate: (target) => set((s) => applyTarget(s.nav, target)),
      select: (id) =>
        set((s) => {
          if (s.nav.tab === 'tasks') s.nav.tasks.id = id;
          if (s.nav.tab === 'reports') s.nav.reports.id = id;
          if (s.nav.tab === 'rules') s.nav.rules.id = id;
          if (id && !s.seen.includes(id)) s.seen.push(id);
        }),
      back: () =>
        set((s) => {
          if (s.nav.tab === 'tasks') s.nav.tasks = { screen: null, id: null };
          if (s.nav.tab === 'reports') s.nav.reports = { screen: null, id: null };
        }),
      toast: (tone, title, body) => set((s) => pushToast(s, tone, title, body)),
      dismissToast: (id) => set((s) => void (s.toasts = s.toasts.filter((t) => t.id !== id))),
      markSeen: (id) => set((s) => void (!s.seen.includes(id) && s.seen.push(id))),
      openNotification: (id) =>
        set((s) => {
          const n = s.notifications.find((x) => x.id === id);
          if (!n) return;
          n.read = true;
          if (n.link) applyTarget(s.nav, n.link);
        }),
      markAllRead: () => set((s) => s.notifications.forEach((n) => (n.read = true))),
      dismissAlert: (id) =>
        set((s) => {
          const n = s.notifications.find((x) => x.id === id);
          if (n) {
            n.dismissed = true;
            n.read = true;
          }
        }),

      // ---------- Teja ----------
      setValue: (itemId, key, value) =>
        set((s) => {
          const w = itemOf(s, itemId);
          if (!w || !(w.status === 'Open' || w.status === 'Returned')) return;
          w.values[key] = value;
          // Correcting a scanned field confirms it.
          const ocr = (w.data as { ocr?: Record<string, number> }).ocr;
          if (ocr && ocr[key] !== undefined) w.values[`ok:${key}`] = 1;
        }),
      confirmField: (itemId, key) =>
        set((s) => {
          const w = itemOf(s, itemId);
          if (w) w.values[`ok:${key}`] = 1;
        }),
      runBatch: (itemId) =>
        set((s) => {
          const w = itemOf(s, itemId);
          if (!w) return;
          const d = w.data as unknown as BatchData;
          if (d.ran) return;
          d.ran = true;
          w.history.push({ at: s.now, by: 'teja', action: 'Run' });
          writeLog(s, { entity: w.id, action: `Run: ${d.lines.length} lines, ${d.lines.filter((l) => !l.auto).length} to decide`, actor: 'teja', task: w.task, itemId: w.id });
        }),
      sendItem: (itemId, note) => {
        const st = get();
        const w0 = st.work.find((w) => w.id === itemId);
        if (!w0) return false;
        const ctx = ctxOf(st);
        const blocks = blockers(w0, ctx);
        if (blocks.length) {
          set((s) => pushToast(s, 'critical', "Can't send yet", blocks[0]));
          return false;
        }
        const spec = specOf(w0);
        set((s) => {
          const w = itemOf(s, itemId)!;
          const c = ctxOf(s as AppState);
          const chain = spec.chain(w as WorkItem, w.values, c);
          const cc = spec.cc?.(w as WorkItem, w.values, c) ?? [];
          const label = spec.sendLabel(w as WorkItem, w.values, c);
          w.chain = chain;
          w.step = 0;
          w.cc = cc;
          w.sentAt = s.now;
          w.checkerNote = undefined;
          if (note) w.values.note = note;
          // A purchase posted counts towards the vendor's TDS threshold.
          if (w.kind === 'pv' && !spec.discards?.(w.values)) {
            const v = s.vendors.find((x) => x.id === (w.data as unknown as PvData).vendorId);
            if (v) v.fyPurchases += pvFigures(w as WorkItem, w.values, c).taxable;
            w.amount = pvFigures(w as WorkItem, w.values, c).taxable;
          }
          if (spec.discards?.(w.values)) {
            w.status = 'Discarded';
            w.closedAt = s.now;
            w.history.push({ at: s.now, by: 'teja', action: 'Discarded as a duplicate' });
            writeLog(s, { entity: w.id, action: 'Discarded: duplicate invoice', actor: 'teja', task: w.task, itemId: w.id, detail: `Same vendor and invoice number as ${(w.data as unknown as PvData).duplicateOf}` });
            pushToast(s, 'success', 'Duplicate discarded', `${w.id}: nothing was posted.`);
          } else if (chain.length === 0) {
            w.status = 'Done';
            w.closedAt = s.now;
            w.history.push({ at: s.now, by: 'teja', action: label, note });
            writeLog(s, { entity: w.id, action: label, actor: 'teja', task: w.task, itemId: w.id, to: cc.length ? cc : undefined, detail: String(w.values.noPoReason || w.values.action || note || '') || undefined });
            pushToast(s, 'success', 'Done', `${w.title}: ${cc.length ? `${cc.map((k) => ACTORS[k].name).join(', ')} told` : 'no checker needed'}.`);
          } else {
            w.status = 'Sent';
            w.history.push({ at: s.now, by: 'teja', action: `${label} → ${who(chain[0])}`, note });
            const reasons = Object.entries(w.values)
              .filter(([k, v]) => k.startsWith('why:') && String(v).trim())
              .map(([, v]) => String(v));
            writeLog(s, { entity: w.id, action: `Sent for checking → ${ACTORS[chain[0]].role}`, actor: 'teja', task: w.task, itemId: w.id, to: [chain[0]], cc: cc.length ? cc : undefined, detail: [...reasons, note].filter(Boolean).join(' · ') || undefined });
            pushToast(s, 'success', `Sent to ${ACTORS[chain[0]].name} (${ACTORS[chain[0]].role})`, w.title);
          }
          resolveAlerts(s, w.id);
        });
        return true;
      },
      startOverride: (voucherId) => {
        let created: string | null = null;
        set((s) => {
          const v = itemOf(s, voucherId);
          if (!v) return;
          const id = `OVR-${voucherId.replace(/^PV-/, '')}`;
          if (s.work.some((w) => w.id === id)) {
            created = id;
            return;
          }
          const vendor = s.vendors.find((x) => x.id === v.partyId);
          const amount = pvFigures(v as WorkItem, v.values, ctxOf(s as AppState)).taxable;
          s.work.unshift({
            id,
            task: 'T6',
            kind: 'override',
            title: `Tax override · ${v.partyName}`,
            partyId: v.partyId,
            partyName: v.partyName,
            ref: voucherId,
            amount,
            arrivedAt: s.now,
            from: 'teja',
            data: { voucherId, vendorName: vendor?.name ?? v.partyName, amount, derived: 'Reverse charge (RCM): GST 5% payable by us', derivedWhy: 'The vendor has no GSTIN, so the policy engine suggests reverse charge.' },
            values: { asked: '', why: '' },
            status: 'Open',
            chain: [],
            step: 0,
            cc: [],
            history: [{ at: s.now, by: 'teja', action: `Started from ${voucherId}` }],
          });
          created = id;
          applyTarget(s.nav, { tab: 'tasks', screen: 'T6', id });
        });
        return created;
      },

      // ---------- my rules ----------
      setMyRule: (draft) => {
        let id: string | null = null;
        set((s) => {
          const type = ruleType(draft.kind);
          const { level, why } = type.check(draft, s.rules);
          const vendorName = draft.vendorId ? s.vendors.find((v) => v.id === draft.vendorId)?.name : undefined;
          const summary = ruleSummary({ kind: draft.kind, value: draft.value, vendorId: draft.vendorId }, vendorName);
          if (level === 'never') {
            writeLog(s, { entity: 'My rules', action: `Rule refused: ${summary}`, actor: 'teja', outcome: 'Refused', detail: why, task: 'Rules' });
            pushToast(s, 'critical', 'Rule not allowed', why);
            return;
          }
          id = nextId(s, 'MR');
          s.myRules.unshift({
            id,
            kind: draft.kind,
            value: draft.value,
            vendorId: draft.vendorId,
            task: draft.task,
            until: addDays(dateOf(s.now), draft.days),
            reason: draft.reason,
            status: level === 'self' ? 'Active' : 'PendingAM',
            setAt: s.now,
          });
          if (level === 'self') {
            writeLog(s, { entity: `My rules / ${id}`, action: `Rule set: ${summary}`, actor: 'teja', detail: draft.reason, task: 'Rules' });
            pushToast(s, 'success', 'Rule set', summary);
            fireReminders(s);
          } else {
            writeLog(s, { entity: `My rules / ${id}`, action: `Rule sent to the Accounts Manager: ${summary}`, actor: 'teja', detail: draft.reason, task: 'Rules', to: ['rajan'] });
            pushToast(s, 'info', 'Sent to Rajan (Accounts Manager)', `${summary}: ${why}`);
          }
        });
        return id;
      },
      turnMyRuleOff: (ruleId) =>
        set((s) => {
          const r = s.myRules.find((x) => x.id === ruleId);
          if (!r) return;
          r.paused = true;
          writeLog(s, { entity: `My rules / ${r.id}`, action: 'Rule turned off', actor: 'teja', task: 'Rules' });
        }),
      turnMyRuleOn: (ruleId) =>
        set((s) => {
          const r = s.myRules.find((x) => x.id === ruleId);
          if (!r) return;
          r.paused = false;
          writeLog(s, { entity: `My rules / ${r.id}`, action: 'Rule turned on', actor: 'teja', task: 'Rules' });
        }),
      endMyRule: (ruleId) =>
        set((s) => {
          const r = s.myRules.find((x) => x.id === ruleId);
          if (!r) return;
          r.status = 'Ended';
          writeLog(s, { entity: `My rules / ${r.id}`, action: 'Rule ended', actor: 'teja', task: 'Rules' });
        }),
      removeMyRule: (ruleId) =>
        set((s) => {
          const r = s.myRules.find((x) => x.id === ruleId);
          if (r) r.removed = true;
        }),
      tryNotAllowedRule: (id) =>
        set((s) => {
          const n = NOT_ALLOWED.find((x) => x.id === id);
          if (!n) return;
          writeLog(s, { entity: 'My rules', action: `Rule refused: ${n.title}`, actor: 'teja', outcome: 'Refused', detail: n.why, task: 'Rules' });
          pushToast(s, 'critical', 'Refused and logged', n.why);
        }),
      recordSuggestion: (id, outcome, basis) => set((s) => void s.suggestionLog.unshift({ id, outcome, at: s.now, basis })),

      // ---------- other roles (mocked) ----------
      sim: {
        arrive: (templateId, at) =>
          set((s) => {
            advance(s, at);
            const w = createItem(s, templateId);
            if (!w) return;
            const a = ARRIVAL[w.kind];
            writeLog(s, { entity: w.id, action: `Arrived: ${w.title}`, actor: w.from, task: w.task, itemId: w.id, to: ['teja'] });
            if (a) notify(s, a.tone, a.title(w as WorkItem), a.body(w as WorkItem), taskLink(w));
          }),
        checkerDecides: (itemId, approve, note) =>
          set((s) => {
            const w = itemOf(s, itemId);
            if (!w || w.status !== 'Sent') return;
            const by = w.chain[w.step];
            if (!approve) {
              w.status = 'Returned';
              w.checkerNote = note || 'Returned for correction';
              w.history.push({ at: s.now, by, action: 'Returned', note: w.checkerNote });
              writeLog(s, { entity: w.id, action: `Returned by ${ACTORS[by].role}`, actor: by, task: w.task, itemId: w.id, to: ['teja'], detail: w.checkerNote });
              notify(s, 'critical', `${ACTORS[by].name} returned ${w.id}`, `${w.title}: "${w.checkerNote}"`, taskLink(w));
              return;
            }
            w.history.push({ at: s.now, by, action: 'Approved', note });
            w.step += 1;
            if (w.step < w.chain.length) {
              const next = w.chain[w.step];
              writeLog(s, { entity: w.id, action: `Agreed by ${ACTORS[by].role} → ${ACTORS[next].role}`, actor: by, task: w.task, itemId: w.id, to: [next], cc: ['teja'], detail: note });
              notify(s, 'info', `${ACTORS[by].name} agreed: ${w.id}`, `${w.title}. Now with ${who(next)}.`, taskLink(w));
              return;
            }
            w.status = 'Approved';
            w.closedAt = s.now;
            applyApproval(s, w);
            writeLog(s, { entity: w.id, action: `Approved by ${ACTORS[by].role}`, actor: by, task: w.task, itemId: w.id, to: ['teja'], detail: note });
            notify(s, 'success', `${w.id} approved`, `${w.title}: approved by ${who(by)}.`, taskLink(w));
          }),
        decideVariance: (itemId, decision) =>
          set((s) => {
            const w = itemOf(s, itemId);
            const v = w && (w.data as { variance?: Variance }).variance;
            if (!w || !v || v.approvedBy) return;
            v.approvedBy = 'rajan';
            v.approvedAt = s.now;
            v.decision = decision;
            w.waitingOn = undefined;
            w.waitingFor = undefined;
            w.history.push({ at: s.now, by: 'rajan', action: 'Variance approved', note: decision });
            writeLog(s, { entity: w.id, action: `Variance approved (raised by ${ACTORS[v.raisedBy].role})`, actor: 'rajan', task: w.task, itemId: w.id, to: ['teja'], cc: [v.raisedBy], detail: decision ?? v.reason });
            notify(s, 'warning', `Variance approved: post ${w.id}`, `${w.title}: Rajan approved the variance ${ACTORS[v.raisedBy].name} raised${decision ? ` (${decision})` : ''}. Post it now.`, taskLink(w));
          }),
        decideRule: (ruleId, approve) =>
          set((s) => {
            const r = s.myRules.find((x) => x.id === ruleId);
            if (!r || r.status !== 'PendingAM') return;
            r.status = approve ? 'Active' : 'RejectedByAM';
            r.decidedBy = 'rajan';
            const vendorName = r.vendorId ? s.vendors.find((v) => v.id === r.vendorId)?.name : undefined;
            writeLog(s, { entity: `My rules / ${r.id}`, action: `Rule ${approve ? 'approved' : 'rejected'}: ${ruleSummary(r, vendorName)}`, actor: 'rajan', task: 'Rules', to: ['teja'] });
            notify(s, approve ? 'success' : 'critical', `Rajan ${approve ? 'approved' : 'rejected'} your rule ${r.id}`, ruleSummary(r, vendorName), { tab: 'rules', id: r.id });
          }),
        sunilReleasesHold: (at) =>
          set((s) => {
            advance(s, at);
            writeLog(s, { entity: 'PV-0403', action: "Hold on Vendor B's invoice released (debit note DN-0403 exists)", actor: 'sunil', task: 'T4', itemId: 'DN-0403', to: ['teja'], detail: '₹20,160 in dispute settled by the debit note' });
            notify(s, 'info', "Sunil released the hold on Vendor B's invoice", 'The debit note DN-0403 exists, so the ₹20,160 in dispute is settled.', { tab: 'tasks', screen: 'T4', id: 'DN-0403' });
          }),
        cancelSo6: (at) =>
          set((s) => {
            advance(s, at);
            const w = itemOf(s, 'ADV-0311');
            if (w) (w.data as { refunded?: boolean }).refunded = true;
            writeLog(s, { entity: 'ADV-0311', action: 'SO-6 cancelled before supply; refund voucher issued', actor: 'pooja', task: 'T13', itemId: 'ADV-0311', to: ['teja'], detail: 'GST Refund Voucher for the ₹59,000 advance (B4-10)' });
            notify(s, 'info', 'SO-6 cancelled: advance refunded', 'Pooja (Billing Executive) issued the GST Refund Voucher for the ₹59,000 advance.', { tab: 'tasks', screen: 'T13', id: 'ADV-0311' });
          }),
        monthEnd: (at) =>
          set((s) => {
            advance(s, at);
            monthEndTemplates(s as AppState).forEach((t) => {
              if (s.work.some((w) => w.id === t.id)) return;
              s.work.unshift({ ...structuredClone(t), arrivedAt: s.now, status: 'Open', chain: [], step: 0, cc: [], history: [{ at: s.now, by: 'calendar', action: 'Month end' }] });
              writeLog(s, { entity: t.id, action: `Month end: ${t.title}`, actor: 'calendar', task: t.task, itemId: t.id, to: ['teja'] });
            });
            notify(s, 'warning', 'Month end: October close', `Ready to run: GRN-not-invoiced provision (T19), stock reconciliation (T9), standard cost variances (T20), bank stock statement (T21), provision run (T15), FX revaluation (T23) and the AR/AP reconciliation (T18)${s.rules.inventoryMethod === 'Periodic' ? ', and the periodic close (T11)' : ''}.`, { tab: 'tasks', screen: 'T9', id: 'REC-STK-OCT' });
          }),
        attempt: (actor, entity, action, detail) =>
          set((s) => {
            writeLog(s, { entity, action, actor, outcome: 'Refused', detail });
            pushToast(s, 'critical', `Refused: ${who(actor)}`, detail);
          }),
        markPlayed: (eventId) => set((s) => void (!s.played.includes(eventId) && s.played.push(eventId))),
        advanceTo: (at) => set((s) => advance(s, at)),
        setRules: (rules) => set((s) => void Object.assign(s.rules, rules)),
        reset: () =>
          set((s) => {
            Object.assign(s, seedData());
            s.nav = initialNav;
            s.toasts = [];
            pushToast(s, 'info', 'Scenario reset', 'Back to Mon 05-Oct-2026, 09:00.');
          }),
      },
    };
    }),
    {
      name: 'aikyat-accounts-executive-mock-v2',
      storage: createJSONStorage(() => (typeof localStorage !== 'undefined' ? localStorage : memoryStorage)),
      partialize: (s): Data & { nav: NavState } => ({
        now: s.now,
        rules: s.rules,
        vendors: s.vendors,
        customers: s.customers,
        items: s.items,
        work: s.work,
        log: s.log,
        notifications: s.notifications,
        myRules: s.myRules,
        suggestionLog: s.suggestionLog,
        played: s.played,
        seen: s.seen,
        seq: s.seq,
        nav: s.nav,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return { ...current, ...p, rules: { ...current.rules, ...(p.rules ?? {}) } };
      },
    },
  ),
);

export const VENDOR_H_ID = VENDOR_H.id;
export type { TaskId };
