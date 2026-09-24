/**
 * pages/probis.js — Peta Proses Bisnis (PPB) bergaya Ruang Kendali (Patch 12, Tahap 3c).
 * Tiga level PermenPANRB 19/2018 disajikan sebagai "aliran": L0 misi (kartu lipat) → L1 urusan
 * (batang jumlah OPD, saring per misi/OPD) → L2 proses per kategori (6 jalur/lajur).
 * Data tetap dari data/opd.json (probis + opd.daftar); DetailModal lama diganti kartu misi yang dibuka di tempat.
 */
import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import Ikon from '@/components/ui/Ikon';
import { formatAngka } from '@/lib/format';
import slugify from '@/lib/slugify';
import portalData from '@/data/opd.json';

const WARNA_KAT = ['#1565c0', '#2e7d32', '#b45309', '#6d28d9', '#0e7490', '#b91c1c'];

export default function PetaProsesBisnis({ data }) {
  const [misiBuka, setMisiBuka] = useState(-1);
  const [fokusOPD, setFokusOPD] = useState(null); // id OPD yang disorot lintas level
  const probis = data.probis;
  const opdMap = useMemo(() => Object.fromEntries(data.opd.daftar.map((o) => [o.id, o])), [data]);
  const urusan = useMemo(() => probis.level_1.urusan || [], [probis]);
  const kategori = useMemo(() => probis.level_2.kategori || [], [probis]);
  const totalProses = kategori.reduce((s, k) => s + (k.proses?.length || 0), 0);
  const opdTerlibat = useMemo(() => {
    const s = new Set();
    urusan.forEach((u) => u.opd_terkait?.forEach((id) => s.add(id)));
    kategori.forEach((k) => k.proses?.forEach((p) => p.opd_terkait?.forEach((id) => s.add(id))));
    return s;
  }, [urusan, kategori]);
  const maksOPD = Math.max(1, ...urusan.map((u) => u.opd_terkait?.length || 0));
  const bebanOPD = useMemo(() => {
    const m = {};
    urusan.forEach((u) => u.opd_terkait?.forEach((id) => { m[id] = (m[id] || 0) + 1; }));
    kategori.forEach((k) => k.proses?.forEach((p) => p.opd_terkait?.forEach((id) => { m[id] = (m[id] || 0) + 1; })));
    return Object.entries(m).map(([id, n]) => ({ id: Number(id), n })).sort((a, b) => b.n - a.n);
  }, [urusan, kategori]);
  const sorot = (ids) => fokusOPD == null || (ids || []).includes(fokusOPD);
  const ChipOPD = ({ id }) => {
    const o = opdMap[id];
    if (!o) return null;
    return (
      <button type="button" className="rk-chip" aria-pressed={fokusOPD === id} onClick={() => setFokusOPD(fokusOPD === id ? null : id)} title={o.nama}>
        {o.singkat}
      </button>
    );
  };

  return (
    <>
      <Head>
        <title>Peta Proses Bisnis — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Peta Proses Bisnis Pemkab Aceh Tengah 3 level — Visi-Misi, Urusan, Proses Bisnis OPD. Berdasarkan PermenPANRB 19/2018 dan RPJMD 2025-2030." />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan peta proses bisnis">
          <div className="lead"><div className="lbl">Visi RPJMD 2025–2030</div><div className="val" style={{ fontSize: 'var(--rk-fs-4)' }}>“{probis.level_0.deskripsi}”</div><div className="sub">{probis.level_0.sumber}</div></div>
          <div><div className="lbl">L0 · Misi</div><div className="val">{probis.level_0.misi.length}</div><div className="sub">arah pembangunan daerah</div></div>
          <div><div className="lbl">L1 · Urusan</div><div className="val">{urusan.length}</div><div className="sub">24 konkuren + urusan umum</div></div>
          <div><div className="lbl">L2 · Proses</div><div className="val">{totalProses}<small>{kategori.length} kategori</small></div><div className="sub">proses spesifik OPD</div></div>
          <div><div className="lbl">OPD terlibat</div><div className="val">{opdTerlibat.size}<small>/ {data.opd.daftar.length}</small></div><div className="sub">disebut pada L1/L2 · relevan indikator 4.x &amp; 6.1</div></div>
        </section>

        <LipatSemua keterangan="Aliran L0 → L1 → L2. Klik singkatan OPD di mana pun untuk menyorot keterlibatannya lintas level.">
          {fokusOPD != null ? (
            <span className="rk-chips">
              <span className="rk-act faint">Sorot:</span>
              <ChipOPD id={fokusOPD} />
              <button type="button" className="rk-act" onClick={() => setFokusOPD(null)}><Ikon nama="tutup" size={12} /> lepas</button>
            </span>
          ) : null}
        </LipatSemua>

        <PanelLipat id="ppb-l0" judul="L0 · Visi & misi" ringkas={`· ${probis.level_0.misi.length} misi`} className="rk-c8" aksi={<span className="rk-act faint">klik misi untuk fokus &amp; OPD pelaksana</span>}>
          <ol className="rk-misi">
            {probis.level_0.misi.map((m, i) => {
              const buka = misiBuka === i;
              return (
                <li key={i} className={buka ? 'on' : ''} data-redup={!sorot(m.opd_terkait) || undefined}>
                  <button type="button" onClick={() => setMisiBuka(buka ? -1 : i)} aria-expanded={buka}>
                    <span className="no">{formatAngka(i + 1)}</span>
                    <span className="nm">{m.nama}</span>
                    <span className="ct">{m.opd_terkait?.length || 0} OPD</span>
                    <Ikon nama="lipat" size={14} />
                  </button>
                  {buka ? (
                    <div className="isi">
                      <p>{m.deskripsi}</p>
                      {m.fokus?.length ? <div className="rk-chips">{m.fokus.map((f, j) => <span key={j} className="rk-tag t-rendah">{f}</span>)}</div> : null}
                      {m.opd_terkait?.length ? <div className="rk-chips">{m.opd_terkait.map((id) => <ChipOPD key={id} id={id} />)}</div> : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </PanelLipat>

        <PanelLipat id="ppb-beban" judul="Beban keterlibatan OPD" ringkas={`· ${bebanOPD.length} OPD`} className="rk-c4">
          <ol className="rk-beban">
            {bebanOPD.slice(0, 12).map((b) => {
              const o = opdMap[b.id];
              if (!o) return null;
              return (
                <li key={b.id} data-redup={(fokusOPD != null && fokusOPD !== b.id) || undefined}>
                  <ChipOPD id={b.id} />
                  <span className="jalur"><i style={{ width: `${(b.n / bebanOPD[0].n) * 100}%` }} /></span>
                  <b>{b.n}</b>
                </li>
              );
            })}
          </ol>
          <p className="rk-catatan">Jumlah penyebutan pada urusan L1 dan proses L2. Konsentrasi beban pada sedikit OPD adalah temuan asesor (arsitektur SPBE belum menjadi rujukan lintas OPD).</p>
        </PanelLipat>

        <PanelLipat id="ppb-l1" judul="L1 · Urusan pemerintahan" ringkas={`· ${urusan.length} urusan`} aksi={<span className="rk-act faint">panjang batang = jumlah OPD pengampu</span>}>
          <div className="rk-urusan">
            {urusan.map((u, i) => (
              <div key={i} className="ur" data-redup={!sorot(u.opd_terkait) || undefined}>
                <div className="hd"><b>{u.nama}</b><span>{u.opd_terkait?.length || 0} OPD</span></div>
                <span className="jalur"><i style={{ width: `${((u.opd_terkait?.length || 0) / maksOPD) * 100}%` }} /></span>
                <div className="rk-chips">{u.opd_terkait?.map((id) => <ChipOPD key={id} id={id} />)}</div>
              </div>
            ))}
          </div>
        </PanelLipat>

        <PanelLipat id="ppb-l2" judul="L2 · Proses bisnis per kategori" ringkas={`· ${totalProses} proses`} aksi={<span className="rk-act faint">{probis.level_2.deskripsi}</span>}>
          <div className="rk-lajur">
            {kategori.map((k, i) => (
              <section key={i} className="lj" style={{ '--warna': k.warna || WARNA_KAT[i % WARNA_KAT.length] }}>
                <h3><span className="no">{String(i + 1).padStart(2, '0')}</span>{k.nama}<small>{k.proses?.length || 0}</small></h3>
                {k.deskripsi ? <p className="ds">{k.deskripsi}</p> : null}
                <ol>
                  {k.proses?.map((p, j) => (
                    <li key={j} data-redup={(!p.opd_semua && !sorot(p.opd_terkait)) || undefined}>
                      <b>{p.nama}</b>
                      {p.output ? <span className="out">→ {p.output}</span> : null}
                      {p.opd_semua ? <span className="rk-tag t-belum">Semua OPD</span> : <div className="rk-chips">{p.opd_terkait?.map((id) => <ChipOPD key={id} id={id} />)}</div>}
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </PanelLipat>

        <section className="rk-panel rk-rujuk">
          <h2><span className="rk-judul">Kerangka regulasi</span></h2>
          <ul className="rk-ol">
            <li><b>PermenPANRB 19/2018</b> — Penyusunan Peta Proses Bisnis Instansi Pemerintah: L0 Visi–Misi, L1 Urusan, L2 Proses Bisnis. <a href="https://peraturan.bpk.go.id/Details/132523/permen-pan-rb-no-19-tahun-2018" target="_blank" rel="noopener noreferrer">Baca di BPK <Ikon nama="luar" size={11} /></a></li>
            <li><b>UU 23/2014</b> — Pemerintahan Daerah: 24 urusan konkuren kewenangan kabupaten/kota.</li>
            <li><b>PermenPANRB 8/2026</b> — Evaluasi Kinerja Pemerintah Digital: 7 aspek, 20 indikator; PPB menjadi bukti indikator arsitektur &amp; keterpaduan.</li>
            <li><b>Qanun No. 4/2025</b> — RPJMD Kabupaten Aceh Tengah 2025–2030.</li>
          </ul>
          <p className="rk-catatan">Profil tiap OPD: <Link href="/opd">peta perangkat daerah</Link>. Tautan OPD pada halaman ini menyorot; buka profil lewat <Link href={fokusOPD != null && opdMap[fokusOPD] ? `/opd/${slugify(opdMap[fokusOPD].nama)}` : '/opd'}>{fokusOPD != null && opdMap[fokusOPD] ? `profil ${opdMap[fokusOPD].singkat}` : 'daftar OPD'}</Link>.</p>
        </section>
      </div>
    </>
  );
}

export function getStaticProps() {
  return { props: { data: portalData } };
}
