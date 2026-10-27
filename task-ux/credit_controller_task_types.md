# Credit Controller — Task Types and Their Screens

**Purpose:** Our policy for typing the Credit Controller's tasks with the shared taxonomy, and for choosing the screen each task gets.

**Status:** Working policy for this role. The taxonomy itself is one seat's proposal; the team has not adopted it.
**Sources:**
- `docs/shared_docs/taxonomy.md` and `task-types-and-their-ux.pptx` (the taxonomy and its screens)
- `roles/finance/credit-controller.md` (the *Done when* of T1–T7)
- `credit_controller_task_atomicity_analysis.md` (this folder)

---

## 1. Our rules

1. **Type a task by its *Done when*.** Not by its name, its start, or its screen.
2. **One task, one type.** If a task fits two types, check whether it is two tasks (atomicity test). Don't force one.
3. **A list is not a type.** The same thing done to many customers keeps the type it has for one, marked *many at once*.
4. **The type suggests the screen; the card says what is on it.** The task card and "What you fill in" still decide the fields.
5. **Don't change the role file to fit a type.** A task that fits no type is a finding: write it down.

## 2. The types we use

| Type | Done when | In our role |
|---|---|---|
| **Decide** | One of a few set outcomes is chosen for something that arrived | T1, T2, T4, T5, T7 |
| **Ask** | A request is with someone who can do what this role cannot | T3 |
| **Answer** | The person who asked has the answer; nothing in the system changed | T6 |
| **Chase** | Whoever has had an item too long has been reminded | None yet (see §5) |

Not used by this role: Make, Record, Assess, Report, Carry through, Run a batch.

## 3. Our tasks, typed

| Task | *Done when* (role file) | Type | Could also be |
|---|---|---|---|
| **T1** Decide an order sent for credit review | Approved, rejected with a reason, or held with a reason | **Decide** | — |
| **T2** Place a credit hold on a customer | Held with a reason, or left open with a reason | **Decide** | — |
| **T3** Request a credit-hold release | The request is with the Finance Controller | **Ask** | — |
| **T4** Review credit limits | For each customer, kept, or a change requested with a reason | **Decide**, *many at once* | **Ask** (the change goes to the Accounts Executive) |
| **T5** Check a credit-limit edit | Agreed, or objected to with a reason | **Decide** | — |
| **T6** Answer whether a customer can take an order | Question answered | **Answer** | — |
| **T7** Check a credit-days deviation | Accepted, or objected to with a reason | **Decide** | — |

**Mix:** 5 Decide · 1 Ask · 1 Answer. **A Decide-heavy role.**

## 4. The screen each type gets

| Type | Leads with | Screen | Must have | Must not |
|---|---|---|---|---|
| **Decide** | Show | **Review:** the item and its evidence side by side, the endings at the foot | A reason only when departing (reject, hold, object) | Approve on a list row (hides the evidence) |
| **Decide, many at once** (T4 quarterly) | Show | **Worklist:** one row per customer, the ending on the row | Each customer still decided on its own | One sign-off for all |
| **Ask** | Capture (small) | **Form, opened on the item** | What the receiver needs to say yes; often one press | A page of its own, away from the item |
| **Answer** | Show, then CnC | **Search**, then the item's own page | The answer in one line, in seconds | A report to scroll while someone waits |

**Opening page:** a Decide-heavy role opens on **an inbox of what is to be decided**. In our app that is the Dashboard's Action center.

## 5. What this means for our app

| Task | Today | Policy | Change |
|---|---|---|---|
| T1, T2, T5, T7 | Evidence, then the decision at the foot | Review | ✅ None |
| T4 | One customer, or Bulk review | Review, and a Worklist for many | ✅ None (each customer separate) |
| T3 | Its own page with a request form | Form **opened on the hold** | 🟠 Start the request from the held customer or order |
| T6 | A queue of questions | **Search** first, one-line answer | 🟠 Add search, and the answer in one line |
| — | "Waiting on others" only shows the wait | A **Chase** is its own type | ❓ Ask the role holder (below) |

## 6. Open questions

1. **T4:** is "request a change" part of the review (Decide), or a separate Ask? If separate, T4 is two tasks in one row.
2. **Chase:** does the role remind the Finance Controller (release waiting) or the Accounts Manager (limit waiting)? If yes, it is a missing task, type Chase.
3. **T6:** is the answer tracked? If not, it is still an Answer, but with no queue: search only.
4. **Type column:** should the role file carry a *Type* column? (taxonomy, question 1)

## 7. Source boundary

- The *Done when* text is the role file's (**Fact**).
- The ten types and their screens are the taxonomy's (**one seat's proposal**, not adopted).
- The type given to each task, the app changes and the open questions are **our reading**, to confirm with the role holder.
