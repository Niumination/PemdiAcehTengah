import { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Section from '@/components/Section';
import Explainer from '@/components/Explainer';
import Accordion from '@/components/Accordion';
import Stepper from '@/components/Stepper';
import GlossaryTooltip from '@/components/GlossaryTooltip';
import SpbeGauge from '@/components/SpbeGauge';
import OPDTable from '@/components/OPDTable';
import ProbisSection from '@/components/ProbisSection';
import DataBadge from '@/components/DataBadge';
import { formatAngka, formatDesimal } from '@/lib/format';
import portalData from '@/data/opd.json';
import layananData from '@/data/layanan.json';

export default function Home({ data }) {
  const opd = data.opd;
  const spbe = data.spbe;
  const ringkasan = opd.ringkasan;
  const totalLayanan = layananData.ringkasan?.total_layanan || 27;

  return (
    <>
      <Head>
        <title>Portal Digital Kabupaten Aceh Tengah — Pemdi Aceh Tengah</title>
        <meta name="description" content="Portal Pemerintah Digital Kabupaten Aceh Tengah. Informasi layanan publik, indeks SPBE & Pemdi, dan partisipasi warga dalam satu portal." />
      </Head>

      {/* ============ SKIP LINK ============ */}
      <a href="#main-content" className="skip-link">Lompat ke konten utama</a>

      {/* ============ 1. HERO ============ */}
      <section className="hero" id="main-content" style={{
        background: 'linear-gradient(135deg, #004098 0%, #002060 100%)',
        color: 'white',
        padding: '3.5rem 0',
        textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Portal Digital Kabupaten Aceh Tengah
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Informasi layanan publik, indeks <GlossaryTooltip id="spbe">SPBE</GlossaryTooltip> & <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip>, dan partisipasi warga dalam satu portal.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/layanan" className="btn btn-white btn-lg" style={{ background: 'white', color: '#004098', fontWeight: 600, padding: '0.625rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9375rem' }}>
              📋 Lihat Layanan
            </Link>
            <Link href="/skm" className="btn btn-outline btn-lg" style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white', fontWeight: 600, padding: '0.625rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9375rem' }}>
              📝 Isi Survei
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 2. EXPLAINER PEMDI ============ */}
      <section className="section" style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <Explainer term="Pemerintah Digital (Pemdi)?">
            <p>
              Pemerintah Digital (Pemdi) adalah upaya pemerintah daerah memindahkan layanan dan urusan internal ke sistem digital — supaya pelayanan lebih cepat, hemat, dan transparan. Kab. Aceh Tengah menerapkannya lewat portal ini.
            </p>
          </Explainer>
        </div>
      </section>

      {/* ============ 3. STATISTIK KUNCI ============ */}
      <section className="section" style={{ paddingTop: '0.5rem', paddingBottom: '1.5rem' }}>
        <div className="container">
          <div className="grid grid-5" style={{ gap: '0.75rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#004098' }}>{formatAngka(ringkasan.total_opd)}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Perangkat Daerah</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#004098' }}>{formatAngka(ringkasan.kecamatan)}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Kecamatan</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#004098' }}>{formatAngka(totalLayanan)}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Layanan Publik</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e65100' }}>{formatDesimal(spbe.indeks)}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>Indeks SPBE</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem 0.75rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#004098' }}>{formatAngka(ringkasan.total_asn)}</div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>ASN</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 4. APA YANG INGIN ANDA LAKUKAN HARI INI? ============ */}
      <section className="section section-alt" style={{ padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 700 }}>Apa yang ingin Anda lakukan hari ini?</h2>
          </div>
          <div className="grid grid-3" style={{ gap: '1rem' }}>
            <Link href="/layanan" className="card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'block', transition: 'transform 0.15s, box-shadow 0.15s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111' }}>Direktori Layanan</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>Cari layanan publik, cek biaya & SLA</p>
            </Link>
            <Link href="/skm" className="card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'block', transition: 'transform 0.15s, box-shadow 0.15s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📝</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111' }}>Survei Kepuasan</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>Beri penilaian atas pelayanan yang Anda terima</p>
            </Link>
            <Link href="/tanya" className="card" style={{ textDecoration: 'none', padding: '1.5rem', display: 'block', transition: 'transform 0.15s, box-shadow 0.15s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.375rem', color: '#111' }}>Lapor atau Tanya</h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>Sampaikan aspirasi, keluhan, atau pertanyaan</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 5. INDEKS SPBE ============ */}
      <Section
        id="spbe"
        title="Indeks SPBE 2025"
        subtitle="Hasil Pemantauan Sistem Pemerintahan Berbasis Elektronik (SPBE) Kabupaten Aceh Tengah oleh Kementerian PANRB."
      >
        <SpbeGauge data={data} />
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.75rem', textAlign: 'center' }}>
          💡 Cara baca: makin tinggi makin baik. Hijau=baik, kuning=cukup, merah=perlu perbaikan.
        </p>
      </Section>

      {/* ============ 6. PETA PROSES BISNIS ============ */}
      <Section
        id="probis"
        title="Peta Proses Bisnis"
        subtitle="Berdasarkan Peraturan Menteri PANRB Nomor 19 Tahun 2018. Diagram hubungan kerja yang efektif dan efisien antar unit organisasi."
        className="section-alt"
      >
        <Accordion title="💡 Ringkasan — 34 urusan pemerintahan, 78 proses bisnis" open={false}>
          <p style={{ fontSize: '0.875rem', color: '#333', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Peta Proses Bisnis (<GlossaryTooltip id="ppb">PPB</GlossaryTooltip>) Kabupaten Aceh Tengah disusun dalam 3 level sesuai Permenpan 19/2018:
          </p>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#333', lineHeight: 1.8 }}>
            <li><strong>Level 0</strong> — Visi & 8 Misi Pembangunan Daerah</li>
            <li><strong>Level 1</strong> — 34 Urusan Konkuren Pemerintahan</li>
            <li><strong>Level 2</strong> — 78 Proses Bisnis (6 kategori) dari 47 OPD</li>
          </ul>
        </Accordion>
        <div style={{ marginTop: '1rem' }}>
          <ProbisSection data={data} />
        </div>
      </Section>

      {/* ============ 7. PERANGKAT DAERAH ============ */}
      <Section
        id="opd"
        title="Perangkat Daerah"
        subtitle={`${formatAngka(ringkasan.instansi)} instansi dan ${formatAngka(ringkasan.kecamatan)} kecamatan di lingkungan Pemerintah Kabupaten Aceh Tengah.`}
      >
        <OPDTable data={data} />
      </Section>

      {/* ============ 8. REKOMENDASI / ROADMAP ============ */}
      <Section
        id="roadmap"
        title="Roadmap Pemerintah Digital"
        subtitle="Langkah strategis menuju Indeks Pemdi ≥ 2,50 (Baik) berdasarkan analisis baseline SPBE 2025 dan kerangka Permenpan 8/2026."
        className="section-alt"
      >
        <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
          <div>
            <Stepper
              steps={[
                { title: 'Q3 2026 — Audit & Baseline Pemdi', desc: 'Audit kesenjangan, baseline seluruh 20 indikator, pembentukan tim Pemdi', status: 'aktif' },
                { title: 'Q4 2026–Q1 2027 — Keterpaduan Proses', desc: 'Integrasi aplikasi, API Gateway, penyelarasan PPB lintas OPD', status: 'berikutnya' },
                { title: '2027 — Data & Keamanan', desc: 'Penerapan PDP, keamanan siber, kriptografi, interoperabilitas data', status: 'berikutnya' },
                { title: '2028 — Pemdi Baik (2,50+)', desc: 'Target seluruh aspek ≥ Level 3, indeks Pemdi minimal 2,50 (Baik)', status: 'berikutnya' },
              ]}
            />
          </div>
          <div>
            <div className="card" style={{ padding: '1.25rem', background: '#004098', color: 'white', border: 'none' }}>
              <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1rem' }}>🎯 Target Pemdi 2028</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: 0 }}>
                Berdasarkan Perpres 12/2025 tentang RPJMN 2025–2029, transformasi SPBE ke <GlossaryTooltip id="pemdi">Pemdi</GlossaryTooltip> menjadi prioritas nasional. Kab. Aceh Tengah menargetkan Indeks Pemdi ≥ <strong>2,50 (Baik)</strong> pada tahun 2028.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ 9. TENTANG PORTAL INI ============ */}
      <Section id="tentang" title="Tentang Portal Ini">
        <div className="grid grid-3" style={{ gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>Target Pengguna</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
              Publik & Internal Pemerintah. Transparansi tata kelola untuk masyarakat, dan alat bantu transformasi digital bagi ASN.
            </p>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>Narasumber Data</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
              <strong>Diskominfo Kab. Aceh Tengah</strong> — sebagai Walidata. Data perangkat daerah berdasarkan surat resmi 14 Januari 2026.
            </p>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌐</div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.5rem' }}>Model & Lisensi</h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
              Open Source Government Technology. Lisensi <strong>MIT</strong> — bebas digunakan, dimodifikasi, dan didistribusikan.
            </p>
          </div>
        </div>
      </Section>

      <style jsx>{`
        .grid-5 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .section-alt {
          background: var(--bg, #f0f3f5);
        }
        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
          .grid-5 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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
