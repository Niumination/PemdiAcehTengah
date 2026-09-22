/**
 * /indikator — Matriks 20 indikator × 5 level (Patch 1).
 * Sel = komposisi status butir pada level itu (hijau diterima, merah revisi, oranye draf).
 */
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { Tag, Lv, Mini } from '@/components/rk/Panel';
import { useRK } from '@/components/rk/RKShell';
import { susunDataRK } from '@/lib/rkData';
import { warnaAspek, fmt2, antreanUntukOPD } from '@/lib/ruangKendali';

function Sel({ p }) {
  if (!p || !p.total) return <span className="lvc kosong" aria-label="tidak ada butir" />;
  const t = p.total; let x = 0;
  const seg = [['diterima', 'var(--rk-ok)'], ['revisi', 'var(--rk-bad)'], ['proses', 'var(--rk-warn)'], ['draf', 'var(--rk-draf)']].map(([k, c]) => {
    const w = (p[k] / t) * 100; const el = <i key={k} style={{ left: `${x}%`, width: `${w}%`, background: c }} />; x += w; return el;
  });
  return <span className="lvc" aria-label={`${t} butir: ${p.diterima} diterima, ${p.revisi} revisi, ${p.draf} draf, ${p.belum} belum`}>{seg}<span className="n">{p.diterima}/{t}</span></span>;
}

export default function Indikator({ rk }) {
  const ctx = useRK();
  const [aspek, setAspek] = useState(0);
  const [hanyaRevisi, setHanyaRevisi] = useState(false);
  const milik = useMemo(() => (ctx?.opd ? new Set(antreanUntukOPD(rk.antrean, ctx.opd).map((b) => b.indikatorId)) : null), [ctx, rk]);
  const rows = rk.indikator.filter((i) => (!aspek || i.aspekId === aspek) && (!hanyaRevisi || i.stat.revisi > 0) && (!milik || milik.has(i.id)));
  return (
    <>
      <Head><title>Matriks indikator — Dashboard Pemerintah Digital Aceh Tengah</title></Head>
      <div className="rk-grid">
        <section className="rk-panel">
          <h2>Matriks 20 indikator × 5 level <span className="rk-act" style={{ color: 'var(--rk-ink-3)' }}>indeks {fmt2(rk.situasi.indeks)} · {rk.situasi.predikat}</span></h2>
          <div className="rk-filter" role="group" aria-label="Filter indikator">
            {rk.situasi.aspek.map((a) => <button key={a.id} type="button" className="rk-chip" aria-pressed={aspek === a.id} onClick={() => setAspek(aspek === a.id ? 0 : a.id)}><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: warnaAspek(a.id), marginRight: 6 }} />{a.singkat || a.nama}</button>)}
            <span className="faint">|</span>
            <button type="button" className="rk-chip" aria-pressed={hanyaRevisi} onClick={() => setHanyaRevisi(!hanyaRevisi)}>ada revisi</button>
          </div>
          <div className="rk-wrap">
            <table className="rk-table rk-matrix">
              <thead><tr><th>Indikator</th><th>Bobot</th><th>Level</th><th>L1</th><th>L2</th><th>L3</th><th>L4</th><th>L5</th><th>Bukti</th><th>Catatan</th></tr></thead>
              <tbody>
                {rows.map((i) => (
                  <tr key={i.id} className="klik" tabIndex={0} onClick={() => ctx?.bukaIndikator(i.id)} onKeyDown={(e) => { if (e.key === 'Enter') ctx?.bukaIndikator(i.id); }}>
                    <td><span className="kode" style={{ color: warnaAspek(i.aspekId) }}>{i.id}</span> <span className="nm" style={{ display: 'inline' }}>{i.nama}</span>{i.eksternal ? <> <Tag k="eksternal">pembina</Tag></> : null}<div className="faint" style={{ fontSize: 11.5 }}>{i.aspekNama} · {i.pjLead}</div></td>
                    <td className="num">{i.bobot}%</td>
                    <td><Lv d={i.levelDicapai} b={i.levelBerikut} /></td>
                    {[1, 2, 3, 4, 5].map((l) => <td key={l} className="cell"><Sel p={i.perLevel[l]} /></td>)}
                    <td style={{ minWidth: 90 }}><Mini s={i.stat} /><div className="faint" style={{ fontSize: 11 }}>{i.stat.diterima}/{i.stat.total}{i.stat.revisi ? <span style={{ color: 'var(--rk-status-ink-bad)' }}> · {i.stat.revisi} revisi</span> : null}</div></td>
                    <td className="num">{i.catatanMandiri || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="faint" style={{ fontSize: 12, marginBottom: 0 }}>Sel = komposisi status butir per level: hijau diterima asesor · merah revisi · oranye draf lokal · kosong belum ada dokumen. Angka = diterima/total. Klik baris untuk detail & catatan mandiri.</p>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: { rk: await susunDataRK() }, revalidate: 60 };
}
