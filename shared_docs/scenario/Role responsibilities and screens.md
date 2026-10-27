# What each officer does and the screens he needs

For every role: what the officer does in plain words, then the documents and screens he needs to do it, with the fields each screen must hold. Build the screen design first; the officer's work follows from it.

## Rules every screen follows

These seven rules apply to every screen below, so each role section does not repeat them.

1. **Branch on every document.** Purchase Order, receipt note, Sales Order, delivery challan, invoice and every note carry a mandatory Branch. Stock documents also carry the Godown. A godown belongs to exactly one branch.
2. **Missing data is a prompt, never a block.** Each screen asks for what it needs, saves what it has and flags the gap for later.
3. **Warnings are soft.** A warning asks for a reason code and carries on. Only the listed refusals (maker approving his own work, releasing a credit hold, and similar) stop a user.
4. **Maker and checker are different people.** Whoever creates a document never approves it.
5. **Every action writes an Approval Log entry.** The log records the document, the maker, the checker, the time and the action, and it can never be edited or deleted.
6. **Numbers come from a numbering series.** Each document type has its own series, reset every financial year, and invoices have one series for each GSTIN.
7. **Limits and tolerances come from the company rules table**, not from the screen's code.

For documents that arrive on paper (invoice, challan, purchase order from a customer), any screen may offer an optional photo or scan upload. The system fills what it can read and flags the fields it is unsure about.

## Procurement Officer (R-P01)

**What he does.** He decides what to buy, chooses the vendor, raises the Purchase Order (PO) and chases it until the goods arrive. When the paperwork does not agree, he raises the exception. His main document is the Purchase Order, so its design comes first.

### The Purchase Order screen

One screen: a header, a grid of item lines, and a status. The PO is only a promise to buy, so it posts nothing to the accounts.

| Part | Field | Notes |
| --- | --- | --- |
| Header | PO number | From the PO series, reset each financial year |
| Header | Vendor | From the shared Vendor Master. Show the vendor's last 3 rates, scorecard and credit days beside it |
| Header | Raising branch and ship-to branch | Both mandatory. They decide the tax: same state gives CGST and SGST, different state gives IGST |
| Header | Ship-to godown | Suggested from the item's history |
| Header | PO date, expected delivery date | Also show the date predicted from the vendor's real delivery history |
| Header | Shipping address, carrier, delivery terms | Entered once here so Stores does not key them again |
| Item line | Item, unit of measure, quantity, rate | Item comes from the Item Master. Show last rate and best rate |
| Item line | GST rate and tax amount | Worked out by the system, never typed |
| Item line | Delivery date for the line | Optional |
| Item line | Estimated freight or duty | Optional. Feeds landed cost later |
| Footer | Taxable value, tax, total | Calculated |
| Status | Draft, Pending approval, Approved, Partly received, Closed, Short-closed, Cancelled | Pending approval appears when the value is above the company's PO limit |

When the screen is built, the officer can: pick a vendor, see the rate warnings, get a duplicate or split-PO warning, save as draft, and send to the Procurement Manager.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Suggested PO list (daily) | Item, stock, daily use, open POs, suggested quantity, urgent flag | Turns a suggestion into a draft PO |
| Vendor comparison panel (inside the PO screen) | Last 3 rates, best rate in 6 months, on-time %, rejection % | Compares vendors before choosing |
| Overdue PO list | PO, vendor, outstanding value, days late, stock cover | Sends the drafted follow-up message |
| Three-way-match exception | PO, receipt and invoice side by side; variance split into quantity, rate and other charges; likely reason | Raises the exception to the Accounts Manager |
| Short-close and amend | POs with no movement for the company's number of days | Short-closes or amends a PO with a reason |
| Document capture (optional) | Scan of an invoice with a confidence figure per field | Corrects only the fields flagged as unsure |
| Reorder proposal | Current and proposed reorder level and maximum | Proposes levels; the Inventory Controller approves |

**Checked by:** Procurement Manager (PO terms), Accounts Manager (match exception and scanned fields), Inventory Controller (reorder levels).

**Build in this order:** Purchase Order screen, suggested list, vendor comparison, overdue list, match exception, short-close, document capture, reorder proposal.

## Contracts & Services Procurement Officer (R-P03)

**What he does.** He buys things that are not goods: services, contract jobs, job work and professional fees. Instead of a Purchase Order he raises a Works Order (or Agreement). He tracks its milestones, gets the department head to confirm the work was done, and matches the service bill to it. There is no stock, no receipt note and no landed cost in this flow.

### The Works Order screen

| Part | Field | Notes |
| --- | --- | --- |
| Header | Works Order number | Own series, reset each financial year |
| Header | Vendor | Shared Vendor Master. Identity (name, PAN, GSTIN) is read from Business Core |
| Header | Branch and requesting department | The department head named here later confirms the work |
| Header | Type | Service, contract job, job work or professional fee |
| Header | Scope of work | Free text. Offer a template from similar past agreements |
| Header | Contract value, start date, end date | Value is the total across milestones |
| Header | Retention percentage | Held back until completion is confirmed |
| Tax | TDS payment code | Suggested from the service type; changing it needs a reason |
| Tax | GST rate and reverse-charge flag | Suggested from the service and the vendor |
| Milestones | Name, due date, amount | The amounts must add up to the contract value |
| Milestones | Status | Not due, Due, Confirmed, Billed |
| Footer | Value used so far, value remaining | Counts only confirmed milestones |

A Works Order has no item, quantity or godown fields.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Milestone tracker | Due dates, billing that arrives before the milestone is due, percentage used | Watches for early billing |
| Service completion request | Milestone, amount, requested-from department head, status, age | Sends the request; the department head confirms. A bill cannot be matched to an unconfirmed milestone |
| Service bill match | Works Order, confirmation and invoice side by side | Flags an invoice above the confirmed milestone or the remaining value |
| Contract expiry list | Contracts ending in 30 and 60 days, and bills against an expired contract | Starts renewals |
| Contractor labour evidence (only where workers are deployed) | Workers on attendance against workers on the PF/ESI return, challan paid or not, wage against the minimum | Collects the papers for the Compliance Officer to verify |
| Job-work link | The Works Order and the goods challan that Stores raises | Checks that goods sent and received agree with the order |

**Checked by:** Procurement Manager (commercial terms of the Works Order), Accounts Manager (service bill and match variance), Compliance Officer (labour evidence). The department head's confirmation is not a finance approval.

**Build in this order:** Works Order screen, milestone tracker, service completion request, bill match, expiry list, labour evidence, job-work link.

## Procurement Manager (R-P04)

**What he does.** He is the checker for the Procurement Officer. He approves the commercial side of a PO (vendor, rate, delivery terms) before any accounting approval, approves Works Orders, watches open POs and vendor problems, and owns the vendor scorecard. He never raises a PO himself.

### The PO approval screen

The manager does not design a new document. He opens the Purchase Order the officer raised, in a read-and-decide view with extra information on top.

| Part | Field | Notes |
| --- | --- | --- |
| Queue | PO, vendor, value, officer, risk points, reasons | Sorted by risk, highest first |
| Context panel | Rate against the 6-month average and best rate | Highlights a rate well above the average |
| Context panel | New vendor, single-source item, split-PO pattern | Each one adds risk points |
| Context panel | Vendor scorecard: on-time %, rejection % | A poor scorecard adds risk points |
| Decision | Approve, Reject or Send back, with a comment | Reject and Send back need a reason |

The system must refuse approval by the same person who raised the PO.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Works Order approval | Contract value against similar past contracts, flag for unusual value | Approves or sends back |
| Open PO ageing (weekly) | Open POs by days late; at-risk POs | Decides which vendors to chase |
| Exception review (weekly) | Match exceptions grouped by vendor and reason | Spots patterns, such as a vendor who always short-supplies |
| Rate and vendor review (monthly) | Price trend by item and vendor; vendors holding most of an item's spend | Negotiates and reduces the number of vendors |
| Vendor scorecard and DPO | On-time %, rate variance, rejection % per vendor; days payable | Marks vendors for review. Scorecard is read-only for the CEO |
| Payment hold and retention release | The quality record, the amount in dispute, and the confirmed milestones | Confirms a quality hold; confirms a retention release |

**Checked by:** the CEO or Management (view only, on the scorecard). He is the checker for the Procurement Officer, the Contracts & Services Officer and the Payables Executive's hold requests.

**Build in this order:** PO approval queue with the risk panel, Works Order approval, ageing, exception review, scorecard, hold and retention.

## Stores / Inventory Officer (R-P02)

**What he does.** He is the person at the gate and in the godown. He records goods coming in (receipt note, called GRN), hands them to Quality, moves and adjusts stock, sends goods out on a delivery challan, handles transfers between branches and records returns. He records the physical fact; he does not approve it.

### The Goods Receipt Note (GRN) screen

| Part | Field | Notes |
| --- | --- | --- |
| Header | GRN number | Own series |
| Header | PO reference | Pick from open POs for the vendor. Pre-fills the lines |
| Header | Branch and godown | Both mandatory. Suggest the godown from the item's history |
| Header | Vendor challan number and date, vehicle number | Optional photo of the challan fills these |
| Item line | Item, unit, quantity ordered, quantity received | Received is entered by Stores |
| Item line | Batch number and expiry date | Required for batch items; scan to enter |
| Item line | Quality needed? | Set from the item or vendor; routes the goods to Quality hold |
| Item line | Accepted quantity, rejected quantity, reason | Filled by the Quality Inspector, not by Stores |
| Footer | Status | Awaiting quality, Accepted, Partly rejected |

Alerts on this screen: receipt above the allowed over-receipt, receipt with no PO (allowed with a reason), wrong item or unit.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Expected arrivals (daily) | POs due today and overdue, by godown | Plans the day |
| Return to vendor | Rejected goods, pre-filled from the quality record | Sends goods back; the Accounts Executive raises the Debit Note |
| Stock transfer, same branch | From godown, to godown, items, quantity | Moves stock; the Inventory Controller approves |
| Stock transfer between branches | Source branch, destination branch, items, value, GST treatment | Dispatches and receives; goods in transit are tracked until received |
| Stock adjustment and write-off | Item, quantity, reason, supporting document or photo, history of past adjustments | Raises it; the Inventory Controller approves |
| Blind count | Item list with no book quantity shown | Counts godowns he does not look after |
| Job-work challan | Goods sent to a job worker, linked to the Works Order, return date | Sends and receives back |
| Batch expiry list | Batches expiring in 30, 60, 90 days | Moves or issues them first |
| New item request | A similar-item check before the request goes in | Requests an item; the Accounts Manager approves |
| Dispatch plan and delivery challan | Confirmed Sales Orders due today, stock, credit-hold status | Dispatches (see the Sales Manager and Billing sections for what follows) |
| E-way bill Part-B | Vehicle and transporter details | Completes it before the vehicle leaves |
| Customer return receipt | Original challan, batch, quantity, condition | Records goods coming back before any credit note |

**Checked by:** nobody on the GRN or the delivery challan, because the system compares them with the PO and the Sales Order. The Inventory Controller approves adjustments, write-offs, transfers and count differences. The Compliance Officer also approves transfers between separate GST registrations.

**Build in this order:** GRN screen, expected arrivals, delivery challan, stock transfers, adjustments, blind count, job-work challan, return to vendor, batch expiry.

## Quality Inspector (R-P05)

**What he does.** He checks goods that need inspection after Stores receives them, decides how much is accepted and how much is rejected, and says why. He alone owns the Quality/Rejection record. He cannot change the quantity Stores received.

### The Quality / Rejection record screen

| Part | Field | Notes |
| --- | --- | --- |
| Header | Record number and GRN reference | The record is always linked to one GRN line |
| Header | Vendor, PO, item, batch | Pre-filled from the GRN |
| Header | Inspector and inspection date |  |
| Inspection | Quantity received | Shown and locked. He cannot edit it |
| Inspection | Sample size to check | Suggested from the vendor's past rejection: more sampling for a vendor with high rejection, less for a consistently good one |
| Inspection | Accepted quantity, rejected quantity | Must add up to the quantity received |
| Inspection | Reason code for rejection | Suggested list, such as water damage, short weight, wrong specification |
| Inspection | Photos | Attach to the record |
| Result | Where the rejected goods wait | A quarantine godown until Stores returns them |

When the record is saved, the system must move the accepted quantity to the usable godown, update the vendor's rejection rate on the scorecard, and show the record to the Stores Officer for confirmation.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Inspection queue | GRN lines waiting for a quality check, oldest first | Picks the next delivery |
| Vendor rejection history | Rejection trend by vendor and item | Chooses how closely to inspect |

**Checked by:** the Stores / Inventory Officer, who confirms what happens to the accepted and rejected goods on the GRN.

**Build in this order:** inspection queue, the record screen, then the rejection trend feeding the vendor scorecard.

## Inventory Controller (R-P06)

**What he does.** He is the checker for everything Stores changes in stock. He approves adjustments, write-offs, transfers, count differences, negative-stock overrides, job-work challans and reorder levels, and he plans the physical counts. He never makes the entries he approves.

### The approval queue screen

One queue for every stock approval, sorted by risk. Each row opens the document the Stores Officer raised.

| Part | Field | Notes |
| --- | --- | --- |
| Queue row | Document type, item, godown, value, raised by, date | Types: adjustment, write-off, transfer, count difference, negative-stock override, job-work challan |
| Queue row | Risk points and reasons | High value, repeat item, same godown or user with repeated shortages |
| Detail panel | The adjustment history of the same item and godown | So a repeat shortage is visible |
| Detail panel | Reason and supporting document or photo | Required from the maker |
| Decision | Approve, Reject or Send back, with a comment | Refuse approval by the person who raised it |

A transfer between separate GST registrations also waits for the Compliance Officer. A write-off above the company's limit also needs the Finance Controller.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Negative-stock override | Why stock would go below zero: inward not posted yet, wrong item, or a real shortage | Approves the override; open ones are aged on the Negative Stock report |
| Reorder and min-max approval | The officer's proposal beside the system's own figure from consumption and vendor lead time | Approves; the Item Master updates only after approval |
| Count plan | Items grouped by risk, with weekly, fortnightly or monthly counts and counters who are not the godown's custodian | Plans and releases the counts |
| Count difference | Book quantity, counted quantity, difference, value; a recount when the difference is above the allowed percentage | Approves the difference |
| Costing input | How batch tracking and first-expiry-first-out would behave under a proposed costing method | Gives input; the Accounts Manager owns the method |

**Checked by:** nobody above him on routine approvals. The Finance Controller approves write-offs above the company limit.

**Build in this order:** the approval queue, negative-stock override, reorder approval, count plan, count difference, costing input.

## Sales Executive (R-S01)

**What he does.** He prepares the quote (Proforma Invoice), raises the Sales Order (SO) and follows up open orders. When a customer needs a return, a price correction or a discount after supply, he requests the adjustment. He never issues an invoice, credit note or debit note and never releases a credit hold.

### The Sales Order screen

One screen: a header, item lines with the price pulled from the Price List, and a credit result. The SO is a promise, so it posts nothing to the accounts.

| Part | Field | Notes |
| --- | --- | --- |
| Header | SO number | Own series, reset each financial year |
| Header | Customer | Shows credit limit, current exposure, risk band and hold flag beside it |
| Header | Branch | One SO belongs to one branch only |
| Header | SO date and credit terms | Terms default from the customer's finance fields |
| Header | Source | Typed in, bulk import or converted from a Proforma |
| Item line | Item or service, quantity, unit | Show stock by godown and a realistic dispatch date |
| Item line | Price list rate, rate used, discount | If the rate used differs from the list rate, the line is flagged as an override and needs a reason |
| Item line | Margin on the line | Calculated from cost. Shown to the approver |
| Item line | GST rate and tax amount | Worked out from the branch and the customer's state |
| Credit | Credit check result and the exposure behind it | Open invoices, open orders, goods sent but not yet billed. Says why approval is needed |
| Checks | Duplicate check | Same customer, item and a similar quantity in a short window |
| Checks | Risk points and reasons | Seen by the Sales Manager |
| Status | Draft, Awaiting credit, Awaiting approval, Confirmed, Partly fulfilled, Closed, Cancelled |  |

When the screen is built, the officer can: save a draft, request a price override, see why an order is held, and send it for approval.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Proforma Invoice | Same lines as an invoice, validity date, last 3 rates and exposure for the customer | Sends a quote. It posts nothing and converts to a Sales Order, never straight to an invoice |
| Open orders follow-up | Order lines not yet dispatched, by age and value, with stock available | Gives the customer a real date |
| Price override request | List rate, asked rate, margin impact, the customer's usual discount | Sends to the Sales Manager with the reason |
| Commercial adjustment request | The original invoice, reason (return, price correction, post-supply discount), any pre-agreed scheme reference | Raises the request. A return request waits until Stores records the goods back |

**Checked by:** Sales Manager on the Sales Order and on every adjustment request. The Credit Controller is a separate gate and not a checker.

**Build in this order:** Sales Order screen, Proforma Invoice, price override request, duplicate check, open orders follow-up, adjustment request.

## Sales Manager (R-S02)

**What he does.** He is the checker for the Sales Executive. He approves the commercial terms of a Sales Order (price, discount, delivery terms), approves the reason and value of every commercial adjustment behind a credit note or price-correction debit note, keeps the price list, and owns the customer scorecard. He may ask for a credit hold to be released but can never release one.

### The Sales Order approval screen

He opens the Sales Order the executive raised, in a read-and-decide view.

| Part | Field | Notes |
| --- | --- | --- |
| Queue | SO, customer, value, executive, risk points, reasons | Sorted by risk, highest first |
| Context panel | Rate against list price and against cost, margin on each line | A line below cost or below the margin floor is highlighted |
| Context panel | Customer's usual discount and new-customer flag |  |
| Context panel | Credit result | Shown, not editable |
| Decision | Approve, Reject or Send back, with a comment | Reject and Send back need a reason. Refuse approval by the person who raised the order |

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Adjustment approval | The request, the original invoice, margin on it, the customer's credit-note history, any scheme reference, and a cut-off flag if it falls just after period end | Approves or rejects; only approved requests reach the Billing Executive |
| Open order ageing (weekly) | Pending orders grouped by reason: stock short, credit hold, awaiting customer | Clears the bottleneck |
| Override pattern report (monthly) | Overrides by salesperson, customer and item | Spots a salesperson well above the team |
| Price list and contract rates | Rates by item and customer; expired contract rates; items priced below the margin floor | Maintains prices |
| Customer scorecard | On-time payment, days to pay, returns and disputes per customer | Suggests customers for credit-limit review. Read-only for the CEO |
| Credit-hold release request | The commercial reason beside the Credit Controller's exposure summary | Sends a request to the Finance Controller. There is no Release button |

**Checked by:** the Finance Controller (hold release request) and CEO / Management, view only (scorecard).

**Build in this order:** Sales Order approval queue, adjustment approval, open order ageing, price list, override report, scorecard, hold release request.

## Credit Controller (R-S03)

**What he does.** He is an independent gate. He checks a customer's credit limit and payment history before an order is confirmed or dispatched, places credit holds, and asks the Finance Controller to release them. Sales targets must never pressure him, so nobody in Sales can release a hold. His check has no second approver.

### The credit review screen

| Part | Field | Notes |
| --- | --- | --- |
| Queue | SO, customer, order value, reason it was routed | Only orders that failed the automatic credit check appear |
| Exposure | Open invoices, open orders, goods sent but not billed | Added up to one total |
| Exposure | Credit limit, amount over the limit |  |
| History | Overdue amount, days past due over the last months, bounced receipts, broken payment promises | Read from the receivables module |
| Decision | Place hold, Pass, or Request release | A hold needs a reason. A release request goes to the Finance Controller with the exposure summary |
| Log | Credit Hold Log | Customer, placed by, reason, release requested by, released by, exposure at release |

The system must give Sales roles no Release action and refuse a release made by anyone except the Finance Controller.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Suggested holds | Customers whose payment behaviour is getting worse before they reach the limit | Places a hold in advance |
| Credit-limit review (quarterly) | Suggested limit from billing, credit days, risk band and payment record; limits not reviewed in 12 months | Reviews and proposes new limits |
| Customer master (read-only) | Credit limit, terms, risk band, hold flag | Reads only. Finance fields are edited by the Accounts Executive |

**Checked by:** nobody on the credit check itself (an independent gate). The Finance Controller alone approves a release.

**Build in this order:** credit review screen with the exposure total, Credit Hold Log, release request, suggested holds, credit-limit review.

## Billing Executive (R-B01)

**What he does.** He turns what was supplied into a valid tax document: sales invoices, credit notes, debit notes, export invoices and GST receipt and refund vouchers. He keeps dispatched-but-not-billed at zero and answers invoice errors from customers. He never allocates receipts, requests write-offs or edits customer finance fields.

### The Sales Invoice screen

| Part | Field | Notes |
| --- | --- | --- |
| Header | Invoice number | One series for each GSTIN, reset each financial year, no gaps. A cancelled number is kept and not reused |
| Header | Customer, branch, invoice date |  |
| Header | Delivery challan reference | Pulls the dispatched lines that are not yet billed |
| Header | Place of supply and ship-to state | Checked against the customer's GSTIN. Decides CGST and SGST or IGST |
| Header | Billing instructions | Customer PO reference, format, annexures, from the customer's finance fields |
| Header | E-invoice number (IRN), signed QR, IRN status, error reason | Filled by the system after the Accounts Manager approves |
| Header | Export fields (exports only) | LUT reference, currency, exchange rate, shipping bill number and date |
| Item line | Challan line reference, item, HSN, quantity invoiced, rate, value | Quantity can never exceed the quantity on the challan |
| Item line | GST rate and tax amount | From the tax engine. An override needs a reason and the Compliance Officer's approval |
| Footer | Taxable value, CGST, SGST or IGST, total |  |
| Status | Draft, Confirmed, Closed | Confirmed only after the accounting entry posts and the e-invoice succeeds, or an offline fallback is recorded |

When the invoice posts, the system writes one entry through the shared accounting service: customer debited, sales credited and output tax credited. If the entry fails, the status must stay Draft.

### The other screens he needs

| Screen | What it shows | What he does there |
| --- | --- | --- |
| Unbilled list (daily) | Challans and service supplies with no invoice, oldest and largest first, services aged against the 30-day limit | Bills them so the list is empty |
| Credit note | Original invoice, reason code, return receipt reference (for returns), pre-agreed scheme reference and the GST-reduction flag, the 30 November warning | Issues only an adjustment the Sales Manager approved |
| Debit note | Original invoice, reason, increase in value and tax | Issues only an approved adjustment |
| Cancel an IRN or e-way bill | Time left from the 24-hour window | Requests the cancellation; after the window only a credit note is offered |
| Export and SEZ invoice | LUT validity on the invoice date, currency and rate, shipping bill reminder | Prepares the export invoice |
| GST receipt and refund voucher | Advances flagged by the Accounts Executive; cancelled orders | Issues the receipt voucher; issues the refund voucher if the order is cancelled |
| Send and acknowledgement | Delivery channel, portal upload, customer's acceptance or rejection | Sends the invoice; handles rejections |
| Invoice queries | The customer's message, invoice and a classification: invoice error or payment dispute | Resolves invoice errors; routes payment disputes to Collections |

**Checked by:** Accounts Manager on every invoice, credit note and debit note. Also the Finance Controller on a credit note above the company limit, the Compliance Officer on a GST-reducing discount, an export invoice, a GST advance voucher and any tax override.

**Build in this order:** Sales Invoice screen, unbilled list, credit note, debit note, IRN cancellation, export invoice, GST advance vouchers, send and acknowledgement, invoice queries.

## Which screen is made and checked by which role

Build each document's screen once. Several roles use the same document, so this table is the plan for sharing screens and for the approval routing.

| Document or screen | Made by | Checked by | Also read by |
| --- | --- | --- | --- |
| Purchase Order | Procurement Officer | Procurement Manager | Stores Officer, Accounts Executive |
| Works Order | Contracts & Services Officer | Procurement Manager | Accounts Executive, Compliance Officer |
| GRN (goods receipt) | Stores Officer | Compared by the system with the PO | Quality Inspector, Accounts Executive |
| Quality / Rejection record | Quality Inspector | Stores Officer | Procurement Manager (scorecard) |
| Three-way-match exception | Procurement Officer | Accounts Manager | Procurement Manager |
| Stock adjustment, write-off | Stores Officer | Inventory Controller | Finance Controller (above the limit) |
| Stock transfer | Stores Officer | Inventory Controller; Compliance Officer if GST registrations differ | Both branches |
| Reorder and min-max levels | Procurement Officer | Inventory Controller | Item Master |
| Proforma Invoice | Sales Executive | None (it posts nothing) | Customer |
| Sales Order | Sales Executive | Sales Manager | Credit Controller, Stores Officer |
| Credit check and hold | Credit Controller | None (independent gate) | Sales roles see the flag |
| Hold release | Credit Controller or Sales Manager request | Finance Controller |  |
| Delivery challan | Stores Officer | Compared by the system with the Sales Order | Billing Executive |
| Commercial adjustment request | Sales Executive | Sales Manager | Billing Executive |
| Sales Invoice | Billing Executive | Accounts Manager | Stores Officer (e-way bill), Credit Controller |
| Credit note, debit note | Billing Executive | Accounts Manager (always) | Finance Controller, Compliance Officer by rule |

Roles outside this tab (Accounts Executive, Accounts Manager, Compliance Officer, Finance Controller, Payables Executive) are seeded users who can approve or reject, so the chain keeps moving while you build the screens above.
