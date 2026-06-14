import TopographicBackdrop from './TopographicBackdrop';

export default function AwardHero({ data }) {
  const spbe = data?.spbe;
  const opd = data?.opd;

  return (
    <section className="award-hero">
      <TopographicBackdrop variant="dark" />
      <div className="container">
        <div className="award-hero-content">
          <div className="award-hero-tagline">
            <span className="award-hero-tagline-dot" />
            🏛️ Pemerintah Digital — Kabupaten Aceh Tengah
          </div>
          <h1>
            Aceh Tengah Menuju <em>Pemerintah Digital</em>
          </h1>
          <p>
            Transformasi tata kelola pemerintahan berbasis elektronik menuju
            Pemerintah Digital (Pemdi) yang transparan, efisien, dan
            berorientasi pada masyarakat. Berdasarkan kerangka
            <strong> Permenpan RB 8/2026</strong>.
          </p>
          <div className="award-hero-actions">
            <a href="/probis" className="btn btn-gold btn-lg">
              Jelajahi Peta Proses Bisnis →
            </a>
            <a href="#spbe" className="btn btn-outline-light btn-lg">
              Lihat Indeks SPBE
            </a>
            <a href="/layanan" className="btn btn-outline-light btn-lg">
              Layanan Publik
            </a>
          </div>
          <div className="award-stats">
            <div className="award-stat">
              <div className="award-stat-num">{opd?.ringkasan?.instansi ?? 38}</div>
              <div className="award-stat-label">Instansi Pemerintah</div>
            </div>
            <div className="award-stat">
              <div className="award-stat-num">{opd?.ringkasan?.kecamatan ?? 14}</div>
              <div className="award-stat-label">Kecamatan</div>
            </div>
            <div className="award-stat">
              <div className="award-stat-num gold">{spbe?.indeks ?? '2.59'}</div>
              <div className="award-stat-label">Indeks SPBE 2025</div>
            </div>
            <div className="award-stat">
              <div className="award-stat-num">{opd?.total_asn?.toLocaleString('id-ID') ?? '4.955'}</div>
              <div className="award-stat-label">ASN</div>
            </div>
            <div className="award-stat">
              <div className="award-stat-num cyan">52</div>
              <div className="award-stat-label">Unit Layanan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
