// Light / dark theme. Until the user picks one, the app follows the system setting.
// The choice is a per-browser convenience (localStorage), applied as <html data-theme="light|dark">.

export type Theme = 'light' | 'dark';

const KEY = 'aikyat-theme';

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function system(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** The theme on screen now: the user's choice, else the system's. */
export function currentTheme(): Theme {
  return stored() ?? system();
}

/** Apply the stored choice at start-up (before the first render, so there is no flash). */
export function applyStoredTheme() {
  const t = stored();
  if (t) document.documentElement.dataset.theme = t;
}

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
}
