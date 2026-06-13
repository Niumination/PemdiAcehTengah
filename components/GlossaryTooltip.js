// GlossaryTooltip — membungkus istilah dengan tooltip dari glosarium.json
// Props: id (glosarium entry id), children (teks istilah)
// Keyboard-accessible, popover berisi 'singkat' dari glossary
import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import glosariumData from '@/data/glosarium.json';

// Pre-index glossary for O(1) lookup
const glosariumMap = {};
glosariumData.forEach((entry) => {
  glosariumMap[entry.id] = entry;
});

export default function GlossaryTooltip({ id, children }) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);
  const uid = useId();
  const tooltipId = `gt-${uid}-${id}`;

  const entry = glosariumMap[id];
  if (!entry) {
    // Fallback: render as plain text if term not found
    return <>{children}</>;
  }

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <span style={{ display: 'inline', position: 'relative' }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        aria-label={`Lihat penjelasan: ${entry.istilah}`}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'help',
          font: 'inherit',
          color: 'inherit',
          textDecoration: 'underline 1px dashed #b8860b',
          textUnderlineOffset: '3px',
          display: 'inline',
          position: 'relative',
        }}
      >
        {children}
        <span style={{ fontSize: '0.75rem', verticalAlign: 'super', lineHeight: 1, marginLeft: '1px' }}>❓</span>
      </button>

      {open && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            background: '#1a1a2e',
            color: 'white',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            maxWidth: '320px',
            minWidth: '220px',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.875rem' }}>
            {entry.istilah}
          </div>
          <p style={{ margin: '0 0 0.5rem', color: '#ccc' }}>
            {entry.singkat}
          </p>
          {entry.kepanjangan && (
            <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.375rem' }}>
              {entry.kepanjangan}
            </div>
          )}
          <Link
            href={`/glosarium#${entry.id}`}
            style={{ color: '#7eb8ff', fontSize: '0.75rem', textDecoration: 'underline' }}
            onClick={() => setOpen(false)}
          >
            Lihat di Glosarium →
          </Link>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1a1a2e',
            }}
          />
        </div>
      )}
    </span>
  );
}
