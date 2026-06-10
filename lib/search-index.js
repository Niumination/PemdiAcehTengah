/**
 * Search index builder — generates the search corpus at build time
 * from all data/ JSON sources for client-side Fuse.js search.
 *
 * Called inside getStaticProps so the index is serialised into the
 * page's props on every build.
 */

import opdData from '@/data/opd.json';
import pemdiData from '@/data/pemdi.json';
import layananData from '@/data/layanan.json';
import faqData from '@/data/faq.json';
import skmData from '@/data/skm.json';

export default function buildSearchIndex() {
  const items = [];

  // ── OPD ──────────────────────────────────────────────────────────
  for (const d of opdData.opd.daftar) {
    items.push({
      id: `opd-${d.id}`,
      type: 'OPD',
      label: d.nama,
      sublabel: `${d.singkat} • ${d.urusan}`,
      url: `/opd/${d.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
      keywords: [d.nama, d.singkat, d.urusan, d.jenis, d.level].filter(Boolean),
    });
  }

  // ── Layanan Publik ───────────────────────────────────────────────
  for (const k of layananData.kategori) {
    for (const l of k.layanan) {
      items.push({
        id: `layanan-${k.id}-${l.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        type: 'Layanan',
        label: l.nama,
        sublabel: `${k.nama} • ${k.opd}`,
        url: `/layanan#${k.id}`,
        keywords: [l.nama, l.deskripsi, l.persyaratan, k.nama, k.opd].filter(Boolean),
      });
    }
  }

  // ── FAQ ──────────────────────────────────────────────────────────
  for (const k of faqData.kategori) {
    for (const q of k.pertanyaan) {
      let slug = q.tanya.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
      items.push({
        id: `faq-${k.id}-${slug}`,
        type: 'FAQ',
        label: q.tanya,
        sublabel: k.nama,
        url: `/faq#${slug}`,
        keywords: [q.tanya, q.jawab.replace(/<[^>]*>/g, ''), k.nama].filter(Boolean),
      });
    }
  }

  // ── SKM ──────────────────────────────────────────────────────────
  items.push({
    id: 'skm-online',
    type: 'Survei',
    label: 'Survei Kepuasan Masyarakat (SKM)',
    sublabel: 'Isi survei online — suara Anda penting',
    url: '/skm',
    keywords: ['Survei Kepuasan Masyarakat', 'SKM', 'survey', 'kepuasan', 'Aspirasi', 'masukan'],
  });

  // ── Pemdi Aspek ──────────────────────────────────────────────────
  for (const a of pemdiData.aspek) {
    items.push({
      id: `pemdi-aspek-${a.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      type: 'Indikator Pemdi',
      label: a.nama,
      sublabel: `Bobot ${a.bobot}% • Nilai ${a.nilai}`,
      url: `/pemdi`,
      keywords: [a.nama, a.deskripsi, a.bobot_teks, ...(a.indikator || []).map(i => i.nama)].filter(Boolean),
    });
  }

  return items;
}
