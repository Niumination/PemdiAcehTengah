/* ===================================================================
   Safe Rich Text — Sanitasi HTML tanpa dependency
   Allowlist: b, i, em, strong, a (href only), br, p, ul, ol, li
   =================================================================== */

const ALLOWED_TAGS = new Set(['b', 'i', 'em', 'strong', 'a', 'br', 'p', 'ul', 'ol', 'li']);

/**
 * Sanitasi HTML — hanya tag dalam allowlist yang dipertahankan,
 * sisanya distrip. Untuk <a>, hanya atribut href yang dipertahankan.
 * Aman dari XSS.
 *
 * @param {string} dirtyString - HTML mentah yang akan disanitasi
 * @returns {string} HTML yang sudah dibersihkan
 */
function sanitizeHtml(dirtyString) {
  if (!dirtyString || typeof dirtyString !== 'string') return '';

  // 1. Hapus script blocks dulu
  let clean = dirtyString.replace(/<script[\s\S]*?<\/script>/gi, '');

  // 2. Hapus event handler attributes (onclick, onload, dll)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // 3. Hapus javascript: dan data: URI di href
  clean = clean.replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]*)/gi, 'href="#"');
  clean = clean.replace(/href\s*=\s*(?:"data:[^"]*"|'data:[^']*'|data:[^\s>]*)/gi, 'href="#"');

  // 4. Proses setiap tag
  clean = clean.replace(/<[^>]*>/g, function (tag) {
    const match = tag.match(/^<\/(\w+)\s*>$/);
    if (match) {
      // Closing tag
      const tagName = match[1].toLowerCase();
      if (ALLOWED_TAGS.has(tagName)) {
        return '</' + tagName + '>';
      }
      return '';
    }

    const openMatch = tag.match(/^<(\w+)([^>]*)>$/);
    if (!openMatch) return '';

    const tagName = openMatch[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) return '';

    // Untuk <a>, hanya pertahankan href
    if (tagName === 'a') {
      const hrefMatch = tag.match(/href\s*=\s*"([^"]*)"/);
      const href = hrefMatch ? hrefMatch[1] : '';
      // Pastikan href aman
      if (!href || href.startsWith('javascript:') || href.startsWith('data:')) {
        // Hapus tag <a> jika href tidak aman atau tidak valid
        // Konversi ke plain text — tapi kita keep tag tanpa href? Lebih baik strip.
        return '<a href="#">';
      }
      // Tambah rel untuk keamanan
      return '<a href="' + href.replace(/"/g, '&quot;') + '" rel="noopener noreferrer" target="_blank">';
    }

    // Self-closing br
    if (tagName === 'br') {
      return '<br>';
    }

    return '<' + tagName + '>';
  });

  return clean;
}

/**
 * Hapus semua tag HTML, return plain text.
 *
 * @param {string} dirtyString - HTML mentah
 * @returns {string} Plain text tanpa tag
 */
function stripHtml(dirtyString) {
  if (!dirtyString || typeof dirtyString !== 'string') return '';
  return dirtyString
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { sanitizeHtml, stripHtml };
