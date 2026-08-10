import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import LaporWidget from './LaporWidget';
import RatingWidget from './RatingWidget';
import { MotifEmun, MotifUlen, KerawangDivider } from './motif/KerawangMotifs';

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
  // Navigasi utama tetap terlihat di desktop agar halaman dan layanan mudah ditemukan.
  // Pengguna masih dapat meringkasnya lewat tombol di topbar.
  const [sidebarHidden, setSidebarHidden] = useState(false);
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

  /* ── Scroll reveal global: [data-reveal] & [data-reveal-stagger] ──
     IntersectionObserver — 60fps (transform/opacity), hormati prefers-reduced-motion */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  const breadcrumbs = getBreadcrumbs(pathname);

  /* ── Marquee teks ── */
  const marqueeText = 'Portal Resmi Pemerintah Kabupaten Aceh Tengah — Menuju Pemerintah Digital (Pemdi)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: 'calc(var(--gov-strip-h) + env(safe-area-inset-top))' }}>
      {/* Official Government Strip — Marquee Running Text + Motif Ulen */}
      <div className="gov-strip" role="banner">
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

          {/* Main Content Area — page transition fade-up via key remount */}
          <main id="main-content" className="content" key={pathname} style={{ flex: 1 }}>
            <div style={{ animation: 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
              {children}
            </div>
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
