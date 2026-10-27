# Credit Controller — Designed UI per Task

**Purpose:** Show where each field of the task card lands in the app, for each task (T1–T7): Dashboard, Task, Reports, CnC or Rules.

**Status:** Working design — **Proposal**, not seen by a role holder yet
**Role:** Credit Controller
**Builds on (this folder):**
- `credit_controller_task_atomicity_analysis.md` — the task cards, their type, and "What you fill in"
- `credit_controller_task_types.md` — the type of each task and the screen it gets

---

## 1. The idea

- **The card comes first, the screen second.** Every field of the card has one home in the app. Nothing is on screen that the card doesn't ask for.
- **A task is not one screen.** It starts on the Dashboard, is done in its Task, is recorded in Reports, talks to people in CnC, and is shaped by Rules.
- **The order of our work:** task card → what you fill in → **designed UI** → build and check.

## 2. Where the card goes: the 5 app areas

| Our card / fields | → App area | Where on screen |
|---|---|---|
| **Trigger & cadence** | **Dashboard** | An item in the Action center (and the bell) that opens the task |
| **Held by** | **Dashboard** | My worklist: Needs me · Waiting on others · Coming up |
| **Exceptions** | **Dashboard** | Action center alerts · Risk watchlist |
| **Serves · Indicators** | **Dashboard** + **Reports** | Tiles that show the responsibility is kept · the task's report |
| **Type · Subject · Requires · Sees · Decision** + "What you fill in" · **Screen** | **Task** | The pattern, the record, the Form and its checks |
| **Writes** | **Reports** | The task's report · the Approval Log (the trail) |
| **Hand-off** | **CnC** or **Reports** | **CnC** when the next person must act · **Reports** when they only need to read it |
| **Sends** | **CnC** | Notices, answers, objections, and what comes back |
| **Rules allowed** | **Rules** | What I can set · what I cannot set |
| **Parameters** | **Rules** | The company rule each limit comes from (read-only) |

### The 5 areas

| Area | What it is for | In the app |
|---|---|---|
| **Dashboard** | What needs me now, and is my work under control | Action center · My worklist · Credit checks this month · Exposure · Risk watchlist · Suggestions |
| **Task** | Do one piece of work, start to finish | Tasks T1–T7 |
| **Reports** | Look back; read-only | Credit Decisions · Credit Hold Log · Limit Reviews & Changes · Credit-days Deviations · Exposure · Customer 360 · Party-wise Customer Log · Approval Log |
| **CnC** | What my tasks sent, to whom, and what came back | Conversations by order or customer · "Sent to" people |
| **Rules** | Standing rules for my own work | My rules · Asked of me · What I can / cannot set |

### Words used inside the Task area

**Patterns:**

| Pattern | Layout | When |
|---|---|---|
| **Review** | The record and its evidence side by side; the decision at the bottom | One decision on one item |
| **Worklist** | A list; the open row's record and Form beside it | Many rows; a date or condition starts it |
| **Form on the item** | A small Form opened from the item | The role starts the task on one item |
| **Search + item page** | Find fast; the answer on the item's page | Someone asked about one thing |

- **A fact's source** is named when it is not a stored field: **formula** · **ready calculation** (the system works it out) · **from** another area (Accounts, Collections, Sales).
- **Each check has one of 3 results:** **Stop** (can't send) · **Reason** (ask why, then continue) · **Warn** (show, then continue).
- **Every reason needs a named reader.** No reader = a gap.

---

## 3. Summary

| Task | Dashboard | Task (pattern) | Reports | CnC | Rules |
|---|---|---|---|---|---|
| **T1** Decide an order | Order routed | Worklist → Review | Credit Decisions | → Sales Manager / Sales Executive | Auto-agree band A |
| **T2** Place a hold | Hold suggested | Worklist → Review | Credit Hold Log | Notice → Collections, Sales | Quiet alerts ≤ 14 days |
| **T3** Request release | Held customer paid | Form on the item | Credit Hold Log | → Finance Controller | Remind me |
| **T4** Review limits | Review due / suggested | Worklist → Review | Limit Reviews & Changes | → Accounts Executive | Remind me before a review |
| **T5** Check a limit edit | Limit edited | Review | Limit Reviews & Changes | → Accounts Manager / Accounts Executive | None |
| **T6** Answer Sales | Sales asks | Search + item page | Customer 360 | Answer → the asker | None |
| **T7** Check credit days | Copy from Sales Manager | Review | Credit-days Deviations | Objection → Sales Manager | None |

---

## 4. Task by task

### T1 — Decide an order sent for credit review

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** the credit check routes an order · **Held by:** Needs me · **Exceptions:** over limit, overdue, bounced cheque · **Indicators:** routed orders with no decision | **Dashboard** | Action center: "Order routed" opens T1 · My worklist: Needs me · Credit checks this month (passed automatically, passed, held, rejected) |
| **Type:** Decide · **Subject:** one Sales Order · **Sees:** value, why routed, limit, exposure, overdue, bounced cheques, risk band · **Decision:** Approve · Reject · Hold | **Task** | **Worklist → Review.** Record: value and why routed · limit · exposure (formula: open invoices + open orders + not billed + this order) · headroom (formula) · overdue, ageing (from Accounts) · bounced cheques in 90 days (from Collections) · risk band (ready calculation). Form: **Approve** (note; over the limit → **Reason**) · **Reject** (reason → **Stop**) · **Hold** (reason → **Stop**) · auto-passed: **Agree** · **Hold anyway** |
| **Writes:** CreditApprove / Reject / Hold | **Reports** | Credit Decisions · Approval Log · Customer 360 |
| **Hand-off:** Sales Manager (approved) · Sales Executive (rejected, held) | **CnC** | Approved → Sales Manager, for commercial terms · Rejected or held → Sales Executive, with the reason (**reader:** Sales Executive) |
| **Rules allowed** · **Parameters:** route when exposure + order > limit; dishonour window 90 days | **Rules** | ✅ Auto-agree auto-passed orders, band A · 🟠 band B · ❌ band NEW · ❌ auto-pass routed orders |
| | **Not yet** | Ageing trend in the record · a time limit for deciding (no company rule yet) |

### T2 — Place a credit hold on a customer

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** the daily scan suggests a hold · **Held by:** Needs me; watching → Coming up · **Exceptions:** hold suggested and not decided | **Dashboard** | Action center: "Hold suggested" · Risk watchlist · Coming up: watch dates ending |
| **Type:** Decide · **Subject:** one customer · **Sees:** why suggested, exposure, % used, overdue, DSO trend, broken promises · **Decision:** Place hold · Don't hold | **Task** | **Worklist → Review.** Record: why suggested (ready calculation: daily scan) · exposure and % of limit used (formula) · overdue (from Accounts) · DSO trend (ready calculation) · broken promises (from Collections) · dishonours. Form: **Place hold** (reason → **Stop**) · **Don't hold, keep watching** (reason; watch 7 / 14 / 30 days → **Stop** if none) · notice: recipients, drafted text |
| **Writes:** PlaceHold / DeclineHold | **Reports** | Credit Hold Log · Approval Log · Party-wise Customer Log |
| **Hand-off:** none · **Sends:** hold notice or warning | **CnC** | Notice → Collections, Sales Manager, Sales Executive (Finance Controller optional) |
| **Rules allowed** · **Parameters:** the company's hold level of the limit; DSO rising 3 months with ≥ 2 broken promises | **Rules** | ✅ Quiet a customer's alerts ≤ 14 days · 🟠 15–30 days, or over its limit · ❌ longer, or stop suggestions for good |
| | **Not yet** | **"Don't hold" reason has no named reader** (notes, question 3) · the notice is logged, not sent |

### T3 — Request a credit-hold release

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** the hold's reason has gone (overdue paid) · **Held by:** Needs me → Waiting on others · **Exceptions:** hold still on, nothing overdue | **Dashboard** | Action center: "Held customer has paid" · Waiting on others: request with the Finance Controller |
| **Type:** Ask · **Subject:** one hold · **Sees:** what has gone, what hasn't, held order value · **Decision:** Request release | **Task** | **Form on the item** (the hold). Record: the hold and its reason · payment received (from Collections) · overdue now (from Accounts) · exposure vs limit, with the held order (formula). Form: **Request release** (reason → **Stop**; still overdue → **Warn**; still over the limit → **Warn**) |
| **Writes:** HoldRelease.Request | **Reports** | Credit Hold Log (who released it, exposure at release) · Approval Log |
| **Hand-off:** Finance Controller · **Sends:** exposure summary (system) | **CnC** | Request → Finance Controller, with reason (**reader:** Finance Controller) and exposure summary · the decision comes back · told when the Sales Manager asks for a release |
| **Rules allowed** | **Rules** | ✅ Remind me (e.g. check the promised payment) · ❌ release automatically when paid |
| | **Not yet** | Open from the hold itself · the "still over the limit" warning · an attachment (**ask**) · remove the old Endorse / Decline step |

### T4 — Review credit limits

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** every quarter · period lapsed · Sales Manager suggests · **Held by:** Needs me; due in 30 days → Coming up · **Indicators:** customers past the review period | **Dashboard** | Action center: "Review suggested" · Coming up: reviews due |
| **Type:** Decide, many at once · **Subject:** one customer's limit · **Sees:** current vs suggested limit, on-time %, DSO, disputes, returns, order trend, risk band · **Decision:** Keep · Propose · Bulk | **Task** | **Worklist → Review.** Record: current limit · suggested limit (formula: avg monthly billing × credit days ÷ 30 × band factor) · on-time %, DSO (ready calculation) · disputes, returns (from Sales) · order trend · risk band · last review. Form: **Keep** (note) · **Propose** (new limit, reason; none or same → **Stop**) · **Bulk review** (customers, one reason) |
| **Writes:** LimitReview.Keep / Propose / Bulk | **Reports** | Limit Reviews & Changes · Customer 360 |
| **Hand-off:** Accounts Executive → T5 → Accounts Manager | **CnC** | Proposal → Accounts Executive, with reason (**readers:** Accounts Executive, Accounts Manager) · the Accounts Manager's decision comes back |
| **Rules allowed** · **Parameters:** review cycle 3 months; maximum age 12 months; band factors | **Rules** | ✅ Remind me before a review · ❌ skip a review |
| | **Not yet** | Effective date (**ask**) · a reason for "Keep" (**ask**) |

### T5 — Check a credit-limit edit

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** the Accounts Executive edits a limit · **Held by:** Needs me → Waiting on others · **Indicators:** edits waiting, count and age | **Dashboard** | Action center: "Limit edited" · Needs me |
| **Type:** Decide · **Subject:** one limit change · **Sees:** old vs new, my recommendation, suggested limit, exposure, overdue, risk band · **Decision:** Agree · Object | **Task** | **Review.** Record: old vs new, who edited · my recommendation · suggested limit (formula) · exposure (formula) · overdue · risk band · last review. Form: **Agree** (note; differs from the suggested limit → **Warn**; below exposure → **Warn**) · **Object** (reason → **Stop**) |
| **Writes:** LimitChange.Agree / Object | **Reports** | Limit Reviews & Changes (through to the Accounts Manager) · Approval Log |
| **Hand-off:** Accounts Manager (agreed) · Accounts Executive (objected) | **CnC** | Agreed → Accounts Manager confirms · Objected → Accounts Executive, with reason (**reader:** Accounts Executive) |
| **Rules allowed:** none (maker-checker) | **Rules** | ❌ Nothing can be set: a person checks every limit change |
| | **Not yet** | The "below exposure" warning · comparing with **my** recommendation (today: the suggested limit) |

### T6 — Answer whether a customer can take an order

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** Sales asks · **Held by:** Needs me → done | **Dashboard** | Action center: "Sales asks" · Needs me |
| **Type:** Answer · **Subject:** one question · **Sees:** limit, exposure, headroom, overdue, hold, the order's credit result · **Decision:** Answer | **Task** | **Search + item page.** Record: the question and who asked · limit, exposure, headroom (formula) · overdue · hold · the order's credit result and reason. Form: **Answer** (none → **Stop**) |
| **Writes:** none named | **Reports** | Customer 360 — the same facts Sales could read without asking |
| **Hand-off:** none · **Sends:** the answer | **CnC** | Answer → the asker |
| **Rules allowed:** none | **Rules** | — |
| | **Not yet** | Search first · the answer in one line · standard answers (**ask**) |

### T7 — Check a credit-days deviation

| From our card | → App area | Designed UI |
|---|---|---|
| **Trigger:** the Sales Manager copies an approved order with other credit days · **Held by:** Needs me · **Indicators:** deviations not checked | **Dashboard** | Action center: "Copy from the Sales Manager" · Needs me |
| **Type:** Decide · **Subject:** one order's credit days · **Sees:** terms vs order days, risk band, overdue, DSO · **Decision:** Accept · Object | **Task** | **Review.** Record: terms (days) vs days on the order · risk band · overdue · DSO. Form: **Accept** (note; late payer → **Warn**) · **Object** (reason → **Stop**) |
| **Writes:** CreditDaysDeviation.Accept / Object | **Reports** | Credit-days Deviations |
| **Hand-off:** Sales Manager (objected) · **Sends:** the objection | **CnC** | The copy comes in from the Sales Manager · Objection → Sales Manager (**reader:** Sales Manager) |
| **Parameters:** customer credit days (master) | **Rules** | — (no company rule for an allowed deviation) |
| | **Not yet** | The late-payer warning · what an objection changes on the order (**open**: notes, question 6) |

---

## 5. What is not there (whole role)

1. **Messages are logged, not sent.** Notices and answers stay in the Approval Log and CnC.
2. **A reason with no reader:** T2 "Don't hold".
3. **Warnings still to add:** T3 still over the limit · T5 below exposure · T7 late payer.
4. **Task screens to change:** T3 opened on the hold · T6 search first.
5. **To remove:** the Endorse / Decline release step (no longer in the role file).
6. **Ready calculations need the engine:** DSO, risk band, suggested limit, on-time %.
7. **No role holder has seen these screens.**

## 6. Points for review

| # | Point | Our position |
|---|---|---|
| 1 | Does every card field have one home in the app? | **Yes.** A field with no home is either missing from the app or not needed on the card. |
| 2 | Hand-off: CnC or Reports? | **CnC** when the next person must act · **Reports** when they only need to read it. |
| 3 | Must every reason have a named reader? | **Yes.** No reader = a gap in the role model. |
| 4 | Should the app send messages, or only draft them? | **Send.** A message copied outside the app is not on the trail. |
| 5 | Is T6 a task of its own? | **Search, not a queue,** unless the role holder says answers are tracked. If Sales can read Customer 360, many questions are never asked. |

## 7. Source boundary

- Card fields and types: this folder's analysis and type docs (**Proposal**).
- The 3 check results and "every reason has a reader" follow the team's Task-UX model (the Procurement Officer's Task-UX file, 12 Oct), in our own words.
- The 5 areas and "In the app" are from `credit-controller-app` as it stands. Everything else is **our design, not checked with a role holder**.
