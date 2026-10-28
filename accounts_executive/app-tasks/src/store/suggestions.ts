// Dashboard suggestions: what would make the work run better, from the role's own figures.
// At most three; "Do it" opens the task or the rule form filled in (never acts by itself);
// "Not now" hides one until the figures behind it change.

import type { RuleDraft } from '../domain/myRules';
import type { ResponsibilityId } from '../accounts-executive/manifest';
import { inr } from '../domain/money';
import type { AppState } from './appStore';
import type { NavTarget } from './navigation';
import { routedVariances, workItems } from './selectors';

export interface Suggestion {
  id: string;
  kind: 'speed' | 'risk';
  resp: ResponsibilityId;
  title: string;
  effect: string;
  seen: string;
  basis: string;
  action: { label: string; target?: NavTarget; rule?: Partial<RuleDraft> };
}

export function suggestions(s: AppState): Suggestion[] {
  const out: Suggestion[] = [];
  const hasRule = (k: RuleDraft['kind']) => s.myRules.some((r) => r.kind === k && (r.status === 'Active' || r.status === 'PendingAM'));

  const returned = workItems(s).filter((w) => w.status === 'Returned');
  if (returned.length)
    out.push({
      id: 'returned',
      kind: 'speed',
      resp: 'R1',
      title: `Correct ${returned.length === 1 ? returned[0].id : `${returned.length} returned items`} first`,
      effect: 'Returned work holds up the close',
      seen: returned.map((w) => `${w.id}: "${w.checkerNote}"`).join(' · '),
      basis: returned.map((w) => w.id).join(','),
      action: { label: 'Open it', target: { tab: 'tasks', screen: returned[0].task, id: returned[0].id } },
    });

  const near = s.vendors.filter((v) => v.fyPurchases >= s.rules.tdsThreshold * 0.8 && v.fyPurchases < s.rules.tdsThreshold);
  if (near.length && !hasRule('tdsAlert'))
    out.push({
      id: 'tds',
      kind: 'risk',
      resp: 'R1',
      title: 'Alert me at 80% of the TDS threshold',
      effect: `${near.length} vendor${near.length > 1 ? 's' : ''} close to ₹50 lakh`,
      seen: near.map((v) => `${v.name}: ${inr(v.fyPurchases)}`).join(' · '),
      basis: near.map((v) => v.id).join(','),
      action: { label: 'Set the rule', rule: { kind: 'tdsAlert', value: 80, days: 180, reason: 'Vendors close to the TDS purchase threshold' } },
    });

  const ocrFixed = s.work.filter((w) => w.kind === 'pv' && w.values['ok:qty']).length;
  if (ocrFixed && !hasRule('ocrStricter'))
    out.push({
      id: 'ocr',
      kind: 'risk',
      resp: 'R1',
      title: 'Flag scanned fields below 90%',
      effect: `${ocrFixed} OCR field${ocrFixed > 1 ? 's' : ''} corrected so far`,
      seen: 'A misread quantity (18,000 for 10,000) was caught only because it fell below 80%.',
      basis: String(ocrFixed),
      action: { label: 'Set the rule', rule: { kind: 'ocrStricter', value: 90, days: 90, reason: 'OCR misread a quantity on a scanned invoice' } },
    });

  const variances = routedVariances(s);
  if (variances.length >= 2)
    out.push({
      id: 'variance',
      kind: 'speed',
      resp: 'R1',
      title: 'Read the Purchase Register for repeat variances',
      effect: `${variances.length} variances raised by Procurement, ${inr(variances.reduce((a, x) => a + (x.f.match?.total ?? 0), 0))}`,
      seen: variances.map((x) => `${x.w.id} ${inr(x.f.match?.total ?? 0)}`).join(' · '),
      basis: variances.map((x) => x.w.id).join(','),
      action: { label: 'Open the register', target: { tab: 'reports', screen: 'purchase', id: null } },
    });

  const hidden = (x: Suggestion) => s.suggestionLog.some((l) => l.id === x.id && l.basis === x.basis);
  return out.filter((x) => !hidden(x)).slice(0, 3);
}
