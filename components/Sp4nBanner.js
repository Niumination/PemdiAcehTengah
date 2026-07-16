import Link from 'next/link';

export default function Sp4nBanner({ variant = 'banner' }) {
  // variant: 'banner' (full width card) | 'footer' (inline link)

  if (variant === 'footer') {
    return (
      <a
        href="https://www.lapor.go.id/"
        target="_blank"
        rel="noopener noreferrer"
        className="sp4n-footer-link"
      >
        <span className="sp4n-footer-icon">🏛️</span>
        <span>SP4N LAPOR Nasional</span>
        <span className="sp4n-arrow">→</span>
        <style jsx>{`
          .sp4n-footer-link {
            display: inline-flex; align-items: center; gap: 0.375rem;
            color: var(--gray-400); text-decoration: none;
            font-size: 0.8125rem; transition: color 0.15s;
          }
          .sp4n-footer-link:hover { color: var(--primary); }
          .sp4n-footer-icon { font-size: 1rem; }
          .sp4n-arrow { font-size: 0.75rem; }
        `}</style>
      </a>
    );
  }

  return (
    <div className="sp4n-banner">
      <div className="sp4n-banner-icon-wrap">
        <span className="sp4n-banner-icon">🏛️</span>
      </div>
      <div className="sp4n-banner-content">
        <div className="sp4n-banner-title">
          Lapor juga melalui <strong>SP4N LAPOR!</strong>
        </div>
        <div className="sp4n-banner-desc">
          Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional —
          terintegrasi dengan Pemerintah Kabupaten Aceh Tengah.
        </div>
        <a
          href="https://www.lapor.go.id/"
          target="_blank"
          rel="noopener noreferrer"
          className="sp4n-banner-btn"
        >
          Kunjungi SP4N LAPOR →
        </a>
      </div>
      <style jsx>{`
        .sp4n-banner {
          display: flex; gap: 1rem; align-items: flex-start;
          padding: 1.25rem 1.5rem;
          background: var(--ok-bg);
          border: 1px solid var(--ok-border);
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
        }
        .sp4n-banner-icon-wrap {
          flex-shrink: 0;
          width: 48px; height: 48px;
          background: var(--ok); border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .sp4n-banner-icon { font-size: 1.5rem; filter: brightness(0) invert(1); }
        .sp4n-banner-title { font-size: 1rem; font-weight: 600; color: var(--ok); margin-bottom: 0.25rem; }
        .sp4n-banner-desc { font-size: 0.8125rem; color: var(--ink-secondary); line-height: 1.5; margin-bottom: 0.75rem; }
        .sp4n-banner-btn {
          display: inline-flex; align-items: center; gap: 0.375rem;
          padding: 0.5rem 1rem;
          background: var(--ok); color: white;
          border-radius: var(--radius); font-size: 0.8125rem; font-weight: 600;
          text-decoration: none; transition: background 0.15s;
        }
        .sp4n-banner-btn:hover { opacity: 0.85; }

        @media (max-width: 576px) {
          .sp4n-banner { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </div>
  );
}
