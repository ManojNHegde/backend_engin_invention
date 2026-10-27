# Contracts & Services Procurement Officer — role app cards

**Status:** working instance of the [Reference Role App Model proposal](./reference-role-app-model-proposal.md), filled from the [Finance Reference Roles and Worklists](https://github.com/foundry-erp/aikyat-business-engine-poc/blob/main/docs/finance-reference-roles-and-worklists.md) §2 (2.1 Purchase, 2.2 Labour Compliance) and the rows of §3, §4, §11, §12, §14 and §21 that touch a Works Order. Where this file and the roles document differ, the roles document is right and this file is stale. The roles document lives in the engine repository, `aikyat-business-engine-poc`; the proposal and these cards live here, with the app they produce.

The cards come first — the role and, inferred beside it, the occupier (§1), then the activities (§2) — then what they derive (§3–§5), then what they expose about the engine (§6), the decisions taken where the roles document is silent (§7), how this role app is built (§8), what building it asked of the cards (§9), and the trace of every element on every screen with what it cut (§10).

---

## 1. Role card

| Field | Value |
|---|---|
| **Identity** | Contracts & Services Procurement Officer · R-P03 (proposed) · Stage 1, Buy and store · function: Procurement (this seat's reading; the roles document gives a stage and names no function) · capabilities: **Purchase** (procurement), **Labour Compliance**; reads Parties and Contacts, AR/AP and Inventory |
| **Purpose** | Buy services, contract jobs, job work and professional fees under an agreement whose scope, value and milestones are known in advance — so that every service bill the company pays is for work the receiver confirmed, inside a contract the Procurement Manager approved, with the contractor's labour obligations evidenced before payment. |
| **Rhythm** | Per contract: raise, amend, close · Ongoing: milestones and value consumed · Per milestone or service period: the confirmation · Per invoice: matching · Monthly: renewals and expiry · Per bill or wage period: contractor evidence · Per contractor: licence and registrations |

### Responsibilities

| # | Responsibility | Source |
|---|---|---|
| R1 | Raises the Works Order / Agreement for services, contract jobs, job work and professional fees, in place of a PO | 2.1 |
| R2 | Tracks milestones, contract value consumed and expiry | 2.1 |
| R3 | Obtains the service completion confirmation from the requesting department head before a service bill can be matched | 2.1 |
| R4 | Matches service invoices to the Works Order (three-way: Works Order · confirmation · invoice) and raises variances | 2.1 |
| R5 | Reviews renewals and expiry | 2.1 |
| R6 | Collects the contractor's PF/ESI challans, ECR, wage register and licence for every Works Order that deploys contract labour, so the Compliance Officer can verify them before the bill is paid | 2.2 |
| R7 | Maintains the contractor's licence and registrations on its record | 2.2 |

2.1 also says how the role works: it "uses the shared party record from Parties and Contacts, bill-wise and Branch logic, with no inventory linkage". The cards carry it as: party identity is read only (*Authority*) · each bill is matched and followed on its own (A5, P4) · the Works Order names its branch (A1) · a Works Order has no item lines (§7, decision 7).

### Outcomes and indicators

| # | Outcome (the state the role is accountable for) | Indicator | Good when | Horizon | Served by |
|---|---|---|---|---|---|
| O1 | No service bill reaches accounting unmatched | service invoices awaiting match — count, oldest age | low, young | today | R4 |
| O2 | Nobody is billed ahead of delivery | invoices over the confirmed milestone amount or against an unconfirmed milestone — count and ₹ | zero | today | R3, R4 |
| O3 | No contract runs past its value or its expiry unnoticed | Works Orders > 90 % consumed; expiring in 30 / 60 days; invoices against an expired contract | known and acted on | this month | R2, R5 |
| O4 | Confirmations do not age | unconfirmed milestones past due — count by department head, oldest age | young | this week | R3 |
| O5 | No contractor bill is paid with principal-employer exposure | contractor bills on compliance hold awaiting evidence — count, ₹, age; workers missing from a challan | low, closing | this week | R6, R7 |
| O6 | Works Orders are approved promptly and right first time | Works Orders awaiting commercial approval — count, age; returned-for-rework share | young, low | this week | R1 |
| O7 | Tax treatment is right at source | Works Orders where the suggested TDS code or GST/RCM treatment was overridden — count | low, every one with a reason | this month | R1 |

Every indicator but one names a decision the officer makes when it moves: chase, escalate, match, raise a variance, amend, renew, collect evidence. O7 is the one: it counts the officer's own act, and the seat that acts on it is the Compliance Officer's. It stays an outcome of this role and has no tile here (§3; §7 decision 22).

### Authority

| Makes, for whom to check | Checks, made by whom | Decides alone | Reads only |
|---|---|---|---|
| Works Order / Agreement — *checked by* Procurement Manager (commercial); no accounting approval at this stage | — (this role checks nothing) | Which milestone to chase; when to escalate an aged confirmation; whether an invoice matches within the confirmed amount and remaining value; whether evidence is complete enough to submit | Party identity (Parties and Contacts); bills posted and paid against a Works Order (AR/AP); job-work challans against a Works Order (Inventory); hold status (Payables) |
| Three-way-match variance (Works Order · confirmation · invoice) — *checked by* Accounts Manager | | | |
| Contractor compliance evidence (challans, ECR, wage register) — *checked by* Compliance Officer, who releases the payment hold | | | |

**Cannot:** approve a Works Order · confirm service completion (the requesting department head's) · post the service bill (Accounts Executive) · approve the bill or the variance (Accounts Manager) · place or release the compliance hold (Payables Executive places, Compliance Officer releases) · pay · edit party identity · move job-work goods (Stores / Inventory Officer).

### Counterparts

| Counterpart | Kind | Receives from them | Hands to them |
|---|---|---|---|
| Requesting department head (service receiver) | decides, no role app | the need for a service; the **service completion confirmation** per milestone | the confirmation request when a milestone falls due, with the PF/ESI evidence request where labour is deployed |
| Procurement Manager | role app | commercial approval, or a return for rework | the Works Order to approve; amendments that raise value |
| Vendor / contractor | receives | the invoice; the PF/ESI challans, ECR, wage register, licence — all arriving outside the engine | the Works Order document; chasers on milestones and evidence |
| Accounts Executive | role app | the service invoice, captured once | the matched invoice to post as an expense / service bill against the Works Order |
| Accounts Manager | role app | the decision on a variance | the three-way-match variance with its reason |
| Payables Executive | role app | hold status on contractor bills | — (the hold is theirs; the evidence goes to Compliance) |
| Compliance Officer | role app | verification and release of the hold | the contractor compliance evidence, per bill or wage period |
| Stores / Inventory Officer | role app | the job-work challan state (goods lying with a job worker, return limit) | the Works Order the challan is pre-filled from |
| Parties and Contacts | capability | the vendor's identity, PAN, GSTIN, registration status | a request for a party that does not exist |

### Asked of it

The questions counterparts bring to this seat and expect answered at once. No work item in the roles document produces them; they are inferred from the counterparts above (proposal §2, *Asked of it*), and each is this seat's claim until a real occupier confirms it. They are where search comes from (§8.2).

| Who asks | The question | The one-line answer |
|---|---|---|
| Vendor / contractor | "Where is my bill?" · "Why is it held?" | the stages the bill has passed, the stage it is at, who holds it now and since when; where held, the papers still missing |
| Requesting department head | "What is left on our contract with X?" · "What have I not confirmed?" | the Works Order's value, billed, confirmed, remaining and expiry; their milestones awaiting confirmation |
| Accounts Executive · Payables Executive | "Is this bill matched?" · "Can it be posted?" | the bill's match state, and if not matched, the reason and who holds it |

### The occupier — inferred, to be tested

The role card above is sourced from the roles document. This card is not: it is what this seat believes about the person who sits here, written down so the screens can be shaped for that person and so the belief can be tested (proposal §3). Nobody who has done this job has looked at the app. Thirty minutes with one outranks every line below.

| Field | This seat's answer |
|---|---|
| **Who they are** | A coordinator in the middle. They raise contracts for services, then spend most days chasing: a department head to confirm, a manager to approve, a contractor for a bill or PF/ESI papers. They are the person the vendor phones to ask where a bill is stuck. They are not an accountant and not a tax expert |
| **Unit of thought** | The contract. "The housekeeping contract with X" is one thing in their head: its bills, confirmations, papers, money left, expiry. The Works Order record is where that whole story is told; every list is a way into it |
| **Core verb** | Chasing. Most of the queue is blocked on another person; the officer's move is to remind, escalate or ask the contractor for papers, and to be able to show that they did |
| **The question they get** | "Where is my bill?" from the vendor; "what is left on the contract?" from the department head (*Asked of it*, above) |
| **Today's tool** | An Excel contract tracker, a paper or shared-drive file per contract, and email or WhatsApp for the follow-ups |
| **Their words** | Works Order, contract, bill, confirmation, contractor, papers, challan, pending with, held, expiring. Never: event, match object, variance raised, reaction, derived |

**Claims.** Each is a design assumption a half hour with a real occupier can test. The layout decisions of §8.2 cite them by number; a claim shown wrong points at exactly the decisions to revisit.

| # | We believe | We are wrong if |
|---|---|---|
| C1 | They think in contracts, not in activities | the first thing they ask for is a list of bills across all contracts, or they never open a Works Order from a queue row |
| C2 | Every item is either my move or someone else's, and that split matters more than the item's kind | they sort the queue by kind or by date first and do not care who holds an item |
| C3 | Chasing is the core verb, and the record of having chased matters | a reminder is a once-a-week act, and nobody ever reads the record of it |
| C4 | They must answer "where is my bill" in seconds | vendors do not phone them, or the question goes to Accounts |
| C5 | Their words are the roles document's words plus bill, papers, pending with, held | a label in those words confuses them and the engine's term would not |
| C6 | The three oldest items shown beat a count that needs a click to mean anything | they want the number, and open the list themselves |
| C7 | A refusal must name who can unblock it and offer the chase | they already know who to ask, and the line is noise |
| C8 | Most Works Orders resemble an earlier one with the same vendor, so copy-and-change beats a blank form; drafts must keep themselves because the phone rings mid-form | contracts rarely resemble earlier ones, or a standing template is trusted more than the last order |
| C9 | A tax suggestion arriving filled in with its reason takes away worry rather than adding a question | they never read the reason, or they want to choose the code themselves every time |
| C10 | A register is their Excel, replaced: sort, filter, totals, export, at least as fast | they keep the spreadsheet for something the register does not do — and what that is |

---

## 2. Activity cards

Nine activities. The roles document's five work items in 2.1 and two in 2.2 become nine because *raise* and *amend / renew / close* are separate writes, and job work is a read-only coordination the officer needs but does not perform.

### A1 — Raise a Works Order / Agreement

| Field | Value |
|---|---|
| Serves | R1 → O6, O7 |
| Trigger & cadence | per contract — a department needs a service, contract job, job work or professional engagement |
| Subject | **Works Order** (Purchase): vendor, requesting department head, scope of work, service type, contract value, milestones — each a deliverable or a service period (due date, amount or share, what is delivered), validity / duration, branch, TDS payment code (contractor vs professional fees; legacy 194C vs 194J), GST / RCM applicability, labour-deployed flag |
| Requires | the vendor exists in Parties and Contacts with PAN, registration status, and GSTIN where registered · the requesting department head is a known position · the service type · whether contract labour will be deployed · for job work, the items go through Inventory and are not on this order |
| Information needs | similar past agreements with this vendor or for this service type (templates) · the vendor's open and past Works Orders · the suggested TDS code and GST / RCM treatment **with its reason** · the vendor's registration status · the contractor's licence validity where labour is deployed · the Procurement Manager's view of value against similar contracts |
| Decision | scope, value, milestone structure and validity; accept or override the suggested tax treatment — an override needs a reason and is logged for the Compliance Officer |
| Writes | `WorksOrder.Draft`, `WorksOrder.SubmitForApproval` — *makes for* the Procurement Manager |
| Hand-off | Procurement Manager — event `WorksOrderSubmitted` lands on the manager's approval worklist with value, vendor and the comparison against similar contracts |
| Held by | draft · returned for rework — this role, *needs me* · awaiting approval — the Procurement Manager, *waiting on others* |
| Exceptions | vendor missing or unregistered · contractor licence expired · value unusual against similar contracts · tax suggestion overridden |
| Parameters | similar-contract value band — ±25 % of the median of similar agreements; outside it the order is flagged as unusual |
| Indicators | O6 awaiting approval, age · O7 overrides |
| Experience | **Flow** (parties and scope → milestones → tax and compliance → review and submit) · in-context: tax suggestion panel, similar-agreements panel. Similar agreements is consulted only while raising, so it is a panel and not a report (§7 decision 23) |

### A2 — Amend, renew or close a Works Order

| Field | Value |
|---|---|
| Serves | R1, R5 → O3, O6 |
| Trigger & cadence | as needed — scope or value changes, validity approaches its end, the work is done or abandoned |
| Subject | Works Order (approved) |
| Requires | an approved Works Order · a reason · for an amendment that raises value, re-approval by the Procurement Manager |
| Information needs | value consumed, invoiced and paid · milestone states · open invoices and unconfirmed milestones · the amendment history |
| Decision | amend (re-approval if value rises) · renew (new validity, same or new value) · close (remaining value released from commitment) · short-close where milestones remain |
| Writes | `WorksOrder.Amend` (→ re-approval when value rises), `WorksOrder.Renew`, `WorksOrder.Close` |
| Hand-off | Procurement Manager on re-approval |
| Held by | an approved Works Order is nobody's queue item · an amendment awaiting re-approval — the Procurement Manager, *waiting on others* |
| Exceptions | close attempted with an unconfirmed milestone or an unmatched invoice |
| Parameters | — |
| Indicators | O3 |
| Experience | **Record** (Works Order) carrying the three actions · **Form** for the amendment |

### A3 — Track milestones and value consumed

| Field | Value |
|---|---|
| Serves | R2 → O2, O3 |
| Trigger & cadence | ongoing; the weekly review is this seat's reading |
| Subject | **Milestone** (Purchase), of kind *deliverable* or *service period* |
| Requires | an approved Works Order with milestones |
| Information needs | milestones due in 7 / 30 days and overdue · % of contract value consumed per Works Order · billing ahead of completion · the vendor's delivery history on earlier milestones |
| Decision | which milestone to chase with the vendor; when to request confirmation early; whether consumption warrants an amendment |
| Writes | none of its own — a chaser is a notice, a confirmation request is A4, an amendment is A2 |
| Hand-off | — |
| Sends | a chaser to the vendor on a milestone falling due or overdue — a notice, kept on the milestone (§7, decision 9) |
| Held by | due inside the due window, confirmation not yet requested — the contractor, *coming up*. Once the confirmation is requested the milestone is A4's |
| Exceptions | milestone overdue · value consumed > 90 % · an invoice dated before its milestone's completion |
| Parameters | milestone due windows — 7 and 30 days · consumption warning — 90 % of contract value |
| Indicators | O2, O3 |
| Experience | **Worklist** (milestones by due date) · report: Works Order register, which carries approved, confirmed, billed, paid and left for each contract |

### A4 — Obtain the service completion confirmation

| Field | Value |
|---|---|
| Serves | R3 → O2, O4 |
| Trigger & cadence | per milestone or service period — the system sends the request when the milestone falls due; the officer follows up |
| Subject | **Service Completion Confirmation** (Purchase) — *made by the requesting department head*, not by this role; the services equivalent of a GRN |
| Requires | the milestone has fallen due or the vendor claims delivery · the department head is identified · where labour was deployed, the PF/ESI evidence request travels with the confirmation request (A7) |
| Information needs | unconfirmed milestones aged, by department head · each request's status (sent, reminded, confirmed, partial, declined) · what the head confirmed against what the milestone said |
| Decision | when to remind; when to escalate; what to do with a partial confirmation (amount or quantity below the milestone) |
| Writes | `Milestone.RequestConfirmation`, `Milestone.RemindConfirmation`, `Milestone.EscalateConfirmation` |
| Hand-off | the department head — event `ConfirmationRequested` reaches them as a notice; their `ServiceCompletionConfirmed` unlocks matching (A5). This app gives them no screen (§7) · a reminder or an escalation is a notice to the same department head, the escalation copied to the Procurement Manager; neither creates work for anyone else |
| Sends | the confirmation request when the milestone falls due · a reminder · an escalation, copied to the Procurement Manager — each a notice kept on the request |
| Held by | requested, no reminder or escalation due — the department head, *waiting on others* · a reminder or escalation due — the department head, and this role's move is to chase, *needs me* · confirmed in part · declined — this role, *needs me* |
| Exceptions | confirmation aged past N days · partial confirmation · confirmation declined |
| Parameters | reminder — 3 days with no answer, counted from the request or from the last reminder, so it falls due again · escalation — 7 days past the milestone's due date |
| Indicators | O4 |
| Experience | **Worklist** (awaiting confirmation) with remind / escalate inline · **Record** (milestone) showing the confirmation's state and content |

### A5 — Match a service invoice to its Works Order

| Field | Value |
|---|---|
| Serves | R4 → O1, O2 |
| Trigger & cadence | per invoice — the Accounts Executive captures a service invoice against a Works Order, the engine pre-computes the match and places the invoice here |
| Subject | **Service Invoice Match** (Purchase): the invoice ↔ a milestone or service period ↔ its confirmation |
| Requires | the invoice captured by the Accounts Executive — vendor, number, date, amount, GST, the milestone or period it bills · a **confirmed** milestone: the engine refuses a match against an unconfirmed one · the Works Order is in validity · remaining contract value |
| Information needs | the Works Order, the confirmation and the invoice side by side · remaining contract value · earlier invoices on this Works Order · the vendor's past variance pattern · duplicate check (same vendor, same number or amount) |
| Decision | **match** — within the confirmed amount and remaining value; a clean pre-computed match is confirmed in one step — or **raise a variance** with its reason: over the confirmed amount, over the remaining contract value, milestone unconfirmed, contract expired, duplicate |
| Writes | `ServiceInvoice.Match` — *released to* the Accounts Executive to post · `ServiceInvoice.RaiseVariance` — *makes for* the Accounts Manager |
| Hand-off | Accounts Executive — event `ServiceInvoiceMatched` puts the bill on their posting worklist with the Works Order and confirmation attached · Accounts Manager — event `ServiceInvoiceVarianceRaised` |
| Held by | awaiting match, milestone confirmed — this role, *needs me* · awaiting match, milestone not confirmed — the department head, *waiting on others* · variance raised — the Accounts Manager, *waiting on others* · matched — the Accounts Executive to post, then the Accounts Manager, then Payables: nobody's item here, holder still shown |
| Exceptions | the five variance reasons above |
| Parameters | match tolerance — ₹0 beyond rounding (₹1): the roles document flags any excess over the confirmed amount or the remaining value |
| Indicators | O1, O2 |
| Experience | **Worklist** (invoices awaiting match) → **Review** (three columns, decision at the foot) · report: Invoices against Works Orders (Register) |

### A6 — Review renewals and expiry

| Field | Value |
|---|---|
| Serves | R5 → O3 |
| Trigger & cadence | monthly |
| Subject | Works Order |
| Requires | — |
| Information needs | contracts expiring in 30 / 60 days · invoices still arriving against an expired contract · auto-renewal terms · consumption at expiry |
| Decision | renew, let lapse, or raise a fresh Works Order |
| Writes | none of its own — renewal and close are A2's writes; a fresh order is A1 |
| Hand-off | — |
| Held by | approved and expiring inside the expiry window — this role, not yet urgent, *coming up* |
| Exceptions | an invoice against an expired contract |
| Parameters | expiry windows — 30 and 60 days |
| Indicators | O3 |
| Experience | report: Works Order register filtered to *expiring* (Register) · dashboard exception tile |

### A7 — Collect the contractor's PF/ESI evidence

| Field | Value |
|---|---|
| Serves | R6 → O5 |
| Trigger & cadence | per bill or wage period, for every Works Order with the labour-deployed flag |
| Subject | **Contractor Compliance Evidence** (Labour Compliance): challans, ECR, wage register, licence — linked to the Works Order, the period and the workers deployed |
| Requires | the contractor's attendance or gate record of the workers deployed · the contractor's documents · the bill is on compliance hold (Payables Executive places it; the hold is the reason the evidence is urgent) |
| Information needs | workers on the attendance record against UAN / IP numbers on the ECR · challans paid or not · wages against the notified minimum · evidence status per held bill, with the hold's age and ₹ |
| Decision | evidence complete → submit to the Compliance Officer · gaps → chase the contractor, naming the missing workers or the unpaid challan |
| Writes | `ContractorEvidence.Record`, `ContractorEvidence.Submit` — *makes for* the Compliance Officer |
| Hand-off | Compliance Officer — event `ContractorEvidenceSubmitted` lands on their verification worklist; their verification releases Payables' hold |
| Sends | a chaser to the contractor naming the missing workers or the unpaid challan — a notice kept on the held bill |
| Held by | bill on hold, papers missing, hold younger than the evidence-overdue limit — the contractor, *waiting on others* · hold older than the limit, or papers in with a gap, or papers complete — this role, *needs me* · submitted — the Compliance Officer, *waiting on others* |
| Exceptions | workers missing from the challan · challan not yet paid · wages below minimum · hold aged past N days |
| Parameters | evidence overdue — a hold older than 7 days with evidence not yet submitted |
| Indicators | O5 |
| Experience | **Worklist** (held contractor bills awaiting evidence) → **Form** (attach and reconcile evidence) with an in-context worker-match table · report: Contractor compliance status (Register) |

### A8 — Maintain the contractor's licence and registrations

| Field | Value |
|---|---|
| Serves | R7 → O5 |
| Trigger & cadence | per contractor; alerts before expiry |
| Subject | the contractor's compliance fields on its party record: contract labour licence number and validity, PF and ESI codes (identity stays with Parties and Contacts) |
| Requires | the contractor exists as a party |
| Information needs | licences and registrations expiring in 30 / 60 days · Works Orders deploying labour under an expired licence |
| Decision | update the record; hold off a new labour-deploying Works Order until the licence is current |
| Writes | `Contractor.UpdateCompliance` |
| Hand-off | — |
| Sends | a chaser to the contractor for the renewed licence, as it runs out or once it has expired — a notice kept on the contractor |
| Held by | licence or registration expiring inside the expiry window — this role, not yet urgent, *coming up* |
| Exceptions | licence expired with an active labour-deploying Works Order |
| Parameters | licence and registration expiry windows — 30 and 60 days |
| Indicators | O5 |
| Experience | **Record** (contractor) · **Form** |

### A9 — Follow job-work goods against a Works Order *(read-only coordination)*

| Field | Value |
|---|---|
| Serves | R1, R2 → O3 |
| Trigger & cadence | continuous, for job-work Works Orders |
| Subject | the job-work challan (Inventory) — owned and written by the Stores / Inventory Officer |
| Requires | a job-work Works Order |
| Information needs | challans open against this Works Order · goods lying with the job worker · the return limit approaching (one year for inputs, three for capital goods) |
| Decision | chase the job worker; none in the engine |
| Writes | none |
| Hand-off | — |
| Sends | a chaser to the job worker as the return limit approaches — a notice; no decision in the engine |
| Held by | the challan — the Stores / Inventory Officer; never this role's queue item |
| Exceptions | return limit approaching |
| Parameters | none of this role's — the return limits are statutory and Inventory's |
| Indicators | none of this role's — the return-limit alert is Inventory's |
| Experience | in-context panel on the Works Order **Record**, with the chase on each challan that still has goods out (§7 decision 27) |

---

## 3. Dashboard — derived, then cut

Eleven tiles are derived. Six are on the dashboard: four of work and two of what has gone wrong, which is the shape of an operational seat. The last column says what the cut of §10 did to each and names the cut; §7 decision 22 records it.

| # | Tile | Kind | Shows | Opens | From | After the cut |
|---|---|---|---|---|---|---|
| 1 | Works Orders awaiting approval | Work | count, oldest age | A1 worklist (my submitted orders) | O6 | **stays**, as *My Works Orders in progress*: a draft and an order returned for rework are counted with those awaiting approval, because the tile's rows always showed them |
| 2 | Milestones due this week | Work | count, overdue count | A3 worklist | A3 | cut (X3): nothing in it awaits the officer. A milestone coming due is in the queue under *Coming up* |
| 3 | Confirmations awaited | Work | count, oldest age, by department head | A4 worklist | O4 | **stays** |
| 4 | Invoices awaiting match | Work | count, ₹, oldest age | A5 worklist | O1 | **stays**, as *Bills to match*, with tile 6 as a line under its heading |
| 5 | Contractor bills awaiting evidence | Work | count, ₹ on hold, oldest age | A7 worklist | O5 | **stays**, as *Contractor bills waiting for papers* |
| 6 | Over-billed or unconfirmed invoices | Exception | count, ₹ | Invoices register, filtered | O2 | folded into tile 4 (X4): the same bills, so one line there — how many are billed ahead of the work and for how much — opening the register filtered |
| 7 | Contracts > 90 % consumed | Exception | count | Works Order register, filtered | O3 | merged with tile 8 (X5) |
| 8 | Expiring in 30 / 60 days · invoices against expired | Exception | counts | Works Order register, filtered | O3 | **stays**, merged with tile 7 as *Contracts running out*: each row says which limit the contract is near, value or time. A bill against an expired contract is in tile 4 with that flag |
| 9 | Workers missing from a challan · licences expiring | Exception | counts | Contractor compliance register | O5 | **stays**, as *Contractor papers at risk*. Narrowing it to licences is held (X6) |
| 10 | Open commitment | Indicator | ₹ approved less ₹ invoiced, trend | Contract consumption analysis | O3 | cut (X2): no act follows from the total |
| 11 | Tax suggestions overridden this month | Indicator | count | Works Order register, filtered | O7 | cut (X1): the officer's own act, read by another seat |

No indicator tile survives. That is a finding about the model, kept in §10.5, and not a rule for other seats.

**How a tile is shown** (C6; proposal §6.1, rule 1). A work or exception tile is a short list, not a bare number: its count, and under it the three oldest or riskiest items, each naming who holds it now and for how long, each opening its record. *Opens* is the link beside the tile's heading. Where *Opens* names a worklist, it is the one queue of §5 filtered to that kind of item.

**Where the dashboard starts** (C2; proposal §5.1, the lead; §6.1, rule 11). Above the tiles it says one thing first: how many items are the officer's move today, how many are with someone else and how many are coming up, with the way into the queue. Work in hand is the main column; what has gone wrong sits in a narrower column beside it.

## 4. Reports — derived, deduplicated, then cut

Seven reports are derived. Four are screens. Proposal §5.2 asks of each whether it is consulted on its own or only inside an activity; the last column is the answer the trace of §10 gave, and §7 decision 23 records it.

| # | Report | Kind | Needed by | Filters / dimensions | A screen? |
|---|---|---|---|---|---|
| P1 | Works Order register | Register | A1, A2, A3, A6, A8 | status, vendor, expiring window, then consumption band, department, branch, service type, labour-deployed, running out of value or time | **yes**. It carries approved, confirmed, billed, paid, left and used for each contract, with totals, so it also answers P3 |
| P2 | Milestone schedule | Register | A3, A4 | due window, confirmation state, Works Order | **yes**. Cutting it is held (X13) |
| P3 | Contract consumption | Analysis | A2, A3, A6 | approved vs confirmed vs invoiced vs paid, by Works Order, vendor, department | no (X12). By Works Order it is P1; by vendor or department it is P1 filtered, whose totals row adds up |
| P4 | Invoices against Works Orders | Register | A5 | state (awaiting match, matched, variance, posted, paid), vendor, variance reason, billed ahead or on hold | **yes** |
| P5 | Confirmation ageing | Analysis | A4 | by department head, age bucket | no (X11). It is the queue filtered to confirmations, oldest first, where each row can be reminded or escalated; the count by department head is on the dashboard's tile |
| P6 | Contractor compliance status | Register | A7, A8 | needing attention, licence validity, held bill | **yes**. One row per contractor, so no filter by contractor (X21). No filter by period: a period belongs to a held bill and is read on that bill's papers |
| P7 | Similar agreements | Register | A1 | vendor, service type, value band | no (X10). Consulted only while raising a Works Order, so it is the panel in that flow |

P4 reads states that belong to AR/AP (posted, paid) — through that capability's published query, never its tables.

## 5. Actions — derived

| Action | Kind | Pattern | Activity | Checked by |
|---|---|---|---|---|
| Raise a Works Order | Create | Flow | A1 | Procurement Manager |
| Amend / renew / close a Works Order | Edit | Form on the Record | A2 | Procurement Manager on a value rise |
| Request / remind / escalate a confirmation | Process | Worklist, inline | A4 | — |
| Match an invoice · raise a variance | Decide | Review | A5 | Accounts Manager (variance) |
| Record and submit contractor evidence | Create | Form with worker-match panel | A7 | Compliance Officer |
| Update contractor compliance fields | Edit | Form on the Record | A8 | — |

Screen inventory — thirteen screens: 1 Overview · 1 Worklist · 4 Reports (all Registers) · 2 Records (Works Order, Contractor) · 1 Flow · 3 Forms (change a Works Order, contractor papers, contractor licence and registrations) · 1 Review. Sixteen were derived; §4 says which three reports are not screens. The department head's confirmation has no screen here.

**One queue** (C2, C3; proposal §6.1, rule 4). The four worklists of A3, A4, A5 and A7, and the officer's own submitted Works Orders, are one Worklist. It is split by whose move the item is — *Needs me · Waiting on others · Coming up* — and filtered by kind: Works Orders, milestones, confirmations, bills, contractor papers. Each row carries its activity's inline action.

**The Works Order is the hub** (C1; proposal §6.1, rule 3). A milestone is not a screen of its own. It opens inside its Works Order's Record, showing the confirmation's state and content, and carries A4's actions there.

**Who holds an item.** The queue's split needs to know, for every state an item can be in, whose move it is. Each activity card's *Held by* row says it for that activity's states; this table gathers them.

| Item | State | Held by | Queue |
|---|---|---|---|
| Works Order | draft · returned for rework | this role | Needs me |
| Works Order | awaiting approval | Procurement Manager | Waiting on others |
| Works Order | approved, expiring inside the expiry window | this role, not yet urgent | Coming up |
| Milestone | due inside the due window, confirmation not yet requested | the contractor | Coming up |
| Milestone | confirmed in part · declined | this role | Needs me |
| Confirmation | requested, and no reminder or escalation is due | the department head | Waiting on others |
| Confirmation | requested, and a reminder or an escalation is due | the department head — this role's move is to chase | Needs me |
| Bill | awaiting match, milestone confirmed | this role | Needs me |
| Bill | awaiting match, milestone not confirmed | the department head | Waiting on others |
| Bill | variance raised | Accounts Manager | Waiting on others |
| Contractor papers | bill on hold, papers missing, hold younger than the evidence-overdue limit | the contractor | Waiting on others |
| Contractor papers | bill on hold, papers missing, hold older than the limit · papers in with a gap · papers complete | this role — chase, or submit | Needs me |
| Contractor papers | submitted | Compliance Officer | Waiting on others |
| Contractor | licence or registration expiring inside the expiry window | this role, not yet urgent | Coming up |

A bill that is matched, posted or paid is nobody's queue item here, but its holder is still shown wherever the bill is: Accounts Executive to post, Accounts Manager to approve, Payables Executive to put it on a payment proposal. The Payments / Disbursement Officer releases the payment.

## 6. What this exposes about the engine

**Procurement capability** — objects `WorksOrder`, `Milestone` (kind: deliverable or service period), `ServiceCompletionConfirmation`, `ServiceInvoiceMatch`; actions as named on the cards, plus `Milestone.Confirm / ConfirmInPart / Decline`, which only the requesting department head named on the Works Order can perform; queries P1, P2 and P4, and the one behind the similar-agreements panel (P3, P5 and P7 are derived and have no screen, §4); events `WorksOrderSubmitted / Approved / Returned / Amended / Renewed / Closed`, `MilestoneDue`, `ConfirmationRequested / Confirmed / Declined`, `ServiceInvoiceMatched`, `ServiceInvoiceVarianceRaised`.

**Labour Compliance capability** — object `ContractorComplianceEvidence`; the contractor's compliance fields; query P6; events `ContractorEvidenceSubmitted / Verified`, and `ComplianceHoldPlaced / Released` which AR/AP and Compliance share. The notified minimum wage that A7 compares wages against is this capability's reference data, not a parameter of this role.

**Cross-capability reads this role needs published** — Parties and Contacts: party identity and registration status · AR/AP: bills posted and paid against a Works Order, hold status · Inventory: job-work challans by Works Order.

**Rules that belong inside actions, not in the UI** — every Works Order needs the Procurement Manager's approval; there is no value below which one approves itself · the milestones of a Works Order add up to its value · the officer cannot confirm a milestone · a match refuses an unconfirmed milestone, an expired contract, and an amount over the confirmed or remaining value · a labour-deploying Works Order refuses an expired contractor licence · a value-raising amendment re-enters approval · a tax-treatment override requires a reason.

**Notices** — every confirmation request, reminder, escalation and chaser is a notice the engine sends and keeps against the item it concerns: to whom, by whom, when, and the text. The engine drafts the text; the officer may change it before sending. An item's history reads these back.

**Who holds it** — every worklist row, record and bill query returns the item's current holder and since when, by the table in §5. It is derived from state, like an exception.

**Authority** — maker–checker as in §1, held by the engine.

**Configuration** — the business-set numbers on the cards, gathered. Each is a named parameter held in the engine's configuration with the default shown; none is written into the app.

| Parameter | Default | Used by | Default comes from |
|---|---|---|---|
| Similar-contract value band | ±25 % of the median | A1 | this document |
| Milestone due windows | 7 and 30 days | A3 | this document |
| Consumption warning | 90 % of contract value | A3 | this document |
| Confirmation reminder | 3 days unanswered since the request or the last reminder | A4 | this document |
| Confirmation escalation | 7 days past due | A4 | this document |
| Match tolerance | ₹0 beyond ₹1 rounding | A5 | this document — roles document 2.1 flags any excess and names no tolerance |
| Contract expiry windows | 30 and 60 days | A6 | roles document 2.1 |
| Evidence overdue | hold older than 7 days | A7 | this document |
| Licence and registration expiry windows | 30 and 60 days | A8 | this document |

## 7. Decisions where the roles document is silent

Each row is the position this role app is built on. A decision that rests on the roles document is settled. One marked *this seat* is a choice made here, and the review can reverse it. Rows 15 to 21 are things the cards carry that the roles document does not say; in rows 15 and 19 it says something nearby and different, which the row quotes. Rows 22 to 27 are what the trace of §10 decided: Maniteja accepted the eighteen cuts marked sure or likely, and held the three that rest on an untested claim about the occupier.

| # | Question | Decision | Rests on |
|---|---|---|---|
| 1 | Who captures the service invoice, and in what order the work happens | The Accounts Executive captures it once, by OCR or by keying. The engine pre-computes the match and puts every service invoice on this role's match worklist. The officer confirms the match or raises a variance; only then can the Accounts Executive post the bill and the Accounts Manager approve it. This role captures nothing. | Roles document 2.1 (the match is this role's, per invoice) · 11.1 (entry and posting are the Accounts Executive's) · 12.1 (this role is not among the makers of OCR capture) |
| 2 | Milestones and service periods | One object, `Milestone`, with a kind. A *deliverable* has a due date and something delivered. A *service period* has a from–to range and is generated from the Works Order's billing schedule. Confirmation, matching and consumption treat both alike. | Roles document 2.1 ("per milestone / service period") · the single object is this seat's |
| 3 | Where the department head confirms | Not in this role app. This seat builds the engine's confirm action — in full, in part, or declined — which only the requesting department head named on the Works Order can perform, and exercises it through the API and tests. The screen waits for an owner; until one exists, a confirmation in the shared environment is made through the API. | This seat — the head has no role app, and the screen is not this role's work |
| 4 | An approval threshold for Works Orders | None. Every Works Order goes to the Procurement Manager. An amendment re-enters approval only when it raises the value. | Roles document 3.1 (Works Orders approved "per contract"; a threshold is named only for POs) · the amendment rule is this seat's |
| 5 | What escalating a late confirmation does | It is recorded on the confirmation request, so ageing and history show it, and sent as a notice to the department head with the Procurement Manager copied. Nobody gains a worklist item or a decision from it. | This seat |
| 6 | Advances and retention against a Works Order | Read only. They are the Payables Executive's; this role writes neither. | Roles document 14.1 |
| 7 | Item lines on a job-work Works Order | None. The Works Order carries the job, its value and its milestones. Items and challans stay with Inventory, pre-filled from the Works Order. | Roles document 2.1 ("no inventory linkage") · 4.2 |
| 8 | Business-set numbers | Named parameters with defaults, listed in §6. | Proposal §4, *Parameters* |
| 9 | What a chaser is | A notice to the contractor or the department head, sent in one step with its text drafted, and kept against the item. It changes no state and gives nobody a decision. The record of it is the officer's answer to "why is this late". | This seat — C3; proposal §4 *Sends*, §8 *Notice* |
| 10 | How many worklists | One queue, split by whose move the item is and filtered by kind (§5). | This seat — C2 and C3: the occupier works one list of things to chase, not one list per activity; proposal §6.1, rule 4 |
| 11 | Where a milestone is shown | Inside its Works Order's Record (§5). | This seat — C1: the occupier thinks in contracts; proposal §6.1, rule 3 |
| 12 | Which pattern an Analysis uses | Register, with a chart above the table. An Analysis is a kind of report, not an eighth pattern. | Proposal §5.2 and §7, where a Register stands for Fiori's Analytical List Page |
| 13 | What the app talks to until the engine exists | A stand-in engine inside the app, behind one module: the queries and actions of §6 by name, the rules of §6 inside the actions, and one seeded company. The generated client replaces the module; no screen changes. | This seat — the screens are needed before the engine slice |
| 14 | What a value-raising amendment or renewal does to the milestones | It adds one milestone for the added value, due on the new end date, which the officer then names and re-dates. Existing milestones are not rewritten. | This seat |
| 15 | Who may change the suggested tax treatment on a Works Order | The officer, with a reason. The change and its reason stay on the Works Order for the Compliance Officer to see. | This seat. The roles document gives this role the suggestion only (2.1). Its one override rule is the Accounts Executive's, on a voucher: a request with a reason, routed to the Compliance Officer and logged whatever the outcome (11.1). The GST and TDS lines that bind are booked when the bill is posted (11.1) |
| 16 | Amending and closing a Works Order | A2: amend, renew, close and short-close, with re-approval when the value rises. | This seat. The roles document names renewals and expiry for a Works Order (2.1); amending and short-closing are named for Purchase Orders only (1.1) |
| 17 | An expired contract labour licence | A Works Order that deploys labour cannot be submitted while the contractor's licence is expired. | This seat. The roles document holds the licence's validity on the contractor's record and alerts before expiry (2.2); it names no refusal |
| 18 | Following job-work goods | A9: a read-only panel on the Works Order of Inventory's challans against it. | This seat. The roles document gives the challan to the Stores / Inventory Officer (4.2) and gives this role no work item for it |
| 19 | When contractor papers are collected | Against a bill on compliance hold: the queue item and the papers form open from the held bill. | This seat, and narrower than the roles document, which collects per bill or wage period, alongside the service completion confirmation (2.1, 2.2). A4 sends the request with the confirmation; papers for a wage period that has no bill yet have no place in the cards |
| 20 | Duplicate bills | A5 checks for a duplicate and can raise it as a variance. | This seat. The roles document gives the duplicate check to the Accounts Executive, per voucher (11.1) |
| 21 | Open commitment | No longer shown. It was an indicator on the dashboard, value approved less value billed, and decision 22 cut it. | This seat. The roles document names the share of contract value consumed (2.1) and no commitment figure |
| 22 | Which dashboard tiles stay | Six of the eleven derived: bills to match, confirmations awaited, contractor bills waiting for papers, my Works Orders in progress, contracts running out, contractor papers at risk. Both indicators go; the milestones tile goes; bills billed ahead become a line under bills to match; the two tiles about a contract's limits become one (§3). | Maniteja, on the trace of §10 (X1 to X5) · proposal §6.1, rules 1 and 2 · the usual five to nine of proposal §5.1 |
| 23 | Which reports are screens | Four: Works Orders, Milestones, Bills, Contractor papers. Similar agreements is the panel in the flow. Contract consumption gave its confirmed and paid columns to the Works Order register. Confirmation ageing is the queue filtered to confirmations (§4). | Maniteja, on the trace of §10 (X10 to X12) · proposal §5.2: a need consulted only inside an activity is a panel |
| 24 | A light and dark switch | None. The app has both themes and follows the device. | Maniteja (X9) · no card row or claim asked for the switch |
| 25 | The same thing offered or said twice on a screen | Once. *New Works Order* is in the sidebar only. Amend, Renew and Close are chosen on the Works Order, and the form opens for the one chosen. A changed tax treatment is a badge and a line beside the treatment, with no note above the record. A milestone's follow-ups are its list of follow-ups, not three dates beside it. Remind shows once on a bill. An earlier Works Order is copied from the flow's first field or from the Works Order itself. | Maniteja (X7, X8, X14 to X16, X18 to X21) · proposal §6.1, rule 2: the second showing has a card row and no second reason |
| 26 | What waits for someone who has done the job | Three cuts are held, each resting on an untested claim: narrowing *Contractor papers at risk* to licences (X6, C6), the Milestones report (X13, C1), and tax as its own stage of the New Works Order flow (X17, C9). The elements stay as built. | Maniteja · proposal §10, step 4 |
| 27 | Chasing a job worker | Each challan with goods still out carries a chase: a notice to the job worker, kept on the challan and read back in the Works Order's history. The challan stays the Stores / Inventory Officer's; this role writes nothing on it. | This seat — A9's *Sends* row had no surface (§10.3, F3) · decision 9 |

## 8. Building this role app

The model stops at the pattern name. Everything below it is this seat's choice, recorded here so the screens can be generated without asking, and each choice in §8.2 names the claim (C1–C10 in §1) or the rule (proposal §6.1) it rests on, so that a claim shown wrong points at the choices to revisit. The Baseline fixes React, TypeScript, Vite, routing, a generated API client, linting, basic testing and deployment to a Render static site; the rows below fill in what it leaves unnamed. None of it binds another role app.

### 8.1 Stack

| Concern | Choice | Why |
|---|---|---|
| Where it lives | its own repository, `role-app-contracts-services-procurement-officer`, worked on `main`. These cards are in its `docs/` folder. It depends on nothing outside itself | the Baseline gives each role app its own repository |
| Runtime and packages | Node 24 LTS · pnpm, its version pinned in `package.json` | Maniteja's choice; one lockfile, and Render and the checks install from it unchanged |
| Language and build | TypeScript in strict mode · React 19 · Vite | Baseline |
| Routing | React Router, as a client-side single-page app | a dashboard tile that "opens a filtered register" is then just a link |
| API client | `openapi-typescript` generates types from the engine's OpenAPI document; `openapi-fetch` makes the calls. The generated file is committed and refreshed by `pnpm generate:api`. Until the engine publishes that document, the stand-in engine of §7.13 sits in its place, in `src/engine/`, and neither package is installed | Baseline: no handwritten request or response types. Generating types only leaves no generated runtime code to maintain |
| Server state | TanStack Query; no global store | every screen is a query or an action, and a worklist refetches after its action |
| Filters, sorting, selected tab | in the URL | tiles link to filtered lists; a view can be shared or reopened |
| Tables | TanStack Table | the queue and the four reports are most of the app |
| Forms and the Flow | React Hook Form with Zod | three forms and one four-stage flow. Validation here is a convenience; the engine's action is the rule |
| Charts | none | no chart survives the cut of §10. The bar that shows a contract's money is plain markup |
| Components and styling | Tailwind CSS with shadcn/ui components copied into the repository | accessible dialogs, menus and form controls without depending on a shared design system, which the Baseline rules out |
| Icons | Lucide | ships with the components |
| Linting and formatting | ESLint flat config with typescript-eslint · Prettier | Baseline |
| Tests | Vitest with React Testing Library: one test per pattern component, and one per rule the app shows from a card (a disabled action states its unmet requirement) | Baseline: basic testing |
| Checks | GitHub Actions: lint, test, production build | Baseline |
| Deployment | Render static site from `main`; `VITE_API_BASE_URL` set in Render; every path rewritten to `index.html` | Baseline |
| Money and dates | amounts travel as decimal strings and are never added up in the browser; dates travel as ISO dates | totals are the engine's; the browser only formats |
| Who is acting | whatever the engine's authority foundation defines. Until it does, the app runs as one seeded Contracts & Services Procurement Officer, with no sign-in screen | identity is shared engine work, not this seat's to design |
| Engine side | Python, FastAPI, Pydantic, SQLAlchemy, Alembic and PostgreSQL, as the Baseline fixes them. Tooling the Baseline does not name is shared, and is set by the first engine pull request that needs it rather than by this document | the engine converges |

Each of the seven patterns is one layout component in the app. A screen is a pattern plus the rows of its card.

### 8.2 Theme

| Concern | Choice | Why |
|---|---|---|
| Light and dark | both, following the device setting and changing with it. There is no switch | a courtesy to the device setting. A switch had no card row and no claim (§7 decision 24) |
| Colour | neutral grey surfaces and one accent, teal, for primary actions, the current navigation item and *your move*. Every colour is a named token in one file, so adopting a company palette is a one-file change. No Aikyat brand palette is assumed | one accent marks *your move* (C2). Named tokens: a company palette is the customer's, not the model's (proposal §6.2) |
| Status colours | three hues, chosen to sit together and with the accent: brick red — an exception, over a limit, expired · ochre — due soon, aged, waiting on someone else · the accent's own teal — confirmed, matched, complete. Information and system suggestions are a quiet slate. In a list only red and ochre colour the words; a done or plain state reads as ordinary text beside its icon, so what needs attention is what stands out. A filled pill is kept for the one or two statuses at the head of a record. Always with a label or an icon, never colour alone | what needs attention is what stands out, and the rest reads as ordinary text (C6; proposal §6.1, rule 1). Never colour alone: accessibility |
| Type | Inter, served from the app itself; 14 px body text and nothing smaller than 12 px; tabular numerals in every column of amounts, counts and dates | numbers read in columns as they do in the spreadsheet (C10); nothing below 12 px: accessibility |
| Density | roomy rather than compact: spacing on a 16 px base, 48 px rows in registers, a queue row of two or three lines. Text is never cut with an ellipsis: a name or a reason that does not fit its column wraps onto a second line, and nothing runs over its neighbour. A table says who has an item under its status rather than in a column of its own, and a name carries whose it is on a second line, so every register and the queue fit a 1280 px desktop without scrolling sideways. The queue gives *who has it* a column of its own from 1400 px. A register shows its first three filters and keeps the rest one press away, opening them when one is in use. Built for a desktop at 1280 px and wider; at tablet width a table scrolls sideways inside its own box, the queue keeping its action in view; no phone layout | a name or a reason is read whole, as it is in a spreadsheet cell (C10). Who has it under the status: the holder is on every item (proposal §6.1, rule 4) without a column the queue cannot afford. The first three filters in view: filters in order of use (rule 10) |
| What a record opens on | the Works Order opens on its money — what is left to bill, against what is paid, billed and confirmed — and its facts. Milestones, bills, contractor papers, job-work goods and history are tabs under them, one in view at a time | the contract is the unit of thought and its money is what the phone call is about (C1, C4; proposal §6.1, rule 3) |
| Amounts and dates | ₹ with Indian digit grouping; lakh and crore abbreviations on tiles (₹4.2 L, ₹1.3 Cr) and full figures in tables; dates as 06 Oct 2026; the financial year runs April to March | their words and their figures: lakh and crore, the Indian financial year (C5) |
| Navigation | a left sidebar with the Charter's three areas by name: Dashboard · Actions · Reports. Actions holds *My queue* and *New Works Order*. Reports holds the four that are screens (§4). A Record is opened from a list or from search, never from the sidebar | the three area names are the anatomy's visible seam (proposal §6.1, rule 6). *My queue* first inside Actions: the queue is the day (C2, C3). A Record is reached from a list, never from the sidebar: it is a part of the story, not a destination (C1) |
| Search | one box in the header finds a bill, a Works Order or a contractor by number or name. A bill answers with one line: each stage it has passed, the stage it is at, and who holds it now. A Works Order answers with what is left of its value, what is billed and confirmed, when it ends, and which milestones are not yet confirmed. What was asked for by its own number or name comes before what merely belongs to it | the vendor's phone call (C4; role card *Asked of it*; proposal §5.4) |
| Wording | the three area names are the Charter's. Everything inside them is in the occupier's words: bill, confirmation, contractor papers, pending with. No engine word — event, match object, variance raised — appears on a screen | their words inside, the Charter's at the seam (C5; proposal §6.1, rule 6) |
| Empty, loading and refused states | an empty list says what would appear in it. A disabled action states the unmet requirement from its card's *Requires* row. An action the engine refuses shows the engine's reason | a refusal names the way out (C7; proposal §6.1, rule 7) |
| Language | English, with the roles document's terms as written: Works Order, challan, TDS, ECR | the roles document's terms are the occupier's terms (C5) |
| Accessibility | WCAG 2.2 AA contrast in both themes; every worklist action reachable by keyboard | a floor every app has; no claim, and none needed |

## 9. What building the screens asked of the cards

Each row is something a screen needed that the cards did not say. The card or this document was changed first, then the screen. The last column says whether the gap is this role's or the model's; where it is the model's, *Fixed by* also names where the proposal covers it (its §12 is the same list from the other side).

| # | The screen needed | The cards said | Fixed by | Gap in |
|---|---|---|---|---|
| 1 | Whose move every queue item is, and who holds it now | *Requires* and *Hand-off* name the people, but nothing says who holds an item in each state | the *Who holds an item* table in §5; a holder on every query in §6; now a *Held by* row on every activity card · proposal §4, §6.1 rule 4, §8 | the model — the Activity card had no row for it |
| 2 | A record that the officer chased | "a chaser is a notice", with no trace | §7 decision 9; *Notices* in §6; now a *Sends* row on A3, A4, A7 and A9 · proposal §4, §5.3 *Notify*, §8 *Notice* | the model — a notice that changes no state was neither a write nor a hand-off |
| 3 | A pattern for the two Analyses | a report kind, *Analysis*, and seven patterns of which none is a chart | §7 decision 12 · proposal §5.2 and §7: a Register whose first view is a chart | the model — two report kinds, and a pattern for one |
| 4 | Where a bill opens once it is decided | Review, for the decision only | the Review screen stays the bill's page after the decision, read-only, with its stages | this role |
| 5 | Search across bills, Works Orders and contractors | nothing — no activity's information need asks for it; the phone call from the vendor does | §8.2 *Search*; now *Asked of it* in §1 · proposal §2, §5.4, §8 | the model — a need that comes from a counterpart's question, not from an activity |
| 6 | Whether a reminder falls due once or again | "3 days after the request with no answer" | A4's *Parameters* row and §6 now say it counts from the last reminder | this role |
| 7 | The number that wages are compared against | "wages against the notified minimum", with no parameter | §6: reference data of Labour Compliance · proposal §4 *Parameters*, §8 *Reference data* | the model — *Parameters* covered numbers the business sets; a statutory number an activity reads had no row |
| 8 | Whether milestones must add up to the contract value | "amount or share" for each milestone, and no rule | the rule is added to §6 | this role |
| 9 | What happens to milestones when a Works Order's value rises | nothing | §7 decision 14 | this role |
| 10 | Where someone new to the dashboard starts | eleven tiles in three kinds, none ranked above another | §3 *Where the dashboard starts*: the count of items that are the officer's move, and the way into the queue · proposal §5.1 *Lead*, §6.1 rule 11 | the model — an Overview had kinds of tile but no lead |
| 11 | Which of a report's filters to keep in view | the filters as a list, in no order | §8.2 *Density*: the first three in view, the rest one press away. Which three was chosen here, by inference · proposal §6.1 rule 10 | the model — a report's *Filters* row had no order of use |
| 12 | A reason for every choice below the pattern name — why one queue, why the Works Order opens on its money, why items rather than counts | nothing — the model stopped at the pattern name and said nothing about how to think below it; the reasons lived in a page of notes outside the cards | §1 *The occupier* with its ten claims; the *Why* column of §8.2 · proposal §3 *Occupier card*, §6 entire | the model — it derived, and had no way to shape or to cut |
| 13 | A chaser for a contractor's licence, from the queue and from the Contractor record | nothing — A8 had no *Sends* row, though A3, A4, A7 and A9 have one | A8's *Sends* row. Found by the trace of §10, not while building | this role |

**What the cards did carry.** Sixteen screens, eleven dashboard rows, seven reports, thirteen writes and nine parameters were built without asking anything else. The trace of §10 then cut them to thirteen screens, six dashboard rows and four reports. The *Requires* row became the reason beside every disabled action; the *Exceptions* row became the dashboard's second section and the red flags; *Decision* became the checks on the bill; the *cannot* list became a test that no screen offers those actions.


## 10. The trace — every element, the row that produced it, the reason that keeps it

The proposal's second claim is that every element earns its place twice: once from a card row, once from a stated reason about the occupier (proposal §6.1, rule 2). This section is that check (proposal §6.3). It was made on the app as first built, sixteen screens, by reading the code of each screen and the seeded company as it stands on 06 Oct 2026. It proposed twenty-one cuts; Maniteja accepted eighteen and held three; the app is as §10.4 describes it.

A cut is not forgotten. §10.4 lists what was cut beside what was kept, with the rule that cut it, because a list of only what was built cannot show that it is minimal.

### 10.1 What it found, and what was done

| Of the 172 elements traced | |
|---|---|
| Kept | 139 |
| Kept, with a cut held until someone who has done the job is asked | 7 |
| Cut, merged or moved | 26 |

| | Derived and first built | After the cut |
|---|---|---|
| Dashboard tiles | 11 | 6 |
| Reports that are screens | 7 | 4 |
| Screens | 16 | 13 |
| Stages of the New Works Order flow | 4 | 4, with X17 held |

About one element in seven was cut. Proposal §10 reads nothing cut as §6 not being applied, and more than half cut as the cards producing noise. The Actions area lost little; the Dashboard lost five tiles of eleven and the Reports three of seven, which is where §10.5 says the derivation over-produces.

Measured in the seeded company before the cut:

| What | Figure |
|---|---|
| Items in the queue | 33 — 14 need the officer, 7 are with someone else, 12 are coming up |
| Item rows on the dashboard's nine work and exception tiles | 26 |
| Different items among those rows | 21, and every one already an item in the queue |
| Items the dashboard showed in two tiles | 5 |
| Tiles whose heading and list disagreed | 2 (F1, F2) |
| Reports that nothing but the sidebar opened | 2 — Milestones (P2) and Confirmations by age (P5) |

### 10.2 The cuts

*How sure* is one of three. **Sure**: the model's own rule or these cards already said it. **Likely**: the reasoning holds without leaning on an untested claim. **Ask**: it rests on a claim about the occupier that nobody has tested, and the claim is named. Maniteja made every cut marked sure or likely and held the three marked ask; §7 decisions 22 to 26 record it.

| # | What | Why | What is lost | How sure | Decision |
|---|---|---|---|---|---|
| X1 | Dashboard tile *Tax suggestions changed this month* (§3 tile 11, O7), and with it the *Tax* filter on the Works Order register | It counted the officer's own act back to the officer. Nothing the officer does follows from it; the reader who acts on a changed treatment is the Compliance Officer (§7 decision 15). The indicator rule: a number the role cannot act on belongs on someone else's dashboard (rule 1) | Nothing the officer uses. The change and its reason stay on the Works Order | Sure | Cut |
| X2 | Dashboard tile *Still to be billed on my contracts* with its trend (§3 tile 10, O3; §7 decision 21) | The roles document names no commitment figure. The officer amends or closes one contract at a time, and the tiles that name the contracts already say which. No act follows from the total or its trend (rule 1) | The one trend on the dashboard. With X12 the figure leaves the app | Likely | Cut |
| X3 | Dashboard tile *Milestones due this week* (§3 tile 2, A3) | A3 writes nothing, and its *Held by* row says a milestone coming due is the contractor's, *coming up*. No item in it awaited the officer, so it was not a work tile; the lead's *coming up* link opens these (rules 1, 4). Its count and its list also disagreed (F2) | A named place on the dashboard for milestones. They stay in the queue under *Coming up* | Likely | Cut |
| X4 | Dashboard tile *Billed ahead of the work* (§3 tile 6, O2), as a tile of its own | Its three bills were bills to match, and *Bills to match* showed the same flag on each. One of the three was on screen in both tiles. The second showing had a card row and no second reason (rule 2). It is one line under *Bills to match* — how many are billed ahead and for how much — opening the Bills register filtered | The red count beside the work. The line and the red flags on the rows remain | Likely | Folded in |
| X5 | Dashboard tiles *Contracts more than 90 % used* and *Contracts ending soon* (§3 tiles 7 and 8, both O3), as two tiles | Both answer one question about the unit of thought — which contracts are running out, of money or of time — and lead to one decision: amend, renew or let lapse (A2, A6). In the seeded company they listed the same two contracts. One tile, *Contracts running out*, each row saying which limit it is near. The bill against an expired contract left it: it is in *Bills to match* with that flag | Two counts became one | Likely | Merged |
| X6 | The *workers missing from a challan* half of dashboard tile *Contractor papers at risk* (§3 tile 9, O5) | A worker missing from the ECR is a gap in one held bill's papers, and that bill is already a row of *Contractor bills waiting for papers*. The licence half is a different object with its own activity (A8) and would stay, as *Contractor licences running out* | The missing-worker count on the dashboard. C6 would have the count matter less than the item; if the officer watches that number, the cut is wrong | Ask — C6 | **Held** |
| X7 | *New Works Order* button at the head of the Dashboard and of My queue | The sidebar holds it on every screen. Raising is done per contract, not all day, and is not the core verb (rule 5). On My queue it was the page's one filled button and it was not about the queue | One of three ways to the same flow, twice | Sure | Cut |
| X8 | On the Dashboard: the date above the heading, and the sentence *Everything below says who has it now.* | Neither had a card row. The date is the stand-in's clock, which the sidebar foot states. The sentence described the screen and not the work (rule 2) | Nothing | Sure | Cut |
| X9 | The light and dark switch in the header | §8.2 already said no card row or claim asked for it and it would be the first thing to go. The app keeps both themes and follows the device | Choosing a theme against the device setting | Sure | Cut |
| X10 | Report *Similar agreements* (P7) as a screen | It is needed by A1 alone, and proposal §5.2 says a need consulted only while doing one activity is an in-context panel, not a report. The panel is in the flow. Its rows are Works Orders the register (P1) also lists | The value-a-month column and the middle value outside the flow. The panel's *Open the list* opens the Works Order register for that service | Sure | Cut |
| X11 | Report *Confirmations by age* (P5) as a screen | Its table was the queue filtered to confirmations, oldest first, without the queue's Remind and Escalate — so the core verb was a detour away on the one list about chasing (rule 5; F6). Its by-person count is the line under the dashboard's *Confirmations awaited*. Nothing but the sidebar opened it | The chart of who is slow by age band. If the officer shows that chart to the Procurement Manager when escalating, it earned its place and the cut is wrong | Likely | Cut |
| X12 | Report *Where the money stands* (P3) as a screen | By Works Order it repeated the register (P1): value, billed, left, used, with totals. By contractor or by department it was the register filtered, whose totals row adds up. What it alone had was *Confirmed* and *Paid*, which joined P1 as columns, and the trend of X2 | The bar per row and the four totals at the head | Likely | Cut; two columns moved to P1 |
| X13 | Report *Milestones* (P2) as a screen | A milestone is a part of the contract and opens inside its Works Order (rule 3; C1). Those falling due in 30 days are in the queue. Nothing but the sidebar opens it | Milestones more than 30 days out, and confirmed ones, across all contracts in one list. If the Excel tracker has such a sheet, C1 is wrong here and the report stays | Ask — C1 | **Held** |
| X14 | On the Works Order: the note at the head saying the suggested tax treatment was changed | The same fact is a badge beside the title. The note was written for the Compliance Officer and shown to the officer on every visit. The reason is beside *Tax deducted*, where the treatment is stated | Nothing; said once, not twice | Likely | Cut; reason moved |
| X15 | On Change a Works Order: the Amend · Renew · Close switch | The Works Order has just offered the same three as buttons, each with its own reason when it is refused (rule 7). The form opens for the one chosen | Changing one's mind inside the form; the way back is one press | Likely | Cut |
| X16 | In a milestone: the facts *Asked on*, *Last reminded* and *Escalated on* | *Follow-ups sent*, below them, lists each of these with its date, who it went to and its words (C3). The three facts were that list without the words | Nothing | Sure | Cut |
| X17 | In New Works Order: *Tax and papers* as a stage of its own | C9 says a tax suggestion arrives filled in with its reason and is not a question. A stage with two fields to pass through asks the question of someone the Occupier card says is not a tax expert (rule 9). The treatment and its reason would be shown at *Check and submit* with *Change* beside them, and the licence check would move to the first stage, beside the tick that causes it (rule 7) | A stage where tax is looked at on its own | Ask — C9 | **Held** |
| X18 | In New Works Order: *Start from this one* under each similar agreement in the side panel | The panel is there to price the order. Copying from it replaced what had been typed so far. The first field of the flow and *Raise a similar one* on a Works Order start from an earlier one (rule 8) | Two ways to copy are left of four | Likely | Cut |
| X19 | On a bill: the second *Remind* | While the bill cannot be matched for want of a confirmation, Remind showed twice: in the Confirmation column and beside the refusal. It is shown once — beside the refusal while the bill is open (rule 7), in the column otherwise | Nothing | Sure | Cut |
| X20 | On the Contractor: the panel *Who they are* | It held one sentence about which fields come from Parties and Contacts. The licence form says the same where it matters, beside the fields | Nothing | Sure | Cut |
| X21 | On the Contractor papers register: the *Contractor* filter | The register has one row per contractor. A filter that picks one row is the search box | Nothing | Sure | Cut |

### 10.3 Where the app and the cards disagreed

Not cuts. Each was a row with no surface, or a surface that said something its row did not. All six are put right.

| # | What was wrong | Where | Put right by |
|---|---|---|---|
| F1 | The tile was headed *Works Orders awaiting approval* and counted those with the Procurement Manager; its first rows were a returned order and a draft, which are the officer's | Dashboard, §3 tile 1 | The heading *My Works Orders in progress*, counting all three states, and saying how many are with the manager and how many with the officer |
| F2 | *Milestones due this week* counted milestones due in 7 days and listed the queue's milestones due in 30; in the seeded company it said 1 and showed 3 | Dashboard, §3 tile 2 | X3, which removed the tile |
| F3 | A9's *Sends* row had no surface. The goods tab said it was shown *so you can chase* and offered no chase | Works Order, *Goods with the job worker* | A chase on each challan with goods still out, and when it was last chased (§7 decision 27) |
| F4 | A Works Order found by search answered with its number, contractor and status. *Asked of it* says the answer is value, billed, confirmed, left and expiry, and the milestones not yet confirmed. Searched by its number, a Works Order with nine bills was pushed off the list by them | Search | The answer in that shape; and what is asked for by its own number or name listed before what belongs to it (§8.2 *Search*) |
| F5 | P6's *Filters* row named *period* and P5's named *age bucket*; neither was built, and no reason was given | Reports | §4 gives the reason for P6; X11 removed P5 |
| F6 | The list of open confirmations had no Remind or Escalate | Confirmations by age | X11, which removed the report; the queue's list has both |

### 10.4 The trace, screen by screen

*Cut?* is — where the element stays. Otherwise it says what happened: **cut**, with the X of §10.2; **held**, where a cut waits for someone who has done the job; or **put right**, with the F of §10.3. Rules are those of proposal §6.1; claims are C1 to C10 of §1.

**The frame — on every screen**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Sidebar head: the seat's name, opening the Dashboard | Role card *Identity* | says whose desk this is | — |
| Sidebar: Dashboard | Charter area; §3 | the three area names are the visible seam (rule 6) | — |
| Sidebar: Actions › My queue, with the count that needs the officer | *Held by*, gathered (§5) | the queue is the day, and the lead goes with the officer to every screen (C2, C3; rule 4) | — |
| Sidebar: Actions › New Works Order | A1 *Writes* | the one thing the seat starts itself, in one place on every screen | — |
| Sidebar: Reports › Works Orders · Bills · Milestones · Contractor papers | §4, P1, P4, P2, P6 | the seam (rule 6); a register is where a contract is found (C10) | — |
| Sidebar: Reports › Where the money stands · Confirmations by age · Similar agreements | §4, P3, P5, P7 | none as screens (§4) | cut — X12, X11, X10 |
| Sidebar foot: the sample company's date, and *Reset the sample data* | §7 decision 13 | none about the occupier; it is the stand-in engine's and leaves with it | not an element of the role app |
| Header: the search box, its prompt, reached with `/` | Role card *Asked of it* | the phone call is answered in seconds (C4; proposal §5.4) | — |
| Search: a bill answers with each stage and who holds it | *Asked of it*, rows 1 and 3 | answered without opening anything (C4) | — |
| Search: a Works Order answers with what is left of its value, billed and confirmed, when it ends, and the milestones not yet confirmed | *Asked of it*, row 2 | the department head's question, answered without opening anything (C1, C4) | put right — F4 |
| Search: a contractor answers with the contact's name and phone | Counterparts, vendor | chasing is done by phone (C3) | — |
| Header: light and dark switch | none | none | cut — X9 |

**Dashboard — Overview**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| The date above the heading | none | none | cut — X8 |
| Heading: how many things need the officer today | *Held by*, gathered; §3 *Where the dashboard starts* | the lead: mine before anything else (rule 11; C2) | — |
| Under it: how many are with someone else and how many are coming up, each opening the queue split that way | the same | the rest of the lead (rule 4) | — |
| Under it: *Everything below says who has it now.* | none | described the screen, not the work | cut — X8 |
| Button: Open my queue | §3 *Where the dashboard starts* | the way in (rule 11) | — |
| Button: New Works Order | A1 *Writes* | none of its own; the sidebar has it | cut — X7 |
| Section: Work in hand, the main column | proposal §5.1, work tiles | work in hand before what has gone wrong (rule 11) | — |
| Tile: Bills to match — count, ₹, oldest; the three oldest; See all | §3 tile 4 (O1, A5) | the items, not a count of them (C6; rule 1) | — |
| Under Bills to match: how many are billed ahead of the work and for how much, opening those bills | §3 tile 6 (O2, A5) | what is wrong with the work is said on the work, once (rule 2) | — |
| Tile: Confirmations awaited — count, oldest, how many with each department head; the three oldest; See all | §3 tile 3 (O4, A4) | what the officer chases most, and who is slow (C3) | — |
| Tile: Contractor bills waiting for papers — count, ₹ on hold, oldest; three; See all | §3 tile 5 (O5, A7) | money held is what the contractor phones about (C4) | — |
| Tile: Milestones due this week — count, overdue; three; See all | §3 tile 2 (A3) | none: nothing in it awaited the officer | cut — X3 |
| Tile: My Works Orders in progress — count, how many are with the Procurement Manager and the oldest, how many are with the officer; three; See all | §3 tile 1 (O6, A1) | the officer's own orders: a returned one is theirs to fix, one with the manager is theirs to chase (C2) | put right — F1 |
| Each row of a work tile: what it is, its flag, its amount, contractor and contract, who has it and for how long | *Held by*; each activity's *Subject* | the holder on every item (rule 4); the contract named (C1) | — |
| Section: How the contracts stand | proposal §5.1, indicator tiles | none once its two tiles went | cut — X1, X2 |
| Tile: Still to be billed on my contracts — ₹, what it counts, trend by month end, link to the report | §3 tile 10 (O3; §7 decision 21) | none: no act follows from the total | cut — X2 |
| Tile: Tax suggestions changed this month — count, the order and its reason, link to the register | §3 tile 11 (O7) | none: the officer's own act, read by another seat | cut — X1 |
| Section: Needs attention, the narrower column, *Each clears itself once it is put right* | proposal §5.1, exception tiles; proposal §8, *Exception* | what has gone wrong beside the work, not above it (rule 11) | — |
| Tile: Billed ahead of the work — count, ₹; three; See all | §3 tile 6 (O2, A5) | none of its own: the same bills as *Bills to match* | cut — X4 |
| Tile: Contracts running out — count, how many are over 90 % used and how many end in 60 days; three, each saying which limit it is near, what is left and when it ends; See all | §3 tiles 7 and 8 (O3, A3, A6) | which contract to amend or renew before a bill is refused; one question about the unit of thought (C1) | — |
| Two tiles for a contract's two limits, and the bill against an expired contract listed among contracts | §3 tiles 7 and 8 | none as two: the same contracts, one decision | cut — X5 |
| Tile: Contractor papers at risk — workers missing from a challan, licences expiring or expired; three; See all | §3 tile 9 (O5, A7, A8) | a licence that lapses blocks the next order (§7 decision 17) | held — X6 |
| Each row of an exception tile: the thing, why it is here, the one fact that put it here | each activity's *Exceptions* | what needs attention is what stands out (C6; §8.2 *Status colours*) | — |

**My queue — Worklist**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Heading, and a line under it that changes with the split: whose these are and in what order | §5 *One queue* | mine or someone else's is the first thing asked of any item (C2) | — |
| Button: New Works Order | A1 *Writes* | none of its own; the sidebar has it | cut — X7 |
| Tabs: Needs me · Waiting on others · Coming up, each with its count | §5 *Who holds an item* | split by whose move before anything else (rule 4; C2) | — |
| Tab: Everything | §3 *Opens* | a dashboard tile opens one kind whole, whoever has it | — |
| Kind filter: all · bills · confirmations · contractor papers · milestones · Works Orders | §5 *One queue*, *filtered by kind* | the second split, after whose move (rule 4) | — |
| Column *What*: the kind, the item, the contractor, and the contract as a link | each activity's *Subject* | every row is a way into its contract (C1; rule 3) | — |
| Column *Amount* | A5 and A7 *Indicators*, ₹ | the size of what is stuck; the caller quotes it (C4) | — |
| Column *Who has it*: the holder, for how long, and when it was last chased | *Held by*; *Sends* | the holder on every item (rule 4); the record of having chased (C3) | — |
| Column *Where it stands*: the flag, the due date, one line of why | each activity's *Exceptions*; A3 *Information needs* | only what needs attention is coloured (§8.2) | — |
| Row action: Remind · Escalate · Chase contractor | A3, A4, A7 and A8 *Sends* | the core verb, one step away (rule 5; C3) | — |
| Row action: Match, when the pre-computed match is clean | A5 *Decision* | a clean match is confirmed in one step (rule 9) | — |
| Row action: Send to Compliance, when the papers are complete | A7 *Writes* | the officer's move, without opening the form | — |
| Row action: Review · Open · Continue · Fix and resubmit | A1 and A5 *Writes* | the writes that need their own screen | — |
| A refused action's reason, above the list | each activity's *Requires* | a refusal names the way out (rule 7; C7) | — |
| The empty list's sentence, one for each split | §8.2 *Empty, loading and refused states* | says what would appear | — |
| The notice: to whom and how, who is copied, the message drafted and open to change, that it is kept, Send and Cancel | A3, A4, A7, A8, A9 *Sends*; §7 decision 9 | one step, the text drafted, the trace kept (rule 5; C3) | — |

**New Works Order — Flow**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Heading, becoming the draft's number; the line saying what it is for and where it goes | A1 *Trigger*, *Hand-off* | who decides next is said before the work starts (C2) | — |
| The line saying the draft saves itself | A1 *Writes*, `WorksOrder.Draft` | the phone rings mid-form (C8; rule 8) | — |
| Four stage markers, each ticked when complete | A1 *Experience* | the Flow's stages | held — X17 would make three |
| Stage 1: Start from an earlier Works Order | A1 *Information needs*, similar past agreements | start from the last one (rule 8; C8) | — |
| Stage 1: Contractor, with its GST registration, or who to ask when it is not listed | A1 *Requires*; Counterparts, Parties and Contacts | a refusal names the way out (rule 7) | — |
| Stage 1: Kind of service · Who confirms the work · Where · Name · Scope | A1 *Subject* | the fields of the object, in the roles document's words (C5) | — |
| Stage 1: the tick for the contractor's staff working on site, and what follows from it | A1 *Subject*, labour-deployed; A7 | said in their words, with its consequence (C5) | — |
| Stage 1: the note on job work | §7 decision 7 | answers where the items go before it is asked | — |
| Stage 2: Contract value · In force from · In force to | A1 *Subject* | the fields of the object | — |
| Stage 2: milestones — kind, what is delivered or the period, due, amount; add and remove | A1 *Subject*; §7 decision 2 | the contract's parts are set where the contract is (rule 3) | — |
| Stage 2: One period a month | §7 decision 2, a service period generated from the schedule | twelve rows the spreadsheet would fill by dragging (C10) | — |
| Stage 2: the line saying whether the milestones add up to the value | §6, *Rules inside actions* | the refusal is known before submitting (rule 7) | — |
| Stage 3: the line saying the treatment is filled in and why to leave it | A1 *Information needs*, the suggestion with its reason | takes away worry (C9; rule 9) | held — X17 |
| Stage 3: TDS and GST, the suggested one marked | A1 *Decision* | accepted or changed as part of the decision (rule 9) | held — X17 |
| Stage 3: why it differs from the suggestion; Go back to the suggestion | A1 *Decision*, an override needs a reason | a change needs a reason (rule 9) | — |
| Stage 3: the contractor's licence, and the refusal with its way out when it has expired | A1 *Requires*; §7 decision 17 | names who to chase and where to update it (rule 7; C7) | held — X17 would move it to stage 1 |
| Stage 4: every field as entered, *Not filled in* in red | A1 *Experience*, review and submit | the Flow's review | — |
| Stage 4: the milestones and whether they add up | §6, *Rules inside actions* | the same check, where the decision is | — |
| Stage 4: how the value compares with similar agreements | A1 *Exceptions*, value unusual; *Parameters* | what the Procurement Manager will ask (rule 9) | — |
| Stage 4: the line saying it goes to the Procurement Manager and shows under *Waiting on others* | A1 *Hand-off*, *Held by* | whose move it becomes (C2) | — |
| Foot: Back · Next · Submit to the Procurement Manager · Leave it as a draft · the engine's refusal | A1 *Writes*, *Requires* | a refusal names the way out (rule 7) | — |
| Side panel: Similar agreements — the usual range a month, the verdict on this value, the nearest agreements | A1 *Information needs*; *Parameters* | priced against the last ones, in context (rule 9; proposal §5.2) | — |
| Side panel: *Start from this one* under each agreement | A1 *Information needs* | none of its own; two other places offer it | cut — X18 |
| Side panel: *Open the list*, opening the Works Order register for that service | P1 | the panel's fuller list, in the register that holds every contract | — |
| Side panel: Suggested tax treatment, with the reason for each part | A1 *Information needs* | arrives filled in with why (C9; rule 9) | held — X17 would move it to the check |

**Works Order — Record, with its milestones inside**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to Works Orders | P1 | the register is the way in (C1) | — |
| Number, name, status, and badges for what is wrong with it | A2 *Subject*; A1, A3, A6, A8 *Exceptions* | one or two statuses at the head of a record (§8.2) | — |
| The scope, under the name | A1 *Subject* | what the contract is for, in a line | — |
| Who has it and for how long | A1, A2 *Held by* | the holder on every item (rule 4) | — |
| Note: returned by the Procurement Manager, the reason, what to do | A1 *Held by*, returned for rework | a refusal names the way out (rule 7) | — |
| Note: the suggested tax treatment was changed, and the reason | A1 *Decision* | none of its own; the badge says it | cut — X14 |
| Action: Continue the draft · Fix and resubmit | A1 *Writes* | the officer's move on their own order | — |
| Actions: Amend · Renew · Close, and under them the reason for any that is refused | A2 *Writes*, *Requires*, *Exceptions* | each refusal read once, with its way out (rule 7; C7) | — |
| Action: Raise a similar one | A1 *Information needs* | start from the last one (rule 8; C8) | — |
| The money: left to bill, of what value; the bar; paid, billed and its share, confirmed by the department | A2 and A3 *Information needs*; *Asked of it*, row 2 | the contract's money is what the call is about (C1, C4; rule 3) | — |
| Facts: contractor · who confirms · where and what kind · in force and how long is left | A1 *Subject*; A6 *Information needs* | the facts asked for on the phone (C4) | — |
| Facts: tax deducted, with the reason where the suggestion was changed · GST | A1 *Subject*, *Decision* | the contractor asks why tax was deducted (C4); the reason sits with the treatment | — |
| Facts: contractor's staff on site with the licence's state · renewal terms | A1 *Subject*; A8 *Exceptions*; A6 *Information needs* | what blocks the next bill or the renewal | — |
| Tabs, one in view, each with its count | §5 *The Works Order is the hub*; §8.2 *What a record opens on* | the whole story in one place (rule 3; C1) | — |
| Tab Milestones: milestone, due, amount, confirmed, where it stands with who has it, its bill | A3, A4 *Information needs* | a milestone is a part of the contract (rule 3) | — |
| Tab Bills: bill, what for, received, amount, where it stands with who has it | A5 *Information needs*, earlier invoices; *Asked of it*, row 1 | where each bill is (C4) | — |
| Tab Contractor papers: the bill, period, amount on hold, where it stands, what is missing | A7 *Information needs* | what to chase the contractor for (C3) | — |
| Tab Goods with the job worker: whose they are; challan, goods, sent on, sent, still with them, must be back by, the warning | A9 *Information needs* | what is out, and how near its limit | — |
| Tab Goods with the job worker: Chase job worker on each challan with goods still out, and when it was last chased | A9 *Sends*; §7 decision 27 | the core verb one step away, and its trace (rule 5; C3) | put right — F3 |
| Tab What has happened: what, when, by whom, follow-ups among them | A2 *Information needs*, amendment history; §6 *Notices* | the answer to *why is this late* (C3) | — |
| In a milestone: which of how many, its name, status, who has it | A4 *Experience*; §7 decision 11 | opens inside its contract (rule 3) | — |
| In a milestone: due or the period · amount on the Works Order · who confirms · what was confirmed and when · its bill | A4 *Information needs* | what was promised against what the department said | — |
| In a milestone: Asked on · Last reminded · Escalated on | A4 *Information needs*, each request's status | none of its own; *Follow-ups sent* says it | cut — X16 |
| In a milestone: the department head's own words | A4 *Information needs* | why it was confirmed in part or declined | — |
| In a milestone: Ask for confirmation · Remind · Escalate · Chase contractor, each with its reason when refused | A3, A4 *Sends*; *Requires* | the core verb one step away; a refusal names the way out (rules 5, 7) | — |
| In a milestone: the line saying only the department head can confirm | Role card *Cannot* | who can unblock it (C7) | — |
| In a milestone: Follow-ups sent, each with date, to whom and the words | A3, A4 *Sends* | the record of having chased (C3) | — |

**Change a Works Order — Form**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to the Works Order, its number and status, the heading and what the change does | A2 *Decision* | says what follows — a higher value goes back for approval | — |
| Switch: Amend · Renew · Close | A2 *Decision* | none of its own; the Works Order offered the three | cut — X15 |
| The refusal, with its way out | A2 *Requires*, *Exceptions* | rule 7; C7 | — |
| New end date · new contract value, each with what it is at present | A2 *Writes* | change what differs, see what it was (C8) | — |
| On closing: what is released, and whether it is a short-close | A2 *Decision* | the consequence before the act | — |
| Reason, and who sees it | A2 *Requires* | kept on the contract's history (C3) | — |
| Foot: the change · Cancel · the engine's refusal | A2 *Writes* | rule 7 | — |
| Side panel: Where it stands — value, left, billed, paid, in force to, milestones confirmed, renewal terms | A2 *Information needs* | seen while deciding, so in context (proposal §5.2) | — |
| Side panel: Still open on it — unmatched bills, confirmations awaited | A2 *Information needs*, *Exceptions* | what stops a close, with the way to each (rule 7) | — |
| Side panel: Earlier changes | A2 *Information needs*, amendment history | what was changed before | — |

**Bill — Review**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to the bills in the queue; the contractor, the number, status, who has it | A5 *Subject*, *Held by* | the holder on every item (rule 4) | — |
| The stage line: each stage passed, the one it is at, who holds it | *Asked of it*, rows 1 and 3 | *where is my bill*, in one line (C4) | — |
| Column Works Order: the contract as a link · in force · value · billed before · left before and after this bill | A5 *Information needs*, *Requires* | the evidence side by side (proposal §5.3, Review) | — |
| Column Confirmation: the milestone and its due date · amount on the Works Order · what was confirmed and when · where it stands · the department head's words | A5 *Information needs*; A4 | the same | — |
| Column Confirmation: Remind, when the foot is not offering it | A4 *Sends* | the chase stays one step away once the bill is decided (rule 5) | — |
| A second Remind on the same screen | A4 *Sends* | none: the foot offers it beside the refusal | cut — X19 |
| Column Bill: number and date · what for · amount before GST and how far over · GST · total | A5 *Requires* | the same; the caller quotes the total (C4) | — |
| What the check found: five checks, each agreeing or not, with why | A5 *Decision*, the five reasons | the pre-computed match carries its reason (rule 9) | — |
| Earlier bills on this Works Order, and the contractor's past differences | A5 *Information needs* | a duplicate or a habit is seen at once | — |
| Foot, open: *Everything agrees*, or the refusal with its way out; Remind · Raise a difference · Match | A5 *Writes*, *Requires*; A4 *Sends* | a refusal offers the chase (rule 7); the decision at the end | — |
| Foot, raising: what is different, already chosen; a line for the Accounts Manager; Raise · Cancel | A5 *Writes*, `RaiseVariance` | the suggestion arrives filled in (rule 9) | — |
| Foot, decided: when and what was decided | §9 row 4 | the bill's page after the decision | — |

**Contractor papers — Form**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to the papers in the queue; contractor and period; the bill; status; who has it | A7 *Subject*, *Held by* | papers are collected against a held bill (§7 decision 19) | — |
| *Not ready to send*, and what is still to sort out | A7 *Decision*, gaps | names the missing workers or the unpaid challan to chase for (C3, C7) | — |
| The refusal once the papers are sent | A7 *Held by*, submitted | rule 7 | — |
| The papers, each ticked when received, with the date | A7 *Subject*; `ContractorEvidence.Record` | their word, *papers* (C5) | — |
| Workers: name, days, UAN on the ECR, wages against the minimum, the finding | A7 *Information needs* | the reconciliation in context (proposal §5.2) | — |
| Workers who agree, folded into one line until asked for | A7 *Information needs* | only what there is to sort out is shown (rule 1) | — |
| Foot: Save what has come in · Send to the Compliance Officer · Chase the contractor · why sending is refused | A7 *Writes*, *Sends*, *Requires* | the chase one step away; the refusal read once (rules 5, 7) | — |
| Side panel: the bill on hold — bill, amount, since when and whether overdue, Works Order, contractor and licence | A7 *Requires*, *Parameters* | the hold is why the papers are urgent | — |
| Side panel: who placed the hold and who releases it | Role card *Cannot* | who can unblock it (C7) | — |
| Side panel: Follow-ups sent | A7 *Sends* | the record of having chased (C3) | — |

**Contractor — Record**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to the register; the name; badges for what is wrong; the contact's name and phone | A8 *Subject*; Counterparts, vendor | chasing is done by phone (C3) | — |
| Action: Update licence and registrations | A8 *Writes* | the officer's one write here | — |
| Action: Chase for the licence | A8 *Sends* | the core verb one step away (rule 5) | — |
| Note: the licence has expired with staff on site, and what to do | A8 *Exceptions*; §7 decision 17 | a refusal names the way out (rule 7) | — |
| Facts: licence number and state · valid to · PF code · ESI code | A8 *Subject* | what the officer keeps current | — |
| Facts: PAN · GSTIN and registration | Role card *Reads only*; A1 *Requires* | read when raising an order for them | — |
| Works Orders with this contractor: order, status, in force to, value, share billed | A1 *Information needs*, the vendor's orders | every list is a way into a contract (C1) | — |
| Bills not yet paid, each with where it stands and who has it | *Asked of it*, row 1 | the contractor asks about all their bills at once (C4) | — |
| PF and ESI papers, each with where it stands and who has it | A7 *Information needs* | what to chase them for (C3) | — |
| Side panel: Who they are | Role card *Cannot*, edit party identity | none here; the form says it | cut — X20 |
| Side panel: What has happened | A8; *Sends* | the record of having chased (C3) | — |

**Contractor licence and registrations — Form**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Back to the contractor; heading; where the values come from | A8 *Experience* | copied from the certificate in hand | — |
| Licence number · valid to, with when the warnings come · PF code · ESI code | A8 *Subject*, *Parameters* | the four fields the seat keeps | — |
| Foot: Save · Cancel · the engine's refusal | A8 *Writes* | rule 7 | — |
| Side panel: name, PAN, GSTIN from Parties and Contacts, and who to ask if one is wrong | Role card *Cannot*; Counterparts, Parties and Contacts | who can unblock it (C7) | — |

**Reports — what every Register has**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| Heading and one line saying what the list holds | §4 | says whose list it is and how complete (C10) | — |
| Export to Excel (CSV), with the columns the screen stacks set out one to a column | Occupier *Today's tool* | the spreadsheet is still wanted for what the app does not do (C10; rule 10) | — |
| The first three filters in view, the rest behind *More filters*, opening when one is in use | each report's *Filters* row | filters in order of use (rule 10; §9 row 11) | — |
| The count, and Clear filters | §4 | how much the filters left | — |
| Every column sorts; amounts have a totals row | Occupier *Today's tool* | sort and totals as the spreadsheet has (C10) | — |
| Each row opens its record | proposal §5.2, Register | every list is a way in (C1) | — |

**Works Orders (P1) · Bills (P4) · Contractor papers (P6) · Milestones (P2) — Registers**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| P1 columns: the order with its number and contractor · status · in force to · value · left · used | P1; A2, A6 *Information needs* | the Excel contract tracker, replaced (C10; C1) | — |
| P1 columns, on a wide screen: confirmed · billed · paid | P1; P3; A2, A3 *Information needs* | where each contract's money stands, in the list that already has its value (C10) | — |
| P1 filters in view: status · contractor · ending | P1 *Filters* | what the monthly review asks first (A6) | — |
| P1 filters behind: used · department · where · service · staff on site · running out of value or time | P1 *Filters*; §3 tiles 7 and 8 | the remaining dimensions of A1, A2, A8; the dashboard opens it filtered | — |
| P1 filter: tax suggestion changed | §3 tile 11 | none without the tile | cut — X1 |
| P4 columns: the bill and what it is for · received · the contract and contractor · amount · where it stands with who has it | P4; A5 *Information needs* | every bill, whoever has it (C4) | — |
| P4 filters: where it stands · contractor · what is different · billed ahead or on hold | P4 *Filters*; §3 tile 6 | the dashboard opens it filtered | — |
| P6 columns: contractor · licence and its state · orders on site · workers not on the ECR · bills on hold and their amount · oldest hold | P6; A7, A8 *Information needs* | who to chase for what (C3) | — |
| P6 filters: needing attention · licence · bills on hold | P6 *Filters*; §3 tile 9 | the dashboard opens it filtered | — |
| P6 filter: contractor | P6 *Filters* | none: one row per contractor | cut — X21 |
| P2, the whole screen: due and how far off · the milestone with its contract · where it stands · amount · confirmed; filters due, confirmation, Works Order | P2; A3, A4 *Information needs* | weak: a milestone is read inside its contract, and the next 30 days are in the queue | held — X13 |

**Where the money stands (P3) · Confirmations by age (P5) · Similar agreements (P7) — not screens**

| Element | Card row | Reason | Cut? |
|---|---|---|---|
| P3 chart: the four totals — approved, confirmed, billed, paid — and the key to the bars | P3; A2, A3, A6 *Information needs* | none the register's totals row does not give | cut — X12 |
| P3 chart: still to be billed at each month end | §3 tile 10; §7 decision 21 | none: no act follows from the trend | cut — X12, X2 |
| P3 table: by Works Order, contractor or department — the bar, approved, confirmed, billed, paid, left to bill, used | P3 | none beyond P1, but for *confirmed* and *paid*, which P1 took | cut — X12 |
| P5 chart: open confirmations by who they wait on and for how long, with the same as a table | P5; A4 *Information needs* | who is slow, when escalating; the dashboard's tile counts by person | cut — X11 |
| P5 table: who it waits on · the milestone and its contract · due · open for · where it stands · amount; filter by person | P5 | none beyond the queue, and without its actions | cut — X11 |
| P7, the whole screen: service · the order and contractor · in force to · months · value a month · value · *Start from this*; the middle value; filters service, contractor, value | P7; A1 *Information needs* | none outside the flow, where the panel has it | cut — X10 |

### 10.5 What the trace says about the model

Kept for step 2. Each is something the audit met that the proposal does not settle.

| Finding | Seen in | What the model could say |
|---|---|---|
| *Information needs* produce more reports than the occupier opens | seven reports derived, four screens left, one of those held; two that nothing but the sidebar opened | §5.2 already asks whether a need is consulted on its own. Ask it when the report is derived, and write down who opens it and from where |
| Once the queue is split by whose move it is, the dashboard's tiles show the queue again | 21 items on the dashboard, all 21 in the queue | Tiles are derived per activity and per exception; rule 4 cuts across both. The lead may be most of an operational seat's Overview |
| The same item sat in a work tile and an exception tile | five items shown twice | An exception about an item that is already somebody's work is a flag on that item. It is a tile only when it has no work item |
| An indicator can count the role's own acts back to it | O7, tax suggestions changed | *No indicator without a decision* could add: and not a count of the decisions themselves |
| No indicator tile survived | both of this seat's were cut | Either an operational seat has no indicators of its own, or the Role card's *Outcomes* row yields indicators for the seat's manager, not the seat |
| Rule 5 says *every list*; a dashboard tile is a short list with no action on its rows | the chase is two steps from a dashboard row | Say whether a tile is a list under rule 5 |
| A *Sends* row can have no surface, and a surface no *Sends* row, without the derivation noticing | A9 (F3); A8 (§9 row 13) | The check of the first claim — no row without a surface — is only made by a trace. §6.3 could ask for it before the screens, not after |
| A search hit list can bury what was asked for under what belongs to it | a Works Order searched by number, behind its nine bills (F4) | *Asked of it* could say the answer comes first, before related objects |
