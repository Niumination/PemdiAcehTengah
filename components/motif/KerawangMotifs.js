/**
 * KERAWANG GAYO — Motif SVG inline (zero-dependency, resolusi tak hingga).
 * Filosofi: "Ker" = daya pikir · "Rawang" = bayangan fenomena alam.
 *
 * Motif & makna:
 *  - emun     Emun Berangkat (awan)   → kesatuan, kerukunan, dinamis
 *  - puter    Puter Tali (pilinan)    → persatuan, kejujuran, lurus
 *  - rebung   Pucuk Rebung (segitiga) → teguh pendirian, generasi baru
 *  - rante    Rante (rantai)          → keterpaduan kukuh
 *  - pagar    Pagar (batas)           → pertahanan, ketertiban
 *  - ulen     Ulen (bulan)            → kekuatan, penerangan
 *  - tapak    Tapak Seleman           → keadilan, pengayoman
 */

const WARN = '#D4A83C';
const HIJAU = '#2E7D5B';
const MERAH = '#B3402E';
const INK = 'currentColor';

/** Emun Berangkat — gumpalan awan geometris (simbol kesatuan yang dinamis) */
export function MotifEmun({ size = 120, animated = true, className = '', ...rest }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120" fill="none" aria-hidden="true" className={`${animated ? 'emun-drift' : ''} ${className}`} {...rest}>
      <g stroke={INK} strokeWidth="3" strokeLinecap="round">
        <path d="M30 70 Q50 30 82 50 Q104 28 130 48 Q158 34 172 60 Q188 70 170 78 L40 78 Q22 76 30 70Z" fill={`${WARN}22`} />
        <path d="M60 90 Q78 72 100 84 Q120 68 142 84 Q156 78 158 90 L64 90Z" fill={`${HIJAU}1e`} />
        <circle cx="50" cy="50" r="4" fill={WARN} stroke="none" />
        <circle cx="140" cy="42" r="3" fill={WARN} stroke="none" />
        <circle cx="100" cy="24" r="2.5" fill={HIJAU} stroke="none" />
      </g>
    </svg>
  );
}

/** Puter Tali — pilinan tali (persatuan, kejujuran, lurus) */
export function MotifPuterTali({ width = '100%', height = 18, ...rest }) {
  return (
    <svg width={width} height={height} viewBox="0 0 600 20" preserveAspectRatio="none" aria-hidden="true" {...rest}>
      <g fill="none" strokeLinecap="round">
        <path d="M0 10 Q15 2 30 10 T60 10 T90 10 T120 10 T150 10 T180 10 T210 10 T240 10 T270 10 T300 10 T330 10 T360 10 T390 10 T420 10 T450 10 T480 10 T510 10 T540 10 T570 10 T600 10" stroke={WARN} strokeWidth="3" opacity="0.85" />
        <path d="M0 10 Q15 18 30 10 T60 10 T90 10 T120 10 T150 10 T180 10 T210 10 T240 10 T270 10 T300 10 T330 10 T360 10 T390 10 T420 10 T450 10 T480 10 T510 10 T540 10 T570 10 T600 10" stroke={HIJAU} strokeWidth="1.6" opacity="0.6" transform="translate(0 -3)" />
      </g>
    </svg>
  );
}

/** Pucuk Rebung — piramida segitiga (teguh pendirian, tumbuh terus) */
export function MotifPucukRebung({ size = 48, color = WARN, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...rest}>
      <path d="M24 6 L42 42 L6 42 Z" fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 18 L32 38 L16 38 Z" fill={`${color}33`} stroke="none" />
      <path d="M24 28 L28 38 L20 38 Z" fill={`${color}55`} stroke="none" />
    </svg>
  );
}

/** Rante — rantai keterpaduan (persatuan kukuh antar entitas) */
export function MotifRante({ size = 90, ...rest }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 180 90" fill="none" aria-hidden="true" {...rest}>
      {[20, 65, 110].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="45" r="20" stroke={WARN} strokeWidth="4" fill="none" />
          <circle cx={cx} cy="45" r="7" fill={HIJAU} />
        </g>
      ))}
      <path d="M38 38 Q55 18 70 36" stroke={WARN} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M82 34 Q100 14 116 34" stroke={WARN} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M126 36 Q144 18 160 38" stroke={WARN} strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Pagar — batas antar motif (pertahanan & ketertiban sosial) */
export function MotifPagar({ width = '100%', height = 14, ...rest }) {
  return (
    <svg width={width} height={height} viewBox="0 0 600 14" preserveAspectRatio="none" aria-hidden="true" {...rest}>
      <g stroke={WARN} strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 30 }).map((_, i) => (
          <path key={i} d={`M${i * 20 + 8} 12 L${i * 20 + 14} 2 L${i * 20 + 20} 12`} fill="none" />
        ))}
      </g>
      <line x1="0" y1="13" x2="600" y2="13" stroke={HIJAU} strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

/** Ulen — bulan sabit (kekuatan & penerangan) */
export function MotifUlen({ size = 44, color = WARN, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...rest}>
      <path d="M30 4 A22 22 0 1 0 30 44 A18 18 0 0 1 30 4Z" fill={color} opacity="0.9" />
      <circle cx="12" cy="12" r="2.2" fill={HIJAU} />
      <circle cx="8" cy="26" r="1.6" fill={HIJAU} opacity="0.8" />
    </svg>
  );
}

/** Tapak Seleman — medallion keadilan & pengayoman */
export function MotifTapak({ size = 56, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true" {...rest}>
      <circle cx="28" cy="28" r="24" stroke={WARN} strokeWidth="2.4" fill="none" />
      <circle cx="28" cy="28" r="16" stroke={HIJAU} strokeWidth="1.6" fill="none" strokeDasharray="5 4" />
      <path d="M28 18 L33 27 L28 38 L23 27 Z" fill={`${WARN}44`} stroke={WARN} strokeWidth="1.8" />
      <circle cx="28" cy="28" r="3" fill={WARN} />
    </svg>
  );
}

/** KerawangDivider — divider pagar + label tengah (dipakai antar section) */
export function KerawangDivider({ label, icon, style }) {
  return (
    <div className="kr-divider" style={style} aria-hidden={label ? undefined : true}>
      <MotifPagar width="100%" height={12} />
      {label && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-secondary)', whiteSpace: 'nowrap' }}>
          {icon && <span>{icon}</span>}
          {label}
        </span>
      )}
      <MotifPagar width="100%" height={12} />
    </div>
  );
}

/** MotifBackground — latar dekoratif motif (opacity rendah, pointer-events none) */
export function MotifBackground({ pattern = 'emun', opacity, style }) {
  const P = {
    emun: <MotifEmun size={260} animated={false} />,
    rante: <MotifRante size={300} />,
    tapak: <MotifTapak size={140} />,
    rebung: <MotifPucukRebung size={120} color={HIJAU} />,
  }[pattern] || <MotifEmun size={260} animated={false} />;

  return (
    <div className="kr-motif-bg" style={{ opacity, ...style }} aria-hidden="true">
      <div style={{ position: 'absolute', top: '6%', right: '4%', transform: 'rotate(8deg)' }}>{P}</div>
      <div style={{ position: 'absolute', bottom: '10%', left: '6%', transform: 'rotate(-8deg) scale(0.8)', opacity: 0.8 }}>{P}</div>
    </div>
  );
}

/** MarqueeBudaya — ticker filosofi Kerawang Gayo */
export function MarqueeBudaya({ items, style }) {
  const defaultItems = [
    'Emun Berangkat — kesatuan & kerukunan',
    'Puter Tali — persatuan & kejujuran',
    'Pucuk Rebung — teguh pendirian & generasi baru',
    'Rante — keterpaduan yang kukuh',
    'Tapak Seleman — keadilan & pengayoman',
    'Ulen — kekuatan & penerangan',
  ];
  const list = items || defaultItems;
  const track = [...list, ...list].join('  ✦  ');
  return (
    <div className="kr-marquee" style={style} aria-hidden="true">
      <div className="kr-marquee-track">
        <span><i>✦</i> {track}</span>
        <span><i>✦</i> {track}</span>
      </div>
    </div>
  );
}