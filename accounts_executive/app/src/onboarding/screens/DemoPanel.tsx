// Mock-only controls (dashed violet: not part of the product). Nothing arrives from Procurement or Sales in the
// system (decided 27-Oct): the paper forms are picked in "New from a paper form". This panel only lists things
// to try and resets the demo. Checker decisions are played from the request itself ("Rajan approves" buttons).

import { useState } from 'react';
import { FlaskConical, RotateCcw } from 'lucide-react';
import { Button, Sheet } from '../../ui';
import { useOnboarding } from '../store';

export function DemoPanel() {
  const s = useOnboarding();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="ob-launcher" onClick={() => setOpen(true)}>
        <FlaskConical size={16} aria-hidden />
        <span>
          <span className="ob-launcher__tag">DEMO</span>
          <span className="ob-launcher__text">Things to try</span>
        </span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Demo" description="Mock only. Stands in for the paper forms, the GST portal, the bank and the checkers.">
        <div className="sheet-stack">
          <section>
            <h3 className="section__title">1 · Paper forms on your desk</h3>
            <p className="subtle small-note">Onboarding → "New from a paper form" → pick one under DEMO. The paper shows beside the form; "Type it all in for me" copies it.</p>
            <ul className="ob-tips">
              <li>
                <strong>Coastal Bakes</strong> (customer, Arun): same PAN as an old party P-0088, so a warning with "Use P-0088".
              </li>
              <li>
                <strong>Sri Lakshmi (Mysuru)</strong> (customer, Arun): its GSTIN is already our customer C-01. Stop: return the form.
              </li>
              <li>
                <strong>Sri Rama Packaging</strong> (vendor, Kiran): bank account 7777…, so the penny-drop name does not match and a call-back is asked for.
              </li>
            </ul>
          </section>
          <section>
            <h3 className="section__title">2 · Things to try on Malnad Cocoa (REQ-0101)</h3>
            <ul className="ob-tips">
              <li>Change one letter of the PAN: "GSTIN does not belong to this PAN".</li>
              <li>Press "Check the GSTIN on the GST portal". A GSTIN with ZZ as letters 3–4 comes back cancelled.</li>
              <li>
                Category <em>Creditors for Goods – Non-MSME</em> while MSME = Yes: a Stop.
              </li>
              <li>Credit days 60 for an MSME vendor: Stop (43B(h)).</li>
              <li>
                Bank account <code>50100012345678</code>: already Vendor A's, a Stop.
              </li>
              <li>Submit, then play Rajan / Usha / Venkat. Return one part to see it come back. On approval a new party appears in the master.</li>
              <li>Watch the Backend tab after each step.</li>
            </ul>
          </section>
          <section>
            <h3 className="section__title">3 · Start again</h3>
            <Button
              icon={RotateCcw}
              onClick={() => {
                s.reset();
                setOpen(false);
              }}
            >
              Reset the demo
            </Button>
          </section>
        </div>
      </Sheet>
    </>
  );
}
