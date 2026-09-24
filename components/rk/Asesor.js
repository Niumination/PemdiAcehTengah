/**
 * components/rk/Asesor.js — Panel perbandingan hasil asesor eksternal vs simulasi mandiri (Patch 14, Tahap 2).
 *
 * <BandingAspek situasi={rk.situasi} />  — 7 baris: batang skor asesor (emas) di atas batang simulasi butir (warna aspek),
 *   tanda target 2,50; dipakai /dashboard (rk-c4) dan /asesor (rk-c8).
 * <PetaVerifikasi indikator={rk.indikator} onKlik={id => …} /> — 20 sel: nilai asesor + tiga titik verifikasi (upload/interview/disetujui).
 * Data: rk.situasi.asesor (lib/rkData ← data/evaluasi-asesor-2026.json) — hanya Kab. Aceh Tengah.
 */
import { fmt2, warnaAspek } from '@/lib/ruangKendali';

const pct = (v, maks = 5) => `${Math.max(0, Math.min(1, v / maks)) * 100}%`;

export function BandingAspek({ situasi, rinci = false }) {
  const as = situasi?.asesor;
  if (!as) return null;
  const skor = Object.fromEntries(as.aspek.map((a) => [String(a.id), a.skor]));
  return (
    <div className={`rk-banding${rinci ? ' rinci' : ''}`}>
      <div className="kepala"><span>Aspek</span><span>asesor <i className="sw a" /> · simulasi butir <i className="sw m" /> · target ▏{fmt2(situasi.target)}</span></div>
      {situasi.aspek.map((a) => {
        const w = warnaAspek(a.id);
        const sa = skor[String(a.id)] ?? 0;
        return (
          <div key={a.id} className="brs" style={{ '--warna': w }}>
            <div className="lbl"><b>{a.singkat}</b>{rinci ? <small>bobot {a.bobot}%</small> : null}</div>
            <div className="jalur">
              <i className="tgt" style={{ left: pct(situasi.target) }} />
              <i className="a" style={{ width: pct(sa) }}><b>{fmt2(sa)}</b></i>
              <i className="m" style={{ width: pct(a.indeks) }}><b>{fmt2(a.indeks)}</b></i>
            </div>
          </div>
        );
      })}
      <div className="kaki"><b>Indeks</b><span>asesor <b>{fmt2(as.indeks)}</b> · mandiri awal {fmt2(as.mandiriAwal)} · simulasi butir {fmt2(situasi.indeks)} · target {fmt2(situasi.target)}</span></div>
    </div>
  );
}

const TITIK = { ya: 'ok', tidak: 'bad', na: 'na' };
export function PetaVerifikasi({ indikator, onKlik }) {
  return (
    <div className="rk-verif">
      {indikator.map((i) => {
        const a = i.asesor;
        if (!a) return null;
        return (
          <button key={i.id} type="button" className={`sel${a.tanpaBukti ? ' tanpa' : ''}${a.indeksLain ? ' lain' : ''}`} style={{ '--warna': warnaAspek(i.aspekId) }} onClick={() => onKlik?.(i.id)} title={`${a.kode} ${i.nama}`}>
            <span className="kd">{a.kode}</span>
            <span className="nl">{fmt2(a.nilai)}</span>
            <span className="ttk" aria-label={`upload ${a.verifikasi.upload}, interview ${a.verifikasi.interview}, disetujui ${a.verifikasi.disetujui}`}>
              <i className={TITIK[a.verifikasi.upload]} /><i className={TITIK[a.verifikasi.interview]} /><i className={TITIK[a.verifikasi.disetujui]} />
            </span>
            <span className="lv">{a.level}</span>
          </button>
        );
      })}
    </div>
  );
}
