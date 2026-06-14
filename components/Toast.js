import { useEffect, useCallback } from 'react';

const TOAST_DURATION = 3000;

const typeStyles = {
  success: {
    borderLeft: '4px solid var(--forest-green)',
    background: 'var(--ok-bg)',
    color: 'var(--ok)',
  },
  error: {
    borderLeft: '4px solid var(--danger-red)',
    background: 'var(--bad-bg)',
    color: 'var(--bad)',
  },
};

const typeIcons = {
  success: '✅',
  error: '❌',
};

export default function Toast({ message = '', type = 'success', onClose }) {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      handleClose();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [message, handleClose]);

  if (!message) return null;

  const currentTypeStyles = typeStyles[type] || typeStyles.success;
  const icon = typeIcons[type] || typeIcons.success;

  return (
    <div
      className="toast-root"
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        animation: 'toastSlideIn .3s ease, toastFadeOut .3s ease 2.7s forwards',
        maxWidth: 400,
        width: '100%',
      }}
    >
      <div
        className={`toast-inner ${type === 'success' ? 'toast-success' : 'toast-error'}`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '14px 18px',
          borderRadius: 'var(--r-sm)',
          boxShadow: 'var(--sh-lg)',
          borderLeft: currentTypeStyles.borderLeft,
          background: currentTypeStyles.background,
          color: currentTypeStyles.color,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.5,
          fontFamily: 'var(--font)',
        }}
      >
        <span style={{ fontSize: 18, flex: 'none', lineHeight: 1 }}>
          {icon}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup notifikasi"
          style={{
            background: 'rgba(0,0,0,.06)',
            border: 'none',
            borderRadius: 8,
            width: 26,
            height: 26,
            cursor: 'pointer',
            fontSize: 14,
            color: 'inherit',
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            padding: 0,
            lineHeight: 1,
            opacity: 0.7,
            transition: 'opacity .15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastFadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
        @media (max-width: 560px) {
          .toast-root {
            right: 12px !important;
            left: 12px !important;
            bottom: 16px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}
