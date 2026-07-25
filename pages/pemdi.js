import { useState, useMemo, useEffect, useCallback } from 'react';
import Head from 'next/head';
import DetailModal from '@/components/DetailModal';
import TopographicBackdrop from '@/components/TopographicBackdrop';
import { formatDesimal } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';

function hitungIndeks(aspek) {
  const totalBobot = aspek.reduce((s, a) => s + a.bobot, 0);
  const tertimbang = aspek.reduce((s, a) => s + a.nilai * (a.bobot / totalBobot), 0);
  return Math.round(tertimbang * 100) / 100;
}

function getPredikat(nilai) {
  if (nilai >= 3.0) return { label: 'Baik', warna: 'var(--ok)', bg: 'var(--ok-bg)' };
  if (nilai >= 2.0) return { label: 'Cukup', warna: 'var(--gold)', bg: 'var(--gold-light)' };
  return { label: 'Perlu Perbaikan', warna: 'var(--bad)', bg: 'var(--bad-bg)' };
}

const STATUS_META = {
  belum:   { icon: '⬜', label: 'Belum', color: 'var(--muted)', bg: 'var(--surface-2)' },
  proses:  { icon: '🔄', label: 'Proses', color: 'var(--gold)', bg: 'var(--gold-light)' },
  lengkap: { icon: '✅', label: 'Lengkap', color: 'var(--ok)', bg: 'var(--ok-bg)' },
};

/* ─── Preview Modal ─── */
function PreviewModal({ file, onClose }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (file) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [file, handleKeyDown]);

  if (!file) return null;

  const isPdf = file.type === 'pdf';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--r-lg)',
          width: '100%', maxWidth: isPdf ? '900px' : '1100px',
          height: '85vh', display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--sh-xl)', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 20px', borderBottom: '1px solid var(--line)',
          background: 'var(--surface-2)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{ fontSize: '1.1rem' }}>{isPdf ? '📄' : '🌐'}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {file.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{file.type.toUpperCase()} — Bukti Dukung Pemdi</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <a
              href={file.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 12px', borderRadius: 'var(--r-xs)', fontSize: '0.78rem',
                fontWeight: 600, background: 'var(--primary)', color: '#fff',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
              }}
            >
              ↗ Buka Tab Baru
            </a>
            <button
              onClick={onClose}
              style={{
                padding: '6px 12px', borderRadius: 'var(--r-xs)', fontSize: '0.78rem',
                fontWeight: 600, background: 'var(--surface)', color: 'var(--ink)',
                border: '1px solid var(--line)', cursor: 'pointer',
              }}
            >
              ✕ Tutup
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, position: 'relative', background: '#f5f5f5' }}>
          <iframe
            src={file.file}
            title={file.label}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Preview Button ─── */
function PreviewButton({ lampiran, onPreview }) {
  if (!lampiran || lampiran.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
      {lampiran.map((lamp, i) => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); onPreview(lamp); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '3px 8px', borderRadius: 'var(--r-xs)', fontSize: '0.7rem',
            fontWeight: 600, cursor: 'pointer', border: '1px solid var(--primary)',
            background: 'var(--primary-50)', color: 'var(--primary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--primary-50)'; e.target.style.color = 'var(--primary)'; }}
        >
          {lamp.type === 'pdf' ? '📄' : '🌐'} Preview: {lamp.label}
        </button>
      ))}
    </div>
  );
}

export default function PemdiPage() {
  const { aspek, target_indeks, target_predikat, baseline_spbe } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);
  const gap = Math.max(0, target_indeks - indeks);

  const [modalAspek, setModalAspek] = useState(null);
  const [filterAspek, setFilterAspek] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedInd, setExpandedInd] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // Flatten all bukti dukung items
  const allBukti = useMemo(() => {
    const items = [];
    aspek.forEach((a) => {
      (a.indikator || []).forEach((ind) => {
        (ind.bukti_dukung || []).forEach((b) => {
          items.push({ ...b, aspekId: a.id, aspekNama: a.nama, indId: ind.id, indNama: ind.nama });
        });
      });
    });
    return items;
  }, [aspek]);

  // Filtered bukti
  const filteredBukti = useMemo(() => {
    return allBukti.filter((b) => {
      if (filterAspek !== 'all' && b.aspekId !== Number(filterAspek)) return false;
      if (filterLevel !== 'all' && b.level !== Number(filterLevel)) return false;
      if (filterStatus !== 'all' && b.status !== filterStatus) return false;
      return true;
    });
  }, [allBukti, filterAspek, filterLevel, filterStatus]);

  // Group filtered bukti by aspek+indicator
  const groupedBukti = useMemo(() => {
    const map = {};
    filteredBukti.forEach((b) => {
      const key = `${b.aspekId}|${b.indId}`;
      if (!map[key]) {
        map[key] = { aspekId: b.aspekId, aspekNama: b.aspekNama, indId: b.indId, indNama: b.indNama, items: [] };
      }
      map[key].items.push(b);
    });
    return Object.values(map);
  }, [filteredBukti]);

  // Progress stats
  const stats = useMemo(() => {
    const total = allBukti.length;
    const lengkap = allBukti.filter((b) => b.status === 'lengkap').length;
    const proses = allBukti.filter((b) => b.status === 'proses').length;
    const belum = allBukti.filter((b) => b.status === 'belum').length;
    const pct = total > 0 ? Math.round((lengkap / total) * 100) : 0;
    const perAspek = aspek.map((a) => {
      const items = allBukti.filter((b) => b.aspekId === a.id);
      const done = items.filter((b) => b.status === 'lengkap').length;
      return { id: a.id, nama: a.nama, total: items.length, lengkap: done, pct: items.length > 0 ? Math.round((done / items.length) * 100) : 0 };
    });
    return { total, lengkap, proses, belum, pct, perAspek };
  }, [allBukti, aspek]);

  return (
    <>
      <Head>
        <title>Indeks Kematangan Pemdi 2026 (PermenPANRB 8/2026) — Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard Kematangan Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah — Evaluasi 7 Aspek, 20 Indikator, dan 57 Bukti Dukung berdasarkan PermenPANRB No. 8 Tahun 2026."
        />
      </Head>

      {/* Hero Header */}
      <section
        style={{
          background: 'var(--hero-grad)', color: '#ffffff', padding: '36px 28px',
          borderRadius: 'var(--r-lg)', marginBottom: '28px', position: 'relative', overflow: 'hidden',
        }}
      >
        <TopographicBackdrop opacity={0.08} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="pill">⚖️ PermenPANRB No. 8 Tahun 2026</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(22px, 3vw, 34px)', margin: '8px 0 12px' }}>
            Indeks Kematangan Pemerintah Digital (Pemdi) 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.98rem' }}>
            Transformasi menyeluruh tata kelola pemerintahan digital Kabupaten Aceh Tengah.
            Mengukur <strong>7 Aspek Utama</strong>, <strong>20 Indikator Kunci</strong>, dan <strong>57 Bukti Dukung</strong> menuju target indeks <strong>≥ 2,50</strong>.
          </p>
        </div>
      </section>

      {/* Executive KPI Summary Cards */}
      <section style={{ marginBottom: '32px' }}>
        <div className="grid-3">
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Baseline SPBE 2025</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>{formatDesimal(baseline_spbe)}</div>
            <span className="badge badge-yellow">Level Kematangan Cukup</span>
          </div>
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center', borderColor: 'var(--primary)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Estimasi Indeks Pemdi Saat Ini</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>{formatDesimal(indeks)}</div>
            <span className={`badge ${predikat.bg}`} style={{ color: predikat.warna }}>Predikat {predikat.label}</span>
          </div>
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Target Evaluasi 2026</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>≥ {formatDesimal(target_indeks)}</div>
            <span className="badge badge-green">Gap Analysis: {formatDesimal(gap)} Poin</span>
          </div>
        </div>
      </section>

      {/* Bukti Dukung Progress Overview */}
      <section style={{ marginBottom: '32px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">📈 Progres Pengumpulan</div>
            <h2>Status Bukti Dukung</h2>
            <p>{stats.total} item bukti dukung dari {aspek.length} aspek dan 20 indikator — {stats.lengkap} lengkap, {stats.proses} dalam proses, {stats.belum} belum dikumpulkan.</p>
          </div>
        </div>

        <div className="glow-card" style={{ padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Progres Keseluruhan</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: stats.pct >= 80 ? 'var(--ok)' : stats.pct >= 40 ? 'var(--gold)' : 'var(--muted)', fontSize: '1.1rem' }}>
              {stats.pct}% ({stats.lengkap}/{stats.total})
            </span>
          </div>
          <div style={{ height: '12px', background: 'var(--line)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ height: '100%', width: `${(stats.lengkap / stats.total) * 100}%`, background: 'var(--ok)', transition: 'width 0.5s ease' }} />
            <div style={{ height: '100%', width: `${(stats.proses / stats.total) * 100}%`, background: 'var(--gold)', transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.78rem' }}>
            <span>✅ Lengkap: <strong>{stats.lengkap}</strong></span>
            <span>🔄 Proses: <strong>{stats.proses}</strong></span>
            <span>⬜ Belum: <strong>{stats.belum}</strong></span>
          </div>
        </div>

        <div className="grid-3" style={{ gap: '12px' }}>
          {stats.perAspek.map((a) => (
            <div key={a.id} className="glow-card" style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Aspek {a.id} — {a.nama}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: a.pct >= 80 ? 'var(--ok)' : 'var(--muted)' }}>{a.pct}%</span>
              </div>
              <div style={{ height: '6px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${a.pct}%`, background: a.pct >= 80 ? 'var(--ok)' : 'var(--gold)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '6px' }}>{a.lengkap}/{a.total} item lengkap</div>
            </div>
          ))}
        </div>
      </section>

      {/* 7 Aspek Detailed Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">Rincian 7 Aspek Evaluasi</div>
            <h2>Matrix Indikator &amp; Penanggung Jawab (PIC OPD)</h2>
            <p>Klik tiap aspek untuk melihat 20 indikator, nilai saat ini, target perbaikan, dan checklist bukti dukung.</p>
          </div>
        </div>

        <div className="grid-2">
          {aspek.map((a) => {
            const pct = Math.min(100, (a.nilai / a.target) * 100);
            const aspekBukti = stats.perAspek.find((s) => s.id === a.id);
            return (
              <div key={a.id} className="glow-card" style={{ padding: '22px', cursor: 'pointer' }} onClick={() => setModalAspek(a)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'var(--primary-50)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.9rem' }}>{a.id}</div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{a.nama}</h3>
                  </div>
                  <span className="badge badge-blue">Bobot {a.bobot}%</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>{a.deskripsi}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span>Progres Aspek</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{formatDesimal(a.nilai)} / Target {formatDesimal(a.target)}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--ok)' : pct >= 50 ? 'var(--gold)' : 'var(--bad)', borderRadius: '4px', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>{a.indikator?.length || 0} Indikator Terkait</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {aspekBukti && <span style={{ color: aspekBukti.pct >= 80 ? 'var(--ok)' : 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{aspekBukti.lengkap}/{aspekBukti.total} bukti</span>}
                    Lihat Detail →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Checklist Bukti Dukung Section */}
      <section style={{ marginBottom: '40px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">📋 Checklist Bukti Dukung</div>
            <h2>Daftar Lengkap {allBukti.length} Item Bukti Dukung</h2>
            <p>Filter berdasarkan aspek, level kematangan, atau status pengumpulan dokumen. Klik <strong>Preview</strong> untuk melihat dokumen.</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <select value={filterAspek} onChange={(e) => setFilterAspek(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--r-xs)', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: '0.82rem', fontWeight: 600 }}>
            <option value="all">Semua Aspek</option>
            {aspek.map((a) => <option key={a.id} value={a.id}>Aspek {a.id} — {a.singkat}</option>)}
          </select>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--r-xs)', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: '0.82rem', fontWeight: 600 }}>
            <option value="all">Semua Level</option>
            <option value="1">Level 1 — Initiate</option>
            <option value="2">Level 2 — Emerging</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--r-xs)', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', fontSize: '0.82rem', fontWeight: 600 }}>
            <option value="all">Semua Status</option>
            <option value="belum">⬜ Belum</option>
            <option value="proses">🔄 Proses</option>
            <option value="lengkap">✅ Lengkap</option>
          </select>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', alignSelf: 'center', marginLeft: '4px' }}>{filteredBukti.length} item ditampilkan</span>
        </div>

        {/* Grouped Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groupedBukti.map((group) => {
            const isOpen = expandedInd === `${group.aspekId}|${group.indId}`;
            const doneCount = group.items.filter((b) => b.status === 'lengkap').length;
            const groupPct = group.items.length > 0 ? Math.round((doneCount / group.items.length) * 100) : 0;
            return (
              <div key={`${group.aspekId}|${group.indId}`} className="glow-card" style={{ overflow: 'hidden' }}>
                <div onClick={() => setExpandedInd(isOpen ? null : `${group.aspekId}|${group.indId}`)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isOpen ? 'var(--primary-50)' : 'transparent', borderBottom: isOpen ? '1px solid var(--line)' : 'none', transition: 'background 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    <span className="badge badge-blue" style={{ flexShrink: 0 }}>{group.indId}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.indNama}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Aspek {group.aspekId} — {group.aspekNama}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.88rem', color: groupPct >= 80 ? 'var(--ok)' : 'var(--muted)' }}>{doneCount}/{group.items.length}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>lengkap</div>
                    </div>
                    <div style={{ height: '32px', width: '4px', background: 'var(--line)', borderRadius: '2px', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
                      <div style={{ height: `${groupPct}%`, background: groupPct >= 80 ? 'var(--ok)' : 'var(--gold)', transition: 'height 0.3s' }} />
                    </div>
                    <span style={{ fontSize: '1rem', color: 'var(--muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: '12px 18px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {group.items.map((b) => {
                      const sm = STATUS_META[b.status] || STATUS_META.belum;
                      const hasFiles = b.lampiran && b.lampiran.length > 0;
                      return (
                        <div key={b.id} style={{ padding: '10px 14px', borderRadius: 'var(--r-xs)', border: '1px solid var(--line)', borderLeft: `4px solid ${sm.color}`, background: sm.bg }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.88rem' }}>{sm.icon}</span>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>{b.id}</span>
                              <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 6px', background: b.level === 1 ? 'var(--info-bg)' : 'var(--warn-bg)', color: b.level === 1 ? 'var(--info)' : 'var(--warn)', border: `1px solid ${b.level === 1 ? 'var(--info-border)' : 'var(--warn-border)'}` }}>L{b.level}</span>
                              {hasFiles && <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>📎 {b.lampiran.length} dokumen</span>}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px' }}>{b.nama}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '6px' }}>{b.detail}</div>
                          {b.catatan && <div style={{ fontSize: '0.72rem', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '6px' }}>💬 {b.catatan}</div>}
                          <div style={{ fontSize: '0.72rem', color: 'var(--muted)', display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', marginBottom: hasFiles ? '4px' : 0 }}>
                            <span>🏢</span>
                            {b.opd.map((o, i) => <span key={i} style={{ background: 'var(--surface)', padding: '1px 6px', borderRadius: '4px', border: '1px solid var(--line)' }}>{o}</span>)}
                          </div>
                          {hasFiles && <PreviewButton lampiran={b.lampiran} onPreview={setPreviewFile} />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {groupedBukti.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: '0.9rem' }}>Tidak ada item yang cocok dengan filter yang dipilih.</div>
          )}
        </div>
      </section>

      {/* Side Panel Detail Aspek & Indikator */}
      <DetailModal title={modalAspek ? `Aspek ${modalAspek.id}: ${modalAspek.nama}` : ''} open={!!modalAspek} onClose={() => setModalAspek(null)} maxWidth={680}>
        {modalAspek && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>{modalAspek.deskripsi}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modalAspek.indikator?.map((ind) => {
                const buktiItems = ind.bukti_dukung || [];
                const doneCount = buktiItems.filter((b) => b.status === 'lengkap').length;
                const groupPct = buktiItems.length > 0 ? Math.round((doneCount / buktiItems.length) * 100) : 0;
                return (
                  <div key={ind.id} style={{ padding: '16px', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)', border: '1px solid var(--line)', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-blue">{ind.id}</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{ind.nama}</strong>
                      </div>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)' }}>Nilai: {formatDesimal(ind.nilai, 1)} / Target {formatDesimal(ind.target, 1)}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>{ind.deskripsi}</p>
                    {ind.penanggung_jawab && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: buktiItems.length > 0 ? '10px' : 0 }}>
                        <span>👤 PIC Lead:</span>
                        <strong style={{ color: 'var(--primary)' }}>{ind.penanggung_jawab.lead}</strong>
                        {ind.penanggung_jawab.support?.length > 0 && <span>(Pendukung: {ind.penanggung_jawab.support.join(', ')})</span>}
                      </div>
                    )}
                    {buktiItems.length > 0 && (
                      <div style={{ marginTop: '8px', padding: '10px', borderRadius: 'var(--r-xs)', background: 'var(--bg)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink)' }}>📋 Bukti Dukung ({buktiItems.length} item)</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: groupPct >= 80 ? 'var(--ok)' : 'var(--muted)' }}>{doneCount}/{buktiItems.length} ({groupPct}%)</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {buktiItems.map((b) => {
                            const sm = STATUS_META[b.status] || STATUS_META.belum;
                            const hasFiles = b.lampiran && b.lampiran.length > 0;
                            return (
                              <div key={b.id} style={{ padding: '8px 10px', borderRadius: 'var(--r-xs)', background: sm.bg, border: '1px solid var(--line)', borderLeft: `3px solid ${sm.color}` }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.78rem' }}>
                                  <span style={{ flexShrink: 0 }}>{sm.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{b.nama}</span>
                                      <span className="badge" style={{ fontSize: '0.65rem', padding: '0 5px', background: b.level === 1 ? 'var(--info-bg)' : 'var(--warn-bg)', color: b.level === 1 ? 'var(--info)' : 'var(--warn)' }}>L{b.level}</span>
                                      {hasFiles && <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>📎</span>}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>{b.detail}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--muted-light)', marginTop: '2px' }}>🏢 {b.opd.join(', ')}</div>
                                    {hasFiles && <PreviewButton lampiran={b.lampiran} onPreview={setPreviewFile} />}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DetailModal>

      {/* Preview Modal */}
      <PreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </>
  );
}
