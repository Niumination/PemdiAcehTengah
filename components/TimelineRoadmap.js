/**
 * TimelineRoadmap — Timeline roadmap Pemdi 2026→2028
 * Props:
 *   milestones — array of { tahun, title, desc, status }
 *     status: 'selesai' | 'berjalan' | 'direncanakan'
 *
 * Layout vertikal dengan dot, garis penghubung, konten di sisi.
 * Status indicator: ✅ tercapai, 🔄 berjalan, ⏳ direncanakan
 */
export default function TimelineRoadmap({ milestones = [] }) {
  if (!milestones.length) {
    return (
      <div
        className="timeline-root"
        style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--muted)',
          background: 'var(--surface)',
          borderRadius: 'var(--r)',
          border: '1px solid var(--line)',
        }}
      >
        <p style={{ fontSize: '0.9375rem' }}>Belum ada milestone tercatat</p>
      </div>
    );
  }

  // Urutkan berdasarkan tahun
  const sorted = [...milestones].sort((a, b) => (a.tahun || 0) - (b.tahun || 0));

  return (
    <div
      className="timeline-root"
      style={{
        position: 'relative',
        padding: '0.5rem 0 0.5rem 0',
        maxWidth: 720,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: 30,
          top: 28,
          bottom: 28,
          width: 3,
          background: 'var(--line)',
          borderRadius: 2,
          zIndex: 0,
        }}
      />

      {sorted.map((item, i) => {
        const { tahun = '', title = '', desc = '', status = 'direncanakan' } = item;
        const isLast = i === sorted.length - 1;

        // Status config
        const statusConfig = {
          selesai: {
            dotBg: 'var(--ok-bg)',
            dotColor: 'var(--forest-green)',
            dotBorder: 'var(--forest-green)',
            dotSymbol: '✓',
            label: '✅ Tercapai',
            labelColor: 'var(--forest-green)',
          },
          berjalan: {
            dotBg: '#e0f7f6',
            dotColor: 'var(--lake-cyan)',
            dotBorder: 'var(--lake-cyan)',
            dotSymbol: '●',
            label: '🔄 Berjalan',
            labelColor: 'var(--lake-cyan)',
          },
          direncanakan: {
            dotBg: 'var(--surface)',
            dotColor: 'var(--muted)',
            dotBorder: 'var(--line)',
            dotSymbol: '○',
            label: '⏳ Direncanakan',
            labelColor: 'var(--muted)',
          },
        };

        const cfg = statusConfig[status] || statusConfig.direncanakan;

        return (
          <div
            key={i}
            className="timeline-item"
            style={{
              display: 'flex',
              gap: '1.25rem',
              paddingBottom: isLast ? 0 : '1.75rem',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Dot */}
            <div
              className={'tl-dot tl-dot-' + (status === 'selesai' ? 'complete' : status === 'berjalan' ? 'active' : 'planned')}
              style={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 800,
                background: cfg.dotBg,
                color: cfg.dotColor,
                border: `2.5px solid ${cfg.dotColor}`,
                flexShrink: 0,
                position: 'relative',
                boxShadow:
                  status === 'berjalan'
                    ? `0 0 0 5px rgba(14, 165, 164, 0.12)`
                    : 'none',
                transition: 'all 0.2s',
              }}
            >
              {cfg.dotSymbol}
            </div>

            {/* Content */}
            <div
              className="tl-content"
              style={{
                flex: 1,
                paddingTop: '0.25rem',
                minWidth: 0,
              }}
            >
              {/* Year + Status label */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.25rem',
                }}
              >
                {tahun && (
                  <span
                    className="tl-year"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      background: 'var(--primary-50)',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 4,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {tahun}
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: cfg.labelColor,
                  }}
                >
                  {cfg.label}
                </span>
              </div>

              {/* Title */}
              <h4
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  margin: '0 0 0.25rem 0',
                  lineHeight: 1.3,
                }}
              >
                {title}
              </h4>

              {/* Description */}
              {desc && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.55,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
