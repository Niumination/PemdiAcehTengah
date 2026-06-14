import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import SlaBadge from '@/components/SlaBadge';
import ServiceFinder from '@/components/ServiceFinder';
import ServiceCard from '@/components/ServiceCard';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import layananData from '@/data/layanan.json';

const STATUS_WARNA = { Aktif: 'badge-green', Nonaktif: 'badge-red', Terbatas: 'badge-orange' };

export default function LayananPage() {
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [filters, setFilters] = useState({
    cari: '',
    kategori: '',
    status: '',
    online: '',
  });
  const { kategori, ringkasan } = layananData;

  const semuaLayanan = useMemo(() =>
    kategori.flatMap(k =>
      k.layanan.map(l => ({ ...l, kategori: k.nama, kategoriId: k.id, ikon: k.ikon, warna: k.warna, kategoriObj: k }))
    ),
    [kategori]
  );

  const filtered = useMemo(() => {
    return semuaLayanan.filter(l => {
      // Search text
      if (filters.cari) {
        const q = filters.cari.toLowerCase();
        if (
          !l.nama.toLowerCase().includes(q) &&
          !l.deskripsi.toLowerCase().includes(q) &&
          !l.kategori.toLowerCase().includes(q)
        ) return false;
      }
      // Kategori filter
      if (filters.kategori && l.kategoriId !== filters.kategori) return false;
      // Status filter
      if (filters.status && l.status !== filters.status) return false;
      // Online/offline filter
      if (filters.online === 'online' && !l.online) return false;
      if (filters.online === 'offline' && l.online) return false;
      return true;
    });
  }, [semuaLayanan, filters]);

  // SLA aggregates
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

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Head>
        <title>Layanan Publik — Pemdi Aceh Tengah</title>
        <meta name="description" content="Direktori layanan publik Kabupaten Aceh Tengah — 7 kategori, 27 layanan. Informasi status, biaya, waktu, dan SLA." />
        <meta property="og:title" content="Layanan Publik — Pemdi Aceh Tengah" />
        <meta property="og:description" content="Direktori layanan publik Kabupaten Aceh Tengah — 7 kategori, 27 layanan. Informasi status, biaya, waktu, dan SLA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/layanan" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Layanan Publik — Pemdi Aceh Tengah" />
        <meta name="twitter:description" content="Direktori layanan publik Kabupaten Aceh Tengah — 7 kategori, 27 layanan." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Layanan Publik Aceh Tengah',
              description: 'Direktori layanan publik Kabupaten Aceh Tengah — 7 kategori, 27 layanan.',
              url: 'https://pemdi-aceh-tengah.vercel.app/layanan',
              isPartOf: { '@type': 'WebSite', name: 'Pemdi Aceh Tengah', url: 'https://pemdi-aceh-tengah.vercel.app' },
              about: { '@type': 'GovernmentService', name: 'Layanan Publik Aceh Tengah' },
            }),
          }}
        />
      </Head>

      {/* ============ HERO MODERN ============ */}
      <section className="section-hero-modern">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '0.5rem' }}>
            <h1>Layanan Publik</h1>
            <p>Direktori {formatAngka(ringkasan.total_layanan)} layanan publik di {formatAngka(ringkasan.total_kategori)} kategori — Pemerintah Kabupaten Aceh Tengah</p>
          </div>
        </div>
      </section>

      {/* ============ SERVICE FINDER ============ */}
      <section className="section" style={{ padding: '2rem 0 0' }}>
        <div className="container">
          <ServiceFinder kategori={kategori} onFilter={handleFilter} />
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section" style={{ padding: '0 0 1.5rem' }}>
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
                <ServiceCard
                  key={i}
                  layanan={l}
                  kategori={l.kategoriObj}
                />
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
                  setFilters(prev => ({ ...prev, kategori: k.id, cari: '' }));
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
        .layanan-grid { display: grid; gap: 0.75rem; }
        .kategori-card { text-decoration: none !important; }
        .kategori-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        @media (min-width: 640px) {
          .layanan-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
