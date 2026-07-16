import Head from 'next/head';
import Link from 'next/link';
import { formatAngka, formatDesimal, gabung } from '@/lib/format';
import portalData from '@/data/opd.json';
import slugify from '@/lib/slugify';

/* =============================================
   Slug helper — konsisten untuk getStaticPaths
   dan getStaticProps lookup
   ============================================= */

/* Mapping urusan → Misi (Level 0 PPB) */
const URUSAN_TO_MISI = {
  'Pendidikan':                              'Transformasi Sosial Budaya',
  'Syari\'at Islam dan Pendidikan Dayah':    'Transformasi Sosial Budaya',
  'Kesehatan':                               'Transformasi Sosial Budaya',
  'Sosial':                                  'Transformasi Sosial Budaya',
  'Pemberdayaan Perempuan dan Anak':         'Transformasi Sosial Budaya',
  'Kebudayaan dan Adat':                     'Transformasi Sosial Budaya',
  'Keagamaan':                               'Transformasi Sosial Budaya',
  'Pemberdayaan Masyarakat':                 'Transformasi Sosial Budaya',
  'Tenaga Kerja dan Transmigrasi':           'Transformasi Ekonomi',
  'Pangan':                                  'Transformasi Ekonomi',
  'Pertanian':                               'Transformasi Ekonomi',
  'Perdagangan dan Koperasi':                'Transformasi Ekonomi',
  'Perindustrian':                           'Transformasi Ekonomi',
  'Penanaman Modal':                         'Transformasi Ekonomi',
  'Kelautan dan Perikanan':                  'Transformasi Ekonomi',
  'Ketenteraman dan Ketertiban':             'Transformasi Tata Kelola',
  'Administrasi Kependudukan':               'Transformasi Tata Kelola',
  'Komunikasi dan Informatika':              'Transformasi Tata Kelola',
  'Kepegawaian':                             'Transformasi Tata Kelola',
  'Perencanaan Pembangunan':                 'Transformasi Tata Kelola',
  'Pengelolaan Keuangan':                    'Transformasi Tata Kelola',
  'Pengawasan':                              'Transformasi Tata Kelola',
  'Kesatuan Bangsa dan Politik':             'Transformasi Tata Kelola',
  'Penanggulangan Bencana':                  'Lingkungan Hidup dan Ketahanan Bencana',
  'Sekretariat Daerah':                      'Transformasi Tata Kelola',
  'Legislatif':                              'Transformasi Tata Kelola',
  'Pemerintahan Kecamatan':                  'Transformasi Tata Kelola',
  'Pekerjaan Umum dan Penataan Ruang':       'Infrastruktur dan Konektivitas',
  'Perumahan dan Permukiman':                'Infrastruktur dan Konektivitas',
  'Perhubungan':                             'Infrastruktur dan Konektivitas',
  'Pertanahan':                              'Infrastruktur dan Konektivitas',
  'Kepemudaan dan Olahraga':                 'Pariwisata dan Ekonomi Kreatif',
  'Pariwisata, Pemuda dan Olahraga':         'Pariwisata dan Ekonomi Kreatif',
  'Perpustakaan dan Kearsipan':              'Pendidikan dan Pelayanan Publik',
};

/* Cari urusan probis yang terkait dengan OPD ini */
function cariUrusanTerkait(probis, opdId) {
  return probis.level_1.urusan
    .filter((u) => u.opd_terkait.includes(opdId))
    .map((u) => u.nama);
}

/* Cari proses bisnis spesifik OPD dari Level 2 — opd_semua true atau opd_terkait includes opdId */
function cariProsesOPD(probis, opdId) {
  const hasil = [];
  probis.level_2.kategori.forEach((k) => {
    k.proses.forEach((p) => {
      if (p.opd_semua || (p.opd_terkait && p.opd_terkait.includes(opdId))) {
        hasil.push({ kategori: k.nama, warna: k.warna, icon: k.icon, ...p });
      }
    });
  });
  return hasil;
}

/* Cari OPD lain dengan level atau urusan yang sama */
function cariRelated(daftar, opd, limit = 6) {
  return daftar
    .filter((d) => d.id !== opd.id && (d.level === opd.level || d.urusan === opd.urusan))
    .slice(0, limit)
    .map((d) => ({ ...d, slug: slugify(d.nama) }));
}

/* =============================================
   LEVEL — icon & colour mapping
   ============================================= */
const LEVEL_META = {
  Staf:      { color: '#004098', icon: '🏛️', label: 'Staf Ahli/Setda' },
  Badan:     { color: '#0277bd', icon: '📊', label: 'Badan' },
  Dinas:     { color: '#2e7d32', icon: '🏢', label: 'Dinas' },
  Lembaga:   { color: '#e65100', icon: '🏫', label: 'Lembaga' },
  Kecamatan: { color: '#6a1b9a', icon: '📍', label: 'Kecamatan' },
};

/* =============================================
   PAGE COMPONENT
   ============================================= */
export default function OPDPage({ opd, urusanTerkait, probisMisi, relatedOpd, prosesOPD }) {
  if (!opd) {
    return (
      <div className="container section" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <h2>Perangkat Daerah Tidak Ditemukan</h2>
        <p style={{ color: 'var(--gray-600)' }}>
          OPD yang Anda cari tidak tersedia dalam basis data.
        </p>
        <Link href="/#opd" className="btn btn-primary mt-3">← Kembali ke Daftar</Link>
      </div>
    );
  }

  const levelMeta = LEVEL_META[opd.level] || { color: '#495057', icon: '📋', label: opd.level };
  const tipe = opd.jenis === 'kecamatan' ? 'Kecamatan' : 'Instansi Daerah';

  return (
    <>
      <Head>
        <title>{opd.nama} — Pemdi Aceh Tengah</title>
        <meta name="description" content={`${opd.nama} (${opd.singkat}) — ${opd.urusan}. ${opd.jumlah_asn > 0 ? `${formatAngka(opd.jumlah_asn)} ASN` : 'Data ASN belum tersedia'}. Peta Proses Bisnis Level 1–2.`} />
      </Head>

      {/* ============ HERO ============ */}
      <section className="hero opd-hero">
        <div className="container">
          <div className="hero-content">
            <Link href="/#opd" className="hero-back-link">← Daftar Perangkat Daerah</Link>
            <div className="hero-badge">🏛️ Detail Perangkat Daerah</div>
            <h1>{opd.nama}</h1>
            <p className="hero-subtitle">
              {opd.singkat !== opd.nama ? (
                <><strong>{opd.singkat}</strong> — {opd.urusan}</>
              ) : opd.urusan}
            </p>
            <div className="hero-tags flex flex-wrap gap-2" style={{ marginTop: '1.5rem' }}>
              <span className="badge" style={{
                background: `${levelMeta.color}18`,
                color: levelMeta.color,
                border: `1px solid ${levelMeta.color}40`,
              }}>
                {levelMeta.icon} {levelMeta.label}
              </span>
              <span className="badge badge-green">{opd.urusan}</span>
              <span className="badge" style={{
                background: tipe === 'Kecamatan' ? 'var(--warning-light)' : 'var(--primary-light)',
                color: tipe === 'Kecamatan' ? 'var(--warning)' : 'var(--primary)',
              }}>
                {tipe}
              </span>
              {opd.jumlah_asn > 0 && (
                <span className="badge badge-gray">
                  👥 {formatAngka(opd.jumlah_asn)} ASN
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============ INFO CARDS ============ */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {/* CARD 1: Identitas */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  📋
                </div>
                <h3>Identitas</h3>
              </div>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Nama Lengkap</td>
                    <td className="info-value">{opd.nama}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Singkatan</td>
                    <td className="info-value"><code>{opd.singkat}</code></td>
                  </tr>
                  <tr>
                    <td className="info-label">Level</td>
                    <td className="info-value"><span className="badge badge-blue">{opd.level}</span></td>
                  </tr>
                  <tr>
                    <td className="info-label">Jenis</td>
                    <td className="info-value">{tipe}</td>
                  </tr>
                  <tr>
                    <td className="info-label">ID OPD</td>
                    <td className="info-value"><code>OPD-{String(opd.id).padStart(2, '0')}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CARD 2: SDM & Urusan */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                  👥
                </div>
                <h3>SDM & Urusan</h3>
              </div>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Jumlah ASN</td>
                    <td className="info-value">
                      {opd.jumlah_asn > 0 ? (
                        <span className="stat-number">{formatAngka(opd.jumlah_asn)}</span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>—</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Urusan</td>
                    <td className="info-value" style={{ fontWeight: 500 }}>{opd.urusan}</td>
                  </tr>
                  <tr>
                    <td className="info-label">% ASN Daerah</td>
                    <td className="info-value">
                      {opd.jumlah_asn > 0 ? (
                        <span className="stat-number-sm">
                          {formatDesimal((opd.jumlah_asn / 4507) * 100, 1)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>—</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Sumber Data</td>
                    <td className="info-value" style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      e-Keurani BKPSDM — Mei 2026
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CARD 3: PPB Keterkaitan */}
            <div className="card">
              <div className="card-header">
                <div className="card-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
                  🔗
                </div>
                <h3>Keterkaitan PPB</h3>
              </div>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Urusan Terkait</td>
                    <td className="info-value">
                      {urusanTerkait.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {urusanTerkait.map((u, i) => (
                            <span key={i} className="badge badge-blue badge-sm">{u}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>—</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Misi Pendukung</td>
                    <td className="info-value">
                      {probisMisi ? (
                        <span className="badge badge-green badge-sm">{probisMisi}</span>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>—</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="info-label">Level PPB</td>
                    <td className="info-value">
                      <span className="badge badge-gray badge-sm">Level 0</span>
                      <span style={{ margin: '0 0.25rem', color: 'var(--gray-400)' }}>→</span>
                      <span className="badge badge-gray badge-sm">Level 1</span>
                      <span style={{ margin: '0 0.25rem', color: 'var(--gray-400)' }}>→</span>
                      <span className="badge badge-gray badge-sm">Level 2</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PPB HIERARCHY ============ */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Peta Proses Bisnis</h2>
            <p>
              Hierarki proses bisnis berdasarkan Permenpan 19/2018 — 
              keterkaitan {opd.nama} dalam ekosistem tata kelola Aceh Tengah
            </p>
          </div>

          <div className="grid grid-3 ppb-hierarchy">
            {/* Level 0 */}
            <div className="card ppb-card ppb-level-0">
              <div className="ppb-level-badge">Level 0</div>
              <h3>Visi & Misi</h3>
              <p className="ppb-label">Visi Daerah</p>
              <p className="ppb-value">"Aceh Tengah Islami, Maju, Sejahtera, dan Berkeadilan"</p>
              <div style={{ marginTop: '1rem' }}>
                <p className="ppb-label">Misi Terkait</p>
                {probisMisi ? (
                  <div className="ppb-misi-badge">{probisMisi}</div>
                ) : (
                  <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>—</span>
                )}
              </div>
            </div>

            {/* Level 1 */}
            <div className="card ppb-card ppb-level-1">
              <div className="ppb-level-badge">Level 1</div>
              <h3>Urusan Pemerintahan</h3>
              <p className="ppb-label">Urusan Utama</p>
              <p className="ppb-value">{opd.urusan}</p>
              {urusanTerkait.length > 1 && (
                <div style={{ marginTop: '1rem' }}>
                  <p className="ppb-label">Urusan Lain yang Terkait</p>
                  <div className="flex flex-wrap gap-1">
                    {urusanTerkait.filter(u => u !== opd.urusan).map((u, i) => (
                      <span key={i} className="badge badge-blue badge-sm">{u}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="ppb-footnote">Berdasarkan UU 23/2014 · Permenpan 19/2018</p>
            </div>

            {/* Level 2 */}
            <div className="card ppb-card ppb-level-2">
              <div className="ppb-level-badge">Level 2</div>
              <h3>Proses Bisnis OPD</h3>
              <p className="ppb-label">Total Proses Terkait</p>
              <p className="ppb-value" style={{ fontSize: '2rem' }}>{formatAngka(prosesOPD.length)}</p>
              <div className="flex flex-wrap gap-1" style={{ marginTop: '0.75rem' }}>
                {[...new Set(prosesOPD.map(p => p.kategori))].map(k => (
                  <span key={k} className="badge badge-sm" style={{
                    background: `${prosesOPD.find(p => p.kategori === k)?.warna}18`,
                    color: prosesOPD.find(p => p.kategori === k)?.warna,
                    border: `1px solid ${prosesOPD.find(p => p.kategori === k)?.warna}40`,
                  }}>
                    {k}
                  </span>
                ))}
              </div>
              <p className="ppb-footnote">Proses bisnis spesifik untuk {opd.singkat}</p>
            </div>
          </div>

          {/* Visual chain */}
          <div className="ppb-chain">
            <div className="ppb-chain-item">
              <div className="ppb-chain-circle">🎯</div>
              <span>Visi &amp; Misi</span>
            </div>
            <div className="ppb-chain-arrow">→</div>
            <div className="ppb-chain-item">
              <div className="ppb-chain-circle" style={{ background: 'var(--success)', color: 'white' }}>📋</div>
              <span>Urusan</span>
            </div>
            <div className="ppb-chain-arrow">→</div>
            <div className="ppb-chain-item">
              <div className="ppb-chain-circle" style={{ background: 'var(--warning)', color: 'white' }}>⚙️</div>
              <span>Proses Bisnis</span>
            </div>
            <div className="ppb-chain-arrow">→</div>
            <div className="ppb-chain-item">
              <div className="ppb-chain-circle ppb-chain-circle-active">
                {opd.singkat.substring(0, 2).toUpperCase()}
              </div>
              <strong>{opd.singkat}</strong>
            </div>
          </div>

          {/* Proses Bisnis Spesifik OPD */}
          {prosesOPD.length > 0 && (
            <>
              <div className="section-subheader" style={{ marginTop: '2.5rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
                  ⚙️ Proses Bisnis {opd.singkat}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', margin: '0.25rem 0 0' }}>
                  {formatAngka(prosesOPD.length)} proses bisnis spesifik berdasarkan tugas dan fungsi {opd.nama}
                </p>
              </div>
              <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                {prosesOPD.map((p, i) => (
                  <div key={i} className="card" style={{ padding: '1rem' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{p.icon}</span>
                      <span className="badge badge-sm" style={{
                        background: `${p.warna}18`, color: p.warna,
                        border: `1px solid ${p.warna}40`, fontSize: '0.625rem',
                      }}>
                        {p.kategori}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, margin: '0.375rem 0 0.25rem' }}>
                      {p.nama}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
                      <span style={{ fontWeight: 600 }}>Output:</span> {p.output}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center" style={{ marginTop: '1.5rem' }}>
                <a href="/probis#level-2" className="btn btn-outline btn-sm">
                  Lihat Semua Proses Bisnis →
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============ RELATED OPD ============ */}
      {relatedOpd.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Perangkat Daerah Terkait</h2>
              <p>
                {opd.level === 'Kecamatan'
                  ? `Kecamatan lain di Kabupaten Aceh Tengah`
                  : `OPD lain dengan level atau urusan yang sama`}
              </p>
            </div>
            <div className="grid grid-2">
              {relatedOpd.map((r) => (
                <Link
                  href={`/opd/${r.slug}`}
                  key={r.id}
                  className="card related-card"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-blue badge-sm">{r.level}</span>
                    <span className="badge badge-gray badge-sm">
                      {r.jenis === 'kecamatan' ? 'Kecamatan' : 'Instansi'}
                    </span>
                  </div>
                  <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{r.nama}</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                    {r.urusan}
                  </p>
                  <small style={{ color: 'var(--gray-500)' }}>
                    {r.jumlah_asn > 0 ? `👥 ${formatAngka(r.jumlah_asn)} ASN` : '—'}
                  </small>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FOOTER NAV ============ */}
      <section className="section section-alt" style={{ padding: '2rem 0' }}>
        <div className="container">
          <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <Link href="/#opd" className="btn btn-outline">
              ← Daftar Perangkat Daerah
            </Link>
            <Link href="/#probis" className="btn btn-outline">
              Peta Proses Bisnis →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* =============================================
   STATIC GENERATION — all 52 OPD paths
   ============================================= */
export async function getStaticPaths() {
  const { opd } = portalData;
  const paths = opd.daftar.map((d) => ({
    params: { slug: slugify(d.nama) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { opd: opdSection, probis } = portalData;

  const opd = opdSection.daftar.find((d) => slugify(d.nama) === params.slug);
  if (!opd) return { notFound: true };

  return {
    props: {
      opd,
      urusanTerkait: cariUrusanTerkait(probis, opd.id),
      probisMisi: URUSAN_TO_MISI[opd.urusan] || null,
      relatedOpd: cariRelated(opdSection.daftar, opd),
      prosesOPD: cariProsesOPD(probis, opd.id),
    },
  };
}
