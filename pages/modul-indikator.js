import Head from 'next/head';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ── Data ──
import moduls from '@/data/modul-indikator.json';
import pemdiData from '@/data/pemdi.json';

// ── Helpers ──
function cariIndikator(id) {
  for (const a of pemdiData.aspek) {
    for (const ind of a.indikator) {
      if (ind.id === id) return { ...ind, aspekNama: a.nama, aspekSingkat: a.singkat };
    }
  }
  return null;
}

const STATUS_META = {
  belum:   { icon: '⬜', label: 'Belum',     color: '#6b7280', bg: '#f3f4f6' },
  proses:  { icon: '🔄', label: 'Proses',    color: '#d97706', bg: '#fef3c7' },
  lengkap: { icon: '✅', label: 'Lengkap',    color: '#059669', bg: '#d1fae5' },
};

const LEVEL_LABEL = { 0: 'Baseline', 1: 'Initiate', 2: 'Emerging', 3: 'Established', 4: 'Leading', 5: 'Transformative' };
const LEVEL_WARNA = { 0: '#9ca3af', 1: '#ef4444', 2: '#f59e0b', 3: '#3b82f6', 4: '#10b981', 5: '#8b5cf6' };

function hitungStatus(ind) {
  if (!ind?.bukti_dukung) return { count: 0, lengkap: 0, proses: 0, belum: 0 };
  const bd = ind.bukti_dukung;
  return {
    count: bd.length,
    lengkap: bd.filter(b => b.status === 'lengkap').length,
    proses: bd.filter(b => b.status === 'proses').length,
    belum: bd.filter(b => b.status === 'belum' || !b.status).length,
  };
}

export default function ModulIndikatorPage() {
  const router = useRouter();
  const [cari, setCari] = useState('');
  const [aspekFilter, setAspekFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState(0); // 0 = all
  const [buka, setBuka] = useState(null);
  const [tabFilter, setTabFilter] = useState('semua'); // 'semua' | 'perlu' | 'selesai'

  // Auto-open modul from query param ?modul=N
  useEffect(() => {
    if (router.query.modul) {
      const n = parseInt(router.query.modul, 10);
      if (n >= 1 && n <= 20) {
        setBuka(n);
        // Scroll to the modul after a brief delay for render
        setTimeout(() => {
          const el = document.getElementById(`modul-${n}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [router.query.modul]);

  // Build merged data: modul + pemdi
  const merged = useMemo(() => {
    return moduls.modules.map(m => {
      const ind = cariIndikator(m.indikator_id);
      const status = hitungStatus(ind);
      return { ...m, ind, status };
    });
  }, []);

  // Filtering
  const filtered = useMemo(() => {
    let list = merged;
    if (aspekFilter !== 'all') list = list.filter(m => m.aspek === aspekFilter);
    if (levelFilter > 0) list = list.filter(m =>
      m.ind?.bukti_dukung?.some(b => b.level === levelFilter)
    );
    if (cari) {
      const q = cari.toLowerCase();
      list = list.filter(m =>
        m.judul?.toLowerCase().includes(q) ||
        m.deskripsi?.toLowerCase().includes(q) ||
        m.indikator_id?.toLowerCase().includes(q)
      );
    }
    if (tabFilter === 'perlu') list = list.filter(m => m.status.belum > 0 || m.status.proses > 0);
    if (tabFilter === 'selesai') list = list.filter(m => m.status.lengkap === m.status.count && m.status.count > 0);
    return list;
  }, [merged, aspekFilter, levelFilter, cari, tabFilter]);

  const byAspek = useMemo(() => {
    const map = {};
    merged.forEach(m => {
      if (!map[m.aspek]) map[m.aspek] = [];
      map[m.aspek].push(m);
    });
    return map;
  }, [merged]);

  const semuaAspek = Object.keys(byAspek);

  return (
    <>
      <Head>
        <title>Modul Indikator Pemdi — Pemkab Aceh Tengah</title>
        <meta name="description"
          content="Panduan bukti dukung 20 indikator Pemdi berdasarkan PermenPANRB 8/2026 — dilengkapi penanggung jawab, level kriteria, dan rekomendasi pengumpulan bukti." />
      </Head>

      {/* ════════ HERO ════════ */}
      <section className="hero">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <Link href="/pemdi" className="back-link" style={{ flexShrink: 0 }}>
              ← Halaman Pemdi
            </Link>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <h1>📋 Modul Indikator Pemdi</h1>
            <p style={{ color: 'var(--muted)', marginTop: '0.25rem', maxWidth: 640 }}>
              Panduan penyusunan bukti dukung untuk 20 indikator Pemerintah Digital
              berdasarkan PermenPANRB 8/2026. Dilengkapi penanggung jawab, level kriteria,
              dan rekomendasi pengumpulan bukti sesuai kondisi Pemkab Aceh Tengah.
            </p>
          </div>

          {/* ════ Stat Bar ════ */}
          <div className="stat-row" style={{ marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="stat-badge">
              {merged.filter(m => m.status.lengkap === m.status.count && m.status.count > 0).length}/{merged.length} indikator lengkap
            </span>
            <span className="stat-badge">
              {merged.reduce((s, m) => s + m.status.count, 0)} total bukti dukung
            </span>
            <span className="stat-badge" style={{ background: '#fef3c7', color: '#92400e' }}>
              {merged.reduce((s, m) => s + m.status.belum, 0)} perlu dikerjakan
            </span>
            <span className="stat-badge" style={{ background: '#d1fae5', color: '#065f46' }}>
              {merged.reduce((s, m) => s + m.status.lengkap, 0)} selesai
            </span>
          </div>
        </div>
      </section>

      {/* ════════ FILTER BAR ════════ */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <input
              type="text" value={cari}
              onChange={e => setCari(e.target.value)}
              placeholder="Cari indikator / kata kunci..."
              style={{
                flex: 1, minWidth: '200px', padding: '0.6rem 1rem',
                border: '1px solid var(--border)', borderRadius: '8px',
                fontSize: '0.875rem', background: 'var(--card-bg)',
              }}
            />
            <select value={aspekFilter} onChange={e => setAspekFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', background: 'var(--card-bg)' }}>
              <option value="all">Semua Aspek</option>
              {semuaAspek.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={levelFilter} onChange={e => setLevelFilter(Number(e.target.value))}
              style={{ padding: '0.6rem 1rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.85rem', background: 'var(--card-bg)' }}>
              <option value={0}>Semua Level</option>
              {[1,2,3,4,5].map(l => <option key={l} value={l}>Level {l} — {LEVEL_LABEL[l]}</option>)}
            </select>
          </div>

          {/* Tab filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'semua', label: `Semua (${merged.length})` },
              { key: 'perlu', label: `Perlu Dikerjakan (${merged.filter(m => m.status.belum > 0 || m.status.proses > 0).length})` },
              { key: 'selesai', label: `Selesai (${merged.filter(m => m.status.lengkap === m.status.count && m.status.count > 0).length})` },
            ].map(tab => (
              <button key={tab.key} onClick={() => setTabFilter(tab.key)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '20px', border: 'none',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  background: tabFilter === tab.key ? 'var(--primary)' : 'var(--surface-2)',
                  color: tabFilter === tab.key ? '#fff' : 'var(--text)',
                  transition: 'all 0.15s',
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ════════ MODUL LIST ════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(modul => {
              const warnaAspek = pemdiData.aspek.find(a => a.nama === modul.aspek) || {};
              const w = warnaAspek.warna || '#6b7280';
              const isOpen = buka === modul.nomor;
              const pj = modul.ind?.penanggung_jawab;

              return (
                <div key={modul.nomor} id={`modul-${modul.nomor}`}
                  style={{
                    border: `1px solid ${w}25`, borderRadius: '12px',
                    background: 'var(--card-bg)', overflow: 'hidden',
                    boxShadow: isOpen ? `0 0 0 2px ${w}30` : 'none',
                    transition: 'box-shadow 0.2s',
                  }}>
                  {/* ── HEADER ── */}
                  <button onClick={() => setBuka(isOpen ? null : modul.nomor)}
                    style={{
                      width: '100%', padding: '1rem 1.25rem',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontFamily: 'inherit',
                    }}>
                    <span style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: `${w}15`, color: w,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                    }}>{modul.nomor}</span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text)' }}>
                          {modul.indikator_id} — {modul.judul}
                        </strong>
                        <span style={{
                          fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                          background: `${w}15`, color: w, fontWeight: 600,
                        }}>{modul.aspek?.replace('Aspek ', 'A')}</span>
                      </div>

                      {/* Progress bar */}
                      {modul.status.count > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                          <div style={{
                            flex: 1, height: '4px', borderRadius: '2px',
                            background: '#e5e7eb', overflow: 'hidden', maxWidth: '200px',
                          }}>
                            <div style={{
                              height: '100%', borderRadius: '2px',
                              width: `${(modul.status.lengkap / modul.status.count) * 100}%`,
                              background: 'linear-gradient(90deg, #10b981, #059669)',
                              transition: 'width 0.3s',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                            {modul.status.lengkap}/{modul.status.count} bukti
                          </span>
                        </div>
                      )}
                    </div>

                    <span style={{
                      color: 'var(--muted)', fontSize: '1.2rem',
                      transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none',
                    }}>▾</span>
                  </button>

                  {/* ── CONTENT (expandable) ── */}
                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1.5rem',
                      borderTop: `1px solid ${w}15`,
                    }}>
                      {/* Description */}
                      {modul.deskripsi && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, margin: '0.75rem 0' }}>
                          {modul.deskripsi}
                        </p>
                      )}

                      {/* ════ Level Criteria ════ */}
                      {modul.level_kriteria?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                            📊 Kriteria per Level
                          </h4>
                          <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '0.5rem',
                          }}>
                            {modul.level_kriteria.map(lk => (
                              <div key={lk.level} style={{
                                padding: '0.6rem 0.75rem', borderRadius: '8px',
                                background: `${LEVEL_WARNA[lk.level] || '#6b7280'}08`,
                                border: `1px solid ${LEVEL_WARNA[lk.level] || '#6b7280'}20`,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                  <span style={{
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    background: LEVEL_WARNA[lk.level] || '#6b7280',
                                    color: '#fff', fontSize: '0.6rem', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>{lk.level}</span>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                    {LEVEL_LABEL[lk.level] || `Level ${lk.level}`}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                                  {lk.kriteria}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ════ Evidence from Modul ════ */}
                      {modul.data_dukung_modul?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                            📎 Contoh Bukti Dukung (Modul)
                          </h4>
                          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                            {modul.data_dukung_modul.map((item, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ════ Penanggung Jawab ════ */}
                      {pj && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: `${w}08`, border: `1px solid ${w}20` }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text)' }}>
                            👤 Penanggung Jawab
                          </h4>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                            <div><strong>Lead:</strong> {pj.lead}</div>
                            {pj.support?.length > 0 && (
                              <div style={{ marginTop: '0.2rem' }}>
                                <strong>Support:</strong> {pj.support.join(', ')}
                              </div>
                            )}
                            {pj.tim && <div style={{ marginTop: '0.2rem' }}><strong>Tim:</strong> {pj.tim}</div>}
                          </div>
                        </div>
                      )}

                      {/* ════ Current Evidence Status ════ */}
                      {modul.ind?.bukti_dukung?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                            📋 Bukti Dukung — Kondisi Existing Pemkab Aceh Tengah
                          </h4>
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{
                              width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem',
                              border: '1px solid var(--border)',
                            }}>
                              <thead>
                                <tr style={{ background: 'var(--surface-2)' }}>
                                  <th style={thStyle}>Level</th>
                                  <th style={thStyle}>Nama Bukti Dukung</th>
                                  <th style={thStyle}>OPD Terkait</th>
                                  <th style={thStyle}>Status</th>
                                  <th style={thStyle}>Catatan</th>
                                </tr>
                              </thead>
                              <tbody>
                                {modul.ind.bukti_dukung.map(bd => {
                                  const sm = STATUS_META[bd.status] || STATUS_META.belum;
                                  return (
                                    <tr key={bd.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                      <td style={tdStyle}>
                                        <span style={{
                                          padding: '0.15rem 0.4rem', borderRadius: '4px',
                                          background: `${LEVEL_WARNA[bd.level] || '#6b7280'}15`,
                                          color: LEVEL_WARNA[bd.level] || '#6b7280',
                                          fontWeight: 600, fontSize: '0.7rem',
                                        }}>L{bd.level}</span>
                                      </td>
                                      <td style={{ ...tdStyle, fontWeight: 500 }}>
                                        {bd.nama}
                                        {bd.detail && <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{bd.detail}</div>}
                                      </td>
                                      <td style={tdStyle}>
                                        {bd.opd?.map((o, i) => (
                                          <span key={i} style={{
                                            display: 'inline-block', padding: '0.1rem 0.35rem',
                                            margin: '0.1rem', borderRadius: '4px',
                                            background: 'var(--surface-2)', fontSize: '0.7rem',
                                          }}>{o}</span>
                                        ))}
                                      </td>
                                      <td style={tdStyle}>
                                        <span style={{
                                          display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                          padding: '0.15rem 0.5rem', borderRadius: '4px',
                                          background: sm.bg, color: sm.color,
                                          fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                                        }}>
                                          {sm.icon} {sm.label}
                                        </span>
                                      </td>
                                      <td style={{ ...tdStyle, fontSize: '0.7rem', color: 'var(--muted)', maxWidth: '200px' }}>
                                        {bd.catatan || '-'}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* ════ Quick Actions ════ */}
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Link href="/pemdi" style={{
                          padding: '0.4rem 0.75rem', borderRadius: '6px',
                          fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
                          background: 'var(--primary)', color: '#fff',
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        }}>
                          📊 Lihat di Halaman Pemdi →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                Tidak ada modul yang cocok dengan filter.
              </div>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .stat-row {
          display: flex;
          align-items: center;
        }
        .stat-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          background: var(--surface-2);
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

const thStyle = {
  padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 600,
  fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.02em',
  borderBottom: '2px solid var(--border)', whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.5rem 0.75rem', verticalAlign: 'top',
};
