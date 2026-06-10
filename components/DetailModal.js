import { useState, useEffect, useCallback } from 'react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 2rem 1rem;
          overflow-y: auto;
          animation: fadeIn 0.2s ease;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.25s ease;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--gray-200, #e5e5e5);
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
          border-radius: 8px 8px 0 0;
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          color: #0b0c0c;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #505a5f;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          line-height: 1;
        }
        .modal-close:hover {
          background: #f3f2f1;
          color: #0b0c0c;
        }
        .modal-body {
          padding: 1.5rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 640px) {
          .modal-overlay { padding: 0; align-items: flex-end; }
          .modal-content {
            border-radius: 12px 12px 0 0;
            max-height: 85vh;
          }
          .modal-header { border-radius: 12px 12px 0 0; }
        }
      `}</style>
    </div>
  );
}
