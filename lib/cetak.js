/**
 * lib/cetak.js — Buka dokumen HTML untuk dicetak / disimpan sebagai PDF (Patch 8, Tahap 0).
 *
 * Latar: memanggil window.open dengan fitur `noopener` per spesifikasi SELALU mengembalikan
 * null, sehingga tombol "Cetak / PDF" lama tidak pernah menulis dokumen. Helper ini:
 *   1. membuka jendela tanpa fitur `noopener`, lalu memutus `opener` secara manual;
 *   2. bila pop-up diblokir → fallback iframe tersembunyi + `print()` di halaman ini.
 * Hanya boleh dipanggil di sisi klien (dari event handler).
 */
export function bukaCetak(html) {
  if (typeof window === 'undefined') return false;
  const w = window.open('', '_blank');
  if (w && w.document) {
    try { w.opener = null; } catch { /* abaikan */ }
    w.document.open();
    w.document.write(html);
    w.document.close();
    return true;
  }
  // Fallback: iframe tersembunyi, cetak dari halaman ini
  const fr = document.createElement('iframe');
  fr.setAttribute('aria-hidden', 'true');
  fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0';
  document.body.appendChild(fr);
  const doc = fr.contentDocument || fr.contentWindow?.document;
  if (!doc) { fr.remove(); return false; }
  doc.open();
  doc.write(html);
  doc.close();
  const jalan = () => {
    try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch { /* abaikan */ }
    setTimeout(() => fr.remove(), 60000);
  };
  if (doc.readyState === 'complete') setTimeout(jalan, 50); else fr.onload = jalan;
  return true;
}
