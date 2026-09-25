/**
 * CatatanTujuan — catatan pemilik/pengelola tentang tujuan Dashboard Pemdi.
 * Ditampilkan di /pemdi, /modul-indikator, /requirement. Teks tunggal di sini
 * (dan disalin ke README "Tujuan"), agar tidak ada versi yang saling berbeda.
 *
 * Props: compact (bool) — versi satu paragraf untuk halaman yang padat.
 */
import Link from 'next/link';
import Ikon from '@/components/ui/Ikon';

export const TUJUAN_KOKPIT = {
  judul: 'Untuk siapa dan untuk apa dashboard ini',
  inti:
    'Website/aplikasi ini ditujukan untuk memudahkan Tim Asesor Internal Pemerintah Kabupaten Aceh Tengah ' +
    'dalam memenuhi kebutuhan bukti dukung Evaluasi Kinerja Pemerintah Digital. Kriteria dan butir bukti ' +
    'memakai bahasa baku PermenPANRB Nomor 8 Tahun 2026 apa adanya, lalu diterjemahkan ke ruang lingkup ' +
    'Pemda Aceh Tengah — perangkat daerah, dokumen, sistem, dan kondisi aktual yang benar-benar ada — ' +
    'sehingga tim tahu persis dokumen apa yang harus disiapkan, oleh siapa, dan bagaimana bentuknya.',
  prinsip: [
    { ikon: 'dokumen', teks: 'Bahasa baku PermenPANRB 8/2026 dipertahankan pada nama butir & kriteria level — tidak diparafrasa.' },
    { ikon: 'gedung', teks: 'Penerjemahan ke konteks Aceh Tengah ada di kolom contoh dokumen, PIC perangkat daerah, catatan, dan template draf.' },
    { ikon: 'kompas', teks: 'Status tiap butir mengikuti hasil asesor di eval.spbe.go.id — bukan klaim mandiri. Angka indeks di sini adalah simulasi, bukan nilai resmi.' },
    { ikon: 'peringatan', teks: 'Catatan asesor ditampilkan apa adanya agar revisi dikerjakan tepat sasaran, bukan berdasarkan tafsiran.' },
  ],
  pemilik: 'Catatan pengelola — Diskominfo Kab. Aceh Tengah (Bid. Layanan E-Government)',
};

export default function CatatanTujuan({ compact = false }) {
  const t = TUJUAN_KOKPIT;
  return (
    <aside
      aria-label={t.judul}
      className="rk-tujuan"
      style={{
        margin: compact ? 0 : '0 0 24px',
        padding: compact ? '12px 16px' : '18px 20px',
        borderRadius: compact ? 'var(--rk-r-2, 12px)' : '12px',
        border: '1px solid var(--gold, #C6A75E)',
        borderLeftWidth: '5px',
        background: compact ? 'var(--rk-panel)' : 'var(--surface)',
        fontSize: '0.86rem',
        lineHeight: 1.6,
        color: compact ? 'var(--rk-ink)' : 'var(--text)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <strong style={{ color: 'var(--primary)' }}>{t.judul}</strong>
        <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', color: 'var(--muted)' }}>{t.pemilik}</span>
      </div>
      <p style={{ margin: 0 }}>{t.inti}</p>
      {!compact && (
        <ul style={{ margin: '10px 0 0', paddingLeft: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '6px 16px' }}>
          {t.prinsip.map((p, i) => (
            <li key={i} style={{ fontSize: '0.78rem', color: 'var(--ink-secondary, var(--muted))', display: 'flex', gap: '6px' }}>
              <Ikon nama={p.ikon} size={14} />
              <span>{p.teks}</span>
            </li>
          ))}
        </ul>
      )}
      {compact && (
        <div style={{ marginTop: '6px', fontSize: '0.74rem' }}>
          <Link href="/pemdi#tujuan" style={{ color: 'var(--primary)', fontWeight: 600 }}>Selengkapnya di Dashboard Pemdi →</Link>
        </div>
      )}
    </aside>
  );
}
