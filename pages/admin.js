/**
 * /admin — CMS Ruang Kendali (Patch 4, 22 Sep 2026).
 * Dua peran (kata sandi bersama): Koordinator (semua butir + konten tampilan + log + ekspor)
 * dan PJ OPD (hanya butir milik OPD-nya; tidak bisa ganti PJ / menandai diterima).
 * Data dasar = JSON; suntingan disimpan sebagai overlay Postgres (Neon) dan tampil ≤ 60 dtk.
 * Nama butir & kriteria PermenPANRB 8/2026 hanya-baca.
 */
import Head from 'next/head';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useRK } from '@/components/rk/RKShell';
import { Tag } from '@/components/rk/Panel';
import Ikon from '@/components/ui/Ikon';
import { susunDataRK } from '@/lib/rkData';
import { antreanUntukOPD } from '@/lib/ruangKendali';
import { STATUS_SAH, PRIORITAS_SAH, KONTEN_SAH } from '@/lib/overlay';

const api = async (url, opsi = {}) => {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opsi });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
};

function Masuk({ opdPJ, onMasuk, status }) {
  const [peran, setPeran] = useState('koordinator');
  const [opd, setOpd] = useState('');
  const [sandi, setSandi] = useState('');
  const [galat, setGalat] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const kirim = async (e) => {
    e.preventDefault(); setGalat(''); setSibuk(true);
    try { const j = await api('/api/auth/masuk', { method: 'POST', body: JSON.stringify({ peran, sandi, opd: peran === 'pj' ? opd : undefined }) }); onMasuk(j.sesi); }
    catch (err) { setGalat(err.message); } finally { setSibuk(false); }
  };
  return (
    <section className="rk-panel rk-c12 rk-admin-masuk">
      <div className="rk-admin-masuk-kotak">
      <h2>Masuk CMS</h2>
      {!status.cmsAktif ? <p className="rk-catatan">CMS belum dikonfigurasi di server (env <code>CMS_SANDI_KOORDINATOR</code>, <code>CMS_SANDI_PJ</code>, <code>CMS_SESI_RAHASIA</code>). Dashboard tetap berjalan dari JSON.</p> : null}
      {status.cmsAktif && !status.dbAktif ? <p className="rk-catatan">Peringatan: <code>DATABASE_URL</code> belum diatur — masuk bisa, tetapi penyimpanan dinonaktifkan.</p> : null}
      <form onSubmit={kirim} className="rk-form">
        <div className="rk-seg" role="group" aria-label="Peran">
          <button type="button" aria-pressed={peran === 'koordinator'} onClick={() => setPeran('koordinator')}>Koordinator</button>
          <button type="button" aria-pressed={peran === 'pj'} onClick={() => setPeran('pj')}>PJ OPD</button>
        </div>
        {peran === 'pj' ? (
          <label>Perangkat daerah
            <select className="rk-select" required value={opd} onChange={(e) => setOpd(e.target.value)}>
              <option value="">— pilih —</option>
              {opdPJ.map((o) => <option key={o.id} value={o.id}>{o.singkat} ({o.total} butir)</option>)}
            </select>
          </label>
        ) : null}
        <label>Kata sandi peran
          <input className="rk-input" type="password" autoComplete="current-password" required value={sandi} onChange={(e) => setSandi(e.target.value)} />
        </label>
        {galat ? <p className="rk-galat" role="alert">{galat}</p> : null}
        <button className="rk-btn primer" type="submit" disabled={sibuk || !status.cmsAktif}>{sibuk ? 'Memeriksa…' : 'Masuk'}</button>
      </form>
      <p className="rk-catatan">Kata sandi dibagikan oleh Tim Koordinasi Pemdi. Sesi 12 jam, cookie httpOnly. Semua perubahan tercatat di log audit.</p>
      </div>
    </section>
  );
}

function FormButir({ b, overlay, sesi, onSimpan }) {
  const o = overlay || {};
  const [status, setStatus] = useState(o.status || b.status);
  const [prioritas, setPrioritas] = useState(o.prioritas || b.prioritas);
  const [pj, setPj] = useState(o.pj ?? b.pj);
  const [ringkas, setRingkas] = useState(o.ringkas ?? b.ringkasPenuh ?? b.ringkas);
  const [kebutuhan, setKebutuhan] = useState((o.kebutuhan ?? b.kebutuhanPenuh ?? []).join('\n'));
  const [pesan, setPesan] = useState('');
  const [sibuk, setSibuk] = useState(false);
  const pjBoleh = sesi.peran === 'koordinator';
  const simpan = async (e) => {
    e.preventDefault(); setSibuk(true); setPesan('');
    const patch = { status, prioritas, ringkas, kebutuhan: kebutuhan.split('\n').map((s) => s.trim()).filter(Boolean) };
    if (pjBoleh) patch.pj = pj;
    try { const j = await api(`/api/admin/butir/${encodeURIComponent(b.id)}`, { method: 'PATCH', body: JSON.stringify(patch) }); onSimpan(b.id, j.overlay); setPesan('Tersimpan — tampil di dashboard dalam ≤ 60 detik.'); }
    catch (err) { setPesan(`Gagal: ${err.message}`); } finally { setSibuk(false); }
  };
  return (
    <form className="rk-form rk-admin-butir" onSubmit={simpan}>
      <div className="rk-admin-baku">
        <span className="mono">{b.kode}</span> · L{b.level} · {b.indikatorId} {b.indikatorNama}
        <p><b>{b.nama}</b> <small className="muted">(nama butir PermenPANRB 8/2026 — hanya-baca)</small></p>
      </div>
      <div className="rk-form-baris">
        <label>Status bukti
          <select className="rk-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_SAH.map((s) => <option key={s} value={s} disabled={s === 'diterima' && !pjBoleh}>{s}</option>)}
          </select>
        </label>
        <label>Prioritas
          <select className="rk-select" value={prioritas} onChange={(e) => setPrioritas(e.target.value)}>
            {PRIORITAS_SAH.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>Penanggung jawab
          <input className="rk-input" value={pj} disabled={!pjBoleh} onChange={(e) => setPj(e.target.value)} maxLength={200} />
        </label>
      </div>
      <label>Catatan ringkas (disalin ke kolom catatan eval.spbe.go.id)
        <textarea className="rk-input" rows={5} value={ringkas} onChange={(e) => setRingkas(e.target.value)} maxLength={4000} />
      </label>
      <label>Kebutuhan yang masih harus disiapkan (satu per baris)
        <textarea className="rk-input" rows={3} value={kebutuhan} onChange={(e) => setKebutuhan(e.target.value)} />
      </label>
      <div className="rk-form-aksi">
        <button className="rk-btn primer" type="submit" disabled={sibuk}>{sibuk ? 'Menyimpan…' : 'Simpan'}</button>
        {o.diubah_pada ? <span className="muted">Terakhir: {o.diubah_oleh} · {new Date(o.diubah_pada).toLocaleString('id-ID')}</span> : <span className="muted">Belum pernah disunting (nilai dari JSON)</span>}
        {pesan ? <span role="status">{pesan}</span> : null}
      </div>
    </form>
  );
}

function KontenTampilan({ konten, onSimpan, bawaan }) {
  const [nilai, setNilai] = useState({ marquee: konten.marquee ?? '', pengumuman: konten.pengumuman ?? '', tenggat: konten.tenggat ?? bawaan.tenggat });
  const [pesan, setPesan] = useState({});
  const simpan = async (kunci) => {
    setPesan((p) => ({ ...p, [kunci]: '…' }));
    try { await api(`/api/admin/konten/${kunci}`, { method: 'PUT', body: JSON.stringify({ nilai: nilai[kunci] }) }); onSimpan(kunci, nilai[kunci]); setPesan((p) => ({ ...p, [kunci]: 'Tersimpan' })); }
    catch (err) { setPesan((p) => ({ ...p, [kunci]: `Gagal: ${err.message}` })); }
  };
  return (
    <section className="rk-panel rk-c12">
      <h2>Konten tampilan dashboard</h2>
      <div className="rk-form">
        {Object.entries(KONTEN_SAH).map(([k, m]) => (
          <div key={k} className="rk-form-konten">
            <label>{m.label}
              {m.tipe === 'teks' ? <textarea className="rk-input" rows={k === 'marquee' ? 2 : 3} maxLength={m.maks} value={nilai[k]} onChange={(e) => setNilai({ ...nilai, [k]: e.target.value })} placeholder={k === 'marquee' ? bawaan.marquee : ''} />
                : <input className="rk-input" type="date" value={nilai[k]} onChange={(e) => setNilai({ ...nilai, [k]: e.target.value })} />}
            </label>
            <div className="rk-form-aksi"><button type="button" className="rk-btn" onClick={() => simpan(k)}>Simpan</button><span className="muted">{pesan[k] || ''}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LogAudit() {
  const [log, setLog] = useState(null);
  useEffect(() => { api('/api/admin/log').then((j) => setLog(j.log)).catch(() => setLog([])); }, []);
  return (
    <section className="rk-panel rk-c12">
      <h2>Log audit <span className="rk-act muted">{log ? `${log.length} entri terakhir` : 'memuat…'}</span></h2>
      {log && log.length ? (
        <div className="rk-table-wrap"><table className="rk-table"><thead><tr><th>Waktu</th><th>Peran</th><th>Aksi</th><th>Target</th></tr></thead>
          <tbody>{log.map((l) => <tr key={l.id}><td className="mono">{new Date(l.waktu).toLocaleString('id-ID')}</td><td>{l.peran}{l.opd ? ` · ${l.opd}` : ''}</td><td>{l.aksi}</td><td className="mono">{l.target}</td></tr>)}</tbody></table></div>
      ) : log ? <p className="muted">Belum ada perubahan.</p> : null}
    </section>
  );
}

export default function Admin({ rk, bawaan, opdRingkas }) {
  const ctx = useRK();
  const [status, setStatus] = useState({ sesi: null, cmsAktif: false, dbAktif: false, dimuat: false });
  const [overlay, setOverlay] = useState({ butir: [], konten: {} });
  const [cari, setCari] = useState('');
  const [buka, setBuka] = useState(null);
  const [tab, setTab] = useState('butir');

  const muatOverlay = useCallback(() => api('/api/admin/overlay').then(setOverlay).catch(() => {}), []);
  useEffect(() => {
    api('/api/auth/sesi').then((j) => { setStatus({ ...j, dimuat: true }); if (j.sesi) muatOverlay(); }).catch(() => setStatus((s) => ({ ...s, dimuat: true })));
  }, [muatOverlay]);

  const petaOverlay = useMemo(() => new Map(overlay.butir.map((r) => [r.id, r])), [overlay]);
  const sesi = status.sesi;
  const opdSesi = useMemo(() => (sesi?.peran === 'pj' ? opdRingkas.find((x) => String(x.id) === String(sesi.opd)) : null), [sesi, opdRingkas]);

  // Antrean penuh (ringkas + kebutuhan lengkap diambil dari indikatorPenuh)
  const butirPenuh = useMemo(() => {
    const peta = new Map();
    for (const i of rk.indikatorPenuh) for (const b of i.bukti_dukung) peta.set(b.id, b);
    const dasar = opdSesi ? antreanUntukOPD(rk.antrean, opdSesi) : rk.antrean;
    return dasar.map((b) => {
      const p = peta.get(b.id); const o = petaOverlay.get(b.id);
      return { ...b, ringkasPenuh: p?.catatan_mandiri?.ringkas || b.ringkas, kebutuhanPenuh: p?.catatan_mandiri?.kebutuhan || [], status: o?.status || b.status, prioritas: o?.prioritas || b.prioritas, pj: o?.pj ?? b.pj, disunting: Boolean(o) };
    });
  }, [rk, opdSesi, petaOverlay]);

  const q = cari.trim().toLowerCase();
  const rows = butirPenuh.filter((b) => !q || b.kode.toLowerCase().includes(q) || b.nama.toLowerCase().includes(q) || b.pj.toLowerCase().includes(q) || b.indikatorId.toLowerCase() === q);

  const keluar = async () => { await api('/api/auth/keluar', { method: 'POST' }); setStatus((s) => ({ ...s, sesi: null })); setBuka(null); };
  const onSimpanButir = (id, o) => setOverlay((s) => ({ ...s, butir: [...s.butir.filter((r) => r.id !== id), { id, ...o, diubah_oleh: sesi.peran === 'pj' ? `pj:${sesi.opd}` : 'koordinator', diubah_pada: new Date().toISOString() }] }));
  const onSimpanKonten = (k, v) => setOverlay((s) => ({ ...s, konten: { ...s.konten, [k]: v } }));

  return (
    <>
      <Head><title>Admin CMS — Dashboard Pemerintah Digital Aceh Tengah</title><meta name="robots" content="noindex, nofollow" /></Head>
      <div className="rk-grid rk-admin">
        <section className="rk-panel rk-c12 rk-admin-kepala">
          <h2>CMS Ruang Kendali {sesi ? <span className="rk-act">{sesi.peran === 'pj' ? `PJ OPD · ${opdSesi?.singkat || sesi.opd}` : 'Koordinator'} <button type="button" className="rk-btn" onClick={keluar}>Keluar</button></span> : null}</h2>
          <p className="muted">Sumber dasar tetap <code>data/*.json</code> di repo. Suntingan di sini disimpan sebagai <em>overlay</em> ({overlay.butir.length} butir disunting) dan diterapkan ke dashboard ≤ 60 detik. Koordinator dapat <a href="/api/admin/ekspor">mengekspor</a> hasilnya untuk diserap kembali ke repo. {ctx?.hidrasi && !status.dbAktif && status.dimuat ? <b>DB tidak aktif — mode baca.</b> : null}</p>
        </section>

        {!status.dimuat ? null : !sesi ? <Masuk opdPJ={rk.opdPJ} status={status} onMasuk={(s) => { setStatus((st) => ({ ...st, sesi: s })); muatOverlay(); }} /> : (
          <>
            <section className="rk-panel rk-c12">
              <div className="rk-chips" role="tablist" aria-label="Bagian">
                <button type="button" className="rk-chip" role="tab" aria-pressed={tab === 'butir'} onClick={() => setTab('butir')}>Butir ({butirPenuh.length})</button>
                {sesi.peran === 'koordinator' ? <button type="button" className="rk-chip" role="tab" aria-pressed={tab === 'konten'} onClick={() => setTab('konten')}>Konten tampilan</button> : null}
                {sesi.peran === 'koordinator' ? <button type="button" className="rk-chip" role="tab" aria-pressed={tab === 'log'} onClick={() => setTab('log')}>Log audit</button> : null}
                {sesi.peran === 'koordinator' ? <a className="rk-btn" href="/api/admin/ekspor"><Ikon nama="unduh" /> Ekspor JSON</a> : null}
              </div>
            </section>

            {tab === 'butir' ? (
              <section className="rk-panel rk-c12">
                <h2>Butir bercatatan mandiri <span className="rk-act"><input className="rk-input" placeholder="cari kode / nama / PJ / I7" value={cari} onChange={(e) => setCari(e.target.value)} aria-label="Cari butir" /></span></h2>
                <div className="rk-table-wrap"><table className="rk-table rk-admin-tbl">
                  <thead><tr><th>Kode</th><th>Butir</th><th>Status</th><th>Prioritas</th><th>PJ</th><th></th></tr></thead>
                  <tbody>
                    {rows.map((b) => (
                      <Fragment key={b.id}>
                        <tr className={b.disunting ? 'disunting' : ''}>
                          <td className="mono">{b.kode}</td>
                          <td>{b.nama}{b.disunting ? <small className="muted"> · disunting</small> : null}</td>
                          <td><Tag k={b.status}>{b.status}</Tag></td>
                          <td><Tag k={b.prioritas}>{b.prioritas}</Tag></td>
                          <td>{b.pj}</td>
                          <td><button type="button" className="rk-btn" onClick={() => setBuka(buka === b.id ? null : b.id)} aria-expanded={buka === b.id}>{buka === b.id ? 'Tutup' : 'Sunting'}</button></td>
                        </tr>
                        {buka === b.id ? <tr className="rk-admin-form-baris"><td colSpan={6}><FormButir b={b} overlay={petaOverlay.get(b.id)} sesi={sesi} onSimpan={onSimpanButir} /></td></tr> : null}
                      </Fragment>
                    ))}
                  </tbody>
                </table></div>
                {!rows.length ? <p className="muted">Tidak ada butir yang cocok.</p> : null}
              </section>
            ) : null}
            {tab === 'konten' && sesi.peran === 'koordinator' ? <KontenTampilan konten={overlay.konten} bawaan={bawaan} onSimpan={onSimpanKonten} /> : null}
            {tab === 'log' && sesi.peran === 'koordinator' ? <LogAudit /> : null}
          </>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { default: opdJson } = await import('@/data/opd.json');
  const rk = await susunDataRK();
  // hanya bidang yang dipakai lib/pjButir.hitungButirOPD (alias/singkat/nama) — bukan seluruh opd.json
  const opdRingkas = opdJson.opd.daftar.map((o) => ({ id: o.id, singkat: o.singkat, nama: o.nama }));
  return { props: { rk, opdRingkas, bawaan: { tenggat: rk.situasi.tenggat, marquee: 'Dashboard Pemerintah Digital Kabupaten Aceh Tengah — Ruang kendali evaluasi 2026 · …' } }, revalidate: 60 };
}
