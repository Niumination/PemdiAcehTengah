/**
 * components/rk/Panel.js — Panel-panel kecil Ruang Kendali (Patch 1):
 *   Situasi · AntreanTabel · BebanPJ · Linimasa · Prasyarat · Tag · Lv · Mini
 */
import Link from 'next/link';
import { useMemo } from 'react';
import Ikon from '@/components/ui/Ikon';
import { fmt2, hariKe, antreanUntukOPD } from '@/lib/ruangKendali';
import { statusMeta } from '@/lib/pemdiNilai';
import { useRK } from './RKShell';

export const Tag = ({ k, children }) => <span className={`rk-tag t-${k}`}>{children}</span>;
export const Lv = ({ d, b }) => (
  <span className="rk-lv" aria-label={`Level ${d} dari 5`}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= d ? 'on' : n === b ? 'nx' : ''} />)}</span>
);
export const Mini = ({ s }) => {
  const t = s.total || 1;
  return (
    <span className="rk-mini" aria-hidden="true">
      <i style={{ width: `${(s.diterima / t) * 100}%`, background: 'var(--rk-ok)' }} />
      <i style={{ width: `${(s.revisi / t) * 100}%`, background: 'var(--rk-bad)' }} />
      <i style={{ width: `${((s.proses || 0) / t) * 100}%`, background: 'var(--rk-warn)' }} />
      <i style={{ width: `${(s.draf / t) * 100}%`, background: 'var(--rk-draf)' }} />
    </span>
  );
};

const TGL = (iso) => new Date(`${iso}T00:00:00+07:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/** Pita situasi — 5–7 metrik, kritis di kiri. */
export function Situasi({ s, now }) {
  const rk = useRK();
  const antrean = rk?.opd ? antreanUntukOPD(rk.data.antrean, rk.opd) : rk?.data?.antrean || [];
  const tinggi = antrean.filter((b) => b.prioritas === 'tinggi').length;
  const h = hariKe(s.tenggat, now);
  const hv = hariKe('2026-10-01', now);
  return (
    <section className="rk-sit" aria-label="Situasi">
      <div className="lead">
        <div className="lbl">Indeks Pemdi · hasil asesor KemenPANRB</div>
        <div className="val">{s.asesor ? fmt2(s.asesor.indeks) : fmt2(s.indeks)}<small>/ target {fmt2(s.target)}{s.asesor ? ` · ${s.asesor.level}` : ''}</small></div>
        <div className="sub">{s.asesor ? <>mandiri awal {fmt2(s.asesor.mandiriAwal)} · simulasi butir {fmt2(s.indeks)} ({s.predikat}) · proyeksi {fmt2(s.proyeksi)} · SPBE {fmt2(s.baselineSpbe)}</> : <>{s.predikat} · proyeksi {fmt2(s.proyeksi)} · baseline SPBE {fmt2(s.baselineSpbe)}</>}</div>
      </div>
      <div className={`hari${h <= 3 ? ' kritis' : ''}`}>
        <div className="lbl">Tenggat revisi internal</div>
        <div className="val">{h >= 0 ? `H−${h}` : `H+${-h}`}</div>
        <div className="sub">{TGL(s.tenggat)} · visitasi {hv >= 0 ? `H−${hv}` : 'berjalan'}</div>
      </div>
      <div>
        <div className="lbl">Tahap 1 · eval.spbe.go.id</div>
        <div className="val"><span style={{ color: 'var(--rk-status-ink-ok)' }}>{s.tahap1.diterima}</span><small>diterima</small></div>
        <div className="sub"><b style={{ color: 'var(--rk-status-ink-bad)' }}>{s.tahap1.revisi}</b> revisi dari {s.tahap1.dinilai} dinilai</div>
      </div>
      <div>
        <div className="lbl">{rk?.opd ? `Antrean ${rk.opd.singkat}` : 'Antrean catatan mandiri'}</div>
        <div className="val">{antrean.length}<small>butir</small></div>
        <div className="sub"><b style={{ color: 'var(--rk-status-ink-bad)' }}>{tinggi}</b> prioritas tinggi</div>
      </div>
      <div>
        <div className="lbl">Seluruh bukti · 232</div>
        <div className="val">{s.stat.diterima + s.stat.revisi + s.stat.draf}<small>disentuh</small></div>
        <div className="sub">{s.stat.draf} draf lokal · {s.stat.belum} belum ada dokumen</div>
        <Mini s={s.stat} />
      </div>
    </section>
  );
}

/** Tabel antrean (dipakai ringkas di /dashboard & penuh di /antrean). */
export function AntreanTabel({ rows, ringkas = false }) {
  const rk = useRK();
  return (
    <div className="rk-wrap">
      <table className="rk-table">
        <thead>
          <tr>
            <th>Kode</th><th>Butir</th>{!ringkas ? <th>Jenis</th> : null}<th>Prioritas</th><th>PJ</th>{!ringkas ? <th>Status</th> : null}{!ringkas ? <th>Masih disiapkan</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id} className="klik" tabIndex={0} onClick={() => rk?.bukaButir(b.id, b.indikatorId)} onKeyDown={(e) => { if (e.key === 'Enter') rk?.bukaButir(b.id, b.indikatorId); }} aria-label={`Buka ${b.kode}`}>
              <td className="kode">{b.kode}</td>
              <td><div className="nm">{b.nama}</div><div className="faint" style={{ fontSize: 11.5 }}>{b.indikatorId} · {b.aspekNama} · bobot {b.bobot}%</div></td>
              {!ringkas ? <td><Tag k={b.jenis === 'revisi' ? 'revisi' : 'gap'}>{b.jenis === 'revisi' ? 'revisi asesor' : 'gap'}</Tag></td> : null}
              <td><Tag k={b.prioritas}>{b.prioritas}</Tag></td>
              <td style={{ whiteSpace: 'nowrap' }}>{b.pjKunci}</td>
              {!ringkas ? <td><Tag k={b.status}>{statusMeta(b.status).label}</Tag></td> : null}
              {!ringkas ? <td className="muted" style={{ maxWidth: 320 }}>{b.nKebutuhan ? `${b.nKebutuhan} item — ${b.kebutuhan[0]}` : '—'}</td> : null}
            </tr>
          ))}
          {!rows.length ? <tr><td colSpan={7} className="faint" style={{ textAlign: 'center', padding: 20 }}>Tidak ada butir untuk filter ini.</td></tr> : null}
        </tbody>
      </table>
    </div>
  );
}

/** Beban per PJ — hanya OPD yang punya butir; klik = filter persona PJ. */
export function BebanPJ({ rows }) {
  const rk = useRK();
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <div className="rk-beban">
      {rows.map((r) => (
        <div className="row" key={r.id}>
          <button type="button" onClick={() => { rk?.setPersona('pj'); rk?.setOpd(String(r.id)); }} title={r.nama} aria-pressed={String(rk?.opdId) === String(r.id) && rk?.persona === 'pj'}>{r.singkat}</button>
          <span className="bar" aria-label={`${r.total} butir: ${r.tinggi} tinggi, ${r.sedang} sedang, ${r.rendah} rendah`}>
            <i style={{ width: `${(r.tinggi / max) * 100}%`, background: 'var(--rk-bad)' }} />
            <i style={{ width: `${(r.sedang / max) * 100}%`, background: 'var(--rk-warn)' }} />
            <i style={{ width: `${(r.rendah / max) * 100}%`, background: 'var(--rk-info)' }} />
          </span>
          <span className="n">{r.total}</span>
        </div>
      ))}
      <div className="ket"><span><i style={{ background: 'var(--rk-bad)' }} />tinggi</span><span><i style={{ background: 'var(--rk-warn)' }} />sedang</span><span><i style={{ background: 'var(--rk-info)' }} />rendah</span></div>
    </div>
  );
}

export function Linimasa({ tahap, now }) {
  return (
    <ol className="rk-tl">
      {tahap.map((t) => {
        const h = hariKe(t.status === 'aktif' ? t.selesai : t.mulai, now);
        return (
          <li key={t.id} className={t.status}>
            <b>{t.label}</b>
            {t.status !== 'selesai' ? <span className="hari">{h >= 0 ? `H−${h}` : `H+${-h}`}</span> : null}
            <div className="tgl">{TGL(t.mulai)}{t.selesai !== t.mulai ? ` – ${TGL(t.selesai)}` : ''}</div>
            <div className="muted">{t.ket}</div>
          </li>
        );
      })}
    </ol>
  );
}

export function Prasyarat({ rows }) {
  return (
    <ul className="rk-pra">
      {rows.map((d) => (
        <li key={d.no}>
          <div><b>{d.nama}</b><div className="ind">{d.ind}</div><div className="muted" style={{ fontSize: 12 }}>{d.pj}</div></div>
          <Link href="/requirement" className="faint" aria-label={`Draf ${d.nama}`}><Ikon nama="kanan" /></Link>
        </li>
      ))}
    </ul>
  );
}

/** Hook filter antrean sesuai persona/OPD aktif. */
export function useAntreanAktif() {
  const rk = useRK();
  return useMemo(() => (rk?.opd ? antreanUntukOPD(rk.data.antrean, rk.opd) : rk?.data?.antrean || []), [rk]);
}
