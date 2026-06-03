export default function Footer() {
  return (
    <footer className="gov-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h4>Pemdi Aceh Tengah</h4>
            <p>
              Portal Digital Pemerintah Daerah Kabupaten Aceh Tengah.
              Transformasi menuju Pemerintah Digital (Pemdi) — open source
              government technology untuk tata kelola yang transparan,
              efisien, dan berorientasi pada masyarakat.
            </p>
            <p className="mt-2">
              <strong>Narasumber Data:</strong> Diskominfo Kab. Aceh Tengah
              — sebagai Walidata.
            </p>
          </div>
          <div className="footer-col">
            <h5>Navigasi</h5>
            <ul>
              <li><a href="/">Beranda</a></li>
              <li><a href="#probis">Peta Proses Bisnis</a></li>
              <li><a href="#spbe">Indeks SPBE</a></li>
              <li><a href="#opd">Perangkat Daerah</a></li>
              <li><a href="#rekomendasi">Rekomendasi</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Dokumen</h5>
            <ul>
              <li><a href="#">Laporan SPBE 2025</a></li>
              <li><a href="#">Permenpan 19/2018</a></li>
              <li><a href="#">Permenpan 59/2020</a></li>
              <li><a href="#">Perpres 95/2018</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Kontak</h5>
            <ul>
              <li><a href="https://acehtengahkab.go.id">acehtengahkab.go.id</a></li>
              <li><a href="mailto:diskominfoacehtengah@gmail.com">diskominfoacehtengah@gmail.com</a></li>
              <li><a href="https://github.com/Niumination/PemdiAcehTengah" target="_blank">GitHub Repo</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} Pemdi Aceh Tengah.
            Open source under{' '}
            <a href="https://github.com/Niumination/PemdiAcehTengah/blob/main/LICENSE" target="_blank">
              MIT License
            </a>.
          </span>
          <span>Dibangun dengan Next.js — Deploy di Vercel</span>
        </div>
      </div>
    </footer>
  );
}
