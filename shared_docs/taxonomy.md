# A taxonomy of tasks

**Status.** A proposal from the Contracts & Services Procurement Officer seat, 15 October 2026. The team has not adopted it. It adds no word to the shared role format and changes no role file: it is a way of reading the rows the format already has.

**What is the format's, what is inferred, what is unchecked.** The starts, the endings and the rule about lists are the role format's own words (§1). The ten types, and which ending gives which type, are this seat's reading of them; Carry through is an addition the format does not make. The type of each of 430 tasks is one reader's judgement, not checked by a second reader or by any role's owner. The screen each type tends to take (§4) is a design proposal, not tested with anyone who does the work.

**What it is for.** A role file lists a role's tasks, each with what starts it, when it is done, and who it is handed over to. This taxonomy sorts those tasks into ten types. A task's type says what the work is, whatever the role, and it tells the person designing the role's app which kind of screen the task needs.

---

## 1. What it rests on

No document of the team defines kinds of task. What the shared role format (`roles/README.md`) does say is three things, and the taxonomy is built only from them:

| The format says | In its words |
|---|---|
| What starts a task | "something arriving, a date, someone asking, or work coming back after you handed it over" |
| What a task ends in | "a decision made, a question answered, a message sent, a change in the system, or the work handed over to someone else"; its check T1 adds "something understood" |
| What a list is | "Working through a list item by item is one task done many times. Looking across the whole list for a pattern is one task." |

---

## 2. The rule

**A task's type is told by what is true when it is done.** That is the role file's *Done when* column. Two things that look like types are not types:

- **How many at once.** A task done on one item and the same task done on fifty items in a sitting are one type. The second is the first, *many at once*. This is the format's own rule about lists.
- **What starts it.** Each type tends to start in its own way (an Answer when someone asks, a Chase when a wait runs too long), but the start does not decide the type.

Three questions give the type of any task:

1. **What is true when it is done?** Read the *Done when* column. This settles most tasks.
2. **Is it done to one thing, or does it judge a whole list?** A task that does the same thing to each item on a list has the type of what it does to one item. A task that draws one conclusion about the list as a whole is an Assess.
3. **What starts it?** Use this only to break a tie.

---

## 3. The ten types

| Type | In plain words | It is done when |
|---|---|---|
| **Decide** | An outcome is chosen, among a few set ones, for something that arrived. | One of a few set outcomes (approve, reject, match, hold, keep, change) has been chosen for something that arrived. |
| **Make** | A thing is created or updated, and the role decided its content. | A thing exists or is changed, and the role decided what is in it. |
| **Record** | What happened is recorded as it happened; the role does not decide the content. | What happened is on the record as it happened. The content was given by an event, a paper or an approved change. |
| **Ask** | A request is sent to someone who has the ability to act on it. | A request is with someone who can do or decide what this role cannot. The task ends by handing over. |
| **Chase** | Whoever has had an item too long is reminded of it. | Whoever has had the item too long (a request, a decision, goods, papers) has been reminded. Nothing is handed over. |
| **Answer** | A question someone asked is answered. | The person who asked has the answer, and nothing in the system has changed. |
| **Assess** | A whole list, or a period, is judged as a whole, and a conclusion drawn. | There is a conclusion about a whole list or a period that no other task draws. "Nothing found" is a conclusion. |
| **Report** | A summary or explanation is prepared and sent to the person who reads it. | A statement (a summary, an explanation, a return) is with its reader. |
| **Carry through** | A case is seen through all its steps, across several people, until it is finished. | Every step of a case, done by several people, is done. |
| **Run a batch** | One system run is started that acts on a whole set at once. | The system has done one thing to a whole set, at the role's word. |

### Where the ten come from

The format's six endings give nine of the types. The tenth, Carry through, has no ending in the format: it is an addition, and the format's rule that handing over ends a task would cut such a task into several.

| The format says a task ends in | The type | What tells it apart |
|---|---|---|
| a decision made | Decide | |
| a question answered | Answer | |
| a message sent | Chase | about something already asked |
| | Report | a statement, for a reader |
| a change in the system | Make | the role decides the content |
| | Record | the world gives the content |
| | Run a batch | the system does it, over a whole set |
| the work handed over | Ask | the substance is someone else's to do |
| something understood | Assess | a conclusion about a whole list |
| *(not in the format's list)* | Carry through | done only when every step of a case is done |

---

## 4. Each type

For each type: how to recognise it in a role file, examples from the team's role files, and the screen it tends to take. The screen belongs to the Task-UX side, which the team has not settled: it is this seat's proposal, a hypothesis to test, and the type suggests a kind of screen rather than deciding it.

### Decide
- **Recognise it by** a *Done when* that lists outcomes joined by *or*: "approved, rejected with a reason, or put on credit hold".
- **Examples** Decide an order sent for credit review (Credit Controller) · Decide a stock adjustment (Inventory Controller) · Verify an investment proof (Payroll Operations Specialist).
- **Many at once** Review renewals and expiry (Contracts & Services Procurement Officer): each contract nearing its end is renewed, let lapse or replaced, on a date, many in a sitting. Check batches close to expiry (both Stores Officers) and Check pay against the minimum wage (Labour Compliance Specialist) are the same shape.
- **The screen** The item and its evidence side by side, then the choice. Show leads. Pattern: Review, reached from a Worklist when many at once.

### Make
- **Recognise it by** a new or changed thing whose content the role writes: a PO, a plan, a Works Order.
- **Examples** Raise a PO (Procurement Officer) · Prepare a workforce plan (Workforce Planning Lead) · Plan a count cycle (Inventory Controller).
- **The screen** A start that is not blank (the last one like it), many inputs, saved as it goes. Capture leads. Pattern: Flow, or a Form when small.

### Record
- **Recognise it by** content that comes from outside the role: a delivery, a document, an approved change. The role enters it; it does not decide it.
- **Examples** Record a delivery (Stores Officer, Inbound) · Capture a document (Procurement Officer) · Update an employee's details (HR Operations and HRIS Administrator).
- **The screen** What was expected, filled in already, so that only what differs is typed. Capture leads. Pattern: Form, filled in from what was expected.

### Ask
- **Recognise it by** a *Done when* that ends "is with" someone, and a *Hands over to* that names them.
- **Examples** Request a credit-hold release (Credit Controller) · Raise an indent (Stores Officer, Inbound) · Ask for a new item (Stores Officer, Inbound).
- **The screen** The item, and what the receiver needs to say yes. Capture leads, and it is small. Pattern: Form, opened on the item.

### Chase
- **Recognise it by** a start that is a wait running too long, and a *Done when* of "has been reminded".
- **Examples** Remind an approver who has not decided (Expense and Reimbursement Coordinator) · Chase feedback (Talent Acquisition Specialist) · Chase a transfer still on the road (Inventory Controller).
- **The screen** Who has it, since when, what was sent before; one press, with the words drafted, kept on the item. Neither block leads. Pattern: one form-action, on the item.

### Answer
- **Recognise it by** a start of someone asking, and a *Done when* of "question answered". Nothing is written.
- **Examples** Answer where inbound goods are (Stores Officer, Inbound) · Answer a pay query (Payroll Operations Specialist) · Answer whether a customer can take an order (Credit Controller).
- **The screen** The one thing asked about, found in seconds, in one line. Show leads, then the reply. Pattern: Search, and the item's own page.

### Assess
- **Recognise it by** a *Done when* that is one conclusion: "the items, godowns and people that differences cluster on are known", "signed off with its conclusion", "one retain/change recommendation explains concentration and price spread". It usually starts on a date.
- **Examples** Find where differences concentrate (Inventory Controller) · Review the discount and price-override pattern (Sales Manager) · Carry out a review from the audit plan (Internal Auditor, experiment).
- **Not an Assess** A "review" whose *Done when* is "each item has an action". That is a scan: the task done to each item, many at once.
- **The screen** The whole list arranged to show the pattern (grouped, compared, over time), and a place to keep the conclusion, including "nothing found". Show leads. None of the seven patterns keeps a conclusion yet; this is an open gap.

### Report
- **Recognise it by** a statement and a reader: "published", "sent to management", "filed".
- **Examples** Explain DPO (Procurement Manager) · Report workforce measures (Workforce Planning Lead) · Prepare the Audit Committee summary (Internal Auditor, experiment).
- **The screen** The statement drawn up already, with what moved since last time; a word on each line that moved; then send. Show leads. No pattern among the seven fits.

### Carry through
- **Recognise it by** a *Done when* that is the end of a whole case or cycle, reached through several people's steps.
- **Examples** Run an exit (Onboarding and Employee Lifecycle Coordinator) · Investigate and close a case (Compliance and Labour Relations Specialist) · Negotiate purchase rates (Procurement Manager).
- **The screen** The case: its steps, who has each, what is late. Show leads. Pattern: the case's own page (the pattern the earlier model calls a Record), with its steps inside.

### Run a batch
- **Recognise it by** one press by the role, and the system acting on a whole set: calculate, freeze, bring in.
- **Examples** Calculate the payroll (Payroll Operations Specialist) · Freeze payroll inputs (Attendance, Leave and Workforce Administration Specialist) · Bring in the day's bank statement (Reconciliation Executive, experiment).
- **The screen** A gate first (is the set ready, what is missing, from whom), one press, then what was done and what was held, with why. Show leads. No pattern among the seven fits.

---

## 5. Telling near neighbours apart

| If it could be | or | Ask |
|---|---|---|
| Make | Record | Who decides what is entered: the role, or the world? |
| Make | Ask | Is the substance this role's work, or someone else's to do? |
| Ask | Chase | Was it asked before? The first time hands over; after that, nothing is handed over. |
| Decide | Assess | A decision on each item, or one conclusion about the whole? |
| Assess | Report | Is the conclusion the end, or is a statement sent to a reader? |
| Carry through | any other | Is it done at the first hand-over? If not, it is carried through. |

Where a row does not answer the question, the task sits between two types. Record the second type beside the first rather than forcing one.

---

## 6. Hard cases

| Case | How it is typed |
|---|---|
| **A scan**: a "review", "check", "watch" or "validate" over a list, where each item found gets an action | The type of the action on one item, marked *many at once*. Most are a Decide on a date. |
| **A verb that hides the ending**: *maintain*, *run*, *track*, *govern*, *review* | Ignore the verb. Read the *Done when*. |
| **A task done only when a whole case is done** | Carry through. The format's hand-over rule would cut it into several tasks; the role files keep it as one, and so does the taxonomy. |
| **Answering a question** | Answer, a task like any other, though nothing changes. |
| **A row whose *Done when* has two endings joined by *or*** | The type of the usual ending; the other goes in *Could also be*. |

---

## 7. How to type a new task

1. Read the *Done when* alone and find its ending in §3's last column.
2. If it says "each" or "every" over a list, ask whether the task does the same thing to each item (a scan: type it by one item, *many at once*) or draws one conclusion about the list (Assess).
3. If two types still fit, use §5. If the question there does not settle it, write both.
4. Do not change the role file to fit a type. A row that fits no type is a finding.

---

## 8. Tried on 430 tasks

Every task in the team's 26 role files as they stood on 13 October 2026, and the 75 rows of the four seats this seat tried its model on separately (marked *experiment*), were typed by hand. Every row was given one of the ten types; that the reader could place each row is not proof that no other type is needed. `classification.md` beside this file lists each task with its type, role by role.

| Type | Tasks | Of them, many at once | Roles with it (of 30) |
|---|---|---|---|
| Decide | 105 | 27 | 27 |
| Record | 78 | | 21 |
| Ask | 46 | 4 | 20 |
| Answer | 45 | | 19 |
| Make | 39 | 3 | 19 |
| Chase | 30 | | 16 |
| Carry through | 30 | 1 | 14 |
| Report | 29 | 2 | 20 |
| Run a batch | 17 | | 5 |
| Assess | 11 | | 7 |
| **All** | **430** | **37** | |

| Family | Roles | Tasks | Decide | Make | Record | Ask | Chase | Answer | Assess | Report | Carry through | Run a batch |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Finance, stores and sales | 10 | 140 | 41 | 13 | 27 | 20 | 12 | 13 | 6 | 6 | 2 | 0 |
| People | 16 | 215 | 47 | 26 | 44 | 15 | 6 | 11 | 3 | 19 | 28 | 16 |
| Experiment | 4 | 75 | 17 | 0 | 7 | 11 | 12 | 21 | 2 | 4 | 0 | 1 |

What the trial showed:

- **81 tasks sit between two types.** The commonest pairs are Ask/Record (11), Ask/Decide (9), Assess/Decide (6), Ask/Assess (6) and Decide/Record (6). Most are two tasks written as one row.
- **Each type tends to start its own way**, on a rough reading of the words in *Starts when*: 39 of 45 Answers start on someone asking; 22 of 30 Chases on a wait; 9 of 11 Assesses on a date; 25 of the 37 tasks done many at once also start on a date.
- **In these files, Carry through and Run a batch are almost all in the people roles**: 28 of 30 and 16 of 17. That may say as much about how the files were written as about the roles.
- **Report and Run a batch have no screen pattern** among the seven the Task-UX proposal names; Assess has none that keeps a conclusion.

---

## 9. What changed from the first version

The first version (13 October) had **Look over** in Assess's place, with 48 tasks: a look across a whole list, usually on a date. Asked why a look over is a type when it is merely a collection of other tasks, the 48 were read again against the format's rule on lists. 11 judge the whole list and are now Assess. 37 work through a list and handle each item; each now has the type of what it does to one item, marked *many at once* (27 Decide, 4 Ask, 3 Make, 2 Report, 1 Carry through). A second reader (Codex) then found four rows first read as Assess whose ending is an action on each item, and they were moved; that count is included above. No other task changed type.

---

## 10. Limits

- **One reader.** Every type was assigned by one reader. No second reader has checked them, and no role's owner was asked what a row meant. The *Could also be* marks are judgement, and a second reader would move some.
- **A snapshot.** The team's role files change daily. The rows are as they stood on 13 October 2026.
- **Not adopted.** The team has not discussed the taxonomy. Nothing in it is a rule for any seat.

## 11. Open questions for the team

1. Should a role file carry a *Type* column, or should the type stay a reading of the *Done when*?
2. Should the format name *Carry through*, which its hand-over rule would otherwise cut into several tasks?
3. Should the Task-UX proposal take the type as the way from a task to its screen?
