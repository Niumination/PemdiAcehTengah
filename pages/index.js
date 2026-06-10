import Head from 'next/head';
import SpbeGauge from '@/components/SpbeGauge';
import ProbisSection from '@/components/ProbisSection';
import Rekomendasi from '@/components/Rekomendasi';
import OPDTable from '@/components/OPDTable';
import portalData from '@/data/opd.json';

export default function Home({ data }) {
  const opd = data.opd;
  const spbe = data.spbe;
  const startup = data.startup;

  return (
    <>
      <Head>
        <title>Pemdi Aceh Tengah — Portal Pemerintah Digital Kabupaten Aceh Tengah</title>
      </Head>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              🏛️ Pemerintah Digital — Kabupaten Aceh Tengah
            </div>
            <h1>Pemdi Aceh Tengah</h1>
            <p>
              Portal transformasi digital tata kelola pemerintahan menuju
              <strong> Pemerintah Digital (Pemdi)</strong> yang transparan,
              efisien, dan berorientasi pada masyarakat. Berdasarkan data
              SPBE 2025 dan kerangka Permenpan RB 19/2018.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="/probis" className="btn btn-white btn-lg">
                Jelajahi Peta Proses Bisnis →
              </a>
              <a href="#spbe" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                Lihat Indeks SPBE
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">{opd.ringkasan.instansi}</div>
                <div className="hero-stat-label">Instansi Pemerintah</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{opd.ringkasan.kecamatan}</div>
                <div className="hero-stat-label">Kecamatan</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{spbe.indeks.toFixed(2)}</div>
                <div className="hero-stat-label">Indeks SPBE 2025</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{opd.total_asn.toLocaleString()}</div>
                <div className="hero-stat-label">ASN</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{startup.tahapan.length}</div>
                <div className="hero-stat-label">Fase Transformasi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PETA PROSES BISNIS ============ */}
      <section className="section" id="probis">
        <div className="container">
          <div className="section-header">
            <span className="badge badge-blue mb-2">FOKUS UTAMA</span>
            <h2>Peta Proses Bisnis</h2>
            <p>
              Berdasarkan Peraturan Menteri PANRB Nomor 19 Tahun 2018 tentang
              Penyusunan Peta Proses Bisnis Instansi Pemerintah. Diagram
              hubungan kerja yang efektif dan efisien antar unit organisasi
              untuk menghasilkan kinerja sesuai tujuan pemerintahan.
            </p>
          </div>

          <ProbisSection data={data} />

          <div className="text-center mt-4">
            <a href="#rekomendasi" className="btn btn-primary btn-lg">
              Lihat Rekomendasi Transformasi →
            </a>
          </div>
        </div>
      </section>

      {/* ============ INDEKS SPBE ============ */}
      <section className="section section-alt" id="spbe">
        <div className="container">
          <div className="section-header">
            <h2>Indeks SPBE 2025</h2>
            <p>
              Hasil Pemantauan Sistem Pemerintahan Berbasis Elektronik (SPBE)
              Kabupaten Aceh Tengah oleh Kementerian PANRB. Target minimal
              setiap indikator adalah tingkat kematangan Level 3.
            </p>
          </div>

          <SpbeGauge data={data} />

          <div className="grid grid-3 mt-4">
            {spbe.kekuatan.map((k, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                    ✓
                  </div>
                  <h3>Kekuatan</h3>
                </div>
                <p>{k}</p>
              </div>
            ))}
            {spbe.rekomendasi_prioritas.slice(0, 3).map((r, i) => (
              <div className="card" key={i}>
                <div className="card-header">
                  <div className="card-icon" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                    !
                  </div>
                  <h3>Prioritas Perbaikan</h3>
                </div>
                <p>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PERANGKAT DAERAH ============ */}
      <section className="section" id="opd">
        <div className="container">
          <div className="section-header">
            <h2>Perangkat Daerah</h2>
            <p>
              {opd.ringkasan.instansi} instansi dan {opd.ringkasan.kecamatan} kecamatan
              di lingkungan Pemerintah Kabupaten Aceh Tengah.
              Sumber data: Dinas Komunikasi dan Informatika (14 Januari 2026).
            </p>
          </div>

          <OPDTable data={data} />
        </div>
      </section>

      {/* ============ REKOMENDASI ============ */}
      <section className="section section-alt" id="rekomendasi">
        <div className="container">
          <div className="section-header">
            <h2>Rekomendasi Transformasi</h2>
            <p>
              7 rekomendasi prioritas berdasarkan hasil Pemantauan SPBE 2025
              dan kesenjangan (gap) terhadap target Pemerintah Digital.
              Disusun berdasarkan dampak dan tingkat kesulitan implementasi.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: '3rem' }}>
            <div>
              <Rekomendasi data={data} />
            </div>
            <div>
              <div className="card mb-3">
                <h3 className="mb-2">📊 Ringkasan</h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span>Total Rekomendasi</span>
                    <strong>{data.rekomendasi.length}</strong>
                  </div>
                  <div className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span>Dampak Tinggi</span>
                    <strong>{data.rekomendasi.filter(r => r.dampak === 'Tinggi').length}</strong>
                  </div>
                  <div className="flex justify-between items-center" style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span>Kesulitan Tinggi</span>
                    <strong>{data.rekomendasi.filter(r => r.kesulitan === 'Tinggi').length}</strong>
                  </div>
                  <div className="flex justify-between items-center" style={{ padding: '0.5rem 0' }}>
                    <span>Timeline Tercepat</span>
                    <strong>Q3 2026</strong>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>🎯 Target Nasional</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9375rem' }}>
                  Perpres 12/2025 tentang Rencana Pembangunan Jangka Menengah
                  2025-2029 mendorong transformasi dari Indeks SPBE menjadi
                  <strong> Indeks Pemerintah Digital (Pemdi)</strong>.
                  Aceh Tengah perlu mencapai minimal Level 3 di seluruh
                  indikator untuk menyongsong Indonesia Emas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TENTANG ============ */}
      <section className="section" id="tentang">
        <div className="container">
          <div className="section-header">
            <h2>Tentang Startup Ini</h2>
            <p>
              <strong>{startup.nama}</strong> adalah inisiatif open source
              government technology untuk transformasi digital tata kelola
              Pemerintah Kabupaten Aceh Tengah.
            </p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  🎯
                </div>
                <h3>Target</h3>
              </div>
              <p>
                Publik & Internal Pemerintah. Transparansi tata kelola untuk
                masyarakat, dan alat bantu transformasi digital bagi ASN.
              </p>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  📋
                </div>
                <h3>Narasumber Data</h3>
              </div>
              <p>
                <strong>Diskominfo Kab. Aceh Tengah</strong> — sebagai Walidata.
                Data perangkat daerah berdasarkan surat resmi 14 Januari 2026.
              </p>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  🌐
                </div>
                <h3>Model & Lisensi</h3>
              </div>
              <p>
                Open Source Government Technology ({startup.model}).
                Lisensi <strong>{startup.lisensi}</strong> — bebas digunakan,
                dimodifikasi, dan didistribusikan.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-center mb-3">Tahapan Pengembangan</h3>
            <div className="grid grid-2">
              {startup.tahapan.map((t, i) => (
                <div className="card" key={i} style={{
                  borderLeft: `3px solid ${i === 0 ? 'var(--primary)' : 'var(--gray-300)'}`,
                  opacity: i === 0 ? 1 : 0.7
                }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
                    <span className="badge badge-blue">Fase {i + 1}</span>
                    {i === 0 && <span className="badge badge-green">Sedang Berjalan</span>}
                  </div>
                  <p style={{ marginBottom: 0 }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      data: portalData,
    },
  };
}
