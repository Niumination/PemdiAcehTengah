#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Append animasi system ke globals.css."""
css = open('styles/globals.css').read()

anim = """
/* ════════════ ANIMASI SISTEM — scroll reveal, stagger, micro-interaction ════════════ */
/* Dipicu oleh [data-reveal] via IntersectionObserver di AppShell (60fps: transform/opacity only) */
[data-reveal] {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* Stagger anak kartu dalam grid — delay bertahap via --i (set inline per item) */
[data-reveal-stagger] > * {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--i, 0) * 70ms);
}
[data-reveal-stagger].is-visible > * {
  opacity: 1;
  transform: none;
}

/* Micro-interaction: kartu (transform/opacity — aman 60fps) */
.card, [class*="card"] {
  transition:
    transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.28s ease;
}
.card:hover, [class*="card"]:hover {
  transform: translateY(-3px);
}

/* Nav active state — indikator halus tanpa side-tab */
.sidebar a.active {
  position: relative;
}
.sidebar a.active::after {
  content: '';
  position: absolute;
  left: 12px; right: 12px; bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: var(--gold, #C6A75E);
  transform: scaleX(0.6);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.sidebar a.active:hover::after { transform: scaleX(1); }

/* Fokus keyboard yang jelas (aksesibilitas) */
:focus-visible {
  outline: 3px solid var(--gold, #C6A75E);
  outline-offset: 2px;
  border-radius: 4px;
}
"""

if '[data-reveal]' not in css:
    open('styles/globals.css', 'w').write(css + anim)
    print('animasi system ditambahkan')
else:
    print('sudah ada')
