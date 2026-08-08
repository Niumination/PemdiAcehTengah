import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'pemdi_page_views';
const THRESHOLD = 3;

export default function SkmPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      let n = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
      n += 1;
      sessionStorage.setItem(STORAGE_KEY, String(n));
      if (n >= THRESHOLD) setShow(true);
    } catch { /* sessionStorage unavailable */ }
  }, []);

  if (!show) return null;

  return (
    <div className="skm-toast" role="alert">
      <span>📝 Ada waktu 2 menit? <strong>Ikut survei kepuasan kami</strong></span>
      <Link href="/skm" className="skm-toast-cta" onClick={() => setShow(false)}>
        Isi Survei →
      </Link>
      <button className="skm-toast-close" onClick={() => setShow(false)} aria-label="Tutup">✕</button>
      <style jsx>{`
        .skm-toast {
          position: fixed; top: calc(var(--gov-strip-h, 36px) + 70px + env(safe-area-inset-top)); right: 1.5rem;
          bottom: auto; z-index: 1000;
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 1rem 0.75rem 1.25rem;
          background: var(--primary); color: white;
          border-radius: var(--r, 16px); box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1));
          font-size: 0.875rem; max-width: 420px;
          animation: skm-slide-down 0.35s ease;
        }
        @keyframes skm-slide-down {
          from { opacity: 0; transform: translateY(-1rem); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .skm-toast strong { font-weight: 600; }
        .skm-toast-cta {
          display: inline-block; padding: 0.4rem 0.85rem; border-radius: var(--radius, 8px);
          background: rgba(255,255,255,0.2); color: white; text-decoration: none;
          font-weight: 600; font-size: 0.8125rem; white-space: nowrap;
          transition: background 0.15s ease;
        }
        .skm-toast-cta:hover { background: rgba(255,255,255,0.3); }
        .skm-toast-close {
          background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer;
          font-size: 1rem; padding: 0; line-height: 1; flex-shrink: 0;
        }
        .skm-toast-close:hover { color: white; }
        @media (max-width: 640px) {
          .skm-toast { top: calc(var(--gov-strip-h, 36px) + 64px); left: 1rem; right: 1rem; max-width: none; flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
