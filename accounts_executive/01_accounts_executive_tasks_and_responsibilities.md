# Accounts Executive — Tasks and Responsibilities

**Purpose:** Find the Accounts Executive's tasks in the 4 areas assigned (§11.1–11.4), group them into responsibilities, and give each task a full card, ready for the interview with the role holder.

**Status:** Working analysis — **Proposal**, not checked with a role holder · **Revised 26-Oct-2026** against the shared engine docs (see §0)
**Role:** Accounts Executive (R01) · **Owner:** Vijay · **Scenario user:** Teja
**Scope:** Purchase (§11.1) · Inventory (§11.2) · Sales (§11.3) · AR/AP (§11.4). Bank, Tax, Fixed Assets, Period close and FEMA (§11.5–11.9) are out of scope.
**Sources:**
- `docs/shared_docs/engine_shared/Aikyat - Role-wise Work List  Intelligence revised Oct 1_ 2026.md`: §11.1–11.4 (this role), and **every other role's section that names this role** (§1, §2, §4, §10, §12, §13, §14, §21, §22)
- `docs/shared_docs/engine_shared/Aikyat - Operations Role Register revised Oct 1_ 2026.md` (role matrix, "What changed and points still open")
- `docs/reference-company/full-scenario.md` (steps naming Teja, the Accounts Executive stub, and the steps whose work hands over to her)
- `roles/README.md` (the shared role format and the task questions)

**Method:** Same as the Credit Controller analysis: list the work, combine or split with the thumb rule (Trigger · Owner · Purpose · Completion · Independence · Boundary), find the whys, group them into responsibilities. The work is read **one area at a time**. **New in this revision:** the work is also read **from the other side**: each neighbouring role's "Made by" and "Checked by" lists say what reaches this role, what leaves it, and what is not its work.

---

## 0. What changed in this revision (shared docs, Oct 1, 2026)

The text of §11.1–11.4 is the same as the version used before; the only wording change is **"Parties and Contacts" → "Business Core"**. What changes the analysis is reading the **other roles' sections** and the **role register**. They move work out of this role, add work to it, and settle three open questions.

| # | Change | Where it is said | Effect here |
|---|---|---|---|
| 1 | The **Procurement Officer raises the three-way-match variance** (PO/GRN/invoice) and the Accounts Manager approves it, **before posting**. In the scenario Ravi does A1-06 and corrects the OCR quantity in A1-08 | §1.1 Makes; §12.1 "reviews variances … before posting"; scenario A1-06, A1-08 | **T1 changes.** This role does not give the variance reason. Its voucher waits until the variance is approved, then it posts the accounting |
| 2 | **OCR capture is made by whoever keys the document** (Procurement Officer, Stores / Inventory Officer or this role) | §12.1 Approves / checks | T1 often starts from a draft someone else captured. OCR is not a step this role always does |
| 3 | The **Contracts & Services Procurement Officer matches the service invoice** to the Works Order and raises the variance. This role posts the bill and routes it as an exception **only when no confirmation exists** | §2.1; §11.1; scenario A2-04 | **T2 changes.** "Above the milestone" is not this role's exception to route |
| 4 | **Item Master: Stores requests → this role creates → Accounts Manager approves** | §12.2 Approves / checks | Settles old question 6 |
| 5 | **Provision run:** the Accounts Manager reviews specific provisions, then the Finance Controller approves. **FX revaluation:** the Accounts Manager checks it | §12.4, §22.4; register "FX revaluation" | Settles old question 7: **T15 is split** into T15 (provision) and **T23 (FX revaluation)** |
| 6 | Five "makes" that had no work item are **confirmed as this role's work** by the checker's lists: GRN-not-invoiced provision, standard cost variance review, bank stock statement, ITC reversal on written-off stock, unclaimable TDS write-off | §12.1, §12.2, §21.2, §21.5, §22.4 | **4 new tasks: T19–T22.** The TDS write-off stays a step of T14, with its own checker |
| 7 | The **Payables Executive's vendor statement reconciliation** finds "supplier credit note not yet booked" | §14.1 | A second trigger for T5 |
| 8 | The **Compliance Officer owns the MSME register and Udyam validity**. This role keeps the Udyam data on the vendor's AR/AP record | §21.4 | T17's data feeds the Compliance Officer's register |
| 9 | The **Compliance Officer owns the payment-recognition rule** for set-off and netting (checked by the Finance Controller) | §21.4 | T16 follows that rule; it does not set it |
| 10 | **Bank-detail changes are checked by the Finance Controller, with penny-drop / call-back evidence**; other vendor finance fields by the Accounts Manager | §11.1, §22.1 | T7 has two checkers by field and asks for the call-back evidence |
| 11 | **In a small company Billing may sit with this role**, with every invoice and note then checked by the Accounts Manager, never combined with Collections or Sales | §10 note; register "Selling, billing, collecting" | A **configuration**, not a task in this scope; listed in §9 |
| 12 | Thresholds still pending a management decision: tolerances, voucher and journal slabs, write-off level | Register "Open points" | Named as parameters, no values |

**Result:** 18 tasks → **23 tasks** (T1–T18 kept with the same IDs, T19–T23 added). T1, T2, T5, T7, T8, T14, T16 and T17 changed; T15 narrowed.

## 1. Why this document exists

- The Accounts Executive is a **new role** in the POC: no role file, no app, no notes yet.
- The reference gives **23 work items** and **32 "makes"** across 4 areas. Many are the same work said twice, and some are only steps. Other roles' lists add what arrives here and what leaves.
- This document turns them into **one task list**, one card per task, and the questions to ask.

## 2. The role at a glance

| | |
|---|---|
| **Purpose (Proposal)** | Put the purchase, stock, customer and AR/AP side of the books in correctly and on time, so that what the Accounts Manager approves is right the first time. |
| **Works in** | 4 areas: **Purchase**, **Inventory**, **Sales**, **AR/AP** |
| **Gets work from** | **Procurement Officer:** new vendors; invoices already captured and linked to the PO, with the match variance approved · **Contracts & Services Procurement Officer:** Works Orders, confirmations, service-bill variances · **Stores / Inventory Officer:** return documents (from the QC rejection), New Item Requests, approved write-offs · **Collections Officer:** receipts recorded on account (advances) · **Payables Executive:** vendor-statement differences, holds waiting for a debit note · **Credit Controller:** credit-limit recommendations · **Accounts Manager:** the month-end cut-off lists · vendors (invoices, credit notes) · the calendar (month end, quarter end) |
| **Hands work to** | **Accounts Manager** (checks almost everything) · **Finance Controller** (bank details, provision run, NRV provision, netting above threshold, TDS write-off, tax override above threshold) · **Compliance Officer** (tax override, ITC reversals, MSME register, escalated 26AS mismatches) · **Billing Executive** (GST-on-advance flag; billing instructions it must apply) · **Credit Controller** (credit-limit edits to check) |
| **Never** | Approves its own work · edits party identity (Business Core) · raises the three-way-match variance (Procurement Officer) · actions IMS lines or prepares RCM self-invoices (Accounts Manager) · issues sales invoices or notes (Billing Executive, unless the company combines them, §9) · sets credit limits alone · sets the netting rule (Compliance Officer) |

**How a responsibility was identified here:** a responsibility is the result a group of tasks is for — something this role must keep right and would answer for if neglected — found last, by grouping the tasks' whys (`roles/README.md`).

## 3. The 4 areas: what is a task, what is a step

Every work item and "make" of §11.1–11.4, read against the thumb rule and against the neighbours' lists. **Task** = worth calling done on its own. **Step** = part of a task. **Not a task** = one-time, information, or someone else's work.

### 3.1 Purchase (§11.1)

| Reference work item / make | Result | Why |
|---|---|---|
| Enter Purchase Voucher (OCR or manual) · Purchase Voucher (domestic, accounting), incl. PO-optional | **T1** | One invoice, one voucher posted and sent for checking |
| Check for duplicate invoices · Validate vendor tax details · Book GST and TDS lines | Steps of T1 | Done for each voucher, never on their own |
| Bill-wise allocation and due date · make "Bill-wise allocation & credit days" | Step of T1 | Set while posting |
| OCR document capture | Step of T1, **when this role keys the document** | Made by whoever keys it (§12.1); often the Procurement Officer or Stores (change 2) |
| Three-way-match variance | **Not this role's** | Raised by the Procurement Officer, approved by the Accounts Manager before posting (change 1). T1 waits for it |
| Import Purchase Voucher (BOE, BCD, IGST) | Part of **T1** | Same start and end, different form. **Ask** |
| Post expense / service bills · make "Expense / service bill against a Works Order" | **T2** | Posted against a confirmed milestone; the match and its variance are the Contracts & Services Officer's (change 3) |
| Landed cost allocation | **T3** | Starts from a freight or duty bill |
| Raise Debit Notes (return, price, quantity) | **T4** | Starts from the return document or an approved rate variance |
| Book credit notes received from suppliers | **T5** | Starts when the vendor's note arrives, or when Payables finds one not booked |
| Request a tax/TDS override | **T6** | Its own checker, logged whatever the outcome |
| Maintain vendor finance fields · vendor bank-detail change | **T7** | One vendor's finance fields; two checkers by field |
| Month-end GRN-not-invoiced provision | **T19** (new) | Made by this role, checked by the Accounts Manager (§12.1) |

### 3.2 Inventory (§11.2)

| Reference work item / make | Result | Why |
|---|---|---|
| Create items from New Item Requests · Item Master — new item / edit existing | **T8** | Stores requests, this role creates, the Accounts Manager approves (change 4) |
| Run the Reconciliation Engine and resolve breaks · Reconciliation discrepancy resolution | **T9** | Month end |
| Draft the slow-moving, expired and NRV provision | **T10** | Quarter or year end |
| Post Periodic close entries · Periodic period close | **T11** | Month end, Periodic mode only |
| Standard cost variance review | **T20** (new) | Monthly; checked by the Accounts Manager (§12.2) |
| Bank stock statement (Cash Credit) | **T21** (new) | Monthly; generated from the valuation, confirmed by the Accounts Manager, submission tracked by the Compliance Officer (§12.2, §21.5) |
| ITC reversal on written-off stock | **T22** (new) | Per approved write-off; checked by the Compliance Officer (§21.2) |
| Load opening stock | **Not a task** | One-time migration |

### 3.3 Sales (§11.3)

| Reference work item / make | Result | Why |
|---|---|---|
| Maintain customer finance fields (credit days, ledger mapping, billing instructions) | **T12** | One customer's finance fields; credit-limit edits arrive from the Credit Controller |
| Post advances against SOs · make "Advance against SO" | **T13** | One advance, linked to its SO, GST on advance flagged for Billing |
| Bill-wise allocation & credit days | Step of T12 (and T1) | Set with the party's finance fields |

### 3.4 AR/AP (§11.4)

| Reference work item / make | Result | Why |
|---|---|---|
| Upload and match 26AS/AIS | **T14** | Quarterly |
| Unclaimable TDS credit write-off | Step of T14, **own checker** | Comes out of the matching; checked by the Finance Controller (§22.4) |
| Draft provision and revaluation runs · Provision run | **T15** | Month end; Accounts Manager reviews specific provisions, Finance Controller approves |
| FX revaluation run (foreign-currency open items) | **T23** (new, split from T15) | Month end; checked by the Accounts Manager only (change 5) |
| Prepare netting documents | **T16** | One netting document, under the Compliance Officer's payment-recognition rule |
| Maintain Udyam data | **T17** | One vendor's MSME data; feeds the Compliance Officer's MSME register |
| Run reconciliation · reconciliation break carried across a period | **T18** | Month end |
| Opening-balance migration | **Not a task** | One-time |

**Result:** 23 work items + 32 makes → **23 tasks**, 2 one-time items (not tasks), 1 not this role's (the match variance), 0 possibly missing.

## 4. The task list (shared role format)

```text
# Accounts Executive

Purpose: Put the purchase, stock, customer and AR/AP side of the books in correctly and on time,
so that what the Accounts Manager approves is right the first time.
```

| ID | Responsibility | Outcome it answers for |
|---|---|---|
| R1 | Record purchases, notes and advances correctly | Every vendor invoice, Bill of Entry, contractor bill, freight bill and supplier credit note that has arrived is posted against its original document with the system-derived tax, once any match variance is approved, or routed with a reason. Every debit note due from a return or an approved variance is raised. Every advance against a sales order is linked to it and flagged for GST where it applies. Every approved stock write-off has its ITC reversal. All of it is with the checker on time. |
| R2 | Keep vendor, customer and item finance data right | No vendor, customer or item is used with missing or wrong finance fields: credit terms, ledger mapping, bank details, MSME status, billing instructions, HSN and costing. Every change is checked by the right person before it applies. |
| R3 | Close stock and AR/AP correctly each period | At each month end the stock and AR/AP control accounts agree with their open items, or every break is explained; the GRN-not-invoiced provision, cost variances, provisions, revaluations, the 26AS/AIS match and the bank stock statement are drafted from the books on time for checking. |

| ID | Task | Responsibility | Starts when | Done when | Hands over to |
|---|---|---|---|---|---|
| T1 | Post a purchase voucher | R1 | A vendor invoice or a Bill of Entry arrives, keyed by this role or captured and linked to its PO by the Procurement Officer or Stores | The voucher is posted with its tax lines and due date and sent for checking, after any match variance has been approved | Accounts Manager |
| T2 | Post a service bill against a Works Order | R1 | A contractor's or service vendor's invoice has been matched to its Works Order | The bill is posted against the confirmed milestone and sent for checking, or routed as an exception when it has no confirmation | Accounts Manager |
| T3 | Allocate landed cost | R1 | A freight or duty bill arrives for material already received | The cost is spread over the material vouchers it belongs to and sent for checking | Accounts Manager |
| T4 | Raise a debit note to a vendor | R1 | Goods are returned after a QC rejection, or an approved match variance leaves a rate or quantity to recover | The debit note is raised against the original purchase voucher and sent for checking | Accounts Manager |
| T5 | Book a supplier credit note | R1 | A vendor's credit note arrives, or the Payables Executive finds one not yet booked | The note is booked against the original purchase voucher, checked against any debit note already raised, with the ITC reversal flagged, and sent for checking | Accounts Manager; Compliance Officer, for the ITC reversal |
| T6 | Request a tax or TDS override | R1 | The tax the system derived for a voucher is wrong for this case | The request, with a reason, is with the Compliance Officer | Compliance Officer; Finance Controller as well above the company's value threshold |
| T7 | Complete and maintain vendor finance fields | R2 | The Procurement Officer proposes a new vendor, or a vendor's terms, ledger or bank details change | The finance fields are saved and sent for checking, with penny-drop or call-back evidence for bank details | Accounts Manager; Finance Controller, for bank details |
| T8 | Create or edit an item's accounting fields | R2 | The Stores / Inventory Officer sends a New Item Request, or an item's costing or tax fields must change | The item is created, or its HSN, GST rate, costing and ledgers saved, and sent for approval | Accounts Manager |
| T9 | Resolve stock reconciliation breaks | R3 | Month end: the Reconciliation Engine shows breaks between stock and the stock ledger | Every break is explained, and fixed or carried with a reason | Accounts Manager |
| T10 | Draft the slow-moving, expired and NRV provision | R3 | Quarter end or year end | The draft provision is sent for review | Accounts Manager, to review; Finance Controller, to approve |
| T11 | Post the periodic close entries | R3 | Month end, when the company uses Periodic inventory accounting | Closing stock and cost of goods sold are posted and sent for checking | Accounts Manager |
| T12 | Maintain customer finance fields | R2 | A new customer is approved, the Credit Controller recommends a new limit, or a customer's credit days, ledger or billing instructions change | The finance fields are saved and sent for checking | Credit Controller, for a credit-limit edit; Accounts Manager |
| T13 | Record an advance against a sales order | R1 | The Collections Officer records a customer's advance on account for a sales order | The advance is linked to the order, flagged for GST on advance where it applies, and sent for checking | Billing Executive, for the receipt voucher; Accounts Manager |
| T14 | Match 26AS/AIS | R3 | Every quarter, when the 26AS/AIS statement is available | Every TDS credit is matched to a customer, or listed with an action (ask the customer, escalate, write off), and sent for checking | Accounts Manager; Compliance Officer, for an escalated mismatch; Finance Controller, for an unclaimable write-off |
| T15 | Draft the AR/AP provision run | R3 | Month end | The provision run is drafted from the matrix and specific items and sent for checking | Accounts Manager, for the specific provisions; then Finance Controller |
| T16 | Prepare a netting document | R1 | A customer and a vendor are linked as one party in Business Core and their balances are to be set off | The netting document is prepared under the payment-recognition rule and sent for checking | Accounts Manager; Finance Controller as well above the company's netting threshold |
| T17 | Maintain a vendor's Udyam (MSME) data | R2 | A vendor gives or changes its Udyam number, or has not answered | The Udyam number, status and category are saved and sent for checking, or a reminder is sent | Accounts Manager |
| T18 | Run the AR/AP reconciliation | R3 | Month end | The control accounts agree with the open items, or every break is explained and sent for checking | Accounts Manager |
| T19 | Book the GRN-not-invoiced provision | R3 | Month end: the cut-off list shows goods received with no invoice | The provision is booked for each open GRN, or the GRN explained, and sent for checking | Accounts Manager |
| T20 | Review standard cost variances | R3 | Month end, for items costed at standard | Each purchase-price and usage variance above the company's level is explained, and the review sent for checking | Accounts Manager |
| T21 | Prepare the bank stock statement | R3 | Month end, for each Cash Credit account | The statement is generated from the book valuation, differences from the last one explained, and sent for confirmation | Accounts Manager; the Compliance Officer tracks the submission |
| T22 | Book the ITC reversal on written-off stock | R1 | A scrap, damage, theft or expiry write-off is approved | The ITC to reverse is booked against the write-off and sent for checking | Compliance Officer |
| T23 | Draft the FX revaluation run | R3 | Month end, when foreign-currency open items exist | The revaluation is drafted at the configured rate source, the change from last period explained, and sent for checking | Accounts Manager |

## 5. Responsibilities: from the whys

| Task | Why (asked until it names a result) | Groups into |
|---|---|---|
| T1, T2, T3 | So every purchase is in the books once, at the right value and tax, matched to what was ordered and received | **R1** |
| T4, T5 | So the vendor's balance shows only what we owe after returns and differences, never reduced twice | **R1** |
| T6, T22 | So a voucher or a write-off carries the tax the law requires | **R1** |
| T13 | So a customer's advance adjusts against the invoice and the GST on it is paid | **R1** |
| T16 | So a party that is both customer and vendor is settled at its net balance | **R1** |
| T7, T17 | So vendors are paid on the right terms, into the right account, inside the MSME limit | **R2** |
| T8 | So every item is costed and taxed correctly from its first movement | **R2** |
| T12 | So every customer is billed and given credit on the right terms | **R2** |
| T9, T11, T20 | So the stock in the books is what the stock records and real prices say | **R3** |
| T10, T15, T19, T23 | So the month's accounts carry what may not be recovered, what was received but not billed, and what foreign balances are worth today | **R3** |
| T14, T18 | So what customers and vendors owe, and the TDS they deducted, agree with the ledgers | **R3** |
| T21 | So what the bank lends against is the stock the books show | **R3** |

**Against the responsibility test:**

| Test | R1 | R2 | R3 |
|---|---|---|---|
| Outcome, not activity | ✅ "Posted correctly", not "post vouchers" | ✅ "No party or item used with wrong fields" | ✅ "Closed correctly each period" |
| Answerable if neglected | ✅ Wrong payables, wrong tax, double reductions | ✅ Wrong payments, MSME interest, wrong invoices | ✅ Wrong month-end accounts, a wrong statement to the bank |
| Same why | ✅ 9 tasks, one result | ✅ 4 tasks, one result | ✅ 10 tasks, one result |
| Measurable | ✅ Invoices arrived and not posted · notes due and not raised · write-offs with no ITC reversal | ✅ Parties or items with missing fields · edits not checked | ✅ Breaks open at close · runs and statements not drafted by the close date |
| Fails both ways | ✅ Not too slow (late posting), not careless (wrong posting) | ✅ Not blocking (new vendor waits), not loose (bank change unchecked) | ✅ Not late, not "forced to agree" |

**Note on R3:** it now holds 10 tasks. **Ask** if the close work should be two responsibilities: stock (T9–T11, T20, T21) and AR/AP (T14, T15, T18, T19, T23).

**Note on the 4 areas:** the areas say **where** the work is; the responsibilities say **what it is for**. They cross: R1 has tasks in Purchase, Inventory, Sales and AR/AP. That is why the areas are a way to find the tasks, not a way to name responsibilities.

## 6. Summary

| Task | Area | Subject | Type → Pattern | Thumb rule result | Main thing to validate |
|---|---|---|---|---|---|
| **T1** Post a purchase voucher | Purchase | One vendor invoice | Record → Form filled from what was expected | ✅ Keep (changed) | What is left for you when Procurement has captured and linked it? |
| **T2** Post a service bill | Purchase | One service invoice | Record → Form filled from the Works Order | 🟠 Keep (could merge with T1) | Separate work, or a kind of T1? |
| **T3** Allocate landed cost | Purchase | One freight/duty bill | Make → Form on the item | ✅ Keep | Always with T1, or later? |
| **T4** Raise a debit note | Purchase | One return or variance | Make → Form filled from the return document | ✅ Keep | Who decides a rate debit note is due? |
| **T5** Book a supplier credit note | Purchase | One credit note | Record → Form filled from the voucher | ✅ Keep | — |
| **T6** Request a tax override | Purchase | One voucher's tax | Ask → Form on the item | 🟠 Keep (could be a step of T1) | Tracked on its own? |
| **T7** Vendor finance fields | Purchase | One vendor | Make → Form on the item | ✅ Keep | Who does the call-back? |
| **T19** GRN-not-invoiced provision | Purchase | One month's open GRNs | Run a batch, then Decide each GRN → Worklist | 🟠 New | Yours, or the Accounts Manager's with the cut-off? |
| **T8** Item accounting fields | Inventory | One item | Make → Form filled from the request | ✅ Keep (settled) | — |
| **T9** Stock reconciliation breaks | Inventory | One month's breaks | Run a batch, then Decide each break → Worklist | ✅ Keep | — |
| **T10** NRV provision | Inventory | One quarter's provision | Make → Form, many lines | ✅ Keep | — |
| **T11** Periodic close entries | Inventory | One month's close | Run a batch → gate, press, result | ✅ Keep (Periodic only) | — |
| **T20** Standard cost variances | Inventory | One month's variances | Run a batch, then Decide each variance → Worklist | 🟠 New | Only where standard costing is used? |
| **T21** Bank stock statement | Inventory | One month's statement per CC account | Run a batch → gate, press, result | 🟠 New | Monthly for every CC account? |
| **T22** ITC reversal on written-off stock | Inventory | One approved write-off | Record → Form filled from the write-off | 🟠 New (could be a step of the write-off) | Yours, or done by the system on approval? |
| **T12** Customer finance fields | Sales | One customer | Make → Form on the item | ✅ Keep | — |
| **T13** Advance against an SO | Sales | One advance | Record → Form filled from the receipt | ✅ Keep | — |
| **T14** Match 26AS/AIS | AR/AP | One quarter's statement | Run a batch, then Decide the unmatched → Worklist | ✅ Keep (changed) | — |
| **T15** AR/AP provision run | AR/AP | One month's run | Run a batch → gate, press, result | ✅ Keep (narrowed) | — |
| **T23** FX revaluation run | AR/AP | One month's run | Run a batch → gate, press, result | ✅ New (split from T15) | — |
| **T16** Netting document | AR/AP | One linked party | Make → Form on the item | ✅ Keep | How often? |
| **T17** Udyam data | AR/AP | One vendor | Record → Form on the item | 🟠 Keep (could merge with T7) | Part of the vendor's finance fields? |
| **T18** AR/AP reconciliation | AR/AP | One month's control accounts | Run a batch, then Decide each break → Worklist | ✅ Keep | — |

- **Each task has its own subject or its own trigger.** That is the main reason no merge is proposed.
- **Four possible merges** to ask about: T2 into T1, T6 into T1, T17 into T7, T22 into the write-off.
- **Types used:** Record (6), Make (7), Ask (1), Run a batch (9, five of them followed by a decision on each line). This role is mostly **Make, Record and month-end runs**, unlike the Credit Controller (mostly Decide).
- **What moved out:** the match variance and, often, OCR capture. T1 is now mainly **the accounting post** of a document someone else captured.

## 7. The task card

Every task below has the same card as the Credit Controller analysis, plus **Area**.

| Card field | Question it answers |
|---|---|
| Serves | Which responsibility, and the outcome it answers for |
| **Area** | Purchase · Inventory · Sales · AR/AP |
| Trigger & cadence | What starts it, how often |
| Subject | The one thing the task acts on |
| Requires | What must be true to start |
| Sees | The facts used |
| Done when | The ways it can end |
| Writes | The record it leaves |
| Hand-off | Who gets it next |
| Sends | Messages that go out |
| Held by | Whose move it is (Needs me · Waiting on others · Coming up) |
| Exceptions | Cases flagged for attention |
| Parameters | Company rules it uses (by name, not value) |
| Rules allowed | Standing rules the holder may set (✅ myself · 🟠 Accounts Manager · ❌ never) |
| Indicators | How you see that the responsibility is kept |
| Type | What kind of work, and the screen pattern |
| Screen | Where it lives in the app |

---

## 8. Task by task

### Purchase (§11.1)

#### T1 — Post a purchase voucher

| Field | Value |
|---|---|
| Serves | **R1** → every invoice that arrived is posted, matched and checked |
| Area | Purchase |
| Trigger & cadence | A vendor invoice or a Bill of Entry arrives. Either **keyed here** (OCR or manual, e.g. a no-PO purchase) or **captured and linked to its PO/GRN** by the Procurement Officer or Stores. Daily. |
| Subject | **One purchase voucher** (domestic or import), with or without a PO |
| Requires | The vendor is approved (T7) · for a PO voucher: the PO, its GRN, and **the match variance approved** by the Accounts Manager when it was outside tolerance |
| Sees | The captured draft and who captured it · OCR fields still to confirm (only if this role keyed it) · PO, GRN and invoice side by side, with the variance and its approval · duplicate check · vendor GSTIN vs Business Core · HSN vs GST rate · GST and TDS lines (policy engine) · cumulative purchases vs the TDS threshold · credit days and MSME due date |
| Done when | Posted and sent for checking · posted with no PO and the exception logged · discarded as a duplicate |
| Writes | `PurchaseVoucher.Post` |
| Hand-off | **Accounts Manager** (approves the voucher). A no-PO voucher: listed for the Procurement Officer |
| Sends | "No PO" to the Procurement Officer |
| Held by | Arrived, no variance → **Needs me** · Variance raised → Procurement Officer / Accounts Manager, **Waiting on others** · Variance approved → **Needs me** · Sent → Accounts Manager, **Waiting on others** · Returned → **Needs me** |
| Exceptions | Duplicate · variance not yet approved · OCR field below the flag level · GSTIN mismatch · MSME vendor · no PO |
| Parameters | Three-way-match tolerance (used by the Procurement Officer's variance) · OCR low-confidence flag · TDS purchase-of-goods threshold · MSMED Act due days |
| Rules allowed | ✅ Flag OCR fields at a stricter level · ✅ Alert me earlier on the TDS threshold · ❌ Post before the variance is approved · ❌ Approve my own voucher |
| Indicators | Invoices arrived and not posted (zero by end of day) · vouchers waiting on a variance (age) · vouchers returned |
| **Type** | **Record** → Form filled from what was expected (PO, GRN, the approved variance); only what is left is typed |
| Screen | Tasks → **T1**: Needs me · Waiting for variance · With Accounts Manager · Posted |

- **Evidence:** §11.1, §1.1 (Procurement Officer raises the variance), §12.1 ("reviews … before posting"; OCR "made by whoever keys the source document"); scenario A1-06 and A1-08 (Ravi, Procurement Officer, routes the ₹17,900 sugar variance and corrects the OCR quantity; Rajan checks), A1-10 (no-PO voucher ₹8,500, **Teja**).

**Steps inside T1 (not tasks):** (capture, if keyed here) → duplicate and tax checks → wait for the approved variance → GST/TDS lines → bill-wise allocation and due date → post.

**What changed:** the variance reason is **no longer filled in here**. The voucher waits for the Procurement Officer's variance and the Accounts Manager's approval, then posts.

**Split or merge considered**
- **Import voucher a task of its own?** **No (Proposal).** Same start and end, different fields. **Ask.**
- **Two tasks, "keyed here" and "captured elsewhere"?** **No.** Same end; only the start differs.

**Verdict:** ✅ Keep as one task (changed).

**Ask the role holder**
- When Procurement has captured and linked the invoice, what is left for you: only the accounting lines and the due date?
- Do you wait for the variance approval, or post the matched part and leave the variance open?
- Is the import voucher (BOE) the same work as a domestic voucher?

**What you fill in** (Proposal)

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the invoice that came in" | Invoice | Picked | From the arrived invoices | Yes |
| "Procurement has already linked it" | PO · GRN · captured by | Shown | — | — |
| "The variance is approved" | Variance, reason, approved by | Shown | From the Procurement Officer and the Accounts Manager | — |
| "If I keyed it, I correct what OCR read wrongly" | Flagged field | Entered | Number / text | Yes, if flagged |
| "No PO? I say why" | No-PO reason | Entered | Text | Yes, if no PO |
| "Tax and due date come by themselves" | GST, TDS, due date | Shown | — | — |
| "I check the narration" | Narration | Entered | Text | No |

Can't send when: the variance is not yet approved · a flagged field is not confirmed · a duplicate is not answered · no PO and no reason.

#### T2 — Post a service bill against a Works Order

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Purchase |
| Trigger & cadence | A contractor's or service vendor's invoice has been matched to its Works Order by the Contracts & Services Procurement Officer. Monthly per contract, or per milestone. |
| Subject | **One service bill** against one Works Order milestone |
| Requires | A Works Order · the match by the Contracts & Services Officer · the service completion confirmation (from the department head) |
| Sees | Works Order value and milestones · confirmed milestones · the invoice · the match and any variance (raised by the Contracts & Services Officer) · remaining contract value · suggested expense ledger |
| Done when | Posted against the confirmed milestone and sent · routed as an exception when **no confirmation** exists |
| Writes | `ServiceBill.Post` · `ServiceBill.RouteException` |
| Hand-off | **Accounts Manager** (approves the bill, above the value threshold; decides the exception) |
| Sends | The no-confirmation exception to the Accounts Manager |
| Held by | Matched → **Needs me** · Variance open → Contracts & Services Officer / Accounts Manager, **Waiting on others** · Sent → **Waiting on others** |
| Exceptions | No confirmation (yours to route) · above the milestone (the Contracts & Services Officer's variance, which you wait for) |
| Parameters | Accounts Manager's value threshold for service bills |
| Rules allowed | ✅ Remind me when a confirmation is pending · ❌ Post a bill with no confirmation as normal |
| Indicators | Service bills waiting for a confirmation, with age |
| **Type** | **Record** → Form filled from the Works Order |
| Screen | Tasks → **T2** |

- **Evidence:** §11.1, §2.1; scenario A2-04 (WO-0021 September invoice ₹2,65,000 against ₹2,40,000 confirmed, +₹25,000, 10.4%, routed by the Contracts & Services Officer, checked by Rajan, who "also approves the service bill when it is posted").

**What changed:** the above-milestone exception is **not yours to route**: you post once its variance is approved. You route only a bill with no confirmation.

**Split or merge:** **Merge into T1?** 🟠 Same end, a different match. **Ask.**

**Verdict:** 🟠 Keep as one task, separate from T1.

**Ask:** Does the Accounts Manager check every service bill, or only above the value threshold (§12.1 says "above the value threshold")?

**What you fill in**

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the matched bill" | Bill | Picked | From matched bills | Yes |
| "I see the WO, what is confirmed and the variance" | WO · milestone · confirmed · variance status | Shown | — | — |
| "I check the ledger it suggests" | Expense ledger | Entered (suggested) | From the chart of accounts | Yes |
| "No confirmation? I route it" | Outcome | Entered | Post · Route as exception | Yes |
| "I write why" | Reason | Entered | Text | Yes, for an exception |

Can't send when: no ledger · an exception with no reason · a variance not yet approved · no confirmation and "Post" chosen.

#### T3 — Allocate landed cost

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Purchase |
| Trigger & cadence | A freight or duty bill (or a freight line on an invoice) arrives for material received. As needed. |
| Subject | **One freight or duty charge** |
| Requires | The material voucher(s) it belongs to are posted (T1) |
| Sees | Suggested material vouchers · basis (value, weight, quantity) · the result per kg |
| Done when | The cost is spread over the vouchers and sent for checking |
| Writes | `LandedCost.Allocate` |
| Hand-off | **Accounts Manager** (signs off the apportionment at month end) |
| Held by | Arrived → **Needs me** · Sent → **Waiting on others** |
| Exceptions | Charge not linked to any voucher · landed cost not yet apportioned at month end (on the Accounts Manager's cut-off list) |
| Parameters | Apportionment basis |
| Rules allowed | ✅ Default basis for a vendor |
| Indicators | Landed cost not yet apportioned at month end (zero) |
| **Type** | **Make** → Form on the item |
| Screen | Tasks → **T3** |

- **Evidence:** §11.1, §12.1 (sign-off, cut-off list); scenario A1-06 (₹3,000 freight on the sugar invoice, not on the PO), A1-14.

**Verdict:** ✅ Keep. **Ask:** Is it always done together with T1, or later when the freight bill comes separately?

**What you fill in:** the charge (picked) · vouchers (suggested, confirm) · basis (value · weight · quantity) · the per-unit result (shown). Can't send when no voucher is linked.

#### T4 — Raise a debit note to a vendor

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Purchase |
| Trigger & cadence | The Stores / Inventory Officer returns rejected goods (outward document pre-filled from the QC record), or an approved match variance leaves a rate or quantity to recover. As needed. |
| Subject | **One debit note** against one original purchase voucher |
| Requires | The original purchase voucher · the return document or the approved variance |
| Sees | Pre-filled from the return document (quantity, rate, GST) · the original voucher · any hold on the vendor's invoice (Payables) |
| Done when | Raised against the original voucher and sent for checking |
| Writes | `DebitNote.Raise` |
| Hand-off | **Accounts Manager** |
| Sends | The Payables Executive is told that the debit note exists (the hold can be released) |
| Held by | Return arrived → **Needs me** · Sent → **Waiting on others** |
| Exceptions | Original voucher not yet posted · return not yet out of the godown |
| Parameters | GST rate on the item |
| Rules allowed | ✅ Remind me · ❌ Raise without the original voucher |
| Indicators | Returns with no debit note (zero) |
| **Type** | **Make** → Form filled from the return document |
| Screen | Tasks → **T4** |

- **Evidence:** §11.1, §4.1 ("pre-fills the return/outward document … which the Accounts Executive then uses"); scenario A4-07 and the hand-off table: Vendor C 100 kg × ₹46 = ₹4,600 + GST ₹230; Vendor B 400 kg × ₹48 = ₹19,200 + GST ₹960; Sunil's hold of ₹20,160 until the debit note exists.

**Verdict:** ✅ Keep. **Ask:** For a rate variance, who decides that a debit note is due: you, or the Accounts Manager when approving the variance?

**What you fill in**

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the return" | Return / variance | Picked | From returns waiting | Yes |
| "It is filled from the return document" | Vendor · voucher · quantity · rate · GST | Shown | — | — |
| "I check the quantity" | Quantity | Entered (pre-filled) | Number ≤ rejected | Yes |
| "I pick the type" | Type | Entered | Return · price · quantity | Yes |
| "I write a note" | Narration | Entered | Text | No |

Can't send when: quantity is more than rejected · the original voucher is not posted.

#### T5 — Book a supplier credit note

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Purchase |
| Trigger & cadence | A vendor's credit note arrives · the Payables Executive's vendor statement reconciliation shows "supplier credit note not yet booked". As needed. |
| Subject | **One supplier credit note** |
| Requires | The original purchase voucher |
| Sees | OCR pre-fill · the original voucher · debit notes already raised for the same return · the IMS line (actioned later by the Accounts Manager) |
| Done when | Booked against the original voucher, checked against debit notes (so the same return is not reduced twice), ITC reversal flagged, sent |
| Writes | `SupplierCreditNote.Book` |
| Hand-off | **Accounts Manager** · **Compliance Officer** (ITC reversal) |
| Sends | ITC reversal flag to the Compliance Officer · "booked" back to the Payables Executive, when it came from a statement difference |
| Held by | Arrived → **Needs me** · Sent → **Waiting on others** |
| Exceptions | A debit note already covers the same return · no IMS line |
| Rules allowed | ❌ Book a note that overlaps a debit note without saying how |
| Indicators | Credit notes arrived and not booked · statement differences "credit note not booked" (zero) |
| **Type** | **Record** → Form filled from the voucher |
| Screen | Tasks → **T5** |

- **Evidence:** §11.1, §14.1 (vendor statement differences), §21.1 (ITC reversal made by this role), §12.1 (IMS actions are the Accounts Manager's). Illustrative in the app.

**Verdict:** ✅ Keep.

**What you fill in:** credit note (picked) · voucher (suggested) · "a debit note covers this" → **how to book it**: against the debit note (no second reduction) · as an extra reduction (reason) · amount and GST (shown, OCR). Can't send when an overlap is not answered.

#### T6 — Request a tax or TDS override

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Purchase |
| Trigger & cadence | The tax the system derived for a voucher (rate, section, RCM) is wrong for this case. As needed. |
| Subject | **One voucher's tax line** |
| Requires | A voucher in T1 |
| Sees | What the policy engine derived and why (tagging set by the Compliance Officer) · what you think applies |
| Done when | The request, with a reason, is with the Compliance Officer |
| Writes | `TaxOverride.Request` (logged whatever the outcome) |
| Hand-off | **Compliance Officer**; **Finance Controller** as well above the value threshold |
| Held by | Sent → **Waiting on others** |
| Parameters | Value threshold for the Finance Controller |
| Rules allowed | ❌ Override the tax myself |
| Indicators | Overrides asked, granted, refused |
| **Type** | **Ask** → Form on the item |
| Screen | Tasks → **T6** |

- **Evidence:** §11.1, §21.1, §22.1. Illustrative in the app. The RCM self-invoice that follows an RCM case is the Accounts Manager's (§12.1), not this task.

**Split or merge:** **A step of T1?** 🟠 Own checker, logged either way, so kept. **Ask.**

**What you fill in:** voucher (picked) · derived tax (shown) · tax you ask for · reason. Can't send without a reason.

#### T7 — Complete and maintain vendor finance fields

| Field | Value |
|---|---|
| Serves | **R2** → no vendor used with wrong or missing finance fields |
| Area | Purchase |
| Trigger & cadence | The Procurement Officer proposes a new vendor · a vendor's terms, ledger or bank details change. As needed. |
| Subject | **One vendor's finance fields** (credit terms, ledger mapping, bank details) |
| Requires | The vendor's identity is in Business Core (name, PAN, GSTIN, address — not edited here) |
| Sees | The proposal · duplicate bank-account check across vendors · penny-drop / name-match result · MSME status (T17) |
| Done when | Saved and sent for checking; bank details only with penny-drop or call-back evidence |
| Writes | `VendorFinance.Save` |
| Hand-off | **Accounts Manager** for terms and ledger · **Finance Controller** for bank details (the Accounts Manager approves payment proposals, so does not check bank details) |
| Held by | Proposed → **Needs me** · Sent → **Waiting on others** |
| Exceptions | Bank account used by another vendor · penny-drop name mismatch |
| Parameters | Usual payment terms · MSMED Act maximum days |
| Rules allowed | ❌ Change bank details without the Finance Controller · ❌ Edit a vendor and then approve its voucher (C-07) |
| Indicators | Vendor proposals waiting (age) |
| **Type** | **Make** → Form on the item |
| Screen | Tasks → **T7** |

- **Evidence:** §11.1, §12.1, §22.1 ("after penny-drop/call-back verification"); scenario A1-17 (Vendor H proposed 07-Oct, "MSME: pay within 45 days", approved by Rajan 08-Oct 10:00), C-07 (refused).

**Verdict:** ✅ Keep. **Ask:** Who makes the call-back to the vendor: you, or the Finance Controller?

**What you fill in**

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the new vendor" | Vendor | Picked | From proposals | Yes |
| "Name, PAN, GSTIN come from Business Core" | Identity | Shown | — | — |
| "I set the payment terms" | Credit days | Entered | Number (usual terms pre-filled) | Yes |
| "I map the ledger" | Ledger | Entered | From the chart of accounts | Yes |
| "I enter the bank account" | Bank account · IFSC | Entered | Text | Yes |
| "The system checks the account" | Penny-drop · duplicate | Shown | — | — |
| "I note the call-back" | Call-back evidence | Entered | Who, when | Yes, for a bank change |

Can't send when: bank account fails penny-drop or belongs to another vendor · no ledger · a bank change with no evidence.

#### T19 — Book the GRN-not-invoiced provision (new)

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Purchase |
| Trigger & cadence | Month end: the purchase cut-off list shows GRNs with no invoice. Monthly. |
| Subject | **One month's open GRNs** (each GRN decided) |
| Requires | The month's GRNs are posted |
| Sees | Each GRN with no invoice, its PO value and age · the invoice-without-GRN list (for information) |
| Done when | Every open GRN is provided for at PO value, or explained (invoice arrived after the cut-off, return), and sent |
| Writes | `GrniProvision.Book` |
| Hand-off | **Accounts Manager** (owns the purchase cut-off) |
| Held by | Month end → **Needs me** · next month end → **Coming up** |
| Exceptions | GRN older than one month still unbilled |
| Parameters | Month-end date |
| Rules allowed | ✅ Remind me before month end |
| Indicators | Open GRNs without provision at close (zero) |
| **Type** | **Run a batch**, then **Decide** each GRN → Worklist |
| Screen | Tasks → **T19** |

- **Evidence:** §11.1 Makes, §12.1 ("owns month-end purchase cut-off (GRN-not-invoiced provision)"; "Made by Accounts Executive"). Scenario: PO 0407 has 150 kg open (not a GRN-not-invoiced case); illustrative in the app.

**Ask:** Do you book it, or does the Accounts Manager book it with the cut-off?

**What you fill in:** per GRN: provide (amount pre-filled at PO value) · explain (reason).

### Inventory (§11.2)

#### T8 — Create or edit an item's accounting fields

| Field | Value |
|---|---|
| Serves | **R2** |
| Area | Inventory |
| Trigger & cadence | A New Item Request from the Stores / Inventory Officer · an item's costing or tax fields must change. As requested. |
| Subject | **One item** (HSN, GST rate, costing method, ledgers, item group) |
| Requires | The request has passed the duplicate check |
| Sees | The request · the closest existing items · HSN/GST suggested from the description and similar items · costing defaulted from the item group (the method is the Accounts Manager's policy) |
| Done when | **Created** (or edited) and sent for approval |
| Writes | `Item.Create` · `Item.EditAccounting` |
| Hand-off | **Accounts Manager** (approves) |
| Sends | The requester sees the new item code once approved |
| Held by | Requested → **Needs me** · Sent → **Waiting on others** |
| Exceptions | A close duplicate · HSN and GST rate do not match |
| Parameters | GST rates · costing method per item group (Accounts Manager) |
| Rules allowed | ✅ Default fields for an item group · ❌ Change the costing method (Accounts Manager proposes, Finance Controller approves) |
| Indicators | Item requests waiting (age) |
| **Type** | **Make** → Form filled from the request |
| Screen | Tasks → **T8** |

- **Evidence:** §11.2, §12.2 ("Stores / Inventory Officer (requests) → Accounts Executive (creates)"); scenario A4-13 ("Printed laminate film", closest PM-001, approved by Rajan as PM-003).

**Verdict:** ✅ Keep (settled: this role creates, the Accounts Manager approves).

**What you fill in:** request (picked) · item code (suggested) · HSN · GST rate (suggested) · stock and expense ledgers · item group. Can't send when HSN and GST rate do not match without a reason.

#### T9 — Resolve stock reconciliation breaks

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Inventory |
| Trigger & cadence | Month end: the Reconciliation Engine runs. Monthly. |
| Subject | **One month's breaks** (each break decided one by one) |
| Requires | The month's GRNs and issues are posted |
| Sees | Each break down to the transaction · likely cause (unposted GRN, back-dated entry, manual journal to inventory) |
| Done when | Each break fixed, or carried with a reason; the list is sent |
| Writes | `StockRecon.Resolve` |
| Hand-off | **Accounts Manager** (reviews before the Inventory module close) |
| Held by | Month end → **Needs me** · Sent → **Waiting on others** · next month end → **Coming up** |
| Exceptions | Breaks carried from last month |
| Rules allowed | ✅ Remind me before month end |
| Indicators | Breaks open at close (zero, or explained) |
| **Type** | **Run a batch**, then **Decide** each break → Worklist |
| Screen | Tasks → **T9** |

**What you fill in:** per break: action (fix · carry with reason) · reason. Can't send with a break undecided.

#### T10 — Draft the slow-moving, expired and NRV provision

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Inventory |
| Trigger & cadence | Quarter end and year end. |
| Subject | **One period's provision** |
| Requires | Batch expiries and ageing · recent selling prices |
| Sees | Suggested provision per line (ageing, expiry, items selling below cost) |
| Done when | The draft is sent for review |
| Writes | `NrvProvision.Draft` |
| Hand-off | **Accounts Manager** (review), **Finance Controller** (approve) |
| Held by | Quarter end → **Needs me** · next quarter end → **Coming up** |
| Exceptions | Expired batch still in stock |
| Parameters | Provision matrix |
| Rules allowed | ✅ Remind me · ❌ Leave out an expired batch |
| Indicators | Provision sent by the close date |
| **Type** | **Make** → Form, many lines |
| Screen | Tasks → **T10** |

- **Evidence:** §11.2, §12.2, §22.2; seed: SMP batch SM-2604 (300 kg at ₹298) expires 28-Oct-2026.

**What you fill in:** per line: accept or change the provision % · reason when changed.

#### T11 — Post the periodic close entries

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Inventory |
| Trigger & cadence | Month end, **only in Periodic mode** (scenario Run 2). |
| Subject | **One month's closing stock and COGS** |
| Requires | Count and valuation done |
| Sees | Closing value and COGS computed · variance against last period, explained |
| Done when | Posted and sent for checking |
| Writes | `PeriodicClose.Post` |
| Hand-off | **Accounts Manager** |
| Held by | Month end → **Needs me** |
| Indicators | Close posted by the close date |
| **Type** | **Run a batch** → gate, one press, result |
| Screen | Tasks → **T11** (empty in Perpetual mode) |

#### T20 — Review standard cost variances (new)

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Inventory |
| Trigger & cadence | Month end, for items costed at standard. Monthly. |
| Subject | **One month's variances** (each item or vendor line decided) |
| Requires | The month's purchases and issues are posted |
| Sees | Purchase-price and usage variances by item and vendor · the variance against last month |
| Done when | Each variance above the company's level is explained, and the review sent |
| Writes | `StdCostVariance.Review` |
| Hand-off | **Accounts Manager** |
| Held by | Month end → **Needs me** · next month end → **Coming up** |
| Parameters | Variance level that needs an explanation |
| Rules allowed | ✅ Remind me |
| Indicators | Variances unexplained at close (zero) |
| **Type** | **Run a batch**, then **Decide** each variance → Worklist |
| Screen | Tasks → **T20** (empty when no item is at standard cost) |

- **Evidence:** §11.2 Makes, §12.2 ("Review standard cost variances — monthly: purchase price and usage variances by item and vendor"; "Made by Accounts Executive"). Illustrative in the app.

**Ask:** Does the company cost any item at standard? If not, T20 does not apply.

**What you fill in:** per line: explanation (rate revision · usage loss · other, text).

#### T21 — Prepare the bank stock statement (new)

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | Inventory |
| Trigger & cadence | Month end, for each Cash Credit account. Monthly. |
| Subject | **One month's stock statement** for one CC account |
| Requires | The month's inventory valuation is done |
| Sees | The statement built from the book valuation · differences from the last statement filed and from the books · the bank's due date |
| Done when | Generated, differences explained, and sent for confirmation |
| Writes | `StockStatement.Prepare` |
| Hand-off | **Accounts Manager** (confirms) · the **Compliance Officer** tracks the submission and drawing power in Banking |
| Held by | Month end → **Needs me** · Sent → **Waiting on others** · next month → **Coming up** |
| Exceptions | Difference from the books |
| Parameters | Bank's submission day |
| Rules allowed | ✅ Remind me before the submission day |
| Indicators | Statement confirmed before the bank's date |
| **Type** | **Run a batch** → gate, press, result |
| Screen | Tasks → **T21** |

- **Evidence:** register (Inventory: "generates the bank stock statement"), §11.2 Makes, §12.2, §21.5. Illustrative in the app.

**What you fill in:** the period (shown) · explanation of any difference · press Generate.

#### T22 — Book the ITC reversal on written-off stock (new)

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Inventory |
| Trigger & cadence | A scrap, damage, theft or expiry write-off (made by the Stores / Inventory Officer) is approved by the Inventory Controller, or the Finance Controller above threshold. Per write-off. |
| Subject | **One approved write-off** |
| Requires | The write-off is approved |
| Sees | The write-off · the ITC taken on the goods, computed (Sec 17(5)) |
| Done when | The reversal is booked and sent for checking |
| Writes | `ItcReversal.WrittenOffStock` |
| Hand-off | **Compliance Officer** |
| Held by | Write-off approved → **Needs me** · Sent → **Waiting on others** |
| Exceptions | Goods on which no ITC was taken |
| Rules allowed | ❌ Skip the reversal |
| Indicators | Approved write-offs with no reversal (zero) |
| **Type** | **Record** → Form filled from the write-off |
| Screen | Tasks → **T22** |

- **Evidence:** §11.2 Makes, §21.2 ("ITC reversal on written-off stock — per write-off"; "Made by Accounts Executive"), §4.2, §6.1 (write-offs). Illustrative in the app.

**Ask:** Is it your task, or does the system post it on the write-off's approval and you only check it?

**What you fill in:** write-off (picked) · ITC to reverse (shown, computed) · note.

### Sales (§11.3)

#### T12 — Maintain customer finance fields

| Field | Value |
|---|---|
| Serves | **R2** |
| Area | Sales |
| Trigger & cadence | A new customer is approved · the Credit Controller recommends a new credit limit · credit days, ledger or billing instructions change. As needed. |
| Subject | **One customer's finance fields** (credit days, ledger mapping, billing instructions, credit limit) |
| Requires | The customer's identity is in Business Core |
| Sees | Current fields · the Credit Controller's recommendation and reason (for a limit) |
| Done when | Saved and sent for checking |
| Writes | `CustomerFinance.Save` · `CreditLimit.Edit` |
| Hand-off | **Credit Controller** first for a credit-limit edit (checks it), then **Accounts Manager** (confirms) · other fields: **Accounts Manager** |
| Sends | Billing instructions reach the Billing Executive, who applies them but cannot change them |
| Held by | Recommendation arrived → **Needs me** · Sent → **Waiting on others** · Objected → **Needs me** |
| Exceptions | New limit differs from the recommendation · billing instructions missing |
| Rules allowed | ❌ Change a limit the Credit Controller has not recommended or checked |
| Indicators | Recommendations waiting to be entered |
| **Type** | **Make** → Form on the item (a limit edit is close to **Record**) |
| Screen | Tasks → **T12** |

- **Evidence:** §11.3, §10 note, §12.3; Credit Controller T4/T5 (C-01 ₹18,00,000 and C-02 ₹9,60,000 recommended on 12-Oct); C-13 (refused: Billing cannot edit finance fields).

**What you fill in:** customer (picked) · field (credit limit · credit days · ledger · billing instructions: PO reference rule, delivery channel, format) · new value (pre-filled from the recommendation) · note. Can't send when the new limit equals the current one.

#### T13 — Record an advance against a sales order

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | Sales |
| Trigger & cadence | The Collections Officer records a customer's receipt on account as an advance for a sales order. Per advance. |
| Subject | **One advance** |
| Requires | The receipt is in AR/AP (on account) · the SO exists |
| Sees | The receipt · the SO · whether GST on advance applies (services) |
| Done when | Linked to the SO, flagged for GST where it applies, sent for checking |
| Writes | `Advance.Link` · `Advance.FlagGst` |
| Hand-off | **Billing Executive** (issues the GST receipt voucher, checked by the Compliance Officer) · **Accounts Manager** |
| Sends | The flag to the Billing Executive |
| Held by | Advance received → **Needs me** · Sent → **Waiting on others** |
| Exceptions | Order cancelled before supply (Billing issues a refund voucher) |
| Parameters | GST on advance for services |
| Indicators | Advances on account not linked (zero) · unapplied advances on the Accounts Manager's revenue cut-off |
| **Type** | **Record** → Form filled from the receipt |
| Screen | Tasks → **T13** |

- **Evidence:** §11.3, §10.1, §13.2, §21.3; scenario B1-06, B4-10 (C-04 ₹59,000 advance of 03-Oct, flagged by Teja; Pooja issues the receipt voucher; SO-6 cancelled 15-Oct, refund voucher).

**What you fill in:** receipt (picked) · SO (suggested) · GST on advance (suggested: yes for services) · note.

### AR/AP (§11.4)

#### T14 — Match 26AS/AIS

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | AR/AP |
| Trigger & cadence | Every quarter, when the statement is available. |
| Subject | **One quarter's 26AS/AIS** (each line decided) |
| Sees | Auto-match on TAN, amount and quarter · customers who deducted but did not deposit · credits near the claim deadline |
| Done when | Every line matched, or listed with an action (ask the customer · escalate to tax · write off as unclaimable); sent |
| Writes | `Tds26as.Match` · `TdsCredit.WriteOff` |
| Hand-off | **Accounts Manager** · **Compliance Officer** for an escalated mismatch · **Finance Controller** for an unclaimable write-off |
| Held by | Statement available → **Needs me** · next quarter → **Coming up** |
| Rules allowed | ✅ Remind me |
| Indicators | Unmatched lines at quarter close |
| **Type** | **Run a batch**, then **Decide** each unmatched line → Worklist |
| Screen | Tasks → **T14** |

- **Evidence:** §11.4, §21.4 ("26AS mismatches escalated to tax"), §22.4 ("Unclaimable TDS credit write-off — Made by Accounts Executive"). Illustrative in the app. The company's own 26AS/AIS reconciliation in Taxation is the Accounts Manager's (§21.6), not this task.

**What you fill in:** upload (the statement) · per unmatched line: action (ask the customer · escalate · write off, reason).

#### T15 — Draft the AR/AP provision run (narrowed)

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | AR/AP |
| Trigger & cadence | Month end. |
| Subject | **One month's provision run** |
| Sees | Provision from the matrix and specific items · the change from last period |
| Done when | Drafted and sent |
| Writes | `ProvisionRun.Draft` |
| Hand-off | **Accounts Manager** (reviews specific provisions) → **Finance Controller** (approves) |
| Held by | Month end → **Needs me** |
| Parameters | Provision matrix (Accounts Manager makes, Finance Controller approves) |
| Rules allowed | ✅ Remind me |
| **Type** | **Run a batch** → gate, press, result |
| Screen | Tasks → **T15** |

- **Evidence:** §11.4, §12.4, §22.4; seed: C-06 overdue (illustrative).

**What changed:** the FX revaluation is now its own task (T23): it has a different checker.

#### T23 — Draft the FX revaluation run (new, split from T15)

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | AR/AP |
| Trigger & cadence | Month end, when foreign-currency open items exist. |
| Subject | **One month's FX revaluation** of open items |
| Sees | Each foreign-currency open item · rate at booking and at month end (configured rate source) · gain or loss · the change from last period |
| Done when | Drafted and sent |
| Writes | `FxRevaluation.Draft` |
| Hand-off | **Accounts Manager** (a regular month-end entry) |
| Held by | Month end → **Needs me** |
| Parameters | Rate source |
| Rules allowed | ✅ Remind me |
| **Type** | **Run a batch** → gate, press, result |
| Screen | Tasks → **T23** |

- **Evidence:** §11.4, §12.4, register "FX revaluation"; seed: SO-3 export invoice in USD (C-03); answer key: FX gain ₹4,272 (illustrative). The bank-account revaluation is the same kind of entry in Banking (§11.5), out of scope.

#### T16 — Prepare a netting document

| Field | Value |
|---|---|
| Serves | **R1** |
| Area | AR/AP |
| Trigger & cadence | A customer and a vendor are linked as one party in Business Core and balances are to be set off. As needed. |
| Subject | **One netting document** |
| Requires | The parties are linked in Business Core · the payment-recognition rule (Compliance Officer) |
| Sees | Net exposure · a link suggestion to Business Core when PAN/GSTIN match but parties are not linked |
| Done when | Prepared and sent |
| Writes | `Netting.Prepare` |
| Hand-off | **Accounts Manager**; **Finance Controller** above the threshold |
| Sends | A link suggestion to Business Core |
| **Type** | **Make** → Form on the item |
| Screen | Tasks → **T16** |

- **Evidence:** §11.4, §21.4 (payment-recognition rule), §22.4. Illustrative in the app.

#### T17 — Maintain a vendor's Udyam (MSME) data

| Field | Value |
|---|---|
| Serves | **R2** |
| Area | AR/AP |
| Trigger & cadence | A vendor gives or changes its Udyam number · a vendor has not answered. As needed. |
| Subject | **One vendor's MSME data** on its AR/AP record |
| Sees | Udyam number format and status · category (micro, small, medium) |
| Done when | Saved and sent · or a reminder sent |
| Writes | `Udyam.Save` |
| Hand-off | **Accounts Manager** · the data feeds the **Compliance Officer's** MSME register and the Payables Executive's MSME due dates |
| **Type** | **Record** → Form on the item |
| Screen | Tasks → **T17** |

- **Evidence:** §11.4, §12.4, §14.1, §21.4 ("owns the MSME register, Udyam data validity").

**Split or merge:** **Merge into T7?** 🟠 It sits on the AR/AP record, not the vendor master, and sets the 45-day rule. **Ask.** Also **ask**: does the Compliance Officer check the Udyam status, or only own the register built from it?

#### T18 — Run the AR/AP reconciliation

| Field | Value |
|---|---|
| Serves | **R3** |
| Area | AR/AP |
| Trigger & cadence | Month end. |
| Subject | **One month's control accounts** (each break decided) |
| Sees | Control account vs open items · breaks down to the posting that caused them |
| Done when | Agree, or every break explained; a break carried across a period has its own reason; sent |
| Writes | `ArApRecon.Run` · `ArApRecon.CarryBreak` |
| Hand-off | **Accounts Manager** (signs off; confirms the AR/AP module close) |
| **Type** | **Run a batch**, then **Decide** each break → Worklist |
| Screen | Tasks → **T18** |

---

## 9. Not tasks, and not this role's

| Item | Why |
|---|---|
| Load opening stock (§11.2) · opening-balance migration (§11.4) | One-time migration |
| Duplicate check, vendor tax validation, GST/TDS lines, bill-wise allocation | Steps of T1 (and T12) |
| OCR capture | A step of T1 only when this role keys the document; otherwise the Procurement Officer's or Stores' |
| Three-way-match variance (goods and services) | **Not this role's**: raised by the Procurement Officer / Contracts & Services Officer, approved by the Accounts Manager |
| IMS actions, RCM self-invoices | The Accounts Manager's (checked by the Compliance Officer) |
| Party links and merges | Business Core's work; this role only suggests a link (T16) |
| **Billing combined with this role** (small company) | A **configuration**: the invoice and note tasks would be the Billing Executive's tasks done by this seat, each checked by the Accounts Manager. Not in this task list; **ask** if the POC company needs it |

## 10. Possibly missing tasks: ask, don't add

None left from §11.1–11.4: the five "makes" with no work item are now T19–T22 and a step of T14 (§0, change 6). Two to watch:

| Candidate | Where seen | Likely result |
|---|---|---|
| Customs duty from the Bill of Entry | §21.6: this role captures the BoE in Purchase; the Accounts Manager computes the duty | A step of T1 (import voucher) |
| Disallowance-trigger or GST time-limit override | §21.6: "Made by Accounts Executive" | Taxation (§11.6), out of scope; would sit next to T6 |

## 11. Open questions

1. T1: When the Procurement Officer has captured and linked the invoice, what is left for you? Do you wait for the variance approval before posting?
2. T1: Is the import voucher the same work as a domestic voucher?
3. T2: A kind of T1, or separate work? Does the Accounts Manager check every service bill, or only above the threshold?
4. T3: Always with T1, or later when the freight bill comes separately?
5. T4: Who decides a debit note is due for a rate variance?
6. T6: Tracked on its own, or part of posting?
7. T7: Who does the bank-detail call-back?
8. T17: Part of the vendor's finance fields (T7)? Who checks the Udyam status?
9. T19–T22: Confirm each new task is yours: GRN-not-invoiced provision (or the Accounts Manager's with the cut-off?), standard cost (is any item at standard?), bank stock statement, ITC reversal (or a system step?).
10. R3 holds 10 tasks: one responsibility, or two (stock close and AR/AP close)?
11. Small company: is Billing combined with this role in the POC company?
12. Approval: every "Checked by" goes through the one approval mechanism owned with the Accounts Manager (to design with Manoj).

**Settled by the shared docs:** item creation (this role creates, the Accounts Manager approves) · provision and FX revaluation are two tasks · the five "makes" are this role's work.

## 12. Recommended next step

1. Interview the role holder with `role_task_discovery_and_field_collection_guide.md`, **without** showing T1–T23 first.
2. Compare: mark each task Confirmed, Change or Remove.
3. Settle the 12 open questions; agree the hand-offs with the Accounts Manager (Manoj), starting with T1's wait for the variance approval.
4. Update the designed UI (`02_…`) and the app to the changes in §0.
5. Write `roles/finance/accounts-executive.md` from §4 and the notes file from §9–§11.

## 13. Source boundary

- Work items, makes, checkers and "never" rules: shared work list §11.1–11.4, and the other roles' "Made by" / "Checked by" lists (§1, §2, §4, §10, §12, §13, §14, §21, §22); role register (**Fact**).
- Scenario evidence: full scenario steps A1-06, A1-08, A1-10, A1-17, A2-04, A4-07, A4-13, B1-06, B4-10, C-07, C-13 and the hand-off table (**Fact**).
- The 23 tasks, 3 responsibilities, purpose, types, verdicts and "What you fill in": **Proposal**, our reading, not checked with a role holder.
- Items marked *illustrative* (T5, T6, T9–T11, T14–T23 in the app) have no scenario step; their values are made up to show the screens.
- The earlier version of this document (18 tasks) is replaced; the task IDs T1–T18 keep their meaning, T15 is narrowed and T19–T23 are added.
