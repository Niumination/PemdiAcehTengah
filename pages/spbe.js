/**
 * /spbe — Indeks SPBE 2025 sebagai INFOGRAFIS PERBANDINGAN (Patch 11, Tahap 3b).
 * Tiga skala berdampingan pada satu sumbu 0–5: SPBE 2025 (2,59 Cukup) · Pemdi mandiri (simulasi 0,35) ·
 * Pemdi asesor sementara (1,24 Rintisan) · target 2026 (2,50); empat domain SPBE sebagai batang horizontal
 * dengan ambang Kurang/Cukup/Baik; peta domain SPBE → aspek Pemdi; rekomendasi & kekuatan asli.
 * Data tetap: opd.json → spbe; indeks Pemdi dari susunDataRK() (JSON + overlay CMS).
 */
import Head from 'next/head';
import Link from 'next/link';
import PanelLipat, { LipatSemua } from '@/components/rk/PanelLipat';
import Dial from '@/components/rk/Dial';
import Ikon from '@/components/ui/Ikon';
import { KerawangDivider } from '@/components/motif/KerawangMotifs';
import portalData from '@/data/opd.json';
import { susunDataRK } from '@/lib/rkData';
import { fmt2, warnaAspek } from '@/lib/ruangKendali';
import asesorJson from '@/data/evaluasi-asesor-2026.json';

const AMBANG = [{ v: 2, l: 'Kurang' }, { v: 3, l: 'Cukup' }, { v: 3.5, l: 'Baik' }, { v: 4.2, l: 'Sangat baik' }];
function level(v) { return v >= 3 ? { k: 'ok', l: 'Baik' } : v >= 2 ? { k: 'warn', l: 'Cukup' } : { k: 'bad', l: 'Kurang' }; }

const DOMAIN = [
  { k: 'kebijakan_spbe', nama: 'Kebijakan SPBE', desc: 'Kebijakan internal yang mengatur penyelenggaraan SPBE di lingkungan Pemkab Aceh Tengah.', aspek: [1] },
  { k: 'tata_kelola_spbe', nama: 'Tata Kelola SPBE', desc: 'Struktur organisasi, tim koordinasi, perencanaan, penganggaran, dan inovasi.', aspek: [1, 2] },
  { k: 'manajemen_spbe', nama: 'Manajemen SPBE', desc: 'Pembangunan aplikasi, pusat data, jaringan intra, keamanan, audit TIK.', aspek: [3, 4, 5] },
  { k: 'layanan_spbe', nama: 'Layanan SPBE', desc: 'Layanan administrasi pemerintahan dan layanan publik elektronik.', aspek: [6, 7] },
];

/** Skala bersama 0–5 dengan beberapa penanda. */
function Skala({ tanda }) {
  return (
    <div className="rk-skala" role="img" aria-label={tanda.map((t) => `${t.l} ${fmt2(t.v)}`).join(', ')}>
      <div className="sumbu">
        {AMBANG.map((a) => <span key={a.l} className="amb" style={{ left: `${(a.v / 5) * 100}%` }}><i />{a.l} ≥ {fmt2(a.v)}</span>)}
        {[0, 1, 2, 3, 4, 5].map((n) => <span key={n} className="tik" style={{ left: `${(n / 5) * 100}%` }}>{n}</span>)}
      </div>
      {tanda.map((t) => (
        <div key={t.l} className={`baris ${t.k || ''}`}>
          <span className="lbl">{t.l}<small>{t.ket}</small></span>
          <span className="jalur"><i style={{ width: `${(t.v / 5) * 100}%`, background: t.warna }} /><b style={{ left: `${(t.v / 5) * 100}%` }}>{fmt2(t.v)}</b></span>
        </div>
      ))}
    </div>
  );
}

export default function SpbePage({ spbe, pemdi }) {
  const d = spbe.domain;
  const lv = level(spbe.indeks);
  const tanda = [
    { l: `SPBE ${spbe.tahun}`, ket: `${spbe.kategori} · Kemenpan RB`, v: spbe.indeks, warna: 'var(--rk-info)' },
    { l: 'Pemdi asesor KemenPANRB', ket: 'interviu 21 Sep 2026 · skala 1–5', v: asesorJson.indeks.asesor, warna: 'var(--rk-emas)' },
    { l: 'Pemdi mandiri awal', ket: 'saat unggah eviden pertama', v: asesorJson.indeks.mandiri_awal, warna: 'color-mix(in srgb, var(--rk-emas) 55%, transparent)' },
    { l: 'Simulasi mandiri', ket: 'hanya bukti diterima · skala 0–5', v: pemdi.indeks, warna: 'var(--rk-ink-3)' },
    { l: 'Target Pemdi 2026', ket: spbe.pemdi_framework?.target_predikat || 'Baik', v: spbe.pemdi_framework?.target_indeks || 2.5, warna: 'var(--rk-ok)', k: 'target' },
  ];
  return (
    <>
      <Head>
        <title>SPBE 2025 vs Pemdi 2026 — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content={`Indeks SPBE Kabupaten Aceh Tengah ${spbe.indeks} (${spbe.kategori}) dibandingkan indeks Pemdi 2026 — empat domain, peta ke tujuh aspek Pemdi, rekomendasi prioritas.`} />
      </Head>
      <div className="rk-grid">
        <section className="rk-sit" aria-label="Ringkasan SPBE">
          <div className="lead"><div className="lbl">Indeks SPBE {spbe.tahun} · Kemenpan RB</div><div className="val">{fmt2(spbe.indeks)}<small>{spbe.kategori}</small></div><div className="sub">baseline sebelum transisi ke Pemerintah Digital (PermenPANRB 8/2026)</div></div>
          <div><div className="lbl">Domain tertinggi</div><div className="val" style={{ color: 'var(--rk-status-ink-ok)' }}>{fmt2(d.layanan_spbe)}<small>Layanan</small></div><div className="sub">{spbe.kekuatan?.[2] || ''}</div></div>
          <div><div className="lbl">Domain terendah</div><div className="val" style={{ color: 'var(--rk-status-ink-bad)' }}>{fmt2(d.manajemen_spbe)}<small>Manajemen</small></div><div className="sub">6 indikator SPBE bernilai 1,00</div></div>
          <div><div className="lbl">Pemdi asesor KemenPANRB</div><div className="val" style={{ color: 'var(--rk-emas-ink)' }}>{fmt2(asesorJson.indeks.asesor)}<small>{asesorJson.indeks.level}</small></div><div className="sub">mandiri awal {fmt2(asesorJson.indeks.mandiri_awal)} · target 2026 {fmt2(spbe.pemdi_framework?.target_indeks || 2.5)}</div></div>
          <div><div className="lbl">Selisih ke target</div><div className="val">{fmt2((spbe.pemdi_framework?.target_indeks || 2.5) - asesorJson.indeks.asesor)}</div><div className="sub">poin indeks Pemdi yang harus dikejar</div></div>
        </section>

        <LipatSemua keterangan="Infografis: satu sumbu 0–5 untuk SPBE, Pemdi, dan target — skala SPBE dan Pemdi tidak identik, gunakan sebagai orientasi arah, bukan konversi." />

        <PanelLipat id="spbe-skala" className="rk-c8" judul="Posisi Aceh Tengah pada satu sumbu" ringkas="· SPBE 2,59 · Pemdi 1,24 · target 2,50">
          <Skala tanda={tanda} />
        </PanelLipat>

        <PanelLipat id="spbe-dial" className="rk-c4" judul="SPBE vs target Pemdi" ringkas={`· ${fmt2(spbe.indeks)} / ${fmt2(spbe.pemdi_framework?.target_indeks || 2.5)}`}>
          <div className="rk-aspek-atas">
            <Dial nilai={spbe.indeks} target={spbe.pemdi_framework?.target_indeks || 2.5} warna="var(--rk-info)" label="target Pemdi" judul={`SPBE ${fmt2(spbe.indeks)} dibanding target Pemdi`} />
            <div>
              <p className="rk-desk">Predikat SPBE <b className={`rk-tag t-${lv.k === 'ok' ? 'diterima' : lv.k === 'warn' ? 'proses' : 'revisi'}`}>{lv.l}</b></p>
              <p className="rk-desk">{spbe.pemdi_framework?.catatan}</p>
            </div>
          </div>
        </PanelLipat>

        <PanelLipat id="spbe-domain" ponsel="tutup" judul="Empat domain SPBE → tujuh aspek Pemdi" ringkas="· 4 domain" aksi={<Link className="rk-act" href="/pemdi">Rinci per aspek →</Link>}>
          <div className="rk-domain">
            {DOMAIN.map((x) => {
              const v = d[x.k]; const l = level(v);
              return (
                <div key={x.k} className="dom">
                  <div className="hd"><b>{x.nama}</b><span className={`rk-tag t-${l.k === 'ok' ? 'diterima' : l.k === 'warn' ? 'proses' : 'revisi'}`}>{l.l}</span><span className="mono nilai">{fmt2(v)}</span></div>
                  <div className="jalur"><i className={l.k} style={{ width: `${(v / 5) * 100}%` }} /><span className="amb" style={{ left: '40%' }} /><span className="amb" style={{ left: '60%' }} /></div>
                  <p className="rk-desk">{x.desc}</p>
                  <div className="ke"><Ikon nama="panah" size={14} /> {x.aspek.map((id) => { const a = pemdi.aspek.find((y) => y.id === id); return a ? <Link key={id} href={`/pemdi#aspek-${id}`} className="rk-chip" style={{ '--warna': warnaAspek(id) }}><i className="sw" style={{ background: warnaAspek(id) }} />{a.singkat || a.nama} · {fmt2(a.indeks)}</Link> : null; })}</div>
                </div>
              );
            })}
          </div>
        </PanelLipat>

        <div style={{ gridColumn: 'span 12' }}><KerawangDivider label="Catatan penilaian SPBE" /></div>
        <PanelLipat id="spbe-rek" ponsel="tutup" className="rk-c6" judul="Rekomendasi prioritas" ringkas={`· ${(spbe.rekomendasi_prioritas || []).length} butir`}>
          <ol className="rk-ol">{(spbe.rekomendasi_prioritas || []).map((r, i) => <li key={i}>{r}</li>)}</ol>
        </PanelLipat>
        <PanelLipat id="spbe-kuat" ponsel="tutup" className="rk-c6" judul="Kekuatan" ringkas={`· ${(spbe.kekuatan || []).length} butir`}>
          <ul className="rk-ol">{(spbe.kekuatan || []).map((r, i) => <li key={i}>{r}</li>)}</ul>
        </PanelLipat>
        <section className="rk-panel rk-rujuk">
          <h2>Sumber</h2>
          <ul>
            <li>Hasil evaluasi SPBE {spbe.tahun} Kemenpan RB (data Diskominfo). Angka Pemdi asesor 1,24 dari sesi interviu 21 Sep 2026 — rincian per indikator di <Link href="/asesor">Hasil asesor</Link>.</li>
            <li>Bobot 7 aspek Pemdi: {spbe.pemdi_framework?.aspek?.map((a) => `${a.nama} ${a.bobot}`).join(' · ')}.</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const rk = await susunDataRK();
  return { props: { spbe: JSON.parse(JSON.stringify(portalData.spbe)), pemdi: { indeks: rk.situasi.indeks, aspek: rk.situasi.aspek } }, revalidate: 60 };
}
