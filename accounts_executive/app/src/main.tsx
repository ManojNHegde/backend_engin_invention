import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './onboarding/App';
import { applyStoredTheme } from './shell/theme';
import './styles/tokens.css';
import './styles/global.css';
import './ui/ui.css';
import './ui/tile.css';

applyStoredTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
