import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Section from '@/components/Section';
import DetailModal from '@/components/DetailModal';
import { formatAngka, formatDesimal } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';
import ProgressBarVisual from '@/components/ProgressBarVisual';
import TimelineRoadmap from '@/components/TimelineRoadmap';
import TopographicBackdrop from '@/components/TopographicBackdrop';

/* ============ HELPERS ============ */
function hitungIndeks(aspek) {
  const totalBobot = aspek.reduce((s, a) => s + a.bobot, 0);
  const tertimbang = aspek.reduce((s, a) => s + a.nilai * (a.bobot / totalBobot), 0);
  return Math.round(tertimbang * 100) / 100;
}

function getPredikat(nilai) {
  if (nilai >= 3) return { label: 'Baik', warna: '#00703c' };
  if (nilai >= 2) return { label: 'Cukup', warna: '#e65100' };
  return { label: 'Perlu Perbaikan', warna: '#c62828' };
}

function getLevelWarna(nilai) {
  if (nilai >= 3) return '#00703c';
  if (nilai >= 2) return '#e65100';
  return '#c62828';
}

/* ============ MODAL CONTENT ============ */
function AspectModalContent({ aspek }) {
  return (
    <div>
      <p style={{ fontSize: '0.875rem', color: '#505a5f', marginBottom: '1rem', lineHeight: 1.6 }}>
        {aspek.deskripsi}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Nilai</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: aspek.warna }}>{formatDesimal(aspek.nilai)}</div>
        </div>
        <div className="card" style={{ padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Target</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1d70b8' }}>{formatDesimal(aspek.target)}</div>
        </div>
        <div className="card" style={{ padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '0.625rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Bobot</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#333' }}>{aspek.bobot}%</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {aspek.indikator.map((ind) => {
          const gap = ind.target - ind.nilai;
          const pct = Math.min(100, (ind.nilai / ind.target) * 100);
          const pj = ind.penanggung_jawab;
          return (
            <div
              key={ind.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '0.75rem',
                background: '#fcfcfc',
                borderLeft: `3px solid ${aspek.warna}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    minWidth: '28px', padding: '0.1rem 0.4rem',
                    background: `${aspek.warna}18`, color: aspek.warna,
                    fontSize: '0.675rem', fontWeight: 700, borderRadius: '4px',
                  }}
                >
                  {ind.id}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#222' }}>{ind.nama}</span>
                {ind.bobot && (
                  <span style={{ fontSize: '0.65rem', color: '#888', background: '#f0f0f0', padding: '0.05rem 0.4rem', borderRadius: '3px' }}>
                    bobot {ind.bobot}%
                  </span>
                )}
                <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '0.95rem', color: gap > 0 ? '#d4351c' : '#00703c', whiteSpace: 'nowrap' }}>
                  {formatDesimal(ind.nilai, 1)} <span style={{ fontWeight: 400, fontSize: '0.7rem', color: '#888' }}>/ {formatDesimal(ind.target, 1)}</span>
                </span>
              </div>
              <p style={{ fontSize: '0.725rem', color: '#555', margin: '0 0 0.35rem', lineHeight: 1.5 }}>{ind.deskripsi}</p>
              <div style={{ height: '5px', background: '#e8e8e8', borderRadius: '3px', marginBottom: '0.3rem', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', background: pct >= 80 ? '#00703c' : pct >= 50 ? '#e65100' : '#d4351c', transition: 'width 0.5s ease' }} />
              </div>
              {pj && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 500 }}>👤 PIC:</span>
                  <span style={{ fontSize: '0.675rem', fontWeight: 600, color: '#1d70b8', background: '#e8f0fe', padding: '0.05rem 0.45rem', borderRadius: '3px' }}>
                    {pj.lead}
                  </span>
                  {pj.support && pj.support.length > 0 && (
                    <>
                      <span style={{ fontSize: '0.6rem', color: '#999' }}>+</span>
                      <span style={{ fontSize: '0.625rem', color: '#666' }}>{pj.support.join(', ')}</span>
                    </>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem', fontSize: '0.65rem', color: '#888' }}>
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

/* ============ ICON MAP ============ */
const iconMap = {
  1: '🏛️',
  2: '👥',
  3: '📊',
  4: '🔒',
  5: '💻',
  6: '🔗',
  7: '😊',
};

/* ============ MAIN PAGE ============ */
export default function PemdiPage() {
  const { aspek, target_indeks, target_predikat, baseline_spbe, baseline_predikat } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);
  const gap = Math.max(0, target_indeks - indeks);
  const [modalAspek, setModalAspek] = useState(null);

  const milestones = [
    {
      tahun: '2026',
      title: 'Target Indeks Pemdi ≥ 2.50',
      desc: `Mencapai predikat "${target_predikat}" dalam evaluasi Pemdi pertama. Estimasi saat ini: ${formatDesimal(indeks)}. Gap: ${formatDesimal(gap)}.`,
      status: 'berjalan',
    },
    {
      tahun: '2027',
      title: 'Peningkatan ke 3.00',
      desc: 'Memperkuat aspek Keamanan, Teknologi, dan Data yang masih rendah. Target agar seluruh aspek mencapai ≥ 3.00.',
      status: 'direncanakan',
    },
    {
      tahun: '2028',
      title: 'Menuju Predikat Sangat Baik',
      desc: 'Target nilai ≥ 4.20 (Sangat Baik) dengan penguatan tata kelola Pemdi, perlindungan data pribadi, dan kepuasan pengguna.',
      status: 'direncanakan',
    },
  ];

  return (
    <>
      <Head>
        <title>Indeks Pemerintah Digital (Pemdi) — Aceh Tengah</title>
        <meta name="description" content="Dashboard Indeks Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah — 7 aspek, 20 indikator berdasarkan PermenPANRB 8/2026." />
      </Head>

      <a href="#pemdi-content" className="skip-link">Lompat ke konten utama</a>

      {/* ============ HERO ============ */}
      <section
        style={{
          background: 'linear-gradient(135deg, #004098 0%, #002060 100%)',
          color: 'white',
          padding: '2.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <TopographicBackdrop opacity={0.08} />
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}>
              ← Beranda
            </Link>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.6875rem', fontWeight: 600 }}>
              PermenPANRB 8/2026
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 700, margin: '0.5rem 0' }}>
            Indeks Pemerintah Digital (Pemdi)
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.85)', maxWidth: '520px', lineHeight: 1.6 }}>
            Berdasarkan PermenPANRB 8/2026 — 7 aspek, 20 indikator. Transisi dari SPBE ke Pemdi.
          </p>
        </div>
      </section>

      {/* ============ SCORE CARD (3 CARDS) ============ */}
      <section className="section" style={{ padding: '1.5rem 0' }} id="pemdi-content">
        <div className="container">
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            {/* Card 1: Baseline SPBE */}
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                Baseline SPBE 2025
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#e65100' }}>
                {formatDesimal(baseline_spbe)}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: '#e6510018',
                  color: '#e65100',
                  border: '1px solid #e6510040',
                  marginTop: '0.375rem',
                }}
              >
                Cukup
              </span>
              <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                4 domain · 47 indikator
              </p>
            </div>

            {/* Card 2: Indeks Pemdi */}
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', border: `2px solid ${predikat.warna}` }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                Indeks Pemdi (Estimasi)
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: predikat.warna }}>
                {formatDesimal(indeks)}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: `${predikat.warna}18`,
                  color: predikat.warna,
                  border: `1px solid ${predikat.warna}40`,
                  marginTop: '0.375rem',
                }}
              >
                {predikat.label}
              </span>
              <p style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                7 aspek · 20 indikator
              </p>
            </div>

            {/* Card 3: Target 2026 */}
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', background: '#f0f4ff' }}>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', fontWeight: 500 }}>
                Target 2026
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#1d70b8' }}>
                {formatDesimal(target_indeks)}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: '#1d70b818',
                  color: '#1d70b8',
                  border: '1px solid #1d70b840',
                  marginTop: '0.375rem',
                }}
              >
                {target_predikat}
              </span>
              <p style={{ fontSize: '0.75rem', color: '#d4351c', fontWeight: 600, marginTop: '0.5rem' }}>
                Gap: {formatDesimal(gap)}
              </p>
            </div>
          </div>

          {/* Cara baca */}
          <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '1rem', textAlign: 'center' }}>
            💡 Indeks diukur dari 1 (terendah) sampai 5 (tertinggi). Hijau = baik (≥3), Kuning = cukup (2–2,9), Merah = perlu perbaikan (&lt;2).
          </p>
        </div>
      </section>

      {/* ============ 7 ASPEK GRID ============ */}
      <Section
        id="aspek"
        title="7 Aspek Pemdi"
        subtitle="Klik kartu untuk melihat detail indikator di setiap aspek."
        className="section-alt"
      >
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          {aspek.map((a) => {
            const p = getPredikat(a.nilai);
            const lvlGap = a.target - a.nilai;
            return (
              <div
                key={a.id}
                className="aspek-card"
                onClick={() => setModalAspek(a)}
                role="button"
                tabIndex={0}
                aria-label={`Lihat detail ${a.nama}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModalAspek(a);
                  }
                }}
                style={{
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{iconMap[a.id] || '📌'}</span>
                    <span
                      className="badge"
                      style={{
                        background: `${a.warna}18`,
                        color: a.warna,
                        border: `1px solid ${a.warna}40`,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '100px',
                      }}
                    >
                      {a.bobot}%
                    </span>
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: getLevelWarna(a.nilai) }}>
                    {formatDesimal(a.nilai)}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, margin: '0 0 0.375rem', color: '#111' }}>
                  {a.nama}
                </h3>

                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.625rem', lineHeight: 1.5 }}>
                  {a.deskripsi}
                </p>

                {/* Progress bar */}
                <ProgressBarVisual
                  value={(a.nilai / 5) * 100}
                  color={a.warna}
                  height={6}
                  showLabel={false}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                    {formatAngka(a.indikator.length)} indikator
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '100px',
                      background: `${getLevelWarna(a.nilai)}18`,
                      color: getLevelWarna(a.nilai),
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ============ KEPUASAN PENGGUNA (25%) HIGHLIGHT ============ */}
      <Section id="kepuasan" title="😊 Kepuasan Pengguna (25%) — Bobot Terbesar">
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderLeft: '4px solid #00838f',
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          {aspek
            .filter((a) => a.id === 7)
            .map((a) => (
              <div key={a.id}>
                <p style={{ fontSize: '0.875rem', color: '#333', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  Aspek <strong>Kepuasan Pengguna</strong> memiliki bobot <strong>25%</strong> — tertinggi dari seluruh 7 aspek Pemdi. 
                  Terdiri dari 2 indikator: Fasilitas Dukungan Pengguna (I19, bobot 10%) dan Pengelolaan Kepuasan Pengguna (I20, bobot 15%).
                </p>
                <p style={{ fontSize: '0.875rem', color: '#333', lineHeight: 1.6, marginBottom: '1rem' }}>
                  Nilai estimasi: <strong style={{ color: a.warna }}>{formatDesimal(a.nilai)}</strong> / {formatDesimal(a.target)} (target).
                  Dengan nilai sudah di atas target, portal ini sudah berkontribusi langsung. Bantu kami meningkatkannya dengan mengisi survei.
                </p>
                <div style={{ textAlign: 'center' }}>
                  <Link
                    href="/skm"
                    className="btn btn-primary"
                    style={{
                      display: 'inline-block',
                      background: '#004098',
                      color: 'white',
                      padding: '0.625rem 1.5rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                    }}
                  >
                    📝 Isi Survei Kepuasan Sekarang
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </Section>

      {/* ============ TIMELINE ROADMAP ============ */}
      <Section
        id="roadmap"
        title="🗺️ Roadmap Pemdi 2026→2028"
        subtitle="Langkah strategis menuju Pemerintah Digital yang matang dan berkelanjutan."
        className="section-alt"
      >
        <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
          <TimelineRoadmap milestones={milestones} />
        </div>
      </Section>

      {/* ============ MODAL ============ */}
      <DetailModal
        title={modalAspek ? `${iconMap[modalAspek.id] || '📌'} ${modalAspek.nama} — ${modalAspek.indikator.length} Indikator` : ''}
        open={!!modalAspek}
        onClose={() => setModalAspek(null)}
        maxWidth={640}
      >
        {modalAspek && <AspectModalContent aspek={modalAspek} />}
      </DetailModal>

      {/* ============ FOOTNOTE ============ */}
      <section className="section" style={{ padding: '1.5rem 0', background: '#f0f3f5' }}>
        <div className="container">
          <p style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Berdasarkan <strong>PermenPANRB 8/2026</strong> tentang Evaluasi Kinerja Pemerintah Digital dan
            Laporan SPBE 2025 Kab. Aceh Tengah (Indeks {formatDesimal(baseline_spbe)} — {baseline_predikat}). Nilai baseline adalah estimasi
            dari konversi data SPBE 2025 ke framework Pemdi 7 aspek × 20 indikator.
            Sumber: Diskominfo Aceh Tengah, Panduan Peningkatan Indeks Pemdi (Juni 2026).
          </p>
        </div>
      </section>

      <style jsx>{`
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .aspek-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .aspek-card:focus-visible {
          outline: 3px solid #fd0;
          outline-offset: 2px;
        }
        .section-alt {
          background: var(--bg, #f0f3f5);
        }
        @media (max-width: 640px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
