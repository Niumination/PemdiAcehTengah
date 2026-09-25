/**
 * components/rk/NavMenu.js — Menu navigasi halaman "Radial ⇄ Baris" (Patch 9, Tahap 1 — 23 Sep 2026)
 *
 * Menggantikan tab atas, menu "Lainnya", dan bottom-tab ponsel di RKShell. Prototipe
 * yang disetujui pemilik: desain/proto-nav-radial.html (v5).
 *   - Pemicu bulat di TEPI KIRI layar (tengah vertikal; ponsel kiri-bawah). Tombol M membuka.
 *   - Gaya "radial": 12 rute mekar di satu busur r=270px dengan jarak vertikal seragam 46px (garis busur/garis vertikal Baris dihapus 25 Sep — hanya tombol & label)
 *     (x = √(r²−y²)) — ikon di dalam, label di luar, tetap horizontal.
 *   - Gaya "baris": overlay & item yang sama, disusun garis lurus vertikal di samping pemicu.
 *   - Sakelar gaya di dalam menu; tersimpan localStorage `pemdi:nav`; default desktop radial, ponsel baris.
 *   - Auto-hide: routeChangeStart / klik scrim / Esc. Auto-focus ke rute aktif. Focus trap (Tab/panah).
 *   - Pintasan `g` + huruf (data-k) tetap bekerja walau menu tertutup; Ctrl+K tetap di RKShell.
 *   - Animasi hanya transform/opacity; dimatikan oleh prefers-reduced-motion (CSS).
 * Koordinat item ada di CSS (.rk-nav li:nth-child) agar tanpa JS layout → tanpa CLS.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Ikon from '@/components/ui/Ikon';

export const RUTE_NAV = [
  { href: '/dashboard', label: 'Situasi', ikon: 'kompas', k: 's', utama: true },
  { href: '/indikator', label: 'Indikator', ikon: 'daftar', k: 'i', utama: true },
  { href: '/antrean', label: 'Antrean', ikon: 'antrean', k: 'a', utama: true },
  { href: '/modul-indikator', label: 'Modul', ikon: 'modul', k: 'm', utama: true },
  { href: '/requirement', label: 'Draf Bukti', ikon: 'draf', k: 'd', utama: true },
  { href: '/asesor', label: 'Hasil asesor', ikon: 'cek', k: 'h' },
  { href: '/pemdi', label: 'Rinci per aspek', ikon: 'aspek', k: 'r' },
  { href: '/opd', label: 'Perangkat daerah', ikon: 'gedung', k: 'o' },
  { href: '/spbe', label: 'SPBE 2025', ikon: 'grafik', k: 'e' },
  { href: '/probis', label: 'Proses bisnis', ikon: 'probis', k: 'p' },
  { href: '/glosarium', label: 'Glosarium', ikon: 'buku', k: 'l' },
  { href: '/cari', label: 'Cari', ikon: 'cari', k: 'c' },
  { href: '/admin', label: 'Admin CMS', ikon: 'roda', k: 'x' },
];

const LS = 'pemdi:nav';
function bacaGaya() {
  try {
    const v = localStorage.getItem(LS);
    if (v === 'radial' || v === 'baris') return v;
  } catch { /* abaikan */ }
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 860px)').matches ? 'baris' : 'radial';
}

export default function NavMenu() {
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [gaya, setGaya] = useState('radial');
  const wadah = useRef(null);
  const pemicu = useRef(null);
  const sebelum = useRef(null);
  const gWaktu = useRef(0);

  useEffect(() => { setGaya(bacaGaya()); }, []);

  const fokusAktif = useCallback(() => {
    const el = wadah.current;
    if (!el) return;
    (el.querySelector('a[aria-current]') || el.querySelector('a'))?.focus();
  }, []);

  const tutup = useCallback(() => {
    setBuka(false);
    // kembalikan fokus ke pemicu (bukan elemen halaman sebelumnya) supaya pengguna papan ketik tahu posisinya
    setTimeout(() => pemicu.current?.focus?.(), 0);
  }, []);
  const bukaMenu = useCallback(() => { sebelum.current = document.activeElement; setBuka(true); }, []);

  const gantiGaya = useCallback((g) => {
    setGaya(g);
    try { localStorage.setItem(LS, g); } catch { /* abaikan */ }
    setTimeout(fokusAktif, 60);
  }, [fokusAktif]);

  // auto-hide saat pindah rute; kunci scroll saat terbuka; auto-focus
  useEffect(() => {
    const h = () => setBuka(false);
    router.events.on('routeChangeStart', h);
    return () => router.events.off('routeChangeStart', h);
  }, [router.events]);
  useEffect(() => {
    document.documentElement.toggleAttribute('data-nav-buka', buka);
    document.documentElement.setAttribute('data-nav', gaya);
    if (buka) { const t = setTimeout(fokusAktif, 90); return () => clearTimeout(t); }
    return undefined;
  }, [buka, gaya, fokusAktif]);

  // papan ketik: Esc, M, focus trap, panah, g+huruf
  useEffect(() => {
    const h = (e) => {
      const tag = e.target?.tagName;
      const diForm = /INPUT|TEXTAREA|SELECT/.test(tag) || e.target?.isContentEditable;
      if (e.key === 'Escape' && buka) { e.preventDefault(); tutup(); return; }
      if (!buka && !diForm && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'm' || e.key === 'M') { e.preventDefault(); bukaMenu(); return; }
        const now = Date.now();
        if (e.key === 'g') { gWaktu.current = now; return; }
        if (now - gWaktu.current < 900 && gWaktu.current) {
          const r = RUTE_NAV.find((x) => x.k === e.key);
          gWaktu.current = 0;
          if (r) { e.preventDefault(); router.push(r.href); }
          return;
        }
      }
      if (buka) {
        const f = Array.from(document.querySelectorAll('.rk-nav a, .rk-nav-gaya button, .rk-nav-trig'));
        const i = f.indexOf(document.activeElement);
        if (e.key === 'Tab') { e.preventDefault(); f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i >= f.length - 1 ? 0 : i + 1)]?.focus(); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); f[(i + 1) % f.length]?.focus(); }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); f[(i - 1 + f.length) % f.length]?.focus(); }
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [buka, tutup, bukaMenu, router]);

  const path = router.pathname;
  const aktif = (href) => (href === '/opd' ? path.startsWith('/opd') : path === href);

  return (
    <>
      <div className="rk-nav-scrim" onClick={tutup} aria-hidden="true" />
      <button
        type="button" ref={pemicu} className="rk-nav-trig"
        aria-haspopup="true" aria-expanded={buka} aria-controls="rk-nav"
        aria-label={buka ? 'Tutup menu navigasi (Esc)' : 'Buka menu navigasi (M)'}
        onClick={() => (buka ? tutup() : bukaMenu())}
      >
        <Ikon nama={buka ? 'tutup' : 'menu'} size={22} />
      </button>
      <div className="rk-nav-gaya" role="group" aria-label="Gaya menu">
        <button type="button" aria-pressed={gaya === 'radial'} onClick={() => gantiGaya('radial')}><Ikon nama="radial" size={14} /> Radial</button>
        <button type="button" aria-pressed={gaya === 'baris'} onClick={() => gantiGaya('baris')}><Ikon nama="baris" size={14} /> Baris</button>
      </div>
      <span className="rk-nav-hint" aria-hidden="true">Esc menutup · g+huruf pintasan</span>
      <ul className="rk-nav" id="rk-nav" ref={wadah} role="menu" aria-label="Navigasi halaman" aria-hidden={!buka}>
        {RUTE_NAV.map((r) => (
          <li key={r.href} role="none" className={r.utama ? undefined : 'lain'}>
            <Link role="menuitem" href={r.href} aria-current={aktif(r.href) ? 'page' : undefined} tabIndex={buka ? 0 : -1} data-k={r.k}>
              <span className="ic"><Ikon nama={r.ikon} size={18} /></span>
              <span className="lbl">{r.label}<kbd>g {r.k}</kbd></span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
