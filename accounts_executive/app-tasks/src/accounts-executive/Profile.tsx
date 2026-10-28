// Profile sheet: who I am and what this role may and may not do (reference roles §11.1–11.4, §12).

import { Check, X } from 'lucide-react';
import { KeyValue, Section } from '../ui';
import { ME } from '../store/actors';
import { AREAS } from '../store/areas';
import { POSITION, RESPONSIBILITIES } from './manifest';

const CAN = [
  'Post purchase vouchers (OCR or keyed), with or without a PO, once the Procurement Officer\'s match variance is approved',
  'Post service bills against a Works Order; route a bill above its confirmation as an exception',
  'Allocate landed cost; raise debit notes; book supplier credit notes',
  'Request a tax or TDS override from the Compliance Officer',
  "Complete and change vendors' finance fields (terms, ledger, bank details)",
  "Create items' accounting fields from New Item Requests",
  "Enter customers' finance fields, including credit limits the Credit Controller recommends",
  'Record advances against sales orders and flag GST on advance for Billing',
  'Run the stock and AR/AP reconciliations, the provision and FX runs and the 26AS/AIS match',
  'Prepare netting documents; keep vendors\' Udyam (MSME) data',
  'Set my own rules (Rules page): stricter OCR flag, earlier TDS and MSME warnings, reminders. Quieting a warning needs the Accounts Manager',
];

const CANNOT = [
  'Approve my own voucher, note or master change (the Accounts Manager checks)',
  'Change vendor bank details without the Finance Controller',
  "Edit a party's identity: name, PAN, GSTIN, address (Business Core)",
  'Raise the three-way-match variance (the Procurement Officer does; the Accounts Manager approves)',
  'Issue sales invoices, credit or debit notes to customers (Billing Executive)',
  'Change a credit limit the Credit Controller has not recommended and checked',
  'Override the tax the policy engine derived (Compliance Officer)',
  'Edit a vendor and then approve a voucher against it (C-07)',
  'Set a rule that skips a check or the checker',
];

export function Profile() {
  return (
    <div className="sheet-stack">
      <KeyValue
        items={[
          { label: 'Position', value: POSITION.title },
          { label: 'Role ID', value: POSITION.roleId },
          { label: 'Works at', value: `${ME.place}, all branches` },
          { label: 'Scenario user', value: ME.name },
          { label: 'Role owner', value: POSITION.owner },
          { label: 'Stage', value: '3 · Record and approve' },
        ]}
      />
      <Section title="My areas">
        <ul className="perm-list">
          {AREAS.map((a) => (
            <li key={a.id}>
              <span className="code-tag">{a.ref}</span> <span><strong>{a.title}</strong> · {a.what}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="What I answer for">
        <ul className="perm-list">
          {RESPONSIBILITIES.map((r) => (
            <li key={r.id}>
              <span className="code-tag">{r.id}</span> <span>{r.title}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="I can">
        <ul className="perm-list">
          {CAN.map((c) => (
            <li key={c}>
              <Check size={16} className="tone-success" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="I cannot">
        <ul className="perm-list">
          {CANNOT.map((c) => (
            <li key={c}>
              <X size={16} className="tone-critical" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
