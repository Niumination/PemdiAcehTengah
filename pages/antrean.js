/**
 * /antrean — Antrean butir bercatatan mandiri sampai tenggat (Patch 1).
 * Filter: teks, prioritas, jenis, PJ (persona PJ otomatis memfilter OPD).
 */
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { AntreanTabel, useAntreanAktif } from '@/components/rk/Panel';
import { susunDataRK } from '@/lib/rkData';

const PRI = ['tinggi', 'sedang', 'rendah'];

export default function Antrean({ rk }) {
  const dasar = useAntreanAktif();
  const [q, setQ] = useState('');
  const [pri, setPri] = useState('');
  const [jenis, setJenis] = useState('');
  const rows = useMemo(() => {
    const k = q.trim().toLowerCase();
    return dasar.filter((b) => (!pri || b.prioritas === pri) && (!jenis || b.jenis === jenis)
      && (!k || `${b.kode} ${b.nama} ${b.pj} ${b.indikatorId} ${b.ringkas}`.toLowerCase().includes(k)));
  }, [dasar, q, pri, jenis]);
  return (
    <>
      <Head><title>Antrean butir — Dashboard Pemerintah Digital Aceh Tengah</title></Head>
      <div className="rk-grid">
        <section className="rk-panel">
          <h2>Antrean sampai {new Date(`${rk.situasi.tenggat}T00:00:00+07:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} · {rows.length} dari {dasar.length} butir
            <span className="rk-act" style={{ color: 'var(--rk-ink-3)' }}>urut prioritas → bobot indikator</span></h2>
          <div className="rk-filter" role="group" aria-label="Filter antrean">
            <input type="search" placeholder="Cari kode, butir, PJ…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari" />
            {PRI.map((p) => <button key={p} type="button" className="rk-chip" aria-pressed={pri === p} onClick={() => setPri(pri === p ? '' : p)}>{p}</button>)}
            <span className="faint">|</span>
            <button type="button" className="rk-chip" aria-pressed={jenis === 'revisi'} onClick={() => setJenis(jenis === 'revisi' ? '' : 'revisi')}>revisi asesor</button>
            <button type="button" className="rk-chip" aria-pressed={jenis === 'gap'} onClick={() => setJenis(jenis === 'gap' ? '' : 'gap')}>gap level berikut</button>
          </div>
          <AntreanTabel rows={rows} />
        </section>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: { rk: susunDataRK() } };
}
