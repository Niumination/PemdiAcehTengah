export default function QuickActions() {
  const actions = [
    {
      icon: '🔍',
      title: 'Cari Layanan',
      desc: 'Temukan layanan publik yang Anda butuhkan',
      href: '/layanan',
      color: '#004098',
    },
    {
      icon: '💬',
      title: 'Lapor / Saran',
      desc: 'Laporkan masalah atau beri saran perbaikan',
      href: '#',
      color: '#0891b2',
      onClick: true,
    },
    {
      icon: '❓',
      title: 'Tanya Jawab',
      desc: 'Pertanyaan umum seputar layanan & portal',
      href: '/faq',
      color: '#1f6f43',
    },
    {
      icon: '📝',
      title: 'Survei Kepuasan',
      desc: 'Beri nilai pelayanan publik — 2 menit saja',
      href: '/skm',
      color: '#e65100',
    },
  ];

  return (
    <div className="container">
      <div className="quick-actions-grid">
        {actions.map((a, i) => (
          <a
            key={i}
            href={a.onClick ? undefined : a.href}
            className="quick-action-card"
            onClick={a.onClick ? (e) => {
              e.preventDefault();
              // Dispatch custom event for LaporWidget
              window.dispatchEvent(new CustomEvent('open-lapor'));
            } : undefined}
          >
            <div
              className="quick-action-icon"
              style={{ background: `${a.color}12`, color: a.color }}
            >
              {a.icon}
            </div>
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
