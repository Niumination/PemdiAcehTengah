import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import LaporWidget from './LaporWidget';
import RatingWidget from './RatingWidget';
import BottomNav from './BottomNav';
import PersonaSwitcher from './persona/PersonaSwitcher';
import { MotifUlen } from './motif/KerawangMotifs';

const breadcrumbLabels = {
  '/': 'Beranda Portal',
  '/layanan': 'Direktori Layanan Publik',
  '/opd': '52 Perangkat Daerah',
  '/spbe': 'Evaluasi Indeks SPBE 2025',
  '/pemdi': 'Indeks Pemdi (PermenPANRB 8/2026)',
  '/probis': 'Peta Proses Bisnis (PPB Level 0-2)',
  '/lapor': 'Lapor & Pengaduan Warga',
  '/skm': 'Survei Kepuasan Masyarakat',
  '/dashboard-kepuasan': 'Dashboard Kepuasan Publik',
  '/faq': 'FAQ & Asisten Virtual',
  '/glosarium': 'Kamus Glosarium Digital',
  '/cari': 'Konsol Pencarian Portal',
  '/requirement': 'Requirements Inventaris Data',
  '/admin': 'Panel Admin Pengelola',
  '/bantuan': 'Pusat Bantuan',
  '/kebijakan-privasi': 'Kebijakan Privasi',
  '/modul-indikator': 'Modul Indikator Pemdi',
};

function getBreadcrumbs(pathname) {
  if (!pathname || pathname === '/') {
    return [{ href: '/', label: 'Beranda' }];
  }

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ href: '/', label: 'Beranda' }];
  let accumulated = '';

  segments.forEach((seg, idx) => {
    accumulated += `/${seg}`;
    let label = breadcrumbLabels[accumulated];

    if (!label) {
      label = seg
        .replace(/[-_]/g, ' ')
        .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    }

    const isLast = idx === segments.length - 1;
    crumbs.push({ href: accumulated, label, isLast });
  });

  return crumbs;
}

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = router.pathname;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Sidebar disembunyikan secara default (permintaan pemilik 21 Sep 2026) —
  // konten memakai seluruh lebar; pengguna membuka navigasi lewat tombol topbar.
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showLapor, setShowLapor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setIsMobile(mq.matches);
    setHydrated(true);

    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  useEffect(() => {
    const openLapor = () => setShowLapor(true);
    window.addEventListener('pemdi:open-lapor', openLapor);
    return () => window.removeEventListener('pemdi:open-lapor', openLapor);
  }, []);

  // Shortcut yang sudah dikomunikasikan pada sidebar: ⌘/Ctrl + K menuju pencarian global.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        router.push('/cari');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Stabil: identity tidak berubah antar render → Sidebar effect tidak memicu close-loop
  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  const breadcrumbs = getBreadcrumbs(pathname);

  /* ── Running text pita atas (informasi resmi, bukan dekorasi) — bukan 'Portal Resmi' (prasyarat K7 REPOSISI-PEMDI.md) ── */
  const marqueeText = 'Kokpit Pemdi Kabupaten Aceh Tengah — Perangkat kerja Tim Asesor Internal · Evaluasi Kinerja Pemerintah Digital (PermenPANRB 8/2026)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: 'calc(var(--gov-strip-h) + env(safe-area-inset-top))' }}>
      {/* Official Government Strip — Marquee Running Text + Motif Ulen */}
      <div className="gov-strip" aria-label="Informasi portal">
        <span className="gov-strip-flag" aria-hidden="true">🇮🇩</span>
        <MotifUlen size={18} style={{ marginLeft: 8 }} />
        <div className="gov-strip-marquee">
          <div className="gov-strip-marquee-track" aria-label={marqueeText}>
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>
        <MotifUlen size={18} />
        <span className="gov-strip-flag" aria-hidden="true">🇮🇩</span>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          collapsed={sidebarHidden}
        />

        {/* Spacer on Desktop */}
        <div className={`sb-spacer ${sidebarHidden ? 'hidden' : ''}`} aria-hidden="true" />

        {/* Right Content Space */}
        <div className="main">
          {/* Topbar sticky header */}
          <header className="topbar">
            {/* Sidebar toggle (desktop) + hamburger (mobile) */}
            {hydrated && isMobile && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label={sidebarOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={sidebarOpen}
                aria-controls="sidebar-nav"
              >
                {sidebarOpen ? '✕' : '☰ Menu'}
              </button>
            )}
            {hydrated && !isMobile && (
              <button
                type="button"
                className="sb-toggle-btn"
                onClick={() => setSidebarHidden((prev) => !prev)}
                aria-label={sidebarHidden ? 'Tampilkan navigasi' : 'Sembunyikan navigasi'}
                title={sidebarHidden ? 'Tampilkan navigasi' : 'Sembunyikan navigasi'}
                aria-expanded={!sidebarHidden}
                aria-controls="sidebar-nav"
              >
                {sidebarHidden ? '☰' : '✕'}
              </button>
            )}
            {/* Brand ringkas — sidebar tertutup secara default, identitas tetap terlihat */}
            <Link href="/" className="topbar-brand" aria-label="Beranda Pemdi Aceh Tengah">
              <span className="topbar-brand-crest" aria-hidden="true">
                <Image src="/crest-pemdi.svg" alt="" width={26} height={26} />
              </span>
              <span className="topbar-brand-text">Pemdi <b>Aceh Tengah</b></span>
            </Link>

            {/* Breadcrumb Navigation Trail */}
            <nav aria-label="Breadcrumb" style={{ flex: 1, minWidth: 0 }}>
              <ol style={{ display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none', margin: 0, padding: 0 }}>
                {breadcrumbs.map((crumb, idx) => (
                  <li key={crumb.href} style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                    {idx > 0 && <span style={{ color: 'var(--muted)', margin: '0 4px', fontSize: '0.7rem' }}>/</span>}
                    {crumb.isLast ? (
                      <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{crumb.label}</span>
                    ) : (
                      <Link href={crumb.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Persona switcher (Phase 1) — di header, tampil di semua halaman selain beranda (beranda punya versi besar) */}
            {pathname !== '/' && <div className="topbar-persona"><PersonaSwitcher compact /></div>}

            {/* Actions Bar — aksi utama tersedia dari semua halaman */}
            <div className="topbar-actions">
              <Link href="/cari" className="btn btn-secondary btn-sm topbar-search" aria-label="Cari informasi di portal">
                <span aria-hidden="true">⌕</span>
                <span className="topbar-search-label">Cari</span>
              </Link>
              <ThemeToggle />

              <button
                type="button"
                className="btn btn-primary btn-sm topbar-lapor"
                onClick={() => setShowLapor(true)}
                aria-label="Buka formulir pengaduan Lapor"
              >
                <span aria-hidden="true">📢</span>
                <span className="topbar-lapor-label">Lapor Warga</span>
              </button>
            </div>
          </header>

          {/* Accessible Skip Link */}
          <a href="#main-content" className="skip-link">Lompat ke konten utama</a>

          {/* Main Content Area */}
          <main id="main-content" className="content" style={{ flex: 1 }}>
            {children}
          </main>

          <Footer />

          {/* Floating Citizen Rating Widget */}
          <RatingWidget />
        </div>

        <ScrollTop />

        {/* Bottom Nav Bar — hanya ponsel (Phase 4) */}
        {hydrated && isMobile && <BottomNav onOpenMenu={() => setSidebarOpen(true)} />}

        {/* Lapor Modal — tetap sebagai pop-up (sesuai Task 3) */}
        <LaporWidget
          externalOpen={showLapor}
          hideFab
          onExternalClose={() => setShowLapor(false)}
        />
      </div>
    </div>
  );
}
