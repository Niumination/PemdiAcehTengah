/**
 * components/rk/Drawer.js — Laci detail indikator/butir (Patch 1).
 * Dibuka dari Kompas, matriks, antrean, palet. Isi: ringkasan level, butir per level
 * (level fokus terbuka), catatan mandiri per butir, ekspor (salin/DOCX/cetak) memakai
 * lib/catatanMandiri (dipakai ulang, tanpa perubahan). Fokus terkunci, Esc menutup.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Ikon from '@/components/ui/Ikon';
import { fokusLevel, peranLevel, statusMeta, LEVEL_NAMA_RESMI } from '@/lib/pemdiNilai';
import {
  teksCatatanButir, teksCatatanIndikator, htmlCatatanIndikator, docxCatatanIndikator,
  namaBerkasCatatan, butirBercatatan,
} from '@/lib/catatanMandiri';
import { kodePortal, warnaAspek } from '@/lib/ruangKendali';

async function salin(t) { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } }
function unduh(blob, nama) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a');
  a.href = url; a.download = nama; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function Tag({ k, children }) { return <span className={`rk-tag t-${k}`}>{children}</span>; }

function Butir({ b, ind, sorot }) {
  const c = b.catatan_mandiri;
  const [flash, setFlash] = useState(false);
  const sm = statusMeta(b.status);
  return (
    <div className="bt" id={`bt-${b.id.replace(/\W/g, '')}`} style={sorot ? { background: 'var(--rk-panel-2)' } : undefined}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontWeight: 500 }}>{kodePortal(b.id)}</span>
        <Tag k={b.status || 'belum'}>{sm.label}</Tag>
        {c ? <Tag k={c.prioritas}>{c.prioritas}</Tag> : null}
        {c ? <Tag k={c.jenis === 'revisi' ? 'revisi' : 'gap'}>{c.jenis === 'revisi' ? 'revisi asesor' : 'gap level berikut'}</Tag> : null}
        {b._peran === 'pendukung' ? <span className="faint">pendukung</span> : null}
      </div>
      <p className="nm">{b.nama}</p>
      {b.catatan ? <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>{b.catatan}</p> : null}
      {c ? (
        <div className="cm">
          <p style={{ margin: 0 }}>{c.ringkas}</p>
          {c.kebutuhan?.length ? (
            <>
              <div className="faint" style={{ marginTop: 8, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Masih harus disiapkan</div>
              <ul>{c.kebutuhan.map((k, i) => <li key={i}>{k}</li>)}</ul>
            </>
          ) : null}
          {c.rujukan?.length ? (
            <>
              <div className="faint" style={{ marginTop: 8, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Rujukan</div>
              <ul>
                {c.rujukan.map((r, i) => {
                  const href = r.url || r.path || '';
                  return (
                    <li key={i}>
                      {href ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--rk-emas-ink)' }}>{r.judul || r.dok}</a> : (r.judul || r.dok)}
                      {r.bagian ? <span className="muted"> — {r.bagian}</span> : null}
                      {r.halaman && r.halaman !== '—' ? <span className="faint"> · hal. {r.halaman}</span> : null}
                    </li>
                  );
                })}
              </ul>
            </>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, gap: 8, flexWrap: 'wrap' }}>
            <span className="muted"><Ikon nama="pengguna" size={13} /> PJ: <b style={{ color: 'var(--rk-ink)' }}>{c.pj}</b></span>
            <button type="button" className="rk-btn" style={{ height: 28 }} onClick={async () => { if (await salin(teksCatatanButir(b, ind))) { setFlash(true); setTimeout(() => setFlash(false), 1500); } }}>
              <Ikon nama={flash ? 'cek' : 'salin'} size={13} /> {flash ? 'Tersalin' : 'Salin catatan'}
            </button>
          </div>
        </div>
      ) : null}
      {b.url_preview ? <a className="faint" style={{ display: 'inline-flex', gap: 4, alignItems: 'center', marginTop: 6, fontSize: 12 }} href={b.url_preview} target="_blank" rel="noopener noreferrer"><Ikon nama="dokumen" size={13} /> berkas bukti <Ikon nama="luar" size={11} /></a> : null}
    </div>
  );
}

export default function Drawer({ state, onClose, data }) {
  const ref = useRef(null);
  const [flash, setFlash] = useState(false);
  const ind = useMemo(() => {
    if (!state?.indikatorId) return null;
    return (data?.indikatorPenuh || []).find((i) => i.id === state.indikatorId) || null;
  }, [state, data]);
  const ringkas = useMemo(() => (data?.indikator || []).find((i) => i.id === state?.indikatorId) || null, [state, data]);
  const open = Boolean(state && ind);

  useEffect(() => {
    if (!open) return undefined;
    const el = ref.current;
    const prev = document.activeElement;
    const focusables = () => el.querySelectorAll('a[href],button:not([disabled]),select,input,textarea,summary,[tabindex]:not([tabindex="-1"])');
    (el.querySelector('.rk-x') || el).focus();
    const key = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      if (e.key === 'Tab') {
        const f = focusables(); if (!f.length) return;
        const a = f[0]; const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    el.addEventListener('keydown', key);
    document.body.style.overflow = 'hidden';
    if (state?.butirId) {
      setTimeout(() => el.querySelector(`#bt-${state.butirId.replace(/\W/g, '')}`)?.scrollIntoView({ block: 'center' }), 60);
    }
    return () => { el.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose, state]);

  if (!open) return <aside className="rk-drawer" data-open="false" aria-hidden="true" ref={ref} />;

  const f = fokusLevel(ind);
  const perLevel = [1, 2, 3, 4, 5].map((l) => ({ l, items: (ind.bukti_dukung || []).filter((b) => Number(b.level) === l) }));
  const nCM = butirBercatatan(ind).length;
  const meta = { instansi: 'Pemerintah Kabupaten Aceh Tengah', tanggal: new Date().toLocaleDateString('id-ID') };
  const cetak = () => { const w = window.open('', '_blank', 'noopener'); if (!w) return; w.document.open(); w.document.write(htmlCatatanIndikator(ind, meta)); w.document.close(); };

  return (
    <>
      <div className="rk-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="rk-drawer" data-open="true" role="dialog" aria-modal="true" aria-labelledby="rk-dr-title" ref={ref} tabIndex={-1}>
        <div className="hd">
          <div>
            <div className="sub">
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: warnaAspek(ringkas?.aspekId), marginRight: 6 }} />
              Aspek {ringkas?.aspekId} · {ringkas?.aspekNama} · bobot {ind.bobot}% {f.eksternal ? <Tag k="eksternal">nilai dari pembina</Tag> : null}
            </div>
            <h2 id="rk-dr-title">{ind.id} — {ind.nama}</h2>
            <div className="sub" style={{ marginTop: 6, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="rk-lv" aria-label={`Level ${f.levelDicapai} dari 5`}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= f.levelDicapai ? 'on' : n === f.levelBerikut ? 'nx' : ''} />)}</span>
              <span>Level dicapai <b>{f.levelDicapai}</b>{f.levelBerikut ? <> · target berikut <b>{f.levelBerikut}</b> ({LEVEL_NAMA_RESMI[f.levelBerikut]})</> : null}</span>
              {ringkas?.pjLead ? <span className="faint">· PJ indikator: {ringkas.pjLead}</span> : null}
            </div>
          </div>
          <button type="button" className="rk-x" onClick={onClose} aria-label="Tutup"><Ikon nama="tutup" /></button>
        </div>
        <div className="bd">
          {f.eksternal ? (
            <p className="muted" style={{ marginTop: 0 }}>Indikator ini dinilai oleh instansi pembina (bukan lewat unggahan bukti). Butir di bawah adalah data dukung konteks.</p>
          ) : null}
          {perLevel.map(({ l, items }) => {
            if (!items.length) return null;
            const pr = peranLevel(l, f);
            const bukaDefault = f.tampil.has(l) || items.some((b) => b.id === state.butirId);
            const st = items.reduce((o, b) => { o[b.status] = (o[b.status] || 0) + 1; return o; }, {});
            return (
              <details key={l} className="rk-lvbox" open={bukaDefault}>
                <summary>
                  <span className="mono">L{l}</span> {LEVEL_NAMA_RESMI[l]}
                  <span className="faint" style={{ fontWeight: 400 }}>· {items.length} butir{st.diterima ? ` · ${st.diterima} diterima` : ''}{st.revisi ? ` · ${st.revisi} revisi` : ''}</span>
                  {pr ? <Tag k={pr.key === 'dicapai' ? 'diterima' : pr.key === 'berikut' ? 'proses' : 'belum'}>{pr.label}</Tag> : null}
                </summary>
                {items.map((b) => <Butir key={b.id} b={b} ind={ind} sorot={b.id === state.butirId} />)}
              </details>
            );
          })}
        </div>
        <div className="ft">
          {nCM ? (
            <>
              <button type="button" className="rk-btn" onClick={async () => { if (await salin(teksCatatanIndikator(ind))) { setFlash(true); setTimeout(() => setFlash(false), 1500); } }}>
                <Ikon nama={flash ? 'cek' : 'salin'} size={14} /> {flash ? 'Tersalin' : `Salin ${nCM} catatan`}
              </button>
              <button type="button" className="rk-btn" onClick={() => unduh(docxCatatanIndikator(ind, meta), namaBerkasCatatan(ind, 'docx'))}><Ikon nama="unduh" size={14} /> DOCX</button>
              <button type="button" className="rk-btn" onClick={cetak}><Ikon nama="cetak" size={14} /> Cetak / PDF</button>
            </>
          ) : <span className="faint" style={{ alignSelf: 'center' }}>Belum ada catatan mandiri pada indikator ini.</span>}
          <Link href={`/pemdi#${ind.id}`} className="rk-btn" style={{ marginLeft: 'auto' }}>Rinci di /pemdi <Ikon nama="panah" size={14} /></Link>
        </div>
      </aside>
    </>
  );
}
