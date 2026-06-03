const domains = [
  { key: 'kebijakan_spbe', name: 'Domain Kebijakan SPBE', value: 2.30, max: 5 },
  { key: 'tata_kelola_spbe', name: 'Domain Tata Kelola SPBE', value: 1.70, max: 5 },
  { key: 'manajemen_spbe', name: 'Domain Manajemen SPBE', value: 1.00, max: 5 },
  { key: 'layanan_spbe', name: 'Domain Layanan SPBE', value: 3.75, max: 5 },
];

function getLevel(value) {
  if (value >= 3.5) return 'good';
  if (value >= 2.5) return 'average';
  return 'poor';
}

export default function SpbeGauge({ data }) {
  const index = data?.spbe?.indeks || 2.59;
  const level = getLevel(index);
  const spbeData = data?.spbe;

  return (
    <div className="spbe-gauge">
      <div className="spbe-gauge-value">
        <div className={`spbe-gauge-num ${level}`}>
          {index.toFixed(2)}
        </div>
        <div className="spbe-gauge-label">Indeks SPBE 2025</div>
        <span className={`badge ${level === 'good' ? 'badge-green' : level === 'average' ? 'badge-orange' : 'badge-red'} mt-1`}>
          {index >= 3.5 ? 'Baik' : index >= 2.5 ? 'Cukup' : 'Kurang'}
        </span>
      </div>
      <div className="spbe-gauge-details">
        {domains.map((d) => {
          const pct = (d.value / d.max) * 100;
          const lvl = getLevel(d.value);
          const targetPct = (3.0 / d.max) * 100; // target minimal level 3
          return (
            <div className="spbe-domain" key={d.key}>
              <div className="spbe-domain-header">
                <span className="spbe-domain-name">{d.name}</span>
                <span className="spbe-domain-value">{d.value.toFixed(2)}</span>
              </div>
              <div className="spbe-bar">
                <div
                  className={`spbe-bar-fill ${lvl}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#adb5bd', marginTop: '2px' }}>
                Target minimal level 3 (60%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
