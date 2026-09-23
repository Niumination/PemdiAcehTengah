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
  lebar: <><path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" /></>,
  aspek: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>,
  grafik: <><path d="M4 19V5M4 19h16M8 15l4-6 4 3 4-6" /></>,
  probis: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a3 3 0 0 1 3 3v6" /></>,
  buku: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" /><path d="M8 7h8" /></>,
  roda: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  radial: <><circle cx="19" cy="12" r="2" /><circle cx="8" cy="5" r="2" /><circle cx="5" cy="12" r="2" /><circle cx="8" cy="19" r="2" /><path d="M17.5 10.8 9.7 6.2M17 12H7M17.5 13.2 9.7 17.8" /></>,
  baris: <><rect x="13" y="3" width="8" height="18" rx="1" /><path d="M15 8h4M15 12h4M15 16h4M3 12h6" /></>,
  lipat: <><path d="m6 9 6 6 6-6" /></>,
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
