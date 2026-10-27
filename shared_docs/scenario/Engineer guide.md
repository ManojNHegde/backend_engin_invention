# Aikyat biscuit plant: engineer guide

This tab explains the scenario in the order an engineer needs it: first the business and the data to load, then each role (what he is responsible for, what he does in the business, what Aikyat must build, what he produces), then the controls. Exact step-by-step tests with answers are in the Full scenario tab; step IDs such as A1-01 point to them. The Role responsibilities and screens tab holds the field-level screen designs.

## 1. Background

Everything an engineer must load or understand before playing any role. The scenario clock runs from Monday 05-Oct-2026 to Saturday 31-Oct-2026. All figures are illustrative.

### 1.1 Business details

| Item | Detail |
| --- | --- |
| Business | Biscuit manufacturer selling glucose biscuits and milk cream biscuits in cartons |
| Locations | Karnataka plant and head office in Bengaluru (branch KA-01) and a unit at Hosur, Tamil Nadu (branch TN-01). Each has its own GST registration |
| Godowns in Bengaluru | KA-RM raw material store, KA-PK packing store, KA-FG finished goods, KA-QC quality hold and quarantine |
| Godowns at Hosur | TN-ST store, TN-FG finished goods |
| What it buys | Maida, sugar, skimmed milk powder (SMP), vanilla flavour, laminate film, corrugated cartons; also services (manpower, oven maintenance, printing job work) |
| What it sells | Cartons of biscuits to distributors and shops in Karnataka, Tamil Nadu and Kerala, and to an export customer in the UAE; plus co-packing as a service |
| Books | One set of books for the whole company. Branch is a field on every document, not a separate set of books |
| Financial year | April to March. The quarter ended on 30-Sep-2026 |
| Out of scope | Production itself. Raw material is simply issued to production, and finished goods are already in stock |

The business in one line: **plan what to buy, buy it, receive it, inspect it, store it, take sales orders, check credit, dispatch, bill.** Each role in Section 2 owns one part of that line.

**Company switches to set:**

| Switch | Value |
| --- | --- |
| Goods receipt note (GRN) | On |
| Delivery challan (DC) | On; physical for goods, notional for services |
| E-invoicing | Applies. A DC cannot be released until the invoice has its IRN |
| Inventory accounting | Run 1 Perpetual, Run 2 Periodic. Quantities and approvals are the same in both |
| Invoice mode | Accounting-led (billing raises the invoice); integrated mode is tried once in step B4-02 |

### 1.2 Masters required

Build these masters before any role can work. Roles read most of them and change only the ones they own.

| Master | What it holds | Maintained by | Used by |
| --- | --- | --- | --- |
| Branch | Code, name, state, GSTIN | Administrator | Every document |
| Godown | Code, name, branch (a godown belongs to one branch), type (store, quality hold, finished goods) | Administrator | Stores, Inventory |
| Item | Code, name, unit, HSN, GST rate, reorder level, quality check needed, batch tracking | Accounts Manager approves new items | Purchase, Inventory, Sales |
| Vendor | Code, finance fields (credit days, TDS default, bank), import flag. Identity (name, PAN, GSTIN) comes from Business Core | Accounts Executive; Accounts Manager approves | Purchase |
| Customer | Credit limit, credit days, risk band, hold flag, billing instructions. Identity from Business Core | Accounts Executive; Accounts Manager approves | Sales |
| Price list and contract rates | Rate by item and customer, validity dates, pre-agreed schemes | Sales Manager | Sales |
| Users and roles | User, role, branch, godown | Administrator | Every approval |
| Company rules | Thresholds, tolerances, day-counts (Section 1.8) | Accounts Manager | Every role |
| Approval rules | Document type, trigger, value, required role | Administrator | Every approval |
| Numbering series | One series per document type; invoices have one per GSTIN; reset each financial year | Administrator | Every document |
| Tax master | GST rate by HSN, place-of-supply rules | Compliance Officer | Purchase, Sales |

Party identity (names, PAN, GSTIN, addresses) is never edited in Purchase or Sales. If a role finds an error there, such as a missing pincode, it raises a request in Business Core.

### 1.3 Item masters

**Materials bought (used by Procurement, Stores, Quality, Inventory)**

| Code | Item | Unit | Quality check | Reorder level | GST (placeholder) | Average cost | Daily use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RM-001 | Maida | kg | Yes | 20,000 | 5% | ₹38.40 | 6,200 (prior 14 days: 5,700) |
| RM-002 | Sugar | kg | Yes | 10,000 | 5% | ₹45.50 | 1,100 |
| RM-003 | Skimmed milk powder | kg | Yes | 1,500 | 5% | ₹309.67 | 300 |
| RM-004 | Vanilla flavour | litre | No | 30 | 5% | ₹1,125 | 2 |
| PM-001 | Laminate film roll | kg | Yes | 2,400 | 18% | ₹243 | 480 |
| PM-002 | Corrugated carton | nos | No | 6,000 | 18% | ₹28 | 700 |

Maida comes in 25 kg bags and sugar in 50 kg bags. SMP is batch-tracked with first-expiry-first-out (FEFO).

**Goods sold (used by Sales, Stores, Billing)**

| Code | Product | List price | Standard cost | GST (placeholder) |
| --- | --- | --- | --- | --- |
| FG-101 | Glucose biscuit 100 g, carton of 48 | ₹720 | ₹560 | 5% |
| FG-102 | Milk cream biscuit 150 g, carton of 36 | ₹990 | ₹760 (₹820 from 12-Oct) | 5% |

HSN codes are placeholders (190531 for both biscuits). Services (co-packing, manpower, AMC, job work) are priced at 18% GST and have no item code, only a service description.

### 1.4 Employees

Create these users. The first ten are the roles built in this scenario. The last group are stubs: seeded users who can approve or reject so the approval chain keeps moving, and for whom no screens are built here.

| User | Role | Role ID | Works at |
| --- | --- | --- | --- |
| Ravi | Procurement Officer | R-P01 | KA-01 |
| Kiran | Contracts & Services Procurement Officer | R-P03 | KA-01 |
| Meena | Procurement Manager | R-P04 | HQ |
| Suresh | Stores / Inventory Officer | R-P02 | KA-RM and KA-PK |
| Latha | Stores / Inventory Officer | R-P02 | KA-FG |
| Gopal | Stores / Inventory Officer | R-P02 | TN-ST and TN-FG |
| Divya | Quality Inspector | R-P05 | KA-01 |
| Anand | Inventory Controller | R-P06 | HQ |
| Arun | Sales Executive | R-S01 | KA-01 |
| Nisha | Sales Manager | R-S02 | KA-01 |
| Farid | Credit Controller | R-S03 | HQ |
| Pooja | Billing Executive | R-B01 | HQ |
| Teja | Accounts Executive (stub) | R01 | HQ |
| Rajan | Accounts Manager (stub) | R02 | HQ |
| Venkat | Compliance Officer (stub) | R24 | HQ |
| Usha | Finance Controller (stub) | R-FC01 | HQ |
| Sunil | Payables Executive (stub) | R-AP01 | HQ |
| Plant Head, Packing Head | Department heads who confirm services received | none | KA-01 |

Branch-level split: Procurement Officer, Stores Officer, Sales Executive and Sales Manager exist for each branch. Vendor and Customer finance fields stay at head office. Credit Controller, Compliance Officer and Finance Controller are central.

### 1.5 Vendors and customers

**Vendors**

| Vendor | Supplies | State | On-time record | Rejection | Note |
| --- | --- | --- | --- | --- | --- |
| A | Maida | KA | 17 of 18 POs (94%) | 0.5% | Delivers in 3 to 5 days; ships in multiples of 10,000 kg |
| B | Maida, sugar | KA | 8 of 13 (62%) | 3.1% | Often revises rates |
| C | Sugar, maida | KA | 11 of 12 (92%) | 0.4% | Short-supplied 4 of the last 6 receipts; holds 72% of sugar spend |
| D | Laminate film | KA | 6 of 11 (55%) | 1.0% | Takes 5 to 8 days; film is bought from 4 vendors at ₹245 to ₹262 |
| E | Corrugated cartons | KA | 7 of 10 (70%) |  |  |
| F | Vanilla flavour | KA | 5 of 5 |  | Only source |
| G | SMP | Gujarat (IGST) | 9 of 10 |  | Only source; ships in multiples of 400 kg |

Service and job-work parties: OvenCare Engineering (oven AMC), Shakti Manpower (contract labour), PrintPack Converters (job work), a housekeeping vendor, a pest-control vendor and a security vendor.

**Customers**

| Customer | State | Limit and terms | Position on 05-Oct |
| --- | --- | --- | --- |
| C-01 Sri Lakshmi Distributors | KA | ₹15,00,000, 30 days | Owes ₹4,00,000, nothing overdue. Glucose contract rate ₹700 lapsed on 30-Sep; cream rate ₹975 valid to 31-Dec; rebate scheme SCH-26-Q2 gives 2% on quarterly purchases of ₹20,00,000 or more |
| C-02 Chennai Retail Mart | TN | ₹10,00,000, 45 days | Owes ₹8,20,000, of which ₹2,10,000 is 38 days overdue; one cheque bounced 62 days ago; two broken payment promises; ship-to pincode missing |
| C-03 Gulf Snack Imports LLC | UAE | Advance only | New export customer paying in USD; export licence undertaking (LUT) valid to 31-Mar-2027 |
| C-04 Healthy Bite Foods | KA | ₹3,00,000, 15 days | Co-packing service; ₹72,000 of work delivered on 15-Sep and not billed; ₹59,000 advance received on 03-Oct |
| C-05 Namma Bakes | KA | ₹5,00,000, 30 days | Two challans dispatched on 03-Oct during an e-invoice portal outage and not billed; credit limit not reviewed since 14-Aug-2025 |
| C-06 Kerala Traders | KL | ₹5,00,000, 30 days | Owes ₹4,10,000 (82% of limit); paying slower each month |

### 1.6 Inventory list (opening stock, 05-Oct-2026)

| Godown | Item | Quantity | Cost and batch |
| --- | --- | --- | --- |
| KA-RM | Maida | 18,500 kg | ₹38.40 average |
| KA-RM | Sugar | 5,500 kg | ₹45.50 average |
| KA-RM | SMP | 1,800 kg | Batch SM-2604: 300 kg at ₹298, expires 28-Oct-2026. Batch SM-2609: 1,500 kg at ₹312, expires 28-Mar-2027 |
| KA-RM | Vanilla flavour | 40 litre | ₹1,125 |
| KA-PK | Laminate film roll | 1,008 kg | ₹243 |
| KA-PK | Corrugated carton | 6,200 nos | ₹28 |
| KA-FG | Glucose biscuit | 2,300 cartons | Batch G-2604: 300 cartons, expires 12-Oct-2026. Batch G-2608: 2,000 cartons, expires 10-Feb-2027 |
| KA-FG | Milk cream biscuit | 1,500 cartons | Batch C-2607, expires 15-Jan-2027 |
| TN-ST | Maida | 1,500 kg | ₹38.80 average; Hosur uses 1,400 kg a day |
| KA-QC | (anything waiting for or failing inspection) | Nil |  |

The average cost is a moving weighted average. After each receipt, new cost = (old value + received value) ÷ new quantity.

### 1.7 Open documents on day one

Load these so the first morning has real work waiting.

**Open purchase orders**

| PO | Vendor and item | Open quantity | Value | Due | Note |
| --- | --- | --- | --- | --- | --- |
| 0398 | D, laminate film | 2,720 kg | ₹6,80,000 | 29-Sep | Nothing received, 6 days late |
| 0403 | B, sugar | 5,000 kg | ₹2,40,000 | 25-Sep | Nothing received, 10 days late |
| 0407 | C, sugar | 10,000 kg | ₹4,60,000 | 06-Oct | Due tomorrow |
| 0411 | F, vanilla | 40 litre | ₹45,000 | 02-Oct | 3 days late |
| 0412 | G, SMP | 800 kg of 5,000 | ₹2,48,000 | 10-Sep | Last receipt 05-Sep |
| 0419 | E, cartons | 10,000 | ₹2,80,000 | 12-Oct |  |

**Open contracts**

| Contract | Party | Detail |
| --- | --- | --- |
| WO-0021 | Shakti Manpower | Packing-line manpower, ₹2,40,000 a month, 01-Apr-2026 to 31-Mar-2027, 40 workers. April to August confirmed, September waiting |
| WO-0009, WO-0026 | Housekeeping, security | Expire 26-Oct and 30-Nov |
| WO-0017 | Pest control | Expired 30-Sep |

**Sales and billing items waiting**

| Item | Detail |
| --- | --- |
| Unbilled work | Service supply N-1 for C-04 (₹72,000 + GST, delivered 15-Sep); challans DC-0618 (₹72,000) and DC-0619 (₹99,000) for C-05, dispatched 03-Oct |
| Advance | ₹59,000 from C-04, received 03-Oct |
| Documents | Proforma PF-0027 for C-05, expired 04-Oct; bulk-imported order SO-IMP-0007 for C-05 (96 cartons of glucose) |

### 1.8 Company rules

These numbers belong in the company rules table, never in code. They are placeholders and the complete list is in the Full scenario tab, Section 2. These are the ones met first:

| Rule | Value |
| --- | --- |
| PO needs Procurement Manager approval above | ₹5,00,000 |
| Split-PO pattern | Same vendor and item within 7 days, each PO at least 90% of the limit, combined at or above the limit |
| Stock target | 10 days of use plus 1 day safety |
| Over-receipt allowed at GRN | +2% of the PO line |
| Match tolerance (PO, receipt, invoice) | Quantity 0.5%, rate 1% |
| Short-close suggested after no movement for | 30 days |
| OCR field flagged below | 80% confidence |
| Stock adjustment needs Inventory Controller above | ₹2,000 |
| Count difference triggers a recount above | 1% of book quantity |
| Negative stock | Warn; override needs the Inventory Controller |
| Sales Order needs Sales Manager approval above | ₹3,00,000, or on any price override or below-cost line |
| Margin floor | 18% |
| Delivery challan may exceed the order by | 2% |
| E-way bill needed above | ₹50,000, with goods moving |
| Credit note needs Finance Controller as well above | ₹1,00,000 |
| GST rates (placeholders) | 5% on food and biscuits, 18% on packing and services |

The test of a correct build: change any one of these numbers and the system's behaviour changes without a code change.

## 2. Roles

Each role below has the same four parts: what he is responsible for, what he does in the business, what Aikyat must build for him, and what he produces. A last line points to the test steps in the Full scenario tab. Field-level screen designs are in the Role responsibilities and screens tab.

### 2.1 Procurement Officer (Ravi, R-P01)

**Responsibilities**

- Decide what to buy and how much
- Choose the vendor and rate
- Raise the Purchase Order (PO) and keep it free of duplicates
- Chase late POs
- Raise an exception when PO, receipt and invoice disagree
- Short-close or amend POs
- Propose reorder levels

**What he does in the business.** On Monday 5 October Ravi sees that maida stock is 18,500 kg and the plant uses 6,200 kg a day, about 3 days of stock against a 4-day vendor lead time. He compares Vendor A at ₹38.90 with Vendor B at ₹39.60, picks A, and raises PO 0420 for 50,000 kg (₹19,45,000 plus GST), which goes to the Procurement Manager. He then works down the late-PO list (laminate film, 6 days late). On Wednesday the sugar invoice does not match what Stores received, so he raises the exception.

**What Aikyat must build**

- A daily suggested-PO list: target = (10 + 1) days × daily use, minus stock and open POs that are not more than 5 days late, rounded up to the vendor's pack size, with an urgent flag when stock cover is shorter than the lead time
- A vendor comparison: last 3 rates, best rate in 6 months, on-time and rejection percentages; warn, never block, on a costlier or late vendor
- A PO screen that works out GST from the bill-to GSTIN, ship-to branch and vendor state, and predicts the delivery date from the vendor's real delivery history
- Duplicate and split-PO warnings
- An overdue list ranked by outstanding value × days late, with a drafted message to the vendor
- A match-exception screen that splits the difference into quantity, rate and other charges, in that order, and suggests the likely reason
- Short-close suggestions, optional document scanning with a confidence per field, and a reorder-level proposal screen

**Outputs**

| Output | Checked by |
| --- | --- |
| Purchase Order | Procurement Manager (above the limit) |
| Match exception | Accounts Manager |
| Scanned invoice with flagged fields | Accounts Manager, on the flagged fields only |
| Reorder and min-max proposal | Inventory Controller |
| Follow-up message to the vendor | None |

**Test it:** Full scenario steps A1-01 to A1-10, and the simple story steps P-1, P-2 and P-6.

### 2.2 Contracts & Services Procurement Officer (Kiran, R-P03)

**Responsibilities**

- Raise Works Orders (or Agreements) for services, contract jobs, job work and professional fees, in place of a PO
- Track milestones, contract value used and expiry
- Get the department head to confirm that the service was delivered
- Match service bills to the Works Order
- Collect contractor labour papers where workers are deployed

**What he does in the business.** Kiran raises WO-0033 for an annual oven maintenance contract with OvenCare Engineering: ₹12,00,000 in four quarterly milestones. He watches WO-0021 with Shakti Manpower, which supplies 40 packing-line workers: the vendor billed October before October was due, and the September milestone is still waiting for the Packing Head's confirmation. When the September bill arrives for ₹2,65,000 against a confirmed milestone of ₹2,40,000, he flags the ₹25,000 gap. He also checks that 40 workers on the attendance record appear on the provident fund return (38 do).

**What Aikyat must build**

- A Works Order screen with scope, contract value, dates, retention, a suggested TDS code and GST rate, and milestones that must add up to the contract value; no item, quantity or godown fields
- A milestone tracker that alerts on billing ahead of completion and counts only confirmed milestones as used
- A service completion request sent to the department head; a bill cannot be matched to an unconfirmed milestone
- A service-bill match of Works Order, confirmation and invoice
- A contract expiry list for the next 30 and 60 days, and a flag for bills against an expired contract
- A contractor labour evidence screen: workers on attendance against workers on the PF/ESI return, challan paid or not, wages against the notified minimum
- A job-work link to the goods challan that Stores raises

**Outputs**

| Output | Checked by |
| --- | --- |
| Works Order | Procurement Manager (commercial) |
| Service-bill match variance | Accounts Manager |
| Contractor labour evidence | Compliance Officer |
| Service completion confirmation | Made by the department head; it is not a finance approval |

**Test it:** Full scenario steps A2-01 to A2-07.

### 2.3 Procurement Manager (Meena, R-P04)

**Responsibilities**

- Approve the commercial terms of each PO (vendor, rate, delivery terms) before any accounting approval
- Approve Works Orders commercially
- Review open PO ageing, match exceptions and vendor problems
- Own the vendor scorecard and rate negotiation
- Confirm a payment hold for quality reasons and a retention release

**What he does in the business.** On Tuesday morning Meena opens her queue. The system puts two laminate-film POs from Vendor D at the top: Ravi raised ₹4,90,000 and ₹4,65,500 on the same day, each just under the ₹5,00,000 limit, and the vendor delivers on time only 55% of the time. She rejects the split and asks for one PO of ₹9,55,500 for 3,900 kg. Each week she looks at which vendors are late or short-supply (Vendor C delivered about 1.5% less on 4 of its last 6 deliveries), and each month she reviews prices: maida rose 4.5% since May, and one vendor holds 72% of sugar spend.

**What Aikyat must build**

- A PO approval queue sorted by risk points, with the reasons beside each PO: split pattern, poor scorecard, new vendor, single-source item, rate well above the 6-month average
- A block on approval by the person who raised the PO
- Works Order approval with a comparison against similar past contracts
- Open PO ageing buckets with an at-risk mark where the vendor's history says delivery will slip
- A weekly exception review grouped by vendor and reason
- A price and vendor-concentration review
- A vendor scorecard computed from timestamps already stored: on-time %, rate variance, rejection %
- A payment hold and retention release screen showing the quality record and confirmed milestones

**Outputs**

| Output | Checked by |
| --- | --- |
| Approved or rejected PO and Works Order | He is the checker |
| Vendor scorecard and payables-days report | CEO / Management, view only |
| Decision on a payment hold or retention release | He is the checker |

**Test it:** Full scenario steps A3-01 to A3-07, and simple story step P-3.

### 2.4 Stores / Inventory Officer (Suresh, Latha, Gopal, R-P02)

**Responsibilities**

- Record goods received (GRN) and hand them to Quality
- Return rejected goods to the vendor
- Transfer stock between godowns and between branches
- Raise stock adjustments, write-offs and job-work challans
- Take part in blind counts of other godowns
- On the sales side: dispatch goods on a delivery challan, complete the e-way bill vehicle details, and record goods returned by customers

**What he does in the business.** On Tuesday 6 October a sugar lorry arrives from Vendor C. The challan says 10,000 kg but the weighbridge shows 9,850 kg, so Suresh records 9,850 kg and the goods wait in the quality hold godown. On Friday a maida lorry carries 41,200 kg but only 41,000 kg can be received (the order allows +2%); the extra 200 kg stays at the gate. On Monday 12 October he sends 5,000 kg of maida from Bengaluru to Hosur with a tax invoice, because Hosur is a separate GST registration. On the sales side, Latha picks and dispatches 600 cartons of glucose and 300 of cream for SO-1 on Wednesday and records 40 damaged cartons coming back later.

**What Aikyat must build**

- A GRN screen pre-filled from the PO and from a photo of the vendor's challan, with alerts for over-receipt, no PO and wrong item or unit
- A quality-hold flow: goods needing inspection go to the quarantine godown and are not available until accepted
- A return-to-vendor document pre-filled from the quality record (an e-way bill only above the limit)
- Stock transfers: within a branch (move at cost, no tax) and between branches (tax invoice with IGST where registrations differ, e-way bill, goods in transit tracked until received)
- Stock adjustment and write-off with a mandatory reason, document and past history
- A blind count handheld that hides book quantity
- A job-work challan linked to the Works Order, with the return date and process-loss check
- A dispatch plan, delivery challan (stock falls under Perpetual, at period end under Periodic) that warns above the 2% tolerance and suggests first-expiry batches, and an e-way bill Part-B step that holds the vehicle until the IRN exists
- A customer return receipt matched to the original challan and batch

**Outputs**

| Output | Checked by |
| --- | --- |
| GRN | Nobody; the system compares it with the PO |
| Delivery challan | Nobody; the system compares it with the Sales Order |
| Stock adjustment, write-off, transfer, job-work challan | Inventory Controller (and Compliance Officer on a transfer between separate GST registrations) |
| Count entry | Inventory Controller |
| Customer return receipt | Nobody; it releases the return credit note for approval |

**Test it:** Full scenario steps A4-01 to A4-13 and D-01 to D-05, and simple story steps P-4, S-5 and S-7.

### 2.5 Quality Inspector (Divya, R-P05)

**Responsibilities**

- Inspect goods that need a quality check after Stores receives them
- Decide the accepted and rejected quantity, and the reason
- Own the Quality/Rejection record

**What he does in the business.** On 6 October Divya inspects the 9,850 kg of sugar from Vendor C (197 bags). The vendor is reliable, so she samples 3%, which is 6 bags. Two sampled bags are wet; she checks the rest, rejects those two bags (100 kg) and accepts 9,750 kg. On 8 October she inspects 5,000 kg of sugar from Vendor B, whose past rejection rate is 3.1%, so the sampling is tightened to 6%. Three of six sampled bags are wet, so she checks the whole lot and rejects 8 bags (400 kg), with photos.

**What Aikyat must build**

- An inspection queue of GRN lines waiting for a check
- A record screen linked to one GRN line, with the received quantity locked, accepted plus rejected equal to received, a reason code list and photo upload
- A suggested sample size from the vendor's past rejection rate: more for a vendor with high rejection, less for a consistently good one
- On save: accepted quantity moves to the usable godown, rejected quantity waits in quarantine, and the vendor's rejection rate on the scorecard is updated

**Outputs**

| Output | Checked by |
| --- | --- |
| Quality/Rejection record | Stores / Inventory Officer, who confirms what happens to the goods on the GRN |
| Rejection trend by vendor and item | Feeds the vendor scorecard |

**Test it:** Full scenario steps A5-01 to A5-03, and simple story step P-5.

### 2.6 Inventory Controller (Anand, R-P06)

**Responsibilities**

- Approve stock adjustments, write-offs, transfers, count differences and job-work challans
- Approve negative-stock overrides
- Approve reorder levels and minimum-maximum levels
- Plan the physical counts
- Give operational input when the accounting team reviews the costing method (the method itself belongs to the Accounts Manager)

**What he does in the business.** On Monday 12 October Anand's queue shows the maida transfer to Hosur (₹1,94,000) and the SMP move between godowns (₹1,85,800); he approves both, though the Hosur transfer then waits for the Compliance Officer's GST check. On Friday at 6:40 am the night shift needs 6,200 kg of maida but the book shows 3,700 kg. Aikyat tells him why: a lorry of 41,200 kg has been at the gate since 5:50 and its receipt is not yet entered. He approves the override, and after the receipt posts the negative-stock report shows one event aged 40 minutes. On 13 October he approves Ravi's new reorder levels: maida 31,000 kg, laminate film 3,840 kg and SMP 2,400 kg.

**What Aikyat must build**

- One approval queue for every stock approval, sorted by risk: value points, repeat item, same godown or user with repeated shortages
- For each item, its past adjustment history beside the decision
- A negative-stock override screen that shows the reason and ages the open ones
- A reorder approval screen that shows the officer's proposal next to the system's own figure from consumption and the vendor's real delivery times, and updates the Item Master only after approval
- A count plan that groups items into weekly, fortnightly and monthly counts by risk and never assigns a counter to his own godown
- A count-difference screen that forces a recount above the allowed percentage
- A costing view that shows how batch tracking and first-expiry-first-out would behave under a proposed method

**Outputs**

| Output | Checked by |
| --- | --- |
| Approval of adjustment, write-off, transfer, count difference, override, job-work challan | He is the checker; the Finance Controller as well on a write-off above the limit |
| Approved reorder and min-max levels | None |
| Cycle-count plan | None |

**Test it:** Full scenario steps A6-01 to A6-05, and simple story step P-7.

### 2.7 Sales Executive (Arun, R-S01)

**Responsibilities**

- Prepare quotes (Proforma Invoices)
- Raise Sales Orders (SO)
- Request price overrides
- Follow up open orders
- Request commercial adjustments: returns, price corrections, discounts after supply
- Never issue invoices, credit notes or debit notes, and never release a credit hold

**What he does in the business.** On Monday 5 October Arun prepares a quote for the new export customer C-03 (1,200 cartons of glucose at USD 8.90). He raises SO-1 for the distributor C-01: 600 cartons of glucose and 300 of cream. The glucose contract rate of ₹700 expired last week, so the system shows list ₹720, and Arun asks the Sales Manager for ₹700 with a reason. For C-05 the system warns that a similar order was imported two days ago, and that his price of ₹540 is below cost (₹560). For C-02 the order is held because the customer is over its credit limit, with 1 bounced cheque. Later he raises adjustment requests: a rebate under a scheme, a goodwill discount, a price correction and a return.

**What Aikyat must build**

- A Sales Order screen where price and credit terms default from the Price List and the customer, the line margin is shown, and stock by godown and a realistic dispatch date appear
- A background credit check that explains why an order needs approval or is held
- Override, below-cost and duplicate warnings (including against bulk-imported orders) that go to the approver and never stop the entry
- A Proforma Invoice that posts nothing and converts only to a Sales Order
- A follow-up list of order lines not yet dispatched with stock available
- An adjustment request screen pre-filled from the original invoice that asks about any pre-agreed scheme, and keeps a return request locked until Stores records the goods back

**Outputs**

| Output | Checked by |
| --- | --- |
| Proforma Invoice | None; it posts nothing |
| Sales Order | Sales Manager |
| Price override request | Sales Manager |
| Commercial adjustment request | Sales Manager; the Billing Executive then issues the note |

**Test it:** Full scenario steps B1-01 to B1-08, and simple story steps S-1, S-3 and S-8.

### 2.8 Sales Manager (Nisha, R-S02)

**Responsibilities**

- Approve the commercial terms of each Sales Order (price, discount, delivery terms)
- Approve the reason and value of every commercial adjustment behind a credit note or price-correction debit note
- Maintain the price list and contract rates
- Own the customer scorecard
- Request a credit-hold release, but never release one

**What he does in the business.** On Tuesday 6 October Nisha opens her queue. At the top is Arun's order at ₹540, which is below cost (margin −3.7%); she rejects it and shows the lowest price that keeps the 18% margin floor, ₹683. She approves the export order for the new customer. She approves the ₹700 glucose rate for C-01 because the line margin is still 20%, and asks for the expired contract rate to be fixed. Later she rejects a ₹10,000 goodwill discount for C-02 (no scheme, three credit notes in six months) and approves a ₹50,000 rebate for C-01 because scheme SCH-26-Q2 applies. On 12 October she sees that cream's cost has risen to ₹820, which puts its margin at 17.2%, below the floor.

**What Aikyat must build**

- An approval queue for Sales Orders sorted by risk, showing the line margin against cost and against the price list
- A block on approval by the person who raised the order
- An adjustment approval screen that shows the original invoice, margin, the customer's credit-note history, any scheme reference, and a flag when a note lands just after period end against an earlier invoice
- Open-order ageing grouped by reason: stock short, credit hold, awaiting customer
- A discount and override report by salesperson, customer and item
- A price list screen that flags expired contract rates and items priced below the margin floor
- A customer scorecard (payment data read from the receivables module) and a hold-release request screen with no Release button

**Outputs**

| Output | Checked by |
| --- | --- |
| Approved or rejected Sales Order and adjustment | He is the checker |
| Credit-hold release request | Finance Controller |
| Customer scorecard | CEO / Management, view only |

**Test it:** Full scenario steps B2-01 to B2-07, and simple story step S-2.

### 2.9 Credit Controller (Farid, R-S03)

**Responsibilities**

- Check a customer's credit limit and payment history before an order is confirmed or dispatched
- Place credit holds
- Request a hold release from the Finance Controller
- Review credit limits periodically
- Act as an independent gate: sales targets must never push a risky order through

**What he does in the business.** On Monday afternoon the credit queue holds one order: SO-2 for C-02 (Chennai Retail Mart), ₹4,15,800. The customer already owes ₹8,20,000 (₹2,10,000 of it 38 days overdue) and has a bounced cheque, so total exposure would be ₹12,35,800 against a ₹10,00,000 limit. Farid places a hold with a reason. On Tuesday the system also suggests a hold for C-06 (Kerala Traders): it is at 82% of its limit, paying slower each month and has broken two promises. On Friday C-02 pays its overdue ₹2,10,000; Farid asks the Finance Controller to release SO-2, with the exposure summary (₹10,25,800, still ₹25,800 over). The Finance Controller decides.

**What Aikyat must build**

- A credit review screen showing exposure as one total (open invoices + open orders + goods dispatched but not billed), the limit, overdue amount, days-past-due trend, bounced receipts and broken promises, with data read from the receivables module
- A Credit Hold Log: customer, placed by, reason, release requested by, released by, exposure at release
- No Release action for any Sales role, and a refusal when anyone but the Finance Controller releases a hold
- Suggested holds for customers whose payment behaviour is worsening before they reach the limit
- A quarterly review that suggests a limit from billing, credit days, risk band and payment record, and lists limits not reviewed for 12 months

**Outputs**

| Output | Checked by |
| --- | --- |
| Credit check and hold | None; an independent gate, not a second approver |
| Hold release request | Finance Controller only |
| Suggested credit limit | Reviewed by the Credit Controller; the limit itself is changed through the customer master |

**Test it:** Full scenario steps B3-01 to B3-04, and simple story step S-4.

### 2.10 Billing Executive (Pooja, R-B01)

**Responsibilities**

- Raise sales invoices for goods dispatched and services rendered
- Issue credit notes and debit notes, only against an adjustment the Sales Manager approved
- Prepare export invoices and GST receipt and refund vouchers on advances
- Request cancellation of an e-invoice or e-way bill within 24 hours
- Keep dispatched-but-not-billed at zero
- Resolve invoice errors with customers
- Never allocate receipts, request write-offs or edit customer finance fields

**What he does in the business.** On Monday 5 October Pooja finds three supplies not billed: a co-packing service from 15 September (₹72,000), and two challans from 3 October that went out during a portal outage (₹72,000 and ₹99,000). She bills all three. On Wednesday she creates the invoice for SO-1 from the delivery challan: ₹7,12,500 plus CGST and SGST of ₹17,812.50 each, total ₹7,48,125. The Accounts Manager approves it, and the system then gets the e-invoice number and prepares the e-way bill. Later she issues a credit note of ₹29,400 for 40 damaged cartons once Stores has recorded the return, a rebate note under scheme SCH-26-Q2, an invoice for the export customer under the LUT, and a refund voucher when an advance order is cancelled.

**What Aikyat must build**

- A sales invoice screen that pulls undelivered challan lines, checks place of supply against the customer's GSTIN, applies the customer's billing instructions and checks the e-invoice fields before approval; quantity can never exceed the challan
- A posting step that writes one balanced entry through the shared accounting service and leaves the invoice in Draft if the entry fails
- Invoice numbers in a series for each GSTIN, with cancelled numbers kept
- A daily unbilled list with services aged against the 30-day limit
- A credit note and debit note screen that shows only approved adjustments, pre-fills from the invoice, waits for the return receipt, sets the GST-reduction flag from the scheme reference and warns before the 30 November limit
- An IRN and e-way bill cancellation request that shows time left in the 24-hour window
- An export invoice that checks the LUT is valid on the invoice date
- Receipt and refund vouchers on advances, and delivery and acknowledgement tracking for each invoice

**Outputs**

| Output | Checked by |
| --- | --- |
| Sales invoice | Accounts Manager (approval triggers the IRN and e-way bill) |
| Credit note | Accounts Manager always; Finance Controller as well above the limit |
| Debit note | Accounts Manager always |
| GST-reducing discount note | Compliance Officer as well |
| Export invoice | Compliance Officer (LUT) |
| Tax override | Compliance Officer |

**Test it:** Full scenario steps B4-01 to B4-13, and simple story steps S-6 and S-9.

## 3. Controls

Controls decide who may do what and where the system must stop a user. The same rules are tested step by step in the Full scenario tab, Part C (30 tests).

### 3.1 Who checks whom

| Document | Made by | Checked by | When |
| --- | --- | --- | --- |
| Purchase Order | Procurement Officer | Procurement Manager | Above the PO limit |
| Works Order | Contracts & Services Officer | Procurement Manager | Every one |
| Match exception (PO, receipt, invoice) | Procurement Officer | Accounts Manager | Variance above the tolerance |
| Scanned fields | Whoever keys the document | Accounts Manager | Only fields flagged low-confidence |
| Quality record | Quality Inspector | Stores Officer (confirms disposition) | Every one |
| Adjustment, write-off, transfer, job-work challan | Stores Officer | Inventory Controller | Above the adjustment limit; every transfer |
| Transfer between separate GST registrations | Stores Officer | Inventory Controller and Compliance Officer | Every one |
| Reorder and min-max levels | Procurement Officer | Inventory Controller | Every proposal |
| Sales Order | Sales Executive | Sales Manager | Above the order limit, any price override or below-cost line |
| Commercial adjustment request | Sales Executive | Sales Manager | Every one |
| Credit hold release | Credit Controller or Sales Manager (request) | Finance Controller | Every release |
| Sales invoice | Billing Executive | Accounts Manager | Every one in this scenario |
| Credit note | Billing Executive | Accounts Manager; Finance Controller as well | Always; above ₹1,00,000 for the second |
| Debit note | Billing Executive | Accounts Manager | Always |
| GST-reducing discount, export invoice, advance voucher | Billing Executive | Compliance Officer | As each applies |
| Tax override | Any maker (request) | Compliance Officer | Every override, logged either way |

### 3.2 What the system must refuse

These are the only hard stops. Each must leave a log entry showing who tried.

- A person approving a document he made himself
- A Sales role releasing a credit hold, or anyone but the Finance Controller releasing one
- The Sales Executive issuing a credit note or debit note
- The Billing Executive editing customer terms or identity, allocating receipts or requesting write-offs
- A return credit note before Stores has recorded the goods back
- A GST-reducing credit note with no pre-agreed scheme reference
- A challan line with no matching Sales Order line, or an invoice line with no challan line
- Editing or deleting a posted document: corrections are new documents (credit note, short-close, new challan line)
- Cancelling an e-invoice after 24 hours
- A document without a Branch
- Counting a godown by its own custodian
- A confirmed invoice whose accounting entry failed

### 3.3 Warnings that never block

Each asks for a reason code, logs it and lets the user continue: a costlier or late vendor, a duplicate or split PO, a receipt with no PO, a purchase keyed without a PO, a low-confidence scanned field, an over-receipt beyond the tolerance (the excess is simply not received), negative stock, a price override, a below-cost price, a duplicate order, a customer over its limit (this holds the order, but the order is still saved), a tax override.

### 3.4 Tolerances

| Check | Rule | What the system does |
| --- | --- | --- |
| Goods received against PO | Up to +2% | Accept silently; alert above it, receive only up to the limit |
| PO, receipt and invoice | Quantity 0.5%, rate 1% | Within tolerance posts; above routes to the Accounts Manager |
| Challan against Sales Order | Up to +2% | Posts; above goes to the Accounts Manager |
| Invoice against challan | 0% above, partial billing allowed | An invoice quantity above the challan is a variance; with no challan line it is rejected |
| Count difference | 1% | Above it forces a recount |
| E-way bill | Above ₹50,000 with goods moving | Required; Part-B before the vehicle leaves |

Every value comes from the company rules table.

### 3.5 Audit log, numbering and branch

- **Approval Log.** Every state change writes the document, maker, checker, time and action. Entries can never be edited or deleted.
- **Numbering.** Each document type has its own series, reset every financial year. Invoice numbers are unique within a GSTIN, never reused and never gapped.
- **Branch.** Every document carries a Branch, and stock documents also a Godown. Branch reports are a filter on the one set of books.
- **GST.** Tax is derived from the branch and party states, not typed. Two branches with different GST registrations trade as separate persons: a transfer needs a tax invoice and the receiving branch takes the credit.

## 4. How the work flows

&#91;embedded content: two handover chains, Purchase and Sales, with the stub roles dashed\]

Each chain moves left to right and no box approves its own work. Approved reorder levels flow back to the Procurement Officer's suggested list, and the Sales Manager's approved adjustments reach the Billing Executive as credit and debit notes. Dashed boxes are seeded stub users.

## 5. Outputs and acceptance checks

When all roles have played their steps, the system must show these registers and totals. They are the same in Perpetual and Periodic runs.

### 5.1 What the system must show at the end

| Register or report | Owner | Key value to verify (Full scenario, 28 to 31 Oct) |
| --- | --- | --- |
| PO register | Procurement Officer | PO 0420 closed at 51,000 kg (+2.0%); PO 0412 short-closed with ₹2,48,000 released; PO 0421 amended to 3,900 kg, ₹9,55,500; PO 0422 cancelled |
| Receipt (GRN) register | Stores Officer | Sugar 9,850 kg from Vendor C; 200 kg of maida excess never received |
| Quality record register | Quality Inspector | Rejected 100 kg (Vendor C) and 400 kg (Vendor B) |
| Match exceptions | Procurement Officer | Sugar voucher variance ₹17,900 (quantity ₹7,020, rate ₹7,880, freight ₹3,000) |
| Vendor scorecard | Procurement Manager | Vendor B on-time 57.1%, rejection 3.64%, flagged for review; Vendor D flagged for on-time |
| Stock statement by godown and batch | Inventory Controller | Maida 33,500 kg at Bengaluru and 6,500 kg at Hosur; SMP 1,172 kg and 600 kg in two godowns |
| Negative stock report | Inventory Controller | One event, aged 40 minutes, reason "inward not yet posted" |
| Sales Order register | Sales Executive | SO-1 closed; SO-2 held then released; SO-4 awaiting customer; SO-6 cancelled |
| Credit Hold Log | Credit Controller | SO-2 placed 06-Oct, released by Finance Controller 12-Oct at exposure ₹10,25,800; C-06 hold still active |
| Price override log | Sales Manager | ₹700 on SO-1 approved; ₹540 on SO-4 rejected |
| Unbilled list | Billing Executive | Nil after 05-Oct; month-end accrual ₹72,000 reversed on 01-Nov |
| Sales register | Billing Executive | Invoiced ₹22,97,340 including a ₹6,000 debit note, credit notes ₹86,000, net sales ₹22,11,340 before GST |
| E-invoice exception queue | Compliance Officer (stub) | Empty if the pincode is fixed first; one row if the invoice is forced through |
| Approval Log | Every role | Every checker differs from the maker; no state change without an entry |

### 5.2 Acceptance checks

The build is accepted when:

- [ ] Every step in the Simple version tab returns its answer
- [ ] Every step in the Full scenario tab returns its answer, in both Perpetual and Periodic runs
- [ ] All 30 refusal tests in Part C of the Full scenario tab pass
- [ ] Changing any value in the company rules table changes behaviour with no code change
- [ ] No warning blocks a save, and every warning stores a reason code
- [ ] Every document carries a Branch, and branch-wise totals add up to the company total
- [ ] Each user sees only his own queue
- [ ] The seeded stub users can approve or reject everything listed as waiting for them

The build order by roadmap phase is in the Full scenario tab, Part D.

## 6. Decisions still open

The scenario picks one answer for each of these so it can run. Please confirm or change them; the full list of nine is at the end of the Full scenario tab.

1. **Who issues invoices and notes.** The Sales scope (26 Sep) still shows the Accounts Executive generating invoices and the Sales Executive raising credit notes. The 1 Oct role list gives both to the Billing Executive. Decided: the Billing Executive does it, and this guide follows the 1 Oct list.
2. **Who approves a short-close of a PO.** No document says. The scenario logs it with a reason and no checker.
3. **Cancelling an e-invoice after the goods have moved.** The scenario does not allow it; only a credit note is offered.
4. **Which quantity the match uses.** The scenario compares on the quantity received, and settles quality rejections through a return and a debit note.
5. **Two tolerances.** A +2% limit at goods receipt and a separate 0.5% quantity tolerance in the match.
6. **Placeholders.** GST rates, HSN codes, thresholds, margin floor, sampling percentages and credit formula are illustrative and need management and Compliance Officer sign-off before the answers are final.
