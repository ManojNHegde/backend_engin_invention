# Credit Controller: doc to mockup map

**What this is:** for each activity card in `credit_controller.md`, where it lives in the mockup (`credit-controller-app/`): the notification, the dashboard tile, the screen, the buttons and forms, where the result shows, and the report.
**Use it to:** show a reviewer that every card row has a place on screen, and that every screen element comes from a card.

---

## 1. The app in one look

| Part of the app | What it is | Card field it serves |
|---|---|---|
| **Dashboard** tab | 5 KPI cards + Action center + exposure chart + risk watchlist + my worklist + credit checks this month | Indicators (O1–O6) |
| **Action center** (on Dashboard) | Notifications split into **Needs action** (red/amber) and **Updates** (info/green). Each opens its item. | Trigger, Sends |
| **Actions** tab → **My queue** | Every open item in one list, in 3 tabs: **Needs me · Waiting on others · Coming up**. Filter by kind. Each row says who holds it and since when, and opens its screen. | Held by (§4 of the role doc) |
| **Actions** tab → **Workflows W1–W7** | One card per activity → opens that activity's screen | Screen |
| **My rules for this customer** (Customer 360 → Overview, W6 customer panel) + **Set a rule** button (Customer 360 header, alerts in the Action center, W2) | What I can set for this customer (✅ / 🟠 / ❌) and the rules already running; opens the rule dialog, which answers live. **No alert needed.** | Rules allowed |
| **My worklist** tile (Dashboard) | Needs me / Waiting on others / Coming up counts → opens My queue on that tab | Held by |
| Activity screen, **left list** | Items in groups, e.g. "Waiting for you", "Decided" | Held by |
| Activity screen, **right detail** | Customer and credit facts for the selected item | Sees |
| **Callouts and chips** | Warnings on the item, e.g. "Over limit", "Scorecard" | Exceptions |
| **Buttons** at the top of the detail | The decision, e.g. Pass credit / Place hold / Reject | Decision |
| **Dialog** after a button | Reason (required where the card says so), quick-pick reasons | Writes |
| **Reports** tab | Customer reports + Activity reports, with period, sort, filter, Export CSV | Reports (§6) |
| **Profile** (top right) | I can / I cannot (includes what rules I may set) | Authority, Rules allowed |
| **Scenario** panel (mock only) | Plays other roles' steps; **Usha approves or rejects my rules**; **Company rules** editor (incl. quiet 14 / 30 days) | Parameters, Hand-off |

---

## 2. Quick map

| Activity | Notification | Dashboard | Screen | My buttons | Report |
|---|---|---|---|---|---|
| **W1** Review credit queue | 🔴 "SO-x needs credit approval" · 🔵 "passed credit automatically" | Waiting for your decision · Credit checks this month | Actions → **Review Credit Queue** | Pass credit · Place hold · Reject · Agree · Hold anyway | Credit Decisions |
| **W2** Place credit holds | 🟠 "suggested for credit hold" | Active holds · Risk watchlist | Actions → **Place Credit Holds** | Place hold (& notify) · Don't hold, keep watching (& notify) · Request release | Credit Hold Log |
| **W3** Request hold release | 🔵 "paid ₹x" · 🟠 "Nisha requests release" · 🟢/🔴 Usha's decision | Active holds ("release with Finance") | Actions → **Request Hold Release** | Request release · Endorse & forward · Decline | Credit Hold Log |
| **W4** Limit review | 🔵 "Scorecard: limit review suggested" | My worklist | Actions → **Review Credit Limits** | Keep current limit · Propose new limit · **Bulk review** | Limit Reviews & Changes |
| **W5** Check limit changes | 🟠 "Teja changed X's limit" · 🟢/🔴 Usha's decision | My worklist | Actions → **Check Limit Changes** | Agree & send to Finance Controller · Object | Limit Reviews & Changes |
| **W6** Exposure | — (feed) · 🟠 "crossed your 70 % alert" (my rule) | Total exposure · Customers over limit · Overdue · Exposure chart | Actions → **View Exposure** | none (read only) | Customer 360 |
| **W7** My rules | none needed · 🟠 "Usha (Finance Controller): Quiet … for 10 days" (instruction) · 🟠 "Nisha (Sales Manager) asks: …" (request) · 🟠 "Reminder: …" · 🟢/🔴 "Usha approved / rejected your rule" | My worklist · My queue | Actions → **Set My Rules** · **Customer 360** / W6 panel · **Set a rule** on an alert or in W2 · **Set as rule** on an instruction | Set rule · Send to Finance Controller · Set as rule · Mark as done · Accept as rule · Decline · End now · Withdraw · Mark done | Approval Log · Party log (category **My rule**) |

All activities also show up in **Customer 360**, the **Party-wise Customer Log** and the **Approval Log**.

---

## 3. Flow of each activity

### W1 · Review SOs routed for credit approval

**Routed order (over limit)**
1. **Trigger:** Arun (Sales Executive) raises an SO and the credit check runs.
2. **Notification:** 🔴 "SO-2 · Chennai Retail Mart needs credit approval" → opens W1. Under **Needs action**.
3. **Dashboard:** "Waiting for your decision" goes up by 1.
4. **Screen:** Actions → Review Credit Queue → list group **Waiting for you**.
5. **Sees:** a callout "Routed to you: over limit by ₹…", with exposure split, overdue, bounced cheques, broken promises and risk band.
6. **Decide:**
   - **Pass credit:** dialog with Note; a warning if the order is over limit.
   - **Place hold:** dialog with reason (pre-filled).
   - **Reject:** dialog with reason (required).
7. **Result:** the order moves to group **Decided**. Pass → goes to Nisha (Sales Manager). Hold → customer on hold (see W2/W3).
8. **Report:** Credit Decisions · Approval Log · Customer 360 → Orders.

**Passed automatically**
1. **Notification:** 🔵 "SO-1 · … passed credit automatically", under **Updates**.
2. **Screen:** W1 → group **Passed automatically: check if you want**.
3. **Decide:** **Agree** (note optional) or **Hold anyway** (reason required). An advance customer gets Agree only.
4. **Result:** the order moves to **Decided**, and the log records "Agreed" or "Credit hold placed on an order already past the credit gate".
5. **Demo steps:** 1–5, 7, 8.

### W2 · Place credit holds

1. **Trigger:** the system's daily scan (≥ 80 % used, or DSO rising with broken promises).
2. **Notification:** 🟠 "Kerala Traders suggested for credit hold", under **Needs action**.
3. **Dashboard:** risk watchlist shows "Hold suggested".
4. **Screen:** Actions → Place Credit Holds. List groups: **Suggested by the system** · **On hold** · **Not held: watching** · **Other customers**.
5. **Sees:** callout "Hold suggested before the limit is crossed" with the signals · orders affected by a hold · hold decisions history.
6. **Decide:**
   - **Place hold:** dialog with reason.
   - **Don't hold, keep watching:** dialog with reason and **Keep watching for** 7 / 14 / 30 days.
   - **Notify** (in both dialogs): Collections, Nisha and Arun ticked, Usha optional. The message is drafted and editable. The button reads **Place hold & notify** or **Don't hold & notify**. Untick everyone to send nothing.
   - On a held customer: **Request release**, which jumps to W3.
7. **Result:** the customer moves to **On hold** or **Not held: watching**. "Active holds" on the dashboard changes. New SOs for a held customer are blocked (🔵 "SO-7 blocked by credit hold").
8. **Report:** Credit Hold Log (includes "not held" decisions) · Customer 360 → What changed (Hold flag) · Party log and Approval Log ("Hold notice sent to …" / "Hold warning sent to …"). The detail shows "Notified: …", and My queue → Coming up shows "Warned: …".
9. **Demo steps:** 6, 9, 19.

### W3 · Request credit-hold release

**Farid asks**
1. **Trigger:** Collections records a payment.
2. **Notification:** 🔵 "Chennai Retail Mart paid ₹2,10,000 … consider requesting a release".
3. **Screen:** Actions → Request Hold Release → group **Active holds**.
4. **Sees:** hold reason · "Nothing overdue now" (or "₹x still overdue") · earlier requests.
5. **Decide:** **Request release**: dialog with reason; the exposure summary is attached automatically.
6. **Result:** the request moves to group **With Finance Controller**, with the callout "Waiting for Usha" and a **Progress** tracker.
7. **Usha decides:** 🟢 "Usha released the hold" or 🔴 "Usha rejected the release". The request moves to **Closed**.

**Nisha asks (alternative)**
1. **Notification:** 🟠 "Nisha requests release of SO-2".
2. **Screen:** group **Sales Manager requests to endorse**.
3. **Decide:** **Endorse & forward** (your note) or **Decline** (reason).

- **Report:** Credit Hold Log (requested by, released by, exposure at release) · Approval Log.
- **Demo steps:** 10, 11.

### W4 · Periodic credit-limit review

1. **Trigger:** quarterly due date, or the Sales Manager's scorecard.
2. **Notification:** 🔵 "Scorecard: limit review suggested".
3. **Screen:** Actions → Review Credit Limits. Groups: **Needs review** · **Up to date**.
4. **Sees:**
   - "Suggested by Nisha's Customer Scorecard" (if flagged).
   - **Suggested limit** with the formula.
   - **Review history**.
5. **Decide, one customer:**
   - **Keep current limit:** dialog with note.
   - **Propose new limit:** dialog with new credit limit and reason.
6. **Decide, many customers:** **Bulk review (N due)** at the top right opens a table.
   - Each row: tick, Propose or Keep, new limit, change ▲▼.
   - One reason applies to all; **Send** creates a batch LB-xxx.
7. **Result:** the customer moves to **Up to date**. A proposal goes to Teja (Accounts Executive) and continues in W5.
8. **Report:** Limit Reviews & Changes (with the batch ID) · Customer 360 → What changed (last and next review date).
9. **Demo steps:** 13, 14.

### W5 · Check credit-limit changes

1. **Trigger:** Teja edits the limit on the customer record.
2. **Notification:** 🟠 "Teja changed Chennai Retail Mart's limit ₹10,00,000 → ₹9,60,000".
3. **Screen:** Actions → Check Limit Changes. Groups: **Waiting for your review** · **With Finance Controller** · **Closed**.
4. **Sees:** utilisation at current vs new limit · credit position · progress.
5. **Checks shown as callouts:**
   - Matches your recommendation.
   - Matches or differs from the suggested limit.
   - **Current exposure is above the new limit.**
6. **Decide:** **Agree & send to Finance Controller** (note) or **Object** (reason).
7. **Result:** the change moves to **With Finance Controller**, then 🟢 "limit is now ₹9,60,000" or 🔴 "rejected", then **Closed**.
8. **Report:** Limit Reviews & Changes · Customer 360 → What changed ("Edited by Teja, checked by Farid").
9. **Demo steps:** 15, 16, 17.

### W7 · Set my rules

**Quiet a customer (the Kerala Traders example)**
1. **Trigger:** my own choice. No alert is needed: "I know this customer is good."
2. **Start, any of:**
   - **Reports → Customer 360 → C-06** → **Set a rule** (header) or **My rules for this customer** → **Set** next to a rule. This box shows what I can set for C-06 (✅ / 🟠 / ❌) and the rules already running.
   - Actions → **View Exposure (W6)** → C-06 panel → same box.
   - Actions → **Set My Rules (W7)** → **Set a rule**.
   - On an alert in the Action center, or in W2: **Set a rule**.
3. **Dialog:** pick the rule (Quiet · Auto-agree · Alert me earlier · Remind me), the customer, the days and a reason. The answer shows live:
   - 10 days → ✅ "You can set this yourself" → button **Set rule**.
   - 20 days → 🟠 "Needs Usha (Finance Controller) to approve" → button **Send to Finance Controller**.
   - 60 days → ❌ "Not allowed" + **Instead: Quiet for 30 days**. Button disabled.
   - **Rules the Credit Controller can never set:** each with why, **Instead**, and **Try** (refused and logged).
4. **Result (✅):**
   - The open alert leaves the dashboard (still in the bell's history).
   - W2 shows "Alerts quiet until 16-Oct-2026: your rule MR-x".
   - My queue still shows the hold suggestion, with "alerts quiet until …".
   - My queue → Coming up: "Your rule ends".
5. **Result (🟠):** My queue → Waiting on others → Usha. Scenario panel → **Approve / Reject**. Then 🟢 or 🔴 to me.
6. **Things get worse:** a critical alert for that customer ends the rule ("Ended: things got worse") and comes through.

**Asked of me (upstream: instruction or request)**
1. **Trigger:** Scenario panel → **Ask Farid for a rule** → e.g. "Usha instructs: don't bother about Kerala Traders (C-06) for 10 days" → **Send**.
2. **Notification:** 🟠 "Usha (Finance Controller): Quiet alerts for C-06 Kerala Traders for 10 days", with **Set as rule** · **Mark as done** · Dismiss. Also in My queue → Needs me, and W7 → **Asked of me**.
3. **Set as rule:** the dialog opens filled in, with a box "Instruction from Usha · RA-x".
   - Usha's 30 days → ✅ "Applies now: Usha's instruction is her approval" (normally 🟠).
   - 60 days → still ❌. An instruction cannot open what is never allowed.
4. **Mark as done:** no rule; note optional (quick picks). Usha is told.
5. **Request from Nisha (Sales Manager):** **Accept as rule** (normal check) or **Decline** (reason required). Not an instruction: the Credit Controller is independent of Sales.
6. **Result:** W7 rule shows **Asked by** and **Told**. The ask shows "Rule set / Done, no rule / Declined".

**Who is told (downstream)**
- The dialog shows "**Who is told:** …" before you set the rule.
- Quiet → Usha · Auto-agree → Usha, Nisha · Alert me earlier, Remind me → nobody · plus whoever asked.
- Ended early, or ended because things got worse → the same people again. Each notice is on the Approval Log ("Rule notice sent to …").

**Other rules**
- **Auto-agree band A:** SO-1 (C-01) is agreed for me; W1 "Passed automatically" empties. Band B → Usha. NEW → refused.
- **Alert me earlier:** C-06 at 70 % → alert fires at once (it is at 82 %). 85 % → refused (not stricter than 80 %).
- **Remind me:** Coming up until the day, then 🟠 "Reminder: …" and Needs me → **Mark done**.

- **Screen:** list groups **Start here (What I can set)** · **Reminders due** · **Waiting for Finance Controller** · **Active** · **Ended**. Detail: the rule, what it has done, progress.
- **Report:** Approval Log ("Rule set / sent / approved / ended / refused") · Party log, category **My rule**.
- **Demo:** any time after step 6 (see the demo guide, "Extra: My rules").

### W6 · Read live exposure

1. **Trigger:** none. It is a feed from AR/AP and Sales.
2. **Dashboard:** Total exposure · Customers over limit · Overdue receivables · **Exposure vs credit limit** chart (chart or table) · risk watchlist.
3. **Screen:** Actions → View Exposure. A customer list with a filter; on select: **On credit hold** · **Sales orders** · **Holds**.
4. **Decide:** nothing here. The banner says "You make no entries here". It feeds W1, W2 and W4.
5. **Report:** Customer 360 (limit, exposure, % used, overdue, status).
6. **Demo:** all steps (exposure changes after steps 10 and 18).

---

## 4. Card field → UI element (same for every activity)

| Card field | Where it is in the mockup |
|---|---|
| Serves / Indicators | Dashboard KPI cards and tiles (§5 of the role doc) |
| Trigger | Notification in the Action center; the Scenario panel plays it in the mock |
| Subject | The item in the left list (SO, customer, request, limit change) |
| Requires | A button is disabled, or the action is refused, with the reason shown (Refusal tests in the Scenario panel) |
| Sees | Detail panel on the right |
| Decision | Buttons at the top of the detail |
| Writes | The dialog's submit; it writes the Approval Log |
| Hand-off | The item moves to "With Finance Controller" / "Decided"; a Progress tracker |
| Sends | Notifications under **Updates** |
| Held by | List groups (Waiting for you · With Finance Controller · Not held: watching · Closed) |
| Exceptions | Callouts and chips (Over limit, Hold suggested, Scorecard, Not reviewed N days) |
| Rules allowed | **Set a rule** dialog: live ✅ / 🟠 / ❌ answer · "never" list with Instead and Try · W7 "What I can set" page · Profile |
| Parameters | Scenario panel → **Company rules** (change them, and the app follows) |
| Screen | The activity screen: list + detail + dialog |

---

## 5. My queue: where each activity's items land

| Activity | Needs me | Waiting on others | Coming up |
|---|---|---|---|
| W1 | Routed orders (Review) · passed automatically (Check, for info) | Credit cleared → Nisha (Sales Manager) | — |
| W2 | Hold suggested (Decide) | — | Not held, watching → until the watch date |
| W3 | Nothing overdue, request release · Nisha's request to endorse | Hold with overdue → customer / Collections · request → Usha | — |
| W4 | Review due / scorecard flag | Your recommendation → Teja (Accounts Executive) | Review due in the next 30 days |
| W5 | Teja's change to check | Agreed → Usha (Finance Controller) | — |
| W6 | — (read only) | — | — |
| W7 | Ask from Usha or Nisha (optional) · reminder due (Open → Mark done) | Rule waiting → Usha (Finance Controller) | Rule ending within 30 days · reminder set |

- **Sorting:** Needs me puts the most serious first, then the oldest. Waiting on others puts the oldest first. Coming up puts the soonest first.
- **Same screens:** a row opens the existing W screen on that item, and the work is done there. Nothing old was removed.
- **Quiet rules:** a quieted customer's items stay in Needs me, marked "alerts quiet until …". A rule hides alerts, never work.
