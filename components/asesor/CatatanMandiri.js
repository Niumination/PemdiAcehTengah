/**
 * CatatanMandiri — tampilan catatan mandiri per butir + ekspor per indikator (21 Sep 2026).
 *
 *   <CatatanButir b={butir} ind={ind} />         kartu lipat di bawah baris butir (/pemdi, /modul-indikator)
 *   <EksporCatatan ind={ind} meta={...} />        bilah tombol per indikator: Salin semua · Unduh DOCX · Cetak/PDF
 *
 * Data: `b.catatan_mandiri` (lihat lib/catatanMandiri.js & data/catatan-mandiri.json).
 * Tanpa localStorage, tanpa pustaka luar; ekspor berjalan di klien.
 */
import { useState } from 'react';
import StatusIkon from '@/components/ui/StatusIkon';
import {
  PRIORITAS_META, JENIS_META, teksCatatanButir, teksCatatanIndikator,
  htmlCatatanIndikator, docxCatatanIndikator, butirBercatatan, namaBerkasCatatan,
} from '@/lib/catatanMandiri';

async function salin(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    return false;
  }
}

function unduhBlob(blob, nama) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function LinkRujukan({ r }) {
  const href = r.url || r.path || '';
  const ext = href && !href.startsWith('/');
  const hal = r.halaman && r.halaman !== '—' ? <> · hal. <strong>{r.halaman}</strong></> : null;
  return (
    <li>
      {href
        ? <a href={href} target="_blank" rel="noopener noreferrer" className="cm-link">{r.judul}</a>
        : <span>{r.judul}</span>}
      {r.bagian && <span className="muted"> — {r.bagian}</span>}
      {hal}
      {r.teks === false && <span className="cm-tag" title="PDF hasil pindai tanpa lapisan teks — tidak ada rujukan halaman">pindai</span>}
      {ext && <span className="cm-tag">JDIH/eksternal</span>}
    </li>
  );
}

export function CatatanButir({ b, ind, terbuka = false }) {
  const c = b?.catatan_mandiri;
  const [open, setOpen] = useState(terbuka);
  const [flash, setFlash] = useState(false);
  if (!c) return null;
  const pm = PRIORITAS_META[c.prioritas] || PRIORITAS_META.sedang;
  const jm = JENIS_META[c.jenis] || JENIS_META.gap;
  const id = `cm-${b.id.replace(/\W/g, '')}`;
  return (
    <div className="cm-butir" style={{ borderColor: pm.color }}>
      <div className="cm-head">
        <button type="button" className="cm-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span aria-hidden="true">{open ? '▾' : '▸'}</span> Catatan mandiri
          <span className="cm-pill" style={{ color: pm.color, background: pm.bg }}>{pm.label}</span>
          <span className="cm-pill muted"><StatusIkon k={c.jenis} /> {jm.label}</span>
        </button>
        <button
          type="button"
          className="cm-btn"
          onClick={async () => { if (await salin(teksCatatanButir(b, ind))) { setFlash(true); setTimeout(() => setFlash(false), 1500); } }}
          aria-label={`Salin catatan mandiri butir ${b.eval?.kode || b.id}`}
        >
          {flash ? 'Tersalin' : 'Salin'}
        </button>
      </div>
      {open && (
        <div id={id} className="cm-body">
          <p className="cm-ringkas">{c.ringkas}</p>
          {c.rujukan?.length > 0 && (
            <>
              <div className="cm-sub">Rujukan dokumen</div>
              <ol className="cm-list">{c.rujukan.map((r, i) => <LinkRujukan key={i} r={r} />)}</ol>
            </>
          )}
          {c.kebutuhan?.length > 0 && (
            <>
              <div className="cm-sub">Masih harus disiapkan sebelum unggah</div>
              <ul className="cm-list cm-keb">{c.kebutuhan.map((k, i) => <li key={i}>{k}</li>)}</ul>
            </>
          )}
          <div className="cm-foot">PJ: <strong>{c.pj}</strong>{c.versi && <span className="muted"> · versi catatan {c.versi}</span>}</div>
        </div>
      )}
    </div>
  );
}

export function EksporCatatan({ ind, meta = {}, compact = false }) {
  const [flash, setFlash] = useState(false);
  const items = butirBercatatan(ind);
  if (!items.length) return null;
  const nRevisi = items.filter((b) => b.catatan_mandiri.jenis === 'revisi').length;
  const cetak = () => {
    const w = window.open('', '_blank', 'noopener');
    if (!w) return;
    w.document.open();
    w.document.write(htmlCatatanIndikator(ind, meta));
    w.document.close();
  };
  return (
    <div className={`cm-ekspor${compact ? ' cm-ekspor-compact' : ''}`} role="group" aria-label={`Ekspor catatan mandiri ${ind.id}`}>
      <span className="cm-ekspor-label">
        Catatan mandiri: <strong>{items.length} butir</strong>{nRevisi > 0 && <> · {nRevisi} revisi</>}
        {!compact && <span className="muted"> — untuk diunggah di eval.spbe.go.id</span>}
      </span>
      <span className="cm-ekspor-act">
        <button type="button" className="cm-btn" onClick={async () => { if (await salin(teksCatatanIndikator(ind))) { setFlash(true); setTimeout(() => setFlash(false), 1500); } }}>
          {flash ? 'Tersalin' : 'Salin semua'}
        </button>
        <button type="button" className="cm-btn" onClick={() => unduhBlob(docxCatatanIndikator(ind, meta), namaBerkasCatatan(ind, 'docx'))}>DOCX</button>
        <button type="button" className="cm-btn" onClick={cetak}>Cetak / PDF</button>
      </span>
    </div>
  );
}

export default CatatanButir;
