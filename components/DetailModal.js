import { useEffect, useCallback, useRef } from 'react';

/**
 * SidePanel — Menggantikan DetailModal (pop-up centered → side panel dari kanan).
 * KECUALI komponen LaporWidget tetap sebagai pop-up.
 *
 * Props:
 * - title: judul panel
 * - open: boolean visibility
 * - onClose: callback tutup
 * - children: konten panel
 * - maxWidth: maksimal lebar panel (default 480)
 */
export default function DetailModal({ title, open, onClose, children, maxWidth = 480 }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab' && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
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

  const titleId = 'sp-panel-title';

  return (
    <>
      {/* Overlay */}
      <div
        className={`sp-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
        role="presentation"
        aria-hidden={!open}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={`sp-panel ${open ? 'open' : ''}`}
        style={{ width: maxWidth, maxWidth: '90vw' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
      >
        <div className="sp-header">
          <h2 id={titleId} className="sp-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="sp-close"
            onClick={onClose}
            aria-label="Tutup panel"
          >
            ✕
          </button>
        </div>
        <div className="sp-body">
          {children}
        </div>
      </div>
    </>
  );
}
