/**
 * components/ui/Ikon.js — Set ikon SVG internal (gaya garis 1.75, 24×24) — Patch 1.
 * Menggantikan emoji sebagai ikon UI. Pakai: <Ikon nama="cari" size={16} />
 * Nama: cari, tema, tutup, panah, kompas, daftar, antrean, modul, draf, menu,
 *       peringatan, cek, jam, dokumen, unduh, salin, cetak, luar, pengguna, gedung.
 */
const P = {
  cari: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  tema: <><path d="M12 3a9 9 0 1 0 9 9c0-.5 0-1-.1-1.4A5.5 5.5 0 0 1 13.4 3.1C13 3 12.5 3 12 3Z" /></>,
  tutup: <><path d="M6 6l12 12M18 6 6 18" /></>,
  panah: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  kompas: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  daftar: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  antrean: <><path d="M4 6h16M4 12h10M4 18h6" /><path d="m17 15 2 2 4-4" /></>,
  modul: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 10v10" /></>,
  draf: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  peringatan: <><path d="M12 3 2.5 20h19z" /><path d="M12 9v5M12 17h.01" /></>,
  cek: <><path d="m5 12 4 4L19 6" /></>,
  jam: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  dokumen: <><path d="M6 3h8l5 5v13H6z" /><path d="M14 3v5h5" /></>,
  unduh: <><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></>,
  salin: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
  cetak: <><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" /><path d="M6 14h12v7H6z" /></>,
  luar: <><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  pengguna: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  gedung: <><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 21v-5h6v5M9 11h.01M15 11h.01M12 11h.01" /></>,
  kiri: <><path d="m15 6-6 6 6 6" /></>,
  kanan: <><path d="m9 6 6 6-6 6" /></>,
};

export default function Ikon({ nama, size = 16, stroke = 1.75, className, title, ...rest }) {
  const d = P[nama] || P.daftar;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      className={className}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {d}
    </svg>
  );
}

export const NAMA_IKON = Object.keys(P);
