import { useState, useEffect } from 'react';

const DIMENSI_WARNA = [
  '#2563eb', '#7c3aed', '#0891b2', '#059669',
  '#d97706', '#dc2626', '#db2777', '#4f46e5',
];

export default function DashboardSKM() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('skm'); // skm | rating
  const [sortUnit, setSortUnit] = useState('desc');
  const [hoverDimensi, setHoverDimensi] = useState(null);
  const [hoverTren, setHoverTren] = useState(null);

  useEffect(() => {
    fetch('/api/skm/stats')
      .then(r => r.json())
      .then(j => {
        if (j.success) setData(j.data);
        else setError(j.error || 'Gagal');
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState msg={error} />;
  if (!data) return <EmptyState />;
  if (data.total_respon === 0) return <EmptyState />;

  const dimensiEntries = Object.entries(data.per_dimensi || {});
  const maxDimensi = Math.max(...dimensiEntries.map(([, v]) => v.rata_rata || 0), 1);
  const sortedUnits = [...(data.per_unit || [])].sort((a, b) =>
    sortUnit === 'desc' ? b.rata_rata - a.rata_rata : a.rata_rata - b.rata_rata
  );
  const trenData = data.tren_bulanan || [];
  const maxTren = Math.max(...trenData.map(t => t.rata_rata || 0), 1);
  const ratingDist = data.rating_website?.distribusi || {};
  const totalRating = Object.values(ratingDist).reduce((a, b) => a + b, 0);

  return (
    <div className="dashboard-skm">
      {/* Nav tabs */}
      <div className="dash-tabs">
        <button
          className={`dash-tab ${tab === 'skm' ? 'active' : ''}`}
          onClick={() => setTab('skm')}
        >
          📊 Survei SKM
        </button>
        <button
          className={`dash-tab ${tab === 'rating' ? 'active' : ''}`}
          onClick={() => setTab('rating')}
        >
          ⭐ Rating Website
        </button>
      </div>

      {tab === 'skm' && (
        <>
          {/* Kartu statistik */}
          <div className="dash-stats">
            <StatCard icon="👥" label="Total Responden" value={data.total_respon} />
            <StatCard icon="📈" label="Rata-rata SKM" value={data.rata_rata} suffix="/ 4,00" color={getColor(data.rata_rata, 4)} />
            <StatCard icon="🎯" label="Indeks Kepuasan" value={data.ikm_0_100} suffix="/ 100" color={getColor(data.ikm_0_100, 100)} />
            <StatCard icon="🏆" label="Unit Tertinggi" value={data.per_unit?.[0]?.unit || '-'} small />
          </div>

          {/* Chart per dimensi */}
          <div className="dash-card">
            <h3 className="dash-card-title">Nilai per Dimensi SKM</h3>
            <p className="dash-card-subtitle">Rata-rata 8 dimensi penilaian (skala 1–4)</p>
            <div className="dash-chart-bars">
              {dimensiEntries.map(([key, val], i) => (
                <div
                  key={key}
                  className="dash-bar-row"
                  onMouseEnter={() => setHoverDimensi(key)}
                  onMouseLeave={() => setHoverDimensi(null)}
                >
                  <div className="dash-bar-label">
                    <span className="dash-bar-id" style={{ background: DIMENSI_WARNA[i % 8] }}>{i + 1}</span>
                    <span>{val.label}</span>
                  </div>
                  <div className="dash-bar-track">
                    <div
                      className="dash-bar-fill"
                      style={{
                        width: `${(val.rata_rata / 4) * 100}%`,
                        background: DIMENSI_WARNA[i % 8],
                      }}
                    />
                    {(hoverDimensi === key || !hoverDimensi) && (
                      <span className="dash-bar-val">{val.rata_rata}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tren bulanan + Ranking unit — GRID 2 kolom */}
          <div className="dash-grid-2">
            {/* Tren bulanan */}
            <div className="dash-card">
              <h3 className="dash-card-title">Tren Bulanan SKM</h3>
              <p className="dash-card-subtitle">6 bulan terakhir</p>
              {trenData.length > 0 ? (
                <div className="dash-tren">
                  <div className="dash-tren-chart">
                    {trenData.map((t, i) => (
                      <div
                        key={t.bulan}
                        className="dash-tren-bar-wrap"
                        onMouseEnter={() => setHoverTren(i)}
                        onMouseLeave={() => setHoverTren(null)}
                      >
                        <div className="dash-tren-bar" style={{ height: `${(t.rata_rata / maxTren) * 140}px` }}>
                          {(hoverTren === i || trenData.length <= 3) && (
                            <span className="dash-tren-val">{t.rata_rata}</span>
                          )}
                        </div>
                        <span className="dash-tren-label">{formatBulan(t.bulan)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="dash-empty-small">Belum ada data survei masuk</p>
              )}
            </div>

            {/* Ranking unit */}
            <div className="dash-card">
              <div className="dash-card-header">
                <h3 className="dash-card-title">Ranking Unit Pelayanan</h3>
                <button
                  className="dash-sort-btn"
                  onClick={() => setSortUnit(sortUnit === 'desc' ? 'asc' : 'desc')}
                  title={`Urutkan ${sortUnit === 'desc' ? 'naik' : 'turun'}`}
                >
                  {sortUnit === 'desc' ? '↓ Tertinggi' : '↑ Terendah'}
                </button>
              </div>
              {sortedUnits.length > 0 ? (
                <div className="dash-unit-list">
                  {sortedUnits.slice(0, 12).map((u, i) => (
                    <div key={u.unit} className="dash-unit-row">
                      <span className={`dash-unit-rank ${i < 3 ? 'top' : ''}`}>{i + 1}</span>
                      <span className="dash-unit-name">{u.unit}</span>
                      <span className="dash-unit-score" style={{ color: getColor(u.rata_rata, 4) }}>
                        {u.rata_rata}
                      </span>
                      <span className="dash-unit-count">{u.jumlah} respon</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dash-empty-small">Belum ada data survei masuk</p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'rating' && (
        <>
          {/* Kartu statistik rating */}
          <div className="dash-stats">
            <StatCard icon="⭐" label="Rata-rata Rating" value={data.rating_website?.rata_rata || 0} suffix="/ 5,00" color={getColor(data.rating_website?.rata_rata || 0, 5)} />
            <StatCard icon="📝" label="Total Umpan Balik" value={totalRating} />
            <StatCard icon="👍" label="Rating 4–5" value={((ratingDist[4] + ratingDist[5]) / (totalRating || 1) * 100).toFixed(0) + '%'} />
            <StatCard icon="📊" label="Halaman dengan Rating" value={Object.keys(data.per_dimensi || {}).filter(k => k.startsWith('/')).length || '-'} small />
          </div>

          {/* Distribusi rating */}
          <div className="dash-card">
            <h3 className="dash-card-title">Distribusi Rating ⭐</h3>
            <p className="dash-card-subtitle">Sebaran rating 1–5 dari pengunjung website</p>
            <div className="dash-rating-dist">
              {[5, 4, 3, 2, 1].map(b => {
                const pct = totalRating > 0 ? ((ratingDist[b] || 0) / totalRating * 100) : 0;
                return (
                  <div key={b} className="dash-rating-row">
                    <span className="dash-rating-star">{b} ★</span>
                    <div className="dash-bar-track">
                      <div
                        className="dash-bar-fill dash-bar-rating"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="dash-rating-count">{ratingDist[b] || 0}</span>
                    <span className="dash-rating-pct">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .dashboard-skm { margin-top: 1.5rem; }

        .dash-tabs {
          display: flex; gap: 0;
          background: var(--gray-100); border-radius: var(--radius) var(--radius) 0 0;
          overflow: hidden;
        }
        .dash-tab {
          flex: 1; padding: 0.75rem 1rem; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
          background: transparent; color: var(--gray-500);
          transition: all 0.15s;
        }
        .dash-tab:hover { background: var(--gray-200); color: var(--gray-700); }
        .dash-tab.active {
          background: var(--white); color: var(--primary);
          box-shadow: 0 -2px 0 var(--primary);
        }

        .dash-stats {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem; margin-bottom: 1.5rem; margin-top: 1.5rem;
        }

        .dash-card {
          background: var(--white); border: 1px solid var(--gray-200);
          border-radius: var(--radius); padding: 1.25rem; margin-bottom: 1.25rem;
        }
        .dash-card-title {
          font-size: 0.9375rem; font-weight: 600; color: var(--gray-900);
          margin: 0 0 0.25rem;
        }
        .dash-card-subtitle {
          font-size: 0.75rem; color: var(--gray-400); margin: 0 0 1rem;
        }
        .dash-card-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .dash-chart-bars { display: flex; flex-direction: column; gap: 0.625rem; }
        .dash-bar-row { display: flex; align-items: center; gap: 0.75rem; }
        .dash-bar-label {
          display: flex; align-items: center; gap: 0.5rem;
          min-width: 160px; font-size: 0.8125rem; color: var(--gray-700);
        }
        .dash-bar-id {
          width: 22px; height: 22px; border-radius: 4px;
          color: white; font-size: 0.625rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-bar-track {
          flex: 1; height: 24px; background: var(--gray-100);
          border-radius: 6px; position: relative; overflow: visible;
        }
        .dash-bar-fill {
          height: 100%; border-radius: 6px; transition: width 0.6s ease;
          position: relative;
        }
        .dash-bar-val {
          position: absolute; right: -2.5rem; top: 50%; transform: translateY(-50%);
          font-size: 0.8125rem; font-weight: 600; color: var(--gray-700);
          white-space: nowrap;
        }
        .dash-bar-rating {
          min-width: 0 !important;
          transition: none;
        }

        .dash-grid-2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }

        .dash-tren-chart {
          display: flex; align-items: flex-end; gap: 0.5rem; height: 180px;
          padding-top: 1.5rem;
        }
        .dash-tren-bar-wrap {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          gap: 0.375rem;
        }
        .dash-tren-bar {
          width: 100%; max-width: 40px; border-radius: 4px 4px 0 0;
          background: var(--primary);
          transition: height 0.6s ease; position: relative;
        }
        .dash-tren-val {
          position: absolute; top: -1.25rem; left: 50%; transform: translateX(-50%);
          font-size: 0.6875rem; font-weight: 600; color: var(--gray-700);
          white-space: nowrap;
        }
        .dash-tren-label { font-size: 0.625rem; color: var(--gray-400); }

        .dash-sort-btn {
          background: var(--gray-100); border: 1px solid var(--gray-200);
          border-radius: 6px; padding: 0.25rem 0.625rem; font-size: 0.6875rem;
          cursor: pointer; color: var(--gray-600); font-family: var(--font-body);
        }
        .dash-sort-btn:hover { background: var(--gray-200); }

        .dash-unit-list { display: flex; flex-direction: column; }
        .dash-unit-row {
          display: flex; align-items: center; gap: 0.625rem;
          padding: 0.5rem 0; border-bottom: 1px solid var(--gray-100);
          font-size: 0.8125rem;
        }
        .dash-unit-row:last-child { border-bottom: none; }
        .dash-unit-rank {
          width: 22px; height: 22px; border-radius: 6px;
          background: var(--gray-100); color: var(--gray-500);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.625rem; font-weight: 600; flex-shrink: 0;
        }
        .dash-unit-rank.top { background: var(--primary); color: white; }
        .dash-unit-name { flex: 1; color: var(--gray-700); }
        .dash-unit-score { font-weight: 700; min-width: 32px; text-align: right; }
        .dash-unit-count { font-size: 0.6875rem; color: var(--gray-400); min-width: 60px; text-align: right; }

        .dash-rating-dist { display: flex; flex-direction: column; gap: 0.625rem; }
        .dash-rating-row {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .dash-rating-star {
          min-width: 40px; font-size: 0.875rem; font-weight: 600; color: var(--gray-700);
        }
        .dash-rating-count { min-width: 30px; text-align: right; font-weight: 600; font-size: 0.8125rem; }
        .dash-rating-pct { min-width: 36px; text-align: right; font-size: 0.75rem; color: var(--gray-400); }
        .dash-bar-fill.dash-bar-rating {
          height: 12px; background: linear-gradient(90deg, #f59e0b, #fbbf24);
          border-radius: 6px;
        }

        .dash-empty-small {
          color: var(--gray-400); font-size: 0.8125rem;
          padding: 2rem 0; text-align: center;
        }

        @media (max-width: 700px) {
          .dash-stats { grid-template-columns: 1fr 1fr; }
          .dash-grid-2 { grid-template-columns: 1fr; }
          .dash-bar-label { min-width: 120px; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value, suffix, color, small }) {
  return (
    <div className="dash-stat-card" style={{ borderLeftColor: color || 'var(--primary)' }}>
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-body">
        <div className="dash-stat-value" style={{ color }}>
          {value}{suffix || ''}
        </div>
        <div className="dash-stat-label" style={{ fontSize: small ? '0.7rem' : '' }}>{label}</div>
      </div>
      <style jsx>{`
        .dash-stat-card {
          background: var(--white); border: 1px solid var(--gray-200);
          border-left: 4px solid; border-radius: var(--radius);
          padding: 1rem; display: flex; align-items: center; gap: 0.75rem;
        }
        .dash-stat-icon { font-size: 1.5rem; }
        .dash-stat-body { }
        .dash-stat-value { font-size: 1.25rem; font-weight: 700; line-height: 1.2; }
        .dash-stat-label { font-size: 0.75rem; color: var(--gray-400); margin-top: 0.125rem; }
      `}</style>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="dashboard-skm" style={{ padding: '2rem 0' }}>
      <div className="dash-stats">
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 76, background: 'var(--gray-100)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
      <div style={{ height: 300, background: 'var(--gray-100)', borderRadius: 'var(--radius)', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}

function ErrorState({ msg }) {
  return (
    <div className="dash-card" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>Gagal memuat data: {msg}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="dash-card" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--gray-700)' }}>Belum Ada Data Survei</h3>
      <p style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', maxWidth: '400px', margin: '0 auto' }}>
        Dashboard akan otomatis menampilkan data setelah warga mulai mengisi Survei Kepuasan Masyarakat
        dan memberikan rating di website.
      </p>
      <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'var(--warn-bg)', borderRadius: 'var(--radius)', fontSize: '0.75rem', color: 'var(--warn)', display: 'inline-block' }}>
        💡 Pastikan tabel <code>skm</code>, <code>rating_feedback</code> sudah dibuat di Supabase
      </div>
    </div>
  );
}

function getColor(val, max) {
  if (!val) return 'var(--gray-400)';
  const pct = val / max;
  if (pct >= 0.7) return '#059669';
  if (pct >= 0.5) return '#d97706';
  return '#dc2626';
}

function formatBulan(bulanStr) {
  const [tahun, bulan] = bulanStr.split('-');
  const nama = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${nama[parseInt(bulan) - 1]} ${tahun}`;
}
