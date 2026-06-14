/**
 * ServiceFinder — Pencarian & filter layanan interaktif
 * Props:
 *   layanan  — array of service objects (flattened, each with nama, kategori, deskripsi, dll)
 *   onSelect — callback saat service dipilih (opsional)
 */
import { useState, useMemo } from 'react';
import ServiceCard from './ServiceCard';

export default function ServiceFinder({ layanan = [], onSelect }) {
  const [search, setSearch] = useState('');
  const [aktifKategori, setAktifKategori] = useState('');

  // Ekstrak kategori unik dari data
  const kategoriList = useMemo(() => {
    const set = new Set();
    layanan.forEach((l) => {
      if (l.kategori) set.add(l.kategori);
    });
    return ['Semua', ...Array.from(set)];
  }, [layanan]);

  // Filter hasil berdasarkan search + kategori
  const hasil = useMemo(() => {
    const q = search.toLowerCase().trim();
    return layanan.filter((l) => {
      const matchSearch =
        !q ||
        (l.nama && l.nama.toLowerCase().includes(q)) ||
        (l.deskripsi && l.deskripsi.toLowerCase().includes(q));
      const matchKategori =
        !aktifKategori || aktifKategori === 'Semua' || l.kategori === aktifKategori;
      return matchSearch && matchKategori;
    });
  }, [layanan, search, aktifKategori]);

  return (
    <div className="service-finder">
      {/* Search bar */}
      <div
        className="sf-search"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-sm)',
          padding: '0.625rem 1rem',
          marginBottom: '1rem',
          transition: 'border-color 0.15s',
        }}
      >
        <span style={{ color: 'var(--muted)', fontSize: '1rem', flexShrink: 0 }}>🔍</span>
        <input
          type="text"
          placeholder="Cari layanan publik..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari layanan"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            color: 'var(--ink)',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontSize: '0.875rem',
              padding: '0.25rem',
            }}
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag filter kategori */}
      <div
        className="sf-tags"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.25rem',
        }}
      >
        {kategoriList.map((kat) => {
          const isActive = (kat === 'Semua' && !aktifKategori) || kat === aktifKategori;
          return (
            <button
              key={kat}
              className={'sf-tag' + (isActive ? ' sf-tag-active' : '')}
              onClick={() => setAktifKategori(kat === 'Semua' ? '' : kat)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: 99,
                border: `1px solid ${isActive ? 'var(--primary)' : 'var(--line)'}`,
                background: isActive ? 'var(--primary)' : 'var(--surface)',
                color: isActive ? '#fff' : 'var(--ink-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {kat}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="sf-results">
        {hasil.length > 0 ? (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {hasil.map((svc, i) => (
              <ServiceCard key={svc.nama + i} layanan={svc} onClick={onSelect} />
            ))}
          </div>
        ) : (
          <div
            className="sf-empty"
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--muted)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink-secondary)', marginBottom: '0.25rem' }}>
              Layanan tidak ditemukan
            </p>
            <p style={{ fontSize: '0.8125rem' }}>
              Coba gunakan kata kunci lain atau pilih kategori berbeda
            </p>
          </div>
        )}
      </div>

      {/* Hitung hasil */}
      {hasil.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--muted)',
            textAlign: 'center',
          }}
        >
          Menampilkan {hasil.length} dari {layanan.length} layanan
        </div>
      )}
    </div>
  );
}
