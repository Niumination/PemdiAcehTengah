/**
 * lib/modeSitus.js — Saklar persona publik (keputusan pemilik 21 Sep 2026)
 *
 * Fokus sementara ke persona INTERNAL (Kokpit Asesor). Persona publik tidak dihapus,
 * hanya dimatikan lewat satu variabel lingkungan:
 *
 *   NEXT_PUBLIC_PERSONA_PUBLIK=on   → dual-persona penuh (beranda warga, /layanan, /skm, /lapor, …)
 *   (kosong / selain "on")          → mode internal: beranda = Dashboard Asesor, seluruh rute
 *                                     publik (halaman + API) → 404, situs noindex.
 *
 * Nilai dibaca saat build (di-inline Next.js) sehingga kode publik yang tidak dipakai
 * tidak ikut terkirim ke browser. Untuk menghidupkan kembali: set env di Vercel → redeploy.
 * Murni JS (dipakai middleware Edge, _document, next-sitemap, dan komponen).
 */
const PUBLIK_AKTIF = process.env.NEXT_PUBLIC_PERSONA_PUBLIK === 'on';

/** Rute halaman yang HANYA relevan untuk warga (dimatikan saat mode internal).
 *  `/admin` (Panel Admin Diskominfo: moderasi lapor & SKM) ikut dimatikan — keputusan pemilik
 *  21 Sep 2026; slot ini kelak diganti fitur "kirim eviden dari OPD/SKPD". */
const RUTE_PUBLIK = [
  '/layanan', '/skm', '/lapor', '/faq', '/tanya', '/bantuan',
  '/dashboard-kepuasan', '/kebijakan-privasi', '/admin',
];

/** Endpoint API yang melayani fitur warga (lapor, SKM, rating) + API admin-nya. */
const API_PUBLIK = ['/api/lapor', '/api/skm', '/api/feedback', '/api/admin'];

/** Apakah pathname termasuk jalur publik (halaman atau API, beserta sub-path-nya). */
function isRutePublik(pathname = '') {
  const p = String(pathname).split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return [...RUTE_PUBLIK, ...API_PUBLIK].some((r) => p === r || p.startsWith(`${r}/`));
}

module.exports = { PUBLIK_AKTIF, RUTE_PUBLIK, API_PUBLIK, isRutePublik };
