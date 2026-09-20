import { useState, useMemo } from 'react';
import Link from 'next/link';
import slugify from '@/lib/slugify';

export default function OPDTable({ list = [], layananCountMap = {} }) {
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('');
  const [page, setPage] = useState(1);
  // Phase 4: desktop dapat memilih Tabel/Grid; di ponsel CSS memaksa stacked cards (.opd-stack)
  const [view, setView] = useState('table');
  const pageSize = 12;

  /* Get service count for an OPD — fuzzy match via normalized name */
  function getLayananCount(opd) {
    const normalized = opd.nama
      .toLowerCase()
      .replace(/\(.*?\)/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 1) Exact match
    if (layananCountMap[normalized]) return layananCountMap[normalized];
    
    // 2) Partial containment — one contains the other
    for (const [key, count] of Object.entries(layananCountMap)) {
      if (key === '__kecamatan__') continue;
      if (normalized.includes(key) || key.includes(normalized)) {
        return count;
      }
    }
    
    // 3) Token overlap — split into words, find the key with most shared words
    const tokens = normalized.split(' ').filter(Boolean);
    let bestScore = 0;
    let bestCount = 0;
    for (const [key, count] of Object.entries(layananCountMap)) {
      if (key === '__kecamatan__') continue;
      const keyTokens = key.split(' ').filter(Boolean);
      const shared = tokens.filter(t => keyTokens.includes(t)).length;
      if (shared > bestScore) {
        bestScore = shared;
        bestCount = count;
      }
    }
    if (bestScore >= Math.min(tokens.length, 3)) return bestCount;

    // 4) Singkatan fallback
    const bySingkat = Object.entries(layananCountMap).find(([key]) =>
      opd.singkat && key.includes(opd.singkat.toLowerCase())
    );
    if (bySingkat) return bySingkat[1];
    
    // 5) Kecamatan → share "Semua Kecamatan" service count
    if (opd.jenis === 'kecamatan' && layananCountMap.__kecamatan__) {
      return layananCountMap.__kecamatan__;
    }
    return 0;
  }

  // Unique OPD Categories
  const kategoriOptions = useMemo(() => {
    const set = new Set();
    list.forEach((item) => {
      const kat = item.kategori || item.level;
      if (kat) set.add(kat);
    });
    return Array.from(set).sort();
  }, [list]);

  // Filtered List
  const filteredList = useMemo(() => {
    const q = search.toLowerCase().trim();
    return list.filter((item) => {
      const matchSearch =
        !q ||
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        ((item.singkatan || item.singkat) && (item.singkatan || item.singkat).toLowerCase().includes(q)) ||
        (item.kode && item.kode.toLowerCase().includes(q));
      const matchKategori = !kategoriFilter || (item.kategori || item.level) === kategoriFilter;
      return matchSearch && matchKategori;
    });
  }, [list, search, kategoriFilter]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page, pageSize]);

  return (
    <div className="glow-card" style={{ padding: '24px' }}>
      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <label htmlFor="opd-search" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
            Cari Perangkat Daerah / OPD / Kecamatan
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="opd-search"
              type="text"
              placeholder="Ketik nama OPD atau singkatan (contoh: Diskominfo, Bappeda, Bebesen)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  fontSize: '0.85rem',
                }}
                aria-label="Hapus pencarian"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div style={{ minWidth: '200px' }}>
          <label htmlFor="opd-category-select" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>
            Filter Kategori Instansi
          </label>
          <select
            id="opd-category-select"
            value={kategoriFilter}
            onChange={(e) => {
              setKategoriFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Kategori ({list.length} OPD)</option>
            {kategoriOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggle tampilan (desktop) */}
      <div className="opd-viewbar">
        <span className="muted" style={{ fontSize: '0.8rem' }}>{filteredList.length} Perangkat Daerah</span>
        <div className="seg" role="group" aria-label="Pilih tampilan daftar OPD">
          <button type="button" className={`seg-btn ${view === 'table' ? 'active' : ''}`} aria-pressed={view === 'table'} onClick={() => setView('table')}>☰ Tabel</button>
          <button type="button" className={`seg-btn ${view === 'grid' ? 'active' : ''}`} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>▦ Grid</button>
        </div>
      </div>

      {paginatedList.length === 0 ? (
        <div className="opd-empty">Tidak ada Perangkat Daerah yang cocok dengan kata kunci &ldquo;{search}&rdquo;.</div>
      ) : view === 'grid' ? (
        <ul className="opd-grid" aria-label="Daftar Perangkat Daerah (grid)">
          {paginatedList.map((opd) => (
            <li key={opd.id || opd.nama} className="opd-card">
              <div className="opd-card-top">
                <span className="opd-kode">{opd.kode || opd.singkat || opd.singkatan || '—'}</span>
                <span className="badge badge-blue">{opd.kategori || opd.level || 'OPD'}</span>
              </div>
              <div className="opd-nama">{opd.nama}</div>
              <div className="opd-card-foot">
                <span className="opd-count">{getLayananCount(opd)} layanan</span>
                <Link href={`/opd/${slugify(opd.nama)}`} className="btn btn-outline btn-sm">Detail →</Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="tbl-wrap opd-stack">
          <table>
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Kode</th>
                <th>Nama Perangkat Daerah (OPD)</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'center' }}>Layanan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.map((opd) => (
                <tr key={opd.id || opd.nama}>
                  <td data-th="Kode" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {opd.kode || opd.singkat || '—'}
                  </td>
                  <td data-th="Perangkat Daerah">
                    <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: '0.92rem' }}>{opd.nama}</div>
                    {opd.urusan && <span className="muted" style={{ fontSize: '0.75rem', display: 'block', marginTop: '2px' }}>{opd.urusan}</span>}
                  </td>
                  <td data-th="Kategori"><span className="badge badge-blue">{opd.kategori || opd.level || 'OPD'}</span></td>
                  <td data-th="Layanan" style={{ textAlign: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    {getLayananCount(opd)}
                  </td>
                  <td data-th="" style={{ textAlign: 'right' }}>
                    <Link href={`/opd/${slugify(opd.nama)}`} className="btn btn-outline btn-sm">Detail Profil →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            Menampilkan {paginatedList.length} dari {filteredList.length} Perangkat Daerah
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Sebelumnya
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 8px', color: 'var(--ink)' }}>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Berikutnya ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
