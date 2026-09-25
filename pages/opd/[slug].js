import Head from 'next/head';
import Link from 'next/link';
import { formatAngka } from '@/lib/format';
import portalData from '@/data/opd.json';
import slugify from '@/lib/slugify';
import { useMemo, useState } from 'react';
import { useRK } from '@/components/rk/RKShell';
import PanelLipat from '@/components/rk/PanelLipat';
import Ikon from '@/components/ui/Ikon';
import StatusIkon from '@/components/ui/StatusIkon';
import { antreanUntukOPD, antreanButir } from '@/lib/ruangKendali';
import pemdiJson from '@/data/pemdi.json';
import { bukaCetak } from '@/lib/cetak';
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

/* =============================================
   Tugas saya — Patch 20 (Tahap E audit konten).
   Halaman OPD dibaca PJ OPD di ponsel untuk menjawab: "apa yang harus saya siapkan minggu ini?"
   Setiap butir punya aksi berikutnya (bukan sekadar status), dikelompokkan per prioritas;
   tautan bisa dibagikan (WhatsApp) dan daftar bisa dicetak. Strip 232 sel diganti bilah ringkas.
   ============================================= */
const AKSI = {
  revisi: 'Tanggapi catatan revisi asesor — perbaiki dokumen sesuai catatan, unggah ulang',
  gap: 'Siapkan dokumen level berikut — lihat kebutuhan bukti di panel butir',
};
const LABEL_PRIO = { tinggi: 'Minggu ini', sedang: 'Berikutnya', rendah: 'Bila sempat' };

function TugasSaya({ opd, butir, siap, buka }) {
  const grup = PRIO.map((p) => ({ p, rows: butir.filter((b) => b.prioritas === p) })).filter((g) => g.rows.length);
  // Grup pertama yang berisi dibuka (OPD tanpa butir prioritas tinggi tetap melihat tugasnya tanpa klik).
  const [tampil, setTampil] = useState(() => ({ [grup[0]?.p || 'tinggi']: true }));
  const [disalin, setDisalin] = useState(false);
  const [semua, setSemua] = useState({});
  const BATAS = 8;
  const st = butir.reduce((m, b) => { m[b.status] = (m[b.status] || 0) + 1; return m; }, {});
  const total = butir.length || 1;
  const salinTautan = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setDisalin(true); setTimeout(() => setDisalin(false), 1500); } catch { /* abaikan */ }
  };
  const bagikanWA = () => {
    const teks = `Daftar tugas bukti Pemdi ${opd.singkat} (${butir.length} butir, ${st.revisi || 0} revisi asesor): ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(teks)}`, '_blank');
  };
  const cetak = () => {
    const baris = butir.map((b) => `<tr><td>${b.kode}</td><td>${b.nama}</td><td>${b.status}</td><td>${b.prioritas}</td><td>${b.jenis === 'revisi' ? 'Tanggapi revisi asesor' : 'Siapkan dokumen level berikut'}</td></tr>`).join('');
    bukaCetak(`<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Tugas bukti Pemdi — ${opd.nama}</title>
<style>body{font:12px/1.4 system-ui;margin:24px}h1{font-size:18px;margin:0 0 4px}p{margin:0 0 12px;color:#444}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:4px 6px;text-align:left;vertical-align:top}th{background:#eee}</style></head>
<body><h1>Tugas bukti Pemdi — ${opd.nama}</h1><p>${butir.length} butir · ${st.revisi || 0} revisi asesor · dicetak ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · Dashboard Pemerintah Digital Kab. Aceh Tengah</p>
<table><thead><tr><th>Kode</th><th>Butir</th><th>Status</th><th>Prioritas</th><th>Aksi berikutnya</th></tr></thead><tbody>${baris}</tbody></table></body></html>`);
  };
  return (
    <PanelLipat id={`opd-butir-${opd.id}`} className="rk-c8" judul="Tugas saya — bukti Pemdi yang menjadi tanggung jawab" ringkas={`· ${butir.length} butir`}
      aksi={<span className="rk-tugas-aksi"><button type="button" className="rk-btn" onClick={salinTautan} aria-live="polite">{disalin ? 'Tautan disalin' : 'Salin tautan'}</button><button type="button" className="rk-btn" onClick={bagikanWA}>Bagikan WA</button><button type="button" className="rk-btn" onClick={cetak}><Ikon nama="cetak" size={14} /> Cetak</button></span>}>
      {!siap ? <p className="faint">Memuat…</p> : butir.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>Belum ada catatan mandiri yang menyebut {opd.singkat} sebagai PJ. Bila OPD ini terlibat, tambahkan pada kolom PJ lewat <Link href="/admin">Admin CMS</Link>.</p>
      ) : (
        <>
          <div className="rk-tugas-bar" role="img" aria-label={`${st.diterima || 0} diterima, ${st.revisi || 0} revisi, ${st.draf || 0} draf, ${st.belum || 0} belum`}>
            {['diterima', 'revisi', 'draf', 'belum'].map((k) => st[k] ? <i key={k} className={`st-${k}`} style={{ width: `${(st[k] / total) * 100}%` }} /> : null)}
          </div>
          <p className="rk-tugas-ket faint">{st.diterima || 0} diterima · <b>{st.revisi || 0} revisi asesor</b> · {st.draf || 0} draf lokal · {st.belum || 0} belum ada dokumen. Klik butir untuk kebutuhan dokumen & catatan asesor.</p>
          {grup.map(({ p, rows }) => (
            <section key={p} className={`rk-tugas g-${p}`}>
              <h3><button type="button" className="rk-tugas-hd" aria-expanded={tampil[p]} onClick={() => setTampil((t) => ({ ...t, [p]: !t[p] }))}>
                <Ikon nama="lipat" size={14} /> <b>{LABEL_PRIO[p]}</b> <span className="faint">· prioritas {p} · {rows.length} butir</span>{!tampil[p] ? <span className="faint rk-tugas-hint">— ketuk untuk membuka</span> : null}
              </button></h3>
              {tampil[p] ? (
                <ul className="rk-butir rk-tugas-ls">
                  {(semua[p] ? rows : rows.slice(0, BATAS)).map((b) => (
                    <li key={b.id}>
                      <button type="button" className="row" onClick={() => buka(b)} aria-label={`Buka butir ${b.kode}`}>
                        <StatusIkon k={b.status} />
                        <span className="mono kode">{b.kode}</span>
                        <span className="nama">{b.nama}<span className="aksi">{AKSI[b.jenis] || AKSI.gap}{b.kebutuhan?.[0] ? ` — ${b.kebutuhan[0]}` : ''}</span></span>
                        <Ikon nama="kanan" size={14} />
                      </button>
                    </li>
                  ))}
                  {rows.length > BATAS && !semua[p] ? (
                    <li className="rk-tugas-lagi"><button type="button" className="rk-btn" onClick={() => setSemua((x) => ({ ...x, [p]: true }))}>Tampilkan {rows.length - BATAS} butir lagi</button></li>
                  ) : null}
                </ul>
              ) : null}
            </section>
          ))}
        </>
      )}
    </PanelLipat>
  );
}


export default function OPDPage({ opd, urusanTerkait, probisMisi, relatedOpd, prosesOPD, butirStatis = [] }) {
  const rk = useRK();
  // Patch 20: butir dihitung saat build (tanpa CLS/"Memuat…"); data klien (overlay CMS) menggantikannya bila sudah ada.
  const butir = useMemo(() => (opd && rk?.data?.antrean ? antreanUntukOPD(rk.data.antrean, opd) : butirStatis), [rk, opd, butirStatis]);
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

        <TugasSaya opd={opd} butir={butir} siap buka={(b) => rk.bukaButir(b.id, b.indikatorId)} />

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
      butirStatis: antreanUntukOPD(antreanButir(pemdiJson), opd),
    },
  };
}
