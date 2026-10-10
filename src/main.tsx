import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import { setRemoteContent } from './data/content-store';
import './index.css';

async function boot() {
  try {
    // Shared content (saved from the Studio). Falls back to the committed data if unavailable, e.g. local dev.
    const res = await fetch('/api/content', { cache: 'no-store' });
    if (res.ok) setRemoteContent(await res.json());
  } catch {
    /* offline or no API: use the committed data */
  }
  // Imported after the content is set, so the data modules read the latest values.
  const { default: App } = await import('./App');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </StrictMode>,
  );
}

void boot();
