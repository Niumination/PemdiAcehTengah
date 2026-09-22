/**
 * Search index builder — korpus pencarian internal, dibangun saat build
 * (getStaticProps) untuk Fuse.js di /cari.
 *
 * Reposisi 22 Sep 2026: hanya konten persona internal Pemdi —
 * OPD, aspek & 20 indikator Pemdi, glosarium, dokumen kunci.
 * Layanan publik / FAQ / SKM sudah dihapus (arsip: tag arsip/persona-publik-2026-09).
 */

import opdData from '@/data/opd.json';
import pemdiData from '@/data/pemdi.json';
import modulData from '@/data/modul-indikator.json';
import glosarium from '@/data/glosarium.json';
import dokumenKunci from '@/data/dokumen-kunci.json';

const slug = (s = '') => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function buildSearchIndex() {
  const items = [];

  // ── OPD ──────────────────────────────────────────────────────────
  for (const d of opdData.opd.daftar) {
    items.push({
      id: `opd-${d.id}`,
      type: 'OPD',
      label: d.nama,
      sublabel: `${d.singkat} • ${d.urusan}`,
      url: `/opd/${slug(d.nama)}`,
      keywords: [d.nama, d.singkat, d.urusan, d.jenis, d.level].filter(Boolean),
    });
  }

  // ── Aspek Pemdi ──────────────────────────────────────────────────
  for (const a of pemdiData.aspek) {
    items.push({
      id: `pemdi-aspek-${slug(a.nama)}`,
      type: 'Aspek Pemdi',
      label: a.nama,
      sublabel: `Bobot ${a.bobot}% • ${(a.indikator || []).length} indikator`,
      url: '/pemdi',
      keywords: [a.nama, a.deskripsi, a.bobot_teks].filter(Boolean),
    });
  }

  // ── 20 Indikator Pemdi → Modul Indikator ─────────────────────────
  for (const m of modulData.modules || []) {
    items.push({
      id: `indikator-${m.indikator_id || m.nomor}`,
      type: 'Indikator Pemdi',
      label: `${m.indikator_id} — ${m.judul}`,
      sublabel: m.aspek,
      url: `/modul-indikator?modul=${m.nomor}`,
      keywords: [m.indikator_id, m.judul, m.aspek, m.deskripsi].filter(Boolean),
    });
  }

  // ── Glosarium ────────────────────────────────────────────────────
  for (const g of glosarium) {
    items.push({
      id: `glosarium-${g.id}`,
      type: 'Glosarium',
      label: g.istilah,
      sublabel: g.kategori,
      url: `/glosarium#glossary-${g.id}`,
      keywords: [g.istilah, g.singkat, g.kategori].filter(Boolean),
    });
  }

  // ── Dokumen kunci ────────────────────────────────────────────────
  for (const dk of dokumenKunci.dokumen || []) {
    items.push({
      id: `dokumen-${dk.no || slug(dk.nama)}`,
      type: 'Dokumen Kunci',
      label: dk.nama,
      sublabel: `${dk.penanggung_jawab} • ${(dk.indikator || []).join(', ')}`,
      url: '/requirement',
      keywords: [dk.nama, dk.jenis, dk.penanggung_jawab, dk.indikator_level, ...(dk.indikator || [])].filter(Boolean),
    });
  }

  return items;
}
