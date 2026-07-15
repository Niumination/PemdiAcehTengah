import Sp4nBanner from './Sp4nBanner';

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
              <li><a href="/layanan">Layanan Publik</a></li>
              <li><a href="/pemdi">Indeks Pemdi</a></li>
              <li><a href="/probis">Peta Proses Bisnis</a></li>
              <li><a href="/glosarium">Glosarium</a></li>
              <li><a href="#opd">Perangkat Daerah</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Dokumen</h5>
            <ul>
              <li><a href="https://cekprestasi.acehtengahkab.go.id/spbe/" target="_blank" rel="noopener">Laporan SPBE 2025</a></li>
              <li><a href="/docs/permenpanrb%208%202026.pdf" target="_blank" rel="noopener">Permenpan 8/2026 (Pemdi)</a></li>
              <li><a href="/pemdi#dasar-hukum" rel="noopener">SK Tim Koordinasi Pemdi 2026</a></li>
              <li><a href="https://peraturan.bpk.go.id/Details/132523/permen-pan-rb-no-19-tahun-2018" target="_blank" rel="noopener">Permenpan 19/2018</a></li>
              <li><a href="https://peraturan.bpk.go.id/Details/180164/permen-pan-rb-no-59-tahun-2020" target="_blank" rel="noopener">Permenpan 59/2020 (arsip)</a></li>
              <li><a href="https://peraturan.bpk.go.id/Details/104930/perpres-no-95-tahun-2018" target="_blank" rel="noopener">Perpres 95/2018</a></li>
              <li><Sp4nBanner variant="footer" /></li>
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
