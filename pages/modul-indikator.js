import Head from 'next/head';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ── Data ──
import moduls from '@/data/modul-indikator.json';
import pemdiData from '@/data/pemdi.json';
import dokumenKunci from '@/data/dokumen-kunci.json';

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
  belum:   { icon: '⬜', label: 'Belum',     color: 'var(--muted)', bg: 'var(--surface-2)' },
  proses:  { icon: '🔄', label: 'Proses',    color: 'var(--warn)', bg: 'var(--warn-bg)' },
  lengkap: { icon: '✅', label: 'Lengkap',    color: 'var(--ok)', bg: 'var(--ok-bg)' },
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
  const [previewDoc, setPreviewDoc] = useState(null); // { url, title } | null
  const [bukaDokumen, setBukaDokumen] = useState(null); // dokumen kunci accordion

  // Convert JDIH URL to proxy URL for same-origin iframe
  const toProxyUrl = (url) => {
    if (!url) return '';
    return `/api/proxy-pdf?url=${encodeURIComponent(url)}`;
  };

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
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              {merged.reduce((s, m) => s + m.status.belum, 0)} perlu dikerjakan
            </span>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
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
                            background: 'var(--line)', overflow: 'hidden', maxWidth: '200px',
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

                      {/* ════ Current Evidence Status — validated by PemdiArena ════ */}
                      {modul.ind?.bukti_dukung?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          {modul.status.lengkap === 0 && modul.status.count > 0 && (
                            <div style={{
                              padding: '0.75rem', borderRadius: '8px',
                              background: 'var(--warn-bg)', border: '1px solid var(--warn)',
                              fontSize: '0.8rem', color: 'var(--warn)',
                            }}>
                              ⚠️ <strong>Semua status bukti dukung saat ini Belum</strong> —
                              perlu diverifikasi ulang sesuai kriteria level masing-masing indikator.
                            </div>
                          )}
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
                                  <th style={thStyle}>OPD</th>
                                  <th style={thStyle}>Status</th>
                                  <th style={{...thStyle, width:'70px', textAlign:'center'}}>Aksi</th>
                                  <th style={thStyle}>Catatan</th>
                                </tr>
                              </thead>
                              <tbody>
                                {modul.ind.bukti_dukung.map(bd => {
                                const sm = STATUS_META[bd.status] || STATUS_META.belum;
                                const url = bd.url_preview || '';
                                const isPdf = bd._ext === 'pdf' && !!url;
                                const canPreview = isPdf;
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
                                    <td style={{...tdStyle, textAlign:'center'}}>
                                      {canPreview ? (
                                        <button onClick={() => setPreviewDoc({url: toProxyUrl(url), title: bd.nama})}
                                          style={{
                                            padding: '0.25rem 0.5rem', borderRadius: '4px', border: 'none',
                                            background: 'var(--primary)', color: '#fff', cursor: 'pointer',
                                            fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                                          }}>
                                          👁️ Lihat
                                        </button>
                                      ) : (
                                        <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ ...tdStyle, fontSize: '0.7rem', color: 'var(--muted)', maxWidth: '160px' }}>
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

      {/* ════════ DOKUMEN KUNCI — detail bukti dukung (tambahan, tidak mengubah modul) ════════ */}
      <section style={{ marginTop: '3rem' }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem',
          }}>
            <span style={{ fontSize: '1.5rem' }}>🗂️</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Peta Dokumen Kunci Bukti Dukung
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 720, marginBottom: '1rem' }}>
            {dokumenKunci.total_dokumen} dokumen kunci yang harus disiapkan — satu dokumen dapat menginisiasi
            beberapa indikator sekaligus. Klik untuk melihat substansi/isi wajib di dalamnya.
          </p>

          {/* Stat mini */}
          <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              {dokumenKunci.total_dokumen} dokumen kunci
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              {dokumenKunci.dokumen.filter(d => d.prioritas.toLowerCase().includes('tertinggi')).length} prioritas tertinggi
            </span>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              {dokumenKunci.dokumen.reduce((s, d) => s + d.substansi.length, 0)} item substansi wajib
            </span>
          </div>

          {/* Daftar dokumen kunci (accordion) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {dokumenKunci.dokumen.map((doc) => {
              const open = bukaDokumen === doc.no;
              const prioritasWarna = doc.prioritas.toLowerCase().includes('tertinggi')
                ? 'var(--danger, #e63946)' : doc.prioritas.toLowerCase().includes('tinggi')
                ? 'var(--warn, #f59e0b)' : 'var(--muted)';
              return (
                <div key={doc.no} style={{
                  border: '1px solid var(--border)', borderRadius: '10px',
                  background: open ? 'var(--surface-2)' : 'var(--card-bg)',
                  overflow: 'hidden', transition: 'all 0.2s',
                }}>
                  {/* Header */}
                  <button
                    onClick={() => setBukaDokumen(open ? null : doc.no)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.85rem 1rem', border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left', color: 'var(--text)',
                    }}
                  >
                    <span style={{
                      minWidth: '28px', height: '28px', borderRadius: '8px',
                      background: 'var(--surface-2)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--muted)',
                    }}>{doc.no}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.85rem' }}>{doc.nama}</span>
                    <span style={{ fontSize: '0.7rem', color: prioritasWarna, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {doc.prioritas}
                    </span>
                    <span style={{
                      fontSize: '0.65rem', color: 'var(--muted)', background: 'var(--surface-2)',
                      padding: '0.15rem 0.5rem', borderRadius: '12px', whiteSpace: 'nowrap',
                    }}>
                      {doc.indikator.length > 0 ? doc.indikator.join(' · ') : 'Lintas indikator'}
                    </span>
                    <span style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                  </button>

                  {/* Isi (accordion body) */}
                  {open && (
                    <div style={{ padding: '0.25rem 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
                      {/* Jenis */}
                      {doc.jenis && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.75rem 0 0.25rem' }}>
                          <strong style={{ color: 'var(--text)' }}>Jenis:</strong> {doc.jenis}
                        </p>
                      )}
                      {/* Penanggung jawab */}
                      {doc.penanggung_jawab && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.25rem 0' }}>
                          <strong style={{ color: 'var(--text)' }}>Penanggung Jawab:</strong> {doc.penanggung_jawab}
                        </p>
                      )}
                      {/* Unit pendukung */}
                      {doc.unit_pendukung && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.25rem 0' }}>
                          <strong style={{ color: 'var(--text)' }}>Unit Pendukung:</strong> {doc.unit_pendukung}
                        </p>
                      )}
                      {/* Indikator & level */}
                      {doc.indikator_level && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0.25rem 0' }}>
                          <strong style={{ color: 'var(--text)' }}>Indikator & Level Dicakup:</strong> {doc.indikator_level}
                        </p>
                      )}

                      {/* Substansi wajib */}
                      {doc.substansi.length > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
                            📝 Substansi / Isi yang Wajib Dimuat:
                          </p>
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {doc.substansi.map((s, i) => (
                              <li key={i} style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '1rem' }}>
            Sumber: {dokumenKunci.sumber}
          </p>
        </div>
      </section>

      {/* ════════ ANALISIS KESESUAIAN RPJMD 2025-2029 ════════ */}
      <section style={{ marginTop: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📑</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Analisis Kesesuaian RPJMD 2025-2029
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 760, marginBottom: '1rem' }}>
            Hasil ekstraksi dan analisis <strong>RPJMD Kabupaten Aceh Tengah 2025-2029</strong> (Qanun Tahun 2025,
            409 halaman) terhadap substansi yang dibutuhkan pada Peta Dokumen Kunci — khususnya
            <strong> Dokumen #1 (RPJMD/RKPD/Renstra/Renja yang Memuat Substansi RAN Pemdi)</strong>.
            Berikut poin-poin yang <strong style={{ color: 'var(--ok)' }}>sudah termuat</strong>.
          </p>

          {/* Ringkasan stat */}
          <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              6/9 substansi termuat
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              3 perlu penguatan
            </span>
            <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              Indeks SPBE target: 1,5 → 1,92 (2029)
            </span>
          </div>

          {/* Tabel kesesuaian substansi */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Substansi Wajib (Dokumen #1)</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'center', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Status</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Lokasi di RPJMD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bab/uraian khusus Pemerintah Digital (SPBE/Pemdi) — visi, misi, arah kebijakan, strategi</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bab 2.3.4 Transformasi Digital (II-116); Sasaran "Meningkatnya Transformasi Digital dalam Tata Kelola" (III-28)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program & kegiatan Pemdi beserta indikator kinerja + target</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program Pengelolaan Aplikasi Informatika, Indeks SPBE 1,5→1,92, IPTIK 5,7→7,0</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Rencana pengembangan aplikasi & pemaduan layanan ke portal</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Koordinasi pemanfaatan Portal Pelayanan Pemerintah Daerah terintegrasi (III-40); portal layanan terpadu + aplikasi mobile + sistem data terpadu</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Kebijakan anggaran Pemdi (arah alokasi anggaran lintas PD)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Proyeksi belanja Kominfo (Rp 212-247 jt/tahun) & Persandian (Rp 27-77 jt/tahun) 2025-2029</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Interoperabilitas data & integrasi layanan (Sistem Penghubung Layanan)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Sub kegiatan "Sistem Penghubung Layanan Pemerintah Daerah dalam rangka interoperabilitas data dan integrasi layanan"</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Rencana kolaborasi antar PD & instansi (Pemdi lintas sektor)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--ok)' }}>✅ Termuat (parsial)</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Forum Satu Data, koordinasi e-walidata SIPD, kolaborasi dengan PT & komunitas digital (II-116)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Matriks pemetaan (full mapping) substansi RAN Pemdi → bab/program</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--warn)' }}>⚠️ Perlu penguatan</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Tersirat integrasi IPD ke kinerja seluruh OPD, belum ada matriks eksplisit</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Manajemen layanan digital (risiko, perubahan, pengetahuan, BCP, relasi pengguna)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--warn)' }}>⚠️ Perlu penguatan</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Belum eksplisit — perlu SOP/IK manajemen layanan digital (Dokumen #8)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Keterkaitan eksplisit dengan Arsitektur Pemdi (SIAP Digital) & RAN Pemdi</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><span style={{ color: 'var(--warn)' }}>⚠️ Perlu penguatan</span></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Mengadopsi kerangka IPD & EGA, belum referensi silang ke SIAP Digital</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Screenshot bukti */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
              📸 Bukti Visual dari RPJMD:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                { src: '/docs/rpjmd/bab-transformasi-digital.png', title: 'Bab 2.3.4 Transformasi Digital (II-116)', desc: 'Pengarusutamaan transformasi digital: super platform, percepatan digitalisasi, talenta digital' },
                { src: '/docs/rpjmd/tabel-indeks-spbe.png', title: 'Capaian Indeks SPBE (II-150)', desc: 'Tabel kinerja Kominfo: Indeks SPBE 1,54 (2020) → 2,18 (2024), target 2029: 1,92' },
                { src: '/docs/rpjmd/arah-kebijakan-digital.png', title: 'Arah Kebijakan Transformasi Digital (III-28)', desc: 'Misi 3: percepatan transformasi digital, perluasan infrastruktur, SDM digital, digitalisasi layanan prioritas' },
                { src: '/docs/rpjmd/program-portal.png', title: 'Program Portal Terpadu (III-40)', desc: 'Koordinasi pemanfaatan Portal Pelayanan Pemerintah Daerah terintegrasi + interoperabilitas data' },
              ].map((img, i) => (
                <div key={i} style={{
                  border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden',
                  background: 'var(--card-bg)',
                }}>
                  <button
                    onClick={() => setPreviewDoc({ url: img.src, title: img.title })}
                    style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%', display: 'block' }}
                  >
                    <img src={img.src} alt={img.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </button>
                  <div style={{ padding: '0.6rem 0.75rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{img.title}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--muted)', margin: '0.25rem 0 0' }}>{img.desc}</p>
                    <p style={{ fontSize: '0.6rem', color: 'var(--ok)', margin: '0.25rem 0 0' }}>👆 Klik untuk perbesar</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kesimpulan */}
          <div style={{
            background: 'var(--ok-bg)', border: '1px solid var(--ok)', borderRadius: '10px',
            padding: '1rem', fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.6,
          }}>
            <strong>💡 Kesimpulan:</strong> RPJMD 2025-2029 sudah memuat <strong>6 dari 9 substansi</strong> yang
            dibutuhkan Dokumen #1 (bab transformasi digital, program & indikator SPBE, portal terpadu, anggaran,
            interoperabilitas, kolaborasi). Perlu penguatan: <strong>matriks mapping RAN Pemdi</strong>,
            <strong> manajemen layanan digital</strong> (SOP/IK — Dokumen #8), dan
            <strong> referensi eksplisit ke Arsitektur SIAP Digital</strong>. Ini bisa menjadi bahan verifikasi
            tingkat kematangan <strong>I1 Level 1-2</strong> (kebijakan & rencana aksi Pemdi termuat dalam dokumen
            perencanaan resmi/Qanun).
          </div>
        </div>
      </section>

      {/* ════════ PREVIEW MODAL ════════ */}
      {previewDoc && (
        <div onClick={() => setPreviewDoc(null)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--card-bg)', borderRadius: '12px',
            width: '100%', maxWidth: '1000px', height: '90vh',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                  {previewDoc.title}
                </span>
              </div>
              <button onClick={() => setPreviewDoc(null)} style={{
                background: 'var(--surface-2)', border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer',
                fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--muted)', transition: 'all 0.15s',
              }} onMouseOver={e => e.target.style.background = 'var(--surface-hover)'}
              onMouseOut={e => e.target.style.background = 'var(--surface-2)'}>✕</button>
            </div>
            {/* PDF preview via proxy (same-origin, no XFO issues) */}
            <div style={{ flex: 1, position: 'relative', background: 'var(--surface-2)' }}>
              <iframe
                src={previewDoc.url}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title={previewDoc.title}
              />
            </div>
          </div>
        </div>
      )}

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
