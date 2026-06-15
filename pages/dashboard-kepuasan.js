import Head from 'next/head';
import Link from 'next/link';
import DashboardSKM from '@/components/DashboardSKM';

export default function DashboardKepuasan() {
  return (
    <>
      <Head>
        <title>Dashboard Kepuasan Pengguna — Pemdi Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard publik hasil Survei Kepuasan Masyarakat (SKM) dan rating umpan balik pengguna — Pemerintah Kabupaten Aceh Tengah. Indikator I20 PermenPANRB 8/2026."
        />
      </Head>

      <section className="section-hero-skm">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Dashboard Kepuasan Pengguna</h1>
            <p>
              Transparansi hasil Survei Kepuasan Masyarakat (SKM) dan umpan balik pengguna
              — bagian dari pemenuhan <strong>Indikator I20 (Pengelolaan Kepuasan Pengguna)</strong> PermenPANRB 8/2026.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Info banner */}
          <div className="dash-info-banner">
            <div className="dash-info-icon">ℹ️</div>
            <div className="dash-info-text">
              <strong>Mekanisme Pengumpulan Data:</strong> Survei Kepuasan Masyarakat (SKM) melalui
              halaman{' '}
              <Link href="/skm" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                /skm
              </Link>{' '}
              — 8 dimensi penilaian (skala 1–4), 41 unit pelayanan. Rating umpan balik cepat
              melalui tombol ★ di pojok kanan bawah setiap halaman.
            </div>
          </div>

          <DashboardSKM />

          {/* Footer info */}
          <div className="dash-footer-info">
            <p>
              <strong>Dasar Hukum:</strong> Peraturan Menteri PANRB No. 8 Tahun 2026 tentang
              Evaluasi Kinerja Pemerintah Digital — Indikator I19 (Fasilitas Dukungan Pengguna,
              bobot 10%) dan I20 (Pengelolaan Kepuasan Pengguna, bobot 15%).
            </p>
            <p>
              <strong>Periode Survei:</strong> Triwulan II 2026 (April–Juni).
              Target responden: 500 orang.
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-hero-skm {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .section-hero-skm .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-skm .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-skm h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-skm p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .dash-info-banner {
          display: flex; gap: 0.75rem; align-items: flex-start;
          background: #eff6ff; border: 1px solid #bfdbfe;
          border-radius: var(--radius); padding: 1rem;
          margin-bottom: 0;
          font-size: 0.8125rem; color: #1e40af; line-height: 1.5;
        }
        .dash-info-icon { font-size: 1.125rem; flex-shrink: 0; margin-top: 1px; }
        .dash-info-text { }

        .dash-footer-info {
          margin-top: 2rem; padding: 1.25rem;
          background: var(--gray-50); border-radius: var(--radius);
          font-size: 0.75rem; color: var(--gray-500); line-height: 1.8;
        }
        .dash-footer-info p { margin: 0; }
        .dash-footer-info p + p { margin-top: 0.5rem; }

        @media (max-width: 576px) {
          .section-hero-skm { padding: 1.5rem 0 1.25rem; }
          .section-hero-skm h1 { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
}
