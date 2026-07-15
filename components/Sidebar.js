import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LaporWidget from './LaporWidget';

/* ── Data Menu ── */
const menuGroups = [
  {
    label: 'Utama',
    items: [
      { label: 'Beranda', href: '/', icon: '🏠' },
      { label: 'Layanan Publik', href: '/layanan', icon: '📋' },
      { label: 'Perangkat Daerah', href: '/opd', icon: '🏛️' },
    ],
  },
  {
    label: 'Transparansi',
    items: [
      { label: 'Indeks SPBE', href: '/spbe', icon: '📊' },
      { label: 'Indeks Pemdi', href: '/pemdi', icon: '📈' },
      { label: 'Peta Proses Bisnis', href: '/probis', icon: '🗺️' },
      { label: 'Roadmap', href: '/#roadmap', icon: '🛤️' },
    ],
  },
  {
    label: 'Partisipasi',
    items: [
      { label: 'Lapor / Saran', href: '#', icon: '📢', isModal: true },
      { label: 'Survei Kepuasan', href: '/skm', icon: '📝' },
      { label: 'Tanya & FAQ', href: '/faq', icon: '💬' },
      { label: 'Pusat Bantuan', href: '/bantuan', icon: '🆘' },
      { label: 'Glosarium', href: '/glosarium', icon: '📖' },
    ],
  },
  {
    label: 'Lainnya',
    items: [
      { label: 'Kebijakan Privasi', href: '/kebijakan-privasi', icon: '🔒' },
    ],
  },
];

/* ── Constants ── */
const SIDEBAR_W = 262;
const MOBILE_BP = 900;

/* ── Styles ── */
const styles = {
  scrim: {
    position: 'fixed',
    inset: 0,
    zIndex: 998,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.25s ease, visibility 0.25s ease',
  },
  scrimOpen: {
    opacity: 1,
    visibility: 'visible',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_W,
    zIndex: 999,
    background: 'var(--surface)',
    borderRight: '1px solid var(--line)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
  },
  inner: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--line) transparent',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '18px 18px 14px',
    borderBottom: '1px solid var(--line)',
    textDecoration: 'none',
  },
  crest: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  brandTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--primary)',
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '0.65rem',
    color: 'var(--ink)',
    opacity: 0.6,
    fontWeight: 400,
  },
  searchBox: {
    margin: '12px 14px',
    padding: '8px 12px',
    borderRadius: 'var(--radius, 8px)',
    border: '1px solid var(--line)',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'default',
    userSelect: 'none',
    fontSize: '0.82rem',
    color: 'var(--ink)',
    opacity: 0.7,
  },
  searchIcon: {
    fontSize: '0.85rem',
    opacity: 0.5,
  },
  menu: {
    padding: '6px 0',
    flex: 1,
  },
  groupLabel: {
    padding: '10px 18px 4px',
    fontSize: '0.6rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--ink)',
    opacity: 0.4,
  },
  itemLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 18px',
    margin: '1px 10px',
    borderRadius: 'var(--radius-sm, 4px)',
    fontSize: '0.85rem',
    fontWeight: 450,
    color: 'var(--ink)',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease',
    position: 'relative',
  },
  itemHover: {
    background: 'var(--surface-hover)',
  },
  itemActive: {
    background: 'var(--primary-50)',
    color: 'var(--primary)',
    fontWeight: 600,
    borderLeft: '3px solid var(--primary)',
    borderRadius: '0 var(--radius-sm, 4px) var(--radius-sm, 4px) 0',
    marginLeft: 10,
    paddingLeft: 15,
  },
  itemIcon: {
    fontSize: '1rem',
    width: 20,
    textAlign: 'center',
    flexShrink: 0,
  },
  itemLabel: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    padding: '10px 18px',
    borderTop: '1px solid var(--line)',
    fontSize: '0.65rem',
    color: 'var(--ink)',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 1.4,
    flexShrink: 0,
  },
};

/* ── Menu Item ── */
function MenuItem({ item, isActive, onModalClick }) {
  const [hover, setHover] = useState(false);

  if (item.isModal) {
    return (
      <a
        href="#"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          onModalClick?.();
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          ...styles.itemLink,
          cursor: 'pointer',
          ...(hover ? styles.itemHover : {}),
        }}
      >
        <span style={styles.itemIcon}>{item.icon}</span>
        <span style={styles.itemLabel}>{item.label}</span>
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={isActive ? 'page' : undefined}
      style={{
        ...styles.itemLink,
        ...(isActive ? styles.itemActive : {}),
        ...(!isActive && hover ? styles.itemHover : {}),
      }}
    >
      <span style={styles.itemIcon}>{item.icon}</span>
      <span style={styles.itemLabel}>{item.label}</span>
    </Link>
  );
}

/* ── Sidebar Component ── */
export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = router.pathname;

  /* Hydration-safe: detect desktop on client */
  const [isDesktop, setIsDesktop] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showLapor, setShowLapor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MOBILE_BP + 1}px)`);
    setIsDesktop(mq.matches);
    setHydrated(true);

    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Close drawer on route change (mobile) */
  useEffect(() => {
    if (!isDesktop) onClose?.();
  }, [pathname, isDesktop, onClose]);

  /* Determine if a menu item is active */
  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const showAsDrawer = hydrated && !isDesktop;
  const drawerOpen = showAsDrawer && isOpen;

  return (
    <>
      {/* Scrim (mobile drawer only) */}
      {showAsDrawer && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            ...styles.scrim,
            ...(isOpen ? styles.scrimOpen : {}),
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        role="navigation"
        aria-label="Navigasi utama"
        style={{
          ...styles.sidebar,
          transform:
            showAsDrawer
              ? isOpen
                ? 'translateX(0)'
                : 'translateX(-100%)'
              : 'translateX(0)',
        }}
      >
        <div style={styles.inner}>
          {/* Brand */}
          <Link href="/" style={styles.brand} aria-label="Beranda Pemdi Aceh Tengah">
            <Image
              src="/crest-pemdi.svg"
              alt="Lambang Aceh Tengah"
              width={36}
              height={36}
              style={styles.crest}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={styles.brandText}>
              <span style={styles.brandTitle}>Pemdi Aceh Tengah</span>
              <span style={styles.brandSub}>Pemerintah Digital</span>
            </div>
          </Link>

          {/* Search box (static — navigasi visual) */}
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <span>Cari layanan, OPD, info…</span>
          </div>

          {/* Menu groups */}
          <nav style={styles.menu}>
            {menuGroups.map((group) => (
              <div key={group.label}>
                <div style={styles.groupLabel}>{group.label}</div>
                {group.items.map((item) => (
                  <MenuItem
                    key={item.href}
                    item={item}
                    isActive={item.isModal ? false : isActive(item.href)}
                    onModalClick={item.isModal ? () => setShowLapor(true) : undefined}
                  />
                ))}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div style={styles.footer}>
            Walidata: Diskominfo · MIT
          </div>
        </div>
      </aside>

      {/* LaporWidget modal — dikontrol dari menu sidebar (FAB disembunyikan) */}
      <LaporWidget
        externalOpen={showLapor}
        onExternalClose={() => setShowLapor(false)}
        hideFab
      />
    </>
  );
}
