import { useEffect, useCallback, useRef } from 'react';

/**
 * SidePanel — Generic side panel from the right (menggantikan Modal dialog).
 * KECUALI LaporWidget tetap sebagai pop-up.
 *
 * Props:
 * - isOpen: boolean visibility
 * - onClose: callback tutup
 * - title: judul panel
 * - children: konten panel
 * - icon: optional emoji/icon header
 * - maxWidth: maksimal lebar panel (default 600)
 */
export default function Modal({ isOpen, onClose, title, children, icon, maxWidth }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const titleId = 'sp-title-' + Math.random().toString(36).slice(2, 8);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
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
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const panelMaxWidth = maxWidth || 600;

  return (
    <>
      {/* Overlay */}
      <div
        className="sp-overlay open"
        onClick={onClose}
        role="presentation"
        aria-hidden={false}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className="sp-panel open"
        style={{ maxWidth: panelMaxWidth }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="sp-header">
          {icon && <span className="sp-header-icon">{icon}</span>}
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
