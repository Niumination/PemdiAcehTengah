import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 — Halaman Tidak Ditemukan | Pemdi Aceh Tengah</title>
        <meta name="description" content="Halaman yang Anda cari tidak ditemukan. Kembali ke beranda atau cari informasi yang Anda butuhkan." />
        <meta name="robots" content="noindex, follow" />
      </Head>

      <section style={{
        padding: '4rem 1.5rem',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
      }}>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', fontWeight: 800, color: '#1d70b8', lineHeight: 1, marginBottom: '0.25rem' }}>
            404
          </div>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>
            🔍
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.75rem' }}>
            Halaman Tidak Ditemukan
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#505a5f', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 1.5rem' }}>
            Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
            Periksa kembali URL atau gunakan fitur pencarian di bawah.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/" className="btn btn-primary btn-lg">
              ← Kembali ke Beranda
            </Link>
            <Link href="/cari" className="btn btn-outline btn-lg">
              🔍 Cari di Portal
            </Link>
          </div>

          <div style={{
            background: 'white', borderRadius: '12px', padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb',
          }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333', marginBottom: '0.75rem' }}>
              Atau langsung ke halaman utama:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {[
                { href: '/', label: '🏠 Beranda' },
                { href: '/pemdi', label: '📊 Indeks Pemdi' },
                { href: '/probis', label: '📋 Peta Proses Bisnis' },
                { href: '/layanan', label: '🛠️ Layanan Publik' },
                { href: '/faq', label: '❓ FAQ' },
                { href: '/skm', label: '📝 Survei Kepuasan' },
                { href: '/tanya', label: '💬 Tanya Jawab' },
                { href: '/cari', label: '🔍 Pencarian' },
              ].map((l, i) => (
                <Link key={i} href={l.href}
                  style={{
                    display: 'block', padding: '0.625rem 0.75rem',
                    background: '#f8f9fa', borderRadius: '8px',
                    fontSize: '0.8125rem', color: '#1d70b8',
                    textDecoration: 'none', fontWeight: 500,
                    transition: 'background 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#e8f0fe'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#f8f9fa'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#888' }}>
            Portal Pemdi Aceh Tengah — Pemerintah Kabupaten Aceh Tengah
          </p>
        </div>
      </section>
    </>
  );
}
