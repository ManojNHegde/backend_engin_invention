# Credit Controller — role and activity cards

**Owner:** Vijay · **Team:** Sales · **Role ID:** R-S03 (proposed) · **Stage:** 2, Sell and control credit
**Sources:** `shared_docs/Aikyat - Role-wise Work List  Intelligence revised Oct 1_ 2026.md` (§9, plus §8, §11.3, §22.3, §23.3) and `shared_docs/Aikyat_Sales_Module_Finalized_Scope.md` (§2, §3, §7 Phase 8, §8)
**Format:** follows `shared_docs/contracts-services-procurement-officer.md`: role card → activity cards → what they give the dashboard, reports and engine.
**Also see:** `credit_controller_doc_to_mock_map.md` (each activity → screens) · `credit_controller_scenario.md` (exact data) · `credit_controller_demo_guide.md` (19 demo steps) · `credit_controller_ca_review.md` (CA feedback)

---

## 1. Role card

| Field | Value |
|---|---|
| **Identity** | Credit Controller · R-S03 · Stage 2 · function: Sales (independent of the sales team) · works in **Sales** (credit gate, holds, limit reviews); reads **AR/AP** (exposure, overdue, dishonours) |
| **Purpose** | Make sure goods go out on credit only to customers who can carry it, and catch risky customers **before** they cross their limit. |
| **Rhythm** | Daily: credit queue, suggested holds, exposure · As needed: holds, release requests, limit edits, my rules · Quarterly: limit review |
| **Where** | Central at HQ, all branches. Branch is a filter, not a separate desk. |

### Responsibilities

| # | Responsibility | Source |
|---|---|---|
| R1 | Decide on Sales Orders the credit check routes to the queue | §9 W1 |
| R2 | Place credit holds on customers who are getting risky | §9 W2 |
| R3 | Ask the Finance Controller to release a hold; endorse or decline the Sales Manager's release requests | §9 W3 |
| R4 | Review credit limits and recommend changes | §9 W4 |
| R5 | Check credit-limit edits made on the customer record | §9 W5 |
| R6 | Use live exposure from AR/AP in every decision | §9 W6 |

### Outcomes and indicators

| # | Outcome | Indicator | Good when | Served by |
|---|---|---|---|---|
| O1 | No order goes out over limit without a credit decision | orders over limit with no decision | zero | R1 |
| O2 | The credit queue is cleared quickly | orders waiting for credit, count and oldest age | low, young | R1 |
| O3 | Risky customers are caught early | suggested holds not yet decided; customers ≥ 80 % used | zero undecided | R2, R6 |
| O4 | A hold does not stay after its reason has gone | held customers with nothing overdue; release requests waiting, age | zero, young | R3 |
| O5 | Credit limits stay current | customers not reviewed in 12 months; reviews due | zero | R4 |
| O6 | Limit edits are checked promptly | limit edits waiting for my check, count and age | young | R5 |

### Authority

| Makes (checked by) | Checks (made by) | Decides alone | Reads only |
|---|---|---|---|
| Release request → **Finance Controller** releases | Limit edit ← **Accounts Executive** | Approve or reject a routed SO · place a hold · don't hold (with a watch period) · hold an order that already passed | Exposure, overdue, DSO, broken promises, dishonours (AR/AP) |
| Limit recommendation → Accounts Executive edits → **Finance Controller** approves | Sales Manager's release request (endorse or decline) | Agree to an order that passed automatically | Customer identity and terms |
| A rule beyond my own limits → **Finance Controller** approves (W7) | — | Set my own rules within my limits (W7) | — |

**Cannot:**
- Release a hold. Only the Finance Controller can.
- Change a credit limit, or edit customer finance fields. The Accounts Executive edits them and the Finance Controller approves.
- Approve price or discount. That is the Sales Manager's.
- Allocate receipts, chase payments or write off debts. That is Collections and AR/AP.
- Hold or limit **vendors**. That is purchase side, not this role.
- Be combined with any Sales role.
- Set a rule that skips a decision or loosens a control (W7).

### Counterparts

| Counterpart | Gives to this role | Gets from this role |
|---|---|---|
| Sales Executive (R-S01) | SOs raised on credit | Approve, or reject with reason |
| Sales Manager (R-S02) | Scorecard suggestions; release requests | Credit-cleared SOs; endorsed or declined requests |
| Finance Controller (R-FC01) | Release decisions; limit approvals | Release requests; checked limit edits |
| Accounts Executive (R01) | Limit edits on the customer record | Agree or object; recommended limits |
| Collections Officer (R-S05) | Receipts, broken promises, overdue follow-up | Coordination on held customers |
| Banking / Reconciliation (R01b) | Bounced cheques (dishonours) | — |
| Stores / Inventory Officer (R-P02) | — | Hold status, so held orders are not picked |
| Internal Auditor (R09) | Audit questions | Approval Log, Credit Hold Log |
| CEO / Management (R32) | — | "Orders stuck on credit hold" in the digest |

### Asked of it

Quick questions people bring. Each should be answered from one screen.

| Who asks | Question | Where the answer is |
|---|---|---|
| Sales Executive | "Why is my order stuck?" | SO credit result: reason, who holds it now |
| Sales Manager | "Can we ship to X? How much room is left?" | Customer 360: limit, exposure, headroom |
| Finance Controller | "Why should I release this hold?" | Release request with exposure summary |
| Collections | "Who is on hold, and what do they owe?" | Credit Hold Log, Customer 360 filter "On hold" |
| Internal Auditor | "Who held, who released, and why?" | Credit Hold Log, Approval Log, What changed |

### The occupier (our belief, to be tested)

- **Who:** a finance person, not a salesperson. Says "no" to sales and must be able to show why.
- **Thinks in:** the **customer**. "Chennai Retail Mart" is one picture: limit, owed, overdue, orders, holds.
- **Core verb:** decide, and **record the reason**.
- **Today's tool:** Excel ageing sheet, phone calls with Sales and Collections.
- **Their words:** limit, exposure, overdue, hold, release, bounced cheque, headroom.

| # | We believe | We are wrong if |
|---|---|---|
| C1 | The customer is the unit of thought | they work order by order and never open the customer |
| C2 | Every decision needs a recorded reason, even "OK, I'll let it pass" | they find the reasons a burden and skip them |
| C3 | They want to see orders that passed automatically, not only routed ones | they never look at the "passed automatically" list |
| C4 | A limit review is done for many customers at once each quarter | they review one customer at a time |

---

## 2. Key terms

| Term | Meaning |
|---|---|
| **Credit limit** | Maximum amount the customer may owe. It is global or per branch, depending on company configuration. |
| **Exposure** | Open invoices + open SOs + dispatched-not-billed. |
| **Headroom** | Credit limit − exposure. |
| **Overdue** | Invoices unpaid after their credit days run out. |
| **Risk band** | A, B or NEW. Set manually until AR/AP data is live. |
| **Hold flag** | Flag on the customer that **hard-blocks** every new SO. Only the Finance Controller releases it. |
| **DSO** | Days Sales Outstanding: how long the customer takes to pay on average. |
| **Broken promise** | A promise-to-pay recorded by Collections that the customer did not keep. |
| **Dishonour** | A bounced cheque or payment, reported by Banking. |

---

## 3. Activity cards

Seven activities. W1–W6 are the work items in the roles document; **W7 Set my rules** is new. **W** numbers are kept so the cards match the app's screens.

**Rules allowed** is a standard field on every card, **for every role**. It lists the standing rules the occupier may set for that activity. Each rule gets one of three answers:
- ✅ **Myself:** applies now.
- 🟠 **Needs approval:** applies after the named approver agrees (for this role, the Finance Controller).
- ❌ **Never:** refused and logged, with what to do instead.

One principle decides the answer: **a rule can make my work quieter or stricter; it can never skip a decision or loosen a control.** What is allowed, and who approves, differs per role. W7 is where rules are set, seen and ended.

**Who holds it** uses three words throughout:
- **Needs me:** my move.
- **Waiting on others:** someone else's move; I can see it.
- **Coming up:** not urgent yet.

### W1 — Review SOs routed for credit approval

| Field | Value |
|---|---|
| Serves | R1 → O1, O2 |
| Trigger & cadence | Every SO raised on credit is checked automatically when it is raised (Decision 3). This includes bulk imports and SOs from a Proforma. Daily. |
| Subject | **Sales Order**, credit part: credit result, reasons, exposure snapshot, credit decision |
| Requires | The customer has a credit limit (an advance-only customer gives no credit) · live exposure (W6) |
| Sees | SO value and why it was routed · limit vs exposure (open invoices + open SOs + not billed) · overdue and days-past-due trend · bounced cheques, broken promises, risk band |
| Decision | **Routed SO:** Approve · Reject (reason required) · Hold (W2). **Passed automatically:** Agree (note optional) · Hold anyway (reason required, until dispatch) |
| Writes | `SalesOrder.CreditApprove` · `SalesOrder.CreditReject` · `SalesOrder.CreditHold` · `SalesOrder.CreditAgree` |
| Hand-off | Approved → **Sales Manager** for commercial terms (Decision 2) · Rejected → **Sales Executive** sees the reason |
| Sends | Info notification to me when an order passes automatically |
| Held by | Routed → **Needs me** · Passed automatically, not yet agreed → **Needs me** (info only) · Approved → Sales Manager, **Waiting on others** · Blocked (customer on hold) → nobody until a release (W3) |
| Exceptions | Over limit · overdue · bounced cheque in 90 days · customer on hold (hard block) |
| Parameters | Route when exposure + SO value > credit limit |
| Rules allowed | ✅ Auto-agree auto-passed orders, band A · 🟠 band B · ❌ band NEW · ❌ auto-pass routed orders (instead: propose a higher limit, W4) |
| Indicators | O1, O2 |
| Screen | **Worklist** (routed, then passed automatically) → **Review** (one screen, decision at the foot) |

### W2 — Place credit holds

| Field | Value |
|---|---|
| Serves | R2 → O3 |
| Trigger & cadence | The system suggests a hold when a customer gets risky. I can also hold any customer. As needed. |
| Subject | **Credit hold** on the customer (hold flag + Credit Hold Log entry) |
| Requires | A credit customer · a reason |
| Sees | Why it is suggested (signals) · exposure, % used, overdue, DSO trend, broken promises, dishonours |
| Decision | **Place hold** with reason · **Don't hold, keep watching**: reason plus a watch period of 7, 14 or 30 days · with either choice, **notify** whoever should know (or nobody) |
| Writes | `Customer.PlaceHold` · `Customer.DeclineHold` (both can carry a notice) |
| Hand-off | None. A hold is an independent gate with no maker-checker. Stores sees it in the dispatch plan. |
| Sends | **Hold notice** (after a hold) or **hold warning** (not held, watching) to Collections, Sales Manager, Sales Executive (ticked by default) and Finance Controller (optional). Message drafted from the signals, editable, kept on the log. Stores sees "on hold" in the dispatch plan. |
| Held by | Suggested → **Needs me** · Not held, watching → **Coming up** until the watch date · On hold → W3 |
| Exceptions | Hold suggested and not decided |
| Parameters | Suggest when ≥ 80 % of limit used, **or** DSO rising 3 months in a row with ≥ 2 broken promises |
| Rules allowed | ✅ Quiet a customer's alerts up to 14 days · 🟠 15–30 days, or a customer already over its limit · ❌ longer, or stop suggestions for good (instead: quiet, or don't hold & watch) · ❌ suggest holds later than 80 % (instead: alert me earlier, W6) |
| Indicators | O3 |
| Screen | **Worklist** (suggested holds; not held: watching) → **Form** (hold or don't hold) |

Effects of a hold:
- New SOs are hard-blocked.
- Already-confirmed SOs show "on hold" in the Stores dispatch plan.
- It stays until the Finance Controller releases it.

### W3 — Request credit-hold release

| Field | Value |
|---|---|
| Serves | R3 → O4 |
| Trigger & cadence | The customer pays, or the Sales Manager asks for a specific order (Decision 5). As needed. |
| Subject | **Hold release request** |
| Requires | A hold that is active · a reason |
| Sees | Exposure now, over limit by, overdue, the held order's value, the requester's reason |
| Decision | Request release (reason) · for a Sales Manager request: **Endorse** or **Decline** (reason) |
| Writes | `HoldRelease.Request` · `HoldRelease.Endorse` · `HoldRelease.Decline` |
| Hand-off | **Finance Controller** approves or rejects. Approved → hold cleared, blocked SOs move on. |
| Sends | Exposure summary attached automatically |
| Held by | Payment in, overdue cleared, still on hold → **Needs me** · Sales Manager's request → **Needs me** · Request sent → Finance Controller, **Waiting on others** |
| Exceptions | Hold still on although nothing is overdue |
| Parameters | — |
| Rules allowed | ✅ Remind me (e.g. check the promised payment) · ❌ release a hold automatically when paid (instead: request release) |
| Indicators | O4 |
| Screen | **Worklist** (held customers, requests to endorse) → **Form** (request) |

### W4 — Periodic credit-limit review

| Field | Value |
|---|---|
| Serves | R4 → O5 |
| Trigger & cadence | Quarterly. The system lists the customers due. The Sales Manager's scorecard can add customers. |
| Subject | **Limit review** per customer (keep or proposed limit, reason, batch ID when bulk) |
| Requires | A credit customer · billing history for a suggested limit |
| Sees | Current vs suggested limit · on-time %, DSO, disputes and returns · order volume trend · risk band and its source |
| Decision | **Keep** or **Propose** a new limit, increase or decrease. One customer at a time, or **Bulk review**: many customers with one reason. |
| Writes | `LimitReview.Keep` · `LimitReview.Propose` · `LimitReview.Bulk` |
| Hand-off | **Accounts Executive** enters the change → me (W5) → **Finance Controller** approves (Decision 4). Each customer separately, even in bulk. |
| Sends | — |
| Held by | Due or flagged by the scorecard → **Needs me** · Recommendation sent → Accounts Executive, **Waiting on others** |
| Exceptions | Not reviewed in 12 months |
| Parameters | Suggested limit = avg monthly billing × (credit days ÷ 30) × band factor (A 1.2, B 1.0, NEW 1.0) × 0.8 if a dishonour in 90 days or overdue > 30 days · review cycle 3 months · maximum age 12 months |
| Rules allowed | ✅ Remind me before a review · ❌ skip a review (the cycle is company policy) |
| Indicators | O5 |
| Screen | **Worklist** (reviews due) → **Review** (one customer) or **Bulk review** dialog |

Limits are never recalculated automatically. The review is manual (Sales scope, Phase 8 step 28). On each review the system updates the **last review date** and the **next review due**.

### W5 — Check credit-limit changes on the customer record

| Field | Value |
|---|---|
| Serves | R5 → O6 |
| Trigger & cadence | Per edit. The Accounts Executive changes a credit limit. |
| Subject | **Limit change**: old vs new limit |
| Requires | An edit by the Accounts Executive (the maker) |
| Sees | Old vs new limit, my recommendation (if any), exposure, overdue, risk band, last review |
| Decision | **Agree** or **Object** (reason) |
| Writes | `LimitChange.Agree` · `LimitChange.Object` |
| Hand-off | Agreed → **Finance Controller** approves; only then does the customer record change · Objected → back to the Accounts Executive |
| Sends | — |
| Held by | Edit waiting → **Needs me** · Agreed → Finance Controller, **Waiting on others** · Objected → Accounts Executive, **Waiting on others** |
| Exceptions | New limit differs from my recommendation · new limit below current exposure |
| Parameters | — |
| Rules allowed | ❌ None. A person checks every limit change (maker-checker), even one that matches my recommendation (Decision 12). |
| Indicators | O6 |
| Screen | **Worklist** → **Review** |

### W6 — Read live exposure (system feed from AR/AP)

| Field | Value |
|---|---|
| Serves | R6 → O1, O3 |
| Trigger & cadence | Continuous. A system feed. Read daily. |
| Subject | Exposure, overdue, days past due, broken promises, dishonours, risk signals per customer |
| Requires | AR/AP live. **Until then:** limit vs invoices posted in Sales only, and the risk band set by hand. |
| Sees | Exposure vs limit for every customer; who is over, near, or overdue |
| Decision | None here. It feeds W1, W2 and W4. |
| Writes | None. No allocation or write-off entries. |
| Hand-off | — |
| Held by | Never a queue item |
| Exceptions | Over limit · ≥ 80 % used · overdue |
| Parameters | — |
| Rules allowed | ✅ Alert me earlier for a customer (below the company 80 %) · ❌ at or above 80 % |
| Indicators | O1, O3 |
| Screen | **Register** (exposure by customer) · dashboard chart |

### W7 — Set my rules (new)

| Field | Value |
|---|---|
| Serves | R1–R6 → O2, O3 (less noise, so real alerts get attention) |
| Trigger & cadence | **My own choice, any time.** I don't wait for an alert: I open a customer (Customer 360, W6) and set what I can. Also from an alert ("Set a rule"), from W2, or from W7. **Or someone asks** (upstream): the Finance Controller instructs, the Sales Manager requests. As needed. |
| Subject | **My rule**: type, customer or band, end date, reason, status |
| Requires | A reason · an end date (max 90 days) · within the role's limits (the **Rules allowed** rows above) |
| Sees | What I may set and who approves · my rules: active, waiting for approval, ended · what each rule has done (alerts quieted, orders agreed) |
| Decision | **Set** a rule · **End** it early · **Withdraw** one waiting for approval · **Mark done** a reminder · for an ask: **Set as rule** · **Mark as done** (instruction) · **Decline** with reason (request) · or leave it |
| Writes | `MyRule.Set` · `MyRule.End` · `RuleAsk.Done` · `RuleAsk.Decline` · refused attempts (all on the Approval Log) |
| Hand-off | Beyond my limits → **Finance Controller** approves or rejects. Within limits → none. |
| Sends | A notice to **only the people the rule affects** (downstream), when it is set and when it ends. See "Who is told" below. |
| Held by | Ask open → **Needs me** (optional) · waiting for approval → Finance Controller, **Waiting on others** · reminder due → **Needs me** · rule ending, reminder set → **Coming up** |
| Exceptions | Refused rule (with what to do instead) · a quiet rule ends itself when things get worse (a critical alert about that customer) |
| Parameters | Quiet alone up to 14 days · with the Finance Controller up to 30 days · any rule up to 90 days |
| Rules allowed | The four rules below, within the limits in the W1–W6 rows |
| Indicators | rules active · rules waiting for approval · alerts quieted |
| Screen | **Worklist** (what I can set · asked of me · reminders due · waiting · active · ended) → **Form** ("Set a rule" dialog with a live answer and who is told) |

The four rules:

| Rule | What it does | ✅ Myself | 🟠 Finance Controller | ❌ Never |
|---|---|---|---|---|
| **Quiet a customer's alerts** | Alerts stay off the dashboard; the work still shows in My queue. Ends itself if things get worse. | ≤ 14 days | 15–30 days, or customer over limit | > 30 days |
| **Auto-agree auto-passed orders** | Orders that pass automatically are agreed for me. Routed orders still come to me. | Band A | Band B | Band NEW |
| **Alert me earlier** | Alert when a customer crosses my own % | below 80 % | — | at or above 80 % |
| **Remind me** | A reminder on a day I pick | always | — | — |

Never allowed (refused and logged): stop hold suggestions for good · suggest holds later · auto-pass routed orders · auto-release a hold · skip a limit review.

**Asked of me (upstream).** Someone else can ask for a rule. I get a notification with the answers.

| Who asks | What it is | My answers | Approval |
|---|---|---|---|
| **Finance Controller** | An **instruction** | **Set as rule** (dialog filled in) · **Mark as done** (note optional) · or leave it | Comes with it: a 🟠 rule applies at once. A ❌ rule stays refused. |
| **Sales Manager** | Only a **request**: the Credit Controller is independent of Sales | **Accept as rule** · **Decline** (reason required) · or leave it | Normal check, as if I set it myself |

- The rule records **Asked by** (who, which ask). The person who asked is told the answer.
- Farid's own manager is not named yet. For now "from above" means the Finance Controller.

**Who is told (downstream).** Only the people the rule affects, not everyone:

| Rule | Who is told |
|---|---|
| Quiet a customer | Finance Controller (FYI) |
| Auto-agree a band | Finance Controller · Sales Manager |
| Alert me earlier · Remind me | Nobody |
| Any rule someone asked for | Also the person who asked |
| A rule ends early, or things got worse | The same people again |

---

## 4. Who holds an item: the whole queue

All the **Held by** rows in one place.

| Item | State | Held by | Queue |
|---|---|---|---|
| SO | routed for credit | me | Needs me |
| SO | passed automatically, not agreed, not dispatched | me (info only) | Needs me |
| SO | credit cleared | Sales Manager | Waiting on others |
| SO | rejected / blocked | Sales Executive | — |
| Customer | hold suggested | me | Needs me |
| Customer | not held, watching | me, later | Coming up |
| Customer | on hold, overdue cleared | me: request release | Needs me |
| Release request | from Sales Manager | me: endorse or decline | Needs me |
| Release request | sent | Finance Controller | Waiting on others |
| Limit review | due / scorecard flag | me | Needs me |
| Limit review | recommendation sent | Accounts Executive | Waiting on others |
| Limit change | edited, waiting for my check | me | Needs me |
| Limit change | agreed | Finance Controller | Waiting on others |
| Limit change | objected | Accounts Executive | Waiting on others |
| My rule | needs approval | Finance Controller | Waiting on others |
| My rule | reminder due | me | Needs me |
| My rule | active, ends within 30 days · reminder set | me, later | Coming up |

---

## 5. Dashboard (derived from the cards)

| Tile | Shows | Opens | From |
|---|---|---|---|
| Waiting for your decision | count, ₹ over limit | W1 | O2 |
| Total exposure | ₹ across customers | W6 | O1 |
| Customers over limit | count, names | W6 | O1 |
| Active holds | count, releases with Finance | W2 / W3 | O4 |
| Overdue receivables | ₹, oldest days | W6 | O3 |
| Action center | Needs action / Updates | the item | all |
| Exposure vs limit chart | per customer, with table view | Customer 360 | O1, O3 |
| Customer risk watchlist | on hold, over limit, hold suggested, overdue | Customer 360 | O3 |
| My worklist | count per W1–W7 | the W screen | O2–O6 |
| Credit checks this month | passed, held, rejected, blocked | Credit Decisions | O1 |

## 6. Reports (derived from the cards)

Every report has: period (today → financial year Apr–Mar → custom range) · click-to-sort · Export CSV.

| Report | Kind | Needed by | Section |
|---|---|---|---|
| Customer 360 | Register + Record | W1–W6 | Customer |
| Party-wise Customer Log | Record history | W2, W3, audit | Customer |
| Credit Decisions | Register | W1 | Activity |
| Credit Hold Log | Register | W2, W3 | Activity |
| Limit Reviews & Changes | Register | W4, W5 | Activity |
| Approval Log | Audit trail (append-only) | all | Activity |

---

## 7. What this asks of the engine

**Objects**
- **Customer (finance fields):** credit limit, terms, risk band and source, hold flag, last review, next review due, suggested limit
- **SO header (credit):** credit result, exposure snapshot, risk reasons, credit decision
- **Credit Hold Log:** customer, placed by, reason, release requested by, released by, exposure at release
- **Hold waiver:** reason, watch until
- **Limit review / limit change:** old, proposed, reason, batch, who agreed, who approved
- **Approval Log:** every credit action, including refused attempts. Append-only.
- **My rule:** type, customer or band, %, end date, reason, status (active, waiting, rejected, ended, ended because things got worse), who approved, asked by, who was told, what it did
- **Rule ask:** from (Finance Controller or Sales Manager), instruction or request, the rule asked for, message, status (open, rule set, done, declined), answer

**Actions:** the **Writes** rows of §3.

**Events:** `SORoutedForCredit` · `SOCreditCleared` · `SOCreditRejected` · `CreditHoldPlaced` · `HoldReleaseRequested` · `HoldReleased` · `LimitRecommended` · `LimitChangeChecked` · `LimitApproved` · `MyRuleSet` · `MyRuleApproved` · `MyRuleEnded`

**Reads from other capabilities:** AR/AP for exposure, overdue, DSO, broken promises and dishonours · Parties for customer identity.

**Rules inside the actions (never only in the UI)**
- A hold hard-blocks every new SO, whatever the value.
- Only the Finance Controller releases a hold. Every release is logged.
- No Sales role can release a hold.
- Reject, hold, don't-hold, release request and bulk review all need a reason.
- A limit changes only after Accounts Executive edit → Credit Controller check → Finance Controller approval.
- An advance-only customer cannot be held through an order.
- Every other flag is an alert for a person, never a silent rejection.
- A rule is checked inside the action, not only on screen. Beyond my limits it waits for the Finance Controller; a "never" rule is refused and logged.
- A rule never takes a credit decision, never hides work from My queue, and never outlives its end date.

**Parameters** (configurable; the defaults are the company rules in the app)

| Parameter | Default | Used by |
|---|---|---|
| Route to queue | exposure + SO > limit | W1 |
| Hold suggestion: utilisation | ≥ 80 % of limit | W2 |
| Hold suggestion: behaviour | DSO rising 3 months **and** ≥ 2 broken promises | W2 |
| Watch period when not held | 7 / 14 / 30 days | W2 |
| Band factor | A 1.2 · B 1.0 · NEW 1.0 | W4 |
| Risk factor | × 0.8 | W4 |
| Dishonour window | 90 days | W1, W4 |
| Overdue penalty | > 30 days | W4 |
| Review cycle / maximum age | 3 months / 12 months | W4 |
| Quiet a customer: alone / with Finance Controller | 14 days / 30 days | W7 |
| Longest any rule runs | 90 days | W7 |

---

## 8. Decisions

| # | Question | Decision | Rests on |
|---|---|---|---|
| 1 | Status of an SO the Credit Controller declines | **Rejected**, mandatory reason, shown to the Sales Executive | Team |
| 2 | Order of credit gate and Sales Manager | **Credit first**, then commercial terms | Team |
| 3 | What triggers the check | Every SO on credit, automatically when raised | Team |
| 4 | Who approves a new limit | **Finance Controller** | Team |
| 5 | Sales Manager's release request | To the Credit Controller first (endorse), then the Finance Controller | Team |
| 6 | Orders that pass automatically | Info notification · Agree is recorded · Hold anyway allowed until dispatch | This seat (C3) |
| 7 | Deciding not to hold a suggested customer | Allowed with a reason and a watch period; not suggested again until the watch date | This seat (C2) |
| 7a | Telling others about a hold decision | Both choices can notify Collections, Sales Manager, Sales Executive (default) and Finance Controller (optional). A notice only: no approval, no state change. | Demo feedback · W2 coordination with Collections |
| 8 | Many limits at once | Bulk review in W4; each customer still goes through W5 and the Finance Controller separately | CA review |
| 9 | Customer hold vs order hold | Holding an order sets the customer's hold flag, so it is a customer hold | CA review |
| 10 | Vendors | Not this role | Roles document §9 |
| 11 | Rules the occupier sets | Every role gets a **Rules allowed** field: ✅ myself · 🟠 approver · ❌ never. Principle: quieter or stricter, never skip a decision or loosen a control. For this role the approver is the Finance Controller. | Demo feedback |
| 12 | Auto-agree a limit change that matches my recommendation (W5) | **Not allowed.** Maker-checker means a person checks every limit change. | CA (four-eyes) |
| 13 | A rule asked for by someone else | Finance Controller **instructs** (her approval comes with it); Sales Manager can only **request** (I may decline, with a reason). Acting on it is optional. | Demo feedback |
| 14 | Who is told when I set a rule | Only the people it affects (and whoever asked), not everyone: a quiet rule exists to reduce noise. | Demo feedback |

## 9. In the mockup

- **One queue (built):** Actions → **My queue** shows every row of §4 in three tabs: Needs me · Waiting on others · Coming up. Filter by kind; each row opens its W screen. The six W cards stay as the **Workflows** view.
- **Coming up (built):** customers not held and being watched (until the watch date), and limit reviews due in the next 30 days.
- **My rules (built):** Actions → W7 **Set My Rules**; **Customer 360** and **W6** customer panel ("My rules for this customer", no alert needed); **Set a rule** on alerts in the Action center and in W2. The dialog answers live (✅ / 🟠 / ❌). Usha approves from the Scenario panel. **Asks:** Scenario panel → "Ask Farid for a rule" (Usha instructs, Nisha requests) → notification with **Set as rule / Mark as done / Decline**; W7 → "Asked of me".
- **To test with a real occupier (C1):** whether they start from the queue or from the W cards; which rules they actually ask for.
