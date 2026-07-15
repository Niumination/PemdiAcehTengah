import { useState } from 'react';
import pemdiData from '@/data/pemdi.json';

const aspekIcons = ['🏛️', '👥', '📊', '🔒', '💻', '🔗', '😊'];
const BASE = pemdiData.aspek.map(a => a.nilai);
const WEIGHTS = pemdiData.aspek.map(a => a.bobot);
const TARGET = pemdiData.target_indeks;

function calcIndeks(vals) {
  const wSum = WEIGHTS.reduce((s, w) => s + w, 0);
  return Math.round(vals.reduce((s, v, i) => s + v * (WEIGHTS[i] / wSum), 0) * 100) / 100;
}

function predikat(n) {
  if (n >= 3) return { label: 'Baik', cls: 'st-ok' };
  if (n >= 2) return { label: 'Cukup', cls: 'st-warn' };
  return { label: 'Perlu Perbaikan', cls: 'st-bad' };
}

export default function PemdiCalculator() {
  const [vals, setVals] = useState([...BASE]);
  const indeks = calcIndeks(vals);
  const p = predikat(indeks);
  const delta = indeks - calcIndeks(BASE);

  const setVal = (i, v) => {
    const next = [...vals];
    next[i] = Math.round(v * 10) / 10;
    setVals(next);
  };

  const reset = () => setVals([...BASE]);

  return (
    <div className="pemdi-calc">
      <h3 className="calc-title">🧮 Kalkulator Proyeksi Pemdi</h3>
      <p className="calc-desc">Geser slider untuk simulasi kenaikan nilai per aspek. Lihat dampaknya terhadap indeks final.</p>

      {pemdiData.aspek.map((a, i) => (
        <div className="calc-row" key={a.id}>
          <div className="calc-label">
            <span>{aspekIcons[i]}</span>
            <span className="calc-name">{a.singkat}</span>
            <span className="calc-bobot">{a.bobot}%</span>
          </div>
          <input
            type="range" min="1" max="5" step="0.1"
            value={vals[i]}
            onChange={e => setVal(i, parseFloat(e.target.value))}
            className="calc-slider"
            aria-label={`Slider ${a.singkat}`}
          />
          <span className="calc-val">{vals[i].toFixed(1)}</span>
        </div>
      ))}

      <div className="calc-result">
        <div className="calc-indeks">
          <span className="calc-indeks-label">Indeks Proyeksi</span>
          <span className="calc-indeks-nilai" style={{ color: delta >= 0 ? 'var(--ok)' : 'var(--bad)' }}>
            {indeks.toFixed(2)}
          </span>
          <span className={`chip-status ${p.cls}`} style={{ fontSize: '0.75rem' }}>{p.label}</span>
        </div>
        <div className="calc-delta">
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)} dari baseline
        </div>
        <button className="calc-reset" onClick={reset}>↺ Reset ke baseline</button>
      </div>

      <style jsx>{`
        .pemdi-calc {
          max-width: 640px; margin: 2rem auto 0; padding: 1.5rem;
          border: 1px solid var(--line); border-radius: var(--r, 16px);
          background: var(--surface);
        }
        .calc-title { margin: 0 0 0.25rem; font-size: 1rem; }
        .calc-desc { margin: 0 0 1.25rem; font-size: 0.8125rem; color: var(--ink-secondary); }

        .calc-row {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
        }
        .calc-label {
          display: flex; align-items: center; gap: 0.35rem; min-width: 140px;
          font-size: 0.8125rem;
        }
        .calc-name { font-weight: 500; flex: 1; }
        .calc-bobot { font-size: 0.65rem; color: var(--muted); background: var(--bg-2); padding: 0.1rem 0.35rem; border-radius: 3px; }
        .calc-slider {
          flex: 1; height: 4px; appearance: none; -webkit-appearance: none;
          background: var(--line); border-radius: 2px; outline: none;
        }
        .calc-slider::-webkit-slider-thumb {
          appearance: none; -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: var(--primary); cursor: pointer; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .calc-val { min-width: 2rem; text-align: right; font-weight: 600; font-size: 0.875rem; font-variant-numeric: tabular-nums; }

        .calc-result {
          margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--line-2);
          display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
        }
        .calc-indeks { display: flex; align-items: center; gap: 0.5rem; }
        .calc-indeks-label { font-size: 0.75rem; color: var(--ink-secondary); }
        .calc-indeks-nilai { font-size: 1.5rem; font-weight: 800; font-variant-numeric: tabular-nums; }
        .calc-delta { font-size: 0.8125rem; color: var(--ink-secondary); }
        .calc-reset {
          margin-left: auto; font-size: 0.75rem; color: var(--muted); background: none; border: 1px solid var(--line);
          padding: 0.3rem 0.75rem; border-radius: 999px; cursor: pointer; transition: all 0.15s;
        }
        .calc-reset:hover { border-color: var(--primary); color: var(--primary); }
      `}</style>
    </div>
  );
}
