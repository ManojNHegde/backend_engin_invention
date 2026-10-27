# Accounts Executive — Designed UI per Task

**Purpose:** Show where each field of the task card lands in the app, for each task (T1–T23): Dashboard, Task, Reports, CnC or Rules.

**Status:** Working design — **Proposal**, not seen by a role holder · **Revised 26-Oct-2026** to doc 01's revision (the shared engine docs of Oct 1, 2026; see doc 01 §0)
**Role:** Accounts Executive (R01) · **Owner:** Vijay · **Scenario user:** Teja
**Builds on:** `01_accounts_executive_tasks_and_responsibilities.md` (the cards, types and "What you fill in")
**Same frame as:** `credit_controller_designed_ui.md` (Credit Controller)

---

## 1. The idea

- **The card comes first, the screen second.** Every card field has one home in the app.
- **A task is not one screen.** It starts on the Dashboard, is done in its Task, is recorded in Reports, talks to people in CnC, and is shaped by Rules.
- **New for this role:** the work is in **4 areas** (Purchase, Inventory, Sales, AR/AP). The areas are a **filter and a grouping**, not a sixth part of the app: Tasks, the worklist and Reports can be read by area.
- **One task screen for all 23 tasks.** Most tasks are Make or Record, so the same screen works for each: **the record** (what arrived and what the system worked out), **the form** (what you fill in), **the checks** (Stop · Reason · Warn), the **progress** with the checker, and the **conversation**.

### What changed in this revision

| Change (doc 01 §0) | Where it shows in the app |
|---|---|
| The **Procurement Officer raises the match variance** and the Accounts Manager approves it before posting | T1: the variance is **shown, not filled in**: "Variance raised by Ravi, approved by Rajan". The voucher sits in **Waiting on others** until then; **Stop** "Variance not yet approved" |
| **OCR capture by whoever keys it** | T1: "Captured by" on the record. OCR fields to confirm only when Teja keyed it |
| **Contracts & Services Officer matches service bills** | T2: above-milestone is the officer's variance (shown, waited for); Teja routes only "no confirmation" |
| **Provision and FX are two tasks** | T15 (provision → Rajan → Usha) and T23 (FX → Rajan) |
| **New tasks T19–T22** | GRN-not-invoiced provision, standard cost variances, bank stock statement, ITC reversal on written-off stock |
| Bank-detail change needs **call-back evidence** | T7: a new field, **Stop** without it |
| Payables finds **credit notes not booked** | T5: a second trigger from Sunil (Payables Executive) |
| "Parties and Contacts" → **Business Core** | Identity is "from Business Core" everywhere |

## 2. Where the card goes: the 5 app areas

| Our card / fields | → App area | Where on screen |
|---|---|---|
| **Trigger & cadence** | **Dashboard** | An item in the Action center (and the bell) that opens the task |
| **Held by** | **Dashboard** | My worklist: Needs me · Waiting on others · Coming up |
| **Exceptions** | **Dashboard** | Action center alerts · Month-end close tile · MSME dues watchlist |
| **Serves · Indicators** | **Dashboard** + **Reports** | KPI strip · the task's register |
| **Area · Type · Subject · Requires · Sees · Done when** + "What you fill in" · **Screen** | **Task** | The record, the form and its checks |
| **Writes** | **Reports** | The task's register · the Approval Log |
| **Hand-off** | **CnC** or **Reports** | **CnC** when the next person must act (checker, Billing, Payables) · **Reports** when they only need to read it |
| **Sends** | **CnC** | Sent for checking, flags, requests, and what comes back (approved, returned) |
| **Rules allowed** | **Rules** | What I can set · what needs the Accounts Manager · what I cannot set |
| **Parameters** | **Rules** | The company rule each check uses (read-only) |

### The 5 areas

| Area | What it is for | In the app |
|---|---|---|
| **Dashboard** | What needs me now, and is the month under control | KPI strip · Action center · Suggestions · My worklist by area · Month-end close · MSME dues |
| **Task** | Do one piece of work, start to finish | Tasks T1–T23, grouped by area; My queue |
| **Reports** | Look back; read-only | Purchase Register · Notes Register (debit, credit) · Master Changes (vendor, customer, item) · Advances · Month-end Close · Party Ledger (party-wise) · Approval Log |
| **CnC** | What my tasks sent, to whom, and what came back | Conversations by document or party · "Sent to" people |
| **Rules** | Standing rules for my own work | My rules · What I can set · What I cannot set |

### Words used inside the Task area

| Pattern | Layout | Used by |
|---|---|---|
| **Form filled from what was expected** (Record) | The record on the left of the form; only what is left is typed | T1, T2, T5, T13, T17, T22 |
| **Form on the item** (Make) | The item's record, then a form you write | T3, T4, T6, T7, T8, T10, T12, T16 |
| **Run, then a worklist** (Run a batch) | Gate (is the set ready) → one press → each result decided | T9, T11, T14, T15, T18, T19, T20, T21, T23 |

- **A fact's source** is named when it is not a stored field: **formula** · **ready calculation** (the system works it out) · **from** another role (Procurement, Contracts & Services, Stores, Collections, Billing, Payables, Credit Controller, Accounts Manager).
- **Each check has one of 3 results:** **Stop** (can't send) · **Reason** (ask why, then continue) · **Warn** (show, then continue).
- **Every reason needs a named reader.** For this role the reader is almost always the **Accounts Manager**.

---

## 3. Summary

| Task | Area | Dashboard | Task (pattern) | Reports | CnC | Rules |
|---|---|---|---|---|---|---|
| **T1** Purchase voucher | Purchase | Invoice arrived · variance approved | Form from PO + GRN + approved variance | Purchase Register | Variance from Ravi / Rajan ← · → Accounts Manager | Stricter OCR flag · TDS alert earlier |
| **T2** Service bill | Purchase | Matched bill arrived | Form from Works Order | Purchase Register | Variance from Contracts & Services ← · → Accounts Manager (no-confirmation exception) | Remind me |
| **T3** Landed cost | Purchase | Freight on an invoice | Form on the item | Purchase Register | → Accounts Manager | Default basis |
| **T4** Debit note | Purchase | Return sent out | Form from QC record | Notes Register | → Accounts Manager · Payables told | Remind me |
| **T5** Supplier credit note | Purchase | Credit note arrived · Payables: not booked | Form from the voucher | Notes Register | → Accounts Manager · Compliance Officer | — |
| **T6** Tax override | Purchase | From T1 | Form on the item | Approval Log | → Compliance Officer | ❌ Override myself |
| **T7** Vendor finance fields | Purchase | Vendor proposed | Form on the item | Master Changes | → Accounts Manager · Finance Controller (bank, with call-back) | ❌ Bank change alone |
| **T19** GRN-not-invoiced provision | Purchase | Month end | Run → worklist | Month-end Close | → Accounts Manager | Remind me |
| **T8** Item accounting | Inventory | Item requested | Form from the request | Master Changes | → Accounts Manager | Default per group |
| **T9** Stock recon breaks | Inventory | Month end | Run → worklist | Month-end Close | → Accounts Manager | Remind me |
| **T10** NRV provision | Inventory | Quarter end / expired batch | Form, many lines | Month-end Close | → Accounts Manager → Finance Controller | Remind me |
| **T11** Periodic close | Inventory | Month end (Periodic) | Run | Month-end Close | → Accounts Manager | — |
| **T20** Standard cost variances | Inventory | Month end | Run → worklist | Month-end Close | → Accounts Manager | Remind me |
| **T21** Bank stock statement | Inventory | Month end / bank's date | Run | Month-end Close | → Accounts Manager · Compliance Officer tracks | Remind me |
| **T22** ITC reversal, written-off stock | Inventory | Write-off approved | Form from the write-off | Notes Register | → Compliance Officer | ❌ Skip the reversal |
| **T12** Customer finance fields | Sales | Limit recommended | Form on the item | Master Changes | → Credit Controller → Accounts Manager | ❌ Limit not recommended |
| **T13** Advance against SO | Sales | Advance on account | Form from the receipt | Advances | → Billing Executive · Accounts Manager | — |
| **T14** 26AS/AIS | AR/AP | Statement available | Run → worklist | Month-end Close | → Accounts Manager · Compliance (escalated) · Finance Controller (write-off) | Remind me |
| **T15** Provision run | AR/AP | Month end | Run | Month-end Close | → Accounts Manager → Finance Controller | Remind me |
| **T23** FX revaluation run | AR/AP | Month end | Run | Month-end Close | → Accounts Manager | Remind me |
| **T16** Netting | AR/AP | Link suggested | Form on the item | Party Ledger | → Accounts Manager | — |
| **T17** Udyam data | AR/AP | MSME data missing | Form on the item | Master Changes | → Accounts Manager | MSME warn earlier |
| **T18** AR/AP recon | AR/AP | Month end | Run → worklist | Month-end Close | → Accounts Manager | Remind me |

---

## 4. Task by task

### Purchase

#### T1 — Post a purchase voucher

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** invoice or BOE arrives (keyed here, or captured and linked by Procurement / Stores) · **Held by:** Needs me · Waiting for variance · Accounts Manager · **Exceptions:** variance not approved, duplicate, OCR flag, no PO · **Indicators:** invoices not posted, vouchers waiting on a variance | **Dashboard** | Action center: "Invoice arrived" · "Variance approved: ready to post" · KPI "Waiting for you" · worklist row under Purchase |
| **Type:** Record · **Subject:** one voucher · **Sees:** captured by, OCR fields, PO/GRN/invoice, the variance and its approval, GST/TDS, due date · **Done when:** posted and sent | **Task** | **Form from PO + GRN + the approved variance.** Record: vendor, PO, GRN, invoice, **captured by** · match table (formula: quantity at invoice rate + rate on received quantity + other charges) with **"Variance raised by Ravi (Procurement Officer): reason · approved by Rajan"** (from Procurement / Accounts Manager) · GST/TDS (ready calculation) · due date (formula: credit days; MSME 45 days). Form: flagged OCR field, only if keyed here (**Stop** until confirmed) · variance not yet approved (**Stop**) · no-PO reason (**Reason**) · duplicate (**Stop**) · TDS threshold crossed (**Warn**) · narration |
| **Writes:** PurchaseVoucher.Post | **Reports** | Purchase Register · Approval Log · Party Ledger |
| **Hand-off:** Accounts Manager · **Sends:** "no PO" to Procurement | **CnC** | Comes in: the variance and its approval (Ravi → Rajan) · goes out: → Rajan (Accounts Manager) for the voucher · "no PO" → Ravi (Procurement Officer) · approved / returned comes back |
| **Rules allowed** · **Parameters:** match tolerance (Procurement's variance), OCR flag, TDS threshold | **Rules** | ✅ Flag OCR fields at a stricter level · ✅ Alert me at a % of the TDS threshold · ❌ Post before the variance is approved · ❌ Approve my own voucher |
| | **Not yet** | Import voucher fields (BOE, BCD) · GSTR-2B/IMS (the Accounts Manager's) |

#### T2 — Post a service bill against a Works Order

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** bill matched by the Contracts & Services Officer · **Exceptions:** no confirmation (mine), above milestone (theirs, waited for) | **Dashboard** | Action center: "Service bill matched" · Needs me / Waiting on others |
| **Type:** Record · **Sees:** WO, confirmed milestone, remaining value, the variance status, suggested ledger | **Task** | **Form from the Works Order.** Record: WO value, milestones, confirmed (from the department head), remaining (formula), **variance raised by the Contracts & Services Officer, approved by Rajan** (from). Form: expense ledger (suggested) · outcome Post / Route as exception · variance not yet approved → **Stop** · no confirmation → **Stop** for Post, **Reason** to route |
| **Writes:** ServiceBill.Post / RouteException | **Reports** | Purchase Register |
| **Hand-off:** Accounts Manager | **CnC** | No-confirmation exception → Rajan (**reader:** Accounts Manager) · posted bill → Rajan |
| **Rules allowed** | **Rules** | ✅ Remind me when a confirmation is pending · ❌ Post with no confirmation |
| | **Not yet** | Retention on the bill (Payables' work) · the Accounts Manager's value threshold |

#### T3 — Allocate landed cost

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** freight/duty charge | **Dashboard** | Action center: "Freight to allocate" |
| **Type:** Make · **Sees:** vouchers, basis, per-unit result | **Task** | **Form on the item.** Record: the charge, the voucher(s) suggested. Form: basis (value · weight · quantity) · result per kg (formula) · no voucher → **Stop** |
| **Writes:** LandedCost.Allocate | **Reports** | Purchase Register (landed cost column) |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |
| **Rules allowed** | **Rules** | ✅ Default basis |
| | **Not yet** | Several vouchers for one freight bill |

#### T4 — Raise a debit note

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** return sent out by Stores after QC rejection · **Indicators:** returns without a debit note | **Dashboard** | Action center: "Return sent: debit note due" |
| **Type:** Make · **Sees:** return document, original voucher, Payables hold | **Task** | **Form from the return document.** Record: vendor, voucher, rejected quantity, rate, GST (ready calculation). Form: type (return · price · quantity) · quantity (pre-filled; more than rejected → **Stop**) · narration |
| **Writes:** DebitNote.Raise | **Reports** | Notes Register · Party Ledger |
| **Hand-off:** Accounts Manager · **Sends:** Payables told | **CnC** | → Rajan · told: Sunil (Payables Executive), whose hold can be released |
| **Rules allowed** | **Rules** | ✅ Remind me |
| | **Not yet** | Price and quantity notes from a match variance (only returns in the scenario) |

#### T5 — Book a supplier credit note

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** credit note arrives · Payables finds one not booked | **Dashboard** | Action center: "Supplier credit note arrived" · "Sunil: credit note not booked" |
| **Type:** Record · **Sees:** voucher, debit notes for the same return, IMS line | **Task** | **Form from the voucher.** Record: the note (OCR), the voucher, the debit note already raised. Form: how to book — against the debit note (no second reduction) · extra reduction (**Reason**) · overlap unanswered → **Stop** · ITC reversal (**Warn**: goes to the Compliance Officer) |
| **Writes:** SupplierCreditNote.Book | **Reports** | Notes Register |
| **Hand-off:** Accounts Manager · Compliance Officer | **CnC** | → Rajan · ITC reversal → Venkat (Compliance Officer) |
| | **Not yet** | IMS match (actioned by the Accounts Manager) |

#### T6 — Request a tax or TDS override

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** derived tax wrong for this voucher | **Dashboard** | Opened from T1 (the voucher's tax line); Waiting on others once sent |
| **Type:** Ask · **Sees:** what the engine derived and why | **Task** | **Form on the item.** Record: derived tax and its rule. Form: tax asked for · reason (**Stop** if empty) |
| **Writes:** TaxOverride.Request | **Reports** | Approval Log (logged whatever the outcome) |
| **Hand-off:** Compliance Officer | **CnC** | → Venkat (Compliance Officer) (**reader**); granted / refused comes back |
| **Rules allowed** | **Rules** | ❌ Override the tax myself |

#### T7 — Complete and maintain vendor finance fields

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** vendor proposed or change | **Dashboard** | Action center: "New vendor: finance fields" |
| **Type:** Make · **Sees:** identity (from Business Core), penny-drop, duplicate bank check, MSME | **Task** | **Form on the item.** Record: identity (read-only). Form: credit days (usual terms pre-filled) · ledger · bank account, IFSC · call-back evidence (who, when; missing on a bank change → **Stop**) · penny-drop fails or account used by another vendor → **Stop** · MSME → **Warn** (45-day rule) |
| **Writes:** VendorFinance.Save | **Reports** | Master Changes · Approval Log |
| **Hand-off:** Accounts Manager; Finance Controller for bank | **CnC** | → Rajan · bank details → Usha (Finance Controller) |
| **Rules allowed** | **Rules** | ❌ Bank change without the Finance Controller · ❌ Edit a vendor and approve its voucher |

#### T19 — Book the GRN-not-invoiced provision

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end · **Indicators:** open GRNs without provision | **Dashboard** | Month-end close tile · Coming up before month end |
| **Type:** Run → Decide each · **Sees:** each GRN with no invoice, PO value, age | **Task** | **Run, then a worklist.** Each GRN: amount at PO value (formula) · provide / explain (**Reason**) · undecided → **Stop** |
| **Writes:** GrniProvision.Book | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager (owns the cut-off) | **CnC** | → Rajan |
| **Rules allowed** | **Rules** | ✅ Remind me before month end |

### Inventory

#### T8 — Create or edit an item's accounting fields

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** New Item Request | **Dashboard** | Action center: "New item requested" |
| **Type:** Make · **Sees:** request (from Stores), closest items, suggested HSN/GST, group defaults | **Task** | **Form from the request.** Record: request, closest existing item, costing method (from the item group: the Accounts Manager's policy, read-only). Form: code (suggested) · HSN · GST rate (suggested; HSN–rate mismatch → **Reason**) · ledgers · group |
| **Writes:** Item.Create | **Reports** | Master Changes |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan · the requester sees the code once approved |
| **Rules allowed** | **Rules** | ✅ Defaults for an item group · ❌ Change the costing method |

#### T9 — Resolve stock reconciliation breaks

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end · **Indicators:** breaks open at close | **Dashboard** | Month-end close tile · Coming up before month end |
| **Type:** Run → Decide each · **Sees:** each break, likely cause | **Task** | **Run, then a worklist.** Each break: cause (ready calculation) · action fix / carry (**Reason**) · undecided → **Stop** |
| **Writes:** StockRecon.Resolve | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |
| **Rules allowed** | **Rules** | ✅ Remind me before month end |

#### T10 — Draft the slow-moving, expired and NRV provision

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** quarter end · expired batch | **Dashboard** | Coming up: quarter end · Action center when a batch expires in stock |
| **Type:** Make · **Sees:** suggested provision per line | **Task** | **Form, many lines.** Each line: suggested % (ready calculation) · changed % → **Reason** |
| **Writes:** NrvProvision.Draft | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager → Finance Controller | **CnC** | → Rajan (review) → Usha (approve) |

#### T11 — Post the periodic close entries

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end, Periodic mode | **Dashboard** | Month-end close tile (Periodic only) |
| **Type:** Run · **Sees:** closing value, COGS, variance | **Task** | **Run.** Gate: count done? Then closing value and COGS (formula), post |
| **Writes:** PeriodicClose.Post | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |
| | **Not yet** | Only shown when the company switch is Periodic |

#### T20 — Review standard cost variances

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end, items at standard | **Dashboard** | Month-end close tile |
| **Type:** Run → Decide each · **Sees:** price and usage variances by item and vendor | **Task** | **Run, then a worklist.** Each line above the level: variance (formula: actual − standard) · explanation (**Reason**) · unexplained → **Stop** |
| **Writes:** StdCostVariance.Review | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |
| | **Not yet** | Empty when no item is at standard cost |

#### T21 — Prepare the bank stock statement

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end, bank's submission day | **Dashboard** | Month-end close tile · Coming up: "Stock statement due to the bank on …" |
| **Type:** Run · **Sees:** statement from the book valuation, differences from last statement and from the books | **Task** | **Run.** Gate: valuation done? Then the statement (ready calculation) · difference from the books → **Reason** |
| **Writes:** StockStatement.Prepare | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager (confirms) · Compliance Officer (tracks submission) | **CnC** | → Rajan · told: Venkat |
| **Rules allowed** | **Rules** | ✅ Remind me before the bank's day |

#### T22 — Book the ITC reversal on written-off stock

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** write-off approved (from Stores / Inventory Controller) | **Dashboard** | Action center: "Write-off approved: ITC to reverse" |
| **Type:** Record · **Sees:** the write-off, ITC taken (computed) | **Task** | **Form from the write-off.** ITC to reverse (ready calculation) · no ITC taken → **Warn** · note |
| **Writes:** ItcReversal.WrittenOffStock | **Reports** | Notes Register |
| **Hand-off:** Compliance Officer | **CnC** | → Venkat (Compliance Officer) (**reader**) |
| **Rules allowed** | **Rules** | ❌ Skip the reversal |

### Sales

#### T12 — Maintain customer finance fields

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** Credit Controller recommends a limit · new customer · change | **Dashboard** | Action center: "Limit recommended by the Credit Controller" |
| **Type:** Make · **Sees:** current fields, the recommendation and reason | **Task** | **Form on the item.** Record: identity (read-only), current fields, recommendation. Form: field · new value (pre-filled from the recommendation; same as now → **Stop**; differs from the recommendation → **Reason**) · note |
| **Writes:** CustomerFinance.Save / CreditLimit.Edit | **Reports** | Master Changes |
| **Hand-off:** Credit Controller (limit), then Accounts Manager | **CnC** | Limit edit → Farid (Credit Controller) checks → Rajan confirms · objection comes back |
| **Rules allowed** | **Rules** | ❌ Change a limit nobody recommended |

#### T13 — Record an advance against a sales order

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** advance recorded on account by Collections | **Dashboard** | Action center: "Advance received" |
| **Type:** Record · **Sees:** receipt, SO, GST on advance | **Task** | **Form from the receipt.** Form: SO (suggested) · GST on advance (suggested yes for services; "no" for a service → **Reason**) |
| **Writes:** Advance.Link / FlagGst | **Reports** | Advances |
| **Hand-off:** Billing Executive · Accounts Manager | **CnC** | Flag → Pooja (Billing Executive) for the receipt voucher · → Rajan |

### AR/AP

#### T14 — Match 26AS/AIS

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** statement available | **Dashboard** | Action center: "26AS for Q2 available" |
| **Type:** Run → Decide each | **Task** | **Run, then a worklist.** Auto-match (ready calculation) · each unmatched line: ask the customer / escalate / write off (**Reason**) |
| **Writes:** Tds26as.Match / TdsCredit.WriteOff | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager · Compliance Officer (escalated) · Finance Controller (write-off) | **CnC** | → Rajan · escalation → Venkat · write-off → Usha |

#### T15 — Draft the AR/AP provision run

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end | **Dashboard** | Month-end close tile |
| **Type:** Run | **Task** | **Run.** Provision lines (matrix and specific items, ready calculation) · change from last month |
| **Writes:** ProvisionRun.Draft | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager → Finance Controller | **CnC** | → Rajan (specific provisions) → Usha |

#### T23 — Draft the FX revaluation run

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end, foreign-currency open items | **Dashboard** | Month-end close tile |
| **Type:** Run | **Task** | **Run.** Each open foreign item × (month-end rate − booked rate) (formula) · change from last month |
| **Writes:** FxRevaluation.Draft | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |

#### T16 — Prepare a netting document

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** link suggested / linked parties | **Dashboard** | Action center: "Possible link: same PAN" |
| **Type:** Make · **Sees:** both balances, net, the payment-recognition rule (from the Compliance Officer) | **Task** | **Form on the item.** Net (formula) · amount to set off (more than the smaller balance → **Stop**) · parties not linked in Business Core → **Stop**, with "Suggest link" |
| **Writes:** Netting.Prepare | **Reports** | Party Ledger |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |

#### T17 — Maintain a vendor's Udyam data

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** number given or missing | **Dashboard** | MSME dues tile · Action center |
| **Type:** Record | **Task** | **Form on the item.** Udyam number (format check → **Stop**) · category |
| **Writes:** Udyam.Save | **Reports** | Master Changes |
| **Hand-off:** Accounts Manager · feeds the Compliance Officer's MSME register | **CnC** | → Rajan |
| **Rules allowed** | **Rules** | ✅ Warn me N days before an MSME due date |

#### T18 — Run the AR/AP reconciliation

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** month end | **Dashboard** | Month-end close tile |
| **Type:** Run → Decide each | **Task** | **Run, then a worklist.** Control vs open items (formula) · each break: cause · fix / carry (**Reason**) |
| **Writes:** ArApRecon.Run | **Reports** | Month-end Close |
| **Hand-off:** Accounts Manager | **CnC** | → Rajan |

---

## 5. What is not there (whole role)

1. **The approval is a stub.** Rajan (Accounts Manager), Usha, Venkat, Farid answer from the Scenario panel; Ravi and the Contracts & Services Officer raise the match variances there. The real mechanism is to be designed with the Accounts Manager owner (Manoj).
2. **Messages are logged, not sent.** CnC reads them from the Approval Log.
3. **Ready calculations are mocked:** OCR confidence, policy-engine tax, reconciliation breaks, 26AS match, provision matrix.
4. **Illustrative data** for tasks with no scenario step (T5, T6, T9–T11, T14–T23).
5. **No role holder has seen these screens.**

## 6. Points for review

| # | Point | Our position |
|---|---|---|
| 1 | One task screen for 23 tasks? | **Yes.** Record + form + checks + progress + conversation fits every Make, Record and Ask; the Run tasks add a gate and a list. |
| 2 | Areas: a sixth part of the app? | **No.** A filter and a grouping on Tasks, Dashboard and Reports. |
| 3 | Who reads the reasons? | The Accounts Manager, almost always. A reason with no reader is a gap. |
| 4 | Should the app send the "for checking" itself? | **Yes:** the checker's queue is the other side of this role's "Sent" list. |
| 5 | A voucher waiting for someone else's variance: Needs me or Waiting on others? | **Waiting on others** (Procurement Officer, then Accounts Manager), and back to **Needs me** when approved. |

## 7. Source boundary

- Card fields and types: `01_accounts_executive_tasks_and_responsibilities.md` (**Proposal**).
- The 5 areas, the 3 check results and "every reason has a reader": the Credit Controller designed UI and the team's Task-UX model.
- The app built from this document: `docs/accounts_executive/app`.
