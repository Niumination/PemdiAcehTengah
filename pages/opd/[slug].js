import Head from 'next/head';
import Link from 'next/link';
import { formatAngka } from '@/lib/format';
import portalData from '@/data/opd.json';
import slugify from '@/lib/slugify';
import { useMemo } from 'react';
import { useRK } from '@/components/rk/RKShell';
import PanelLipat from '@/components/rk/PanelLipat';
import Ikon from '@/components/ui/Ikon';
import StatusIkon from '@/components/ui/StatusIkon';
import { antreanUntukOPD } from '@/lib/ruangKendali';
import { LEVEL_RK } from './index';

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
   PAGE — profil OPD gaya Ruang Kendali (Patch 11, Tahap 3b)
   Baris situasi · strip butir Pemdi milik OPD (dari antrean RK, klik → Drawer) ·
   Peta proses bisnis ringkas (L0 misi → L1 urusan → L2 proses) · OPD terkait.
   ============================================= */

const PRIO = ['tinggi', 'sedang', 'rendah'];

export default function OPDPage({ opd, urusanTerkait, probisMisi, relatedOpd, prosesOPD }) {
  const rk = useRK();
  const butir = useMemo(() => (opd && rk?.data?.antrean ? antreanUntukOPD(rk.data.antrean, opd) : []), [rk, opd]);
  if (!opd) {
    return (
      <div className="rk-grid"><section className="rk-panel"><h2>Perangkat daerah tidak ditemukan</h2><p className="muted">OPD yang Anda cari tidak tersedia dalam basis data. <Link href="/opd">← Daftar perangkat daerah</Link></p></section></div>
    );
  }
  const lv = LEVEL_RK[opd.level] || { warna: 'var(--rk-ink-2)', label: opd.level };
  const tipe = opd.jenis === 'kecamatan' ? 'Kecamatan' : 'Instansi daerah';
  const perPrio = PRIO.map((p) => ({ p, n: butir.filter((b) => b.prioritas === p).length }));
  const perInd = Object.entries(butir.reduce((m, b) => { m[b.indikatorId] = (m[b.indikatorId] || 0) + 1; return m; }, {})).sort((x, y) => y[1] - x[1]);
  const kategoriProses = [...new Set(prosesOPD.map((p) => p.kategori))];
  return (
    <>
      <Head>
        <title>{`${opd.nama} — Dashboard Pemerintah Digital Aceh Tengah`}</title>
        <meta name="description" content={`${opd.nama} (${opd.singkat}) — ${opd.urusan}. ${opd.jumlah_asn > 0 ? `${formatAngka(opd.jumlah_asn)} ASN` : 'Data ASN belum tersedia'}. Butir bukti Pemdi yang menjadi tanggung jawab, peta proses bisnis L0–L2.`} />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Profil perangkat daerah">
          <div className="lead">
            <div className="lbl"><Link href="/opd" style={{ color: 'inherit' }}>← Perangkat daerah</Link> · {tipe}</div>
            <div className="val" style={{ fontSize: 'var(--rk-fs-5, 24px)', lineHeight: 1.2 }}>{opd.nama}</div>
            <div className="sub"><b style={{ color: lv.warna }}>{lv.label}</b> · {opd.singkat} · {opd.urusan}{opd.jumlah_asn > 0 ? ` · ${formatAngka(opd.jumlah_asn)} ASN` : ''}</div>
          </div>
          <div><div className="lbl">Butir Pemdi yang menyebut OPD ini</div><div className="val">{butir.length}<small>butir</small></div><div className="sub">{perPrio.map((x) => `${x.n} ${x.p}`).join(' · ')}</div></div>
          <div><div className="lbl">Indikator terkait</div><div className="val">{perInd.length}</div><div className="sub">{perInd.slice(0, 6).map(([i, n]) => `${i} (${n})`).join(' · ') || '—'}</div></div>
          <div><div className="lbl">Proses bisnis L2</div><div className="val">{formatAngka(prosesOPD.length)}</div><div className="sub">{kategoriProses.length} kategori · urusan {urusanTerkait.length}</div></div>
          <div><div className="lbl">Misi RPJMD terkait</div><div className="val" style={{ fontSize: 'var(--rk-fs-3)' }}>{probisMisi || '—'}</div><div className="sub">Level 0 · Visi & Misi 2025–2029</div></div>
        </section>

        <PanelLipat id={`opd-butir-${opd.id}`} className="rk-c8" judul="Butir bukti Pemdi yang menjadi tanggung jawab" ringkas={`· ${butir.length} butir`} aksi={<Link className="rk-act" href="/antrean">Antrean lengkap →</Link>}>
          {!rk?.data ? <p className="faint">Memuat…</p> : butir.length === 0 ? (
            <p className="muted" style={{ margin: 0 }}>Belum ada catatan mandiri yang menyebut {opd.singkat} sebagai PJ. Bila OPD ini terlibat, tambahkan pada kolom PJ lewat <Link href="/admin">Admin CMS</Link>.</p>
          ) : (
            <>
              <div className="rk-strip-butir" aria-label="Strip status butir">
                {butir.map((b) => <button key={b.id} type="button" className={`sb st-${b.status} pr-${b.prioritas}`} title={`${b.kode} · ${b.status} · ${b.prioritas}`} onClick={() => rk.bukaButir(b.id, b.indikatorId)} aria-label={`Buka butir ${b.kode}`} />)}
              </div>
              <ul className="rk-butir">
                {butir.slice(0, 30).map((b) => (
                  <li key={b.id}>
                    <div className="row">
                      <StatusIkon k={b.status} />
                      <span className="mono kode">{b.kode}</span>
                      <span className="nama">{b.nama}</span>
                      <span className={`rk-tag t-${b.prioritas === 'tinggi' ? 'revisi' : b.prioritas === 'sedang' ? 'proses' : 'belum'}`}>{b.prioritas}</span>
                      <button type="button" className="rk-btn kecil" onClick={() => rk.bukaButir(b.id, b.indikatorId)} aria-label={`Buka butir ${b.kode}`}><Ikon nama="kanan" size={14} /></button>
                    </div>
                    {b.ringkas ? <div className="cat faint">{b.ringkas}</div> : null}
                  </li>
                ))}
              </ul>
              {butir.length > 30 ? <p className="faint">+ {butir.length - 30} butir lain di <Link href="/antrean">Antrean</Link> (pilih persona PJ OPD → {opd.singkat}).</p> : null}
            </>
          )}
        </PanelLipat>

        <PanelLipat id={`opd-ppb-${opd.id}`} className="rk-c4" judul="Peta proses bisnis" ringkas={`· ${prosesOPD.length} proses`} aksi={<Link className="rk-act" href="/probis">Peta lengkap →</Link>}>
          <div className="rk-pohon">
            <div className="lv"><span className="mono faint">L0</span><b>{probisMisi || 'Misi RPJMD'}</b></div>
            <div className="lv"><span className="mono faint">L1</span><b>{opd.urusan}</b>{urusanTerkait.filter((u) => u !== opd.urusan).length ? <span className="faint">+ {urusanTerkait.filter((u) => u !== opd.urusan).join(', ')}</span> : null}</div>
            <div className="lv"><span className="mono faint">L2</span>
              <ul>{prosesOPD.slice(0, 12).map((p, i) => <li key={i}><b>{p.nama}</b><span className="faint"> · {p.kategori}{p.output ? ` → ${p.output}` : ''}</span></li>)}</ul>
              {prosesOPD.length > 12 ? <span className="faint">+ {prosesOPD.length - 12} proses lain</span> : null}
            </div>
          </div>
        </PanelLipat>

        {relatedOpd.length > 0 ? (
          <section className="rk-panel">
            <h2>{opd.level === 'Kecamatan' ? 'Kecamatan lain' : 'OPD dengan level atau urusan yang sama'}</h2>
            <div className="rk-chips">{relatedOpd.map((r) => <Link key={r.id} href={`/opd/${r.slug}`} className="rk-chip">{r.singkat}<span className="faint"> · {r.urusan}</span></Link>)}</div>
          </section>
        ) : null}
      </div>
    </>
  );
}

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
