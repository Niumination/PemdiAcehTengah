/**
 * /dashboard — Beranda "Situasi" Ruang Kendali (Patch 1, 22 Sep 2026).
 * Keputusan yang dioptimalkan: butir mana yang harus dikerjakan siapa sebelum tenggat.
 * Data: getStaticProps → lib/rkData.susunDataRK (pemdi.json + catatan mandiri + opd.json).
 */
import Head from 'next/head';
import Link from 'next/link';
import Kompas from '@/components/rk/Kompas';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import { BandingAspek } from '@/components/rk/Asesor';
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

        <LipatSemua keterangan="Panel dapat dilipat; status diingat di perangkat ini." />

        <PanelLipat id="kompas" className="rk-c8" judul="Kompas Pemdi — 7 aspek · 20 indikator · 5 level" ringkas={`· indeks ${Number(rk.situasi.indeks).toFixed(2).replace('.', ',')} · ${rk.situasi.predikat}`} aksi={<Link className="rk-act" href="/indikator">Matriks lengkap →</Link>}>
          <Kompas indikator={rk.indikator} situasi={rk.situasi} aspek={rk.situasi.aspek} />
        </PanelLipat>

        <PanelLipat id="antrean" className="rk-c4" judul="Antrean prioritas tinggi" ringkas={`· ${tinggi.length} dari ${antrean.length} butir`} aksi={<Link className="rk-act" href="/antrean">Semua ({antrean.length}) →</Link>}>
          <AntreanTabel rows={tinggi} ringkas />
        </PanelLipat>

        <PanelLipat id="asesor" ponsel="tutup" className="rk-c4" judul="Asesor vs simulasi per aspek" ringkas={rk.situasi.asesor ? `· asesor ${Number(rk.situasi.asesor.indeks).toFixed(2).replace('.', ',')}` : ''} aksi={<Link className="rk-act" href="/asesor">Hasil asesor lengkap →</Link>}>
          <BandingAspek situasi={rk.situasi} />
          <p className="rk-catatan" style={{ marginTop: 8 }}>Hasil interviu asesor eksternal KemenPANRB 21 Sep 2026 (skala 1–5; indikator berindeks eksternal diasumsikan 1). Simulasi butir dihitung dari status bukti di portal.</p>
        </PanelLipat>

        <PanelLipat id="beban" ponsel="tutup" className="rk-c4" judul="Beban per penanggung jawab" ringkas={`· ${rk.opdPJ.length} OPD`} aksi={<span className="rk-act" style={{ color: 'var(--rk-ink-3)' }}>{rk.opdPJ.length} OPD</span>}>
          <BebanPJ rows={rk.opdPJ} />
        </PanelLipat>

        <PanelLipat id="linimasa" ponsel="tutup" className="rk-c4" judul="Linimasa evaluasi 2026" ringkas={`· ${(rk.linimasa || []).length} tahap`}>
          <Linimasa tahap={rk.linimasa} now={dibangun} />
        </PanelLipat>

        <PanelLipat id="prasyarat" ponsel="tutup" className="rk-c12" judul="Prasyarat lintas indikator" ringkas={`· ${(rk.prasyarat || []).length} dokumen`} aksi={<Link className="rk-act" href="/requirement">Draf bukti →</Link>}>
          <Prasyarat rows={rk.prasyarat} />
        </PanelLipat>

        <PanelLipat id="ppb" ponsel="tutup" judul="Peta Proses Bisnis (PPB) Level 0–1–2 · PermenPANRB 19/2018" ringkas={`· ${ppb.misi} misi · ${ppb.urusan} urusan · ${ppb.proses} proses`} aksi={<Link className="rk-act" href="/probis">Eksplorasi peta lintas fungsi →</Link>}>
          <div className="rk-ppb">
            <Link href="/probis"><span className="mono faint">L0 · Makro</span><b>Visi &amp; {ppb.misi} Misi RPJMD 2025–2029</b><span className="muted">Arah pembangunan daerah sebagai akar seluruh proses.</span></Link>
            <Link href="/probis"><span className="mono faint">L1 · Urusan</span><b>{ppb.urusan} urusan konkuren UU 23/2014</b><span className="muted">Kewenangan wajib &amp; pilihan di seluruh perangkat daerah.</span></Link>
            <Link href="/probis"><span className="mono faint">L2 · Proses</span><b>{ppb.proses} proses lintas OPD</b><span className="muted">Bagan lintas fungsi (CFM) — bukti I15 Proses Bisnis &amp; I17 Keterpaduan.</span></Link>
          </div>
        </PanelLipat>

        <PanelLipat id="opd" ponsel="tutup" judul="52 perangkat daerah · butir Pemdi per OPD" ringkas={`· ${opdList.length} OPD`} aksi={<Link className="rk-act" href="/opd">Indeks OPD →</Link>}>
          <OPDTable list={opdList} butirCountMap={butirCountMap} />
        </PanelLipat>
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
