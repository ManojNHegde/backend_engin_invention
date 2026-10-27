# Credit Controller: from Task to Engine (T1, T4)

**Status:** Proposal. "Engine" here means the backend tables (the schema).
**Sources:**
- our task cards (`credit_controller_task_atomicity_analysis.md`, T1 and T4);
- the role file (`credit_controller.md` §7, "What this asks of the engine");
- the Sales team's demo engine (`sales-manager/demo_code/demo_shared_engine/backend`), for the shape of the tables other roles own.

---

## 1. The idea

```text
Task card → questions to the role → what they answer → what they do → what the engine must keep → tables
```

- Every column comes from a question. If no question needs a column, it is not added.
- Each table has **one owner role**: the role whose work creates its rows.
- We only propose **our** tables. Other roles' tables are shown as **hypothetical**, from the Sales demo engine. Their owner may change them.

## 2. Three ways a task touches a table

| Kind | Meaning | Rows created by |
|---|---|---|
| **Read** | We only read it to see the facts and decide. | Another role |
| **Contribute** | We write one or two columns in another role's table. That column is our contribution. | Another role |
| **Own** | Our own table. We create the rows and keep them. | Credit Controller |

- **Dependent task:** the subject is another role's record. We contribute columns to it and keep our own trail. → **T1**
- **Independent task:** the subject is our own record. We only read from others. → **T4**

## 3. Tables and their owner role

| Table | Owner role (creates the rows) | Who else writes in it | Ours? |
|---|---|---|---|
| `sales_order` | **Sales Executive** (raises the order) | Sales Manager (commercial terms) · **Credit Controller** (credit columns, T1) | Hypothetical |
| `customer_credit_position` | **Accounts Executive** (edits the limit on the customer record) | Finance Controller approves the limit · outstanding and overdue come from `customer_invoice` | Hypothetical |
| `customer_invoice` | **Billing Executive** (raises the invoice) | Collections & Receivables Officer (records what is paid) | Hypothetical |
| `credit_review_suggestion` | **Sales Manager** (suggests a limit review) | Credit Controller marks it handled (T4) | Hypothetical |
| `credit_decision` | **Credit Controller** (T1) | — | **Ours (new)** |
| `credit_limit_review` | **Credit Controller** (T4) | — | **Ours (new)** |
| `credit_limit_review_batch` | **Credit Controller** (T4, bulk) | — | **Ours (new)** |

---

## 4. T1: Decide an order sent for credit review (dependent)

**Card, short:**
- **Trigger:** the credit check routes a Sales Order (over the limit, money overdue, or a bounced payment).
- **Decision:** Approve · Reject (reason) · Hold (reason).
- **Hand-off:** Approved → Sales Manager · Rejected or held → Sales Executive.

```text
 sales_order (Sales Executive) ──read──►┐
 customer_credit_position (Accounts Exec) ──read──►  T1  ──contribute──► sales_order.credit_status / credit_hold_reason / current_workflow_status
 customer_invoice (Billing Executive) ──read──►┘      └──own──► credit_decision
```

### 4.1 Question → table

| Question to the role | Answer gives | Table.column | Kind |
|---|---|---|---|
| "Which order came to you, and why?" | Order, customer, value, routing reason | `sales_order`: sales_order_number, customer_id, grand_total, credit_days · routing reason (calculated) | Read |
| "What is the limit, and what do they owe?" | Limit, outstanding, overdue, band | `customer_credit_position`: credit_limit, outstanding, overdue, band | Read |
| "Any bounced payments or broken promises?" | Dishonours, broken promises | `customer_credit_position`: dishonoured_90d, broken_promises | Read |
| "How old is the overdue?" | Ageing | `customer_invoice`: due_date, amount, settled_amount | Read (calculated) |
| "What do you decide?" | Approve / Reject / Hold | `sales_order.credit_status` **(new column)** | **Contribute** |
| "Why?" | Reason | `sales_order.credit_hold_reason` (exists) | **Contribute** |
| "Who sees it next?" | Sales Manager or Sales Executive | `sales_order.current_workflow_status` (exists; we move it) | **Contribute** |
| "Can someone check later what you saw and decided?" | Snapshot, decision, reason, who, when | `credit_decision` | **Own** |

### 4.2 Our contribution to `sales_order` (owner: Sales Executive)

| Column | New or exists | What we write |
|---|---|---|
| `credit_status` | **New** | Routed · Approved · Rejected · Held · Auto-passed · Agreed |
| `credit_hold_reason` | Exists | Our reason when we reject or hold |
| `credit_hold_status` | Exists | true when we hold |
| `current_workflow_status` | Exists | Approved → waiting for the Sales Manager · Rejected or held → back to the Sales Executive |

That's all. We change no other column on the order.

### 4.3 Our table: `credit_decision` (owner: Credit Controller)

| Column | From the question |
|---|---|
| id | — |
| sales_order_number | "Which order?" |
| customer_id | "Which order?" |
| routed_because | "Why did it come to you?" (over limit · overdue · bounced) |
| order_value | "Which order?" |
| limit_at_decision · exposure_at_decision · overdue_at_decision · band_at_decision | "What did you see?" (a snapshot, so the decision can be checked later even after the numbers change) |
| decision | "What do you decide?" (Approve · Reject · Hold · Agree · Hold anyway) |
| reason | "Why?" (required for Reject and Hold) |
| decided_by · decided_at | "Who and when?" |

### 4.4 Actions and events

| Action | Who may take it | Writes | Event (from the role file) |
|---|---|---|---|
| `ApproveOrderCredit` | Credit Controller | `credit_decision` + `sales_order.credit_status` = Approved | `SOCreditCleared` |
| `RejectOrderCredit` | Credit Controller | `credit_decision` + credit_status = Rejected + reason | `SOCreditRejected` |
| `HoldOrderCredit` | Credit Controller | `credit_decision` + credit_status = Held + hold flag + reason | `CreditHoldPlaced` |

**Can't save when:** there is no decision · a Reject or Hold has no reason · the order isn't Routed.

---

## 5. T4: Review credit limits (independent)

**Card, short:**
- **Trigger:** every quarter · a limit not reviewed within the review period · the Sales Manager suggests a customer.
- **Decision:** Keep, or Propose a new limit (up or down). One customer, or many at once (bulk) with one reason.
- **Hand-off:** Accounts Executive edits the limit → Credit Controller checks the edit (T5) → approver confirms.

```text
 customer_credit_position (Accounts Exec) ──read──►┐
 customer_invoice (Billing Executive)     ──read──►  T4  ──own──► credit_limit_review (+ credit_limit_review_batch)
 credit_review_suggestion (Sales Manager) ──read──►┘
```

### 5.1 Question → table

| Question to the role | Answer gives | Table.column | Kind |
|---|---|---|---|
| "Which customer?" | Customer | `customer_credit_position`: customer_id | Read |
| "What is the old limit?" | Current limit | `customer_credit_position`: credit_limit | Read |
| "What does the system suggest?" | Suggested limit | avg_monthly_billing, credit_days, band, dishonoured_90d, overdue (calculated) | Read |
| "How do they pay?" | On-time %, DSO, disputes | on_time_payment_pct, dso_days, dispute_count_12m | Read |
| "Did someone ask for it?" | The Sales Manager's suggestion | `credit_review_suggestion`: reason, suggested_limit | Read (+ mark it handled) |
| "Keep or change?" | Decision | `credit_limit_review.decision` | **Own** |
| "What new limit?" | New limit | `credit_limit_review.proposed_limit` | **Own** |
| "Why?" | Reason | `credit_limit_review.reason` | **Own** |
| "From when?" | Effective date | `credit_limit_review.effective_from` | **Own** (ask) |
| "Many at once?" | Bulk, one reason | `credit_limit_review_batch` | **Own** |

### 5.2 Our contribution to other roles' tables

- **Nearly none.** We **don't** write `credit_limit`. The Accounts Executive edits it and the approver confirms it, through T5.
- The only touch is marking the Sales Manager's suggestion as handled: `credit_review_suggestion.status` = Reviewed.

### 5.3 Our tables (owner: Credit Controller)

**`credit_limit_review`**, one row per customer:

| Column | From the question |
|---|---|
| id | — |
| customer_id | "Which customer?" |
| batch_id | "Many at once?" (empty for one customer) |
| suggestion_id | "Did someone ask for it?" (empty if none) |
| trigger | Quarterly · overdue for review · suggested |
| current_limit | "What is the old limit?" (a snapshot) |
| suggested_limit | "What does the system suggest?" (a snapshot) |
| decision | Keep · Propose |
| proposed_limit | "What new limit?" (required if Propose; must differ from current_limit) |
| reason | "Why?" |
| effective_from | "From when?" (ask) |
| status | Kept · Sent to Accounts Executive · Edited · Checked · Approved · Refused |
| reviewed_by · reviewed_at | "Who and when?" |

**`credit_limit_review_batch`**, for a bulk review:

| Column | From the question |
|---|---|
| id | — |
| reason | "Why?" (one reason for all) |
| customer_count | — |
| created_by · created_at | "Who and when?" |

Each customer in a batch still has its own `credit_limit_review` row, and goes to the Accounts Executive separately (role file, decision 8).

### 5.4 Actions and events

| Action | Who may take it | Writes | Event (from the role file) |
|---|---|---|---|
| `KeepLimit` | Credit Controller | `credit_limit_review` (Keep) | — (ask: is an event needed?) |
| `ProposeLimit` | Credit Controller | `credit_limit_review` (Propose) → Accounts Executive | `LimitRecommended` |
| `ProposeLimitsInBulk` | Credit Controller | `credit_limit_review_batch` + one `credit_limit_review` per customer | `LimitRecommended` (one per customer) |

**Can't save when:** there is no customer · a Propose has no new limit, or the same limit as now · there is no reason.

---

## 6. T1 and T4 side by side

| | T1 (dependent) | T4 (independent) |
|---|---|---|
| Subject | Sales Order (**Sales Executive's** record) | Limit review (**our** record) |
| Read from | `sales_order`, `customer_credit_position`, `customer_invoice` | `customer_credit_position`, `customer_invoice`, `credit_review_suggestion` |
| Contribute to | `sales_order`: 1 new column + 3 that exist | `credit_review_suggestion.status` only |
| Own | `credit_decision` | `credit_limit_review`, `credit_limit_review_batch` |
| Without the other role's table | T1 can't exist (no order, no task) | T4 still works (needs only the customer's numbers) |

## 7. Open points

1. **Who approves a new limit:** the role file says the **Finance Controller** (decision 4); our T4 card changed it to the **Accounts Manager**. The tables don't change either way; only who confirms does.
2. Is a new `credit_status` column on `sales_order` acceptable to its owner (Sales Executive / Sales team engine), or should we only use `credit_hold_status` and `credit_hold_reason`?
3. Does Keep need an event, or only a row?
4. Should the Approval Log be one shared append-only table for every credit action, or is each task's own table enough? (role file §7 asks for one)
5. Hypothetical tables were checked only against the Sales demo engine, not the published shared engine.
