# Position App UI Shell Spec (L0)

Rules every role-wise (position) app MUST follow. Audience: agents and devs building/generating any position app. Role changes the *content*; the shell never changes.

**Primary target:** mobile (375×812). Desktop: see §8 (not finalized).
**Reference implementation:** `clients/bread-factory/apps/senior-mixer` (manifest: `clients/bread-factory/studio/positions/pos-senior-mixer-001/manifest.json`).
**Sources:** `docs/foundry-dashboard-strategy.md`, `studio/docs/ux-agent/operator-dashboard-widget-system.md`, `studio/docs/operator-navigation-refactor.md`, `docs/foundry-mvp-assembly-model.md`, `docs/foundry-form-factor-strategy.md`.

---

## 1. Shell (fixed for every role)

```
┌──────────────────────────────┐
│ TopBar  Position Title   (👤) │  56px  · title 18px left · avatar 36px right → profile sidebar
├──────────────────────────────┤
│                              │
│      Active tab content      │  scrolls; shell does not
│                              │
├──────────────────────────────┤
│  Dashboard │ Actions │ Reports│  64px  · BottomNav · icon + label
└──────────────────────────────┘
```

- Exactly **3 tabs**, this order, these names: **Dashboard · Actions · Reports**. No 4th tab, no hamburger menu.
- Icons (lucide): `layout-dashboard`, `zap`, `file-text`.
- Tab switch keeps state (scroll, filters, half-filled form). No reload.
- Max nav depth from a tab: 2 (tab → list → detail). Deeper = redesign.
- Login (`/login`) and Profile (`/profile`) come from app bootstrap, not the manifest. Same in every app.

**Chrome modes** (`screen.chromeMode`)

| Mode | TopBar | BottomNav | Use |
|---|---|---|---|
| `default` | ✓ | ✓ | 3 tab root screens |
| `minimal` | back + title | ✓ | Child screens (list, detail, form) |
| `none` | ✗ | ✗ | Full-screen task (camera, scanner), login |

---

## 2. Tab 1 — Dashboard ("−1 screen")

Mental model: iPhone Today view. **Glance, don't work.** Answers "is everything OK, and what needs me?" in < 3 seconds.

**Grid**
- 4 columns · gap 16px · side padding 16px · full width on mobile.
- On 375px: 1 column ≈ 74px → small widget ≈ 164×164px.

**Widget sizes (only these)**

| Size | Grid | Width | Shape | Use |
|---|---|---|---|---|
| `small` | 2×2 | 50% | square | One KPI, status, quad-metric (4 read-only values), action button |
| `medium` | 4×2 | 100% | 2:1 | Progress, mini chart, short list (≤5), alert queue |
| `wide` | 4×1 | 100% | 4:1 bar | Alert/notification only, top of screen |
| `large` | 4×4 | 100% | square | Reserved. Low-cognitive-load roles only, max 2. Not in library yet |

Rejected forever: 1×1, 2×4 (tall), stretched/custom sizes.

**Layout zones (top → bottom)**
1. **Alerts** — `wide` bars, max 3 visible, then "More (N)". Order critical > warning > info, newest first. Dismissible. Push content down, never overlay.
2. **Primary** — the role's 2–4 most important KPIs (`small`).
3. **Secondary** — progress/targets (`medium`).
4. **Analytical** — only for low-load roles.

**Rules**
- Widget count: high load (shop floor) 6–8 · medium 8–10 · low 10–12. Scroll ≤ 1.5 screens for shop-floor roles.
- Ordering: alert > progress > status > metric > list > chart.
- Must include ≥1 of {alert, progress} and ≥1 of {status, metric}.
- Action widgets: max 2, `small` only, high contrast, confirm if destructive.
- **Tap widget → modal** with detail fields + optional secondary action (e.g., "Check Water Temp"). Never navigates away directly.
- Values must be live (entity data), each with a label and status color (`normal | warning | critical | success`).
- No forms, no tables, no long text on Dashboard.

Reference: Senior Mixer → Today's Progress (small), Active Mixers (small), Monthly Target progress (medium).

---

## 3. Tab 2 — Actions (Worklist)

**Do the work.** One card per workflow the role performs (from position interview worklist).

```
┌──────────┬──────────┐
│  🌡  (2) │  📦      │   2-column card grid
│ Check    │ Collect  │   card = icon + color + short verb title + badge
│ Water    │ Materials│
├──────────┼──────────┤
│  📋      │  📷      │
│ Prod.    │ Clean    │
│ Plan     │ Equip.   │
└──────────┴──────────┘
```

**Card**
- `icon` (lucide), `iconColor`, `title` = verb phrase, 2–3 words ("Check Water Temp", not "Water Temperature Management").
- `badge.count` = pending/overdue instances. No badge = nothing pending.
- Min touch target 48px; whole card tappable (gloves, wet/floury hands).
- Order: urgent/pending first, then frequency (most-done first). Same order every day (muscle memory).
- Optional: filter chips (All + categories) and search only when > 8 cards.

**Card → screen (by workflow intent)**

| Workflow intent | Screen / flow | Example |
|---|---|---|
| Record a value / submit | `DataForm` (`capture`) | Check Water Temp |
| Work through a queue | `DataList` (`queue`) → `DataDetail` | Production Plan → Batch |
| Inspect a record | `DataDetail` (`inspect`) | Batch Detail |
| Photo/scan proof | Flow `CameraCapture` (chromeMode `none`) → review → auto-submit | Clean Equipment Check |
| Ordered steps | `Checklist` (planned) | Mix Dough |
| Approve/reject | `ApprovalQueue` (planned) | Supervisor approvals |

**Rules**
- Every card MUST open a screen or flow. Workflow not digitized → no card (don't show dead cards).
- Each workflow screen follows that workflow's steps, in order; no extra fields beyond the workflow.
- One primary action per screen, bottom, full width (`Submit`).
- On complete: success toast → return to Actions (`terminal.returnTo: actions`), badge decrements.
- Child screens use chromeMode `minimal` (back visible, BottomNav stays).

---

## 4. Tab 3 — Reports

**Look back.** Read-only history and summaries of the role's own work. *Not yet built in reference (empty screen); rules below are the standard to build to.*

**Content (pick what the role needs)**

| Report type | Content | Example |
|---|---|---|
| Activity log | My completed submissions, newest first | Water temp checks this shift |
| Shift/period summary | Totals vs target for the period | Batches mixed today vs plan |
| Exceptions | Alerts raised, breakdowns, out-of-range values + resolution | Breakdowns reported |
| Compliance record | Required checks done/missed with timestamps | Hourly temp check compliance |

**Rules**
- Entry = list of report cards (same card style as Actions, no badges) → report screen.
- Report screen = period selector (Shift · Today · Week) + summary at top + `DataList` below; row → `DataDetail`.
- Read-only. No data entry. Corrections go through an Actions workflow.
- Only role-scoped data (own shift/team), same as the role's permissions.
- Audit/review workflows from the interview go here, not in Actions.
- Export/share: desktop only (later).

---

## 5. Mapping Role → Tabs (how an agent fills the shell)

| Interview / manifest input | Goes to |
|---|---|
| KPIs, targets, monitored values, triggers, alerts | Dashboard widgets |
| Recurring tasks, transactions, captures (worklist) | Actions cards → workflow screens |
| Audit, review, history, compliance, reporting | Reports |

Per role, only **widgets, cards, reports** change. Shell, tabs, order, sizes, spacing, and interaction rules never change.

---

## 6. Visual & Interaction Basics

- Tokens: spacing 8/12/16px · TopBar 56px · BottomNav 64px · avatar 36px.
- Touch targets ≥ 48px; primary buttons full width; no hover-dependent UI on mobile.
- Status colors used consistently: normal (neutral), success (green), warning (amber), critical (red).
- Plain language, short labels, numbers large. Max 1 font weight shift per card.
- States required on every screen: loading (skeleton), empty (what to do next), error (retry), offline (banner; queue writes — Flutter shell syncs).
- Modals: dismiss by ✕, tap outside, swipe down.

---

## 7. Agent Checklist (before shipping a role app)

- [ ] 3 tabs, order Dashboard · Actions · Reports, BottomNav, TopBar title + avatar
- [ ] Dashboard: 4-col grid, only small/medium/wide, alerts top (≤3), within widget budget, tap → modal
- [ ] Actions: 2-col cards, verb titles, badges = pending, every card opens a screen/flow, returns to Actions
- [ ] Reports: read-only, period selector, role-scoped data
- [ ] Child screens `minimal`, full-screen capture `none`
- [ ] Touch ≥ 48px, loading/empty/error/offline states
- [ ] Nothing role-specific added to the shell

---

## 8. Desktop (not finalized)

Same 3 tabs, same widgets, same rules. Differences proposed:

| Aspect | Mobile | Desktop (proposed) |
|---|---|---|
| Nav | BottomNav | Left SideNav, 80px (icon + label) |
| Dashboard | Full width | Constrained panel ~550px, same 4-col grid (no stretching) |
| Actions grid | 2 columns | 3–4 columns |
| Reports | Lists | Wider tables, export |
| Input | Tap, swipe | Click, hover, keyboard, ESC closes modal |

Note: reference app currently constrains dashboard to 600/700/800px at 768/1024/1440 breakpoints — to be aligned once decided.

---

## 9. Open Decisions

| # | Question | Current |
|---|---|---|
| 1 | Default landing tab: Dashboard or Actions? | Reference app lands on **Dashboard**; Studio operator rule says Actions |
| 2 | Desktop layout (§8) | Proposal only |
| 3 | `large` 4×4 widget | Reserved, not in library |
| 4 | Reports content per role | Standard above; not built in reference |
| 5 | User customization of dashboard (add/remove/reorder) | Planned, not built |
