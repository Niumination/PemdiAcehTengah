import { fokusLevel } from '@/lib/pemdiNilai';
import Head from 'next/head';
import BerandaAsesor from '@/components/beranda/BerandaAsesor';

/**
 * Beranda — Dashboard internal Pemdi (reposisi 22 Sep 2026; REPOSISI-PEMDI.md B1).
 * Persona publik telah dihapus dari cabang utama (arsip: tag arsip/persona-publik-2026-09).
 */
export default function Home({ pemdiData, portalData }) {
  const opd = portalData.opd;
  const spbe = portalData.spbe;
  const ringkasan = opd.ringkasan;

  return (
    <>
      <Head>
        <title>Dashboard Pemerintah Digital — Kabupaten Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard internal Pemerintah Digital Kabupaten Aceh Tengah (PermenPANRB 8/2026, SPBE 2025) untuk Tim Koordinasi Pemdi dan penanggung jawab OPD."
        />
        <link rel="canonical" href="https://pemdi-aceh-tengah.vercel.app/" />
      </Head>

      <BerandaAsesor pemdiData={pemdiData} spbe={spbe} opd={opd} ringkasan={ringkasan} />
    </>
  );
}

/* Data dikirim via getStaticProps (Sprint B2) — JSON keluar dari client bundle. */
export async function getStaticProps() {
  return {
    props: {
      // P3 (audit UI/UX 19 Sep 2026): kirim HANYA field yang dipakai beranda.
      // Sebelumnya seluruh data/pemdi.json (~101 KB, mayoritas array `aspek` berisi
      // 20 indikator dengan seluruh bukti dukungnya) ikut ke __NEXT_DATA__ di setiap
      // kunjungan beranda. Beranda hanya memakai: indeks_aktual, dan per aspek
      // id/nama/nilai/target (lihat aspek.map di bawah).
      pemdiData: await import('@/data/pemdi.json').then(({ default: p }) => ({
        indeks_aktual: p.indeks_aktual,
        tahap1: p.penilaian_tahap1 ? { diterima: p.penilaian_tahap1.diterima, revisi: p.penilaian_tahap1.revisi, dinilai: p.penilaian_tahap1.dinilai, tanggal_sinkron: p.penilaian_tahap1.tanggal_sinkron } : null,
        target_indeks: p.target_indeks,
        total_item_bukti: p.total_item_bukti,
        // Ringkasan per indikator untuk AspekAccordion (Mode B) — tanpa isi bukti (tetap ringan)
        aspek: p.aspek.map(({ id, nama, nilai, target, bobot, deskripsi, koordinator, indikator }) => ({
          id, nama, nilai, target, bobot, deskripsi, koordinator: koordinator || null,
          indikator: (indikator || []).map((i) => ({
            id: i.id, nama: i.nama, nilai: i.nilai, target: i.target,
            // Fokus level (21 Sep 2026): level dicapai (asesor) & level yang dikejar
            fokus: (() => { const f = fokusLevel(i); return { dicapai: f.levelDicapai, berikut: f.levelBerikut, eksternal: f.eksternal }; })(),
            bukti: (i.bukti_dukung || []).reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, { diterima: 0, revisi: 0, draf: 0, belum: 0 }),
          })),
        })),
      })),
      portalData: (await import('@/data/opd.json')).default,
    },
  };
}
