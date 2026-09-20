/**
 * SektorLayanan — 6 Kartu Kategori Sektor (Phase 2). Grid kartu; klik kartu membuka
 * daftar layanan sektor tsb secara inline (accordion, tanpa reload). Data dari
 * lib/sektorLayanan.kelompokkanSektor() — tidak ada layanan yang hilang.
 */
import { useState } from 'react';
import Link from 'next/link';
import SlaBadge from '@/components/SlaBadge';

export default function SektorLayanan({ sektor = [] }) {
  const [buka, setBuka] = useState(null);
  const aktif = sektor.find((s) => s.id === buka);

  return (
    <div className="sektor-wrap">
      <div className="sektor-grid">
        {sektor.map((s) => {
          const open = s.id === buka;
          return (
            <button
              key={s.id}
              type="button"
              className={`sektor-card ${open ? 'open' : ''}`}
              aria-expanded={open}
              aria-controls="sektor-panel"
              onClick={() => setBuka(open ? null : s.id)}
            >
              <span className="sektor-ic" aria-hidden="true">{s.icon}</span>
              <span className="sektor-nama">{s.nama}</span>
              <span className="sektor-meta">{s.jumlah} layanan · {s.online} daring</span>
              <span className="sektor-contoh">{s.contoh}</span>
            </button>
          );
        })}
      </div>

      <div id="sektor-panel" className="sektor-panel" aria-live="polite" hidden={!aktif}>
        {aktif && (
          <>
            <div className="sektor-panel-head">
              <h3><span aria-hidden="true">{aktif.icon}</span> {aktif.nama}</h3>
              <span className="badge badge-gray">Penyelenggara: {aktif.opd.join(', ') || '—'}</span>
            </div>
            <ul className="sektor-list">
              {aktif.layanan.map((l) => (
                <li key={`${l.kategori_id}-${l.nama}`} className="sektor-item">
                  <div className="sektor-item-main">
                    <strong>{l.nama}</strong>
                    <span className="sektor-item-desc">{l.deskripsi}</span>
                  </div>
                  <div className="sektor-item-meta">
                    <span title="Lama proses">⏱ {l.waktu || '—'}</span>
                    <span title="Biaya">💳 {l.biaya || '—'}</span>
                    {l.sla && <SlaBadge sla={l.sla} size="sm" compact />}
                    {l.online ? <span className="badge badge-green">Daring</span> : <span className="badge badge-gray">Tatap muka</span>}
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'right' }}>
              <Link href="/layanan" className="link-more">Lihat semua layanan &amp; persyaratan →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
