/**
 * components/ui/StatusIkon.js — Ikon status bukti / jenis revisi (Patch 3).
 * Menggantikan emoji STATUS_META.icon di halaman lama. Warna ikut token status.
 */
import Ikon from './Ikon';

const PETA = {
  diterima: { nama: 'cek', warna: 'var(--rk-status-ink-ok)' },
  revisi: { nama: 'peringatan', warna: 'var(--rk-status-ink-bad)' },
  proses: { nama: 'jam', warna: 'var(--rk-status-ink-warn)' },
  draf: { nama: 'draf', warna: 'var(--rk-status-ink-draf)' },
  belum: { nama: 'dokumen', warna: 'var(--rk-ink-3)' },
  tidak_tepat: { nama: 'tutup', warna: 'var(--rk-status-ink-bad)' },
  belum_diunggah: { nama: 'unduh', warna: 'var(--rk-status-ink-warn)' },
  otomatis_ditolak: { nama: 'peringatan', warna: 'var(--rk-status-ink-bad)' },
  gap: { nama: 'kompas', warna: 'var(--rk-status-ink-info)' },
  tinggi: { nama: 'peringatan', warna: 'var(--rk-status-ink-bad)' },
  sedang: { nama: 'jam', warna: 'var(--rk-status-ink-warn)' },
  rendah: { nama: 'cek', warna: 'var(--rk-status-ink-info)' },
};

export default function StatusIkon({ k, size = 14, title }) {
  const m = PETA[k] || PETA.belum;
  return <Ikon nama={m.nama} size={size} title={title} style={{ color: m.warna, verticalAlign: '-2px', flex: '0 0 auto' }} />;
}
