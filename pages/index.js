import Head from 'next/head';
import SpbeGauge from '@/components/SpbeGauge';
import ProbisSection from '@/components/ProbisSection';
import Rekomendasi from '@/components/Rekomendasi';
import OPDTable from '@/components/OPDTable';
import DataBadge from '@/components/DataBadge';
import AwardHero from '@/components/AwardHero';
import QuickActions from '@/components/QuickActions';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import portalData from '@/data/opd.json';
import pemdiData from '@/data/pemdi.json';

function hitungIndeks(aspek) {
  const totalBobot = aspek.reduce((s, a) => s + a.bobot, 0);
  const tertimbang = aspek.reduce((s, a) => s + a.nilai * (a.bobot / totalBobot), 0);
  return Math.round(tertimbang * 100) / 100;
}
function getPredikat(nilai) {
  if (nilai >= 4.2) return { label: 'Memuaskan', warna: '#00703c' };
  if (nilai >= 3.5) return { label: 'Sangat Baik', warna: '#28a197' };
  if (nilai >= 2.5) return { label: 'Baik', warna: '#1d70b8' };
  if (nilai >= 1.5) return { label: 'Cukup', warna: '#e65100' };
  return { label: 'Kurang', warna: '#d4351c' };
}

export default function Home({ data }) {
  const opd = data.opd;
  const spbe = data.spbe;
  const startup = data.startup;
  const indeks = hitungIndeks(pemdiData.aspek);
  const predikat = getPredikat(indeks);

  return (
    <>
      <Head>
        <title>Pemdi Aceh Tengah — Portal Pemerintah Digital Kabupaten Aceh Tengah</title>
        <meta name="description" content="Portal transformasi digital tata kelola pemerintahan Kabupaten Aceh Tengah menuju Pemerintah Digital (Pemdi) yang transparan, efisien, dan berorientasi pada masyarakat." />
        <meta property="og:title" content="Pemdi Aceh Tengah — Portal Pemerintah Digital Kabupaten Aceh Tengah" />
        <meta property="og:description" content="Portal transformasi digital tata kelola pemerintahan Kabupaten Aceh Tengah menuju Pemerintah Digital (Pemdi) yang transparan, efisien, dan berorientasi pada masyarakat." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pemdi Aceh Tengah — Portal Pemerintah Digital" />
        <meta name="twitter:description" content="Portal transformasi digital tata kelola pemerintahan menuju Pemerintah Digital (Pemdi)." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Pemdi Aceh Tengah',
              url: 'https://pemdi-aceh-tengah.vercel.app',
              description: 'Portal transformasi digital tata kelola pemerintahan Kabupaten Aceh Tengah menuju Pemerintah Digital (Pemdi).',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://pemdi-aceh-tengah.vercel.app/cari?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      <AwardHero data={data} />
      <QuickActions />

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
                <div className="hero-stat-num">{formatAngka(opd.ringkasan.instansi)}</div>
                <div className="hero-stat-label">Instansi Pemerintah</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{formatAngka(opd.ringkasan.kecamatan)}</div>
                <div className="hero-stat-label">Kecamatan</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{formatDesimal(spbe.indeks)}</div>
                <div className="hero-stat-label">Indeks SPBE 2025</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{formatAngka(opd.total_asn)}</div>
                <div className="hero-stat-label">ASN</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">{formatAngka(startup.tahapan.length)}</div>
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

      {/* ============ PEMDI ============ */}
      <section className="section section-alt" id="pemdi">
        <div className="container">
          <div className="section-header">
            <h2>🚀 Indeks Pemerintah Digital (Pemdi)</h2>
            <p>
              Transisi dari SPBE ke <strong>Indeks Pemdi</strong> — Permenpan RB 8/2026.
              7 aspek × 20 indikator. Bobot terbesar: Kepuasan Pengguna (25%).
            </p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="grid grid-2" style={{ gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.375rem' }}>Indeks Pemdi Baseline</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: predikat.warna }}>{formatDesimal(indeks)}</div>
                <div className="badge badge-sm" style={{ background: `${predikat.warna}18`, color: predikat.warna, border: `1px solid ${predikat.warna}40` }}>
                  {predikat.label}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                  Target 2026: <strong>{pemdiData.target_indeks}</strong> ({pemdiData.target_predikat}) · Gap: <strong style={{ color: '#d4351c' }}>{formatDesimal(pemdiData.target_indeks - indeks)}</strong>
                </p>
              </div>
              <div>
                <div className="grid grid-2" style={{ gap: '0.625rem' }}>
                  {pemdiData.aspek.map((a) => (
                    <div key={a.id} className="card" style={{ padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{a.nama}</div>
                        <div style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{a.bobot}%</div>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: a.warna, minWidth: '2rem', textAlign: 'right' }}>
                        {formatDesimal(a.nilai)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center" style={{ marginTop: '1.25rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="/pemdi" className="btn btn-primary">Dashboard Pemdi Lengkap →</a>
            <a href="https://drive.google.com/file/d/1wh1BChQkn8N9dotSfyXuE1FN3EhrM2ET/view" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
              Unduh Permenpan 8/2026
            </a>
          </div>
        </div>
      </section>

      {/* ============ FITUR PUBLIK ============ */}
      <section className="section" id="fitur">
        <div className="container">
          <div className="section-header">
            <h2>🛠️ Layanan & Fitur Publik</h2>
            <p>
              Portal layanan digital terpadu — akses informasi, laporkan masalah, dan
              bantu kami terus berbenah.
            </p>
          </div>
          <div className="grid grid-4">
            <a href="/layanan" className="card fitur-card" style={{ textDecoration: 'none' }}>
              <div className="fitur-icon">📋</div>
              <h3>Direktori Layanan</h3>
              <p>27 layanan publik dalam 7 kategori — cek status, biaya, SLA, dan syarat</p>
              <span className="fitur-link">Jelajahi →</span>
            </a>
            <a href="/skm" className="card fitur-card" style={{ textDecoration: 'none' }}>
              <div className="fitur-icon">📝</div>
              <h3>Survei Kepuasan</h3>
              <p>Beri nilai pelayanan publik — 8 dimensi, 2 menit saja. Anonim & aman</p>
              <span className="fitur-link">Isi Survei →</span>
            </a>
            <a href="/faq" className="card fitur-card" style={{ textDecoration: 'none' }}>
              <div className="fitur-icon">❓</div>
              <h3>Tanya Jawab</h3>
              <p>Pertanyaan umum seputar layanan, portal, SPBE, dan Pemdi — jawaban cepat</p>
              <span className="fitur-link">Lihat FAQ →</span>
            </a>
            <div className="card fitur-card" style={{ cursor: 'default' }}>
              <div className="fitur-icon">💬</div>
              <h3>Lapor / Saran</h3>
              <p>Laporkan masalah atau beri saran via tombol <strong>💬</strong> di pojok kanan bawah</p>
              <span className="fitur-link" style={{ color: 'var(--muted)' }}>Selalu Tersedia</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PERANGKAT DAERAH ============ */}
      <section className="section" id="opd">
        <div className="container">
          <div className="section-header">
            <h2>Perangkat Daerah</h2>
            <p>
              {formatAngka(opd.ringkasan.instansi)} instansi dan {formatAngka(opd.ringkasan.kecamatan)} kecamatan
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
