import Head from 'next/head';
import PersonaSwitcher from '@/components/persona/PersonaSwitcher';
import { usePersona } from '@/components/persona/usePersona';
import BerandaAsesor from '@/components/beranda/BerandaAsesor';
import { PERSONA_ASESOR } from '@/lib/persona';
import { PUBLIK_AKTIF } from '@/lib/modeSitus';

// Mode publik hanya dimuat bila saklar aktif (build-time) → kode warga tidak ikut bundel internal.
const BerandaPublik = PUBLIK_AKTIF ? require('@/components/beranda/BerandaPublik').default : null;

/**
 * Beranda — Dual-Persona (Sprint UI/UX 21 Sep 2026; REPOSISI-PEMDI.md B1/B2)
 *   NEXT_PUBLIC_PERSONA_PUBLIK=on : ?view=publik (default) | ?view=asesor, switcher tampil
 *   selain itu (mode internal)    : hanya Dashboard Kinerja & Asesor, tanpa switcher
 */
export default function Home({ pemdiData, layananData, portalData }) {
  const opd = portalData.opd;
  const spbe = portalData.spbe;
  const ringkasan = opd.ringkasan;
  const { persona } = usePersona();
  const isAsesor = !PUBLIK_AKTIF || persona === PERSONA_ASESOR;

  return (
    <>
      <Head>
        <title>{isAsesor ? 'Dashboard Kinerja & Asesor — Pemdi Kabupaten Aceh Tengah' : 'Portal Layanan Publik — Kabupaten Aceh Tengah'}</title>
        <meta
          name="description"
          content="Kabupaten Aceh Tengah: dashboard kinerja Pemerintah Digital (PermenPANRB 8/2026, SPBE 2025) untuk Tim Asesor Internal."
        />
        <link rel="canonical" href="https://pemdi-aceh-tengah.vercel.app/" />
      </Head>

      {PUBLIK_AKTIF && (
        <div className="persona-bar">
          <PersonaSwitcher />
        </div>
      )}

      <div className="persona-stage">
        {BerandaPublik && (
          <BerandaPublik layananData={layananData} ringkasan={ringkasan} hidden={isAsesor} />
        )}
        <BerandaAsesor pemdiData={pemdiData} spbe={spbe} opd={opd} ringkasan={ringkasan} hidden={!isAsesor} />
      </div>
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
            bukti: (i.bukti_dukung || []).reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, { diterima: 0, revisi: 0, draf: 0, belum: 0 }),
          })),
        })),
      })),
      // Mode internal: data layanan warga tidak dikirim (panel publik tidak dirender)
      layananData: PUBLIK_AKTIF ? (await import('@/data/layanan.json')).default : { ringkasan: null, kategori: [] },
      portalData: (await import('@/data/opd.json')).default,
    },
  };
}
