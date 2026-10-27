# Credit Controller — Task-by-Task Atomicity Analysis

**Purpose:** For each Credit Controller task (T1–T7), give the full task card, then apply the atomicity thumb rule: what the task is, what is only a step inside it, what might split or merge, and what to ask the role holder.

**Status:** Working analysis — proposals, not approved changes
**Role:** Credit Controller
**Sources:**
- `roles/finance/credit-controller.md` (role file) and `research/responsibilities-and-tasks-notes.md` (notes), 13 October 2026
- `research/credit_controller.md` (the earlier W1–W7 task cards)

**Method:** `credit_controller_atomic_task_discovery1.md` (discovery and validation) and `credit_controller_task_atomicity_review.md` (first review)

---

## 1. Why this document exists

- The notes list 2 responsibilities and 7 tasks, but don't test each task against the atomicity rule.
- The full task cards (trigger, subject, decision, hand-off …) are in `credit_controller.md`, but numbered W1–W7, with five responsibilities and two flows that have since changed.
- This document puts both together: **one current card per task, then the test.**
- The discovery document says: collect the real work from the role holder first, then compare. This document is the **comparison side**. Use it **after** the interview, not instead of it.

## 2. Definitions and the thumb rule

### What we mean by task and responsibility

| Word | Definition we use | Where it comes from |
|---|---|---|
| **Task** | A piece of work owned by one role that is worth calling done on its own. It has an identifiable start and end, serves a specific result, and has an observable completion outcome. It may contain multiple steps, but those steps are not separate tasks unless they represent independently owned and trackable work. | `roles/README.md`+internet ("What the words mean") · job analysis: a task has an identifiable beginning and end and is observable |
| **Responsibility** | The business result that a group of tasks exists to achieve. It is something the role must keep right and be accountable for if neglected. It is expressed as an outcome, not an activity. | `roles/README.md` + internet· Key Result Area practice: an area of accountability expressed as an outcome |

**Telling the words apart:**

| Word | What it is | Credit Controller example |
|---|---|---|
| Responsibility | The result the role answers for | R1: each order and customer gets the right credit answer |
| Task | One unit of work, done on its own | T1: Decide an order sent for credit review |
| Step | One action inside a task, not tracked alone | Read the customer's exposure |
| Decision | The choice that ends a task | Approve · Reject · Hold |
| Outcome | What is true when the task is done | A decision with a reason is on the order |

**Test for a responsibility:**

| Test | Question |
|---|---|
| **Outcome** | Is it a result, not an activity? ("Limits are right", not "review limits") |
| **Answerable** | Would the role answer for it if it were neglected? |
| **Same why** | Do its tasks share this one reason? |
| **Measurable** | Is there an indicator that shows whether it is kept? |
| **Fails both ways** | Is it broken by doing too much (blocking everything) as well as too little? |

- **How many:** our README expects **1 to 3** per role. KRA practice often says 4 to 7. We follow the README: a smaller role, and responsibilities found from the tasks' whys.

### The thumb rule for a task

**A task is one unit of work with its own trigger, owner, purpose and end, that can be tracked on its own.**

| Test | Question |
|---|---|
| **Trigger** | Does a clear event or request start it? |
| **Owner** | Is this role accountable for finishing it? |
| **Purpose** | Does it have one business objective? |
| **Completion** | Is there a clear end state someone can check? |
| **Independence** | Can it be assigned and tracked without being a step of another task? |
| **Boundary** | Are the inputs, decision and hand-off clear against the neighbouring tasks? |

**How to read the result:**
- **Keep as one task:** several actions lead to one result.
- **Split:** parts have their own trigger, owner and end, and one can finish while the other is pending.
- **Merge:** two labels describe the same work and end.
- **Don't decide yet:** owner, trigger, authority or end is unclear. Write the question down.
- A different **trigger, screen, button or field alone** is never a reason to split.

**Marks:** ✅ passes · 🟠 passes, but validate · ❓ unclear
**Status labels** (from the discovery doc): **Fact** · **Proposal** · **Open question**. Nothing here is **Confirmed** yet.

### Task types (to choose the screen later)

**Why:** a task's type says which screen template it will need. It is a reference for the templates, not a design. Types are from `docs/shared_docs/taxonomy.md`; our policy is `credit_controller_task_types.md`.

**How to read it from the card:** *Done when* and **Decision** give the type · **Subject** gives one or many · **Hand-off** separates Ask from Decide. **One type per task:** if two fit, check whether it is two tasks.

**A task is this type only if all its tests are true:**

| Type | Tests (all true) | Not this type if |
|---|---|---|
| **Decide** | 1. Something arrived ready-made (an order, a suggestion, an edit, a copy) · 2. The role picks one of a few set outcomes · 3. The choice is recorded on that item · 4. The role owns the choice: it ends without anyone else's approval | The role writes the content (Make) · it ends "with someone" (Ask) |
| **Ask** | 1. The role can't do or decide it itself · 2. Done when the request is with a named person · 3. The role gives what that person needs to say yes · 4. It is asked for the first time | It was asked before (Chase) |
| **Answer** | 1. Someone asked a question · 2. Done when the asker has the answer · 3. Nothing in the system changes | The answer needs a new decision (that is another task) |
| **Chase** | 1. The item is already with someone else · 2. It has waited too long · 3. Done when they have been reminded; nothing is handed over | It is the first request (Ask) |

**What each type means for the screen:**

| Type | Screen shows | User puts in | Then | Never | Pattern |
|---|---|---|---|---|---|
| **Decide**, one | The item and its evidence, side by side | One choice; a reason only on departure | Someone else's move | Approve on a list row (hides the evidence) | **Review** |
| **Decide**, many at once | One row per item, the light evidence on the row | The choice on each row | Each item moves on alone | One sign-off for all | **Worklist** |
| **Ask** | The item, and what the receiver needs to say yes | What is asked and why; often one press | The receiver's move; a Chase if it waits | A page of its own, away from the item | **Form on the item** |
| **Answer** | The one thing asked about, in seconds | Nothing; the reply goes to the asker | Nothing, unless the answer shows a problem | A report to scroll while someone waits | **Search + item page** |
| **Chase** | Who has it, since when, what was sent before | One press; the words drafted | Nothing changes hands; the count restarts | A chat with no trace | **One action on the item** |

Not used by this role: Make, Record, Assess, Report, Carry through, Run a batch.

## 3. The task card, and how it feeds the test

Every task below has the same 15-field card as `credit_controller.md`, plus one new field, **Type**. The role file's three columns sit inside it: **Starts when** → Trigger · **Done when** → Decision and Writes · **Hands over to** → Hand-off.

| Card field | Meaning/question | Feeds which test |
|---|---|---|
| Serves | what Responsibility and the outcome it answers for | Purpose |
| Trigger & cadence | What starts it, how often | Trigger |
| Subject | what is The one thing the task acts on | Independence, Boundary |
| Requires | What must be true to start | Trigger |
| Sees | what facts used to decide | (steps, not tasks) |
| Decision | what choices that end it | Completion |
| Writes | what record it leaves | Completion |
| Hand-off | Who gets it next | Owner, Boundary |
| Sends | what Messages that go out | (steps, not tasks) |
| Held by | Whose move it is (Needs me · Waiting on others · Coming up) | Owner, Independence |
| Exceptions | what are the cases flagged for attention | — |
| Parameters | what Company rules it uses | — |
| Rules allowed | Standing rules the holder may set (✅ myself · 🟠 approver · ❌ never) | — |
| Indicators | How you see that the responsibility is kept | Purpose |
| **Type** (new) | What kind of work it is, one or many, and the screen pattern it gets (§2, Task types) | Boundary (two types → maybe two tasks) |
| Screen | Where it lives in the app | (never a reason to split) |

**What changed since the W cards (Fact):**

| Was (W cards) | Now (role file and notes) |
|---|---|
| Five responsibilities, R1–R6 | Two: R1, R2 |
| W1–W7 | T1–T7. W1 → T1 · W2 → T1 (an order) and T2 (a customer) · W3 → T3 · W4 → T4 · W5 → T5 |
| W3: endorse or decline the Sales Manager's request (Decision 5) | Removed. The Finance Controller decides alone; this role is only told (notes, question 8) |
| W5 / W4: the **Finance Controller** approves the new limit (Decision 4) | The **Accounts Manager** confirms (§11, §12, B5-07; notes, question 4) |
| W6 Read live exposure | Not a task: information all tasks use |
| W7 Set my rules | Not in the role file: about the app, not the role |
| — | New: **T6** Answer Sales · **T7** Check a credit-days deviation |
| Outcomes O1–O6 | Outcomes stated per responsibility, which "fail both ways" (role file) |

## 4. Responsibilities: the test

| Responsibility | Tasks | Shared why | Outcome (role file, short) | Check |
|---|---|---|---|---|
| **R1** — Govern customer credit risk and credit-release decisions | T1, T2, T3, T6 | Each order and customer gets the right credit answer now | Routed orders decided on the day they arrive · nothing goes out without a decision · worsening customers held, or left open with a reason · no hold stays after its reason has gone | ✅ One why |
| **R2** — Oversee customer credit limits and commercial credit terms | T4, T5, T7 | The limits and terms the gate works from are correct | Limits match what the customer can carry, raised as surely as cut · every limit edit and credit-days deviation checked | ✅ One why |

**Against the responsibility test (§2):**

| Test | R1 | R2 |
|---|---|---|
| Outcome | ✅ The right credit answer, not "review orders" | ✅ Correct limits and terms, not "review limits" |
| Answerable | ✅ Bad debt, or good customers held up | ✅ Limits too high or too low, wrong credit days |
| Same why | ✅ T1, T2, T3, T6 | ✅ T4, T5, T7 |
| Measurable | ✅ Routed orders undecided · holds left after the reason has gone | ✅ Customers past the review period · edits not checked |
| Fails both ways | ✅ "Stop the risky ones, don't hold up the good ones" | ✅ "Raised as surely as cut" |

- **Result:** both pass. No change to R1 or R2 proposed.
- **Fact:** the notes' "at a glance" uses these names. The role file and the notes' "whys" table still say "Give credit only where it will be paid" and "Keep credit limits and payment terms correct". **Pick one set of names.**

## 5. Summary

| Task | Subject | Type → Pattern | Meets the task definition? (§2) | Thumb rule result | Main thing to validate |
|---|---|---|---|---|---|
| **T1** Decide an order sent for credit review | One Sales Order | Decide → Review | ✅ Start, end and a recorded decision | ✅ **Keep as one task** | Is reject allowed? Is holding the order part of T1? |
| **T2** Place a credit hold on a customer | One customer | Decide → Review | ✅ Held, or left open with a reason | ✅ **Keep as one task** | Does "leave open with a reason" count as finishing it? |
| **T3** Request a credit-hold release | One hold | Ask → Form on the item | ✅ Ends when the request is sent | ✅ **Keep as one task** (ends at the hand-off) | What happens after a refusal? |
| **T4** Review credit limits | One customer's limit | Decide, many at once → Worklist (🟠 or Ask) | ✅ Kept, or a change requested | 🟠 **Keep as one task**, with 3 triggers | Is the quarterly review one piece of work, or one per customer? |
| **T5** Check a credit-limit edit | One limit edit | Decide → Review | ✅ Agreed or objected | ✅ **Keep as one task** | Who confirms: Accounts Manager or Finance Controller? |
| **T6** Answer whether a customer can take an order | One question | Answer → Search + item page | 🟠 Has an end ("answered"), but no decision, and may not be tracked | ❓ **Don't decide yet** | Is this tracked work, or just giving information? |
| **T7** Check a credit-days deviation | One order's credit days | Decide → Review (🟠) | ❓ Has an end, but is it this role's work, and does it change anything? | ❓ **Don't decide yet** | Is this the role's work at all? |

- **Each task has its own subject.** That is the main reason no merge is proposed.
- **No split proposed.** Two tasks (T6, T7) may not be tasks at all.

---

## 6. Task by task

### T1 — Decide an order sent for credit review

**Task card** (from W1; changes marked)

| Field | Value |
|---|---|
| Serves | **R1** → routed orders decided on the day; nothing goes out over the limit without a decision |
| Trigger & cadence | The credit check routes a Sales Order (over the limit, money overdue, or a bounced payment). Every SO on credit is checked when raised, including bulk imports and SOs from a Proforma. Daily. |
| Subject | **Sales Order**, credit part: credit result, reasons, exposure snapshot, decision |
| Requires | The customer has a credit limit (an advance-only customer gets no credit) · live exposure |
| Sees | SO value and why it was routed · limit vs exposure (open invoices + open SOs + not billed + this order) · overdue and ageing trend · bounced cheques, broken promises, risk band |
| Decision | **Approve** · **Reject** (reason) · **Hold** (reason). App only, not in the role file: on an auto-passed order, **Agree** or **Hold anyway** |
| Writes | `SalesOrder.CreditApprove` · `SalesOrder.CreditReject` · `SalesOrder.CreditHold` · (`SalesOrder.CreditAgree`) |
| Hand-off | Approved → **Sales Manager** (commercial terms) · Rejected or held → **Sales Executive** sees the reason |
| Sends | Arun already sees the routing reason from the system (B1-05) |
| Held by | Routed → **Needs me** · Approved → Sales Manager, **Waiting on others** · Rejected → Sales Executive · Held → see T3 |
| Exceptions | Over limit · overdue · bounced cheque in 90 days · customer already on hold (hard block, never reaches T1) |
| Parameters | Route when exposure + SO value > limit · dishonour window 90 days |
| Rules allowed | ✅ Auto-agree auto-passed orders, band A · 🟠 band B · ❌ band NEW · ❌ auto-pass routed orders (instead: propose a higher limit, T4) |
| Indicators | Routed orders with no decision (zero) · oldest routed order (decided the same day) |
| **Type** | **Decide**, one → **Review** · Decide tests 1–4 ✅ |
| Screen | Tasks → **T1**: Waiting for you · Passed automatically · Decided → decision at the foot |

- **Evidence:** reference §9.1 "Review SOs routed for credit approval"; scenario B1-05, B3-01 (SO-2).

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | The credit check routes one order |
| Owner | ✅ | An independent gate; no second approver (B3) |
| Purpose | ✅ | One credit answer for one order |
| Completion | ✅ | A decision with a reason is recorded on the order |
| Independence | ✅ | One order can be decided while others wait |
| Boundary | 🟠 | Overlaps with "place credit holds" (§9.1): SO-2 is reviewed on 05-Oct (B3-01) and held on 06-Oct (B3-02) |

**Steps inside T1 (not tasks):** open the order and see why it was routed → read the exposure → read the payment signals → decide → write the reason.

**Split or merge considered**
- **Split "review" and "hold the order"?** **No (Proposal).** The hold is one of T1's three outcomes. A day between reading and deciding doesn't make two tasks.
- **Merge with T2?** **No.** The subject differs: one order vs one customer. Decision 9 says holding an order sets the customer's hold flag, but the work starts from a routed order.
- **Auto-passed orders (Agree / Hold anyway)?** A different trigger and no routing, so it may be its own task or not role work at all. **Ask.**

**Verdict:** ✅ Keep as one task.

**Ask the role holder**
- Can a routed order be rejected, or only approved or held? (notes, question 1)
- When you hold a routed order, is that the end of the review, or separate work?
- Do you look at orders that passed automatically? If so, is that part of T1? (old card belief C3)
- Is there a time limit for deciding? (notes, question 7)

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last order you decided. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the order from my queue" | Order | Picked | From the list of routed orders | Yes |
| "I see the customer, value and why it came to me" | Customer · SO value · Routing reason | Shown | — | — |
| "I see the limit and what they owe" | Limit · Exposure · Overdue · Risk band | Shown | Amounts | — |
| "I approve, reject or hold" | Decision | Entered | Approve · Reject · Hold | Yes |
| "I write why" | Reason | Entered | Text | Yes for Reject and Hold · Approve: **ask** |
| "It goes to Sales" | Sent to | Shown | Sales Manager (approved) · Sales Executive (rejected or held) | — |

Can't send when: no decision · Reject or Hold with no reason.

### T2 — Place a credit hold on a customer

**Task card** (from W2)

| Field | Value |
|---|---|
| Serves | **R1** → customers whose payments are getting worse are held, or left open with a reason, before they cross the limit |
| Trigger & cadence | The system suggests a hold, or the role sees it in the customer's figures. As needed (daily scan). |
| Subject | **Credit hold** on the customer: hold flag + Credit Hold Log entry, or a "not held" decision |
| Requires | A credit customer · a reason |
| Sees | Why it is suggested · exposure, % used, overdue, DSO trend, broken promises, dishonours |
| Decision | **Place hold** (reason) · **Don't hold, keep watching** (reason, 7 / 14 / 30 days) |
| Writes | `Customer.PlaceHold` · `Customer.DeclineHold` (both can carry a notice) |
| Hand-off | None. A hold is an independent gate. Stores sees it in the dispatch plan. |
| Sends | **Hold notice** or **hold warning** to Collections, Sales Manager, Sales Executive (default) and Finance Controller (optional). Drafted, editable, logged. |
| Held by | Suggested → **Needs me** · Not held, watching → **Coming up** until the watch date · On hold → T3 when the reason goes |
| Exceptions | Hold suggested and not decided |
| Parameters | Suggest at the company's hold level of the limit (80 %) **or** DSO rising 3 months with ≥ 2 broken promises · watch 7 / 14 / 30 days |
| Rules allowed | ✅ Quiet a customer's alerts ≤ 14 days · 🟠 15–30 days, or a customer over its limit · ❌ longer, or stop suggestions for good · ❌ suggest later than the company level (instead: alert me earlier) |
| Indicators | Suggested holds not decided (zero) · customers at the hold level neither held nor with a reason |
| **Type** | **Decide**, one → **Review** · tests 2–4 ✅ · test 1 🟠: when the role spots it in the figures, nothing arrived (the system's suggestion is the usual start) |
| Screen | Tasks → **T2**: Suggested by the system · On hold · Not held: watching · Other customers → hold or don't-hold form |

- **Evidence:** reference §9.1 "Place credit holds"; scenario B3-02 (C-06 suggested and held the same day).

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | A suggestion from the daily scan, or the role's own reading |
| Owner | ✅ | Only the Credit Controller places holds |
| Purpose | ✅ | Stop a risky customer before it crosses the limit |
| Completion | 🟠 | "Held" is clear. "Left open" is only clear if a reason is required (notes, question 3) |
| Independence | ✅ | One customer at a time |
| Boundary | ✅ | The subject is the customer, not an order (that's T1) |

**Steps inside T2 (not tasks):** read the signals → decide → write the reason → notify (a notice is a step, not a task).

**Split or merge considered**
- **Split "assess the suggestion" and "place the hold"?** **No (Proposal).** Assessing is a step. Both endings come out of the same work.
- **The watch ends and the system suggests again** → a **new instance of T2**, not a new task.

**Verdict:** ✅ Keep as one task.

**Ask the role holder**
- Does a suggestion create work you must close, or is it only information?
- When you don't hold, must you write why? (notes, question 3)
- Do you hold without any suggestion? How often?

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last customer you held, or decided not to hold. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I select the customer" | Customer | Picked | From the suggested list, or any credit customer | Yes |
| "I see why the system suggests it" | Suggestion reason | Shown | — | — |
| "I see what they owe and how they pay" | Exposure · % used · Overdue · DSO trend · Broken promises · Dishonours | Shown | — | — |
| "I hold or don't hold" | Decision | Entered | Place hold · Don't hold, keep watching | Yes |
| "I write why" | Reason | Entered | Text | Yes for Hold · Don't hold: **ask** (notes, question 3) |
| "I watch for a while" | Watch period | Entered | 7 · 14 · 30 days | Yes, if Don't hold |
| "I tell Collections and Sales" | Notice to | Entered | Tick list: Collections, Sales Manager, Sales Executive (ticked) · Finance Controller (optional) | **Ask** |
| "I edit the message" | Notice text | Entered | Text, drafted for them | No |

Can't send when: no customer · no decision · Hold with no reason · Don't hold with no watch period.

### T3 — Request a credit-hold release

**Task card** (from W3; **endorse removed**)

| Field | Value |
|---|---|
| Serves | **R1** → no order or customer stays on hold after the reason has gone without a release request |
| Trigger & cadence | The reason for a hold has gone, for example the overdue is paid. As needed. |
| Subject | **Hold release request** |
| Requires | An active hold · a reason |
| Sees | What has gone (overdue paid, promise kept) and what hasn't (still over the limit?) · the held order's value |
| Decision | **Request release** (reason) |
| Writes | `HoldRelease.Request` |
| Hand-off | **Finance Controller** approves or rejects. Approved → hold cleared, the order moves on to the Sales Manager. |
| Sends | Exposure summary, attached by the system |
| Held by | Paid, still on hold → **Needs me** · Request sent → Finance Controller, **Waiting on others** |
| Exceptions | Hold still on although nothing is overdue |
| Parameters | — |
| Rules allowed | ✅ Remind me (e.g. check the promised payment) · ❌ release automatically when paid (instead: request release) |
| Indicators | Held customers with nothing overdue and no request (zero) · requests waiting, age |
| **Type** | **Ask** → **Form on the item** (opened on the hold) · Ask tests 1–4 ✅ |
| Screen | Tasks → **T3**: Active holds · With Finance Controller · Closed → request form |
| **Changed** | The Sales Manager's request goes straight to the Finance Controller. This role is only told: no Endorse or Decline (Decision 5 superseded). |

- **Evidence:** reference §9.1 "Request hold release"; scenario B3-03, B5-04 (C-02 pays ₹2,10,000; SO-2 still ₹25,800 over), B2-07 (the Sales Manager's path).

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | The hold's reason has gone |
| Owner | ✅ | The Credit Controller requests; only the Finance Controller releases |
| Purpose | ✅ | Don't leave a good customer held |
| Completion | ✅ | The request is with the Finance Controller; the role's part ends there |
| Independence | ✅ | One hold, one request |
| Boundary | 🟠 | The Finance Controller's decision is **her** task. The Sales Manager's request (B2-07) is **his** task |

**Steps inside T3 (not tasks):** check what has gone → check what hasn't → write the reason → send.

**Split or merge considered**
- **Include the Finance Controller's decision?** **No.** Different owner.
- **The Sales Manager's request** → **not a task here** (notes, question 8).

**Verdict:** ✅ Keep as one task.

**Ask the role holder**
- If the Finance Controller refuses, what next? Is it a new T3 later? (notes, question 2)
- Do you request a release while the order still pushes the customer over the limit?

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last time you asked for a hold to be released. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I select the held customer" | Hold | Picked | From the list of active holds | Yes |
| "I see what has been paid" | Payment received · Overdue now | Shown | Amounts | — |
| "I see if it's still over the limit" | Exposure vs limit · Held order value | Shown | Amounts | — |
| "I write why it can be released" | Reason | Entered | Text | Yes |
| "I attach the payment proof" (if they say it) | Attachment | Entered | File | **Ask** |
| "The exposure summary goes with it" | Exposure summary | Shown | Attached by the system | — |
| "It goes to the Finance Controller" | Sent to | Shown | Fixed | — |

Can't send when: no hold selected · no reason.

### T4 — Review credit limits

**Task card** (from W4; **confirmer changed**)

| Field | Value |
|---|---|
| Serves | **R2** → limits match what the customer can carry; reviewed within the company's period; raised as surely as cut |
| Trigger & cadence | Every quarter · a limit not reviewed within the company's limit-review period · the Sales Manager's scorecard suggests a customer |
| Subject | **Limit review** per customer: keep or proposed limit, reason, batch ID when bulk |
| Requires | A credit customer · billing history for a suggested limit |
| Sees | Current vs suggested limit · on-time %, DSO, disputes, returns · order volume trend · risk band |
| Decision | **Keep** or **Propose** a new limit (up or down). One customer, or **Bulk review** with one reason |
| Writes | `LimitReview.Keep` · `LimitReview.Propose` · `LimitReview.Bulk` |
| Hand-off | **Accounts Executive** edits → this role checks (T5) → **Accounts Manager** confirms. Each customer separately, even in bulk. |
| Sends | — |
| Held by | Due or flagged → **Needs me** · Recommendation sent → Accounts Executive, **Waiting on others** · Due within 30 days → **Coming up** |
| Exceptions | Not reviewed within the maximum age |
| Parameters | Suggested limit = avg monthly billing × (credit days ÷ 30) × band factor (A 1.2, B 1.0, NEW 1.0) × 0.8 if a dishonour in 90 days or overdue > 30 days · review cycle 3 months · maximum age 12 months |
| Rules allowed | ✅ Remind me before a review · ❌ skip a review (the cycle is company policy) |
| Indicators | Customers past the review period (zero) · raises and cuts both happen |
| **Type** | **Decide**, many at once → **Worklist** (one customer → **Review**) · test 4 🟠: "Propose" hands the change to the Accounts Executive, so it could also be **Ask**. Proposal: keep Decide, with the request as the outcome that hands over |
| Screen | Tasks → **T4**: Needs review · Up to date → one customer, or Bulk review |
| **Changed** | The confirmer is the Accounts Manager, not the Finance Controller (Decision 4 superseded) |

- **Evidence:** reference §9.1 "Periodic credit-limit review"; scenario B2-05 (scorecard), B3-04 (C-01, C-02, C-05).

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | 🟠 | Three triggers: schedule, period lapsed, suggestion |
| Owner | ✅ | The Credit Controller reviews and recommends |
| Purpose | ✅ | The limit matches what the customer can carry |
| Completion | ✅ | Per customer: kept, or a change requested |
| Independence | 🟠 | The **unit is one customer**. A quarterly review is many units in one sitting (old card belief C4) |
| Boundary | ✅ | Ends at the Accounts Executive; the check of the edit is T5 |

**Steps inside T4 (not tasks):** read the suggested limit → read payment behaviour and the scorecard note → keep or propose → write the reason → send.

**Split or merge considered**
- **Split quarterly and single suggested reviews?** **No (Proposal).** Same work, same output, same owner. Only the trigger differs.
- **Bulk review** → **one task done many times** (Decision 8: each customer still goes through T5 separately).
- **Merge with T5?** **No.** Another role edits in between, and T5 has its own trigger and end.

**Verdict:** 🟠 Keep as one task, with three triggers. Validate.

**Ask the role holder**
- Quarterly review: one piece of work for all customers (one sign-off), or one decision per customer? (notes, question 5)
- Does "keep the limit" need a reason, or only a change?

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last time you asked for a limit change. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I select the customer" | Customer | Picked | From the list (several for bulk) | Yes |
| "I see the old limit" | Current limit | Shown | Amount | — |
| "I see what the system suggests" | Suggested limit | Shown | Amount | — |
| "I keep it or change it" | Decision | Entered | Keep · Propose | Yes |
| "I enter the new limit" | New limit | Entered | Amount | Yes, if Propose |
| "I write why" | Reason | Entered | Text (one for all in bulk) | Yes for Propose · Keep: **ask** |
| "From when" (if they say it) | Effective date | Entered | Date | **Ask** |
| "It goes to the Accounts Executive" | Sent to | Shown | Fixed | — |

Can't send when: no customer · Propose with no new limit, or the same as the current one · no reason.

### T5 — Check a credit-limit edit

**Task card** (from W5; **confirmer changed**)

| Field | Value |
|---|---|
| Serves | **R2** → every limit edit on the customer record has been checked by this role |
| Trigger & cadence | Per edit: the Accounts Executive changes a credit limit |
| Subject | **Limit change**: old vs new limit |
| Requires | An edit by the Accounts Executive (the maker) |
| Sees | Old vs new · my recommendation (if any) · suggested limit · exposure, overdue, risk band, last review |
| Decision | **Agree** or **Object** (reason) |
| Writes | `LimitChange.Agree` · `LimitChange.Object` |
| Hand-off | Agreed → **Accounts Manager** confirms; only then the record changes · Objected → back to the Accounts Executive |
| Sends | — |
| Held by | Edit waiting → **Needs me** · Agreed → Accounts Manager, **Waiting on others** · Objected → Accounts Executive, **Waiting on others** |
| Exceptions | New limit differs from my recommendation · new limit below current exposure |
| Parameters | — |
| Rules allowed | ❌ None. A person checks every limit change (maker-checker, Decision 12) |
| Indicators | Edits waiting for my check, count and age |
| **Type** | **Decide**, one → **Review** · Decide tests 1–4 ✅ |
| Screen | Tasks → **T5**: Waiting for your review · With Accounts Manager · Closed |
| **Changed** | Agreed edits go to the Accounts Manager, not the Finance Controller |

- **Evidence:** reference §11, §12; scenario B5-07.

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | One edit on the record |
| Owner | ✅ | This role checks; the Accounts Manager confirms |
| Purpose | ✅ | No limit change without a credit check |
| Completion | ✅ | Agreed or objected |
| Independence | ✅ | One edit, tracked on its own |
| Boundary | 🟠 | The confirmer: Accounts Manager (§11, §12, B5-07) vs Finance Controller (old Decision 4) |

**Steps inside T5 (not tasks):** compare with my recommendation and the suggested limit → check exposure against the new limit → agree or object.

**Split or merge considered**
- **Split "agree" and "object"?** **No.** They are the two ways T5 ends.
- **Merge with T4?** **No** (see T4).

**Verdict:** ✅ Keep as one task.

**Ask the role holder**
- Who confirms: the Accounts Manager or the Finance Controller? (notes, question 4)
- Do edits arrive that you never recommended? Same T5?
- After an objection, who acts: the Accounts Executive, or the confirmer?

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last limit edit you checked. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the edit waiting for me" | Limit edit | Picked | From the list of waiting edits | Yes |
| "I see the old and new limit, and who changed it" | Customer · Old limit · New limit · Edited by | Shown | — | — |
| "I compare with what I recommended" | My recommendation · Suggested limit | Shown | Amounts | — |
| "I check what they owe now" | Exposure · Overdue · Risk band · Last review | Shown | — | — |
| "I agree or object" | Decision | Entered | Agree · Object | Yes |
| "I write why" | Reason | Entered | Text | Yes for Object · Agree: optional |
| "It goes on" | Sent to | Shown | Accounts Manager (agreed) · Accounts Executive (objected) | — |

Can't send when: no decision · Object with no reason.

### T6 — Answer whether a customer can take an order (new)

**Task card** (new; no W card. Fields marked *Proposal* are ours.)

| Field | Value |
|---|---|
| Serves | **R1** → *Proposal:* the good customer is not held up by a wrong idea of their credit |
| Trigger & cadence | A Sales Executive or the Sales Manager asks why an order is stuck, or how much room a customer has. As needed. |
| Subject | **A question** about one customer or order |
| Requires | The customer (and order, if named) |
| Sees | Limit, exposure, headroom, overdue, hold, the order's credit result and reason |
| Decision | **Answer.** No credit decision. |
| Writes | *Proposal:* `CreditQuestion.Answer` (no engine action named yet) |
| Hand-off | None. The answer goes back to the person who asked. |
| Sends | The answer, to the asker |
| Held by | Question open → **Needs me** · Answered → done |
| Exceptions | The answer needs a new decision (release, limit), which is T3 or T4, not T6 |
| Parameters | — |
| Rules allowed | None defined |
| Indicators | *Proposal:* questions waiting, age |
| **Type** | **Answer** → **Search + item page** · Answer tests 1–3 ✅ |
| Screen | Tasks → **T6**: Waiting for an answer · Answered |
| **Old card** | Was under "Asked of it": answered **from a screen** (SO credit result, Customer 360), not as a task |

- **Evidence:** **not a §9 work item.** In the scenario the system tells Sales why an order is held (B1-05, B1-07). Notes, "where we differ" #1: our belief.

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | A question from Sales |
| Owner | 🟠 | The role answers, but the system already shows Sales the reason |
| Purpose | ❓ | Gives information; makes no credit decision |
| Completion | 🟠 | "Answered" is clear but light |
| Independence | ❓ | If the answer needs a decision, that is T1, T3 or T4 |
| Boundary | ❓ | The old card handled it as "Asked of it" (information on a screen) |

**Steps inside T6 (not tasks):** read the limit, exposure, headroom and hold → write the answer.

**Split or merge considered**
- **Merge into T1?** **Possible.** "Why is my order stuck?" is answered by T1's recorded reason.
- **Treat it as information, not a task?** **Possible.** That is how the old card handled it, and how the notes handle "read exposure".

**Verdict:** ❓ Don't decide yet. Keep the T6 ID for traceability.

**Ask the role holder**
- Do Sales really ask you, or does the system answer them? How often?
- Does anyone track whether you answered? If not, it's information.

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last question Sales asked you. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the question" | Question | Picked | From the list of open questions | Yes |
| "I see who asked, and about which customer or order" | Asked by · Customer · Order · Question text | Shown | — | — |
| "I check the room left" | Limit · Exposure · Headroom · Overdue · Hold · Order's credit result | Shown | Amounts | — |
| "I write the answer" | Answer | Entered | Text (or a standard answer: **ask**) | Yes |
| "It goes back to them" | Sent to | Shown | The person who asked | — |

Can't send when: no answer written.

### T7 — Check a credit-days deviation (new)

**Task card** (new; no W card. Fields marked *Proposal* are ours.)

| Field | Value |
|---|---|
| Serves | **R2** → every credit-days deviation the Sales Manager approves has been checked by this role |
| Trigger & cadence | The Sales Manager approves an order with credit days different from the customer's terms, and copies it to this role. As needed. |
| Subject | **Credit-days deviation** on one order |
| Requires | The order · the customer's credit days (terms) |
| Sees | Terms vs days on the order · risk band · overdue, DSO |
| Decision | **Accept** (note optional) or **Object** (reason) |
| Writes | *Proposal:* `CreditDaysDeviation.Accept` · `CreditDaysDeviation.Object` |
| Hand-off | Objected → **Sales Manager** · Accepted → none |
| Sends | The objection, to the Sales Manager |
| Held by | Copy received → **Needs me** · Objected → Sales Manager, **Waiting on others** |
| Exceptions | Longer days for a customer already paying late |
| Parameters | Customer credit days (master). No company rule for an allowed deviation. |
| Rules allowed | None defined |
| Indicators | Deviations not checked (zero) |
| **Type** | **Decide**, one → **Review** · tests 1–3 ✅ · test 4 🟠: if an objection changes nothing, it is closer to information |
| Screen | Tasks → **T7**: Waiting for your check · Checked |
| **Old card** | Not present |

- **Evidence:** **only in the Sales Manager's role file** (T1, T11). Not in the reference documents (notes, "where we differ" #2).

**Test**

| Test | Mark | Why |
|---|---|---|
| Trigger | ✅ | A copy from the Sales Manager |
| Owner | ❓ | Is it this role's job at all? (notes, question 6) |
| Purpose | ✅ | Payment terms match the customer's risk |
| Completion | 🟠 | The order is already approved: what does an objection change? |
| Independence | ✅ | One deviation, one check |
| Boundary | ❓ | Credit days are a customer finance field (§11); a deviation on one order isn't in any reference |

**Steps inside T7 (not tasks):** compare order days with terms → read risk band and overdue → accept or object.

**Split or merge considered**
- **Merge into T1?** **No.** Different trigger: a copy after approval, not a routed order.
- **Information only?** **Possible,** if an objection changes nothing.

**Verdict:** ❓ Don't decide yet.

**Ask the role holder**
- Do you receive these copies today? What do you do with them?
- If you object, does the order change, or is it only on record?

**What you fill in** (to find the form fields for the screen)

Questions, in order:
1. "Show me the last credit-days deviation you checked. What did you fill in, in what order?"
2. For each thing they name: "Do you enter it, or is it already there?" · "Do you type it, or pick it from a list?" · "Must you fill it, or can you skip it?" · "Is there a limit on what you can enter?"
3. "Do you attach anything, or tell anyone?"
4. "What would stop you from sending it?"

Expected answer (Proposal, to confirm), and the field it gives:

| They say | Field | Entered or shown | Type | Required |
|---|---|---|---|---|
| "I open the copy from the Sales Manager" | Deviation | Picked | From the list of copies received | Yes |
| "I see the customer's days and the order's days" | Customer · Order · Terms (days) · Days on the order | Shown | — | — |
| "I check how they pay" | Risk band · Overdue · DSO | Shown | — | — |
| "I accept or object" | Decision | Entered | Accept · Object | Yes |
| "I write why" | Reason | Entered | Text | Yes for Object · Accept: optional note |
| "It goes to the Sales Manager" | Sent to | Shown | Sales Manager (objected) · none (accepted) | — |

Can't send when: no decision · Object with no reason.

---

## 7. Not tasks

| Item | Why not | Status |
|---|---|---|
| Read live exposure (old W6, §9.2) | No decision; information every task uses. Still on the Dashboard and Reports → Exposure. | Fact (notes, L4) |
| Coordinate with Collections (§9.2) | Copies of final notices: information | Fact (notes, L4) |
| The Sales Manager's release request (their T13) | The Finance Controller decides alone; this role is only told | Fact (notes, question 8) |
| Set my rules (old W7) | About the app, not the role. Its **Rules allowed** rows stay on each task card. | Fact (notes) |
| Tell Collections and Sales about a hold | A step inside T2 (old Decision 7a: "a notice only") | Proposal |
| Bulk limit review | T4 done many times (old Decision 8) | Proposal |

## 8. Possibly missing tasks: ask, don't add

| Candidate | Where seen | Likely result |
|---|---|---|
| Check orders that passed credit automatically | Old W1 card, Decision 6, belief C3; app | A step of T1, a separate task, or not role work |
| Hold an order that already passed the credit gate | Old W1 "Hold anyway"; app | A T1 or T2 outcome |
| Re-assess a watched customer when the watch ends | Old W2, Decision 7; app | A new instance of T2 |
| After a refused release: re-request or escalate | Notes, question 2 | Depends on the answer |
| Answer the auditor ("who held, who released, why?") | Old card, "Asked of it" | Information from reports, not a task |
| Set a limit for a NEW customer | Not in the references | Ask: whose work is it? |

## 9. The three lists (before the interview)

**1. Proposed tasks** (none confirmed)
- T1, T2, T3, T5: pass the thumb rule.
- T4: passes; validate whether the quarterly review is one unit or many.
- T6, T7: kept as IDs, status **Open question**.

**2. Steps within tasks**
- T1: read the exposure, read the payment signals, decide, write the reason.
- T2: read the signals, decide, write the reason, notify.
- T3: check what has gone, check what hasn't, write the reason, send.
- T4: read the suggested limit, decide, write the reason, send.
- T5: compare with the recommendation, check exposure, agree or object.

**3. Open questions**
1. T1: Can a routed order be rejected? Is holding the order part of T1?
2. T1: Is checking auto-passed orders role work?
3. T2: Must "left open" have a reason?
4. T3: What happens after a refused release?
5. T4: Is the quarterly review one unit, or one per customer?
6. T5: Who confirms: the Accounts Manager or the Finance Controller?
7. T6: Tracked work, or information?
8. T7: Is it this role's job? What does an objection change?
9. R1: Is there a time limit for a credit decision?
10. Names: which R1 and R2 names are final?
11. T6, T7: engine actions (Writes) are not named yet.

## 10. Recommended next step

1. Run the interview in the discovery doc (§1, §2) **without** showing T1–T7 first.
2. Put the answers in its inventory (§3). The card fields in Section 3 here match the inventory's fields.
3. Compare with Sections 5–6: mark each task **Confirmed**, **Change** or **Remove**.
4. Settle the 11 open questions with the business owner.
5. Then update the role file, the notes and `credit_controller.md` (renumber W → T, drop endorse, change the confirmer). Keep the T1–T7 IDs where possible.

**Do not** add tasks to make the list look complete, or split a task because it has steps.

## 11. Source boundary

- Definitions of task and responsibility (§2): `roles/README.md` ("What the words mean", "How to find them"), checked against general practice: job analysis (a task has an identifiable beginning and end, and is observable; [knowledgejump](https://knowledgejump.com/hrd/tasks.html)) and Key Result Areas (a responsibility is an outcome, not an activity; [apps365](https://www.apps365.com/blog/key-result-areas/)). Agreed in the team meeting as the basis; the wording here is a **Proposal**.
- Task labels, triggers, ends, hand-overs, differences and open questions: role file and notes (**Fact**).
- Card fields (Subject, Requires, Sees, Writes, Sends, Held by, Exceptions, Parameters, Rules allowed, Screen): `credit_controller.md` W1–W5, updated to the role file where marked **Changed**.
- Task types and their screens (§2, the Type field): `docs/shared_docs/taxonomy.md` and `task-types-and-their-ux.pptx`, one seat's proposal, not adopted. The tests for each type and the type given to each task are **our reading** (**Proposal**).
- T6 and T7 cards are new. Fields marked *Proposal* are our reading.
- The ✅ / 🟠 / ❓ marks, steps, verdicts and the "possibly missing" list are **analysis for validation**, not approved business rules.
