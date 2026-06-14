import { useState, useEffect, useCallback } from 'react';

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export default function Toast({ id, type = 'info', title, message, duration = 5000, onClose }) {
  const [removing, setRemoving] = useState(false);

  const handleClose = useCallback(() => {
    setRemoving(true);
    setTimeout(() => onClose?.(id), 300);
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div className={`toast ${removing ? 'removing' : ''}`} role="alert">
      <div className={`toast-icon ${type}`}>{ICONS[type] || 'ℹ'}</div>
      <div className="toast-body">
        {title && <div className="toast-title">{title}</div>}
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Tutup notifikasi">
        ✕
      </button>
    </div>
  );
}

/**
 * ToastManager — render di Layout atau halaman
 * Usage:
 *   import { useToast } from '@/components/Toast';
 *   const { addToast, ToastContainer } = useToast();
 *   addToast({ type: 'success', title: 'Berhasil', message: 'Data tersimpan' });
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ToastContainer = useCallback(
    () =>
      toasts.length > 0 ? (
        <div className="toast-container">
          {toasts.map((t) => (
            <Toast key={t.id} {...t} onClose={removeToast} />
          ))}
        </div>
      ) : null,
    [toasts, removeToast]
  );

  return { addToast, removeToast, ToastContainer };
}
