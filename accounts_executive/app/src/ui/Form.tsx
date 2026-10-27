import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`field${error ? ' field--error' : ''}`}>
      <span className="field__label">
        {label}
        {required && <span className="field__req"> *</span>}
      </span>
      {children}
      {error ? <span className="field__error">{error}</span> : hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={['input', 'input--area', props.className].filter(Boolean).join(' ')} />;
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={['input', props.className].filter(Boolean).join(' ')} />;
}

/** Rupee amount input (whole rupees). */
export function MoneyInput({ value, onChange, ...rest }: { value: number | ''; onChange: (v: number | '') => void } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <span className="input-affix">
      <span className="input-affix__prefix">₹</span>
      <input
        {...rest}
        inputMode="numeric"
        className="input input--affixed num"
        value={value}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9]/g, '');
          onChange(raw === '' ? '' : Number(raw));
        }}
      />
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={o.value === value}
          className={`segmented__item${o.value === value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Quick-pick reason chips that fill a reason field. */
export function ReasonChips({ options, onPick }: { options: string[]; onPick: (v: string) => void }) {
  return (
    <div className="reason-chips">
      {options.map((o) => (
        <button key={o} type="button" className="reason-chip" onClick={() => onPick(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

/** On/off switch with its label. */
export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (on: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={`switch${checked ? ' is-on' : ''}`} disabled={disabled} onClick={() => onChange(!checked)}>
      <span className="switch__track" aria-hidden>
        <span className="switch__thumb" />
      </span>
      <span className="switch__label">{label}</span>
    </button>
  );
}
