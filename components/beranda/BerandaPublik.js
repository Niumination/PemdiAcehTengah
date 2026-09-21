/**
 * BerandaPublik — Mode A (Portal Layanan Publik). Dipisah dari pages/index.js agar hanya
 * di-require saat NEXT_PUBLIC_PERSONA_PUBLIK=on (lib/modeSitus) → tidak ikut bundel internal.
 * Isi identik dengan panel publik Sprint UI/UX 21 Sep 2026.
 */
import Link from 'next/link';
import ServiceFinder from '@/components/ServiceFinder';
import DashboardSKM from '@/components/DashboardSKM';
import HeroPublik from '@/components/publik/HeroPublik';
import SektorLayanan from '@/components/publik/SektorLayanan';
import { kelompokkanSektor } from '@/lib/sektorLayanan';

export default function BerandaPublik({ layananData, ringkasan, hidden }) {
  const totalLayanan = layananData.ringkasan?.total_layanan ?? 25;
  const totalKategoriLayanan = layananData.ringkasan?.total_kategori ?? 7;
  const sektor = kelompokkanSektor(layananData.kategori);
  return (
    <div id="persona-panel-publik" role="tabpanel" aria-labelledby="persona-tab-publik" hidden={hidden}>
        <HeroPublik totalLayanan={totalLayanan} totalOpd={ringkasan.total_opd} />

        <section className="sec" id="sektor">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Sektor Layanan Terpadu</div>
              <h2>Pilih sektor layanan</h2>
              <p>{totalLayanan} layanan dari {totalKategoriLayanan} kategori dikelompokkan ke 6 sektor. Klik untuk melihat syarat, biaya, dan lama proses.</p>
            </div>
            <Link href="/layanan" className="link-more">Direktori lengkap →</Link>
          </div>
          <SektorLayanan sektor={sektor} />
        </section>

      {/* ============ 3. CITIZEN TASK HUB ("Apa yang Ingin Anda Lakukan Hari Ini?") ============ */}
      <section className="sec" id="layanan-warga">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Akses Utama Warga</div>
            <h2>Apa yang ingin Anda lakukan hari ini?</h2>
            <p>Pilih tugas pelayanan utama untuk kemudahan warga Kabupaten Aceh Tengah.</p>
          </div>
        </div>

        <div className="qa-grid">
          <Link href="/layanan" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}>
              📋
            </div>
            <h3>Direktori Layanan Terpadu</h3>
            <p>{totalLayanan} layanan di {totalKategoriLayanan} sektor lengkap dengan syarat, biaya (Gratis), &amp; SLA waktu proses.</p>
            <span className="go">Buka Layanan →</span>
          </Link>

          <button
            type="button"
            className="qa-card kerawang-card"
            onClick={() => window.dispatchEvent(new CustomEvent('pemdi:open-lapor'))}
            style={{ textAlign: 'left', font: 'inherit', background: 'var(--surface)', border: '1px solid var(--line)' }}
          >
            <div className="ic" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
              💬
            </div>
            <h3>Pengaduan &amp; Tiket Lapor</h3>
            <p>Sampaikan keluhan atau saran dan dapatkan ID tiket pelacakan real-time (contoh: LAPOR-20260715-A1B2C3D4E5F6).</p>
            <span className="go">Buat Laporan / Lacak →</span>
          </button>

          <Link href="/skm" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}>
              📝
            </div>
            <h3>Survei Kepuasan (SKM)</h3>
            <p>Beri penilaian kualitas layanan publik (2 menit, anonim, terukur langsung pada Indeks IKM).</p>
            <span className="go">Isi Survei SKM →</span>
          </Link>

          <Link href="/faq" className="qa-card kerawang-card">
            <div className="ic" style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}>
              🤖
            </div>
            <h3>Asisten Virtual &amp; FAQ</h3>
            <p>Jawaban cepat serba otomatis seputar syarat kependudukan, perizinan, dan bantuan portal.</p>
            <span className="go">Tanya Asisten Virtual →</span>
          </Link>
        </div>
      </section>


      {/* ============ 4. POPULAR SERVICES EXPLORER ============ */}
      <section className="sec">
        <div className="sec-head">
          <div>
            <div className="eyebrow">E-Services Explorer</div>
            <h2>Pencarian Layanan Publik Terpadu</h2>
            <p>Telusuri kepastian waktu (SLA), biaya, dan persyaratan layanan publik.</p>
          </div>
          <Link href="/layanan" className="link-more">
            Lihat Semua 25 Layanan →
          </Link>
        </div>

        <div className="glow-card" style={{ padding: '24px' }}>
          <ServiceFinder layanan={layananData.kategori.flatMap((k) => k.layanan.map((l) => ({ ...l, kategori: k.nama })))} />
        </div>
      </section>


      {/* ============ 7. LIVE PUBLIC SKM & CITIZEN SATISFACTION ============ */}
      <section className="sec" id="skm-dashboard">
        <div className="sec-head">
          <div>
            <div className="eyebrow">Indikator I20 PermenPANRB 8/2026</div>
            <h2>Hasil Live Survei Kepuasan Masyarakat (SKM)</h2>
            <p>Agregat penilaian kepuasan warga real-time dari seluruh unit pelayanan publik.</p>
          </div>
          <Link href="/dashboard-kepuasan" className="link-more">
            Buka Full Dashboard IKM →
          </Link>
        </div>

        <div className="glow-card" style={{ padding: '24px' }}>
          <DashboardSKM />
        </div>
      </section>


    </div>
  );
}
