import Head from 'next/head';
import Link from 'next/link';
import DashboardSKM from '@/components/DashboardSKM';
import { KerawangDivider } from '@/components/motif/KerawangMotifs';
import { supabaseAdmin, isSupabaseReady } from '@/lib/supabaseAdmin';

/**
 * Sprint B3 (2026-09-18): ringkasan SKM dirender server-side (ISR 60 detik)
 * sehingga angka terlihat tanpa JavaScript dan oleh crawler — menutup temuan
 * SEO "thin content". Grafik interaktif tetap client-side (DashboardSKM).
 */
export async function getStaticProps() {
  let ringkasan = { total_responden: 0, rata_skala_4: 0, ikm_0_100: 0 };
  try {
    if (isSupabaseReady) {
      const { data } = await supabaseAdmin.from('skm_ringkasan').select('*').single();
      if (data) {
        ringkasan = {
          total_responden: data.total_responden || 0,
          rata_skala_4: data.rata_skala_4 || 0,
          ikm_0_100: data.ikm_0_100 || 0,
        };
      }
    }
  } catch (e) {
    console.warn('[dashboard-kepuasan] skm_ringkasan error:', e.message);
  }
  return { props: { ringkasan }, revalidate: 60 };
}

export default function DashboardKepuasan({ ringkasan }) {
  return (
    <>
      <Head>
        <title>Dashboard Kepuasan Pengguna — Pemdi Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard publik hasil Survei Kepuasan Masyarakat (SKM) dan rating umpan balik pengguna — Pemerintah Kabupaten Aceh Tengah. Indikator I20 PermenPANRB 8/2026."
        />
      </Head>

      <section style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
            ← Beranda
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <h1 className="gold-head" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard Kepuasan Pengguna</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>
              Transparansi hasil Survei Kepuasan Masyarakat (SKM) dan umpan balik pengguna
              — bagian dari pemenuhan <strong>Indikator I20 (Pengelolaan Kepuasan Pengguna)</strong> PermenPANRB 8/2026.
            </p>
          </div>
        </div>
      </section>

      <KerawangDivider label="Hasil Survei & Skor" icon="📈" />

      <section className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Ringkasan SSR (B3) — terlihat tanpa JavaScript & oleh crawler */}
          <div className="ssr-ringkasan-strip">
            <div className="ssr-stat">
              <span className="ssr-stat-label">👥 Total Responden</span>
              <strong className="ssr-stat-value">{ringkasan.total_responden}</strong>
            </div>
            <div className="ssr-stat">
              <span className="ssr-stat-label">📊 Rata-rata SKM</span>
              <strong className="ssr-stat-value">
                {Number(ringkasan.rata_skala_4).toLocaleString('id-ID', { maximumFractionDigits: 2 })} / 4,00
              </strong>
            </div>
            <div className="ssr-stat">
              <span className="ssr-stat-label">🎯 Indeks Kepuasan (IKM)</span>
              <strong className="ssr-stat-value">
                {Number(ringkasan.ikm_0_100).toLocaleString('id-ID', { maximumFractionDigits: 1 })} / 100
              </strong>
            </div>
          </div>
          {ringkasan.total_responden === 0 && (
            <p className="ssr-empty-note">
              Belum ada responden survei pada periode ini — angka diperbarui otomatis setiap 60 detik
              setelah survei pertama masuk melalui halaman <Link href="/skm">/skm</Link>.
            </p>
          )}

          {/* Info banner */}
          <div className="dash-info-banner">
            <div className="dash-info-icon">ℹ️</div>
            <div className="dash-info-text">
              <strong>Mekanisme Pengumpulan Data:</strong> Survei Kepuasan Masyarakat (SKM) melalui
              halaman{' '}
              <Link href="/skm" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                /skm
              </Link>{' '}
              — 8 dimensi penilaian (skala 1–4), 43 unit pelayanan. Rating umpan balik cepat
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
        .dash-info-banner {
          display: flex; gap: 0.75rem; align-items: flex-start;
          background: var(--primary-50); border: 1px solid var(--primary-200);
          border-radius: var(--radius); padding: 1rem;
          margin-bottom: 0;
          font-size: 0.8125rem; color: var(--primary); line-height: 1.5;
        }
        .dash-info-icon { font-size: 1.125rem; flex-shrink: 0; margin-top: 1px; }
        .dash-info-text { }

        .dash-footer-info {
          margin-top: 2rem; padding: 1.25rem;
          background: var(--bg-subtle); border-radius: var(--radius);
          font-size: 0.75rem; color: var(--muted); line-height: 1.8;
        }
        .dash-footer-info p { margin: 0; }
        .dash-footer-info p + p { margin-top: 0.5rem; }
      `}</style>
    </>
  );
}
