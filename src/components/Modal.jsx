import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible dialog: Esc and backdrop click close it, focus moves in and is restored,
 * Tab is trapped, and the page behind doesn't scroll. Bottom sheet on phones, centred on desktop.
 */
const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusables = () => panel.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    (panel.querySelector('[data-autofocus]') || focusables()[1] || focusables()[0])?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  const width = size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-md';

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-side/60 backdrop-blur-[2px] sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`max-h-[92dvh] w-full animate-sheet-up overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-pop sm:rounded-3xl sm:p-6 ${width}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id={titleId} className="text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="icon-btn -mr-2" aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
