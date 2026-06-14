import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import DetailModal from '@/components/DetailModal';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import portalData from '@/data/opd.json';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PetaProsesBisnis({ data }) {
  const [modalMisi, setModalMisi] = useState(null);
  const probis = data.probis;
  const opdList = data.opd.daftar;

  const opdMap = {};
  opdList.forEach(o => { opdMap[o.id] = o; });

  return (
    <>
      <Head>
        <title>Peta Proses Bisnis (PPB) — Pemdi Aceh Tengah</title>
        <meta name="description" content="Peta Proses Bisnis Pemkab Aceh Tengah 3 level — Visi-Misi, Urusan, Proses Bisnis OPD. Berdasarkan Permenpan 19/2018 dan RPJMD 2025-2030." />
        <meta property="og:title" content="Peta Proses Bisnis (PPB) — Pemdi Aceh Tengah" />
        <meta property="og:description" content="Peta Proses Bisnis Pemkab Aceh Tengah 3 level — Visi-Misi, Urusan, Proses Bisnis OPD. Berdasarkan Permenpan 19/2018." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/probis" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Peta Proses Bisnis (PPB) — Pemdi Aceh Tengah" />
        <meta name="twitter:description" content="Peta Proses Bisnis Pemkab Aceh Tengah 3 level — Berdasarkan Permenpan 19/2018." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Peta Proses Bisnis Aceh Tengah',
              description: 'Peta Proses Bisnis Pemkab Aceh Tengah 3 level — Visi-Misi, Urusan, Proses Bisnis OPD.',
              url: 'https://pemdi-aceh-tengah.vercel.app/probis',
              isPartOf: { '@type': 'WebSite', name: 'Pemdi Aceh Tengah', url: 'https://pemdi-aceh-tengah.vercel.app' },
            }),
          }}
        />
      </Head>

      {/* ============ HERO ============ */}
      <section className="section-hero-probis">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Peta Proses Bisnis (PPB)</h1>
            <p>
              Hierarki proses bisnis Pemerintah Kabupaten Aceh Tengah — 3 level sesuai
              Permenpan RB 19/2018 tentang Penyusunan Peta Proses Bisnis Instansi Pemerintah.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="section">
        <div className="container">

        {/* ============ HIERARCHY OVERVIEW ============ */}
        <section className="ppb-overview">
          <div className="ppb-chain-large">
            <div className="ppb-chain-item">
              <div className="ppb-chain-level">Level 0</div>
              <div className="ppb-chain-label">Visi &amp; Misi</div>
              <div className="ppb-chain-desc">Arah pembangunan daerah</div>
            </div>
            <div className="ppb-chain-arrow">⬇</div>
            <div className="ppb-chain-item">
              <div className="ppb-chain-level">Level 1</div>
              <div className="ppb-chain-label">Urusan Pemerintahan</div>
              <div className="ppb-chain-desc">24 urusan konkuren + urusan umum</div>
            </div>
            <div className="ppb-chain-arrow">⬇</div>
            <div className="ppb-chain-item">
              <div className="ppb-chain-level">Level 2</div>
              <div className="ppb-chain-label">Proses Bisnis OPD</div>
              <div className="ppb-chain-desc">6 kategori — 37 proses spesifik</div>
            </div>
          </div>
        </section>

        {/* ============ LEVEL 0: VISI & MISI ============ */}
        <section className="ppb-section" id="level-0">
          <div className="ppb-section-header">
            <div className="ppb-level-badge level-0">Level 0</div>
            <div>
              <h2>{probis.level_0.label}</h2>
              <p className="ppb-section-desc">Visi &amp; Misi Pembangunan Kabupaten Aceh Tengah</p>
              {probis.level_0.sumber && (
                <p className="ppb-section-source">Sumber: {probis.level_0.sumber}</p>
              )}
            </div>
          </div>

          {/* Visi — Highlight */}
          <div className="ppb-visi-inline">
            <div className="ppb-visi-label-inline">Visi</div>
            <div className="ppb-visi-text-inline">"{probis.level_0.deskripsi}"</div>
          </div>

          {/* 8 Misi — Compact Cards with Modal Detail */}
          <div className="section-subheader">
            <h3>8 Misi Pembangunan</h3>
            <p>Klik card untuk lihat detail — fokus strategis dan OPD pelaksana</p>
          </div>
          <div className="misi-grid">
            {probis.level_0.misi.map((m, i) => (
              <div key={i} className="misi-card-compact" onClick={() => setModalMisi(m)}>
                <div className="misi-number">Misi {formatAngka(i + 1)}</div>
                <h3 className="misi-nama">{m.nama}</h3>
                <div className="misi-detail-link">Lihat Detail →</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ MODAL MISI DETAIL ============ */}
        <DetailModal
          title={modalMisi ? modalMisi.nama : ''}
          open={!!modalMisi}
          onClose={() => setModalMisi(null)}
          maxWidth={600}
        >
          {modalMisi && (
            <div>
              <p style={{ fontSize: '0.875rem', color: '#505a5f', lineHeight: 1.7, marginBottom: '1rem' }}>
                {modalMisi.deskripsi}
              </p>
              {modalMisi.fokus && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#505a5f', marginBottom: '0.5rem' }}>
                    Fokus Strategis:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {modalMisi.fokus.map((f, j) => (
                      <span key={j} className="misi-tag">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {modalMisi.opd_terkait && modalMisi.opd_terkait.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#505a5f', marginBottom: '0.5rem' }}>
                    OPD Pelaksana:
                  </div>
                  <div className="opd-tags">
                    {modalMisi.opd_terkait.map((id) => {
                      const opd = opdMap[id];
                      return opd ? (
                        <Link key={id} href={`/opd/${slugify(opd.nama)}`} className="opd-tag-link">
                          {opd.singkat}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </DetailModal>

        {/* ============ LEVEL 1: URUSAN ============ */}
        <section className="ppb-section" id="level-1">
          <div className="ppb-section-header">
            <div className="ppb-level-badge level-1">Level 1</div>
            <div>
              <h2>{probis.level_1.label}</h2>
              <p className="ppb-section-desc">{probis.level_1.deskripsi} — {formatAngka(probis.level_1.urusan?.length)} urusan</p>
            </div>
          </div>

          <div className="urusan-grid">
            {probis.level_1.urusan.map((u, i) => (
              <div key={i} className="urusan-card">
                <div className="urusan-header">
                  <h3>{u.nama}</h3>
                  <span className="badge badge-blue">{formatAngka(u.opd_terkait?.length)} OPD</span>
                </div>
                <div className="opd-tags">
                  {u.opd_terkait?.map((id) => {
                    const opd = opdMap[id];
                    return opd ? (
                      <Link key={id} href={`/opd/${slugify(opd.nama)}`} className="opd-tag-link">
                        {opd.singkat}
                      </Link>
                    ) : (
                      <span key={id} className="opd-tag">{id}</span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="ppb-note">
            <strong>Catatan:</strong> 24 urusan konkuren berdasarkan UU 23/2014 + urusan umum 
            (Sekretariat, Legislatif, Pengawasan, Kepegawaian, Perencanaan, Keuangan, 
            Kesbangpol, Bencana, Keagamaan, Kecamatan) — total {formatAngka(probis.level_1.urusan?.length)} urusan.
          </div>
        </section>

        {/* ============ LEVEL 2: PROSES BISNIS ============ */}
        <section className="ppb-section" id="level-2">
          <div className="ppb-section-header">
            <div className="ppb-level-badge level-2">Level 2</div>
            <div>
              <h2>{probis.level_2.label}</h2>
              <p className="ppb-section-desc">{probis.level_2.deskripsi}</p>
            </div>
          </div>

          {probis.level_2.kategori.map((k, i) => (
            <div key={i} className="kategori-section">
              <div className="kategori-header" style={{ borderLeftColor: k.warna }}>
                <div className="kategori-icon">{k.icon}</div>
                <div>
                  <h3 style={{ color: k.warna }}>{k.nama}</h3>
                  <p className="kategori-desc">{k.deskripsi}</p>
                </div>
              </div>
              <div className="proses-grid">
                {k.proses?.map((p, j) => (
                  <div key={j} className="proses-card">
                    <div className="proses-nama">{p.nama}</div>
                    <div className="proses-output">
                      <span className="proses-output-label">Output:</span> {p.output}
                    </div>
                    {p.opd_semua ? (
                      <div className="proses-opd-badge">Semua OPD</div>
                    ) : (
                      <div className="opd-tags" style={{ marginTop: '0.5rem' }}>
                        {p.opd_terkait?.map((id) => {
                          const opd = opdMap[id];
                          return opd ? (
                            <Link key={id} href={`/opd/${slugify(opd.nama)}`} className="opd-tag-link">
                              {opd.singkat}
                            </Link>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ============ REGULATORY FRAMEWORK ============ */}
        <section className="ppb-section">
          <div className="ppb-section-header">
            <div className="ppb-level-badge" style={{ background: '#37474f', borderColor: '#37474f' }}>Reg</div>
            <div>
              <h2>Kerangka Regulasi PPB</h2>
              <p className="ppb-section-desc">Dasar hukum penyusunan Peta Proses Bisnis</p>
            </div>
          </div>
          <div className="reg-grid">
            <div className="reg-card">
              <h4>Permenpan RB 19/2018</h4>
              <p>Penyusunan Peta Proses Bisnis Instansi Pemerintah — 3 level hierarki: Level 0 (Visi-Misi), Level 1 (Urusan), Level 2 (Proses Bisnis).</p>
              <a href="https://peraturan.bpk.go.id/Details/132523/permen-pan-rb-no-19-tahun-2018" target="_blank" rel="noopener noreferrer" className="reg-link">
                Baca di BPK ↗
              </a>
            </div>
            <div className="reg-card">
              <h4>UU 23/2014</h4>
              <p>Pemerintahan Daerah — 24 urusan konkuren yang menjadi kewenangan kabupaten/kota.</p>
            </div>
            <div className="reg-card">
              <h4>Permenpan RB 8/2026</h4>
              <p>Evaluasi Kinerja Pemerintah Digital — framework transisi dari SPBE ke Pemdi. 7 aspek, 20 indikator.</p>
            </div>
            <div className="reg-card">
              <h4>Qanun No. 4/2025</h4>
              <p>RPJMD Kabupaten Aceh Tengah 2025-2029 — visi "Aceh Tengah Islami, Maju, Sejahtera, dan Berkeadilan".</p>
            </div>
          </div>
        </section>
        </div>
      </section>

      <style jsx>{`
        .section-hero-probis {
          background: linear-gradient(135deg, #1d70b8 0%, #003078 100%);
          color: white;
          padding: 3rem 0;
        }
        .section-hero-probis .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-probis .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-probis h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-probis p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .ppb-overview { margin-bottom: 3rem; }
        .ppb-chain-large {
          display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 12px; padding: 2rem; flex-wrap: wrap;
        }
        .ppb-chain-item {
          text-align: center; padding: 1rem 1.5rem;
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 8px; min-width: 160px;
        }
        .ppb-chain-level {
          font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--primary);
        }
        .ppb-chain-label { font-weight: 600; margin: 0.25rem 0; font-size: 0.9375rem; }
        .ppb-chain-desc { font-size: 0.75rem; color: var(--muted); }
        .ppb-chain-arrow { font-size: 1.5rem; color: var(--primary); }

        .ppb-section { margin-bottom: 3rem; padding-top: 1rem; }
        .ppb-section-header {
          display: flex; gap: 1rem; align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .ppb-level-badge {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.625rem; font-weight: 700; letter-spacing: 0.03em;
          flex-shrink: 0; color: white; border: 2px solid;
        }
        .level-0 { background: #1565c0; border-color: #1565c0; }
        .level-1 { background: #2e7d32; border-color: #2e7d32; }
        .level-2 { background: #e65100; border-color: #e65100; }
        .ppb-section-desc { color: var(--muted); margin: 0; font-size: 0.9375rem; }
        .ppb-section-source { font-size: 0.75rem; color: var(--muted); margin: 0.25rem 0 0; }

        .ppb-visi-inline {
          background: var(--bg-card);
          border: 2px solid var(--primary);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
        }
        .ppb-visi-label-inline {
          font-size: 0.6875rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--primary); margin-bottom: 0.5rem;
        }
        .ppb-visi-text-inline {
          font-size: 1.125rem; font-weight: 600; line-height: 1.5;
          color: var(--text);
        }

        .ppb-visi-card {
          background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
          color: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem;
          text-align: center;
        }
        .ppb-visi-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
          opacity: 0.8; margin-bottom: 0.5rem;
        }
        .ppb-visi-text { font-size: 1.5rem; font-weight: 700; line-height: 1.4; }

        .section-subheader { margin-bottom: 1.25rem; }
        .section-subheader h3 { margin: 0; font-size: 1.125rem; }
        .section-subheader p { margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--muted); }

        .misi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (max-width: 768px) {
          .misi-grid { grid-template-columns: 1fr; }
        }

        .misi-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 10px; padding: 1.25rem;
        }
        .misi-card-compact {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 10px; padding: 1.25rem;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
        }
        .misi-card-compact:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .misi-detail-link {
          margin-top: 0.75rem; font-size: 0.75rem; font-weight: 600;
          color: var(--primary); text-align: right;
        }
        .misi-number {
          font-size: 0.625rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--primary); margin-bottom: 0.25rem;
        }
        .misi-nama { font-size: 1rem; font-weight: 600; margin: 0 0 0.5rem; }
        .misi-deskripsi { font-size: 0.8125rem; color: var(--muted); margin: 0 0 0.75rem; line-height: 1.55; }
        .misi-fokus { margin-bottom: 0.75rem; }
        .misi-fokus-label {
          font-size: 0.6875rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: var(--muted); margin-bottom: 0.375rem;
        }
        .misi-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .misi-tag {
          font-size: 0.6875rem; padding: 0.2rem 0.5rem;
          background: rgba(21, 101, 192, 0.08); color: var(--primary);
          border-radius: 4px;
        }
        .misi-opd-links { margin-top: 0.5rem; }

        .urusan-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .urusan-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .urusan-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .urusan-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.875rem;
        }
        .urusan-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .urusan-header h3 { font-size: 0.8125rem; font-weight: 600; margin: 0; }

        .ppb-note {
          margin-top: 1rem; padding: 0.75rem 1rem;
          background: rgba(21, 101, 192, 0.05); border-left: 3px solid var(--primary);
          border-radius: 6px; font-size: 0.8125rem; color: var(--muted);
        }

        .kategori-section { margin-bottom: 1.5rem; }
        .kategori-header {
          display: flex; gap: 1rem; align-items: flex-start;
          border-left: 3px solid; padding-left: 1rem; margin-bottom: 1rem;
        }
        .kategori-icon { font-size: 1.5rem; }
        .kategori-header h3 { font-size: 1.125rem; font-weight: 600; margin: 0; }
        .kategori-desc { font-size: 0.8125rem; color: var(--muted); margin: 0.25rem 0 0; }

        .proses-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.625rem;
        }
        @media (max-width: 768px) {
          .proses-grid { grid-template-columns: 1fr; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .proses-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .proses-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 8px; padding: 0.875rem;
        }
        .proses-nama { font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.375rem; }
        .proses-output { font-size: 0.6875rem; color: var(--muted); }
        .proses-output-label { font-weight: 600; }
        .proses-opd-badge {
          display: inline-block; margin-top: 0.5rem;
          font-size: 0.625rem; padding: 0.15rem 0.5rem;
          background: rgba(0, 0, 0, 0.05); border-radius: 4px; color: var(--muted);
        }

        .reg-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (max-width: 768px) {
          .reg-grid { grid-template-columns: 1fr; }
        }
        .reg-card {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.25rem;
        }
        .reg-card h4 { font-size: 0.9375rem; font-weight: 600; margin: 0 0 0.5rem; }
        .reg-card p { font-size: 0.8125rem; color: var(--muted); margin: 0 0 0.75rem; line-height: 1.55; }
        .reg-link { font-size: 0.8125rem; font-weight: 600; color: var(--primary); }
      `}</style>
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      data: portalData,
    },
  };
}
