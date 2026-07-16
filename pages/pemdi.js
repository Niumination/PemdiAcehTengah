import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import DetailModal from '@/components/DetailModal';
import TopographicBackdrop from '@/components/TopographicBackdrop';
import { formatAngka, formatDesimal } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';

function hitungIndeks(aspek) {
  const totalBobot = aspek.reduce((s, a) => s + a.bobot, 0);
  const tertimbang = aspek.reduce((s, a) => s + a.nilai * (a.bobot / totalBobot), 0);
  return Math.round(tertimbang * 100) / 100;
}

function getPredikat(nilai) {
  if (nilai >= 3.0) return { label: 'Baik', warna: 'var(--ok)', bg: 'var(--ok-bg)' };
  if (nilai >= 2.0) return { label: 'Cukup', warna: 'var(--gold)', bg: 'var(--gold-light)' };
  return { label: 'Perlu Perbaikan', warna: 'var(--bad)', bg: 'var(--bad-bg)' };
}

export default function PemdiPage() {
  const { aspek, target_indeks, target_predikat, baseline_spbe } = pemdiData;
  const indeks = hitungIndeks(aspek);
  const predikat = getPredikat(indeks);
  const gap = Math.max(0, target_indeks - indeks);
  const [modalAspek, setModalAspek] = useState(null);

  return (
    <>
      <Head>
        <title>Indeks Kematangan Pemdi 2026 (PermenPANRB 8/2026) — Aceh Tengah</title>
        <meta
          name="description"
          content="Dashboard Kematangan Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah — Evaluasi 7 Aspek dan 20 Indikator berdasarkan PermenPANRB No. 8 Tahun 2026."
        />
      </Head>

      {/* Hero Header */}
      <section
        style={{
          background: 'var(--hero-grad)',
          color: '#ffffff',
          padding: '36px 28px',
          borderRadius: 'var(--r-lg)',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <TopographicBackdrop opacity={0.08} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="pill">⚖️ PermenPANRB No. 8 Tahun 2026</span>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(22px, 3vw, 34px)', margin: '8px 0 12px' }}>
            Indeks Kematangan Pemerintah Digital (Pemdi) 2026
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '680px', lineHeight: 1.6, fontSize: '0.98rem' }}>
            Transformasi menyeluruh tata kelola pemerintahan digital Kabupaten Aceh Tengah.
            Mengukur <strong>7 Aspek Utama</strong> dan <strong>20 Indikator Kunci</strong> menuju target indeks <strong>≥ 2,50</strong>.
          </p>
        </div>
      </section>

      {/* Executive KPI Summary Cards */}
      <section style={{ marginBottom: '32px' }}>
        <div className="grid-3">
          <div className="glow-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Baseline SPBE 2025
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
              {formatDesimal(baseline_spbe)}
            </div>
            <span className="badge badge-yellow">Level Kematangan Cukup</span>
          </div>

          <div className="glow-card" style={{ padding: '20px', textAlign: 'center', borderColor: 'var(--primary)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
              Estimasi Indeks Pemdi Saat Ini
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
              {formatDesimal(indeks)}
            </div>
            <span className={`badge ${predikat.bg}`} style={{ color: predikat.warna }}>
              Predikat {predikat.label}
            </span>
          </div>

          <div className="glow-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Target Evaluasi 2026
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--ok)', fontFamily: 'var(--font-mono)', margin: '6px 0' }}>
              ≥ {formatDesimal(target_indeks)}
            </div>
            <span className="badge badge-green">Gap Analysis: {formatDesimal(gap)} Poin</span>
          </div>
        </div>
      </section>

      {/* 7 Aspek Detailed Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div className="sec-head">
          <div>
            <div className="eyebrow">Rincian 7 Aspek Evaluasi</div>
            <h2>Matrix Indikator &amp; Penanggung Jawab (PIC OPD)</h2>
            <p>Klik tiap aspek untuk melihat 20 indikator, nilai saat ini, dan target perbaikan.</p>
          </div>
        </div>

        <div className="grid-2">
          {aspek.map((a) => {
            const pct = Math.min(100, (a.nilai / a.target) * 100);

            return (
              <div
                key={a.id}
                className="glow-card"
                style={{ padding: '22px', cursor: 'pointer' }}
                onClick={() => setModalAspek(a)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'var(--primary-50)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                      {a.id}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{a.nama}</h3>
                  </div>
                  <span className="badge badge-blue">Bobot {a.bobot}%</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--ink-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {a.deskripsi}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  <span>Progres Aspek</span>
                  <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatDesimal(a.nilai)} / Target {formatDesimal(a.target)}
                  </span>
                </div>

                <div style={{ height: '8px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct >= 80 ? 'var(--ok)' : pct >= 50 ? 'var(--gold)' : 'var(--bad)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                  <span>{a.indikator?.length || 0} Indikator Terkait</span>
                  <span>Lihat Detail Indikator &amp; PIC →</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Side Panel Detail Aspek & Indikator */}
      <DetailModal
        title={modalAspek ? `Aspek ${modalAspek.id}: ${modalAspek.nama}` : ''}
        open={!!modalAspek}
        onClose={() => setModalAspek(null)}
        maxWidth={640}
      >
        {modalAspek && (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              {modalAspek.deskripsi}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {modalAspek.indikator?.map((ind) => (
                <div
                  key={ind.id}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--r-xs)',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--line)',
                    borderLeft: `4px solid var(--primary)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-blue">{ind.id}</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--ink)' }}>{ind.nama}</strong>
                    </div>
                    <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)' }}>
                      Nilai: {formatDesimal(ind.nilai, 1)} / Target {formatDesimal(ind.target, 1)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
                    {ind.deskripsi}
                  </p>

                  {ind.penanggung_jawab && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span>👤 PIC Lead:</span>
                      <strong style={{ color: 'var(--primary)' }}>{ind.penanggung_jawab.lead}</strong>
                      {ind.penanggung_jawab.support?.length > 0 && (
                        <span>(Pendukung: {ind.penanggung_jawab.support.join(', ')})</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DetailModal>
    </>
  );
}
