import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import SlaBadge from '@/components/SlaBadge';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import layananData from '@/data/layanan.json';
import ServiceCard from '@/components/ServiceCard';
import ServiceFinder from '@/components/ServiceFinder';

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
          <ServiceFinder layanan={filtered} />
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

        .kategori-card { text-decoration: none !important; }
        .kategori-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
      `}</style>
    </>
  );
}
