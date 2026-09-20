/**
 * KpiCards — 4 Executive Summary Cards Mode B (Phase 3).
 * Warna status WCAG AA: hijau = diterima, amber = revisi/proses, abu = belum.
 */
import Link from 'next/link';
import { formatDesimal, formatAngka } from '@/lib/format';

export default function KpiCards({ pemdi, spbe, opd }) {
  const t1 = pemdi.tahap1 || { diterima: 0, revisi: 0, dinilai: 0 };
  const total = pemdi.total_item_bukti || 232;
  const pctDiterima = Math.round((t1.diterima / total) * 100);
  const pctRevisi = Math.round((t1.revisi / total) * 100);
  const cards = [
    {
      href: '/pemdi', ic: '🚀', label: 'Indeks Pemdi — Simulasi Mandiri',
      value: formatDesimal(pemdi.indeks_aktual ?? 0), unit: `/ Target ${formatDesimal(pemdi.target_indeks ?? 2.5)}`,
      note: 'Hanya bukti diterima asesor yang dihitung · bukan nilai resmi', tone: 'gold',
    },
    {
      href: '/spbe', ic: '📊', label: 'Indeks SPBE 2025',
      value: formatDesimal(spbe.indeks), unit: `— ${spbe.kategori}`,
      note: 'Hasil evaluasi resmi Kementerian PANRB', tone: 'blue',
    },
    {
      href: '/pemdi#checklist', ic: '📦', label: 'Progress Bukti Dukung Tahap 1',
      value: `${t1.diterima}`, unit: `diterima · ${t1.revisi} revisi`,
      note: `${t1.dinilai} dinilai dari ${total} butir`, tone: 'green',
      bar: [{ pct: pctDiterima, cls: 'ok' }, { pct: pctRevisi, cls: 'warn' }],
    },
    {
      href: '/opd', ic: '🏛️', label: 'Kepatuhan Perangkat Daerah',
      value: formatAngka(opd.total_opd), unit: 'OPD · PIC bukti dukung',
      note: `${opd.instansi} instansi · ${opd.kecamatan} kecamatan · ${formatAngka(opd.total_asn)} ASN`, tone: 'gray',
    },
  ];
  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className={`kpi-card tone-${c.tone}`}>
          <div className="kpi-top"><span aria-hidden="true">{c.ic}</span><span className="kpi-label">{c.label}</span></div>
          <div className="kpi-val">{c.value} <small>{c.unit}</small></div>
          {c.bar && (
            <div className="kpi-bar" role="img" aria-label={`${pctDiterima}% diterima, ${pctRevisi}% revisi`}>
              {c.bar.map((b) => <span key={b.cls} className={`kpi-seg ${b.cls}`} style={{ width: `${b.pct}%` }} />)}
            </div>
          )}
          <div className="kpi-note">{c.note}</div>
        </Link>
      ))}
    </div>
  );
}
