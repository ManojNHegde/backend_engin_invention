// Suggestions box: at most three, from the role's own figures. "Do it" opens the task or the rule form
// filled in (never acts by itself); "Not now" hides one until the figures behind it change.

import { useState } from 'react';
import { X } from 'lucide-react';
import type { RuleDraft } from '../../domain/myRules';
import { useApp } from '../../store/appStore';
import { suggestions, type Suggestion } from '../../store/suggestions';
import { Button, Tile } from '../../ui';
import { RuleDialog } from '../rules/RuleDialog';
import { RESPONSIBILITIES } from '../manifest';

export function Suggestions() {
  const s = useApp();
  const list = suggestions(s);
  const [why, setWhy] = useState<string | null>(null);
  const [rule, setRule] = useState<{ x: Suggestion; draft: Partial<RuleDraft> } | null>(null);

  const doIt = (x: Suggestion) => {
    if (x.action.rule) return setRule({ x, draft: x.action.rule });
    s.recordSuggestion(x.id, 'taken', x.basis);
    if (x.action.target) s.navigate(x.action.target);
  };

  return (
    <Tile span={4} flush title="Suggestions" subtitle="Based on your figures. Nothing happens until you act.">
      {list.length === 0 ? (
        <p className="sugg-none">Nothing to suggest right now.</p>
      ) : (
        <ul className="sugg-list">
          {list.map((x) => {
            const resp = RESPONSIBILITIES.find((r) => r.id === x.resp)!;
            const open = why === x.id;
            return (
              <li key={x.id} className={`sugg sugg--${x.kind}`}>
                <div className="sugg__top">
                  <p className="sugg__title">{x.title}</p>
                  <button className="sugg__close" title="Not now" aria-label={`Not now: ${x.title}`} onClick={() => s.recordSuggestion(x.id, 'notNow', x.basis)}>
                    <X size={14} aria-hidden />
                  </button>
                </div>
                <div className="sugg__meta">
                  <span className="sugg__effect">{x.effect}</span>
                  <span className="sugg__resp" title={resp.title}>
                    {resp.id}
                  </span>
                </div>
                {open && <p className="sugg__seen">{x.seen}</p>}
                <div className="sugg__actions">
                  <Button size="sm" variant="secondary" onClick={() => doIt(x)}>
                    {x.action.label}
                  </Button>
                  <button className="sugg__why" onClick={() => setWhy(open ? null : x.id)} aria-expanded={open}>
                    {open ? 'Hide why' : 'Why?'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <RuleDialog
        open={rule !== null}
        onClose={() => setRule(null)}
        preset={rule?.draft}
        onSet={(id) => {
          if (rule && id) s.recordSuggestion(rule.x.id, 'taken', rule.x.basis);
        }}
      />
    </Tile>
  );
}
