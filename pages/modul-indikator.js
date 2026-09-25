/**
 * pages/modul-indikator.js — Modul Indikator Pemdi bergaya Ruang Kendali (Patch 13, Tahap 3d).
 *
 * Struktur "anak tangga": 20 modul → tiap modul kartu lipat dengan tangga L1–L5 (dicapai / target berikut),
 * kriteria per level (teks baku Modul/PermenPANRB 8/2026 tidak diparafrasa) berdampingan dengan butir bukti
 * existing per level (status asesor, dokumen kunci, pratinjau PDF, catatan mandiri). Matriks Kebutuhan L1–L2
 * (NotebookLM × Panduan Bab 6) menjadi panel lipat tersendiri. Bagian yang sebelumnya `{false && …}` (≈640
 * baris "Bukti Dukung Baru", "Peta Dokumen Kunci", "RPJMD", "Dokumen Pendukung") dihapus — hanya yang tampil.
 * Data tetap: 5 JSON via getStaticProps (tidak berubah).
 */
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import useUrlState from '@/lib/useUrlState';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import { useRK } from '@/components/rk/RKShell';
import CatatanTujuan from '@/components/CatatanTujuan';
import StatusIkon from '@/components/ui/StatusIkon';
import Ikon from '@/components/ui/Ikon';
import { CatatanButir, EksporCatatan } from '@/components/asesor/CatatanMandiri';
import { LEVEL_LABEL, LEVEL_NAMA_RESMI, STATUS_META, REVISI_JENIS, statistikIndikator, fokusLevel, statusMeta } from '@/lib/pemdiNilai';
import { warnaAspek, kodePortal } from '@/lib/ruangKendali';

const TAB = [
  { key: 'semua', label: 'Semua' },
  { key: 'revisi', label: 'Revisi asesor' },
  { key: 'perlu', label: 'Perlu dikerjakan' },
  { key: 'selesai', label: 'Selesai' },
];
const toProxyUrl = (url) => (!url ? '' : url.startsWith('/') ? url : `/api/proxy-pdf?url=${encodeURIComponent(url)}`);
const potong = (s, n) => (s.length > n ? `${s.slice(0, n)}…` : s);

/* ── Kartu modul ─────────────────────────────────────────────────────────── */
function Modul({ m, warna, buka, onToggle, dokumenUntuk, infoDokumen, onPratinjau, metaCatatan }) {
  const rk = useRK();
  const ind = m.ind;
  const f = ind ? fokusLevel(ind) : null;
  const [lvAktif, setLvAktif] = useState(null); // null → level fokus
  const perLevel = [1, 2, 3, 4, 5].map((l) => ({
    l,
    kriteria: m.level_kriteria?.find((x) => x.level === l) || null,
    butir: ind?.bukti_dukung?.filter((b) => Number(b.level) === l) || [],
    contoh: m.data_dukung_modul?.find((x) => x.level === l) || null,
  }));
  const lvTampil = lvAktif ?? (f?.levelBerikut || f?.levelDicapai || 1);
  const aktif = perLevel[lvTampil - 1];
  const st = m.status;
  const pj = ind?.penanggung_jawab;
  const l0 = m.level_kriteria?.find((x) => x.level === 0);
  return (
    <article id={`modul-${m.nomor}`} className={`rk-modul${buka ? ' on' : ''}`} style={{ '--warna': warna }}>
      <button type="button" className="hd" onClick={onToggle} aria-expanded={buka}>
        <span className="no">{m.nomor}</span>
        <span className="ttl">
          <b><span className="mono">{m.indikator_id}</span> {m.judul}</b>
          <span className="sub">{m.aspek} · PJ {pj?.lead?.split(' (')[0] || '—'} · {st.count} butir</span>
        </span>
        <span className="tangga" aria-label={`Level dicapai ${f?.levelDicapai ?? 0}`}>
          {[1, 2, 3, 4, 5].map((l) => <i key={l} className={l <= (f?.levelDicapai || 0) ? 'on' : l === f?.levelBerikut ? 'nx' : ''} title={`L${l} ${LEVEL_NAMA_RESMI[l]}`} />)}
        </span>
        <span className="rk-stack kecil" aria-hidden="true">
          {['diterima', 'revisi', 'proses', 'draf', 'belum'].map((k) => (st[k] ? <i key={k} className={`s-${k}`} style={{ flex: st[k] }} /> : null))}
        </span>
        <span className="n mono">{st.diterima}/{st.count}{st.revisi ? <em> · {st.revisi} revisi</em> : null}</span>
        <Ikon nama="lipat" size={14} />
      </button>

      {buka ? (
        <div className="isi">
          {/* baris atas: deskripsi Permen + posisi */}
          <div className="atas">
            {m.deskripsi ? (
              <details className="desk">
                <summary>{m.deskripsi.split(/(?<=\.)\s/)[0]} <span>— baca deskripsi lengkap Permen</span></summary>
                <p>{m.deskripsi.replace(/\.\s+([A-Z][^.:]{2,40}:)\s+1\./g, '.\n$1\n1.').replace(/\s(\d+\.)\s/g, '\n$1 ')}</p>
              </details>
            ) : null}
            {m.rekomendasi?.length ? (
              <div className="posisi">
                <div className="lbl">Posisi &amp; langkah berikut</div>
                <ul>{m.rekomendasi.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            ) : null}
          </div>

          {/* tangga level: pilih level → kriteria & butir */}
          <div className="rk-ladder" role="tablist" aria-label="Pilih level">
            {perLevel.map(({ l, butir }) => {
              const cls = l <= (f?.levelDicapai || 0) ? ' on' : l === f?.levelBerikut ? ' nx' : '';
              const dt = butir.filter((b) => b.status === 'diterima').length;
              return (
                <button key={l} type="button" role="tab" aria-selected={lvTampil === l} className={`rung${cls}${lvTampil === l ? ' pilih' : ''}`} onClick={() => setLvAktif(l)}>
                  <b>L{l} · {LEVEL_NAMA_RESMI[l]}</b>
                  <span>{butir.length} butir · {dt} diterima</span>
                </button>
              );
            })}
          </div>
          {l0 ? <p className="rk-catatan l0">Kondisi awal (L0): {l0.ringkasan}</p> : null}

          <div className="dua">
            {/* kiri: kriteria & contoh bukti modul */}
            <section className="krit">
              <h4>Kriteria Level {lvTampil} <small>{LEVEL_LABEL[lvTampil]}</small></h4>
              {aktif.kriteria ? (
                <>
                  {aktif.kriteria.ringkasan ? <p className="ring">{aktif.kriteria.ringkasan}</p> : null}
                  {aktif.kriteria.bukti_dukung?.length ? (
                    <ol className="item">
                      {aktif.kriteria.bukti_dukung.map((b, i) => (
                        <li key={i}><b>{b.item}</b>{b.output ? <span className="out">Output: {b.output}</span> : null}</li>
                      ))}
                    </ol>
                  ) : <p className="rk-catatan">— indikator eksternal / belum ada item bukti di Daftar Lengkap</p>}
                </>
              ) : <p className="rk-catatan">— tidak ada kriteria pada level ini</p>}
              {aktif.contoh?.items?.length ? (
                <details className="contoh">
                  <summary>Contoh bukti dukung sesuai kondisi Aceh Tengah ({aktif.contoh.items.length})</summary>
                  <ul>{aktif.contoh.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
                </details>
              ) : null}
            </section>

            {/* kanan: butir existing pada level ini */}
            <section className="butir">
              <h4>Butir existing L{lvTampil} <small>{aktif.butir.filter((b) => b.status === 'diterima').length}/{aktif.butir.length} diterima</small></h4>
              {st.revisi > 0 ? (
                <p className="peringatan"><StatusIkon k="revisi" /> {st.revisi} butir indikator ini dinyatakan <b>revisi</b> oleh asesor — perbaiki lalu unggah ulang di eval.spbe.go.id. Draf perbaikan: <Link href="/requirement">Draf Bukti Dukung</Link>.</p>
              ) : null}
              {aktif.butir.length ? (
                <ul className="rk-butir">
                  {aktif.butir.map((b) => {
                    const sm = statusMeta(b.status);
                    const dk = ind ? dokumenUntuk(ind.id, b.id) : [];
                    const url = b.url_preview || '';
                    return (
                      <li key={b.id}>
                        <div className="row">
                          <StatusIkon k={b.status} />
                          <span className="mono kode">{b.eval?.kode || kodePortal(b.id)}</span>
                          <span className="nama">
                            {b.nama}
                            {b._peran === 'pendukung' ? <span className="rk-tag t-belum" title="Dokumen penunjang — tidak dihitung kelengkapan level">pendukung</span> : null}
                            {b.detail ? <span className="det">{b.detail}</span> : null}
                            {b.status === 'revisi' && b.catatan ? <span className="rev">{REVISI_JENIS[b.eval?.jenis]?.label || 'Revisi'}: {b.catatan}</span> : null}
                            <span className="meta">
                              {b.opd?.map((o, i) => <span key={i} className="opd">{o}</span>)}
                              {dk.map((no) => <span key={no} className="dk" title={infoDokumen(no)?.nama || ''}>#{no}</span>)}
                            </span>
                          </span>
                          <span className="rk-tag" style={{ color: sm.color }}>{sm.label}</span>
                          <span className="aksi">
                            {b._ext === 'pdf' && url ? <button type="button" className="rk-btn kecil" title="Pratinjau PDF" onClick={() => onPratinjau({ url: toProxyUrl(url), title: b.nama })}><Ikon nama="dokumen" size={14} /></button> : null}
                            {b._ext === 'url' && url ? <a className="rk-btn kecil" href={url} target="_blank" rel="noopener noreferrer" title="Buka tautan"><Ikon nama="luar" size={14} /></a> : null}
                            {rk?.bukaButir ? <button type="button" className="rk-btn kecil" onClick={() => rk.bukaButir(b.id, ind.id)} aria-label={`Buka butir ${kodePortal(b.id)} di panel`}><Ikon nama="kanan" size={14} /></button> : null}
                          </span>
                        </div>
                        <CatatanButir b={b} ind={ind} />
                      </li>
                    );
                  })}
                </ul>
              ) : <p className="rk-catatan">— belum ada butir bukti pada level ini</p>}
            </section>
          </div>

          <div className="rk-ind-ft">
            {pj ? <span className="pj"><b>PJ</b> {pj.lead}{pj.support?.length ? <span className="faint"> · dukungan {pj.support.join(', ')}</span> : null}{pj.tim ? <span className="faint"> · {pj.tim}</span> : null}</span> : null}
            <Link href="/pemdi" className="rk-btn"><Ikon nama="aspek" size={14} /> Lihat di simulasi</Link>
            {rk?.bukaIndikator && ind ? <button type="button" className="rk-btn" onClick={() => rk.bukaIndikator(ind.id)}><Ikon nama="luar" size={14} /> Panel samping</button> : null}
            {ind ? <EksporCatatan ind={ind} meta={metaCatatan} compact /> : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/* ── Matriks kebutuhan L1–L2 ─────────────────────────────────────────────── */
function Matriks({ data, aspekWarna }) {
  const [buka, setBuka] = useState(null);
  const si = data.status_indikasi;
  return (
    <>
      <div className="rk-chips" style={{ marginBottom: 10 }}>
        <span className="rk-tag t-belum">{data.cakupan.total_kebutuhan} kebutuhan L1+L2</span>
        <span className="rk-tag t-belum">{data.cakupan.indikator} indikator</span>
        <span className="rk-tag t-diterima">{si.diterima} indikasi diterima</span>
        {si.revisi ? <span className="rk-tag t-revisi">{si.revisi} revisi</span> : null}
        {si.draf ? <span className="rk-tag t-draf">{si.draf} draf lokal</span> : null}
        <span className="rk-tag t-belum">{si.belum} belum</span>
        <span className="rk-tag t-proses">{si.perlu_verifikasi} perlu verifikasi</span>
      </div>
      <p className="rk-catatan" style={{ marginBottom: 10 }}><b>Catatan implementasi:</b> {data.catatan_implementasi}</p>
      <div className="rk-mx">
        {data.indikator.map((e) => {
          const on = buka === e.indikator;
          const semua = e.level.flatMap((lv) => lv.kebutuhan);
          const n = semua.filter((k) => k.status_indikasi === 'diterima').length;
          const w = aspekWarna(e.aspek_singkat);
          return (
            <article key={e.indikator} id={`matriks-${e.indikator}`} className={`rk-modul${on ? ' on' : ''}`} style={{ '--warna': w }}>
              <button type="button" className="hd" onClick={() => setBuka(on ? null : e.indikator)} aria-expanded={on}>
                <span className="no">{e.indikator}</span>
                <span className="ttl"><b>{e.nama}</b><span className="sub">{e.aspek} · bobot {e.bobot}% · nilai {e.nilai_saat_ini} → target {e.target_indikator}</span></span>
                <span className="jalur"><i style={{ width: `${(n / Math.max(1, semua.length)) * 100}%` }} /></span>
                <span className="n mono">{n}/{semua.length}</span>
                <Ikon nama="lipat" size={14} />
              </button>
              {on ? (
                <div className="isi">
                  {e.catatan_grup ? <p className="rk-catatan">{e.catatan_grup}</p> : null}
                  {e.pic ? <p className="rk-catatan"><b>PIC:</b> {e.pic.lead}{e.pic.support?.length ? ` (${e.pic.support.slice(0, 3).join(', ')}${e.pic.support.length > 3 ? '…' : ''})` : ''}</p> : null}
                  {e.level.map((lv) => (
                    <div key={lv.level} className="rk-lvl">
                      <div className="rk-lvl-h"><span className="mono">L{lv.level}</span> {LEVEL_NAMA_RESMI[lv.level] || `Level ${lv.level}`}</div>
                      <div className="gulir">
                        <table className="rk-table">
                          <thead><tr><th>#</th><th>Kebutuhan bukti dukung</th><th>Status indikasi</th><th>Rujukan modul</th></tr></thead>
                          <tbody>
                            {lv.kebutuhan.map((k) => {
                              const sm = k.status_indikasi ? STATUS_META[k.status_indikasi] || STATUS_META.belum : { key: 'proses', label: 'Perlu verifikasi', color: 'var(--rk-status-ink-warn)' };
                              const gt = k.bukti_terkait?.[0];
                              return (
                                <tr key={k.no}>
                                  <td className="mono faint">{k.no}</td>
                                  <td>{k.bukti}{k.kondisi ? <div className="faint">{k.kondisi}</div> : null}{gt ? <div className="rujuk">{gt.id} — {potong(gt.nama.replace(/^\d+\.\s*/, ''), 90)}</div> : null}</td>
                                  <td><span className="rk-tag" style={{ color: sm.color }}><StatusIkon k={sm.key || k.status_indikasi || 'proses'} /> {sm.label}</span></td>
                                  <td>{k.modul_item ? <span className="ok" title={k.modul_item}>terpetakan</span> : <span className="faint" title="Tidak ditemukan item modul yang persis sama — cek kriteria level pada modul">— (elaborasi)</span>}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                  {e.panduan_bab6 ? (
                    <details className="bab6">
                      <summary>Panduan Bab 6 — cara memperoleh dokumen{e.panduan_bab6.target ? <span className="faint"> · target {e.panduan_bab6.target}</span> : null}</summary>
                      <div className="gulir">
                        <table className="rk-table">
                          <thead><tr><th>Dokumen</th><th>Format</th>{e.panduan_bab6.dokumen.some((d) => d.pic) ? <th>Penanggung jawab</th> : null}<th>Cara mendapatkan</th></tr></thead>
                          <tbody>
                            {e.panduan_bab6.dokumen.map((d, i) => (
                              <tr key={i}><td><b>{d.dokumen}</b></td><td>{d.format}</td>{e.panduan_bab6.dokumen.some((x) => x.pic) ? <td>{d.pic || '—'}</td> : null}<td>{d.cara}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
      <p className="rk-catatan" style={{ marginTop: 10 }}>Status indikasi dipetakan otomatis ke bukti existing di <code>data/pemdi.json</code> (indikatif — tetap perlu verifikasi substansi kriteria level). Dibangun oleh <code>scripts/build-kebutuhan-bukti.py</code> pada {data.dibangun}. Sumber: {data.sumber}. Indikator eksternal ({data.cakupan.tidak_dibahas.map((x) => x.split(' ')[0]).join(', ')}) tidak dibahas pada dokumen sumber.</p>
    </>
  );
}

/* ── Halaman ─────────────────────────────────────────────────────────────── */
export default function ModulIndikatorPage({ moduls, pemdiData, dokumenKunci, buktiMapping, kebutuhanData }) {
  const router = useRouter();
  const [cari, setCari] = useState('');
  const [aspek, setAspek] = useUrlState('aspek', '');
  const [levelStr, setLevelStr] = useUrlState('level', '0');
  const level = Number(levelStr) || 0;
  const setLevel = (v) => setLevelStr(String(typeof v === 'function' ? v(level) : v));
  const [tab, setTab] = useUrlState('tab', 'semua');
  const [buka, setBuka] = useState(null);
  const [pratinjau, setPratinjau] = useState(null);

  const indMap = useMemo(() => {
    const m = {};
    pemdiData.aspek.forEach((a) => a.indikator.forEach((i) => { m[i.id] = { ...i, aspekNama: a.nama, aspekSingkat: a.singkat, aspekWarna: a.warna }; }));
    return m;
  }, [pemdiData]);
  const merged = useMemo(() => moduls.modules.map((m) => {
    const ind = indMap[m.indikator_id];
    const s = statistikIndikator(ind);
    return { ...m, ind, status: { ...s, count: s.total } };
  }), [moduls, indMap]);
  const aspekList = useMemo(() => [...new Set(merged.map((m) => m.aspek))], [merged]);
  const hitungTab = (k, list) => list.filter((m) => (k === 'revisi' ? m.status.revisi > 0 : k === 'perlu' ? m.status.belum + m.status.proses + m.status.draf + m.status.revisi > 0 : k === 'selesai' ? m.status.count > 0 && m.status.diterima === m.status.count : true)).length;
  const filtered = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return merged.filter((m) => (!aspek || m.aspek === aspek)
      && (!level || m.ind?.bukti_dukung?.some((b) => Number(b.level) === level))
      && (!q || m.judul?.toLowerCase().includes(q) || m.deskripsi?.toLowerCase().includes(q) || m.indikator_id?.toLowerCase().includes(q))
      && hitungTab(tab, [m]) === 1);
  }, [merged, aspek, level, cari, tab]);

  const dokumenUntuk = (indId, buktiId) => buktiMapping.indikator.find((i) => i.indikator_id === indId)?.bukti.find((x) => x.id === buktiId)?.dokumen_kunci || [];
  const infoDokumen = (no) => dokumenKunci.dokumen.find((d) => String(d.no) === String(no));
  const aspekWarna = (singkat) => pemdiData.aspek.find((a) => a.singkat === singkat)?.warna || warnaAspek(singkat) || 'var(--rk-ink-3)';
  const warnaModul = (m) => m.ind?.aspekWarna || warnaAspek(m.ind?.aspekSingkat) || 'var(--rk-ink-3)';

  useEffect(() => {
    const n = parseInt(router.query.modul, 10);
    if (n >= 1 && n <= 20) {
      setBuka(String(n));
      const t = setTimeout(() => document.getElementById(`modul-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [router.query.modul]);
  useEffect(() => {
    if (!pratinjau) return undefined;
    const h = (e) => { if (e.key === 'Escape') setPratinjau(null); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [pratinjau]);

  const tot = (k) => merged.reduce((s, m) => s + (m.status[k] || 0), 0);
  const t1 = pemdiData.penilaian_tahap1;
  const metaCatatan = { versi: pemdiData.catatan_mandiri_meta?.versi, tahun: pemdiData.tahun };
  const dicapai = merged.filter((m) => m.ind && fokusLevel(m.ind).levelDicapai >= 1).length;

  return (
    <>
      <Head>
        <title>Modul indikator — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Panduan bukti dukung 20 indikator Pemerintah Digital (PermenPANRB 8/2026): kriteria per level, butir existing berstatus asesor, penanggung jawab, matriks kebutuhan L1–L2." />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan modul indikator">
          <div className="lead"><div className="lbl">Modul indikator</div><div className="val">{merged.length}<small>indikator · {tot('count')} butir</small></div><div className="sub">kode bukti <span className="mono">I#-L#-##</span> = indikator-level-urut · status mengikuti asesor eval.spbe.go.id</div></div>
          <div><div className="lbl">Diterima</div><div className="val" style={{ color: 'var(--rk-status-ink-ok)' }}>{tot('diterima')}</div><div className="sub">{dicapai} indikator sudah mencapai ≥ L1</div></div>
          <div><div className="lbl">Revisi</div><div className="val" style={{ color: 'var(--rk-status-ink-bad)' }}>{tot('revisi')}</div><div className="sub">{hitungTab('revisi', merged)} indikator terdampak</div></div>
          <div><div className="lbl">Draf lokal</div><div className="val">{tot('draf') + tot('proses')}</div><div className="sub">belum diunggah ke portal</div></div>
          <div><div className="lbl">Tahap 1 portal</div><div className="val">{t1?.dinilai ?? '—'}<small>dinilai</small></div><div className="sub">sinkron {t1?.tanggal_sinkron || '—'}</div></div>
        </section>

        <CatatanTujuan compact />

        <LipatSemua keterangan="Tiap modul: tangga L1–L5 → klik level untuk melihat kriteria baku dan butir existing berdampingan.">
          <span className="rk-seg kecil" role="group" aria-label="Saring status">
            {TAB.map((t) => <button key={t.key} type="button" aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>{t.label} ({hitungTab(t.key, merged)})</button>)}
          </span>
        </LipatSemua>

        <section className="rk-panel rk-c12 rk-modul-kendali">
          <label className="rk-cari-box">
            <Ikon nama="cari" size={16} />
            <input type="search" value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari indikator / kata kunci…" aria-label="Cari modul indikator" autoComplete="off" />
            {cari ? <button type="button" className="rk-act" onClick={() => setCari('')} aria-label="Bersihkan"><Ikon nama="tutup" size={12} /></button> : null}
          </label>
          <div className="rk-chips" role="group" aria-label="Saring aspek">
            <button type="button" className="rk-chip" aria-pressed={!aspek} onClick={() => setAspek('')}>Semua aspek</button>
            {aspekList.map((a) => <button key={a} type="button" className="rk-chip" aria-pressed={aspek === a} onClick={() => setAspek(aspek === a ? '' : a)}><span className="sw" style={{ background: aspekWarna(pemdiData.aspek.find((x) => x.nama === a)?.singkat) }} />{a.replace(/^Aspek /, '')}</button>)}
          </div>
          <span className="rk-seg kecil" role="group" aria-label="Saring level">
            <button type="button" aria-pressed={!level} onClick={() => setLevel(0)}>Semua level</button>
            {[1, 2, 3, 4, 5].map((l) => <button key={l} type="button" aria-pressed={level === l} onClick={() => setLevel(level === l ? 0 : l)} title={LEVEL_NAMA_RESMI[l]}>L{l}</button>)}
          </span>
        </section>

        <PanelLipat id="modul-daftar" judul="Daftar modul indikator" ringkas={`· ${filtered.length} dari ${merged.length}`} aksi={<span className="rk-act faint">{buka ? <button type="button" className="rk-act" onClick={() => setBuka(null)}>tutup modul</button> : 'klik modul untuk membuka'}</span>}>
          <div className="rk-modul-daftar">
            {filtered.map((m) => (
              <Modul key={m.nomor} m={m} warna={warnaModul(m)} buka={buka === String(m.nomor)} onToggle={() => setBuka(buka === String(m.nomor) ? null : String(m.nomor))} dokumenUntuk={dokumenUntuk} infoDokumen={infoDokumen} onPratinjau={setPratinjau} metaCatatan={metaCatatan} />
            ))}
            {!filtered.length ? <p className="rk-catatan" style={{ padding: 20, textAlign: 'center' }}>Tidak ada modul yang cocok dengan saringan.</p> : null}
          </div>
        </PanelLipat>

        <PanelLipat id="modul-matriks" judul="Matriks kebutuhan bukti dukung — Level 1 & 2" ringkas={`· ${kebutuhanData.cakupan.total_kebutuhan} kebutuhan`} awal="tutup" aksi={<span className="rk-act faint">NotebookLM × Modul × Panduan Bab 6</span>}>
          <p className="rk-catatan" style={{ marginBottom: 10 }}>Disusun dari <em>Analisis Bukti Dukung Kematangan Pemerintah Digital (Level 1 &amp; 2)</em> — ekstraksi NotebookLM atas 20 PPTX Modul Indikator (<code>docs/analisis-bukti-dukung-l1-l2.md</code>), disilangkan dengan item modul resmi, status bukti existing, dan tabel Panduan Bab 6.</p>
          <Matriks data={kebutuhanData} aspekWarna={aspekWarna} />
        </PanelLipat>

        <PanelLipat id="modul-dokumen" judul="Peta dokumen kunci" ringkas={`· ${dokumenKunci.dokumen.length} dokumen`} awal="tutup" aksi={<span className="rk-act faint">#nomor dirujuk pada butir existing</span>}>
          <div className="gulir">
            <table className="rk-table rk-dok">
              <thead><tr><th>#</th><th>Dokumen</th><th>Penanggung jawab</th><th>Indikator · level</th><th>Prioritas</th></tr></thead>
              <tbody>
                {dokumenKunci.dokumen.map((d) => (
                  <tr key={d.no} id={`dok-${d.no}`}>
                    <td className="mono">{d.no}</td>
                    <td><b>{d.nama}</b>{d.jenis ? <div className="faint">{d.jenis}</div> : null}</td>
                    <td>{d.penanggung_jawab}{d.unit_pendukung ? <div className="faint">{d.unit_pendukung.replace(/,\s*$/, '')}</div> : null}</td>
                    <td className="mono kecil">{d.indikator_level}</td>
                    <td>{d.prioritas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rk-catatan" style={{ marginTop: 8 }}>Sumber: {dokumenKunci.sumber}.</p>
        </PanelLipat>
      </div>

      {pratinjau ? (
        <div className="rk-pratinjau" role="dialog" aria-modal="true" aria-label={`Pratinjau ${pratinjau.title}`} onClick={() => setPratinjau(null)}>
          <div className="kotak" onClick={(e) => e.stopPropagation()}>
            <div className="bar"><b>{pratinjau.title}</b><a href={pratinjau.url} target="_blank" rel="noopener noreferrer" className="rk-btn"><Ikon nama="luar" size={14} /> Buka di tab baru</a><button type="button" className="rk-btn kecil" onClick={() => setPratinjau(null)} aria-label="Tutup pratinjau"><Ikon nama="tutup" size={14} /></button></div>
            <iframe src={pratinjau.url} title={pratinjau.title} />
          </div>
        </div>
      ) : null}
    </>
  );
}

/* Data dikirim via getStaticProps (Sprint B2) — JSON keluar dari client bundle. */
export async function getStaticProps() {
  return {
    props: {
      moduls: (await import('@/data/modul-indikator.json')).default,
      pemdiData: (await import('@/data/pemdi.json')).default,
      dokumenKunci: (await import('@/data/dokumen-kunci.json')).default,
      buktiMapping: (await import('@/data/bukti-dokumen-mapping.json')).default,
      kebutuhanData: (await import('@/data/kebutuhan-bukti-dukung.json')).default,
    },
  };
}
