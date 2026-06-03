import Head from 'next/head'
import { useState, useEffect } from 'react'

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

      <div className="page-container">
        {/* Header */}
        <div className="req-header">
          <div className="req-header-badge">DOKUMEN PERENCANAAN</div>
          <h1 className="req-title">Requirement Peta Proses Bisnis</h1>
          <p className="req-subtitle">
            Kabupaten Aceh Tengah — Berdasarkan Permenpan RB No. 19 Tahun 2018
          </p>
          <div className="req-meta">
            <span className="req-meta-item">📅 Juni 2026</span>
            <span className="req-meta-item">📋 83 Item Kebutuhan</span>
            <span className="req-meta-item">🏛️ 12 Kategori</span>
          </div>
        </div>

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
          padding: 40px 20px 80px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .section-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: #004098;
          border-left: 4px solid #004098;
          padding-left: 12px;
          margin: 0 0 20px;
        }
        /* Header */
        .req-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .req-header-badge {
          display: inline-block;
          background: #004098;
          color: white;
          padding: 4px 14px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .req-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }
        .req-subtitle {
          font-size: 1rem;
          color: #666;
          margin: 0 0 16px;
        }
        .req-meta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .req-meta-item {
          background: #f5f7fa;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #555;
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
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .req-card:hover {
          border-color: #004098;
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
        .req-card.wajib .req-card-priority { background: #dc2626; color: white; }
        .req-card.sangat .req-card-priority { background: #ea580c; color: white; }
        .req-card.penting .req-card-priority { background: #ca8a04; color: white; }
        .req-card.pendukung .req-card-priority { background: #6b7280; color: white; }
        .req-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0 0 6px;
          color: #1a1a2e;
        }
        .req-card-stats {
          display: flex;
          gap: 8px;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 6px;
        }
        .req-card-desc {
          font-size: 0.78rem;
          color: #777;
          line-height: 1.4;
        }
        /* Detail Accordion */
        .req-detail {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .req-detail.open { border-color: #004098; }
        .req-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          cursor: pointer;
          background: #fafbfc;
          transition: background 0.2s;
        }
        .req-detail-header:hover { background: #f0f4ff; }
        .req-detail-icon { margin-right: 8px; font-size: 1.1rem; }
        .req-detail-code {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.8rem;
          color: #004098;
          background: #e8edf5;
          padding: 2px 8px;
          border-radius: 4px;
          margin-right: 10px;
        }
        .req-detail-name { font-weight: 600; color: #1a1a2e; font-size: 0.95rem; }
        .req-detail-count {
          font-size: 0.78rem;
          color: #888;
          margin-left: 10px;
        }
        .req-detail-arrow {
          font-size: 0.8rem;
          color: #999;
          transition: transform 0.3s;
        }
        .req-detail-arrow.up { transform: rotate(180deg); }
        .req-detail-body {
          padding: 0 18px 18px;
          background: white;
        }
        .req-detail-desc {
          font-size: 0.9rem;
          color: #555;
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
          background: #f0f4ff;
          color: #004098;
          padding: 8px 10px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #004098;
        }
        .req-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #eef0f2;
          vertical-align: top;
        }
        .req-table tr:hover td { background: #fafbfc; }
        .req-format-tag {
          display: inline-block;
          background: #f0f4ff;
          color: #004098;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.75rem;
          font-family: 'SF Mono', monospace;
          margin: 1px;
        }
        /* Timeline */
        .req-timeline {
          margin: 40px 0;
          background: #f8faff;
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
          background: white;
          border: 1px solid #e5e7eb;
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
        .req-timeline-badge.fase1 { background: #dc2626; color: white; }
        .req-timeline-badge.fase2 { background: #ea580c; color: white; }
        .req-timeline-badge.fase3 { background: #166534; color: white; }
        .req-timeline-phase h3 { margin: 0 0 4px; font-size: 1rem; color: #1a1a2e; }
        .req-timeline-waktu { font-size: 0.8rem; color: #888; margin: 0 0 10px; }
        .req-timeline-phase ul { margin: 0; padding-left: 18px; font-size: 0.85rem; color: #555; }
        .req-timeline-phase li { margin-bottom: 4px; }
        .req-timeline-total {
          background: white;
          padding: 12px 18px;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #333;
          border: 1px solid #e5e7eb;
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
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 16px;
        }
        .req-output-num {
          font-family: 'SF Mono', monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #004098;
          opacity: 0.3;
          min-width: 36px;
          line-height: 1;
        }
        .req-output-item h4 { margin: 0 0 4px; font-size: 0.95rem; color: #1a1a2e; }
        .req-output-item p { margin: 0; font-size: 0.85rem; color: #666; line-height: 1.4; }
        /* Footer */
        .req-footer {
          text-align: center;
          padding: 24px 0;
          border-top: 1px solid #e5e7eb;
          margin-top: 40px;
        }
        .req-footer p { margin: 0 0 6px; font-size: 0.85rem; color: #888; }
        .req-footer code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 0.8rem; }
        .req-footer a { color: #004098; text-decoration: none; }
        .req-footer a:hover { text-decoration: underline; }

        @media (max-width: 640px) {
          .req-title { font-size: 1.5rem; }
          .req-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
