import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import LaporWidget from './LaporWidget';

/* ── Menu Categories for Citizens & Government Leadership ── */
const menuGroups = [
  {
    label: 'I. Sektor Warga & Layanan',
    items: [
      { label: 'Direktori Layanan', href: '/layanan', icon: '📋', badge: '25 SLA' },
      { label: 'Pengaduan & Lapor', href: '#', icon: '💬', isModal: true, badge: 'SP4N' },
      { label: 'Survei Kepuasan (SKM)', href: '/skm', icon: '📝' },
      { label: 'Tanya Assistant & FAQ', href: '/faq', icon: '🤖' },
    ],
  },
  {
    label: 'II. Kinerja & Transparansi',
    items: [
      { label: 'Indeks Pemdi 2026', href: '/pemdi', icon: '🚀', badge: '8/2026' },
      { label: 'Modul Indikator', href: '/modul-indikator', icon: '📋', badge: '20' },
      { label: 'Indeks SPBE 2025', href: '/spbe', icon: '📊', badge: '2.59' },
      { label: 'Peta Proses Bisnis', href: '/probis', icon: '🗺️', badge: 'Level 3' },
      { label: '52 Perangkat Daerah', href: '/opd', icon: '🏬' },
    ],
  },
  {
    label: 'III. Sistem & Pengelolaan',
    items: [
      { label: 'Glosarium Istilah', href: '/glosarium', icon: '📖' },
      { label: 'Requirements Data', href: '/requirement', icon: '📦' },
      { label: 'Dashboard Kepuasan', href: '/dashboard-kepuasan', icon: '📈' },
      { label: 'Panel Admin Diskominfo', href: '/admin', icon: '🔐' },
    ],
  },
];

export default function Sidebar({ isOpen, onClose, collapsed }) {
  const router = useRouter();
  const pathname = router.pathname;

  const [isDesktop, setIsDesktop] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showLapor, setShowLapor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    setIsDesktop(mq.matches);
    setHydrated(true);

    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!isDesktop) onClose?.();
  }, [pathname, isDesktop, onClose]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href);
  };

  const showAsDrawer = hydrated && !isDesktop;
  const isCollapsed = hydrated && isDesktop && collapsed;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {showAsDrawer && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 18, 32, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 105,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            transition: 'opacity 0.25s ease, visibility 0.25s ease',
          }}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`sidebar ${showAsDrawer && isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        role="navigation"
        aria-label="Navigasi Utama Pemdi Aceh Tengah"
      >
        {/* Brand Header — selalu tampil meski collapsed, minimal */}
        <div className="sb-header">
          <Link href="/" className="sb-brand" aria-label="Beranda Pemdi Aceh Tengah">
            <div className="sb-crest">
              <Image
                src="/crest-pemdi.svg"
                alt="Lambang Kabupaten Aceh Tengah"
                width={36}
                height={36}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <div className="sb-brand-text">
              <b>Pemdi Aceh Tengah</b>
              <small>Pemerintah Digital Terpadu</small>
            </div>
          </Link>
          <div className="sb-status">
            <span className="pulse-dot" />
            <span>Sistem Operasional Live</span>
          </div>
        </div>

        {/* Global Search Shortcut Trigger */}
        <Link href="/cari" className="sb-search" aria-label="Cari Layanan atau Regulasi">
          <span>🔍</span>
          <span>Cari layanan, OPD, SPBE...</span>
          <kbd>⌘K</kbd>
        </Link>

        {/* Navigation Groups */}
        <nav className="sb-nav">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <div className="sb-group">{group.label}</div>
              {group.items.map((item) => {
                const active = !item.isModal && isActive(item.href);

                if (item.isModal) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setShowLapor(true)}
                      className="sb-link"
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      <span className="i">{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && <span className="badge badge-blue">{item.badge}</span>}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sb-link ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="i">{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span className={`badge ${active ? 'badge-green' : 'badge-gray'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Docked Sidebar Footer Action */}
        <div className="sb-foot">
          <div
            className="sb-quick-cta"
            onClick={() => setShowLapor(true)}
            role="button"
            tabIndex={0}
          >
            <span style={{ fontSize: '18px' }}>📢</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>Butuh Bantuan / Lapor?</div>
              <div style={{ fontSize: '10px', color: '#90b5db' }}>Kirim tiket & lacak real-time</div>
            </div>
          </div>
          <div className="sb-foot-text">Walidata: Diskominfo Kab. Aceh Tengah</div>
        </div>
      </aside>

      {/* Lapor Modal — tetap pop-up, bukan side panel */}
      <LaporWidget
        externalOpen={showLapor}
        onExternalClose={() => setShowLapor(false)}
        hideFab
      />
    </>
  );
}
