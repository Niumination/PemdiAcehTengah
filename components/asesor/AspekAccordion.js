/**
 * AspekAccordion — Interactive Matrix 7 Aspek (Phase 3).
 * Accordion Progress Card: klik aspek → rincian indikator + ringkasan bukti dukung
 * (diterima/revisi/draf/belum) tanpa reload. Data ringkas dikirim getStaticProps.
 * Status warna AA: hijau diterima · amber revisi/proses · abu belum.
 */
import { useState } from 'react';
import Link from 'next/link';
import { formatDesimal } from '@/lib/format';

const STATUS = [
  { k: 'diterima', label: 'Diterima', cls: 'ok' },
  { k: 'revisi', label: 'Revisi', cls: 'warn' },
  { k: 'draf', label: 'Draf lokal', cls: 'muted' },
  { k: 'belum', label: 'Belum', cls: 'gray' },
];

export default function AspekAccordion({ aspek = [] }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="aspek-acc">
      {aspek.map((a) => {
        const pct = Math.min(100, Math.round((a.nilai / a.target) * 100));
        const isOpen = open === a.id;
        const tone = pct >= 80 ? 'ok' : pct > 0 ? 'warn' : 'gray';
        return (
          <div key={a.id} className={`aspek-item ${isOpen ? 'open' : ''}`}>
            <h3 className="aspek-h">
              <button
                type="button"
                className="aspek-btn"
                aria-expanded={isOpen}
                aria-controls={`aspek-panel-${a.id}`}
                id={`aspek-btn-${a.id}`}
                onClick={() => setOpen(isOpen ? null : a.id)}
              >
                <span className="aspek-no">{a.id}</span>
                <span className="aspek-title">
                  <span className="aspek-nama">{a.nama}</span>
                  <span className="aspek-sub">Bobot {a.bobot}% · {a.indikator.length} indikator</span>
                </span>
                <span className="aspek-score">
                  <strong>{formatDesimal(a.nilai)}</strong> <small>/ {formatDesimal(a.target)}</small>
                </span>
                <span className="aspek-bar"><span className={`aspek-fill ${tone}`} style={{ width: `${pct}%` }} /></span>
                <span className="aspek-chev" aria-hidden="true">▾</span>
              </button>
            </h3>
            <div id={`aspek-panel-${a.id}`} role="region" aria-labelledby={`aspek-btn-${a.id}`} className="aspek-panel" hidden={!isOpen}>
              <p className="aspek-desc">{a.deskripsi}</p>
              <ul className="ind-list">
                {a.indikator.map((i) => (
                  <li key={i.id} className="ind-row">
                    <div className="ind-main">
                      <span className="ind-id">{i.id}</span>
                      <span className="ind-nama">{i.nama}</span>
                    </div>
                    <div className="ind-meta">
                      <span className="ind-nilai">Nilai {formatDesimal(i.nilai)} / {formatDesimal(i.target)}</span>
                      {i.fokus && (
                        <span className="ind-fokus" title={i.fokus.eksternal ? 'Nilai ditarik dari instansi pembina' : 'Level dicapai (diterima asesor) → level yang dikejar'}>
                          {i.fokus.eksternal
                            ? '⏳ eksternal'
                            : <>{i.fokus.dicapai >= 1 ? `✅ L${i.fokus.dicapai}` : '⬜ L0'}{i.fokus.berikut ? ` → 🎯 L${i.fokus.berikut}` : ' · maks'}</>}
                        </span>
                      )}
                      <span className="ind-status">
                        {STATUS.filter((s) => i.bukti[s.k] > 0).map((s) => (
                          <span key={s.k} className={`st-chip ${s.cls}`}>{i.bukti[s.k]} {s.label}</span>
                        ))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="aspek-foot">
                <span className="muted">Koordinator: {a.koordinator || '—'}</span>
                <Link href={`/pemdi#aspek-${a.id}`} className="btn btn-outline btn-sm">Buka checklist bukti →</Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
