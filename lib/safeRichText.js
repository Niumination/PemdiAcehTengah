/**
 * SafeRichText — Allowlist HTML sanitizer untuk rendering konten terpercaya (FAQ, bot answer).
 * Input user TIDAK boleh lewat sini — render sebagai text biasa.
 */

const ALLOWED_TAGS = ['a', 'strong', 'em', 'b', 'i', 'br', 'code', 'ul', 'ol', 'li', 'p', 'span'];

/**
 * Sanitize HTML string — hanya tag dalam allowlist yang dipertahankan.
 * Tambah rel="noopener noreferrer" pada semua <a>.
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  
  // Hapus tag dan atribut yang tidak diizinkan
  let sanitized = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*on\w+\s*=[^>]*>/gi, '') // hapus event handler
    .replace(/<([a-z]+)([^>]*)>/gi, (match, tag, attrs) => {
      const t = tag.toLowerCase();
      if (!ALLOWED_TAGS.includes(t)) return '';
      
      // Filter atribut — hanya href, target, rel, class
      const cleanAttrs = attrs.replace(/(\s+(href|target|rel|class)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))/gi, (m) => m)
                              .replace(/\s+[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
      
      // Pastikan <a> punya rel="noopener noreferrer"
      if (t === 'a') {
        const hasRel = /rel\s*=/.test(cleanAttrs);
        const relTag = hasRel ? '' : ' rel="noopener noreferrer"';
        const targetTag = /target\s*=/.test(cleanAttrs) ? '' : ' target="_blank"';
        return `<${t}${cleanAttrs}${relTag}${targetTag}>`;
      }
      
      return `<${t}${cleanAttrs}>`;
    })
    .replace(/<\/[^>]+>/gi, (match) => {
      const tag = match.replace(/<\/|>/g, '').toLowerCase();
      if (!ALLOWED_TAGS.includes(tag)) return '';
      return match;
    });
  
  return sanitized;
}

/**
 * Highlight search term dalam teks — return React-safe fragments.
 * Gunakan ini di halaman cari.js untuk menggantikan dangerouslySetInnerHTML.
 */
export function highlightText(text, query) {
  if (!query || !text) return [text];
  
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [text];
  
  const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (terms.some(t => part.toLowerCase() === t || part.toLowerCase().includes(t))) {
      return { __html: true, text: part, key: i };
    }
    return { text: part, key: i };
  });
}

/**
 * Render highlight result sebagai React elements.
 */
export function renderHighlight(parts, className = 'highlight') {
  return parts.map((p, i) => {
    if (p.__html) {
      return `<mark class="${className}" key={${i}}>${p.text}</mark>`;
    }
    return p.text;
  }).join('');
}

/**
 * Simple text rendering — untuk user message di Tanya.
 */
export function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
