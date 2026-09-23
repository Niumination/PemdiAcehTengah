/**
 * components/rk/Dial.js — Dial busur 270° untuk nilai aspek (Patch 10, Tahap 3a).
 * Nilai mandiri (warna aspek) di atas bayangan target; skala 0–5. SVG murni, tanpa animasi.
 */
const A0 = Math.PI * 0.75;
const A1 = Math.PI * 2.25;
const R = 44; const CX = 60; const CY = 58;

function busur(a0, a1) {
  const x0 = CX + R * Math.cos(a0); const y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1); const y1 = CY + R * Math.sin(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
const sudut = (v) => A0 + (A1 - A0) * (Math.min(Math.max(v, 0), 5) / 5);
const fmt = (n) => Number(n).toFixed(2).replace('.', ',');

export default function Dial({ nilai = 0, target = 0, warna, label = 'target', judul }) {
  return (
    <svg viewBox="0 0 120 100" className="rk-dial" role="img" aria-label={judul || `Nilai ${fmt(nilai)} dari target ${fmt(target)}`} style={{ '--warna': warna }}>
      <path d={busur(A0, A1)} className="trk" />
      {target > 0 ? <path d={busur(A0, sudut(target))} className="tgt" /> : null}
      {nilai > 0 ? <path d={busur(A0, sudut(nilai) + 0.001)} className="val" /> : null}
      <text x="60" y="56" className="big">{fmt(nilai)}</text>
      <text x="60" y="73" className="sm">{label} {fmt(target)}</text>
      <text x="16" y="97" className="tk">0</text>
      <text x="100" y="97" className="tk">5</text>
    </svg>
  );
}
