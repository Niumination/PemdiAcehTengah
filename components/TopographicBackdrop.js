import { useMemo } from 'react';

/**
 * Generate a topographic contour path — organic, map-like curves.
 * Uses sine/cosine waves at multiple frequencies to simulate terrain contours.
 */
function generateTopoPath(width, height, spacing = 18, complexity = 4) {
  const paths = [];
  const offset = Math.random() * 1000; // pseudo-random seed for variety

  for (let y = -spacing; y < height + spacing; y += spacing) {
    const points = [];
    const steps = Math.max(20, Math.floor(width / 12));

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      let ny = y;

      // Multi-frequency wave to create organic contour lines
      for (let f = 0; f < complexity; f++) {
        const freq = 0.004 + f * 0.003;
        const amp = 6 + f * 2.5;
        ny += Math.sin((x + offset) * freq + f * 2.1 + offset * 0.1) * amp;
        ny += Math.cos((x + offset) * freq * 1.7 + f * 1.3) * (amp * 0.4);
      }

      // Add some localized undulations
      ny += Math.sin(x * 0.008 + offset * 0.05) * 4;
      ny += Math.cos((x + y) * 0.005 + offset * 0.03) * 3;

      points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ny.toFixed(1)}`);
    }

    paths.push(points.join(' '));
  }

  return paths;
}

export default function TopographicBackdrop({ opacity = 0.05, className = '' }) {
  const width = 1440;
  const height = 800;
  const spacing = 22;

  const paths = useMemo(() => generateTopoPath(width, height, spacing), [width, height]);

  return (
    <div
      className={`topo-bg ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        className="topo-overlay"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: opacity,
        }}
      >
        <defs>
          <linearGradient id="topoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--lake-cyan)" />
            <stop offset="50%" stopColor="var(--gayo-gold)" />
            <stop offset="100%" stopColor="var(--gov-blue-700)" />
          </linearGradient>
        </defs>

        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#topoGrad)"
            strokeWidth={0.6 + (i % 3) * 0.15}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.4 + (i % 5) * 0.1}
            style={{
              transition: 'opacity .5s ease',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
