// Accordion — native <details>/<summary> untuk progressive disclosure
// Aksesibel, keyboard-friendly, HTML native
import { useState } from 'react';

export default function Accordion({ title, children, open: defaultOpen = false, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      className={`accordion ${className}`}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary className="accordion-summary">
        <span>{title}</span>
        <span className={`accordion-arrow ${open ? 'open' : ''}`}>▾</span>
      </summary>
      <div className="accordion-content">
        {children}
      </div>
      <style jsx>{`
        .accordion {
          border: 1px solid var(--line);
          border-radius: 8px;
          margin: 0.5rem 0;
          overflow: hidden;
          background: var(--surface);
        }
        .accordion-summary {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9375rem;
          color: var(--primary);
          user-select: none;
          list-style: none;
        }
        .accordion-summary::-webkit-details-marker {
          display: none;
        }
        .accordion-summary:hover {
          background: var(--primary-50);
        }
        .accordion-arrow {
          transition: transform 0.2s ease;
          font-size: 0.75rem;
          color: var(--muted);
        }
        .accordion-arrow.open {
          transform: rotate(180deg);
        }
        .accordion-content {
          padding: 0 1rem 1rem;
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--ink-secondary);
        }
      `}</style>
    </details>
  );
}
