// The Accounts Executive position app: fills the generic shell with this role's pages.

import { fmtDateTime } from '../domain/dates';
import { AppShell, type ShellTab } from '../shell/AppShell';
import { ME } from '../store/actors';
import { useApp } from '../store/appStore';
import { rulesBadge, tasksBadge } from '../store/selectors';
import { Toaster } from '../ui';
import { ScenarioPanel } from '../mock/ScenarioPanel';
import { POSITION } from './manifest';
import { Profile } from './Profile';
import { CnCTab } from './tabs/CnCTab';
import { DashboardTab } from './tabs/DashboardTab';
import { ReportsTab } from './tabs/ReportsTab';
import { RulesTab } from './tabs/RulesTab';
import { TasksTab } from './tabs/TasksTab';
import './accounts-executive.css';

export function AccountsExecutiveApp() {
  const s = useApp();
  return (
    <AppShell
      title={POSITION.title}
      user={{ name: ME.name, role: ME.role, place: ME.place }}
      clockLabel={fmtDateTime(s.now)}
      activeTab={s.nav.tab}
      onTabChange={(tab: ShellTab) => s.navigate({ tab })}
      tabBadges={{ tasks: tasksBadge(s), rules: rulesBadge(s) }}
      notifications={s.notifications.filter((n) => !n.dismissed).map((n) => ({ id: n.id, tone: n.tone, title: n.title, body: n.body, time: fmtDateTime(n.at), read: n.read }))}
      onOpenNotification={s.openNotification}
      onMarkAllRead={s.markAllRead}
      onSeeAllNotifications={() => s.navigate({ tab: 'dashboard' })}
      profile={<Profile />}
      tabs={{ dashboard: <DashboardTab />, tasks: <TasksTab />, reports: <ReportsTab />, rules: <RulesTab />, cnc: <CnCTab /> }}
    >
      <Toaster toasts={s.toasts} onDismiss={s.dismissToast} />
      <ScenarioPanel />
    </AppShell>
  );
}
