/**
 * PersonaSwitcher — Segmented control 2 mode (Sprint UI/UX 21 Sep 2026, Phase 1)
 *   [ 🏛️ Portal Layanan Publik ] | [ 📊 Dashboard Kinerja & Asesor ]
 *
 * - Di beranda: ganti mode tanpa reload (router.replace shallow → ?view=…).
 * - Di halaman lain: tautan ke beranda dengan persona tsb.
 * - Pola WAI-ARIA tablist; panah kiri/kanan berpindah.
 * - Tinggi tetap (CSS .persona-switch) → tidak ada layout shift saat berganti.
 */
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { PERSONAS, PERSONA_KEY, personaHref } from '@/lib/persona';
import { usePersona } from './usePersona';

export default function PersonaSwitcher({ compact = false }) {
  const router = useRouter();
  const { persona, hydrated } = usePersona();
  const onHome = router.pathname === '/';

  const select = useCallback((id) => {
    try { window.localStorage.setItem(PERSONA_KEY, id); } catch { /* private mode */ }
    const href = personaHref(id);
    if (onHome) router.replace(href, undefined, { shallow: true, scroll: false });
    else router.push(href);
  }, [onHome, router]);

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const idx = PERSONAS.findIndex((p) => p.id === persona);
    const next = PERSONAS[(idx + (e.key === 'ArrowRight' ? 1 : PERSONAS.length - 1)) % PERSONAS.length];
    select(next.id);
  };

  return (
    <div
      className={`persona-switch ${compact ? 'compact' : ''}`}
      role="tablist"
      aria-label="Pilih tampilan: Portal Layanan Publik atau Dashboard Kinerja & Asesor"
      data-hydrated={hydrated ? '1' : '0'}
      onKeyDown={onKeyDown}
    >
      {PERSONAS.map((p) => {
        const active = p.id === persona;
        return (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`persona-panel-${p.id}`}
            id={`persona-tab-${p.id}`}
            tabIndex={active ? 0 : -1}
            className={`persona-tab ${active ? 'active' : ''}`}
            onClick={() => select(p.id)}
            title={p.desc}
          >
            <span aria-hidden="true" className="persona-ic">{p.icon}</span>
            <span className="persona-label">{p.label}</span>
            <span className="persona-short">{p.short}</span>
          </button>
        );
      })}
    </div>
  );
}
