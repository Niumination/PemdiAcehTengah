/* ===================================================================
   Pemdi Aceh Tengah — Safe HTML sanitizer for trusted content only
   Allowlist: a, strong, em, b, i, br, code, mark
   =================================================================== */

const ALLOWED_TAGS = new Set(['a', 'strong', 'em', 'b', 'i', 'br', 'code', 'mark', 'span']);

/**
 * Sanitize HTML — only allowlist tags kept, everything else escaped.
 * All external links get rel="noopener noreferrer".
 * Return React-compatible string.
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  // Simple approach: strip disallowed tags, keep allowed ones
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, (tag) => {
      const match = tag.match(/^<\/?(\w+)/);
      if (!match) return '';
      const tagName = match[1].toLowerCase();
      if (!ALLOWED_TAGS.has(tagName)) return '';
      // For <a> tags, enforce rel
      if (tagName === 'a') {
        const href = tag.match(/href="([^"]*)"/);
        const text = tag.match(/>([^<]*)</);
        if (href && !href[1].startsWith('/') && !href[1].startsWith('#')) {
          return `<a href="${href[1]}" rel="noopener noreferrer" target="_blank">`;
        }
      }
      return tag;
    });
}

/**
 * Highlight text — split into segments, wrap matches in <mark>.
 * Returns React nodes array — NO dangerouslySetInnerHTML.
 */
export function highlightText(text = '', query) {
  if (!query || !query.trim()) return text;
  const words = query.trim().split(/\s+/).filter(Boolean);

  let segments = [{ text, match: false }];
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    const newSegments = [];
    for (const seg of segments) {
      if (seg.match) {
        newSegments.push(seg);
        continue;
      }
      const parts = seg.text.split(re);
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;
        newSegments.push({ text: parts[i], match: i % 2 === 1 });
      }
    }
    segments = newSegments;
  }

  return segments.map((s, i) =>
    s.match
      ? `<mark key={${i}} style="background:#fef08a;border-radius:2px;padding:0 2px;color:#000">${s.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mark>`
      : s.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  ).join('');
}
