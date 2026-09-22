/**
 * components/rk/Palet.js — Palet perintah Ctrl+K (Patch 1).
 * Sumber: 20 indikator + butir bercatatan (dari konteks) + perintah navigasi.
 * Pencocokan substring sederhana berbobot (tanpa pustaka) — cukup untuk ±80 entri.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useRK } from './RKShell';

function skor(q, teks) {
  const t = teks.toLowerCase(); let s = 0;
  for (const w of q) { const i = t.indexOf(w); if (i < 0) return -1; s += i === 0 ? 3 : t[i - 1] === ' ' ? 2 : 1; }
  return s;
}

export default function Palet({ onClose, data }) {
  const router = useRouter();
  const rk = useRK();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef(null);
  useEffect(() => { input.current?.focus(); }, []);

  const entri = useMemo(() => {
    const e = [
      { tp: 'Halaman', label: 'Situasi — beranda ruang kendali', run: () => router.push('/dashboard') },
      { tp: 'Halaman', label: 'Matriks 20 indikator', run: () => router.push('/indikator') },
      { tp: 'Halaman', label: 'Antrean butir prioritas', run: () => router.push('/antrean') },
      { tp: 'Halaman', label: 'Modul indikator (kriteria L1–L5)', run: () => router.push('/modul-indikator') },
      { tp: 'Halaman', label: 'Draf bukti dukung prioritas', run: () => router.push('/requirement') },
      { tp: 'Halaman', label: 'Rinci per aspek (/pemdi)', run: () => router.push('/pemdi') },
      { tp: 'Halaman', label: 'Perangkat daerah (52 OPD)', run: () => router.push('/opd') },
      { tp: 'Halaman', label: 'Pencarian lengkap (glosarium, dokumen kunci)', run: () => router.push('/cari') },
      { tp: 'Perintah', label: 'Persona: Koordinator', run: () => rk?.setPersona('koordinator') },
      { tp: 'Perintah', label: 'Persona: PJ OPD', run: () => rk?.setPersona('pj') },
      { tp: 'Perintah', label: 'Ganti tema terang/gelap', run: () => { const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', t); try { localStorage.setItem('theme', t); } catch { /* */ } } },
    ];
    for (const o of data?.opdPJ || []) e.push({ tp: 'Filter PJ', label: `${o.singkat} — ${o.total} butir`, run: () => { rk?.setPersona('pj'); rk?.setOpd(String(o.id)); } });
    for (const i of data?.indikator || []) e.push({ tp: 'Indikator', label: `${i.id} — ${i.nama}`, sub: `${i.aspekNama} · level ${i.levelDicapai}`, run: () => rk?.bukaIndikator(i.id) });
    for (const b of data?.antrean || []) e.push({ tp: 'Butir', label: `${b.kode} — ${b.nama}`, sub: `${b.prioritas} · ${b.pjKunci}`, run: () => rk?.bukaButir(b.id, b.indikatorId) });
    return e;
  }, [data, router, rk]);

  const hasil = useMemo(() => {
    const kata = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!kata.length) return entri.slice(0, 12);
    return entri.map((x) => ({ x, s: skor(kata, `${x.label} ${x.sub || ''} ${x.tp}`) })).filter((r) => r.s >= 0).sort((a, b) => b.s - a.s).slice(0, 14).map((r) => r.x);
  }, [q, entri]);

  useEffect(() => { setSel(0); }, [q]);

  const jalankan = (x) => { onClose(); x.run(); };
  const key = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(hasil.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter' && hasil[sel]) { e.preventDefault(); jalankan(hasil[sel]); }
  };

  return (
    <div className="rk-pal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="box" role="dialog" aria-modal="true" aria-label="Cari dan perintah">
        <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} placeholder="Cari indikator, kode butir (I19-L1-01), OPD, atau perintah…" aria-label="Cari" aria-controls="rk-pal-list" aria-activedescendant={hasil[sel] ? `rk-pal-${sel}` : undefined} />
        {hasil.length ? (
          <ul id="rk-pal-list" role="listbox">
            {hasil.map((x, i) => (
              <li key={`${x.tp}-${x.label}`} id={`rk-pal-${i}`} role="option" aria-selected={i === sel} onMouseEnter={() => setSel(i)} onClick={() => jalankan(x)}>
                <span className="tp">{x.tp}</span>
                <span>{x.label}{x.sub ? <span className="faint"> · {x.sub}</span> : null}</span>
              </li>
            ))}
          </ul>
        ) : <div className="kosong">Tidak ada yang cocok. Coba kode butir seperti <span className="mono">I20-L1-03</span>.</div>}
      </div>
    </div>
  );
}
