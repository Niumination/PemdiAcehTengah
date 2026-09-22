/**
 * middleware.js — Mode internal (reposisi 22 Sep 2026).
 * Seluruh respons diberi X-Robots-Tag: noindex, nofollow. URL Vercel tetap
 * terbuka untuk Tim Koordinasi & PJ OPD; tidak ada rute publik yang perlu diblokir
 * karena kodenya sudah dihapus (arsip: tag git arsip/persona-publik-2026-09).
 */
import { NextResponse } from 'next/server';
import { NOINDEX } from '@/lib/modeSitus';

export function middleware() {
  const res = NextResponse.next();
  if (NOINDEX) res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|robots.txt|sitemap.*\\.xml|docs/|bukti-dukung/|.*\\.(?:svg|png|jpg|ico|webp|pdf)$).*)'],
};
