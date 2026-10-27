# Credit Controller: demo guide (all 19 steps)

A simple, step-by-step guide to presenting the Credit Controller app.
For the detailed rules and answer keys, see `credit_controller.md` and `credit_controller_scenario.md`.

---

## 1. The story in one line

**Farid, the Credit Controller, protects the company from selling on credit to customers who may not pay.**
Every sales order is checked against the customer's credit limit. If there is a problem, the order comes to Farid. Farid can pass it, hold it or reject it. He can **never** release a hold himself. Only Usha (Finance Controller) can do that.

## 2. Where the names and numbers come from

- All names, customers and amounts are **made up**. They come from the shared scenario document all teams use: `docs/shared_docs/scenario/Full scenario.md`.
- The story is about **one biscuit company**:
  - Plant and HQ in Bengaluru (KA-01), plus a unit in Hosur (TN-01).
  - One working week, starting **Monday 05-Oct-2026**.
- Every team plays its own role in the **same story**, so all the apps can be tested against the same answers.
- **Farid is the character, Vijay is the developer.** In the app, you log in as Farid.

## 3. People in the demo (who is who)

| Name | Role (ID) | Who it really is | What they do in this story |
|---|---|---|---|
| **Farid** | Credit Controller (R-S03) | **You**, the person this app is built for | Checks credit, places holds, requests releases, recommends limits |
| Arun | Sales Executive (R-S01) | The salesperson who takes orders from customers | Raises sales orders SO-1 to SO-7 |
| Nisha | Sales Manager (R-S02) | Arun's boss | Approves prices and discounts; runs the Customer Scorecard; can ask Farid for a release |
| Usha | Finance Controller (R-FC01) | Senior finance person | The **only** person who releases a hold or approves a new limit |
| Teja | Accounts Executive (R01) | Accounts clerk who keeps the customer's finance details | Types the new credit limit into the customer master |
| Rajan | Accounts Manager (R02) | Teja's boss | Appears only in a refusal test: he cannot approve a limit alone |
| Collections | AR/AP team (R-S05) | Team that collects money from customers | Records C-02's payment |
| Latha | Stores / Inventory Officer (R-P02) | Runs the finished-goods warehouse | Ships SO-2 |
| Pooja | Billing Executive (R-B01) | Makes invoices | Invoices SO-2 |
| System | Automatic credit check | Not a person | Checks every order and runs a daily risk scan |

The full scenario also has purchase-side people (Ravi, Meena, Divya and others). They are left out here because their work does not touch the Credit Controller.

## 4. Customers and their limits (starting data)

**Who set these limits?** Nobody during the story. They **already exist on day 1** as starting data, like an opening balance. The story begins with these limits and amounts owed already in place.

| Code | Customer | State | Limit and credit days | Situation on 05-Oct | Why it matters in the demo |
|---|---|---|---|---|---|
| C-01 | Sri Lakshmi Distributors | KA | ₹15,00,000 · 30 days | Owes ₹4,00,000, nothing overdue | Good customer. Its limit can go **up** (₹18L) |
| C-02 | Chennai Retail Mart | TN | ₹10,00,000 · 45 days | Owes ₹8,20,000, of which ₹2,10,000 is 38 days overdue; 1 cheque bounced 62 days ago; 2 broken promises | **Problem customer**: its order gets held and its limit goes **down** (₹9.6L) |
| C-03 | Gulf Snack Imports LLC | UAE | Advance only | New export customer, pays in USD | Pays before delivery, so it never gets a credit check |
| C-04 | Healthy Bite Foods | KA | ₹3,00,000 · 15 days | ₹72,000 of work delivered, not yet billed | Shows that unbilled work still counts as exposure |
| C-05 | Namma Bakes | KA | ₹5,00,000 · 30 days | Limit not reviewed since 14-Aug-2025 | Overdue for review (**424 days**) |
| C-06 | Kerala Traders | KL | ₹5,00,000 · 30 days | Owes ₹4,10,000 (82% of limit); paying slower each month | Early warning, so the **whole customer** is put on hold |

## 5. How a credit limit is set or changed (in the real system)

The customer master is owned by Accounts, not by Farid:

| Step | Who | What they do | App screen |
|---|---|---|---|
| 1 | **Farid** | Reviews the customer and **recommends** a limit. He cannot type it in himself | W4 Review Credit Limits |
| 2 | **Teja** (Accounts Executive) | Enters the new limit in the customer master. It is **not live yet** | (Teja's own app) |
| 3 | **Farid** | Checks Teja's change from a credit point of view: agree or object | W5 Check Limit Changes |
| 4 | **Usha** (Finance Controller) | Gives final approval. Only now does the limit change | (Usha's own app) |

- The limit can also start from Teja, for example when a new customer is added. It still goes through steps 3 and 4.
- **One person can never change a limit alone.** Refusal tests CC-4 (Farid edits directly) and CC-10 (Rajan approves alone) prove this.
- Demo steps 14 to 17 play this exact flow for C-02: ₹10L → ₹9.6L.

**Line to say in the demo:** *"These customers already had limits when the week started. Here is how a limit gets changed, and why Farid alone can't change it."*

## 6. The app in 30 seconds

- **Dashboard:** what needs attention now. It has KPI cards, an exposure chart, an alerts inbox and a risk watchlist.
- **Actions → My queue:** everything open in one list, split into **Needs me / Waiting on others / Coming up**, with who has each item and since when. Click a row to open it.
- **Actions → Workflows W1–W7:** one icon per job (worklist item):

  | Code | Job |
  |---|---|
  | W1 | Review Credit Queue |
  | W2 | Place Credit Holds |
  | W3 | Request Hold Release |
  | W4 | Review Credit Limits |
  | W5 | Check Limit Changes |
  | W6 | View Exposure |
  | W7 | Set My Rules (new: quiet a customer, auto-agree, alert me earlier, remind me) |

- **Reports:**
  - Credit Hold Log
  - Credit Decisions
  - Limit Reviews & Changes
  - Approval Log
- **Bell icon (top bar):** notifications. Every new piece of work arrives here first. Orders that pass automatically also notify Farid ("Info"), so he always knows what went through.
- **MOCK launcher (bottom-left, dashed box):** plays what the other people do, and lets you **jump to any step** with the "Step N/19" dropdown. After a jump, alerts from earlier steps count as already seen: the Action center shows only open work and the last step's update. The bell keeps the full history.

> **Simple words:** "Exposure" means everything the customer owes us now plus what they will owe if we ship this order:
> open invoices + open orders + goods sent but not yet billed + this new order.

## 7. How to run the demo

1. Start the app with `npm run dev` in `credit-controller-app`.
2. Open the MOCK launcher and pick **Step 1/19** to start clean. Any other step also works.
3. **Other people's steps:** press ▶ Play. A notification appears in the bell, and usually on the dashboard.
4. **Your steps (Farid):** press → Go there. The app opens the right screen. Do the action yourself.
5. To show only one part, use the dropdown to jump straight there. All earlier steps are filled in automatically.

**Legend for the steps below:** 🔔 = notification Farid gets · 👤 = Farid does something · ⚙️ = happens without Farid.

---

## 8. The 19 steps

Steps 10 and 11 were merged into one step (10) after the CA review, so there are 19 steps.

### Day 1: Monday 05-Oct

#### Step 1 · Arun raises SO-1 for C-01 (₹7,60,725) 🔔
- **What happens:** Arun creates an order for a good customer.
- **System check:** exposure ₹11,60,725 is within the limit of ₹15,00,000. There is still ₹3,39,275 of room.
- **Farid gets:** 🔔 **Info** "SO-1 · Sri Lakshmi Distributors passed credit automatically". It is **not** in his queue. It is listed under W1 → **"Passed automatically: check if you want"**.
- **Farid can (optional):**
  - **Agree:** records "checked and agreed" with an optional note.
  - **Hold anyway:** stops the order even though it is within the limit, for example because Collections told him the customer can't pay. A reason is required. The order goes on hold and only Usha can release it.
- **What to say:** "Good orders don't wait for the Credit Controller. He's still told, and he can still step in if he knows something the numbers don't show."
- **Where to show it:** Reports → Credit Decisions shows SO-1 as **Passed automatically**, or "Passed automatically, agreed by you".

#### Step 2 · Arun raises SO-2 for C-02 Chennai Retail Mart (₹4,15,800) 🔔
- **What happens:** the system checks it and finds three problems:
  - **Over the limit:** exposure ₹12,35,800 against a limit of ₹10,00,000, which is **₹2,35,800 over**.
  - **Overdue:** ₹2,10,000 is past its due date.
  - **Bounced cheque:** 1.
- **Farid gets:** 🔔 **Critical** notification "SO-2 · Chennai Retail Mart needs credit approval". W1 shows badge **1**.
- **What to say:** "This is how work arrives. Farid does not go looking for problems. The order comes to him with the reasons."

#### Step 3 · Arun raises service order SO-6 for C-04 (₹1,06,200) 🔔
- **System check:** exposure ₹1,91,160 is well within the ₹3,00,000 limit. This includes ₹84,960 of goods sent but not yet billed.
- **Farid gets:** 🔔 Info "SO-6 passed credit automatically". He can Agree or Hold anyway, as in step 1.
- **What to say:** "Even goods not yet invoiced are counted, so nothing is hidden."

#### Step 4 · Arun raises SO-4 for C-05 Namma Bakes (₹56,700) 🔔
- **The catch:** the price is **below cost**.
- **Farid gets:** 🔔 Info "SO-4 passed credit automatically". He can Agree or Hold anyway.
- **What to say:** "A wrong price is a commercial problem for the Sales Manager. Farid only judges **credit risk**, so each role keeps to its own job."

#### Step 5 · 👤 Farid opens the Credit Queue and reviews SO-2
- **Where:** Actions → **W1 Review Credit Queue** → SO-2. You can also click the notification.
- **What Farid sees:**
  - Open invoices ₹8,20,000 + this order ₹4,15,800 = **₹12,35,800**.
  - Overdue ₹2,10,000.
  - Days past due getting worse: **12 → 25 → 38**.
  - 1 bounced receipt.
- **Farid does:** only reads it. The decision comes tomorrow.
- **What to say:** "Everything he needs to decide is on one screen: the numbers, the payment history and the trend."

### Day 2: Tuesday 06-Oct

#### Step 6 · The system's daily scan suggests a hold for C-06 Kerala Traders 🔔
- **What happens:** the overnight scan finds a customer who is **getting worse** but is not over its limit yet:
  - 82% of the limit is used.
  - DSO (days to pay) is rising: 41 → 48 → 55.
  - 2 broken payment promises.
- **Farid gets:** 🔔 **Warning** "Kerala Traders suggested for credit hold". W2 lists C-06.
- **What to say:** "The system warns Farid **early**, before the customer crosses the limit. It's a suggestion: Farid decides in step 9."

#### Step 7 · Arun converts a proforma into export order SO-3 for C-03 (₹9,39,840) 🔔
- **Farid gets:** 🔔 Info "SO-3 · Gulf Snack Imports: advance customer, not checked". C-03 pays in advance, so there is no credit risk.
- **Farid can:** only **Agree**, to record that he's seen it. There is no Hold button because no credit is given.
- **What to say:** "No credit given means no credit check."

#### Step 8 · 👤 Farid decides on SO-2: the scenario expects Place hold
- **Where:** W1 → SO-2 → **Place hold**.
- **Other choices:** he can also **Pass credit** or **Reject**. The later SO-2 steps (10, 11, 12, 18) then adjust or show as **Skipped** with the reason, so the scenario never gets stuck.
- **What Farid sees:** the reason is already filled in: "over limit by ₹2,35,800, ₹2,10,000 overdue, 1 bounced cheque". He can edit it.
- **Result:** the Credit Hold Log gets row 1, placed by Farid. SO-2 cannot be picked or shipped.
- **What to say:** "A hold always needs a reason, and every hold is written to the log."

#### Step 9 · 👤 Farid decides on the suggested hold for C-06: Place hold or Don't hold, and notify
- **Where:** Actions → **W2 Place Credit Holds** → C-06. Two buttons, and each dialog has a **Notify** section:

  | Choice | When to use it | What is recorded |
  |---|---|---|
  | **Place hold** (scenario default) | The warning signs are serious | Credit Hold Log row 2. The **whole customer** is on hold, and sales staff see a hold flag but have **no Release button** |
  | **Don't hold, keep watching** | Farid knows something the numbers don't show, e.g. "Spoke to the customer; payment promised this week" | A reason is required, and he picks a watch period (7, 14 or 30 days). It goes on the **Credit Hold Log as "Not held"** and on the Approval Log. C-06 moves to "Not held: watching" and isn't suggested again until the watch date |

- **Notify (both choices):** tells the people who can act.

  | Person | Ticked? | Why |
  |---|---|---|
  | Collections | ✅ | Can chase the overdue and get a payment promise |
  | Nisha (Sales Manager) | ✅ | Owns the customer relationship |
  | Arun (Sales Executive) | ✅ | Raises the orders; can ask for payment first |
  | Usha (Finance Controller) | ☐ | Only if the exposure is large |

  - The message is drafted from the signals, and Farid can edit it. The button becomes **Place hold & notify** or **Don't hold & notify**.
  - It is recorded as "Hold notice sent to Collections, Nisha, Arun" (or "Hold warning…" when not held) on the Approval Log and the Party log.
  - **Don't hold & notify** = watching, but reminding the others too.
- **Changing his mind:** after "Don't hold", **Place hold** is still available. The record then shows "Not held → later held".
- **What to say:** "W1 holds one order. W2 holds a whole customer. Even when Farid decides **not** to act, his decision and his reason are recorded, and Collections and Sales are told."

### Day 5: Friday 09-Oct

#### Step 10 · C-02 clears its overdue → 👤 Farid requests the release of SO-2 🔔 (two parts)
*Merged after the CA review: the payment and the release request are one business situation.*

**Part 1: Collections records that C-02 paid ₹2,10,000** (press ▶ Play)
- **Farid gets:** 🔔 "Chennai Retail Mart paid ₹2,10,000", with exposure now ₹10,25,800 (only ₹25,800 over) and nothing overdue. It adds: "A hold is active, so consider requesting a release."
- **W3:** shows SO-2 as ready for a release request.

**Part 2: Farid asks Usha to release the hold** (press → Go there)
- **The situation in plain words:**
  - On Tuesday Farid stopped SO-2 because Chennai Retail Mart owed too much and had ₹2.1L overdue.
  - On Friday the customer paid that ₹2.1L. Now nothing is overdue and they are only ₹25,800 over the limit.
  - So the reason for the hold has mostly gone, and the order should be allowed to ship.
- **The rule:** Farid placed the hold, but he is **not allowed to remove it**. Only Usha (Finance Controller) can. So Farid writes Usha a request: "please release it, and here's why".
- **Where:** Actions → **W3 Request Hold Release** → SO-2 → **Request release**.
- **What is sent to Usha:** Farid's reason plus a summary the app fills in:
  - Exposure ₹10,25,800.
  - ₹25,800 over the limit.
  - Nothing overdue.
- **Result:** the hold is **still on** until Usha decides in step 11. W3 shows the request as "With Finance Controller".
- **Real-life comparison:** a security guard can lock a gate, but only the manager has the key to open it. The guard can only call the manager and ask.

> **Optional alternative (not numbered):** Nisha (Sales Manager) asks for SO-2's release instead. Her request comes to **Farid first**, not to Usha. Farid **endorses** it ("I agree, send it to Usha") or **declines** it with a reason. Show it with ▶ on "Alternative path" in the timeline.

- **What to say:** "The customer fixed the problem, and Farid is told straight away. But Farid put the hold on and **cannot take it off**. He can only ask. That's separation of duties."

### Day 8: Monday 12-Oct

#### Step 11 · Usha (Finance Controller) approves the release 🔔
- **Farid gets:** 🔔 **Success** "Usha released the hold on SO-2".
- **Result:** the Credit Hold Log shows "released by Usha, exposure at release ₹10,25,800".
- **What to say:** "The log shows who held it, why, who released it, and the exposure at that moment."
- **Optional:** use "Reject instead" to show that the hold stays and Farid gets a critical alert.

#### Step 12 · Nisha approves SO-2's commercial terms 🔔
- **Farid gets:** 🔔 "SO-2 confirmed".
- **Result:** SO-2 is **Confirmed** and can be dispatched tomorrow.
- **What to say:** "The order goes through credit first, then the Sales Manager. Both had to say yes."

#### Step 13 · Nisha's Customer Scorecard suggests C-02 and C-06 for a limit review 🔔
- **Farid gets:** 🔔 "Scorecard: limit review suggested".
- **Result:** W4 now lists four customers:
  - C-01: review is due.
  - C-02: flagged by the Scorecard (on-time payment 55%, DSO 62 against 45 days).
  - C-05: not reviewed for **424 days**.
  - C-06: flagged by the Scorecard.
- **What to say:** "Limits are not set once and forgotten. They are reviewed on a cycle and whenever behaviour changes."

#### Step 14 · 👤 Farid reviews limits for C-01, C-02 and C-05
- **Where:** Actions → **W4 Review Credit Limits**. Do it one customer at a time, or all at once with **Bulk review** (top right of W4):
  - All customers due for review are pre-ticked. Each row has **Propose** or **Keep** and the new limit, pre-filled with the suggestion.
  - One reason applies to all of them. One click sends everything as one batch (e.g. LB-045).
  - Each customer is still recorded separately, and each change still goes Teja → Farid (W5) → Usha **on its own**.
- **The app suggests a limit:** average monthly billing × (credit days ÷ 30) × band factor, reduced to 80% for risky customers.

  | Customer | Calculation | Suggested | Farid does |
  |---|---|---|---|
  | C-01 | 15L × 1 × 1.2 | **₹18,00,000** (up) | **Propose new limit** |
  | C-02 | 8L × 1.5 × 1.0 × 0.8 (bounced cheque) | **₹9,60,000** (down) | **Propose new limit** |
  | C-05 | No billing history | — | **Keep current limit** |

- **What to say:** "Farid only **recommends**. He cannot change a limit himself. With bulk review he can do a whole quarter's reviews in one go."

#### Step 15 · Teja (Accounts) edits C-02's limit from ₹10,00,000 to ₹9,60,000 🔔
- **Farid gets:** 🔔 **Warning** "Teja changed Chennai Retail Mart's limit". It needs Farid's credit review.
- **Result:** the customer master **does not change yet**.
- **What to say:** "Whoever edits a limit, Farid checks it first and then Usha approves it. One person can never change a limit alone."

#### Step 16 · 👤 Farid checks Teja's change and agrees
- **Where:** Actions → **W5 Check Limit Changes** → C-02.
- **What Farid sees:**
  - Current and new limit.
  - How much of the limit is used under each.
  - Whether the change **matches his own recommendation**. Here it does.
- **Farid does:** **Agree**. The change goes to Usha. He could also **Object** with a reason.

#### Step 17 · Usha approves C-02's new limit 🔔
- **Why it may say "Do step 16 first":** Usha can only approve a change that Farid has already checked. Until Farid presses **Agree** in W5 (step 16), the change isn't in Usha's queue, so step 17 waits. Do step 16 first, then step 17 can play.
- **If Farid pressed Object in step 16:** the change goes back to Teja and never reaches Usha. Step 17 then shows **Skipped**, and the scenario moves on to step 18.
- **Farid gets:** 🔔 **Success** "Chennai Retail Mart's limit is now ₹9,60,000".
- **Result:** the customer master is updated, with last review 12-Oct-2026 and the next review in 3 months.
- **Where to show it:** Reports → Limit Reviews & Changes.

### Day 9 onwards: 13–14 Oct

#### Step 18 · Latha and Pooja dispatch SO-2 and invoice it (₹4,15,800) 🔔
- **Farid gets:** 🔔 "SO-2 dispatched and invoiced".
- **Result:** the open order becomes an open invoice, so **total exposure stays the same**.
- **What to say:** "The money moves from 'order' to 'invoice', but the risk is still counted."

#### Step 19 · Arun tries to raise SO-7 for C-06 while C-06 is on hold (₹1,51,200) 🔔
- **If Farid chose "Don't hold" at step 9:** C-06 isn't on hold, so SO-7 goes through the normal credit check. Exposure ₹4,10,000 + ₹1,51,200 = ₹5,61,200 is over the ₹5,00,000 limit, so SO-7 lands in **W1** for Farid to decide. The points below apply when C-06 **is** on hold.
- **Result:** the order is **blocked when Arun submits it**. It never reaches Farid's queue.
- **Farid gets:** 🔔 info "SO-7 for Kerala Traders blocked by credit hold".
- **Approval Log:** shows the attempt as **Refused**.
- **What to say:** "The hold Farid placed on Tuesday is still protecting the company a week later, with no extra work."

#### End · Scenario complete
- Everything is reconciled.
- Use the Reports tab to sum up the week:
  - **Credit Hold Log:** 2 holds, 1 released by Usha, plus any "Not held" decisions.
  - **Credit Decisions:** every order and its result.
  - **Limit Reviews & Changes:** C-01, C-02, C-05.
  - **Approval Log:** the full audit trail.
- **Customer reports (new):**
  - **Customer 360** → open C-02. It has an overview, a **Party log** of everything that happened to C-02, **What changed** (limit ₹10L → ₹9.6L, hold on and off, overdue ₹2.1L → ₹0, each with who, when and why) and **Orders**.
  - **Party-wise Customer Log** opens straight on a customer's log.
- **Every report has:**
  - A period picker: today, week, month, quarter, **financial year (Apr–Mar)**, previous FY, calendar year, all time or a custom range.
  - Click-to-sort columns and **Export CSV** (opens in Excel).
  - Activity reports also have a customer filter.

---

## 9. Extra: My rules (any time, no alert needed)

Farid can set rules that ease his own work, within limits set by his role. **A rule can make his work quieter or stricter. It can never skip a decision or loosen a control.**

1. **Reports → Customer 360 → C-06 Kerala Traders.** In **My rules for this customer** Farid sees what he can set for C-06: ✅ quiet up to 14 days, 🟠 auto-agree band B, ✅ alert me earlier, ✅ remind me. Click **Set a rule**. (No alert needed. After step 6, the same button is also on the "Kerala Traders suggested for credit hold" alert.)
2. **Quiet** C-06, change the days and watch the answer:

| Days | Answer | Button |
|---|---|---|
| 10 | ✅ You can set this yourself | Set rule |
| 20 | 🟠 Needs Usha (Finance Controller) to approve | Send to Finance Controller |
| 60 | ❌ Not allowed: a customer cannot drop out of sight. **Instead: 30 days** | disabled |

3. Set **10 days**, reason "Good payer, festival collections due" → **Set rule**.
   - The alert leaves the dashboard. W2 shows "Alerts quiet until 16-Oct-2026".
   - The hold suggestion **stays in My queue**: a rule hides alerts, never work.
4. **Actions → Set My Rules (W7)** → **What I can set**: the allowed rules and their limits, and the five rules that are **never allowed**.
5. **Set a rule → Auto-agree, band B** → Send to Finance Controller → MOCK panel → **Usha: Approve**.
6. In the dialog, open **Rules the Credit Controller can never set** → **Try** "Auto-pass orders routed over the limit" → refused, and logged in the Approval Log.
7. **When someone asks (upstream):** MOCK panel → **Ask Farid for a rule** → "Usha instructs: quiet Kerala Traders (C-06) for 30 days" → **Send**.
   - Dashboard → Action center: the instruction has **Set as rule** · **Mark as done**.
   - **Set as rule** → "Applies now: Usha's instruction is her approval" (30 days normally needs her) → **Set rule**. W7 shows **Asked by: Usha** and **Told: Usha**.
8. **A request from Sales:** MOCK panel → "Nisha (Sales Manager) asks: don't bother about Chennai Retail Mart (C-02) for 30 days" → **Send** → **Decline** with "The Credit Controller stays independent of Sales".
9. **Who is told:** in the dialog, "Who is told" lists only the people the rule affects. Remind me → "Nobody else is told".

**What to say:** "Farid does not wait for the system: he opens a customer and sets what his role allows. When his boss tells him, one click makes it a rule, and her instruction counts as her approval. Sales can only ask. Only the people a rule affects are told. Every role gets this field. What you may set, and who approves it, depends on the role. The system tells you, and suggests what you can do instead."

## 10. Bonus: refusal tests (show that the rules are enforced)

Open the MOCK panel → **Refusal tests** → **Try**. Each attempt is refused and logged in Reports → Approval Log.

| Test | Who tries | What they try | Result |
|---|---|---|---|
| C-10 | Nisha | Release SO-2's hold | ❌ Only the Finance Controller releases holds |
| CC-1 | Arun | Release a hold through the API | ❌ Sales roles cannot release holds |
| C-11 | Farid | Release his own hold | ❌ Farid can only **request** a release |
| CC-3 | Latha | Pick SO-2 while it is on hold | ❌ Not pickable |
| CC-4 | Farid | Edit a credit limit directly | ❌ He recommends in W4 instead |
| CC-9 | Usha | Release a request Farid has not endorsed | ❌ It must be endorsed first |
| CC-10 | Rajan | Approve a limit change alone | ❌ Needs Usha |

**Company rules editor** (also in the MOCK panel): change "Suggest a hold at %" from 80 to 85, and the app follows the new rule without any code change.

## 11. Three lines to close the demo

1. **Work comes to Farid.** Only problem orders and early warnings reach him, as notifications.
2. **Farid decides, but never alone.** He holds and recommends. Usha releases and approves.
3. **Everything is logged.** Every hold, release, limit change and refused attempt is in Reports.
