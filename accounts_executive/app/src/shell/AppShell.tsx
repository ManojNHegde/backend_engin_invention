// Position App Shell. One bar on top, the same for every role:
//   left   product name + position (text only: the only circle in the bar is the profile, on the right)
//   middle the main menu: supplied by the role (tabDefs)
//   right  utility: scenario clock (mock) · light/dark toggle · notifications · profile circle (profile, settings, change role)
// The bell is the same inbox as the role's home (the Action center on the Dashboard), so new work is seen
// from any page; "See all" goes to that home.
// The role only supplies the page for each menu item.

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Bell, CalendarClock, Moon, Repeat, Settings, Sun, UserRound, type LucideIcon } from 'lucide-react';
import { IconButton, Sheet, toneIcon, type Tone } from '../ui';
import { currentTheme, setTheme, type Theme } from './theme';
import './shell.css';

export type ShellTab = string;

export interface ShellTabDef {
  id: ShellTab;
  label: string;
  icon: LucideIcon;
  /** Page fills the content area edge to edge (no padding, no page scroll): a workspace. */
  bleed?: boolean;
}

export interface ShellNotification {
  id: string;
  tone: Exclude<Tone, 'normal'>;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ShellUser {
  name: string;
  role: string;
  place: string;
}

interface AppShellProps {
  title: string;
  tabDefs: ShellTabDef[];
  user: ShellUser;
  clockLabel?: string;
  activeTab: ShellTab;
  onTabChange: (tab: ShellTab) => void;
  tabBadges?: Partial<Record<ShellTab, number>>;
  notifications: ShellNotification[];
  onOpenNotification: (id: string) => void;
  onMarkAllRead: () => void;
  /** Opens the full inbox on the role's home page. */
  onSeeAllNotifications?: () => void;
  profile: ReactNode;
  tabs: Record<ShellTab, ReactNode>;
  children?: ReactNode; // global overlays (toasts, dev panels)
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Close a popover on an outside click or Escape. */
function useDismiss(open: boolean, ref: RefObject<HTMLElement>, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, ref, close]);
}

export function AppShell({
  title,
  tabDefs,
  user,
  clockLabel,
  activeTab,
  onTabChange,
  tabBadges,
  notifications,
  onOpenNotification,
  onMarkAllRead,
  onSeeAllNotifications,
  profile,
  tabs,
  children,
}: AppShellProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__product">Aikyat</span>
          <span className="topbar__position">{title}</span>
        </div>

        <nav className="topnav" aria-label="Main">
          {tabDefs.map((t) => {
            const Icon = t.icon;
            const badge = tabBadges?.[t.id];
            return (
              <button
                key={t.id}
                className={`topnav__item${activeTab === t.id ? ' is-active' : ''}`}
                aria-current={activeTab === t.id ? 'page' : undefined}
                onClick={() => onTabChange(t.id)}
              >
                <Icon size={18} aria-hidden />
                <span>{t.label}</span>
                {!!badge && <span className="topnav__badge">{badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className="topbar__right">
          {clockLabel && (
            <span className="topbar__clock" title="Scenario date and time">
              <CalendarClock size={16} aria-hidden />
              {clockLabel}
            </span>
          )}
          <ThemeToggle />
          <NotificationMenu notifications={notifications} unread={unread} onOpen={onOpenNotification} onMarkAllRead={onMarkAllRead} onSeeAll={onSeeAllNotifications} />
          <ProfileMenu user={user} onOpenProfile={() => setProfileOpen(true)} />
        </div>
      </header>

      {tabDefs.map((t) => (
        <main key={t.id} className={`shell__content${t.bleed ? ' shell__content--bleed' : ''}`} hidden={activeTab !== t.id}>
          {tabs[t.id]}
        </main>
      ))}

      <Sheet open={profileOpen} onClose={() => setProfileOpen(false)} title={user.name} description={`${user.role} · ${user.place}`}>
        {profile}
      </Sheet>
      {children}
    </div>
  );
}

/** Light / dark switch. Shows what you switch to: a moon in light mode, a sun in dark mode. */
function ThemeToggle() {
  const [theme, setState] = useState<Theme>(() => (typeof document === 'undefined' ? 'light' : currentTheme()));
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <IconButton
      icon={theme === 'dark' ? Sun : Moon}
      label={`Switch to ${next} mode`}
      onClick={() => {
        setTheme(next);
        setState(next);
      }}
    />
  );
}

function ProfileMenu({ user, onOpenProfile }: { user: ShellUser; onOpenProfile: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, ref, () => setOpen(false));
  const items: { label: string; icon: LucideIcon; onClick?: () => void; note?: string }[] = [
    { label: 'My profile', icon: UserRound, onClick: onOpenProfile },
    { label: 'Settings', icon: Settings, note: 'Not in this mock' },
    { label: 'Change role', icon: Repeat, note: 'Not in this mock' },
  ];
  return (
    <div className="menu" ref={ref}>
      <button className="avatar" onClick={() => setOpen((o) => !o)} aria-label="Profile menu" aria-expanded={open}>
        {initials(user.name)}
      </button>
      {open && (
        <div className="menu__panel" role="menu">
          <div className="menu__head">
            <span className="menu__name">{user.name}</span>
            <span className="menu__role">
              {user.role} · {user.place}
            </span>
          </div>
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <button
                key={i.label}
                role="menuitem"
                className="menu__item"
                disabled={!i.onClick}
                title={i.note}
                onClick={() => {
                  i.onClick?.();
                  setOpen(false);
                }}
              >
                <Icon size={16} aria-hidden />
                <span>{i.label}</span>
                {i.note && <span className="menu__note">{i.note}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NotificationMenu({
  notifications,
  unread,
  onOpen,
  onMarkAllRead,
  onSeeAll,
}: {
  notifications: ShellNotification[];
  unread: number;
  onOpen: (id: string) => void;
  onMarkAllRead: () => void;
  onSeeAll?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, ref, () => setOpen(false));

  return (
    <div className="notif" ref={ref}>
      <IconButton icon={Bell} label="Notifications" badge={unread} onClick={() => setOpen((o) => !o)} aria-expanded={open} />
      {open && (
        <div className="notif__panel" role="dialog" aria-label="Notifications">
          <div className="notif__head">
            <span className="notif__heading">Notifications</span>
            {unread > 0 && (
              <button className="notif__mark" onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="notif__list">
            {notifications.length === 0 && <p className="notif__empty">You're all caught up. Work sent to you by other roles appears here.</p>}
            {notifications.map((n) => {
              const Icon = toneIcon[n.tone];
              return (
                <button
                  key={n.id}
                  className={`notif__item${n.read ? '' : ' is-unread'}`}
                  onClick={() => {
                    onOpen(n.id);
                    setOpen(false);
                  }}
                >
                  <Icon size={16} className={`notif__icon tone-${n.tone}`} aria-hidden />
                  <span className="notif__text">
                    <span className="notif__title">{n.title}</span>
                    <span className="notif__body">{n.body}</span>
                    <span className="notif__time">{n.time}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {onSeeAll && (
            <button
              className="notif__all"
              onClick={() => {
                onSeeAll();
                setOpen(false);
              }}
            >
              See all in Action center
            </button>
          )}
        </div>
      )}
    </div>
  );
}
