/**
 * /dashboard — Beranda "Situasi" Ruang Kendali (Patch 1, 22 Sep 2026).
 * Keputusan yang dioptimalkan: butir mana yang harus dikerjakan siapa sebelum tenggat.
 * Data: getStaticProps → lib/rkData.susunDataRK (pemdi.json + catatan mandiri + opd.json).
 */
import Head from 'next/head';
import Link from 'next/link';
import Kompas from '@/components/rk/Kompas';
import { Situasi, AntreanTabel, BebanPJ, Linimasa, Prasyarat, useAntreanAktif } from '@/components/rk/Panel';
import OPDTable from '@/components/OPDTable';
import { susunDataRK } from '@/lib/rkData';
import opdJson from '@/data/opd.json';
import pemdiJson from '@/data/pemdi.json';
import { petaButirOPD } from '@/lib/pjButir';

/** Ringkasan PPB dari opd.json → probis (level_0 misi, level_1 urusan, level_2 kategori→proses). */
function hitungPPB() {
  const pb = opdJson.probis || {};
  const misi = (pb.level_0?.misi || []).length;
  const urusan = (pb.level_1?.urusan || []).length;
  const proses = (pb.level_2?.kategori || []).reduce((n, k) => n + (k.proses || []).length, 0);
  return { misi, urusan, proses };
}

export default function Dashboard({ rk, opdList, butirCountMap, dibangun, ppb }) {
  const antrean = useAntreanAktif();
  const tinggi = antrean.filter((b) => b.prioritas === 'tinggi').slice(0, 8);
  return (
    <>
      <Head>
        <title>Situasi — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Ruang kendali evaluasi Pemerintah Digital 2026 Kabupaten Aceh Tengah — indikator, antrean bukti, penanggung jawab." />
      </Head>
      <div className="rk-grid">
        <Situasi s={rk.situasi} now={dibangun} />
        {rk.konten?.pengumuman ? (
          <section className="rk-panel rk-pengumuman" role="status">
            <h2>Pengumuman Tim Koordinasi</h2>
            <p>{rk.konten.pengumuman}</p>
          </section>
        ) : null}

        <section className="rk-panel rk-c8">
          <h2>Kompas Pemdi — 7 aspek · 20 indikator · 5 level <Link className="rk-act" href="/indikator">Matriks lengkap →</Link></h2>
          <Kompas indikator={rk.indikator} situasi={rk.situasi} aspek={rk.situasi.aspek} />
        </section>

        <section className="rk-panel rk-c4">
          <h2>Antrean prioritas tinggi <Link className="rk-act" href="/antrean">Semua ({antrean.length}) →</Link></h2>
          <AntreanTabel rows={tinggi} ringkas />
        </section>

        <section className="rk-panel rk-c4">
          <h2>Beban per penanggung jawab <span className="rk-act" style={{ color: 'var(--rk-ink-3)' }}>{rk.opdPJ.length} OPD</span></h2>
          <BebanPJ rows={rk.opdPJ} />
        </section>

        <section className="rk-panel rk-c4">
          <h2>Linimasa evaluasi 2026</h2>
          <Linimasa tahap={rk.linimasa} now={dibangun} />
        </section>

        <section className="rk-panel rk-c4">
          <h2>Prasyarat lintas indikator <Link className="rk-act" href="/requirement">Draf bukti →</Link></h2>
          <Prasyarat rows={rk.prasyarat} />
        </section>

        <section className="rk-panel">
          <h2>Peta Proses Bisnis (PPB) Level 0–1–2 · PermenPANRB 19/2018 <Link className="rk-act" href="/probis">Eksplorasi peta lintas fungsi →</Link></h2>
          <div className="rk-ppb">
            <Link href="/probis"><span className="mono faint">L0 · Makro</span><b>Visi &amp; {ppb.misi} Misi RPJMD 2025–2029</b><span className="muted">Arah pembangunan daerah sebagai akar seluruh proses.</span></Link>
            <Link href="/probis"><span className="mono faint">L1 · Urusan</span><b>{ppb.urusan} urusan konkuren UU 23/2014</b><span className="muted">Kewenangan wajib &amp; pilihan di seluruh perangkat daerah.</span></Link>
            <Link href="/probis"><span className="mono faint">L2 · Proses</span><b>{ppb.proses} proses lintas OPD</b><span className="muted">Bagan lintas fungsi (CFM) — bukti I15 Proses Bisnis &amp; I17 Keterpaduan.</span></Link>
          </div>
        </section>

        <section className="rk-panel">
          <h2>52 perangkat daerah · butir Pemdi per OPD <Link className="rk-act" href="/opd">Indeks OPD →</Link></h2>
          <OPDTable list={opdList} butirCountMap={butirCountMap} />
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const rk = await susunDataRK();
  return {
    props: {
      rk,
      opdList: opdJson.opd.daftar,
      butirCountMap: petaButirOPD(opdJson.opd.daftar, pemdiJson),
      dibangun: new Date().toISOString(),
      ppb: hitungPPB(),
    },
    revalidate: 60, // Patch 4: overlay CMS tampil ≤ 60 dtk setelah disimpan
  };
}
