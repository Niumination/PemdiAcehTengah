import Head from 'next/head';
import { useState, useMemo } from 'react';
import moduls from '@/data/modul-indikator.json';

const ASPEK_WARNA = {
  'Aspek 1 — Tata Kelola': { border: '#3b82f6', bg: '#eff6ff', badgebg: '#dbeafe', badgecolor: '#1e40af' },
  'Aspek 2 — Infrastruktur & Layanan': { border: '#10b981', bg: '#ecfdf5', badgebg: '#d1fae5', badgecolor: '#065f46' },
  'Aspek 3 — Layanan Digital': { border: '#f59e0b', bg: '#fffbeb', badgebg: '#fef3c7', badgecolor: '#92400e' },
  'Aspek 4 — Pendanaan & SDM': { border: '#8b5cf6', bg: '#f5f3ff', badgebg: '#ede9fe', badgecolor: '#5b21b6' },
  'Aspek 5 — Proses Bisnis': { border: '#ec4899', bg: '#fdf2f8', badgebg: '#fce7f3', badgecolor: '#9d174d' },
};

export default function ModulIndikatorPage() {
  const [cari, setCari] = useState('');
  const [aspekFilter, setAspekFilter] = useState('all');
  const [bukaModul, setBukaModul] = useState(null);

  // Group by aspek
  const byAspek = useMemo(() => {
    const map = {};
    moduls.modules.forEach((m) => {
      if (!map[m.aspek]) map[m.aspek] = [];
      map[m.aspek].push(m);
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = moduls.modules;
    if (aspekFilter !== 'all') list = list.filter((m) => m.aspek === aspekFilter);
    if (cari) {
      const q = cari.toLowerCase();
      list = list.filter((m) =>
        m.judul.toLowerCase().includes(q) || m.ringkasan.toLowerCase().includes(q)
      );
    }
    return list;
  }, [aspekFilter, cari]);

  const semuaAspek = Object.keys(byAspek);

  return (
    <>
      <Head>
        <title>Modul Indikator Pemdi — Pemdi Aceh Tengah</title>
        <meta name="description" content="20 modul indikator Pemerintah Digital (Pemdi) berdasarkan PermenPANRB 8/2026 — Kabupaten Aceh Tengah." />
      </Head>

      <section className="hero">
        <div className="container">
          <a href="/" className="back-link">← Beranda</a>
          <div style={{ marginTop: '1rem' }}>
            <h1>📋 Modul Indikator Pemdi</h1>
            <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>
              {moduls.total_modul} indikator · {moduls.total_gambar} bukti dukung · PermenPANRB 8/2026
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <input
              type="text"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              placeholder="Cari indikator..."
              style={{
                flex: 1, minWidth: '200px', padding: '0.75rem 1rem',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '0.875rem', background: 'var(--card-bg)',
              }}
            />
            <select
              value={aspekFilter}
              onChange={(e) => setAspekFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem', border: '1px solid var(--border)',
                borderRadius: '8px', fontSize: '0.875rem', background: 'var(--card-bg)',
                cursor: 'pointer',
              }}
            >
              <option value="all">Semua Aspek</option>
              {semuaAspek.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Stats bar */}
          <div className="stat-row" style={{ marginBottom: '1.5rem' }}>
            <span className="stat-badge">{filtered.length} modul ditampilkan</span>
          </div>

          {/* Module list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((modul) => {
              const warna = ASPEK_WARNA[modul.aspek] || { border: '#6b7280', bg: '#f9fafb', badgebg: '#f3f4f6', badgecolor: '#374151' };
              const isOpen = bukaModul === modul.nomor;

              return (
                <div
                  key={modul.nomor}
                  style={{
                    border: `1px solid ${warna.border}20`,
                    borderRadius: '12px',
                    background: 'var(--card-bg)',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                    boxShadow: isOpen ? `0 0 0 2px ${warna.border}30` : 'none',
                  }}
                >
                  {/* Header / clickable */}
                  <button
                    onClick={() => setBukaModul(isOpen ? null : modul.nomor)}
                    style={{
                      width: '100%', padding: '1rem 1.25rem',
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                      fontSize: '0.875rem', fontFamily: 'inherit',
                    }}
                  >
                    <span style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: warna.badgebg, color: warna.badgecolor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '0.8rem', flexShrink: 0,
                    }}>
                      {modul.nomor}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ color: 'var(--text)', fontSize: '0.95rem' }}>
                        {modul.judul}
                      </strong>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.7rem', padding: '0.15rem 0.5rem',
                          borderRadius: '4px', background: warna.badgebg,
                          color: warna.badgecolor,
                        }}>
                          {modul.aspek}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                          {modul.gambar} lampiran
                        </span>
                      </div>
                    </div>
                    <span style={{ color: 'var(--muted)', fontSize: '1.2rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      ▾
                    </span>
                  </button>

                  {/* Content (expandable) */}
                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1.25rem',
                      borderTop: `1px solid ${warna.border}15`,
                    }}>
                      {modul.ringkasan && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                          {modul.ringkasan}
                        </p>
                      )}
                      <div
                        className="modul-content"
                        dangerouslySetInnerHTML={{ __html: modul.html }}
                        style={{ fontSize: '0.85rem', lineHeight: '1.7' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style jsx>{`
        .modul-content :global(h2) {
          font-size: 1.1rem;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .modul-content :global(h3) {
          font-size: 0.95rem;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          color: var(--text);
        }
        .modul-content :global(h1.modul-title) {
          display: none;
        }
        .modul-content :global(p) {
          margin-bottom: 0.5rem;
          color: var(--muted);
        }
        .modul-content :global(ul) {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .modul-content :global(li) {
          margin-bottom: 0.25rem;
          color: var(--muted);
        }
        .modul-content :global(table) {
          width: 100%;
          border-collapse: collapse;
          margin: 0.75rem 0;
          font-size: 0.8rem;
          background: var(--bg);
          border-radius: 8px;
          overflow: hidden;
        }
        .modul-content :global(td) {
          padding: 0.75rem;
          border: 1px solid var(--border);
          vertical-align: top;
        }
        .modul-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.75rem 0;
          border: 1px solid var(--border);
        }
        .modul-content :global(strong) {
          color: var(--text);
        }
      `}</style>
    </>
  );
}
