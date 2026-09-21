/**
 * catatanMandiri.js — util Catatan Mandiri per butir bukti (21 Sep 2026).
 *
 * Sumber data: field `catatan_mandiri` pada butir bukti_dukung di data/pemdi.json
 * (digabung dari data/catatan-mandiri.json oleh scripts/gabung-catatan-mandiri.py).
 *
 * Ekspor:
 *   teksCatatanButir(b, ind)          → teks polos utk kolom catatan eval.spbe.go.id (tombol Salin)
 *   teksCatatanIndikator(ind)         → teks polos gabungan seluruh butir bercatatan pada indikator
 *   butirBercatatan(ind)              → daftar butir yang punya catatan_mandiri (urut level, id)
 *   htmlCatatanIndikator(ind, meta)   → dokumen HTML mandiri (cetak → PDF lewat dialog browser)
 *   docxCatatanIndikator(ind, meta)   → Blob .docx (OOXML minimal, ZIP metode store — tanpa pustaka)
 *   PRIORITAS_META                    → label/warna prioritas
 *
 * Tidak ada dependensi eksternal; berjalan di browser (Blob/TextEncoder) — jangan panggil
 * docx/html dari getStaticProps.
 */

export const PRIORITAS_META = {
  tinggi: { label: 'Prioritas tinggi', color: 'var(--bad)', bg: 'var(--bad-bg)' },
  sedang: { label: 'Prioritas sedang', color: 'var(--warn)', bg: 'var(--warn-bg)' },
  rendah: { label: 'Prioritas rendah', color: 'var(--muted)', bg: 'var(--surface-2)' },
};

export const JENIS_META = {
  revisi: { label: 'Tanggapan revisi asesor', icon: '🔁' },
  gap: { label: 'Butir level berikut (belum diunggah)', icon: '🎯' },
};

const ORIGIN = 'https://pemdi.acehtengahkab.go.id';

function urlRujukan(r) {
  if (r.url) return r.url.startsWith('/') ? ORIGIN + r.url : r.url;
  if (r.path) return ORIGIN + r.path;
  return '';
}

export function butirBercatatan(ind) {
  return (ind?.bukti_dukung || [])
    .filter((b) => b.catatan_mandiri)
    .sort((a, b) => a.level - b.level || a.id.localeCompare(b.id));
}

function barisRujukan(r) {
  const hal = r.halaman && r.halaman !== '—' ? ` — hal. ${r.halaman}` : '';
  const u = urlRujukan(r);
  return `${r.judul}${r.bagian ? ` — ${r.bagian}` : ''}${hal}${u ? ` (${u})` : ''}`;
}

export function teksCatatanButir(b, ind) {
  const c = b.catatan_mandiri;
  if (!c) return '';
  const kode = b.eval?.kode ? `${b.eval.kode} · ` : '';
  const baris = [];
  baris.push(`CATATAN MANDIRI — ${kode}${ind?.id || ''} Level ${b.level}`);
  baris.push(`Butir: ${b.nama}`);
  if (b.status === 'revisi' && b.catatan) baris.push(`Catatan asesor tahap 1: ${b.catatan}`);
  baris.push('');
  baris.push(c.ringkas);
  if (c.rujukan?.length) {
    baris.push('');
    baris.push('Rujukan dokumen:');
    c.rujukan.forEach((r, i) => baris.push(`${i + 1}. ${barisRujukan(r)}`));
  }
  baris.push('');
  baris.push(`Penanggung jawab: ${c.pj || '-'}`);
  baris.push(`Pemerintah Kabupaten Aceh Tengah — ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`);
  return baris.join('\n');
}

export function teksCatatanIndikator(ind) {
  const items = butirBercatatan(ind);
  const kepala = `CATATAN MANDIRI ${ind.id} — ${ind.nama}\n${'='.repeat(60)}\n`;
  return kepala + items.map((b) => teksCatatanButir(b, ind)).join('\n\n' + '-'.repeat(60) + '\n\n');
}

/* ───────────── HTML (cetak → PDF) ───────────── */

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function htmlCatatanIndikator(ind, meta = {}) {
  const items = butirBercatatan(ind);
  const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const bagian = items.map((b) => {
    const c = b.catatan_mandiri;
    const ruj = (c.rujukan || []).map((r) => `<li>${esc(barisRujukan(r))}</li>`).join('');
    const keb = (c.kebutuhan || []).map((k) => `<li>☐ ${esc(k)}</li>`).join('');
    return `
<section class="butir">
  <h2>${b.eval?.kode ? `<code>${esc(b.eval.kode)}</code> ` : ''}Level ${b.level} — ${esc(b.nama)}</h2>
  <p class="meta">${esc(JENIS_META[c.jenis]?.label || c.jenis)} · ${esc(PRIORITAS_META[c.prioritas]?.label || c.prioritas)} · PJ: ${esc(c.pj)}</p>
  ${b.status === 'revisi' && b.catatan ? `<p class="asesor"><strong>Catatan asesor tahap 1:</strong> ${esc(b.catatan)}</p>` : ''}
  <h3>Catatan mandiri</h3>
  <p>${esc(c.ringkas)}</p>
  ${ruj ? `<h3>Rujukan dokumen</h3><ol>${ruj}</ol>` : ''}
  ${keb ? `<h3>Yang masih harus disiapkan sebelum unggah</h3><ul class="keb">${keb}</ul>` : ''}
</section>`;
  }).join('');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8">
<title>Catatan Mandiri ${esc(ind.id)} — ${esc(ind.nama)}</title>
<style>
 @page { size: A4; margin: 20mm 18mm; }
 body { font: 11pt/1.5 "Segoe UI", Arial, sans-serif; color: #111; max-width: 180mm; margin: 0 auto; padding: 16px; }
 header { border-bottom: 2px solid #0f5132; margin-bottom: 14px; padding-bottom: 8px; }
 header h1 { font-size: 15pt; margin: 0 0 2px; color: #0f5132; }
 header p { margin: 0; font-size: 9.5pt; color: #444; }
 .butir { page-break-inside: avoid; border: 1px solid #ccc; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; }
 h2 { font-size: 11.5pt; margin: 0 0 4px; }
 h3 { font-size: 10pt; margin: 10px 0 2px; color: #0f5132; text-transform: uppercase; letter-spacing: .03em; }
 code { background: #eef; border: 1px solid #99a; border-radius: 3px; padding: 0 4px; font-size: 9.5pt; }
 .meta { font-size: 9pt; color: #555; margin: 0 0 4px; }
 .asesor { background: #fff4e5; border-left: 3px solid #d97706; padding: 6px 8px; font-size: 10pt; }
 ol, ul { margin: 2px 0 0; padding-left: 20px; } li { margin-bottom: 2px; font-size: 10pt; }
 .keb { list-style: none; padding-left: 4px; }
 footer { font-size: 8.5pt; color: #666; border-top: 1px solid #ccc; margin-top: 16px; padding-top: 6px; }
 @media print { body { padding: 0; } .noprint { display: none; } }
</style></head><body>
<header>
 <h1>Catatan Mandiri ${esc(ind.id)} — ${esc(ind.nama)}</h1>
 <p>Pemerintah Kabupaten Aceh Tengah · Evaluasi Pemerintah Digital ${esc(meta.tahun || 2026)} (PermenPANRB 8/2026) · ${items.length} butir · disusun ${tgl}${meta.versi ? ` · versi data ${esc(meta.versi)}` : ''}</p>
 <p class="noprint" style="margin-top:6px"><button onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button></p>
</header>
${bagian || '<p>Tidak ada butir bercatatan pada indikator ini.</p>'}
<footer>Catatan mandiri disusun Tim Asesor Internal Pemdi Aceh Tengah untuk diunggah pada eval.spbe.go.id. Nomor halaman merujuk urutan halaman PDF berkas bukti; teks bahasa baku PermenPANRB 8/2026 tidak diparafrasakan.</footer>
</body></html>`;
}

/* ───────────── DOCX minimal (OOXML, ZIP store) ───────────── */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** ZIP tanpa kompresi (metode 0) — cukup untuk .docx kecil; tanpa pustaka. */
export function zipStore(files) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;
  const dosTime = 0;
  const dosDate = (1 << 5) | 1; // 1980-01-01, deterministik
  for (const { name, data } of files) {
    const nameB = enc.encode(name);
    const body = typeof data === 'string' ? enc.encode(data) : data;
    const crc = crc32(body);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 nama
    local.setUint16(8, 0, true);
    local.setUint16(10, dosTime, true);
    local.setUint16(12, dosDate, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, body.length, true);
    local.setUint32(22, body.length, true);
    local.setUint16(26, nameB.length, true);
    local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), nameB, body);
    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, 0x0800, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, dosTime, true);
    cd.setUint16(14, dosDate, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, body.length, true);
    cd.setUint32(24, body.length, true);
    cd.setUint16(28, nameB.length, true);
    cd.setUint16(30, 0, true);
    cd.setUint16(32, 0, true);
    cd.setUint16(34, 0, true);
    cd.setUint16(36, 0, true);
    cd.setUint32(38, 0, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), nameB);
    offset += 30 + nameB.length + body.length;
  }
  const cdSize = central.reduce((s, p) => s + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(4, 0, true);
  end.setUint16(6, 0, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);
  end.setUint16(20, 0, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const total = all.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of all) { out.set(p, pos); pos += p.length; }
  return out;
}

function wp(text, opts = {}) {
  const rpr = [];
  if (opts.b) rpr.push('<w:b/>');
  if (opts.i) rpr.push('<w:i/>');
  if (opts.sz) rpr.push(`<w:sz w:val="${opts.sz}"/>`);
  if (opts.color) rpr.push(`<w:color w:val="${opts.color}"/>`);
  const ppr = [];
  if (opts.style) ppr.push(`<w:pStyle w:val="${opts.style}"/>`);
  if (opts.num) ppr.push(`<w:numPr><w:ilvl w:val="0"/><w:numId w:val="${opts.num}"/></w:numPr>`);
  if (opts.shade) ppr.push(`<w:shd w:val="clear" w:color="auto" w:fill="${opts.shade}"/>`);
  if (opts.after != null) ppr.push(`<w:spacing w:after="${opts.after}"/>`);
  return `<w:p>${ppr.length ? `<w:pPr>${ppr.join('')}</w:pPr>` : ''}<w:r>${rpr.length ? `<w:rPr>${rpr.join('')}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

export function docxCatatanIndikator(ind, meta = {}) {
  const items = butirBercatatan(ind);
  const tgl = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const body = [];
  body.push(wp(`Catatan Mandiri ${ind.id} — ${ind.nama}`, { style: 'Title' }));
  body.push(wp(`Pemerintah Kabupaten Aceh Tengah · Evaluasi Pemerintah Digital ${meta.tahun || 2026} (PermenPANRB 8/2026) · ${items.length} butir · disusun ${tgl}${meta.versi ? ` · versi data ${meta.versi}` : ''}`, { i: true, sz: 18, color: '555555' }));
  for (const b of items) {
    const c = b.catatan_mandiri;
    body.push(wp(`${b.eval?.kode ? `[${b.eval.kode}] ` : ''}Level ${b.level} — ${b.nama}`, { style: 'Heading1' }));
    body.push(wp(`${JENIS_META[c.jenis]?.label || c.jenis} · ${PRIORITAS_META[c.prioritas]?.label || c.prioritas} · PJ: ${c.pj}`, { i: true, sz: 18, color: '555555' }));
    if (b.status === 'revisi' && b.catatan) body.push(wp(`Catatan asesor tahap 1: ${b.catatan}`, { shade: 'FFF4E5', sz: 20 }));
    body.push(wp('Catatan mandiri', { style: 'Heading2' }));
    body.push(wp(c.ringkas, { after: 120 }));
    if (c.rujukan?.length) {
      body.push(wp('Rujukan dokumen', { style: 'Heading2' }));
      c.rujukan.forEach((r) => body.push(wp(barisRujukan(r), { num: 1, sz: 20 })));
    }
    if (c.kebutuhan?.length) {
      body.push(wp('Yang masih harus disiapkan sebelum unggah', { style: 'Heading2' }));
      c.kebutuhan.forEach((k) => body.push(wp(k, { num: 2, sz: 20 })));
    }
  }
  body.push(wp('Catatan mandiri disusun Tim Asesor Internal Pemdi Aceh Tengah untuk diunggah pada eval.spbe.go.id. Nomor halaman merujuk urutan halaman PDF berkas bukti.', { i: true, sz: 16, color: '666666' }));

  const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ${W}><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1021" w:bottom="1134" w:left="1021" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles ${W}>
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="22"/><w:lang w:val="id-ID"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="4" w:color="0F5132"/></w:pBdr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/><w:color w:val="0F5132"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="280" w:after="40"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="20"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:caps/><w:sz w:val="18"/><w:color w:val="0F5132"/></w:rPr></w:style>
</w:styles>`;
  const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering ${W}>
<w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="500" w:hanging="300"/></w:pPr></w:lvl></w:abstractNum>
<w:abstractNum w:abstractNumId="1"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="☐"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="500" w:hanging="300"/></w:pPr></w:lvl></w:abstractNum>
<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num><w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num></w:numbering>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`;
  const zip = zipStore([
    { name: '[Content_Types].xml', data: contentTypes },
    { name: '_rels/.rels', data: rels },
    { name: 'word/document.xml', data: document },
    { name: 'word/_rels/document.xml.rels', data: docRels },
    { name: 'word/styles.xml', data: styles },
    { name: 'word/numbering.xml', data: numbering },
  ]);
  return new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

export function namaBerkasCatatan(ind, ext) {
  const tgl = new Date().toISOString().slice(0, 10);
  return `Catatan-Mandiri-${ind.id}-AcehTengah-${tgl}.${ext}`;
}
