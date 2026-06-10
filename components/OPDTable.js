import { useState } from 'react';

export default function OPDTable({ data }) {
  const opd = data?.opd;
  const [search, setSearch] = useState('');

  if (!opd) return null;

  const filtered = opd.daftar.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()) ||
    d.urusan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Cari perangkat daerah..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.625rem 1rem',
            border: '1px solid var(--gray-300)',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
          }}
        />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Perangkat Daerah</th>
              <th>Level</th>
              <th style={{ textAlign: 'right' }}>ASN</th>
              <th>Urusan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td style={{ fontWeight: 500 }}>{d.nama}</td>
                <td>
                  <span className="badge badge-blue">{d.level}</span>
                </td>
                <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {d.jumlah_asn > 0 ? d.jumlah_asn.toLocaleString() : <span style={{color:'var(--gray-400)'}}>—</span>}
                </td>
                <td style={{ color: 'var(--gray-600)', fontSize: '0.8125rem' }}>{d.urusan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-2">
        <small>{filtered.length} dari {opd.daftar.length} perangkat daerah</small>
        <small>Total: {opd.ringkasan.total_opd} PD ({opd.ringkasan.instansi} instansi + {opd.ringkasan.kecamatan} kecamatan, {opd.ringkasan.total_asn.toLocaleString()} ASN)</small>
      </div>
    </div>
  );
}
