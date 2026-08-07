import Head from 'next/head'
import { useState, useEffect } from 'react'
import panduanBukti from '@/data/panduan-bukti-l1.json'

export default function Requirement() {
  const [requirements, setRequirements] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/requirement')
      .then(r => r.json())
      .then(d => { setRequirements(d); setLoading(false) })
      .catch(e => { console.error(e); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px', textAlign: 'center', color: '#666' }}>
      <p>Memuat data requirement...</p>
    </div>
  )

  if (!requirements) return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px', textAlign: 'center', color: '#c00' }}>
      <p>Gagal memuat data. Coba refresh halaman.</p>
    </div>
  )

  return (
    <>
      <Head>
        <title>Requirement Peta Proses Bisnis — Pemdi Aceh Tengah</title>
        <meta name="description" content="Daftar kebutuhan data, API, dan akses untuk penyusunan Peta Proses Bisnis Aceh Tengah berdasarkan Permenpan RB 19/2018" />
      </Head>

      {/* HERO */}
      <section style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="pill" style={{ marginBottom: '0.75rem', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
            DOKUMEN PERENCANAAN
          </div>
          <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Requirement Peta Proses Bisnis
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', maxWidth: '600px' }}>
            Kabupaten Aceh Tengah — Berdasarkan Permenpan RB No. 19 Tahun 2018
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span className="card" style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.12)', border: 'none', fontSize: '0.8rem' }}>
              📅 Juni 2026
            </span>
            <span className="card" style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.12)', border: 'none', fontSize: '0.8rem' }}>
              📋 {requirements.summary?.reduce((s, c) => s + c.count, 0) || '-'} Item Kebutuhan
            </span>
            <span className="card" style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.12)', border: 'none', fontSize: '0.8rem' }}>
              🏛️ {requirements.summary?.length || '-'} Kategori
            </span>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Summary Cards */}
        <div className="req-summary">
          <h2 className="section-title">Ringkasan Kebutuhan</h2>
          <div className="req-cards">
            {requirements.summary.map((cat, i) => (
              <div
                key={i}
                className={`req-card ${cat.priority === 'WAJIB' ? 'wajib' : cat.priority === 'SANGAT DIBUTUHKAN' ? 'sangat' : cat.priority === 'PENTING' ? 'penting' : 'pendukung'}`}
                onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
              >
                <div className="req-card-header">
                  <span className="req-card-icon">{cat.icon}</span>
                  <span className="req-card-priority">{cat.priority}</span>
                </div>
                <h3 className="req-card-title">{cat.category}</h3>
                <div className="req-card-stats">
                  <span>{cat.count} item</span>
                  <span>⬇ {cat.kebutuhan}</span>
                </div>
                <div className="req-card-desc">{cat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Per Kategori */}
        {requirements.categories.map((cat) => (
          <div
            key={cat.id}
            id={`cat-${cat.id}`}
            className={`req-detail ${activeCategory === cat.id ? 'open' : ''}`}
          >
            <div className="req-detail-header" onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}>
              <div>
                <span className="req-detail-icon">{cat.icon}</span>
                <span className="req-detail-code">{cat.id}</span>
                <span className="req-detail-name">{cat.name}</span>
                <span className="req-detail-count">{cat.items.length} item</span>
              </div>
              <span className={`req-detail-arrow ${activeCategory === cat.id ? 'up' : ''}`}>▼</span>
            </div>

            {activeCategory === cat.id && (
              <div className="req-detail-body">
                <p className="req-detail-desc">{cat.description}</p>

                {/* Table */}
                <div className="req-table-wrap">
                  <table className="req-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th>Data / Dokumen</th>
                        <th style={{ width: 140 }}>Fungsi</th>
                        <th style={{ width: 90 }}>Format</th>
                        <th style={{ width: 110 }}>Dok. Kunci</th>
                        <th style={{ width: 140 }}>Dari</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ textAlign: 'center', color: '#666' }}>{item.no}</td>
                          <td><strong>{item.data}</strong></td>
                          <td style={{ fontSize: '0.85rem', color: '#555' }}>{item.fungsi}</td>
                          <td style={{ textAlign: 'center' }}>
                            {item.format.split('/').map((f, fi) => (
                              <span key={fi} className="req-format-tag">{f.trim()}</span>
                            ))}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {item.dokumenKunci ? (
                              <span style={{
                                display: 'inline-block', padding: '0.1rem 0.4rem', borderRadius: '4px',
                                background: 'rgba(27,67,50,0.1)', color: '#1B4332',
                                fontSize: '0.7rem', fontWeight: 700,
                              }}>{item.dokumenKunci}</span>
                            ) : <span style={{ color: '#ccc' }}>—</span>}
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{item.sumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Timeline */}
        <div className="req-timeline">
          <h2 className="section-title">Estimasi Implementasi</h2>
          <div className="req-timeline-grid">
            <div className="req-timeline-phase">
              <div className="req-timeline-badge fase1">FASE 1</div>
              <h3>Data Dasar</h3>
              <p className="req-timeline-waktu">Q3 2026</p>
              <ul>
                <li>Dokumen RPJMD lengkap + Logframe</li>
                <li>Daftar 38 OPD + Tupoksi</li>
                <li>Matriks 24 Urusan → OPD</li>
                <li>Level 0: Visi-Misi → Proses</li>
                <li>Data SPBE + Arsitektur</li>
              </ul>
            </div>
            <div className="req-timeline-phase">
              <div className="req-timeline-badge fase2">FASE 2</div>
              <h3>Pemetaan Level 1-2</h3>
              <p className="req-timeline-waktu">Q4 2026</p>
              <ul>
                <li>Renstra 38 OPD</li>
                <li>Identifikasi SIPOC per OPD</li>
                <li>Wawancara 38 OPD</li>
                <li>Kumpulan SOP existing</li>
                <li>Daftar layanan publik</li>
              </ul>
            </div>
            <div className="req-timeline-phase">
              <div className="req-timeline-badge fase3">FASE 3</div>
              <h3>Integrasi & Aplikasi</h3>
              <p className="req-timeline-waktu">2027</p>
              <ul>
                <li>Akses API sistem digital</li>
                <li>Integrasi data kecamatan</li>
                <li>Data kepegawaian detail</li>
                <li>Data keuangan per proses</li>
                <li>BPMN tool → Standardisasi</li>
              </ul>
            </div>
          </div>

          <div className="req-timeline-total">
            <strong>Total estimasi:</strong> 28-43 minggu (7-11 bulan) — dari pengumpulan data hingga pengesahan Perbup
          </div>
        </div>

        {/* Output */}
        <div className="req-outputs">
          <h2 className="section-title">Output yang Akan Dihasilkan</h2>
          <div className="req-output-list">
            {requirements.outputs.map((out, i) => (
              <div key={i} className="req-output-item">
                <span className="req-output-num">{(i + 1).toString().padStart(2, '0')}</span>
                <div>
                  <h4>{out.title}</h4>
                  <p>{out.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📘 Panduan Penyusunan Bukti Dukung Level 1 */}
        <div className="req-panduan">
          <h2 className="section-title">📘 Panduan Penyusunan Bukti Dukung Level 1 (Pemdi 2026)</h2>
          <div className="panduan-notice">
            ⚠️ <strong>Panduan penyusunan (draf)</strong> — bukan bukti final yang dinilai. Dokumen berikut adalah acuan
            penyusunan bukti dukung per indikator sesuai kriteria modul asli PermenPANRB 8/2026. <strong>Belum final:</strong> data
            isian masih contoh, tanda tangan/cap & logo masih placeholder, screenshot masih `[TAMPILAN LAYAR]`. Finalisasi
            sebelum diunggah ke portal eval.spbe.go.id.
          </div>
          <div className="panduan-stats">
            <span className="panduan-stat"><strong>{panduanBukti.indikator.length}</strong> Indikator</span>
            <span className="panduan-stat"><strong>{panduanBukti.indikator.reduce((s, i) => s + i.dokumen.length, 0)}</strong> Dokumen Panduan</span>
            <span className="panduan-stat"><strong>{panduanBukti.indikator.filter(i => i.dokumen.some(d => d.status === 'lengkap')).length}</strong> Indikator dengan Dokumen Final</span>
            <span className="panduan-stat"><strong>Level 1</strong> Cakupan</span>
          </div>

          <div className="panduan-grid">
            {panduanBukti.indikator.map((ind) => (
              <div key={ind.indikator} className="panduan-card">
                <div className="panduan-card-head">
                  <span className="panduan-badge">{ind.indikator}</span>
                  <span className="panduan-aspek">{ind.aspek}</span>
                </div>
                <h3 className="panduan-title">{ind.nama}</h3>
                <div className="panduan-docs">
                  {ind.dokumen.length === 0 ? (
                    <span className="panduan-empty">— belum ada panduan</span>
                  ) : ind.dokumen.map((d, i) => (
                    <div key={i} className="panduan-doc">
                      <div className="panduan-doc-head">
                        <span className={`panduan-status ${d.status}`}>
                          {d.status === 'lengkap' ? '✅ Final' : d.status === 'proses' ? '🔄 Draf' : '📎 Lampiran'}
                        </span>
                        <span className="panduan-jenis">{d.jenis}</span>
                      </div>
                      <div className="panduan-doc-title">{d.judul}</div>
                      <div className="panduan-doc-meta">
                        {d.dokumen_kunci.length > 0 && (
                          <span className="panduan-dk">Dok. Kunci: {d.dokumen_kunci.map(n => `#${n}`).join(', ')}</span>
                        )}
                      </div>
                      {d.catatan && <div className="panduan-catatan">📝 {d.catatan}</div>}
                      <a href={d.file} target="_blank" rel="noopener noreferrer" className="panduan-link">
                        📄 Buka Dokumen ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="req-footer">
          <p>Dokumen ini akan terus diupdate seiring perkembangan pengumpulan data.</p>
          <p>File markdown lengkap: <code>docs/requirement-peta-proses-bisnis.md</code></p>
          <p>Repo: <a href="https://github.com/Niumination/PemdiAcehTengah">github.com/Niumination/PemdiAcehTengah</a></p>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px 80px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--primary);
          border-left: 4px solid var(--primary);
          padding-left: 12px;
          margin: 0 0 20px;
        }
        /* Summary Cards */
        .req-summary {
          margin-bottom: 40px;
        }
        .req-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .req-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .req-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(0,64,152,0.1);
          transform: translateY(-2px);
        }
        .req-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .req-card-icon { font-size: 1.2rem; }
        .req-card-priority {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
        }
        .req-card.wajib .req-card-priority { background: var(--bad); color: white; }
        .req-card.sangat .req-card-priority { background: var(--warn); color: white; }
        .req-card.penting .req-card-priority { background: #ca8a04; color: white; }
        .req-card.pendukung .req-card-priority { background: var(--muted); color: white; }
        .req-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 6px;
          color: var(--ink);
        }
        .req-card-stats {
          display: flex;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .req-card-desc {
          font-size: 0.78rem;
          color: var(--ink-secondary);
          line-height: 1.4;
        }
        /* Detail Accordion */
        .req-detail {
          border: 1px solid var(--line);
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .req-detail.open { border-color: var(--primary); }
        .req-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          cursor: pointer;
          background: var(--bg);
          transition: background 0.2s;
        }
        .req-detail-header:hover { background: var(--primary-50); }
        .req-detail-icon { margin-right: 8px; font-size: 1.1rem; }
        .req-detail-code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.8rem;
          color: var(--primary);
          background: var(--primary-50);
          padding: 2px 8px;
          border-radius: 4px;
          margin-right: 10px;
        }
        .req-detail-name { font-weight: 600; color: var(--ink); font-size: 0.95rem; }
        .req-detail-count {
          font-size: 0.78rem;
          color: var(--muted);
          margin-left: 10px;
        }
        .req-detail-arrow {
          font-size: 0.8rem;
          color: var(--muted-light);
          transition: transform 0.3s;
        }
        .req-detail-arrow.up { transform: rotate(180deg); }
        .req-detail-body {
          padding: 0 18px 18px;
          background: var(--surface);
        }
        .req-detail-desc {
          font-size: 0.9rem;
          color: var(--ink-secondary);
          margin: 12px 0;
          line-height: 1.5;
        }
        .req-table-wrap {
          overflow-x: auto;
        }
        .req-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .req-table th {
          background: var(--primary-50);
          color: var(--primary);
          padding: 8px 10px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid var(--primary);
        }
        .req-table td {
          padding: 8px 10px;
          border-bottom: 1px solid var(--line-2);
          vertical-align: top;
        }
        .req-table tr:hover td { background: var(--bg); }
        .req-format-tag {
          display: inline-block;
          background: var(--primary-50);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.75rem;
          font-family: 'SF Mono', monospace;
          margin: 1px;
        }
        /* Timeline */
        .req-timeline {
          margin: 40px 0;
          background: var(--bg);
          padding: 24px;
          border-radius: 12px;
        }
        .req-timeline-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }
        .req-timeline-phase {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 20px;
        }
        .req-timeline-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .req-timeline-badge.fase1 { background: var(--bad); color: white; }
        .req-timeline-badge.fase2 { background: var(--warn); color: white; }
        .req-timeline-badge.fase3 { background: var(--ok); color: white; }
        .req-timeline-phase h3 { margin: 0 0 4px; font-size: 1rem; color: var(--ink); }
        .req-timeline-waktu { font-size: 0.8rem; color: var(--muted); margin: 0 0 10px; }
        .req-timeline-phase ul { margin: 0; padding-left: 18px; font-size: 0.85rem; color: var(--ink-secondary); }
        .req-timeline-phase li { margin-bottom: 4px; }
        .req-timeline-total {
          background: var(--surface);
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--ink-secondary);
          border: 1px solid var(--line);
        }
        /* Outputs */
        .req-outputs {
          margin: 40px 0;
        }
        .req-output-list {
          display: grid;
          gap: 10px;
        }
        .req-output-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px;
        }
        .req-output-num {
          font-family: 'SF Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          opacity: 0.3;
          min-width: 36px;
          line-height: 1;
        }
        .req-output-item h4 { margin: 0 0 4px; font-size: 0.95rem; color: var(--ink); }
        .req-output-item p { margin: 0; font-size: 0.85rem; color: var(--ink-secondary); line-height: 1.4; }
        /* Footer */
        .req-footer {
          text-align: center;
          padding: 24px 0;
          border-top: 1px solid var(--line);
          margin-top: 40px;
        }
        .req-footer p { margin: 0 0 6px; font-size: 0.85rem; color: var(--muted); }
        .req-footer code { background: var(--bg-subtle); padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; }
        .req-footer a { color: var(--primary); text-decoration: none; }
        .req-footer a:hover { text-decoration: underline; }

        /* ── Panduan Penyusunan Bukti Dukung Level 1 ── */
        .req-panduan { margin-top: 48px; }
        .panduan-notice {
          padding: 14px 16px; border-radius: 10px; font-size: 0.85rem; line-height: 1.55;
          background: var(--warn-bg, #fff7e6); border: 1px solid #f0c36d; color: #7a5b12; margin-bottom: 16px;
        }
        .panduan-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        .panduan-stat {
          padding: 8px 14px; border-radius: 8px; background: #f0f7f2; border: 1px solid #d5e8da;
          font-size: 0.78rem; color: #3d5a45; display: inline-flex; align-items: baseline; gap: 4px;
        }
        .panduan-stat strong { font-size: 1rem; color: #1B4332; }
        .panduan-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 14px;
        }
        .panduan-card {
          border: 1px solid var(--line); border-radius: 12px; padding: 14px; background: var(--surface);
          display: flex; flex-direction: column; gap: 10px;
        }
        .panduan-card-head { display: flex; align-items: center; gap: 8px; }
        .panduan-badge {
          width: 34px; height: 34px; border-radius: 8px; background: #1B4332; color: #fff;
          display: grid; place-items: center; font-weight: 800; font-size: 0.75rem; flex-shrink: 0;
        }
        .panduan-aspek { font-size: 0.68rem; color: #667; background: var(--bg-subtle); padding: 3px 8px; border-radius: 100px; }
        .panduan-title { font-size: 0.85rem; font-weight: 600; margin: 0; color: var(--ink); line-height: 1.35; }
        .panduan-docs { display: flex; flex-direction: column; gap: 8px; }
        .panduan-doc {
          border: 1px solid var(--line); border-radius: 8px; padding: 10px; background: var(--bg-subtle);
          display: flex; flex-direction: column; gap: 5px;
        }
        .panduan-doc-head { display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .panduan-status {
          font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 100px;
          background: var(--bg-subtle); color: var(--muted);
        }
        .panduan-status.lengkap { background: #e6f4ea; color: #1B7A3D; }
        .panduan-status.proses { background: #fff3e0; color: #b26a00; }
        .panduan-jenis { font-size: 0.62rem; color: var(--muted); }
        .panduan-doc-title { font-size: 0.75rem; font-weight: 600; color: var(--ink); line-height: 1.4; }
        .panduan-dk { font-size: 0.65rem; color: #1B4332; background: #e8f2ec; padding: 2px 6px; border-radius: 4px; }
        .panduan-catatan { font-size: 0.65rem; color: var(--muted); line-height: 1.4; }
        .panduan-link {
          font-size: 0.68rem; color: #1B4332; font-weight: 600; text-decoration: none;
          border: 1px solid #1B4332; border-radius: 6px; padding: 4px 10px; align-self: flex-start;
          background: var(--surface); transition: all 0.15s;
        }
        .panduan-link:hover { background: #1B4332; color: #fff; }
        .panduan-empty { font-size: 0.7rem; color: var(--muted); font-style: italic; }

        @media (max-width: 640px) {
          .req-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
