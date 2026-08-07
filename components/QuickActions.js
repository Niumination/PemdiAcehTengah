import { useRouter } from 'next/router';

const actions = [
  {
    icon: '📋',
    label: 'Survei SKM',
    desc: 'Ikuti Survei Kepuasan Masyarakat terhadap layanan publik Aceh Tengah',
    href: '/skm',
    color: '#0ea5a4',
    bgColor: 'rgba(14,165,164,.1)',
  },
  {
    icon: '💬',
    label: 'Lapor / Saran',
    desc: 'Sampaikan laporan, aspirasi, atau saran untuk perbaikan layanan',
    href: '/lapor',
    color: '#1F2A44',
    bgColor: 'rgba(0,64,152,.1)',
  },
  {
    icon: '🔍',
    label: 'Cari Layanan',
    desc: 'Temukan informasi dan layanan publik yang Anda butuhkan',
    href: '/cari',
    color: '#c79a3a',
    bgColor: 'rgba(199,154,58,.1)',
  },
  {
    icon: '💬',
    label: 'Tanya & FAQ',
    desc: 'Jawaban cepat seputar layanan publik dan portal Aceh Tengah',
    href: '/faq',
    color: '#15803d',
    bgColor: 'rgba(21,128,61,.1)',
  },
];

export default function QuickActions() {
  const router = useRouter();

  return (
    <section
      className="quick-actions"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 26,
      }}
    >
      {actions.map((item) => (
        <button
          key={item.href}
          className="quick-action-card"
          type="button"
          onClick={() => router.push(item.href)}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r)',
            padding: 22,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            textAlign: 'left',
            fontFamily: 'var(--font)',
            transition: 'transform .2s, box-shadow .2s, border-color .2s',
            boxShadow: 'var(--sh-sm)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            const card = e.currentTarget;
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = 'var(--sh)';
            card.style.borderColor = 'color-mix(in srgb, ' + item.color + ' 40%, var(--line))';
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget;
            card.style.transform = '';
            card.style.boxShadow = 'var(--sh-sm)';
            card.style.borderColor = 'var(--line)';
          }}
        >
          {/* Glow effect on hover */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--r)',
              opacity: 0,
              transition: 'opacity .3s',
              pointerEvents: 'none',
              background: `radial-gradient(420px circle at 50% 50%, ${item.color}22, transparent 45%)`,
            }}
            className="qa-glow"
          />

          {/* Icon */}
          <div
            className="qa-icon"
            style={{
              width: 50,
              height: 50,
              borderRadius: 13,
              background: item.bgColor,
              color: item.color,
              display: 'grid',
              placeItems: 'center',
              fontSize: 24,
              flex: 'none',
              transition: 'transform .25s',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12) rotate(-4deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            {item.icon}
          </div>

          {/* Label */}
          <h3
            className="qa-label"
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--ink)',
              margin: 0,
              lineHeight: 1.2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {item.label}
          </h3>

          {/* Description */}
          <p
            className="qa-desc"
            style={{
              fontSize: 13,
              color: 'var(--ink-secondary)',
              margin: 0,
              flex: 1,
              lineHeight: 1.5,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {item.desc}
          </p>

          {/* Arrow indicator */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: item.color,
              position: 'relative',
              zIndex: 1,
            }}
          >
            Lanjutkan →
          </span>
        </button>
      ))}

      {/* Mobile responsive — overridden via inline style in <style> tag */}
      <style>{`
        @media (max-width: 900px) {
          .quick-actions {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .quick-actions {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
