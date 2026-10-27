# Customer Onboarding — the Engine Card (worked example)

**Purpose:** Apply doc 04's method to **one task, end to end**: set up a new customer (T12, new-customer case). Read it as the example of how a task becomes its backend.

**Status:** Worked example — **Proposal** · 27-Oct-2026
**Role:** Accounts Executive (R01) · **Owner:** Vijay · **Scenario user:** Teja
**Method:** `04_task_to_backend_engine.md` (§3 card → engine, §4 nine steps, §7 done-check)
**Facts from:** `03_party_onboarding_design.md` (as decided 26-Oct and 27-Oct) · the mock app (`app/`, demo form CRF-0019 Coastal Bakes)

**How to read it**

| Part | What it shows |
|---|---|
| A | The task card: the input. Nothing else is used |
| B | The 9 steps, one by one: what we ask, and the answer for this task |
| C | What falls out: tables, API, events, jobs |
| D | One real run (Coastal Bakes), call by call |
| E | The done-check, answered |

The people:
- Teja (AE), the Accounts Executive.
- Arun, the Sales Executive.
- Rajan (AM), the Accounts Manager.
- Farid (CC), the Credit Controller.
- Venkat (CO), the Compliance Officer.
- Usha (FC), the Finance Controller.

---

## Part A — The task card (input)

**T12 · Set up a new customer** (doc 01 card, as changed on 26–27 Oct)

| Card field | Value |
|---|---|
| Serves | **R2**: no customer is used with missing or wrong finance fields; every change is checked first |
| Area | Sales |
| Trigger & cadence | Arun hands over a **paper customer form** (with copies of the GST certificate and PAN). As needed |
| Subject | **One new customer**: its party details and its finance details, as one request |
| Requires | A form number, and who handed it over |
| Sees | The paper form · "already in the party master?" (by GSTIN, PAN) · the GST portal result · the tax preview |
| Done when | **Active** (the party and its account exist) · or the **form is returned** to Arun · or it is discarded (opened by mistake) |
| Writes | The party in the party master · the customer account · terms · classification · billing instructions |
| Hand-off | **Rajan**: party details, account, terms, billing · **Farid**: credit limit · **Venkat**: GST tagging |
| Sends | Active → Sales (can confirm orders) and Billing (instructions) · Form returned → Arun |
| Held by | Draft or returned → **Needs me** · submitted → **Waiting on others** · active or returned form → **Done** |
| Exceptions | The GSTIN is already our customer · GSTIN cancelled · same PAN as another party · a checker is late |
| Parameters | Usual customer credit days · checker response days |
| Rules allowed | ❌ Approve my own request · ❌ Activate without Farid checking the limit |
| Indicators | Forms open (by age) · customers activated this month |
| Type | **Make** → form on the item |
| Screen | Onboarding workspace |

**What you fill in** (from the paper):
- **Party details (10 fields):**
  - legal name · trade name · PAN · GSTIN;
  - address · city · PIN;
  - contact person · phone · email.
- **Finance details (7 fields):**
  - category · related party?;
  - credit days · credit limit;
  - PO reference rule · send invoices by · invoice format note.
- **Worked out by the system (7 fields, editable):**
  - state (from the GSTIN) · constitution (from the PAN);
  - account name (from the name) · header (from the category);
  - resident · currency · bill-by-bill.

**Checks:**

| Check | Result |
|---|---|
| PAN / GSTIN / PIN format · GSTIN contains the PAN · state matches the GSTIN | Stop |
| GSTIN not checked on the portal | Stop |
| GSTIN cancelled | **Stop · return the form** |
| GSTIN already our customer | **Stop · return the form** |
| GSTIN in the master, no customer account yet | **Stop until you use that party** |
| Same PAN as another party | Warn |
| Account name already used | Stop |
| A required field is empty | Stop |
| Domestic customer in a foreign currency | Warn |

---

## Part B — The 9 steps

### Step 1 · Context: who owns each fact?

| Context | Owns, in this task | Writes in this task | Reads in this task |
|---|---|---|---|
| **Finance · party onboarding** (`accounting_txn`) | The request · its approval instances · GSTIN checks · the customer's terms, classification, billing instructions | All of these | Party master (search), GL (header list) |
| **Party master** (`party_master`, Foundation) | Party · tax ids · location · contact · role | Party, role (through its own actions) | — |
| **GL kernel** (`accounting`) | Accounts (headers, leaves) · the account ↔ party link | The customer's leaf account (through its own action) | — |
| **HR** | Positions and who holds them | — | Who is AE, AM, CC, CO today |
| *Outside* | GST portal | — | Status and name for a GSTIN |

**Rule kept:** Finance never inserts into `party_master` or `accounting` tables. It calls their actions.

### Step 2 · Entity: what is the subject, and its states?

Subject = **Customer account request** (`party_account_request`, side = receivable).

```text
 draft ──Submit──► submitted ──(all 3 approved)──► approved ──(reactions)──► active
   │                   │
   │                   └──(one block returned)──► returned ──Submit──► submitted
   ├──ReturnForm──► sent_back        (form back to Arun; nothing created)
   └──Discard─────► cancelled        (opened by mistake)
```

Other entities touched:

| Entity | States |
|---|---|
| Approval instance (×3: party · credit limit · tax) | requested → approved · returned · expired |
| Party (party master) | active (created on approval) |
| Party role "customer" | active |
| Account (GL leaf) | open |

### Step 3 · Action: what are the moves, and their gates?

| Action | Inputs | Gates (refuse if not met) | Effect |
|---|---|---|---|
| `OpenPartyAccountRequest` | side = receivable · form_no · form_from | Caller is an AE · form_no not already open (idempotent on `form:<no>`) · form_from is a Sales position | Request in **draft**, no party yet |
| `SavePartyAccountDraft` | Any of the 17 fields · or `party_id` (use an existing party) | Status draft or returned · caller is the maker · party fields locked while `party_id` is set | Values saved; worked-out values recomputed |
| `CheckGstin` | — (uses the typed GSTIN) | GSTIN format valid | GSTIN check recorded (status, name at GST) |
| `SubmitPartyAccountRequest` | — | **G1** required fields filled · **G2** formats and GSTIN ⊃ PAN · **G3** state = GSTIN state · **G4** GSTIN checked, current, not cancelled · **G5** not already our customer · **G6** GSTIN not on another party (or that party used) · **G7** account name unique · **G8** email given · **G9** credit limit > 0 | **submitted**; 3 approval instances requested |
| `ReturnPartyAccountForm` | reason (required) | Status draft or returned · caller is the maker | **sent_back**; nothing created |
| `DecidePartyAccountChange` | approve or return · reason (on return) | Caller holds the block's position · **caller ≠ maker** · instance is requested · reason given on return | Instance approved or returned. A return moves the request to **returned**; the last approval moves it to **approved** |
| `DiscardPartyAccountRequest` | — | Never submitted · caller is the maker | **cancelled** |
| `RegisterParty` · `AddPartyRole` (Party master) | The approved party details · role customer | Request approved · **no active party has this GSTIN** (the critical rule, in the owner's transaction) · PAN format | Party + tax ids + location + contact + role |
| `ActivatePartyAccount` (Finance) → calls GL `CreatePostableAccount` | request id | Role exists · header exists and is not postable · account name unique in GL | Leaf account · link · terms · classification · billing instructions · request **active** |

**Warn checks are not gates:**
- "Same PAN as P-0088" and "foreign currency for a domestic customer" are returned by the query (Step 7).
- They never block.

### Step 4 · Event: what happened that others care about?

| Event | Published by (action) | Listened to by |
|---|---|---|
| `PartyAccountRequestSubmitted` | Submit | Rajan's, Farid's and Venkat's queues |
| `PartyAccountChangeReturned` | Decide (return) | Teja: Needs me, plus a notice |
| `PartyAccountRequestApproved` | Decide (the last approval) | **Party master** (Step 5) |
| `PartyAccountFormReturned` | ReturnForm | Arun: a notice with the reason |
| `PartyRegistered` · `PartyRoleAdded` | RegisterParty · AddPartyRole | **Finance** (Step 5) · Sales (the customer can be picked) |
| `PartyAccountActivated` | ActivatePartyAccount | **Sales** (can confirm orders) · **Billing** (reads the instructions) · Teja (notice) |

**Not events:**
- Opened, draft saved, GSTIN checked: nobody else listens to them.
- They are still kept in the trail.

### Step 5 · Reaction: what does the system do with no judgement?

| When (event) | And (condition) | Call (action) | As (named automation) |
|---|---|---|---|
| `PartyAccountRequestApproved` | No `party_id` on the request | `RegisterParty` + `AddPartyRole` | `party-master-intake` |
| `PartyAccountRequestApproved` | `party_id` set (used an existing party) | `AddPartyRole` | `party-master-intake` |
| `PartyRoleAdded` | It carries a request id | `ActivatePartyAccount` | `finance-onboarding` |
| `PartyAccountChangeReturned` · `PartyAccountFormReturned` · `PartyAccountActivated` | — | `NotifyPerson` (the maker · Arun · Sales and Billing) | `onboarding-notices` |
| `ApprovalDeadlineReached` | Instance still requested | `EscalateApproval` (notice to the escalation position) | `approval-escalation` |

**If a reaction fails** (for example, someone registered the same GSTIN in between, so `RegisterParty` refuses):
- the failure is **visible** and the request is flagged in Teja's Needs me;
- a valid approval is never undone silently.

### Step 6 · Approval and timer

| Approval instance | Deciding position | Fields it covers | Return needs a reason | Deadline | On expiry |
|---|---|---|---|---|---|
| Party, account, terms, billing | Accounts Manager | Party details (checked against the scanned form) · account name · header · category · constitution · resident · related party · credit days · currency · bill-by-bill · PO rule · delivery · format | Yes | *Checker response days* | Escalate to the Finance Controller (assumed) |
| Credit limit | Credit Controller | Credit limit | Yes | Same | Escalate to the Accounts Manager (assumed) |
| GST tagging | Compliance Officer | GST treatment · e-invoice · TCS | Yes | Same | Escalate to the Accounts Manager (assumed) |

| Timer | Fires when | Reaction |
|---|---|---|
| `ApprovalDeadlineReached` | An instance has been requested for *checker response days* | `approval-escalation` |

| Parameter | Used by | Owner |
|---|---|---|
| Usual customer credit days | Worked-out credit days (shown as a hint) | Accounts Manager |
| Checker response days | Approval deadline | Accounts Manager |

### Step 7 · Query: what does each screen read?

| Query | For | Returns |
|---|---|---|
| `NeedsMe` | Teja's task home (left rail) | Requests in draft / returned held by the AE position · with checkers · done |
| `PartyAccountRequestView` | The workspace | Values · worked-out values with "why" · gate results (G1–G9) · warnings · **allows** (Submit ✅ / ❌ + why · Return form · Discard) · history |
| `PartySearch` (Party master) | "Already in the master?" while typing | Parties with this GSTIN or PAN, with their roles |
| `CheckerQueue` | Rajan, Farid, Venkat | Their requested instances, with the fields they cover |
| `PartyAccounts?side=receivable` | Vendors & customers list | Customer accounts with party, terms, limit |
| `OpenFormsByAge` | Indicator / cue | Requests not yet submitted, oldest first |

**The screen holds no rule:**
- the Submit button's state comes from **allows**;
- the red / amber lines come from the gate results.

### Step 8 · Authority: who may run what?

| Action / query | AE (Teja) | AM (Rajan) | CC (Farid) | CO (Venkat) | Automation |
|---|---|---|---|---|---|
| Open · Save · CheckGstin · Submit · ReturnForm · Discard | ✅ | — | — | — | — |
| Decide: party block | ❌ (maker) | ✅ | — | — | — |
| Decide: credit limit | ❌ | — | ✅ | — | — |
| Decide: GST tagging | ❌ | — | — | ✅ | — |
| RegisterParty · AddPartyRole | — | — | — | — | `party-master-intake`, only for approved requests |
| ActivatePartyAccount | — | — | — | — | `finance-onboarding` |
| NeedsMe · RequestView · PartySearch | ✅ | view | view | view | — |

Authority is worked out at each call, from the position held that day in HR. The app grants nothing.

### Step 9 · History: what does each commit hold?

Every action commits, in **one transaction**: **state + receipt + trail + outbox**.

| Action | State | Trail line | Outbox |
|---|---|---|---|
| Open | request → draft | "Opened from CRF-0019, Arun" | — |
| Save | values | Field before → after | — |
| CheckGstin | GSTIN check row | "GSTIN … active: COASTAL BAKES PVT LTD" | — |
| Submit | request → submitted · 3 instances → requested | "Submitted to Rajan, Farid, Venkat" | `PartyAccountRequestSubmitted` |
| Decide | instance → approved / returned (· request → approved / returned) | "Farid approved credit limit" | `…ChangeReturned` / `…RequestApproved` |
| RegisterParty | party, tax ids, location, contact, role | `party_history` rows | `PartyRegistered` · `PartyRoleAdded` |
| Activate | account, link, satellites · request → active | "Active: ACC-…" | `PartyAccountActivated` |

**The receipt holds:** who, which position or grant, rules version, invocation id. Pressing Submit twice returns the same receipt and creates no second set of approvals.

---

## Part C — What falls out (the deliverables)

**Tables:**

| Table | Context | Status |
|---|---|---|
| `party_account_request` (+ `_trail`) | Finance | doc 03, **+ trail** |
| `party_account_change` (the approval instance) | Finance | doc 03, **+ `due_at`, state `expired`** |
| `gstin_check` | Finance | doc 03 |
| `party_terms` · `party_classification` · `account_tax_profile` | Finance | exist (aikyat-finance) |
| `party_billing_instruction` | Finance | doc 03 |
| `action_receipt` · `event_outbox` | Finance, Party master | **new** (one each per context) |
| `party` · `party_tax_id` · `party_location` · `party_contact` · `party_role` · `party_history` | Party master | doc 03 |
| `account` · `party` (link) | GL kernel | exist |

**API:**

| Action → `POST` | Query → `GET` |
|---|---|
| `/party-account-requests` · `/{id}/gstin-checks` · `/{id}/submit` · `/{id}/send-back` · `/{id}/discard` · `/party-account-changes/{id}/approve` · `/return` · `PATCH /party-account-requests/{id}` (save) | `/party-account-requests?holder=me` · `/party-account-requests/{id}` (with allows) · `/parties?gstin=&pan=` · `/party-account-changes?position=…` · `/party-accounts?side=receivable` |

**Events:** the 7 events in Step 4.
**Jobs:** 5 reactions (Step 5) and 1 timer (Step 6).
**Parameters:** 2 (Step 6).

---

## Part D — One run: Coastal Bakes Pvt Ltd (form CRF-0019)

| Time | Who | Call | What the engine does | Result |
|---|---|---|---|---|
| 11:30 | Teja | `POST /party-account-requests` {receivable, CRF-0019, Arun} | Gates ✅ · commit (state, receipt, trail) | REQ-0102 · **draft** |
| 11:32–11:40 | Teja | `PATCH …/REQ-0102` (17 fields) | Works out: state KA (29…) · constitution company (PAN 4th letter C) · account name · header *Trade Receivables › Domestic* | View: Warn "Same PAN as P-0088", Stop G4 "GSTIN not checked" |
| 11:41 | Teja | `POST …/gstin-checks` | GST portal → active, COASTAL BAKES PVT LTD | G4 ✅ · **allows: Submit** |
| 11:43 | Teja | `POST …/submit` | G1–G9 ✅ · 3 instances · outbox `…Submitted` | **submitted** · in 3 queues |
| 12:10 | Farid | `POST /party-account-changes/…-2/approve` | Position CC ✅ · ≠ maker ✅ | Credit limit ₹4,00,000 approved |
| 14:00 | Venkat | `…-3/approve` | Position CO ✅ | GST tagging approved |
| 15:30 | Rajan | `…-1/approve` | Last one → request **approved** · outbox `…RequestApproved` | — |
| 15:30 | `party-master-intake` | `RegisterParty` + `AddPartyRole` | GSTIN unique ✅ | **P-0141** · role customer · `PartyRegistered`, `PartyRoleAdded` |
| 15:30 | `finance-onboarding` | `ActivatePartyAccount` → GL `CreatePostableAccount` | Header ✅ · name unique ✅ | **ACC-13xx** under Domestic · terms 30 days · limit ₹4,00,000 · billing: PO on every invoice, email · **active** |
| 15:31 | `onboarding-notices` | `NotifyPerson` | — | Sales: "Coastal Bakes can take orders" · Billing: instructions · Teja: "Customer active" |

**The other endings, same task:**
- **Sri Lakshmi (Mysuru), CRF-0020.**
  - G5 fails: GSTIN 29AAKFS0000S1Z2 is already our customer C-01.
  - Allows offers **Return form** only.
  - Teja returns it with "add the depot as a location of C-01". The request becomes **sent_back** and Arun gets a notice. Nothing is created.
- **Returned by a checker.** Rajan returns with "PAN on the form copy is AADCC0000D".
  - The request goes back to **returned** and shows in Teja's Needs me.
  - Teja fixes it and resubmits. Farid's and Venkat's approvals stay approved, because their fields did not change.

---

## Part E — Done-check (doc 04 §7), answered

| # | Question | ✅ Where |
|---|---|---|
| 1 | One owner per fact; no cross-table writes | Step 1 · Step 5 (party and GL via their actions) |
| 2 | Every state reached by a named action | Step 2 ↔ Step 3 |
| 3 | Every card check is a gate (Warn = query) | Step 3 G1–G9 · warnings in Step 7 |
| 4 | Critical rule inside the owner's action | GSTIN unique in `RegisterParty` · name unique in GL |
| 5 | Every hand-off is an event or an approval | Steps 4 and 6 |
| 6 | No anonymous "System" | Step 5: 4 named automations |
| 7 | Every wait has a timer, and every parameter an owner | Step 6 |
| 8 | Each list is one query, and the view returns allows | Step 7 |
| 9 | Safe to repeat; 4 things in one commit | Step 9 |
| 10 | Same words as the UX | Button = action · list = query · red line = gate · Needs me = holder |

---

## Different from doc 03 / open

**Different from doc 03** (doc 04 §8.7):
- the party is created by the party master's own action through a reaction;
- duplicate GSTIN is a gate in `RegisterParty`;
- approvals have deadlines;
- there are receipts and named automations;
- there is a request trail.

**Open:**
- **Q-a:** do Farid and Rajan decide in parallel (as here), or Farid first and then Rajan confirms (doc 01 T12 says "first … then")?
- **Q-b:** the escalation positions in Step 6 are assumed.
- **Q-c:** does Venkat's GST tagging block activation (doc 03 Q6)?
- **Q-d:** a bank account for refunds is optional for a customer and left out of this example.
