import Head from 'next/head';
import Link from 'next/link';
import OPDTable from '@/components/OPDTable';
import { MotifEmun, MotifTapak, KerawangDivider } from '@/components/motif/KerawangMotifs';
import { formatAngka } from '@/lib/format';
import portalData from '@/data/opd.json';
import layananData from '@/data/layanan.json';

/* Normalize OPD name for fuzzy matching */
function normalizeNama(nama) {
  return nama
    .toLowerCase()
    .replace(/\(.*?\)/g, '')    // hapus parenthetical: "(DPMPTSP)" → ""
    .replace(/[^a-z0-9 ]/g, '') // hapus karakter non-alfanumerik
    .replace(/\s+/g, ' ')       // normalize whitespace
    .trim();
}

function buildLayananCountMap(layanan) {
  const map = {};
  for (const kat of layanan.kategori) {
    const raw = kat.opd;
    const count = kat.layanan?.length || 0;
    if (count === 0) continue;

    if (raw === 'Semua Kecamatan') {
      map['__kecamatan__'] = (map['__kecamatan__'] || 0) + count;
    } else {
      const key = normalizeNama(raw);
      map[key] = (map[key] || 0) + count;
      // Add aliases for common naming mismatches
      if (key.includes('pengelola keuangan')) {
        map[key.replace('pengelola keuangan', 'pengelolaan keuangan')] = count;
      }
    }
  }
  return map;
}

export default function OPDIndex({ data, layananCountMap }) {
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
        <MotifEmun size={280} style={{ position: 'absolute', top: -18, right: 8, opacity: 0.5 }} />
        <MotifTapak size={90} style={{ position: 'absolute', bottom: -8, left: 18, opacity: 0.35 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="gold-head" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.2 }}>
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
        <OPDTable list={data.opd.daftar} layananCountMap={layananCountMap} />
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
  const layananCountMap = buildLayananCountMap(layananData);
  return { props: { data, layananCountMap } };
}
