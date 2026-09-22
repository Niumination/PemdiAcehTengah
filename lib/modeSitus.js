/**
 * lib/modeSitus.js — Mode situs (reposisi 22 Sep 2026: persona INTERNAL Pemdi)
 *
 * Situs ini adalah dashboard kerja internal Tim Koordinasi Pemerintah Digital
 * Kabupaten Aceh Tengah. Persona publik (layanan warga, SKM, Lapor, FAQ, admin
 * moderasi) telah DIHAPUS dari cabang utama dan diarsipkan di tag git
 * `arsip/persona-publik-2026-09` (lihat REPOSISI-PEMDI.md §Arsip).
 *
 * Konsekuensi: tidak ada saklar lingkungan lagi. Seluruh respons diberi header
 * X-Robots-Tag: noindex oleh middleware.js (URL Vercel terbuka, tidak diindeks).
 * Murni JS (dipakai middleware Edge, _document, next-sitemap, dan komponen).
 */
const MODE_SITUS = 'internal';
const NOINDEX = true;

module.exports = { MODE_SITUS, NOINDEX };
