/**
 * lib/persona.js — Dual-Persona (Sprint UI/UX 21 Sep 2026)
 *
 * Dua konteks pengguna pada beranda (REPOSISI-PEMDI.md: B2 publik vs B1 internal):
 *   publik → Portal Layanan Publik (tugas warga; metrik birokrasi disembunyikan)
 *   asesor → Dashboard Kinerja & Asesor (KPI Pemdi/SPBE/bukti dukung)
 *
 * Sumber kebenaran: query `?view=publik|asesor`. Preferensi terakhir disimpan
 * di localStorage (PERSONA_KEY) agar kunjungan berikutnya langsung ke mode itu.
 * Murni util — tanpa React — supaya bisa diuji dengan node:test.
 */
export const PERSONA_PUBLIK = 'publik';
export const PERSONA_ASESOR = 'asesor';
export const PERSONA_DEFAULT = PERSONA_PUBLIK;
export const PERSONA_KEY = 'pemdi:persona';

export const PERSONAS = [
  { id: PERSONA_PUBLIK, icon: '🏛️', label: 'Portal Layanan Publik', short: 'Publik', desc: 'Layanan warga: KTP, KK, perizinan, pajak, lapor' },
  { id: PERSONA_ASESOR, icon: '📊', label: 'Dashboard Kinerja & Asesor', short: 'Asesor', desc: 'Indeks Pemdi, SPBE, bukti dukung, 52 OPD' },
];

/** Normalisasi nilai query/localStorage → persona valid, selain itu null. */
export function parsePersona(value) {
  if (Array.isArray(value)) value = value[0];
  if (typeof value !== 'string') return null;
  const v = value.trim().toLowerCase();
  return v === PERSONA_PUBLIK || v === PERSONA_ASESOR ? v : null;
}

/** URL beranda untuk persona tertentu (publik = tanpa query agar URL kanonik bersih). */
export function personaHref(persona) {
  return persona === PERSONA_ASESOR ? `/?view=${PERSONA_ASESOR}` : '/';
}
