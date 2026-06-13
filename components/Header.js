import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="gov-header">
      <div className="container gov-header-inner">
        <a href="/" className="gov-header-logo">
          <div className="gov-header-logo-img">AT</div>
          <div>
            <span>Pemdi Aceh Tengah</span>
            <small>Pemerintah Digital — Kabupaten Aceh Tengah</small>
          </div>
        </a>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        <nav className={`gov-nav ${mobileOpen ? 'mobile-open' : ''}`}>
          <a href="/">Beranda</a>
          <a href="/layanan">📋 Layanan</a>
          <a href="/probis">🗺️ PPB</a>
          <a href="/pemdi">📊 Pemdi</a>
          <a href="/faq">❓ FAQ</a>
          <a href="/skm">📝 Survei</a>
          <a href="/glosarium">📖 Glosarium</a>
          <a href="/cari" className="nav-search-link">🔍 Cari</a>
          <a href="/tanya">💬 Tanya</a>
          <a href="#tentang">Tentang</a>
        </nav>
      </div>
    </header>
  );
}
