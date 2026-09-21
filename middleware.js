/**
 * middleware.js — Satu titik pemutus jalur publik (mode internal, 21 Sep 2026).
 * Saat NEXT_PUBLIC_PERSONA_PUBLIK != "on": halaman & API warga → 404, dan seluruh
 * respons diberi X-Robots-Tag: noindex (URL Vercel tetap terbuka, tidak diindeks).
 */
import { NextResponse } from 'next/server';
import { PUBLIK_AKTIF, isRutePublik } from '@/lib/modeSitus';

export function middleware(req) {
  if (PUBLIK_AKTIF) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (isRutePublik(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Fitur publik dinonaktifkan sementara (mode internal).' }, { status: 404 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/404';
    const res = NextResponse.rewrite(url, { status: 404 });
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/((?!_next/|favicon.ico|robots.txt|sitemap.*\\.xml|docs/|bukti-dukung/|.*\\.(?:svg|png|jpg|ico|webp|pdf)$).*)'],
};
