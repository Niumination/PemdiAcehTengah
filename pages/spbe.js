import Head from 'next/head';
import Link from 'next/link';
import { formatDesimal } from '@/lib/format';
import portalData from '@/data/opd.json';

/* ── Helpers ── */
function getLevel(value) {
  if (value >= 3.0) return { color: 'var(--ok)', label: 'Baik' };
  if (value >= 2.0) return { color: 'var(--warn)', label: 'Cukup' };
  return { color: 'var(--bad)', label: 'Kurang' };
}

/* ── Domain card ── */
function DomainCard({ nama, nilai, icon }) {
  const level = getLevel(nilai);
  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Domain
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
            {nama}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 700, color: level.color }}>
          {formatDesimal(nilai)}
        </span>
        <span className="badge" style={{ background: `${level.color}18`, color: level.color, fontSize: '0.7rem' }}>
          {level.label}
        </span>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function SpbePage({ data }) {
  const spbe = data.spbe;
  const indeks = spbe.indeks;
  const kategori = spbe.kategori;
  const domain = spbe.domain;
  const rekomendasi = spbe.rekomendasi_prioritas || [];
  const kekuatan = spbe.kekuatan || [];
  const pemdiFramework = spbe.pemdi_framework;

  const indeksLevel = getLevel(indeks);

  return (
    <>
      <Head>
        <title>Indeks SPBE — Pemdi Aceh Tengah</title>
        <meta name="description" content={`Indeks SPBE Kabupaten Aceh Tengah ${indeks} (${kategori}). Empat domain: Kebijakan ${domain.kebijakan_spbe}, Tata Kelola ${domain.tata_kelola_spbe}, Manajemen ${domain.manajemen_spbe}, Layanan ${domain.layanan_spbe}.`} />
      </Head>

      {/* HERO */}
      <section data-reveal style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7, marginBottom: '0.5rem' }}>
            Kabupaten Aceh Tengah · {spbe.tahun}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Indeks Sistem Pemerintahan Berbasis Elektronik (SPBE)
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.85, maxWidth: 600, lineHeight: 1.6 }}>
            Berdasarkan Permenpan RB 59/2020 — Baseline evaluasi digital government Kabupaten Aceh Tengah.
            Mulai 2026 bertransisi ke kerangka Pemerintah Digital (Pemdi) sesuai Permenpan RB 8/2026.
          </p>

          {/* Score hero */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{formatDesimal(indeks)}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.25rem' }}>dari 5.00</div>
            </div>
            <div style={{ width: 1, height: 50, background: 'rgba(255,255,255,0.2)' }} />
            <div>
              <span className="badge" style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '0.85rem',
                padding: '0.35rem 1rem',
              }}>
                {kategori}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAIN SCORES */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>
          Nilai per Domain
        </h2>
        <div className="grid-2" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          <DomainCard nama="Kebijakan SPBE" nilai={domain.kebijakan_spbe} icon="📜" />
          <DomainCard nama="Tata Kelola SPBE" nilai={domain.tata_kelola_spbe} icon="🏛️" />
          <DomainCard nama="Manajemen SPBE" nilai={domain.manajemen_spbe} icon="⚙️" />
          <DomainCard nama="Layanan SPBE" nilai={domain.layanan_spbe} icon="🤝" />
        </div>
      </section>

      {/* KEKUATAN & REKOMENDASI */}
      <div className="grid-2" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Kekuatan */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✅</span> Kekuatan
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {kekuatan.map((item, i) => (
              <li key={i} style={{
                padding: '0.5rem 0.75rem',
                background: 'var(--ok-bg)',
                borderRadius: 'var(--r-xs)',
                fontSize: '0.85rem',
                color: 'var(--ink)',
                lineHeight: 1.4,
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Rekomendasi Prioritas */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--bad)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔴</span> Prioritas Perbaikan
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rekomendasi.map((item, i) => (
              <li key={i} style={{
                padding: '0.5rem 0.75rem',
                background: 'var(--bad-bg)',
                borderRadius: 'var(--r-xs)',
                fontSize: '0.85rem',
                color: 'var(--ink)',
                lineHeight: 1.4,
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* TRANSISI PEMDI */}
      {pemdiFramework && (
        <section style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', background: 'var(--info-bg)', border: '1px solid var(--info)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🔄</span>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--info)' }}>
                  Transisi ke Pemerintah Digital (Pemdi)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {pemdiFramework.catatan}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>
                    Target Indeks Pemdi: <span style={{ color: 'var(--info)' }}>≥ {formatDesimal(pemdiFramework.target_indeks)} ({pemdiFramework.target_predikat})</span>
                  </span>
                  <Link href="/pemdi" className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                    Lihat Dashboard Pemdi →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DOMAIN DETAIL */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>
          Detail Domain SPBE
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Object.entries({
            'Kebijakan SPBE': { nilai: domain.kebijakan_spbe, desc: 'Kebijakan internal yang mengatur penyelenggaraan SPBE di lingkungan Pemkab Aceh Tengah.', icon: '📜' },
            'Tata Kelola SPBE': { nilai: domain.tata_kelola_spbe, desc: 'Struktur organisasi, tim koordinasi, dan proses pengelolaan SPBE yang terdiri dari perencanaan, penganggaran, dan inovasi.', icon: '🏛️' },
            'Manajemen SPBE': { nilai: domain.manajemen_spbe, desc: 'Penerapan manajemen SPBE mencakup pembangunan aplikasi, pusat data, jaringan intra, keamanan, dan audit TIK.', icon: '⚙️' },
            'Layanan SPBE': { nilai: domain.layanan_spbe, desc: 'Ketersediaan dan kualitas layanan administrasi pemerintahan dan layanan publik yang diselenggarakan secara elektronik.', icon: '🤝' },
          }).map(([nama, info]) => (
            <details
              key={nama}
              className="card"
              style={{
                padding: '0',
                borderRadius: 'var(--r-sm)',
                overflow: 'hidden',
              }}
            >
              <summary style={{
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--ink)',
                userSelect: 'none',
              }}>
                <span>{info.icon}</span>
                <span style={{ flex: 1 }}>{nama}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: getLevel(info.nilai).color }}>
                  {formatDesimal(info.nilai)}
                </span>
                <span className="badge" style={{ background: `${getLevel(info.nilai).color}18`, color: getLevel(info.nilai).color, fontSize: '0.65rem' }}>
                  {getLevel(info.nilai).label}
                </span>
              </summary>
              <div style={{
                padding: '0 1.25rem 1rem',
                fontSize: '0.85rem',
                color: 'var(--ink-secondary)',
                lineHeight: 1.6,
                borderTop: '1px solid var(--line)',
                paddingTop: '0.75rem',
                marginTop: '0',
              }}>
                {info.desc}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTNOTE */}
      <section style={{
        padding: '1.25rem',
        background: 'var(--surface)',
        borderRadius: 'var(--r-sm)',
        fontSize: '0.8rem',
        color: 'var(--muted)',
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        Data SPBE bersumber dari hasil evaluasi Diskominfo Aceh Tengah berdasarkan Permenpan RB 59/2020.
        Data akan diperbarui secara berkala sesuai transisi ke kerangka Pemdi (Permenpan RB 8/2026).
      </section>
    </>
  );
}

/* ── Data ── */
export function getStaticProps() {
  return {
    props: {
      data: JSON.parse(JSON.stringify(portalData)),
    },
  };
}
