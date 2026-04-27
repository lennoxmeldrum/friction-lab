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

// --- Auto-resize: tell the parent how tall our content is so the iframe can
// match its content height. This lets the outer page do a single, continuous
// scroll through banner → app → footer instead of having a nested scrollbar.
function postResize() {
  if (window.parent === window) return; // not embedded
  const h = Math.ceil(document.documentElement.scrollHeight);
  window.parent.postMessage({ type: 'resize', height: h }, '*');
}

if (window.parent !== window) {
  // Hide internal scroll while embedded — the parent handles all scrolling.
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  const ro = new ResizeObserver(() => postResize());
  ro.observe(document.documentElement);
  ro.observe(document.body);
  window.addEventListener('load', postResize);
  // Fallback: a few delayed posts in case fonts or images load after
  // ResizeObserver settles.
  setTimeout(postResize, 200);
  setTimeout(postResize, 1000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
