import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
}

function useAutoFocus(open: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const el = ref.current?.querySelector<HTMLElement>('textarea, input, [data-autofocus]');
    el?.focus();
  }, [open]);
  return ref;
}

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

/** Dialog: Title → supporting information → content → actions (ui reference §13). */
export function Dialog({ open, onClose, title, description, children, footer, width }: OverlayProps & { width?: number }) {
  useEscape(open, onClose);
  const ref = useAutoFocus(open);
  if (!open) return null;
  return createPortal(
    <div className="scrim" onMouseDown={onClose}>
      <div
        ref={ref}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={width ? { width } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="overlay__header">
          <div>
            <h2 className="overlay__title">{title}</h2>
            {description && <p className="overlay__desc">{description}</p>}
          </div>
          <button className="overlay__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        {children && <div className="overlay__body">{children}</div>}
        {footer && <footer className="overlay__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

/** Sheet: contextual side panel with the same close behaviour as dialogs (ui reference §14). */
export function Sheet({ open, onClose, title, description, children, footer, width }: OverlayProps & { width?: number }) {
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className="scrim scrim--sheet" onMouseDown={onClose}>
      <aside
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={width ? { width } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="overlay__header">
          <div>
            <h2 className="overlay__title">{title}</h2>
            {description && <p className="overlay__desc">{description}</p>}
          </div>
          <button className="overlay__close" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
        {footer && <footer className="overlay__footer">{footer}</footer>}
      </aside>
    </div>,
    document.body,
  );
}
