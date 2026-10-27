// The checks (design doc §6) and who checks what: the rules the form applies, in one place.

import { PageHeader, Section, StatusPill } from '../../ui';
import { ACTORS } from '../catalogue';
import { routesFor } from '../rules';

const CHECKS: { level: 'stop' | 'warn'; when: string; why: string }[] = [
  { level: 'stop', when: 'PAN or GSTIN not in the right format, or the GSTIN does not contain the PAN', why: 'Typed from paper: the commonest copying mistake' },
  { level: 'stop', when: 'State does not match the GSTIN, or PIN code not 6 digits', why: 'The state decides IGST vs CGST + SGST' },
  { level: 'stop', when: 'GSTIN not checked on the GST portal (or changed after the check)', why: 'Confirms it is real, active and in this name' },
  { level: 'stop', when: 'GSTIN is cancelled on the portal · return the form', why: 'Invoicing a cancelled GSTIN is a compliance failure' },
  { level: 'warn', when: 'GSTIN suspended, or the name on the portal differs', why: 'Hold ITC; use the name on the portal' },
  { level: 'warn', when: 'No GSTIN (unregistered party)', why: 'Reverse charge may apply; no ITC' },
  { level: 'stop', when: 'This party is already our vendor / customer · return the form', why: 'One account per party and side: nothing new to create' },
  { level: 'stop', when: 'The GSTIN is already in the party master (no account on this side yet)', why: 'Use that party instead of creating it a second time' },
  { level: 'warn', when: 'Another party has the same PAN', why: 'Can be one company in another state; if it is the same party, use it' },
  { level: 'stop', when: 'A required field is empty (name, PAN, address, category, credit days …)', why: 'The category drives the header, TDS and 43B(h)' },
  { level: 'stop', when: 'Category says Non-MSME but MSME = Yes (or the other way)', why: 'The MSME and non-MSME goods creditors go to different headers and clocks' },
  { level: 'warn', when: 'MSME = not known, or Udyam number not received', why: 'A reminder goes to the vendor; the 45-day clock may apply' },
  { level: 'stop', when: 'Udyam number in the wrong format', why: 'UDYAM-XX-00-0000000' },
  { level: 'stop', when: 'MSME vendor with 43B(h) and more than 45 credit days', why: 'MSMED Act / 43B(h): the expense is disallowed' },
  { level: 'stop', when: 'Bank account already used by another party · return the form', why: 'First sign of a diverted payment' },
  { level: 'stop', when: 'No penny-drop, or bank details changed after it', why: 'The Finance Controller approves only verified bank details' },
  { level: 'warn', when: 'Penny-drop name does not match', why: 'A call-back is then required' },
  { level: 'stop', when: 'Call-back number came from an email with the bank details', why: 'The classic fraud pattern: call the number on the paper form' },
  { level: 'stop', when: 'The maker approves their own request', why: 'Maker–checker (C-07)' },
];

const PARAMS: [string, string][] = [
  ['Usual vendor credit days', '45'],
  ['Usual customer credit days', '30'],
  ['MSMED Act maximum (43B(h))', '45 days'],
  ['Penny-drop pass mark', '80% name match'],
  ['Udyam reminder', 'every 7 days until answered'],
];

export function ChecksScreen() {
  return (
    <div className="ob-page">
      <PageHeader title="Checks and who approves" subtitle="What stops you from submitting, what only warns you, and which checker gets which part. Same rules the backend runs on PATCH and submit. '· return the form' means it goes back to Procurement / Sales with your comment." />
      <Section title="Checks">
        <ul className="check-list">
          {CHECKS.map((c) => (
            <li key={c.when} className={`check-row ${c.level === 'stop' ? 'check-row--stop' : 'check-row--reason'}`}>
              <StatusPill tone={c.level === 'stop' ? 'critical' : 'warning'}>{c.level === 'stop' ? 'Stop' : 'Warn'}</StatusPill>
              <span className="check-row__text">
                <span className="check-row__title">{c.when}</span>
                <span className="check-row__detail">{c.why}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>
      <div className="ob-two">
        <Section title="Who checks which part">
          {(['payable', 'receivable'] as const).map((side) => (
            <div key={side} className="ob-route">
              <p className="ob-route__side">{side === 'payable' ? 'Vendor' : 'Customer'}</p>
              <ul>
                {routesFor(side).map((r) => (
                  <li key={r.block}>
                    <strong>{r.label}</strong> → {ACTORS[r.checker].name} ({ACTORS[r.checker].role})
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="subtle small-note">The Accounts Manager never checks bank details: he approves payment proposals. Whether tax tagging must finish before the account goes live is open question Q8.</p>
        </Section>
        <Section title="Parameters">
          <ul className="ob-params">
            {PARAMS.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
