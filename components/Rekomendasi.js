function getDampakBadge(dampak) {
  if (dampak === 'Tinggi') return 'badge-red';
  if (dampak === 'Sedang') return 'badge-orange';
  return 'badge-gray';
}

function getKesulitanBadge(kesulitan) {
  if (kesulitan === 'Tinggi') return 'badge-red';
  if (kesulitan === 'Sedang') return 'badge-orange';
  return 'badge-gray';
}

export default function Rekomendasi({ data }) {
  const rekomendasi = data?.rekomendasi || [];
  if (!rekomendasi.length) return null;

  return (
    <div className="timeline">
      {rekomendasi.map((r, i) => (
        <div className="timeline-item" key={i}>
          <div className={`timeline-dot ${r.dampak === 'Tinggi' ? 'high' : 'medium'}`} />
          <h4>
            {r.prioritas}. {r.judul}
          </h4>
          <p>{r.deskripsi}</p>
          <div className="timeline-meta">
            <span>
              Dampak: <span className={`badge ${getDampakBadge(r.dampak)}`} style={{ fontSize: '0.625rem' }}>{r.dampak}</span>
            </span>
            <span>
              Kesulitan: <span className={`badge ${getKesulitanBadge(r.kesulitan)}`} style={{ fontSize: '0.625rem' }}>{r.kesulitan}</span>
            </span>
            <span>Target: {r.timeline}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
