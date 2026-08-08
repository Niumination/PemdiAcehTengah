#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fase B: Ganti section checklist → accordion kiri-kanan (bilah kiri pilih indikator, kanan detail)."""
import re

src = open('pages/pemdi.js').read()

# Tandai awal & akhir blok checklist
start_marker = "{/* ════════ CHECKLIST BUKTI DUKUNG — per level, preview, rekomendasi, catatan mandiri ════════ */}"
end_marker = "{/* Side Panel Detail Aspek & Indikator */}"

si = src.index(start_marker)
ei = src.index(end_marker)

new_block = '''      {/* ════════ CHECKLIST BUKTI DUKUNG — accordion kiri-kanan ════════ */}
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
            🎯 Gap: {Math.max(0, pemdiData.target_item_bukti - statGlobal.total)} item
          </span>
        </div>

        {/* Accordion kiri-kanan */}
        <div className="checklist-split" style={{
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '18px',
          alignItems: 'start',
        }}>
          {/* ── Bilah kiri: daftar indikator ── */}
          <div className="checklist-nav" style={{
            border: '1px solid var(--line)', borderRadius: '14px', overflow: 'hidden',
            background: 'var(--surface)', maxHeight: '72vh', display: 'flex', flexDirection: 'column',
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
                .filter(a => !pilihAspek || a.id === pilihAspek)
                .flatMap(a => a.indikator.map(ind => ({ ind, a })))
                .map(({ ind, a }) => {
                  const st = hitungStatusInd(ind);
                  const pct = st.count > 0 ? (st.lengkap / st.count) * 100 : 0;
                  const aktif = pilihInd === ind.id;
                  return (
                    <button
                      key={ind.id}
                      onClick={() => setPilihInd(ind.id)}
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{a.nama.slice(0, 22)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: st.lengkap === st.count && st.count > 0 ? 'var(--ok)' : 'var(--muted)' }}>
                          {st.lengkap}/{st.count}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: '6px' }}>
                        {ind.nama.length > 70 ? ind.nama.slice(0, 70) + '…' : ind.nama}
                      </div>
                      <div style={{ height: '5px', borderRadius: '3px', background: 'var(--line)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 && st.count > 0 ? 'var(--ok)' : pct > 0 ? 'var(--gold)' : 'var(--muted-light, #c3c9d6)', borderRadius: '3px' }} />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* ── Panel kanan: detail indikator terpilih ── */}
          <div className="checklist-detail" style={{ minWidth: 0 }}>
            {(() => {
              const aktifInd = pilihInd
                ? aspek.flatMap(a => a.indikator).find(i => i.id === pilihInd)
                : null;
              if (!aktifInd) {
                // Default: indikator pertama
                const first = aspek[0]?.indikator?.[0];
                if (first && !pilihInd) {
                  // render langsung
                  return renderIndDetail(first);
                }
                return (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)', border: '1px dashed var(--line)', borderRadius: '14px' }}>
                    Pilih indikator di bilah kiri untuk melihat detail bukti dukung.
                  </div>
                );
              }
              return renderIndDetail(aktifInd);
            })()}
          </div>
        </div>
      </section>

'''

# Helper function renderIndDetail — tambahkan sebagai fungsi lokal di dalam komponen? Tidak bisa.
# Kita render inline dengan IIFE penuh. Ganti pendekatan: definisikan renderIndDetail sebagai function di module scope.
# Untuk kesederhanaan, render detail langsung di sini dengan IIFE yang menerima ind.

render_helper = '''
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
            🎯 Gap: {Math.max(0, pemdiData.target_item_bukti - statGlobal.total)} item
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
                .filter(a => !pilihAspek || a.id === pilihAspek)
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
              const aktifInd = pilihInd
                ? aspek.flatMap(a => a.indikator).find(i => i.id === pilihInd)
                : null;
              const ind = aktifInd || aspek[0]?.indikator?.[0];
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
                <div key={ind.id} data-reveal style={{ padding: '20px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--surface)' }}>
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

'''

src = src[:si] + render_helper + src[ei:]
open('pages/pemdi.js', 'w').write(src)
print("Section checklist diganti dengan accordion kiri-kanan")
