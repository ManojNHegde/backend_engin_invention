# Customer and vendor onboarding: backend design (doc first)

> **Status:** Draft for Vijay to review · rev 27-Oct-2026 · owner: Vijay (Accounts Executive)
>
> **Scope:** Only the onboarding of a **new customer or vendor**, and later changes to its finance fields. Everything else in the Accounts Executive app is out of scope for now.
>
> **Order of work:**
> 1. This doc: who triggers onboarding, what gets entered, where it is stored, the APIs and events, and the tables.
> 2. Once this is agreed: the UX walkthrough (the mock app, cut down to this one flow, with no backend connection).
> 3. Then the backend build.

**Decisions so far**

| Date | Decision |
|---|---|
| 26-Oct | The party master is just master tables where Procurement / Sales enter the party. Whether and how that entry is approved is a separate topic. |
| 26-Oct | "Already exists" problems (GSTIN on another party, account already exists …) are **system errors**, not sent to any checker. The AE sends the request back to Procurement / Sales with a comment. |
| **27-Oct** | **We do not use the P&C (`aikyat-parties-contacts`) tables.** We define our own party master tables, only what onboarding needs (§4.1). P&C was read for ideas only. |
| **27-Oct** | **Nothing arrives in the system from Procurement / Sales.** They hand the Accounts Executive a **paper form** (with copies of the GST certificate, PAN, cancelled cheque). The AE types **everything** in: party details and finance details. So every field is editable by the AE; the system only works out values from what was typed (state from GSTIN, constitution from PAN, header from category …) and those are editable too. |

**Sources read for this doc**

| Source | What it gave us |
|---|---|
| `forge.aikyat.com/aikyat/aikyat-parties-contacts` @ `42aab67` | **Reference only (27-Oct).** Ideas we kept: one party used by every module, a party can be both supplier and customer, PAN and GSTIN as separate identifiers with a GST status, history that is never overwritten. We do not read or write its tables |
| `forge.aikyat.com/aikyat/aikyat-finance` @ `647a919` (6-Oct) | The finance side that already exists: `accounting.account`, `accounting.party`, and the "ledger master satellite" tables in `accounting_txn` |
| `docs/shared_docs/engine_shared/` (Oct 1) | The makers and checkers for vendor and customer fields |
| `01_accounts_executive_tasks_and_responsibilities.md` | AE tasks T7 (vendor finance fields), T12 (customer finance fields), T17 (Udyam) |

---

## 1. Your understanding, checked

> *"Onboarding is an accounting thing, like creating a ledger, but here there is no concept of a group ledger."*

**Partly right.** In Tally, one ledger master holds everything about a party. Here that one master is **split in two**, and neither half has a "group ledger" of its own.

| | **Who they are** (party master) | **How we account for them** (party account) |
|---|---|---|
| Tables | **Ours, new:** `party_master.*` (§4.1) | Finance: `accounting.account` + `accounting.party` + satellites (§4.2), plus the new workflow tables (§4.3) |
| Holds | Legal name · PAN · GSTIN per state · address · email and phone · "is our supplier / customer" · uploaded documents | Account under Trade Payables / Receivables · credit days · credit limit · currency · bill-by-bill · category · constitution · MSME / Udyam · 43B(h) · bank details · TDS / GST tagging |
| Who enters it | **You (Accounts Executive)**, typed from the paper form that the Procurement Officer (vendor) or Sales Executive (customer) hands you. The Accounts Manager checks it against the scanned form | **You (Accounts Executive)**: you make it, and the Accounts Manager / Finance Controller / Credit Controller check it |
| Has a group? | **No.** The party master has no ledgers, groups or money | **Not as a separate thing.** The GL keeps groups and ledgers in **one table** (`accounting.account`). A "group" is just an account with `is_postable = false` (a header), and the party's own account sits under it |

So **"onboarding a vendor" means two records:**

1. **The Party** in the party master. It is created once per real company. The same `party_id` is used by Purchase, Sales and Finance.
2. **A Party account** in Finance. There is one per side: a vendor account, a customer account, or both. It links to the Party by `party_id` and holds only money and compliance fields.

What you actually do is **type in the whole form**: the party details (which become the party master on approval) and the finance details (which become the party account). If the party is **already in the master** (same GSTIN or PAN), you use that party instead; then its details come from the master and are locked.

> **Example:** Healthy Bite Foods is both our customer (C-04) and our packing-services vendor. That is **one** Party with **two** roles (customer, supplier) and **two** party accounts in Finance, one under Trade Receivables and one under Trade Payables.

### About "group"

You never create or pick a group by hand. The **side** decides where the account goes:

- **Payable** (vendor) → under the **Trade Payables / Sundry Creditors** header.
- **Receivable** (customer) → under the **Trade Receivables / Sundry Debtors** header.

The **category** you pick (for example "Creditors – Freight & Transportation (GTA)") then decides which sub-header it goes under, if the book has sub-headers, and which fields the form asks for. This is how the finance app's ledger form already works (`ledger_form_rules.dart`: "the group decides which parts of the form appear").

After go-live, the **Accounts Manager owns the chart of accounts**. So you can place a party account only under an existing header. You cannot create a new header.

---

## 2. The flow end to end

### 2.1 Vendor (example: Malnad Cocoa Traders, Vendor H, from the demo)

```text
 Ravi (Procurement Officer)        Teja (AE)                          Finance backend (ours)                       Rajan (AM) / Usha (FC) / Venkat
 ─────────────────────────        ─────────                          ──────────────────────                       ───────────────────────────────
 1 Needs a new cocoa supplier
   Fills the paper vendor form,
   attaches GST cert, PAN,
   cancelled cheque, quotation
   ── hands it over ────────────► 2 New from a paper form
                                     (side, form no, from Ravi) ───► 3 Opens a request: Draft, party_id NULL
                                  4 Types party details ──────────► 5 Works out state, constitution,
                                    + finance details                 account name, header, 43B(h)
                                    Checks GSTIN on the portal         Searches the party master by GSTIN / PAN
                                    Runs the penny-drop               (already there → "use it" or "return the form")
                                  6 Submits ◄────────────────────── Checks (Stop / Warn)
                                                                   7 Splits into change-sets ─────────────────► 8 Rajan: party details (against the
                                                                                                                  scanned form), account, terms, MSME
                                                                                                                Usha: bank · Venkat: GST / TDS
                                                                   9 All approved → party master row + role,
                                                                     GL account, satellites: ACTIVE ── event ──► Purchase, Payables, Compliance
```

**Step by step**

| # | Who | What happens | Where it is stored |
|---|---|---|---|
| 1 | **Procurement Officer** (Ravi) | Needs a new supplier. Fills the **paper** vendor registration form and attaches copies of the GST certificate, PAN, cancelled cheque and quotation. Hands it to the AE. *Nothing is entered in the system by Ravi.* | Paper (scanned and attached to the request) |
| 2 | **You** | Onboarding → **New from a paper form**: vendor or customer, form number, who handed it over | — |
| 3 | Finance | Opens a **party-account request**: status **Draft**, `party_id` empty (a new party unless you use one from the master) | `accounting_txn.party_account_request` |
| 4 | **You** | Type the **party details** (name, PAN, GSTIN, address, contact) and the **finance details** (category, credit days, MSME / Udyam, bank …). Check the GSTIN on the GST portal; run the penny-drop | Draft values on the request; `gstin_check`, `bank_verification` |
| 5 | Finance | Works out state, constitution, account name, header and 43B(h) from what you typed (you can change them). Searches the party master by GSTIN and PAN: if the party is already there, you **use it**; if it is already our vendor, the form goes back | — |
| 6 | You / Finance | You submit; the checks (§6) must be clear | — |
| 7 | Finance | Splits your entries into **change-sets by checker**: party details, account, terms and MSME → Accounts Manager (who checks the party details against the scanned form); bank → Finance Controller; GST/TDS tagging → Compliance Officer | `accounting_txn.party_account_change` |
| 8 | Checkers | Each one approves or returns their own part. A returned part comes back to **Needs me** with the reason | Decision on each change-set |
| 9 | Finance (automatic) | When every part is approved: **creates the party** in the party master (or adds a role to the party you used), then the postable account under its header, `accounting.party` with the `party_id`, the satellites. Status **Active** | `party_master.*`, `accounting.account`, `accounting.party`, `accounting_txn.*` |

**Before Active:** the vendor exists only on paper and as a draft request. It is not in the party master and **no Purchase Voucher can post to it**. Can a PO be raised before then? See Q3.

### 2.2 Customer

Same shape, with three differences:

| | Vendor | Customer |
|---|---|---|
| Who hands over the paper form | Procurement Officer | Sales Executive |
| Side and header | Payable → Trade Payables | Receivable → Trade Receivables |
| Extra fields | Bank details (must be verified), MSME / Udyam, 43B(h) | **Credit limit** (as written on the form; the Credit Controller checks it) and **billing instructions** (read by the Billing Executive) |
| Checkers | Accounts Manager; Finance Controller for bank | Credit Controller checks the limit, then the Accounts Manager confirms (T12) |

### 2.3 How do you find out a new party has arrived?

**On paper, not in the system** (decided 27-Oct). Procurement / Sales hand you the form. You start it with **New from a paper form**; from then on it sits in your **Needs me** until you submit it. There is no event from Procurement or Sales and nothing to listen for.

### 2.4 How do you see what was created?

| You want to see | Where | Source |
|---|---|---|
| Requests waiting on you / on others | Needs me · Waiting on others | `party_account_request` by status |
| One vendor's full picture | Party account page: identity block (read-only, from the party master) + finance blocks + history | `GET /parties/{id}` + `GET /party-accounts/{id}` |
| What changed, who made it, who approved it | History tab on the party account | `party_account_change` + `party_master.party_history` |
| All vendors / customers | Vendors list · Customers list, filtered by status, category, MSME, missing fields | `party_account` view (§4.3) |

---

## 3. What you enter (and what you don't)

Legend: **You type** = from the paper form · **Worked out** = the system fills it from what you typed; you can change it · **Checked** = the system or a checker verifies it. Nothing is read-only for you, except the party details of a party you chose to **use** from the master.

### 3.1 Vendor

| Block | Field | You type / Worked out | Comes from | Stored in |
|---|---|---|---|---|
| Party | Legal name · trade name | **You type** | Paper form / GST certificate | `party_master.party.legal_name`, `trade_name` |
| | PAN | **You type** (format checked) | PAN card copy | `party_master.party_tax_id` (scheme `PAN`) |
| | GSTIN | **You type**; must contain the PAN; **checked on the GST portal** (status, name) | GST certificate | `party_master.party_tax_id` (scheme `GSTIN`, `gst_status`) |
| | State | **Worked out** from the GSTIN's first two digits | Rule | `party_tax_id.state_code`, `party_location.state_code` |
| | Address · city · PIN · contact person · phone · email | **You type** | Paper form | `party_master.party_location`, `party_contact` |
| | Form number · handed over by | **You type** when you open it | Paper form | `party_account_request.form_no`, `form_from` → `party_role` on approval |
| Account | Side | **You pick** when you open it (vendor / customer) | Paper form | `party_account_request.side` |
| | Account name (as it shows in the books) | **Worked out** (trade or legal name; "(vendor)" added if the party already has a customer account) | Rule | `accounting.account.name` |
| | Under (header) | **Worked out** from the category | Rule | `accounting.account.parent_id` |
| Counterparty | Creditor category (20 values from the CA's Vendor Master) | **You type** (from what the form says they supply) | Paper form | `accounting_txn.party_classification.party_category` |
| | Constitution (company, LLP, firm …) | **Worked out** from the PAN's 4th letter (C = company, F = firm, P = individual …) | Rule | `party_classification.constitution` |
| | Resident / non-resident | **Worked out** (resident if it has an Indian PAN or GSTIN) | Rule | `party_classification.resident_status` |
| | Related party? | **You type** (yes / no; blank means "nobody has said") | Paper form | `party_classification.is_related_party` |
| Terms | Credit days | **You type** | Paper form / quotation | `accounting_txn.party_terms.credit_period_days` |
| | Bill-by-bill | **Worked out** (yes for a trade party) | Rule | `party_terms.bill_by_bill` |
| | Currency | **Worked out** (INR; blank means INR) | Rule | `party_terms.currency` |
| MSME | MSME? · category · Udyam number | **You type** (or "asked, not known yet", which sends a reminder) | Udyam certificate copy | `accounting_txn.party_compliance_status` |
| | 43B(h) 45-day clock applies? | **Worked out** from category + MSME (e.g. a landlord is "no" even if MSME) | Rule | `party_compliance_status.sec_43b_h_applies` |
| Bank | Account no. · IFSC · beneficiary name | **You type** (from the cancelled cheque) | Cheque copy | `party_bank_account` (§4.3) |
| | Penny-drop result · name match % | **Checked** by the bank API | Bank API | `bank_verification` |
| | Call-back: who you called, number used, when | **You type** (only if the penny-drop name does not match) | You | `bank_verification` |
| Tax tagging | TDS section · GST / RCM treatment | Shown as a preview; tagged by the **Compliance Officer** after you submit | Category → Taxation | `accounting_txn.account_tax_profile` |

**What you type for a typical vendor:** about 17 fields from the form (10 party, 7 finance). The system works out 8 more, which you only check.

### 3.2 Customer

Same identity, account and counterparty blocks (debtor categories: 16 values). Then:

| Field | You type / Worked out | Stored in |
|---|---|---|
| Credit days | **You type** | `party_terms.credit_period_days` |
| Credit limit | **You type** as written on the form; the **Credit Controller checks it** in his own change-set | `party_terms.credit_limit` |
| Currency | **Worked out** (INR) | `party_terms.currency` |
| Billing instructions (PO reference rule, delivery channel, format) | **You type** | `party_billing_instruction` (Billing reads it but cannot change it) |
| Email | **You type**; required for a customer (invoices go there) | `party_master.party_contact` |
| Bank details | Optional (only needed for refunds) | `party_bank_account` |

---

## 4. Tables

Three groups:

| Group | Schema | Status | Count |
|---|---|---|---|
| §4.1 Party master (who they are) | `party_master` | **New, ours** (replaces any use of P&C) | 7 tables |
| §4.2 Finance tables we reuse | `accounting`, `accounting_txn` | Already exist in aikyat-finance | 6 tables (2 columns to drop) |
| §4.3 Onboarding workflow | `accounting_txn` | **New, ours** | 7 tables |

### 4.1 Party master (new, ours)

Only what onboarding needs. **Written by the finance backend when a request is approved**, from what the AE typed off the paper form (decided 27-Oct). Rules:

- **Never overwrite, end-date instead** (`valid_from` / `valid_to`): a GSTIN that is cancelled keeps its row with the new status; an old address stays in history.
- **One party per real company, many roles.** A role (`supplier`, `customer`) is what starts onboarding.
- **Duplicates are found while you type:** the request searches the master by GSTIN and PAN. Same GSTIN → use that party (or, if it is already our vendor / customer, return the form). Same PAN, other GSTIN → a warning. *Q1 asks whether to add a unique key on active GSTIN as a last guard.*

```sql
CREATE SCHEMA party_master;

-- One real company or person. Created once, used by every module.
CREATE TABLE party_master.party (
  id               uuid PRIMARY KEY,
  workspace_id     uuid NOT NULL,                -- the group of companies sharing one master
  party_code       text NOT NULL,                -- 'P-0107', human readable
  party_kind       text NOT NULL CHECK (party_kind IN ('organization','person')),
  legal_name       text NOT NULL,
  trade_name       text NULL,                    -- name on invoices, if different
  legal_form       text NULL,                    -- 'private_limited','llp','partnership','proprietorship','trust',… (feeds constitution)
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','merged')),
  merged_into_id   uuid NULL REFERENCES party_master.party(id),
  created_by       uuid NOT NULL,                -- user id
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, party_code),
  CHECK ((status = 'merged') = (merged_into_id IS NOT NULL))
);

-- PAN, GSTIN (one per state), later CIN / TAN / foreign tax id.
CREATE TABLE party_master.party_tax_id (
  id               uuid PRIMARY KEY,
  party_id         uuid NOT NULL REFERENCES party_master.party(id),
  scheme           text NOT NULL CHECK (scheme IN ('PAN','GSTIN','CIN','TAN','FOREIGN_TAX_ID')),
  value            text NOT NULL,
  state_code       text NULL,                    -- GSTIN only: 'KA', from digits 1–2
  gst_status       text NULL CHECK (gst_status IN ('active','suspended','cancelled')),  -- GSTIN only
  status_checked_at timestamptz NULL,            -- last GST portal check
  valid_from       date NOT NULL,
  valid_to         date NULL,                    -- ended, never deleted
  CHECK (scheme <> 'PAN'   OR value ~ '^[A-Z]{5}[0-9]{4}[A-Z]$'),
  CHECK (scheme <> 'GSTIN' OR value ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'),
  CHECK ((scheme = 'GSTIN') = (state_code IS NOT NULL))
);
CREATE INDEX ON party_master.party_tax_id (scheme, value);   -- duplicate search, not unique (see above)

-- Addresses. One registered office, any number of branches / ship-to.
CREATE TABLE party_master.party_location (
  id               uuid PRIMARY KEY,
  party_id         uuid NOT NULL REFERENCES party_master.party(id),
  kind             text NOT NULL CHECK (kind IN ('registered','billing','shipping','branch')),
  address_lines    text[] NOT NULL,
  city             text NOT NULL,
  state_code       text NOT NULL,                -- place of supply
  postal_code      text NOT NULL,
  country_code     char(2) NOT NULL DEFAULT 'IN',
  gst_tax_id       uuid NULL REFERENCES party_master.party_tax_id(id),  -- the GSTIN of this place
  valid_from       date NOT NULL,
  valid_to         date NULL
);

-- People and mailboxes at the party (accounts@, the owner, the sales rep).
CREATE TABLE party_master.party_contact (
  id               uuid PRIMARY KEY,
  party_id         uuid NOT NULL REFERENCES party_master.party(id),
  name             text NULL,                    -- NULL for a shared mailbox
  designation      text NULL,
  purpose          text NOT NULL CHECK (purpose IN ('primary','accounts','sales','dispatch','other')),
  email            text NULL,
  phone            text NULL,                    -- E.164
  valid_from       date NOT NULL,
  valid_to         date NULL,
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- "Is our supplier / customer". Saving one is the onboarding trigger.
CREATE TABLE party_master.party_role (
  id               uuid PRIMARY KEY,
  party_id         uuid NOT NULL REFERENCES party_master.party(id),
  legal_entity_id  uuid NOT NULL,                -- which of our companies
  role             text NOT NULL CHECK (role IN ('supplier','customer')),
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_hold','ended')),
  entered_by       uuid NOT NULL,                -- the Accounts Executive who typed it in
  form_from        uuid NULL,                    -- who handed over the paper form (Procurement Officer / Sales Executive)
  form_no          text NULL,                    -- 'VRF-0107'
  request_id       uuid NULL,                    -- the party_account_request it came from
  note             text NULL,                    -- what the form says: "cocoa for RFQ-0412, quote attached"
  valid_from       date NOT NULL,
  valid_to         date NULL,
  UNIQUE (party_id, legal_entity_id, role)       -- one supplier role per party per company
);

-- Uploaded evidence: GST certificate, PAN card, cancelled cheque, Udyam, quotation.
CREATE TABLE party_master.party_document (
  id               uuid PRIMARY KEY,
  party_id         uuid NOT NULL REFERENCES party_master.party(id),
  kind             text NOT NULL CHECK (kind IN ('gst_certificate','pan_card','cancelled_cheque','udyam_certificate','quotation','other')),
  file_ref         text NOT NULL,                -- object-store key
  extracted        jsonb NULL,                   -- what AI read from it (for pre-fill)
  uploaded_by      uuid NOT NULL,
  uploaded_at      timestamptz NOT NULL DEFAULT now()
);

-- Every insert / update / end on the tables above, for the history tab.
CREATE TABLE party_master.party_history (
  id               bigserial PRIMARY KEY,
  party_id         uuid NOT NULL,
  table_name       text NOT NULL,
  row_id           uuid NOT NULL,
  action           text NOT NULL CHECK (action IN ('insert','update','end')),
  before_values    jsonb NULL,
  after_values     jsonb NULL,
  done_by          uuid NOT NULL,
  done_at          timestamptz NOT NULL DEFAULT now(),
  comment          text NULL
);
```

**Left out on purpose** (add when a real need comes): party relationships (group companies), multiple languages / names over time, a separate "claim / proposal" approval stage (the approval topic is open, 26-Oct).

### 4.2 Finance tables that already exist (aikyat-finance)

All satellites are keyed by `(legal_entity_id, account_id)`, with at most one row per account and no row when nothing is set.

| Table | Columns that matter for onboarding | What we do |
|---|---|---|
| `accounting.account` (GL kernel) | `id`, `legal_entity_id`, `name`, `parent_id`, `type`, `is_postable` | Reuse. **Groups and ledgers in one tree.** The party account is a postable leaf under the Trade Payables / Receivables header. Unique on (legal entity, name) |
| `accounting.party` (GL kernel) | `account_id` (unique), `legal_name`, `tax_id`, `state`, `email`, `phone`, `address`, `bank_details` (jsonb) | **Change:** add `party_id` → `party_master.party(id)`; drop `legal_name`, `tax_id`, `state`, `email`, `phone`, `address` (they now live in the party master: one fact, one home). `bank_details` moves to `party_bank_account` (Q5) |
| `accounting_txn.party_terms` | `credit_period_days`, `enforce_credit_days`, `bill_by_bill`, `credit_limit`, `currency` | Reuse. `NULL` ≠ 0 on purpose |
| `accounting_txn.party_classification` | `party_category`, `constitution`, `resident_status`, `is_related_party` | Reuse |
| `accounting_txn.party_compliance_status` | `msme_status` (yes / no / unknown), `msme_category`, `udyam_number`, `gstin_status`, `sec_43b_h_applies` | Reuse; **drop `gstin_status`** (it is in `party_tax_id.gst_status`). This is why T17 (Udyam) belongs inside onboarding: it sits on the same party account |
| `accounting_txn.account_tax_profile` | `pan`, `registration_type`, `tds_deductible`, `tds_nature_of_payment`, … | Reuse; **drop `pan`** (it is in `party_tax_id`) |
| `accounting_txn.party_address` | `country`, `pincode` | **Retire**: replaced by `party_master.party_location` |

### 4.3 Onboarding workflow (new, ours)

Nothing today records **"a new vendor is waiting to be set up, who is making it, who must check which part"**. The existing satellites only hold the final values, with no maker–checker. These tables add that.

```sql
-- One onboarding (or later change) of one party account. The case that sits in Needs me.
CREATE TABLE accounting_txn.party_account_request (
  id                 uuid PRIMARY KEY,
  legal_entity_id    uuid NOT NULL,
  party_id           uuid NULL REFERENCES party_master.party(id),  -- NULL until approved, unless the AE used an existing party
  form_no            text NOT NULL,          -- the paper form: 'VRF-0107'
  form_from          uuid NOT NULL,          -- who handed it over (Procurement Officer / Sales Executive)
  form_scan_ref      text NULL,              -- the scanned form and attachments (object store)
  side               text NOT NULL CHECK (side IN ('payable','receivable')),
  kind               text NOT NULL CHECK (kind IN ('onboard','change','block','reactivate')),
  status             text NOT NULL CHECK (status IN
                       ('draft','submitted','returned','approved','active','sent_back','cancelled')),
  account_id         uuid NULL,              -- set when the GL account is created (onboard) or the target (change)
  draft_values       jsonb NOT NULL DEFAULT '{}',  -- everything the maker has typed: party details + finance details
  worked_out         jsonb NOT NULL DEFAULT '{}',  -- what the system worked out from it, and why (for the "Worked out" table)
  made_by            uuid NULL,              -- user id of the maker
  sent_back_reason   text NULL,              -- the comment to Procurement / Sales
  submitted_at       timestamptz NULL,
  closed_at          timestamptz NULL,
  idempotency_key    text NOT NULL,          -- 'form:<form_no>' → one request per paper form
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  UNIQUE (legal_entity_id, idempotency_key),
  CHECK (status <> 'sent_back' OR btrim(sent_back_reason) <> '')
);

-- One block of a submitted request, routed to one checker. Field-level before/after for audit.
CREATE TABLE accounting_txn.party_account_change (
  id               uuid PRIMARY KEY,
  request_id       uuid NOT NULL REFERENCES accounting_txn.party_account_request(id),
  block            text NOT NULL CHECK (block IN
                     ('party','account','classification','terms','credit_limit','compliance','bank','tax_tagging','billing')),
  before_values    jsonb NULL,             -- NULL for a new account
  after_values     jsonb NOT NULL,
  checker_role     text NOT NULL,          -- 'accounts_manager' | 'finance_controller' | 'credit_controller' | 'compliance_officer'
  status           text NOT NULL CHECK (status IN ('pending','approved','returned')),
  decided_by       uuid NULL,
  decided_at       timestamptz NULL,
  reason           text NULL,              -- required when returned
  CHECK ((status = 'pending') = (decided_by IS NULL)),
  CHECK (status <> 'returned' OR btrim(reason) <> '')
);

-- Bank details with history (a "recently changed bank details" flag needs the history; a jsonb overwrite loses it).
CREATE TABLE accounting_txn.party_bank_account (
  id                uuid PRIMARY KEY,
  legal_entity_id   uuid NOT NULL,
  account_id        uuid NOT NULL,         -- the party account
  bank_account_no   text NOT NULL,         -- stored encrypted; shown masked
  ifsc              text NOT NULL CHECK (ifsc ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  beneficiary_name  text NOT NULL,
  since             date NOT NULL,
  until             date NULL,             -- ended, never overwritten
  approved_change_id uuid NOT NULL REFERENCES accounting_txn.party_account_change(id)  -- the Finance Controller's approval
);

-- The GST portal check of the GSTIN the AE typed (status and the name the portal holds).
CREATE TABLE accounting_txn.gstin_check (
  id              uuid PRIMARY KEY,
  request_id      uuid NOT NULL REFERENCES accounting_txn.party_account_request(id),
  gstin           text NOT NULL,
  status          text NOT NULL CHECK (status IN ('active','suspended','cancelled','not_found')),
  name_at_gst     text NULL,
  done_by         uuid NOT NULL,
  done_at         timestamptz NOT NULL,
  response_ref    jsonb NULL
);

-- Evidence for a bank account: penny-drop and/or call-back.
CREATE TABLE accounting_txn.bank_verification (
  id              uuid PRIMARY KEY,
  change_id       uuid NOT NULL REFERENCES accounting_txn.party_account_change(id),
  method          text NOT NULL CHECK (method IN ('penny_drop','call_back')),
  result          text NOT NULL CHECK (result IN ('pass','name_mismatch','failed','pending')),
  name_match_pct  numeric(5,2) NULL,
  called_number   text NULL,             -- must be the number on the paper form, not one from an email with the bank details
  called_person   text NULL,
  done_by         uuid NOT NULL,
  done_at         timestamptz NOT NULL,
  evidence_ref    jsonb NULL
);

-- Customer billing instructions: written by AE, read by Billing.
CREATE TABLE accounting_txn.party_billing_instruction (
  id               uuid PRIMARY KEY,
  legal_entity_id  uuid NOT NULL,
  account_id       uuid NOT NULL,
  po_reference_rule text NULL,      -- 'every_invoice' | 'none' | free text
  delivery_channel text NULL,       -- 'email' | 'portal' | 'with_goods' | 'courier'
  invoice_format   text NULL,
  UNIQUE (legal_entity_id, account_id)
);

-- Events we publish, from both the party master and finance (transactional outbox, as the GL already does in V018).
CREATE TABLE accounting_txn.event_outbox (
  id           bigserial PRIMARY KEY,
  event_type   text NOT NULL,
  aggregate_id uuid NOT NULL,
  payload      jsonb NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz NULL
);
```

**A read view, not a table:** `party_account` = `accounting.account` + `accounting.party` + `party_master.party` (+ PAN / GSTIN) + the satellites + the latest request status. It is what the Vendors / Customers list reads.

### 4.4 How the records connect

```text
Party master (ours, new)                     Finance (existing + new)
────────────────────────                     ────────────────────────
party ─────────────── party_id (FK) ───────► accounting.party ── account_id ──► accounting.account (leaf)
 ├─ party_tax_id (PAN, GSTIN + status)            │                                  └─ parent: Trade Payables (header)
 ├─ party_location                                ├─ party_terms
 ├─ party_contact                                 ├─ party_classification
 ├─ party_document                                ├─ party_compliance_status
 ├─ party_history                                 ├─ account_tax_profile (Compliance tags)
 └─ party_role (supplier) ◄── written on approval  ├─ party_bank_account
 paper form ──► party_account_request ── party_account_change ── bank_verification, gstin_check
                                                  └─ party_billing_instruction (customer)
```

Both sides are ours, in one database, so a real foreign key is allowed between them.

---

## 5. APIs and events

### 5.1 Party master API (read while you type; written on approval)

The base is `/api/v1/workspaces/{ws}`.

| Method & path | Who calls | What it does |
|---|---|---|
| `GET /parties?pan=…&gstin=…&q=…` | AE app, while typing | Search: "this GSTIN / PAN is already in the master" → use that party |
| `GET /parties/{party_id}` | Everyone | The party, with current tax ids, locations, contacts, roles |
| `POST /parties` with `Idempotency-Key` | **Internal only**, on approval | Creates the party with its tax ids, location and contact in one go, from the approved request |
| `POST /parties/{party_id}/roles` `{legal_entity_id, role, form_no, form_from}` | **Internal only**, on approval | Makes the party our supplier / customer |
| `POST /parties/{party_id}/documents` | AE app | Attach the scanned form, GST certificate, PAN, cheque, Udyam |
| `PATCH /parties/{party_id}` | AE app (a later change request) | Correct name, add a GSTIN, end an address. Written as new / ended rows, never overwritten |
| `GET /parties/{party_id}/history` | Everyone | Identity history |

### 5.2 Party account API (Finance, `transaction_accounting`)

The base is `/api/v1/legal-entities/{entity_id}`. This follows the existing `/legal-entities/{entity_id}/…` routes in `ledger_profile.py`.

| Method & path | Who calls | What it does |
|---|---|---|
| `GET /party-account-requests?status=draft,returned&assigned=me` | AE app | The **Needs me** list |
| `POST /party-account-requests` `{side, kind, form_no, form_from}` | AE app: **New from a paper form** | Opens a request with no party yet. Idempotent on `form:<form_no>` |
| `GET /party-account-requests/{id}` | AE app · checkers | Draft values + worked-out values + check results (+ the party, if one from the master is used) |
| `PATCH /party-account-requests/{id}` `{values:{…}}` or `{party_id}` | AE app | Save what you typed, or use a party from the master. Worked-out values and checks are re-run and returned |
| `POST /party-account-requests/{id}/gstin-checks` | AE app | GST portal search for the typed GSTIN: status and name |
| `POST /party-account-requests/{id}/bank-verifications` `{method:'penny_drop'}` | AE app | Starts a penny-drop. The result comes back later |
| `POST /party-account-requests/{id}/bank-verifications` `{method:'call_back', called_number, called_person}` | AE app | Records the call-back |
| `POST /party-account-requests/{id}/submit` | AE app | Stop checks must be clear. Splits into change-sets by checker |
| `POST /party-account-requests/{id}/send-back` `{reason}` | AE app | **Return the form** to whoever handed it over, with the comment. Status `sent_back` |
| `GET /party-account-changes?checker_role=accounts_manager&status=pending` | Checker apps | Their queue |
| `POST /party-account-changes/{id}/approve` · `/return` `{reason}` | Checker apps | Decide one block. The maker cannot approve their own (C-07) |
| `GET /party-accounts?side=payable&status=active&missing=udyam` | Lists, reports | Vendors / Customers list |
| `GET /party-accounts/{account_id}` · `/history` | AE, everyone | One party account and its change history |
| `POST /party-accounts/{account_id}/change-requests` | AE app | Later edit (terms, bank, Udyam): opens `kind = change` |
| *(existing)* `PUT /legal-entities/{id}/ledger-profiles/{account_id}` | **Internal only**, called on activation | Writes the satellites in one go (all or nothing) |
| *(existing GL)* `POST /accounts` | **Internal only**, called on activation | Creates the postable account under the header |

### 5.3 Events

| Event | When | Who listens |
|---|---|---|
| `party.created` | A request is approved with a new party | Search index, Purchase / Sales party pickers |
| `party.role.added` | A party becomes our supplier / customer (on approval) | Purchase / Sales: the party can be picked |
| `party.role.ended` | Role ended / on hold | Finance: flags the account |
| `party.tax_id.changed` | GSTIN added, or its status changes (e.g. cancelled) | Finance: flags the account "GSTIN cancelled, check open bills" |
| `finance.party_account.submitted` | AE submits | Checker queues |
| `finance.party_account.returned` | A checker returns a block | AE: back to Needs me |
| `finance.party_account.sent_back` | AE returns the form | Procurement / Sales: "form returned" with the comment (the paper goes back too) |
| `finance.party_account.activated` | All blocks approved; account created | **Purchase / Sales**: can now post · **Payables**: MSME clock · **Compliance**: MSME register |
| `finance.party_bank.changed` | A new bank account is active | **Payables / Accounts Manager**: "bank details changed recently" flag on payment proposals |
| `finance.party_terms.changed` | Credit days or limit changed | **Credit Controller**, Sales order checks |
| `finance.party_account.flagged` | GSTIN cancelled, or role ended | AE: Needs me |

### 5.4 Request status

```text
            ┌──────────── returned (reason) ◄──────────┐
            ▼                                          │
 draft ──► submitted ──► (each block approved) ──► approved ──► active
   │                                                   (GL account + satellites written, event sent)
   ├──► sent_back (form returned to Procurement / Sales with a comment)
   └──► cancelled (opened by mistake)
```

---

## 6. Checks (what stops you, what warns you)

| Check | Level | Why |
|---|---|---|
| PAN / GSTIN / PIN not in the right format | **Stop** (you fix it) | Typed from paper: copying mistakes |
| GSTIN does not contain the PAN (characters 3–12) | **Stop** (you fix it) | One of the two is copied wrong |
| State does not match the GSTIN's first two digits | **Stop** (you fix it) | The state decides IGST vs CGST + SGST |
| GSTIN not checked on the GST portal, or changed after the check | **Stop** | Confirms it is real, active, and in this name |
| GST portal says `cancelled` / `suspended` | **Stop · return the form** (cancelled) / **Warn** (suspended) | Invoicing a cancelled GSTIN is a compliance failure |
| Name on the GST portal differs from the name typed | **Warn** | Use the name on the portal unless the form says otherwise |
| No GSTIN | **Warn** | Unregistered party: reverse charge may apply, no ITC |
| GSTIN already in the master and that party is already our vendor / customer | **Stop · return the form** | Already set up: nothing new to create |
| GSTIN already in the master, no account on this side | **Stop** until you **use that party** | Do not create the same company twice |
| Same PAN as another party, different GSTIN | **Warn** (with "use it") | Can be right: one company, another state |
| Account name already used in the books | **Stop** (you fix it) | `accounting.account` is unique on (legal entity, name): change the name |
| No category | **Stop** | The category decides the header, TDS and 43B(h) |
| Bank account used by another party | **Stop · send back** | Shared doc §22.1, T7 exception |
| Penny-drop name mismatch, and no call-back | **Stop** | FC approves only "after penny-drop / call-back verification" |
| Call-back number came from the same email as the bank details | **Stop** | The classic fraud pattern; the FC's "high-risk flag if the change came by email" |
| MSME = yes, 43B(h) applies, credit days > 45 | **Stop** | MSMED Act / 43B(h) |
| MSME answer = unknown | **Warn** (sends a reminder to the vendor) | Unknown ≠ no |
| Maker and checker are the same person | **Stop** | C-07 |

**"Stop · return the form" (decided 26-Oct, reworded 27-Oct).** These are errors from the system that mean the form cannot be set up, not mistakes in your typing. They are not sent to any checker. You **return the form** to whoever handed it over (Procurement / Sales) with a comment (`POST /party-account-requests/{id}/send-back`, event `finance.party_account.sent_back`, status `sent_back`). No party and no account are created.

---

## 7. What changes in the AE task list

| Before (doc 01) | After |
|---|---|
| T7 Complete vendor finance fields | **One task: "Set up / change a party account"**, side = vendor |
| T12 Maintain customer finance fields | Same task, side = customer (credit-limit edits stay as their own trigger from the Credit Controller) |
| T17 Maintain a vendor's Udyam data | **Merged** into the vendor party account. `party_compliance_status` is on the same account. This answers the open "Merge into T7?" question in doc 01 |

---

## 8. Open questions

| # | Question | Ask |
|---|---|---|
| Q1 | Add a **unique key on active GSTIN** in `party_tax_id` as a last guard (the AE's search already stops duplicates while typing)? | Vijay · Manoj |
| Q2 | **One account per party** (Tally style; today's `accounting.party` is one row per account) **or one control account with a party sub-ledger**? This doc assumes one per party. | Finance / GL owner |
| Q3 | Can Purchase raise a **PO** to a vendor whose party account is not yet Active, or only an RFQ? | Manoj · Procurement |
| Q4 | Who makes the **call-back**: the AE or the Finance Controller? (Already open in doc 01, T7.) | Manoj |
| Q5 | Bank details: keep the kernel's `accounting.party.bank_details` jsonb, or move to `party_bank_account` with history (proposed)? | Finance / GL owner |
| Q6 | Does the Compliance Officer's GST/TDS tagging **block activation**, or can the account go live and be tagged after? | Manoj · Venkat |
| Q7 | Is the party master shared by all our companies (`workspace_id`, as drafted) or one per legal entity? | Manoj |
| Q8 | Is the paper form scanned and attached to the request (so Rajan can check the party details against it), and is there a standard form layout? | Manoj · Procurement · Sales |
| Q9 | Later, should Procurement / Sales enter the form in the system themselves (the AE then only completes it)? Today: paper only (27-Oct). | Later |

*Closed:* who checks identity in P&C (26-Oct: not our concern); P&C events / read API, GSTIN and PAN duplicated across products, P&C standing wording (27-Oct: P&C tables not used).

---

## 9. Next, after you agree this doc

1. ~~Update the mock app~~ Done 27-Oct: "New from a paper form", everything editable, GST portal check, use-existing-party, party master written on approval, Backend tab shows `party_master.*`.
2. Take Q1–Q8 to Manoj and the Finance owners.
3. Then freeze the API and the tables, and build.
