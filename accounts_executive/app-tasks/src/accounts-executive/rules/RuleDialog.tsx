// Set a rule: pick the kind, the value, how long and why. Before sending, it says who sets it:
// ✅ applies now · 🟠 goes to the Accounts Manager · ❌ refused (and logged).

import { useEffect, useState } from 'react';
import { RULE_TYPES, ruleType, type RuleDraft } from '../../domain/myRules';
import type { MyRuleKind } from '../../domain/types';
import { useApp } from '../../store/appStore';
import { Button, Callout, Dialog, Field, TextArea, TextInput } from '../../ui';

const LEVEL: Record<'self' | 'am' | 'never', { tone: 'success' | 'warning' | 'critical'; title: string; button: string }> = {
  self: { tone: 'success', title: '✅ You can set this yourself: it applies now', button: 'Set rule' },
  am: { tone: 'warning', title: '🟠 Needs the Accounts Manager: it goes to Rajan', button: 'Send to Rajan' },
  never: { tone: 'critical', title: '❌ Not allowed: trying is refused and logged', button: 'Try anyway' },
};

export function RuleDialog({ open, onClose, preset, onSet }: { open: boolean; onClose: () => void; preset?: Partial<RuleDraft>; onSet?: (id: string | null) => void }) {
  const s = useApp();
  const [kind, setKind] = useState<MyRuleKind>('remind');
  const [value, setValue] = useState<string>('');
  const [vendorId, setVendorId] = useState('');
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    const k = preset?.kind ?? 'remind';
    setKind(k);
    setValue(String(preset?.value ?? ruleType(k).defaultValue(s.rules)));
    setVendorId(preset?.vendorId ?? '');
    setDays(preset?.days ?? (k === 'quietDuplicate' ? 30 : k === 'remind' ? 7 : 90));
    setReason(preset?.reason ?? '');
    setTouched(false);
  }, [open, preset, s.rules]);

  const type = ruleType(kind);
  const draft: RuleDraft = { kind, value: ['ocrStricter', 'tdsAlert', 'msmeWarn', 'quietDuplicate'].includes(kind) ? Number(value) : value, vendorId: vendorId || undefined, days, reason };
  if (kind === 'quietDuplicate') draft.days = Number(value) || days;
  const level = type.check(draft, s.rules);
  const missing = !reason.trim() || (kind === 'quietDuplicate' && !vendorId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      width={620}
      title="Set a rule for my own work"
      description="Quieter or stricter, never skipping a check or the checker."
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={level.level === 'never' ? 'destructive' : 'primary'}
            onClick={() => {
              setTouched(true);
              if (missing) return;
              const id = s.setMyRule(draft);
              onSet?.(id);
              onClose();
            }}
          >
            {LEVEL[level.level].button}
          </Button>
        </>
      }
    >
      <fieldset className="rule-types">
        <legend className="field__label">Kind of rule</legend>
        {RULE_TYPES.map((t) => (
          <label key={t.kind} className={`rule-type${t.kind === kind ? ' is-on' : ''}`}>
            <input
              type="radio"
              name="rule-kind"
              checked={t.kind === kind}
              onChange={() => {
                setKind(t.kind);
                setValue(String(t.defaultValue(s.rules)));
              }}
            />
            <span className="rule-type__text">
              <strong>{t.title}</strong>
              <span className="small-note muted">{t.task === 'Any' ? 'Any task' : t.task}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <p className="rule-what small-note muted">{type.what}</p>
      <div className="rule-fields">
        {kind === 'defaultBasis' ? (
          <Field label={type.valueLabel}>
            <select className="input" value={value} onChange={(e) => setValue(e.target.value)}>
              {['Quantity', 'Weight', 'Value'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label={type.valueLabel}>
            <TextInput type={kind === 'remind' ? 'text' : 'number'} value={value} onChange={(e) => setValue(e.target.value)} />
          </Field>
        )}
        {kind === 'quietDuplicate' && (
          <Field label="Vendor" required error={touched && !vendorId ? 'Pick a vendor.' : null}>
            <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
              <option value="">Choose…</option>
              {s.vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </Field>
        )}
        {kind !== 'quietDuplicate' && (
          <Field label={kind === 'remind' ? 'Remind me in (days)' : 'For how many days'}>
            <TextInput type="number" value={days} onChange={(e) => setDays(Number(e.target.value) || 0)} />
          </Field>
        )}
      </div>
      <Field label="Why" required error={touched && !reason.trim() ? 'A reason is required.' : null} hint="Recorded on the Approval Log; the Accounts Manager reads it if approval is needed.">
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <Callout tone={LEVEL[level.level].tone} title={LEVEL[level.level].title}>
        {level.why}
      </Callout>
    </Dialog>
  );
}
