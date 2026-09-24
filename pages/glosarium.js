/**
 * pages/glosarium.js — Glosarium istilah Pemdi bergaya Ruang Kendali (Patch 12, Tahap 3c).
 * Kotak cari RK + saring kategori (chip) + kartu istilah dua tingkat (penjelasan singkat → lengkap).
 * Data tetap: data/glosarium.json.
 */
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Ikon from '@/components/ui/Ikon';
import glosariumData from '@/data/glosarium.json';

const KATEGORI_WARNA = {
  Konsep: 'var(--rk-info)',
  Penilaian: 'var(--rk-emas)',
  'Tata Kelola': 'var(--rk-ok)',
  Layanan: 'var(--rk-status-ink-draf)',
  Regulasi: 'var(--rk-bad)',
  Umum: 'var(--rk-ink-3)',
};

function Sorot({ teks, q }) {
  if (!q) return teks;
  const i = teks.toLowerCase().indexOf(q);
  if (i < 0) return teks;
  return <>{teks.slice(0, i)}<mark className="rk-mark">{teks.slice(i, i + q.length)}</mark>{teks.slice(i + q.length)}</>;
}

export default function GlosariumPage() {
  const [query, setQuery] = useState('');
  const [kat, setKat] = useState('');
  const q = query.trim().toLowerCase();
  const kategori = useMemo(() => {
    const m = {};
    glosariumData.forEach((e) => { const k = e.kategori || 'Umum'; m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, []);
  const hasil = useMemo(() => glosariumData.filter((e) => (!kat || (e.kategori || 'Umum') === kat) && (!q || [e.istilah, e.singkat, e.lengkap, e.kepanjangan].some((t) => t && t.toLowerCase().includes(q)))), [q, kat]);

  return (
    <>
      <Head>
        <title>Glosarium — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Istilah teknis evaluasi Pemerintah Digital (PermenPANRB 8/2026) yang dipakai di dashboard, dijelaskan dengan bahasa sederhana." />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan glosarium">
          <div className="lead"><div className="lbl">Glosarium</div><div className="val">{glosariumData.length}<small>istilah</small></div><div className="sub">kosakata evaluasi Pemerintah Digital yang dipakai lintas halaman dashboard</div></div>
          <div><div className="lbl">Kategori</div><div className="val">{kategori.length}</div><div className="sub">{kategori.map(([k]) => k).join(' · ')}</div></div>
          <div><div className="lbl">Cocok</div><div className="val">{hasil.length}</div><div className="sub">{q || kat ? 'sesuai cari/saring' : 'semua ditampilkan'}</div></div>
          <div><div className="lbl">Rujukan</div><div className="val" style={{ fontSize: 'var(--rk-fs-3)' }}>PermenPANRB 8/2026</div><div className="sub">nama aspek/indikator tidak diparafrasa</div></div>
        </section>

        <section className="rk-panel rk-c12 rk-glos-kendali">
          <label className="rk-cari-box">
            <Ikon nama="cari" size={16} />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari istilah, singkatan, atau penjelasan…" aria-label="Cari istilah dalam glosarium" autoComplete="off" />
            {query ? <button type="button" className="rk-act" onClick={() => setQuery('')} aria-label="Bersihkan"><Ikon nama="tutup" size={12} /></button> : null}
          </label>
          <div className="rk-chips" role="group" aria-label="Saring kategori">
            <button type="button" className="rk-chip" aria-pressed={!kat} onClick={() => setKat('')}>Semua {glosariumData.length}</button>
            {kategori.map(([k, n]) => (
              <button key={k} type="button" className="rk-chip" aria-pressed={kat === k} onClick={() => setKat(kat === k ? '' : k)}>
                <span className="sw" style={{ background: KATEGORI_WARNA[k] || 'var(--rk-ink-3)' }} />{k} {n}
              </button>
            ))}
          </div>
        </section>

        {hasil.length ? (
          <div className="rk-glos rk-c12">
            {hasil.map((e) => (
              <article key={e.id || e.istilah} id={e.id} className="rk-istilah" style={{ '--warna': KATEGORI_WARNA[e.kategori] || 'var(--rk-ink-3)' }}>
                <header>
                  <h3><Sorot teks={e.istilah} q={q} /></h3>
                  <span className="kat">{e.kategori || 'Umum'}</span>
                </header>
                {e.kepanjangan ? <p className="kep"><Sorot teks={e.kepanjangan} q={q} /></p> : null}
                <p className="singkat"><Sorot teks={e.singkat || ''} q={q} /></p>
                {e.lengkap ? (
                  <details>
                    <summary>Penjelasan lengkap</summary>
                    <p><Sorot teks={e.lengkap} q={q} /></p>
                  </details>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <section className="rk-panel rk-c12 rk-kosong">
            <p>Tidak ada istilah yang cocok dengan “{query}”{kat ? ` pada kategori ${kat}` : ''}.</p>
            <p className="rk-catatan">Coba kata lain, atau <Link href={`/cari?q=${encodeURIComponent(query)}`}>cari di seluruh dashboard</Link>.</p>
          </section>
        )}
      </div>
    </>
  );
}
