import Head from 'next/head';
import Link from 'next/link';
import pemdiData from '@/data/pemdi.json';

function hitungIndeks(aspek) {
  const totalBobot = aspek.reduce((s, a) => s + a.bobot, 0);
  const tertimbang = aspek.reduce((s, a) => s + a.nilai * (a.bobot / totalBobot), 0);
  return Math.round(tertimbang * 100) / 100;
}

function getPredikat(nilai) {
  if (nilai >= 4.2) return { label: 'Memuaskan', warna: '#00703c' };
  if (nilai >= 3.5) return { label: 'Sangat Baik', warna: '#28a197' };
  if (nilai >= 2.5) return { label: 'Baik', warna: '#1d70b8' };
  if (nilai >= 1.5) return { label: 'Cukup', warna: '#e65100' };
  return { label: 'Kurang', warna: '#d4351c' };
}

/* Radar chart SVG — points calculated server-side */
function RadarChart({ aspek, size = 400 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 40;
  const maxVal = 5;
  const levels = [1, 2, 3, 4, 5];

  const point = (angle, radius) => ({
    x: cx + Math.sin(angle) * radius,
    y: cy - Math.cos(angle) * radius,
  });

  const angles = aspek.map((_, i) =>
    (2 * Math.PI * i) / aspek.length - Math.PI / 2
  );

  const gridPolygons = levels.map((lv) =>
    angles
      .map((a) => point(a, (r * lv) / maxVal))
      .map((p) => `${p.x},${p.y}`)
      .join(' ')
  );

  const dataPoints = aspek.map((a, i) => {
    const radius = (r * a.nilai) / maxVal;
    return point(angles[i], radius);
  });
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const targetPoints = aspek.map((a, i) => {
    const radius = (r * a.target) / maxVal;
    return point(angles[i], radius);
  });
  const targetPolygon = targetPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const labelOffset = 28;
  const labels = aspek.map((a, i) => point(angles[i], r + labelOffset));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size, height: 'auto' }}>
      {/* Grid rings */}
      {gridPolygons.map((poly, i) => (
        <polygon
          key={i}
          points={poly}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth={i === 4 ? 1.5 : 1}
          strokeDasharray={i === 4 ? 'none' : '4,4'}
        />
      ))}
      {/* Level labels */}
      {levels.map((lv) => (
        <text key={lv} x={cx + 6} y={cy - (r * lv) / maxVal + 4} fill="#999" fontSize="11" dominantBaseline="middle">
          {lv}
        </text>
      ))}

      {/* Axis lines */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={point(a, r).x} y2={point(a, r).y} stroke="#e5e5e5" strokeWidth={1} />
      ))}

      {/* Target polygon (dashed) */}
      <polygon points={targetPolygon} fill="rgba(29,112,184,0.05)" stroke="#1d70b8" strokeWidth={1.5} strokeDasharray="6,4" />

      {/* Data polygon */}
      <polygon points={dataPolygon} fill="rgba(212,53,28,0.12)" stroke="#d4351c" strokeWidth={2} />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#d4351c" stroke="white" strokeWidth={2} />
      ))}

      {/* Target points */}
      {targetPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="none" stroke="#1d70b8" strokeWidth={1.5} />
      ))}

      {/* Labels */}
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fill="#333" fontSize="11" fontWeight={500}>
          {aspek[i].singkat}
        </text>
      ))}
    </svg>
  );
}

export default function PemdiPage() {
  const { aspek, tentang, target_indeks, target_predikat, baseline_spbe } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);

  return (
    <>
      <Head>
        <title>Indeks Pemdi — Evaluasi Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Dashboard Indeks Pemerintah Digital (Pemdi) Aceh Tengah — 7 Aspek × 20 Indikator berdasarkan Permenpan RB 8/2026" />
      </Head>

      {/* ============ HERO ============ */}
      <section className="section section-hero-pemdi">
        <div className="container">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="back-link">← Beranda</Link>
            <span className="badge badge-blue badge-sm">Permenpan RB 8/2026</span>
          </div>
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
                Indeks Pemerintah Digital
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', maxWidth: '480px', lineHeight: 1.6 }}>
                {tentang}. Transisi dari SPBE ke Pemdi — fokus pada keterpaduan layanan digital dan dampak bagi masyarakat.
              </p>
              <div className="flex flex-wrap gap-2" style={{ marginTop: '1.5rem' }}>
                <a href="#detail" className="btn btn-primary btn-sm">Lihat Detail Indikator</a>
                <a href="/probis" className="btn btn-outline btn-sm">Proses Bisnis →</a>
              </div>
            </div>
            <div className="score-ring-container">
              <div className="score-ring">
                <svg viewBox="0 0 220 220" style={{ width: 220, height: 220 }}>
                  <circle cx="110" cy="110" r="95" fill="none" stroke="#e5e5e5" strokeWidth="10" />
                  <circle
                    cx="110" cy="110" r="95"
                    fill="none" stroke={predikat.warna}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(indeks / 5) * 597} 597`}
                    transform="rotate(-90, 110, 110)"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                  <text x="110" y="100" textAnchor="middle" fill="#333" fontSize="32" fontWeight="700">
                    {indeks.toFixed(2)}
                  </text>
                  <text x="110" y="125" textAnchor="middle" fill={predikat.warna} fontSize="14" fontWeight="600">
                    {predikat.label}
                  </text>
                  <text x="110" y="145" textAnchor="middle" fill="#999" fontSize="11">
                    Target: {target_indeks} ({target_predikat})
                  </text>
                </svg>
              </div>
              <div className="score-ring-compare">
                <div className="compare-row">
                  <span className="compare-label">SPBE 2025</span>
                  <span className="compare-value" style={{ color: '#e65100' }}>{baseline_spbe.toFixed(2)}</span>
                </div>
                <div className="compare-row">
                  <span className="compare-label">Pemdi Baseline</span>
                  <span className="compare-value" style={{ color: '#d4351c' }}>{indeks.toFixed(2)}</span>
                </div>
                <div className="compare-row" style={{ borderTop: '2px solid var(--gray-200)', paddingTop: '0.5rem' }}>
                  <span className="compare-label" style={{ fontWeight: 600 }}>Target 2026</span>
                  <span className="compare-value" style={{ color: '#1d70b8', fontWeight: 700 }}>{target_indeks.toFixed(2)}</span>
                </div>
                <div className="compare-gap">
                  Gap: <strong style={{ color: indeks >= target_indeks ? '#00703c' : '#d4351c' }}>
                    {(target_indeks - indeks).toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ RADAR CHART ============ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Peta 7 Aspek Pemdi</h2>
            <p>Visualisasi radar — garis merah = baseline, garis biru putus-putus = target 2026</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <RadarChart aspek={aspek} size={380} />
          </div>
          <div className="grid grid-7" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
            {aspek.map((a) => (
              <div key={a.id} className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: a.warna, fontWeight: 600 }}>{a.singkat}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>{a.bobot}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ASPEK SCORECARDS ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Skor per Aspek</h2>
            <p>7 aspek penilaian dengan bobot dan kontribusi portal</p>
          </div>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            {aspek.map((a) => {
              const p = getPredikat(a.nilai);
              return (
                <div key={a.id} className="card pemdi-aspek-card">
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge" style={{
                      background: `${a.warna}18`, color: a.warna,
                      border: `1px solid ${a.warna}40`, fontSize: '0.6875rem',
                    }}>
                      Bobot {a.bobot}%
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: a.warna }}>
                      {a.nilai.toFixed(2)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0.5rem 0 0.25rem' }}>
                    {a.nama}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                    {a.deskripsi}
                  </p>
                  <div className="progress-bar" style={{ marginTop: '0.75rem' }}>
                    <div className="progress-fill" style={{
                      width: `${(a.nilai / 5) * 100}%`,
                      background: a.warna,
                    }} />
                  </div>
                  <div className="flex justify-between" style={{ fontSize: '0.6875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                    <span>Target: {a.target.toFixed(2)}</span>
                    <span style={{ color: a.nilai >= a.target ? '#00703c' : '#d4351c' }}>
                      Gap: {(a.target - a.nilai).toFixed(2)}
                    </span>
                  </div>
                  <div className="pemdi-portal-badge" style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.625rem', color: a.warna }}>
                      {a.id === 6 && a.indikator[2].nilai >= 3 ? '✅ Kontribusi Tinggi' : '🔄 Dapat Ditingkatkan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ DETAIL ALL 20 INDIKATOR ============ */}
      <section className="section section-alt" id="detail">
        <div className="container">
          <div className="section-header">
            <h2>20 Indikator Pemdi</h2>
            <p>Detail setiap indikator — nilai baseline, target, gap, dan kontribusi portal</p>
          </div>
          {aspek.map((a) => (
            <div key={a.id} className="pemdi-aspek-group" style={{ marginBottom: '1.5rem' }}>
              <div className="flex items-center gap-2" style={{
                padding: '0.75rem 1rem',
                background: `${a.warna}10`,
                borderLeft: `4px solid ${a.warna}`,
                borderRadius: '8px',
                marginBottom: '0.75rem',
              }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: a.warna }}>{a.nama}</span>
                <span className="badge badge-sm" style={{ background: `${a.warna}20`, color: a.warna }}>
                  Bobot {a.bobot}%
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: a.warna, fontWeight: 600 }}>
                  {a.nilai.toFixed(2)} / {a.target.toFixed(2)}
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="pemdi-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th>Indikator</th>
                      <th style={{ width: '80px' }}>Nilai</th>
                      <th style={{ width: '80px' }}>Target</th>
                      <th style={{ width: '140px' }}>Progress</th>
                      <th>Kontribusi Portal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {a.indikator.map((ind) => {
                      const gap = ind.target - ind.nilai;
                      const pct = Math.min(100, (ind.nilai / ind.target) * 100);
                      return (
                        <tr key={ind.id}>
                          <td><span className="badge badge-gray badge-sm">{ind.id}</span></td>
                          <td>
                            <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{ind.nama}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>{ind.deskripsi}</div>
                          </td>
                          <td style={{ fontWeight: 600, color: gap > 0 ? '#d4351c' : '#00703c' }}>
                            {ind.nilai.toFixed(1)}
                          </td>
                          <td style={{ fontWeight: 600 }}>{ind.target.toFixed(1)}</td>
                          <td>
                            <div className="progress-bar progress-bar-sm">
                              <div className="progress-fill" style={{
                                width: `${Math.min(100, (ind.nilai / ind.target) * 100)}%`,
                                background: pct >= 80 ? '#00703c' : pct >= 50 ? '#e65100' : '#d4351c',
                              }} />
                            </div>
                            <span style={{ fontSize: '0.625rem', color: 'var(--muted)' }}>
                              {pct.toFixed(0)}% · Gap {gap > 0 ? `+${gap.toFixed(1)}` : '✅'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                            {ind.kontribusi_portal}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SPBE vs PEMDI ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>SPBE 2025 → Pemdi 2026</h2>
            <p>Perbandingan framework lama dan baru, baseline vs target</p>
          </div>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Indeks SPBE 2025</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#e65100' }}>{baseline_spbe.toFixed(2)}</div>
              <div className="badge badge-sm" style={{ background: '#e6510018', color: '#e65100' }}>Cukup</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                4 domain · 30+ indikator
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', border: '2px solid var(--primary)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Indeks Pemdi Baseline</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: predikat.warna }}>{indeks.toFixed(2)}</div>
              <div className="badge badge-sm" style={{ background: `${predikat.warna}18`, color: predikat.warna }}>
                {predikat.label}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                7 aspek · 20 indikator
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', background: '#f0f4ff' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>Target 2026</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1d70b8' }}>{target_indeks.toFixed(2)}</div>
              <div className="badge badge-sm" style={{ background: '#1d70b818', color: '#1d70b8' }}>Baik</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                Gap: {(target_indeks - indeks).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem', borderLeft: '4px solid #00703c' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>✅ Quick Wins — Dampak Portal</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '0 0 0.75rem' }}>
              Portal PemdiAcehTengah sudah berkontribusi langsung ke beberapa indikator. Berikut yang bisa ditingkatkan:
            </p>
            <div className="grid grid-3" style={{ gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div className="card" style={{ padding: '0.75rem', background: '#f0f7f0' }}>
                <span style={{ fontWeight: 600, color: '#00703c' }}>I17</span> — Portal Layanan Digital
                <br /><span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Nilai 3.5/5 ✅ Target tercapai</span>
              </div>
              <div className="card" style={{ padding: '0.75rem', background: '#f5f0ff' }}>
                <span style={{ fontWeight: 600, color: '#6f42c1' }}>I13</span> — Aplikasi Pemdi
                <br /><span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Nilai 2.0 → Target 2.5 🔄</span>
              </div>
              <div className="card" style={{ padding: '0.75rem', background: '#fff5f0' }}>
                <span style={{ fontWeight: 600, color: '#d4351c' }}>I19, I20</span> — Kepuasan Pengguna
                <br /><span style={{ fontSize: '0.6875rem', color: 'var(--muted)' }}>Nilai 1.0 → Target 2.5 🚧</span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
              🎯 Fokus utama portal: meningkatkan <strong>I19</strong> (Fasilitas Dukungan) dan <strong>I20</strong> (Kepuasan Pengguna)
              — bobot gabungan <strong>25%</strong> dari total nilai Pemdi.
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTNOTE ============ */}
      <section className="section section-alt" style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', margin: 0 }}>
            Berdasarkan <strong>Peraturan Menteri PANRB Nomor 8 Tahun 2026</strong> tentang Evaluasi Kinerja Pemerintah Digital.
            Nilai baseline adalah estimasi dari konversi SPBE 2.59 ke framework Pemdi. Data akan diperbarui setelah validasi resmi dari Diskominfo Aceh Tengah.
          </p>
        </div>
      </section>

      <style jsx>{`
        .section-hero-pemdi {
          background: linear-gradient(135deg, #1d70b8 0%, #104b8a 100%);
          color: white;
          padding: 3rem 0;
        }
        .section-hero-pemdi .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-pemdi .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-pemdi h1 { color: white; }
        .section-hero-pemdi p { color: rgba(255,255,255,0.85) !important; }
        .section-hero-pemdi .badge { background: rgba(255,255,255,0.15) !important; color: white !important; border: 1px solid rgba(255,255,255,0.3) !important; }
        .section-hero-pemdi .btn-primary { background: white; color: #1d70b8; border: none; }
        .section-hero-pemdi .btn-primary:hover { background: #f0f4ff; }
        .section-hero-pemdi .btn-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.5); }
        .section-hero-pemdi .btn-outline:hover { border-color: white; }
        .score-ring-container { display: flex; gap: 1.5rem; align-items: center; justify-content: center; }
        .score-ring { flex-shrink: 0; }
        .score-ring-compare { }
        .compare-row { display: flex; justify-content: space-between; padding: 0.375rem 0; font-size: 0.8125rem; gap: 1rem; }
        .compare-label { color: rgba(255,255,255,0.8); }
        .compare-value { font-weight: 600; }
        .compare-gap { margin-top: 0.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .grid-7 { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
        .pemdi-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .pemdi-table th { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 2px solid var(--gray-200); font-weight: 600; font-size: 0.75rem; color: var(--muted); }
        .pemdi-table td { padding: 0.625rem 0.75rem; border-bottom: 1px solid var(--gray-100); vertical-align: top; }
        .pemdi-table tbody tr:hover { background: var(--gray-50); }
        @media (max-width: 640px) {
          .score-ring-container { flex-direction: column; }
          .grid-7 { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
