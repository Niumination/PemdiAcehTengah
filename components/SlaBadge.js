/**
 * SlaBadge — visual SLA compliance badge with progress bar.
 * Use on Layanan, OPD detail, and dashboard pages.
 *
 * Props:
 *   sla       — string, e.g. "92%" or number 92
 *   compact   — boolean, smaller for card grids
 *   showLabel — boolean, show "SLA" label (default true)
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 */

export default function SlaBadge({ sla, compact = false, showLabel = true, size = 'md' }) {
  // Normalise input
  const percent = typeof sla === 'string' ? parseInt(sla) : typeof sla === 'number' ? sla : 0;
  const pct = Math.min(Math.max(isNaN(percent) ? 0 : percent, 0), 100);

  // Colour thresholds
  const color = pct >= 90 ? '#00703c' : pct >= 80 ? '#e65100' : '#c62828';
  const bg = pct >= 90 ? '#e8f5e9' : pct >= 80 ? '#fff3e0' : '#ffebee';
  const barBg = pct >= 90 ? '#a5d6a7' : pct >= 80 ? '#ffcc80' : '#ef9a9a';

  const label = pct >= 90 ? 'Terpenuhi' : pct >= 80 ? 'Cukup' : 'Perlu Perbaikan';

  return (
    <div className={`slabadge slabadge-${size} ${compact ? 'slabadge-compact' : ''}`} title={`SLA ${pct}% — ${label}`}>
      <div className="slabadge-inner" style={{ background: bg, borderColor: color }}>
        {showLabel && <span className="slabadge-label">SLA</span>}
        <span className="slabadge-value" style={{ color }}>{pct}%</span>
        <span className="slabadge-label-sm" style={{ color }}>{label}</span>
        <div className="slabadge-bar">
          <div
            className="slabadge-fill"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
      <style jsx>{`
        .slabadge { display: inline-flex; }
        .slabadge-compact { min-width: 0; }
        .slabadge-inner {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          border-radius: 6px;
          border: 1px solid;
          flex-wrap: wrap;
          min-width: ${compact ? '4.5rem' : '6rem'};
        }
        .slabadge-sm .slabadge-inner { padding: 0.15rem 0.5rem; gap: 0.25rem; }
        .slabadge-lg .slabadge-inner { padding: 0.375rem 0.875rem; gap: 0.5rem; }

        .slabadge-label {
          font-size: ${size === 'sm' ? '0.625rem' : size === 'lg' ? '0.75rem' : '0.6875rem'};
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #505a5f;
          opacity: 0.8;
        }
        .slabadge-value {
          font-weight: 700;
          font-size: ${size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem'};
          line-height: 1;
        }
        .slabadge-label-sm {
          font-size: 0.625rem;
          font-weight: 500;
          opacity: 0.9;
          display: ${compact ? 'none' : 'inline'};
        }
        .slabadge-bar {
          width: 100%;
          height: 3px;
          background: #e0e0e0;
          border-radius: 2px;
          overflow: hidden;
          flex: 0 0 100%;
          margin-top: 0.125rem;
        }
        .slabadge-compact .slabadge-bar { display: none; }
        .slabadge-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
      `}</style>
    </div>
  );
}
