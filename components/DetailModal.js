import { useEffect, useCallback, useRef } from 'react';

export default function DetailModal({ title, open, onClose, children, maxWidth = 640 }) {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const titleId = 'pm-modal-title';

  return (
    <div className="pm-modal-overlay" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="pm-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="pm-modal-header">
          <h2 id={titleId} className="pm-modal-title">{title}</h2>
          <button ref={closeRef} type="button" className="pm-modal-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>
        <div className="pm-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
