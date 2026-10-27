# Accounts Executive — From Task to Backend Engine

**Purpose:** One repeatable way to turn a task card into its backend design: contexts, entities, actions, events, reactions, approvals, timers, queries, authority and history. It is the twin of doc 02 (task → UX).

**Status:** Working method — **Proposal** · 27-Oct-2026
**Role:** Accounts Executive (R01) · **Owner:** Vijay · **Scenario user:** Teja
**Builds on:**
- `01_…tasks_and_responsibilities.md`: the task card and "What you fill in"
- `02_…designed_ui.md`: the same card, mapped to the UX
- `03_party_onboarding_design.md`: the worked example

**Reference (points taken, not adopted as law):** `docs/shared_docs/engine_shared/engine-concepts.pptx` ("Thinking about the backend", 26-Oct, the Contracts & Services Procurement Officer seat). It draws on the Foundry architecture records, the POC engineering baseline and role app model stage 6.

---

## 1. The idea

- **One card, two readings.** Doc 02 reads the card into **5 app areas**. This doc reads the **same card** into **9 engine words**. Nothing new is invented between the card and the engine.
- **The philosophy (from the deck):** every fact has one owner. A fact changes only through an action. Everything else listens, or reads.
- **A task, in engine words:**
  - its **start** is an event, a timer or a person;
  - its **home** is a query;
  - its **ending** is an action.
- **The screen holds no rule.** It asks the engine which actions this person may take now ("allows") and why the others are blocked.
- **Work the system does is a reaction. Work a person judges is a task.**

---

## 2. The 9 words (one meaning each)

| # | Word | Means | Becomes in the backend |
|---|---|---|---|
| 1 | **Context** | The owner of one slice of facts; every fact has exactly one | A package (schema + code) that never touches another's tables |
| 2 | **Entity** | A thing with an identity, named states and a history | A register table with a `status` column, plus its trail |
| 3 | **Action** | The only way a fact changes; it declares its **gates** | A `POST` endpoint; one transaction |
| 4 | **Event** | A fact that happened, past tense, never edited | A row in the context's outbox, written in the action's transaction |
| 5 | **Reaction** | When an event happens and a condition holds, call an action | A handler the dispatcher calls; safe to retry |
| 6 | **Approval · Timer** | A gate with a deciding position and a clock · a declared point in time that becomes an event | An approval entity + a gated action · the scheduler |
| 7 | **Query** | Reads facts, changes nothing | A `GET` endpoint: task home, subject view, list, report |
| 8 | **Authority** | Who runs it: a person by **position**, or a **named automation** with a written grant | Checked at each call; never stored |
| 9 | **History** | Current state plus a trail. Every call leaves a **receipt** | State, receipt, trail and outbox rows, all in one commit |

---

## 3. Card → engine: where each card field goes

The core of the method. It works like doc 02 §2, with engine words in place of app areas.

| Card field (doc 01 §7) | → Engine word | What you write down |
|---|---|---|
| **Subject** | **Entity** (+ its **Context**) | The one thing; who owns its facts |
| **Held by** | Entity **states** + **Query** (holder) | The state map. The holder is **worked out** from state + position, never stored |
| **Trigger & cadence** | **Event** · **Timer** · a person | What starts it: another context's event, a clock, or someone opening it |
| **Requires** | Action **gates** (preconditions) | What must be true to start |
| **Sees** | **Query** (subject view) | The facts it reads: its own, plus others' by declared identifiers |
| **What you fill in** | Action **inputs** | The fields, types and which are required |
| **Checks: Stop · Reason · Warn** | **Gates** | Stop = the gate refuses · Reason = the gate needs a reason input · Warn = the query returns it; not a gate |
| **Done when** | The ending **Action(s)** + end **states** | One action per way it can end |
| **Writes** | Action **effect** + **History** | Which registers change; trail and receipt |
| **Hand-off** | **Event** + who listens · **Approval** | The checker is an approval; the next seat starts from the event |
| **Sends** | **Reaction** → notice | A message that moves no work: a reaction calling a notify action |
| **Exceptions** | **Query** (cue) · **Timer** | What is flagged, and when |
| **Parameters** | **Parameter** (gates read it) | Name + owning seat. A number with no owner is a fault |
| **Rules allowed** | **Authority** + gates | ✅ = a parameter the holder sets · ❌ = a gate (e.g. maker ≠ checker) |
| **Indicators** | **Query** (watch) | One business question each |
| **Type** (Make · Record · Run) | The **shape** of actions and states | See §5 |
| **Screen** | **Query** (task home) + **allows** | The list, and the buttons it may show |

---

## 4. The method: 9 steps, in order

Do them in this order. Each step uses only the card and the steps before it.

| Step | Ask | Take from the card | Write down | Rule to keep |
|---|---|---|---|---|
| 1 Context | Who owns each fact this task touches? | Subject, Sees, Writes | Own contexts · contexts read from | Change another context only through its action |
| 2 Entity | What is the subject, and what states does it pass through? | Subject, Held by, Done when | Entity + state map | A state changes only through an action |
| 3 Action | What are the moves? | Done when, What you fill in, Requires, checks, Rules allowed ❌ | One action per move: name, inputs, gates, effect | Same gates for a person, a screen, a reaction or an AI. No side doors |
| 4 Event | What happened that others care about? | Hand-off, Sends | One past-tense event per completed action that someone listens to | The publisher does not know who listens |
| 5 Reaction | What does the system do with no judgement? | Trigger (automatic parts), Sends, reminders | "When X and condition → call Y, as automation Z" | Exactly one call per event; a failure is visible |
| 6 Approval · Timer | Who decides, by when? What waits on a date? | Hand-off (checker), cadence, Exceptions, Parameters | Deciding position, outcomes, reason rule, deadline, escalation · timers + their parameter | No workflow engine: a lifecycle, a gate, a timer and a reaction |
| 7 Query | What does each screen and list read? | Screen, Sees, Held by, Indicators, Exceptions | Task home · subject view (with **allows**) · lookups · watch · report | Reads only; never another context's tables |
| 8 Authority | Who may run each action and query? | Held by, Hand-off, Rules allowed | Position per action; named automation + grant per reaction | The app grants nothing; the position does |
| 9 History | What does each action commit? | Writes | State + receipt + trail + outbox, one transaction | Never edit a committed record; a correction is a new one |

**Then derive the deliverables** (the doc 03 sections):
- **tables** come from entities, trails and receipts;
- **API** comes from actions (`POST`) and queries (`GET`);
- the **event list** comes from events;
- the **jobs** come from reactions and timers;
- the **parameters list** comes from parameters.

---

## 5. Shape by task type

The card's **Type** already chooses the screen pattern (doc 02). It also chooses the engine shape.

| Type (doc 02 pattern) | Starts from | Typical actions | Typical states | Used by |
|---|---|---|---|---|
| **Make** (form on the item) | A person opens it, or another seat's event | `Open…` → `Save…Draft` → `Submit…` → approval `Decide…` → reaction `Activate…` / `Apply…` | draft → submitted → returned → approved → active · sent_back | T3, T4, T6, **T7**, T8, T10, **T12**, T16 |
| **Record** (form from what was expected) | Another context's event (e.g. invoice captured, write-off approved) | `Capture…` (pre-filled from the expected) → `Post…` | captured → waiting (e.g. on a variance) → posted | T1, T2, T5, T13, **T17**, T22 |
| **Run** (run, then a worklist) | A timer (month end) or a person | `Start…Run` (gate: the set is ready) → `Decide…Item` per item → `Close…Run` → approval | run: open → items decided → submitted → closed · item: proposed → accepted / changed / excluded | T9, T11, T14, T15, T18–T21, T23 |

---

## 6. Naming and the backend form

| Thing | Rule | Example |
|---|---|---|
| Action | Verb + subject, imperative | `SubmitPartyAccountRequest` |
| Event | Subject + verb, past tense. Wire name `context.entity.verb_past` | `PartyAccountRequestSubmitted` · `finance.party_account_request.submitted` |
| Action endpoint | Create: `POST /{entities}` · move: `POST /{entities}/{id}/{verb}` | `POST /party-account-requests/{id}/submit` |
| Query endpoint | `GET`, one business question | `GET /party-account-requests?holder=me` |
| Register / trail | `{entity}` / `{entity}_trail` in the owning schema | `party_account_request` / `party_account_request_trail` |
| Receipt · outbox | One `action_receipt` and one `event_outbox` per context | `accounting_txn.action_receipt` |
| Automation principal | `{context}-{job}`, with a written grant | `finance-onboarding` |
| Invocation identity | Workspace + action + request key + principal; a repeat returns the recorded outcome | Submit pressed twice → one result |

---

## 7. Done-check for an engine card

An engine card is done when every answer is **yes**:

1. Every fact has **one owning context**, and no action writes into another context's table.
2. Every **state** on the map is reached by a **named action**.
3. Every **check** on the card is a **gate** on an action (Warn checks are returned by a query instead).
4. Every **critical rule** (duplicate, unique, balance) is checked **inside the owner's action**, not by a reaction afterwards.
5. Every **hand-off** is an event with a named listener, or an approval with a deciding position.
6. Every **automatic step** is a reaction under a **named automation** (no anonymous "System").
7. Every **wait** has a timer and a parameter with an **owner**, and every approval has a deadline and an escalation.
8. Every **screen list** is one query, and the subject view returns **allows** (permitted actions, and why the others are blocked).
9. Every action is **safe to repeat** (invocation identity) and commits **state + receipt + trail + outbox** together.
10. The words match doc 02: **button = action · list = query · check message = gate result · held by = holder**.

---

## 8. Worked example: set up a party account (T7 · T12 · T17)

The card is doc 01 T7, as changed by doc 03:
- paper form, typed in by the AE (27-Oct);
- our own party master (27-Oct);
- "return the form" for party problems (26-Oct).

### 8.1 Contexts

| Context | Owns (facts) | Schema |
|---|---|---|
| **Finance · party onboarding** | The request, its approval instances, GSTIN checks, bank verifications, the party account's finance fields, bank account, billing instructions | `accounting_txn` |
| **Party master** (Foundation: shared by every context) | Party, tax ids, locations, contacts, roles | `party_master` |
| **GL kernel** | Accounts (headers and leaves), the account ↔ party link | `accounting` |
| **HR** | Positions and who holds them (authority is read from here) | — |
| *Outside* | GST portal · bank penny-drop service | Adapters; their answers come back as recorded results |

### 8.2 Entities and states

| Entity | Context | States |
|---|---|---|
| **Party account request** | Finance | draft → submitted → (returned → submitted) → approved → active · draft → sent_back · draft → cancelled |
| **Approval instance** (one per checker block) | Finance | requested → approved · returned · expired |
| GSTIN check · bank verification | Finance | Recorded results (no lifecycle) |
| **Party** · **Party role** | Party master | active → inactive · merged · role: active → on_hold → ended |
| **Account** (leaf) | GL kernel | open → blocked → closed |

### 8.3 The thread, one row per step

| # | Step | Context | Action | Gates (from the card's checks) | Event | Who listens | Principal |
|---|---|---|---|---|---|---|---|
| 1 | Open from the paper form | Finance | `OpenPartyAccountRequest` | Form number not already open · side given | `PartyAccountRequestOpened` | (nobody yet) | AE, by position |
| 2 | Type it in | Finance | `SavePartyAccountDraft` | Status draft/returned · caller is the maker · party fields locked when an existing party is used | — | — | AE |
| 3 | Check the GSTIN | Finance | `CheckGstin` | GSTIN format · contains the PAN | — | — | AE |
| 4 | Verify the bank account | Finance | `VerifyBankAccount` (penny-drop · call-back) | Account + IFSC given · call-back number not from an email | — | — | AE |
| 5 | Submit | Finance | `SubmitPartyAccountRequest` | All Stop checks clear (doc 03 §6) · GSTIN checked and active · penny-drop current · no duplicate in the party master | `PartyAccountRequestSubmitted` | Rajan · Usha / Farid · Venkat (their approvals) | AE |
| 6 | Return the form | Finance | `ReturnPartyAccountForm` | Reason required · status draft/returned | `PartyAccountFormReturned` | Procurement / Sales (notice) | AE |
| 7 | Decide one block | Finance | `DecidePartyAccountChange` (approve · return) | Caller holds the block's position · **maker ≠ checker** · reason on return · the last approval moves the request to approved | `PartyAccountChangeReturned` · `PartyAccountRequestApproved` | AE (Needs me) · Party master | Rajan / Usha / Farid / Venkat, by position |
| 8 | Create or extend the party | **Party master** | `RegisterParty` or `AddPartyRole` (by reaction) | **Active GSTIN unique** · PAN format · request approved | `PartyRegistered` · `PartyRoleAdded` | Finance | `party-master-intake`, by grant |
| 9 | Open the account | Finance → **GL** | `ActivatePartyAccount`, which calls GL `CreatePostableAccount` | The role exists · header exists and is not postable · **account name unique** | `PartyAccountActivated` | Purchase / Sales (can post) · Payables (MSME clock) · Compliance | `finance-onboarding`, by grant |

**Steps 8–9 are reactions**: no one judges them. Everything before them is the AE's task, plus the checkers' approvals.

### 8.4 Approvals, timers, parameters

| Item | Declared |
|---|---|
| Approval: party, account, terms, MSME | Accounts Manager · return needs a reason · deadline = *checker response days* · on expiry: escalate to the Finance Controller |
| Approval: bank | Finance Controller · same rules |
| Approval: credit limit (customer) | Credit Controller · same rules |
| Approval: GST / TDS tagging | Compliance Officer · whether it blocks activation is open (doc 03 Q6) |
| Timer `ApprovalDeadlineReached` | Reaction `approval-escalation` sends a notice to the escalation position |
| Timer `UdyamReminderDue` (every 7 days while MSME is unknown or Udyam is missing) | Reaction `msme-reminders` → `SendUdyamReminder` |
| Parameters (owner) | Usual credit days (AM) · MSMED Act maximum 45 (Compliance) · penny-drop pass mark (FC) · checker response days (AM) · Udyam reminder interval (AE ✅) |

### 8.5 Queries

| Query | Serves | Reads |
|---|---|---|
| `NeedsMe` | AE task home: draft · returned · held by me | Request + holder |
| `PartyAccountRequestView` | The workspace: values, worked-out values, checks, **allows**, history | Request; party by `party_id`; matches from `PartySearch` |
| `PartySearch` (Party master) | "Already in the master?" while typing | Party, tax ids |
| `CheckerQueue` | Each checker's pending blocks | Approval instances by position |
| `PartyAccounts` | Vendors & customers list | Account + party + satellites (view) |
| `OpenFormsByAge` · `VendorsWithoutUdyam` | Indicators / cues | Request · compliance status |

### 8.6 What one commit holds (example: Submit)

- **State:** request → submitted, and 3 approval instances → requested.
- **Receipt:** who, as which position, rules version, invocation identity.
- **Trail:** what changed on the request.
- **Outbox:** `PartyAccountRequestSubmitted`.

All four commit together, or none of them do.

### 8.7 What the method changed in doc 03 (to apply after review)

| # | Finding | Change |
|---|---|---|
| 1 | On approval the mock writes `party_master` from Finance's transaction | Party master writes go through **its own actions** (`RegisterParty`, `AddPartyRole`), called by a reaction (step 8) |
| 2 | Duplicate GSTIN is only found by Finance's search (doc 03 Q1) | Make it a **gate inside `RegisterParty`** (unique on active GSTIN). The search stays as an early warning |
| 3 | Checker blocks have no deadline | Add `due_at` and an `expired` state to `party_account_change`, plus the timer and escalation (§8.4) |
| 4 | Idempotency only on opening a request | **Invocation identity + receipt** on every action (`action_receipt` table) |
| 5 | "System" writes everything | **Named automations:** `party-master-intake`, `finance-onboarding`, `msme-reminders`, `approval-escalation` |
| 6 | Request history lives only in the mock | Add a `party_account_request_trail` table |
| 7 | Checks are computed in the screen (mock) | `GET /party-account-requests/{id}` returns **allows** and the gate results; the screen only renders them |

---

## 9. The deck's open points: our proposal

| Deck's open point (slide 29) | Our proposal |
|---|---|
| Invocation identity and receipts | **Adopt now**, on every action and reaction (§6, §7 item 9) |
| Named automation principals | **Adopt now**: no "System" (§8.3 steps 8–9) |
| How a notice is modelled | A reaction calling a `Notify…` action, under a named automation |
| The one approval mechanism (Accounting boundary team) | Our approval instance per checker block fits its shape: an entity, a gated action, a timer, an escalation. Align with them before building |
| Outbox or broker · hand-written or generated | Not ours to decide. The method works either way |

---

## 10. Next

1. Agree this method; then apply §8.7 to doc 03.
2. Write one engine card per task with the same steps (§4). Start with the Make tasks (same shape as onboarding).
3. Bring the onboarding thread (§8.3) to the Render presentation as this seat's example.

**Source boundary:**
- The 9 words and their rules are taken from the deck. The card mapping (§3), the steps (§4), the shapes (§5), the done-check (§7) and the worked example (§8) are this doc's proposal.
- Action and event names are illustrative until the backend is agreed.
