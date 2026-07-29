import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import LaporWidget from './LaporWidget';
import RatingWidget from './RatingWidget';

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
  const [sidebarHidden, setSidebarHidden] = useState(true); // desktop hide/show — default hidden
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

  const breadcrumbs = getBreadcrumbs(pathname);

  /* ── Marquee teks ── */
  const marqueeText = 'Portal Resmi Pemerintah Kabupaten Aceh Tengah — Menuju Pemerintah Digital (Pemdi)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: 'var(--gov-strip-h)' }}>
      {/* Official Government Strip — Marquee Running Text */}
      <div className="gov-strip" role="banner">
        <span className="gov-strip-flag" aria-hidden="true">🇮🇩</span>
        <div className="gov-strip-marquee">
          <div className="gov-strip-marquee-track" aria-label={marqueeText}>
            <span>{marqueeText}</span>
            <span>{marqueeText}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={hydrated && !isMobile && sidebarHidden}
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
              >
                {sidebarOpen ? '✕' : '☰ Menu'}
              </button>
            )}
            {hydrated && !isMobile && (
              <button
                type="button"
                className="sb-toggle-btn"
                onClick={() => setSidebarHidden((prev) => !prev)}
                aria-label={sidebarHidden ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
                title={sidebarHidden ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'}
              >
                {sidebarHidden ? '☰' : '✕'}
              </button>
            )}

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

            {/* Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ThemeToggle />

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowLapor(true)}
                aria-label="Buka formulir pengaduan Lapor"
              >
                <span>📢</span>
                <span>Lapor Warga</span>
              </button>
            </div>
          </header>

          {/* Accessible Skip Link */}
          <a href="#main-content" className="skip-link">Lompat ke konten utama</a>

          {/* Main Content Area */}
          <main id="main-content" className="content">
            {children}
          </main>

          <Footer />

          {/* Floating Citizen Rating Widget */}
          <RatingWidget />
        </div>

        <ScrollTop />

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
