import { useState, useEffect, useCallback, useRef } from 'react';

/* ── Focus trap helper ── */
function getFocusableElements(container) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(container.querySelectorAll(selectors.join(',')));
}

function trapFocus(container, event) {
  const focusable = getFocusableElements(container);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

/* ── Styles ── */
const overlayBase = {
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(3px)',
  WebkitBackdropFilter: 'blur(3px)',
  padding: '16px',
};

const modalBase = {
  position: 'relative',
  background: 'var(--surface-raise, var(--surface))',
  borderRadius: 'var(--radius-lg, 12px)',
  boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: 600,
  maxHeight: '88vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--line) transparent',
};

const headerBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '18px 22px 14px',
  borderBottom: '1px solid var(--line)',
  flexShrink: 0,
};

const titleBase = {
  flex: 1,
  fontSize: '1.1rem',
  fontWeight: 700,
  color: 'var(--ink)',
  margin: 0,
  lineHeight: 1.3,
};

const closeBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  color: 'var(--ink)',
  opacity: 0.5,
  padding: '4px 8px',
  borderRadius: 'var(--radius-sm, 4px)',
  transition: 'opacity 0.15s ease, background 0.15s ease',
  lineHeight: 1,
  flexShrink: 0,
};

const iconStyle = {
  fontSize: '1.3rem',
  flexShrink: 0,
};

const bodyStyle = {
  padding: '18px 22px 22px',
  color: 'var(--ink-secondary, var(--ink))',
  fontSize: '0.9rem',
  lineHeight: 1.65,
  overflowY: 'auto',
};

/* ── Modal Component ── */
export default function Modal({ isOpen, onClose, title, children, icon, maxWidth }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  /* Track reduced-motion preference */
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Open / close lifecycle ── */
  useEffect(() => {
    if (isOpen) {
      /* Store previously focused element */
      previousActiveRef.current = document.activeElement;
      /* Lock body scroll */
      document.body.style.overflow = 'hidden';
      /* Trigger mount animation */
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      /* Unlock body scroll */
      document.body.style.overflow = '';
      /* Play exit animation */
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      /* Restore focus */
      if (previousActiveRef.current && typeof previousActiveRef.current.focus === 'function') {
        previousActiveRef.current.focus();
      }
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ── Focus trap ── */
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    /* Auto-focus first focusable inside modal */
    const timer = setTimeout(() => {
      const focusable = getFocusableElements(modalRef.current);
      if (focusable.length) {
        focusable[0].focus();
      } else {
        modalRef.current.focus();
      }
    }, 50);

    const handler = (e) => trapFocus(modalRef.current, e);
    document.addEventListener('keydown', handler);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handler);
    };
  }, [isOpen]);

  /* ── Escape key ── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    },
    [onClose],
  );

  /* ── Overlay click ── */
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === overlayRef.current) {
        onClose?.();
      }
    },
    [onClose],
  );

  /* ── Render nothing if not visible ── */
  if (!visible) return null;

  const transitionTime = reducedMotion ? 0 : 200;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      onKeyDown={handleKeyDown}
      onClick={handleOverlayClick}
      style={{
        ...overlayBase,
        transition: `opacity ${transitionTime}ms ease`,
        opacity: animating ? 1 : 0,
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{
          ...modalBase,
          maxWidth: maxWidth || 600,
          transition: `opacity ${transitionTime}ms ease, transform ${transitionTime}ms ease`,
          opacity: animating ? 1 : 0,
          transform: animating ? 'scale(1)' : 'scale(0.92)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={headerBase}>
          {icon && <span style={iconStyle}>{icon}</span>}
          <h2 style={titleBase}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={closeBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.background = 'none';
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
}
