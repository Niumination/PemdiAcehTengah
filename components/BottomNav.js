/**
 * BottomNav — Bottom Navigation Bar untuk ponsel (Sprint UI/UX Phase 4).
 * Tampil hanya ≤ 768px (CSS .bottom-nav). 5 tujuan utama: Beranda, Layanan,
 * Lapor (modal), Kinerja (persona asesor), Menu (buka drawer sidebar).
 */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PERSONA_ASESOR, personaHref } from '@/lib/persona';

export default function BottomNav({ onOpenMenu }) {
  const router = useRouter();
  const path = router.pathname;
  const isAsesorHome = path === '/' && router.query?.view === PERSONA_ASESOR;
  const items = [
    { key: 'home', href: '/', icon: '🏠', label: 'Beranda', active: path === '/' && !isAsesorHome },
    { key: 'layanan', href: '/layanan', icon: '📋', label: 'Layanan', active: path.startsWith('/layanan') },
    { key: 'lapor', icon: '📢', label: 'Lapor', action: () => window.dispatchEvent(new CustomEvent('pemdi:open-lapor')) },
    { key: 'kinerja', href: personaHref(PERSONA_ASESOR), icon: '📊', label: 'Kinerja', active: isAsesorHome || path.startsWith('/pemdi') || path.startsWith('/spbe') },
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
