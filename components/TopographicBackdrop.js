export default function TopographicBackdrop({ variant = 'dark' }) {
  const fillColor = variant === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,64,152,0.03)';

  return (
    <div className="topographic-backdrop" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id={`topo-${variant}`}
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="20" cy="20" r="18" fill="none" stroke={fillColor} strokeWidth="0.5" />
            <circle cx="20" cy="20" r="12" fill="none" stroke={fillColor} strokeWidth="0.4" />
            <circle cx="20" cy="20" r="6" fill="none" stroke={fillColor} strokeWidth="0.3" />
            <circle cx="80" cy="60" r="24" fill="none" stroke={fillColor} strokeWidth="0.5" />
            <circle cx="80" cy="60" r="16" fill="none" stroke={fillColor} strokeWidth="0.4" />
            <circle cx="80" cy="60" r="8" fill="none" stroke={fillColor} strokeWidth="0.3" />
            <circle cx="40" cy="100" r="14" fill="none" stroke={fillColor} strokeWidth="0.4" />
            <circle cx="40" cy="100" r="7" fill="none" stroke={fillColor} strokeWidth="0.3" />
            <circle cx="100" cy="20" r="10" fill="none" stroke={fillColor} strokeWidth="0.4" />
            <circle cx="100" cy="20" r="5" fill="none" stroke={fillColor} strokeWidth="0.3" />
            <path d="M0 60 Q 20 40, 40 60 T 80 60 T 120 60" fill="none" stroke={fillColor} strokeWidth="0.4" />
            <path d="M0 80 Q 30 60, 60 80 T 120 80" fill="none" stroke={fillColor} strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="1440" height="800" fill={`url(#topo-${variant})`} />
      </svg>
    </div>
  );
}
