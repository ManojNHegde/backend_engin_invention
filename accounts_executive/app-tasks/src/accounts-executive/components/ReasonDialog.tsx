import { useEffect, useState, type ReactNode } from 'react';
import { Button, Dialog, Field, ReasonChips, TextArea, type ButtonVariant } from '../../ui';

/** Decision dialog with a reason field. Reasons are mandatory unless `optional` is set. */
export function ReasonDialog({
  open,
  onClose,
  title,
  description,
  label = 'Reason',
  initial = '',
  quickPicks,
  optional,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  children,
  after,
  width,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  label?: string;
  initial?: string;
  quickPicks?: string[];
  optional?: boolean;
  confirmLabel: string;
  confirmVariant?: ButtonVariant;
  onConfirm: (reason: string) => void;
  children?: ReactNode;
  /** Shown below the reason, e.g. the Notify section. */
  after?: ReactNode;
  width?: number;
}) {
  const [reason, setReason] = useState(initial);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason(initial);
      setTouched(false);
    }
  }, [open, initial]);

  const missing = !optional && !reason.trim();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      width={width}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              setTouched(true);
              if (missing) return;
              onConfirm(reason.trim());
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      <Field label={label} required={!optional} error={touched && missing ? 'A reason is required.' : null} hint={optional ? 'Optional' : 'Recorded on the Approval Log.'}>
        <TextArea value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      {quickPicks && <ReasonChips options={quickPicks} onPick={(v) => setReason(v)} />}
      {after}
    </Dialog>
  );
}
