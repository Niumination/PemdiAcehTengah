/* ===================================================================
   Pemdi Aceh Tengah — Safe HTML sanitizer for trusted content only
   Allowlist: a, strong, em, b, i, br, code, mark, span
   Tag dibangun ulang dari nol (bukan filter attribut) sehingga
   event-handler, style, class, dan URI berbahaya (javascript:/data:)
   tidak mungkin lolos — lihat audit S-1 2026-09-17.
   =================================================================== */

const ALLOWED_TAGS = new Set(['a', 'strong', 'em', 'b', 'i', 'br', 'code', 'mark', 'span']);

// Hanya izinkan href dengan skema/awalan berikut (positif allowlist).
// Menutup jalur javascript:, data:, vbscript:, file:, dan entitas HTML
// yang menyamarkannya (mis. "java&#115;cript:") karena dibangun ulang
// dari nilai mentah sebelum decode entitas oleh browser.
const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/i;

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/**
 * Sanitize HTML — hanya tag dalam allowlist, atribut dibuang semua
 * kecuali href pada <a> (dan hanya bila lolos SAFE_HREF).
 * Link eksternal otomatis diberi rel="noopener noreferrer" + target _blank.
 * Aman untuk dipakai di dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return html
    // Hapus script block dan komentar HTML sepenuhnya
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (tag, name) => {
      const tagName = name.toLowerCase();
      if (!ALLOWED_TAGS.has(tagName)) return '';
      if (tag.startsWith('</')) return `</${tagName}>`;
      if (tagName === 'a') {
        const m = tag.match(/href\s*=\s*["']([^"']*)["']/i);
        const href = m ? m[1].trim() : '';
        if (href && SAFE_HREF.test(href)) {
          const safe = escapeAttr(href);
          return /^https?:\/\//i.test(href)
            ? `<a href="${safe}" rel="noopener noreferrer" target="_blank">`
            : `<a href="${safe}">`;
        }
        return '<a>';
      }
      return `<${tagName}>`;
    });
}
