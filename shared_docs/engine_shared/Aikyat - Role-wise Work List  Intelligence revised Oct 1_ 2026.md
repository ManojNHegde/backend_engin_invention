# Aikyat — Role-wise Work List & Intelligence

Each role lists the modules it works in, its responsibilities, the work list with the intelligence Aikyat adds, and what it makes and approves.

*Compiled Sep 25, 2026 from the updated module scopes; revised Sep 28, 2026 after the role-wise review, and Oct 1, 2026 to add the Billing Executive (see Revision notes). Arranged by role: each role lists every module it works in, with its responsibilities, full work list and the intelligence Aikyat runs behind each task, and what it makes and approves there. Roles run in business-flow sequence, from buying through selling, recording, collecting and paying, banking, payroll, compliance and oversight. Within each role, modules follow the same flow: Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, then Vouchers & Ledgers and Period Close, Notice & Litigation, Labour Compliance and FEMA / RBI. Role IDs marked "proposed" still need adding to the Aikyat Roles sheet.*

## Revision notes (Sep 28, 2026)

1.  **Ledger and close ownership.** A new "Vouchers & Ledgers and Period Close" module is added for the Accounts Executive (11.8), Accounts Manager (12.8), Finance Controller (22.8), Internal Auditor (23.8) and CEO / Management (24.8). The chart of accounts and ledgers are set up at migration; after go-live the Accounts Manager owns them. The Accounts Manager reviews the trial balance, runs the close checklist and prepares the financial statements; the Finance Controller approves them and applies one company-wide period lock. The former per-module locks (AR/AP, Inventory, Fixed Assets) are now module closes that feed that single lock.

2.  **Maker–checker lists de-duplicated.** Each record now appears once per list with one checker. FX revaluation (AR/AP open items and foreign-currency bank accounts) is a regular month-end entry checked by the Accounts Manager. The Sales Manager no longer approves credit-hold releases; the Sales Manager, like the Credit Controller, can only request a release, which the Finance Controller approves. The Reconciliation Executive flags dishonours and unrecorded lines; only the Accounts Executive makes the reversal voucher.

3.  **Decisions moved to the right side.** Costing-method configuration is an accounting policy owned by the Accounts Manager and approved by the Finance Controller; the Inventory Controller gives operational input. Works Orders are approved commercially by the Procurement Manager only; the Accounts Manager approves the service bills posted against them. The Internal Auditor is no longer a checker anywhere.

4.  **Masters follow Business Core.** Party identity (name, PAN, GSTIN, addresses) and party links or merges are maintained in Business Core. The finance modules maintain only finance fields on the party (credit terms, ledger mapping, bank details, credit limit, tax tagging).

5.  **Missing work added.** Supplier credit notes received (11.1), payroll journal posting from HR's accounting output PO-06 (11.8), employee expense claims and petty cash (11.8), job work and ITC-04 (4.2, 6.1, 12.6, 21.6), service completion confirmation against a Works Order (2.1, 11.1), and making and checking the opening trial balance (11.8, 12.8, 22.8).

6.  **Machinery defined, dangling references removed.** "Payment advice" is defined below as a system hand-off, not a checker. Receipt ownership sits in AR/AP regardless of which modules a company adopts. References to section numbers in specs outside this repo have been replaced by plain descriptions.

7.  **E-invoice and e-way bill (Sep 29, 2026).** Generation of the IRN and e-way bill Part-A is a system step on the Accounts Manager's invoice approval; Part-B and e-way bills for non-invoice movements sit with the Stores / Inventory Officer; cancellations within 24 hours are requested by the Accounts Executive and approved by the Accounts Manager; exceptions and expiry stay with the Compliance Officer.

8.  **Tax, labour and FEMA additions (Sep 29, 2026).** Disallowance triggers flagged at voucher entry (40A(3), 269ST, 269SS/T, 40(a)(ia), 43B-equivalents); GST extras (Sec 16(4) ITC and credit-note time limits, Rule 86B, 17(5) auto-tagging, registration amendments and additional places of business); a monthly "department's view" cross-match with a notice-risk score; and three new modules — Notice & Litigation (every authority), Labour Compliance (company-level, including principal-employer checks on contractors) and FEMA / RBI.

9.  **Billing Executive added (Oct 1, 2026).** A dedicated Finance role, the Billing Executive (10, R-B01, proposed), now issues Sales Invoices, Credit Notes, Debit Notes, export/SEZ invoices and GST Receipt / Refund Vouchers, and requests IRN and e-way bill cancellations within 24 hours. Selling, billing and collecting are kept as three separate powers: Sales sets price and terms, Billing turns what was supplied into a valid document, Collections applies the cash. The Sales Executive no longer issues Credit Notes and the "Sales generates invoices, per config" option is dropped; the Sales Executive requests a commercial adjustment, the Sales Manager approves its reason and value, and Billing issues the note. The Accounts Executive keeps customer finance fields (now including billing instructions) and advances. Roles from the Accounts Executive onwards move down one number (Accounts Executive is now 11, CEO / Management 24); this supersedes the cancellation-requester wording in note 7.

## Definitions used in this document

- **Business Core** — the authoritative party and organisation master. Party identity (legal name, PAN, GSTIN, addresses, contacts) and links or merges between party records are made and checked there, under Business Core's own maker–checker. Finance modules read identity from Business Core and maintain only their finance fields.
- **Payment advice** — the system's hand-off of an approved payment proposal or approved customer refund to Banking, where it arrives as a payment voucher ready for release. It is a system step, not an approver; the approval is the Accounts Manager's (or Finance Controller's, by slab).
- **Module close** — a module's month-end readiness step (sub-ledger reconciled to its control account, nothing pending approval), confirmed by the Accounts Manager.
- **Period lock** — the single company-wide lock applied by the Finance Controller once every module close is in and the trial balance is signed off. Only the Finance Controller can reopen a locked period, with a logged reason.
- **E-invoice and e-way bill** — once the Accounts Manager approves a Sales Invoice, the system sends it to the Invoice Registration Portal and stores the IRN and signed QR code, and generates e-way bill Part-A from the invoice where the consignment needs one. These are system steps, not approvals; failures go to the Compliance Officer's exception queue. Where e-invoicing applies, the Delivery Challan can't be released until the IRN exists. The Stores / Inventory Officer completes Part-B (vehicle and transport) before goods move. Movements without a tax invoice (job work, returns to vendors, goods on approval) get an e-way bill against the delivery challan, generated by the Stores / Inventory Officer.
- **Income-tax section references** — sections are cited by their Income-tax Act, 1961 numbers with "-equivalent" (e.g. 40A(3)-equivalent), meaning the corresponding provision of the Income-tax Act, 2025.
- **Notice-risk score** — a monthly score by GSTIN and by tax, built from the same cross-matches the tax authorities run (GSTR-1 vs GSTR-3B vs e-invoice vs e-way bill; turnover in GST vs ITR vs 26AS/AIS; TDS claimed vs deposited). Each unexplained difference raises the score.
- **Service completion confirmation** — the services equivalent of a GRN: the requesting department head (the service receiver) confirms in Aikyat that a milestone or service under a Works Order was actually delivered.

## Contents

| \# | Stage | Role | Role ID | Modules |
|---|---|---|---|---|
| 1 | Stage 1. Buy and store | Procurement Officer | R-P01 (proposed) | Purchase |
| 2 | Stage 1. Buy and store | Contracts & Services Procurement Officer | R-P03 (proposed) | Purchase, Labour Compliance |
| 3 | Stage 1. Buy and store | Procurement Manager | R-P04 (proposed) | Purchase |
| 4 | Stage 1. Buy and store | Stores / Inventory Officer | R-P02 (proposed) | Purchase, Inventory, Sales, Fixed Assets |
| 5 | Stage 1. Buy and store | Quality Inspector / QC Officer | R-P05 (proposed) | Purchase |
| 6 | Stage 1. Buy and store | Inventory Controller | R-P06 (proposed) | Inventory |
| 7 | Stage 2. Sell and control credit | Sales Executive | R-S01 (proposed) | Sales |
| 8 | Stage 2. Sell and control credit | Sales Manager | R-S02 (proposed) | Sales |
| 9 | Stage 2. Sell and control credit | Credit Controller | R-S03 (proposed) | Sales, AR/AP |
| 10 | Stage 3. Record and approve | Billing Executive | R-B01 (proposed) | Sales, AR/AP, Taxation, FEMA / RBI |
| 11 | Stage 3. Record and approve | Accounts Executive | R01 | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Vouchers & Ledgers and Period Close, FEMA / RBI |
| 12 | Stage 3. Record and approve | Accounts Manager | R02 | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Vouchers & Ledgers and Period Close, Notice & Litigation, Labour Compliance, FEMA / RBI |
| 13 | Stage 4. Collect and pay | Collections / Receivables Officer | R-S05 (proposed) | Sales, AR/AP, FEMA / RBI |
| 14 | Stage 4. Collect and pay | Accounts Payable Officer / Payables Executive | R-AP01 (proposed) | AR/AP, Labour Compliance, FEMA / RBI |
| 15 | Stage 5. Bank and treasury | Master Administrator | R06a | Banking |
| 16 | Stage 5. Bank and treasury | Payments / Disbursement Officer | R06b | AR/AP, Banking, Taxation, Notice & Litigation |
| 17 | Stage 5. Bank and treasury | Reconciliation Executive | R01b (proposed) | Banking |
| 18 | Stage 5. Bank and treasury | Treasury / Finance Head | R06 | Banking, FEMA / RBI |
| 19 | Stage 6. Payroll (HR-owned) | Payroll Operations Specialist | HR module | Taxation |
| 20 | Stage 6. Payroll (HR-owned) | Payroll & Statutory Compliance Specialist | HR module | Taxation, Labour Compliance |
| 21 | Stage 7. Comply and sign off | Compliance Officer | R24 | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Notice & Litigation, Labour Compliance, FEMA / RBI |
| 22 | Stage 7. Comply and sign off | Finance Controller | R-FC01 (proposed) | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Vouchers & Ledgers and Period Close, Notice & Litigation, Labour Compliance, FEMA / RBI |
| 23 | Stage 8. Assure and oversee | Internal Auditor | R09 | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Vouchers & Ledgers and Period Close, Notice & Litigation, Labour Compliance, FEMA / RBI |
| 24 | Stage 8. Assure and oversee | CEO / Management | R32 | Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Vouchers & Ledgers and Period Close, Notice & Litigation |

# Stage 1. Buy and store

## 1. Procurement Officer — R-P01 (proposed)

### 1.1 Purchase Module

**Responsibilities:** Raises the Purchase Order (item/qty/rate, delivery terms); links Purchase Voucher against PO/GRN where one exists; follows up overdue POs; raises three-way-match exceptions; flags PO or OCR exceptions rather than blocking the entry

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Identify what needs to be bought | Daily | Reorder suggestions from Item Master reorder level, current stock and consumption trend — a "suggested PO" list instead of the officer hunting for shortages |
| Select vendor and rate | Per PO | Shows the last 3 purchase rates, the best rate in the last 6 months and the vendor's scorecard; warns if the chosen vendor is costlier or has a poor delivery record |
| Raise Purchase Order (item, qty, rate, delivery date, ship-to branch/godown) | Per PO | Predicts a realistic delivery date from the vendor's actual lead-time history, not just the promised one; auto-derives GST treatment from the branch pair and vendor state |
| Check for duplicate or split POs | Per PO | Flags same vendor + same item + open PO already existing; flags multiple POs just under the approval threshold (split-PO pattern) |
| Follow up on overdue POs | Daily | Auto-lists POs past expected delivery with no GRN, ranked by value and days late; drafts the vendor follow-up message |
| Raise three-way-match exceptions | As they arise | Pre-computes the variance (qty/rate/value) and suggests the likely reason (short supply, rate revision, freight added) |
| Short-close or amend POs | As needed | Suggests POs to short-close (partially received, no movement for a configurable number of days) |

**Makes / prepares:**

- **Purchase Order (commercial terms)** — *Checked by* Procurement Manager
- **OCR document capture** — *Checked by* Accounts Manager, on low-confidence flagged fields
- **Three-way match variance (PO/GRN/Voucher)** — *Checked by* Accounts Manager
- **Reorder / min-max level proposal** — *Checked by* Inventory Controller

## 2. Contracts & Services Procurement Officer — R-P03 (proposed)

### 2.1 Purchase Module

**Responsibilities:** Raises the Works Order/Agreement for services, contract jobs, job work and professional fees, in place of a PO; tracks milestones, contract value consumed and expiry; obtains the service completion confirmation from the requesting department head before a service bill can be matched; uses the shared party record from Business Core, bill-wise and Branch logic, with no inventory linkage (goods sent for job work move through Inventory)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Raise Works Order/Agreement (scope, value, milestones, duration) | Per contract | Templates from similar past agreements; suggests the TDS payment code (contractor vs professional fees; legacy 194C vs 194J) and GST/RCM applicability from service type and vendor |
| Track milestone completion | Ongoing | Milestone due dates; alerts on billing ahead of completion; % of contract value consumed |
| Obtain service completion confirmation | Per milestone / service period | Sends the confirmation request to the requesting department head (the service receiver) when a milestone falls due; unconfirmed milestones aged; a bill cannot be matched to a milestone that isn't confirmed; where contract labour was deployed, the confirmation also asks for the contractor's PF/ESI evidence (2.2) |
| Match service invoices to the Works Order | Per invoice | Three-way match of Works Order, service completion confirmation and invoice; flags invoices exceeding the confirmed milestone amount or remaining contract value |
| Renewals and expiry | Monthly | Contracts expiring in the next 30/60 days; invoices still arriving against an expired contract |

**Makes / prepares:**

- **Works Order / Agreement (services, contract jobs, job work)** — *Checked by* Procurement Manager (commercial). No accounting approval at this stage; the Accounts Manager approves the service bill when it is posted
- **Three-way match variance (Works Order / service confirmation / invoice)** — *Checked by* Accounts Manager

*Service completion confirmation is made by the requesting department head (service receiver) and is not a separate finance approval; variances are caught at the three-way match, as with a GRN.*

### 2.2 Labour Compliance

**Responsibilities:** For every Works Order that deploys contract labour, collects the contractor's PF/ESI challans and ECR for the workers deployed, the wage register and the contract labour licence, alongside the service completion confirmation, so the Compliance Officer can verify them before the bill is paid (principal-employer liability)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Collect contractor PF/ESI evidence | Per bill / wage period | Matches workers on the contractor's attendance or gate records to the PF/ESI ECR (UAN / IP numbers) and paid challans; flags workers missing from the challan, challans not yet paid, and wages below the notified minimum |
| Maintain contractor licence and registrations | Per contractor | Contract labour licence, PF/ESI codes and validity held on the contractor's record; alerts before expiry |

**Makes / prepares:**

- **Contractor compliance evidence (PF/ESI challans, ECR, wage register)** — *Checked by* Compliance Officer (verifies before the bill can be paid)

## 3. Procurement Manager — R-P04 (proposed)

### 3.1 Purchase Module

**Responsibilities:** Approves commercial terms on the PO itself — rate, vendor selection, delivery terms — ahead of any accounting approval; approves Works Orders commercially; reviews open PO ageing and vendor issues; owns the vendor scorecard and DPO reporting once Phase 5 lands

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve PO commercial terms above threshold | Daily | Risk-scored approval queue — rate above historical average, new vendor, single-source item or poor-scorecard vendor go to the top |
| Review open PO ageing | Weekly | Ageing buckets with "at-risk" POs where the vendor's history says delivery will slip |
| Review three-way-match exceptions and vendor issues | Weekly | Groups exceptions by vendor and reason so patterns show (e.g. one vendor consistently short-supplies ~4%) |
| Rate negotiation and vendor rationalisation | Monthly / quarterly | Price-variance trend per item and vendor concentration (e.g. 70% of steel spend with one vendor); items bought from too many vendors at scattered rates |
| Own vendor scorecard and DPO reporting (Phase 5) | Monthly | Auto-computes on-time %, rate variance and rejection rate from Phase 1 timestamps; suggests vendors for review |
| Approve Works Orders commercially | Per contract | Compares contract value against similar past contracts; flags unusual scope or value |

**Makes / prepares:**

- **Vendor scorecard / DPO reporting** — *Checked by* CEO / Management (view-only)

**Approves / checks:**

- **Purchase Order (commercial terms)** — *Made by* Procurement Officer
- **Works Order / Agreement (services, contract jobs, job work)** — *Made by* Contracts & Services Procurement Officer
- **Payment hold for quality reasons (place or release)** — *Made by* Payables Executive
- **Retention release (confirms completion)** — *Made by* Payables Executive

## 4. Stores / Inventory Officer — R-P02 (proposed)

### 4.1 Purchase Module

**Responsibilities:** Records goods inward against a PO (qty received, godown); tags Branch and Godown at entry; hands goods to QC and confirms the accepted/rejected disposition QC records on the GRN; handles Inter-Branch Transfers at source and destination

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| View expected arrivals | Daily, start of day | "Due today / overdue" inward list by godown, built from open POs |
| Record GRN (qty received, godown, branch) | Per delivery | OCR of the delivery challan pre-fills the GRN against the matching open PO; suggests godown from item history |
| Check quantity against PO | Per delivery | Alerts on over-receipt beyond tolerance, receipt with no PO, or wrong item/UOM |
| Hand over to QC and confirm disposition | Per delivery | Routes to QC automatically where the item or vendor requires inspection |
| Handle Inter-Branch Transfers (dispatch and receipt) | Per transfer | Stock-in-transit ageing — goods dispatched but not received at destination beyond a configurable number of days |
| Physically return rejected goods to vendor | As needed | Pre-fills the return/outward document from the QC rejection record, which the Accounts Executive then uses to raise the Debit Note |

**Makes / prepares:**

- **Record Goods Receipt (GRN)** — *Checked by* — (variance caught at three-way match)
- **OCR document capture** — *Checked by* Accounts Manager, on low-confidence flagged fields

*Inter-Branch Transfers are recorded once, as the inter-branch Stock Transfer in the Inventory Engine (4.2).*

**Approves / checks:**

- **Quality inspection & rejection recording** — *Made by* Quality Inspector / QC Officer

### 4.2 Inventory Engine

**Responsibilities:** Enters GRN inward and DC outward at the point of movement (same person as the Purchase/Sales Stores role); raises Stock Adjustments and Stock Transfers with reason and supporting document; records goods sent to and received back from job workers under a job-work challan; takes part in Physical Stock Counts of godowns other than their own (blind count); captures batch/serial at receipt

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Post GRN inward and DC outward | Daily | Pre-filled from the PO/SO; batch and serial capture by scan; FEFO suggestion on dispatch for batch items |
| Raise Stock Adjustments | As needed | Asks for the reason and supporting document; shows the item's adjustment history so repeat shortages are visible to the approver |
| Raise Stock Transfers | As needed | Suggests transfers from branches with surplus to branches short of the same item |
| Send goods to and receive them back from job workers | Per job-work lot | Job-work challan pre-filled from the Works Order; goods lying with each job worker tracked by challan; alerts before the return limit (one year for inputs, three years for capital goods) after which the dispatch is treated as a supply; feeds the ITC-04 working |
| Take part in physical counts of other godowns | Per count | Blind count on a handheld: the counter doesn't see book quantity; recount suggested where variance exceeds tolerance |
| Request new items | As needed | Fuzzy duplicate check shows likely existing items before the request goes in |
| Watch expiring batches | Daily | Batches expiring in 30/60/90 days, with suggested action (move, sell first, return to vendor) |

**Makes / prepares:**

- **GRN inward / DC outward entry** — *Checked by* — (system-enforced against PO/DC)
- **Stock Adjustment (increase/decrease)** — *Checked by* Inventory Controller
- **Physical Stock Count** — *Checked by* Inventory Controller (variance approval); Finance Controller for write-offs above threshold
- **Stock Transfer (intra-branch)** — *Checked by* Inventory Controller
- **Stock Transfer (inter-branch)** — *Checked by* Inventory Controller + Compliance Officer (GST)
- **Item Master — new item** — *Checked by* Accounts Manager (approves)
- **Scrap / damage / theft / expiry write-off** — *Checked by* Inventory Controller; Finance Controller above threshold
- **Negative-stock override (Warn/Allow policy)** — *Checked by* Inventory Controller
- **Job-work challan (goods out and back in)** — *Checked by* Inventory Controller

### 4.3 Sales Module

**Responsibilities:** Records goods dispatched against the approved SO (qty, item, transport details); completes e-way bill Part-B before goods move; generates e-way bills against the delivery challan for movements without a tax invoice (job work, returns to vendors, goods on approval); records goods returned by customers; tags Branch and Godown at entry; raises discrepancy notes (short stock, substitution)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| View dispatch plan | Daily, start of day | "Due to dispatch today" list by godown from confirmed SOs, with stock availability and credit-hold status so nothing on hold is picked |
| Record Delivery Challan (qty, item, transport details) | Per dispatch | Pre-fills from the SO line; warns on over-dispatch beyond tolerance, wrong item/UOM, or batch near expiry (FEFO suggestion) |
| Complete e-way bill Part-B | Per dispatch | Reminds when an invoice needs an e-way bill and Part-B is still empty before the vehicle leaves; blocks release of the DC where the IRN is still pending |
| Generate e-way bills for movements without a tax invoice | Per movement | Pre-fills Part-A from the delivery challan for job work, returns to vendors and goods on approval; flags movements above the e-way bill threshold with no e-way bill |
| Record goods returned by customers | Per return | Matches the return to the original DC/invoice and batch/serial; releases the linked credit note for approval |
| Handle inter-branch transfers | Per transfer | Stock-in-transit ageing; flags cross-state transfers that need an e-way bill/e-invoice |

**Makes / prepares:**

- **Record Dispatch (DC)** — *Checked by* — (variance caught at three-way match)
- **E-way bill Part-B and expiry monitoring** — *Checked by* Compliance Officer (expiry and missing e-way bills)
- **E-way bill against a delivery challan (no tax invoice)** — *Checked by* Compliance Officer (monitors)
- **Record goods returned by customer** — *Checked by* — (releases the return credit note for approval)
- **Three-way match variance (SO/DC/Invoice)** — *Checked by* Accounts Manager

*Inter-Branch Transfers are recorded once, as the inter-branch Stock Transfer in the Inventory Engine (4.2).*

### 4.4 Fixed Assets Module (as Asset Custodian)

**Responsibilities:** Confirms receipt, location, tag and put-to-use date for assets received against a GRN; initiates and confirms transfers and custody changes; maintains Unit of Production usage logs; takes part in physical verification (never solely for their own assets); tracks insurance and AMC/warranty expiry

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Confirm assets received and put to use | Per asset | Pre-filled from the GRN; custodian confirms location, tag and the actual put-to-use date, which drives depreciation start |
| Record transfers and custody changes | As they happen | Sending custodian initiates, receiving custodian confirms; the record syncs to the asset without re-keying |
| Maintain Unit of Production usage logs | Daily / monthly | Reminders for missing logs; unusual readings flagged |
| Take part in physical verification | Per campaign | Blind count by tag scan — the counter doesn't see the book list; a custodian never verifies only their own assets |
| Track insurance and AMC/warranty | Ongoing | Expiry alerts 30 days ahead |

**Makes / prepares:**

- **Transfer (location/custodian)** — *Checked by* Receiving custodian confirms; Accounts Manager as well if across branches or cost centres
- **Physical verification variance (missing/excess/damaged)** — *Checked by* Finance Controller

**Approves / checks:**

- **Transfer (location/custodian)** — *Made by* Sending custodian (Stores / Inventory Officer)

## 5. Quality Inspector / QC Officer — R-P05 (proposed)

### 5.1 Purchase Module

**Responsibilities:** Inspects goods received against the PO/GRN specification; determines accepted vs rejected quantity and reason; raises the Quality/Rejection record linked to the GRN (sole owner of this record)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Inspect goods against PO/GRN specification | Per delivery | Suggests inspection intensity from history — tighter sampling for vendors with high past rejection, lighter for consistently good ones |
| Record accepted / rejected quantity and reason | Per delivery | Reason-code suggestions; photo capture attached to the record |
| Raise Quality/Rejection record | Per rejection | Rejection trend per vendor/item feeds the vendor scorecard automatically |

**Makes / prepares:**

- **Quality inspection & rejection recording** — *Checked by* Stores / Inventory Officer (confirms disposition on the GRN)

## 6. Inventory Controller — R-P06 (proposed)

### 6.1 Inventory Engine

**Responsibilities:** Approves Stock Adjustments and Stock Count variances above the company's threshold; approves cross-branch Stock Transfers and job-work challans; gives operational input to costing-method reviews (the method itself is an accounting policy owned by the Accounts Manager); approves negative-stock overrides and reviews the Negative Stock report; approves reorder and min/max levels; plans physical counts

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve adjustments, transfers and count variances | Daily / weekly | Risk-sorted queue: high value, repeat items, same user or godown with frequent shortages first |
| Approve negative-stock overrides | As they occur | Shows why stock went negative (inward not yet posted, wrong item, genuine shortage) and ages the open ones |
| Approve reorder levels and min/max | Monthly | Suggested levels from consumption trend and vendor lead time (fed by Purchase's actual lead-time history) |
| Give operational input on costing-method reviews | As requested | Shows how batch tracking, FEFO and godown practice would behave under the proposed method, for the Accounts Manager's proposal |
| Plan physical counts | Per company cycle | Cycle-count plan weighted to high-value and high-variance items, so coverage is risk-based rather than all-at-once |

**Approves / checks:**

- **Stock Adjustment (increase/decrease)** — *Made by* Stores / Inventory Officer
- **Physical Stock Count** — *Made by* Count team independent of the godown's custodian — Stores / Inventory Officers from other godowns, blind count (count entry)
- **Stock Transfer (intra-branch)** — *Made by* Stores / Inventory Officer
- **Stock Transfer (inter-branch)** — *Made by* Stores / Inventory Officer, both branches
- **Scrap / damage / theft / expiry write-off** — *Made by* Stores / Inventory Officer
- **Negative-stock override (Warn/Allow policy)** — *Made by* Stores / Inventory Officer (transacts)
- **Reorder / min-max levels** — *Made by* Procurement Officer (proposes)
- **Job-work challan (goods out and back in)** — *Made by* Stores / Inventory Officer

# Stage 2. Sell and control credit

## 7. Sales Executive — R-S01 (proposed)

### 7.1 Sales Module

**Responsibilities:** Prepares Proforma Invoices; raises the Sales Order (item/qty/rate, delivery terms); requests commercial adjustments — returns, price corrections, post-supply discounts — for the Sales Manager's approval (a return only after the goods are recorded back in); does not issue invoices, Credit Notes or Debit Notes, which the Billing Executive (10.1) issues; flags SO exceptions rather than blocking the entry

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Prepare Proforma Invoice / quotation | Per enquiry | Pulls price from the Price List/Contract; shows the customer's last 3 rates and current exposure before the quote goes out; tracks validity and flags Proformas close to expiry with no conversion |
| Raise Sales Order | Per order | Price and payment terms default from the Price List and the customer's finance fields; shows available stock by godown and a realistic dispatch date; runs the credit check in the background and says why if the order will need approval |
| Request price or discount override | As needed | Shows margin impact and the customer's historical discount level; routes to the Sales Manager with the reason attached |
| Check for duplicate orders | Per order | Flags same customer + same item + similar quantity within a short window, including bulk-imported SOs |
| Follow up on open orders | Daily | Lists SO lines pending dispatch, by age and value, with stock availability so the Executive can tell the customer a real date |
| Request commercial adjustments (return, price correction, post-supply discount) | As needed | Pre-fills from the original invoice; a return request waits until the Stores / Inventory Officer records the goods back in; asks whether a pre-agreed scheme exists so the Billing Executive can set the 15(3)(b) GST flag correctly; routes to the Sales Manager |

**Makes / prepares:**

- **Proforma Invoice** — *Checked by* — (non-accounting; converts to an SO that is approved normally)
- **Sales Order (commercial terms)** — *Checked by* Sales Manager
- **Commercial adjustment request (return, price correction, post-supply discount, with any pre-agreed scheme reference)** — *Checked by* Sales Manager; the Billing Executive then issues the note

## 8. Sales Manager — R-S02 (proposed)

### 8.1 Sales Module

**Responsibilities:** Approves commercial terms on the SO — pricing, discount, delivery terms — ahead of any accounting approval; approves the reason and value of every commercial adjustment behind a Credit Note or price-correction Debit Note; owns the Customer Scorecard once it lands; may request a credit-hold release for a customer order, which goes to the Finance Controller for approval — the Sales Manager cannot release a hold

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve SO commercial terms above threshold | Daily | Risk-sorted queue: largest discount vs price list, below-cost rates, new customers and unusual quantities first, each with margin shown |
| Approve commercial adjustment requests | Daily | Customer's credit-note history, margin on the original invoice, and a flag where the adjustment lands just after period-end against an invoice from before it |
| Review open SO ageing and three-way-match exceptions | Weekly | Groups pending orders by reason (stock short, credit hold, awaiting customer) so the bottleneck is visible |
| Review discount and price-override pattern | Monthly | Override report by salesperson, customer and item; flags salespeople whose override rate is well above the team's |
| Own the Customer Scorecard | Monthly | On-time payment %, DSO, return and dispute frequency per customer, read from AR/AP; suggests customers for credit-limit review |
| Maintain Price List / Contract Rates | As needed | Flags customers still billed on an expired contract rate and items whose selling price has fallen behind cost |
| Request credit-hold release for a customer order | As needed | Routes to the Finance Controller with the commercial reason, the order value and the Credit Controller's exposure summary shown side by side |

**Makes / prepares:**

- **Customer Scorecard / risk review** — *Checked by* CEO / Management (view-only)
- **Credit-hold release request** — *Checked by* Finance Controller

**Approves / checks:**

- **Sales Order (commercial terms)** — *Made by* Sales Executive
- **Commercial adjustment request** — *Made by* Sales Executive

## 9. Credit Controller — R-S03 (proposed)

### 9.1 Sales Module

**Responsibilities:** Checks/approves customer credit limit and payment history before order confirmation or dispatch; places credit holds and requests their release from the Finance Controller; independent of Sales so targets don't pressure risky orders through — the Sales Manager may also request a release, but only the Finance Controller can approve one, and no Sales role can release a hold

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review SOs routed for credit approval | Daily | Shows exposure (open invoices + open SOs + dispatched-not-billed), overdue amount, days-past-due trend and any bounced receipts in one view |
| Place credit holds | As needed | Suggests holds for customers whose payment behaviour is deteriorating (DSO rising, promises to pay broken), before they cross the limit |
| Request hold release | As needed | Routes to the Finance Controller with the exposure summary; Sales roles can request but cannot release a hold |
| Periodic credit-limit review | Quarterly | Suggested limit per customer from payment history, order volume and dispute rate; limits not reviewed in 12 months are listed |

**Makes / prepares:**

- **Credit check / hold** — *Checked by* — (independent gate, not a second approver)
- **Credit-hold release request** — *Checked by* Finance Controller only — not the Sales Manager, since the gate exists to keep sales targets from pushing risky orders through

### 9.2 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Reads exposure and overdue data, places credit holds in Sales, coordinates with Collections; makes no allocation or write-off entries

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read exposure for the Sales credit gate | Daily | Live exposure, overdue and deterioration signals per customer, supplied to the Sales credit gate |

# Stage 3. Record and approve

## 10. Billing Executive — R-B01 (proposed)

### 10.1 Sales Module

**Responsibilities:** Raises Sales Invoices for supplies made — dispatches, services rendered, milestones reached, contract and subscription schedules; in integrated mode confirms the invoices the system generated on dispatch and handles the exceptions; the e-invoice (IRN) and e-way bill Part-A are generated by the system when the Accounts Manager approves the invoice; requests IRN and e-way bill cancellations within 24 hours; issues Credit Notes and Debit Notes only against a commercial adjustment approved by the Sales Manager; prepares export/SEZ invoices (LUT, currency, Shipping Bill); issues GST Receipt and Refund Vouchers on advances; keeps dispatched-not-billed at zero; resolves invoice errors with customers, while payment disputes go to Collections. Never allocates receipts, requests write-offs or edits customer finance fields

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Generate Sales Invoices (accounting-led mode) | Daily, per dispatch | Pulls uninvoiced DC lines, milestones reached and contract/subscription schedules due; checks HSN, GST rate and place of supply against the customer's GSTIN and ship-to state; applies the customer's billing instructions (PO reference, format, annexures); flags duplicates; checks the e-invoice fields (customer GSTIN active, pin codes, HSN digits) before approval so the IRN doesn't fail |
| Confirm auto-generated invoices (integrated mode) | Daily | Only exceptions reach the queue — match variances, tax overrides, milestone or special-format customers — each with the reason |
| E-invoice (IRN) and e-way bill Part-A | Per invoice, on approval | Generated by the system once the Accounts Manager approves: invoice sent to the IRP, IRN and signed QR stored on the invoice, e-way bill Part-A generated where the consignment needs one (or through the IRP along with the IRN); failures routed to the Compliance Officer's exception queue; reminds the Stores / Inventory Officer when Part-B is still empty |
| Cancel an IRN or e-way bill | As needed, within 24 hours | Allowed only within 24 hours of generation and, for an e-way bill, before the goods move; shows the time left; after that, offers only the Credit Note path; cancelling the IRN also cancels the linked e-way bill |
| Keep dispatched-not-billed at zero | Daily | DC-wise unbilled ageing by value, oldest and largest first; service supplies aged against the 30-day invoicing limit (Rule 47); "dispatched yesterday, not billed" alert |
| Issue Credit Notes and Debit Notes | Per approved adjustment | Only adjustments the Sales Manager has approved appear; pre-fills from the original invoice; a return-type credit note waits until the Stores / Inventory Officer records the goods back in; sets the 15(3)(b) flag from the scheme reference on the adjustment; warns as the Sec 34 credit-note limit (30 November) approaches |
| Export and SEZ invoices | Per invoice | Checks a valid LUT exists for the GSTIN on the invoice date; captures currency and rate; reminds for the Shipping Bill reference |
| GST Receipt / Refund Vouchers on advances | Per advance | Picks up advances the Accounts Executive flagged for GST on advance; issues the Refund Voucher if the order is cancelled without supply |
| Send invoices and track acknowledgement | Per invoice | Delivery channel from the customer's billing instructions (email, customer portal, copy with goods); tracks portal uploads and acknowledgement; IMS rejections route back here |
| Resolve invoice queries with customers | As raised | Classifies the query: an invoice error stays with Billing (corrected by a note, or by IRN cancellation inside 24 hours); a payment dispute routes to Collections |

**Makes / prepares:**

- **Sales Invoice** — *Checked by* Accounts Manager (approval triggers the e-invoice and e-way bill Part-A)
- **IRN / e-way bill cancellation (within 24 hours)** — *Checked by* Accounts Manager
- **Credit Note (against an approved adjustment)** — *Checked by* Accounts Manager, always; Finance Controller as well above threshold
- **Debit Note** — *Checked by* Accounts Manager, always
- **Post-supply discount reducing GST (15(3)(b) flag)** — *Checked by* Compliance Officer
- **Export / SEZ invoice (LUT, Shipping Bill)** — *Checked by* Compliance Officer (LUT validity)
- **GST Receipt / Refund Voucher on advance** — *Checked by* Compliance Officer, where GST on advance applies
- **DC-wise unbilled check** — *Checked by* Accounts Manager
- **Month-end dispatched-not-billed list** — *Checked by* Accounts Manager (approves the accrual)
- **Three-way match variance (SO/DC/Invoice)** — *Checked by* Accounts Manager
- **Tax override (on invoices and notes)** — *Checked by* Compliance Officer; Finance Controller as well above the value threshold

*Customer finance fields, including billing instructions, stay with the Accounts Executive (11.3), so Billing cannot edit the customer it bills. In a small company Billing may sit with the Accounts Executive, with every invoice and note then checked by the Accounts Manager regardless of value; it is never combined with Collections or a Sales role.*

### 10.2 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Every posted invoice, Credit Note and Debit Note reaches AR/AP as an open item; clears invoice-error queries that Collections routes back; makes no allocation or write-off entries

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Clear invoice queries routed from Collections | Daily | Queries tagged as invoice errors (wrong rate, missing PO reference, rejected in IMS) arrive with the invoice and the customer's message; payment disputes stay with Collections |

### 10.3 Taxation Engine

**Responsibilities:** Issues the outward documents that feed GSTR-1 and the e-invoice / e-way bill data; gets warnings before saving on the Sec 34 credit-note time limit and the 30-day services invoicing limit (Rule 47); GST rate or place-of-supply overrides need the Compliance Officer

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Time-limit and tax warnings at issue | Per document | Warns on credit notes past the 30 November Sec 34 limit (issued without GST reduction), services invoiced more than 30 days after supply, and any override of the system-derived GST rate or place of supply |

### 10.4 FEMA / RBI

**Responsibilities:** Captures the Shipping Bill number and date on each export invoice, which the Accounts Executive links to EDPMS

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Capture Shipping Bill on export invoices | Per export | Reminds until the Shipping Bill number and date are on the invoice, so the EDPMS link and export realisation tracking can start |

## 11. Accounts Executive — R01

### 11.1 Purchase Module

**Responsibilities:** Posts the Purchase Voucher's accounting entries — bill-wise allocation, system-derived GST/TDS lines; posts expense/service bills against Works Orders once the service is confirmed delivered; raises Debit Notes (return, price, quantity); books credit notes received from suppliers against the original Purchase Voucher; books Landed Cost Allocation entries; enters the Import Purchase Voucher (BOE, BCD, IGST on import); maintains the vendor's finance fields (credit terms, ledger mapping, bank details) on the Business Core party record; requests any tax/TDS override on a voucher

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Enter Purchase Voucher (OCR or manual) | Daily | OCR pre-fill with per-field confidence; auto-match to open PO/GRN; low-confidence fields highlighted, not blocked |
| Check for duplicate invoices | Per voucher | Flags same vendor + same invoice number, or same amount within a short window, including invoice-number variants (INV-001 vs 001) |
| Validate vendor tax details | Per voucher | GSTIN format/status check; HSN vs GST rate mismatch; invoice GSTIN vs the GSTIN on the vendor's Business Core record |
| Book GST and TDS lines | Per voucher | Policy engine derives rate and section; tracks cumulative purchases per vendor against the ₹50 lakh purchase-of-goods threshold (Section 393 payment code; legacy 194Q) and applies the TDS–TCS precedence rule; flags Sec 17(5) blocked credits; suggests RCM where the vendor is unregistered |
| Request a tax/TDS override | As needed | Override requires a reason; routed to the Compliance Officer; logged regardless of outcome |
| Bill-wise allocation and due date | Per voucher | Credit days from the vendor's finance fields; micro and small vendors flagged with their MSMED Act due date (15 days, or up to 45 days with a written agreement) for the 43B(h)-equivalent rule, read from the Udyam data held on the vendor's AR/AP record |
| Post expense / service bills | Per bill | Suggests the expense ledger from the vendor's past postings and the invoice description; matches against the Works Order and its service completion confirmation, and routes a bill with no confirmation as an exception |
| Import Purchase Voucher (BOE, BCD, IGST) | Per import | OCR of the Bill of Entry; checks IGST on import matches the BOE |
| Landed cost allocation | Per freight/duty bill | Suggests which open material vouchers a freight bill belongs to; applies apportionment by value/weight/quantity |
| Raise Debit Notes (return, price, quantity) | As needed | Pre-filled from the QC rejection record or the three-way-match rate variance, against the specific original Purchase Voucher |
| Book credit notes received from suppliers | Per credit note | OCR pre-fill; linked to the original Purchase Voucher; checks it against any Debit Note already raised so the same return isn't reduced twice; flags the ITC reversal and matches the credit note to its IMS line |
| Maintain vendor finance fields | As needed | Identity (name, PAN, GSTIN, address) comes from Business Core and isn't edited here; duplicate bank-account check across vendors; bank account verified by penny-drop/name-match before it can be saved as active; bank-detail changes routed to the Finance Controller, not the Accounts Manager |

**Makes / prepares:**

- **Purchase Voucher (domestic, accounting), including PO-optional postings** — *Checked by* Accounts Manager
- **Expense / service bill against a Works Order** — *Checked by* Accounts Manager
- **Bill-wise allocation & credit days** — *Checked by* Accounts Manager
- **Import Purchase Voucher (BOE, BCD, IGST)** — *Checked by* Accounts Manager
- **Landed Cost Allocation** — *Checked by* Accounts Manager
- **Debit Note (return, price, quantity)** — *Checked by* Accounts Manager
- **Supplier credit note received** — *Checked by* Accounts Manager; Compliance Officer on the ITC reversal
- **OCR document capture** — *Checked by* Accounts Manager, on low-confidence flagged fields
- **Vendor finance fields (credit terms, ledger mapping)** — *Checked by* Accounts Manager
- **Vendor bank-detail change** — *Checked by* Finance Controller
- **Tax/TDS override (voucher-level)** — *Checked by* Compliance Officer; Finance Controller as well above the value threshold
- **Month-end GRN-not-invoiced provision** — *Checked by* Accounts Manager

### 11.2 Inventory Engine

**Responsibilities:** Maintains the Item Master's costing and accounting fields (alongside the finance fields on vendor and customer records); confirms system-generated inventory accounting entries where a manual step exists (Periodic close entries, Inventory Adjustment/Scrap postings); loads opening stock; drafts the slow-moving/expired/NRV provision

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Create items from New Item Requests | As requested | HSN/GST rate suggested from the description and similar items; costing configuration defaulted from the item group |
| Load opening stock | One-time | Template validation; totals reconciled to the opening trial balance before posting |
| Run the Reconciliation Engine and resolve breaks | Month-end | Breaks explained down to the transaction; common causes suggested (unposted GRN, back-dated entry, manual journal to inventory) |
| Draft the slow-moving, expired and NRV provision | Quarter / year-end | Suggested provision from ageing, expiry and items whose recent selling price is below cost |
| Post Periodic close entries (Periodic mode) | Month-end | Closing value and COGS computed; variance vs last period explained |

**Makes / prepares:**

- **Item Master — new item** — *Checked by* Accounts Manager (approves)
- **Item Master — edit existing** — *Checked by* Accounts Manager
- **Periodic period close** — *Checked by* Accounts Manager
- **Reconciliation discrepancy resolution** — *Checked by* Accounts Manager
- **Opening stock load** — *Checked by* Accounts Manager
- **Slow-moving, expired and NRV provision** — *Checked by* Accounts Manager (review), Finance Controller (approve)
- **Standard cost variance review** — *Checked by* Accounts Manager
- **Bank stock statement (Cash Credit)** — *Checked by* Accounts Manager; the Compliance Officer tracks submission in Banking
- **ITC reversal on written-off stock** — *Checked by* Compliance Officer

### 11.3 Sales Module

**Responsibilities:** Maintains the customer's finance fields (credit days, ledger mapping, billing instructions) on the Business Core party record; records advances against SOs and flags GST on advance for the Billing Executive's receipt voucher; sets up bill-wise allocation and credit days. Sales Invoices, Credit and Debit Notes, export/SEZ invoices, the e-invoice and IRN / e-way bill cancellations moved to the Billing Executive (10.1) on Oct 1, 2026

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Post advances against SOs | Per advance | Flags advances where GST on advance applies (services) and hands them to the Billing Executive for the Receipt Voucher; links the advance to the SO so it adjusts automatically on invoicing |
| Maintain customer finance fields | As needed | Identity (name, PAN, GSTIN, address) comes from Business Core and isn't edited here; credit-limit fields routed to the Credit Controller's review; billing instructions (PO reference rule, invoice delivery channel, format) kept here so the Billing Executive applies them without being able to change them |

**Makes / prepares:**

- **Bill-wise allocation & credit days** — *Checked by* Accounts Manager
- **Advance against SO** — *Checked by* Accounts Manager
- **Customer finance fields (credit days, ledger mapping, billing instructions)** — *Checked by* Accounts Manager

### 11.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Uploads and matches 26AS/AIS, drafts provision and FX revaluation runs, prepares netting documents, maintains Udyam data on the vendor's AR/AP record, runs opening-balance migration and reconciliation runs; party links and merges are made in Business Core

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Upload and match 26AS/AIS | Quarterly | Auto-match on TAN, amount and quarter; customers who deducted but didn't deposit, and TDS credits nearing the claim deadline |
| Draft provision and revaluation runs | Month-end | Provision from the matrix and specific items; revaluation at the configured rate source, with the change from last period explained |
| Prepare netting documents | As needed | Shows net exposure for parties linked in Business Core; where a customer and vendor share a PAN/GSTIN but aren't linked, raises a link suggestion to Business Core |
| Maintain Udyam data | As needed | Udyam number format and status check; reminders for vendors with no Udyam response |
| Run reconciliation (control account vs open items) | Month-end | Breaks explained down to the posting that caused them |

**Makes / prepares:**

- **26AS/AIS upload and matching** — *Checked by* Accounts Manager
- **Udyam data on the vendor's AR/AP record** — *Checked by* Accounts Manager
- **Provision run** — *Checked by* Finance Controller (Accounts Manager reviews specific provisions first)
- **FX revaluation run (foreign-currency open items)** — *Checked by* Accounts Manager (regular month-end entry)
- **Netting document** — *Checked by* Accounts Manager; Finance Controller above threshold
- **Reconciliation run** — *Checked by* Accounts Manager
- **Reconciliation break carried across a period** — *Checked by* Accounts Manager
- **Unclaimable TDS credit write-off** — *Checked by* Finance Controller

### 11.5 Bank Transactions Module

**Responsibilities:** Creates payment, receipt and contra vouchers. Enters instrument details. Books unrecorded items from statement lines once the Reconciliation Executive flags them. Posts dishonour and stale-cheque reversals, BG invocation vouchers and FX revaluation. Reviews system-generated interest and commission accruals. Flags GST RCM applicability and TDS section/rate on advance payment vouchers at entry.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Create payment, receipt and contra vouchers | Daily | Contra ledger and party suggested from history; GST RCM and TDS on advances derived by the Taxation Engine; duplicate payment check against open bills and recent payments |
| Post pre-filled vouchers for unrecorded statement lines | Daily | Bank charges, interest and known recurring debits pre-filled from the statement line |
| Post dishonour and stale-cheque reversals | As flagged | Reversal pre-filled against the original voucher and bill allocation, from the Reconciliation Executive's flag |
| Post FX revaluation of foreign-currency bank accounts | Month-end | Closing rate from the configured rate source; gain/loss per account with the movement from last month explained |
| Review system-generated accruals | Month-end | Accrual vs the bank's actual debit, with differences explained |

**Makes / prepares:**

- **Payment, receipt, contra and journal vouchers** — *Checked by* Accounts Manager by slab; Finance Controller above the top slab
- **Unrecorded statement lines (charges, interest, unidentified credits)** — *Checked by* Accounts Manager
- **Dishonour / return reversal** — *Checked by* Accounts Manager
- **Stale / unpresented cheque reversal** — *Checked by* Accounts Manager
- **Interest, EMI and BG/LC commission accruals** — *Checked by* Finance Controller
- **BG invocation (liability voucher)** — *Checked by* Finance Controller
- **FX revaluation of foreign-currency bank accounts** — *Checked by* Accounts Manager (regular month-end entry)
- **CC stock statement and covenant tests** — *Checked by* Compliance Officer tracks submission and covenants; Accounts Manager confirms figures
- **Legacy data migration** — *Checked by* Accounts Manager, then Finance Controller sign-off

### 11.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Posts underlying vendor transactions/bills that feed the TDS computation; Indirect Tax Engine — Posts underlying sales/purchase transactions that feed the GST computation

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Post the underlying sales, purchase and expense transactions | Daily | Tax determined automatically from item, party and place of supply; flags anything it couldn't determine instead of guessing |
| Upload lower/nil deduction certificates | As received | Reads the certificate; checks PAN, validity dates and amount limit; alerts when the certificate limit is nearly used up |
| Capture Bills of Entry | Per import | OCR of the BoE; matches it to the Import Purchase Voucher and flags duty differences against the Customs Duty Master |
| Request voucher-level overrides | As needed | Requires a reason; shows the tax impact before routing |

**Makes / prepares:**

- **Customs duty from Bill of Entry** — *Checked by* Compliance Officer
- **Lower/nil deduction certificate upload** — *Checked by* Compliance Officer
- **Voucher-level tax override** — *Checked by* Compliance Officer; Finance Controller as well above threshold

**Disallowance triggers and GST limits at entry (all voucher types):**

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Flag disallowance triggers before the entry is saved | Per voucher | Warns on any Purchase, Banking or AR/AP voucher before it is saved: cash payment to a person above ₹10,000 in a day, ₹35,000 for transporters (40A(3)-equivalent); cash receipt of ₹2 lakh or more from a person in a day, a transaction or an event (269ST); loan or deposit of ₹20,000 or more taken or repaid in cash (269SS / 269T); an expense where TDS applies but hasn't been deducted (40(a)(ia)-equivalent); statutory dues or bonus still unpaid as their due date nears (43B-equivalent). Suggests the compliant route (bank payment, deduct TDS) or a recognised exception, with reason |
| Flag GST time limits and blocked credit at entry | Per voucher | Purchase invoices of an earlier year flagged against the Sec 16(4) ITC time limit (30 November after the year end); credit notes on earlier-year supplies flagged against the Sec 34 time limit (30 November); 17(5) blocked credit applied automatically from the expense ledger's tag |

**Makes / prepares:**

- **Disallowance-trigger or GST time-limit override (with reason or exception)** — *Checked by* Compliance Officer

### 11.7 Fixed Assets Module

**Responsibilities:** Completes the auto-spawned asset record once a voucher posts to a Fixed Asset ledger (category/sub-category if not already ledger-mapped, confirms defaulted useful life and method); capitalises from CWIP; records additions, component splits and Unit of Production usage; initiates disposals; proposes revaluation and impairment entries; runs the periodic depreciation batch; migrates the opening register at go-live

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Complete auto-spawned asset records | Per voucher hitting a Fixed Asset ledger | Pre-fills category, sub-category, useful life and method from the ledger mapping and similar past assets; asks only for what's missing |
| Capitalise from CWIP | As assets are put to use | CWIP ageing; flags CWIP items where the GRN, a usage log or custodian confirmation suggests the asset is already in use |
| Review capital vs revenue on expense vouchers | Daily | Flags expense entries that look capital (high value, asset-like description, vendor who usually supplies equipment) and asset entries that look like repairs |
| Record additions/improvements and component splits | As needed | Suggests the parent asset to add to; shows the revised schedule and the new 180-day flag before posting |
| Record Unit of Production usage | Month-end | Pulls usage from the custodian's log; flags assets whose usage is abnormal for their class or nearing total estimated capacity |
| Run the periodic depreciation batch | Month-end | Pre-run check: assets with no put-to-use date, missing useful life, or method differing from the block default without an approved override |
| Initiate disposals | Per disposal | Prompts when a sales invoice or scrap entry references an asset item; computes book gain/loss and the tax block effect before posting |
| Propose revaluation or impairment entries | As needed | Carries the valuer's report and the computed reserve/loss; shows the tax-block effect (none) |
| Migrate the opening register at go-live | One-time | Bulk import with reconciliation to opening trial balance and to the last filed tax block schedule; differences listed by asset and block |

**Makes / prepares:**

- **Asset capitalization** — *Checked by* Accounts Manager
- **Method / useful-life override on an individual asset** — *Checked by* Compliance Officer
- **Category/sub-category default (useful life, method) at block level** — *Checked by* Finance Controller
- **Disposal / sale** — *Checked by* Accounts Manager
- **Capitalization from CWIP** — *Checked by* Accounts Manager
- **Depreciation run** — *Checked by* Finance Controller (signs off)
- **Revaluation** — *Checked by* Finance Controller
- **Impairment** — *Checked by* Finance Controller
- **Capital-goods ITC reversal on disposal** — *Checked by* Compliance Officer
- **Opening register migration** — *Checked by* Accounts Manager, then Finance Controller sign-off

### 11.8 Vouchers & Ledgers and Period Close

**Responsibilities:** At migration, sets up the chart of accounts and ledgers from the legacy books and loads the opening trial balance; after go-live the chart of accounts is owned by the Accounts Manager. Posts general journal vouchers (accruals, prepaids, reclassifications, corrections), the payroll journal from HR's payroll accounting output (PO-06), employee expense claims and petty cash; prepares month-end and year-end schedules for the Accounts Manager's review

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Set up the chart of accounts and ledgers at migration | One-time | Legacy ledgers mapped to the master Chart of Accounts groups and Schedule III lines; unmapped, duplicate and near-duplicate legacy ledgers listed before import |
| Load the opening trial balance | One-time | Debits equal credits and tie to the legacy closing trial balance; each sub-ledger's opening (AR/AP open items, stock, asset register, bank balances, tax balances) reconciled to its control account before go-live, differences listed |
| Post general journal vouchers | As needed | Suggests ledgers from similar past journals; recurring journals templated; flags journals hitting control accounts (AR/AP, inventory, fixed assets, bank, GST, TDS) that should normally come from the module |
| Post the payroll journal | Monthly, per payroll run | Journal built from HR's payroll accounting output (PO-06); totals reconciled to the payroll register and to PF, ESI, PT and salary-TDS liabilities; cost-centre and branch split checked |
| Book employee expense claims | Per claim | OCR of bills; policy limits and per-diem rules checked; duplicate claims across employees and periods flagged; GST ITC eligibility on employee bills flagged; a claim is booked only after the reporting manager's approval; reimbursement goes to Banking as a payment voucher |
| Maintain petty cash (imprest) | Daily / per replenishment | Cash book balance against the imprest limit; vouchers without bills or above the per-voucher limit flagged; replenishment request built from the vouchers paid |
| Prepare month-end and year-end schedules | Month-end / year-end | Prepaid and accrual roll-forwards; ledgers with abnormal balances (debit balance on a creditor, credit balance on an expense) listed |

**Makes / prepares:**

- **Chart of accounts and ledger set-up at migration** — *Checked by* Accounts Manager, then Finance Controller sign-off
- **Opening trial balance** — *Checked by* Accounts Manager, then Finance Controller sign-off
- **General journal voucher** — *Checked by* Accounts Manager by slab; Finance Controller above the top slab
- **Payroll journal (from PO-06)** — *Checked by* Accounts Manager
- **Employee expense claim (booking)** — *Checked by* Accounts Manager (the reporting manager has already approved the claim itself)
- **Petty cash vouchers and replenishment** — *Checked by* Accounts Manager on replenishment, with a monthly cash count
- **Month-end and year-end schedules** — *Checked by* Accounts Manager

### 11.9 FEMA / RBI

**Responsibilities:** Links each export Shipping Bill to EDPMS and each import Bill of Entry to IDPMS; records FIRC / e-BRC against export receipts and inward remittances

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Link Shipping Bills and Bills of Entry to EDPMS / IDPMS | Per export / import | Shipping Bill and BoE numbers picked from the export invoice and import voucher; realisations and payments matched to them; open items listed for the AD bank |
| Record FIRC / e-BRC | Per receipt | e-BRC data matched to the export invoice and receipt; unmatched or short-realised amounts flagged |

**Makes / prepares:**

- **EDPMS / IDPMS links and e-BRC / FIRC records** — *Checked by* Accounts Manager

## 12. Accounts Manager — R02

### 12.1 Purchase Module

**Responsibilities:** Approves Purchase Vouchers, Import Vouchers, Debit Notes, supplier credit notes and service bills posted against Works Orders above the value threshold; reviews three-way-match variances and OCR-flagged entries before posting; confirms edits to vendor finance fields other than bank details; actions IMS lines before the GSTR-2B cutoff; prepares RCM self-invoices; reviews micro/small-vendor dues; owns month-end purchase cut-off (GRN-not-invoiced provision) and signs off landed cost

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Action IMS inward documents (Accept / Reject / Pending) | Monthly, before the 14th | Auto-suggests Accept where a matching Purchase Voucher exists within tolerance; flags lines with no voucher, value mismatch or duplicate |
| Clear the approval queue (PVs, Import Vouchers, Debit Notes, supplier credit notes, service bills against Works Orders) | Daily | Queue sorted by risk score, not date, with a plain-language "why this is flagged" line on each voucher |
| Prepare RCM self-invoices | Per RCM purchase | Self-invoice generated from the Purchase Voucher once RCM is detected; the Manager reviews and submits it to the Compliance Officer |
| Approve three-way-match variances | Daily | PO, GRN and invoice side by side with the variance highlighted and the vendor's past variance pattern |
| Review OCR-flagged entries | Daily | Only the low-confidence fields shown, with the source image cropped beside each |
| Confirm vendor finance-field edits (credit terms, ledger mapping — not bank details) | Per edit | Shows the field-level change; identity fields are maintained in Business Core; bank-detail changes are excluded because the Accounts Manager approves payment proposals in AR/AP |
| MSME and credit-term monitoring | Weekly | Reviews micro/small-vendor dues approaching their MSMED Act limit (43B(h)-equivalent disallowance risk); the tracker itself is run by the Payables Executive in AR/AP |
| Month-end purchase cut-off | Month-end | GRN-not-invoiced list for provisioning; invoice-without-GRN list; landed cost not yet apportioned |
| Sign off landed cost apportionment | Month-end | Summary of apportionment by basis and by item category, with outliers flagged |

**Makes / prepares:**

- **RCM self-invoice** — *Checked by* Compliance Officer
- **IMS action on inward documents** — *Checked by* Compliance Officer

**Approves / checks:**

- **Purchase Voucher (domestic, accounting), including PO-optional postings** — *Made by* Accounts Executive
- **Expense / service bill against a Works Order** — *Made by* Accounts Executive
- **Bill-wise allocation & credit days** — *Made by* Accounts Executive
- **Import Purchase Voucher (BOE, BCD, IGST)** — *Made by* Accounts Executive
- **Landed Cost Allocation** — *Made by* Accounts Executive
- **Debit Note (return, price, quantity)** — *Made by* Accounts Executive
- **Supplier credit note received** — *Made by* Accounts Executive
- **OCR document capture** — *Made by* Whoever keys the source document (Procurement Officer, Stores / Inventory Officer or Accounts Executive)
- **Vendor finance fields (credit terms, ledger mapping)** — *Made by* Accounts Executive
- **Three-way match variance (PO/GRN/Voucher)** — *Made by* Procurement Officer (raises)
- **Three-way match variance (Works Order / service confirmation / invoice)** — *Made by* Contracts & Services Procurement Officer (raises)
- **GST/RCM/ITC/TDS policy tagging (masters)** — *Made by* Compliance Officer
- **Month-end GRN-not-invoiced provision** — *Made by* Accounts Executive

### 12.2 Inventory Engine

**Responsibilities:** Confirms the Inventory module close, which feeds the company-wide period lock; owns the costing-method configuration (an accounting policy) and proposes Valuation Method Changes to the Finance Controller, taking the Inventory Controller's operational input; reviews Reconciliation Engine discrepancies before the module close; reviews the NRV provision; confirms the monthly stock statement given to the bank for Cash Credit

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve new items and item edits | As requested | Duplicate warnings repeated at approval; changes to HSN, GST rate or costing method highlighted |
| Confirm the Inventory module close | Month-end | Close checklist: reconciliation clean, no pending approvals, negative stock cleared or explained; status passed to the period close checklist |
| Propose costing method changes | As needed | Shows the valuation impact under the new method, with the Inventory Controller's operational input, before the Valuation Method Change process starts |
| Review the NRV/obsolescence provision | Quarter / year-end | Item-level provision with the ageing and price evidence behind it |
| Confirm the bank stock statement (Cash Credit) | Monthly | Statement built from the book valuation; differences from the last statement filed and from the books explained |
| Review standard cost variances | Monthly | Purchase price and usage variances by item and vendor |

**Makes / prepares:**

- **Costing method change (Valuation Method Change)** — *Checked by* Finance Controller
- **Inventory module close** — *Checked by* Finance Controller, as part of the company-wide period lock

**Approves / checks:**

- **Item Master — new item** — *Made by* Stores / Inventory Officer (requests) → Accounts Executive (creates)
- **Item Master — edit existing** — *Made by* Accounts Executive
- **Periodic period close** — *Made by* Accounts Executive
- **Reconciliation discrepancy resolution** — *Made by* Accounts Executive
- **Opening stock load** — *Made by* Accounts Executive
- **Slow-moving, expired and NRV provision** — *Made by* Accounts Executive
- **Standard cost variance review** — *Made by* Accounts Executive
- **Bank stock statement (Cash Credit)** — *Made by* Accounts Executive (generates from valuation)

### 12.3 Sales Module

**Responsibilities:** Approves Sales Invoices above the value threshold, and every Credit Note and Debit Note, all issued by the Billing Executive; approves IRN / e-way bill cancellations within 24 hours; reviews three-way-match variances before posting; confirms edits to customer finance fields; owns month-end revenue cut-off (dispatched-not-billed)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Clear the approval queue (invoices, credit notes, debit notes) | Daily | Risk-sorted: credit notes and below-price invoices first, each with a one-line reason for the flag |
| Approve three-way-match variances | Daily | SO, DC and invoice side by side with the variance highlighted |
| Confirm customer finance-field edits | Per edit | Field-level change shown; identity fields are maintained in Business Core |
| Month-end revenue cut-off | Month-end | Dispatched-not-billed list for accrual; invoices dated in the period with DC dated after it; unapplied advances |

**Approves / checks:**

- **Sales Invoice (approval triggers the e-invoice and e-way bill Part-A)** — *Made by* Billing Executive
- **IRN / e-way bill cancellation (within 24 hours)** — *Made by* Billing Executive
- **Bill-wise allocation & credit days** — *Made by* Accounts Executive
- **DC-wise unbilled check** — *Made by* Billing Executive
- **Credit Note (return/adjustment)** — *Made by* Billing Executive (issues against the adjustment the Sales Manager approved)
- **Debit Note** — *Made by* Billing Executive
- **Three-way match variance (SO/DC/Invoice)** — *Made by* Stores / Inventory Officer or Billing Executive (raises)
- **Customer finance fields (credit days, ledger mapping)** — *Made by* Accounts Executive
- **Month-end revenue cut-off (dispatched-not-billed)** — *Made by* Billing Executive

*Receipt allocation and receivables write-offs are approved in AR/AP (12.4).*

### 12.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Approves payment proposals, allocation exceptions and short-payment differences above tolerance, FX revaluation runs, netting, dispute resolutions and hold releases; prepares the 43B(h) list and the ITC reversal working; signs off reconciliation and confirms the AR/AP module close

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve payment proposals | Weekly | Proposal summary with flags: vendors whose bank details changed recently, bills without GRN, first-time payees, amounts above the vendor's usual range |
| Approve allocation exceptions, short payments, disputes and hold releases | Daily | Risk-sorted queue with the reason code and history for each item |
| Prepare the 43B(h) list and the ITC reversal working | Year-end / monthly | Built from open items and payment dates; items near the threshold highlighted |
| Sign off reconciliation, Schedule III ageing and the AR/AP module close | Month-end / year-end | Close checklist: breaks, unallocated items and disputes still open; status passed to the period close checklist |

**Makes / prepares:**

- **43B(h) list and Section 22 disclosure** — *Checked by* Compliance Officer
- **180-day ITC reversal and re-availment working** — *Checked by* Compliance Officer; the Taxation Engine then posts it and the Payments / Disbursement Officer pays any liability
- **Provision matrix or specific provision** — *Checked by* Finance Controller
- **Schedule III ageing sign-off** — *Checked by* Finance Controller
- **AR/AP module close** — *Checked by* Finance Controller, as part of the company-wide period lock

**Approves / checks:**

- **Allocate customer receipt (exceptions)** — *Made by* Collections Officer
- **Auto-allocate payment from proposal** — *Made by* System
- **Short-payment difference above tolerance** — *Made by* Collections Officer
- **Reversal or re-allocation of a cleared item** — *Made by* Collections Officer or Payables Executive
- **Dispute raised or resolved with value effect** — *Made by* Collections Officer (AR) or Payables Executive (AP)
- **Payment hold, place or release (other than quality and compliance holds)** — *Made by* Payables Executive; a hold is released by someone other than the person who placed it
- **Payment proposal** — *Made by* Payables Executive
- **Cash discount decision, including outside contracted terms** — *Made by* Payables Executive
- **Vendor advance or retention release** — *Made by* Payables Executive
- **Vendor statement reconciliation** — *Made by* Payables Executive
- **Balance confirmations** — *Made by* Collections Officer (AR), Payables Executive (AP)
- **Customer refund or adjustment of a credit balance** — *Made by* Collections Officer (requests)
- **Late-payment interest on customers (Debit Note raised in Sales)** — *Made by* Collections Officer (requests)
- **Receivables write-off (below threshold)** — *Made by* Collections Officer
- **26AS/AIS upload and matching** — *Made by* Accounts Executive
- **Udyam data on the vendor's AR/AP record** — *Made by* Accounts Executive
- **Provision run (specific provisions reviewed before it goes to the Finance Controller)** — *Made by* Accounts Executive
- **FX revaluation run (foreign-currency open items)** — *Made by* Accounts Executive
- **Netting document** — *Made by* Accounts Executive
- **Reconciliation run** — *Made by* Accounts Executive
- **Reconciliation break carried across a period** — *Made by* Accounts Executive

### 12.5 Bank Transactions Module

**Responsibilities:** Approves vouchers within their amount slab. Confirms fuzzy matches. Reviews the exception queue. Confirms GST/TDS-on-advance treatment before approving. Approves FX revaluation of foreign-currency bank accounts as a regular month-end entry.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve vouchers within slab | Daily | Risk-sorted: first-time payees, payees with recently changed bank details, round amounts and payments outside usual patterns first |
| Confirm fuzzy/split matches and review the exception queue | Daily | Confidence score and the reason each item didn't auto-match |
| Confirm GST/TDS on advances | Per voucher | Shows the Taxation Engine's determination and any override requested |
| Approve FX revaluation of foreign-currency bank accounts | Month-end | Rate source, closing rate and gain/loss per account against last month |

**Approves / checks:**

- **Payment, receipt, contra and journal vouchers** — *Made by* Accounts Executive
- **Cheque issue, cancellation and stop-payment** — *Made by* Payments / Disbursement Officer
- **Statement import and auto-match** — *Made by* Reconciliation Executive
- **Unrecorded statement lines (charges, interest, unidentified credits)** — *Made by* Accounts Executive posts the pre-filled voucher from the Reconciliation Executive's flag
- **Dishonour / return reversal** — *Made by* Accounts Executive (from the Reconciliation Executive's flag)
- **Stale / unpresented cheque reversal** — *Made by* Accounts Executive (from the ageing report)
- **FX revaluation of foreign-currency bank accounts** — *Made by* Accounts Executive
- **CC stock statement figures** — *Made by* Accounts Executive generates the stock statement from the Inventory valuation
- **Legacy data migration** — *Made by* Accounts Executive

### 12.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Prepares the TDS computation — section/payment-code determination, rate application, challan draft; Indirect Tax Engine — Prepares the GST computation — tax determination, ITC computation, return draft

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Prepare GST returns | Monthly | Draft built from posted vouchers; books vs draft differences listed before the Compliance Officer sees it |
| Action IMS lines | Monthly, before the 14th | Auto-suggest Accept where a Purchase Voucher matches; list of lines that will be deemed accepted if left Pending |
| Prepare TDS/TCS challans and quarterly returns | Monthly / quarterly | Payee-wise working with code, rate and threshold logic shown; PAN and non-filer exceptions flagged; certificates generated |
| Reconcile 26AS/AIS | Quarterly | Auto-match on TAN, amount and date; in-books-not-in-AIS and in-AIS-not-in-books lists |
| Prepare advance tax and tax provision | Quarterly | Projection from live books with book-to-tax adjustments; shows the next instalment and the interest if it's short |
| Prepare foreign remittance workings | Per remittance | Taxability, DTAA vs domestic rate, Form 145 part, and the TDS-date exchange rate worked out; flags missing TRC/Form 10F |
| Prepare ITC-04 (job work) | Half-yearly or annually, by turnover | Built from job-work challans out and back in; goods still with job workers near or past the return limit flagged |
| Prepare GSTR-9/9C, refunds and ISD | Annually / as needed | Year-to-date reconciliation already built from monthly runs; refund eligibility computed (inverted duty, exports) |

**Makes / prepares:**

- **GST computation and return draft (GSTR-1, 3B)** — *Checked by* Compliance Officer
- **IMS action on inward documents** — *Checked by* Compliance Officer (before the 2B cutoff)
- **RCM self-invoice and RCM liability** — *Checked by* Compliance Officer
- **GST TDS/TCS (Sec 51/52-equivalent)** — *Checked by* Compliance Officer
- **GSTR-9 / 9C-equivalent** — *Checked by* Compliance Officer; external CA certifies 9C; Finance Controller approves any DRC-03 voluntary payment
- **Refund application** — *Checked by* Compliance Officer; Finance Controller approves filing
- **ISD distribution** — *Checked by* Compliance Officer
- **Customs duty from Bill of Entry** — *Checked by* Compliance Officer
- **TDS/TCS computation and challan (non-salary)** — *Checked by* Compliance Officer
- **Quarterly TDS/TCS return and certificates** — *Checked by* Compliance Officer
- **26AS / AIS reconciliation (entity's own credits)** — *Checked by* Compliance Officer
- **Foreign remittance: taxability, DTAA, Form 145** — *Checked by* Compliance Officer; external CA issues Form 146 (Part C); Finance Controller above threshold
- **Advance tax projection and instalment** — *Checked by* Finance Controller (projection); Compliance Officer (computation)
- **Tax provision and deferred tax entry** — *Checked by* Finance Controller
- **Professional Tax (employer)** — *Checked by* Compliance Officer
- **Interest and late fee** — *Checked by* Compliance Officer
- **ITC-04 (job work)** — *Checked by* Compliance Officer
- **Rule 86B working in GSTR-3B** — *Checked by* Compliance Officer
- **Cross-match difference explanations** — *Checked by* Compliance Officer
- **Disallowance working (40(a)(ia), 40A(3), 43B-equivalents)** — *Checked by* Compliance Officer, then Finance Controller with the tax provision

**GST limits, cross-match and disallowances:**

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Apply Rule 86B in the GSTR-3B working | Monthly | Where taxable supply in the month exceeds ₹50 lakh, caps ITC use at 99% of output tax so at least 1% is paid in cash, unless an exemption applies; shows the exemption basis for the Compliance Officer |
| Track ITC and credit-note time limits | Monthly, and before 30 November | Unclaimed ITC (Sec 16(4)) and undeclared credit notes (Sec 34) of the previous year listed with days left to 30 November |
| Explain cross-match differences | Monthly | Pre-filled explanation for each difference in the department's-view cross-match (timing, amendment, reclassification), with the vouchers behind it |
| Compute disallowances for the tax provision | Quarterly / year-end | 40(a)(ia), 40A(3) and 43B-equivalent disallowances pulled from the entry-level flags and the due-date tracker; feeds the tax provision and tax-audit working |

### 12.7 Fixed Assets Module

**Responsibilities:** Approves capitalization (including from CWIP), disposal, and cross-branch transfers before they post — same value-threshold discipline as Purchase and Sales Vouchers; reviews CWIP ageing; confirms the Fixed Assets module close. Method/useful-life overrides go to the Compliance Officer, per the Maker-Checker matrix

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve capitalisations (including from CWIP) | Daily | Queue with capital/revenue confidence, put-to-use evidence and whether the amount matches the source voucher |
| Approve disposals | Per disposal | Sale value vs net book value and vs similar past disposals; flags sales to related parties or below book value |
| Approve transfers across branches or cost centres | Per transfer | Shows sending and receiving custodian confirmation |
| Review CWIP ageing | Monthly | CWIP by project and age bucket, ready for the Schedule III CWIP ageing note |
| Confirm the Fixed Assets module close | Month-end | Register reconciled to the asset, CWIP and depreciation ledgers; depreciation run signed off; nothing pending approval |

**Approves / checks:**

- **Asset capitalization** — *Made by* Accounts Executive
- **Disposal / sale** — *Made by* Accounts Executive
- **Capitalization from CWIP** — *Made by* Accounts Executive
- **Transfer (location/custodian)** — *Made by* Sending custodian (Stores / Inventory Officer)
- **Opening register migration** — *Made by* Accounts Executive

**Makes / prepares:**

- **Fixed Assets module close** — *Checked by* Finance Controller, as part of the company-wide period lock

### 12.8 Vouchers & Ledgers and Period Close

**Responsibilities:** Owns the chart of accounts after migration — creates and edits ledgers and groups and their Schedule III mapping; approves general journals, the payroll journal, expense-claim bookings and petty cash within slab; reviews the trial balance monthly; runs the period close checklist, collecting each module's close; prepares the financial statements (Schedule III) and notes for the Finance Controller's approval; runs the year-end close

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Maintain the chart of accounts after go-live | As needed | Duplicate and near-duplicate ledger names flagged; a ledger can't be saved without a group and Schedule III mapping; unused ledgers listed for closure |
| Approve general journals, the payroll journal, expense-claim bookings and petty cash replenishment | Daily / monthly | Risk-sorted: journals to control accounts, round amounts, back-dated or period-end journals, users posting outside their usual ledgers |
| Review the trial balance | Monthly | Movement against last month and last year; each control account against its sub-ledger (AR/AP, inventory, fixed assets, bank, GST, TDS) with differences explained; ledgers with abnormal balances |
| Run the period close checklist | Month-end | One screen showing each module's close status (Inventory, AR/AP, Banking BRS, Fixed Assets, tax liabilities, payroll journal posted) with open items; submitted to the Finance Controller for the lock only when all are complete |
| Prepare financial statements and notes | Quarterly / year-end | Schedule III balance sheet, statement of profit and loss and cash flow built from the ledger mapping; ageing, CWIP, MSME and fixed asset notes pulled from the modules; variance commentary drafted |
| Run the year-end close | Year-end | Audit adjustments tracked separately from management entries; profit or loss closed to reserves; the new year's opening balances generated and tied to the closing trial balance |

**Makes / prepares:**

- **Ledger / group creation or edit (after migration)** — *Checked by* Finance Controller where it creates a group or changes a Schedule III mapping; a ledger added under an existing group needs no second approval and is logged
- **Trial balance review** — *Checked by* Finance Controller (month-end sign-off)
- **Period close checklist (submission for the lock)** — *Checked by* Finance Controller (applies the lock)
- **Financial statements and notes** — *Checked by* Finance Controller (approves); board approval sits outside Aikyat
- **Year-end close entries and audit adjustments** — *Checked by* Finance Controller

**Approves / checks:**

- **Chart of accounts and ledger set-up at migration** — *Made by* Accounts Executive
- **Opening trial balance** — *Made by* Accounts Executive
- **General journal voucher (within slab)** — *Made by* Accounts Executive
- **Payroll journal (from PO-06)** — *Made by* Accounts Executive
- **Employee expense claim (booking)** — *Made by* Accounts Executive
- **Petty cash replenishment** — *Made by* Accounts Executive
- **Month-end and year-end schedules** — *Made by* Accounts Executive

### 12.9 Notice & Litigation

**Responsibilities:** Reviews the ledgers and returns Aikyat assembles for each notice and explains the figures; maintains the provision / contingent liability working from the exposure register

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the assembled working for a notice | Per notice | Ledgers, returns and reconciliations for the period and issues in the notice, assembled automatically; gaps listed |
| Update provision and contingent liability | Quarterly / year-end | Exposure per matter (demand, interest, penalty, pre-deposit paid) with the consultant's view on outcome; suggested classification as provision, contingent liability or remote |

**Makes / prepares:**

- **Provision / contingent liability classification per matter** — *Checked by* Finance Controller

### 12.10 Labour Compliance

**Responsibilities:** Books the provisions affected by labour law — gratuity, leave encashment and bonus — including the effect of the Labour Codes' wage definition on PF and gratuity

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Assess Labour Code impact on provisions | On change / year-end | Recomputes the wage base under the Labour Codes' wage definition (allowances above half of total remuneration added back) and shows the effect on PF, gratuity and leave provisions |
| Provide for bonus | Monthly / year-end | Bonus provision under the Payment of Bonus Act from the eligible wage base; unpaid bonus flagged against its 43B-equivalent date |

**Makes / prepares:**

- **Labour-law provisions (gratuity, leave, bonus, Labour Code impact)** — *Checked by* Finance Controller

### 12.11 FEMA / RBI

**Responsibilities:** Approves EDPMS / IDPMS links and e-BRC / FIRC records; reviews overdue export realisations and open import Bills of Entry monthly

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review overdue exports and open BoEs | Monthly | Shipping Bills approaching or past 9 months unrealised and BoEs open in IDPMS, by customer or vendor and amount |

**Approves / checks:**

- **EDPMS / IDPMS links and e-BRC / FIRC records** — *Made by* Accounts Executive
- **Import payment linked to its BoE** — *Made by* Payables Executive

# Stage 4. Collect and pay

## 13. Collections / Receivables Officer — R-S05 (proposed)

### 13.1 Sales Module

**Responsibilities:** Views customers' outstanding and overdue position in Sales. Recording and allocating receipts, follow-up and write-off requests are owned by the AR/AP module (13.2) in every configuration.

*Work list and makes/prepares sit under this role's AR/AP entry (13.2).*

### 13.2 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Allocates customer receipts, chases overdue items, runs dunning and promise-to-pay, sends customer statements, requests write-offs, records recoveries

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Allocate customer receipts | Daily | Suggests the invoices a receipt settles from the remittance advice, amount combinations and past behaviour; explains short payments by likely reason (TDS, discount, deduction) with a reason code pre-filled |
| Work the collector worklist | Daily | Ranked by amount, days past due, broken promises and risk band; predicted payment date per customer from their history |
| Record promises to pay and dunning | Daily / weekly | Dunning letter and email drafted by stage; broken promises escalate automatically |
| Send customer statements and confirmations | Monthly / year-end | Statements generated per customer; confirmation replies tracked and differences listed |
| Request write-offs and record recoveries | As needed | Write-off request pre-filled with ageing, collection history and provision already held |
| Request customer refunds and late-payment interest | As needed | Credit balances listed for refund or adjustment; interest computed on overdue invoices where the contract allows |

**Makes / prepares:**

- **Allocate customer receipt** — *Checked by* Accounts Manager, on exceptions
- **Short-payment difference above tolerance** — *Checked by* Accounts Manager
- **Reversal or re-allocation of a cleared item** — *Checked by* Accounts Manager
- **Dispute raised or resolved with value effect** — *Checked by* Accounts Manager
- **Customer statements, dunning, promise-to-pay** — *Checked by* — (no approval step; the Internal Auditor tests samples after the fact)
- **Balance confirmations** — *Checked by* Accounts Manager reviews responses
- **Receivables write-off** — *Checked by* Accounts Manager below the threshold, Finance Controller above it
- **Customer refund or adjustment of a credit balance** — *Checked by* Accounts Manager; the approved refund then goes to Banking as a payment advice for release
- **Late-payment interest on customers (Debit Note raised in Sales)** — *Checked by* Accounts Manager
- **Waiver of contracted late-payment interest** — *Checked by* Finance Controller

### 13.3 FEMA / RBI

**Responsibilities:** Follows up export receivables against the 9-month realisation limit; requests an extension or write-off through the AD bank where realisation isn't possible

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Chase export realisation | Weekly | Export invoices by days since shipment, with alerts at 6 and 8 months before the 9-month limit; customer promise-to-pay linked |

**Makes / prepares:**

- **Extension or write-off request for unrealised exports (through the AD bank)** — *Checked by* Finance Controller

## 14. Accounts Payable Officer / Payables Executive — R-AP01 (proposed)

### 14.1 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Prepares payment proposals, manages holds and disputes on payables, decides cash discounts, tracks advances and retention, reconciles vendor statements, monitors MSME due dates

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Prepare the payment proposal | Weekly | Proposed list ordered by statutory risk (MSE due dates, 180-day ITC) then due date; duplicate-bill and held-bill checks; cash-discount windows worth taking highlighted with the saving |
| Manage holds and disputes | As needed | Hold reasons tracked with ageing; bills on hold past a set number of days escalated |
| Track advances and retention | Ongoing | Advances not adjusted against bills after a set period flagged; retention due for release listed with completion status |
| Reconcile vendor statements | Monthly | Vendor statement read and auto-matched to open items; differences categorised (bill not received, payment not credited, TDS, debit note, supplier credit note not yet booked) |
| Monitor micro/small-vendor due dates | Weekly | Bills approaching the MSMED Act limit, with the 43B(h)-equivalent exposure if missed |
| Propose write-backs | Year-end | Old credit balances with no activity, and the evidence for write-back |

**Makes / prepares:**

- **Payment proposal** — *Checked by* Accounts Manager; once approved, the system sends it to Banking as a payment advice for the Payments / Disbursement Officer to release
- **Payment hold, place or release** — *Checked by* Accounts Manager (quality hold: Procurement Manager; compliance hold: Compliance Officer); a hold is released by someone other than the person who placed it
- **Reversal or re-allocation of a cleared item** — *Checked by* Accounts Manager
- **Dispute raised or resolved with value effect** — *Checked by* Accounts Manager
- **Cash discount decision, including outside contracted terms** — *Checked by* Accounts Manager
- **Vendor advance or retention release** — *Checked by* Accounts Manager (retention also needs the Procurement Manager to confirm completion)
- **Vendor statement reconciliation** — *Checked by* Accounts Manager
- **Balance confirmations** — *Checked by* Accounts Manager reviews responses
- **Write-back of payables** — *Checked by* Finance Controller

# Stage 5. Bank and treasury

### 14.2 Labour Compliance

**Responsibilities:** Keeps a compliance hold on every contractor bill that deployed labour until the Compliance Officer has verified the contractor's PF/ESI evidence; the Compliance Officer releases it

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Hold contractor bills pending labour evidence | Per bill | Bill kept out of payment proposals until verification is recorded; ageing of held bills by contractor |

**Makes / prepares:**

- **Compliance hold on a contractor bill** — *Checked by* Compliance Officer (releases after verification)

### 14.3 FEMA / RBI

**Responsibilities:** Links each import payment to its Bill of Entry so it closes in IDPMS

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Close import BoEs in IDPMS | Per import payment | Each import payment linked to its BoE; advance payments without a BoE tracked until the BoE arrives |

**Makes / prepares:**

- **Import payment linked to its BoE** — *Checked by* Accounts Manager

## 15. Master Administrator — R06a

### 15.1 Bank Transactions Module

**Responsibilities:** Creates and maintains bank account masters, signatories, sanction details, loan schedules, covenant and renewal calendars.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Create and maintain bank account masters and signatories | As needed | IFSC/SWIFT validation; dormant accounts (no movement for a set period) flagged for status review |
| Maintain loan schedules, BG/LC records and covenant calendars | As needed | Sanction letter terms read into the schedule for confirmation; regeneration previewed before approval |

**Makes / prepares:**

- **Open / close / change status of a bank account** — *Checked by* Treasury / Finance Head (board resolution attached where required)
- **Signatory change** — *Checked by* Treasury / Finance Head
- **Sanction, limit, rate or renewal details (OD/CC/TL/BG/LC)** — *Checked by* Treasury / Finance Head
- **Schedule regeneration (prepayment, moratorium, rate reset)** — *Checked by* Treasury / Finance Head
- **BG/LC issue, renewal, closure** — *Checked by* Treasury / Finance Head

## 16. Payments / Disbursement Officer — R06b

### 16.1 Trade Receivables & Trade Payables (AR/AP) Module (as Treasury / Payments Officer — interface role)

**Responsibilities:** Releases payments that reach Banking as payment advices from approved payment proposals and approved customer refunds; not an AR/AP role, listed as an interface

*Interface only — the work list is under the Banking entry for this role.*

### 16.2 Bank Transactions Module

**Responsibilities:** Executes approved payments through bank portals or H2H/API push, records UTR references, manages the cheque register (issue, cancellation, stop-payment), handles dishonour of issued cheques. Cannot edit amount or payee on an approved voucher.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Release approved payments | Daily | H2H/API push where available; for portal payments, the UTR is matched back automatically once the statement arrives |
| Manage the cheque register | As needed | Leaf status tracked; cheques issued but not delivered, and gaps in leaf sequence, flagged |

**Makes / prepares:**

- **Cheque issue, cancellation and stop-payment** — *Checked by* Accounts Manager
- **Payment release (portal or H2H/API push)** — *Checked by* — (releases only approved vouchers; cannot edit amount or payee)

### 16.3 Taxation Engine (as Finance / Treasury)

**Responsibilities:** Direct Tax Engine — Executes the TDS/duty payment (challan) once Compliance Officer has validated; Indirect Tax Engine — Executes the GST payment (challan) once Compliance Officer has validated; Payroll (HR Module) — Executes statutory payments (PF, ESI, PT, salary TDS challans), maintains financial reconciliation

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Execute tax payments | Per due date | Validated challans only; shows due date and interest if paid late; blocks RCM being discharged from ITC |
| Release foreign remittances | Per remittance | Released only after Form 145 (and Form 146 where needed) is on file |

**Executes payment for:**

- GST computation and return draft (GSTR-1, 3B)
- RCM self-invoice and RCM liability
- GST TDS/TCS (Sec 51/52-equivalent)
- GSTR-9 / 9C-equivalent
- Customs duty from Bill of Entry
- TDS/TCS computation and challan (non-salary)
- Foreign remittance: taxability, DTAA, Form 145
- Advance tax projection and instalment
- Professional Tax (employer)
- Interest and late fee

### 16.4 Notice & Litigation

**Responsibilities:** Pays pre-deposits and demands once the Finance Controller has approved them

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Pay pre-deposits and demands | As approved | Payment linked to the matter; challan and acknowledgement attached to the notice record |

**Executes payment for:**

- Pre-deposit for appeal, or demand payment — approved by: Finance Controller

## 17. Reconciliation Executive — R01b (proposed)

### 17.1 Bank Transactions Module

**Responsibilities:** Uploads statements daily, clears the exception queue, follows up on stale unpresented cheques and unidentified receipt credits. Checks bank-debited interest and charges against the system's expected figures. Prepares the BRS. Does not create vouchers — unrecorded items are flagged to the Accounts Executive.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Import statements | Daily | API/H2H pull where available; file adapters otherwise; missing-day and balance-continuity checks |
| Confirm matches and clear exceptions | Daily | Exact, fuzzy and split/combined matches suggested with confidence; unidentified credits matched to likely customers by amount and remitter name |
| Check bank charges and interest | Monthly | Expected vs debited interest and charges per account; differences listed for dispute with the bank |
| Prepare the BRS | Month-end | Generated in seconds; unreconciled items aged |

**Makes / prepares:**

- **Statement import and auto-match** — *Checked by* Accounts Manager confirms fuzzy and split matches
- **Unrecorded statement line flag (charges, interest, unidentified credits)** — *Checked by* — (a flag, not a voucher; the Accounts Executive posts the voucher and the Accounts Manager approves it)
- **Dishonour / return flag** — *Checked by* — (a flag, not a voucher; the Accounts Executive posts the reversal and the Accounts Manager approves it)
- **Month-end BRS** — *Checked by* Finance Controller

## 18. Treasury / Finance Head — R06

### 18.1 Bank Transactions Module

**Responsibilities:** Owns bank relationships. Approves new bank account masters, signatory changes, limits, rate changes, prepayments, renewals and BG/LC events. Owns the 13-week cash flow forecast. Requests escrow withdrawals. Reviews the CEO dashboard and digest.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the Daily Bank Position | Daily | Balances vs yesterday; surplus-to-sweep suggestion against the costliest drawn facility |
| Maintain the 13-week cash flow forecast | Weekly | Inflows from AR/AP expected collections and outflows from payment proposals, EMIs and statutory dues; last week's forecast vs actual |
| Approve new accounts, limits, rates, renewals and BG/LC events | As needed | Comparison of rates and commission across banks at renewal time |
| Monitor facilities | Weekly | Utilisation, DP headroom, upcoming EMIs and renewals, BG/LC expiries |

**Makes / prepares:**

- **Escrow withdrawal** — *Checked by* Lender / controlling authority approval recorded, then Finance Controller
- **13-week cash flow forecast** — *Checked by* — (reconciled weekly to actuals)

**Approves / checks:**

- **Open / close / change status of a bank account** — *Made by* Master Administrator
- **Signatory change** — *Made by* Master Administrator
- **Sanction, limit, rate or renewal details (OD/CC/TL/BG/LC)** — *Made by* Master Administrator
- **Schedule regeneration (prepayment, moratorium, rate reset)** — *Made by* Master Administrator
- **BG/LC issue, renewal, closure** — *Made by* Master Administrator

# Stage 6. Payroll (HR-owned)

### 18.2 FEMA / RBI

**Responsibilities:** Checks the ECB-2 return where the company has an external commercial borrowing

**Approves / checks:**

- **ECB-2 return (monthly, through the AD bank)** — *Made by* Compliance Officer

## 19. Payroll Operations Specialist — HR module

### 19.1 Taxation Engine

**Responsibilities:** Payroll (HR Module) — Calculates PF/ESI/PT/salary-TDS deductions; produces payroll register, bank-advice/payment file (PO-05), payroll accounting output (PO-06)

*HR/Payroll-owned role — detailed work list sits in the HR module. The payroll accounting output (PO-06) is posted as the payroll journal by the Accounts Executive and approved by the Accounts Manager (11.8, 12.8).*

## 20. Payroll & Statutory Compliance Specialist — HR module

### 20.1 Taxation Engine

**Responsibilities:** Payroll (HR Module) — Reviews payroll-supplied statutory output for completeness/accuracy — not recomputation (PS-03); tracks payment evidence and closes compliance (PS-05)

*HR/Payroll-owned role — detailed work list sits in the HR module.*

### 20.2 Labour Compliance

**Responsibilities:** Files the company's own labour returns and registrations — minimum wages, Payment of Bonus Act, Labour Welfare Fund, Shops & Establishment registration and renewals, POSH annual report; computes the Labour Code wage-definition impact on PF and gratuity for the Accounts Manager

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| File labour returns and registrations | Per due date | Due-date calendar by state and establishment; minimum wage rates by state, zone and skill checked against pay; LWF contributions; Shops & Establishment renewals; POSH annual report |
| Compute Labour Code wage-definition impact | On change / year-end | Wage base recomputed employee-wise, with the PF and gratuity effect passed to Accounts |

**Makes / prepares:**

- **Labour returns and registrations** — *Checked by* Compliance Officer (tracks filing)
- **Labour Code wage-base working** — *Checked by* Accounts Manager (uses it for provisions)

# Stage 7. Comply and sign off

## 21. Compliance Officer — R24

### 21.1 Purchase Module

**Responsibilities:** Sets and maintains GST rate, RCM applicability, ITC eligibility and TDS section tagging in the policy engine; approves voucher-level tax/TDS overrides requested by the Accounts Executive; validates the Accounts Manager's IMS actions before the GSTR-2B cutoff; owns GSTR-2B reconciliation against Purchase Vouchers; validates RCM self-invoices and liability (prepared by the Accounts Manager); validates the ITC reversal on supplier credit notes; confirms cross-GSTIN IBT treatment

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Maintain GST/RCM/ITC/TDS policy tagging in the masters | As needed | Suggests tagging for new items/vendors from HSN, service type and registration status |
| Approve voucher-level tax/TDS overrides | As requested | Override log with pattern view — which user or vendor overrides most, and the tax impact |
| Validate RCM self-invoices and RCM liability | Per RCM purchase | Detects RCM cases automatically; tracks that the self-invoice exists and RCM tax is paid in cash before the matching ITC is released |
| Validate IMS actions before the GSTR-2B cutoff | Monthly, before the 14th | Reviews the Accounts Manager's Accept/Reject/Pending batch; highlights Pending lines that will be deemed accepted and rejected credit notes that reverse ITC |
| GSTR-2B reconciliation | Month-end | Fuzzy auto-match on invoice number, date and amount; mismatches categorised as missing in 2B, missing in books, or value difference |
| ITC risk monitoring | Monthly | ITC at risk — vendors not filing GSTR-1/3B; blocked credits; Rule 37 180-day reversals (the tracker sits in AR/AP, where the Accounts Manager prepares and the Compliance Officer validates) |
| TDS compliance | Monthly / quarterly | TDS deducted but not deposited; threshold breaches missed; higher-rate flag for non-filers/specified persons from the Compliance Check status (legacy 206AB) |
| Cross-GSTIN IBT treatment | Per transfer | Confirms the Tax Invoice/Delivery Challan exists and ITC is taken at the receiving branch |

**Makes / prepares:**

- **GST/RCM/ITC/TDS policy tagging (masters)** — *Checked by* Accounts Manager
- **GSTR-2B reconciliation** — *Checked by* —

**Approves / checks:**

- **Tax/TDS override (voucher-level)** — *Made by* Accounts Executive (requests)
- **RCM self-invoice** — *Made by* Accounts Manager (system-generated from the Purchase Voucher)
- **IMS action on inward documents** — *Made by* Accounts Manager
- **ITC reversal on a supplier credit note received** — *Made by* Accounts Executive

*Cross-GSTIN Inter-Branch Transfers are approved once, as the inter-branch Stock Transfer (21.2).*

### 21.2 Inventory Engine

**Responsibilities:** Confirms GST treatment (including deemed-supply) on cross-state Inter-Branch Transfers; triggers e-way bill where a stock movement requires one; confirms ITC reversal on stock lost, stolen, destroyed or written off

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Confirm GST on cross-state transfers and e-way bills | Per transfer | Flags transfers needing a tax invoice or e-way bill that don't have one |
| ITC reversal on written-off stock | Per write-off | Computes ITC to reverse on goods lost, stolen, destroyed or written off (Sec 17(5)) |

**Approves / checks:**

- **Stock Transfer (inter-branch)** — *Made by* Stores / Inventory Officer, both branches
- **Bank stock statement (Cash Credit)** — *Made by* Accounts Executive (generates from valuation)
- **ITC reversal on written-off stock** — *Made by* Accounts Executive

### 21.3 Sales Module

**Responsibilities:** Reviews and logs overrides on system-derived GST rate on sales; owns e-invoice/IRN exception handling and e-way bill expiry monitoring, including e-way bills raised against delivery challans; validates the post-supply discount (15(3)(b)) flag and GST-on-advance treatment; maintains LUT validity for exports; owns Sales Register vs GSTR-1 reconciliation; tracks cross-branch deemed-supply GST treatment on Inter-Branch Transfers

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Handle IRN/e-invoice exceptions | Daily | Retry queue with the GSTN error reason; invoices on offline fallback listed until an IRN is received |
| Monitor e-way bills | Daily | E-way bills nearing expiry with goods still in transit; invoices over the threshold with no e-way bill |
| Approve tax overrides | As requested | Override log with pattern view by user and customer, and the tax impact |
| Validate post-supply discount and GST-on-advance treatment | As requested | Checks the pre-agreement exists on the Price List/Contract before GST is reduced on a credit note; checks GST-on-advance was paid where it applies |
| Maintain LUT validity for exports | Annually and per export | Flags GSTINs whose LUT expires in the next 30 days, and export invoices raised without a valid LUT |
| Sales Register vs GSTR-1 and HSN summary | Monthly | Auto-match of books to GSTR-1; missing-in-return and missing-in-books lists; HSN summary built from item master data |
| Cross-GSTIN inter-branch transfers | Per transfer | Confirms the deemed-supply tax invoice and e-way bill exist |

**Makes / prepares:**

- **IRN / e-invoice exceptions, GSTR-1 reconciliation** — *Checked by* —

**Approves / checks:**

- **E-way bill Part-B and expiry monitoring** — *Made by* Stores / Inventory Officer (Part-B)
- **E-way bill against a delivery challan (no tax invoice)** — *Made by* Stores / Inventory Officer
- **Post-supply discount reducing GST (15(3)(b) flag)** — *Made by* Billing Executive (sets on the note from the scheme reference on the approved adjustment)
- **GST Receipt / Refund Voucher on advance** — *Made by* Billing Executive
- **Export / SEZ invoice (LUT, Shipping Bill)** — *Made by* Billing Executive
- **Tax override** — *Made by* Billing Executive (requests)

*Cross-GSTIN Inter-Branch Transfers are approved once, as the inter-branch Stock Transfer (21.2).*

### 21.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Owns the MSME register, Udyam data validity and MSME Form 1 filing; validates the 43B(h) list, the ITC reversal and re-availment, and 26AS mismatches escalated to tax; owns the payment-recognition rule for set-off and netting; reviews Schedule III report rules

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Own the MSME register and MSME Form 1 | Half-yearly | Form 1 extract built from open items and payment dates |
| Validate 43B(h) list, ITC reversal and re-availment | Year-end / monthly | Changes since last run and items that moved across the threshold |
| Handle escalated 26AS mismatches | Quarterly | Mismatch ageing and amount at risk |

**Makes / prepares:**

- **MSME Form 1 extract and filing** — *Checked by* Finance Controller
- **Payment-recognition rule (set-off, netting, credit note)** — *Checked by* Finance Controller

**Approves / checks:**

- **Payment hold for compliance reasons, place or release** — *Made by* Payables Executive; released by someone other than the person who placed it
- **43B(h) list and Section 22 disclosure** — *Made by* Accounts Manager
- **180-day ITC reversal and re-availment working** — *Made by* Accounts Manager

### 21.5 Bank Transactions Module

**Responsibilities:** Tracks monthly stock statements for CC accounts (figures drawn from the Inventory valuation), drawing power, covenant tests (DSCR, current ratio) and submission deadlines.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Track CC stock statements and DP | Monthly | Stock statement drawn from the Inventory valuation; DP computed; shortfall alert before submission |
| Track covenant tests | Per test date | Covenants projected from the latest books and the 13-week forecast, so a likely breach is flagged before the test date |

**Approves / checks:**

- **CC stock statement and covenant tests** — *Made by* Accounts Executive generates the stock statement from the Inventory valuation

### 21.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Validates the TDS computation for completeness/accuracy before filing; owns due-date tracking, certificate issuance and post-payment evidence close-out; Indirect Tax Engine — Validates the GST computation for completeness/accuracy before filing (including ITC-04 for job work); owns due-date tracking and post-payment evidence close-out; maintains 17(5) blocked-credit tags, Rule 86B exemptions and GST registration amendments; runs the monthly department's-view cross-match and notice-risk score. Notices are handled in Notice & Litigation (21.8)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Validate computations before filing | Per return / challan | Checklist of completeness tests with any failure explained; comparison with last period and with the books |
| Validate IMS batch before the 2B cutoff | Monthly | Summary of accepted, rejected and pending lines with ITC impact; rejected credit notes highlighted |
| Maintain rate, threshold and exemption masters | As notified | Notification-change alerts; shows which items, vendors and open transactions a change will affect |
| Run non-filer checks and LUT renewals | Start of FY / as due | Vendors due for a re-check; GSTINs whose LUT expires in the next 30 days |
| Maintain 17(5) blocked-credit tags on expense ledgers | Per new ledger / quarterly | Suggests the tag from the ledger name and past invoices (motor vehicles, food and beverages, club memberships, works contract for immovable property, gifts, personal use); untagged expense ledgers listed |
| Confirm Rule 86B exemptions | Monthly | Confirms whether an exemption applies (for example, income tax above ₹1 lakh paid in each of the last two years) before the 1% cash rule is lifted |
| Manage GST registration amendments and additional places of business | On change | A new branch, godown or address in Business Core raises an amendment or an additional place of business on the right state GSTIN; the 15-day amendment window tracked |
| Run the "department's view" cross-match | Monthly | Runs the analytics the tax authorities run — GSTR-1 vs GSTR-3B vs e-invoice vs e-way bill; turnover in GST returns vs ITR vs 26AS/AIS receipts; TDS claimed vs deposited — with each difference explained by the Accounts Manager, and a notice-risk score by GSTIN and by tax before the department acts |
| Close out post-payment evidence | After each payment | Challan and filing acknowledgement matched to the liability; open items listed |

**Makes / prepares:**

- **LUT renewal** — *Checked by* Finance Controller
- **Non-filer / specified-person check** — *Checked by* —
- **17(5) blocked-credit tag on expense ledgers** — *Checked by* Accounts Manager
- **GST registration amendment / additional place of business** — *Checked by* Finance Controller
- **Notice-risk score (monthly)** — *Checked by* Finance Controller
- **Rate / threshold / exemption master change** — *Checked by* Finance Controller

**Approves / checks:**

- **GST computation and return draft (GSTR-1, 3B)** — *Made by* Accounts Manager
- **IMS action on inward documents** — *Made by* Accounts Manager
- **RCM self-invoice and RCM liability** — *Made by* Accounts Manager (system-generated from the Purchase Voucher)
- **GST TDS/TCS (Sec 51/52-equivalent)** — *Made by* Accounts Manager
- **GSTR-9 / 9C-equivalent** — *Made by* Accounts Manager
- **Refund application** — *Made by* Accounts Manager
- **ISD distribution** — *Made by* Accounts Manager
- **Customs duty from Bill of Entry** — *Made by* Accounts Executive (captures BoE in Purchase); Accounts Manager (computes)
- **TDS/TCS computation and challan (non-salary)** — *Made by* Accounts Manager
- **Lower/nil deduction certificate upload** — *Made by* Accounts Executive
- **Quarterly TDS/TCS return and certificates** — *Made by* Accounts Manager
- **26AS / AIS reconciliation (entity's own credits)** — *Made by* Accounts Manager
- **Foreign remittance: taxability, DTAA, Form 145** — *Made by* Accounts Manager
- **Advance tax projection and instalment** — *Made by* Accounts Manager
- **Professional Tax (employer)** — *Made by* Accounts Manager
- **Interest and late fee** — *Made by* System computes; Accounts Manager posts
- **Voucher-level tax override** — *Made by* Accounts Executive (requests)
- **ITC-04 (job work)** — *Made by* Accounts Manager
- **Disallowance-trigger or GST time-limit override** — *Made by* Accounts Executive
- **Rule 86B working in GSTR-3B** — *Made by* Accounts Manager
- **Cross-match difference explanations** — *Made by* Accounts Manager
- **Disallowance working (40(a)(ia), 40A(3), 43B-equivalents)** — *Made by* Accounts Manager

### 21.7 Fixed Assets Module

**Responsibilities:** Owns the Schedule II sub-category to Income Tax block crosswalk; reviews and logs every method/useful-life override against its Schedule II disclosure justification; owns the deferred tax reconciliation, the tax block schedule (Form 3CD-ready), capital-goods GST ITC reversal on disposal, and CARO 2020 Clause 3(i) disclosures

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve method/useful-life overrides on individual assets | As requested | Shows the block default, the requested value, the Schedule II disclosure it will need and the depreciation impact |
| Maintain the Schedule II sub-category to Income Tax block crosswalk | As needed | Flags new sub-categories not yet mapped to a block, and blocks whose rate changed by notification |
| Prepare the tax block schedule (Form 3CD-ready) | Year-end | Built automatically from the register; flags blocks going negative, empty blocks and additions near the 180-day boundary |
| Own the deferred tax working | Monthly / year-end | Timing difference per asset and block, rolled forward every period |
| Capital-goods ITC tracking and reversal | Per disposal | Computes ITC to reverse when a capital good is disposed of within the credit period |
| CARO 3(i) disclosures | Year-end | Physical verification coverage, title-deed status for immovable property, revaluation disclosure — assembled from the register |

**Approves / checks:**

- **Method / useful-life override on an individual asset** — *Made by* Accounts Executive (requests)
- **Capital-goods ITC reversal on disposal** — *Made by* Accounts Executive

### 21.8 Notice & Litigation

**Responsibilities:** Owns one register of notices and litigation from every authority — Income Tax, GST, TDS/TRACES, Customs, PF/ESI, labour, ROC, municipal and pollution control board; logs each notice, assembles the working, drafts the reply for CA review, and tracks deadlines, pre-deposits and appeal limitation dates. PF/ESI and labour notices take input from the Payroll & Statutory Compliance Specialist

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Log a notice | As received | Reads the notice PDF and extracts the authority, section, period, demand, issues raised and deadline; links it to the returns and entities concerned |
| Assemble the working | Per notice | Pulls the relevant ledgers, returns, reconciliations and past correspondence for the period and issues |
| Draft the reply | Per notice | Point-by-point draft built from the working and similar past replies, for review by the company's CA before the Finance Controller approves |
| Track deadlines, pre-deposits and appeals | Ongoing | Reply dates, hearings, pre-deposit amounts and appeal limitation dates on one calendar, escalated as they approach |
| Feed exposure | Monthly | Demand, interest and penalty per matter passed to the contingent liability working and the CEO dashboard |

**Makes / prepares:**

- **Notice record (extracted details confirmed)** — *Checked by* —
- **Reply to a notice, after CA review** — *Checked by* Finance Controller
- **Appeal decision and pre-deposit request** — *Checked by* Finance Controller

### 21.9 Labour Compliance

**Responsibilities:** Verifies contractor PF/ESI evidence before any contractor bill is paid (principal-employer liability) and releases the compliance hold; tracks the company-level labour calendar filed by HR; monitors Labour Code and state rule changes

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Verify contractor PF/ESI before payment | Per contractor bill | Evidence from the Contracts & Services Officer shown against the workers deployed under the Works Order; releases the hold only when every deployed worker is covered |
| Track the labour compliance calendar | Monthly | Minimum wages, Bonus Act, LWF, Shops & Establishment and POSH filings by establishment, with status from HR |
| Monitor Labour Code changes | On notification | Flags central and state rule changes affecting the wage definition, PF, gratuity or registrations |

**Approves / checks:**

- **Contractor compliance evidence and release of the contractor-bill hold** — *Made by* Contracts & Services Procurement Officer (evidence); Payables Executive (hold)
- **Labour returns and registrations (filing tracked)** — *Made by* Payroll & Statutory Compliance Specialist

### 21.10 FEMA / RBI

**Responsibilities:** Monitors EDPMS / IDPMS status; prepares the FLA return (by 15 July, where there is FDI or ODI), FC-GPR (within 30 days of allotting shares to a foreign investor) and ECB-2 (monthly, where there is an ECB)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Monitor EDPMS / IDPMS | Monthly | Overdue export realisations and open BoEs reconciled to the AD bank's EDPMS / IDPMS data |
| Prepare the FLA return | Annually, by 15 July | Foreign liabilities and assets pulled from share capital, overseas investments and balances with overseas parties |
| Prepare FC-GPR | Within 30 days of allotment | Allotment details, FIRC / KYC and valuation certificate checklist |
| Prepare ECB-2 | Monthly | Drawdowns, repayments and interest from the loan schedule |

**Makes / prepares:**

- **FLA return** — *Checked by* Finance Controller
- **FC-GPR** — *Checked by* Finance Controller
- **ECB-2 return** — *Checked by* Treasury / Finance Head

## 22. Finance Controller — R-FC01 (proposed)

### 22.1 Purchase Module

**Responsibilities:** Approves every change to vendor bank details (after penny-drop/call-back verification); approves tax/TDS overrides above the value threshold

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve vendor bank-detail changes | Per change | Shows penny-drop/name-match result, who requested it, and any open invoices or payment proposals for that vendor; high-risk flag if the change came by email or close to a large payment |
| Approve high-value tax/TDS overrides | As requested | Shows the system-derived treatment, the override requested, the tax impact and the Compliance Officer's view side by side |

**Approves / checks:**

- **Vendor bank-detail change** — *Made by* Accounts Executive (with penny-drop/call-back evidence)
- **Tax/TDS override (voucher-level)** — *Made by* Accounts Executive (requests)

### 22.2 Inventory Engine

**Responsibilities:** Approves scrap, damage, theft and expiry write-offs above threshold; approves the slow-moving/expired/NRV provision; approves costing-method (Valuation Method) changes proposed by the Accounts Manager

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve scrap, damage, theft and expiry write-offs above threshold | As requested | Value, reason, item history and whether an insurance claim or vendor return is possible |
| Approve the NRV/obsolescence provision | Quarter / year-end | Provision roll-forward and effect on margin |
| Approve costing-method changes | As proposed | Valuation impact under the old and new method, the effect on opening and closing stock, and the accounting-policy disclosure the change will need |

**Approves / checks:**

- **Physical Stock Count** — *Made by* Count team independent of the godown's custodian — Stores / Inventory Officers from other godowns, blind count (count entry)
- **Scrap / damage / theft / expiry write-off** — *Made by* Stores / Inventory Officer
- **Slow-moving, expired and NRV provision** — *Made by* Accounts Executive
- **Costing method change (Valuation Method Change)** — *Made by* Accounts Manager (proposes)

### 22.3 Sales Module

**Responsibilities:** Approves credit-hold releases requested by the Credit Controller or the Sales Manager — the only role that can release a hold; gives second approval on Credit Notes and tax overrides above threshold (after the Accounts Manager or Compliance Officer); bad-debt write-offs are approved in AR/AP (22.4); distinct from Collections, so it can't self-approve what it collected elsewhere

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve credit-hold releases | As requested | Exposure, overdue, payment history and the size of the order waiting, in one screen, with the requester's reason (Credit Controller or Sales Manager); logs every release for the Internal Auditor |
| Second approval on credit notes above threshold | As requested | Credit note value against the original invoice, the reason code, and the customer's credit-note history |

**Approves / checks:**

- **Credit-hold release** — *Made by* Credit Controller or Sales Manager (requests)
- **Credit Note (return/adjustment), above threshold** — *Made by* Billing Executive (issues against the approved adjustment)
- **Tax override, above threshold** — *Made by* Billing Executive (requests)

### 22.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Approves write-offs and write-backs, provision runs and matrix, netting above threshold, tax-credit write-offs and waivers of contracted late-payment interest; signs Schedule III ageing; signs off the AR/AP module close as part of the company-wide period lock; sets policy on MSME interest accrual. Vendor bank-detail changes are approved in Purchase (22.1)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve provision runs, write-offs above threshold and write-backs | Month-end / as needed | Provision roll-forward; write-off history by customer and collector |
| Approve netting above threshold and tax-credit write-offs | As needed | Agreement evidence and net effect shown |
| Sign off the AR/AP module close | Monthly | Nothing pending approval; reconciliation clean; feeds the company-wide period lock (22.8) |

**Approves / checks:**

- **MSME Form 1 extract and filing** — *Made by* Compliance Officer
- **Payment-recognition rule (set-off, netting, credit note)** — *Made by* Compliance Officer
- **Provision run** — *Made by* Accounts Executive (Accounts Manager reviews specific provisions first)
- **Provision matrix or specific provision** — *Made by* Accounts Manager
- **Receivables write-off (above threshold)** — *Made by* Collections Officer
- **Waiver of contracted late-payment interest** — *Made by* Collections Officer
- **Write-back of payables** — *Made by* Payables Executive
- **Netting document (above threshold)** — *Made by* Accounts Executive
- **Unclaimable TDS credit write-off** — *Made by* Accounts Executive
- **Schedule III ageing sign-off** — *Made by* Accounts Manager
- **AR/AP module close** — *Made by* Accounts Manager

### 22.5 Bank Transactions Module

**Responsibilities:** Signs off month-end BRS, interest accrual journals and the consolidated position. Handles higher-slab approvals, BG invocations and escrow withdrawals (after lender approval). Reviews delegations.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Sign off BRS, accruals and the consolidated position | Month-end | Close checklist per account; accrual vs bank debit differences |
| Approve above-slab vouchers, BG invocations and escrow withdrawals | As needed | Exposure and lender approval evidence shown |
| Review delegations and escalations | Monthly | Delegations granted, approvals made by delegates, and SLA breaches |

**Approves / checks:**

- **Payment, receipt, contra and journal vouchers (above the top slab)** — *Made by* Accounts Executive
- **Month-end BRS** — *Made by* Reconciliation Executive
- **Interest, EMI and BG/LC commission accruals** — *Made by* System-generated; Accounts Executive reviews
- **BG invocation (liability voucher)** — *Made by* Accounts Executive
- **Escrow withdrawal** — *Made by* Treasury / Finance Head (requests)
- **Approval delegation** — *Made by* Approver (nominates delegate)
- **Legacy data migration** — *Made by* Accounts Executive

### 22.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Approves rate/threshold master changes and overrides above threshold; approves advance tax projection and tax provision (including disallowances); Indirect Tax Engine — Approves rate/exemption master changes and overrides above threshold; approves DRC-03 payments, refund filings and LUT renewal; approves GST registration amendments; reviews the monthly notice-risk score. Notices are approved in Notice & Litigation (22.9)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve rate master changes and high-value overrides | As requested | Impact view: which transactions and returns change, and by how much |
| Approve advance tax projections and tax provisions | Quarterly | Projection vs last quarter and vs prior year; effective tax rate trend |
| Review the notice-risk score | Monthly | Score by GSTIN and tax, the largest unexplained differences and the explanations given |
| Approve DRC-03 payments and refund filings | Annually / as needed | Source of each difference shown before payment or filing |

**Approves / checks:**

- **GSTR-9 / 9C-equivalent** — *Made by* Accounts Manager
- **Refund application** — *Made by* Accounts Manager
- **LUT renewal** — *Made by* Compliance Officer
- **Foreign remittance: taxability, DTAA, Form 145** — *Made by* Accounts Manager
- **Advance tax projection and instalment** — *Made by* Accounts Manager
- **Tax provision and deferred tax entry** — *Made by* Accounts Manager
- **GST registration amendment / additional place of business** — *Made by* Compliance Officer
- **Notice-risk score** — *Made by* Compliance Officer
- **Disallowance working, with the tax provision** — *Made by* Accounts Manager
- **Rate / threshold / exemption master change** — *Made by* Compliance Officer
- **Voucher-level tax override** — *Made by* Accounts Executive (requests)

### 22.7 Fixed Assets Module

**Responsibilities:** Approves category/sub-category defaults (useful life, method) at the block level; signs off the month-end depreciation run and the Schedule II fixed asset register; approves revaluation, impairment and physical verification outcomes; signs off the opening register migration; signs off the Fixed Assets year-end close once audited (the lock itself is the single company-wide lock in 22.8)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve block-level defaults | Per new block or change | Compares proposed useful life and method with Schedule II Part C and with peer practice already on the system |
| Sign off the depreciation run and the Schedule II register | Month-end | Movement summary by class; lists assets whose depreciation changed materially from last month and why |
| Approve revaluation and impairment | As needed | Valuer's report, computed reserve or loss, and the disclosure it triggers |
| Approve physical verification outcomes | Per campaign | Missing, excess and damaged assets with values, ready for the write-off or addition decision |
| Sign off the Fixed Assets year-end close | Year-end, post-audit | Checks nothing is pending approval; feeds the company-wide period lock |

**Approves / checks:**

- **Category/sub-category default (useful life, method) at block level** — *Made by* Accounts Executive (proposes)
- **Depreciation run** — *Made by* Accounts Executive (runs)
- **Revaluation** — *Made by* Accounts Executive (with valuer's report)
- **Impairment** — *Made by* Accounts Executive
- **Physical verification variance (missing/excess/damaged)** — *Made by* Verification team (custodians of other locations, observed by Internal Auditor)
- **Opening register migration** — *Made by* Accounts Executive
- **Fixed Assets module close** — *Made by* Accounts Manager

### 22.8 Vouchers & Ledgers and Period Close

**Responsibilities:** Signs off the chart of accounts and opening trial balance at migration; approves ledger-group and Schedule III mapping changes; approves general journals above the top slab; signs off the monthly trial balance; approves the financial statements and year-end close entries; applies the single company-wide period lock once every module close is in, and is the only role that can reopen a locked period, with a logged reason

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Sign off the migration chart of accounts and opening trial balance | One-time | Opening trial balance against the legacy closing trial balance and against each sub-ledger's opening; differences listed |
| Approve ledger-group and Schedule III mapping changes | As requested | Shows which balances move between Schedule III lines and whether comparatives are affected |
| Approve above-slab general journals | As requested | Journal with supporting documents, the ledgers it touches and similar past journals |
| Sign off the trial balance | Month-end | Control-account vs sub-ledger status and material movements, with the Accounts Manager's commentary |
| Lock the period | Month-end; year-end after audit | Locks every module together, only when each module close is complete and the trial balance is signed off; a reopen needs a reason and is logged for the Internal Auditor |
| Approve the financial statements | Quarterly / year-end | Draft statements with variance commentary; audit adjustments listed separately from management entries |

**Approves / checks:**

- **Chart of accounts and ledger set-up at migration** — *Made by* Accounts Executive (Accounts Manager checks first)
- **Opening trial balance** — *Made by* Accounts Executive (Accounts Manager checks first)
- **Ledger / group change affecting a group or Schedule III mapping** — *Made by* Accounts Manager
- **General journal voucher (above the top slab)** — *Made by* Accounts Executive
- **Trial balance review** — *Made by* Accounts Manager
- **Period close checklist (period lock)** — *Made by* Accounts Manager (submits)
- **Financial statements and notes** — *Made by* Accounts Manager
- **Year-end close entries and audit adjustments** — *Made by* Accounts Manager

### 22.9 Notice & Litigation

**Responsibilities:** Approves replies after CA review, appeal decisions and pre-deposits; approves the provision / contingent liability classification per matter

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve replies, appeals and pre-deposits | As needed | Matter summary, exposure, the CA's view, deadline and similar past outcomes |
| Approve provision / contingent liability | Quarterly / year-end | Exposure register with suggested classification per matter |

**Approves / checks:**

- **Reply to a notice, after CA review** — *Made by* Compliance Officer
- **Appeal decision and pre-deposit request** — *Made by* Compliance Officer (the Payments / Disbursement Officer releases the payment)
- **Provision / contingent liability classification** — *Made by* Accounts Manager

### 22.10 Labour Compliance

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve labour-law provisions | Quarterly / year-end | Gratuity, leave and bonus provisions with the Labour Code impact shown separately |

**Approves / checks:**

- **Labour-law provisions (gratuity, leave, bonus, Labour Code impact)** — *Made by* Accounts Manager

### 22.11 FEMA / RBI

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Approve FEMA filings and realisation extensions | As due | Filing with its source data; unrealised exports with ageing and customer status |

**Approves / checks:**

- **FLA return** — *Made by* Compliance Officer
- **FC-GPR** — *Made by* Compliance Officer
- **Extension or write-off request for unrealised exports** — *Made by* Collections Officer

# Stage 8. Assure and oversee

## 23. Internal Auditor — R09

### 23.1 Purchase Module

**Responsibilities:** Reviews the append-only Approval Log and posted exceptions — missing-PO overrides, OCR gaps, three-way-match variance approvals — and can raise an audit query or flag a finding directly against a voucher or approval for the relevant Checker to action

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the Approval Log | Month-end | Automatic segregation-of-duties violation detection (e.g. same user as PO maker and GRN recorder, or vendor creator and PV approver) |
| Review exceptions (missing PO, OCR gaps, variance approvals) | Month-end | Trend of "no PO" purchases by user, vendor and branch |
| Fraud and anomaly analytics | Monthly / quarterly | Split POs below threshold, round-sum invoices, weekend/after-hours postings, dormant vendors suddenly active, rate spikes, Benford's Law analysis on invoice values |
| Raise audit queries against vouchers | As needed | Query linked to the voucher and tracked until the Checker closes it |

**Makes / prepares:**

- **Approval Log review / audit** — *Checked by* —

### 23.2 Inventory Engine

**Responsibilities:** Reads the Movement Ledger, Reversal Log, Negative Stock report and Reconciliation Engine; can raise audit queries and findings, not restricted to read-only

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review adjustments, reversals and negative stock | Monthly / quarterly | Adjustment patterns by user, godown and item; reversals soon after approval; negative stock left open |
| Observe physical counts | Per count | Coverage by value; items with repeat variances; counts where the counter was also the custodian |
| Test costing and valuation | Quarterly | Items valued above recent purchase price; margins out of line with the item group |

### 23.3 Sales Module

**Responsibilities:** Reviews the append-only Approval Log and posted exceptions — credit overrides, match-variance approvals, write-offs — and can raise a query directly against an invoice or approval for the relevant Checker to action; tests that no one both issues an invoice and allocates the receipt against it, and that every Credit or Debit Note traces to an approved commercial adjustment

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the Approval Log | Month-end | Segregation-of-duties violation detection (e.g. same user raised and approved an SO, or recorded the DC and approved the invoice) |
| Review credit-hold releases, price overrides and credit notes | Monthly | Trends by user, customer and branch; credit notes raised soon after period-end against invoices booked just before it (cut-off manipulation pattern) |
| Anomaly analytics | Quarterly | Sales to new customers with no credit history at high value, round-sum invoices, invoices cancelled and re-raised at a lower rate |

**Makes / prepares:**

- **Approval Log review / audit** — *Checked by* —

### 23.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Reviews the append-only Approval Log: write-offs, provision overrides, netting, holds, aged disputes, tolerance breaches; can raise an audit query against an item or approval

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the Approval Log | Month-end | Segregation-of-duties violations; reversals and re-allocations soon after approval |
| Test write-offs, credit notes and netting | Quarterly | Write-offs by collector; credit notes soon after period-end; netting without agreement evidence |
| Test payments | Quarterly | Payments to vendors shortly after a bank-detail change; duplicate payments; payments before due date without a discount |

\| Test dunning and customer statements \| Quarterly \| Samples of statements, dunning letters and promises to pay, with broken promises that weren't escalated \|

**Makes / prepares:**

- **Approval Log review** — *Checked by* — (independent; the Internal Auditor approves nothing)

### 23.5 Bank Transactions Module

**Responsibilities:** Reads the BRS, audit logs, approval trail and lender confirmations.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review BRS, audit log and approval trail | Quarterly | Segregation-of-duties violations; payments released to recently changed bank details; long-outstanding reconciling items |
| Review bank confirmations and account status | Year-end | All accounts held during the year, including dormant and closed ones, for the Companies Act disclosure |

### 23.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Read-only trail access; Indirect Tax Engine — Read-only trail access; Payroll (HR Module) — Read-only trail access

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review overrides, master changes and interest paid | Quarterly | Override pattern by user and party; interest and late fees paid, and why |
| Test TDS and GST compliance | Quarterly | Payees where TDS should have applied but didn't; ITC claimed on vendors who didn't file; RCM transactions without cash payment |

### 23.7 Fixed Assets Module

**Responsibilities:** Reads the append-only Approval Log and full asset register, including every historical version of every depreciation schedule; can raise a query directly against an asset for the relevant Checker to action

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the Approval Log and schedule history | Quarterly | Segregation-of-duties violations; overrides and revisions clustered at year-end |
| Test capitalisation and disposals | Quarterly | Capitalisations with no put-to-use evidence; disposals below book value; assets fully depreciated but still in heavy use (useful life too short) |
| Observe physical verification | Per campaign | Coverage by location and value; repeat "not found" assets |

### 23.8 Vouchers & Ledgers and Period Close

**Responsibilities:** Reads the chart of accounts change log, general journals, the trial balance and the period lock and reopen log; carries out surprise petty cash counts; can raise audit queries but approves nothing

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Test general journals | Quarterly | Journals to control accounts, period-end and back-dated journals, journals posted by senior users, round amounts, journals with no supporting document |
| Review ledger changes and period reopens | Quarterly | Ledgers created or remapped near period-end; every reopen of a locked period with its reason and what was posted while it was open |
| Surprise petty cash counts | Periodic, unannounced | Cash book balance at the moment of the count, with vouchers paid since the last replenishment |

### 23.9 Notice & Litigation

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review the notice register | Quarterly | Missed or near-missed deadlines, replies sent without CA review, and matters whose exposure changed without a provision review |

### 23.10 Labour Compliance

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Test contractor verification | Quarterly | Sample of contractor bills paid, with the PF/ESI evidence and hold release behind each |

### 23.11 FEMA / RBI

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Review EDPMS / IDPMS and FEMA filings | Half-yearly | Overdue realisations, open BoEs and filings made late or not at all |

### 23.12 Across modules — Audit findings and action tracker

**Responsibilities:** Records every audit query and finding raised in any module in one tracker, with a management owner, an agreed action and a target date; the owner records the action taken and the Internal Auditor verifies closure. Closing out a finding is audit follow-up, not a transaction approval, so the Internal Auditor still approves nothing in the books

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Audit findings and action tracker | Ongoing; summarised quarterly for the Audit Committee | Ages open findings against their target dates and escalates overdue ones to the owner's manager; flags repeat findings (same control, module or party as an earlier finding); drafts the Audit Committee summary — findings raised, closed, overdue and repeated, by module and rating |

**Makes / prepares:**

- **Audit finding (raised, with rating and management owner)** — *Checked by* — (independent; the management owner responds with the agreed action)
- **Closure verification of a finding** — *Checked by* — (independent; reported to the Audit Committee)
- **Audit Committee summary** — *Checked by* — (presented to the Audit Committee)

## 24. CEO / Management — R32

### 24.1 Purchase Module

**Responsibilities:** Reads the vendor scorecard and purchase exception summary; drills down only on flagged variances

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the purchase exception summary | Weekly / monthly | Auto-generated narrative digest (e.g. "Purchases up 12% vs last month, driven by steel rate increase; 3 vendors late on delivery") |
| Review the vendor scorecard | Monthly | Top/bottom vendors, spend concentration, savings opportunity estimate |
| Drill down on flagged variances | As needed | One click from the summary to the voucher |

**Approves / checks:**

- **Vendor scorecard / DPO reporting** — *Made by* Procurement Manager

### 24.2 Inventory Engine

**Responsibilities:** Reads the Inventory Dashboard KPIs; drills into red flags only (negative stock, large reconciliation gaps, expiring batches)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the Inventory Dashboard | Weekly / monthly | Stock value vs target, dead and slow stock value, stock-outs on fast movers, write-offs, reconciliation status — with a short narrative of what changed |

### 24.3 Sales Module

**Responsibilities:** Reads the Customer Scorecard and sales exception summary; drills down only on flagged variances

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the sales exception summary | Weekly | Narrative digest: sales vs last period, margin change, largest overrides, orders stuck on credit hold, unbilled dispatches |
| Review the Customer Scorecard | Monthly | Top and bottom customers by payment behaviour, concentration risk, customers moving to a worse risk band |

**Approves / checks:**

- **Customer Scorecard / risk review** — *Made by* Sales Manager

### 24.4 Trade Receivables & Trade Payables (AR/AP) Module

**Responsibilities:** Reads DSO, DPO, ageing, provision movement, MSME exposure and ITC at risk; drills down on flagged items only

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the AR/AP dashboard | Weekly / monthly | DSO and DPO trend, top overdue customers, cash expected in the next 4 weeks, MSME and ITC exposure, provision movement — with a short narrative |

### 24.5 Bank Transactions Module

**Responsibilities:** Reads the daily or weekly digest; drills down only on red flags.

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the Executive Cash & Debt Summary and digest | Daily / weekly | Traffic-light flags, 13-week outlook, and a short narrative of what changed and what's coming |

### 24.6 Taxation Engine

**Responsibilities:** Direct Tax Engine — Dashboard visibility; Indirect Tax Engine — Dashboard visibility; Payroll (HR Module) — Dashboard visibility

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the Tax Analytics Dashboard | Monthly | Effective tax rate, provision vs actual, ITC at risk, interest and late fees paid, open demand exposure — with a short narrative of what changed |

### 24.7 Fixed Assets Module

**Responsibilities:** Reads net block and depreciation trend by category; drills down only on flagged variances (e.g. an asset nearing full Unit of Production capacity, a block about to empty out)

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the asset summary | Monthly | Net block and depreciation trend by class; capex vs plan; CWIP not yet capitalised; blocks about to empty; assets near end of useful capacity |

### 24.8 Vouchers & Ledgers and Period Close

**Responsibilities:** Reads the monthly financial statements and close status; drills down only on flagged variances

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the monthly financials and close status | Monthly | Profit and loss, balance sheet and cash flow against last period and budget, with a short narrative; days taken to close and any period reopened |

### 24.9 Notice & Litigation

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| Read the litigation exposure | Monthly | Open matters by authority, total demand and pre-deposits, deadlines in the next 30 days, and the notice-risk score |

### 24.10 Across modules — "Ask your books" chat

**Responsibilities:** Asks plain-language questions of the books at any time instead of waiting for a report; read-only, so asking never changes an entry, and answers show only what the CEO / Management role is allowed to see

| Work item | When | Intelligence Aikyat adds |
|---|---|---|
| "Ask your books" chat | Any time | Answers plain-language questions such as "why is Q2 margin down?" by breaking the movement into its drivers (price, volume, mix, cost lines); every figure in the answer links through to the ledgers and vouchers behind it, so it can be traced and checked |
