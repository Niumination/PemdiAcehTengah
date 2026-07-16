/**
 * Slugify — konsisten untuk semua komponen & halaman
 */
export default function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
