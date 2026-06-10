export default function DataBadge({ label, value, target, warna, href, onClick, compact = false }) {
  const pct = target > 0 ? Math.min((value / target) * 100, 100) : 0;
  const gap = target - value;
  const isMet = value >= target;

  const content = (
    <div className={`badge-card ${compact ? 'badge-compact' : ''} ${onClick ? 'badge-clickable' : ''}`}>
      {label && <div className="badge-label">{label}</div>}
      <div className="badge-values">
        <span className="badge-value" style={{ color: warna || '#1d70b8' }}>
          {value.toFixed(1)}
        </span>
        {target && (
          <>
            <span className="badge-sep">/</span>
            <span className="badge-target">{target.toFixed(1)}</span>
          </>
        )}
      </div>
      {target > 0 && (
        <div className="badge-bar-track">
          <div
            className="badge-bar-fill"
            style={{
              width: `${pct}%`,
              background: warna || (isMet ? '#00703c' : '#d4351c'),
            }}
          />
        </div>
      )}
      {gap > 0 && !isMet && (
        <div className="badge-gap">Gap {(gap).toFixed(1)}</div>
      )}
      {isMet && <div className="badge-met">✅ Tercapai</div>}
      <style jsx>{`
        .badge-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 6px;
          padding: 0.75rem;
          text-align: center;
          transition: box-shadow 0.15s;
        }
        .badge-compact {
          padding: 0.5rem;
        }
        .badge-clickable {
          cursor: pointer;
        }
        .badge-clickable:hover {
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          border-color: #1d70b8;
        }
        .badge-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #505a5f;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .badge-values {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.15rem;
        }
        .badge-value {
          font-size: ${compact ? '1.125rem' : '1.375rem'};
          font-weight: 700;
          line-height: 1.2;
        }
        .badge-sep {
          color: #ccc;
          font-size: ${compact ? '0.875rem' : '1rem'};
        }
        .badge-target {
          font-size: ${compact ? '0.875rem' : '1rem'};
          color: #505a5f;
          font-weight: 400;
        }
        .badge-bar-track {
          margin-top: 0.5rem;
          height: 4px;
          background: #e5e5e5;
          border-radius: 2px;
          overflow: hidden;
        }
        .badge-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .badge-gap {
          margin-top: 0.25rem;
          font-size: 0.6875rem;
          color: #d4351c;
          font-weight: 500;
        }
        .badge-met {
          margin-top: 0.25rem;
          font-size: 0.6875rem;
          color: #00703c;
          font-weight: 500;
        }
      `}</style>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }
  return content;
}
