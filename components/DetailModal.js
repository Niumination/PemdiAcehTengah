import { useEffect, useCallback } from 'react';

export default function DetailModal({ title, open, onClose, children, maxWidth = 640 }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="pm-modal-overlay" onClick={onClose}>
      <div
        className="pm-modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-modal-header">
          <h2 className="pm-modal-title">{title}</h2>
          <button className="pm-modal-close" onClick={onClose} aria-label="Tutup">
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
