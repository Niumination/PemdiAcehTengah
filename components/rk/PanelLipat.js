/**
 * components/rk/PanelLipat.js — Panel dashboard yang dapat dilipat & diingat (Patch 9, Tahap 1).
 *
 * <PanelLipat id="antrean" judul="Antrean prioritas" ringkas="· 8 butir" aksi={<Link…/>} className="rk-c4" awal="buka">
 *   …isi…
 * </PanelLipat>
 *  - status per panel disimpan di localStorage `pemdi:lipat:<id>` (buka|tutup); prop `awal` = default;
 *  - saat terlipat, `ringkas` (teks/angka kunci) tampil di judul agar informasi tidak hilang;
 *  - animasi grid-template-rows 1fr→0fr (tanpa CLS); dimatikan oleh prefers-reduced-motion;
 *  - <LipatSemua/> menyiarkan event `pemdi:lipat-semua` → semua panel di halaman ikut (dan disimpan).
 * Status dibaca setelah hidrasi (SSR selalu `awal`) supaya markup server = klien.
 */
import { useEffect, useId, useState } from 'react';
import Ikon from '@/components/ui/Ikon';

const K = (id) => `pemdi:lipat:${id}`;

export default function PanelLipat({ id, judul, ringkas, aksi, className = '', awal = 'buka', children }) {
  const [st, setSt] = useState(awal);
  const bdId = useId();
  useEffect(() => {
    try { const v = localStorage.getItem(K(id)); if (v === 'buka' || v === 'tutup') setSt(v); } catch { /* abaikan */ }
    const h = (e) => { const v = e.detail; setSt(v); try { localStorage.setItem(K(id), v); } catch { /* abaikan */ } };
    window.addEventListener('pemdi:lipat-semua', h);
    return () => window.removeEventListener('pemdi:lipat-semua', h);
  }, [id]);
  const toggle = () => {
    const v = st === 'buka' ? 'tutup' : 'buka';
    setSt(v);
    try { localStorage.setItem(K(id), v); } catch { /* abaikan */ }
  };
  return (
    <section className={`rk-panel ${className}`.trim()} data-lipat={st}>
      <h2>
        <button type="button" className="rk-lipat" onClick={toggle} aria-expanded={st === 'buka'} aria-controls={bdId} aria-label={st === 'buka' ? `Lipat panel ${judul}` : `Buka panel ${judul}`}>
          <Ikon nama="lipat" size={16} />
        </button>
        <span className="rk-judul">{judul}{ringkas ? <span className="rk-ringkas">{ringkas}</span> : null}</span>
        {aksi}
      </h2>
      <div className="rk-lipat-wrap"><div className="rk-lipat-bd" id={bdId} aria-hidden={st !== 'buka'}>{children}</div></div>
    </section>
  );
}

export function LipatSemua({ keterangan }) {
  const kirim = (v) => window.dispatchEvent(new CustomEvent('pemdi:lipat-semua', { detail: v }));
  return (
    <div className="rk-lipat-semua">
      {keterangan ? <span className="faint" style={{ marginRight: 'auto', fontSize: 'var(--rk-fs-1)' }}>{keterangan}</span> : null}
      <button type="button" className="rk-kbtn" onClick={() => kirim('buka')}>Buka semua</button>
      <button type="button" className="rk-kbtn" onClick={() => kirim('tutup')}>Lipat semua</button>
    </div>
  );
}
