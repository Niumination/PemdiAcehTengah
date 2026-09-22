/**
 * components/rk/Kompas.js — "Kompas Pemdi": SVG radial 20 indikator × 5 level (Patch 1).
 * Sektor = indikator (dikelompokkan per aspek), cincin = level 1–5.
 * Sel terisi = level dicapai; sel putus-putus = level berikut; titik merah = ada butir revisi.
 * Klik / Enter membuka drawer indikator. Tanpa animasi.
 */
import { useMemo, useState } from 'react';
import { warnaAspek, fmt2, antreanUntukOPD } from '@/lib/ruangKendali';
import { useRK } from './RKShell';

const W = 560; const CX = W / 2; const CY = W / 2; const R0 = 76; const RING = 30; const GAP = 2.5; const PAD = 0.045;
const P = (r, a) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
const arc = (r1, r2, a1, a2) => {
  const [x1, y1] = P(r2, a1); const [x2, y2] = P(r2, a2); const [x3, y3] = P(r1, a2); const [x4, y4] = P(r1, a1);
  return `M${x1},${y1}A${r2},${r2},0,0,1,${x2},${y2}L${x3},${y3}A${r1},${r1},0,0,0,${x4},${y4}Z`;
};

export default function Kompas({ indikator, situasi, aspek }) {
  const rk = useRK();
  const [sorotAspek, setSorotAspek] = useState(0);
  const n = indikator.length; const step = (2 * Math.PI) / n;
  const opd = rk?.opd;
  const milikOPD = useMemo(() => {
    if (!opd) return null;
    return new Set(antreanUntukOPD(rk?.data?.antrean || [], opd).map((b) => b.indikatorId));
  }, [opd, rk]);

  const sektor = indikator.map((i, k) => {
    const a1 = -Math.PI / 2 + k * step + PAD; const a2 = -Math.PI / 2 + (k + 1) * step - PAD; const col = warnaAspek(i.aspekId);
    const cells = [];
    for (let l = 1; l <= 5; l += 1) {
      const r1 = R0 + (l - 1) * RING + GAP; const r2 = R0 + l * RING - GAP;
      let fill = 'var(--rk-panel-2)'; let op = 0.9; let stroke = 'none'; let dash = '';
      if (i.eksternal) { fill = 'var(--rk-pembina)'; op = 0.18; }
      else if (l <= i.levelDicapai) { fill = col; op = 0.95; }
      else if (l === i.levelBerikut) { fill = col; op = 0.22; stroke = col; dash = '3 2'; }
      cells.push(<path key={l} d={arc(r1, r2, a1, a2)} fill={fill} opacity={op} stroke={stroke} strokeDasharray={dash} strokeWidth={1.2} />);
    }
    const mid = (a1 + a2) / 2;
    const [dx, dy] = P(R0 + 5 * RING + 8, mid);
    const [lx, ly] = P(R0 + 5 * RING + 22, mid);
    const dim = (sorotAspek && i.aspekId !== sorotAspek) || (milikOPD && !milikOPD.has(i.id));
    return (
      <g key={i.id} className={`ind${dim ? ' dim' : ''}`} tabIndex={0} role="button" aria-label={`${i.id} ${i.nama}, level ${i.levelDicapai} dari 5${i.stat.revisi ? `, ${i.stat.revisi} butir revisi` : ''}`}
        onClick={() => rk?.bukaIndikator(i.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rk?.bukaIndikator(i.id); } }}>
        <title>{i.id} — {i.nama} · level {i.levelDicapai}{i.levelBerikut ? ` → ${i.levelBerikut}` : ''}</title>
        {cells}
        {i.stat.revisi ? <circle cx={dx} cy={dy} r={4} fill="var(--rk-bad)" /> : null}
        <text className="lbl" x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">{i.id}</text>
      </g>
    );
  });

  const guides = [1, 2, 3, 4, 5].map((l) => <circle key={l} cx={CX} cy={CY} r={R0 + l * RING - GAP} fill="none" stroke="var(--rk-line)" strokeWidth={0.6} opacity={0.6} />);
  let k = 0;
  const outer = aspek.map((a) => {
    const cnt = indikator.filter((i) => i.aspekId === a.id).length;
    const a1 = -Math.PI / 2 + k * step + PAD; const a2 = -Math.PI / 2 + (k + cnt) * step - PAD; k += cnt;
    return <path key={a.id} d={arc(R0 + 5 * RING + 34, R0 + 5 * RING + 37, a1, a2)} fill={warnaAspek(a.id)} opacity={sorotAspek && sorotAspek !== a.id ? 0.25 : 0.9} />;
  });

  return (
    <div className="rk-kompas">
      <svg viewBox={`0 0 ${W} ${W}`} role="img" aria-label="Kompas Pemdi: 20 indikator, 5 level kematangan">
        {guides}{outer}{sektor}
        <text className="c-n" x={CX} y={CY - 4} textAnchor="middle" dominantBaseline="middle">{fmt2(situasi.indeks)}</text>
        <text className="c-t" x={CX} y={CY + 30} textAnchor="middle">Indeks · simulasi mandiri</text>
        <text className="c-t" x={CX} y={CY + 46} textAnchor="middle" style={{ fill: 'var(--rk-status-ink-bad)', fontWeight: 600 }}>{situasi.predikat}</text>
      </svg>
      <div className="rk-legend" role="group" aria-label="Aspek">
        {aspek.map((a) => (
          <button type="button" key={a.id} aria-pressed={sorotAspek === a.id} onClick={() => setSorotAspek(sorotAspek === a.id ? 0 : a.id)}>
            <span className="sw" style={{ background: warnaAspek(a.id) }} />
            <span>{a.id}. {a.singkat || a.nama}</span>
            <span className="w">{a.bobot}% · {fmt2(a.indeks)}</span>
          </button>
        ))}
        <div className="ket">
          Cincin = level 1–5 dari pusat. Sel penuh = level dicapai (semua butir utama diterima asesor); sel putus-putus = target berikut; titik merah = ada butir revisi; ungu = dinilai instansi pembina (I5, I6, I7, I18). Klik indikator untuk detail & catatan mandiri.
        </div>
      </div>
    </div>
  );
}
