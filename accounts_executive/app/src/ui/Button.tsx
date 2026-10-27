import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: LucideIcon;
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'secondary', size = 'md', icon: Icon, block, className, children, type = 'button', ...rest }: ButtonProps) {
  const cls = ['btn', `btn--${variant}`, size === 'sm' && 'btn--sm', block && 'btn--block', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 14 : 16} aria-hidden />}
      <span>{children}</span>
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function IconButton({ icon: Icon, label, badge, className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} className={['icon-btn', className].filter(Boolean).join(' ')} aria-label={label} title={label} {...rest}>
      <Icon size={18} aria-hidden />
      {!!badge && <span className="icon-btn__badge">{badge > 99 ? '99+' : badge}</span>}
    </button>
  );
}
