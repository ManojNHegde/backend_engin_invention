# Aikyat operations role register

24 roles across Purchase, Inventory, Sales, AR/AP, Banking, Taxation, Fixed Assets, Ledgers & Close, Notice & Litigation, Labour Compliance and FEMA / RBI, in business-flow sequence: buy and store, sell and control credit, record and approve, collect and pay, bank, payroll, comply and sign off, then oversight. A blank cell means the role is not used in that module. Revised Oct 1, 2026.

Legend: Maker / preparer · Checker · Approver / escalation · Payment execution · Compliance · Audit (read-only) · Management view · Operational role

## Role matrix

| # | Cycle | Role | Role ID | Purchase (P2P) | Inventory | Sales (O2C) | AR/AP | Banking | Taxation | Fixed Assets | Ledgers & Close | Notice & Litigation | Labour Compliance | FEMA / RBI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | P2P | Procurement Officer (Maker) | R-P01 (proposed) | Raises PO; match exceptions |  |  |  |  |  |  |  |  |  |  |
| 2 | P2P | Contracts & Services Procurement Officer | R-P03 (proposed) | Raises Works Order; gets service confirmation |  |  |  |  |  |  |  |  | Collects contractor PF/ESI evidence |  |
| 3 | P2P | Procurement Manager | R-P04 (proposed) | Approves PO and Works Order terms |  |  | Quality holds; retention completion |  |  |  |  |  |  |  |
| 4 | P2P + O2C | Stores / Inventory Officer | R-P02 (proposed) | Goods inward (GRN) | Adjustments, transfers, job-work challans | Dispatch (DC); e-way Part-B; returns |  |  |  | Asset custodian |  |  |  |  |
| 5 | P2P | Quality Inspector / QC Officer | R-P05 (proposed) | Inspects goods; rejection record |  |  |  |  |  |  |  |  |  |  |
| 6 | P2P | Inventory Controller | R-P06 (proposed) |  | Approves adjustments, transfers, counts |  |  |  |  |  |  |  |  |  |
| 7 | O2C | Sales Executive (Maker) | R-S01 (proposed) |  |  | Proforma, SO, adjustment requests |  |  |  |  |  |  |  |  |
| 8 | O2C | Sales Manager (Approver) | R-S02 (proposed) |  |  | Approves SO terms and adjustments; requests hold release |  |  |  |  |  |  |  |  |
| 9 | O2C + AR/AP | Credit Controller | R-S03 (proposed) |  |  | Credit gate; holds; requests release | Reads exposure; no entries |  |  |  |  |  |  |  |
| 10 | O2C | Billing Executive (Maker) | R-B01 (proposed) |  |  | Invoices, Credit/Debit Notes, export invoices | Open items out; invoice queries in |  | Outward documents; Sec 34 / Rule 47 flags |  |  |  |  | Shipping Bill ref on export invoices |
| 11 | Shared | Accounts Executive (Maker) | R01 | Vouchers, supplier credit notes, vendor finance fields | Item costing fields, opening stock, NRV draft | Customer finance fields, advances | 26AS, provision, FX revaluation, netting | Payment/receipt/contra; reversals; FX | Source entries; disallowance and GST-limit flags | Asset record, depreciation run | COA at migration, opening TB, journals |  |  | EDPMS / IDPMS links; e-BRC / FIRC |
| 12 | Shared | Accounts Manager (Checker) | R02 | Vouchers, credit notes, service bills | Owns costing method; Inventory close | Invoices, every Credit/Debit Note | Proposals, holds, FX, netting; AR/AP close | Vouchers by slab; FX revaluation | GST / TDS returns, ITC-04, 86B, cross-match | Capitalisation, disposal; FA close | Owns COA; TB review; prepares FS | Provision / contingent liability | Gratuity, leave, bonus provisions | EDPMS / IDPMS; overdue exports |
| 13 | O2C → AR/AP | Collections / Receivables Officer (Maker) | R-S05 (proposed) |  |  | Views outstanding only | Receipts, dunning, write-off request |  |  |  |  |  |  | Export realisation (9 months) |
| 14 | AR/AP | Accounts Payable Officer / Payables Executive (Maker) | R-AP01 (proposed) |  |  |  | Payment proposals, holds, disputes |  |  |  |  |  | Holds contractor bills | Links import payments to BoE |
| 15 | Banking | Master Administrator | R06a |  |  |  |  | Bank masters, loan schedules |  |  |  |  |  |  |
| 16 | Banking | Payments / Disbursement Officer | R06b |  |  |  | Interface: releases payment advices | Executes payments; UTR; cheques | Executes tax challans |  |  | Pays pre-deposits and demands |  |  |
| 17 | Banking | Reconciliation Executive | R01b (proposed) |  |  |  |  | Statements, BRS; flags only |  |  |  |  |  |  |
| 18 | Banking | Treasury / Finance Head | R06 |  |  |  |  | Approves limits, renewals; cash forecast |  |  |  |  |  | Checks ECB-2 |
| 19 | Payroll / Tax | Payroll Operations Specialist | HR-owned |  |  |  |  |  | Computes PF / ESI / PT / salary TDS |  |  |  |  |  |
| 20 | Payroll / Tax | Payroll & Statutory Compliance Specialist | HR-owned |  |  |  |  |  | Reviews and closes (PS-03 / PS-05) |  |  |  | Labour returns; Labour Code impact |  |
| 21 | Shared | Compliance Officer | R24 | Tax overrides; GSTR-2B; RCM; IMS | IBT GST; ITC reversal on write-offs | GST override; e-invoice / IRN; LUT | MSME, 43B(h), 180-day ITC | Covenants, CC stock statements | Checker; 17(5) tags; cross-match risk score | Override checker; Sch II; CARO |  | Owns notice register, all authorities | Verifies contractor PF/ESI; labour calendar | EDPMS/IDPMS; FLA, FC-GPR, ECB-2 |
| 22 | Shared | Finance Controller | R-FC01 (proposed) | Vendor bank details; high-value overrides | Write-offs, NRV, costing-method change | Credit-hold release; CN above threshold | Write-offs, provisions; AR/AP close sign-off | BRS, accruals, above-slab, BG, escrow | Rate masters, provisions, risk score | Block defaults, depreciation, revaluation | Approves FS; single period lock | Replies, appeals, pre-deposits | Labour-law provisions | FLA, FC-GPR; realisation extensions |
| 23 | Shared | Internal Auditor (read-only) | R09 | Reads Approval Log | Reads movements, reversals, reconciliation | Reads Approval Log | Reviews write-offs, netting, holds | Reads BRS, audit logs, approval trail, confirmations | Read-only trail incl. notices | Reads full register and schedule history | Tests journals, ledger changes and period reopens | Reviews notice register | Tests contractor verification | Reviews FEMA status and filings |
| 24 | Shared | CEO / Management (view-only) | R32 (proposed) | Vendor scorecard, exception summary | Inventory dashboard KPIs | Customer scorecard, exception summary | DSO, DPO, ageing, ITC at risk | Daily / weekly cash and debt digest | Tax dashboard; notice-risk score | Net block, depreciation trend | Monthly financials; "Ask your books" | Litigation exposure; risk score |  |  |

## Detailed register

### 1. Procurement Officer (Maker) — R-P01 (proposed)

*Cycle: P2P*

- **Purchase (P2P)** (Maker / preparer): Raises the Purchase Order (commercial terms checked by the Procurement Manager); follows up overdue POs; raises three-way-match variances (checked by the Accounts Manager); proposes reorder / min-max levels (checked by the Inventory Controller)

### 2. Contracts & Services Procurement Officer — R-P03 (proposed)

*Cycle: P2P*

- **Purchase (P2P)** (Maker / preparer): Raises Works Orders/Agreements for services, contract jobs, job work and professional fees (checked by the Procurement Manager, commercial only; no accounting approval at this stage); obtains the service completion confirmation from the requesting department head; raises Works Order / confirmation / invoice match variances; collects contractor PF/ESI evidence alongside the service confirmation
- **Labour Compliance** (Maker / preparer): Collects the contractor's PF/ESI challans, ECR, wage register and labour licence for workers deployed under a Works Order (checked by the Compliance Officer before payment)

### 3. Procurement Manager — R-P04 (proposed)

*Cycle: P2P*

- **Purchase (P2P)** (Approver / escalation): Approves PO commercial terms (rate, vendor, delivery) and Works Orders commercially; owns vendor scorecard and DPO reporting (Phase 5)
- **AR/AP** (Approver / escalation): Approves quality holds on payment (place or release); confirms completion before retention release

### 4. Stores / Inventory Officer — R-P02 (proposed)

*Cycle: P2P + O2C*

- **Purchase (P2P)** (Operational role): Records goods inward against the PO; tags Branch/Godown; hands goods to QC and confirms the disposition; returns rejected goods
- **Inventory** (Operational role): Posts GRN inward and DC outward; raises Stock Adjustments and Stock Transfers (checked by the Inventory Controller; inter-branch also by the Compliance Officer); records goods sent to and back from job workers; takes part in blind counts of other godowns
- **Sales (O2C)** (Operational role): Records dispatch against the approved SO; completes e-way bill Part-B; records goods returned by customers; raises discrepancy notes; generates e-way bills against delivery challans for movements without a tax invoice (job work, returns to vendors, goods on approval)
- **Fixed Assets** (Operational role): Confirms receipt, tag, location and put-to-use date; initiates and confirms transfers; keeps usage logs; takes part in physical verification (never solely of own assets)

### 5. Quality Inspector / QC Officer — R-P05 (proposed)

*Cycle: P2P*

- **Purchase (P2P)** (Operational role): Inspects goods against the PO/GRN specification; decides accepted vs rejected quantity; sole owner of the Quality/Rejection record

### 6. Inventory Controller — R-P06 (proposed)

*Cycle: P2P*

- **Inventory** (Approver / escalation): Approves Stock Adjustments, count variances, cross-branch transfers, job-work challans, negative-stock overrides and reorder levels; plans physical counts; gives operational input on costing method (the method is an accounting policy owned by the Accounts Manager)

### 7. Sales Executive (Maker) — R-S01 (proposed)

*Cycle: O2C*

- **Sales (O2C)** (Maker / preparer): Prepares Proforma Invoices; raises the Sales Order (checked by the Sales Manager); requests commercial adjustments — returns, price corrections, post-supply discounts, citing any pre-agreed scheme (approved by the Sales Manager); does not issue invoices, Credit Notes or Debit Notes, which the Billing Executive issues

### 8. Sales Manager (Approver) — R-S02 (proposed)

*Cycle: O2C*

- **Sales (O2C)** (Approver / escalation): Approves SO pricing, discount and delivery terms; approves the reason and value of every commercial adjustment behind a Credit Note or price-correction Debit Note; owns the Customer Scorecard; may request a credit-hold release, which only the Finance Controller can approve; cannot release a hold

### 9. Credit Controller — R-S03 (proposed)

*Cycle: O2C + AR/AP*

- **Sales (O2C)** (Operational role): Checks credit limit and payment history before confirmation or dispatch; places credit holds; requests releases from the Finance Controller; independent of Sales
- **AR/AP** (Operational role): Reads exposure and overdue data for the Sales credit gate; makes no allocation or write-off entries

### 10. Billing Executive (Maker) — R-B01 (proposed)

*Cycle: O2C*

- **Sales (O2C)** (Maker / preparer): Raises Sales Invoices for supplies made (dispatches, services rendered, milestones, contract and subscription schedules) and, in integrated mode, confirms the ones the system generated on dispatch; the e-invoice (IRN, QR) and e-way bill Part-A are generated by the system on the Accounts Manager's approval; requests IRN / e-way bill cancellations within 24 hours; issues Credit Notes and Debit Notes only against a commercial adjustment approved by the Sales Manager (checked by the Accounts Manager, and the Finance Controller above threshold); sets the post-supply discount GST flag (checked by the Compliance Officer); prepares export/SEZ invoices; issues GST Receipt / Refund Vouchers on advances; keeps dispatched-not-billed at zero; resolves invoice errors with customers. Never allocates receipts, requests write-offs or edits customer finance fields
- **AR/AP** (Operational role): Every posted invoice, Credit Note and Debit Note reaches AR/AP as an open item; clears invoice-error queries that Collections routes back (wrong rate, missing PO reference, IMS rejection); makes no allocation or write-off entries
- **Taxation** (Maker / preparer): Issues the outward documents that feed GSTR-1 and the e-invoice / e-way bill data; gets warnings before saving on the Sec 34 credit-note time limit and the 30-day services invoicing limit (Rule 47); GST rate or place-of-supply overrides need the Compliance Officer
- **FEMA / RBI** (Maker / preparer): Captures the Shipping Bill number and date on each export invoice, which the Accounts Executive links to EDPMS

### 11. Accounts Executive (Maker) — R01

*Cycle: Shared*

- **Purchase (P2P)** (Maker / preparer): Posts purchase, import and service-bill vouchers (service bills only against a confirmed service), landed cost, Debit Notes and supplier credit notes received; maintains vendor finance fields (identity sits in Business Core); requests tax overrides
- **Inventory** (Maker / preparer): Maintains Item Master costing and accounting fields; loads opening stock; runs the Reconciliation Engine; drafts the slow-moving/expired/NRV provision; generates the bank stock statement
- **Sales (O2C)** (Maker / preparer): Maintains customer finance fields, including billing instructions (identity sits in Business Core); records advances against SO and flags GST on advance for the Billing Executive's receipt voucher. Sales invoices, notes, export/SEZ invoices and IRN cancellations moved to the Billing Executive
- **AR/AP** (Maker / preparer): Uploads and matches 26AS/AIS; drafts provision and FX revaluation runs; prepares netting documents; maintains Udyam data; runs reconciliation; party links are raised to Business Core
- **Banking** (Maker / preparer): Creates payment, receipt and contra vouchers; posts unrecorded lines, dishonour and stale-cheque reversals from the Reconciliation Executive's flags; posts FX revaluation of bank accounts; BG invocation vouchers
- **Taxation** (Maker / preparer): Posts the source transactions feeding TDS/GST; captures Bills of Entry; uploads lower/nil deduction certificates; gets warnings before saving on 40A(3), 269ST, 269SS/T, 40(a)(ia) and 43B-equivalent triggers and on Sec 16(4) / Sec 34 time limits and 17(5) blocked credit; overrides need the Compliance Officer
- **Fixed Assets** (Maker / preparer): Completes asset records; capitalises from CWIP; initiates disposals; proposes revaluation and impairment; runs the depreciation batch; migrates the opening register
- **Ledgers & Close** (Maker / preparer): Sets up the chart of accounts and loads the opening trial balance at migration; posts general journals, the payroll journal (from PO-06), employee expense claims and petty cash; prepares month-end and year-end schedules
- **FEMA / RBI** (Maker / preparer): Links Shipping Bills to EDPMS and Bills of Entry to IDPMS; records e-BRC / FIRC against receipts (checked by the Accounts Manager)

### 12. Accounts Manager (Checker) — R02

*Cycle: Shared*

- **Purchase (P2P)** (Checker): Approves purchase, import and service-bill vouchers, Debit Notes, supplier credit notes, match variances and vendor finance-field edits; owns month-end purchase cut-off; prepares RCM self-invoices and IMS actions (checked by the Compliance Officer)
- **Inventory** (Checker): Owns the costing-method configuration and proposes Valuation Method Changes (approved by the Finance Controller); approves Item Master, opening stock, reconciliation and NRV working; confirms the Inventory module close
- **Sales (O2C)** (Checker): Approves invoices and every Credit Note and Debit Note issued by the Billing Executive (invoices above threshold), match variances, customer finance-field edits; owns month-end revenue cut-off; approval triggers the e-invoice and e-way bill Part-A; approves IRN / e-way bill cancellations within 24 hours requested by the Billing Executive
- **AR/AP** (Checker): Approves payment proposals, holds, disputes, allocation exceptions, FX revaluation and netting; prepares the 43B(h) list and ITC reversal working; confirms the AR/AP module close
- **Banking** (Checker): Approves vouchers within slab, reversals, fuzzy matches and FX revaluation of foreign-currency bank accounts (a regular month-end entry)
- **Taxation** (Maker / preparer): MAKER: prepares GST and TDS computations, returns and challan drafts, ITC-04 for job work, advance tax and tax provision (checked by the Compliance Officer or Finance Controller); applies Rule 86B; tracks the 30 November ITC and credit-note limits; explains department's-view cross-match differences; computes 40(a)(ia) / 40A(3) / 43B disallowances
- **Fixed Assets** (Checker): Approves capitalisation, disposals and cross-branch transfers; reviews CWIP ageing; confirms the Fixed Assets module close
- **Ledgers & Close** (Checker): Owns the chart of accounts after go-live; checks the Accounts Executive's journals, payroll journal, expense claims and petty cash; reviews the trial balance; runs the period close checklist; prepares the financial statements for the Finance Controller's approval
- **Notice & Litigation** (Maker / preparer): Reviews the working Aikyat assembles for each notice; maintains the provision / contingent liability classification (approved by the Finance Controller)
- **Labour Compliance** (Maker / preparer): Books labour-law provisions including the Labour Code wage-definition impact on PF and gratuity (approved by the Finance Controller)
- **FEMA / RBI** (Checker): Approves EDPMS / IDPMS links, e-BRC records and import payment–BoE links; reviews overdue exports and open BoEs monthly

### 13. Collections / Receivables Officer (Maker) — R-S05 (proposed)

*Cycle: O2C → AR/AP*

- **Sales (O2C)** (Management view): Views customers' outstanding position in Sales; all receipt and follow-up work is owned by AR/AP in every configuration
- **AR/AP** (Maker / preparer): Allocates receipts; dunning, promise-to-pay, statements; short-payment follow-up; requests write-offs, refunds and late-payment interest; records recoveries
- **FEMA / RBI** (Maker / preparer): Chases export realisation against the 9-month limit; requests extension or write-off through the AD bank (approved by the Finance Controller)

### 14. Accounts Payable Officer / Payables Executive (Maker) — R-AP01 (proposed)

*Cycle: AR/AP*

- **AR/AP** (Maker / preparer): Prepares payment proposals; manages holds and disputes; cash discounts; advances and retention; vendor statement reconciliation; monitors MSME due dates; proposes write-backs
- **Labour Compliance** (Maker / preparer): Keeps a compliance hold on contractor bills until the Compliance Officer verifies PF/ESI evidence and releases it
- **FEMA / RBI** (Maker / preparer): Links each import payment to its Bill of Entry so it closes in IDPMS (checked by the Accounts Manager)

### 15. Master Administrator — R06a

*Cycle: Banking*

- **Banking** (Operational role): Maintains bank masters, signatories, sanction details, loan schedules, BG/LC records and covenant calendars (checked by the Treasury / Finance Head)

### 16. Payments / Disbursement Officer — R06b

*Cycle: Banking*

- **AR/AP** (Payment execution): Interface only: releases payments that reach Banking as payment advices from approved proposals and refunds; no AR/AP role has release or signatory rights
- **Banking** (Payment execution): Executes approved payments via portal or H2H/API; records UTR; manages the cheque register; cannot edit amount or payee
- **Taxation** (Payment execution): Executes TDS, GST, duty and payroll statutory payments once the Compliance Officer has validated; releases foreign remittances after Form 145/146
- **Notice & Litigation** (Payment execution): Pays pre-deposits and demands once the Finance Controller approves; challan attached to the notice record

### 17. Reconciliation Executive — R01b (proposed)

*Cycle: Banking*

- **Banking** (Operational role): Imports statements daily; clears the exception queue; chases stale cheques; checks charges and interest; prepares the BRS; flags unrecorded lines and dishonours but makes no vouchers

### 18. Treasury / Finance Head — R06

*Cycle: Banking*

- **Banking** (Approver / escalation): Approves bank masters, signatories, limits, rate changes, prepayments, renewals and BG/LC events; owns the 13-week cash flow forecast; requests escrow withdrawals
- **FEMA / RBI** (Approver / escalation): Checks the monthly ECB-2 return where the company has an external commercial borrowing

### 19. Payroll Operations Specialist — HR-owned

*Cycle: Payroll / Tax*

- **Taxation** (Maker / preparer): Calculates PF/ESI/PT/salary TDS; produces payroll register, bank-advice file (PO-05) and accounting output (PO-06), which the Accounts Executive posts as the payroll journal

### 20. Payroll & Statutory Compliance Specialist — HR-owned

*Cycle: Payroll / Tax*

- **Taxation** (Checker): PS-03: reviews payroll statutory output without recomputing. PS-05: tracks payment evidence and closes compliance
- **Labour Compliance** (Maker / preparer): Files minimum wages, Bonus Act, LWF, Shops & Establishment and POSH returns; computes the Labour Code wage-base impact on PF and gratuity (filing tracked by the Compliance Officer)

### 21. Compliance Officer — R24

*Cycle: Shared*

- **Purchase (P2P)** (Compliance): Maintains GST/RCM/ITC/TDS tagging; approves voucher-level overrides; validates RCM self-invoices and IMS actions; GSTR-2B reconciliation; ITC reversal on supplier credit notes
- **Inventory** (Compliance): Confirms GST on cross-state inter-branch transfers and e-way bills; confirms ITC reversal on stock lost, destroyed or written off
- **Sales (O2C)** (Compliance): Approves tax overrides; e-invoice/IRN exceptions; e-way bill expiry; post-supply discount and GST-on-advance; LUT validity; Sales Register vs GSTR-1; monitors e-way bills raised against delivery challans
- **AR/AP** (Compliance): Owns MSME register and Form 1; validates 43B(h) list, ITC reversal and 26AS mismatches; compliance holds; sets the payment-recognition rule
- **Banking** (Compliance): Tracks CC stock statements, drawing power and covenant tests
- **Taxation** (Compliance): CHECKER: validates GST, TDS and ITC-04 computations before filing; due dates, certificates, notices, rate masters, LUT renewal; approves disallowance and time-limit overrides; maintains 17(5) tags; confirms Rule 86B exemptions; GST registration amendments and additional places of business; runs the monthly department's-view cross-match (GSTR-1 vs 3B vs e-invoice vs e-way bill; GST vs ITR vs 26AS/AIS; TDS claimed vs deposited) and the notice-risk score
- **Fixed Assets** (Compliance): Checker on useful-life/method overrides; Schedule II to tax-block crosswalk; deferred tax; capital-goods ITC reversal; CARO 3(i)
- **Notice & Litigation** (Compliance): One register for IT, GST, TDS/TRACES, Customs, PF/ESI, labour, ROC, municipal and pollution board; AI reads the notice PDF, assembles ledgers and returns, drafts the reply for CA review; tracks deadlines, pre-deposits and appeal limitation; feeds exposure to contingent liabilities and the CEO
- **Labour Compliance** (Compliance): Verifies contractor PF/ESI evidence before payment and releases the hold (principal-employer liability); tracks the labour calendar filed by HR; monitors Labour Code changes
- **FEMA / RBI** (Compliance): Monitors EDPMS / IDPMS; prepares FLA (15 July), FC-GPR (within 30 days of allotment) and ECB-2 (monthly) where applicable

### 22. Finance Controller — R-FC01 (proposed)

*Cycle: Shared*

- **Purchase (P2P)** (Approver / escalation): Approves every vendor bank-detail change and tax/TDS overrides above the value threshold
- **Inventory** (Approver / escalation): Approves write-offs above threshold, the NRV provision and costing-method (Valuation Method) changes proposed by the Accounts Manager
- **Sales (O2C)** (Approver / escalation): The only role that can release a credit hold (requested by the Credit Controller or Sales Manager); second approval on Credit Notes and tax overrides above threshold
- **AR/AP** (Approver / escalation): Approves write-offs above threshold, write-backs, provision runs, netting above threshold, interest waivers and TDS credit write-offs; signs Schedule III ageing; signs off the AR/AP module close
- **Banking** (Approver / escalation): Signs off month-end BRS, interest accruals and the consolidated position; approves above-slab vouchers, BG invocations and escrow withdrawals; reviews delegations
- **Taxation** (Approver / escalation): Approves rate/threshold master changes and overrides above threshold, advance tax and tax provision, DRC-03 payments, refund filings and LUT renewal; reviews demand-value notices; approves GST registration amendments and the disallowance working with the tax provision; reviews the monthly notice-risk score
- **Fixed Assets** (Approver / escalation): Approves block-level defaults, revaluation, impairment and verification outcomes; signs off the depreciation run and the FA year-end close
- **Ledgers & Close** (Approver / escalation): Signs off the migration chart of accounts and opening trial balance; approves group/Schedule III mapping changes and above-slab journals; signs off the trial balance; approves the financial statements; applies the single company-wide period lock and is the only role that can reopen it
- **Notice & Litigation** (Approver / escalation): Approves replies after CA review, appeal decisions, pre-deposits and the provision / contingent liability classification
- **Labour Compliance** (Approver / escalation): Approves gratuity, leave and bonus provisions with the Labour Code impact shown separately
- **FEMA / RBI** (Approver / escalation): Approves FLA and FC-GPR; approves extension or write-off requests for unrealised exports

### 23. Internal Auditor (read-only) — R09

*Cycle: Shared*

- **Purchase (P2P)** (Audit (read-only)): Reads Approval Log; can raise audit queries; approves nothing and is never a checker
- **Inventory** (Audit (read-only)): Reads movements, reversals, reconciliation; observes counts; approves nothing and is never a checker
- **Sales (O2C)** (Audit (read-only)): Reads Approval Log; tests credit releases, overrides, CNs; tests that no one both issues an invoice and allocates the receipt against it, and that every note traces to an approved adjustment; approves nothing and is never a checker
- **AR/AP** (Audit (read-only)): Reviews write-offs, netting, holds; tests dunning samples; approves nothing and is never a checker
- **Banking** (Audit (read-only)): Reads BRS, audit logs, approval trail, confirmations; approves nothing and is never a checker
- **Taxation** (Audit (read-only)): Read-only trail incl. notices; approves nothing and is never a checker
- **Fixed Assets** (Audit (read-only)): Reads full register and schedule history; observes verification; approves nothing and is never a checker
- **Ledgers & Close** (Audit (read-only)): Tests journals, ledger changes and period reopens; surprise petty cash counts; approves nothing and is never a checker; across modules, keeps the audit findings and action tracker: ages open findings, flags repeat findings and drafts the Audit Committee summary; verifying closure is follow-up, not an approval
- **Notice & Litigation** (Audit (read-only)): Reviews missed deadlines, replies without CA review and exposure changes without a provision review; approves nothing
- **Labour Compliance** (Audit (read-only)): Tests samples of contractor bills paid, with the PF/ESI evidence and hold release behind each; approves nothing
- **FEMA / RBI** (Audit (read-only)): Reviews overdue realisations, open BoEs and late FEMA filings; approves nothing

### 24. CEO / Management (view-only) — R32 (proposed)

*Cycle: Shared*

- **Purchase (P2P)** (Management view): Vendor scorecard, exception summary
- **Inventory** (Management view): Inventory dashboard KPIs
- **Sales (O2C)** (Management view): Customer scorecard, exception summary
- **AR/AP** (Management view): DSO, DPO, ageing, ITC at risk
- **Banking** (Management view): Daily / weekly cash and debt digest
- **Taxation** (Management view): Tax analytics dashboard
- **Fixed Assets** (Management view): Net block, depreciation trend
- **Ledgers & Close** (Management view): Monthly financials and close status; "Ask your books" chat answers plain-language questions (e.g. why is Q2 margin down?) with every figure linked to vouchers
- **Notice & Litigation** (Management view): Open matters by authority, total demand and pre-deposits, deadlines in the next 30 days, and the notice-risk score

## Roles by scope

| Category | Roles | Count |
|---|---|---|
| Shared across modules | Accounts Executive, Accounts Manager, Finance Controller, Compliance Officer, Internal Auditor, CEO / Management | 6 |
| Shared – Purchase, Inventory, Sales, Fixed Assets | Stores / Inventory Officer (R-P02), also the asset custodian | 1 |
| Shared – Sales + AR/AP | Credit Controller, Collections / Receivables Officer | 2 |
| Unique – Purchase | Procurement Officer, Procurement Manager (also quality holds and retention in AR/AP), Contracts & Services Officer, Quality Inspector | 4 |
| Unique – Inventory | Inventory Controller | 1 |
| Unique – Sales | Sales Executive, Sales Manager, Billing Executive (a Finance role sitting in the O2C cycle) | 3 |
| Unique – AR/AP | Accounts Payable Officer / Payables Executive | 1 |
| Unique – Banking | Master Administrator, Treasury / Finance Head, Payments / Disbursement Officer (also AR/AP interface and tax challans), Reconciliation Executive | 4 |
| Unique – Fixed Assets | None – shared roles plus the Stores / Inventory Officer as custodian | 0 |
| Unique – Taxation | Payroll Operations Specialist, Payroll & Statutory Compliance Specialist (both HR-owned) | 2 |
| Unique – Ledgers & Close | None – Accounts Executive makes, Accounts Manager owns and checks, Finance Controller approves and locks | 0 |
| Unique – Notice & Litigation, Labour, FEMA / RBI | None – owned by the Compliance Officer with shared roles; HR files labour returns | 0 |
| Total distinct roles |  | 24 |

## What changed and points still open

| Topic | Detail |
|---|---|
| Revised Oct 1, 2026 | Billing Executive (R-B01, proposed) added as role 10 (24 roles). Sales Executive no longer issues Credit Notes and the 'Sales generates invoices, per config' option is dropped: Sales requests the adjustment, the Sales Manager approves the reason and value, the Billing Executive issues the note. Sales Invoices, Debit Notes, export/SEZ invoices, GST Receipt / Refund Vouchers and IRN / e-way bill cancellation requests move from the Accounts Executive to the Billing Executive. Billing never allocates receipts, requests write-offs or edits customer finance fields. |
| Revised Sep 29, 2026 | Notice & Litigation, Labour Compliance and FEMA / RBI columns added; e-invoice / e-way bill, disallowance triggers at entry, GST extras, department's-view cross-match, audit findings tracker and "Ask your books" added. Earlier (Sep 28): aligned with the revised role-wise work list: Inventory and Ledgers & Close columns added; Inventory Controller added (23 roles); distinct role IDs proposed; the changes below applied. |
| Ledger and period close | The Accounts Executive sets up the chart of accounts and opening trial balance at migration; the Accounts Manager owns the chart of accounts afterwards, reviews the trial balance and prepares the financial statements; the Finance Controller approves them and applies one company-wide period lock. The former AR/AP, Inventory and Fixed Assets locks are now module closes that feed it. |
| Credit-hold release | Only the Finance Controller can release a hold. The Sales Manager and the Credit Controller can request a release; no Sales role can approve one. |
| FX revaluation | A regular month-end entry in both AR/AP (open items) and Banking (foreign-currency accounts): made by the Accounts Executive, checked by the Accounts Manager. |
| Costing method | An accounting policy: owned and proposed by the Accounts Manager, approved by the Finance Controller. The Inventory Controller gives operational input only. |
| Works Orders | Approved commercially by the Procurement Manager only. The Accounts Manager approves the service bill later, which is posted only against a service completion confirmation. |
| Masters and Business Core | Party identity (name, PAN, GSTIN, address) and party links or merges sit in Business Core. Finance modules keep only finance fields: credit terms, ledger mapping, bank details, credit limit, tax tagging. |
| Maker/checker flips | In Taxation the Accounts Manager is Maker and the Compliance Officer is Checker (elsewhere the Accounts Executive makes and the Accounts Manager checks). The same pattern covers the RCM self-invoice, IMS actions, the 43B(h) list and the ITC reversal. The Compliance Officer makes GST/RCM/ITC/TDS tagging and the payment-recognition rule, checked by the Accounts Manager and Finance Controller respectively. |
| Role IDs | Distinct IDs now proposed: Accounts Manager R02 and Finance Controller R-FC01; Treasury / Finance Head R06, Master Administrator R06a, Payments Officer R06b; Accounts Executive R01 and Reconciliation Executive R01b; Billing Executive R-B01 (Oct 1). Proposed IDs still need adding to the Roles sheet. |
| Stores role naming | One name, Stores / Inventory Officer (R-P02), across Purchase, Inventory, Sales and Fixed Assets (as custodian). |
| Sales ID gap | Sales IDs still jump from R-S03 to R-S05; R-S04 is missing. |
| Tax payments | Tax, duty and payroll statutory challans are executed by the Payments / Disbursement Officer after Compliance Officer validation. The Finance Controller approves but does not execute, keeping approval and payment apart. |
| Collections Officer | AR/AP owns receipt recording and allocation in every configuration, not only once AR/AP is adopted. Sales keeps the Credit Controller gate and a view of outstanding. |
| Payment advice | A system hand-off of an approved proposal or refund to Banking as a payment voucher. It is not an approver; approval is the Accounts Manager's or Finance Controller's by slab. |
| Selling, billing, collecting | Three separate powers: Sales sets price and terms and approves commercial adjustments; the Billing Executive turns what was supplied into a valid invoice or note; Collections applies the cash in AR/AP. Billing never allocates receipts (lapping) and never edits the customer it bills. In a small company Billing may sit with the Accounts Executive, with every invoice and note then checked by the Accounts Manager; it is never combined with Collections or a Sales role. |
| Internal Auditor | Read-only everywhere and never a checker; tests samples and raises queries after the fact. |
| E-invoice and e-way bill | IRN, QR and e-way bill Part-A are generated by the system on the Accounts Manager's invoice approval. Stores completes Part-B and raises e-way bills for non-invoice movements. Cancellations within 24 hours: Billing Executive requests, Accounts Manager approves. Exceptions and expiry: Compliance Officer. |
| Department's view | Monthly cross-match run by the Compliance Officer (GSTR-1 vs 3B vs e-invoice vs e-way bill; GST vs ITR vs 26AS/AIS; TDS claimed vs deposited); the Accounts Manager explains differences; notice-risk score to the Finance Controller and CEO. |
| Contractor labour | Principal-employer check: no contractor bill is paid until the Compliance Officer verifies PF/ESI evidence collected by the Contracts & Services Officer; the Payables Executive holds the bill meanwhile. |
| Work added | Supplier credit notes received, payroll journal (PO-06), employee expenses and petty cash, job work and ITC-04, service completion confirmation, opening trial balance. |
| Not roles | The external auditor is a time-boxed read-only access profile; the payment advice is a system step; the service receiver (requesting department head) confirms delivery but is not a finance role. |
| Open points | R32 still provisional. Petty cash: the Accounts Executive keeps and books it, mitigated by the Accounts Manager's monthly count and the Internal Auditor's surprise counts; split the custodian where size allows. Thresholds pending management decision: purchase approval hierarchy, SO approval, write-off (Accounts Manager vs Finance Controller), tolerances, voucher and journal slabs. |
