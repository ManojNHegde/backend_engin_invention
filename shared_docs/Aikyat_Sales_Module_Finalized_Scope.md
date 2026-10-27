# Aikyat — Sales Module (Finalized Scope)

2026-09-21 · @Someone · Updated Sep 26, 2026 (v3: Section 8 roles and intelligence; data model, cross-module data exchange, shared services and roadmap dependencies updated to support that intelligence — see Revision Notes)

Finalized scope for the Aikyat Sales Module — the Order-to-Cash engine covering Sales Order, Delivery Challan, Sales Invoice, Credit Note and Sales Receipt.

## 1. Aikyat Sales Module

Aikyat's Sales Module runs Sales Order, Delivery Challan, Sales Invoice, bill-wise allocation and outstanding/ageing reports as a single connected chain, sitting on top of Aikyat's core accounting, inventory and GST layers.

**Scope note:** this module covers goods sales in full (Sections 1–5); services sales are a distinct document flow using the same universal chain with a Notional Delivery Challan in place of a physical one (Section 6), not a separate module.

### Design goals

1. Run a three-way match discipline end to end: SO ↔ DC ↔ Invoice, so quantity and value can only ever step down the chain, never appear at a later stage with no upstream document to trace to
2. DC is configurable per company — sales can run without a DC step where management chooses; a Notional DC for services is offered only as an optional add-on when that's enabled, not built in by default
3. Keep the front-end simple for sales/billing operators — credit checks, match variance routing and tax triggers run in the background, not as manual steps
4. Branch is a mandatory dimension on every document (Section 5), consistent with Aikyat's centralized multi-branch accounting
5. Customer-side control equivalents to vendor-side controls: Customer Credit Control mirrors vendor scorecard/PO gating, Customer Scorecard mirrors vendor scorecard
6. Tax and statutory compliance is enforced at the Invoice step, as its own control: e-invoice/IRN generation triggers on posting, and the Invoice cannot reach Confirmed status without a successful response (or a documented offline/manual fallback) — not left as a separate manual filing task

### Core sales mechanics

- Sales Invoice posts Dr Customer / Cr Sales / Cr Output Tax on confirmation
- Bill-wise allocation ("new ref" / "against ref" / "on account") for receipts against invoices
- Outstanding and ageing reports per customer
- Stock item linkage for physical goods, GST configured at stock-item or ledger level
- Sales Return handled as a Credit Note against the original invoice

### Functional overview

| Document | Aikyat behaviour |
| --- | --- |
| Sales Order | Credit-control gated at entry; price from Price List/Contract |
| Delivery Challan | Configurable on/off; notional variant for services is a further option |
| Sales Invoice | Posts accounting entry |
| Credit Note | Always Checker-gated; reverses proportionately against the invoice |
| Debit Note | Always Checker-gated; increases the original invoice's value (late freight, rate correction) rather than reversing it |
| Sales Receipt | Originates in Banking, allocated here against open invoices |
| Proforma Invoice | Non-accounting document, no journal entry; used to request advance payment or for customer approval before the real Invoice |
| GST / Tax Compliance | Triggered automatically on Invoice posting; e-invoice/IRN generated, not a separate manual filing step |

The thread running through every document below is one rule: no orphan document where the DC step is enabled. A DC without a matching SO line, or an Invoice without a matching DC, is blocked outright rather than posted with missing data; with DC disabled, the match runs SO ↔ Invoice directly.

## 2. Data Model

### Core entities

| Entity | Header | Lines | Status lifecycle |
| --- | --- | --- | --- |
| Sales Order | Customer, branch, SO date, credit terms. **[NEW v3]** credit-check result and exposure snapshot at approval, risk score and reasons, duplicate-check result, source (manual / bulk import / Proforma) | Item/service, qty, rate, discount, tax. **[NEW v3]** price-list rate, override flag, override reason, overridden by, margin at order | Open → Partially Fulfilled → Closed |
| Delivery Challan | SO ref, DC date, type (physical/notional). **[NEW v3]** e-way bill number, Part-B status, e-way expiry date-time, vehicle/transporter | SO line ref, qty dispatched, **[NEW v3]** batch/serial (FEFO suggestion applied) | Open → Invoiced (partial/full) → Closed |
| Sales Invoice | DC ref, invoice date, IRN. **[NEW v3]** IRN status and GSTN error reason, tax determination id (Taxation Engine), customer IMS action where the portal exposes it, LUT reference (exports) | DC line ref, qty invoiced, value, tax | Draft → Confirmed → Closed |
| Credit Note | Invoice ref, reason code. **[NEW v3]** return receipt ref (Stores record — required for return type), 15(3)(b) pre-agreement ref (Price List/Contract), second approver (Finance Controller above threshold) | Invoice line ref, value, tax | Draft → PendingApproval → Posted |
| Debit Note | Invoice ref, reason code | Invoice line ref, value, tax | Draft → PendingApproval → Posted |
| Sales Receipt | Bank voucher ref, receipt date, amount | Invoice ref, allocated amount | Open → Allocated (partial/full) |
| Proforma Invoice | Customer, branch, validity date | Item/service, qty, rate, tax (indicative) | Draft → Sent → Converted/Expired |

### Relationships

- One Sales Order → many Delivery Challans (partial dispatch)
- One Delivery Challan → one or many Sales Invoices (partial billing)
- One Sales Invoice → many Credit Notes (partial returns/adjustments)
- One Sales Invoice → many Debit Notes (value increases raised after posting)
- One Proforma Invoice → zero or one Sales Invoice (converts on customer confirmation; never posts to the ledger itself)
- One Sales Receipt → many Sales Invoices (one payment settling several bills, via bill-wise allocation)
- Every header carries Customer and Branch; Customer carries Credit Limit, Payment Terms, Risk Band

### Additional entities

- Customer Master — credit limit, payment terms, risk band, hold flag (mirrors Vendor Master). **[NEW v3]** risk band source and computed on, last credit review date and next review due, suggested limit, GSTIN status (from the verification gateway)
- Credit Hold Log **[NEW v3]** — customer, placed by and reason, release requested by, released by (Finance Controller only), exposure at release
- Price Override Log **[NEW v3]** — SO line, list rate, override rate, margin impact, salesperson, approver; feeds the override-pattern report (8.7.2)
- Sales Return Receipt **[NEW v3]** — the Stores record of goods returned (original DC/invoice, batch/serial, qty, condition); releases the return Credit Note for approval
- IRN Exception Queue **[NEW v3]** — invoice, GSTN error, retry count, offline-fallback flag, resolved on
- Price List / Contract Rate — per item, per customer or tier
- Customer Scorecard — on-time payment %, DSO, dispute/return frequency (mirrors vendor scorecard). **[REVISED v3]** payment metrics are read from AR/AP, including dishonours reported by Banking; Sales computes only return and dispute frequency
- Approval Rule — the generic maker-checker config table shared across Aikyat modules, entity_type set to Sales values
- Document Numbering Series — sequential, financial-year-reset numbering per document type, scoped per GSTIN/branch where the company holds multiple registrations, as required under GST invoice rules; shared config, not a Sales-only table
- Customer Master, Item Master and the core accounting engine are owned outside Sales — shared services Sales consumes, not data it stores itself.

### Data exchanged with other modules [NEW v3]

The intelligence in the Operations section depends on data this module does not own. Each feed is read-only on the receiving side — the owning module stays the source of truth.

| Direction | Other module | What flows | Used for |
| --- | --- | --- | --- |
| In | AR/AP | Live exposure, overdue, days past due, broken promises, dishonour count | Credit gate on every SO; risk band; Customer Scorecard |
| Out | AR/AP | Open items from invoices, Debit Notes and Credit Notes | Receivables ageing and collections |
| In | Inventory Engine | Available stock by godown, batch expiry | Realistic dispatch dates; FEFO suggestion on DC |
| Out | Inventory Engine | DC outward and return inward movements | Stock and COGS |
| In | Taxation Engine | Tax determination, IRN/e-way responses, customer IMS actions where exposed | Tax lines; IRN queue; "customer rejected your invoice" flag |
| Out | Taxation Engine | Sales Register for GSTR-1 and HSN summary | Section 9 reconciliation |
| Out | Fixed Assets | Invoices for capital-item flagged items | Disposal prompt |
| Out | All modules | Approval Log entries | Cross-module segregation-of-duties detection |

### Shared Aikyat services used [NEW v3]

These are built once for all Aikyat modules and consumed here — this module does not build its own version of any of them. Statutory due dates use the existing Compliance Calendar module; the alert service adds operational alerts (expiries, SLAs, escalations) on top of it.

| Shared service | What this module uses it for |
| --- | --- |
| Document capture (OCR) | Customer purchase orders and bulk SO imports (4.9) |
| Duplicate / fuzzy-match engine | Duplicate SOs, duplicate customers, invoice duplicates |
| Risk-scoring engine | SO and credit note risk scores; customer risk band |
| Anomaly and SoD detection | Cut-off credit notes, cancelled-and-reissued invoices, SoD on the shared Approval Log |
| Calendar and alerts | Proforma expiry, e-way bill expiry, LUT expiry, contract rate expiry, credit review due |
| External verification gateway | GSTIN validation, IRN generation, e-way bills |
| Thresholds and tolerances master | Three-way-match tolerance, credit note and override thresholds |
| Management digest generator | Weekly sales exception summary |

## 3. Roadmap

| Phase | Scope | Depends on |
| --- | --- | --- |
| 1 | Sales Order + Delivery Challan (physical and notional), no approvals yet, Branch tagged from day one | Customer Master, Item Master, core accounting engine |
| 2 | Three-way match (SO ↔ DC ↔ Invoice), tolerance config, hard-block on orphan documents | Phase 1 |
| 3 | Sales Invoice posting, journal entry generation | Phase 2 |
| 4 | Maker-checker wired in via the shared Approval Rule engine | Phase 3, Operations Roles service |
| 5 | Credit Note (always checker-gated) | Phase 3 |
| 6 | Banking integration — receipt ingestion, bill-wise allocation, ageing. **[REVISED v3]** delivered by AR/AP Phase 1 (AR/AP §17); Sales keeps the Sales Receipt record | Phase 3, Banking receipt events, AR/AP Phase 1 |
| 7 | GST integration — e-invoice/IRN on Invoice post, IRN exception queue, e-way bill tracking, GSTR-1 match | Phase 3, GST module, Taxation Engine |
| 8 | Customer Credit Control + Customer Scorecard, gating new SOs, credit hold log, suggested limits | Phase 6 (needs ageing data), AR/AP Phases 1 and 8, Banking dishonour records |

Each phase builds on the one before it: SO and DC first, Invoice once that's stable, approvals layered in once the base flow works — not before.

**Cross-module dependencies [NEW v3]**

Some intelligence promised in an early phase depends on another module's later phase. Until the dependency lands, each feature falls back as shown rather than blocking the phase.

| Capability | Phase here | Needs first | Fallback until then |
| --- | --- | --- | --- |
| Credit check on every SO | 1 | AR/AP open items and ageing | Check against credit limit and invoices posted in Sales only |
| Realistic dispatch date and FEFO | 1 | Inventory stock by godown and batch expiry | Stock shown; no FEFO suggestion |
| Tax determined on invoices | 3 | Taxation Engine determination service | Rate from Item Master; overrides flagged for review |
| Risk-sorted approvals | 4 | Shared risk engine and Approval Log | Queue sorted by value and age |
| Customer rejected-invoice flag | 7 | Taxation Engine portal integration | Not shown |
| Risk band, suggested limits, scorecard payment metrics | 8 | AR/AP Phase 8 and Banking dishonour records | Manual risk band set by the Credit Controller |


## 4. Detailed Design

### 4.1 SO Engine

One screen: customer, branch, item lines with price pulled from Price List/Contract by default. Manual rate/discount override requires Checker approval before confirmation.

### 4.2 DC — configurable

DC is an on/off module per company. When enabled, every SO line produces a DC line, physical or notional; the notional variant for services is itself a further option, offered only when management wants it, not built in by default. When disabled, Sales Invoice can post directly against the SO. The DC also carries the Branch field (Section 5), whenever the module is on.

### 4.3 Inventory reduction method

Both Periodic and Perpetual inventory accounting are supported as a company-level toggle — a physical DC reduces stock immediately under Perpetual, or is picked up at period-end reconciliation under Periodic. A notional DC never touches inventory under either method.

### 4.4 DC on/off principle

DC is a company-level toggle, off by default for a simple invoice-only flow, switched on where management wants the extra dispatch-tracking control — and the Notional DC variant for services sits a level further in, on only if DC itself is on and management specifically wants service sales tracked the same way.

### 4.5 Bill-wise allocation

Every Sales Invoice carries **credit days** from the customer's payment terms; a Sales Receipt allocates against one or more open invoices by FIFO auto-suggestion or manual override, the standard bill-wise allocation mechanic, applied on the receivables side.

### 4.6 Invoice Generation

Invoice generation is a separate activity performed by the sales or accounting team, per company configuration — not a default automatic step off the DC. On generation, the GST module fires e-invoice, IRN and e-way bill generation as applicable; once the invoice exists, the accounting entry posts to the books automatically, with no separate manual posting step. A DC-wise check is available as a further step: a report flagging DCs with no corresponding Invoice yet, so nothing dispatched is left unbilled.

### 4.7 Collections

Out of scope for this module — receipt posting and allocation live here, but the cash movement itself (bank-side receipt entry) is handled in the Banking Module.

### 4.8 Design principle

The three-way match (SO ↔ DC ↔ Invoice) is the control backbone of this module — quantity and value can only ever step down the chain, never appear at a later stage with no upstream document to trace to.

### 4.9 Import Sales Orders

Bulk SO import (CSV/Excel) for customers migrating from another system — validated against Customer Master and Price List before creation, routed through the same credit-control gate as a manually entered SO.

### 4.10 Amendment & Cancellation

The forward-only chain (SO → DC → Invoice) needs an explicit exit path at each stage, not just a forward path:

- **SO cancellation** — allowed only while no DC/Invoice line references it; once any downstream document exists, the SO can only be closed via those documents (a Credit Note against the Invoice, not a direct SO edit)
- **DC amendment** — quantity/item corrections before the DC is invoiced go through a new DC line, never an edit to an already-referenced DC line, so the three-way match trail stays intact
- **Invoice cancellation** — not a delete; a Confirmed Invoice can only be reversed via a Credit Note for its full value, keeping the append-only principle consistent with Section 8's audit trail

### 4.11 Proforma Invoice

A Proforma Invoice is a quotation-grade document — same line-item shape as a Sales Invoice, but it never touches the accounting engine and carries no IRN. Used to request an advance payment or get customer sign-off before the real Invoice is raised. On customer confirmation it converts into a Sales Order (not directly into an Invoice), so it still passes through credit control and the three-way match like any other sale.

### 4.12 Debit Note

The counterpart to the Credit Note: raised against an existing Invoice to increase its value after posting — a freight charge added late, an under-billed rate correction. Same maker-checker discipline as the Credit Note (always Checker-gated, Section 8.3), and it posts an incremental Dr Customer / Cr Sales / Cr Output Tax entry rather than a reversal.

### 4.13 E-way Bill

Distinct from the IRN flow (Design goal 6) and given its own logic rather than being folded into "GST module fires e-invoice/IRN/e-way bill" (functional overview):

- Triggers only when the invoice value crosses the statutory threshold (currently ₹50,000) and physical movement of goods is involved — not for service sales or Notional DC
- Part-A (invoice/consignment details) generates with the Invoice; Part-B (vehicle number, transporter details) can be added at DC time or later, before the goods actually move
- Validity is distance-based and expires; a report flags e-way bills nearing expiry with goods still in transit, distinct from the DC-wise unbilled check in 4.6

### 4.14 Discount Treatment under GST

Two different discount paths, not one:

- **Discount known at or before the time of supply** (shown on the Invoice itself) reduces the taxable value directly — no separate document needed
- **Discount given after the Invoice is posted** (year-end rebate, volume-based scheme) can only reduce GST taxable value if a pre-agreement (contract or scheme terms) existed before the original supply and is documented against the Price List/Contract Rate entity (Section 2); otherwise the Credit Note must be raised without adjusting GST, since post-supply discounts fail the Section 15(3)(b) conditions by default
- The Credit Note (Section 2, 8.3) needs a flag distinguishing these two cases so GST treatment isn't applied uniformly by mistake

### 4.15 Advances against Sales Orders

Where a customer pays before the Invoice exists (common on large service orders), the Sales Receipt (4.7) needs a linkage back to GST-on-advance treatment for services — GST is payable on the advance itself in scenarios where it applies, ahead of the eventual Invoice. This sits alongside the existing "on account" allocation type (Core sales mechanics, Section 1) rather than replacing it — an advance is an "on account" receipt with an additional GST-on-advance flag, not a new receipt type.

### 4.16 Export & SEZ Sales

Not covered by the domestic Invoice flow as specified. Needed as a variant of Sales Invoice, not a new document type:

- Zero-rated supply, with the LUT (Letter of Undertaking) reference carried on the Invoice header where the company exports without paying IGST upfront
- Foreign currency invoicing — Invoice value and any advance receipt need a currency and exchange-rate field, distinct from the base-currency accounting entry
- Shipping Bill reference captured against the Invoice once goods are exported, needed for GST refund claims
- SEZ sales follow the same zero-rated logic but reference the buyer's SEZ registration instead of an export destination

### 4.17 Document Numbering

Every document type in Section 2 needs sequential numbering that resets each financial year, per the Document Numbering Series entity (Additional entities) — and, where a company holds more than one GSTIN (common in the multi-branch model, Section 5), a separate series per GSTIN rather than one global sequence, since GST rules require the invoice number to be unique within a GSTIN, not just within the company.

## 5. Multi-Branch

The design principle: **one centralized set of books**, Branch as a dimension on every document, not separate branch-wise books requiring consolidation.

### 5.1 Two models

| Model | Description | Chosen |
| --- | --- | --- |
| Centralized (dimension-based) | Single COA, Branch tagged on every transaction | Yes |
| Decentralized (separate books) | Each branch keeps its own ledger set, consolidated at period-end | No |

### 5.2 What changes per branch

- Sales Order is a mandatory single-branch document — one SO does not span branches (resolved in the Sales Engine Handbook's open questions)
- Customer credit limit can be global or branch-specific, per company configuration
- Price List can vary by branch where local pricing applies
- Ageing and Customer Scorecard roll up centrally but can be filtered by branch for review

### 5.3 Inter-branch sales

Goods or services sold from one branch's stock/team to fulfil another branch's customer order route through an **Inter-Branch Transfer** rather than a customer-facing SO between branches. Where the two branches sit in different states, the movement is a deemed supply under GST law — the two branches count as distinct persons, so the transfer attracts IGST and its own e-way bill/e-invoice even though no third-party customer is involved; same-state inter-branch movement carries no such tax event.

### 5.4 Data model impact

Every header table in Section 2 carries `branch_id` as a mandatory field.

### 5.5 Where it lands in the roadmap

Branch tagging ships in Phase 1, alongside the SO/DC base flow; branch-aware credit control and reporting land in Phase 8, alongside Customer Credit Control.

### 5.6 Stock transfers

A pure inter-branch stock move — no customer or sale involved — is a Stock Transfer Note, an Inventory-module document, not a Sales one; it revalues stock between branch locations at cost, with no revenue recognized. It only becomes a Sales concern when that stock is what fulfils a cross-branch customer order (Section 5.3), at which point the SO/DC/Invoice chain runs as normal from the fulfilling branch, tagged to it.

## 6. Services Sales

This scope includes service sales as a **distinct document flow inside the same module**, not a variant to bolt on later or a separate module.

### 6.1 What's different from goods sales

| Aspect | Goods sale | Service sale |
| --- | --- | --- |
| Delivery Challan | Physical, reduces inventory | Notional, zero inventory impact |
| SO line reference | Item Master | Service catalogue / description |
| Inventory linkage | Yes | None |
| Three-way match | SO ↔ DC ↔ Invoice, quantity-based | SO ↔ DC ↔ Invoice, value-based |

### 6.2 What carries over unchanged

Credit control, price list/contract pricing, maker-checker gates, bill-wise allocation, and GST/e-invoice triggering all apply identically to a service sale — only the DC's inventory behaviour and the match basis (quantity vs value) differ, per the Notional DC Rule already defined in the Sales Engine Handbook.

### 6.3 Where it lives

Services Sales sits inside this same Sales Module, using the Notional DC type flag rather than a parallel document set.

## 7. Build Steps for Engineers

Each phase below explains the business concept first, in plain terms, then gives the build steps. No prior accounting or ERP background assumed.

### Phase 1 — Core entities

**What an SO is:** a Sales Order is a record of what a customer has agreed to buy — item, quantity, price — before anything ships or gets billed. It's a promise, not a transaction; no money or stock moves yet.

**What a DC is:** a Delivery Challan (also called a delivery note) is the record of goods physically leaving the warehouse against that order. It's proof of dispatch — again, no billing happens here, it just says "this left the building, against this order."

**Steps:**

1. Create SalesOrder and DeliveryChallan tables (header + lines), with `branch_id`, `created_by`, `checked_by` (nullable), `created_at`, `checked_at` on every header from day one
2. Build create/get/list endpoints for both — no submit/approve logic yet
3. Add a `status` field with values Draft, Confirmed, PartiallyFulfilled, Closed — just the field, no transition rules enforced yet
4. Add DC's `type` field (physical/notional — notional meaning a service was delivered, not a physical good, so there's nothing to actually move) and the company-level on/off setting for whether DC is used at all
5. Stop here and get SO + DC create/read working end to end before touching matching logic

### Phase 2 — Three-way match

**What this is:** a control that checks three documents against each other — the Sales Order (what was promised), the Delivery Challan (what was dispatched), and later the Invoice (what was billed) — so nobody can bill for goods that were never sent, or send goods nobody ordered. "Three-way" just means three documents are cross-checked before anything is allowed to post cleanly.

**Steps:**

6. Add a `submit` endpoint on DC and Invoice that runs the match check: cumulative DC quantity vs. the SO line's quantity, cumulative Invoice quantity vs. the DC line's quantity
7. Add `tolerance_pct` as a company-config value (not hardcoded) — this is how much variance is allowed before it's flagged, e.g. dispatching 2% more than ordered might be fine, 20% more is not
8. Over-tolerance → status becomes PendingApproval (a human has to sign off); no matching SO/DC line at all → hard reject, don't even create the row
9. Write a test for: exact match, under-tolerance variance (passes), over-tolerance variance (routes to approval), orphan document with nothing to match against (rejected)

### Phase 3 — Invoice + accounting

**What an Invoice is:** the bill sent to the customer — this is where money actually gets owed. Unlike the SO (a promise) or the DC (proof of dispatch), the Invoice is a legal, accounting-relevant document: it creates a debt the customer now owes the company.

**What "posting a journal entry" means:** every accounting system tracks money using double-entry bookkeeping — every transaction touches at least two accounts, a debit and a credit, and they must balance. When an Invoice is raised, the system needs to record: the customer now owes money (debit to Customer/Receivable), and the company earned revenue (credit to Sales), plus any tax owed to the government (credit to Output Tax).

**Steps:**

10. Create a SalesInvoice table, with a `createFromDC(dc_id)` endpoint
11. On `post` (finalizing the invoice), call the core accounting engine's posting API to write the journal entry — don't write ledger rows directly from the Sales code, let the shared accounting service own that
12. Make sure the journal post and the status change happen atomically — if the accounting post fails, the Invoice's status must not flip to Confirmed

### Phase 4 — Maker-checker

**What this is:** a control where the person who creates or edits something is never the same person who approves it — "maker" creates, "checker" approves. This prevents one person from, say, both raising an invoice and approving their own invoice.

**Steps:**

13. Build an `ApprovalRule` table: `entity_type`, `trigger` (what condition causes a review), `threshold_value`, `required_role` (who has to approve)
14. On every `submit` across SO/DC/Invoice/CreditNote, check applicable rules and route to PendingApproval when one matches
15. Build `approve`/`reject` endpoints that check the caller's role against `required_role` before allowing the status to change
16. Point role lookups at the shared Operations Roles service (see Section 8) — don't build a separate Sales-only role table

### Phase 5 — Credit Note

**What this is:** a Credit Note is what gets issued when something about a sale needs to be reversed or corrected after the Invoice was already raised — a return, a pricing error, a discount applied late. It reduces what the customer owes, referencing the original Invoice it's correcting.

**Steps:**

17. Create a CreditNote table, always referencing an `invoice_id` — there's no standalone create path in the API, a Credit Note can't exist without an Invoice to correct
18. Force every CreditNote through PendingApproval regardless of value — this one is never auto-approved, since it reverses revenue that was already recognized
19. On `post`, reverse the original Invoice's Sales and Output Tax lines proportionately (i.e. by the same ratio the Credit Note covers)

### Phase 6 — Banking integration

**What this is:** once an Invoice is sent, the customer eventually pays — that payment is recorded in the Banking module (a separate part of the system that handles all money movement), and Sales needs to know which invoices that payment covers.

**Steps:**

20. Subscribe to the Banking module's receipt-posted event; when a receipt comes in, create a SalesReceipt row referencing the `bank_voucher_id`
21. Build `allocate(receipt_id, invoice_id, amount)` — matching a payment to the invoice(s) it settles — and `autoSuggestAllocation(receipt_id)`, which guesses the match using FIFO (settle the oldest open invoices first)
22. Validate `sum(allocations) <= receipt.amount` — reject over-allocation outright rather than routing it for approval, since it's a data error, not a judgment call
23. Recompute customer ageing (how overdue each unpaid invoice is) on every allocation

### Phase 7 — GST integration

**What this is:** in India, most invoices legally require an e-invoice with an IRN (Invoice Reference Number) issued by the government's GST system before they're valid. This has to happen automatically when an Invoice is posted, not as a separate manual step someone might forget.

**Steps:**

24. On Invoice `post`, call the GST module synchronously for e-invoice/IRN generation before finalizing the status
25. Decide and implement the failure path: block the Confirmed status until IRN succeeds, or allow a documented offline fallback with a retry queue — don't leave this undefined, since a failed call here has legal consequences

### Phase 8 — Credit control + scorecard

**What this is:** before letting a customer place a new order, check whether they already owe too much or are overdue on existing invoices — the same logic a bank uses before extending more credit to someone who hasn't paid off their last loan.

**Steps:**

26. Add the credit check to SO `create`/`submit`: if `open_receivable + new_SO_value > credit_limit`, route to approval; if the customer's `hold_flag` is set, hard block regardless
27. Build the Customer Scorecard aggregation job (on-time payment %, days-sales-outstanding, dispute frequency) off the ageing data produced in Phase 6
28. Wire the resulting risk classification into the credit-limit review process — this is a manual periodic review, not an automatic re-calculation

Don't start a phase before the one before it has working tests — Phase 3's accounting entries are meaningless if Phase 2's match logic isn't already enforced.

## 8. Operations: Roles, Controls & Rhythm

Who runs the Sales cycle day to day, and which module area each role owns. Named against the same Aikyat Roles sheet used for Banking and Purchase — overlapping functions (accounting entry, accounting review, compliance, audit) reuse the existing Role ID; pure sales/dispatch functions have no entry yet in the sheet slice available here, so their ID is marked proposed pending addition.

### 8.1 Operations Roles

Collections / Receivables Officer has no Purchase-side counterpart to reuse: Purchase's payment side is push-button and sits with Banking's Payments/Disbursement Officer (R06), while chasing customers for payment is active follow-up work that doesn't exist on the Purchase side at all — so this stays a new proposed role rather than a reused ID. Once the Trade Receivables & Trade Payables module is adopted, this role and the write-off approver move there (AR/AP §16–17); Sales keeps the Credit Controller gate. Section 8.7 sets out each role's detailed work list and the intelligence behind it.

| Role | Responsibilities | Sales module areas | Aikyat Role ID | Aikyat Role (Roles sheet) | Layer / Function |
| --- | --- | --- | --- | --- | --- |
| Sales Executive (Maker) | Prepares Proforma Invoices; raises the Sales Order (item/qty/rate, delivery terms); links DC/Invoice against the SO; raises Credit Notes (a return-type credit note only after the goods are recorded back in); flags SO exceptions rather than blocking the entry | Proforma Invoice, SO Engine, Invoice Generation, Credit Note (maker) | *New — R-S01 (proposed)* | Sales Executive *(proposed)* | Sales & Commercial — Order Management |
| Sales Manager (Approver) | Approves commercial terms on the SO — pricing, discount, delivery terms — ahead of any accounting approval; owns the Customer Scorecard once it lands | SO commercial approval, Customer Scorecard | *New — R-S02 (proposed)* | Sales Manager *(proposed)* | Sales & Commercial — Order Management |
| Credit Controller | Checks/approves customer credit limit and payment history before order confirmation or dispatch; places credit holds and requests their release from the Finance Controller; independent of Sales so targets don't pressure risky orders through — no Sales role can release a hold | Customer Credit Control, SO gating | *New — R-S03 (proposed)* | Credit Controller *(proposed)* | Corporate Support: Finance & Assurance — Credit Control |
| Stores / Inventory Officer | Records goods dispatched against the approved SO (qty, item, transport details); completes e-way bill Part-B before goods move; records goods returned by customers; tags Branch and Godown at entry; raises discrepancy notes (short stock, substitution) | Delivery Challan (physical/notional), e-way bill Part-B, sales returns (goods inward), Stock Transfers | *R-P02* | *Stores / Inventory Officer* | Operations & Supply Chain — Stores & Warehousing |
| Accounts Executive | Posts the Sales Invoice's accounting entries — bill-wise allocation, system-derived GST lines; raises Debit Notes; posts advances against SOs with the GST-on-advance flag; prepares export/SEZ invoices (LUT, currency, Shipping Bill); creates/edits the Customer Master | Invoice Generation, Bill-wise allocation, Customer Master (maker) | R01 | Accounting Operations Accountant | Corporate Support: Finance & Assurance — Accounting, Taxation |
| Accounts Manager (Checker) | Approves Sales Invoices above the value threshold, and every Credit Note and Debit Note; reviews three-way-match variances before posting; confirms Customer Master edits; owns month-end revenue cut-off (dispatched-not-billed) | Invoice approval, Customer Master (checker), three-way match | R02 | Accounting Review & Close Accountant | Corporate Support: Finance & Assurance — Accounting, Taxation |
| Collections / Receivables Officer | Tracks outstanding receivables, follows up on overdue invoices, records and allocates customer receipts against invoices — ownership moves to AR/AP §16 once that module is adopted | Sales Receipt allocation, Ageing | *New — R-S05 (proposed)* | Collections & Receivables Officer *(proposed)* | Corporate Support: Finance & Assurance — Accounts Receivable |
| Finance Controller (Write-off Approver) | Approves credit-hold releases; gives second approval on Credit Notes above threshold (after the Accounts Manager); approves bad-debt write-offs per AR/AP §16; distinct from Collections, so it can't self-approve what it collected elsewhere | Credit-hold release, Credit Note (second approval), Receivables write-off | *New — R-FC01 (proposed; distinct from R02, per AR/AP open decision 9)* | Finance Controller | Corporate Support: Finance & Assurance — Accounting |
| Compliance Officer | Reviews and logs overrides on system-derived GST rate on sales; owns e-invoice/IRN exception handling and e-way bill expiry monitoring; validates the post-supply discount (15(3)(b)) flag and GST-on-advance treatment; maintains LUT validity for exports; owns Sales Register vs GSTR-1 reconciliation (Section 9); tracks cross-branch deemed-supply GST treatment on Inter-Branch Transfers | Tax and statutory compliance, Stock Transfers (cross-GSTIN) | R24 | Compliance Reviewer / Officer | Corporate Support: Governance, Legal & Compliance — Regulatory Compliance; also Finance & Assurance — Taxation (GST policy oversight) |
| Internal Auditor | Reviews the append-only Approval Log and posted exceptions — credit overrides, match-variance approvals, write-offs — and can raise a query directly against an invoice or approval for the relevant Checker to action | Approval Log, audit trail | R09 | Internal Auditor | Corporate Support: Finance & Assurance — Audit & Controls |
| CEO / Management (view-only) | Reads the Customer Scorecard and sales exception summary; drills down only on flagged variances | Customer Scorecard | R32 | Business owner *(proposed)* | Cross-cutting — Whole company |

### 8.2 Activity-wise role allocation

| Activity | Module reference | Responsible (Maker) | Approving / Reviewing (Checker) |
| --- | --- | --- | --- |
| Proforma Invoice | 4.11 Proforma Invoice | Sales Executive | — (non-accounting; converts to an SO that is approved normally) |
| Raise Sales Order | SO Engine | Sales Executive | Sales Manager |
| Credit check / hold | Customer Credit Control | Credit Controller | — (independent gate, not a second approver) |
| Credit-hold release | Customer Credit Control | Credit Controller (requests) | Finance Controller |
| Record Dispatch (DC) | Delivery Challan — configurable | Stores / Inventory Officer | — (variance caught at three-way match) |
| E-way bill Part-B and expiry monitoring | 4.13 E-way Bill | Stores / Inventory Officer (Part-B) | Compliance Officer (expiry and missing e-way bills) |
| Record goods returned by customer | 4.10, Credit Note | Stores / Inventory Officer | — (releases the return credit note for approval) |
| Generate Sales Invoice | Invoice Generation | Accounts Executive (or Sales Executive, per config) | Accounts Manager |
| Bill-wise allocation & credit days | Bill-wise allocation | Accounts Executive | Accounts Manager |
| DC-wise unbilled check | Invoice Generation | Accounts Executive | Accounts Manager |
| Sales Receipt allocation | Sales Receipt — moves to AR/AP §5 | Collections / Receivables Officer | Accounts Manager |
| Credit Note (return/adjustment) | Credit Note | Sales Executive (raises) | Accounts Manager, always; Finance Controller as well above threshold |
| Post-supply discount GST flag | 4.14 Discount Treatment | Sales Executive (sets on the credit note) | Compliance Officer |
| Debit Note | 4.12 Debit Note | Accounts Executive | Accounts Manager, always |
| Advance against SO (GST on advance) | 4.15 Advances | Accounts Executive | Compliance Officer, where GST on advance applies |
| Export / SEZ invoice (LUT, Shipping Bill) | 4.16 Export & SEZ | Accounts Executive | Compliance Officer (LUT validity) |
| Receivables write-off | Receivables write-off — moves to AR/AP §10 | Collections / Receivables Officer (requests) | Accounts Manager or Finance Controller by threshold (AR/AP §16.3) |
| Three-way match / tolerance routing | Section 4.8 — Design principle | Stores / Inventory Officer / Accounts Executive (raises exception) | Accounts Manager |
| GST/tax compliance & overrides | Tax and statutory compliance | Accounts Executive (requests) | Compliance Officer |
| Inter-Branch stock transfer | Section 5.6 — Stock transfers | Stores / Inventory Officer, both branches | Compliance Officer, on cross-GSTIN treatment |
| Customer Master create/edit | Additional entities — Customer Master | Accounts Executive | Accounts Manager |
| IRN / e-invoice exceptions, GSTR-1 reconciliation | Design goal 6, Section 9 | Compliance Officer | — |
| Month-end revenue cut-off (dispatched-not-billed) | 4.6 Invoice Generation | Accounts Executive | Accounts Manager |
| Customer Scorecard / risk review | Customer Scorecard | Sales Manager | CEO / Management (view-only) |
| Approval Log review / audit | Approval Log, cross-cutting | Internal Auditor | — |

### 8.3 Maker-Checker Matrix

| Control point | Maker | Checker | Trigger |
| --- | --- | --- | --- |
| Customer Master create/edit | Accounts Executive | Accounts Manager | Every creation or edit to bank/credit-limit/GSTIN details — no threshold |
| Sales Order (commercial terms) | Sales Executive | Sales Manager | Above a to-be-set value/discount threshold (pending management decision) |
| Sales Invoice | Accounts Executive | Accounts Manager | Above the value threshold matching Banking and Purchase's existing matrix |
| Credit Note | Sales Executive | Accounts Manager; Finance Controller as well above threshold | Every Credit Note, any value — always checker-gated; a return-type credit note also needs the goods recorded back in first |
| Debit Note | Accounts Executive | Accounts Manager | Every Debit Note, any value — always checker-gated (functional overview) |
| Receivables write-off | Collections / Receivables Officer | Accounts Manager below threshold, Finance Controller above it | Every write-off (AR/AP §16.3 governs once adopted) |
| Three-way match variance (SO/DC/Invoice) | Stores / Inventory Officer / Accounts Executive (raises) | Accounts Manager | Any variance beyond the configurable tolerance — routes to approval instead of posting silently |
| Credit hold release | Credit Controller (requests) | Finance Controller only — not the Sales Manager, since the gate exists to keep sales targets from pushing risky orders through | Every credit-hold override |
| Tax override | Accounts Executive (requests) | Compliance Officer; Finance Controller as well above the value threshold | Any manual override of system-derived GST — logged regardless of outcome (aligned with Taxation Engine §4) |
| Post-supply discount reducing GST | Sales Executive (sets flag) | Compliance Officer | Every credit note that reduces GST taxable value after supply |

### 8.4 Branch-Level Role Split

Under the centralized model (Section 5.1), branches don't get their own books or their own copy of a role — they get their own instance of the transaction-level roles, all posting into the same set of books:

- **Accounts Executive / Accounts Manager (Customer Master) stay HQ-only.** Credit terms and pricing tiers are negotiated once; a branch transacts against the shared customer rather than creating its own record.
- **Sales Executive, Stores / Inventory Officer and Sales Manager exist per branch.** Each branch raises and dispatches its own SOs (or transacts against an HQ-raised SO), tagging every document with its own Branch field.
- **Inter-Branch Transfer role.** A Stores / Inventory Officer at both the source and destination branch handles the transfer; where branches sit under separate GST registrations, the Compliance Officer confirms the deemed-supply GST treatment.
- **Credit Controller, Compliance Officer, Finance Controller (write-off) and the Internal Auditor stay centralized at HQ**, since branch-wise reporting is a filter on the single book rather than a separate consolidation each branch owns.

### 8.5 Operating Rhythm

- **Daily:** Sales Executive raises SOs and posts exceptions; Stores / Inventory Officer records dispatches and tags Branch; Accounts Executive generates invoices; Accounts Manager clears same-day approvals.
- **Daily (additional):** Accounts Executive clears the DC-wise unbilled list; Compliance Officer clears IRN exceptions and e-way bill expiry alerts; Credit Controller reviews SOs waiting on credit.
- **Weekly:** Sales Manager reviews open SO ageing and three-way-match exceptions; Collections / Receivables Officer follows up overdue invoices (AR/AP once adopted); Compliance Officer reviews the tax-override log; Finance Controller reviews credit-hold releases requested.
- **Month-end:** Accounts Manager approves the revenue cut-off (dispatched-not-billed accrual); Sales Manager reviews the price-override report; Finance Controller signs off receivables write-offs and ageing; Compliance Officer completes e-invoice/IRN exception reconciliation; Internal Auditor reviews the Approval Log.

### 8.6 Segregation of Duties (non-negotiable)

- The person who raises a Sales Order never approves its commercial terms.
- The person who generates a Sales Invoice never approves it.
- The person who creates or edits the Customer Master does not approve a Sales Invoice against that customer.
- The person who records the Delivery Challan is not the person who approves the matching Invoice.
- The person who collects receivables does not approve their own write-offs.
- No Sales role (Sales Executive or Sales Manager) releases a credit hold.
- A return-type Credit Note cannot post until a different person, the Stores / Inventory Officer, has recorded the goods back in.

### 8.7 Role-wise Work List & Intelligence

For each role: the work it performs, when, and what Aikyat's intelligence layer does behind it. The operator reviews and confirms; the system does the searching, matching, checking and flagging in the background (Design goal 3). Every flag is an alert for a person to act on, never a silent auto-rejection — the only hard blocks stay the ones this scope already defines (orphan documents, credit hold flag, IRN failure).

#### 8.7.0 Key problems today and how Aikyat solves them

| # | Problem today (Tally / Excel) | What it costs | How Aikyat solves it | Owning role(s) |
| --- | --- | --- | --- | --- |
| 1 | Goods dispatched but never invoiced, or invoiced short | Straight revenue leakage, found months later if at all | DC-wise unbilled list with ageing; three-way match blocks orphan documents; daily "dispatched yesterday, not billed" alert | Accounts Executive, Accounts Manager |
| 2 | Orders accepted from customers already overdue or over limit | Bad debts, blocked working capital | Credit gate on every SO using live AR/AP exposure; risk band from payment behaviour, not just the limit number; hold release only by Finance | Credit Controller, Finance Controller |
| 3 | Unauthorised discounts and rates below the price list | Margin erosion that nobody can trace to a person | Price pulled from Price List/Contract; every override needs approval and is reported by salesperson, customer and item | Sales Manager |
| 4 | IRN/e-invoice failures and e-way bills expiring with goods in transit | Invoice not legally valid, penalties and goods detained on the road | IRN retry queue with reasons; e-way Part-B reminder before dispatch; expiry alert while goods are still in transit | Compliance Officer, Stores / Inventory Officer |
| 5 | Books don't match GSTR-1, and customers complain their ITC is missing | Notices, strained customer relationships, delayed payments | Monthly Sales Register vs GSTR-1 match; flag invoices a customer has rejected in IMS | Compliance Officer |
| 6 | Credit notes used to hide returns, discounts or collection failures | Revenue reversed without trace; wrong GST reduction on post-supply discounts | Every credit note checker-gated; return credit notes need goods received back first; 15(3)(b) pre-agreement check before GST is reduced | Sales Executive, Accounts Manager, Compliance Officer |
| 7 | Customer TDS deducted but never matched to 26AS, and short payments left "on account" | Tax credit lost; receivables that never clear | Owned by AR/AP (Sections 9 and 16 there) — Sales supplies the invoice data | AR/AP Collections Officer |

#### 8.7.1 Sales Executive (Maker) — R-S01 (proposed)

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Prepare Proforma Invoice / quotation | Per enquiry | Pulls price from the Price List/Contract; shows the customer's last 3 rates and current exposure before the quote goes out; tracks validity and flags Proformas close to expiry with no conversion |
| Raise Sales Order | Per order | Price and payment terms default from the Price List and Customer Master; shows available stock by godown and a realistic dispatch date; runs the credit check in the background and says why if the order will need approval |
| Request price or discount override | As needed | Shows margin impact and the customer's historical discount level; routes to the Sales Manager with the reason attached |
| Check for duplicate orders | Per order | Flags same customer + same item + similar quantity within a short window, including bulk-imported SOs (4.9) |
| Follow up on open orders | Daily | Lists SO lines pending dispatch, by age and value, with stock availability so the Executive can tell the customer a real date |
| Raise Credit Notes (return, price, post-supply discount) | As needed | Pre-fills from the original invoice; a return-type credit note waits until the Stores / Inventory Officer records the goods back in; asks whether a pre-agreed scheme exists so the 15(3)(b) GST flag is set correctly |

#### 8.7.2 Sales Manager (Approver) — R-S02 (proposed)

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Approve SO commercial terms above threshold | Daily | Risk-sorted queue: largest discount vs price list, below-cost rates, new customers and unusual quantities first, each with margin shown |
| Review open SO ageing and three-way-match exceptions | Weekly | Groups pending orders by reason (stock short, credit hold, awaiting customer) so the bottleneck is visible |
| Review discount and price-override pattern | Monthly | Override report by salesperson, customer and item; flags salespeople whose override rate is well above the team's |
| Own the Customer Scorecard | Monthly | On-time payment %, DSO, return and dispute frequency per customer, read from AR/AP; suggests customers for credit-limit review |
| Maintain Price List / Contract Rates | As needed | Flags customers still billed on an expired contract rate and items whose selling price has fallen behind cost |

#### 8.7.3 Credit Controller — R-S03 (proposed)

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Review SOs routed for credit approval | Daily | Shows exposure (open invoices + open SOs + dispatched-not-billed), overdue amount, days-past-due trend and any bounced receipts in one view |
| Place credit holds | As needed | Suggests holds for customers whose payment behaviour is deteriorating (DSO rising, promises to pay broken), before they cross the limit |
| Request hold release | As needed | Routes to the Finance Controller with the exposure summary; Sales roles cannot release a hold |
| Periodic credit-limit review | Quarterly | Suggested limit per customer from payment history, order volume and dispute rate; limits not reviewed in 12 months are listed |

#### 8.7.4 Stores / Inventory Officer — R-P02 (proposed)

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| View dispatch plan | Daily, start of day | "Due to dispatch today" list by godown from confirmed SOs, with stock availability and credit-hold status so nothing on hold is picked |
| Record Delivery Challan (qty, item, transport details) | Per dispatch | Pre-fills from the SO line; warns on over-dispatch beyond tolerance, wrong item/UOM, or batch near expiry (FEFO suggestion) |
| Complete e-way bill Part-B | Per dispatch | Reminds when an invoice needs an e-way bill and Part-B is still empty before the vehicle leaves |
| Record goods returned by customers | Per return | Matches the return to the original DC/invoice and batch/serial; releases the linked credit note for approval |
| Handle inter-branch transfers | Per transfer | Stock-in-transit ageing; flags cross-state transfers that need an e-way bill/e-invoice |

#### 8.7.5 Accounts Executive (Maker) — R01

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Generate Sales Invoices | Daily | Pulls uninvoiced DC lines; checks HSN, GST rate and place of supply against the customer's GSTIN and ship-to state; flags duplicates |
| Clear the DC-wise unbilled list | Daily | Ageing of dispatched-not-billed DCs with value, so the oldest and largest are billed first |
| Raise Debit Notes (late freight, rate correction) | As needed | Pre-fills from the original invoice; always routed to the Accounts Manager |
| Post advances against SOs | Per advance | Flags advances where GST on advance applies (services); links the advance to the SO so it adjusts automatically on invoicing |
| Export and SEZ invoices | Per invoice | Checks a valid LUT exists for the GSTIN on the invoice date; captures currency and rate; reminds for the Shipping Bill reference |
| Create/edit Customer Master | As needed | GSTIN validation against the portal, PAN–GSTIN consistency, duplicate customer detection, and credit-limit fields routed to the Credit Controller's review |

#### 8.7.6 Accounts Manager (Checker) — R02

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Clear the approval queue (invoices, credit notes, debit notes) | Daily | Risk-sorted: credit notes and below-price invoices first, each with a one-line reason for the flag |
| Approve three-way-match variances | Daily | SO, DC and invoice side by side with the variance highlighted |
| Confirm Customer Master edits | Per edit | Field-level change shown against GST portal data |
| Month-end revenue cut-off | Month-end | Dispatched-not-billed list for accrual; invoices dated in the period with DC dated after it; unapplied advances |

#### 8.7.7 Finance Controller — R-FC01 (proposed)

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Approve credit-hold releases | As requested | Exposure, overdue, payment history and the size of the order waiting, in one screen; logs every release for the Internal Auditor |
| Second approval on credit notes above threshold | As requested | Credit note value against the original invoice, the reason code, and the customer's credit-note history |
| Receivables write-offs and provisions | Per AR/AP §10 and §16 | Owned by the AR/AP module |

#### 8.7.8 Compliance Officer — R24

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Handle IRN/e-invoice exceptions | Daily | Retry queue with the GSTN error reason; invoices on offline fallback listed until an IRN is received |
| Monitor e-way bills | Daily | E-way bills nearing expiry with goods still in transit; invoices over the threshold with no e-way bill |
| Approve tax overrides | As requested | Override log with pattern view by user and customer, and the tax impact |
| Validate post-supply discount and GST-on-advance treatment | As requested | Checks the pre-agreement exists on the Price List/Contract before GST is reduced on a credit note; checks GST-on-advance was paid where it applies |
| Maintain LUT validity for exports | Annually and per export | Flags GSTINs whose LUT expires in the next 30 days, and export invoices raised without a valid LUT |
| Sales Register vs GSTR-1 and HSN summary | Monthly | Auto-match of books to GSTR-1; missing-in-return and missing-in-books lists; HSN summary built from item master data |
| Cross-GSTIN inter-branch transfers | Per transfer | Confirms the deemed-supply tax invoice and e-way bill exist |

#### 8.7.9 Internal Auditor — R09

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Review the Approval Log | Month-end | Segregation-of-duties violation detection (e.g. same user raised and approved an SO, or recorded the DC and approved the invoice) |
| Review credit-hold releases, price overrides and credit notes | Monthly | Trends by user, customer and branch; credit notes raised soon after period-end against invoices booked just before it (cut-off manipulation pattern) |
| Anomaly analytics | Quarterly | Sales to new customers with no credit history at high value, round-sum invoices, invoices cancelled and re-raised at a lower rate |

#### 8.7.10 CEO / Management (view-only) — R32

| Work item | When | Intelligence Aikyat adds |
| --- | --- | --- |
| Read the sales exception summary | Weekly | Narrative digest: sales vs last period, margin change, largest overrides, orders stuck on credit hold, unbilled dispatches |
| Review the Customer Scorecard | Monthly | Top and bottom customers by payment behaviour, concentration risk, customers moving to a worse risk band |

Collections / Receivables Officer's work list lives in the AR/AP module (§16), where that role's ownership now sits.

#### 8.7.11 Where the intelligence lands in the roadmap

Price defaults, duplicate checks, GSTIN/HSN validation and dispatch lists land with **Phases 1–3**. Risk-sorted approval queues and SoD detection come with **Phase 4**. Credit-note checks with **Phase 5**. IRN retry, e-way expiry and GSTR-1 matching with **Phase 7**. Credit-risk suggestions, the Customer Scorecard and the management digest with **Phase 8**, once AR/AP ageing data exists.

## 9. GST Reporting & Reconciliation

Outputs the module needs to produce for statutory filing, distinct from the internal DC-wise unbilled check (4.6):

- **Sales Register vs GSTR-1 reconciliation** — every Confirmed Invoice (and Credit/Debit Note) in a filing period matched against what was actually reported in GSTR-1, flagging Invoices posted in the books but missing from the return (and vice versa)
- **HSN-wise summary** — aggregated by HSN/SAC code across the period, the standard input to the GSTR-1 HSN summary table, drawn from the stock-item/ledger-level GST configuration already in Core sales mechanics (Section 1)
- **E-invoice/IRN reconciliation** — Invoices marked Confirmed but missing a successful IRN response (the documented offline fallback from Design goal 6), so nothing slips through as a silent exception
- Owned by the Compliance Officer (Section 8.1) as a monthly rhythm item, alongside the existing e-invoice/IRN exception reconciliation in Section 8.5

## Revision Notes (v3, Sep 26, 2026)

The Section 8 work lists promised intelligence that the data model and roadmap couldn't support. Closed by:

- Sales Order: credit snapshot, risk score, duplicate check and price-override fields.
- Delivery Challan: e-way bill fields and batch/serial.
- Sales Invoice: IRN status, tax determination id and customer IMS action.
- Credit Note: return-receipt link, 15(3)(b) pre-agreement reference and second approver.
- Customer Master: risk-band source and credit-review dates.
- New records: Credit Hold Log, Price Override Log, Sales Return Receipt and IRN Exception Queue.
- The Customer Scorecard now reads payment metrics from AR/AP and dishonours from Banking.
- New subsections: data exchanged with other modules; shared services used.
- Roadmap: Phase 6 delivery moved to AR/AP, and a cross-module dependency table with fallbacks added.
