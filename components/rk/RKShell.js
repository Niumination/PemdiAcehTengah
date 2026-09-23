/**
 * components/rk/RKShell.js — Kerangka Dashboard "Ruang Kendali" (Patch 1, 22 Sep 2026)
 *
 * Dipakai untuk rute baru (/dashboard, /indikator, /antrean). Rute lama masih
 * memakai AppShell sampai Patch 2. Menyediakan:
 *   - pita marquee di bawah bar kendali (dipertahankan sesuai keputusan pemilik; Patch 8: dipindah ke bawah header, tanpa emoji bendera)
 *   - baris konteks PJ OPD (Patch 8: pemilih OPD keluar dari bar agar tab tidak tergencet)
 *   - toggle lebar halaman penuh/1800/1440 (Patch 8; atribut html[data-lebar], default penuh)
 *   - bar kendali: brand, persona Koordinator/PJ, Ctrl+K, lebar, tema (tab dihapus Patch 9 → NavMenu radial/baris)
 *   - konteks `useRK()` → { persona, opd, setPersona, setOpd, bukaButir, bukaIndikator, bukaPalet }
 *   - drawer indikator/butir + palet perintah, dirender sekali di sini
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Ikon from '@/components/ui/Ikon';
import Drawer from './Drawer';
import Palet from './Palet';
import NavMenu from './NavMenu';

const RKContext = createContext(null);
export const useRK = () => useContext(RKContext);

// Daftar rute navigasi kini di components/rk/NavMenu.js (RUTE_NAV) — Patch 9

const LABEL_LEBAR = { penuh: 'Penuh', 1800: '1800', 1440: '1440' };
const URUTAN_LEBAR = ['penuh', '1800', '1440'];

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
  const [lebar, setLebar] = useState('penuh'); // Patch 8: penuh | 1800 | 1440 (default penuh — keputusan pemilik)
  const lainRef = useRef(null);

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
    setLebar(document.documentElement.getAttribute('data-lebar') || 'penuh');
    setHidrasi(true);
  }, []);

  // Patch 8: menu "Lainnya" (<details>) menutup saat pindah rute, klik di luar, atau Esc
  useEffect(() => {
    const tutup = () => { if (lainRef.current?.open) lainRef.current.open = false; };
    const klik = (e) => { if (lainRef.current?.open && !lainRef.current.contains(e.target)) tutup(); };
    const esc = (e) => { if (e.key === 'Escape') tutup(); };
    router.events.on('routeChangeStart', tutup);
    document.addEventListener('pointerdown', klik);
    document.addEventListener('keydown', esc);
    return () => { router.events.off('routeChangeStart', tutup); document.removeEventListener('pointerdown', klik); document.removeEventListener('keydown', esc); };
  }, [router.events]);

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

  const gantiLebar = useCallback(() => {
    const n = URUTAN_LEBAR[(URUTAN_LEBAR.indexOf(lebar) + 1) % URUTAN_LEBAR.length];
    document.documentElement.setAttribute('data-lebar', n);
    tulisLS('pemdi:lebar', n);
    setLebar(n);
  }, [lebar]);

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
  const teksMarquee = data?.konten?.marquee || MARQUEE;
  return (
    <RKContext.Provider value={ctx}>
      <div className="rk">
        <header className="rk-bar">
          <Link href="/dashboard" className="rk-brand" aria-label="Dashboard Pemerintah Digital — beranda">
            <Image src="/crest-pemdi.svg" alt="" width={30} height={30} />
            <span><b>Dashboard Pemerintah Digital</b><small>Kabupaten Aceh Tengah · Evaluasi Pemdi 2026</small></span>
          </Link>
          <div className="rk-actions">
            <div className="rk-seg" role="group" aria-label="Persona">
              <button type="button" aria-pressed={persona === 'koordinator'} onClick={() => setPersona('koordinator')}>Koordinator</button>
              <button type="button" aria-pressed={persona === 'pj'} onClick={() => setPersona('pj')}>PJ OPD</button>
            </div>
            <button type="button" className="rk-kbtn" onClick={() => setPalet(true)} aria-label="Cari / perintah (Ctrl+K)">
              <Ikon nama="cari" /> <span className="rk-kbtn-lbl">Cari</span> <kbd>Ctrl K</kbd>
            </button>
            <button type="button" className="rk-kbtn rk-kbtn-lebar" onClick={gantiLebar} aria-label={`Lebar halaman: ${LABEL_LEBAR[lebar]} — klik untuk mengubah`} title={`Lebar halaman: ${LABEL_LEBAR[lebar]}`} suppressHydrationWarning>
              <Ikon nama="lebar" /><span className="rk-kbtn-lbl">{LABEL_LEBAR[lebar]}</span>
            </button>
            <button type="button" className="rk-kbtn" onClick={gantiTema} aria-label={tema === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'} suppressHydrationWarning>
              <Ikon nama="tema" />
            </button>
          </div>
        </header>

        <div className="rk-strip" aria-label="Informasi">
          <span className="rk-strip-lbl">Info</span>
          <div className="rk-track" aria-label={teksMarquee}><span>{teksMarquee}</span><span aria-hidden="true">{teksMarquee}</span></div>
        </div>

        {persona === 'pj' ? (
          <div className="rk-konteks" role="region" aria-label="Konteks penanggung jawab">
            <span className="rk-konteks-lbl"><Ikon nama="gedung" size={14} /> Mode PJ OPD</span>
            <select className="rk-select" aria-label="Pilih perangkat daerah" value={opdId} onChange={(e) => setOpd(e.target.value)}>
              <option value="">Semua OPD</option>
              {(data?.opdPJ || []).map((o) => <option key={o.id} value={o.id}>{o.singkat} ({o.total})</option>)}
            </select>
            {opdAktif ? <span className="rk-konteks-nama">{opdAktif.nama} · {opdAktif.total} butir</span> : <span className="rk-konteks-nama faint">Pilih OPD untuk menyaring antrean &amp; indikator</span>}
          </div>
        ) : null}

        <main id="main-content" className={`rk-main${legacy ? ' rk-main-legacy' : ''}`}>{children}</main>

        <footer className="rk-foot">
          <span>© {new Date().getFullYear()} Pemerintah Kabupaten Aceh Tengah · Diskominfo · Tim Koordinasi Pemdi</span>
          <span>Simulasi penilaian mandiri — bukan nilai resmi asesor · Data: eval.spbe.go.id (sinkron 20 Sep 2026)</span>
        </footer>

        <NavMenu />
        <Drawer state={drawer} onClose={tutupDrawer} data={data} />
        {palet ? <Palet onClose={() => setPalet(false)} data={data} /> : null}
      </div>
    </RKContext.Provider>
  );
}
