/**
 * ProgressBarVisual — Progress bar capaian Pemdi per aspek
 * Props:
 *   label     — string, nama aspek
 *   value     — number 0–100, persentase
 *   color     — string, CSS variable nama atau value warna (default: '--lake-cyan')
 *   showLabel — boolean, tampilkan label (default: true)
 *   height    — number, tinggi bar dalam px (default: 10)
 *   animated  — boolean, animasi width (default: true)
 */
import { useState, useEffect, useRef } from 'react';

export default function ProgressBarVisual({
  label = '',
  value = 0,
  color = '--lake-cyan',
  showLabel = true,
  height = 10,
  animated = true,
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const pct = Math.min(Math.max(value, 0), 100);

  // Resolve CSS variable if starts with '--'
  const resolvedColor = color.startsWith('--')
    ? `var(${color})`
    : color;

  // Trigger animation on mount
  useEffect(() => {
    if (animated) {
      // Small RAF delay for transition to work
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWidth(pct);
        });
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setWidth(pct);
    }
  }, [pct, animated]);

  return (
    <div className="progress-root" ref={ref} style={{ marginBottom: '1rem' }}>
      {/* Label + value */}
      {showLabel && (
        <div
          className="progress-label"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--ink-secondary)',
            marginBottom: '0.375rem',
          }}
        >
          <span>{label}</span>
          <span style={{ fontWeight: 700, color: resolvedColor }}>{pct}%</span>
        </div>
      )}

      {/* Bar background */}
      <div
        className="progress-bar"
        style={{
          width: '100%',
          height,
          borderRadius: 99,
          background: 'var(--bg-2)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Fill */}
        <div
          className="progress-fill"
          style={{
            width: `${width}%`,
            height: '100%',
            borderRadius: 99,
            background: resolvedColor,
            transition: animated ? 'width 1s ease' : 'none',
            position: 'relative',
          }}
        >
          {/* Glint effect */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 20,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
              transform: 'skewX(-20deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
