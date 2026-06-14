import { useMemo } from 'react';

export default function AwardHero({ opdData = null, pemdiData = null }) {
  const totalASN = useMemo(() => {
    if (Array.isArray(opdData) && opdData.length > 0) {
      return opdData.reduce((sum, d) => sum + (d.jumlah_asn || d.asn || d.total_asn || 0), 0);
    }
    return 4507;
  }, [opdData]);

  const totalOPD = useMemo(() => {
    if (Array.isArray(opdData)) return opdData.length;
    return 52;
  }, [opdData]);

  const indeksPemdi = useMemo(() => {
    if (pemdiData && typeof pemdiData.indeks_pemdi === 'number') return pemdiData.indeks_pemdi;
    if (pemdiData && typeof pemdiData.indeks === 'number') return pemdiData.indeks;
    return null;
  }, [pemdiData]);

  const formatNumber = (n) => {
    if (typeof n !== 'number') return '—';
    return n.toLocaleString('id-ID');
  };

  return (
    <section
      className="award-hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 22,
        padding: '40px 36px 36px',
        color: '#fff',
        marginBottom: 22,
        background: 'var(--hero-award-gradient)',
      }}
    >
      {/* Premium glow orbs */}
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: -60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(199,154,58,.18), transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 9s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '20%',
          bottom: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,164,.12), transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 11s ease-in-out infinite reverse',
        }}
      />

      {/* Award badge */}
      <div
        className="award-hero-badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(199,154,58,.2)',
          border: '1px solid rgba(199,154,58,.35)',
          padding: '6px 16px',
          borderRadius: 999,
          fontSize: 12.5,
          fontWeight: 700,
          backdropFilter: 'blur(6px)',
          letterSpacing: '.03em',
          textTransform: 'uppercase',
          color: '#f0d48a',
          marginBottom: 18,
        }}
      >
        <span style={{ fontSize: 15 }}>🏆</span>
        Award-Level
      </div>

      {/* Title */}
      <h1
        className="award-title"
        style={{
          fontSize: 'clamp(26px, 3.6vw, 40px)',
          fontWeight: 800,
          letterSpacing: '-.03em',
          lineHeight: 1.2,
          color: '#fff',
          maxWidth: 700,
          margin: '0 0 12px',
        }}
      >
        Selamat Datang di Portal Resmi{' '}
        <span style={{ color: '#f0d48a' }}>Pemerintah Aceh Tengah</span>
      </h1>

      {/* Subtitle */}
      <p
        className="award-subtitle"
        style={{
          fontSize: 16,
          color: '#d7e6f7',
          maxWidth: 600,
          lineHeight: 1.6,
          margin: '0 0 24px',
        }}
      >
        Portal Digital Pemerintah Daerah — wujud transformasi menuju
        Pemerintah Digital (Pemdi) yang transparan, akuntabel, dan
        berorientasi pada pelayanan publik terbaik untuk seluruh masyarakat
        Aceh Tengah.
      </p>

      {/* Stats */}
      <div
        className="award-stats"
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 14,
            padding: '14px 22px',
            backdropFilter: 'blur(6px)',
            textAlign: 'center',
            minWidth: 130,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-.02em',
              lineHeight: 1,
              color: '#fff',
            }}
          >
            {formatNumber(totalASN)}
          </div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: '#adc9ed',
              marginTop: 3,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
            }}
          >
            Total ASN
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,.1)',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 14,
            padding: '14px 22px',
            backdropFilter: 'blur(6px)',
            textAlign: 'center',
            minWidth: 130,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-.02em',
              lineHeight: 1,
              color: '#fff',
            }}
          >
            {formatNumber(totalOPD)}
          </div>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: '#adc9ed',
              marginTop: 3,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
            }}
          >
            Total OPD
          </div>
        </div>
        {indeksPemdi !== null && (
          <div
            style={{
              background: 'rgba(199,154,58,.15)',
              border: '1px solid rgba(199,154,58,.25)',
              borderRadius: 14,
              padding: '14px 22px',
              backdropFilter: 'blur(6px)',
              textAlign: 'center',
              minWidth: 130,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-.02em',
                lineHeight: 1,
                color: '#f0d48a',
              }}
            >
              {indeksPemdi.toFixed(2)}
            </div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: '#d4bc7a',
                marginTop: 3,
                textTransform: 'uppercase',
                letterSpacing: '.04em',
              }}
            >
              Indeks Pemdi
            </div>
          </div>
        )}
      </div>

      {/* CTA buttons */}
      <div
        className="cta-group"
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <a
          href="/skm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            border: 0,
            background: '#fff',
            color: '#0a4d8c',
            textDecoration: 'none',
            transition: 'transform .18s, box-shadow .18s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--sh-lg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          📋 Langganan SKM
        </a>
        <a
          href="/lapor"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
            background: 'rgba(255,255,255,.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.25)',
            textDecoration: 'none',
            transition: 'background .18s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,.12)';
          }}
        >
          💬 Lapor Saran
        </a>
      </div>

      {/* Gayo motif separator */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          display: 'flex',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          height="8"
          preserveAspectRatio="none"
          viewBox="0 0 1200 8"
          style={{ display: 'block' }}
        >
          <defs>
            <pattern
              id="gayoMotif"
              x="0"
              y="0"
              width="60"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              {/* Traditional Gayo geometric rhombus/diamond motif */}
              <rect width="60" height="8" fill="rgba(199,154,58,.12)" />
              <polygon
                points="30,0 60,4 30,8 0,4"
                fill="rgba(199,154,58,.2)"
              />
              <polygon
                points="30,1 58,4 30,7 2,4"
                fill="rgba(14,165,164,.08)"
              />
            </pattern>
          </defs>
          <rect width="100%" height="8" fill="url(#gayoMotif)" />
        </svg>
      </div>

      {/* Inline keyframes for float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </section>
  );
}
