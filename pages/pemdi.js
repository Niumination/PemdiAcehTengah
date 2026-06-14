import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';
import DetailModal from '@/components/DetailModal';
import DataBadge from '@/components/DataBadge';

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

function RadarChart({ aspek, size = 380 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) - 40;
  const maxVal = 5;
  const levels = [1, 2, 3, 4, 5];
  const point = (angle, radius) => ({
    x: cx + Math.sin(angle) * radius,
    y: cy - Math.cos(angle) * radius,
  });
  const angles = aspek.map((_, i) => (2 * Math.PI * i) / aspek.length - Math.PI / 2);
  const gridPolygons = levels.map((lv) =>
    angles.map((a) => point(a, (r * lv) / maxVal)).map((p) => `${p.x},${p.y}`).join(' ')
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
      {gridPolygons.map((poly, i) => (
        <polygon key={i} points={poly} fill="none" stroke="#e5e5e5" strokeWidth={i === 4 ? 1.5 : 1} strokeDasharray={i === 4 ? 'none' : '4,4'} />
      ))}
      {levels.map((lv) => (
        <text key={lv} x={cx + 6} y={cy - (r * lv) / maxVal + 4} fill="#999" fontSize="11" dominantBaseline="middle">{lv}</text>
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={point(a, r).x} y2={point(a, r).y} stroke="#e5e5e5" strokeWidth={1} />
      ))}
      <polygon points={targetPolygon} fill="rgba(29,112,184,0.05)" stroke="#1d70b8" strokeWidth={1.5} strokeDasharray="6,4" />
      <polygon points={dataPolygon} fill="rgba(212,53,28,0.12)" stroke="#d4351c" strokeWidth={2} />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#d4351c" stroke="white" strokeWidth={2} />
      ))}
      {targetPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="none" stroke="#1d70b8" strokeWidth={1.5} />
      ))}
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fill="#333" fontSize="11" fontWeight={500}>
          {aspek[i].singkat}
        </text>
      ))}
    </svg>
  );
}

/* Aspect modal content — shows sub-indicators with PIC responsibility */
function AspectModalContent({ aspek }) {
  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '1rem', lineHeight: 1.6 }}>
        {aspek.deskripsi}
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <DataBadge label="Nilai" value={aspek.nilai} target={aspek.target} warna={aspek.warna} compact />
        <DataBadge label="Bobot" value={aspek.bobot} target={100} warna={aspek.warna} compact />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {aspek.indikator.map((ind) => {
          const gap = ind.target - ind.nilai;
          const pct = Math.min(100, (ind.nilai / ind.target) * 100);
          const pj = ind.penanggung_jawab;
          return (
            <div key={ind.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '0.75rem 0.75rem 0.6rem',
              background: '#fcfcfc',
              borderLeft: `3px solid ${aspek.warna}`,
            }}>
              {/* Baris 1: ID + Nama + Nilai */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.3rem', flexWrap: 'wrap'
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '28px', padding: '0.1rem 0.4rem',
                  background: `${aspek.warna}18`, color: aspek.warna,
                  fontSize: '0.675rem', fontWeight: 700, borderRadius: '4px',
                }}>{ind.id}</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>
                  {ind.nama}
                </span>
                {ind.bobot && (
                  <span style={{ fontSize: '0.65rem', color: '#888', background: '#f0f0f0', padding: '0.05rem 0.4rem', borderRadius: '3px' }}>
                    bobot {formatAngka(ind.bobot)}%
                  </span>
                )}
                <span style={{
                  marginLeft: 'auto', fontWeight: 700, fontSize: '0.95rem',
                  color: gap > 0 ? '#d4351c' : '#00703c', whiteSpace: 'nowrap',
                }}>
                  {formatDesimal(ind.nilai, 1)} <span style={{ fontWeight: 400, fontSize: '0.7rem', color: '#888' }}>/ {formatDesimal(ind.target, 1)}</span>
                </span>
              </div>

              {/* Baris 2: Deskripsi */}
              <p style={{ fontSize: '0.725rem', color: '#555', margin: '0 0 0.35rem 0', lineHeight: 1.5 }}>
                {ind.deskripsi}
              </p>

              {/* Baris 3: Progress bar */}
              <div style={{
                height: '5px', background: '#e8e8e8', borderRadius: '3px',
                marginBottom: '0.3rem', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: '3px',
                  background: pct >= 80 ? '#00703c' : pct >= 50 ? '#e65100' : '#d4351c',
                  transition: 'width 0.5s ease',
                }} />
              </div>

              {/* Baris 4: Penanggung Jawab + Sumber */}
              {pj && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap',
                  marginBottom: '0.3rem',
                }}>
                  <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>👤 PIC:</span>
                  <span style={{
                    fontSize: '0.675rem', fontWeight: 600, color: '#1d70b8',
                    background: '#e8f0fe', padding: '0.05rem 0.45rem', borderRadius: '3px',
                  }}>
                    {pj.lead}
                  </span>
                  {pj.support && pj.support.length > 0 && (
                    <>
                      <span style={{ fontSize: '0.6rem', color: '#999' }}>+</span>
                      <span style={{ fontSize: '0.625rem', color: '#666' }}>
                        {pj.support.join(', ')}
                      </span>
                    </>
                  )}
                  {pj.tim && (
                    <span style={{ fontSize: '0.625rem', color: '#888', marginLeft: 'auto', fontStyle: 'italic' }}>
                      {pj.tim}
                    </span>
                  )}
                </div>
              )}

              {/* Baris 5: Sumber data + Kontribusi portal */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem',
                fontSize: '0.65rem', color: '#888',
              }}>
                <span>📋 {ind.sumber}</span>
                <span>🌐 {ind.kontribusi_portal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBarVisual({ aspek }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
      {aspek.map((a) => {
        const pctCurrent = (a.nilai / 5) * 100;
        const pctTarget = (a.target / 5) * 100;
        return (
          <div key={a.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 600, color: '#333' }}>{a.nama}</span>
              <span style={{ color: '#505a5f' }}>
                <span style={{ color: a.warna, fontWeight: 700 }}>{a.nilai}</span>
                <span style={{ color: '#999' }}> / {a.target}</span>
              </span>
            </div>
            <div style={{ position: 'relative', height: '18px', background: '#e8e8e8', borderRadius: '10px', overflow: 'hidden' }}>
              {/* Target line */}
              <div style={{ position: 'absolute', left: `${pctTarget}%`, top: 0, bottom: 0, width: '2px', background: '#1d70b8', zIndex: 2 }} />
              {/* Current value bar */}
              <div style={{ width: `${pctCurrent}%`, height: '100%', borderRadius: '10px', background: a.warna, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#888', marginTop: '0.15rem' }}>
              <span>Baseline</span>
              <span style={{ color: '#1d70b8' }}>🎯 Target {a.target}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineRoadmap() {
  const milestones = [
    { tahun: '2026', label: 'Baseline', indeks: '2.37', predikat: 'Cukup', warna: '#e65100', desc: 'Konversi dari SPBE 2025 — baseline Pemdi pertamà. Penguatan tata kelola, keamanan, dan data.', status: 'Saat Ini' },
    { tahun: '2027', label: 'Target 2.50', indeks: '2.50+', predikat: 'Baik', warna: '#1d70b8', desc: 'Peningkatan di Tata Kelola (I1-I2), Data (I5-I8), dan Keamanan (I9-I12) via program prioritas.', status: 'Tahap 1' },
    { tahun: '2028', label: 'Target 3.50+', indeks: '3.50+', predikat: 'Sangat Baik', warna: '#28a197', desc: 'Keterpaduan penuh — interoperabilitas data, GovTech, AI untuk layanan publik, dan kepuasan pengguna tinggi.', status: 'Tahap 2' },
  ];
  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.25rem' }}>
      {milestones.map((m, i) => (
        <div key={i} style={{
          flex: '1 1 200px', background: '#fff', border: `2px solid ${m.warna}40`,
          borderRadius: '10px', padding: '1.25rem', textAlign: 'center',
          borderTop: `4px solid ${m.warna}`, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
            background: m.warna, color: '#fff', fontSize: '0.625rem', fontWeight: 700,
            padding: '0.15rem 0.75rem', borderRadius: '100px', textTransform: 'uppercase',
          }}>{m.status}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: m.warna, marginTop: '0.25rem' }}>{m.tahun}</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: m.warna, margin: '0.25rem 0' }}>{m.indeks}</div>
          <div className="badge badge-sm" style={{ background: `${m.warna}18`, color: m.warna, border: `1px solid ${m.warna}40` }}>{m.predikat}</div>
          <p style={{ fontSize: '0.75rem', color: '#505a5f', marginTop: '0.75rem', lineHeight: 1.5 }}>{m.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default function PemdiPage() {
  const { aspek, tentang, target_indeks, target_predikat, baseline_spbe } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);
  const [modalAspek, setModalAspek] = useState(null);

  const totalIndikator = aspek.reduce((s, a) => s + a.indikator.length, 0);

  return (
    <>
      <Head>
        <title>Indeks Pemdi — Evaluasi Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Dashboard Indeks Pemerintah Digital (Pemdi) Aceh Tengah — 7 Aspek × 20 Indikator berdasarkan Permenpan RB 8/2026" />
        <meta property="og:title" content="Indeks Pemdi — Evaluasi Pemerintah Digital Aceh Tengah" />
        <meta property="og:description" content="Dashboard Indeks Pemerintah Digital (Pemdi) Aceh Tengah — 7 Aspek × 20 Indikator berdasarkan Permenpan RB 8/2026" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/pemdi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Indeks Pemdi — Evaluasi Pemerintah Digital Aceh Tengah" />
        <meta name="twitter:description" content="Dashboard Indeks Pemerintah Digital (Pemdi) Aceh Tengah — 7 Aspek × 20 Indikator berdasarkan Permenpan RB 8/2026" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Indeks Pemdi Aceh Tengah',
              description: 'Dashboard Indeks Pemerintah Digital (Pemdi) Aceh Tengah — 7 Aspek × 20 Indikator berdasarkan Permenpan RB 8/2026',
              url: 'https://pemdi-aceh-tengah.vercel.app/pemdi',
              isPartOf: { '@type': 'WebSite', name: 'Pemdi Aceh Tengah', url: 'https://pemdi-aceh-tengah.vercel.app' },
            }),
          }}
        />
      </Head>

      {/* ============ HERO ============ */}
      <section className="section section-hero-pemdi">
        <div className="container">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/" className="back-link">← Beranda</Link>
            <span className="badge badge-blue badge-sm">PermenPANRB 8/2026</span>
          </div>
          <div className="grid grid-2" style={{ alignItems: 'center', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0.75rem 0 0.5rem' }}>
                Indeks Pemerintah Digital
              </h1>
              <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', maxWidth: '480px', lineHeight: 1.6 }}>
                {tentang}. Transisi dari SPBE ke Pemdi — fokus pada keterpaduan layanan digital dan dampak bagi masyarakat.
              </p>
              <div className="flex flex-wrap gap-2" style={{ marginTop: '1.5rem' }}>
                <a href="#aspek" className="btn btn-primary btn-sm">Lihat 7 Aspek</a>
                <a href="#spbe-vs-pemdi" className="btn btn-outline btn-sm">SPBE vs Pemdi →</a>
              </div>
            </div>
            <div className="score-ring-container">
              <div className="score-ring">
                <svg viewBox="0 0 220 220" style={{ width: 220, height: 220 }}>
                  <circle cx="110" cy="110" r="95" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle
                    cx="110" cy="110" r="95"
                    fill="none" stroke={predikat.warna}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(indeks / 5) * 597} 597`}
                    transform="rotate(-90, 110, 110)"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                  <text x="110" y="100" textAnchor="middle" fill="white" fontSize="32" fontWeight="700">
                    {formatDesimal(indeks)}
                  </text>
                  <text x="110" y="125" textAnchor="middle" fill={predikat.warna} fontSize="14" fontWeight="600">
                    {predikat.label}
                  </text>
                  <text x="110" y="145" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11">
                    Target: {target_indeks} ({target_predikat})
                  </text>
                </svg>
              </div>
              <div className="score-ring-compare">
                <div className="compare-row">
                  <span className="compare-label">SPBE 2025</span>
                  <span className="compare-value" style={{ color: 'rgba(255,255,255,0.9)' }}>{formatDesimal(baseline_spbe)}</span>
                </div>
                <div className="compare-row">
                  <span className="compare-label">Pemdi Baseline</span>
                  <span className="compare-value" style={{ color: predikat.warna }}>{formatDesimal(indeks)}</span>
                </div>
                <div className="compare-row" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                  <span className="compare-label" style={{ fontWeight: 600 }}>Target 2026</span>
                  <span className="compare-value" style={{ color: '#fff', fontWeight: 700 }}>{formatDesimal(target_indeks)}</span>
                </div>
                <div className="compare-gap">
                  Gap: <strong style={{ color: indeks >= target_indeks ? '#28a197' : '#ffb347' }}>
                    {formatDesimal(target_indeks - indeks)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ APA ITU PEMDI — STORY SECTION ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>📖 Apa itu Pemdi?</h2>
          </div>
          <div className="story-section">
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #1d70b8', background: '#f8fbff', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: '#333', margin: 0 }}>
                <strong>Indeks Pemerintah Digital (Pemdi)</strong> adalah kerangka evaluasi baru pengganti SPBE yang 
                diatur dalam <strong>PermenPANRB 8/2026</strong>. Pemdi mengukur kematangan transformasi digital 
                pemerintah daerah melalui <strong>7 aspek</strong> dengan <strong>{totalIndikator} indikator</strong>, 
                masing-masing memiliki bobot berbeda berdasarkan tingkat kepentingannya.
              </p>
            </div>
            <div className="grid grid-4" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d70b8' }}>7</div>
                <div style={{ fontSize: '0.75rem', color: '#505a5f' }}>Aspek Penilaian</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d70b8' }}>{totalIndikator}</div>
                <div style={{ fontSize: '0.75rem', color: '#505a5f' }}>Indikator</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d70b8' }}>100%</div>
                <div style={{ fontSize: '0.75rem', color: '#505a5f' }}>Bobot Total</div>
              </div>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', border: '1px solid #1d70b8' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1d70b8' }}>2.50</div>
                <div style={{ fontSize: '0.75rem', color: '#505a5f' }}>🎯 Target 2027</div>
              </div>
            </div>
            <div className="card" style={{ padding: '1.25rem', background: '#fafafa' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.75rem' }}>🎯 Bobot Strategis per Aspek</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {aspek.slice().sort((a, b) => b.bobot - a.bobot).map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ minWidth: '28px', height: '28px', borderRadius: '6px', background: `${a.warna}20`, color: a.warna, fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{a.bobot}%</div>
                    <div style={{ flex: 1, fontSize: '0.8125rem', color: '#333' }}>{a.nama}</div>
                    <div style={{ width: '80px', height: '8px', background: '#e8e8e8', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ width: `${a.bobot}%`, height: '100%', borderRadius: '4px', background: a.warna }} />
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.75rem', marginBottom: 0 }}>
                💡 Aspek <strong>Kepuasan Pengguna</strong> memiliki bobot terbesar (25%) — fokus pada dampak langsung ke masyarakat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROGRESS BAR PER ASPEK ============ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>📊 Progress per Aspek</h2>
            <p>Nilai baseline saat ini vs target — garis biru (🎯) adalah target 2027</p>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <ProgressBarVisual aspek={aspek} />
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#888', textAlign: 'center' }}>
            Skala 1–5 · Baseline rata-rata: {formatDesimal(indeks)} · Gap ke target 2.50: <strong style={{ color: indeks >= 2.5 ? '#00703c' : '#d4351c' }}>{formatDesimal(2.5 - indeks)}</strong>
          </div>
        </div>
      </section>

      {/* ============ RADAR CHART ============ */}
      <section className="section section-alt" id="radar-chart">
        <div className="container">
          <div className="section-header">
            <h2>📊 Indeks Pemdi Aceh Tengah — Radar Chart</h2>
            <p>Radar — garis merah (nilai baseline), garis biru putus-putus (target 2026)</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
            <RadarChart aspek={aspek} size={380} />
          </div>
          <div className="grid grid-7" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
            {aspek.map((a) => (
              <div key={a.id} className="card" style={{ padding: '0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: a.warna, fontWeight: 600 }}>{a.singkat}</div>
                <div style={{ fontSize: '0.625rem', color: '#505a5f' }}>{a.bobot}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TARGET & ROADMAP ============ */}
      <section className="section" id="target-roadmap">
        <div className="container">
          <div className="section-header">
            <h2>🎯 Target & Roadmap</h2>
            <p>Jalur peningkatan Indeks Pemdi Aceh Tengah — 2026 hingga 2028</p>
          </div>
          <TimelineRoadmap />
          <div className="card" style={{ marginTop: '1.25rem', padding: '1.25rem', borderLeft: '4px solid #00703c', background: '#f5faf5' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.5rem' }}>✅ Strategi Pencapaian</h3>
            <ul style={{ fontSize: '0.8125rem', lineHeight: 1.7, color: '#333', margin: 0, paddingLeft: '1.25rem' }}>
              <li><strong>2026 (Baseline):</strong> Dokumentasi baseline, penguatan struktur tata kelola, sertifikasi keamanan dasar</li>
              <li><strong>2027 (Target 2.50):</strong> Implementasi tata kelola data (I5-I8), peningkatan keamanan (I9-I12), pengembangan aplikasi (I13-I14)</li>
              <li><strong>2028 (Target 3.50+):</strong> GovTech & API Gateway, interoperabilitas penuh, AI untuk layanan publik, indeks kepuasan &gt; 4.0</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 7 ASPEK CARDS + MODAL ============ */}
      <section className="section" id="aspek">
        <div className="container">
          <div className="section-header">
            <h2>7 Aspek Pemdi</h2>
            <p>Klik card untuk lihat detail indikator di setiap aspek</p>
          </div>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            {aspek.map((a) => {
              const p = getPredikat(a.nilai);
              const gap = a.target - a.nilai;
              return (
                <div key={a.id} className="card aspek-card" onClick={() => setModalAspek(a)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="badge" style={{
                      background: `${a.warna}18`, color: a.warna,
                      border: `1px solid ${a.warna}40`, fontSize: '0.6875rem',
                    }}>
                      {a.bobot}%
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: a.warna }}>
                      {formatDesimal(a.nilai)}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0.25rem 0' }}>
                    {a.nama}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#505a5f', margin: '0 0 0.5rem', lineHeight: 1.5 }}>
                    {a.deskripsi}
                  </p>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(a.nilai / 5) * 100}%`, background: a.warna }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: '#505a5f', marginTop: '0.25rem' }}>
                    <span>{formatAngka(a.indikator.length)} indikator</span>
                    <span style={{ color: gap > 0 ? '#d4351c' : '#00703c' }}>
                      Gap: {gap > 0 ? `+${formatDesimal(gap)}` : '✅ Tercapai'}
                    </span>
                  </div>
                  <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                    <span className="btn btn-xs btn-outline">Lihat Detail →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MODAL DETAIL INDIKATOR ============ */}
      <DetailModal
        title={modalAspek ? `${modalAspek.nama} — ${modalAspek.indikator.length} Indikator` : ''}
        open={!!modalAspek}
        onClose={() => setModalAspek(null)}
        maxWidth={640}
      >
        {modalAspek && <AspectModalContent aspek={modalAspek} />}
      </DetailModal>

      {/* ============ SPBE vs PEMDI ============ */}
      <section className="section section-alt" id="spbe-vs-pemdi">
        <div className="container">
          <div className="section-header">
            <h2>SPBE 2025 → Pemdi 2026</h2>
            <p>Perbandingan framework lama dan baru, baseline vs target</p>
          </div>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#505a5f', marginBottom: '0.5rem' }}>Indeks SPBE 2025</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#e65100' }}>{formatDesimal(baseline_spbe)}</div>
              <div className="badge badge-sm" style={{ background: '#e6510018', color: '#e65100' }}>Cukup</div>
              <p style={{ fontSize: '0.75rem', color: '#505a5f', marginTop: '0.75rem' }}>
                4 domain · 47 indikator
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', border: '2px solid #1d70b8' }}>
              <div style={{ fontSize: '0.75rem', color: '#505a5f', marginBottom: '0.5rem' }}>Indeks Pemdi Baseline</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: predikat.warna }}>{formatDesimal(indeks)}</div>
              <div className="badge badge-sm" style={{ background: `${predikat.warna}18`, color: predikat.warna }}>
                {predikat.label}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#505a5f', marginTop: '0.75rem' }}>
                7 aspek · 20 indikator · 100%
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', background: '#f0f4ff' }}>
              <div style={{ fontSize: '0.75rem', color: '#505a5f', marginBottom: '0.5rem' }}>Target 2026</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#1d70b8' }}>{formatDesimal(target_indeks)}</div>
              <div className="badge badge-sm" style={{ background: '#1d70b818', color: '#1d70b8' }}>Baik</div>
              <p style={{ fontSize: '0.75rem', color: '#505a5f', marginTop: '0.75rem' }}>
                Gap: {formatDesimal(target_indeks - indeks)} dari baseline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ QUICK WINS ============ */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #00703c' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem' }}>✅ Dampak Portal terhadap Indeks Pemdi</h3>
            <p style={{ fontSize: '0.8125rem', color: '#505a5f', margin: '0 0 0.75rem' }}>
              Portal PemdiAcehTengah sudah berkontribusi langsung ke beberapa indikator. Prioritas peningkatan:
            </p>
            <div className="grid grid-3" style={{ gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div className="card" style={{ padding: '0.75rem', background: '#f0f7f0' }}>
                <span style={{ fontWeight: 600, color: '#00703c' }}>I17</span> — Portal Layanan Digital
                <br /><span style={{ fontSize: '0.6875rem', color: '#505a5f' }}>✅ 3.5/5 — Target tercapai</span>
              </div>
              <div className="card" style={{ padding: '0.75rem', background: '#fff5f0' }}>
                <span style={{ fontWeight: 600, color: '#d4351c' }}>I1, I9, I13</span> — Tata Kelola &amp; Keamanan
                <br /><span style={{ fontSize: '0.6875rem', color: '#505a5f' }}>1.0–1.5 → Perlu penguatan kebijakan</span>
              </div>
              <div className="card" style={{ padding: '0.75rem', background: '#fff8f0' }}>
                <span style={{ fontWeight: 600, color: '#e65100' }}>I15, I18</span> — Keterpaduan &amp; Interop
                <br /><span style={{ fontSize: '0.6875rem', color: '#505a5f' }}>1.5–2.0 → API Gateway &amp; GovTech</span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#505a5f', background: '#f8f8f8', padding: '0.75rem', borderRadius: '6px' }}>
              🎯 Bobot <strong>Kepuasan Pengguna</strong> (I19+I20) = <strong>25%</strong> dari total Pemdi — aspek dengan kontribusi portal tertinggi.
              Nilai sudah 3.5/3.0 ✅, pertahankan dan perluas jangkauan survei SKM.
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTNOTE ============ */}
      <section className="section section-alt" style={{ padding: '1.5rem 0' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', color: '#505a5f', textAlign: 'center', margin: 0 }}>
            Berdasarkan <strong>PermenPANRB 8/2026</strong> tentang Evaluasi Kinerja Pemerintah Digital dan
            Laporan SPBE 2025 Kab. Aceh Tengah (Indeks 2.59 — Cukup). Nilai baseline adalah estimasi
            dari konversi data SPBE 2025 ke framework Pemdi 7 aspek × 20 indikator.
            Sumber: Diskominfo Aceh Tengah, Panduan Peningkatan Indeks Pemdi (Juni 2026).
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
        .section-hero-pemdi .badge { background: rgba(255,255,255,0.15) !important; color: white !important; border: 1px solid rgba(255,255,255,0.3) !important; }
        .section-hero-pemdi .btn-primary { background: white; color: #1d70b8; border: none; }
        .section-hero-pemdi .btn-primary:hover { background: #f0f4ff; }
        .section-hero-pemdi .btn-outline { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.5); }
        .section-hero-pemdi .btn-outline:hover { border-color: white; }
        .score-ring-container { display: flex; gap: 1.5rem; align-items: center; justify-content: center; }
        .score-ring { flex-shrink: 0; }
        .compare-row { display: flex; justify-content: space-between; padding: 0.375rem 0; font-size: 0.8125rem; gap: 1rem; }
        .compare-label { color: rgba(255,255,255,0.8); }
        .compare-value { font-weight: 600; }
        .compare-gap { margin-top: 0.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.7); }
        .grid-7 { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
        .aspek-card { cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; }
        .aspek-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .btn-xs { font-size: 0.6875rem; padding: 0.25rem 0.75rem; }
        @media (max-width: 640px) {
          .score-ring-container { flex-direction: column; }
          .grid-7 { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </>
  );
}
