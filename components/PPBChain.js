import { useState } from 'react';

const LEVELS = [
  { level: 'L0', title: 'Visi & Misi', desc: 'Visi & 8 Misi Pembangunan Daerah Aceh Tengah', color: '#004098' },
  { level: 'L1', title: '34 Urusan Konkuren', desc: 'Urusan wajib & pilihan — pendidikan, kesehatan, PU, sosial, dll', color: '#0ea5a4' },
  { level: 'L2', title: '78 Proses Bisnis', desc: '6 kategori: Perencanaan, Pelaksanaan, Anggaran, Monev, Layanan, Pengawasan', color: '#c79a3a' },
];

export default function PPBChain() {
  const [active, setActive] = useState(null);

  return (
    <div className="ppb-chain">
      <div className="ppb-connector">
        {LEVELS.map((l, i) => (
          <div key={l.level}>
            <button
              className={`ppb-node ${active === i ? 'active' : ''}`}
              style={{ '--node-color': l.color }}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={`Level ${l.level}: ${l.title}`}
            >
              <span className="ppb-level">{l.level}</span>
              <span className="ppb-title">{l.title}</span>
              <span className="ppb-desc">{l.desc}</span>
            </button>
            {i < LEVELS.length - 1 && <div className="ppb-arrow">▾</div>}
          </div>
        ))}
      </div>

      <style jsx>{`
        .ppb-chain { max-width: 480px; margin: 0 auto; }
        .ppb-connector { display: flex; flex-direction: column; align-items: center; gap: 0; }
        .ppb-node {
          display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
          width: 100%; padding: 1rem; background: var(--surface);
          border: 2px solid var(--line); border-radius: var(--r, 16px);
          cursor: pointer; transition: all 0.2s ease;
          font-family: var(--font-body); text-align: center;
          border-left: 4px solid var(--node-color);
        }
        .ppb-node:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .ppb-node.active {
          border-color: var(--node-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--node-color) 15%, transparent);
        }
        .ppb-level {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--node-color); background: color-mix(in srgb, var(--node-color) 10%, transparent);
          padding: 0.1rem 0.5rem; border-radius: 999px;
        }
        .ppb-title { font-size: 1rem; font-weight: 600; color: var(--ink); }
        .ppb-desc { font-size: 0.75rem; color: var(--ink-secondary); line-height: 1.4; }
        .ppb-arrow {
          font-size: 1.25rem; color: var(--muted); padding: 0.25rem 0; line-height: 1;
        }
      `}</style>
    </div>
  );
}
