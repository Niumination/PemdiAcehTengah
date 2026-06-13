import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import GlossaryTooltip from '@/components/GlossaryTooltip';
import OPDTable from '@/components/OPDTable';
import { formatAngka, formatDesimal } from '@/lib/format';
import portalData from '@/data/opd.json';
import pemdiData from '@/data/pemdi.json';

function getLevel(value) {
  if (value >= 3.0) return { color: 'var(--ok)', cls: 'st-ok', label: 'Baik' };
  if (value >= 2.0) return { color: 'var(--warn)', cls: 'st-warn', label: 'Cukup' };
  return { color: 'var(--bad)', cls: 'st-bad', label: 'Perlu perbaikan' };
}

const aspekIcons = {
  'Tata Kelola & Manajemen': '🏛️',
  'Penyelenggara / SDM Digital': '👩‍💻',
  'Data': '💾',
  'Keamanan Pemerintah Digital': '🔒',
  'Teknologi Pemerintah Digital': '⚙️',
  'Keterpaduan Layanan Digital': '🔗',
  'Kepuasan Pengguna Layanan Digital': '😊',
};

const aspekDesk = {
  'Tata Kelola & Manajemen': 'Aturan & cara mengelola transformasi secara terencana.',
  'Penyelenggara / SDM Digital': 'Kesiapan & keterampilan ASN menjalankan layanan digital.',
  'Data': 'Pengelolaan data: akurat, terbuka, dapat dipakai bersama.',
  'Keamanan Pemerintah Digital': 'Perlindungan sistem & data dari serangan/kebocoran.',
  'Teknologi Pemerintah Digital': 'Kesiapan aplikasi & infrastruktur pendukung Pemdi.',
  'Keterpaduan Layanan Digital': 'Seberapa nyambung antar-sistem agar data tak terpisah.',
  'Kepuasan Pengguna Layanan Digital': 'Seberapa puas warga pada layanan digital (dari survei SKM).',
};

const aspekSingkat = {
  'Tata Kelola & Manajemen': 'Tata Kelola',
  'Penyelenggara / SDM Digital': 'SDM Digital',
  'Data': 'Data',
  'Keamanan Pemerintah Digital': 'Keamanan',
  'Teknologi Pemerintah Digital': 'Teknologi',
  'Keterpaduan Layanan Digital': 'Keterpaduan',
  'Kepuasan Pengguna Layanan Digital': 'Kepuasan',
};

const domainNames = {
  kebijakan_spbe: 'Kebijakan SPBE',
  tata_kelola_spbe: 'Tata Kelola',
  manajemen_spbe: 'Manajemen',
  layanan_spbe: 'Layanan SPBE',
};

export default function Home({ data }) {
  const opd = data.opd;
  const spbe = data.spbe;
  const ringkasan = opd.ringkasan;
  const totalLayananOpd = 27;
  const rekomendasi = data.rekomendasi || [];
  const aspek = pemdiData.aspek || [];

  // Scroll reveal — progressive enhancement
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
    // Failsafe: reveal everything after 1.2s
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
    }, 1200);
  }, []);

  return (
    <>
      <Head>
        <title>Portal Digital Kabupaten Aceh Tengah — Pemdi Aceh Tengah</title>
        <meta name="description" content="Portal Pemerintah Digital Kabupaten Aceh Tengah. Informasi layanan publik, indeks SPBE & Pemdi, dan partisipasi warga dalam satu portal." />
      </Head>

      <a href="#main-content" className="skip-link">Lompat ke konten utama</a>

      {/* ===== 1. HERO ===== */}
      <section
        className="hero reveal"
        id="main-content"
        style={{ background: 'var(--hero-award-gradient)' }}
      >
        <span className="pill">🏛️ Portal Resmi Pemerintah Kabupaten Aceh Tengah</span>
        <h1>Pelayanan publik yang transparan, cepat, dan mudah diakses</h1>
        <p>
          Informasi layanan publik, indeks <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> &{' '}
          <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>, dan partisipasi warga dalam satu portal.
        </p>
        <div className="cta">
          <Link href="/layanan" className="hbtn solid">📋 Cari Layanan Publik</Link>
          <Link href="/tanya" className="hbtn ghost">📝 Sampaikan Laporan →</Link>
        </div>
      </section>

      {/* ===== 2. EXPLAINER ===== */}
      <section className="blk" id="tentang-pemdi">
        <div className="explainer reveal">
          <span className="qmark">?</span>
          <div>
            <b>Apa itu Pemerintah Digital (<GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>)?</b>
            <p>
              Singkatnya: upaya pemerintah daerah <b>memindahkan layanan & tata kelola ke sistem digital</b> agar pelayanan lebih cepat, hemat, dan terbuka untuk warga.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 3. STAT STRIP ===== */}
      <section className="blk" id="statistik">
        <div className="stats">
        <div className="stat glow-card reveal">
          <div className="ic">🏛️</div>
          <div className="n">{formatAngka(ringkasan.total_opd)}</div>
          <div className="l">Perangkat Daerah</div>
        </div>
        <div className="stat glow-card reveal d1">
          <div className="ic">📍</div>
          <div className="n">{formatAngka(ringkasan.kecamatan)}</div>
          <div className="l">Kecamatan</div>
        </div>
        <div className="stat glow-card reveal d2">
          <div className="ic">📋</div>
          <div className="n">{formatAngka(totalLayananOpd)}</div>
          <div className="l">Layanan Publik</div>
        </div>
        <div className="stat glow-card reveal d3">
          <div className="ic">📊</div>
          <div className="n">{formatDesimal(spbe.indeks)}</div>
          <div className="l">Indeks <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> 2025</div>
        </div>
        <div className="stat glow-card reveal d4">
          <div className="ic">👥</div>
          <div className="n">{formatAngka(ringkasan.total_asn)}</div>
          <div className="l">Jumlah ASN</div>
        </div>
      </div></section>

      {/* ===== 4. APA YANG INGIN ANDA LAKUKAN? ===== */}
      <section className="blk" id="layanan">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Untuk Warga</div>
            <h2>Apa yang ingin Anda lakukan hari ini?</h2>
            <p>Akses cepat ke hal yang paling sering dibutuhkan masyarakat.</p>
          </div>
        </div>
        <div className="qa-grid">
          <Link href="/layanan" className="qa-card glow-card reveal" style={{ textDecoration: 'none' }}>
            <div className="ic" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>📋</div>
            <h3>Direktori Layanan</h3>
            <p>27 layanan, 7 kategori — syarat, biaya, & waktu proses.</p>
            <span className="go">Jelajahi →</span>
          </Link>
          <Link href="/skm" className="qa-card glow-card reveal d1" style={{ textDecoration: 'none' }}>
            <div className="ic" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>📝</div>
            <h3>Survei Kepuasan</h3>
            <p>Beri nilai pelayanan (2 menit, anonim).</p>
            <span className="go">Isi survei →</span>
          </Link>
          <Link href="/tanya" className="qa-card glow-card reveal d2" style={{ textDecoration: 'none' }}>
            <div className="ic" style={{ background: 'color-mix(in srgb, #8b5cf6 16%, var(--surface))', color: '#8b5cf6' }}>💬</div>
            <h3>Lapor / Saran</h3>
            <p>Sampaikan keluhan atau saran, dapat nomor tiket.</p>
            <span className="go">Buat laporan →</span>
          </Link>
          <Link href="/faq" className="qa-card glow-card reveal d3" style={{ textDecoration: 'none' }}>
            <div className="ic" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>❓</div>
            <h3>Tanya & FAQ</h3>
            <p>Jawaban cepat seputar layanan & portal.</p>
            <span className="go">Lihat FAQ →</span>
          </Link>
        </div>
      </section>

      {/* ===== 5. INDEKS SPBE ===== */}
      <section className="blk" id="spbe">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Transparansi Kinerja</div>
            <h2>Indeks <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> 2025</h2>
            <p>Nilai resmi dari Kementerian PANRB yang mengukur kematangan layanan digital. Skala 1–5; target minimal Level 3.</p>
          </div>
          <Link href="/pemdi" className="link-more">Dashboard Pemdi →</Link>
        </div>
        <div className="grid-2">
          {/* Gauge */}
          <div className="card gauge-card reveal">
            <div className="gauge">
              <svg width="210" height="210" viewBox="0 0 210 210">
                <circle cx="105" cy="105" r="88" fill="none" stroke="var(--bg-2)" strokeWidth="18" />
                <circle
                  className="ring"
                  cx="105" cy="105" r="88"
                  fill="none"
                  stroke={spbe.indeks >= 3.5 ? 'var(--ok)' : spbe.indeks >= 2.5 ? 'var(--warn)' : 'var(--bad)'}
                  strokeWidth="18"
                  strokeLinecap="round"
                  transform="rotate(-90 105 105)"
                  style={{ strokeDasharray: `${(spbe.indeks / 5) * 553} 553` }}
                />
              </svg>
              <div className="ctr">
                <div className="v">{formatDesimal(spbe.indeks)}</div>
                <div className="mx2">dari 5,00</div>
              </div>
            </div>
            <span className={`chip-status ${spbe.indeks >= 3.5 ? 'st-ok' : spbe.indeks >= 2.5 ? 'st-warn' : 'st-bad'}`}>
              Predikat: {spbe.kategori}
            </span>
            <div className="howread">
              <span className="k"><span className="dot" style={{ background: 'var(--ok)' }}></span> Baik</span>
              <span className="k"><span className="dot" style={{ background: 'var(--warn)' }}></span> Cukup</span>
              <span className="k"><span className="dot" style={{ background: 'var(--bad)' }}></span> Perlu perbaikan</span>
            </div>
          </div>
          {/* Domain bars */}
          <div className="domains">
            {Object.entries(spbe.domain).map(([key, val], i) => {
              const pct = (val / 5) * 100;
              const lvl = getLevel(val);
              return (
                <div className={`dom reveal${i > 0 ? ` d${i}` : ''}`} key={key}>
                  <div className="top">
                    <span className="name">{domainNames[key] || key}</span>
                    <span className="val" style={{ color: lvl.color }}>{formatDesimal(val)}</span>
                  </div>
                  <div className="bar"><i style={{ width: `${pct}%`, background: lvl.color }}></i></div>
                  <small>Target Level 3 (60%)</small>
                </div>
              );
            })}
            <div className="howread" style={{ gridColumn: '1 / -1', marginTop: 0 }}>
              💡 <b>Cara baca:</b> makin tinggi makin baik. Hijau = baik, kuning = cukup, merah = perlu perbaikan.
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. INDEKS PEMDI ===== */}
      <section className="blk" id="pemdi">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Transformasi 2026</div>
            <h2>Indeks Pemerintah Digital (<GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>)</h2>
            <p>Penilaian baru pengganti SPBE (Permenpan 8/2026). 7 aspek, bobot terbesar pada kepuasan pengguna. Baseline estimasi → target {formatDesimal(pemdiData.target_indeks)}.</p>
          </div>
          <Link href="/pemdi" className="link-more">Dashboard lengkap →</Link>
        </div>
        <div className="aspects">
          {aspek.map((a, i) => {
            const lvl = getLevel(a.nilai);
            const isBest = a.id === 7;
            const delay = i > 0 ? `d${(i % 3) + 1}` : '';
            return (
              <div
                className={`aspect${isBest ? ' feat' : ''} glow-card reveal${delay ? ' ' + delay : ''}`}
                key={a.id}
              >
                <div className="topbar2" style={{ background: lvl.color }}></div>
                {isBest && <span className="star">⭐</span>}
                <div className="hd">
                  <div className="ic" style={{ background: `${a.warna}22`, color: a.warna }}>
                    {aspekIcons[a.nama] || '📊'}
                  </div>
                  <div className="meta">
                    <h3>{aspekSingkat[a.nama] || a.nama}</h3>
                    <span className="wt">Bobot {a.bobot}%</span>
                  </div>
                </div>
                <p>{aspekDesk[a.nama] || a.deskripsi}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="sc" style={{ color: lvl.color }}>{formatDesimal(a.nilai)}</span>
                  <span className={`chip-status ${lvl.cls}`}>{lvl.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== 7. PETA PROSES BISNIS ===== */}
      <section className="blk" id="probis">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Tata Kelola</div>
            <h2>Peta Proses Bisnis</h2>
            <p>
              Berdasarkan Permenpan 19/2018 — 34 urusan, 78 proses bisnis. Diagram hubungan kerja yang efektif dan efisien antar unit organisasi.
            </p>
          </div>
          <Link href="/probis" className="link-more">Lihat detail →</Link>
        </div>

        <details className="acc reveal" open>
          <summary>
            <span className="ico">🗺️</span>
            Apa itu <GlossaryTooltip id="ppb">Peta Proses Bisnis (PPB)</GlossaryTooltip>?
            <span className="chev">▾</span>
          </summary>
          <div className="body">
            Peta yang menunjukkan <b>bagaimana antar-unit pemerintah bekerja sama</b> menghasilkan layanan — agar efisien, tidak tumpang tindih, dan jelas penanggung jawabnya. Tersusun dalam 3 level sesuai Permenpan 19/2018.
          </div>
        </details>

        <details className="acc reveal d1">
          <summary>
            <span className="ico">📚</span>
            34 Urusan Pemerintahan (konkuren)
            <span className="chev">▾</span>
          </summary>
          <div className="body">
            Dasar dari seluruh layanan pemerintah daerah. 34 urusan konkuren + 6 fungsi penunjang.
            <div className="tags">
              {['Pendidikan', 'Kesehatan', 'Pekerjaan Umum', 'Sosial', 'Pangan', 'Lingkungan Hidup', 'Adminduk', 'Pertanian', 'Perdagangan', 'Pariwisata', 'Perhubungan', 'Koperasi', 'Perikanan', '+21 lainnya'].map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </details>

        <details className="acc reveal d2">
          <summary>
            <span className="ico">⚙️</span>
            Level Proses (Perencanaan → Pengawasan)
            <span className="chev">▾</span>
          </summary>
          <div className="body">
            <b>6 kategori proses bisnis</b> yang mencakup seluruh siklus tata kelola:
            Perencanaan (4) · Pelaksanaan (47) · Penganggaran (3) · Monitoring & Evaluasi (4) · Pelayanan Publik (14) · Pengawasan (6).
          </div>
        </details>

        <details className="acc reveal d3">
          <summary>
            <span className="ico">💡</span>
            Ringkasan — 34 urusan, 78 proses bisnis
            <span className="chev">▾</span>
          </summary>
          <div className="body">
            <p style={{ marginBottom: '0.5rem' }}>
              Peta Proses Bisnis Kabupaten Aceh Tengah disusun dengan 3 level:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8 }}>
              <li><strong>Level 0</strong> — Visi & 8 Misi Pembangunan Daerah</li>
              <li><strong>Level 1</strong> — 34 Urusan Konkuren Pemerintahan</li>
              <li><strong>Level 2</strong> — 78 Proses Bisnis (6 kategori) dari 52 OPD</li>
            </ul>
          </div>
        </details>
      </section>

      {/* ===== 8. PERANGKAT DAERAH ===== */}
      <section className="blk" id="opd">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Profil Pemerintahan</div>
            <h2>Perangkat Daerah</h2>
            <p>
              {formatAngka(ringkasan.total_opd)} organisasi: dinas, badan, lembaga, sekretariat &{' '}
              {formatAngka(ringkasan.kecamatan)} kecamatan. Total {formatAngka(ringkasan.total_asn)} ASN.
            </p>
          </div>
        </div>
        <OPDTable data={data} />
      </section>

      {/* ===== 9. ROADMAP ===== */}
      <section className="blk" id="roadmap">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Rencana Strategis</div>
            <h2>Roadmap Pemerintah Digital</h2>
            <p>
              Langkah menuju Indeks <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip> ≥{' '}
              {formatDesimal(pemdiData.target_indeks)} (Baik) berdasarkan baseline SPBE 2025 & Permenpan 8/2026.
            </p>
          </div>
        </div>
        <div className="roadmap">
          <div className="phase active glow-card reveal">
            <div className="pn">1</div>
            <h4>Audit & Baseline Pemdi</h4>
            <p>Audit kesenjangan, baseline seluruh 20 indikator, pembentukan tim Pemdi.</p>
            <span className="when">● Q3 2026 — Sedang berjalan</span>
          </div>
          <div className="phase glow-card reveal d1">
            <div className="pn">2</div>
            <h4>Keterpaduan Proses</h4>
            <p>Integrasi aplikasi, API Gateway, penyelarasan PPB lintas OPD.</p>
            <span className="when">Q4 2026–Q1 2027</span>
          </div>
          <div className="phase glow-card reveal d2">
            <div className="pn">3</div>
            <h4>Data & Keamanan</h4>
            <p>Penerapan PDP, keamanan siber, kriptografi, interoperabilitas data.</p>
            <span className="when">2027</span>
          </div>
          <div className="phase glow-card reveal d3">
            <div className="pn">4</div>
            <h4>Pemdi Baik (2,50+)</h4>
            <p>Target seluruh aspek ≥ Level 3, indeks Pemdi minimal 2,50 (Baik).</p>
            <span className="when">2028</span>
          </div>
        </div>
        <div
          className="card"
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            marginTop: '1rem',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
            🎯 <strong>Target Pemdi 2028:</strong> Berdasarkan Perpres 12/2025 tentang RPJMN 2025–2029, transformasi{' '}
            <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> ke <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>{' '}
            menjadi prioritas nasional. Kab. Aceh Tengah menargetkan Indeks Pemdi ≥{' '}
            <strong>{formatDesimal(pemdiData.target_indeks)} (Baik)</strong> pada tahun 2028.
          </p>
        </div>
      </section>

      {/* ===== 10. REKOMENDASI TRANSFORMASI ===== */}
      <section className="blk" id="rekomendasi">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Prioritas</div>
            <h2>Rekomendasi Transformasi</h2>
            <p>
              {rekomendasi.length} rekomendasi berdasarkan kesenjangan (gap) terhadap target{' '}
              <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>.
            </p>
          </div>
        </div>
        <div className="recs">
          {rekomendasi.map((r, i) => (
            <div className={`rec glow-card reveal${i > 0 ? ` d${Math.min(i, 4)}` : ''}`} key={r.prioritas}>
              <div className="pr">{r.prioritas}</div>
              <div>
                <h4>{r.judul}</h4>
                <p>{r.deskripsi}</p>
                <div className="mt">
                  <span className={`mtag ${r.dampak === 'Tinggi' ? 'mt-hi' : 'mt-md'}`}>
                    Dampak {r.dampak}
                  </span>
                  <span className={`mtag ${r.kesulitan === 'Tinggi' ? 'mt-hi' : 'mt-md'}`}>
                    {r.kesulitan}
                  </span>
                  <span className="mtag mt-t">{r.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 11. TENTANG PORTAL INI ===== */}
      <section className="blk" id="tentang">
        <div className="sec-head reveal">
          <div>
            <div className="eyebrow">Informasi</div>
            <h2>Tentang Portal Ini</h2>
          </div>
        </div>
        <div className="about">
          <div className="ab glow-card reveal">
            <div className="ic">🎯</div>
            <h4>Target Pengguna</h4>
            <p>
              Publik & Internal Pemerintah — transparansi untuk warga, alat bantu transformasi bagi ASN.
            </p>
          </div>
          <div className="ab glow-card reveal d1">
            <div className="ic">📋</div>
            <h4>Narasumber Data</h4>
            <p>
              Diskominfo Kab. Aceh Tengah sebagai Walidata — data perangkat daerah berdasarkan surat resmi
              14 Januari 2026.
            </p>
          </div>
          <div className="ab glow-card reveal d2">
            <div className="ic">🌐</div>
            <h4>Model & Lisensi</h4>
            <p>
              Open Source Government Technology — Lisensi MIT. Dibangun dengan Next.js, di-deploy di Vercel.
            </p>
          </div>
        </div>
      </section>

      <footer className="ft">
        <span>© 2026 Pemdi Aceh Tengah · Lisensi MIT</span>
        <span>Dibangun dengan Next.js · Deploy di Vercel</span>
      </footer>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      data: portalData,
    },
  };
}
