import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import SlaBadge from '@/components/SlaBadge';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import layananData from '@/data/layanan.json';

const STATUS_WARNA = { Aktif: 'badge-green', Nonaktif: 'badge-red', Terbatas: 'badge-orange' };

export default function LayananPage() {
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [cari, setCari] = useState('');
  const { kategori, ringkasan } = layananData;

  const semuaLayanan = kategori.flatMap(k =>
    k.layanan.map(l => ({ ...l, kategori: k.nama, kategoriId: k.id, ikon: k.ikon, warna: k.warna }))
  );

  const filtered = semuaLayanan.filter(l => {
    const matchKategori = kategoriAktif ? l.kategoriId === kategoriAktif : true;
    const matchCari = cari
      ? l.nama.toLowerCase().includes(cari.toLowerCase()) ||
        l.deskripsi.toLowerCase().includes(cari.toLowerCase()) ||
        l.kategori.toLowerCase().includes(cari.toLowerCase())
      : true;
    return matchKategori && matchCari;
  });

  // SLA aggregates over ALL services (not just filtered)
  const slaAngka = semuaLayanan
    .map(l => parseInt(l.sla))
    .filter(v => !isNaN(v));
  const slaRata = slaAngka.length
    ? Math.round(slaAngka.reduce((a, b) => a + b, 0) / slaAngka.length)
    : 0;
  const slaTinggi = slaAngka.filter(v => v >= 90).length;
  function getSlaWarna(pct) {
    return pct >= 90 ? '#00703c' : pct >= 80 ? '#e65100' : '#c62828';
  }

  return (
    <>
      <Head>
        <title>Layanan Publik — Pemdi Aceh Tengah</title>
        <meta name="description" content="Direktori layanan publik Kabupaten Aceh Tengah — 7 kategori, 27 layanan. Informasi status, biaya, waktu, dan SLA." />
      </Head>

      {/* ============ HERO ============ */}
      <section className="section-hero-layanan">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Layanan Publik</h1>
            <p>Direktori {formatAngka(ringkasan.total_layanan)} layanan publik di {formatAngka(ringkasan.total_kategori)} kategori — Pemerintah Kabupaten Aceh Tengah</p>
          </div>

          {/* Filter Pills */}
          <div className="filter-row">
            <button
              className={`filter-pill ${kategoriAktif === null ? 'active' : ''}`}
              onClick={() => setKategoriAktif(null)}
            >Semua</button>
            {kategori.map(k => (
              <button
                key={k.id}
                className={`filter-pill ${kategoriAktif === k.id ? 'active' : ''}`}
                style={kategoriAktif === k.id ? { background: k.warna, borderColor: k.warna } : {}}
                onClick={() => setKategoriAktif(k.id)}
              >{k.ikon} {k.nama}</button>
            ))}
          </div>

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari layanan, kategori, atau OPD..."
              value={cari}
              onChange={e => setCari(e.target.value)}
              className="search-input"
              aria-label="Cari layanan publik"
            />
            {cari && <button className="search-clear" onClick={() => setCari('')}>✕</button>}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section" style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '0.75rem' }}>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{formatAngka(ringkasan.total_layanan)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Layanan</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#28a197' }}>{formatAngka(ringkasan.layanan_online)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Bisa Online</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e65100' }}>{formatAngka(ringkasan.layanan_offline)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Datang Langsung</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: getSlaWarna(slaRata) }}>{formatAngka(slaRata)}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Rata-rata SLA</div>
              <div style={{ fontSize: '0.625rem', marginTop: '0.25rem', color: 'var(--muted)' }}>
                {formatAngka(slaTinggi)} layanan ≥90%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DAFTAR LAYANAN ============ */}
      <section className="section section-alt" id="daftar">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p style={{ fontWeight: 500 }}>Tidak ada layanan ditemukan</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>Coba kata kunci lain atau reset filter</p>
            </div>
          ) : (
            <div className="layanan-grid">
              {filtered.map((l, i) => (
                <div key={i} className="card layanan-card" style={{ borderLeft: `4px solid ${l.warna}` }}>
                  <div className="layanan-card-top">
                    <span className="layanan-ikon">{l.ikon}</span>
                    <div className="layanan-card-header">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3>{l.nama}</h3>
                        <span className={`badge badge-sm ${STATUS_WARNA[l.status] || 'badge-gray'}`}>{l.status}</span>
                        {l.online && <span className="badge badge-sm badge-green">Online</span>}
                      </div>
                      <p className="layanan-deskripsi">{l.deskripsi}</p>
                    </div>
                  </div>
                  <div className="layanan-meta">
                    <div className="layanan-meta-item">
                      <span className="meta-label">⏱ {l.waktu}</span>
                    </div>
                    <div className="layanan-meta-item">
                      <span className="meta-label">💰 {l.biaya}</span>
                    </div>
                    <div className="layanan-meta-item">
                      <SlaBadge sla={l.sla} compact={true} />
                    </div>
                  </div>
                  <div className="layanan-opd">
                    <span>📌 </span>
                    {l.kategoriId === 'kecamatan' ? (
                      <span>{l.kategori}</span>
                    ) : (
                      <Link href={`/opd/${kategori.find(k => k.id === l.kategoriId)?.opd_slug || '#'}`}>
                        {kategori.find(k => k.id === l.kategoriId)?.opd}
                      </Link>
                    )}
                  </div>
                  {l.persyaratan && (
                    <details className="layanan-details">
                      <summary>📄 Persyaratan</summary>
                      <p>{l.persyaratan}</p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center" style={{ marginTop: '2rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <small style={{ color: 'var(--muted)' }}>
              Menampilkan {formatAngka(filtered.length)} dari {formatAngka(semuaLayanan.length)} layanan
            </small>
          </div>
        </div>
      </section>

      {/* ============ KATEGORI GRID ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Kategori Layanan</h2>
            <p>Jelajahi berdasarkan kategori urusan pemerintahan</p>
          </div>
          <div className="grid grid-3">
            {kategori.map(k => (
              <Link key={k.id} href={`/layanan?kategori=${k.id}`}
                className="card kategori-card"
                style={{ textDecoration: 'none', borderTop: `3px solid ${k.warna}` }}
                onClick={e => {
                  e.preventDefault();
                  setKategoriAktif(k.id);
                  setCari('');
                  document.getElementById('daftar')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{k.ikon}</div>
                <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{k.nama}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>{formatAngka(k.layanan.length)} layanan</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>{k.opd}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-hero-layanan {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .section-hero-layanan .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-layanan .back-link:hover { color: white; }
        .section-hero-layanan h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-layanan p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .filter-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 1.25rem 0 1rem; }
        .filter-pill {
          padding: 0.375rem 0.875rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 500;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: var(--font-body);
        }
        .filter-pill:hover { background: rgba(255,255,255,0.2); }
        .filter-pill.active { background: white; color: #004098; border-color: white; font-weight: 600; }

        .search-wrap {
          position: relative;
          max-width: 480px;
        }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.875rem; }
        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 8px;
          border: none;
          font-family: var(--font-body);
          font-size: 0.875rem;
          background: rgba(255,255,255,0.15);
          color: white;
          outline: none;
          backdrop-filter: blur(4px);
        }
        .search-input::placeholder { color: rgba(255,255,255,0.6); }
        .search-clear {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: white; cursor: pointer; font-size: 0.875rem; opacity: 0.7;
        }

        .layanan-grid { display: grid; gap: 0.75rem; }
        .layanan-card { padding: 1rem 1.25rem; }
        .layanan-card:hover { box-shadow: var(--shadow-md); }
        .layanan-card-top { display: flex; gap: 0.875rem; align-items: flex-start; }
        .layanan-ikon { font-size: 1.5rem; flex-shrink: 0; margin-top: 0.125rem; }
        .layanan-card-header { flex: 1; }
        .layanan-card-header h3 { font-size: 0.9375rem; margin: 0; }
        .layanan-deskripsi { font-size: 0.8125rem; color: var(--muted); margin: 0.25rem 0 0; }
        .layanan-meta { display: flex; gap: 1.25rem; margin-top: 0.75rem; flex-wrap: wrap; }
        .layanan-meta-item { font-size: 0.75rem; color: var(--muted); display: flex; align-items: center; gap: 0.375rem; }
        .meta-label { color: var(--gray-600); }
        .layanan-opd { font-size: 0.75rem; margin-top: 0.5rem; color: var(--gray-600); }
        .layanan-opd a { font-weight: 500; }
        .layanan-details { margin-top: 0.5rem; font-size: 0.75rem; color: var(--muted); }
        .layanan-details summary { cursor: pointer; font-weight: 500; color: var(--primary); }
        .layanan-details p { margin-top: 0.375rem; padding: 0.5rem 0.75rem; background: var(--gray-50); border-radius: 6px; }

        .kategori-card { text-decoration: none !important; }
        .kategori-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        @media (min-width: 640px) {
          .layanan-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
