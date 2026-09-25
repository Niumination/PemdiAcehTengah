/**
 * /requirement — "Draf Bukti Dukung Prioritas" dalam gaya Ruang Kendali (Patch 10, Tahap 3a).
 * Pola: PAPAN TUGAS tiga kolom  — P0 Revisi asesor · P1 Gap level berikut · Panduan siap unggah —
 * dengan kartu ringkas yang membuka detail (catatan asesor apa adanya, contoh modul, templat).
 * Tab sekunder: Kebutuhan Data Peta Proses Bisnis (PermenPANRB 19/2018). Data tidak diubah:
 * draf-bukti-prioritas.json · panduan-bukti-l1.json · requirement.json.
 */
import { useMemo, useState } from 'react';
import useUrlState from '@/lib/useUrlState';
import Head from 'next/head';
import Link from 'next/link';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import { useRK } from '@/components/rk/RKShell';
import StatusIkon from '@/components/ui/StatusIkon';
import Ikon from '@/components/ui/Ikon';
import CatatanTujuan from '@/components/CatatanTujuan';
import panduanBukti from '@/data/panduan-bukti-l1.json';
import requirementData from '@/data/requirement.json';
import drafPrioritas from '@/data/draf-bukti-prioritas.json';
import { LEVEL_LABEL, REVISI_JENIS, statusMeta } from '@/lib/pemdiNilai';
import { fmt2 } from '@/lib/ruangKendali';

const PRIO_KELAS = { WAJIB: 'bad', 'SANGAT DIBUTUHKAN': 'warn', PENTING: 'info', PENDUKUNG: 'ok' };

function KartuRevisi({ r }) {
  const rk = useRK();
  const j = REVISI_JENIS[r.jenis] || {};
  return (
    <details className="rk-kartu">
      <summary>
        <span className="mono kode">{r.kode}</span>
        <span className="rk-tag t-revisi"><StatusIkon k={r.jenis} /> {j.label}</span>
        <span className="lvl">L{r.level}</span>
        <span className="ttl">{r.butir}</span>
        <span className="sub">{r.indikator} · {r.aspek} · PIC {r.pic?.split(' (')[0]}</span>
      </summary>
      <div className="isi">
        <p><b>Catatan asesor</b> {r.catatan_asesor}</p>
        <p><b>Tindak lanjut</b> {j.tindak}</p>
        {r.contoh_modul?.length ? <><b>Contoh bukti menurut Modul Indikator (L{r.level})</b><ul>{r.contoh_modul.map((c, i) => <li key={i}>{c}</li>)}</ul></> : null}
        <div className="aksi">
          {r.template?.map((t, i) => <a key={i} className="rk-btn" href={t.file} target="_blank" rel="noopener noreferrer"><Ikon nama="dokumen" size={14} /> {t.judul}</a>)}
          <button type="button" className="rk-btn" onClick={() => rk?.bukaButir(r.id, r.indikator)}><Ikon nama="kanan" size={14} /> Butir di panel</button>
          <Link className="rk-btn" href={`/modul-indikator?modul=${r.indikator.replace('I', '')}`}>Modul {r.indikator}</Link>
        </div>
      </div>
    </details>
  );
}

function KartuGap({ g, urut }) {
  const rk = useRK();
  return (
    <details className="rk-kartu">
      <summary>
        <span className="mono kode">#{urut} · {g.indikator}</span>
        <span className="rk-tag t-proses">L{g.nilai_sekarang} → L{g.level_target}</span>
        <span className="lvl">+{fmt2(g.kenaikan_indeks)}</span>
        <span className="ttl">{g.indikator_nama}</span>
        <span className="sub">{g.butir_kurang}/{g.butir_total} butir kurang{g.butir_revisi_di_p0 > 0 ? ` (+${g.butir_revisi_di_p0} revisi di P0)` : ''} · bobot {g.bobot}% · PIC {g.pic?.split(' (')[0]}</span>
      </summary>
      <div className="isi">
        <ul className="rk-butir">
          {g.butir.map((b) => {
            const sm = statusMeta(b.status);
            return (
              <li key={b.id}>
                <div className="row">
                  <StatusIkon k={b.status} />
                  <span className="mono kode">{b.kode_rencana}</span>
                  <span className="nama">{b.nama}</span>
                  <span className="rk-tag" style={{ color: sm.color }}>{sm.label}</span>
                  <button type="button" className="rk-btn kecil" onClick={() => rk?.bukaButir(b.id, g.indikator)} aria-label={`Buka butir ${b.kode_rencana}`}><Ikon nama="kanan" size={14} /></button>
                </div>
                {b.catatan ? <div className="cat faint">{b.catatan}</div> : null}
              </li>
            );
          })}
        </ul>
        {g.contoh_modul?.length ? <><b>Contoh bukti menurut Modul Indikator (L{g.level_target})</b><ul>{g.contoh_modul.map((c, i) => <li key={i}>{c}</li>)}</ul></> : null}
        <div className="aksi">
          {g.template?.map((t, i) => <a key={i} className="rk-btn" href={t.file} target="_blank" rel="noopener noreferrer"><Ikon nama="dokumen" size={14} /> {t.judul}</a>)}
          <Link className="rk-btn" href={`/modul-indikator?modul=${g.indikator.replace('I', '')}`}>Modul {g.indikator}</Link>
        </div>
      </div>
    </details>
  );
}

function KartuPanduan({ ind }) {
  const siap = ind.dokumen.filter((d) => d.status === 'lengkap').length;
  return (
    <details className="rk-kartu">
      <summary>
        <span className="mono kode">{ind.indikator}</span>
        <span className={`rk-tag ${siap ? 't-diterima' : 't-belum'}`}>{siap ? `${siap} siap unggah` : `${ind.dokumen.length || 0} draf`}</span>
        <span className="lvl">L1</span>
        <span className="ttl">{ind.nama}</span>
        <span className="sub">{ind.aspek}</span>
      </summary>
      <div className="isi">
        {ind.dokumen.length === 0 ? <p className="faint">Belum ada panduan.</p> : ind.dokumen.map((d, i) => (
          <div key={i} className="dok">
            <div><span className={`rk-tag ${d.status === 'lengkap' ? 't-diterima' : d.status === 'proses' ? 't-proses' : 't-belum'}`}>{d.status === 'lengkap' ? 'Siap unggah' : d.status === 'proses' ? 'Draf' : 'Lampiran'}</span> <span className="faint">{d.jenis}</span></div>
            <b>{d.judul}</b>
            {d.dokumen_kunci?.length ? <div className="faint">Dok. kunci: {d.dokumen_kunci.map((n) => `#${n}`).join(', ')}</div> : null}
            {d.catatan ? <div className="cat">{d.catatan}</div> : null}
            <a className="rk-btn" href={d.file} target="_blank" rel="noopener noreferrer"><Ikon nama="luar" size={14} /> Buka dokumen</a>
          </div>
        ))}
      </div>
    </details>
  );
}

export default function Requirement() {
  const [tab, setTab] = useUrlState('tab', 'pemdi');
  const [jenis, setJenis] = useUrlState('jenis', '');
  const [kat, setKat] = useState(null);
  const t1 = drafPrioritas.penilaian_tahap1;
  const rv = drafPrioritas.ringkas;
  const revisi = useMemo(() => drafPrioritas.revisi.filter((r) => !jenis || r.jenis === jenis), [jenis]);
  const dokPanduan = panduanBukti.indikator.reduce((s, i) => s + i.dokumen.length, 0);
  const siapPanduan = panduanBukti.indikator.filter((i) => i.dokumen.some((d) => d.status === 'lengkap')).length;
  const ppbTotal = requirementData.summary.reduce((s, c) => s + c.count, 0);
  return (
    <>
      <Head>
        <title>Draf Bukti Dukung Prioritas — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Papan tugas bukti dukung Pemdi 2026: revisi asesor (P0), gap level berikut (P1), panduan siap unggah; kebutuhan data Peta Proses Bisnis." />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan prioritas">
          <div className="lead">
            <div className="lbl">Tahap 1 · {t1.portal.replace('https://', '')}</div>
            <div className="val">{t1.diterima}<small>diterima dari {t1.dinilai} dinilai</small></div>
            <div className="sub">{t1.status} · sinkron {t1.tanggal_sinkron}</div>
          </div>
          <div><div className="lbl">P0 · Revisi asesor</div><div className="val" style={{ color: 'var(--rk-status-ink-bad)' }}>{rv.revisi}<small>butir</small></div><div className="sub">{Object.entries(rv.revisi_per_jenis || {}).map(([k, v]) => `${v} ${REVISI_JENIS[k]?.label?.toLowerCase() || k}`).join(' · ')}</div></div>
          <div><div className="lbl">P1 · Gap level berikut</div><div className="val">{rv.butir_gap}<small>butir · {rv.indikator_gap} indikator</small></div><div className="sub">diurutkan daya ungkit (bobot × kenaikan level)</div></div>
          <div><div className="lbl">Panduan L1</div><div className="val">{dokPanduan}<small>dokumen</small></div><div className="sub">{siapPanduan} indikator punya dokumen siap unggah</div></div>
          <div><div className="lbl">Indeks simulasi → bila P0+P1 diterima</div><div className="val">{fmt2(rv.indeks_simulasi)}<small>→ {fmt2(rv.indeks_jika_p0_p1_diterima)}</small></div><div className="sub">target 2,50 · skala simulasi 0–5</div></div>
        </section>
        <div className="rk-tujuan"><CatatanTujuan compact /></div>

        <LipatSemua keterangan="Papan tugas — klik kartu untuk catatan asesor, contoh modul, templat, dan butir.">
          <span className="rk-seg kecil" role="group" aria-label="Tab">
            <button type="button" aria-pressed={tab === 'pemdi'} onClick={() => setTab('pemdi')}>Bukti prioritas</button>
            <button type="button" aria-pressed={tab === 'ppb'} onClick={() => setTab('ppb')}>Kebutuhan data PPB ({ppbTotal})</button>
          </span>
        </LipatSemua>

        {tab === 'pemdi' ? (
          <div className="rk-papan">
            <PanelLipat id="req-p0" className="rk-kolom" judul={<><span className="rk-no" style={{ color: 'var(--rk-status-ink-bad)' }}>P0</span>Revisi asesor</>} ringkas={`· ${revisi.length} butir`} aksi={<span className="rk-act faint">{revisi.length}</span>}>
              <p className="rk-desk">Catatan asesor disalin apa adanya dari eval.spbe.go.id; berkas lama tidak disimpan di repo — unggah ulang memakai kode yang sama.</p>
              <div className="rk-filter">
                {Object.entries(REVISI_JENIS).map(([k, v]) => <button key={k} type="button" className="rk-chip" aria-pressed={jenis === k} onClick={() => setJenis(jenis === k ? '' : k)}><StatusIkon k={k} /> {v.label} ({rv.revisi_per_jenis?.[k] ?? 0})</button>)}
              </div>
              {revisi.map((r) => <KartuRevisi key={r.kode} r={r} />)}
            </PanelLipat>
            <PanelLipat id="req-p1" className="rk-kolom" judul={<><span className="rk-no" style={{ color: 'var(--rk-status-ink-warn)' }}>P1</span>Gap ke level berikut</>} ringkas={`· ${drafPrioritas.gap.length} indikator`} aksi={<span className="rk-act faint">{drafPrioritas.gap.length}</span>}>
              <p className="rk-desk">Indikator yang paling menaikkan indeks bila butir kurangnya dipenuhi — urutan = daya ungkit.</p>
              {drafPrioritas.gap.map((g, i) => <KartuGap key={g.indikator} g={g} urut={i + 1} />)}
            </PanelLipat>
            <PanelLipat id="req-panduan" className="rk-kolom" judul={<><span className="rk-no" style={{ color: 'var(--rk-status-ink-ok)' }}>L1</span>Panduan penyusunan</>} ringkas={`· ${dokPanduan} dokumen`} aksi={<span className="rk-act faint">{panduanBukti.indikator.length} ind.</span>}>
              <p className="rk-desk">Draf acuan per indikator sesuai kriteria modul PermenPANRB 8/2026 — <b>bukan bukti final</b>: isian contoh, tanda tangan/cap placeholder; finalisasi sebelum unggah.</p>
              {panduanBukti.indikator.map((ind) => <KartuPanduan key={ind.indikator} ind={ind} />)}
            </PanelLipat>
          </div>
        ) : (
          <>
            <section className="rk-panel">
              <h2>Kebutuhan Data Peta Proses Bisnis · PermenPANRB 19/2018 <span className="rk-act faint">{requirementData.summary.length} kategori · {ppbTotal} item · relevan indikator I15</span></h2>
              <div className="rk-ppb-kat">
                {requirementData.summary.map((c) => (
                  <button key={c.category} type="button" className={`kat ${PRIO_KELAS[c.priority] || 'ok'}`} aria-pressed={kat === c.category} onClick={() => setKat(kat === c.category ? null : c.category)}>
                    <span className="pr">{c.priority}</span>
                    <b>{c.category}</b>
                    <span className="faint">{c.count} item · {c.kebutuhan}</span>
                  </button>
                ))}
              </div>
            </section>
            {requirementData.categories.filter((c) => !kat || kat.startsWith(`${c.id}.`) || kat === c.name).map((c) => (
              <PanelLipat key={c.id} id={`ppb-${c.id}`} judul={`${c.id}. ${c.name}`} ringkas={`· ${c.items.length} item`} awal={kat ? 'buka' : 'tutup'}>
                <p className="rk-desk">{c.description}</p>
                <div className="rk-wrap">
                  <table className="rk-table">
                    <thead><tr><th>#</th><th>Data / dokumen</th><th>Fungsi</th><th>Format</th><th>Dok. kunci</th><th>Dari</th></tr></thead>
                    <tbody>{c.items.map((it) => <tr key={it.no}><td className="mono">{it.no}</td><td>{it.data}</td><td>{it.fungsi}</td><td className="mono">{it.format}</td><td className="mono">{it.dokumenKunci}</td><td>{it.sumber}</td></tr>)}</tbody>
                  </table>
                </div>
              </PanelLipat>
            ))}
            <section className="rk-panel">
              <h2>Keluaran yang diharapkan</h2>
              <ol className="rk-ol">{requirementData.outputs.map((o) => <li key={o.no}><b>{o.title}</b> — {o.description}</li>)}</ol>
            </section>
          </>
        )}

        <section className="rk-panel rk-rujuk">
          <h2>Sumber</h2>
          <ul>
            <li>Daftar prioritas dibangun otomatis dari <code>data/pemdi.json</code> ({drafPrioritas.dibangun}) — <code>scripts/build-draf-prioritas.py</code> setelah sinkron hasil eval.spbe.go.id.</li>
            <li>Markdown lengkap: <code>docs/requirement-peta-proses-bisnis.md</code> · <Link href="/probis">Peta proses bisnis →</Link></li>
          </ul>
        </section>
      </div>
    </>
  );
}
