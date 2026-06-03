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
          <a href="/" className="active">Beranda</a>
          <a href="#probis">Peta Proses Bisnis</a>
          <a href="#spbe">Indeks SPBE</a>
          <a href="#opd">Perangkat Daerah</a>
          <a href="#rekomendasi">Rekomendasi</a>
          <a href="#tentang">Tentang</a>
        </nav>
      </div>
    </header>
  );
}
