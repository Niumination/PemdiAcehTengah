export default function TrackerStatus({ status, dibuat, diperbarui, compact }) {
  const steps = [
    { key: 'baru', label: 'Diterima', icon: '📥', desc: 'Laporan tercatat' },
    { key: 'diproses', label: 'Diproses', icon: '🔧', desc: 'Sedang ditindaklanjuti' },
    { key: 'selesai', label: 'Selesai', icon: '✅', desc: 'Telah ditangani' },
  ];

  const statusConfig = {
    baru: { color: '#2563eb', bg: 'var(--info-bg)', dot: '#2563eb', label: 'Baru', icon: '📥' },
    diproses: { color: '#d97706', bg: 'var(--warn-bg)', dot: '#d97706', label: 'Diproses', icon: '🔧' },
    selesai: { color: '#059669', bg: 'var(--ok-bg)', dot: '#059669', label: 'Selesai', icon: '✅' },
    ditolak: { color: '#dc2626', bg: 'var(--bad-bg)', dot: '#dc2626', label: 'Ditolak', icon: '❌' },
  };

  const cfg = statusConfig[status] || statusConfig.baru;
  const currentIdx = steps.findIndex(s => s.key === status);
  const isDitolak = status === 'ditolak';

  if (compact) {
    return (
      <span className="tracker-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}20` }}>
        {cfg.icon} {cfg.label}
        <style jsx>{`
          .tracker-badge {
            display: inline-flex; align-items: center; gap: 0.25rem;
            padding: 0.25rem 0.625rem; border-radius: 100px;
            font-size: 0.75rem; font-weight: 600;
          }
        `}</style>
      </span>
    );
  }

  return (
    <div className="tracker-container">
      {/* Current status banner */}
      <div className="tracker-banner" style={{ background: cfg.bg, borderLeft: `4px solid ${cfg.color}` }}>
        <span className="tracker-banner-icon">{cfg.icon}</span>
        <div>
          <div className="tracker-banner-status" style={{ color: cfg.color }}>{cfg.label}</div>
          <div className="tracker-banner-desc">
            {status === 'baru' && 'Laporan Anda sudah tercatat dan menunggu verifikasi.'}
            {status === 'diproses' && 'Laporan Anda sedang ditindaklanjuti oleh tim terkait.'}
            {status === 'selesai' && 'Laporan Anda telah selesai ditangani. Terima kasih atas partisipasi Anda.'}
            {status === 'ditolak' && 'Laporan Anda tidak dapat dilanjutkan. Silakan hubungi kami untuk informasi lebih lanjut.'}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="tracker-timeline">
        {steps.map((step, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          let dotColor = cfg.color;
          if (isFuture) dotColor = 'var(--muted-light)';
          if (isPast && isDitolak) dotColor = 'var(--bad-border)';

          return (
            <div key={step.key} className="tracker-step">
              <div className="tracker-dot-wrap">
                <div
                  className="tracker-dot"
                  style={{
                    background: isCurrent ? cfg.color : isPast ? cfg.color : 'var(--muted-light)',
                    borderColor: isCurrent ? cfg.color : isPast ? cfg.color : 'var(--muted-light)',
                    width: isCurrent ? '16px' : '12px',
                    height: isCurrent ? '16px' : '12px',
                  }}
                />
                {i < steps.length - 1 && (
                  <div
                    className="tracker-line"
                    style={{ background: isPast || isCurrent ? cfg.color : 'var(--line)' }}
                  />
                )}
              </div>
              <div className="tracker-content" style={{ opacity: isFuture ? 0.4 : 1 }}>
                <div className="tracker-step-label">
                  {step.icon} {step.label}
                  {isCurrent && <span className="tracker-current-badge">Saat ini</span>}
                </div>
                <div className="tracker-step-desc">{step.desc}</div>
                {i === 0 && dibuat && <div className="tracker-time">{formatDate(dibuat)}</div>}
                {(i === 2 || (i === 1 && status === 'ditolak')) && diperbarui && (
                  <div className="tracker-time">{formatDate(diperbarui)}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Ditolak = alternate final step */}
        {isDitolak && (
          <div className="tracker-step">
            <div className="tracker-dot-wrap">
              <div className="tracker-dot" style={{ background: '#dc2626', borderColor: '#dc2626', width: '16px', height: '16px' }} />
            </div>
            <div className="tracker-content">
              <div className="tracker-step-label">❌ Ditolak</div>
              <div className="tracker-step-desc">Laporan tidak dapat dilanjutkan</div>
              {diperbarui && <div className="tracker-time">{formatDate(diperbarui)}</div>}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .tracker-container {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); overflow: hidden;
        }
        .tracker-banner {
          display: flex; gap: 0.75rem; align-items: flex-start;
          padding: 1rem 1.25rem;
        }
        .tracker-banner-icon { font-size: 1.25rem; margin-top: 2px; }
        .tracker-banner-status { font-weight: 700; font-size: 0.9375rem; }
        .tracker-banner-desc { font-size: 0.8125rem; color: var(--gray-500); margin-top: 0.125rem; }

        .tracker-timeline { padding: 1.25rem 1.25rem 0.5rem; }
        .tracker-step { display: flex; gap: 0.75rem; min-height: 56px; }
        .tracker-dot-wrap {
          display: flex; flex-direction: column; align-items: center;
          width: 20px; flex-shrink: 0;
        }
        .tracker-dot {
          border-radius: 50%; border: 2px solid;
          transition: all 0.2s; flex-shrink: 0;
        }
        .tracker-line {
          width: 2px; flex: 1; min-height: 24px; margin: 4px 0;
        }
        .tracker-content { padding-bottom: 1.25rem; }
        .tracker-step-label {
          font-size: 0.875rem; font-weight: 600; color: var(--gray-800);
          display: flex; align-items: center; gap: 0.5rem;
        }
        .tracker-current-badge {
          font-size: 0.625rem; font-weight: 600; padding: 0.125rem 0.5rem;
          border-radius: 100px; background: var(--primary-light); color: var(--primary);
        }
        .tracker-step-desc { font-size: 0.75rem; color: var(--gray-400); margin-top: 0.125rem; }
        .tracker-time { font-size: 0.6875rem; color: var(--gray-400); margin-top: 0.25rem; }
      `}</style>
    </div>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
}
