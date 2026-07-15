import { useState, useEffect } from 'react';

const KEY = 'pemdi_rekomendasi';
const REKOMENDASI = [
  { id: 'r1', label: 'Indeks Pemdi ≥ 2,50 (Baik) — Gap Analisis', icon: '🎯' },
  { id: 'r2', label: 'Kebijakan & Regulasi Pemdi — Perbup/Ranperda', icon: '📜' },
  { id: 'r3', label: 'Arsitektur Pemdi — Dokumen & SK', icon: '🏗️' },
  { id: 'r4', label: 'Data Terbuka (Open Data) — Portal Satu Data', icon: '🔓' },
  { id: 'r5', label: 'Keamanan Siber & PDP — Aplikasi & Kebijakan', icon: '🔒' },
  { id: 'r6', label: 'Layanan Digital Terpadu — Integrasi SPBE/SKP', icon: '🔗' },
  { id: 'r7', label: 'Partisipasi Publik — SKM & Lapor Minimal 15%', icon: '📢' },
];

export default function RekomendasiTracker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      setItems(REKOMENDASI.map(r => ({ ...r, status: saved[r.id] || 'merah' })));
    } catch {
      setItems(REKOMENDASI.map(r => ({ ...r, status: 'merah' })));
    }
  }, []);

  const toggle = (id) => {
    const next = items.map(i => {
      if (i.id !== id) return i;
      const map = { merah: 'kuning', kuning: 'hijau', hijau: 'merah' };
      return { ...i, status: map[i.status] };
    });
    setItems(next);
    try {
      const obj = {};
      next.forEach(i => { obj[i.id] = i.status; });
      localStorage.setItem(KEY, JSON.stringify(obj));
    } catch {}
  };

  const done = items.filter(i => i.status === 'hijau').length;
  const total = items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const statusColor = pct >= 80 ? 'var(--ok)' : pct >= 40 ? 'var(--warn)' : 'var(--bad)';

  return (
    <div className="rekom-track">
      <div className="rekom-header">
        <h3>✅ Rekomendasi Prioritas</h3>
        <span className="rekom-counter">{done}/{total} selesai</span>
      </div>
      <div className="rekom-bar-track">
        <div className="rekom-bar" style={{ width: `${pct}%`, background: statusColor }} />
        <span className="rekom-bar-label">{pct}%</span>
      </div>

      <div className="rekom-list">
        {items.map((r, i) => (
          <button
            key={r.id}
            className={`rekom-item rekom-${r.status}`}
            onClick={() => toggle(r.id)}
            aria-label={`${r.label} — Status: ${r.status === 'hijau' ? 'Selesai' : r.status === 'kuning' ? 'Berjalan' : 'Belum'}. Klik untuk ubah.`}
          >
            <span className="rekom-icon">{r.icon}</span>
            <span className="rekom-label">{r.label}</span>
            <span className={`rekom-badge ${r.status}`}>
              {r.status === 'hijau' ? '✓' : r.status === 'kuning' ? '◷' : '○'}
            </span>
          </button>
        ))}
      </div>
      <p className="rekom-hint">💡 Klik item untuk mengubah status: 🔴 Belum → 🟡 Berjalan → 🟢 Selesai</p>

      <style jsx>{`
        .rekom-track {
          padding: 1.25rem; border: 1px solid var(--line);
          border-radius: var(--r, 16px); background: var(--surface);
        }
        .rekom-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .rekom-header h3 { margin: 0; font-size: 1rem; }
        .rekom-counter { font-size: 0.8125rem; font-weight: 600; color: var(--ink-secondary); }

        .rekom-bar-track { position: relative; height: 8px; background: var(--line-2); border-radius: 999px; margin-bottom: 1rem; overflow: visible; }
        .rekom-bar { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
        .rekom-bar-label { position: absolute; right: 0; top: -0.1rem; transform: translateY(-100%); font-size: 0.6875rem; font-weight: 600; color: var(--ink-secondary); }

        .rekom-list { display: flex; flex-direction: column; gap: 0.35rem; }
        .rekom-item {
          display: flex; align-items: center; gap: 0.6rem; width: 100%;
          padding: 0.6rem 0.75rem; border: 1px solid var(--line-2);
          border-radius: var(--radius, 8px); background: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.8125rem; text-align: left;
          transition: all 0.15s ease;
        }
        .rekom-item:hover { border-color: var(--primary); }
        .rekom-merah { border-left: 3px solid var(--bad); }
        .rekom-kuning { border-left: 3px solid var(--warn); }
        .rekom-hijau { border-left: 3px solid var(--ok); background: var(--ok-bg); }
        .rekom-icon { font-size: 1rem; flex-shrink: 0; }
        .rekom-label { flex: 1; line-height: 1.3; }
        .rekom-badge { font-size: 0.75rem; font-weight: 700; flex-shrink: 0; width: 1.5rem; text-align: center; }
        .rekom-badge.hijau { color: var(--ok); }
        .rekom-badge.kuning { color: var(--warn); }
        .rekom-badge.merah { color: var(--bad); }
        .rekom-hint { font-size: 0.7rem; color: var(--muted); margin: 0.75rem 0 0; }
      `}</style>
    </div>
  );
}
