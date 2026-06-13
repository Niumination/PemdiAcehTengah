import Head from 'next/head';
import Link from 'next/link';
import OPDTable from '@/components/OPDTable';
import { formatAngka } from '@/lib/format';
import portalData from '@/data/opd.json';

export default function OPDIndex({ data }) {
  const opd = data.opd;
  const meta = data;

  /* Hitung statistik */
  const totalOPD = opd.daftar.length;
  const totalASN = opd.daftar.reduce((sum, d) => sum + (d.jumlah_asn || 0), 0);
  const kecamatan = opd.daftar.filter(d => d.jenis === 'kecamatan');
  const instansi = opd.daftar.filter(d => d.jenis !== 'kecamatan');

  return (
    <>
      <Head>
        <title>Perangkat Daerah — Pemdi Aceh Tengah</title>
        <meta name="description" content={`Daftar ${totalOPD} Perangkat Daerah Kabupaten Aceh Tengah — ${instansi.length} instansi dan ${kecamatan.length} kecamatan. Total ${formatAngka(totalASN)} ASN.`} />
      </Head>

      {/* HERO */}
      <section style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
            Perangkat Daerah Kabupaten Aceh Tengah
          </h1>
          <p style={{ fontSize: '0.9rem', opacity: 0.85, maxWidth: 600, lineHeight: 1.6, marginBottom: '1rem' }}>
            Daftar {totalOPD} Perangkat Daerah ({instansi.length} instansi + {kecamatan.length} kecamatan) yang telah diharmonisasikan dari data e-Keurani BKPSDM dan data SPBE Diskominfo.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="card" style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              textAlign: 'center',
              minWidth: 100,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalOPD}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Perangkat Daerah</div>
            </div>
            <div className="card" style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              textAlign: 'center',
              minWidth: 100,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatAngka(totalASN)}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total ASN</div>
            </div>
            <div className="card" style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              textAlign: 'center',
              minWidth: 100,
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{kecamatan.length}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Kecamatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* OPD TABLE */}
      <section style={{ marginBottom: '2rem' }}>
        <OPDTable data={data} />
      </section>

      {/* QUICK LINKS */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--ink)' }}>
          Jelajahi berdasarkan Level
        </h2>
        <div className="grid-2" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}>
          {[
            { label: 'Unsur Staf', count: instansi.filter(d => d.level === 'Staf').length, icon: '🏛️' },
            { label: 'Badan Daerah', count: instansi.filter(d => d.level === 'Badan').length, icon: '📊' },
            { label: 'Dinas Daerah', count: instansi.filter(d => d.level === 'Dinas').length, icon: '🏢' },
            { label: 'Lembaga Lain', count: instansi.filter(d => d.level === 'Lembaga').length, icon: '🏫' },
            { label: 'Kecamatan', count: kecamatan.length, icon: '🗺️' },
          ].map((g) => (
            <div key={g.label} className="card" style={{
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{g.count}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{g.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTNOTE */}
      <section style={{
        padding: '1.25rem',
        background: 'var(--surface)',
        borderRadius: 'var(--r-sm)',
        fontSize: '0.8rem',
        color: 'var(--muted)',
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        Sumber data: e-Keurani BKPSDM (data ASN) dan Diskominfo Aceh Tengah (data SPBE).
        Terakhir diperbarui: Juni 2025. Klik nama OPD untuk melihat detail lebih lanjut.
      </section>
    </>
  );
}

export function getStaticProps() {
  const data = JSON.parse(JSON.stringify(portalData));
  return { props: { data } };
}
