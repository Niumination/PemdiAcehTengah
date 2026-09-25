/**
 * pages/asesor.js — Hasil evaluasi asesor eksternal KemenPANRB 2026, Kab. Aceh Tengah (Patch 14, Tahap 2).
 * Sumber: data/evaluasi-asesor-2026.json (salinan apa adanya dari materi interviu 21 Sep 2026; hanya locus Aceh Tengah).
 * Isi: rk-sit (1,24 headline, mandiri awal 1,42, selisih ke target, indikator tanpa bukti / berindeks eksternal),
 * perbandingan per aspek (asesor vs simulasi butir), peta verifikasi 20 indikator (upload/interview/disetujui),
 * tabel catatan & rekomendasi asesor per indikator (teks tidak diparafrasa; yang terpotong di sumber ditandai), catatan interviu.
 */
import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import { BandingAspek, PetaVerifikasi } from '@/components/rk/Asesor';
import { useRK } from '@/components/rk/RKShell';
import Ikon from '@/components/ui/Ikon';
import { susunDataRK } from '@/lib/rkData';
import { fmt2, warnaAspek } from '@/lib/ruangKendali';
import asesorJson from '@/data/evaluasi-asesor-2026.json';

const SARING = [
  { k: 'semua', l: 'Semua' },
  { k: 'tidak_disetujui', l: 'Belum disetujui' },
  { k: 'tanpa_bukti', l: 'Tanpa bukti' },
  { k: 'indeks_lain', l: 'Indeks eksternal' },
  { k: 'terkelola', l: '≥ Terkelola' },
];
const cocok = (i, k) => (k === 'tidak_disetujui' ? i.verifikasi.disetujui === 'tidak' : k === 'tanpa_bukti' ? i.tanpa_bukti : k === 'indeks_lain' ? i.indeks_lain : k === 'terkelola' ? i.nilai >= 2 : true);
const V = { ya: 'Y', tidak: '–', na: 'NA' };

export default function AsesorPage({ rk, asesor }) {
  const ctx = useRK();
  const [saring, setSaring] = useState('semua');
  const aspekPeta = useMemo(() => Object.fromEntries(rk.indikator.map((i) => [i.id, i])), [rk]);
  const daftar = asesor.indikator.filter((i) => cocok(i, saring));
  const s = rk.situasi;
  const selisih = s.target - asesor.indeks.asesor;
  const nDisetujui = asesor.indikator.filter((i) => i.verifikasi.disetujui === 'ya').length;
  const nTanpa = asesor.indikator.filter((i) => i.tanpa_bukti).length;
  const nLain = asesor.indikator.filter((i) => i.indeks_lain).length;
  const buka = (id) => ctx?.bukaIndikator?.(id);

  return (
    <>
      <Head>
        <title>Hasil asesor 2026 — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Hasil evaluasi kinerja Pemerintah Digital 2026 oleh asesor eksternal KemenPANRB untuk Kabupaten Aceh Tengah: indeks 1,24 (Level 1 · Rintisan), skor per aspek, verifikasi bukti, catatan dan rekomendasi per indikator." />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan hasil asesor">
          <div className="lead"><div className="lbl">Indeks Pemdi · asesor eksternal KemenPANRB</div><div className="val" style={{ color: 'var(--rk-emas-ink)' }}>{fmt2(asesor.indeks.asesor)}<small>{asesor.indeks.level}</small></div><div className="sub">interviu {asesor.sumber.tanggal.split('-').reverse().join('/')} · {asesor.sumber.locus} · evaluator {asesor.sumber.evaluator}</div></div>
          <div><div className="lbl">Penilaian mandiri awal</div><div className="val">{fmt2(asesor.indeks.mandiri_awal)}</div><div className="sub">pembanding · ditampilkan asesor sebagai {asesor.indeks.tampilan_sumber}</div></div>
          <div><div className="lbl">Selisih ke target</div><div className="val" style={{ color: 'var(--rk-status-ink-bad)' }}>{fmt2(selisih)}</div><div className="sub">target 2026 {fmt2(s.target)} · simulasi butir saat ini {fmt2(s.indeks)}</div></div>
          <div><div className="lbl">Disetujui asesor</div><div className="val" style={{ color: 'var(--rk-status-ink-ok)' }}>{nDisetujui}<small>/ 20</small></div><div className="sub">{20 - nDisetujui - nLain} belum disetujui · {nLain} berindeks eksternal</div></div>
          <div><div className="lbl">Tanpa bukti dukung</div><div className="val" style={{ color: 'var(--rk-status-ink-bad)' }}>{nTanpa}</div><div className="sub">{asesor.indikator.filter((i) => i.tanpa_bukti).map((i) => i.kode).join(' · ')}</div></div>
        </section>

        <LipatSemua keterangan="Teks catatan & rekomendasi disalin apa adanya dari materi asesor; “…” = terpotong pada sumber.">
          <span className="rk-seg kecil" role="group" aria-label="Saring indikator">
            {SARING.map((x) => <button key={x.k} type="button" aria-pressed={saring === x.k} onClick={() => setSaring(x.k)}>{x.l} ({asesor.indikator.filter((i) => cocok(i, x.k)).length})</button>)}
          </span>
        </LipatSemua>

        <PanelLipat id="as-aspek" className="rk-c8" judul="Skor per aspek — asesor vs simulasi butir" ringkas={`· asesor ${fmt2(asesor.indeks.asesor)}`} aksi={<span className="rk-act faint">bobot 10/10/15/15/10/15/25 %</span>}>
          <BandingAspek situasi={s} rinci />
          <p className="rk-catatan" style={{ marginTop: 8 }}>{asesor.skala.keterangan} Aspek terendah menurut asesor: <b>Data 1,00</b> (I5–I7 berindeks eksternal, I8 PDP tanpa bukti); terbesar bobotnya: <b>Kepuasan Pengguna 25 %</b> (1,18). Rata-rata tertimbang skor aspek = {fmt2(asesor.aspek.reduce((t, a) => t + a.bobot * a.skor, 0) / 100)}.</p>
        </PanelLipat>

        <PanelLipat id="as-verif" className="rk-c4" judul="Peta verifikasi 20 indikator" ringkas={`· ${nDisetujui} disetujui`} aksi={<span className="rk-act faint">klik → panel indikator</span>}>
          <PetaVerifikasi indikator={rk.indikator.filter((i) => cocok(asesor.indikator.find((x) => x.id === i.id) || {}, saring))} onKlik={buka} />
          <div className="rk-leg" style={{ marginTop: 8 }}>
            <span><i className="s-diterima" />ada/terpenuhi</span><span><i className="s-revisi" />belum/tidak ada</span><span><i className="s-eksternal" />N/A — indeks eksternal</span>
          </div>
          <p className="rk-catatan" style={{ marginTop: 6 }}>Tiga titik per sel = upload bukti · interview · disetujui. Bingkai merah = tanpa bukti dukung; ungu = dinilai dari indeks lain.</p>
        </PanelLipat>

        <PanelLipat id="as-tabel" ponsel="tutup" judul="Catatan & rekomendasi tindak lanjut asesor per indikator" ringkas={`· ${daftar.length} indikator`} aksi={<Link className="rk-act" href="/antrean">Antrean catatan mandiri →</Link>}>
          <div className="gulir">
            <table className="rk-table rk-as">
              <thead><tr><th>Kode</th><th>Indikator</th><th>Nilai</th><th title="Upload · Interview · Disetujui">U · I · D</th><th>Catatan asesor</th><th className="p2">Rekomendasi tindak lanjut</th><th className="p2">Simulasi</th></tr></thead>
              <tbody>
                {daftar.map((i) => {
                  const r = aspekPeta[i.id];
                  return (
                    <tr key={i.id} className={i.tanpa_bukti ? 'tanpa' : i.indeks_lain ? 'lain' : ''}>
                      <td><button type="button" className="rk-act kode" style={{ color: warnaAspek(r?.aspekId) }} onClick={() => buka(i.id)}>{i.kode}<span className="faint"> {i.id}</span></button></td>
                      <td><b>{i.nama}</b>{i.tanpa_bukti ? <span className="rk-tag t-revisi">tanpa bukti</span> : null}{i.indeks_lain ? <span className="rk-tag t-eksternal">indeks eksternal</span> : null}</td>
                      <td className="mono"><b>{fmt2(i.nilai)}</b><div className="faint">{i.level}</div></td>
                      <td className="mono verif"><span className={`v-${i.verifikasi.upload}`}>{V[i.verifikasi.upload]}</span><span className={`v-${i.verifikasi.interview}`}>{V[i.verifikasi.interview]}</span><span className={`v-${i.verifikasi.disetujui}`}>{V[i.verifikasi.disetujui]}</span></td>
                      <td>{i.catatan}</td>
                      <td className="p2">{i.rekomendasi}{i.terpotong ? <span className="rk-tag t-belum" title="Teks terpotong pada materi sumber">terpotong</span> : null}</td>
                      <td className="mono p2">{r ? <>L{r.levelDicapai}<div className="faint">{fmt2(r.nilai)} · {r.stat.diterima}/{r.stat.total}</div></> : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PanelLipat>

        <PanelLipat id="as-interview" ponsel="tutup" className="rk-c6" judul="Catatan interviu" ringkas={`· ${asesor.catatan_interview.length} butir`} awal="tutup">
          <ol className="rk-ol">
            {asesor.catatan_interview.map((c) => (
              <li key={String(c.no)}><b>{c.topik}</b> — {c.catatan} <span className="rk-chips" style={{ display: 'inline-flex', marginLeft: 4 }}>{c.indikator.map((id) => <button key={id} type="button" className="rk-chip" style={{ height: 22 }} onClick={() => buka(id)}>{id}</button>)}</span></li>
            ))}
          </ol>
        </PanelLipat>

        <section className="rk-panel rk-c6 rk-rujuk">
          <h2><span className="rk-judul">Sumber &amp; ketentuan</span></h2>
          <ul>
            <li>{asesor.sumber.dokumen} — {asesor.sumber.evaluator}, {asesor.sumber.tanggal}. Berkas asli tidak disimpan di repo; hanya locus Aceh Tengah yang disalin.</li>
            <li>{asesor.indeks.keterangan}</li>
            <li>{asesor.legenda_verifikasi.ya} · {asesor.legenda_verifikasi.tidak} · {asesor.legenda_verifikasi.na}</li>
            <li>Tindak lanjut per butir dikelola di <Link href="/antrean">Antrean</Link>, <Link href="/requirement">Draf Bukti Dukung</Link>, dan <Link href="/modul-indikator">Modul indikator</Link>. Bandingkan dengan SPBE 2025 di <Link href="/spbe"><Ikon nama="grafik" size={12} /> SPBE</Link>.</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const rk = await susunDataRK();
  return { props: { rk, asesor: asesorJson }, revalidate: 60 };
}
