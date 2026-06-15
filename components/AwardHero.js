export default function AwardHero({ bupati, wakil, periode }) {
  return (
    <section
      className="award-hero"
      style={{
        borderRadius: 22,
        padding: '40px 36px',
        color: '#fff',
        marginBottom: 22,
        background: 'var(--hero-award-gradient)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Premium glow orbs (subtle) */}
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,164,.12), transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '15%',
          bottom: -30,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199,154,58,.08), transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Icon */}
        <div style={{ fontSize: 36, marginBottom: 8, lineHeight: 1 }}>
          🏛️
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(26px, 3vw, 36px)',
            fontWeight: 800,
            margin: '0 0 4px',
            letterSpacing: '-.02em',
            color: '#fff',
          }}
        >
          Pemdi Aceh Tengah
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,.8)',
            margin: '0 0 20px',
            lineHeight: 1.5,
            maxWidth: 600,
          }}
        >
          Transformasi Digital Tata Kelola Pemerintahan Aceh Tengah
        </p>

        {/* Data source */}
        <p
          style={{
            fontSize: 12.5,
            color: 'rgba(255,255,255,.55)',
            margin: '0 0 24px',
            fontWeight: 500,
          }}
        >
          Walidata: Diskominfo Kab. Aceh Tengah · Open Source MIT
        </p>

        {/* Bupati & Wakil row */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                color: 'rgba(255,255,255,.5)',
                marginBottom: 2,
              }}
            >
              Bupati
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.3,
              }}
            >
              {bupati}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                color: 'rgba(255,255,255,.5)',
                marginBottom: 2,
              }}
            >
              Wakil Bupati
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                lineHeight: 1.3,
              }}
            >
              {wakil}
            </div>
          </div>
        </div>

        {/* Periode */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: 'rgba(255,255,255,.7)',
          }}
        >
          <span>📅</span>
          <span>Periode {periode}</span>
        </div>
      </div>
    </section>
  );
}
