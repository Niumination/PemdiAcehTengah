import Sp4nBanner from './Sp4nBanner';
import { KerawangDivider, MotifPucukRebung } from './motif/KerawangMotifs';
import { PUBLIK_AKTIF } from '@/lib/modeSitus';

// Dievaluasi sekali per load (skill react: init-once) — bukan di tiap render.
// suppressHydrationWarning menutup edge pergantian tahun (SSG build vs client).
const currentYear = new Date().getFullYear();

export default function Footer() {

  return (
    <footer className="gov-footer">
      <KerawangDivider aria-hidden="true" />
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Executive Authority */}
          <div className="footer-brand">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MotifPucukRebung size={26} />
              Pemdi Aceh Tengah
            </h4>
            <p>
              Kokpit Pemerintah Digital Kabupaten Aceh Tengah — perangkat kerja Tim Asesor Internal.
              Transformasi menuju Pemerintah Digital (Pemdi) berdasarkan 
              <strong> PermenPANRB No. 8 Tahun 2026</strong> &amp; <strong>PermenPANRB No. 19 Tahun 2018</strong>.
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.8125rem' }}>
              <strong>Walidata Resmi Data Sektoral:</strong> Dinas Komunikasi dan Informatika (Diskominfo) Kab. Aceh Tengah.
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--muted)' }}>
              <span style={{ color: 'var(--gold-deep)' }}>“Ratip musara anguk, nyawa musara peluk,</span>
              {' '}alang tulung beret bebantu — persatuan yang kukuh, saling menopang bagai &ldquo;Rante&rdquo;, keterpaduan
              kerawang Gayo dalam pelayanan publik.
            </p>
          </div>

          {/* Column 2: Navigation Hub */}
          <div className="footer-col">
            <h5>Navigasi Utama</h5>
            <ul>
              <li><a href="/">Beranda Portal</a></li>
              {PUBLIK_AKTIF && (<li><a href="/layanan">Direktori Layanan Publik (25 SLA)</a></li>)}
              <li><a href="/pemdi">Indeks Pemdi (PermenPANRB 8/2026)</a></li>
              <li><a href="/spbe">Evaluasi Indeks SPBE 2025 (2,59)</a></li>
              <li><a href="/probis">Peta Proses Bisnis (PPB Level 0–2)</a></li>
              {PUBLIK_AKTIF && (<li><a href="/skm">Survei Kepuasan Masyarakat (SKM)</a></li>)}
              {PUBLIK_AKTIF && (<li><a href="/dashboard-kepuasan">Live Dashboard IKM Publik</a></li>)}
            </ul>
          </div>

          {/* Column 3: Regulations & Official Documents */}
          <div className="footer-col">
            <h5>Regulasi &amp; Dokumen</h5>
            <ul>
              <li>
                <a href="https://cekprestasi.acehtengahkab.go.id/spbe/" target="_blank" rel="noopener noreferrer">
                  📄 Laporan Resmi SPBE 2025
                </a>
              </li>
              <li>
                <a href="/docs/permenpanrb-8-2026.pdf" target="_blank" rel="noopener noreferrer">
                  📄 PermenPANRB No. 8/2026 (Pemdi)
                </a>
              </li>
              <li>
                <a href="https://peraturan.bpk.go.id/Details/132523/permen-pan-rb-no-19-tahun-2018" target="_blank" rel="noopener noreferrer">
                  📜 PermenPANRB No. 19/2018 (PPB)
                </a>
              </li>
              <li>
                <a href="https://peraturan.bpk.go.id/Details/104930/perpres-no-95-tahun-2018" target="_blank" rel="noopener noreferrer">
                  📜 Perpres No. 95/2018 (SPBE)
                </a>
              </li>
              <li>
                <a href="/pemdi#dasar-hukum">
                  ⚖️ SK Tim Koordinasi Pemdi 2026
                </a>
              </li>
              {PUBLIK_AKTIF && (
              <li>
                <a href="/kebijakan-privasi">
                  🔒 Kebijakan Privasi Portal
                </a>
              </li>
              )}
            </ul>
          </div>

          {/* Column 4: Contact & Channels */}
          <div className="footer-col">
            <h5>Kontak &amp; Integrasi</h5>
            <ul>
              <li>
                <a href="https://acehtengahkab.go.id" target="_blank" rel="noopener noreferrer">
                  🌐 Portal Pemkab acehtengahkab.go.id
                </a>
              </li>
              <li>
                <a href="mailto:diskominfoacehtengah@gmail.com">
                  ✉️ diskominfoacehtengah@gmail.com
                </a>
              </li>
              <li>
                <a href="https://github.com/Niumination/PemdiAcehTengah" target="_blank" rel="noopener noreferrer">
                  💻 Repositori Open Source GitHub
                </a>
              </li>
              <li style={{ marginTop: '10px' }}>
                <Sp4nBanner variant="footer" />
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <span suppressHydrationWarning>
            &copy; {currentYear} Pemerintah Kabupaten Aceh Tengah.
            Open Source Government Technology berlisensi{' '}
            <a href="https://github.com/Niumination/PemdiAcehTengah/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
              MIT License
            </a>.
          </span>
          <span>Next.js 14 Pages Router · Deployed on Vercel</span>
        </div>
      </div>
    </footer>
  );
}
