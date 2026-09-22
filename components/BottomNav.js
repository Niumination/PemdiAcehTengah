/**
 * BottomNav — Bottom Navigation Bar untuk ponsel (≤ 768px, CSS .bottom-nav).
 * Mode internal Pemdi (reposisi 22 Sep 2026): 5 tujuan Tim Koordinasi & PJ OPD —
 * Ringkasan, Indikator, Modul, Draf Bukti, Menu (buka drawer sidebar).
 */
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNav({ onOpenMenu }) {
  const router = useRouter();
  const path = router.pathname;
  const items = [
    { key: 'home', href: '/', icon: '🏠', label: 'Ringkasan', active: path === '/' },
    { key: 'pemdi', href: '/pemdi', icon: '🚀', label: 'Indikator', active: path.startsWith('/pemdi') },
    { key: 'modul', href: '/modul-indikator', icon: '📋', label: 'Modul', active: path.startsWith('/modul-indikator') },
    { key: 'draf', href: '/requirement', icon: '📝', label: 'Draf Bukti', active: path.startsWith('/requirement') },
    { key: 'menu', icon: '☰', label: 'Menu', action: onOpenMenu },
  ];
  return (
    <nav className="bottom-nav" aria-label="Navigasi cepat (ponsel)">
      {items.map((it) => it.href ? (
        <Link key={it.key} href={it.href} className={`bn-item ${it.active ? 'active' : ''}`} aria-current={it.active ? 'page' : undefined}>
          <span aria-hidden="true" className="bn-ic">{it.icon}</span><span className="bn-label">{it.label}</span>
        </Link>
      ) : (
        <button key={it.key} type="button" className="bn-item" onClick={it.action}>
          <span aria-hidden="true" className="bn-ic">{it.icon}</span><span className="bn-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}
