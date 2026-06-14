import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Halaman Tidak Ditemukan | Pemdi Aceh Tengah</title>
        <meta name="description" content="Halaman yang Anda cari tidak ditemukan di Portal Pemdi Aceh Tengah." />
      </Head>

      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          {/* Ilustrasi */}
          <div style={{
            fontSize: '6rem',
            lineHeight: 1,
            marginBottom: '1rem',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
          }}>
            🔍
          </div>

          {/* Judul */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--primary)',
            marginBottom: '0.5rem',
          }}>
            Halaman Tidak Ditemukan
          </h1>

          {/* Deskripsi */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--ink-secondary)',
            maxWidth: '420px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}>
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
            Periksa kembali URL atau gunakan tautan di bawah untuk kembali.
          </p>

          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.75rem',
            maxWidth: '400px',
            margin: '0 auto',
          }}>
            <Link
              href="/skm"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '1.25rem 1rem',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--sh)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>SKM</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Survei Kepuasan</span>
            </Link>

            <Link
              href="/lapor"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '1.25rem 1rem',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--sh)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📢</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>Lapor</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Sampaikan Masukan</span>
            </Link>

            <Link
              href="/cari"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '1.25rem 1rem',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--r)',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--sh)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🔎</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ink)' }}>Cari</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Telusuri Portal</span>
            </Link>

            <Link
              href="/"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '1.25rem 1rem',
                background: 'var(--primary)',
                border: '1px solid var(--primary)',
                borderRadius: 'var(--r)',
                textDecoration: 'none',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--sh-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏠</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fff' }}>Beranda</span>
              <span style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.75)' }}>Halaman Utama</span>
            </Link>
          </div>

          {/* Kembali */}
          <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
            Atau{' '}
            <button
              onClick={() => window.history.back()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                textDecoration: 'underline',
              }}
            >
              kembali ke halaman sebelumnya
            </button>
          </p>
        </div>
      </section>
    </>
  );
}
