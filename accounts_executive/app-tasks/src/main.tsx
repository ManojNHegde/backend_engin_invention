import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AccountsExecutiveApp } from './accounts-executive/AccountsExecutiveApp';
import { applyStoredTheme } from './shell/theme';
import type { ShellTab } from './shell/AppShell';
import { useApp } from './store/appStore';
import './styles/tokens.css';
import './styles/global.css';
import './ui/ui.css';
import './ui/tile.css';

applyStoredTheme();

// ?tab=tasks (or dashboard, reports, rules, cnc) opens that tab directly.
const tab = new URLSearchParams(window.location.search).get('tab');
if (tab) useApp.getState().navigate({ tab: tab as ShellTab });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccountsExecutiveApp />
  </StrictMode>,
);
