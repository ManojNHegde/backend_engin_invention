import { CircleCheck, CircleX } from 'lucide-react';
import { Section } from '../../ui';

const CAN = [
  'Type in a new vendor or customer from the paper form: party details and finance details',
  'Use a party already in the master instead of creating it again',
  'Check a GSTIN on the GST portal, run the penny-drop, record a call-back',
  'Save a draft, submit it for checking, resubmit a returned one',
  'Return a form to Procurement / Sales with a comment',
];
const CANNOT = [
  'Change a party already in the master from here (that is a change request)',
  'Create or change a header in the chart of accounts (the Accounts Manager owns it)',
  'Activate without the checkers: Rajan (party, account, terms), Usha (bank), Farid (credit limit)',
  'Tag GST / TDS (the Compliance Officer does)',
  'Approve your own request',
];

export function Profile() {
  return (
    <div className="sheet-stack">
      <Section title="In this app you can">
        <ul className="perm-list">
          {CAN.map((c) => (
            <li key={c}>
              <CircleCheck size={16} className="tone-success" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="You cannot">
        <ul className="perm-list">
          {CANNOT.map((c) => (
            <li key={c}>
              <CircleX size={16} className="tone-critical" aria-hidden /> {c}
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
