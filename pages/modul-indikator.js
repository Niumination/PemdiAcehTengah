import Head from 'next/head';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// ── Data ──
import moduls from '@/data/modul-indikator.json';
import pemdiData from '@/data/pemdi.json';
import dokumenKunci from '@/data/dokumen-kunci.json';
import buktiMapping from '@/data/bukti-dokumen-mapping.json';

// ── Helpers ──
function cariIndikator(id) {
  for (const a of pemdiData.aspek) {
    for (const ind of a.indikator) {
      if (ind.id === id) return { ...ind, aspekNama: a.nama, aspekSingkat: a.singkat };
    }
  }
  return null;
}

// Jumlah item L1 terpenuhi vs total (untuk notice indikator belum-lengkap) — bukti UTAMA saja
function hitungStatusL1(indId) {
  const ind = cariIndikator(indId);
  if (!ind) return '0 item';
  const l1 = (ind.bukti_dukung || []).filter(b => b.level === 1);
  const lkp = l1.filter(b => b._peran !== 'pendukung' && b.status === 'lengkap').length;
  const items = moduls.modules
    .find(x => x.indikator_id === indId)?.level_kriteria
    ?.find(lk => lk.level === 1)?.bukti_dukung?.length || 0;
  return `${lkp}/${items} item Level 1 terpenuhi`;
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
  // Aturan penilaian: L1 tidak lengkap → L2 tidak dinilai → bukti disembunyikan
  if (ind._l1_lengkap === false) {
    return { count: 0, lengkap: 0, proses: 0, belum: 0, hidden: true, hiddenCount: bd.length };
  }
  return {
    count: bd.length,
    lengkap: bd.filter(b => b.status === 'lengkap').length,
    proses: bd.filter(b => b.status === 'proses').length,
    belum: bd.filter(b => b.status === 'belum' || !b.status).length,
  };
}

// ── Mapping helper: bukti existing → dokumen kunci ──
function getDokumenForBukti(indId, buktiId) {
  const ind = buktiMapping.indikator.find(i => i.indikator_id === indId);
  if (!ind) return [];
  const b = ind.bukti.find(x => x.id === buktiId);
  return b?.dokumen_kunci || [];
}

function getDokumenInfo(no) {
  return dokumenKunci.dokumen.find(d => d.no === no);
}

// ── Kelompokkan bukti per dokumen kunci (untuk toggle view) ──
function groupBuktiByDokumen(indId, buktis) {
  const groups = new Map(); // no → { no, nama, buktis: [], lengkap, total }
  for (const b of buktis) {
    const dkNos = getDokumenForBukti(indId, b.id);
    if (dkNos.length === 0) {
      // Bukti tanpa mapping → grup "Tanpa Dokumen Kunci"
      if (!groups.has(0)) groups.set(0, { no: 0, nama: 'Tanpa Dokumen Kunci', buktis: [], lengkap: 0, total: 0 });
      groups.get(0).buktis.push(b);
    } else {
      for (const no of dkNos) {
        if (!groups.has(no)) {
          const info = getDokumenInfo(no);
          groups.set(no, { no, nama: info?.nama || `Dokumen #${no}`, buktis: [], lengkap: 0, total: 0 });
        }
        groups.get(no).buktis.push(b);
      }
    }
  }
  // Hitung status
  for (const g of groups.values()) {
    g.total = g.buktis.length;
    g.lengkap = g.buktis.filter(b => b.status === 'lengkap').length;
    g.status = g.lengkap === g.total && g.total > 0 ? 'lengkap' : g.lengkap > 0 ? 'sebagian' : 'belum';
  }
  // Urutkan: dokumen kunci (1..31) dulu, "Tanpa" terakhir
  return [...groups.values()].sort((a, b) => {
    if (a.no === 0) return 1;
    if (b.no === 0) return -1;
    return a.no - b.no;
  });
}

// ── Dokumen kunci yang dicakup indikator tapi BELUM punya bukti existing ──
function getDokumenTanpaBukti(indId) {
  const dkNos = groupBuktiByDokumen(indId, []);
  // Dokumen kunci yang mencakup indikator ini
  const semuaDk = dokumenKunci.dokumen.filter(d => d.indikator.includes(indId)).map(d => d.no);
  const punyaBukti = new Set();
  // kumpulkan dokumen yang sudah punya bukti
  const indMapping = buktiMapping.indikator.find(i => i.indikator_id === indId);
  if (indMapping) {
    for (const b of indMapping.bukti) {
      for (const no of b.dokumen_kunci) punyaBukti.add(no);
    }
  }
  return semuaDk.filter(no => !punyaBukti.has(no));
}

// ── Deteksi duplikasi nama bukti (V1/V2 = dokumen sama di 2 level) ──
function deteksiDuplikat(buktis) {
  const seen = new Map(); // nama(55) → [ids]
  for (const b of buktis) {
    const key = (b.nama || '').slice(0, 55);
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(b.id);
  }
  const dups = new Map(); // id → true (kalau nama-nya muncul >1x)
  for (const [key, ids] of seen) {
    if (ids.length > 1) {
      for (const id of ids) dups.set(id, true);
    }
  }
  return dups;
}

// ── Kumpulkan semua bukti baru (P1.*) dari seluruh indikator ──
function getBuktiBaru() {
  const out = [];
  for (const a of pemdiData.aspek) {
    for (const ind of a.indikator) {
      if (ind._l1_lengkap === false) continue; // L1 belum lengkap → sembunyikan
      for (const b of ind.bukti_dukung || []) {
        if (b._sumber_baru) {
          out.push({ ...b, _indikator: ind.id, _namaIndikator: ind.nama });
        }
      }
    }
  }
  return out.sort((x, y) => x.id.localeCompare(y.id));
}

function hitungBuktiBaru() {
  const all = getBuktiBaru();
  const proses = all.filter(b => b.status === 'proses').length;
  const belum = all.filter(b => b.status === 'belum').length;
  const dkSet = new Set();
  for (const b of all) for (const no of (b._dokumen_kunci || [])) dkSet.add(no);
  return { total: all.length, proses, belum, dokumen: dkSet.size };
}

// ── Format kriteria level (markdown-ish → HTML aman, tanpa dependency) ──
// Kriteria di data/modul-indikator.json berisi artefak markdown mentah
// (## / ### / ######, <br>, bullet • / - ● / - 1.). Converter ini:
//   <br>      → baris baru
//   ## Label  → div.kriteria-h (label section)
//   • / - ●   → <ul><li>
//   - 1. / 1. → <ol><li>
//   inline "A - 1. x - 2. y" → label + <ol>
// Semua input di-escape HTML dulu → aman dari XSS.
function escapeHtml(s) {
  return String(s)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Pecah "label - 1. a - 2. b" → { label: 'label', items: ['a', 'b'] }
function splitInlineItems(str) {
  const parts = str.split(/\s+-\s*(\d+)[.)]\s+/);
  if (parts.length < 3) return { label: str.trim(), items: [] };
  const items = [];
  for (let i = 2; i < parts.length; i += 2) items.push(parts[i].trim());
  return { label: parts[0].trim(), items };
}

function formatKriteria(text) {
  if (!text) return '';
  // <br> → baris baru; sisa "<br" tanpa ">" (artefak data terpotong di 500 char) juga dibersihkan
  let t = String(text).replace(/<br\s*\/?>/gi, '\n').replace(/<br/gi, '\n');
  // Promosikan marker heading (##..######) yang nyangkut di tengah baris
  // (artefak ekstraksi) menjadi awal baris → dikenali sebagai section label.
  // Butuh karakter sebelumnya non-spasi & non-hash supaya "###" di awal
  // string tidak terpecah.
  t = t.replace(/([^\s#])(\s*)(#{2,6})(\s+)/g, '$1\n$3 ');
  t = escapeHtml(t);
  const out = [];
  let listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };

  const emit = (line) => {
    const s = line.trim();
    if (!s) { closeList(); return; }

    // Heading: ## / ### / ... / ######
    const hm = s.match(/^(#{1,6})\s+(.*)$/);
    if (hm) {
      closeList();
      const seq = splitInlineItems(hm[2].trim());
      if (seq.label.length > 60) {
        // Heading panjang (artefak ekstraksi) → paragraf biasa, marker # dihilangkan
        out.push(`<p>${seq.label}</p>`);
      } else {
        out.push(`<div class="kriteria-h">${seq.label}</div>`);
      }
      if (seq.items.length) {
        out.push('<ol>');
        seq.items.forEach(it => out.push(`<li>${it}</li>`));
        out.push('</ol>');
      }
      return;
    }

    // Bullet: • / ● / ○ / "- ● ..."
    const bm = s.match(/^(?:[•●○]|-\s*[●○•])\s*(.+)$/);
    if (bm) {
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${bm[1]}</li>`);
      return;
    }

    // Ordered: "1. ..." atau "- 1. ..."
    const om = s.match(/^(?:-\s*)?(\d+)[.)]\s+(.+)$/);
    if (om) {
      if (listType !== 'ol') { closeList(); out.push('<ol>'); listType = 'ol'; }
      out.push(`<li>${om[2]}</li>`);
      return;
    }

    // Dash bullet: "- teks"
    const bm2 = s.match(/^-\s+(.+)$/);
    if (bm2) {
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${bm2[1]}</li>`);
      return;
    }

    // Urutan inline: "teks - 1. a - 2. b"
    const seq = splitInlineItems(s);
    if (seq.items.length >= 2 && seq.label) {
      closeList();
      out.push(`<p>${seq.label}</p>`);
      out.push('<ol>');
      seq.items.forEach(it => out.push(`<li>${it}</li>`));
      out.push('</ol>');
      return;
    }

    closeList();
    out.push(`<p>${s}</p>`);
  };

  t.split('\n').forEach(emit);
  closeList();
  return out.join('\n');
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
  const [viewMode, setViewMode] = useState({}); // per modul: { [nomor]: 'level' | 'dokumen' }

  // Convert JDIH URL to proxy URL for same-origin iframe.
  // File lokal (/bukti-dukung/...) dipakai langsung — same-origin, bebas X-Frame-Options.
  const toProxyUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/')) return url;
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
    if (tabFilter === 'perlu') list = list.filter(m => m.status.hidden || m.status.belum > 0 || m.status.proses > 0);
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
              {merged.reduce((s, m) => s + m.status.count, 0)}/{pemdiData.target_item_bukti || merged.reduce((s, m) => s + m.status.count, 0)} bukti dukung
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              {merged.reduce((s, m) => s + m.status.belum, 0)} perlu dikerjakan
            </span>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              {merged.reduce((s, m) => s + m.status.lengkap, 0)} selesai
            </span>
            <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              Gap: {(pemdiData.target_item_bukti || 0) - merged.reduce((s, m) => s + m.status.count, 0)} item
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
                        {modul.status.hidden && (
                          <span style={{
                            fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                            background: '#ef44441a', color: '#ef4444', fontWeight: 600,
                          }} title="Level 1 belum lengkap — aturan penilaian: L2 tidak dinilai jika L1 tidak lengkap">
                            🔒 L1 Belum Lengkap
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {modul.status.hidden ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.3rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#ef4444' }}>
                            🔒 {modul.status.hiddenCount} bukti disembunyikan — lengkapi item Level 1 dulu
                          </span>
                        </div>
                      ) : modul.status.count > 0 && (
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
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.75rem', alignItems: 'start' }}>
                            {modul.level_kriteria.map(lk => (
                              <div key={lk.level} style={{
                                borderRadius: '10px', overflow: 'hidden',
                                border: '1px solid var(--border)',
                                background: 'var(--surface-1)',
                                display: 'flex', flexDirection: 'column', height: '100%',
                              }}>
                                <div style={{
                                  background: `${LEVEL_WARNA[lk.level] || '#6b7280'}12`,
                                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                                  padding: '0.5rem 0.75rem',
                                }}>
                                  <span style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    background: LEVEL_WARNA[lk.level] || '#6b7280',
                                    color: '#fff', fontWeight: 700, fontSize: '0.72rem',
                                    borderRadius: '6px', padding: '0.15rem 0.45rem', lineHeight: 1.5,
                                  }}>L{lk.level}</span>
                                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)' }}>
                                    {LEVEL_LABEL[lk.level] || `Level ${lk.level}`}
                                  </span>
                                </div>
                                <div style={{ padding: '0.75rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text)', overflowWrap: 'break-word' }}>
                                  {/* Ringkasan singkat kriteria */}
                                  {lk.ringkasan && (
                                    <p style={{ margin: 0, marginBottom: lk.bukti_dukung?.length ? '0.6rem' : 0 }}>
                                      {lk.ringkasan}
                                    </p>
                                  )}
                                  {/* Daftar bukti dukung (dari Excel Daftar Lengkap sheet 2) */}
                                  {lk.bukti_dukung?.length > 0 && (
                                    <div>
                                      <p style={{
                                        fontSize: '0.66rem', fontWeight: 700, color: 'var(--primary)',
                                        margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                                      }}>
                                        📎 Bukti Dukung ({lk.bukti_dukung.length})
                                      </p>
                                      <ul style={{ margin: 0, paddingLeft: '1.05rem' }}>
                                        {lk.bukti_dukung.map((b, i) => (
                                          <li key={i} style={{ fontSize: '0.73rem', marginBottom: '0.3rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                                            {b.item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {!lk.bukti_dukung?.length && (
                                    <p style={{ fontSize: '0.7rem', color: 'var(--muted)', margin: '0.25rem 0 0', fontStyle: 'italic' }}>
                                      — indikator eksternal / belum ada item bukti di Daftar Lengkap
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ════ Evidence from Modul ════ */}
                      {modul.data_dukung_modul?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text)' }}>
                            📎 Contoh Bukti Dukung (Modul)
                          </h4>
                          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.6rem' }}>
                            Disusun sesuai kondisi Pemkab Aceh Tengah — cocokkan dengan item bukti per level di atas.
                          </p>
                          {modul.data_dukung_modul.map((lv, li) => (
                            <div key={li} style={{ marginBottom: '0.6rem', paddingLeft: '0.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  background: LEVEL_WARNA[lv.level] || '#6b7280',
                                  color: '#fff', fontWeight: 700, fontSize: '0.62rem',
                                  borderRadius: '5px', padding: '0.1rem 0.35rem', lineHeight: 1.5,
                                }}>L{lv.level}</span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>
                                  {lv.label}
                                </span>
                              </div>
                              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {lv.items.map((item, i) => (
                                  <li key={i} style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.2rem', lineHeight: 1.5 }}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
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
                      {modul.status.hidden ? (
                        <div style={{
                          marginTop: '1rem', padding: '0.75rem', borderRadius: '8px',
                          background: '#ef44440d', border: '1px dashed #ef4444',
                          fontSize: '0.8rem', color: '#ef4444',
                        }}>
                          🔒 <strong>Bukti dukung disembunyikan sementara</strong> — Level 1 belum lengkap
                          ({modul.status.hiddenCount} bukti di folder <code>belum-lengkap/</code>).
                          Aturan penilaian: jika Level 1 tidak lengkap, Level 2 ke atas tidak dinilai.
                          Lengkapi seluruh item Level 1 ({hitungStatusL1(modul.indikator_id)}) untuk menampilkan kembali bukti.
                        </div>
                      ) : modul.ind?.bukti_dukung?.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          {modul.status.lengkap === 0 && modul.status.count > 0 && (
                            <div style={{
                              padding: '0.75rem', borderRadius: '8px',
                              background: 'var(--warn-bg)', border: '1px solid var(--warn)',
                              fontSize: '0.8rem', color: 'var(--warn)',
                            }}>
                              ⚠️ <strong>Belum ada bukti dukung yang dinyatakan Lengkap</strong> —
                              bukti existing & baru masih perlu diverifikasi ulang sesuai kriteria level masing-masing indikator.
                            </div>
                          )}
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                            📋 Bukti Dukung — Kondisi Existing Pemkab Aceh Tengah
                          </h4>

                          {/* Toggle view: Per Level ↔ Per Dokumen Kunci */}
                          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Tampilkan:</span>
                            {[
                              { key: 'level', label: 'Per Level' },
                              { key: 'dokumen', label: 'Per Dokumen Kunci' },
                            ].map(mode => (
                              <button
                                key={mode.key}
                                onClick={() => setViewMode(prev => ({ ...prev, [modul.nomor]: mode.key }))}
                                style={{
                                  padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)',
                                  background: (viewMode[modul.nomor] || 'level') === mode.key ? 'var(--primary)' : 'var(--surface-2)',
                                  color: (viewMode[modul.nomor] || 'level') === mode.key ? '#fff' : 'var(--text)',
                                  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                                }}
                              >
                                {mode.label}
                              </button>
                            ))}
                            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                              {buktiMapping.stats?.terpetakan}/{buktiMapping.stats?.total_bukti} bukti terpetakan
                            </span>
                          </div>

                          {(viewMode[modul.nomor] || 'level') === 'level' ? (
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
                                  <th style={thStyle}>Dokumen Kunci</th>
                                  <th style={{...thStyle, width:'70px', textAlign:'center'}}>Aksi</th>
                                  <th style={thStyle}>Catatan</th>
                                </tr>
                              </thead>
                              <tbody>
                                {modul.ind.bukti_dukung.map(bd => {
                                const sm = STATUS_META[bd.status] || STATUS_META.belum;
                                const url = bd.url_preview || '';
                                const isPdf = bd._ext === 'pdf' && !!url;
                                const isUrl = bd._ext === 'url' && !!url;
                                const canPreview = isPdf;
                                const dkNos = getDokumenForBukti(modul.ind.id, bd.id);
                                const isDup = deteksiDuplikat(modul.ind.bukti_dukung).has(bd.id);
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
                                      {bd._peran === 'pendukung' && (
                                        <span style={{
                                          display: 'inline-block', marginLeft: '0.4rem', padding: '0.1rem 0.4rem',
                                          borderRadius: '4px', background: 'var(--surface-2)', color: 'var(--muted)',
                                          border: '1px solid var(--border)', fontSize: '0.62rem', fontWeight: 600, verticalAlign: 'middle',
                                        }} title="Dokumen penunjang (perbup/SK umum) — mendukung bukti utama, tidak dihitung untuk kelengkapan level">
                                          🔹 Pendukung
                                        </span>
                                      )}
                                      {isDup && (
                                        <span style={{
                                          display: 'inline-block', marginLeft: '0.4rem', padding: '0.1rem 0.4rem',
                                          borderRadius: '4px', background: 'var(--gold-light)', color: 'var(--gold)',
                                          fontSize: '0.62rem', fontWeight: 600, verticalAlign: 'middle',
                                        }} title="Dokumen yang sama dipakai sebagai bukti di lebih dari satu level — wajar sesuai kriteria level">
                                          🔁 multi-level
                                        </span>
                                      )}
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
                                    <td style={tdStyle}>
                                      {dkNos.length > 0 ? dkNos.map(no => {
                                        const info = getDokumenInfo(no);
                                        return (
                                          <span key={no} style={{
                                            display: 'inline-block', padding: '0.1rem 0.4rem', margin: '0.1rem',
                                            borderRadius: '4px', background: 'var(--primary)15',
                                            color: 'var(--primary)', fontSize: '0.65rem', fontWeight: 700,
                                            border: '1px solid var(--primary)30',
                                            cursor: 'pointer', whiteSpace: 'nowrap',
                                          }}
                                          title={info?.nama || ''}
                                          onClick={() => setBukaDokumen(no)}
                                          >
                                            #{no}
                                          </span>
                                        );
                                      }) : (
                                        <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>—</span>
                                      )}
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
                                      ) : isUrl ? (
                                        <a href={url} target="_blank" rel="noopener noreferrer"
                                          style={{
                                            display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px',
                                            background: 'var(--primary)', color: '#fff', textDecoration: 'none',
                                            fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap',
                                          }}>
                                          🌐 Buka
                                        </a>
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
                          ) : (
                          /* ── VIEW PER DOKUMEN KUNCI ── */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {groupBuktiByDokumen(modul.ind.id, modul.ind.bukti_dukung).map(group => {
                              const stColor = group.status === 'lengkap' ? 'var(--ok)' : group.status === 'sebagian' ? 'var(--warn)' : 'var(--muted)';
                              const stBg = group.status === 'lengkap' ? 'var(--ok-bg)' : group.status === 'sebagian' ? 'var(--warn-bg)' : 'var(--surface-2)';
                              return (
                                <div key={group.no} style={{
                                  border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden',
                                }}>
                                  <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 0.75rem', background: 'var(--surface-2)',
                                    borderBottom: '1px solid var(--border)',
                                  }}>
                                    {group.no > 0 ? (
                                      <button
                                        onClick={() => setBukaDokumen(group.no)}
                                        style={{
                                          border: 'none', background: 'var(--primary)', color: '#fff',
                                          borderRadius: '4px', padding: '0.15rem 0.45rem',
                                          fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                                        }}
                                      >#{group.no}</button>
                                    ) : (
                                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700 }}>—</span>
                                    )}
                                    <span style={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                                      {group.nama}
                                    </span>
                                    <span style={{
                                      fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '10px',
                                      background: stBg, color: stColor, fontWeight: 600, whiteSpace: 'nowrap',
                                    }}>
                                      {group.lengkap}/{group.total} lengkap
                                    </span>
                                  </div>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                                    <thead>
                                      <tr style={{ background: 'var(--surface-2)' }}>
                                        <th style={{...thStyle, width:'50px'}}>Level</th>
                                        <th style={thStyle}>Nama Bukti Dukung</th>
                                        <th style={{...thStyle, width:'100px'}}>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {group.buktis.map((bd, i) => {
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
                                              {bd.detail && <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.1rem' }}>{bd.detail}</div>}
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
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              );
                            })}

                            {/* ═══ Placeholder: dokumen kunci tanpa bukti existing ═══ */}
                            {getDokumenTanpaBukti(modul.ind.id).map(no => {
                              const info = getDokumenInfo(no);
                              return (
                                <div key={`ph-${no}`} style={{
                                  border: '1px dashed var(--warn)', borderRadius: '8px', overflow: 'hidden',
                                  background: 'var(--warn-bg)10',
                                }}>
                                  <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.5rem 0.75rem', background: 'var(--warn-bg)30',
                                  }}>
                                    <button
                                      onClick={() => setBukaDokumen(no)}
                                      style={{
                                        border: 'none', background: 'var(--warn)', color: '#fff',
                                        borderRadius: '4px', padding: '0.15rem 0.45rem',
                                        fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                                      }}
                                    >#{no}</button>
                                    <span style={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                                      {info?.nama || `Dokumen #${no}`}
                                    </span>
                                    <span style={{
                                      fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '10px',
                                      background: 'var(--warn-bg)', color: 'var(--warn)', fontWeight: 700, whiteSpace: 'nowrap',
                                    }}>
                                      🆕 Perlu Disusun
                                    </span>
                                  </div>
                                  <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', color: 'var(--muted)' }}>
                                    Belum ada bukti dukung existing untuk dokumen kunci ini. Lihat substansi wajib di
                                    section <strong>Peta Dokumen Kunci</strong> di bawah untuk panduan penyusunan.
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          )}
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

      {/* ════════ BUKTI DUKUNG BARU 2026 — Portal Evaluasi & Dokumen (inject baru) ════════ */}
      <section style={{ marginTop: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📥</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Bukti Dukung Baru — Portal Evaluasi & Dokumen 2026
            </h2>
            <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>BARU</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 760, marginBottom: '1rem' }}>
            <strong>20 bukti dukung</strong> baru yang dipetakan ke Peta Dokumen Kunci — berasal dari
            <strong> portal evaluasi PEMDI (eval.spbe.go.id)</strong> kode <code>PG_04</code> & <code>TD_13</code> (SK Tim
            Koordinasi, DPA/RKA, rapat koordinasi, KAK & laporan aplikasi Bapokting) dan dokumen Diskominfo 2026 yang
            ditemukan di Documents (Indeks KAMI, Perbup persandian, SK Forum Satu Data, RPJMD, Renstra, Renja, DPA, RKA).
            Masih perlu verifikasi kesesuaian kriteria level sebelum dianggap lengkap.
          </p>

          {/* Stat mini */}
          <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              {hitungBuktiBaru().total} bukti baru
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              {hitungBuktiBaru().proses} di-portal eval
            </span>
            <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              {hitungBuktiBaru().belum} belum diunggah
            </span>
            <span className="stat-badge" style={{ background: 'var(--primary-bg, #e3edff)', color: 'var(--primary)' }}>
              {hitungBuktiBaru().dokumen} dokumen kunci terdukung
            </span>
          </div>

          {/* Tabel bukti baru */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{...thStyle, width:'50px'}}>Ind.</th>
                  <th style={thStyle}>Nama Bukti Dukung</th>
                  <th style={{...thStyle, width:'70px'}}>Level</th>
                  <th style={{...thStyle, width:'110px'}}>Dok. Kunci</th>
                  <th style={{...thStyle, width:'110px'}}>Status</th>
                  <th style={{...thStyle, width:'150px'}}>Sumber</th>
                </tr>
              </thead>
              <tbody>
                {getBuktiBaru().map(bd => {
                  const sm = STATUS_META[bd.status] || STATUS_META.belum;
                  const dkNos = bd._dokumen_kunci || [];
                  const url = bd.url_preview || '';
                  const isPdf = bd._ext === 'pdf' && !!url;
                  return (
                    <tr key={bd.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={tdStyle}>
                        <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'var(--primary-bg, #e3edff)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.68rem' }}>
                          {bd._indikator}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 500 }}>
                        {bd.nama}
                        {bd.detail && <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.15rem' }}>{bd.detail}</div>}
                        {bd.catatan && <div style={{ fontSize: '0.66rem', color: 'var(--muted)', marginTop: '0.15rem', opacity: 0.85 }}>📝 {bd.catatan}</div>}
                        {url && (
                          <a href={url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', color: 'var(--primary)', marginTop: '0.2rem', textDecoration: 'underline' }}>
                            {bd._ext === 'url' ? '🌐 Buka URL' : isPdf ? '📄 Buka PDF' : '🖼️ Lihat preview'} ↗
                          </a>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ padding: '0.15rem 0.4rem', borderRadius: '4px', background: `${LEVEL_WARNA[bd.level] || '#6b7280'}15`, color: LEVEL_WARNA[bd.level] || '#6b7280', fontWeight: 600, fontSize: '0.7rem' }}>
                          L{bd.level}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {dkNos.length > 0 ? dkNos.map(no => (
                          <button key={no} onClick={() => setBukaDokumen(no)} style={{
                            border: 'none', background: 'var(--primary)', color: '#fff', borderRadius: '4px',
                            padding: '0.15rem 0.45rem', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', marginRight: '0.25rem',
                          }}>#{no}</button>
                        )) : <span style={{ color: 'var(--muted)', fontSize: '0.7rem' }}>—</span>}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: sm.bg, color: sm.color, fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {sm.icon} {sm.label}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, fontSize: '0.68rem', color: 'var(--muted)' }}>
                        {bd._portal ? '🖥️ Portal eval.spbe.go.id' : '📁 Documents 2026'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

      {/* ════════ RPJMD UNTUK INDIKATOR LAIN ════════ */}
      <section style={{ marginTop: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              RPJMD untuk Indikator Lainnya
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 760, marginBottom: '1rem' }}>
            Selain Dokumen #1, RPJMD 2025-2029 juga memuat substansi yang dibutuhkan untuk
            <strong> 7 indikator lain</strong> (I3, I5, I7, I10, I11, I12, I14, I15, I17, I20) —
            terkait Dokumen #9, #18, #20, #22, #23-24, #26, #27, #29, #31 pada Peta Dokumen Kunci.
          </p>

          {/* Stat mini */}
          <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              10 indikator lain terdukung
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              7 dokumen kunci terkait
            </span>
          </div>

          {/* Tabel indikator lain */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Indikator</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Substansi RPJMD yang Termuat</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Dokumen Kunci Terkait</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Lokasi di RPJMD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I3</strong> — SDM Digital ASN</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Peningkatan kapasitas SDM digital & literasi digital; produksi talenta digital</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#9 (Peta Kompetensi), #10 (Diklat)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Arah Kebijakan Misi 3 (III-28)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I5</strong> — Tata Kelola Data (SDI)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program unggulan "Aceh Tengah Satu Data"; Forum Satu Data & e-walidata SIPD</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#18 (Bukti eksternal SDI)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program Unggulan #1 (III-38)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I7</strong> — Pembangunan Statistik (EPSS)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Pemenuhan Prinsip Satu Data Indonesia; Program Statistik Sektoral; Persentase data statistik sektoral 80→90%</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#18 (Bukti eksternal EPSS)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program Unggulan #1 + Bidang Statistik</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I10</strong> — Keamanan Siber (IKASANDI)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Menguatnya keamanan siber & sandi; penguatan keamanan siber untuk melindungi data & informasi</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#20 (IKASANDI siber)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bidang Persandian (III-90)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I11</strong> — Kriptografi</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Program penyelenggaraan persandian untuk pengamanan informasi; layanan keamanan informasi & persandian</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#22 (Kriptografi)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bidang Persandian (III-90)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I12</strong> — Penanganan Insiden</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Penguatan keamanan siber (fondasi penanganan insiden); kebijakan tata kelola keamanan informasi</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#23-24 (CSIRT/insiden)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Bidang Persandian (III-90)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I14</strong> — Infrastruktur Digital</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Pembangunan infrastruktur e-government (portal terpadu, aplikasi mobile, data terpadu); penyediaan akses internet; broadband</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#26 (Infrastruktur)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Rencana Aksi (III-40), Akses Internet (III-89)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I15</strong> — Proses Bisnis</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Peningkatan ketatalaksanaan (business process); identifikasi "Belum disusun Peta Proses Bisnis OPD" sebagai akar masalah</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#27 (BPMN)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Arah Kebijakan Misi 3 + Analisis isu</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I17</strong> — Portal Layanan</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Penguatan pelayanan publik digital via Command Center & sistem e-government</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#29 (Portal)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Analisis Tata Kelola (II-211)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I20</strong> — Kepuasan Pengguna</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Indeks Survey Kepuasan Masyarakat (%) sebagai indikator kinerja target (mis. Dinas Pendidikan 82,13→88,40)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#31 (SKM)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Indikator Kinerja OPD (IV-35)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Screenshot bukti */}
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
              📸 Bukti Visual dari RPJMD:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                { src: '/docs/rpjmd/program-satu-data.png', title: 'Program Unggulan Satu Data (III-38)', desc: 'I5 & I7: "Aceh Tengah Satu Data" + Program Statistik Sektoral, Pemenuhan Prinsip SDI' },
                { src: '/docs/rpjmd/keamanan-persandian.png', title: 'Bidang Persandian & Keamanan (III-90)', desc: 'I10-I12: Program persandian, keamanan siber, kebijakan tata kelola keamanan informasi' },
                { src: '/docs/rpjmd/indeks-kepuasan.png', title: 'Indeks Kepuasan Masyarakat (IV-35)', desc: 'I20: Target IKM sebagai indikator kinerja OPD (82,13 → 88,40)' },
                { src: '/docs/rpjmd/command-center.png', title: 'Command Center & e-Gov (II-211)', desc: 'I17: Penguatan pelayanan publik berbasis digital melalui Command Center' },
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
        </div>
      </section>

      {/* ════════ BUKTI DUKUNG DOKUMEN PENDUKUNG ════════ */}
      <section style={{ marginTop: '3rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📎</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Bukti Dukung Dokumen Pendukung
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', maxWidth: 760, marginBottom: '1rem' }}>
            Hasil ekstraksi <strong>5 dokumen pendukung Diskominfo</strong> (RENSTRA 2025-2029, Renja 2026,
            DPA 2026, RKA Rincian Belanja SPBE, dan Capaian Realisasi RKPD) — substansi yang mendukung
            <strong> 9 indikator</strong> pada Peta Dokumen Kunci.
          </p>

          {/* Stat mini */}
          <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              5 dokumen pendukung
            </span>
            <span className="stat-badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              9 indikator terdukung
            </span>
            <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
              SPBE realisasi 2025: 2,59
            </span>
          </div>

          {/* Tabel dokumen × substansi × indikator */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Dokumen</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Substansi yang Termuat</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Indikator Terkait</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Dokumen Kunci</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>RENSTRA Diskominfo 2025-2029</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Tujuan-sasaran SPBE (Indeks SPBE 2,6→2,9); strategi implementasi SPBE terintegrasi; program pengelolaan aplikasi informatika (Indeks SPBE 2,88-2,96); 7 dokumen kebijakan tata kelola SPBE (arsitektur, peta rencana, proses bisnis)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I1, I2, I4, I13, I15, I16</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#1, #2, #3, #8, #25</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>Ranhir Renja Diskominfo 2026</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Target Indeks SPBE 2,8→2,9 (2026); kegiatan koordinasi tata kelola SPBE 7 dokumen Rp 150 jt; pelatihan ASN pengelola SPBE 10 orang; literasi SPBE 2% masyarakat</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I1, I3</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#1, #9</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>DPA Diskominfo 2026</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Anggaran portal terpadu Rp 90 jt; promosi literasi SPBE Rp 64,6 jt; koordinasi tata kelola SPBE Rp 154,6 jt; kabupaten cerdas Rp 179,4 jt; persandian Rp 86,4 jt</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I1, I10, I11, I14, I17</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#4, #20, #22, #26, #29</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>RKA Rincian Belanja (Sub Keg. 0037)</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Rincian belanja koordinasi kebijakan tata kelola SPBE: arsitektur, peta rencana, proses bisnis, rencana & anggaran SPBE — Rp 154,6 jt (ATK, cetak, perjalanan dinas)</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I1, I15</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#4, #27</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>Capaian Realisasi RKPD</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>Evaluasi capaian 2025: Indeks Transformasi Digital (target 48), Indeks SPBE realisasi <strong>2,59</strong> (target 2,8), IPS 2,97 (target 3,14), kepuasan masyarakat 60% (target 60,18%) — kategori Sangat Tinggi</td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}><strong>I1, I7, I20</strong></td>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)' }}>#1, #18, #31</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Screenshot bukti */}
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem' }}>
              📸 Bukti Visual dari Dokumen Pendukung:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                { src: '/docs/bukti/renstra-tujuan-sasaran.png', title: 'RENSTRA — Tujuan & Sasaran (Bab III)', desc: 'I1/I2/I4: Indeks SPBE target 2,6→2,9 sebagai sasaran strategis transformasi digital' },
                { src: '/docs/bukti/renstra-program-aplikasi.png', title: 'RENSTRA — Program Aplikasi Informatika', desc: 'I13: Program pengelolaan aplikasi informatika (Indeks SPBE 2,88→2,96)' },
                { src: '/docs/bukti/renja-program_spbe.png', title: 'Renja 2026 — Program Tata Kelola SPBE', desc: 'I1: Kegiatan koordinasi kebijakan tata kelola SPBE — 7 dokumen, Rp 150 jt' },
                { src: '/docs/bukti/dpa-ringkasan_program.png', title: 'DPA 2026 — Ringkasan Program', desc: 'I1/I17: Anggaran portal terpadu Rp 90 jt, tata kelola SPBE Rp 154,6 jt' },
                { src: '/docs/bukti/dpa-subkegiatan_0037.png', title: 'DPA — Sub Kegiatan Tata Kelola SPBE', desc: 'I1/I15: Keluaran 7 dokumen kebijakan SPBE (arsitektur, peta rencana, proses bisnis)' },
                { src: '/docs/bukti/rka-rincian_belanja.png', title: 'RKA — Rincian Belanja SPBE', desc: 'I1: Rincian belanja operasional Rp 154,6 jt (belanja barang, jasa, perjalanan)' },
                { src: '/docs/bukti/realisasi-rkpd.png', title: 'Capaian Realisasi RKPD 2025', desc: 'I1/I7/I20: Indeks SPBE realisasi 2,59; IPS 2,97; kepuasan 60% — kategori Sangat Tinggi' },
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

          {/* ─── Screenshot Bukti Dukung Eksternal (1 sumber: lokal) ─── */}
          <div style={{ marginTop: '2.5rem' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>
              📸 Bukti Visual Dokumen Eksternal (JDIH & OpenData):
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
              15 dokumen hukum & data dari JDIH Aceh Tengah + OpenData — di-download ke repository lokal (1 sumber). Klik untuk perbesar; nama file = sumber resmi.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                { src: '/docs/bukti/perbup-48-arsitektur-spbe.png', title: 'Perbup 48/2025 — Arsitektur SPBE', desc: 'I1/I2/I4/I9/I10/I11/I12/I13/I14/I15/I16/I17/I18: Arsitektur SPBE sebagai referensi tata kelola Pemdi' },
                { src: '/docs/bukti/perbup-6-sistem-pemdi.png', title: 'Perbup 6/2025 — Sistem Pemerintahan Digital', desc: 'I8/I10: Sistem Pemerintahan Berbasis Elektronik (184 hal)' },
                { src: '/docs/bukti/perbup-60-satu-data.png', title: 'Perbup 60/2022 — Satu Data', desc: 'I5/I7/I18: Penyelenggaraan Satu Data Indonesia' },
                { src: '/docs/bukti/perbup-126-penyelenggaraan.png', title: 'Perbup 126/2019 — Penyelenggaraan', desc: 'I2/I19: Penyelenggaraan e-Government & layanan' },
                { src: '/docs/bukti/perbup-73-pelayanan.png', title: 'Perbup 73/2020 — Pelayanan', desc: 'I2/I8/I17: Pelayanan publik & manajemen layanan digital' },
                { src: '/docs/bukti/perbup-9-sotk.png', title: 'Perbup 9/2025 — SOTK', desc: 'I3/I13: Susunan Organisasi & Tata Kerja' },
                { src: '/docs/bukti/perbup-70-pedoman.png', title: 'Perbup 70/2019 — Pedoman Sistem', desc: 'I4: Pedoman Sistem Pemerintahan' },
                { src: '/docs/bukti/perbup-8-rencana.png', title: 'Perbup 8/2022 — Rencana', desc: 'I1: Rencana pembangunan & transformasi digital' },
                { src: '/docs/bukti/perbup-137-penyelenggaraan.png', title: 'Perbup 137/2019 — Pedoman PDP', desc: 'I8: Pedoman penyelenggaraan pelindungan data pribadi' },
                { src: '/docs/bukti/perbup-30-penyelenggaraan.png', title: 'Perbup 30/2022 — Penyelenggaraan', desc: 'I17: Penyelenggaraan portal & layanan digital' },
                { src: '/docs/bukti/perbup-21-pedoman.png', title: 'Perbup 21/2021 — Pedoman', desc: 'I19: Pedoman fasilitas dukungan pengguna' },
                { src: '/docs/bukti/literasi-digital-2023.png', title: 'Publikasi Literasi Digital 2023', desc: 'I3: Hasil literasi digital sektor pemerintahan' },
                { src: '/docs/bukti/sop-epss.png', title: 'SOP EPSS (Diskominfo)', desc: 'I5/I7: SOP Pengumpulan & analisis data statistik' },
                { src: '/docs/bukti/laporan-reviu-kinerja.png', title: 'Laporan Reviu Kinerja 2025', desc: 'I1: Laporan hasil reviu laporan kinerja Aceh Tengah' },
                { src: '/docs/bukti/laporan-pengawasan-kinerja.png', title: 'Laporan Pengawasan Kinerja 2025', desc: 'I9: Laporan hasil pengawasan kinerja pemerintah daerah' },
                { src: '/docs/bukti/hasil-survei-kepuasan.png', title: 'Hasil Survei Kepuasan Masyarakat', desc: 'I19/I20: Hasil SKM Kab. Aceh Tengah (Januari-Mei 2026)' },
                { src: '/docs/bukti/data-peta-rdtr.png', title: 'Data & Peta RDTR', desc: 'I6: Data dan peta rencana detail tata ruang' },
                { src: '/docs/bukti/pedoman-pengaduan-rsud.png', title: 'Pedoman Pengaduan RSUD', desc: 'I2: Pedoman penanganan pengaduan/keluhan RSUD Datu Beru' },
                { src: '/docs/bukti/skm-kebayakan-2025.png', title: 'SKM Kec. Kebayakan 2025', desc: 'I20: Laporan survei kepuasan masyarakat Kebayakan' },
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
        .kriteria-render p { margin: 0.2rem 0; }
        .kriteria-render ul, .kriteria-render ol { margin: 0.2rem 0 0.4rem; padding-left: 1.3rem; }
        .kriteria-render li { margin-bottom: 0.15rem; line-height: 1.55; }
        .kriteria-h {
          font-weight: 700;
          font-size: 0.72rem;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0.45rem 0 0.2rem;
        }
        .kriteria-h:first-child { margin-top: 0; }
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
