/**
 * /pemdi — "Rinci per aspek" dalam gaya Ruang Kendali (Patch 10, Tahap 3a — 23 Sep 2026).
 * Menggantikan halaman lama (hero + checklist 852 baris, 152 inline-style). Prototipe disetujui:
 * desain/proto-pemdi-rk.html.
 *   - Baris situasi (komponen Situasi bersama dashboard) + catatan tujuan (teks pemilik, tetap ada).
 *   - 7 kartu aspek (PanelLipat): Dial 270° nilai mandiri vs target, koordinator, pita status bertumpuk.
 *   - Akordeon indikator → tangga level L1–L5 (dicapai / target berikut / belum) + butir per level dengan
 *     CatatanButir (catatan mandiri) & EksporCatatan; "Buka di drawer" memakai Drawer RKShell.
 * Data: susunDataRK() (JSON + overlay CMS) → tidak ada perubahan JSON/API.
 */
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import Dial from '@/components/rk/Dial';
import { Situasi } from '@/components/rk/Panel';
import { useRK } from '@/components/rk/RKShell';
import CatatanTujuan from '@/components/CatatanTujuan';
import StatusIkon from '@/components/ui/StatusIkon';
import Ikon from '@/components/ui/Ikon';
import { CatatanButir, EksporCatatan } from '@/components/asesor/CatatanMandiri';
import { KerawangDivider } from '@/components/motif/KerawangMotifs';
import { susunDataRK } from '@/lib/rkData';
import { warnaAspek, fmt2, kodePortal } from '@/lib/ruangKendali';
import { LEVEL_NAMA_RESMI, statusMeta, fokusLevel } from '@/lib/pemdiNilai';
import pemdiJson from '@/data/pemdi.json';

const URUT_STATUS = ['diterima', 'revisi', 'proses', 'draf', 'belum'];

function hitungStatus(butir) {
  const st = { diterima: 0, revisi: 0, proses: 0, draf: 0, belum: 0 };
  butir.forEach((b) => { st[b.status] = (st[b.status] || 0) + 1; });
  return st;
}

function PitaStatus({ st, total }) {
  return (
    <>
      <div className="rk-stack" role="img" aria-label={`${st.diterima} diterima, ${st.revisi} revisi, ${st.proses + st.draf} draf, ${st.belum} belum dari ${total} butir`}>
        {URUT_STATUS.map((k) => (st[k] ? <i key={k} className={`s-${k}`} style={{ flex: st[k] }} /> : null))}
      </div>
      <div className="rk-leg">
        <span><i className="s-diterima" />{st.diterima} diterima</span>
        <span><i className="s-revisi" />{st.revisi} revisi</span>
        <span><i className="s-draf" />{st.proses + st.draf} draf</span>
        <span><i className="s-belum" />{st.belum} belum</span>
      </div>
    </>
  );
}

function Indikator({ ind, ringkas, warna, bukaDefault, meta, target = 0 }) {
  const rk = useRK();
  const f = fokusLevel(ind);
  const perLevel = [1, 2, 3, 4, 5].map((l) => ({ l, items: ind.bukti_dukung.filter((b) => Number(b.level) === l) }));
  const [tampilSemua, setTampilSemua] = useState(false);
  const fokus = perLevel.filter(({ l }) => f.tampil.has(l));
  const daftar = tampilSemua ? perLevel : fokus.length ? fokus : perLevel.slice(0, 1);
  const tersembunyi = perLevel.reduce((n, x) => n + x.items.length, 0) - daftar.reduce((n, x) => n + x.items.length, 0);
  return (
    <details className="rk-ind" open={bukaDefault}>
      <summary>
        <span className="kode mono" style={{ color: warna }}>{ind.id}</span>
        <span className="nm">{ind.nama}{ind.eksternal ? <span className="rk-tag t-eksternal" style={{ marginLeft: 6 }}>pembina</span> : null}</span>
        <span className="lv" style={{ '--warna': warna }}>L{f.levelDicapai}<i>→ {fmt2(target)}</i></span>
        <span className="pj">{ringkas?.pjLead || ind.penanggung_jawab?.lead?.split(' (')[0] || '—'}</span>
        <span className="n mono">{ind.bukti_dukung.length} butir</span>
      </summary>
      <div className="rk-ladder" aria-label="Tangga level">
        {perLevel.map(({ l, items }) => {
          const cls = l <= f.levelDicapai ? ' on' : l === f.levelBerikut ? ' nx' : '';
          const dt = items.filter((b) => b.status === 'diterima').length;
          return <div key={l} className={`rung${cls}`} style={{ '--warna': warna }}><b>L{l} · {LEVEL_NAMA_RESMI[l]}</b><span>{items.length} butir · {dt} diterima</span></div>;
        })}
      </div>
      {daftar.map(({ l, items }) => (
        <div key={l} className="rk-lvl">
          <div className="rk-lvl-h"><span className="mono">L{l}</span> {LEVEL_NAMA_RESMI[l]} <span className="faint">· {items.length} butir</span></div>
          <ul className="rk-butir">
            {items.map((b) => {
              const sm = statusMeta(b.status);
              return (
                <li key={b.id}>
                  <div className="row">
                    <StatusIkon k={b.status} />
                    <span className="mono kode">{kodePortal(b.id)}</span>
                    <span className="nama">{b.nama}</span>
                    <span className="rk-tag" style={{ color: sm.color }}>{sm.label}</span>
                    <button type="button" className="rk-btn kecil" onClick={() => rk?.bukaButir(b.id, ind.id)} aria-label={`Buka butir ${kodePortal(b.id)} di panel`}><Ikon nama="kanan" size={14} /></button>
                  </div>
                  {b.catatan ? <div className="cat faint">{b.catatan}</div> : null}
                  <CatatanButir b={b} ind={ind} />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="rk-ind-ft">
        {tersembunyi > 0 && !tampilSemua ? <button type="button" className="rk-btn" onClick={() => setTampilSemua(true)}>Tampilkan semua level (+{tersembunyi} butir)</button> : null}
        {tampilSemua && fokus.length ? <button type="button" className="rk-btn" onClick={() => setTampilSemua(false)}>Hanya level fokus</button> : null}
        <button type="button" className="rk-btn" onClick={() => rk?.bukaIndikator(ind.id)}><Ikon nama="luar" size={14} /> Buka di panel samping</button>
        <EksporCatatan ind={ind} meta={meta} compact />
      </div>
    </details>
  );
}

export default function PemdiPage({ rk, aspekMeta, dibangun, metaCatatan }) {
  const [kolom, setKolom] = useState(2);
  const peta = useMemo(() => Object.fromEntries(rk.indikatorPenuh.map((i) => [i.id, i])), [rk]);
  const ringkas = useMemo(() => Object.fromEntries(rk.indikator.map((i) => [i.id, i])), [rk]);
  return (
    <>
      <Head>
        <title>Rinci per aspek — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Tujuh aspek, 20 indikator, dan 232 butir bukti evaluasi Pemerintah Digital 2026 Kabupaten Aceh Tengah — nilai simulasi mandiri, target, tangga level, catatan mandiri." />
      </Head>
      <div className="rk-grid">
        <Situasi s={rk.situasi} now={dibangun} />
        <div className="rk-tujuan"><CatatanTujuan compact /></div>
        <LipatSemua keterangan={`${aspekMeta.length} aspek · ${rk.indikator.length} indikator · ${rk.situasi.stat.total ?? 232} butir bukti · klik indikator untuk tangga level & butir`}>
          <span className="rk-seg kecil" role="group" aria-label="Jumlah kolom">
            <button type="button" aria-pressed={kolom === 1} onClick={() => setKolom(1)}>1 kolom</button>
            <button type="button" aria-pressed={kolom === 2} onClick={() => setKolom(2)}>2 kolom</button>
          </span>
        </LipatSemua>

        {aspekMeta.map((a) => {
          const warna = warnaAspek(a.id);
          const inds = a.indikator.map((id) => peta[id]).filter(Boolean);
          const semuaButir = inds.flatMap((i) => i.bukti_dukung);
          const st = hitungStatus(semuaButir);
          const sit = rk.situasi.aspek.find((x) => x.id === a.id);
          const nilai = sit?.indeks ?? a.nilai_aktual;
          return (
            <PanelLipat
              key={a.id} id={`aspek-${a.id}`} className={`rk-aspek${kolom === 2 ? ' rk-c6' : ''}`}
              judul={<><span className="rk-no" style={{ color: warna }}>Aspek {a.id}</span>{a.nama}</>}
              ringkas={`· ${fmt2(nilai)} / ${fmt2(a.target)} · ${st.diterima}/${semuaButir.length} diterima`}
              aksi={<span className="rk-act faint mono">bobot {a.bobot}%</span>}
            >
              <div className="rk-aspek-atas">
                <Dial nilai={nilai} target={a.target} warna={warna} judul={`Aspek ${a.id}: ${fmt2(nilai)} dari target ${fmt2(a.target)}`} />
                <div>
                  <p className="rk-desk">{a.deskripsi}</p>
                  <div className="rk-koord"><b>Koordinator</b> {a.koordinator}</div>
                  <PitaStatus st={st} total={semuaButir.length} />
                </div>
              </div>
              <div className="rk-inds">
                {inds.map((ind, k) => <Indikator key={ind.id} ind={ind} ringkas={ringkas[ind.id]} warna={warna} bukaDefault={a.id === 1 && k === 0} meta={metaCatatan} target={a.targetInd[ind.id]} />)}
              </div>
            </PanelLipat>
          );
        })}

        <div style={{ gridColumn: 'span 12' }}><KerawangDivider label="Rujukan" /></div>
        <section className="rk-panel rk-rujuk">
          <h2>Rujukan &amp; tautan lanjut</h2>
          <ul>
            <li><Link href="/modul-indikator">Modul indikator — kriteria per level (bahasa baku PermenPANRB 8/2026)</Link></li>
            <li><Link href="/requirement">Draf bukti dukung prioritas</Link></li>
            <li><Link href="/indikator">Matriks 20 indikator × 5 level</Link></li>
            <li><Link href="/antrean">Antrean butir menurut prioritas</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const rk = await susunDataRK();
  const aspekMeta = pemdiJson.aspek.map((a) => ({
    id: a.id, nama: a.nama, singkat: a.singkat, bobot: a.bobot, target: a.target, deskripsi: a.deskripsi,
    koordinator: a.koordinator, nilai_aktual: a.nilai_aktual, indikator: a.indikator.map((i) => i.id),
    targetInd: Object.fromEntries(a.indikator.map((i) => [i.id, i.target ?? 0])),
  }));
  return {
    props: {
      rk, aspekMeta, dibangun: new Date().toISOString(),
      metaCatatan: { versi: pemdiJson.catatan_mandiri_meta?.versi ?? null, tahun: pemdiJson.tahun ?? null },
    },
    revalidate: 60,
  };
}
