# Credit Controller — Scenario Walkthrough (Biscuit Plant)

**Owner:** Vijay · **Role:** Credit Controller (R-S03) · **Scenario user:** Farid (HQ)

This file plays the shared scenario from the Credit Controller's side. Use it with `credit_controller.md`:
- **`credit_controller.md`** explains *what* the role does (responsibilities, workflows W1–W7, rules).
- **This file** gives *exact data, dates and expected values*. Build until every answer key here matches.

**Sources** (all in `docs/shared_docs/scenario/`):
- `Full scenario.md`: steps B1-05, B2-03, B2-05, B2-07, B3-01 to B3-04, D-01, Part C, Part D
- `Engineer guide.md`: §2.9 Credit Controller, §3 Controls, §5.1 Outputs
- `Role responsibilities and screens.md`: Credit Controller screens

---

## 1. Ground rules for this role in the scenario

- **Independent gate.** Farid's credit check has **no checker**. He is not a second approver of the Sales Order.
- **Only Usha (Finance Controller) can release a hold.** Nobody in Sales has a Release button.
- **Every action writes an Approval Log entry**, which is append-only. A refused action also leaves a log entry.
- **"Over limit" holds the order but still saves it.** It is a warning, not a lost record.
- **All thresholds come from the Company rules table** (§3), never from code.
- **All numbers are illustrative.** The scenario runs Mon 05-Oct-2026 to Sat 31-Oct-2026.

## 2. Cast: who Farid works with

| User | Role | What they do with Farid |
|---|---|---|
| Arun | Sales Executive (R-S01) | Raises SOs. Sees why an order is held. Cannot release. |
| Nisha | Sales Manager (R-S02) | Approves commercial terms. Can only *request* a release. Her scorecard suggests customers for limit review. |
| Usha | Finance Controller (R-FC01, stub) | **Only** approver of hold releases. She also approves credit-limit changes (Decision 4). |
| Teja | Accounts Executive (R01, stub) | Edits customer finance fields, including the credit limit. |
| Rajan | Accounts Manager (R02, stub) | Confirms customer finance-field edits. |
| Latha | Stores Officer (R-P02, KA-FG) | Dispatch plan shows held SOs greyed, "not pickable". |
| Collections (R-S05, stub) | AR/AP | Source of overdue, broken promises and payments. |

## 3. Seed data Farid needs

### 3.1 Customers (credit view on 05-Oct)

| Customer | State | Limit | Days | Band | Open invoices | Overdue | DSO (3 months) | Broken promises | Dishonours | Avg monthly billing | Last review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C-01 Sri Lakshmi Distributors | KA | ₹15,00,000 | 30 | A | ₹4,00,000 | nil | — | 0 | 0 | ₹15,00,000 | — |
| C-02 Chennai Retail Mart | TN | ₹10,00,000 | 45 | B | ₹8,20,000 | ₹2,10,000 (38 days) | 52, 58, 62 | 2 | 1 (62 days ago) | ₹8,00,000 | — |
| C-03 Gulf Snack Imports LLC | UAE | 100% advance | — | new | — | — | — | — | — | — | — |
| C-04 Healthy Bite Foods | KA | ₹3,00,000 | 15 | B | nil (unbilled N-1 ₹84,960 incl. GST) | — | — | — | — | — | — |
| C-05 Namma Bakes | KA | ₹5,00,000 | 30 | B | DC-0618/0619 unbilled | — | — | — | — | — | **14-Aug-2025** |
| C-06 Kerala Traders | KL | ₹5,00,000 | 30 | B | exposure ₹4,10,000 | — | 41, 48, 55 | 2 | 0 | — | — |

### 3.2 Company rules used by this role

| Rule | Value |
|---|---|
| Exposure | Open invoices + open SOs + dispatched-not-billed + this order (amounts **including GST**) |
| Route to credit queue | Exposure > credit limit. Overdue and bounced cheques are shown as reasons. |
| Suggested hold | (DSO rising 3 months running **and** ≥ 2 broken promises) **or** ≥ 80% of limit used |
| Suggested credit limit | Avg monthly billing × (credit days ÷ 30) × band factor (A 1.2, B 1.0), then × 0.8 if any dishonour in 90 days or any amount > 30 days overdue |
| Not-reviewed list | Last credit review older than 12 months |

---

## 4. Timeline: Farid's month

| Date | Step | What happens |
|---|---|---|
| Mon 05-Oct | B1-05 | Arun raises SO-2 (C-02). Credit fails, so it goes to Farid's queue. |
| Mon 05-Oct, 16:00 | **B3-01** (W1) | Farid opens the credit queue. Only SO-2 is in it. |
| Tue 06-Oct | B2-01 | Nisha's queue shows SO-2 with 0 points, "credit approval pending". It stays held. |
| Tue 06-Oct | **B3-02** (W2) | Farid places holds on SO-2 and on C-06 (system-suggested). |
| Wed 07-Oct | D-01 | Latha's dispatch plan shows SO-2 greyed: "credit hold, not pickable". |
| Thu 08-Oct | B1-07 | Arun's follow-up list shows SO-2 on credit hold, with no date promised. |
| Fri 09-Oct | **B3-03** (W3) | C-02 pays ₹2,10,000. Farid requests release of SO-2. *(B2-07 is the Nisha path; play one per run.)* |
| Mon 12-Oct, 09:00 | B2-03 | Nisha's ageing shows "credit hold: 1 (SO-2, 7 days, ₹3,96,000)". |
| Mon 12-Oct, 10:00 | B3-03 | Usha approves the release. SO-2 goes to Nisha, who approves it the same day. |
| Mon 12-Oct | B2-05 | Nisha's scorecard suggests C-02 and C-06 for limit review. |
| Mon 12-Oct | **B3-04** (W4) | Farid runs the credit-limit review. |
| Tue 13-Oct | — | SO-2 is dispatched (Cream 400) and invoiced at ₹4,15,800 after the pincode fix. |
| 31-Oct | Answer key | Credit Hold Log end state (§7). |

---

## 5. Workflows played in the scenario

### W1 — Review SOs routed for credit approval → B1-05 + B3-01

**Trigger (upstream: Arun, B1-05)**
- SO-2 for C-02 (TN customer billed from KA): Cream 400 × ₹990 = ₹3,96,000 + IGST ₹19,800 = **₹4,15,800**.
- The system runs the credit check on every SO raised on credit, in the background.
- SO-2 status becomes **Awaiting credit approval**. Arun sees the reason: **"over limit, overdue, bounced cheque"**.

**What Farid sees (Mon 05-Oct, 16:00): one screen**

| Field | Value |
|---|---|
| Queue | **Only SO-2** (C-02) |
| Open invoices | ₹8,20,000 |
| Open SOs | ₹0 |
| Dispatched-not-billed | ₹0 |
| This order | ₹4,15,800 |
| **Exposure** | **₹12,35,800** |
| Limit | ₹10,00,000, so **₹2,35,800 over** |
| Overdue | ₹2,10,000 |
| Days-past-due trend (oldest item, last 3 months) | 12 → 25 → 38 |
| Bounced receipts | 1 |
| Broken promises | 2 |

**Orders that must NOT reach the queue (they pass automatically)**

| SO | Customer | Exposure vs limit | Result |
|---|---|---|---|
| SO-1 (B1-02) | C-01 | ₹4,00,000 + ₹7,60,725 = ₹11,60,725 vs ₹15,00,000 | Passes, **headroom ₹3,39,275** |
| SO-6 (B1-06) | C-04 | ₹84,960 + ₹1,06,200 = ₹1,91,160 vs ₹3,00,000 | Passes |
| SO-3 (export) | C-03 | 100% advance customer | Not routed |
| SO-4 | C-05 | Within limit | Not routed (commercial issue only) |

**Decision options**
- **Pass:** the SO goes on to Nisha for commercial approval (Decision 2: credit first).
- **Place hold:** go to W2. This is what Farid does with SO-2.
- **Reject:** the SO status becomes **Rejected**. A reason is mandatory and is shown to Arun (Decision 1). This is not played in the scenario; see test CC-6.

**Downstream**
- The SO header stores the credit-check result and exposure snapshot.
- SO-2 sits in Nisha's queue with 0 points and the reason "credit approval pending". **The credit gate comes first.**

---

### W2 — Place credit holds → B3-02 (Tue 06-Oct)

**Hold 1: SO-2 / C-02 (from the queue)**
- Reason recorded: **"over limit by ₹2,35,800, ₹2,10,000 overdue, 1 bounced cheque"**.

**Hold 2: C-06 (system-suggested, before the limit is crossed)**
- Why the system suggests it:
  - Exposure ₹4,10,000 = **82%** of ₹5,00,000, which meets the ≥ 80% rule.
  - DSO 41 → 48 → 55 (rising 3 months running) **and** 2 broken promises.
- Farid accepts the suggestion and places the hold the same day.

**Expected results**
- The **Credit Hold Log has 2 rows**, both with placed-by Farid and a reason.
- The hold flag is visible to Arun and Nisha. **Neither has a Release action.**
- D-01 (07-Oct): Latha's dispatch plan shows SO-2 greyed, "credit hold, not pickable".
- B1-07 (08-Oct): Arun sees SO-2 "credit hold", with no dispatch date promised.
- B2-03 (12-Oct, 09:00): Nisha's ageing groups SO-2 under "credit hold".

> Note: C-02 would also match the suggestion rule (DSO 52 → 58 → 62, 2 broken promises), but it is already over the limit and held through SO-2.

---

### W3 — Request credit-hold release → B3-03 (Fri 09-Oct), or B2-07

**Trigger:** C-02 pays its overdue ₹2,10,000 on 09-Oct.

**Farid's release request (sent to the Finance Controller only)**

| Field | Value |
|---|---|
| Exposure after payment | ₹8,20,000 − ₹2,10,000 + ₹4,15,800 = **₹10,25,800** |
| Over limit | ₹25,800 |
| Overdue now | nil |

**Approval and downstream**
- **Usha approves on Mon 12-Oct at 10:00.**
- The Credit Hold Log row is updated: **released-by Usha, exposure at release ₹10,25,800**.
- SO-2 moves to **Nisha** for commercial approval (list price, no override). She approves it the same day.
- SO-2 enters the 13-Oct dispatch plan, is dispatched, and is invoiced at ₹4,15,800.
- **C-06 stays on hold** (no release requested).

**Alternative path, B2-07 (play one path per run), adapted to Decision 5**
- Nisha requests the release instead (Fri 09-Oct). She has a **Request** button and **no Release** button.
- Her request lands in **Farid's queue first**, not with Usha. This differs from the shared scenario, where it goes straight to Usha.
- Farid **endorses** it, attaching the exposure summary (₹10,25,800, ₹25,800 over, nothing overdue). It then goes to Usha with Nisha's commercial reason beside the exposure summary.
- From there the result is the same as above: Usha releases on 12-Oct at 10:00.
- The Credit Hold Log row shows release requested by Nisha, endorsed by Farid and released by Usha.
- If Farid **declines** the request, it goes back to Nisha with his reason and never reaches Usha.

---

### W4 — Periodic credit-limit review → B3-04 (Mon 12-Oct)

**Inputs:** Nisha's scorecard (B2-05) suggests **C-02** (on-time 55%, DSO 62 vs 45 days, 1 dishonour, 3 credit notes in 6 months) and **C-06** (DSO 55 vs 30 days, rising).

**Expected suggested limits**

| Customer | Calculation | Suggested | Current | Direction |
|---|---|---|---|---|
| C-01 | ₹15,00,000 × (30 ÷ 30) × 1.2 | **₹18,00,000** | ₹15,00,000 | Increase |
| C-02 | ₹8,00,000 × (45 ÷ 30) × 1.0 × 0.8 (dishonour within 90 days, overdue > 30 days) | **₹9,60,000** | ₹10,00,000 | Decrease |

**Not-reviewed list:** **C-05**, last reviewed 14-Aug-2025, **424 days** ago.

**Downstream:** the limit itself changes only through the customer master (W5). The review only proposes.

---

### W5 — Credit-limit change on the customer record (not played in the scenario)

The scenario stops at the suggestion. Use this test to continue W4. The flow follows Decision 4: the Finance Controller approves new limits.
1. Teja (Accounts Executive) edits C-02's limit from ₹10,00,000 to ₹9,60,000.
2. The edit routes to **Farid** for credit review. He sees old vs new limit, exposure, overdue and band.
3. **Usha** (Finance Controller) approves the new limit. Only then does the customer master update.
4. Expected:
   - The customer master shows ₹9,60,000, last review 12-Oct-2026 and the next review date.
   - An Approval Log entry is written.
   - Farid cannot edit the field himself, because the customer master is read-only for him.

---

### W6 — Exposure feed from AR/AP (read-only, every step)

| Data | Where it is used | Scenario value (C-02) |
|---|---|---|
| Open invoices, overdue | W1 exposure | ₹8,20,000; ₹2,10,000 overdue |
| Days-past-due trend | W1 history | 12, 25, 38 |
| Broken promises, dishonours | W1, W2 | 2; 1 |
| DSO trend | W2 suggestion, W4 | 52, 58, 62 |
| Payment received | W3 trigger | ₹2,10,000 on 09-Oct |

Farid **makes no entries** here. Collections and AR/AP are stubs; their data is seeded.

---

## 6. Screens to build (from "Role responsibilities and screens")

**Build order:**
1. Credit review screen with the exposure total
2. Credit Hold Log
3. Release request
4. Endorsement queue (Sales Manager's release requests, Decision 5)
5. Suggested holds
6. Credit-limit review

| Screen | Fields | Workflow |
|---|---|---|
| Credit review (queue + detail) | Queue: SO, customer, order value, routing reason. Exposure: open invoices, open SOs, dispatched-not-billed, total, limit, amount over. History: overdue, DPD trend, bounced receipts, broken promises. Decision: **Pass / Place hold / Reject**, with a reason. | W1 |
| Credit Hold Log | Customer, SO, placed by, reason, release requested by, endorsed by, released by, exposure at release, dates | W2, W3 |
| Release request | Customer/SO, requester (Credit Controller or Sales Manager), reason, exposure summary (auto-attached), status (Requested → Endorsed → Released, or Declined by Credit Controller / Rejected by Finance Controller) | W3 |
| Endorsement queue | Sales Manager's release requests waiting for the Credit Controller: commercial reason, order value, exposure summary. Actions: **Endorse / Decline**, with a reason | W3 |
| Suggested holds | Customer, signal (≥ 80% used / DSO rising + broken promises), exposure %, DSO trend | W2 |
| Credit-limit review | Customer, avg billing, credit days, band, factor, 0.8 penalty reason, suggested vs current; plus the not-reviewed list | W4 |
| Customer master (read-only) | Limit, terms, band, hold flag, last/next review | W4, W5 |

**Shown to other roles (read-only)**
- Credit result and hold flag on the SO screen (Arun, Nisha).
- "Not pickable" on the dispatch plan (Latha).

## 7. Answer key: end state at 31-Oct

| Item | Expected |
|---|---|
| Credit Hold Log, row 1 | SO-2 / C-02: placed by Farid 06-Oct, released by **Usha** 12-Oct, exposure at release **₹10,25,800** |
| Credit Hold Log, row 2 | C-06: placed by Farid 06-Oct, **still active** |
| SO-2 | Held 06-Oct → released 12-Oct → dispatched 13-Oct → invoiced ₹4,15,800 |
| Suggested limits | C-01 ₹18,00,000; C-02 ₹9,60,000 |
| Not-reviewed list | C-05 (424 days) |
| Approval Log | Every credit action logged; no checker equals its maker |

## 8. Negative tests (Part C, plus role-specific checks)

| ID | Who tries what | Expected |
|---|---|---|
| C-10 | Nisha clicks Release on SO-2's hold | No Release action exists; the API returns **forbidden** |
| C-11 | Farid releases the hold he placed | **Refused**; he can only request, and only Usha releases |
| C-30 | An SO with no branch | Rejected; Branch is mandatory |
| CC-1 | Arun releases a hold through the API | Forbidden and logged |
| CC-2 | A new SO for C-06 while it is on hold | Hard-blocked at submit; it never reaches Farid's queue |
| CC-3 | Latha picks SO-2 while it is held | Not pickable |
| CC-4 | Farid edits C-02's credit limit directly | Refused; the customer master is read-only for him |
| CC-5 | Change the "suggested hold %" rule from 80% to 85% | C-06 (82%) is still suggested through the DSO + broken-promise rule; no code change needed |
| CC-6 | Farid rejects SO-2 with no reason | Refused; a reason is mandatory. With a reason, the status is **Rejected** and Arun sees the reason (Decision 1) |
| CC-7 | Nisha opens SO-2 for commercial approval while its credit is pending | Not actionable; the credit gate must clear first (Decision 2) |
| CC-8 | Nisha's release request (B2-07) | Lands in Farid's endorsement queue; Usha sees nothing until Farid endorses (Decision 5) |
| CC-9 | Usha releases a Sales Manager request that Farid has not endorsed | Not possible; the request is not in her queue (Decision 5) |
| CC-10 | Teja's limit change for C-02 approved by Rajan alone | Customer master is not updated; Usha's approval is required (Decision 4) |

## 9. Team decisions applied to the scenario (confirmed)

These are the team's answers from `credit_controller.md` §10, and how the build applies them on top of the shared scenario.

| # | Topic | Team decision | Shared scenario | What we build |
|---|---|---|---|---|
| 1 | Declined SO | Rejected, with a mandatory reason | Not played (only "Place hold") | **Reject** as a third decision on the credit review screen; test CC-6 |
| 2 | Gate order | In sequence: credit gate first | Same (Nisha approves SO-2 after release, B3-03) | Credit first, then Sales Manager; test CC-7 |
| 3 | Routing trigger | Every SO raised on credit is checked automatically | Same | Background check on every credit SO |
| 4 | New-limit approval | Finance Controller | Not played (B3-04 stops at the suggestion) | W5 test in §5; test CC-10 |
| 5 | Sales Manager's release request | Credit Controller endorses, Finance Controller ratifies | **Differs**: B2-07 sends it straight to Usha | Our build routes it through Farid; B2-07 adapted in W3; tests CC-8, CC-9. **Tell the shared-scenario owners about this deviation.** |

## 10. Gaps in the shared scenario folder

- **Missing tab.** The Engineer guide refers to a "Simple version" tab (story step **S-4** for the Credit Controller). It is not in `docs/shared_docs/scenario/`. Ask the team for it.
- **Hold scope.** The scenario holds an **order** (SO-2) and a **customer** (C-06). The app needs both: a customer-level hold flag, and an order-level credit status.
