# Aikyat Biscuit Plant: Build Scenario for Purchase and Sales Roles

Oct 5, 2026 · @Swasthik

## How to use this scenario

Build Aikyat until every step below returns its answer key and the Part D checks pass. At that point the Purchase roles (Procurement Officer to Inventory Controller) and the Sales roles (Sales Executive to Billing Executive) are ready.

**Basis.** Purchase Module (Finalized Scope, 18 Sep), Sales Module (Finalized Scope v3, 26 Sep) and the Role-wise Work List (revised 1 Oct). Where they disagree, the Role-wise Work List wins; the differences are listed in the last section.

**Same plant as before.** A biscuit plant in Bengaluru (KA) with an RM Store and a Packing Store, plus a second unit at Hosur (TN) with its own GSTIN. Materials: maida, sugar, skimmed milk powder (SMP), laminate film, corrugated cartons and vanilla flavour. The scenario clock starts on Monday 05-Oct-2026 and runs to 31-Oct-2026.

&#91;embedded content: two handover chains, Purchase and Sales, with the stub roles dashed\]

Each chain moves left to right, and no box approves its own work. Approved reorder levels flow back to Ravi's suggested list, and Nisha's approved adjustments reach Pooja as credit and debit notes.

**How to solve it**

1. Load the seed data in Section 2 (masters, stock, open POs, open invoices, company rules).
2. Play each role's steps in ID order. The date in each step tells you which day of the run it belongs to.
3. After each step, compare what Aikyat shows with the answer key. A mismatch is a defect or a missing feature, never a data problem.
4. Run the Part C negative tests, then the Part D checklist.
5. Run the whole script twice: once with the company set to Perpetual inventory accounting and once with Periodic. Quantities and answer keys are identical; only the accounting hand-off differs.

**Reading a step**

| Column | Meaning |
| --- | --- |
| ID | A = Purchase side, B = Sales side, D = dispatch hand-off. The number is the order within the role |
| Maker does | The person, the date and the input data |
| Aikyat must | The behaviour or intelligence to build |
| Answer key | The exact values a correct build shows |
| Checker | Who approves next. (stub) means a seeded user, not a screen built here |

**Rules that apply to every step**

- Warnings are soft. Aikyat asks for a reason code and logs it; missing data is a prompt, never a blocker. The only hard rejects are the ones listed in Part C.
- Every state change writes an append-only Approval Log entry: entity, maker, checker, time, action.
- Tolerances, thresholds and day-counts come from the Company rules table in Section 2, never from code.
- Roles outside this scope (Accounts Executive, Accounts Manager, Compliance Officer, Finance Controller, Payables Executive) are stubs: seeded users who can approve or reject so the chain keeps moving.
- All numbers are illustrative. GST rates are placeholders to be confirmed HSN by HSN before any real use.

## Factory setup and seed data

Load these tables before step 1. Everything a step uses is either here or created by an earlier step.

### Company, branches and switches

| Branch | State | GSTIN | Godowns |
| --- | --- | --- | --- |
| KA-01 Bengaluru plant and HQ | Karnataka | KA GSTIN (enter) | KA-RM RM Store, KA-PK Packing Store, KA-FG Finished goods, KA-QC QC hold and quarantine |
| TN-01 Hosur unit | Tamil Nadu | TN GSTIN (enter, separate registration) | TN-ST Store, TN-FG Finished goods |

Company switches: GRN on; Delivery Challan on (physical for goods, notional for services); e-invoicing applies, so a DC cannot be released until the IRN exists; invoice mode accounting-led (replayed in integrated mode in B4-02); inventory method Perpetual in Run 1 and Periodic in Run 2; the quarter ended 30-Sep-2026.

### People

| User | Role | Role ID | Place |
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
| Teja, Rajan, Venkat, Usha, Sunil | Stubs: Accounts Executive R01, Accounts Manager R02, Compliance Officer R24, Finance Controller R-FC01, Payables Executive R-AP01 | as listed | HQ |
| Plant Head, Packing Head | Stub department heads who confirm services received | none | KA-01 |

### Company rules: thresholds and tolerances

| Setting | Value |
| --- | --- |
| PO approval threshold | ₹5,00,000 per PO, approved by the Procurement Manager |
| Split-PO pattern | Same vendor and item within 7 days, each PO at least 90% of the threshold (₹4,50,000), combined at or above the threshold |
| Stock target | 10 days of cover plus 1 day safety stock |
| Vendor lead time | 80th percentile (nearest rank) of actual PO-to-GRN days |
| Overdue PO counted as supply | Not counted once more than 5 days late |
| Over-receipt tolerance at GRN | +2% of the PO line |
| Three-way-match tolerance (PO, GRN, invoice) | Quantity 0.5%, rate 1% |
| Short-close suggestion | No movement for 30 days |
| OCR low-confidence flag | Below 80% |
| QC sampling | Normal 3% of bags; tightened 6% when vendor rejection is 3% or more over 6 months |
| Stock adjustment approval | Any adjustment above ₹2,000; Finance Controller above ₹1,00,000 |
| Count variance tolerance | 1% of book quantity; above it a recount is forced |
| Negative stock policy | Warn; override needs the Inventory Controller |
| Inter-branch in-transit alert | 3 days |
| Job-work process loss tolerance | 3% |
| PO risk points | Split pattern 40, poor scorecard 25, new vendor 30, single-source item 20, rate more than 3% above 6-month average 15 |
| Vendor review flag | On-time below 70% or rejection 3.5% or more |
| Vendor concentration flag | One vendor holds 70% or more of an item's 6-month spend |
| Stock approval queue points | Value points = ₹ value ÷ ₹10,000 rounded down, capped at 20; repeat item +30; same godown or user with 3 or more shortages in 60 days +20; ties go to the higher value |
| Cycle-count class | A = repeat variance in 90 days (weekly); B = high consumption value (fortnightly); C = the rest (monthly) |
| Sales Order approval | SO value above ₹3,00,000, or any rate override, or any below-cost line, goes to the Sales Manager |
| Margin floor | 18% |
| SO risk points | 1 point per 0.5% below list price (cap 20); below cost +50; new customer +30; quantity more than 3 times the customer's average order +20 |
| DC tolerance | Dispatch may exceed the SO line by up to 2%; invoice quantity may not exceed DC quantity |
| E-way bill threshold | ₹50,000 and physical movement of goods |
| Credit Note approval | Accounts Manager always; Finance Controller as well above ₹1,00,000 |
| Suggested credit limit | Average monthly billing × (credit days ÷ 30) × band factor (A 1.2, B 1.0), then × 0.8 if any dishonour in 90 days or any amount over 30 days overdue |
| Credit note time-limit warning | Within 60 days of 30 November following the financial year of the invoice |
| Service invoicing limit | 30 days from the date of supply (Rule 47) |
| GST rates (placeholders) | 5% on food materials and biscuits; 18% on packing materials and services |

### Items, stock and costs at KA-01 on 05-Oct

| Code | Item | UoM | QC | Reorder level | Stock | Average cost | Daily use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RM-001 | Maida | kg | Yes | 20,000 | 18,500 | ₹38.40 | 6,200 (prior 14 days: 5,700) |
| RM-002 | Sugar | kg | Yes | 10,000 | 5,500 | ₹45.50 | 1,100 |
| RM-003 | Skimmed milk powder | kg | Yes | 1,500 | 1,800 | ₹309.67 | 300 |
| RM-004 | Vanilla flavour | litre | No | 30 | 40 | ₹1,125 | 2 |
| PM-001 | Laminate film roll | kg | Yes | 2,400 | 1,008 | ₹243 | 480 |
| PM-002 | Corrugated carton | nos | No | 6,000 | 6,200 | ₹28 | 700 |

SMP is batch-tracked with FEFO: batch SM-2604 holds 300 kg at ₹298 expiring 28-Oct-2026, and batch SM-2609 holds 1,500 kg at ₹312 expiring 28-Mar-2027. Vendor G ships in multiples of 400 kg; Vendor A in multiples of 10,000 kg. Maida arrives in 25 kg bags and sugar in 50 kg bags. Hosur (TN-ST) holds 1,500 kg of maida at ₹38.80 and uses 1,400 kg a day. The 6-month purchase history is: maida last three rates ₹38.20 (A, 12-Sep), ₹38.60 (A, 24-Sep), ₹39.10 (B, 01-Oct), best ₹37.40 (C, 14-May), average ₹38.40; SMP average ₹308.

### Vendors

| Vendor | Supplies | State | History |
| --- | --- | --- | --- |
| A | Maida | KA | On time 17 of 18 POs (94%); rejection 0.5%; PO-to-GRN days 3, 4, 3, 3, 5, 3, 4, 3 |
| B | Maida, sugar | KA | On time 8 of 13 (62%); rejection 3.1% (1,240 kg of 40,000 kg in 6 months); frequent rate revisions |
| C | Sugar, maida | KA | On time 11 of 12 (92%); rejection 0.4%; short-supplied 4 of the last 6 GRNs by 1.4% to 1.6%; holds 72% of 6-month sugar spend |
| D | Laminate film | KA | On time 6 of 11 (55%); rejection 1.0%; PO-to-GRN days 5, 5, 6, 6, 6, 6, 7, 8; film is bought from 4 vendors at ₹245 to ₹262 |
| E | Corrugated cartons | KA | On time 7 of 10 (70%) |
| F | Vanilla flavour | KA | Sole source; on time 5 of 5 |
| G | SMP | Gujarat (IGST) | Single source; on time 9 of 10; PO-to-GRN days 6, 6, 7, 7, 7, 8 |

Service and job-work parties: OvenCare Engineering (AMC), Shakti Manpower (contract labour), PrintPack Converters (job work), and a local trader for food colour.

### Open POs on 05-Oct (numbers are KA/PO/26-27/nnnn)

| PO | Vendor | Item | Open quantity | Rate | Open value | Due | Note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 0398 | D | Laminate film | 2,720 kg | ₹250 | ₹6,80,000 | 29-Sep | Nothing received |
| 0403 | B | Sugar | 5,000 kg | ₹48 | ₹2,40,000 | 25-Sep | Nothing received |
| 0407 | C | Sugar | 10,000 kg | ₹46 | ₹4,60,000 | 06-Oct |  |
| 0411 | F | Vanilla flavour | 40 L | ₹1,125 | ₹45,000 | 02-Oct | Nothing received |
| 0412 | G | SMP | 800 kg (of 5,000; 4,200 received) | ₹310 | ₹2,48,000 | 10-Sep | Last GRN 05-Sep |
| 0419 | E | Corrugated cartons | 10,000 | ₹28 | ₹2,80,000 | 12-Oct | Nothing received |

### Contracts on 05-Oct

| Works Order | Party | Detail |
| --- | --- | --- |
| WO-0021 | Shakti Manpower | Packing-line manpower, ₹2,40,000 a month, 01-Apr-2026 to 31-Mar-2027 (₹28,80,000), 40 workers deployed, 5% retention; April to August milestones confirmed, September pending |
| WO-0009 | Housekeeping vendor | Expires 26-Oct-2026 |
| WO-0017 | Pest-control vendor | Expired 30-Sep-2026 |
| WO-0026 | Security vendor | Expires 30-Nov-2026 |
| Past oven AMCs | Similar machines | Average contract value ₹9,50,000 |

### Finished goods, price list and customers

| Code | Product | List price | Standard cost | Stock in KA-FG |
| --- | --- | --- | --- | --- |
| FG-101 | Glucose biscuit 100 g, carton of 48 (HSN placeholder 190531) | ₹720 | ₹560 | Batch G-2604: 300 cartons, expiry 12-Oct-2026; batch G-2608: 2,000 cartons, expiry 10-Feb-2027 |
| FG-102 | Milk cream biscuit 150 g, carton of 36 (HSN placeholder 190531) | ₹990 | ₹760 (rises to ₹820 on 12-Oct) | Batch C-2607: 1,500 cartons, expiry 15-Jan-2027 |

| Customer | State | Limit and terms | Position on 05-Oct |
| --- | --- | --- | --- |
| C-01 Sri Lakshmi Distributors | KA | ₹15,00,000, 30 days, band A | Open invoices ₹4,00,000, none overdue; average monthly billing ₹15,00,000; Q2 purchases ₹25,00,000; Glucose contract rate ₹700 expired 30-Sep; Cream contract rate ₹975 valid to 31-Dec; scheme SCH-26-Q2 gives 2% rebate on quarterly purchases of ₹20,00,000 or more; 1 credit note in 12 months; average discount 2.5% on Glucose |
| C-02 Chennai Retail Mart | TN | ₹10,00,000, 45 days, band B | Open invoices ₹8,20,000 of which ₹2,10,000 is 38 days overdue; 1 dishonoured cheque 62 days ago; DSO 52, 58, 62 over three months; 2 broken payment promises; 3 credit notes in 6 months; average monthly billing ₹8,00,000; ship-to pincode missing on the master |
| C-03 Gulf Snack Imports LLC | UAE | 100% advance, band new | New customer; LUT valid to 31-Mar-2027; invoices in USD |
| C-04 Healthy Bite Foods | KA | ₹3,00,000, 15 days, band B | Co-packing services; unbilled supply N-1 delivered 15-Sep (12,000 packs, ₹72,000 before GST); advance of ₹59,000 received 03-Oct |
| C-05 Namma Bakes | KA | ₹5,00,000, 30 days, band B | DC-0618 (Glucose 100 cartons, ₹72,000) and DC-0619 (Cream 100 cartons, ₹99,000) dispatched 03-Oct during an IRN portal outage and not billed; last credit review 14-Aug-2025 |
| C-06 Kerala Traders | KL | ₹5,00,000, 30 days, band B | Exposure ₹4,10,000 (82% of limit); DSO 41, 48, 55; 2 broken promises |

## A1. Procurement Officer (Ravi, R-P01)

Ravi plans the buy, picks the vendor, raises the PO and chases it. His makes are checked by the Procurement Manager (PO), the Accounts Manager (OCR, three-way match) and the Inventory Controller (reorder levels).

**A1-01 Suggested PO list** (Mon 05-Oct, 08:30)

- Maker does: opens the daily suggested-PO list.
- Aikyat must: for each item compute target = (10 + 1) days × daily use; supply = stock + open POs that are not more than 5 days late; suggestion = target − supply, rounded up to the vendor's multiple; mark urgent when cover is shorter than the vendor's lead time.
- Answer key:

| Item | Target | Supply counted | Suggestion | Why |
| --- | --- | --- | --- | --- |
| Maida | 68,200 kg | 18,500 kg | 50,000 kg (shortfall 49,700, rounded to a multiple of 10,000) | Cover 2.98 days against a 4-day lead time, so urgent; use is up 8.8% on the prior 14 days |
| Laminate film | 5,280 kg | 1,008 kg | 4,272 kg | PO 0398 is 6 days late and is excluded; cover 2.1 days against a 7-day lead time, so urgent |
| SMP | 3,300 kg | 1,800 kg | 1,600 kg (shortfall 1,500, rounded to a multiple of 400) | PO 0412 is 25 days late and is excluded |
| Sugar | 12,100 kg | 15,500 kg | None | PO 0407 (10,000 kg, due 06-Oct) is counted; PO 0403 is excluded as 10 days late |
| Vanilla, cartons | 22 L, 7,700 | 80 L, 16,200 | None | Open POs 0411 and 0419 are counted |

- Checker: none for the list itself.

**A1-02 Select vendor and rate** (Mon 05-Oct)

- Maker does: starts a PO for 50,000 kg of maida and picks Vendor B at ₹39.60.
- Aikyat must: show the last 3 purchase rates, the best rate in 6 months and both vendors' scorecards; warn when the chosen vendor is costlier or has a poor delivery record.
- Answer key: last 3 rates ₹38.20 (A), ₹38.60 (A), ₹39.10 (B); 6-month best ₹37.40 (C, 14-May). Vendor A quotes ₹38.90 (4.0% above best, 1.3% above the ₹38.40 average). Vendor B is ₹0.70 a kg dearer, so ₹35,000 more on 50,000 kg, with on-time 62% and rejection 3.1% against A's 94% and 0.5%. Two warnings appear on B: costlier, and poor delivery record. Keeping B would need a reason code, logged, never a block. Ravi switches to A.
- Checker: none at this step.

**A1-03 Raise the Purchase Order** (Mon 05-Oct)

- Maker does: raises PO 0420 to Vendor A for 50,000 kg at ₹38.90, ship-to KA-RM, promised delivery 08-Oct.
- Aikyat must: derive GST from the bill-to GSTIN, ship-to branch and vendor state; predict the delivery date from the vendor's actual lead-time history; show the stock-out date against it; route to the Procurement Manager because the value is above the threshold.
- Answer key: taxable ₹19,45,000, CGST ₹48,625, SGST ₹48,625, total ₹20,42,250. Predicted delivery 09-Oct (80th percentile of A's history is 4 days). Projected maida stock-out at the close of 07-Oct, so Aikyat suggests asking for a 10,000 kg part-load by 07-Oct. Status Pending Approval.
- GST derivation test:

| Bill-to | Ship-to | Vendor A state | Expected |
| --- | --- | --- | --- |
| KA GSTIN | KA-RM | KA | CGST + SGST |
| TN GSTIN | TN-ST | KA | IGST |
| KA GSTIN | TN-ST | KA | Tax follows bill-to; flagged for compliance review because bill-to and ship-to states differ |

- Checker: Meena (Procurement Manager).

**A1-04 Duplicate and split POs** (Mon 05-Oct)

- Maker does: (a) starts a PO for 8,000 cartons with Vendor E; (b) raises two laminate-film POs to Vendor D on the same day: PO 0421 for 2,000 kg at ₹245 (₹4,90,000) and PO 0422 for 1,900 kg at ₹245 (₹4,65,500).
- Aikyat must: warn on same vendor + same item + open PO; detect the split pattern; route the combined value for approval; never block the officer.
- Answer key: (a) duplicate warning naming PO 0419 (10,000 cartons, nothing received); Ravi cancels the draft and no PO number is used. (b) both POs are above 90% of the threshold (98.0% and 93.1%); combined value ₹9,55,500 is at or above ₹5,00,000, so the split flag fires on PO 0422 and both go to Meena as one combined item.
- Checker: Meena.

**A1-05 Follow up overdue POs** (Mon 05-Oct, 09:00)

- Maker does: opens the overdue list.
- Aikyat must: list POs past due with no GRN, ranked by outstanding value × days late, with stock cover beside each; draft the vendor message.
- Answer key:

| Rank | PO | Item | Outstanding | Days late | Score | Stock cover |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0398 | Laminate film (D) | ₹6,80,000 | 6 | 40,80,000 | 2.1 days |
| 2 | 0403 | Sugar (B) | ₹2,40,000 | 10 | 24,00,000 | 5.0 days |
| 3 | 0411 | Vanilla (F) | ₹45,000 | 3 | 1,35,000 | 20 days |

Draft for PO 0398: "PO 0398 for 2,720 kg of laminate film was due on 29-Sep and is 6 days overdue, outstanding ₹6,80,000. Packing line stock covers about 2 days. Please confirm the dispatch date and vehicle today."

- Checker: none.

**A1-06 Raise a three-way-match exception** (Wed 07-Oct)

- Maker does: sugar PO 0407 (10,000 kg at ₹46.00) was received on 06-Oct as a GRN of 9,850 kg (A4-02). The vendor invoice arrives for 10,000 kg at ₹46.80 plus ₹3,000 freight.
- Aikyat must: compute the variance, split it in a fixed order (quantity at invoice rate, rate on received quantity, other charges), compare with tolerance, suggest likely reasons, save the voucher as a draft and route the variance.
- Answer key:

| Document | Quantity | Rate | Value |
| --- | --- | --- | --- |
| PO | 10,000 kg | ₹46.00 | ₹4,60,000 |
| GRN (received) | 9,850 kg | at PO rate | ₹4,53,100 |
| Invoice | 10,000 kg | ₹46.80 + ₹3,000 freight | ₹4,71,000 |

Variance ₹17,900 = quantity 150 kg × ₹46.80 = ₹7,020 (1.5%, above 0.5%) + rate 9,850 kg × ₹0.80 = ₹7,880 (1.74%, above 1%) + freight ₹3,000 (not on the PO). Suggested reasons: short supply, rate revision, freight added. The match uses received quantity; the 100 kg QC later rejects (A5-01) settles through a return and Debit Note, not here.

- Checker: Rajan (Accounts Manager, stub).

**A1-07 Short-close a PO** (Mon 05-Oct)

- Maker does: opens the short-close suggestions and confirms PO 0412 with reason "vendor cannot supply balance".
- Aikyat must: suggest POs that are partly received with no movement for 30 days; on confirmation release the open commitment and recompute suggestions.
- Answer key: PO 0412 is suggested (800 kg open, ₹2,48,000, last GRN 05-Sep, idle 30 days). After confirmation the status is Closed (short-closed), the commitment of ₹2,48,000 is released, Vendor G's fill rate is stored as 4,200 of 5,000 (84%), and an Approval Log entry records the reason.
- Checker: see open point 2 (the documents do not say who approves a short-close).

**A1-08 OCR document capture** (Wed 07-Oct)

- Maker does: uploads the scanned sugar invoice from A1-06.
- Aikyat must: pre-fill the voucher, show a confidence per field, flag fields below 80% for manual entry, and save a draft rather than block.
- Answer key: invoice number 98%, GSTIN 99%, rate 96%, quantity 61% (a stamp smudges the digits and OCR read 18,000). Only the quantity is flagged; Ravi corrects it to 10,000. The draft carries "1 OCR field to confirm".
- Checker: Rajan reviews only that flagged field.

**A1-09 Reorder and min-max proposal** (Fri 09-Oct)

- Maker does: opens the monthly proposal screen.
- Aikyat must: propose reorder level = lead time × daily use + 1 day safety, and maximum = 11 days of use, using the 80th-percentile lead time from actual PO-to-GRN history.
- Answer key:

| Item | Lead time (P80) | Reorder level now | Proposed reorder level | Proposed maximum |
| --- | --- | --- | --- | --- |
| Maida | 4 days | 20,000 kg | 31,000 kg (4 × 6,200 + 6,200) | 68,200 kg |
| Laminate film | 7 days | 2,400 kg | 3,840 kg (7 × 480 + 480) | 5,280 kg |
| SMP | 7 days | 1,500 kg | 2,400 kg (7 × 300 + 300) | 3,300 kg |

The proposal is routed, never written to the Item Master.

- Checker: Anand (Inventory Controller), see A6-03.

**A1-10 Purchase keyed without a PO** (Thu 08-Oct)

- Maker does: Teja (stub) posts a voucher for 25 kg of food colour from a local trader, ₹8,500, and answers No to "Create a PO for this?".
- Aikyat must: allow the posting, log "no PO" as an exception reason, and list it for Ravi.
- Answer key: voucher saved and posted normally; Ravi's exception list shows 1 item "no PO, ₹8,500"; Meena sees it in the weekly review (A3-03).
- Checker: none.

## A2. Contracts & Services Procurement Officer (Kiran, R-P03)

Kiran raises Works Orders in place of POs, tracks milestones, gets service completion confirmed and collects contractor labour evidence. There is no stock, GRN or landed cost anywhere in this flow. Job work is raised here, but the goods move through Inventory (A4-12).

**A2-01 Raise a Works Order** (Mon 05-Oct)

- Maker does: raises WO-0033 for a tunnel-oven AMC with OvenCare Engineering, 01-Oct-2026 to 30-Sep-2027, ₹12,00,000 in four quarterly milestones, 5% retention.
- Aikyat must: offer a template from similar past agreements; suggest the TDS payment code (contractor type, 194C-equivalent, not professional fees) and GST (18%, CGST + SGST, not RCM because the vendor is registered); take party identity from Business Core.
- Answer key: template "Machinery AMC" suggested from past oven AMCs. Each milestone is ₹3,00,000 plus GST ₹54,000 (CGST ₹27,000, SGST ₹27,000), retention ₹15,000. Changing the suggested TDS code needs a reason and is logged for the Compliance Officer. No accounting approval is requested at this stage.
- Checker: Meena (commercial), see A3-06.

**A2-02 Track milestones and billing ahead of completion** (Mon 05-Oct)

- Maker does: opens WO-0021 (packing-line manpower). Shakti Manpower raised its October bill on 03-Oct.
- Aikyat must: show milestone due dates, alert when a vendor bills ahead of completion, and show the share of contract value consumed from confirmed milestones only.
- Answer key: alert "October bill (₹2,40,000) received before the October milestone falls due on 31-Oct". Consumed value ₹14,40,000 of ₹28,80,000 (50.0%), remaining ₹14,40,000; the October bill does not count until confirmed.
- Checker: none.

**A2-03 Service completion confirmation** (Tue 06-Oct)

- Maker does: the September milestone of WO-0021 fell due on 30-Sep; the request went to the Packing Head on 01-Oct. The Packing Head confirms on 06-Oct.
- Aikyat must: send the request when a milestone falls due, age unconfirmed milestones, refuse to match a bill to an unconfirmed milestone, and ask for the contractor's PF/ESI evidence because labour was deployed.
- Answer key: on 05-Oct the September milestone shows aged 5 days, unconfirmed, and a bill cannot be matched to it. After confirmation it shows Confirmed ₹2,40,000 and the confirmation form includes the PF/ESI evidence section. The confirmation is made by the department head and is not a finance approval.
- Checker: none (variances are caught at the match).

**A2-04 Match a service invoice to the Works Order** (Tue 06-Oct)

- Maker does: Shakti Manpower's September invoice arrives for ₹2,65,000 before GST.
- Aikyat must: three-way match the Works Order, the confirmation and the invoice; flag an invoice above the confirmed milestone or the remaining contract value.
- Answer key: invoice exceeds the confirmed milestone (₹2,40,000) by ₹25,000 (10.4%); remaining contract value after September is ₹14,40,000, so the contract limit is not breached. The variance is routed as an exception, not blocked.
- Checker: Rajan (Accounts Manager, stub), who also approves the service bill when it is posted.

**A2-05 Renewals and expiry** (Mon 05-Oct)

- Maker does: opens the monthly expiry view.
- Aikyat must: list contracts expiring within 30 and 60 days and flag invoices arriving against an expired contract.
- Answer key: 30-day window: WO-0009 housekeeping, 21 days left (26-Oct). 60-day window: WO-0026 security, 56 days left (30-Nov). Flag: WO-0017 pest control expired 30-Sep and an invoice of ₹18,000 dated 03-Oct has arrived against it.
- Checker: none.

**A2-06 Contractor PF/ESI evidence** (Thu 08-Oct)

- Maker does: loads the August wage-period evidence for WO-0021: ECR, challans, wage register.
- Aikyat must: match workers on the gate and attendance records to the ECR by UAN or IP number, check challan payment, and check wages against the notified minimum.
- Answer key: 40 workers on attendance, 38 on the ECR, so 2 are flagged as missing from the challan. The August challan (due 15-Sep) is shown as not paid. One worker's wage is ₹13,200 against an illustrative notified minimum of ₹13,800 and is flagged. The bundle goes to the Compliance Officer, who must verify it before the bill can be paid.
- Checker: Venkat (Compliance Officer, stub).

**A2-07 Job-work Works Order** (Mon 12-Oct)

- Maker does: raises WO-0034 with PrintPack Converters to print 1,500 kg of laminate film at ₹32 a kg.
- Aikyat must: use a job-work type with no inventory movement of its own; link it to the Inventory job-work challan raised in A4-12; suggest the TDS code and GST for job work.
- Answer key: charge ₹48,000 plus GST ₹8,640 (18%). The Works Order shows planned goods 1,500 kg and, once the challan exists, the return-by date 14-Oct-2027 (one year for inputs).
- Checker: Meena (commercial).

## A3. Procurement Manager (Meena, R-P04)

Meena approves commercial terms before any accounting approval, watches ageing and exceptions, and owns the vendor scorecard. Her only checker is the CEO / Management view-only role on the scorecard.

**A3-01 Approve PO commercial terms** (Tue 06-Oct, 10:00)

- Maker does: opens the approval queue. Ravi's POs waiting are 0420 (maida, ₹19,45,000), the film POs 0421 and 0422 (A1-04) and 0423 (SMP from Vendor G, 1,600 kg at ₹318 = ₹5,08,800, IGST ₹25,440, from the A1-01 suggestion).
- Aikyat must: sort by risk using the Company rules table and show the reasons beside each PO.
- Answer key:

| Order | PO | Points | Reasons |
| --- | --- | --- | --- |
| 1 | 0421 + 0422 film, Vendor D | 65 | Split pattern 40 + poor scorecard 25 (on-time 55%) |
| 2 | 0423 SMP, Vendor G | 35 | Single-source item 20 + rate 3.25% above the ₹308 six-month average 15 |
| 3 | 0420 maida, Vendor A | 0 | Rate 1.3% above average (under 3%), good scorecard, existing vendor |

Meena rejects the two-PO split and asks for one PO: 0421 is amended to 3,900 kg, ₹9,55,500, and 0422 is cancelled; she then approves the amended 0421, plus 0420 and 0423. The Approval Log shows maker Ravi and checker Meena on each. Ravi cannot approve any of them (Part C).

- Checker: Meena (this is the checker step).

**A3-02 Review open PO ageing** (Mon 05-Oct, 16:00)

- Maker does: opens the weekly ageing view.
- Aikyat must: bucket open POs by days late and mark at-risk POs where the vendor's history says delivery will slip (on-time below 75%).
- Answer key (PO 0412 was short-closed that morning; POs 0420 to 0423 are not yet approved so are not counted):

| Bucket | POs | Value |
| --- | --- | --- |
| Not yet due | 0407, 0419 | ₹7,40,000 |
| 1 to 7 days late | 0398, 0411 | ₹7,25,000 |
| 8 to 14 days late | 0403 | ₹2,40,000 |
| Total open |  | ₹17,05,000 |

At-risk list: 0419 (Vendor E on-time 70%, so the expected date is later than 12-Oct), 0398 (Vendor D 55%) and 0403 (Vendor B 62%).

- Checker: none.

**A3-03 Review three-way-match exceptions and vendor issues** (Mon 12-Oct)

- Maker does: opens the weekly exception review.
- Aikyat must: group exceptions by vendor and reason over 90 days so patterns show.
- Answer key:

| Vendor | Exceptions | Pattern |
| --- | --- | --- |
| C | 5 | Short supply on 4 of the last 6 GRNs, average 1.5% (1.6, 1.4, 1.5, 1.5); 1 freight-added |
| B | 3 | Rate revision, average 1.8% above PO rate |
| Local trader | 1 | No PO, ₹8,500 (from A1-10) |

- Checker: none.

**A3-04 Rate negotiation and vendor rationalisation** (Mon 12-Oct)

- Maker does: opens the monthly price and concentration view.
- Aikyat must: show price-variance trend per item and vendor, and apply the concentration flag.
- Answer key: maida rate rose 4.5% from the May best (₹37.40) to the latest (₹39.10). Sugar: Vendor C holds 72% of 6-month spend, which trips the 70% concentration flag. SMP: Vendor G holds 100% (single source). Laminate film: bought from 4 vendors at ₹245 to ₹262 (6.9% spread), flagged as too many vendors at scattered rates.
- Checker: none.

**A3-05 Vendor scorecard and DPO** (Mon 12-Oct)

- Maker does: opens the monthly scorecard (Phase 5).
- Aikyat must: compute on-time % (last GRN on or before the promised date), rate variance (invoice rate against PO rate) and rejection rate (rejected ÷ received) from the Phase 1 timestamps, and suggest vendors for review. DPO is read from AR/AP (stub).
- Answer key:

| Vendor | On-time | Rate variance | Rejection | Review flag |
| --- | --- | --- | --- | --- |
| A | 17 of 19 = 89.5% (PO 0420 finished 09-Oct against a promise of 08-Oct) | 0.0% | 0.5% | No |
| B | 8 of 14 = 57.1% (PO 0403 arrived 08-Oct, due 25-Sep) | +1.8% | 3.64% (1,640 of 45,000 kg) | Yes: on-time below 70% and rejection above 3.5% |
| C | 12 of 13 = 92.3% | +1.74% on PO 0407 | 1.02% on PO 0407 (100 of 9,850 kg) | No |
| D | 6 of 11 = 54.5% | not available | 1.0% | Yes: on-time below 70% |

Vendor E sits at exactly 70% and is not flagged.

- Checker: CEO / Management (view-only).

**A3-06 Approve a Works Order commercially** (Tue 06-Oct)

- Maker does: reviews WO-0033 (A2-01).
- Aikyat must: compare contract value with similar past contracts and flag unusual scope or value.
- Answer key: ₹12,00,000 against a past average of ₹9,50,000 is +26.3%, flagged "unusual value". Meena approves with a comment. No accounting approval is requested; Rajan approves each service bill when it is posted.
- Checker: Meena (this is the checker step).

**A3-07 Payment hold and retention release** (Fri 09-Oct)

- Maker does: Sunil (Payables Executive, stub) places a quality hold on Vendor B's invoice for PO 0403 after the QC rejection in A5-02, and requests release of WO-0021 retention for April to August.
- Aikyat must: show the QC record and the amount in dispute beside the hold; for retention, show that every milestone in the period is confirmed.
- Answer key: amount in dispute ₹20,160 (400 kg × ₹48 = ₹19,200 plus 5% GST ₹960), with the Debit Note status shown. Meena confirms the hold now and releases it once the Debit Note exists (12-Oct). Retention April to August is 5 × ₹12,000 = ₹60,000, all five milestones confirmed, release approved; September's ₹12,000 is not in this release.
- Checker: Meena (this is the checker step).

## A4. Stores / Inventory Officer (Suresh, Latha, Gopal, R-P02)

The Stores role records goods in and out at the point of movement. Its Purchase and Inventory work is below; its dispatch work for sales is in the dispatch hand-off in Part B (D-01 to D-05). Seed assumption for checkability: after 09-Oct no maida is issued to production, and SMP and film are issued only as stated.

**A4-01 Expected arrivals** (Mon 05-Oct, 08:00, Suresh)

- Aikyat must: build a due-today and overdue inward list by godown from open POs.
- Answer key: due today none. Overdue, in order of days late: PO 0412 SMP 25 days, PO 0403 sugar 10, PO 0398 film 6, PO 0411 vanilla 3. (PO 0412 leaves the list after the short-close in A1-07.)
- Checker: none.

**A4-02 Record a GRN** (Tue 06-Oct, Suresh)

- Maker does: sugar from Vendor C arrives against PO 0407. The delivery challan says 10,000 kg; the weighbridge shows 9,850 kg (197 bags of 50 kg). Vendor batch VC-0610.
- Aikyat must: pre-fill the GRN from an OCR of the challan against the matching open PO; suggest godown KA-RM from item history; alert on over-receipt, receipt with no PO, wrong item or UOM; route to QC because sugar needs inspection.
- Answer key: GRN received 9,850 kg, status Awaiting QC, stock held in KA-QC and not available to production. PO 0407 becomes Partially Received with 150 kg open. No alert fires (this is an under-receipt of 1.5%, not an error); the shortfall feeds A1-06.
- Checker: none (variance caught at the three-way match).

**A4-03 Partial GRN** (Wed 07-Oct, Suresh)

- Maker does: Vendor A sends a 10,000 kg part-load against PO 0420 (approved 06-Oct); Divya accepts all of it.
- Answer key: PO 0420 status Partially Received at 20.0%; the 10,000 kg is available once QC accepts.
- Checker: none.

**A4-04 Over-receipt beyond tolerance** (Fri 09-Oct, 07:10, Suresh)

- Maker does: the second lorry brings 41,200 kg against the balance of PO 0420. Cumulative receipt would be 51,200 kg against 50,000 kg ordered.
- Aikyat must: accept over-receipt up to the +2% tolerance silently and alert only above it.
- Answer key: ceiling is 51,000 kg, so the GRN is for 41,000 kg (cumulative 51,000, +2.0%) and the remaining 200 kg is recorded as "excess held at gate, not received". Alert goes to Ravi to amend the PO or return the 200 kg. PO 0420 status Closed with over-receipt 1,000 kg (2.0%).
- Checker: none.

**A4-05 Receipt with no PO** (Thu 08-Oct, Suresh)

- Maker does: 25 kg of food colour arrives from a local trader with no PO.
- Answer key: alert "no PO"; the GRN saves with an exception reason and is never blocked; it links to the voucher in A1-10.
- Checker: none.

**A4-06 Hand over to QC and confirm disposition** (Tue 06-Oct and Thu 08-Oct, Suresh)

- Aikyat must: route to QC automatically when the item or vendor requires inspection; show Suresh the QC outcome to confirm.
- Answer key: 06-Oct sugar C: accepted 9,750 kg moves to KA-RM, rejected 100 kg stays in KA-QC awaiting return. 08-Oct sugar B (PO 0403, 5,000 kg received, closed): accepted 4,600 kg to KA-RM, rejected 400 kg in KA-QC. Suresh confirms each disposition on the GRN.
- Checker: Suresh confirms the QC record (QC is the maker).

**A4-07 Return rejected goods to the vendor** (Fri 09-Oct, Suresh)

- Aikyat must: pre-fill the outward document from the QC rejection record so the Accounts Executive can raise the Debit Note; require an e-way bill only above the threshold.
- Answer key: Vendor C 100 kg × ₹46 = ₹4,600; Vendor B 400 kg × ₹48 = ₹19,200. Both are below ₹50,000, so no e-way bill is requested. Teja (stub) uses the documents for the Debit Notes.
- Checker: none.

**A4-08 Inter-branch transfer, separate GSTIN** (Mon 12-Oct dispatch, Wed 14-Oct receipt)

- Maker does: Suresh dispatches 5,000 kg of maida from KA-RM to TN-ST; Gopal receives it.
- Aikyat must: suggest the transfer because Hosur has 1.07 days of cover (1,500 ÷ 1,400) and KA stays above its reorder level; treat KA and TN as distinct persons, so raise a tax invoice with IGST and the receiving branch takes the credit; require an e-way bill; hold the value in stock-in-transit until received; alert if in transit more than 3 days.
- Answer key: value at cost ₹38.80 × 5,000 = ₹1,94,000; IGST at the placeholder 5% = ₹9,700; invoice total ₹2,03,700. E-way bill needed (above ₹50,000): Part-A from the invoice, Part-B vehicle entered by Suresh before the vehicle leaves. Stock-in-transit ₹1,94,000 from 12-Oct until Gopal's receipt on 14-Oct at 14:00 (2 days, so no ageing alert). KA book stock falls from 38,500 kg to 33,500 kg, still above the proposed reorder level of 31,000 kg.
- Checker: Anand and Venkat (Compliance, stub, for the GST treatment).

**A4-09 Inter-branch transfer, same GSTIN** (Mon 12-Oct, Suresh)

- Maker does: moves 600 kg of SMP from KA-RM to KA-PK.
- Aikyat must: move quantity at cost with no tax and no sale or purchase entry; issue by FEFO.
- Answer key: batch SM-2604 (300 kg) moves first, then 300 kg of SM-2609; value at average cost ₹309.67 × 600 = ₹1,85,800; no GST, no profit-and-loss effect.
- Checker: Anand.

**A4-10 Stock adjustment and write-off** (Tue 13-Oct, Suresh)

- Maker does: adjusts laminate film by −10 kg (weighing difference, count sheet attached) and writes off 120 water-damaged cartons (photo attached).
- Aikyat must: ask for a reason and document; show the adjustment history so repeats are visible to the approver.
- Answer key: film −10 kg × ₹243 = ₹2,430, and the history shows 3 shortages at KA-PK in 60 days (12, 8 and 15 kg), flagged as a repeat. Carton write-off 120 × ₹28 = ₹3,360. Both are above ₹2,000 so both route to Anand; neither reaches the Finance Controller threshold.
- Checker: Anand.

**A4-11 Blind count of another godown** (Tue 13-Oct, Latha)

- Maker does: Latha, from KA-FG, counts SMP at KA-RM. The godown is frozen for the count. The handheld does not show book quantity (1,200 kg, after the 600 kg moved on 12-Oct). She counts 1,172 kg.
- Aikyat must: hide the book quantity, force a recount when variance exceeds 1%, and keep the custodian (Suresh) out of the count.
- Answer key: variance −28 kg = −2.33%, above 1%, so a recount is forced; the recount gives 1,172 kg again. Value of the variance ₹8,671 (28 × ₹309.67). It goes to Anand; it is below the Finance Controller write-off threshold.
- Checker: Anand.

**A4-12 Job-work challan** (Wed 14-Oct dispatch, Wed 28-Oct return, Suresh)

- Maker does: sends 1,500 kg of laminate film to PrintPack Converters under WO-0034 (A2-07). The film average cost on 14-Oct is ₹245 (the PO 0421 receipt is seeded, not played).
- Aikyat must: pre-fill the challan from the Works Order; track goods lying with the job worker by challan; require an e-way bill against the challan because there is no tax invoice; alert before the return limit; feed the ITC-04 working.
- Answer key: challan value ₹3,67,500, above ₹50,000, so e-way bill Part-A is generated from the challan and Suresh adds Part-B. Return-by date 14-Oct-2027 (one year for inputs). On 28-Oct, 1,460 kg of printed film (new item PM-003) comes back and 40 kg is process loss (2.67%, within the 3% tolerance), so goods lying with the job worker become 0. Cost of PM-003 = (₹3,67,500 + ₹48,000) ÷ 1,460 kg = ₹284.59 a kg.
- Checker: Anand.

**A4-13 Expiring batches and a new item request** (Mon 05-Oct and Tue 13-Oct, Suresh)

- Aikyat must: list batches expiring in 30, 60 and 90 days with a suggested action; run a fuzzy duplicate check before a new item request goes in.
- Answer key: on 05-Oct SMP batch SM-2604 (300 kg, expires 28-Oct, 23 days) appears in the 30-day window with the suggestion "issue first (FEFO)". On 13-Oct the request "Printed laminate film" shows PM-001 Laminate film roll as the closest existing item; Suresh proceeds because the printed variant is distinct, and the request goes to Rajan (stub) who approves it as PM-003.
- Checker: Rajan (item request).

## A5. Quality Inspector (Divya, R-P05)

Divya is the sole owner of the Quality/Rejection record. She decides accepted and rejected quantity; the Stores / Inventory Officer confirms the disposition on the GRN. She cannot change the received quantity.

**A5-01 Inspect against the specification** (Tue 06-Oct)

- Maker does: inspects the sugar from Vendor C (GRN 9,850 kg, 197 bags).
- Aikyat must: suggest inspection intensity from the vendor's history, tighter for high past rejection and lighter for consistently good vendors.
- Answer key: Vendor C's rejection is 0.4%, so normal sampling applies: 3% of 197 bags = 5.91, rounded up to 6 bags. Two of the six sampled bags are wet and lumpy; Divya checks the lot, finds no more, and rejects those 2 bags. Accepted 9,750 kg, rejected 100 kg. (For the maida part-load of 10,000 kg in A4-03, Vendor A at 0.5% also gets normal sampling: 3% of 400 bags = 12 bags, all accepted.)
- Checker: Suresh confirms the disposition.

**A5-02 Record accepted and rejected quantity with a reason** (Thu 08-Oct)

- Maker does: inspects sugar from Vendor B, PO 0403, 5,000 kg, 100 bags.
- Aikyat must: apply tightened sampling for a vendor with 3% or more rejection; suggest reason codes; take photo capture on the record.
- Answer key: Vendor B's rejection is 3.1%, so sampling is tightened to 6%: 6 bags, against 3 bags on normal sampling. Three of six sampled bags are wet, so Divya extends to a full lot check and finds 8 wet bags. Rejected 400 kg (8.0%), accepted 4,600 kg; suggested reason code "water damage", photo attached.
- Checker: Suresh confirms the disposition.

**A5-03 Raise the Quality/Rejection record** (Thu 08-Oct)

- Maker does: raises the record for PO 0403.
- Aikyat must: link the record to the GRN line, vendor, PO and batch; push the rejection into the vendor scorecard automatically; keep the rejection trend per vendor and item.
- Answer key: Vendor B's six-month rejection moves from 3.10% (1,240 of 40,000 kg) to 3.64% (1,640 of 45,000 kg). That crosses the 3.5% review flag, so B is suggested for review in A3-05. Vendor C's record shows 100 of 9,850 kg (1.02%) for PO 0407. Both records feed the debit-note trigger in A4-07.
- Checker: Suresh (confirms disposition on the GRN).

## A6. Inventory Controller (Anand, R-P06)

Anand approves what Stores raises. He is never the maker of anything he approves. The costing method itself is an accounting policy owned by Rajan and approved by Usha (stubs); Anand gives operational input only.

**A6-01 Approve adjustments, transfers and count variances** (Mon 12-Oct, 09:30 and Tue 13-Oct, 16:00)

- Maker does: opens the risk-sorted queue twice.
- Aikyat must: score each item (value points = value ÷ ₹10,000 rounded down, capped at 20; repeat item +30; repeat godown or user +20) and sort by score, higher value first on a tie.
- Answer key, 12-Oct 09:30:

| Order | Item | Value | Points |
| --- | --- | --- | --- |
| 1 | Inter-branch transfer, maida 5,000 kg KA to TN (A4-08) | ₹1,94,000 | 19 |
| 2 | Intra-branch transfer, SMP 600 kg KA-RM to KA-PK (A4-09) | ₹1,85,800 | 18 |

Anand approves both. The inter-branch transfer then waits for Venkat (GST) and cannot dispatch until he approves; the SMP transfer can move now.

- Answer key, 13-Oct 16:00:

| Order | Item | Value | Points |
| --- | --- | --- | --- |
| 1 | SMP count variance −28 kg (A4-11) | ₹8,671 | 0 + repeat item 30 + repeat godown KA-RM 20 = 50 |
| 2 | Laminate film adjustment −10 kg (A4-10) | ₹2,430 | 0 + repeat item 30 + repeat godown KA-PK 20 = 50 |
| 3 | Carton write-off 120 (A4-10) | ₹3,360 | 0 |

The first two tie at 50, so the higher value (SMP) comes first. Nothing here reaches the Finance Controller threshold.

- Checker: Anand (this is the checker step); Venkat as well on the inter-branch transfer.

**A6-02 Negative-stock override** (Fri 09-Oct, 06:40)

- Maker does: at 06:30 the night shift asks Suresh to issue 6,200 kg of maida. Book stock is 3,700 kg. The policy is Warn, so Suresh transacts with an override request.
- Aikyat must: show why stock would go negative (inward not yet posted, wrong item, or genuine shortage) and age the open ones.
- Answer key: reason shown "inward not yet posted: lorry of 41,200 kg at the gate since 05:50, GRN pending". Stock would be −2,500 kg. Anand approves at 06:40 and the override is logged. The GRN posts at 07:10 (A4-04, 41,000 kg), stock returns to 38,500 kg, and the Negative Stock report shows one event aged 40 minutes with reason "inward not yet posted".
- Checker: Anand (this is the checker step).

**A6-03 Approve reorder levels and min-max** (Tue 13-Oct)

- Maker does: opens Ravi's proposals from A1-09.
- Aikyat must: show its own suggestion from the consumption trend and the actual vendor lead time beside each proposal.
- Answer key: Aikyat's independent figures equal the proposals: maida reorder 31,000 kg, max 68,200 kg; laminate film 3,840 kg and 5,280 kg; SMP 2,400 kg and 3,300 kg. Anand approves all three; the Item Master updates and the next morning's suggested-PO list recalculates against the new levels.
- Checker: Anand (this is the checker step).

**A6-04 Operational input to a costing-method review** (Wed 14-Oct)

- Maker does: Rajan (stub) asks how batch costing would behave against the current moving average for SMP.
- Aikyat must: show how batch tracking, FEFO and godown practice would behave under the proposed method.
- Answer key: SMP holds batch SM-2604 300 kg at ₹298 and SM-2609 1,500 kg at ₹312. Issuing 500 kg by FEFO costs ₹1,54,833.33 at the moving average ₹309.67, or ₹1,51,800.00 on batch cost (300 × ₹298 + 200 × ₹312). The difference is ₹3,033.33 per 500 kg, lower on batch cost. Anand records that SMP is already batch-tracked with FEFO on, and that two godowns hold it. The method decision stays with Rajan and Usha.
- Checker: Usha (Finance Controller, stub) approves the method.

**A6-05 Plan physical counts** (Thu 15-Oct)

- Maker does: opens the cycle-count plan.
- Aikyat must: weight coverage to risk, not to a single all-at-once count, and keep every counter independent of the godown custodian.
- Answer key: class A (repeat variance in 90 days): SMP and laminate film, weekly, 4 counts each. Class B (high consumption value): maida and sugar, fortnightly, 2 counts each. Class C: vanilla and cartons, monthly, 1 count each. Total 14 counts in the next 30 days, each blind, none assigned to the custodian of that godown.
- Checker: none.

## Purchase side answer key (state at 28-Oct)

If Part A has been played in full, these are the end-state values. Use them as assertions.

### PO status

| PO | Vendor and item | Status | Received | Note |
| --- | --- | --- | --- | --- |
| 0398 | D, laminate film 2,720 kg | Open | 0 | Still late and still excluded from supply |
| 0403 | B, sugar 5,000 kg | Closed | 5,000 (accepted 4,600, rejected 400) | 13 days late |
| 0407 | C, sugar 10,000 kg | Partially Received | 9,850 (accepted 9,750, rejected 100) | 150 kg open; short-close suggestion appears 30 days after 06-Oct |
| 0411 | F, vanilla 40 L | Open | 0 |  |
| 0412 | G, SMP | Closed (short-closed) | 4,200 of 5,000 | ₹2,48,000 commitment released |
| 0419 | E, cartons 10,000 | Open | 0 | At risk |
| 0420 | A, maida 50,000 kg | Closed | 51,000 (+2.0%) | 200 kg excess held at gate, never received |
| 0421 | D, film, amended to 3,900 kg, ₹9,55,500 | Approved | seeded, not played |  |
| 0422 | D, film | Cancelled |  | Consolidated into 0421 |
| 0423 | G, SMP 1,600 kg, ₹5,08,800 | Approved | 0 |  |

The duplicate carton draft in A1-04 consumed no PO number.

### Stock movements (excluding production use)

| Item | Movements | Result |
| --- | --- | --- |
| Maida | +10,000 (07-Oct), +41,000 (09-Oct), −5,000 transfer to Hosur | KA 33,500 kg; TN-ST 6,500 kg after receipt on 14-Oct |
| Sugar | +9,750 (C), +4,600 (B); 100 kg and 400 kg returned from KA-QC on 09-Oct | KA-QC back to nil |
| SMP | 600 kg moved KA-RM to KA-PK; count adjustment −28 | 1,772 kg in total: KA-RM 1,172, KA-PK 600 |
| Laminate film | −10 adjustment; 1,500 out to job work; 1,460 of PM-003 back, 40 process loss | Lying with job worker 0 |
| Cartons | −120 write-off |  |
| Food colour | +25 kg with no PO |  |

### Hand-offs the next roles must find waiting

| To | What is waiting |
| --- | --- |
| Rajan (Accounts Manager) | Sugar C voucher with variance ₹17,900; maida voucher for 51,000 kg, which is 2.0% over the PO, inside the 2% GRN tolerance but above the 0.5% match tolerance, so it will route; September bill of WO-0021 exceeding the confirmed milestone by ₹25,000; one OCR field to confirm |
| Teja (Accounts Executive) | Debit Notes: 100 kg from Vendor C (₹4,600 plus GST ₹230) and 400 kg from Vendor B (₹19,200 plus GST ₹960); the no-PO voucher for ₹8,500 |
| Venkat (Compliance Officer) | Inter-branch transfer GST approval (IGST ₹9,700); contractor PF/ESI evidence for August; ITC-04 working with 1,500 kg out and 1,460 kg back |
| Sunil (Payables Executive) | Hold on Vendor B's invoice for the ₹20,160 in dispute until the Debit Note exists |

### What differs between Run 1 (Perpetual) and Run 2 (Periodic)

| Event | Perpetual | Periodic |
| --- | --- | --- |
| GRN and purchase voucher | Stock value rises at receipt | Quantity only; value goes to the Purchases ledger on the voucher |
| Issue to production | Value leaves stock at the moving average | Quantity only |
| Inter-branch transfer | Stock value moves between branches | Stock Transfer Outward and Inward ledgers, nil on consolidation |
| Adjustment and write-off | Profit and loss at once | Through the period-end closing stock |

Every quantity, status and approval above is identical in both runs.

## B1. Sales Executive (Arun, R-S01)

Arun prepares Proformas, raises Sales Orders and requests commercial adjustments. He does not issue invoices, Credit Notes or Debit Notes (the Billing Executive does) and he never releases a credit hold. Placeholder exchange rate for exports: ₹88.00 per USD.

**B1-01 Proforma Invoice** (Mon 05-Oct)

- Maker does: prepares PF-0031 for the new customer C-03: Glucose, 1,200 cartons at USD 8.90, validity 15 days.
- Aikyat must: pull price from the Price List or Contract, show the customer's last 3 rates and exposure, track validity, and flag Proformas near expiry with no conversion.
- Answer key: no price list or history exists for C-03, so the screen says so and accepts the manual USD price. Total USD 10,680 (about ₹9,39,840 at the placeholder rate). Validity ends 20-Oct. The screen also flags PF-0027 (C-05), which expired on 04-Oct without converting. A Proforma posts nothing and carries no IRN; on confirmation it converts to a Sales Order (SO-3, created 06-Oct), never straight to an invoice.
- Checker: none (non-accounting).

**B1-02 Raise a Sales Order** (Mon 05-Oct)

- Maker does: raises SO-1 for C-01 (KA, same state as the plant): Glucose 600 cartons, Cream 300 cartons.
- Aikyat must: default price and payment terms from the Price List and customer finance fields; show stock by godown and a realistic dispatch date; run the credit check in the background and say why approval is needed.
- Answer key: Glucose contract rate ₹700 lapsed on 30-Sep, so list ₹720 applies with a warning; Cream uses the valid contract rate ₹975. Value at those rates: ₹4,32,000 + ₹2,92,500 = ₹7,24,500, GST 5% ₹36,225, total ₹7,60,725. Exposure: open invoices ₹4,00,000 + open SOs ₹0 + dispatched-not-billed ₹0 = ₹4,00,000; with this order ₹11,60,725, within the ₹15,00,000 limit, so credit passes. Stock available: Glucose 2,300 cartons, Cream 1,500. Suggested dispatch date 07-Oct. Approval is needed because the value is above ₹3,00,000.
- Checker: Nisha (Sales Manager).

**B1-03 Request a price override** (Mon 05-Oct)

- Maker does: asks for Glucose at ₹700 on SO-1, the lapsed contract rate.
- Aikyat must: show margin impact and the customer's historical discount, and route to the Sales Manager with the reason attached; write the Price Override Log.
- Answer key: ₹700 is 2.78% below list. Margin on the line is 20.0% at ₹700 against 22.2% at ₹720 (cost ₹560). Revenue effect −₹12,000 (600 × ₹20). C-01's average discount is 2.5%, so this is above its norm. If approved, SO-1 becomes ₹4,20,000 + ₹2,92,500 = ₹7,12,500, GST ₹35,625, total ₹7,48,125. The log row holds SO line, list rate, override rate, margin impact, salesperson, approver pending.
- Checker: Nisha.

**B1-04 Duplicate check and a below-cost line** (Mon 05-Oct)

- Maker does: raises SO-4 for C-05: Glucose 100 cartons at ₹540. A bulk-imported SO-IMP-0007 for C-05 (Glucose 96 cartons) exists from 03-Oct.
- Aikyat must: flag same customer + same item + similar quantity in a short window, including bulk-imported orders; flag a rate below cost.
- Answer key: duplicate flag naming SO-IMP-0007 (quantity within 5%, 4.2% apart, imported 2 days ago); Arun records "not a duplicate, second customer PO" and the flag stays visible to the approver. Below-cost flag: ₹540 against cost ₹560 is a margin of −3.7%. Both reach Nisha; neither blocks Arun.
- Checker: Nisha.

**B1-05 An order that fails the credit gate** (Mon 05-Oct)

- Maker does: raises SO-2 for C-02 (Tamil Nadu customer, billed from KA): Cream 400 cartons at ₹990.
- Aikyat must: price at list, derive IGST from the branch and customer state, run the credit check, and tell Arun why the order is held.
- Answer key: ₹3,96,000 + IGST ₹19,800 = ₹4,15,800. Exposure: open invoices ₹8,20,000 (₹2,10,000 is 38 days overdue) + this order ₹4,15,800 = ₹12,35,800, which is ₹2,35,800 over the ₹10,00,000 limit, with 1 dishonoured cheque on record. Status Awaiting credit approval; Arun sees the reason "over limit, overdue, bounced cheque" and the order goes to Farid.
- Checker: Farid (Credit Controller).

**B1-06 A service Sales Order (notional DC)** (Mon 05-Oct)

- Maker does: raises SO-6 for C-04: co-packing, 15,000 packs at ₹6.
- Aikyat must: skip the stock check, set the DC type to notional, match on value, and run credit control as for goods.
- Answer key: ₹90,000 + GST 18% ₹16,200 = ₹1,06,200. Exposure counts the unbilled supply N-1 (₹72,000 + GST ₹12,960 = ₹84,960): ₹84,960 + ₹1,06,200 = ₹1,91,160, within the ₹3,00,000 limit. Below the ₹3,00,000 approval value, so no Sales Manager approval. The ₹59,000 advance received on 03-Oct appears as an on-account receipt flagged for GST on advance (B4-10).
- Checker: none.

**B1-07 Follow up open orders** (Thu 08-Oct)

- Aikyat must: list SO lines pending dispatch by age and value with stock availability, so Arun can give a real date.
- Answer key: SO-2, 3 days old, ₹3,96,000, Cream stock available 1,200, status credit hold, so no date can be promised. SO-3 (export), 2 days, ₹9,39,840, Glucose available 1,700, dispatch date 13-Oct. SO-6, 3 days, ₹90,000, notional DC.
- Checker: none.

**B1-08 Request commercial adjustments** (Mon 05-Oct; return on Wed 21-Oct)

- Maker does: raises five requests: (a) rebate ₹50,000 for C-01; (b) goodwill discount ₹10,000 for C-02; (c) goodwill discount ₹5,000 for C-05; (d) price correction of ₹15 a carton on 200 cartons of Glucose against C-01's invoice dated 20-Mar-2026; (e) a return of 40 cartons from C-01's 07-Oct invoice.
- Aikyat must: pre-fill from the original invoice; ask whether a pre-agreed scheme exists; hold a return request until Stores records the goods back in.
- Answer key: (a) finds scheme SCH-26-Q2: Q2 purchases ₹25,00,000 are at or above ₹20,00,000, so rebate 2% = ₹50,000, scheme reference attached, flag set to reduce GST. (b) and (c) find no scheme, flag set to no GST reduction. (d) ₹3,000 plus GST ₹150 = ₹3,150; the invoice is from before the 30-Sep period end, so a cut-off flag is attached. (e) on 05-Oct the return option is disabled with "waiting for return receipt"; after Latha records the return on 20-Oct (D-05) it opens on 21-Oct pre-filled with 40 × ₹700 = ₹28,000 plus GST ₹1,400 = ₹29,400.
- Checker: Nisha; Pooja then issues the note.

## B2. Sales Manager (Nisha, R-S02)

Nisha approves commercial terms and the reason and value of every adjustment. She may request a credit-hold release but can never release one. Her work is checked by the Finance Controller (hold requests) and CEO / Management (scorecard, view-only).

**B2-01 Approve Sales Order commercial terms** (Tue 06-Oct, 10:00)

- Maker does: opens the approval queue: SO-1, SO-2, SO-3 (created 06-Oct when C-03 confirmed PF-0031) and SO-4.
- Aikyat must: sort by risk (1 point per 0.5% below list, capped at 20; below cost +50; new customer +30; quantity above 3 times the customer's average +20) and show margin on every line.
- Answer key:

| Order | SO | Points | Reasons and margin |
| --- | --- | --- | --- |
| 1 | SO-4, C-05 | 70 | 25.0% below list, capped at 20, plus below cost 50; margin −3.7% |
| 2 | SO-3, C-03 export | 30 | New customer 30; margin 28.5% (revenue ₹9,39,840, cost 1,200 × ₹560 = ₹6,72,000) |
| 3 | SO-1, C-01 | 5 | Glucose 2.78% below list (floor of 2.78 ÷ 0.5); margin on the order 20.8% (cost ₹5,64,000 on ₹7,12,500) |
| 4 | SO-2, C-02 | 0 | Value above threshold, but credit approval is pending |

Nisha rejects SO-4 at ₹540 and shows the floor price: cost ₹560 ÷ 0.82 = ₹682.93, so ₹683. She approves SO-3. She approves SO-1 with the ₹700 override because the line margin of 20.0% is above the 18% floor and the contract lapsed only 5 days ago, and asks for the price list to be fixed (B2-06). SO-2 stays held.

- Checker: Nisha (this is the checker step).

**B2-02 Approve commercial adjustment requests** (Tue 06-Oct; return on Wed 21-Oct)

- Maker does: opens the requests from B1-08.
- Aikyat must: show the customer's credit-note history, the margin on the original invoice, and flag an adjustment that lands just after period end against an invoice from before it.
- Answer key:

| Request | Shown to Nisha | Decision |
| --- | --- | --- |
| (a) C-01 rebate ₹50,000, scheme SCH-26-Q2 | 1 credit note in 12 months; scheme valid; GST reduction flag set | Approve |
| (b) C-02 goodwill ₹10,000, no scheme | 3 credit notes in 6 months; no scheme | Reject, returned to Arun with the reason |
| (c) C-05 goodwill ₹5,000, no scheme | No scheme, so no GST reduction | Approve |
| (d) C-01 price correction ₹3,150 on the 20-Mar-2026 invoice | Cut-off flag: raised 5 days after the 30-Sep period end against a pre-period invoice | Approve with a note |
| (e) C-01 return, 40 cartons, ₹29,400 (21-Oct) | Return receipt from D-05 attached; original margin 20.0%; 1 credit note in 12 months | Approve |

Only approved requests appear in Pooja's queue (B4-06, B4-07).

- Checker: Nisha (this is the checker step).

**B2-03 Review open SO ageing and match exceptions** (Mon 12-Oct, 09:00)

- Aikyat must: group pending orders by reason so the bottleneck is visible.
- Answer key: credit hold 1 (SO-2, 7 days old, ₹3,96,000); awaiting customer 1 (SO-4, waiting on the ₹683 floor price); awaiting dispatch 1 (SO-3, dispatch 13-Oct); stock short 0. Open three-way-match exceptions 0.
- Checker: none.

**B2-04 Review the discount and override pattern** (Mon 12-Oct)

- Aikyat must: report overrides by salesperson, customer and item and flag a salesperson well above the team.
- Answer key: Arun has 3 overrides in his last 12 SOs (25%) against a team rate of 8%; at more than twice the team rate he is flagged. The report lists SO-1 and SO-4 among them.
- Checker: none.

**B2-05 Own the Customer Scorecard** (Mon 12-Oct)

- Aikyat must: read payment metrics from AR/AP and compute only return and dispute frequency in Sales; suggest customers for credit-limit review.
- Answer key: C-02 on-time payment 55%, DSO 62 against terms of 45, 1 dishonour, 3 credit notes in 6 months: suggested for limit review. C-06 DSO 55 against terms of 30 and rising: suggested for review.
- Checker: CEO / Management (view-only).

**B2-06 Maintain the Price List and Contract Rates** (Mon 12-Oct)

- Aikyat must: flag customers still billed on an expired contract rate and items whose selling price has fallen behind cost.
- Answer key: C-01 is flagged for the Glucose contract rate that expired 30-Sep. On 12-Oct the Cream cost rises to ₹820, so list ₹990 gives a margin of 17.2%, below the 18% floor, and the item is flagged. The price that meets the floor is ₹820 ÷ 0.82 = ₹1,000. Glucose at 22.2% is not flagged.
- Checker: none.

**B2-07 Request a credit-hold release** (Fri 09-Oct; alternative to B3-03, run one path per pass)

- Maker does: after C-02 pays its ₹2,10,000 overdue on 09-Oct, Nisha asks for SO-2 to be released.
- Aikyat must: show the commercial reason beside the Credit Controller's exposure summary and send it to the Finance Controller; offer Nisha a Request button and no Release button.
- Answer key: exposure after payment = ₹8,20,000 − ₹2,10,000 + ₹4,15,800 = ₹10,25,800, which is ₹25,800 over the limit; nothing is overdue now. Usha decides on 12-Oct, 10:00. Nisha cannot release the hold herself (Part C).
- Checker: Usha (Finance Controller, stub).

## B3. Credit Controller (Farid, R-S03)

Farid is an independent gate: sales targets cannot push a risky order through him. He places holds and requests their release; only Usha (Finance Controller) can release one. His credit check has no second approver.

**B3-01 Review Sales Orders routed for credit approval** (Mon 05-Oct, 16:00)

- Maker does: opens the credit queue.
- Aikyat must: show exposure (open invoices + open SOs + dispatched-not-billed), overdue amount, days-past-due trend and bounced receipts in one view.
- Answer key: the queue holds only SO-2 for C-02. Open invoices ₹8,20,000, open SOs ₹0, dispatched-not-billed ₹0, this order ₹4,15,800, so exposure ₹12,35,800 against a ₹10,00,000 limit (₹2,35,800 over). Overdue ₹2,10,000; oldest overdue item aged 12, 25 and 38 days over the last three monthly snapshots; 1 bounced receipt. SO-1 for C-01 passed automatically with ₹3,39,275 of headroom and never reached him.
- Checker: none (independent gate).

**B3-02 Place credit holds** (Tue 06-Oct)

- Maker does: places a hold on SO-2 and reviews Aikyat's suggested hold for C-06.
- Aikyat must: suggest a hold before the limit is crossed when payment behaviour is deteriorating (DSO rising three months running with 2 or more broken promises, or 80% or more of the limit used).
- Answer key: SO-2 hold with reason "over limit by ₹2,35,800, ₹2,10,000 overdue, 1 bounced cheque". C-06 is suggested and held on the same day: exposure ₹4,10,000 is 82% of the ₹5,00,000 limit, DSO 41, 48, 55, 2 broken promises. The Credit Hold Log has two rows with placed-by Farid and a reason; both Sales roles see the hold flag and neither has a release action.
- Checker: none.

**B3-03 Request a hold release** (Fri 09-Oct; alternative to B2-07, run one path per pass)

- Maker does: C-02 pays its ₹2,10,000 overdue on 09-Oct; Farid requests release of SO-2.
- Aikyat must: send the request to the Finance Controller only, with the exposure summary; record exposure at release in the log.
- Answer key: exposure after payment ₹10,25,800, ₹25,800 over the limit, nothing overdue. Usha approves on 12-Oct at 10:00; the log row shows released-by Usha and exposure at release ₹10,25,800. SO-2 then moves to Nisha for commercial approval (list price, no override) and is approved the same day, so it can enter the 13-Oct dispatch plan.
- Checker: Usha (Finance Controller, stub).

**B3-04 Periodic credit-limit review** (Mon 12-Oct)

- Aikyat must: suggest a limit = average monthly billing × (credit days ÷ 30) × band factor (A 1.2, B 1.0), × 0.8 if any dishonour in 90 days or any amount over 30 days overdue; list limits not reviewed in 12 months.
- Answer key:

| Customer | Calculation | Suggested limit | Current |
| --- | --- | --- | --- |
| C-01 | ₹15,00,000 × 1 × 1.2 | ₹18,00,000 | ₹15,00,000 |
| C-02 | ₹8,00,000 × 1.5 × 1.0 × 0.8 (dishonour 62 days ago, overdue over 30 days) | ₹9,60,000 | ₹10,00,000 |

C-05 appears on the not-reviewed list (last review 14-Aug-2025, 424 days ago).

- Checker: none.

## Dispatch hand-off (Stores / Inventory Officer, Latha)

The Billing Executive cannot bill what Stores has not recorded. These five steps belong to the Stores role (its Sales Module work list) and sit between the Sales Order and the invoice. Latha works at KA-FG.

**D-01 View the dispatch plan** (Wed 07-Oct, 07:30)

- Aikyat must: build a "due to dispatch today" list by godown from confirmed SOs, with stock availability and credit-hold status so nothing on hold is picked.
- Answer key: SO-1 is due (approved 06-Oct): Glucose 600 cartons, Cream 300 cartons; stock Glucose 2,300 and Cream 1,500. SO-2 appears greyed with "credit hold, not pickable". SO-3 is not due until 13-Oct.
- Checker: none.

**D-02 Record the Delivery Challan** (Wed 07-Oct, 10:00)

- Maker does: records DC-1 against SO-1.
- Aikyat must: pre-fill from the SO lines; suggest batches by FEFO; warn on over-dispatch beyond tolerance, wrong item or UOM, or a batch near expiry; reduce stock immediately under Perpetual and leave it to period-end under Periodic.
- Answer key: Glucose 600 = batch G-2604 300 (warning "expires in 5 days") + batch G-2608 300; Cream 300 from C-2607. Tolerance tests on the Cream line (300 ordered):

| DC quantity | Variance | Expected |
| --- | --- | --- |
| 300 | 0% | Posts |
| 303 | +1.0% | Posts |
| 306 | +2.0% | Posts (at the limit) |
| 312 | +4.0% | Status PendingApproval, routed to Rajan as a match variance |
| An item with no SO line | none | Hard reject, no row created |

- Checker: none (variance caught at the three-way match).

**D-03 E-way bill Part-B and release** (Wed 07-Oct, 10:30 to 11:45)

- Aikyat must: block release of the DC while the IRN is pending; remind Latha when Part-B is empty before the vehicle leaves.
- Answer key: DC-1 shows "release blocked, IRN pending" until Rajan approves the invoice at 11:00 (B4-01) and the IRN arrives at 11:05. Invoice value ₹7,48,125 is above ₹50,000 with physical movement, so e-way bill Part-A comes from the invoice. Latha enters the vehicle in Part-B at 11:20; if she had left it empty, a reminder would fire at gate-out. The vehicle leaves at 11:45.
- Checker: Venkat (monitors expiry and missing e-way bills).

**D-04 E-way bill without a tax invoice** (Wed 14-Oct)

- Maker does: sends goods on approval to C-05 under two challans: 20 cartons of Glucose at ₹720 (₹14,400) and 90 cartons at ₹720 (₹64,800).
- Aikyat must: pre-fill Part-A from the challan, and flag a movement above the threshold that has no e-way bill.
- Answer key: ₹14,400 is below ₹50,000, so no e-way bill and no flag. ₹64,800 is above, so Part-A is generated from the challan and Latha adds Part-B; without it the movement is flagged.
- Checker: Venkat (monitors).

**D-05 Record goods returned by a customer** (Tue 20-Oct)

- Maker does: C-01 returns 40 cartons of Glucose damaged in transit.
- Aikyat must: match the return to the original DC, invoice and batch; hold the goods in quarantine; release the linked credit note for approval.
- Answer key: the Sales Return Receipt matches DC-1 and batch G-2608 (the damaged cartons came from that batch, which shipped 300), quantity 40, condition damaged, stored in KA-QC. The credit-note request in B1-08(e) now opens, pre-filled with ₹29,400. A return larger than the quantity dispatched on that batch is rejected (Part C).
- Checker: none (releases the return credit note for approval).

## B4. Billing Executive (Pooja, R-B01)

Pooja turns what was supplied into a valid document. She never allocates receipts, requests write-offs or edits customer finance fields, and she is never combined with Collections or a Sales role. Invoice numbers run in a series per GSTIN that resets each financial year (KA/INV/26-27/nnnn). Posting an invoice debits the customer, credits sales and credits output tax, atomically.

**B4-01 Generate a Sales Invoice from a DC** (Wed 07-Oct, 10:30)

- Maker does: pulls DC-1 (C-01) into an invoice.
- Aikyat must: pull uninvoiced DC lines; check HSN, GST rate and place of supply against the customer's GSTIN and ship-to state; apply billing instructions (PO reference, format, annexures); flag duplicates; check the e-invoice fields before approval.
- Answer key: Glucose 600 × ₹700 = ₹4,20,000 and Cream 300 × ₹975 = ₹2,92,500; taxable ₹7,12,500; CGST ₹17,812.50 and SGST ₹17,812.50 (intra-state); total ₹7,48,125.00. The 6-digit HSN placeholder is present and C-01's billing instruction (customer PO reference) is applied. The e-invoice pre-check passes. Rajan approves at 11:00, which triggers the IRN and e-way bill Part-A (D-03). On posting: Dr Customer ₹7,48,125.00, Cr Sales ₹7,12,500.00, Cr Output CGST ₹17,812.50, Cr Output SGST ₹17,812.50.
- Checker: Rajan (approval triggers IRN and e-way bill Part-A).

**B4-02 Confirm auto-generated invoices (integrated mode replay)** (Tue 13-Oct)

- Maker does: on a copy of the company switched to integrated mode, replays DC-1, the 13-Oct DC for SO-2 (Cream 400 from batch C-2607) and the 312-carton test DC from D-02.
- Aikyat must: draft invoices on dispatch and bring only exceptions to Pooja's queue, each with its reason.
- Answer key: three DCs, two queue rows. DC-1 is clean and does not appear. The SO-2 DC appears with "special-format customer: annexure and PO reference required". The 312-carton DC appears with "match variance +4.0%".
- Checker: Rajan.

**B4-03 E-invoice fields and an IRN failure** (Tue 13-Oct, SO-2 invoice for C-02)

- Maker does: prepares the invoice for SO-2's dispatch (Cream 400 × ₹990 = ₹3,96,000 + IGST ₹19,800 = ₹4,15,800).
- Aikyat must: check e-invoice fields before approval so the IRN does not fail; keep Pooja out of the customer master; route failures to the Compliance exception queue; refuse to confirm an invoice without a successful IRN or a documented offline fallback.
- Answer key: pre-check flags "ship-to pincode missing". Pooja cannot edit it (identity data lives in Business Core), so she raises a request there under its own maker-checker, and the invoice stays Draft. If the invoice is sent for approval anyway, the IRN fails; the IRN Exception Queue then holds a row with invoice, GSTN error "ship-to pincode missing", retry count 3 and offline fallback flag off, and the invoice cannot reach Confirmed.
- Checker: Venkat (exception queue).

**B4-04 Cancel an IRN or e-way bill** (Mon 05-Oct and Tue 06-Oct)

- Maker does: the service invoice for N-1 (B4-05) went out at 11:00 with IRN at 11:05 and carries a wrong service description.
- Aikyat must: allow cancellation only within 24 hours of IRN generation and, for an e-way bill, before the goods move; show the time left; otherwise offer only the Credit Note path.
- Answer key:

| Case | Noticed | Expected |
| --- | --- | --- |
| N-1 service invoice, no e-way bill | 05-Oct, 16:30 | Allowed, 18 h 35 min left; Pooja requests, Rajan approves; IRN cancelled; new invoice issued; the cancelled number stays in the series |
| Same invoice | 06-Oct, 12:00 | Window closed at 11:05; only the Credit Note path is offered |
| DC-0618 goods invoice (goods left on 03-Oct) | 05-Oct, 17:00 | Cancellation not offered because the e-way bill cannot be cancelled after the goods move and cancelling the IRN also cancels the e-way bill; Credit Note path only (open point 3) |

- Checker: Rajan.

**B4-05 Keep dispatched-not-billed at zero** (Mon 05-Oct, 09:30)

- Maker does: opens the unbilled list. DC-0618 and DC-0619 were released on 03-Oct under the documented offline fallback during an IRN portal outage; N-1 is a notional DC for a service.
- Aikyat must: list unbilled DC lines oldest and largest first; age service supplies against the 30-day limit.
- Answer key:

| Order | Document | Customer | Value before GST | Age | Note |
| --- | --- | --- | --- | --- | --- |
| 1 | N-1 (service, 15-Sep) | C-04 | ₹72,000 | 20 days | 10 days left; invoice by 15-Oct |
| 2 | DC-0619 (03-Oct) | C-05 | ₹99,000 | 2 days | Largest of the two same-day DCs |
| 3 | DC-0618 (03-Oct) | C-05 | ₹72,000 | 2 days |  |

Total unbilled ₹2,43,000. Pooja bills all three: N-1 ₹72,000 + GST 18% ₹12,960 = ₹84,960; DC-0619 ₹99,000 + GST 5% ₹4,950 = ₹1,03,950; DC-0618 ₹72,000 + GST ₹3,600 = ₹75,600. After approval the list is empty.

- Checker: Rajan (DC-wise unbilled check).

**B4-06 Credit Note for a return** (Wed 21-Oct)

- Maker does: opens the approved return request from B2-02(e).
- Aikyat must: show only Sales-Manager-approved adjustments; pre-fill from the original invoice; wait for the Stores return record; set the 15(3)(b) flag from the scheme reference.
- Answer key: 40 × ₹700 = ₹28,000, CGST ₹700, SGST ₹700, total ₹29,400, return receipt from D-05 attached, 15(3)(b) flag No (a return is not a discount). The invoice is dated 07-Oct-2026, so its time limit is 30-Nov-2027 and no warning shows. Rajan always approves; Usha is not needed because the note is below ₹1,00,000.
- Checker: Rajan.

**B4-07 Discount and correction notes, and the time-limit warning** (Thu 08-Oct)

- Maker does: opens the three approved requests from B2-02(a), (c) and (d).
- Aikyat must: reduce GST only where a pre-agreed scheme exists; warn as the 30 November limit approaches.
- Answer key:

| Note | Customer | Value | GST | Checkers |
| --- | --- | --- | --- | --- |
| Rebate under SCH-26-Q2, flag Yes | C-01 | ₹50,000 + CGST ₹1,250 + SGST ₹1,250 = ₹52,500 | Reduced | Rajan and Venkat |
| Goodwill, no scheme, flag No | C-05 | ₹5,000 | Not reduced | Rajan |
| Price correction on the 20-Mar-2026 invoice | C-01 | ₹3,000 + GST ₹150 = ₹3,150 | Reduced | Rajan |

The correction note shows "credit note limit 30-Nov-2026, 53 days left" (warning appears within 60 days). The C-02 goodwill request, rejected in B2-02(b), never appears.

- Checker: as shown.

**B4-08 Debit Note** (Mon 12-Oct)

- Maker does: after Arun's request and Nisha's approval the same day, issues a Debit Note for late freight of ₹6,000 on C-05's invoice for DC-0618.
- Aikyat must: raise the note only against an approved adjustment; post an incremental Dr Customer, Cr Sales, Cr Output tax rather than a reversal.
- Answer key: ₹6,000 + GST 5% (placeholder) ₹300 = ₹6,300; the invoice value moves from ₹75,600 to ₹81,900. Rajan always approves.
- Checker: Rajan.

**B4-09 Export invoice** (Tue 13-Oct)

- Maker does: bills SO-3 after dispatch of 1,200 cartons of Glucose from batch G-2608 (500 left).
- Aikyat must: check a valid LUT for the GSTIN on the invoice date; capture currency and rate; remind for the Shipping Bill reference until it is entered.
- Answer key: USD 10,680 at ₹88.00 = ₹9,39,840, zero-rated (IGST nil) under LUT, which is valid to 31-Mar-2027. An invoice dated after that would warn "no valid LUT". A reminder shows until the Shipping Bill number and date are on the invoice. E-way bill Part-A is generated for the movement to the port.
- Checker: Venkat (LUT validity).

**B4-10 GST Receipt and Refund Vouchers on an advance** (Tue 06-Oct; refund Thu 15-Oct)

- Maker does: Teja flagged C-04's ₹59,000 advance of 03-Oct for GST on advance. Pooja issues the Receipt Voucher. On 15-Oct SO-6 is cancelled before any supply.
- Aikyat must: pick up flagged advances; prompt for a Refund Voucher on cancellation.
- Answer key: Receipt Voucher ₹59,000 = ₹50,000 + CGST ₹4,500 + SGST ₹4,500. On 15-Oct a prompt offers the Refund Voucher for ₹59,000 with GST ₹9,000 reversed.
- Checker: Venkat (where GST on advance applies).

**B4-11 Send invoices and track acknowledgement** (Thu 08-Oct)

- Aikyat must: send by the channel in the customer's billing instructions, track portal acknowledgement, and bring IMS rejections back to Billing.
- Answer key: C-01 by e-mail and customer portal; C-02 by portal upload only, with annexure. On 08-Oct C-02 rejects its 29-Sep invoice in IMS with reason "rate"; a "customer rejected your invoice" flag lands in Pooja's queue. The IRN window closed long ago, so only the Credit Note path remains.
- Checker: none.

**B4-12 Resolve invoice queries** (Fri 09-Oct)

- Aikyat must: classify each query so invoice errors stay with Billing and payment disputes go to Collections.
- Answer key: C-02 "your rate is wrong" is an invoice error and stays with Pooja (corrected by a note). C-05 "we never received DC-0619" is a payment dispute and routes to Collections (R-S05, stub), with the invoice attached.
- Checker: none.

**B4-13 Month-end dispatched-not-billed accrual** (Fri 30-Oct)

- Maker does: reviews the list on the last day. DC-0731 for C-01 (Glucose 100 cartons at ₹720) was dispatched on 30-Oct and not yet billed.
- Answer key: accrual ₹72,000 before GST (no GST is accrued), reversed on 01-Nov when the invoice posts.
- Checker: Rajan (approves the accrual).

## Sales side answer key (state at 31-Oct)

If Part B and the dispatch hand-off have been played in full, these are the end-state values. Collections are not played, so no receipts are applied.

### Orders and documents

| Document | Final state |
| --- | --- |
| SO-1 (C-01) | Closed. DC-1 and one invoice of ₹7,48,125 |
| SO-2 (C-02) | Held 06-Oct, released 12-Oct, dispatched 13-Oct (Cream 400), invoiced ₹4,15,800 after the pincode fix |
| SO-3 (C-03 export) | Invoiced USD 10,680 = ₹9,39,840, zero-rated; Shipping Bill reminder still open |
| SO-4 (C-05) | Awaiting customer; override at ₹540 rejected; floor price ₹683 |
| SO-6 (C-04 service) | Cancelled 15-Oct; ₹59,000 advance refunded by Refund Voucher |
| Invoices raised on 05-Oct | N-1 ₹84,960 (cancelled and reissued, one number kept as cancelled), DC-0619 ₹1,03,950, DC-0618 ₹75,600 |
| Credit Notes issued | Return ₹29,400; rebate ₹52,500; C-05 goodwill ₹5,000; price correction ₹3,150. None for C-02 (rejected) |
| Debit Note issued | ₹6,300 (C-05 invoice moves from ₹75,600 to ₹81,900) |

### Stock (Perpetual, KA-FG unless stated)

| Item | Result |
| --- | --- |
| Glucose | G-2604 nil (300 sold on DC-1); G-2608 390 (2,000 − 300 − 1,200 export − 110 on approval); 40 returned cartons held in KA-QC; 110 cartons at C-05 on approval, still owned |
| Cream | C-2607 800 (1,500 − 300 − 400) |

### Control totals for the run (before GST unless stated)

| Check | Value |
| --- | --- |
| Invoiced sales | ₹22,91,340 (₹7,12,500 + ₹99,000 + ₹72,000 + ₹3,96,000 + ₹9,39,840 + ₹72,000) plus the Debit Note ₹6,000 = ₹22,97,340 |
| Credit Notes | ₹86,000 (₹28,000 + ₹50,000 + ₹5,000 + ₹3,000) |
| Net sales | ₹22,11,340 |
| Net output GST | CGST ₹26,692.50 + SGST ₹26,692.50 + IGST ₹19,800 = ₹73,185 |
| C-01 open balance with no receipts | ₹10,63,075 (₹4,00,000 + ₹7,48,125 − ₹85,050 of Credit Notes) |
| Dispatched-not-billed | Nil after 05-Oct; month-end accrual ₹72,000 (DC-0731), reversed 01-Nov |

### Holds, queues and logs

| Item | Expected |
| --- | --- |
| Credit Hold Log | SO-2: placed by Farid 06-Oct, released by Usha 12-Oct, exposure at release ₹10,25,800. C-06: hold placed 06-Oct, still active |
| Price Override Log | SO-1 Glucose ₹700 approved by Nisha; SO-4 ₹540 rejected |
| IRN Exception Queue | Empty if the pincode is fixed first; one row (retry count 3) if the invoice is forced through |
| Approval Log | Every checker differs from its maker; no state change in Part B is missing an entry |

## Part C. Segregation-of-duties and negative tests

These are the only places Aikyat refuses outright. Everything else in Parts A and B warns, asks for a reason and carries on. Each test must leave an Approval Log entry or a security-log entry showing who tried and what was refused.

| ID | Who tries what | Expected |
| --- | --- | --- |
| C-01 | Ravi approves PO 0420, which he raised | Refused: maker cannot be checker |
| C-02 | Ravi opens the Procurement Manager approval queue | Not visible to his role |
| C-03 | Suresh, who recorded the GRN, approves the matching voucher variance | Refused |
| C-04 | Divya edits the received quantity on a GRN | Refused; she can only set accepted and rejected |
| C-05 | Anand approves an adjustment he created himself | Refused |
| C-06 | Latha is assigned to count KA-FG, her own godown | Refused: the counter cannot be the custodian |
| C-07 | Teja edits Vendor C and then approves a voucher against Vendor C | Refused (stub test of the vendor-master rule) |
| C-08 | Ravi deletes a posted PO or an edited GRN line after the voucher is posted | No delete; correction by short-close, cancel or a new document, logged |
| C-09 | Arun approves his own Sales Order | Refused |
| C-10 | Nisha clicks Release on SO-2's credit hold | No Release action exists for her; the API returns forbidden |
| C-11 | Farid releases the hold he placed | Refused; he can only request, and only Usha releases |
| C-12 | Arun issues a Credit Note or Debit Note | Refused; he can only request an adjustment |
| C-13 | Pooja edits C-02's credit terms or ship-to pincode | Refused; finance fields belong to Teja and identity to Business Core |
| C-14 | Pooja allocates a receipt or requests a write-off | Refused |
| C-15 | Pooja approves her own invoice or note | Refused; Rajan approves |
| C-16 | Latha, who recorded DC-1, approves the invoice for DC-1 | Refused |
| C-17 | Pooja issues the return Credit Note before Latha records the return | Blocked with "waiting for return receipt" |
| C-18 | Pooja looks for a Credit Note without an approved adjustment | None can be created; nothing appears in her queue |
| C-19 | Pooja sets the 15(3)(b) flag to reduce GST on C-02's goodwill, which has no scheme reference | Refused; a pre-agreed scheme reference is required |
| C-20 | A DC with no matching SO line while DC is on | Hard reject; no row is created |
| C-21 | An invoice for 620 cartons against a DC of 600 (+3.3%) | PendingApproval as a match variance; an invoice with no DC line at all is hard-rejected |
| C-22 | Cancel SO-1 after DC-1 exists | Blocked; the SO closes only through its documents |
| C-23 | Edit a DC line that has already been invoiced | Blocked; a correction is a new DC line |
| C-24 | Delete a confirmed invoice | No delete; only a Credit Note for its full value |
| C-25 | Simulate a failure in the accounting post when confirming an invoice | The invoice stays Draft, no journal is written, status never flips to Confirmed |
| C-26 | Record a return of 400 cartons of batch G-2608 when 300 shipped | Rejected |
| C-27 | Create an invoice with the same number twice in the KA series; the same number in the TN series | KA duplicate rejected; TN allowed; a cancelled number is kept and never reused |
| C-28 | Cancel an IRN more than 24 hours after generation | Not offered; Credit Note path only |
| C-29 | Override the system-derived GST rate on an invoice line | Allowed as a request, logged either way, and routed to Venkat |
| C-30 | Create a Sales Order, Delivery Challan or PO with no branch | Rejected: Branch is mandatory on every document |

## Part D. Definition of ready and suggested build order

The apps are ready when every step in Parts A and B returns its answer key in both runs, all 30 Part C tests pass, and the checks below hold.

### Final checks

- [ ] Every Approval Log entry has a maker different from its checker, a timestamp and an entity id, and the log cannot be edited or deleted.
- [ ] Every document carries Branch (and Godown on stock documents), and the branch-wise report always sums to the all-branch total.
- [ ] Quantity only steps down each chain: PO to GRN (within the 2% receipt tolerance), SO to DC (within 2%), DC to invoice.
- [ ] Invoice numbers run in a series per GSTIN, reset each financial year, have no gaps, and keep cancelled numbers.
- [ ] No warning blocks a save; each one stores a reason code. Only the Part C refusals stop a transaction.
- [ ] Changing a company rule changes the result without a code change. Test 1: raise the match quantity tolerance from 0.5% to 2% and A1-06 no longer flags quantity (1.5%) but still flags rate (1.74%). Test 2: raise the PO threshold to ₹20,00,000 and PO 0420 no longer routes to Meena and the split rule in A1-04 stops firing.
- [ ] Run 1 (Perpetual) and Run 2 (Periodic) give identical quantities, statuses and approvals.
- [ ] Each user sees only their own queue: Ravi the suggested list and his POs, Meena the approvals, Farid the credit queue, Pooja the unbilled list and approved adjustments.
- [ ] Every stub hand-off listed in the two answer keys exists for Rajan, Teja, Venkat, Usha and Sunil.
- [ ] Every figure in the answer keys reproduces from the seed data with no manual edit.

### Suggested build order, Purchase and Inventory

| Phase (Purchase roadmap) | Scenario steps that become testable |
| --- | --- |
| 1. Core voucher parity, Branch tagging, OCR, Perpetual and Periodic toggle | A1-08, A1-10, A4-05, C-30, Run 2 |
| 2. Order-to-receipt: PO, GRN, linking, multi-godown | A1-01 to A1-05, A1-07, A2-01 to A2-03, A2-07, A4-01 to A4-04, A4-06 |
| 3. Controls: three-way match, maker-checker, Approval Log | A1-06, A2-04, A3-01, A3-06, A5-01 to A5-03, A6-01 to A6-03, C-01 to C-08 |
| 4. Cost and compliance: GST derivation, inter-branch GST, labour compliance | A1-03 (GST table), A2-06, A4-07, A4-08, A4-12 |
| 5. Vendor intelligence | A3-02 to A3-05, A3-07, A1-09, A6-03 (lead-time-fed levels) |
| Inventory engine, in parallel | A4-09 to A4-11, A4-13, A6-04, A6-05 |

### Suggested build order, Sales

| Phase (Sales roadmap) | Scenario steps that become testable |
| --- | --- |
| 1. Sales Order and Delivery Challan, Branch from day one | B1-02, B1-06, D-01, D-02, D-05, C-20, C-22, C-23, C-30 |
| 2. Three-way match and tolerance | D-02 tolerance table, C-21, B2-03 |
| 3. Invoice and accounting | B4-01, B4-05, B4-13, C-24, C-25, C-27 |
| 4. Maker-checker | B1-03, B1-04, B2-01, B2-02, C-09, C-15, C-16 |
| 5. Credit Note and Debit Note | B1-08, B4-06 to B4-08, C-12, C-17 to C-19 |
| 6. Banking and receipts | Outside this scenario (Collections is a stub) |
| 7. GST integration | D-03, D-04, B4-03, B4-04, B4-09 to B4-11, C-28, C-29 |
| 8. Credit control and scorecard | B1-05, B2-05 to B2-07, B3-01 to B3-04, C-10, C-11 |

Build each phase until its listed steps return their answer keys, then move on. Steps that appear in a later phase only because they need that phase's data (for example A1-06 needs the GRN from phase 2) are played after both are built.

## Open points where the source documents disagree or are silent

The scenario picks an answer for each so it can run. Each one needs a decision before the answer key is final.

1. **Who issues invoices and notes.** The Sales Module scope (v3, 26 Sep, sections 8.2 and 8.3) still shows the Accounts Executive generating invoices and the Sales Executive raising Credit Notes. The Role-wise Work List (1 Oct) moves both to the Billing Executive and leaves the Sales Executive to request. Decided: the Billing Executive does it. This scenario follows the 1 Oct list; the Sales scope should be updated to match.
2. **Short-close approval.** No document says who checks a short-close of a PO. A1-07 logs it with a reason and no checker. A natural rule is the Procurement Manager above a value threshold.
3. **Cancelling an IRN after the goods have moved.** The work list allows cancellation within 24 hours and says an e-way bill can be cancelled only before the goods move, while cancelling the IRN also cancels the linked e-way bill. The scenario takes this to mean no cancellation once goods have moved (B4-04, third case). Confirm.
4. **Received or accepted quantity in the match.** The Purchase scope does not say which quantity the three-way match uses. The scenario matches on received quantity and settles QC rejections through a return and Debit Note (A1-06, A4-07).
5. **Two different tolerances.** The scenario keeps a +2% over-receipt tolerance at the GRN and a separate 0.5% quantity tolerance in the match (A4-04 and the maida voucher in the Purchase answer key). The Purchase scope names one tolerance, still pending management decision. Confirm there are two.
6. **Thresholds and tolerances.** The PO and SO approval values, margin floor, risk points, count tolerance, sampling percentages and credit-limit formula are illustrative placeholders; the scopes mark several as pending management decision.
7. **On-time measure for partial deliveries.** The scorecard here uses the last GRN against the promised date (PO 0420 counts as late by one day). The Purchase scope does not say whether the first or the last GRN decides.
8. **Releasing a DC without an IRN.** The scenario relies on the documented offline fallback in Sales design goal 6 for the 03-Oct portal outage (B4-05). Confirm that a DC may be released under that fallback and how it is flagged.
9. **Statutory values.** GST rates, the HSN codes, the 30-day services rule, the 30 November credit-note date, the one-year job-work return period and the TDS code names are placeholders to confirm with the Compliance Officer before the answer key is signed off.
