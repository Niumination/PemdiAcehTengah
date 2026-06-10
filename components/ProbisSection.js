import { useState } from 'react';

export default function ProbisSection({ data }) {
  const probis = data?.probis;
  const [activeUrusan, setActiveUrusan] = useState(null);

  if (!probis) return null;

  return (
    <div className="probis-tree">
      {/* Level 0: Visi & Misi */}
      <div className="probis-level">
        <div className="probis-level-header">
          <div className="probis-level-tag">0</div>
          <div>
            <h3>{probis.level_0?.label}</h3>
            <div className="probis-level-desc">{probis.level_0?.deskripsi}</div>
          </div>
        </div>
        <div className="grid grid-4" style={{ gap: '0.75rem' }}>
          {probis.level_0?.misi?.map((misi, i) => (
            <div
              key={i}
              className="probis-card"
              style={{ borderLeft: '3px solid var(--primary)', padding: '0.75rem 1rem' }}
            >
              <h4 style={{ fontSize: '0.8125rem', marginBottom: 0 }}>{misi.nama || misi}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Level 1: Urusan Pemerintahan */}
      <div className="probis-level">
        <div className="probis-level-header">
          <div className="probis-level-tag">1</div>
          <div>
            <h3>{probis.level_1?.label}</h3>
            <div className="probis-level-desc">{probis.level_1?.deskripsi} — {probis.level_1?.urusan?.length} urusan konkuren</div>
          </div>
        </div>
        <div className="grid grid-3" style={{ gap: '0.75rem' }}>
          {probis.level_1?.urusan?.map((u, i) => (
            <div
              key={i}
              className={`probis-card ${activeUrusan === i ? 'active' : ''}`}
              onClick={() => setActiveUrusan(activeUrusan === i ? null : i)}
            >
              <div className="probis-card-header">
                <h4>{u.nama}</h4>
                <span className="badge badge-blue" style={{ fontSize: '0.625rem', whiteSpace: 'nowrap' }}>
                  {u.opd_terkait?.length}
                </span>
              </div>
              <div className="opd-tags">
                {u.opd_terkait?.map((opd, j) => (
                  <span key={j} className="opd-tag">{opd}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level 2: Proses Bisnis OPD */}
      <div className="probis-level">
        <div className="probis-level-header">
          <div className="probis-level-tag">2</div>
          <div>
            <h3>{probis.level_2?.label}</h3>
            <div className="probis-level-desc">{probis.level_2?.deskripsi}</div>
          </div>
        </div>
        <div className="grid grid-2" style={{ gap: '0.75rem' }}>
          {probis.level_2?.kategori?.map((k, i) => (
            <div
              key={i}
              className="probis-card"
              style={{ borderLeft: `3px solid ${k.warna}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{k.icon}</span>
                <h4 style={{ fontSize: '0.9375rem', marginBottom: 0, color: k.warna }}>
                  {k.nama}
                </h4>
                <span className="badge" style={{
                  background: k.warna, color: 'white', fontSize: '0.625rem',
                  padding: '0.15rem 0.5rem', borderRadius: '100px', marginLeft: 'auto'
                }}>
                  {k.proses?.length || 0}
                </span>
              </div>
              <p className="mt-1" style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                {k.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
