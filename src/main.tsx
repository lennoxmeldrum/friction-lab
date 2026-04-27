import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// --- Theme bootstrap ---
// When embedded in the ExplAIn Sims wrapper, the parent page tells us which
// theme to use via a `?theme=dark|light` URL param (initial paint) and via
// `postMessage({ type: 'theme', theme })` events (runtime toggle).
function applyTheme(theme: string | null | undefined) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
}

const initialTheme = new URLSearchParams(window.location.search).get('theme');
applyTheme(initialTheme);

window.addEventListener('message', (event) => {
  const data = event.data;
  if (data && typeof data === 'object' && data.type === 'theme') {
    applyTheme(data.theme);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
