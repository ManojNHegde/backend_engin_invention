# Credit Controller: CA review of the mockup

What the CA said after seeing the app run through the scenario, what each point means, our answer, and what we can do about it.
**Status (after your decisions):**

| # | Point | Decision | Status |
|---|---|---|---|
| 1 | Step 7 export | Keep as is | No change |
| 2 | Merge steps 10 and 11 | Agreed | **Built.** Step 10 now has two parts (payment, then the release request), so the scenario has 19 steps |
| 3 | Step 13 | Keep as is (explained) | No change. It is step 12 after the merge |
| 4 | Bulk limit proposals | Customers, UI left to us | **Built.** W4 → **Bulk review**: tick customers, choose Propose or Keep with the new limit, one reason, one batch ID |
| 5 | Customer hold | Understood | No change |
| 6 | Reports | New section | **Built.** New **Customer reports** section: Customer 360 (overview, party log, what changed, orders) and Party-wise Customer Log. All reports have a period picker (incl. FY Apr–Mar, previous FY, quarter, custom range), sortable columns, a customer filter and CSV export |

---

## 1. Summary

| # | CA's point | Type | Our answer in one line | Action | Priority |
|---|---|---|---|---|---|
| 1 | Step 7: an export can't happen without an invoice | Question | The invoice comes later, at dispatch. Step 7 is only the **order**. We didn't show the rest of the chain | Explain better. Add an "advance received?" check | High |
| 2 | Merge steps 10 and 11 into one scenario | Suggestion | Agreed. "Customer pays → Farid asks for release" is one story | Merge in the guide and the app timeline | Medium |
| 3 | Step 13 is not clear | Question | It's the Sales Manager approving the **price**, which happens after credit is cleared | Explain better in the guide and on screen | Medium |
| 4 | Can I propose new limits for many customers or vendors at once? | Question | **Customers: yes, possible to add. Vendors: no, not this role's job** | Bulk proposal in W4 (to build later) | Medium |
| 5 | Step 20: we need a clear "customer hold" option | Problem | Customer hold exists (W2), but W1 doesn't let you choose order or customer, and an order hold silently blocks the whole customer | Add an explicit choice | **High** |
| 6 | Reports: per-customer view, sorting, date and year filters, party-wise log | Suggestion | Agreed. Today's reports are lists by activity, not by customer | New customer report and filters | **High** |

---

## 2. Each point in detail

### Point 1 · Step 7: export without an invoice?

**CA's concern:** you can't export goods without an invoice, so step 7 looks wrong.

**Justification: the CA is right that an export needs an invoice, but step 7 isn't the export itself.** It's the **sales order**, which comes before the invoice. The full chain from the shared scenario document:

| Stage | Date | Document | Who | In our app? |
|---|---|---|---|---|
| 1 | 05-Oct | **Proforma PF-0031**: a quotation-style bill, USD 10,680. Posts nothing and has no IRN | Arun | No |
| 2 | 06-Oct | Customer confirms → **SO-3** created from the proforma | Arun | **Yes, this is step 7** |
| 3 | 06-Oct | Nisha approves SO-3's price (margin 28.5%) | Nisha | No |
| 4 | 13-Oct | Dispatch of 1,200 cartons | Stores | No |
| 5 | After dispatch | **Export tax invoice**: USD 10,680 × ₹88 = ₹9,39,840, zero-rated under **LUT** (valid to 31-Mar-2027), e-way bill to port, **Shipping Bill** reminder | Pooja (Billing), checked by Venkat | No |

- **Why the Credit Controller only sees stage 2:** credit is checked at the **order**, before anything is shipped. The invoice is Billing's job, not his.
- **Why no credit check:** C-03 is set up as **100% advance**, so we give no credit.

**Real gaps the CA's question exposes:**
- **Gap A, important:** we say "advance customer, no risk", but the app never checks that **the advance has actually been received**. If C-03 hasn't paid, the goods must not ship.
  - **Fix:** for advance customers, show "Advance received ₹X of ₹9,39,840". Block dispatch, or alert Farid, until it's fully paid.
- **Gap B, presentation:** step 7 doesn't explain the chain.
  - **Fix:** add the table above to the demo guide, and one line in the notification: "Proforma PF-0031 → SO-3. Tax invoice under LUT is raised by Billing at dispatch."

**Answer for the CA:** "Step 7 is the order stage. The export invoice under LUT is raised at dispatch on 13-Oct by Billing. The Credit Controller's job here is only to confirm that no credit is being given, and we'll add a check that the advance is actually in the bank."

### Point 2 · Merge steps 10 and 11

**Today:**
- Step 10: Collections records C-02's payment. This is another role's event.
- Step 11: Farid asks Usha to release the hold. This is Farid's action.

**CA's view:** it's one business situation, "the customer paid, so free the order".

**Agreed.** Proposed single scenario, **"Customer clears overdue → release request"**:
1. 🔔 Farid is told C-02 paid ₹2,10,000 (exposure ₹10,25,800, nothing overdue).
2. 👤 In the same screen (W3), Farid writes the release request to Usha.

**One correction to note:** Farid **requests** the release, he doesn't release it himself. Only Usha releases (refusal test C-11). The merged scenario must still show this.

**Optional:** also fold in step 12 (Usha approves), so the scenario reads "paid → requested → released". The total would then be **18 scenarios** instead of 20.

### Point 3 · Step 13 explained

**What happens:** Nisha (Sales Manager) approves SO-2's **commercial terms**: price and discount.

**Why it's needed:**
- SO-2 is ₹4,15,800. Company rules say any order above **₹3,00,000** needs the Sales Manager's approval.
- That's a **price check**, separate from the credit check:

| Check | Question it answers | Who | Order |
|---|---|---|---|
| Credit check | "Will this customer pay us?" | Farid (W1), then Usha if there was a hold | **First** |
| Commercial check | "Is the price and margin acceptable?" | Nisha | **Second** (team Decision 2) |

**What happened to SO-2:**
- On 06-Oct Nisha **could not** approve it, because it was on credit hold. The scenario says "SO-2 stays held".
- After Usha released it on 12-Oct, it came back to Nisha. She approved it at list price with no discount, and it became **Confirmed**, ready to ship on 13-Oct.

**Why Farid sees it:** he only gets an info notification ("SO-2 confirmed"). There's **no action** for him. It's shown so the demo can follow the order to dispatch.

**Fix:** add this table to the demo guide, and make the step 13 notification say "Price approved by Nisha (order above ₹3L). No action needed."

### Point 4 · Bulk limit proposals (answer only, no build)

**Customers: yes, possible to add.**
- Today W4 handles one customer at a time.
- Design for bulk:
  1. Tick several customers in W4.
  2. Click **"Propose for selected"**.
  3. A table opens with each customer's current limit, the suggested limit (pre-filled and editable) and a reason. One common reason is allowed.
  4. One click creates **one recommendation per customer**.
- What doesn't change, because these are control rules:
  - Each customer's change still needs **Teja to enter it** and **Usha to approve it**. Each customer can be approved or rejected separately.
  - Farid still **cannot change any limit directly**, even in bulk.
- Nice to add:
  - Usha approves the batch in one screen.
  - The batch has its own ID in the reports, e.g. "Q3 limit review, 12 customers".

**Vendors: no, not in this role.**
- A customer credit limit is credit **we give** to a customer, which is the Credit Controller's area.
- With a vendor it's the other way round: the **vendor gives us** credit days. Vendor credit days are kept in the **Vendor master by the Accounts Executive**, approved by the Accounts Manager (procurement and payables side).
- So the Credit Controller has no vendor work. Bulk vendor changes belong in the Accounts or Procurement app.

### Point 5 · Customer hold (step 20)

**CA's view:** a hold should really be a **customer** hold, with a clear option for it.

**What exists today:**

| | Order hold | Customer hold |
|---|---|---|
| Where | W1 (step 8, SO-2) | W2 (step 9, C-06) |
| Stops | That one order | All new orders, and confirmed orders can't be picked |
| Shown in step 20 | — | Yes: SO-7 for C-06 is blocked at submit |

**Problems found while checking this:**
1. **No choice in W1.** The "Place hold" button there doesn't let Farid say "hold only this order" or "hold the whole customer".
2. **Hidden behaviour (a real bug).** An order hold on SO-2 also sets C-02's customer hold flag, so **new C-02 orders get blocked too**, and the screen doesn't say so.
3. **No customer hold from the customer screens.** You can only reach it through W2's list.

**Fix:**
- In the W1 hold dialog, add a choice: **"This order only"** or **"Whole customer (all new orders blocked)"**, with the effect spelled out.
- Make the code follow that choice: an order hold doesn't block new orders, and a customer hold does.
- Add a **"Hold customer"** button on the new customer detail view (point 6).
- In step 20's text, say clearly: "This is a **customer hold**: any new order for C-06 is blocked, not just one order."

### Point 6 · Reports

**What the CA asked for:**
- A per-customer view of what changed.
- A detailed view of each customer.
- Sorting.
- Date and year filters.
- A party-wise customer log.

**Today:**
- Four reports, organised by **activity** (holds, decisions, limit changes, log), not by customer.
- Period filter: Today, Week, Month, All only.
- No column sorting and no export.

**Proposed:**

| # | Add | What it gives the CA |
|---|---|---|
| 6a | **Customer 360 (new report)**: list of customers → open one → full detail | Profile, limit, exposure, overdue, ageing, risk band, and the current hold and why |
| 6b | **Party-wise customer log** (a tab inside 6a) | Timeline of **everything that happened to that customer**: orders and credit results, holds placed and released, "not held" decisions, limit reviews, limit changes and approvals, payments and bounced cheques. Each entry shows who, when and why |
| 6c | **"What changed" view** (a tab inside 6a) | Before and after values for the limit, band, hold flag and review dates, with who changed each one and when |
| 6d | **Date filters on every report** | Date range (from–to), month, quarter, **financial year (Apr–Mar)**, calendar year |
| 6e | **Sorting** | Click any column header to sort ascending or descending: date, customer, amount, status |
| 6f | **Filter by customer** on every report | One customer's rows only (party-wise) |
| 6g | **Export** to Excel/CSV and print/PDF | Working papers and audit files |

---

## 3. More we can do for a CA or auditor (our suggestions)

| # | Suggestion | Why a CA would want it |
|---|---|---|
| S1 | **Ageing report**: buckets of 0–30, 31–60, 61–90 and 90+ days, per customer | Standard receivables review and provisioning |
| S2 | **Exposure vs limit report**: every customer's limit, exposure, used % and over-limit amount on any chosen date | Year-end and month-end credit position |
| S3 | **Exceptions report**: over-limit orders passed, suggested holds **not** placed, holds placed on in-limit orders, limit changes not matching the recommendation | Auditors look at overrides first |
| S4 | **Hold ageing**: how long each order or customer stayed on hold | Shows lost sales and slow decisions |
| S5 | **Advance-customer check** (from point 1) | Prevents shipping to "advance" customers who haven't paid |
| S6 | **Reason required everywhere it matters** (already true for holds, rejects, don't-hold and objections) | Audit trail is complete |

---

## 4. Proposed build order

| Order | Item | Size |
|---|---|---|
| 1 | Point 5: order or customer hold choice, plus the bug fix | Small |
| 2 | Point 6a–6c: Customer 360 with the party-wise log and "what changed" | Medium |
| 3 | Point 6d–6g: date and FY filters, sorting, customer filter, export | Medium |
| 4 | Point 1: advance-received check, plus the explanation in step 7 | Small |
| 5 | Points 2 and 3: merge steps 10 and 11 (and 12?), clearer step 13 text | Small |
| 6 | Point 4: bulk limit proposals in W4 | Medium |
| 7 | S1–S4: CA reports (ageing, exposure, exceptions, hold ageing) | Medium |

---

## 5. Decisions needed from you before building

1. **Point 2:** merge only steps 10 and 11, or 10, 11 and 12 (paid → requested → released)?
2. **Point 5:** when an **order** is held, should new orders for that customer still be allowed? Our recommendation is **yes**: only a **customer** hold blocks new orders.
3. **Point 1:** for advance customers, should the app **block dispatch** until the advance is received, or only **alert** Farid?
4. **Point 6:** is the financial year April to March? Is export to **Excel** needed, or is PDF enough?
5. **Point 4:** should Usha approve a bulk proposal **as one batch**, or still customer by customer?
