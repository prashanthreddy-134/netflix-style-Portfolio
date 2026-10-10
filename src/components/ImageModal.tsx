import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useScrollLock } from '../hooks/smoothScroll';
import { EASE } from './fx';

/** Opens an image in a new tab. Data URLs go through a blob URL, since browsers block top-level data: links. */
function openInNewTab(src: string) {
  if (!src.startsWith('data:')) {
    window.open(src, '_blank', 'noopener');
    return;
  }
  const [meta, b64] = src.split(',');
  const mime = meta.match(/data:(.*?);/)?.[1] ?? 'image/jpeg';
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  window.open(URL.createObjectURL(new Blob([bytes], { type: mime })), '_blank', 'noopener');
}

/** Full-screen certificate viewer, laid out like the resume viewer. */
export default function ImageModal({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[140] flex flex-col bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="gutter flex h-16 shrink-0 items-center justify-between gap-3 pt-[env(safe-area-inset-top)]">
        <p className="truncate font-display text-2xl tracking-wide text-bone">{title}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => openInNewTab(src)} className="rounded-md border border-white/20 px-4 py-2 text-xs font-semibold text-bone hover:bg-white/10">
            Open ↗
          </button>
          <a href={src} download={`${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'certificate'}.jpg`} className="rounded-md bg-bone px-4 py-2 text-xs font-bold text-ink">
            ⤓ Download
          </a>
          <button type="button" onClick={onClose} aria-label="Close certificate" data-cursor="close" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-bone hover:bg-white/20">
            ✕
          </button>
        </div>
      </div>
      <motion.div
        className="gutter flex min-h-0 flex-1 items-center justify-center pb-6"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={onClose}
      >
        <img
          src={src}
          alt={title}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full rounded-xl bg-white object-contain shadow-2xl"
        />
      </motion.div>
    </motion.div>,
    document.body,
  );
}
