import { useState, useMemo, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DetailModal from '@/components/DetailModal';
import TopographicBackdrop from '@/components/TopographicBackdrop';
import { formatDesimal } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';
import modulData from '@/data/modul-indikator.json';
import dokumenKunci from '@/data/dokumen-kunci.json';
import buktiMapping from '@/data/bukti-dokumen-mapping.json';

// ── Konstanta visual (sama dengan halaman modul-indikator agar konsisten) ──
const STATUS_META = {
  belum:   { icon: '⬜', label: 'Belum',     color: 'var(--muted)', bg: 'var(--surface-2)' },
  proses:  { icon: '🔄', label: 'Proses',    color: 'var(--warn)', bg: 'var(--warn-bg)' },
  lengkap: { icon: '✅', label: 'Lengkap',    color: 'var(--ok)', bg: 'var(--ok-bg)' },
};
const LEVEL_LABEL = { 0: 'Baseline', 1: 'Initiate', 2: 'Emerging', 3: 'Established', 4: 'Leading', 5: 'Transformative' };
const LEVEL_WARNA = { 0: 'var(--muted)', 1: '#ef4444', 2: '#f59e0b', 3: '#3b82f6', 4: '#10b981', 5: '#8b5cf6' };

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

// ── Helpers checklist ──
function hitungStatusInd(ind) {
  if (!ind?.bukti_dukung) return { count: 0, lengkap: 0, proses: 0, belum: 0 };
  const bd = ind.bukti_dukung;
  return {
    count: bd.length,
    lengkap: bd.filter(b => b.status === 'lengkap').length,
    proses: bd.filter(b => b.status === 'proses').length,
    belum: bd.filter(b => b.status === 'belum' || !b.status).length,
  };
}

function getDokumenForBukti(indId, buktiId) {
  const ind = buktiMapping.indikator.find(i => i.indikator_id === indId);
  if (!ind) return [];
  const b = ind.bukti.find(x => x.id === buktiId);
  return b?.dokumen_kunci || [];
}

function cariKriteria(indId, level) {
  const modul = modulData.modules.find(m => m.indikator_id === indId);
  if (!modul) return '';
  const lk = (modul.level_kriteria || []).find(l => l.level === level);
  if (!lk) return '';
  return (lk.kriteria || '')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function rekomendasiInd(ind, kriteriaFn) {
  const reco = [];
  const st = hitungStatusInd(ind);
  const nilai = ind.nilai || 0;
  const target = ind.target || 0;

  // 1. Level berikutnya untuk naik nilai
  if (nilai < 5) {
    const next = nilai + 1;
    const krit = kriteriaFn(next);
    if (target > nilai) {
      reco.push({
        icon: '📈',
        level: next,
        teks: `Nilai saat ini ${formatDesimal(nilai, 1)} < target ${formatDesimal(target, 1)} — lengkapi bukti Level ${next} (${LEVEL_LABEL[next]}) agar naik.`,
        kriteria: krit,
      });
    } else {
      reco.push({
        icon: '⭐',
        level: next,
        teks: `Nilai sudah mencapai target — pertahankan. Bukti Level ${next} (${LEVEL_LABEL[next]}) dapat melampaui target.`,
        kriteria: krit,
      });
    }
  }

  // 2. Level tanpa bukti sama sekali (1..level berikutnya)
  for (let lv = 1; lv <= Math.min(nilai + 1, 5); lv++) {
    const ada = (ind.bukti_dukung || []).some(b => b.level === lv);
    if (!ada) {
      reco.push({ icon: '🆕', level: lv, teks: `Level ${lv} (${LEVEL_LABEL[lv]}) belum punya bukti sama sekali.`, kriteria: kriteriaFn(lv) });
    }
  }

  // 3. Bukti ber-status belum/proses — perlu verifikasi
  if (st.proses > 0) reco.push({ icon: '🔄', teks: `${st.proses} bukti ber-status Proses (sudah diunggah ke portal eval.spbe.go.id) — verifikasi kesesuaian kriteria level.` });
  if (st.belum > 0) reco.push({ icon: '⬜', teks: `${st.belum} bukti ber-status Belum — lengkapi & unggah ke portal eval.spbe.go.id.` });

  // 4. Dokumen kunci yang belum ter-cover untuk indikator ini
  const dkInd = (dokumenKunci.dokumen || []).filter(d => (d.indikator || []).includes(ind.id));
  const covered = new Set();
  for (const b of ind.bukti_dukung || []) {
    for (const no of getDokumenForBukti(ind.id, b.id)) covered.add(no);
  }
  const belumCover = dkInd.filter(d => !covered.has(d.no));
  if (belumCover.length > 0) {
    reco.push({
      icon: '🗂️',
      teks: `Dokumen kunci belum ter-cover: ${belumCover.map(d => `#${d.no} (${d.nama})`).join('; ')}.`,
    });
  }

  if (reco.length === 0) reco.push({ icon: '✅', teks: 'Semua level yang dibutuhkan sudah punya bukti lengkap.' });
  return reco;
}

function defaultCatatan(ind) {
  const st = hitungStatusInd(ind);
  const buktis = (ind.bukti_dukung || [])
    .map(b => `- ${b.nama} (Level ${b.level}, status: ${STATUS_META[b.status]?.label || 'Belum'})`)
    .join('\n');
  return `Catatan Mandiri ${ind.id} — ${ind.nama}\n\nBukti dukung disusun untuk memenuhi kriteria indikator ${ind.id} (${ind.nama}).\nDokumen yang dilampirkan:\n${buktis || '- (belum ada bukti)'}\n\nCatatan ini dilampirkan saat unggah bukti dukung di portal eval.spbe.go.id.`;
}

export default function PemdiPage() {
  const { aspek, target_indeks, target_predikat, baseline_spbe } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);
  const gap = Math.max(0, target_indeks - indeks);
  // Jumlah bukti yang TAMPIL (indikator _l1_lengkap !== false)
  const totalTampil = aspek.reduce((s, a) => s + a.indikator.reduce((s2, i) =>
    i._l1_lengkap === false ? s2 : s2 + (i.bukti_dukung || []).length, 0), 0);

  const [modalAspek, setModalAspek] = useState(null);
  const [preview, setPreview] = useState(null); // { id, nama, level, status, url, dkNos, indId }
  const [catatan, setCatatan] = useState({});
  const [copyFlash, setCopyFlash] = useState(null);
  const [pilihInd, setPilihInd] = useState(null); // indikator aktif di accordion checklist
  const [pilihAspek, setPilihAspek] = useState(null); // filter aspek di bilah kiri

  // Inisialisasi pilihInd ke indikator pertama dari aspek pertama saat komponen mount
  useEffect(() => {
    if (aspek.length > 0 && aspek[0].indikator.length > 0) {
      setPilihInd(aspek[0].indikator[0].id);
    }
  }, [aspek]);

  const handleAspekClick = useCallback((aspekId) => {
    const selectedAspek = aspek.find(a => a.id === aspekId); // Gunakan 'aspek' dari prop/state
    if (selectedAspek && selectedAspek.indikator.length > 0) {
      setPilihInd(selectedAspek.indikator[0].id); // Set ke indikator pertama dari aspek
    }
  }, [aspek]); // Depend on aspek

  // Indikator aktif di detail panel — dihitung di level komponen (bukan di dalam JSX callback)
  const aktifInd = useMemo(() => {
    if (!pilihInd && aspek.length > 0 && aspek[0].indikator.length > 0) {
      return aspek[0].indikator[0]; // Default: indikator pertama dari aspek pertama
    }
    return pilihInd
      ? aspek.flatMap(a => a.indikator).find(i => i.id === pilihInd)
      : null;
  }, [pilihInd, aspek]);

  // Muat catatan mandiri dari localStorage
  useEffect(() => {
    const saved = {};
    for (const a of pemdiData.aspek) {
      for (const ind of a.indikator) {
        const v = localStorage.getItem(`pemdi.catatan.${ind.id}`);
        if (v !== null) saved[ind.id] = v;
      }
    }
    setCatatan(saved);
  }, []);

  const simpanCatatan = (indId, nilai) => {
    setCatatan(prev => ({ ...prev, [indId]: nilai }));
    localStorage.setItem(`pemdi.catatan.${indId}`, nilai);
  };

  const salinCatatan = async (indId) => {
    const teks = catatan[indId] || '';
    try {
      await navigator.clipboard.writeText(teks);
      setCopyFlash(indId);
      setTimeout(() => setCopyFlash(null), 1500);
    } catch {
      /* clipboard tidak tersedia */
    }
  };

  // Statistik global checklist
  const statGlobal = useMemo(() => {
    let total = 0, lengkap = 0, proses = 0, belum = 0;
    for (const a of aspek) {
      for (const ind of a.indikator) {
        const st = hitungStatusInd(ind);
        total += st.count; lengkap += st.lengkap; proses += st.proses; belum += st.belum;
      }
    }
    // Gap = item yang belum lengkap (target tercapai jika semua item lengkap)
    const gap = Math.max(0, total - lengkap);
    return { total, lengkap, proses, belum, gap };
  }, [aspek]);

  return (
    <>
      <Head>
        <title>Indeks Kematangan Pemdi 2026 (PermenPANRB 8/2026) — Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard Kematangan Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah — Evaluasi 7 Aspek dan 20 Indikator berdasarkan PermenPANRB No. 8 Tahun 2026."
        />
      </Head>

      {/* Hero Header */}
      <section
        data-reveal
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
            Mengukur <strong>7 Aspek Utama</strong> dan <strong>20 Indikator Kunci</strong> menuju target indeks <strong>≥ 2,50</strong>.
          </p>
        </div>
      </section>

      {/* Executive KPI Summary Cards */}
      <section style={{ marginBottom: '32px' }}>
        <div className="grid-3" data-reveal-stagger>
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center', '--i': 0 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Baseline SPBE 2025</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold-deep)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>{formatDesimal(baseline_spbe)}</div>
            <span className="badge badge-yellow">Level Kematangan Cukup</span>
          </div>
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center', '--i': 1, borderColor: 'var(--primary)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Indeks Pemdi (dari Bukti Dukung)</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>{formatDesimal(indeks)}</div>
            <span className={`badge ${predikat.bg}`} style={{ color: predikat.warna }}>Predikat {predikat.label}</span>
            <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '6px' }}>
              Dihitung dari {statGlobal.lengkap} bukti lengkap · {statGlobal.total} item · target {pemdiData.target_item_bukti}
            </div>
          </div>
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center', '--i': 2 }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Target Evaluasi 2026</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>≥ {formatDesimal(target_indeks)}</div>
            <span className="badge badge-green">Gap Analysis: {formatDesimal(gap)} Poin</span>
          </div>
        </div>
      </section>

      {/* 7 Aspek Detailed Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">Rincian 7 Aspek Evaluasi</div>
            <h2>Matrix Indikator &amp; Penanggung Jawab (PIC OPD)</h2>
            <p>Klik tiap aspek untuk melihat 20 indikator, nilai saat ini, dan target perbaikan.</p>
          </div>
        </div>

        <div className="grid-2" data-reveal-stagger>
          {aspek.map((a, ai) => {
            const pct = Math.min(100, (a.nilai / a.target) * 100);
            return (
              <div key={a.id} className="glow-card" style={{ padding: '22px', cursor: 'pointer', '--i': ai }} onClick={() => handleAspekClick(a.id)}>
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
                  <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--ok)' : pct >= 50 ? 'var(--gold)' : 'var(--bad)', borderRadius: '4px', transformOrigin: 'left', animation: pct > 0 ? 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1)' : undefined }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>{a.indikator?.length || 0} Indikator Terkait</span>
                  <span>Lihat Detail →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      
      {/* ════════ CHECKLIST BUKTI DUKUNG — accordion kiri-kanan ════════ */}
      <section data-reveal style={{ marginBottom: '40px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">Checklist Persiapan Upload Bukti Dukung</div>
            <h2>📋 Checklist Bukti Dukung per Indikator</h2>
            <p>
              Status ketersediaan bukti per level (sinkron dengan halaman Modul Indikator), preview dokumen yang tersedia,
              rekomendasi pelengkap, dan catatan mandiri yang disiapkan untuk unggah di portal eval.spbe.go.id.
              <strong style={{ color: 'var(--primary)' }}> Pilih indikator di bilah kiri →</strong>
            </p>
          </div>
        </div>

        {/* Stat global checklist */}
        <div className="stat-row" style={{ flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
            📦 {statGlobal.total} bukti ({pemdiData.total_item_bukti} item)
          </span>
          <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
            ✅ {statGlobal.lengkap} Lengkap
          </span>
          <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>
            ⬜ {statGlobal.belum} Belum
          </span>
          <span className="stat-badge" style={{ background: 'var(--primary-bg, #e3edff)', color: 'var(--primary)' }}>
            🎯 Gap: {statGlobal.gap} item
          </span>
        </div>

        {/* Accordion kiri-kanan */}
        <div className="checklist-split" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) 1fr',
          gap: '18px',
          alignItems: 'start',
        }}>
          {/* ── Bilah kiri: daftar indikator ── */}
          <div className="checklist-nav" style={{
            border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden',
            background: 'var(--surface)', maxHeight: '72vh', display: 'flex', flexDirection: 'column',
            position: 'sticky', top: '80px',
          }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', background: 'var(--surface-2)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>🧭 Pilih Indikator</div>
              <select
                value={pilihAspek || ''}
                onChange={(e) => setPilihAspek(e.target.value || null)}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--line)',
                  fontSize: '0.76rem', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)',
                }}
              >
                <option value="">Semua Aspek</option>
                {aspek.map(a => <option key={a.id} value={a.id}>Aspek {a.id} — {a.nama.slice(0, 38)}</option>)}
              </select>
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {aspek
                .filter(a => !pilihAspek || String(a.id) === String(pilihAspek))
                .flatMap(a => a.indikator.map(ind => ({ ind, a })))
                .map(({ ind, a }) => {
                  const st = hitungStatusInd(ind);
                  const pct = st.count > 0 ? (st.lengkap / st.count) * 100 : 0;
                  const aktif = pilihInd === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setPilihInd(ind.id)}
                      aria-pressed={aktif}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer',
                        padding: '11px 14px', fontFamily: 'inherit',
                        background: aktif ? 'var(--primary-bg, #e3edff)' : 'var(--surface)',
                        borderBottom: '1px solid var(--line)',
                        borderLeft: aktif ? '3px solid var(--primary)' : '3px solid transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="badge badge-blue">{ind.id}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{a.nama.slice(0, 22)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: st.lengkap === st.count && st.count > 0 ? 'var(--ok)' : 'var(--muted)' }}>
                          {st.lengkap}/{st.count}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: '6px' }}>
                        {ind.nama.length > 70 ? ind.nama.slice(0, 70) + '…' : ind.nama}
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: 'var(--line)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 && st.count > 0 ? 'var(--ok)' : pct > 0 ? 'var(--gold)' : '#c3c9d6', borderRadius: '3px' }} />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* ── Panel kanan: detail indikator ── */}
          <div className="checklist-detail" style={{ minWidth: 0 }}>
            {(() => {
              const ind = aktifInd;
              if (!ind) {
                return (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--line)', borderRadius: '14px' }}>
                    Belum ada indikator.
                  </div>
                );
              }
              const st = hitungStatusInd(ind);
              const reco = rekomendasiInd(ind, (lv) => cariKriteria(ind.id, lv));
              const catatanInd = catatan[ind.id] ?? defaultCatatan(ind);
              const catatanTersimpan = catatan[ind.id] !== undefined;
              const buktiPerLevel = [1, 2, 3, 4, 5].map(lv => ({
                level: lv,
                items: (ind.bukti_dukung || []).filter(b => b.level === lv),
              }));
              return (
                <div key={ind.id} style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--surface)' }}>
                  {/* Header indikator */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-blue">{ind.id}</span>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--text)' }}>{ind.nama}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)' }}>
                        Nilai {formatDesimal(ind.nilai, 1)} / {formatDesimal(ind.target, 1)}
                      </span>
                      <span className="stat-badge" style={{ background: 'var(--ok-bg)', color: 'var(--ok)', fontSize: '0.68rem' }}>✅ {st.lengkap}</span>
                      <span className="stat-badge" style={{ background: 'var(--surface-2)', color: 'var(--muted)', fontSize: '0.68rem' }}>⬜ {st.belum}</span>
                      <Link href={`/modul-indikator?modul=${ind.id.replace('I', '')}`} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', padding: '3px 10px', borderRadius: '6px', background: 'var(--primary-bg)', border: '1px solid var(--primary-line)' }}>
                        Modul →
                      </Link>
                    </div>
                  </div>

                  {/* PIC */}
                  {ind.penanggung_jawab && (
                    <div style={{ fontSize: '0.76rem', color: 'var(--muted)', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: '8px' }}>
                      <span>👤 PIC:</span>
                      <strong style={{ color: 'var(--primary)' }}>{ind.penanggung_jawab.lead}</strong>
                      {ind.penanggung_jawab.support?.length > 0 && <span>({ind.penanggung_jawab.support.slice(0, 3).join(', ')}{ind.penanggung_jawab.support.length > 3 ? '…' : ''})</span>}
                    </div>
                  )}

                  {/* Checklist per level */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                    {buktiPerLevel.map(({ level, items }) => (
                      <div key={level} style={{ padding: '10px', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: LEVEL_WARNA[level], background: `${LEVEL_WARNA[level]}18`, padding: '2px 8px', borderRadius: '100px' }}>
                            L{level} · {LEVEL_LABEL[level]}
                          </span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--muted)' }}>
                            {items.filter(i => i.status === 'lengkap').length}/{items.length}
                          </span>
                        </div>
                        {items.length === 0 ? (
                          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontStyle: 'italic' }}>— belum ada bukti</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {items.map((b) => {
                              const sm = STATUS_META[b.status] || STATUS_META.belum;
                              const dkNos = getDokumenForBukti(ind.id, b.id);
                              return (
                                <div key={b.id} style={{ fontSize: '0.7rem', color: 'var(--ink-secondary)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                  <span title={sm.label}>{sm.icon}</span>
                                  <span style={{ flex: 1, lineHeight: 1.35 }}>
                                    {b.nama}
                                    {b._peran === 'pendukung' && (
                                      <span style={{ fontSize: '0.6rem', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '3px', padding: '0 4px', marginLeft: '4px' }}>
                                        🔹 Pendukung
                                      </span>
                                    )}
                                    {dkNos.length > 0 && <span style={{ color: 'var(--primary)', fontWeight: 700 }}> #{dkNos.join(', #')}</span>}
                                    {b.url_preview && (b._ext === 'url' ? (
                                      <a href={b.url_preview} target="_blank" rel="noopener noreferrer"
                                        style={{ color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.68rem', marginLeft: '4px' }}>
                                        🌐 buka
                                      </a>
                                    ) : (
                                      <button
                                        onClick={() => setPreview({ id: b.id, nama: b.nama, detail: b.detail || '', level, status: b.status, url: b.url_preview, dkNos, indId: ind.id, indNama: ind.nama })}
                                        style={{ border: 'none', background: 'transparent', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.68rem', padding: 0, marginLeft: '4px' }}
                                      >
                                        👁️ preview
                                      </button>
                                    ))}
                                    {(b.url_lampiran || []).map((l, li) => (
                                      <button
                                        key={li}
                                        onClick={() => setPreview({ id: b.id, nama: `${b.nama} — lampiran ${li + 1}`, detail: b.detail || '', level, status: b.status, url: l, dkNos, indId: ind.id, indNama: ind.nama })}
                                        style={{ border: 'none', background: 'transparent', color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.68rem', padding: 0, marginLeft: '4px' }}
                                        title={`Lampiran ${li + 1}`}
                                      >
                                        📎{li + 1}
                                      </button>
                                    ))}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Rekomendasi */}
                  {reco.length > 0 && (
                    <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--warn-bg)', border: '1px solid var(--warn)', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--warn)', marginBottom: '4px' }}>💡 Rekomendasi Pelengkap</div>
                      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {reco.map((r, i) => (
                          <li key={i} style={{ fontSize: '0.74rem', color: 'var(--ink-secondary)', lineHeight: 1.45 }}>
                            {r.icon} {r.teks}
                            {r.kriteria && (
                              <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '2px' }}>
                                <em>Kriteria {r.level ? `L${r.level}: ` : ''}{r.kriteria.slice(0, 180)}{r.kriteria.length > 180 ? '…' : ''}</em>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Catatan mandiri */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                      <label htmlFor={`catatan-${ind.id}`} style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text)' }}>
                        📝 Catatan Mandiri <span style={{ fontWeight: 400, color: 'var(--muted)' }}>— dilampirkan saat unggah bukti di portal eval.spbe.go.id</span>
                      </label>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {catatanTersimpan && <span style={{ fontSize: '0.66rem', color: 'var(--ok)', fontWeight: 600 }}>💾 tersimpan</span>}
                        <button onClick={() => salinCatatan(ind.id)} style={{ border: '1px solid var(--primary-line)', background: 'var(--primary-bg)', color: 'var(--primary)', borderRadius: '6px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}>
                          {copyFlash === ind.id ? '✅ Tersalin!' : '📋 Salin'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      id={`catatan-${ind.id}`}
                      value={catatanInd}
                      onChange={(e) => simpanCatatan(ind.id, e.target.value)}
                      rows={4}
                      style={{
                        width: '100%', borderRadius: '8px', border: '1px solid var(--line)', padding: '10px',
                        fontSize: '0.76rem', fontFamily: 'inherit', background: 'var(--surface-2)', color: 'var(--text)',
                        resize: 'vertical', lineHeight: 1.5,
                      }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Responsive: stack di mobile */}
        <style jsx>{`
          @media (max-width: 860px) {
            .checklist-split { grid-template-columns: 1fr !important; }
            .checklist-nav { max-height: 260px; position: static !important; }
          }
        `}</style>
      </section>

{/* Side Panel Detail Aspek & Indikator */}
      <DetailModal title={modalAspek ? `Aspek ${modalAspek.id}: ${modalAspek.nama}` : ''} open={!!modalAspek} onClose={() => setModalAspek(null)} maxWidth={680}>
        {modalAspek && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>{modalAspek.deskripsi}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modalAspek.indikator?.map((ind) => {
                return (
                  <div key={ind.id} style={{ padding: '16px', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="badge badge-blue">{ind.id}</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{ind.nama}</strong>
                      </div>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)' }}>Nilai: {formatDesimal(ind.nilai, 1)} / Target {formatDesimal(ind.target, 1)}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>{ind.deskripsi}</p>
                    {ind.penanggung_jawab && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                        <span>👤 PIC Lead:</span>
                        <strong style={{ color: 'var(--primary)' }}>{ind.penanggung_jawab.lead}</strong>
                        {ind.penanggung_jawab.support?.length > 0 && <span>(Pendukung: {ind.penanggung_jawab.support.join(', ')})</span>}
                      </div>
                    )}
                    <div>
                      <Link href={`/modul-indikator?modul=${ind.id.replace('I','')}`}
                        style={{
                          fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)',
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '6px',
                          background: 'var(--primary-bg)', border: '1px solid var(--primary-line)',
                        }}>
                        📋 Lihat Modul Indikator →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DetailModal>

      {/* Side Panel Preview Bukti Dukung */}
      <DetailModal
        title={preview ? `👁️ Preview Bukti: ${preview.id}` : ''}
        open={!!preview}
        onClose={() => setPreview(null)}
        maxWidth={1000}
      >
        {preview && (
          <div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="badge badge-blue">{preview.indId}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: LEVEL_WARNA[preview.level], background: `${LEVEL_WARNA[preview.level]}18`, padding: '2px 8px', borderRadius: '100px' }}>
                  Level {preview.level} · {LEVEL_LABEL[preview.level]}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', background: (STATUS_META[preview.status] || STATUS_META.belum).bg, color: (STATUS_META[preview.status] || STATUS_META.belum).color, fontSize: '0.7rem', fontWeight: 600 }}>
                  {(STATUS_META[preview.status] || STATUS_META.belum).icon} {(STATUS_META[preview.status] || STATUS_META.belum).label}
                </span>
                {preview.dkNos.length > 0 && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                    Dokumen Kunci: #{preview.dkNos.join(', #')}
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{preview.nama}</strong>
              {preview.detail && <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.5 }}>{preview.detail}</p>}
            </div>
            <div style={{ border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden', background: '#f4f6f9', minHeight: 300 }}>
              {preview.url.match(/\.(pdf|png|jpe?g|gif|webp)(\?|$)/i) ? (
                <iframe src={preview.url} title={`Preview ${preview.id}`} style={{ width: '100%', height: '78vh', border: 'none' }} />
              ) : (
                <div style={{ padding: '20px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  Format tidak bisa di-preview langsung. Buka file sumber:
                  <br />
                  <a href={preview.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>Buka {preview.url.split('/').pop()} ↗</a>
                </div>
              )}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
              <a href={preview.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline' }}>
                ↗ Buka file asli di tab baru
              </a>
            </div>
          </div>
        )}
      </DetailModal>
    </>
  );
}
