import Head from 'next/head';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import SlaBadge from '@/components/SlaBadge';
import { MotifEmun, MotifTapak, KerawangDivider } from '@/components/motif/KerawangMotifs';
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
      <section data-reveal style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -18, right: 6, opacity: 0.5, pointerEvents: 'none' }}>
          <MotifEmun size={300} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -12, left: 10, opacity: 0.32, pointerEvents: 'none' }}>
          <MotifTapak size={120} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
            ← Beranda
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <h1 className="gold-head" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Layanan Publik</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
              Direktori {formatAngka(ringkasan.total_layanan)} layanan publik di {formatAngka(ringkasan.total_kategori)} kategori — Pemerintah Kabupaten Aceh Tengah
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1.25rem 0 1rem' }}>
            <button
              onClick={() => setKategoriAktif(null)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: kategoriAktif === null ? 600 : 500,
                background: kategoriAktif === null ? '#fff' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${kategoriAktif === null ? '#fff' : 'rgba(255,255,255,0.25)'}`,
                color: kategoriAktif === null ? 'var(--primary)' : 'rgba(255,255,255,0.9)',
                cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'var(--font-body)',
              }}
            >Semua</button>
            {kategori.map(k => (
              <button
                key={k.id}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: kategoriAktif === k.id ? 600 : 500,
                  background: kategoriAktif === k.id ? k.warna : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${kategoriAktif === k.id ? k.warna : 'rgba(255,255,255,0.25)'}`,
                  color: kategoriAktif === k.id ? '#fff' : 'rgba(255,255,255,0.9)',
                  cursor: 'pointer', transition: 'all 0.15s ease', fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => { if (kategoriAktif !== k.id) { e.target.style.background = 'rgba(255,255,255,0.2)'; }}}
                onMouseLeave={e => { if (kategoriAktif !== k.id) { e.target.style.background = 'rgba(255,255,255,0.1)'; }}}
                onClick={() => setKategoriAktif(k.id)}
              >{k.ikon} {k.nama}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Cari layanan, kategori, atau OPD..."
              value={cari}
              onChange={e => setCari(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', background: 'rgba(255,255,255,0.15)',
                color: '#fff', outline: 'none', backdropFilter: 'blur(4px)',
              }}
              aria-label="Cari layanan publik"
            />
            {cari && (
              <button
                onClick={() => setCari('')}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', opacity: 0.7,
                }}
              >✕</button>
            )}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section" style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: '0.75rem' }} data-reveal-stagger>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', '--i': 0 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{formatAngka(ringkasan.total_layanan)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Total Layanan</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', '--i': 1 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#28a197' }}>{formatAngka(ringkasan.layanan_online)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Bisa Online</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', '--i': 2 }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#e65100' }}>{formatAngka(ringkasan.layanan_offline)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Datang Langsung</div>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center', '--i': 3 }}>
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
          <div className="grid grid-3" data-reveal-stagger>
            {kategori.map((k, ki) => (
              <Link key={k.id} href={`/layanan?kategori=${k.id}`}
                className="card"
                style={{ textDecoration: 'none', borderTop: `3px solid ${k.warna}`, '--i': ki, transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1)' }}
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
    </>
  );
}
