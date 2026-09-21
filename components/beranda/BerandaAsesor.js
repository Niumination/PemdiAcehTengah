/**
 * BerandaAsesor — Mode B (Dashboard Kinerja & Asesor). Satu-satunya panel beranda pada
 * mode internal (NEXT_PUBLIC_PERSONA_PUBLIK != on). Isi identik dengan panel asesor
 * Sprint UI/UX 21 Sep 2026.
 */
import Link from 'next/link';
import GlossaryTooltip from '@/components/GlossaryTooltip';
import OPDTable from '@/components/OPDTable';
import SpbeGauge from '@/components/SpbeGauge';
import KpiCards from '@/components/asesor/KpiCards';
import AspekAccordion from '@/components/asesor/AspekAccordion';
import { formatDesimal } from '@/lib/format';

export default function BerandaAsesor({ pemdiData, spbe, opd, ringkasan, hidden = false }) {
  const { aspek } = pemdiData;
  return (
    <div id="persona-panel-asesor" role="tabpanel" aria-labelledby="persona-tab-asesor" hidden={hidden}>
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
  );
}
