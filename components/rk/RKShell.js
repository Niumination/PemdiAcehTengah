/**
 * components/rk/RKShell.js — Kerangka Dashboard "Ruang Kendali" (Patch 1, 22 Sep 2026)
 *
 * Dipakai untuk rute baru (/dashboard, /indikator, /antrean). Rute lama masih
 * memakai AppShell sampai Patch 2. Menyediakan:
 *   - pita marquee (dipertahankan sesuai keputusan pemilik)
 *   - bar kendali: brand, tab, persona Koordinator/PJ (+ pilih OPD), Ctrl+K, tema
 *   - konteks `useRK()` → { persona, opd, setPersona, setOpd, bukaButir, bukaIndikator, bukaPalet }
 *   - drawer indikator/butir + palet perintah, dirender sekali di sini
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Ikon from '@/components/ui/Ikon';
import Drawer from './Drawer';
import Palet from './Palet';

const RKContext = createContext(null);
export const useRK = () => useContext(RKContext);

export const TAB_RK = [
  { href: '/dashboard', label: 'Situasi', ikon: 'kompas' },
  { href: '/indikator', label: 'Indikator', ikon: 'daftar' },
  { href: '/antrean', label: 'Antrean', ikon: 'antrean' },
  { href: '/modul-indikator', label: 'Modul', ikon: 'modul' },
  { href: '/requirement', label: 'Draf Bukti', ikon: 'draf' },
];
const TAB_LAIN = [
  { href: '/pemdi', label: 'Rinci per aspek' },
  { href: '/opd', label: 'Perangkat daerah' },
  { href: '/spbe', label: 'SPBE 2025' },
  { href: '/probis', label: 'Proses bisnis' },
  { href: '/glosarium', label: 'Glosarium' },
  { href: '/cari', label: 'Cari' },
];

const MARQUEE =
  'Dashboard Pemerintah Digital Kabupaten Aceh Tengah — Ruang kendali evaluasi 2026 · Interviu asesor 21–30 September · Visitasi 1–30 Oktober · Perangkat kerja Tim Koordinasi Pemdi & penanggung jawab OPD (PermenPANRB 8/2026)';

function bacaLS(k, d) {
  try { return localStorage.getItem(k) ?? d; } catch { return d; }
}
function tulisLS(k, v) {
  try { localStorage.setItem(k, v); } catch { /* abaikan */ }
}

/**
 * props.data — { indikator[], antrean[], opdPJ[] } dari getStaticProps halaman;
 * disimpan di konteks agar drawer & palet bisa dipakai dari halaman mana pun.
 */
export default function RKShell({ children, data: dataProp, legacy = false }) {
  const [dataLazy, setDataLazy] = useState(null);
  const data = dataProp || dataLazy;
  const router = useRouter();
  const [persona, setPersonaState] = useState('koordinator');
  const [opdId, setOpdIdState] = useState('');
  const [tema, setTema] = useState('light');
  const [hidrasi, setHidrasi] = useState(false);
  const [drawer, setDrawer] = useState(null); // { indikatorId, butirId }
  const [palet, setPalet] = useState(false);

  // Halaman lama tidak membawa props rk → muat ringkasan statis (dibangun saat build) untuk drawer & palet
  useEffect(() => {
    if (dataProp || dataLazy) return;
    let batal = false;
    fetch('/api/rk-data').then((r) => (r.ok ? r.json() : null)).then((d) => { if (!batal && d) setDataLazy(d); }).catch(() => {});
    return () => { batal = true; };
  }, [dataProp, dataLazy]);

  useEffect(() => {
    setPersonaState(bacaLS('pemdi:persona', 'koordinator'));
    setOpdIdState(bacaLS('pemdi:pj', ''));
    setTema(document.documentElement.getAttribute('data-theme') || 'light');
    setHidrasi(true);
  }, []);

  // Buka drawer dari URL ?butir= / ?indikator=
  useEffect(() => {
    if (!router.isReady) return;
    const { butir, indikator } = router.query;
    if (butir || indikator) {
      const b = data?.antrean?.find((x) => x.id === butir) || null;
      setDrawer({ indikatorId: indikator || b?.indikatorId || null, butirId: butir || null });
    }
  }, [router.isReady, router.query, data]);

  const setPersona = useCallback((p) => { setPersonaState(p); tulisLS('pemdi:persona', p); }, []);
  const setOpd = useCallback((id) => { setOpdIdState(id); tulisLS('pemdi:pj', id); }, []);
  const gantiTema = useCallback(() => {
    const t = tema === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    tulisLS('theme', t);
    setTema(t);
  }, [tema]);

  const bukaIndikator = useCallback((indikatorId) => setDrawer({ indikatorId, butirId: null }), []);
  const bukaButir = useCallback((butirId, indikatorId) => setDrawer({ indikatorId, butirId }), []);
  const tutupDrawer = useCallback(() => {
    setDrawer(null);
    if (router.query.butir || router.query.indikator) {
      const q = { ...router.query }; delete q.butir; delete q.indikator;
      router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true, scroll: false });
    }
  }, [router]);

  // Ctrl+K / Cmd+K
  useEffect(() => {
    const h = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalet((v) => !v); }
      if (e.key === 'Escape') { setPalet(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const opdAktif = useMemo(
    () => (persona === 'pj' && opdId ? (data?.opdPJ || []).find((o) => String(o.id) === String(opdId)) || null : null),
    [persona, opdId, data],
  );

  const ctx = useMemo(
    () => ({ persona, opd: opdAktif, opdId, setPersona, setOpd, bukaButir, bukaIndikator, bukaPalet: () => setPalet(true), data, hidrasi }),
    [persona, opdAktif, opdId, setPersona, setOpd, bukaButir, bukaIndikator, data, hidrasi],
  );

  const path = router.pathname;
  return (
    <RKContext.Provider value={ctx}>
      <div className="rk">
        <div className="rk-strip" aria-label="Informasi">
          <span aria-hidden="true">🇮🇩</span>
          <div className="rk-track" aria-label={MARQUEE}><span>{MARQUEE}</span><span aria-hidden="true">{MARQUEE}</span></div>
        </div>

        <header className="rk-bar">
          <Link href="/dashboard" className="rk-brand" aria-label="Dashboard Pemerintah Digital — beranda">
            <Image src="/crest-pemdi.svg" alt="" width={30} height={30} />
            <span><b>Dashboard Pemerintah Digital</b><small>Kabupaten Aceh Tengah · Evaluasi Pemdi 2026</small></span>
          </Link>
          <nav className="rk-tabs" aria-label="Halaman">
            {TAB_RK.map((t) => (
              <Link key={t.href} href={t.href} aria-current={path === t.href ? 'page' : undefined}>{t.label}</Link>
            ))}
            <details className="rk-lain">
              <summary className="rk-kbtn" style={{ height: 34, border: 0, background: 'transparent', listStyle: 'none' }}>Lainnya ▾</summary>
              <ul>
                {TAB_LAIN.map((t) => <li key={t.href}><Link href={t.href}>{t.label}</Link></li>)}
              </ul>
            </details>
          </nav>
          <div className="rk-actions">
            <div className="rk-seg" role="group" aria-label="Persona">
              <button type="button" aria-pressed={persona === 'koordinator'} onClick={() => setPersona('koordinator')}>Koordinator</button>
              <button type="button" aria-pressed={persona === 'pj'} onClick={() => setPersona('pj')}>PJ OPD</button>
            </div>
            {persona === 'pj' ? (
              <select className="rk-select" aria-label="Pilih perangkat daerah" value={opdId} onChange={(e) => setOpd(e.target.value)}>
                <option value="">Semua OPD</option>
                {(data?.opdPJ || []).map((o) => <option key={o.id} value={o.id}>{o.singkat} ({o.total})</option>)}
              </select>
            ) : null}
            <button type="button" className="rk-kbtn" onClick={() => setPalet(true)} aria-label="Cari / perintah (Ctrl+K)">
              <Ikon nama="cari" /> <span className="rk-kbtn-lbl">Cari</span> <kbd>Ctrl K</kbd>
            </button>
            <button type="button" className="rk-kbtn" onClick={gantiTema} aria-label={tema === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'} suppressHydrationWarning>
              <Ikon nama="tema" />
            </button>
          </div>
        </header>

        <main id="main-content" className={`rk-main${legacy ? ' rk-main-legacy' : ''}`}>{children}</main>

        <footer className="rk-foot">
          <span>© {new Date().getFullYear()} Pemerintah Kabupaten Aceh Tengah · Diskominfo · Tim Koordinasi Pemdi</span>
          <span>Simulasi penilaian mandiri — bukan nilai resmi asesor · Data: eval.spbe.go.id (sinkron 20 Sep 2026)</span>
        </footer>

        <nav className="rk-btab" aria-label="Halaman (ponsel)">
          {TAB_RK.map((t) => (
            <Link key={t.href} href={t.href} aria-current={path === t.href ? 'page' : undefined}>
              <Ikon nama={t.ikon} size={20} />{t.label}
            </Link>
          ))}
        </nav>

        <Drawer state={drawer} onClose={tutupDrawer} data={data} />
        {palet ? <Palet onClose={() => setPalet(false)} data={data} /> : null}
      </div>
    </RKContext.Provider>
  );
}
