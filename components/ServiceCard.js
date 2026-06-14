export default function ServiceCard({ layanan, kategori }) {
  const slaNum = parseInt(layanan.sla);
  const slaClass = slaNum >= 90 ? 'high' : slaNum >= 80 ? 'medium' : 'low';

  return (
    <div className="service-card" style={{ borderLeft: `4px solid ${kategori?.warna || '#004098'}` }}>
      <div className="service-card-top">
        <div
          className="service-card-icon"
          style={{
            background: `${kategori?.warna || '#004098'}12`,
            color: kategori?.warna || '#004098',
          }}
        >
          {kategori?.ikon || '📋'}
        </div>
        <div className="service-card-body">
          <h3>{layanan.nama}</h3>
          <p className="service-card-desc">{layanan.deskripsi}</p>
        </div>
      </div>
      <div className="service-card-meta">
        <div className="service-card-meta-item">
          <span>⏱</span>
          <span>{layanan.waktu}</span>
        </div>
        <div className="service-card-meta-item">
          <span>💰</span>
          <span>{layanan.biaya}</span>
        </div>
        <div className="service-card-meta-item">
          <span className={`service-card-sla`}>
            <span className="sla-bar">
              <span className={`sla-bar-fill ${slaClass}`} style={{ width: `${slaNum}%` }} />
            </span>
            <span>{layanan.sla}</span>
          </span>
        </div>
        <div className="service-card-meta-item">
          {layanan.online ? (
            <span className="badge badge-sm badge-green">Online</span>
          ) : (
            <span className="badge badge-sm badge-gray">Offline</span>
          )}
        </div>
        <div className="service-card-meta-item">
          <span className={`badge badge-sm ${layanan.status === 'Aktif' ? 'badge-green' : 'badge-red'}`}>
            {layanan.status}
          </span>
        </div>
      </div>
      <div className="service-card-opd">
        <span>📌 {kategori?.opd || kategori?.nama || '—'}</span>
        {kategori?.opd_slug && (
          <a href={`/opd/${kategori.opd_slug}`} style={{ marginLeft: '0.5rem' }}>
            Detail OPD →
          </a>
        )}
      </div>
      {layanan.persyaratan && (
        <details className="layanan-details" style={{ padding: '0 1.25rem 0.75rem' }}>
          <summary>📄 Persyaratan</summary>
          <p>{layanan.persyaratan}</p>
        </details>
      )}
    </div>
  );
}
