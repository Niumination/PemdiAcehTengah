import { useState, useMemo } from 'react';
import Head from 'next/head';
import glosariumData from '@/data/glosarium.json';

// Helper untuk mendapatkan warna badge per kategori
function getKategoriWarna(kategori) {
  const warnaMap = {
    'Konsep': '#1d70b8',
    'Penilaian': '#e65100',
    'Tata Kelola': '#00703c',
    'Umum': '#6b7280',
    'Layanan': '#28a197',
    'Regulasi': '#6f42c1',
  };
  return warnaMap[kategori] || '#6b7280';
}

export default function GlosariumPage() {
  const [query, setQuery] = useState('');

  // Filter glosarium berdasarkan input pencarian
  const filtered = useMemo(() => {
    if (!query.trim()) return glosariumData;
    const q = query.toLowerCase();
    return glosariumData.filter(
      (entry) =>
        entry.istilah.toLowerCase().includes(q) ||
        (entry.singkat && entry.singkat.toLowerCase().includes(q)) ||
        (entry.lengkap && entry.lengkap.toLowerCase().includes(q)) ||
        (entry.kepanjangan && entry.kepanjangan.toLowerCase().includes(q))
    );
  }, [query]);

  // Group berdasarkan kategori
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((entry) => {
      const cat = entry.kategori || 'Lainnya';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(entry);
    });
    return groups;
  }, [filtered]);

  return (
    <>
      <Head>
        <title>📖 Glosarium — Istilah Pemerintah Digital | Pemdi Aceh Tengah</title>
        <meta name="description" content="Kumpulan istilah teknis dalam portal Pemdi Aceh Tengah, dijelaskan dengan bahasa sederhana." />
      </Head>

      <a href="#glosarium-content" className="skip-link">Lompat ke daftar istilah</a>

      {/* ============ HERO ============ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #004098 0%, #002060 100%)',
          color: 'white',
          padding: '3rem 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
            📖 Glosarium — Istilah Pemerintah Digital
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Kumpulan istilah teknis dalam portal Pemdi Aceh Tengah, dijelaskan dengan bahasa sederhana.
          </p>
        </div>
      </section>

      {/* ============ SEARCH ============ */}
      <section className="section" style={{ padding: '1.5rem 0' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div style={{ position: 'relative' }}>
            <input
              id="glosarium-search"
              type="text"
              placeholder="Cari istilah, singkatan, atau penjelasan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari istilah dalam glosarium"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '10px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.9375rem',
                transition: 'border-color 0.2s',
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#004098'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; }}
            />
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.125rem',
                color: '#9ca3af',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              🔍
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
            {filtered.length} dari {glosariumData.length} istilah ditemukan
          </p>
        </div>
      </section>

      {/* ============ GLOSARIUM CONTENT ============ */}
      <section className="section" id="glosarium-content" style={{ paddingTop: 0, paddingBottom: '2.5rem' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          {Object.keys(grouped).length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>❌</div>
              <p style={{ fontSize: '0.9375rem', color: '#6b7280' }}>
                Tidak ada istilah ditemukan untuk &ldquo;{query}&rdquo;
              </p>
            </div>
          )}

          {Object.entries(grouped).map(([kategori, entries]) => (
            <div key={kategori} style={{ marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white',
                  background: getKategoriWarna(kategori),
                  marginBottom: '0.75rem',
                }}
              >
                {kategori}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    id={`glossary-${entry.id}`}
                    className="glossary-card"
                    style={{
                      background: 'white',
                      border: '1px solid #e5e5e5',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      scrollMarginTop: '80px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <h3
                        id={`glossary-title-${entry.id}`}
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#111',
                          margin: 0,
                        }}
                      >
                        {entry.istilah}
                      </h3>
                      <a
                        href={`#glossary-${entry.id}`}
                        aria-label={`Link langsung ke ${entry.istilah}`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af',
                          textDecoration: 'none',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                        title="Salin tautan"
                      >
                        🔗
                      </a>
                    </div>

                    {entry.kepanjangan && (
                      <p
                        style={{
                          fontSize: '0.8125rem',
                          color: '#6b7280',
                          margin: '0 0 0.5rem',
                          fontWeight: 500,
                        }}
                      >
                        {entry.kepanjangan}
                      </p>
                    )}

                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: '#b8860b',
                        fontStyle: 'italic',
                        margin: '0 0 0.5rem',
                        lineHeight: 1.5,
                      }}
                    >
                      Singkatnya: {entry.singkat}
                    </p>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: '#333',
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {entry.lengkap}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .glossary-card {
          transition: box-shadow 0.15s;
        }
        .glossary-card:hover {
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .glossary-card:target {
          border-color: #004098;
          box-shadow: 0 0 0 3px rgba(0,64,152,0.15);
        }
      `}</style>
    </>
  );
}
