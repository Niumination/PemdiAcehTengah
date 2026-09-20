import Head from 'next/head';
import Link from 'next/link';
import GlossaryTooltip from '@/components/GlossaryTooltip';
import OPDTable from '@/components/OPDTable';
import SpbeGauge from '@/components/SpbeGauge';
import ServiceFinder from '@/components/ServiceFinder';
import DashboardSKM from '@/components/DashboardSKM';
import PersonaSwitcher from '@/components/persona/PersonaSwitcher';
import { usePersona } from '@/components/persona/usePersona';
import HeroPublik from '@/components/publik/HeroPublik';
import SektorLayanan from '@/components/publik/SektorLayanan';
import KpiCards from '@/components/asesor/KpiCards';
import AspekAccordion from '@/components/asesor/AspekAccordion';
import { kelompokkanSektor } from '@/lib/sektorLayanan';
import { PERSONA_ASESOR, PERSONA_PUBLIK } from '@/lib/persona';
import { formatDesimal } from '@/lib/format';

/**
 * Beranda — Dual-Persona (Sprint UI/UX 21 Sep 2026; REPOSISI-PEMDI.md B1/B2)
 *   ?view=publik (default) → Portal Layanan Publik: tugas warga, tanpa metrik birokrasi
 *   ?view=asesor            → Dashboard Kinerja & Asesor: KPI Pemdi/SPBE/bukti/OPD
 * Kedua panel dirender di dalam wadah .persona-stage dengan min-height tetap → tanpa CLS.
 */
export default function Home({ pemdiData, layananData, portalData }) {
  const opd = portalData.opd;
  const spbe = portalData.spbe;
  const ringkasan = opd.ringkasan;
  const totalLayanan = layananData.ringkasan?.total_layanan ?? 25;
  const totalKategoriLayanan = layananData.ringkasan?.total_kategori ?? 7;
  const { aspek } = pemdiData;
  const { persona } = usePersona();
  const sektor = kelompokkanSektor(layananData.kategori);
  const isAsesor = persona === PERSONA_ASESOR;

  return (
    <>
      <Head>
        <title>{isAsesor ? 'Dashboard Kinerja & Asesor — Pemdi Kabupaten Aceh Tengah' : 'Portal Layanan Publik — Kabupaten Aceh Tengah'}</title>
        <meta
          name="description"
          content="Kabupaten Aceh Tengah: layanan publik terpadu untuk warga dan dashboard kinerja Pemerintah Digital (PermenPANRB 8/2026, SPBE 2025) untuk Tim Asesor."
        />
        <link rel="canonical" href="https://pemdi-aceh-tengah.vercel.app/" />
      </Head>

      <div className="persona-bar">
        <PersonaSwitcher />
      </div>

      <div className="persona-stage">
      {/* ═══════════════ MODE A — PORTAL LAYANAN PUBLIK ═══════════════ */}
      <div id="persona-panel-publik" role="tabpanel" aria-labelledby="persona-tab-publik" hidden={isAsesor}>
        <HeroPublik totalLayanan={totalLayanan} totalOpd={ringkasan.total_opd} />

        <section className="sec" id="sektor">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Sektor Layanan Terpadu</div>
              <h2>Pilih sektor layanan</h2>
              <p>{totalLayanan} layanan dari {totalKategoriLayanan} kategori dikelompokkan ke 6 sektor. Klik untuk melihat syarat, biaya, dan lama proses.</p>
            </div>
            <Link href="/layanan" className="link-more">Direktori lengkap →</Link>
          </div>
          <SektorLayanan sektor={sektor} />
        </section>

      {/* ============ 3. CITIZEN TASK HUB ("Apa yang Ingin Anda Lakukan Hari Ini?") ============ */}
      <section className="sec" id="layanan-warga">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Akses Utama Warga</div>
            <h2>Apa yang ingin Anda lakukan hari ini?</h2>
            <p>Pilih tugas pelayanan utama untuk kemudahan warga Kabupaten Aceh Tengah.</p>
          </div>
        </div>

        <div className="qa-grid">
          <Link href="/layanan" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>
              📋
            </div>
            <h3>Direktori Layanan Terpadu</h3>
            <p>{totalLayanan} layanan di {totalKategoriLayanan} sektor lengkap dengan syarat, biaya (Gratis), &amp; SLA waktu proses.</p>
            <span className="go">Buka Layanan →</span>
          </Link>

          <button
            type="button"
            className="qa-card kerawang-card"
            onClick={() => window.dispatchEvent(new CustomEvent('pemdi:open-lapor'))}
            style={{ textAlign: 'left', font: 'inherit', background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="ic" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              💬
            </div>
            <h3>Pengaduan &amp; Tiket Lapor</h3>
            <p>Sampaikan keluhan atau saran dan dapatkan ID tiket pelacakan real-time (contoh: LAPOR-20260715-A1B2C3D4E5F6).</p>
            <span className="go">Buat Laporan / Lacak →</span>
          </button>

          <Link href="/skm" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              📝
            </div>
            <h3>Survei Kepuasan (SKM)</h3>
            <p>Beri penilaian kualitas layanan publik (2 menit, anonim, terukur langsung pada Indeks IKM).</p>
            <span className="go">Isi Survei SKM →</span>
          </Link>

          <Link href="/faq" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              🤖
            </div>
            <h3>Asisten Virtual &amp; FAQ</h3>
            <p>Jawaban cepat serba otomatis seputar syarat kependudukan, perizinan, dan bantuan portal.</p>
            <span className="go">Tanya Asisten Virtual →</span>
          </Link>
        </div>
      </section>


      {/* ============ 4. POPULAR SERVICES EXPLORER ============ */}
      <section className="sec">
        <div className="sec-head">
          <div>
            <div className="eyebrow">E-Services Explorer</div>
            <h2>Pencarian Layanan Publik Terpadu</h2>
            <p>Telusuri kepastian waktu (SLA), biaya, dan persyaratan layanan publik.</p>
          </div>
          <Link href="/layanan" className="link-more">
            Lihat Semua 25 Layanan →
          </Link>
        </div>

        <div className="glow-card" style={{ padding: '24px' }}>
          <ServiceFinder layanan={layananData.kategori.flatMap((k) => k.layanan.map((l) => ({ ...l, kategori: k.nama })))} />
        </div>
      </section>


      {/* ============ 7. LIVE PUBLIC SKM & CITIZEN SATISFACTION ============ */}
      <section className="sec" id="skm-dashboard">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Indikator I20 PermenPANRB 8/2026</div>
            <h2>Hasil Live Survei Kepuasan Masyarakat (SKM)</h2>
            <p>Agregat penilaian kepuasan warga real-time dari seluruh unit pelayanan publik.</p>
          </div>
          <Link href="/dashboard-kepuasan" className="link-more">
            Buka Full Dashboard IKM →
          </Link>
        </div>

        <div className="glow-card" style={{ padding: '24px' }}>
          <DashboardSKM />
        </div>
      </section>


      </div>

      {/* ═══════════════ MODE B — DASHBOARD KINERJA & ASESOR ═══════════════ */}
      <div id="persona-panel-asesor" role="tabpanel" aria-labelledby="persona-tab-asesor" hidden={!isAsesor}>
        <section className="hero hero-asesor" aria-labelledby="hero-asesor-title">
          <span className="pill">⚖️ PermenPANRB No. 8 Tahun 2026 · Kokpit Penilaian Mandiri</span>
          <h1 id="hero-asesor-title" className="gold-head">Dashboard Kinerja &amp; Asesor</h1>
          <p>
            Ringkasan eksekutif untuk Tim Asesor Internal: <GlossaryTooltip id="pemdi">Indeks Pemdi</GlossaryTooltip>, <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip>,
            status bukti dukung Tahap 1 eval.spbe.go.id, dan kepatuhan {ringkasan.total_opd} perangkat daerah.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href="/pemdi" className="hbtn solid">Buka Kokpit Pemdi →</Link>
            <Link href="/requirement" className="hbtn ghost">Draf Bukti Dukung Prioritas</Link>
          </div>
        </section>

        <section className="sec" id="kpi" aria-label="Ringkasan eksekutif">
          <KpiCards pemdi={pemdiData} spbe={spbe} opd={ringkasan} />
        </section>

      {/* ============ 5. SPBE & PEMDI EXECUTIVE DASHBOARD ============ */}
      <section className="sec" id="spbe-pemdi">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Command Center Kinerja Pemda</div>
            <h2>Evaluasi SPBE 2025 &amp; Target Kematangan Pemdi 2026</h2>
            <p>Pengukuran objektif berbasis PermenPANRB No. 8 Tahun 2026 dan Evaluasi SPBE Kementerian PANRB.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href="/spbe" className="btn btn-outline btn-sm">
              Detail SPBE 2025
            </Link>
            <Link href="/pemdi" className="btn btn-primary btn-sm">
              7 Aspek Pemdi 2026
            </Link>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: '24px' }}>
          <div className="glow-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>🚀 Matrix Kematangan Pemdi 2026 — 7 Aspek</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>Klik aspek untuk melihat indikator &amp; status bukti dukung Tahap 1 (tanpa pindah halaman).</p>
            <AspekAccordion aspek={aspek} />
          </div>
          {/* Donut Donut Gauge SPBE */}
          <div className="glow-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
              📊 Donut Evaluation — Indeks SPBE 2025: {formatDesimal(spbe.indeks)}/5,00
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>
              Kategori: <strong>{spbe.kategori}</strong>. Target minimal kementerian: Level 3,00.
            </p>
            <SpbeGauge nilai={spbe.indeks} domain={spbe.domain} />
          </div>

        </div>
      </section>


      {/* ============ 6. PETA PROSES BISNIS (PPB) 3-LEVEL ============ */}
      <section className="sec" id="probis">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Arsitektur Tata Kelola</div>
            <h2>Peta Proses Bisnis (PPB) Level 0, 1, dan 2</h2>
            <p>Penyusunan alur kerja lintas OPD sesuai PermenPANRB No. 19 Tahun 2018.</p>
          </div>
          <Link href="/probis" className="link-more">
            Eksplorasi Peta Lintas Fungsi (CFM) →
          </Link>
        </div>

        <div className="glow-card" style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: 'var(--r-sm)' }}>
              <span className="badge badge-blue" style={{ marginBottom: '8px' }}>Level 0 — Macro</span>
              <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>Visi &amp; Misi RPJMD 2025–2030</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                Visi utama pembangunan daerah &amp; 8 Misi strategis Kabupaten Aceh Tengah.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'var(--ok-bg)', border: '1px solid var(--ok-border)', borderRadius: 'var(--r-sm)' }}>
              <span className="badge badge-green" style={{ marginBottom: '8px' }}>Level 1 — Urusan</span>
              <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>24 Urusan Konkuren UU 23/2014</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                Pemetaan kewenangan urusan wajib &amp; pilihan di seluruh Perangkat Daerah.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'var(--warn-bg)', border: '1px solid var(--warn-border)', borderRadius: 'var(--r-sm)' }}>
              <span className="badge badge-yellow" style={{ marginBottom: '8px' }}>Level 2 — Proses OPD</span>
              <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>37 Proses &amp; Swimlane CFM</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)' }}>
                Bagan lintas fungsi (Cross-Functional Map) antar 52 OPD pelaksana SOP.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ============ 8. DIRECTORY OF 52 PERANGKAT DAERAH ============ */}
      <section className="sec" id="opd">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Direktori Pemda</div>
            <h2>52 Perangkat Daerah Kabupaten Aceh Tengah</h2>
            <p>Profil lengkap Sekretariat, Dinas, Badan, Inspektorat, Rumah Sakit, dan 14 Kecamatan.</p>
          </div>
        </div>

        <div >
          <OPDTable list={opd.daftar} />
        </div>
      </section>

      </div>
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
      layananData: (await import('@/data/layanan.json')).default,
      portalData: (await import('@/data/opd.json')).default,
    },
  };
}
