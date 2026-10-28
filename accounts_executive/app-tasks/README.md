# Accounts Executive app: task screens built from scratch (mock)

Based on the archived 23-task app (`../archive/app-23-tasks-2026-10-26.zip`). The **Tasks** tab lists one task,
**Create a vendor**; its card opens a single form. The other 22 tasks and the generic task screen are still in the code but not shown.

| Screen | Where | Task |
|---|---|---|
| **Create a vendor** form (shown) | `src/accounts-executive/vendor-create/CreateVendorForm.tsx` | One form, nothing beside it: the executive types the paper vendor form in; GST portal check and penny-drop next to their fields; each problem shows under its field; Submit or Return the form. Rules in `vendor-create/model.ts`, from `../03_party_onboarding_design.md` §3 and §6 |
| Create a vendor, three-pane (not shown) | `src/accounts-executive/vendor-create/CreateVendorScreen.tsx` | Earlier version: list of paper forms, the form, live checks and the three checkers |
| Vendor finance fields | `src/accounts-executive/t7/` | T7 |
| Create a vendor's Udyam data | `src/accounts-executive/t17/` | T17 |

To show a different screen, change `src/accounts-executive/tabs/TasksTab.tsx`.

```bash
npm install
npm run dev     # http://localhost:5174 (same port as ../app); ?tab=tasks opens the Tasks tab
npm run typecheck
npm test        # one scenario test fails: it expects the old Tasks tab ("Post a purchase voucher")
```

GST portal, penny-drop, Udyam portal and party-master lookups are **mock tables**, not engine behaviour.
Not yet in the role file: "Create a vendor".
