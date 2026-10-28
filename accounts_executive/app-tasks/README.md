# Accounts Executive app: task screens built from scratch (mock)

Based on the archived 23-task app (`../archive/app-23-tasks-2026-10-26.zip`). The **Tasks** tab now shows one task screen,
built from scratch; the other 22 tasks and the generic task screen are still in the code but not shown.

| Screen | Folder | Task |
|---|---|---|
| **Create a vendor** (shown) | `src/accounts-executive/vendor-create/` | New vendor from a paper form: the executive types everything; GST portal check, penny-drop, checks, three checkers. Rules follow `../03_party_onboarding_design.md` §3 and §6 |
| Vendor finance fields | `src/accounts-executive/t7/` | T7 |
| Create a vendor's Udyam data | `src/accounts-executive/t17/` | T17 |

To show a different screen, change `src/accounts-executive/tabs/TasksTab.tsx`.

```bash
npm install
npm run dev     # http://localhost:5174 (same port as ../app)
npm run typecheck
npm test        # one scenario test fails: it expects the old Tasks tab ("Post a purchase voucher")
```

GST portal, penny-drop, Udyam portal and party-master lookups are **mock tables**, not engine behaviour.
Not yet in the role file: "Create a vendor".
