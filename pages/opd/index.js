/**
 * /opd — Perangkat daerah dalam gaya Ruang Kendali (Patch 11, Tahap 3b).
 * Pola: PETA UBIN 52 OPD — ukuran ubin ∝ jumlah butir Pemdi yang menyebut OPD (lib/pjButir),
 * warna = jenis/level; klik ubin → halaman OPD. Di bawahnya tabel OPDTable (cari/saring/halaman).
 * Data tetap: opd.json + pemdi.json (petaButirOPD).
 */
import { useMemo } from 'react';
import useUrlState from '@/lib/useUrlState';
import Head from 'next/head';
import Link from 'next/link';
import OPDTable from '@/components/OPDTable';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import { formatAngka } from '@/lib/format';
import slugify from '@/lib/slugify';
import portalData from '@/data/opd.json';
import pemdiData from '@/data/pemdi.json';
import { petaButirOPD } from '@/lib/pjButir';

export const LEVEL_RK = {
  Staf: { warna: 'var(--rk-emas-ink)', label: 'Unsur staf' },
  Badan: { warna: 'var(--rk-status-ink-info)', label: 'Badan' },
  Dinas: { warna: 'var(--rk-status-ink-ok)', label: 'Dinas' },
  Lembaga: { warna: 'var(--rk-status-ink-draf)', label: 'Lembaga lain' },
  Kecamatan: { warna: 'var(--rk-status-ink-pembina, var(--rk-ink-2))', label: 'Kecamatan' },
};

export default function OPDIndex({ data, butirCountMap }) {
  const daftar = data.opd.daftar;
  const [level, setLevel] = useUrlState('level', '');
  const totalASN = daftar.reduce((s, d) => s + (d.jumlah_asn || 0), 0);
  const kecamatan = daftar.filter((d) => d.jenis === 'kecamatan').length;
  const punyaButir = daftar.filter((d) => butirCountMap[d.id] > 0);
  const totalButir = Object.values(butirCountMap).reduce((a, b) => a + b, 0);
  const perLevel = useMemo(() => Object.keys(LEVEL_RK).map((k) => ({ k, n: daftar.filter((d) => d.level === k).length, butir: daftar.filter((d) => d.level === k).reduce((s, d) => s + (butirCountMap[d.id] || 0), 0) })), [daftar, butirCountMap]);
  const ubin = useMemo(() => [...daftar]
    .filter((d) => !level || d.level === level)
    .sort((a, b) => (butirCountMap[b.id] || 0) - (butirCountMap[a.id] || 0) || (b.jumlah_asn || 0) - (a.jumlah_asn || 0)), [daftar, butirCountMap, level]);
  const maks = Math.max(1, ...daftar.map((d) => butirCountMap[d.id] || 0));
  return (
    <>
      <Head>
        <title>Perangkat daerah — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content={`${daftar.length} perangkat daerah Kabupaten Aceh Tengah — peta ubin menurut butir bukti Pemdi yang menjadi tanggung jawab, ${formatAngka(totalASN)} ASN.`} />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan perangkat daerah">
          <div className="lead"><div className="lbl">Perangkat daerah</div><div className="val">{daftar.length}<small>{daftar.length - kecamatan} instansi · {kecamatan} kecamatan</small></div><div className="sub">harmonisasi e-Keurani BKPSDM & data SPBE Diskominfo · Juni 2025</div></div>
          <div><div className="lbl">Menyandang butir Pemdi</div><div className="val">{punyaButir.length}<small>OPD</small></div><div className="sub">{totalButir} penyebutan PJ pada catatan mandiri</div></div>
          <div><div className="lbl">Beban terbesar</div><div className="val">{ubin[0]?.singkat}<small>{butirCountMap[ubin[0]?.id]} butir</small></div><div className="sub">{ubin[0]?.nama}</div></div>
          <div><div className="lbl">ASN</div><div className="val">{formatAngka(totalASN)}</div><div className="sub">total seluruh perangkat daerah</div></div>
          <div><div className="lbl">Tanpa butir</div><div className="val">{daftar.length - punyaButir.length}</div><div className="sub">belum disebut sebagai PJ — kandidat kolaborasi (I4)</div></div>
        </section>

        <LipatSemua keterangan="Peta ubin: luas ubin ∝ butir Pemdi yang menyebut OPD; warna = jenis perangkat daerah. Klik ubin untuk profil OPD.">
          <span className="rk-seg kecil" role="group" aria-label="Saring jenis">
            <button type="button" aria-pressed={!level} onClick={() => setLevel('')}>Semua</button>
            {perLevel.map((p) => <button key={p.k} type="button" aria-pressed={level === p.k} onClick={() => setLevel(level === p.k ? '' : p.k)}>{LEVEL_RK[p.k].label} ({p.n})</button>)}
          </span>
        </LipatSemua>

        <PanelLipat id="opd-ubin" judul="Peta ubin perangkat daerah" ringkas={`· ${ubin.length} OPD`} aksi={<span className="rk-leg">{perLevel.map((p) => <span key={p.k}><i style={{ background: LEVEL_RK[p.k].warna }} />{LEVEL_RK[p.k].label} {p.butir}</span>)}</span>}>
          <div className="rk-ubin">
            {ubin.map((d) => {
              const n = butirCountMap[d.id] || 0;
              const skala = n ? 1 + Math.round((n / maks) * 3) : 0; // 0 = kecil, 1–4 = bertingkat
              return (
                <Link key={d.id} href={`/opd/${slugify(d.nama)}`} className={`ub s${skala}`} style={{ '--warna': LEVEL_RK[d.level]?.warna || 'var(--rk-ink-3)' }} title={`${d.nama} · ${n} butir · ${formatAngka(d.jumlah_asn || 0)} ASN`}>
                  <b>{d.singkat}</b>
                  {skala ? <span className="n">{n} butir</span> : null}
                  {skala >= 3 ? <span className="nm">{d.nama}</span> : null}
                </Link>
              );
            })}
          </div>
        </PanelLipat>

        <PanelLipat id="opd-tabel" judul="Daftar lengkap" ringkas={`· ${daftar.length} baris`} aksi={<span className="rk-act faint">cari · saring · halaman</span>}>
          <OPDTable polos list={daftar} butirCountMap={butirCountMap} />
        </PanelLipat>

        <section className="rk-panel rk-rujuk">
          <h2>Sumber</h2>
          <ul>
            <li>Data ASN: e-Keurani BKPSDM · data SPBE: Diskominfo Aceh Tengah · pembaruan Juni 2025.</li>
            <li>Jumlah butir = penyebutan OPD pada kolom PJ catatan mandiri (`lib/pjButir.js`); satu butir dapat menyebut lebih dari satu OPD. <Link href="/antrean">Antrean butir →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}

export function getStaticProps() {
  const data = JSON.parse(JSON.stringify(portalData));
  const butirCountMap = petaButirOPD(data.opd.daftar, pemdiData);
  return { props: { data, butirCountMap } };
}
