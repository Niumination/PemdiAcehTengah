const nf = new Intl.NumberFormat('id-ID');

export const formatAngka = (n) => (typeof n === 'number' ? nf.format(n) : n ?? '—');
export const formatDesimal = (n, d = 2) =>
  typeof n === 'number'
    ? new Intl.NumberFormat('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n)
    : n ?? '—';
export const gabung = (arr, sep = ', ') => Array.isArray(arr) ? arr.join(sep) : (arr ?? '');
