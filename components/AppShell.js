import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import LaporWidget from './LaporWidget';
import RatingWidget from './RatingWidget';
import Footer from './Footer';

/* ── Constants ── */
const SIDEBAR_W = 262;
const MOBILE_BP = 900;
const CONTENT_MAX_W = 1180;

/* ── Breadcrumb label map ── */
const breadcrumbLabels = {
  '/': 'Beranda',
  '/layanan': 'Layanan Publik',
  '/opd': 'Perangkat Daerah',
  '/spbe': 'Indeks SPBE',
  '/pemdi': 'Indeks Pemdi',
  '/probis': 'Peta Proses Bisnis',
  '/roadmap': 'Roadmap',
  '/lapor': 'Lapor / Saran',
  '/skm': 'Survei Kepuasan',
  '/faq': 'Tanya & FAQ',
  '/glosarium': 'Glosarium',
  '/cari': 'Cari',
  '/tanya': 'Tanya',
  '/kebijakan-privasi': 'Kebijakan Privasi',
  '/admin': 'Admin',
  '/requirement': 'Requirements',
};

/* ── Generate breadcrumb trail from pathname ── */
function getBreadcrumbs(pathname) {
  if (!pathname || pathname === '/') {
    return [{ href: '/', label: 'Beranda' }];
  }

  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ href: '/', label: 'Beranda' }];
  let accumulated = '';

  segments.forEach((seg, idx) => {
    accumulated += `/${seg}`;
    /* Try direct label first */
    let label = breadcrumbLabels[accumulated];

    /* Fallback: format segment as title */
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

/* ── Styles ── */
const styles = {
  /* Outer wrapper — gov strip + body */
  outer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    paddingTop: 'var(--gov-strip-h, 36px)',
    background: 'var(--bg)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
  },
  /* Main wrapper — sidebar + content row */
  shell: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    transition: 'background 0.3s ease, color 0.3s ease',
  },
  /* Sidebar column */
  sidebarCol: {
    flexShrink: 0,
    width: SIDEBAR_W,
  },
  /* Right column: topbar + content */
  rightCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  /* Topbar */
  topbar: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 26px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--line)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    minHeight: 52,
    transition: 'background 0.3s ease',
  },
  /* Hamburger (mobile only) */
  hamburger: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.3rem',
    padding: '4px 6px',
    borderRadius: 'var(--radius-sm, 4px)',
    color: 'var(--ink)',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s ease',
  },
  /* Breadcrumbs */
  breadcrumbList: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  crumbItem: {
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },
  crumbLink: {
    color: 'var(--primary)',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  crumbCurrent: {
    color: 'var(--ink)',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 240,
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  separator: {
    color: 'var(--line)',
    fontSize: '0.7rem',
    margin: '0 2px',
    userSelect: 'none',
  },
  /* Actions in topbar */
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  laporLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 14px',
    borderRadius: 'var(--radius, 8px)',
    background: 'var(--primary)',
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    transition: 'background 0.15s ease, opacity 0.15s ease',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  /* Content area */
  content: {
    flex: 1,
    maxWidth: CONTENT_MAX_W,
    width: '100%',
    margin: '0 auto',
    padding: '26px 26px 48px',
    transition: 'padding 0.2s ease',
  },
  /* Empty sidebar block on mobile */
  sidebarSpacer: {
    width: 0,
  },
};

/* ── AppShell Component ── */
export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = router.pathname;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showLapor, setShowLapor] = useState(false);

  /* Hydration-safe responsive detection */
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BP}px)`);
    setIsMobile(mq.matches);
    setHydrated(true);

    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Close sidebar on route change (mobile) */
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  /* Global event: buka modal Lapor dari kartu beranda / CTA */
  useEffect(() => {
    const openLapor = () => setShowLapor(true);
    window.addEventListener('pemdi:open-lapor', openLapor);
    return () => window.removeEventListener('pemdi:open-lapor', openLapor);
  }, []);

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div style={styles.outer}>
      <div className="gov-strip" role="banner">
        <span className="gov-strip-flag" aria-hidden="true">🇮🇩</span>
        Situs Resmi Pemerintah Kabupaten Aceh Tengah
      </div>
    <div style={styles.shell}>
      {/* Sidebar — fixed via the component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Spacer column on desktop to offset fixed sidebar */}
      {hydrated && !isMobile && (
        <div style={styles.sidebarCol} aria-hidden="true" />
      )}

      {/* Right column */}
      <div style={styles.rightCol}>
        {/* Topbar */}
        <header style={styles.topbar}>
          {/* Hamburger (mobile only) */}
          {hydrated && isMobile && (
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'Tutup menu' : 'Buka menu'}
              style={styles.hamburger}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              {sidebarOpen ? '✕' : '☰'}
            </button>
          )}

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol style={styles.breadcrumbList}>
              {breadcrumbs.map((crumb, idx) => (
                <li key={crumb.href} style={styles.crumbItem}>
                  {idx > 0 && (
                    <span style={styles.separator} aria-hidden="true">
                      /
                    </span>
                  )}
                  {crumb.isLast ? (
                    <span style={styles.crumbCurrent} title={crumb.label}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      style={styles.crumbLink}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Actions */}
          <div style={styles.actions}>
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setShowLapor(true)}
              aria-label="Buka formulir Lapor / Saran"
              style={styles.laporLink}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <span>📢</span>
              <span>Lapor</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main
          id="main-content"
          style={{
            ...styles.content,
            paddingLeft: hydrated && !isMobile ? 26 : 26,
            paddingRight: 26,
          }}
        >
          {children}
          <Footer />
        </main>

        <Footer />

        {/* Rating Widget — floating di pojok kanan bawah */}
        <RatingWidget />

      </div>

      <ScrollTop />

      {/* LaporWidget modal — dikontrol dari topbar */}
      <LaporWidget
        externalOpen={showLapor}
        hideFab
        onExternalClose={() => setShowLapor(false)}
      />
    </div>
    </div>
  );
}
