# One Box, One Cycle — a general way to build the engine (accounting first)

**Purpose:** One general way to build the backend for **any** task of **any** seat, as general as the engine-concepts deck. It replaces the earlier `01_case_engine.md`.

**Status:** Proposal · 27-Oct-2026 · Owner: Vijay (Accounts Executive seat, accounting engine)
**Built on:**
- `docs/shared_docs/engine_shared/engine-concepts.pptx`: its 9 words and 7 rules stay as they are;
- what the main accounting engines do (§2);
- docs 03–05 in this folder, as the record of what we must solve.

---

## 1. The idea in one line

> **Every change to the business is a Box. Every Box lives the same one cycle. Only a posted Box writes the Books.**

```text
  task + UX screen ──► BOX CARD (one per box type: fields, gates, sign-offs, post rules)
                                │ read by the screen and the engine
                                ▼
   person / reaction ──► BOX   draft ─► submitted ─► posted ──post rules──► BOOKS
                         (one cycle, every box type)   │        ├─ Journal   (money: Dr = Cr, append-only)
                                                       │        ├─ Registers (facts: party, account, item…)
                                                       │        └─ Balances  (posted · pending)
                                                       └─► event (outbox) ─► reactions open other boxes
```

- **The Box** is the deck's *entity* and *action*, built once for everyone.
- **The Box card** is the only thing a seat writes per task.
- **The Books** are where the facts live: the deck's *register + trail*, plus a *journal* for money.

---

## 2. What accounting engines already agree on

| Engine | What it does | Lesson we take |
|---|---|---|
| **ERPNext / Frappe** | Every document type has the **same** `docstatus`: Draft (0) → Submitted (1) → Cancelled (2). Submitting makes the GL entries. Cancelling posts **reverse entries**; nothing is deleted. | **One cycle for every document** |
| **SAP S/4HANA** | The *document principle*: no posting without a document. Everything lands in **one journal** (ACDOCA). A reversal is a new document with a **reason**, posted only into an **open period**. Documents can be *parked* before posting. | **One journal · reasons · periods** |
| **Oracle Subledger Accounting** | **Accounting events** plus **rules** (journal entry rule sets, account rules, mapping sets) give subledger journals, then the GL. It can account in **draft** (a preview) or **final**. | **Rules are data, kept apart from the document · preview** |
| **Workday Accounting Center** | Turns business events into journals with **user-defined rules**, keeping the lineage. | **Any business event can post** |
| **TigerBeetle** | Two-phase transfers: **pending** (reserves the amount) → **posted** or **voided**, or **expired** on a timeout. Finishing one writes a **new** record; nothing is changed. Separate pending and posted balances. | **Hold, then post or void · timeouts** |
| **Modern Treasury Ledgers** | A transaction is `pending` (can still change) → `posted` or `archived` (can never change again). It shows pending, posted and available balances. | **Mutable until posted, then frozen** |
| **Formance Ledger** | Atomic multi-posting transactions, idempotent, with balance enforced **at the store**, not in the app. | **The store guards the books** |
| **Odoo** | `account.move` goes draft → posted → cancel, with lock dates and a hash lock on posted entries. | **Lock what is posted** |
| **Fowler, *Patterns for Accounting*** | A domain event goes through a **posting rule**, which produces accounting entries. Corrections are made by **reversal adjustment**. | **Event → rule → entries** |

**Eight lessons:**
1. One lifecycle for every document type.
2. Draft can change. Posted never changes.
3. A correction is a new document that reverses the old one, with a reason.
4. Rules that turn a document into entries are **data**, versioned and separate from the document.
5. One journal for everything, and every line traces back to its document.
6. Reserve first (pending), then post or void. Anything that waits has a timeout.
7. Preview the entries before posting.
8. Post only into an open period. The store itself enforces balance and uniqueness.

**What is new here:**
- Those engines use the box for **money only**. We use the same box for **every** fact: a new vendor, a credit-limit change, a provision run, a Works Order.
- We tie it to the deck's words, so each seat writes a short **card** instead of a fresh design.

---

## 3. The Box: what is inside

| Part | Holds | Always there? |
|---|---|---|
| **Header** | Type · key (idempotent) · state · maker · posting date · period · values · origin of each field | Yes |
| **Lines** | Voucher lines, run lines, recon breaks | When the type has lines |
| **Probes** | Outside checks: GST portal, penny-drop, OCR. Each is tied to the input it ran on | When declared |
| **Sign-offs** | Position · the **fields it covers** · due date · escalation | When declared |
| **Holds** | Amounts reserved while the box waits: credit exposure, budget, cash | When declared |
| **Trail** | Every call: who, which position or grant, the diff, the reason. Each line is also the receipt | Yes |
| **Links** | `reverses` / `reversed_by` · `opened_by` (the box or event that caused it) | When used |

---

## 4. The one cycle (every box type, every seat)

```text
              submit (gates)            last sign-off (or none) · period open
   draft ────────────────► submitted ───────────────────────────────► posted
     ▲     return (reason)     │                                         │
     └─────────────────────────┘                                         │ reverse (reason, date)
     │                         │ void (reason) · expire (timer)          ▼  = a NEW box that posts
     └──── void ─────► voided ◄┘                                    reversed (a mark; stays posted)
```

| State | Can it change? | Effect on the Books | Who holds it |
|---|---|---|---|
| **draft** | Yes, by the maker | None | The maker: Needs me (or "Returned") |
| **submitted** | No (frozen) | **Holds placed** (pending balances) | The signers. The maker sees it under Waiting on others |
| **posted** | **Never** | Journal and/or registers written; holds → posted | Done |
| **voided** | Never | Holds released | Done. The reason is one of: cancelled · sent back to source · rejected · expired |
| **reversed** | Never (a mark) | The reversing box posts the exact opposite | Done |

**The same 5 states in the other engines:**

| Ours | ERPNext | SAP | TigerBeetle | Modern Treasury | Odoo |
|---|---|---|---|---|---|
| draft | Draft (0) | parked | — | pending | draft |
| submitted | (workflow) | parked, in approval | pending | pending | — |
| posted | Submitted (1) | posted | posted | posted | posted |
| voided | — | parked doc deleted | voided · expired | archived | cancel (never posted) |
| reversed | Cancelled (2) + reverse GL | reversal document | a new transfer | a new reversing txn | a reversal move |

**Engine-wide gates, on every box type, never in a card:**
- the signer is not the maker;
- the posting date is in an **open period**;
- the journal balances (Dr = Cr);
- a probe counts only for the input it ran on;
- the same key or the same request returns the same answer.

---

## 5. The Books: where facts live after posting

| Book | What | How it is written | Example |
|---|---|---|---|
| **Journal** | Money. Entries with lines, Dr = Cr | Append only. Never updated. A correction is a reversal entry | Purchase voucher: Dr Purchases · Dr Input GST · Cr Vendor · Cr TDS |
| **Registers** | Facts with an owner: party, account, item, terms, bank, limit | A new **version row** (`valid_from` / `valid_to`). The old row is kept | Vendor bank changed: the old row is closed and a new row opens |
| **Balances** | Per account, party and period: **posted** and **pending** | Updated in the same commit as the journal and the holds | Available credit = limit − posted − pending |
| **Periods** | open · closed, per company and month | Only the Accounts Manager closes a period, and closing it is itself a box | Posting into a closed month → the gate refuses |

**Every book row carries `posted_by_box`.** Any balance can therefore be followed back to the line, the box, the maker, the signers and the paper (SAP's document principle).

---

## 6. Post rules: the box turns into book entries

- **Post rules are part of the card: data, versioned.** They are not hand-written code (the Oracle SLA / Workday / Fowler idea).
- **Account rules are named lookups:** `party.payable_account`, `tax.input_cgst`, `item.expense_account`. Each lookup has an owner.

```yaml
post:                                   # purchase voucher (T1), shortened
  journal:
    - {for_each: line, dr: line.taxable, account: line.expense_account}
    - {for_each: line, dr: line.cgst,    account: tax.input_cgst}
    - {for_each: line, dr: line.sgst,    account: tax.input_sgst}
    - {cr: total - tds, account: party.payable_account, party: vendor}
    - {cr: tds,         account: tax.tds_payable(section)}
  register:
    - open_item: {party: vendor, bill_no, amount: total - tds, due: due_date}
```

- **Preview** = run the post rules without saving. The screen shows the exact journal before submit.
- **Reverse** = the engine mirrors the posted lines (Dr ↔ Cr) and re-opens the register rows. No card is needed for it.
- **A non-money box** (a new vendor) has `register` rules only. **A pure money box** has `journal` rules only. **Most boxes have both.**

---

## 7. The Box card: the only thing a seat writes per task

| Part | Read from (task card + UX screen) | Example |
|---|---|---|
| 1 **Type + owner context** | Subject · the context that owns the fact | `purchase_voucher`, Finance |
| 2 **Fields + lines** | Every input box and table on the screen, with worked fields (`from:`) | vendor, invoice no, lines… |
| 3 **Gates** | Every red or amber line: stop · return · warn | duplicate invoice → stop |
| 4 **Probes** | Every "check" button | GST portal · penny-drop · OCR |
| 5 **Sign-offs** | Hand-off · "Waiting on …": position, covers, due, escalate | Accounts Manager, all fields |
| 6 **Holds** | Anything reserved while waiting | none · credit exposure · budget |
| 7 **Post rules** | Done when · Writes | journal + register |
| 8 **Opens / reacts** | Trigger (person · event · schedule) · what it starts next | on `QcRejected` → open `debit_note` |
| 9 **Notify + watch** | Sends · Indicators | posted → Procurement Officer |

**Nothing else is written per task:**
- states, verbs, events, inbox, history, receipts, reversals and periods come from the engine;
- **Held by** comes from the state and the sign-offs;
- **allows** comes from the gates.

---

## 8. The deck's 9 words, all inside the box

| Deck word | How the box gives it |
|---|---|
| **Context** | Each box type has one owner context, and its post rules write only that context's books. To change another context's facts, a reaction opens **a box of that context** (or calls its action). |
| **Entity** | The box itself (one declared cycle) plus the register rows it writes |
| **Action** | The cycle's verbs: **Open · Save · Submit · Decide · Void · Reverse** (Post runs inside Decide or Submit). Each has the card's gates plus the engine-wide gates. |
| **Event** | Automatic and past tense: `<Type>Opened · Submitted · Returned · Posted · Voided · Reversed`, each carrying its box id and request id |
| **Reaction** | A card line `on <event> when <cond> → open/submit <box type>`, run under a **named automation** |
| **Approval + timer** | The **submitted** state is the approval: sign-offs with covers, due and escalation. Expiry → voided (reason: expired). Holds have their own timeouts. |
| **Query** | The box view (values, gates, **allows**, trail, preview) · the inbox (from state) · the books (journal, balances, registers) |
| **Authority** | The card names the maker and signer positions, checked against HR on every call. Automations act only through their grant. |
| **History** | One commit: box state + trail line (= receipt) + book rows + balances + outbox. Posted is never edited. |

**The deck's 7 rules hold by construction:**
1. Nobody touches another context's tables.
2. Critical rules are in the commit (period, balance, uniqueness).
3. Every call is safe to repeat (the key and request id).
4. Events are past tense and never edited.
5. Reactions retry visibly.
6. Automations are named.
7. The screen asks `allows`.

---

## 9. The engine schema and API (built once)

### 9.1 Tables

```sql
-- the box (all types)
box_type     (type, version, owner_context, card jsonb, active)        -- PK (type, version)
box          (id, type, card_version, key UNIQUE, state,               -- draft|submitted|posted|voided
              maker_user, maker_position, values jsonb, origins jsonb,
              posting_date, period, void_reason,
              reverses_box, reversed_by_box, opened_by jsonb, row_version)
box_line     (box_id, line_no, values jsonb, origins jsonb)
box_probe    (id, box_id, probe, input_hash, result jsonb, at)
box_signoff  (box_id, step, position, covers text[], state, decided_by, note, due_at, escalated_at)
box_hold     (id, box_id, book_key, amount, state, expires_at)          -- pending|posted|released
box_trail    (id, box_id, at, actor, position_or_grant, verb, diff jsonb, note,
              request_id UNIQUE, card_version)                          -- the receipt
outbox       (id, topic, box_id, payload jsonb, at, sent_at)

-- the books
journal_entry (id, box_id, kind, posting_date, period, reverses_entry)  -- kind: normal|reversal
journal_line  (entry_id, line_no, account_id, party_id, item_id, dr, cr, currency, dims jsonb)
              -- append-only (no UPDATE/DELETE grant); a deferred trigger checks Dr = Cr per entry
balance       (account_id, party_id, period, dr_posted, cr_posted, dr_pending, cr_pending)
period        (company, code, state)                                    -- open|closed
-- registers: typed, owned by their context, versioned
<register>    (…typed columns…, valid_from, valid_to, posted_by_box)
```

### 9.2 API (the same for every box type)

| Call | Does |
|---|---|
| `GET /box-types/{type}` | The card. The screen lays itself out from it |
| `POST /boxes {type, key, source}` | Open → draft. The same key returns the same box |
| `PATCH /boxes/{id}` | Save: works out fields, runs the gates, returns the view |
| `POST /boxes/{id}/probes/{name}` | Runs an outside check |
| `GET /boxes/{id}/preview` | The journal lines and register writes it **would** post |
| `POST /boxes/{id}/submit` | Gates → submitted · holds placed · sign-offs requested (or posts at once if there are none) |
| `POST /boxes/{id}/signoffs/{step}` | approve · return · reject. The last approval → **post**, in one commit |
| `POST /boxes/{id}/void {reason}` | → voided · holds released |
| `POST /boxes/{id}/reverse {reason, date}` | Opens and posts the mirror box · marks the original as reversed |
| `GET /boxes/{id}` | The view: values · origins · gates · sign-offs · **allows** · trail |
| `GET /my-work?tab=` | The inbox for any seat (Needs me · Waiting · Done) |
| `GET /books/journal` · `/books/balances` · `/registers/{name}` | Read-only books |

### 9.3 One job

`box-sweep` runs under a named automation. It:
- escalates late sign-offs;
- expires holds and boxes;
- opens scheduled boxes (month end, quarter end);
- sends reminders.

---

## 10. It is general: the same box for different seats

| Seat | Box type | Lines? | Sign-offs | Holds | Posts to |
|---|---|---|---|---|---|
| Accounts Executive | `new_vendor` (T7) | — | AM · FC (bank) · CO (tax) | — | Registers: party, account, terms, bank |
| Accounts Executive | `purchase_voucher` (T1) | yes | AM | — | **Journal** + open item |
| Accounts Executive | `provision_run` (T15) | yes, from a query | AM → FC | — | Journal (reversed next month) |
| Credit Controller | `credit_limit_change` | — | Accounts Manager | — | Register: limit (versioned) |
| Sales | `sales_order` | yes | if over the limit | **credit exposure** | Register: order (released) |
| Procurement Officer (the deck's example) | `works_order` | milestones | Procurement Manager | **budget commitment** | Register: Works Order released |
| Accounts Manager | `period_close` | checklist | Finance Controller | — | Register: the period becomes closed |

**All 23 AE tasks fit three shapes:**
- **Form** (header only): T6 · T7 · T8 · T12 · T17.
- **Voucher** (header + lines → journal): T1 · T2 · T3 · T4 · T5 · T13 · T16 · T22.
- **Run** (lines filled from a query): T9 · T10 · T11 · T14 · T15 · T18 · T19 · T20 · T21 · T23.

---

## 11. From task + UX screen to backend: the recipe

1. **Name the box type and its owner context** (from the card's Subject and Writes).
2. **Copy the screen into fields and lines.** Mark worked fields with `from:`.
3. **Copy each red or amber line into gates,** and each "check" button into probes.
4. **Copy "Waiting on …" into sign-offs,** with the fields each one covers.
5. **Write the post rules:** journal lines and/or register writes. **Preview them** on one real paper.
6. **Add holds** (only if something is reserved while waiting), **opens and reactions**, notify and watch.
7. **Run one real case through the cycle in a table** (who → call → engine → books). Done.

**Worked examples in this folder:**
- `02_example_create_vendor.md`: registers only.
- `03_example_purchase_voucher.md`: the journal.

---

## 12. Limits (honest)

- **Draft values are jsonb.** The card checks them; the books are fully typed and guarded by the store.
- **Post-rule lookups need owners.** Who maintains `tax.input_cgst`, or the category → header mapping? This goes into the Rules area.
- **Posting across contexts in one commit needs one database** (true for the POC). Later, the other context's part becomes a reaction that opens a box there; the card does not change.
- **A run with thousands of lines** needs paging and gates per line.
- **The engine is a team asset, not the AE's alone.** It must be agreed with the Accounting boundary team, which owns "the one approval mechanism" since 26-Oct.

---

## Open questions

| # | Question | Proposed |
|---|---|---|
| B1 | Adopt the box as **the one approval mechanism** (deck open point 6)? | Yes: the submitted state + sign-offs + sweep |
| B2 | Should post rules be YAML in the repo, or edited in the Rules area? | Repo for the POC; the Rules area later, with an owner per lookup |
| B3 | Are registers versioned rows (`valid_from`/`valid_to`) for every master? | Yes. The bank and the credit limit must be |
| B4 | Is "reverse" allowed on master boxes too (undo a new vendor)? | No. Block the vendor with a new box instead; reverse is for the journal |
| B5 | Should holds be in the POC? | Not for the AE tasks. Needed for Sales (credit exposure) and Procurement (budget) |

**Sources:**
- [ERPNext immutable ledger](https://docs.frappe.io/erpnext/immutable-ledger-in-erpnext)
- [SAP postings and documents](https://learning.sap.com/learning-journeys/outlining-the-record-to-report-process-in-sap-s-4hana/explaining-the-basic-concepts-of-postings-and-documents_af02b1a9-7fdb-4f1a-88c9-f3121d7624f1)
- [SAP reversal](https://learning.sap.com/learning-journeys/outlining-the-record-to-report-process-in-sap-s-4hana/identifying-how-to-reverse-journal-entries_c7c33143-d978-4dcf-9e36-d598531a44c6)
- [Oracle Subledger Accounting](https://docs.oracle.com/cd/E26401_01/doc.122/e48829/T372621T464264.htm)
- [Workday Accounting Center](https://doc.workday.com/admin-guide/en-us/financial-management/accounting-center/fea1611272151570.html)
- [TigerBeetle two-phase transfers](https://docs.tigerbeetle.com/coding/two-phase-transfers/)
- [Modern Treasury transaction status](https://docs.moderntreasury.com/docs/transaction-status-and-balances)
- [Formance Ledger](https://github.com/numary/ledger)
- [Fowler, Patterns for Accounting](https://www.martinfowler.com/eaaDev/AccountingNarrative.html)
- [Fowler, Reversal Adjustment](https://martinfowler.com/eaaDev/ReversalAdjustment.html)
