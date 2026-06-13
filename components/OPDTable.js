import { useState } from 'react';

export default function OPDTable({ data }) {
  const opd = data?.opd;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  if (!opd) return null;

  const filtered = opd.daftar.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.urusan.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, filtered.length);
  const pageData = filtered.slice(start, end);

  // Reset halaman saat search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Cari perangkat daerah..."
          value={search}
          onChange={handleSearch}
          style={{
            flex: '1 1 280px',
            padding: '0.625rem 1rem',
            border: '1px solid var(--line, #dee2e6)',
            borderRadius: 'var(--r-sm, 8px)',
            font: 'inherit',
            fontSize: '0.875rem',
            background: 'var(--surface, #fff)',
            color: 'var(--ink, #212529)',
          }}
        />
        <span style={{ fontSize: '0.8125rem', color: 'var(--muted, #94a3b8)', fontWeight: 600 }}>
          {filtered.length} dari {opd.daftar.length} PD
        </span>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th>Perangkat Daerah</th>
              <th style={{ width: 80 }}>Level</th>
              <th style={{ width: 72, textAlign: 'right' }}>ASN</th>
              <th>Urusan</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((d) => (
              <tr key={d.id}>
                <td style={{ color: 'var(--muted)' }}>{d.id}</td>
                <td style={{ fontWeight: 600 }}>
                  {d.nama}
                  <small style={{ display: 'block', color: 'var(--muted)', fontWeight: 400, fontSize: '0.675rem' }}>
                    {d.singkatan}
                  </small>
                </td>
                <td>
                  <span className="badge badge-blue">{d.level || '-'}</span>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                  {d.jumlah_asn > 0 ? d.jumlah_asn.toLocaleString() : <span style={{ color: 'var(--muted)' }}>—</span>}
                </td>
                <td style={{ color: 'var(--ink-2)', fontSize: '0.8125rem' }}>{d.urusan}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tbl-foot">
          <span>Menampilkan {filtered.length > 0 ? `${start + 1}–${end}` : '0'} dari {filtered.length} data</span>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button
              className="tb-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{ opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'default' : 'pointer' }}
            >
              ‹ Sebelumnya
            </button>
            {totalPages > 1 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 0.5rem', fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {page} / {totalPages}
              </span>
            )}
            <button
              className="tb-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              style={{ opacity: page >= totalPages ? 0.4 : 1, cursor: page >= totalPages ? 'default' : 'pointer' }}
            >
              Berikutnya ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
