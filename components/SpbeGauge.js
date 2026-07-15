const domains = [
  { key: 'kebijakan_spbe', name: '1. Kebijakan SPBE', value: 2.80, max: 5.0, desc: 'Perda/Qanun & Aturan Pelaksana' },
  { key: 'tata_kelola_spbe', name: '2. Tata Kelola SPBE', value: 2.50, max: 5.0, desc: 'Arsitektur, Peta Rencana & Tim' },
  { key: 'manajemen_spbe', name: '3. Manajemen SPBE', value: 1.00, max: 5.0, desc: 'Keamanan, Risik, & SDM Digital' },
  { key: 'layanan_spbe', name: '4. Layanan SPBE', value: 3.40, max: 5.0, desc: 'Portal Layanan Administrasi & Publik' },
];

function getLevelBadge(val) {
  if (val >= 3.5) return { cls: 'badge-green', label: 'Sangat Baik' };
  if (val >= 2.5) return { cls: 'badge-yellow', label: 'Cukup' };
  return { cls: 'badge-red', label: 'Perlu Perbaikan' };
}

export default function SpbeGauge({ nilai = 2.59 }) {
  const levelInfo = getLevelBadge(nilai);
  const percentage = (nilai / 5.0) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Gauge Header / Score Summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ position: 'relative', width: 110, height: 110, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="46" fill="none" stroke="var(--line-2)" strokeWidth="10" />
            <circle
              cx="55"
              cy="55"
              r="46"
              fill="none"
              stroke={nilai >= 3.0 ? 'var(--ok)' : nilai >= 2.0 ? 'var(--gold)' : 'var(--bad)'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 289} 289`}
              transform="rotate(-90 55 55)"
            />
          </svg>
          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
              {nilai.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 600 }}>skala 5,00</div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <span className={`badge ${levelInfo.cls}`} style={{ marginBottom: '6px' }}>
            {levelInfo.label}
          </span>
          <h4 style={{ fontSize: '1.05rem', margin: '2px 0 6px', color: 'var(--ink)' }}>
            Indeks SPBE Kabupaten Aceh Tengah 2025
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--ink-secondary)', margin: 0, lineHeight: 1.5 }}>
            Target minimal level nasional KemenPANRB adalah <strong>3,00 (Baik)</strong>. Evaluasi SPBE merupakan fondasi utama penilaian Kematangan Pemdi 2026.
          </p>
        </div>
      </div>

      {/* Domain Breakdown Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {domains.map((d) => {
          const pct = (d.value / d.max) * 100;
          const badg = getLevelBadge(d.value);

          return (
            <div key={d.key} style={{ padding: '12px 14px', borderRadius: 'var(--r-xs)', background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--ink)' }}>{d.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '8px' }}>({d.desc})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {d.value.toFixed(2)}
                  </span>
                  <span className={`badge ${badg.cls}`}>{badg.label}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '7px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: d.value >= 3.0 ? 'var(--ok)' : d.value >= 2.0 ? 'var(--gold)' : 'var(--bad)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
