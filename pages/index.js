import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import GlossaryTooltip from '@/components/GlossaryTooltip';
import OPDTable from '@/components/OPDTable';
import SpbeGauge from '@/components/SpbeGauge';
import ServiceFinder from '@/components/ServiceFinder';
import TimelineRoadmap from '@/components/TimelineRoadmap';
import DashboardSKM from '@/components/DashboardSKM';
import { formatAngka, formatDesimal } from '@/lib/format';
import pemdiData from '@/data/pemdi.json';
import layananData from '@/data/layanan.json';
import portalData from '@/data/opd.json';

const popularQuickQueries = [
  { label: '🆔 KTP-el & Kartu Keluarga', query: 'KTP' },
  { label: '🏬 Perizinan Usaha MPP', query: 'Perizinan' },
  { label: '💰 Pajak & Retribusi PAD', query: 'Pajak' },
  { label: '🚑 Layanan Kesehatan RSUD', query: 'Kesehatan' },
  { label: '🔍 Lacak Status Tiket', query: 'Status' },
];

export default function Home() {
  const opd = portalData.opd;
  const spbe = portalData.spbe;
  const ringkasan = opd.ringkasan;
  const totalLayanan = layananData.ringkasan?.total_layanan ?? 25;
  const totalKategoriLayanan = layananData.ringkasan?.total_kategori ?? 7;
  const { aspek } = pemdiData;

  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('anim-ready');
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' }
    );
    els.forEach((el) => io.observe(el));

    const timeout = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    }, 1200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Head>
        <title>Portal Digital Kabupaten Aceh Tengah — Transformasi Pemdi & SPBE</title>
        <meta
          name="description"
          content="Portal Resmi Pemerintah Digital (Pemdi) Kabupaten Aceh Tengah. Layanan publik terpadu, evaluasi Indeks SPBE 2025 (2,59), target Pemdi 2026 (PermenPANRB 8/2026), dan partisipasi warga."
        />
      </Head>

      {/* ============ 1. DUAL-PERSPECTIVE EXECUTIVE HERO ============ */}
      <section className="hero reveal" id="hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <span className="pill">
            🏛️ Portal Resmi Pemerintah Kabupaten Aceh Tengah
          </span>
          <span style={{ fontSize: '0.78rem', color: '#b8d2f2', fontWeight: 600 }}>
            PermenPANRB No. 8 Tahun 2026 &amp; PermenPANRB No. 19 Tahun 2018
          </span>
        </div>

        <h1>Pusat Akses Layanan Publik &amp; Transparansi Kinerja Digital Pemda</h1>
        <p>
          Integrasi <strong>25 Layanan Terpadu</strong> di <strong>52 Perangkat Daerah</strong>. Memantau progres transformasi <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip> &amp; <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> secara terbuka demi pelayanan yang hemat, pasti, dan bebas pungli.
        </p>

        {/* Hero Integrated Search Console */}
        <div className="hero-search-box">
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Cari layanan publik (contoh: KTP-el, Perizinan, PBB) atau topik regulasi..."
            value={heroSearch}
            onChange={(e) => setHeroSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && heroSearch.trim()) {
                window.location.href = `/cari?q=${encodeURIComponent(heroSearch.trim())}`;
              }
            }}
          />
          <Link
            href={heroSearch.trim() ? `/cari?q=${encodeURIComponent(heroSearch.trim())}` : '/cari'}
            className="btn btn-primary btn-sm"
          >
            Cari Layanan →
          </Link>
        </div>

        {/* Quick Query Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 600 }}>Paling sering dicari:</span>
          {popularQuickQueries.map((q) => (
            <Link
              key={q.label}
              href={`/cari?q=${encodeURIComponent(q.query)}`}
              style={{
                fontSize: '0.75rem',
                padding: '3px 10px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 600,
              }}
            >
              {q.label}
            </Link>
          ))}
        </div>

        {/* Dual CTA Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/layanan" className="hbtn solid">
            📋 Jelajahi Direktori 25 Layanan Publik
          </Link>
          <button
            type="button"
            className="hbtn ghost"
            onClick={() => window.dispatchEvent(new CustomEvent('pemdi:open-lapor'))}
          >
            💬 Buat Pengaduan / Lacak Status Tiket →
          </button>
        </div>
      </section>

      {/* ============ 2. EXECUTIVE LIVE METRICS TICKER ============ */}
      <section style={{ marginBottom: '32px' }} id="statistik">
        <div className="stats">
          <div className="stat glow-card reveal">
            <div className="ic">🚀</div>
            <div className="n">≥ 2,50</div>
            <div className="l">Target Indeks Pemdi 2026</div>
          </div>

          <div className="stat glow-card reveal d1">
            <div className="ic">📊</div>
            <div className="n">{formatDesimal(spbe.indeks)}</div>
            <div className="l">Indeks SPBE 2025 (Cukup)</div>
          </div>

          <div className="stat glow-card reveal d2">
            <div className="ic">🏛️</div>
            <div className="n">{formatAngka(ringkasan.total_opd)}</div>
            <div className="l">52 Perangkat Daerah</div>
          </div>

          <div className="stat glow-card reveal d3">
            <div className="ic">📋</div>
            <div className="n">{formatAngka(totalLayanan)}</div>
            <div className="l">Layanan Terpadu SLA</div>
          </div>

          <div className="stat glow-card reveal d4">
            <div className="ic">👥</div>
            <div className="n">{formatAngka(ringkasan.total_asn)}</div>
            <div className="l">Jumlah SDM ASN</div>
          </div>
        </div>
      </section>

      {/* ============ 3. CITIZEN TASK HUB ("Apa yang Ingin Anda Lakukan Hari Ini?") ============ */}
      <section style={{ marginBottom: '44px' }} id="layanan-warga">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Akses Utama Warga</div>
            <h2>Apa yang ingin Anda lakukan hari ini?</h2>
            <p>Pilih tugas pelayanan utama untuk kemudahan warga Kabupaten Aceh Tengah.</p>
          </div>
        </div>

        <div className="qa-grid">
          <Link href="/layanan" className="qa-card glow-card reveal">
            <div className="ic" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>
              📋
            </div>
            <h3>Direktori Layanan Terpadu</h3>
            <p>{totalLayanan} layanan di {totalKategoriLayanan} sektor lengkap dengan syarat, biaya (Gratis), &amp; SLA waktu proses.</p>
            <span className="go">Buka Layanan →</span>
          </Link>

          <button
            type="button"
            className="qa-card glow-card reveal d1"
            onClick={() => window.dispatchEvent(new CustomEvent('pemdi:open-lapor'))}
            style={{ textAlign: 'left', font: 'inherit', background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="ic" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              💬
            </div>
            <h3>Pengaduan &amp; Tiket Lapor</h3>
            <p>Sampaikan keluhan atau saran dan dapatkan ID tiket pelacakan real-time (`LAPOR-20260715-XXXXXX`).</p>
            <span className="go">Buat Laporan / Lacak →</span>
          </button>

          <Link href="/skm" className="qa-card glow-card reveal d2">
            <div className="ic" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              📝
            </div>
            <h3>Survei Kepuasan (SKM)</h3>
            <p>Beri penilaian kualitas layanan publik (2 menit, anonim, terukur langsung pada Indeks IKM).</p>
            <span className="go">Isi Survei SKM →</span>
          </Link>

          <Link href="/faq" className="qa-card glow-card reveal d3">
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
      <section style={{ marginBottom: '48px' }}>
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">E-Services Explorer</div>
            <h2>Pencarian Layanan Publik Terpadu</h2>
            <p>Telusuri kepastian waktu (SLA), biaya, dan persyaratan layanan publik.</p>
          </div>
          <Link href="/layanan" className="link-more">
            Lihat Semua 25 Layanan →
          </Link>
        </div>

        <div className="glow-card reveal" style={{ padding: '24px' }}>
          <ServiceFinder layanan={layananData.kategori.flatMap((k) => k.layanan.map((l) => ({ ...l, kategori: k.nama })))} />
        </div>
      </section>

      {/* ============ 5. SPBE & PEMDI EXECUTIVE DASHBOARD ============ */}
      <section style={{ marginBottom: '48px' }} id="spbe-pemdi">
        <div className="sec-head reveal">
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
          {/* Donut Donut Gauge SPBE */}
          <div className="glow-card reveal" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
              📊 Donut Evaluation — Indeks SPBE 2025: {formatDesimal(spbe.indeks)}/5,00
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>
              Kategori: <strong>{spbe.kategori}</strong>. Target minimal kementerian: Level 3,00.
            </p>
            <SpbeGauge nilai={spbe.indeks} domain={spbe.domain} />
          </div>

          {/* 7 Aspek Pemdi Kematangan */}
          <div className="glow-card reveal d1" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
              🚀 Matrix Kematangan Pemdi 2026 (7 Aspek Utama)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '16px' }}>
              Berdasarkan evaluasi Indikator PermenPANRB 8/2026:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aspek.map((a) => (
                <div key={a.id} style={{ padding: '10px 12px', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>
                      {a.id}. {a.nama}
                    </span>
                    <span className="badge badge-blue">
                      Nilai: {formatDesimal(a.nilai)} / Target {formatDesimal(a.target)}
                    </span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (a.nilai / a.target) * 100)}%`,
                        background: a.nilai >= a.target ? 'var(--ok)' : 'var(--primary)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. PETA PROSES BISNIS (PPB) 3-LEVEL ============ */}
      <section style={{ marginBottom: '48px' }} id="probis">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Arsitektur Tata Kelola</div>
            <h2>Peta Proses Bisnis (PPB) Level 0, 1, dan 2</h2>
            <p>Penyusunan alur kerja lintas OPD sesuai PermenPANRB No. 19 Tahun 2018.</p>
          </div>
          <Link href="/probis" className="link-more">
            Eksplorasi Peta Lintas Fungsi (CFM) →
          </Link>
        </div>

        <div className="glow-card reveal" style={{ padding: '24px' }}>
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

      {/* ============ 7. LIVE PUBLIC SKM & CITIZEN SATISFACTION ============ */}
      <section style={{ marginBottom: '48px' }} id="skm-dashboard">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Indikator I20 PermenPANRB 8/2026</div>
            <h2>Hasil Live Survei Kepuasan Masyarakat (SKM)</h2>
            <p>Agregat penilaian kepuasan warga real-time dari seluruh unit pelayanan publik.</p>
          </div>
          <Link href="/dashboard-kepuasan" className="link-more">
            Buka Full Dashboard IKM →
          </Link>
        </div>

        <div className="glow-card reveal" style={{ padding: '24px' }}>
          <DashboardSKM />
        </div>
      </section>

      {/* ============ 8. DIRECTORY OF 52 PERANGKAT DAERAH ============ */}
      <section style={{ marginBottom: '48px' }} id="opd">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Direktori Pemda</div>
            <h2>52 Perangkat Daerah Kabupaten Aceh Tengah</h2>
            <p>Profil lengkap Sekretariat, Dinas, Badan, Inspektorat, Rumah Sakit, dan 14 Kecamatan.</p>
          </div>
        </div>

        <div className="reveal">
          <OPDTable list={opd.daftar} />
        </div>
      </section>
    </>
  );
}
