import { useEffect, type ReactNode } from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';

export type Tone = 'normal' | 'success' | 'warning' | 'critical' | 'info';

export const toneIcon: Record<Tone, LucideIcon> = {
  normal: Info,
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  critical: CircleX,
};

export function Badge({ count, tone = 'critical' }: { count: number; tone?: Tone }) {
  if (!count) return null;
  return <span className={`badge badge--${tone}`}>{count > 99 ? '99+' : count}</span>;
}

export function StatusPill({ tone = 'normal', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}

export function Chip({ children, tone }: { children: ReactNode; tone?: Tone }) {
  return <span className={`chip${tone ? ` chip--${tone}` : ''}`}>{children}</span>;
}

export function EmptyState({ icon: Icon = Info, title, text, action }: { icon?: LucideIcon; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty__icon">
        <Icon size={22} aria-hidden />
      </span>
      <p className="empty__title">{title}</p>
      {text && <p className="empty__text">{text}</p>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  );
}

/** Inline callout for warnings and hints inside a screen. */
export function Callout({ tone = 'info', title, children }: { tone?: Tone; title?: string; children?: ReactNode }) {
  const Icon = toneIcon[tone];
  return (
    <div className={`callout callout--${tone}`}>
      <Icon size={16} aria-hidden className="callout__icon" />
      <div>
        {title && <p className="callout__title">{title}</p>}
        {children && <div className="callout__body">{children}</div>}
      </div>
    </div>
  );
}

export interface ToastItem {
  id: number;
  tone: Exclude<Tone, 'normal'>;
  title: string;
  body?: string;
}

function ToastView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);
  const Icon = toneIcon[toast.tone];
  return (
    <div className={`toast toast--${toast.tone}`} role="status">
      <Icon size={18} aria-hidden className="toast__icon" />
      <div className="toast__text">
        <p className="toast__title">{toast.title}</p>
        {toast.body && <p className="toast__body">{toast.body}</p>}
      </div>
      <button className="toast__close" aria-label="Dismiss" onClick={() => onDismiss(toast.id)}>
        <X size={14} />
      </button>
    </div>
  );
}

export function Toaster({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <ToastView key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
