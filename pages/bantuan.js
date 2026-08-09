import Head from 'next/head';
import Link from 'next/link';
import faq from '@/data/faq.json';
import layanan from '@/data/layanan.json';
import { MotifEmun, MotifUlen } from '@/components/motif/KerawangMotifs';

export default function BantuanPage() {
  const allServices = layanan.kategori.flatMap(k => k.layanan);

  return (
    <>
      <Head>
        <title>Pusat Bantuan — Pemdi Aceh Tengah</title>
        <meta name="description" content="Pusat bantuan portal Pemdi Aceh Tengah — FAQ, SLA layanan, kontak helpdesk, dan SP4N LAPOR." />
      </Head>

      <section data-reveal className="hero-bantuan" style={{ position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -18, right: 6, opacity: 0.5, pointerEvents: 'none' }}>
          <MotifEmun size={280} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -10, left: 10, opacity: 0.32, pointerEvents: 'none' }}>
          <MotifUlen size={80} />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1 className="gold-head">🆘 Pusat Bantuan</h1>
            <p>FAQ, SLA layanan, kontak helpdesk, dan status sistem</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* ── Kategori FAQ ── */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📖 Kategori FAQ</h2>
            <div className="faq-card-grid">
              {faq.kategori.map(k => (
                <Link key={k.id} href={`/faq#${k.id}`} className="faq-kategori-card">
                  <span style={{ fontSize: '2rem' }}>{k.ikon}</span>
                  <div>
                    <strong>{k.nama}</strong>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                      {k.pertanyaan.length} pertanyaan
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── SLA Layanan ── */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>⏱ Standar Layanan (SLA)</h2>
            <div className="table-wrap">
              <table className="sla-table">
                <thead>
                  <tr>
                    <th>Layanan</th>
                    <th>OPD</th>
                    <th>Waktu</th>
                    <th>Biaya</th>
                    <th>SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {allServices.map((s, i) => (
                    <tr key={i}>
                      <td>{s.nama}</td>
                      <td style={{ fontSize: '0.8125rem' }}>{layanan.kategori.find(k => k.layanan.includes(s))?.nama || '-'}</td>
                      <td>{s.waktu}</td>
                      <td>{s.biaya}</td>
                      <td><span className={`sla-badge ${parseInt(s.sla) >= 90 ? 'sla-baik' : parseInt(s.sla) >= 80 ? 'sla-cukup' : 'sla-kurang'}`}>{s.sla}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Kontak & SP4N ── */}
          <div className="bantuan-grid-2col">
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>📞 Kontak Helpdesk</h3>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem' }}>
                <strong>Diskominfo Aceh Tengah</strong><br />
                Jl. Lebe Kader No. 15, Takengon
              </p>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ☎️ (0643) 21100<br />
                ✉️ kominfo@acehtengahkab.go.id
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>📢 SP4N LAPOR</h3>
              <p style={{ fontSize: '0.875rem', margin: '0 0 0.75rem' }}>
                Laporan pengaduan masyarakat terintegrasi nasional.
              </p>
              <a href="https://www.lapor.go.id" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Kunjungi SP4N LAPOR →
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-bantuan {
          background: linear-gradient(135deg, #004098 0%, #1565c0 100%);
          color: white; padding: 2.5rem 0 2rem;
        }
        .hero-bantuan .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .hero-bantuan .back-link:hover { color: white; text-decoration: underline; }
        .hero-bantuan h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .hero-bantuan p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .faq-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
        .faq-kategori-card {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem; border: 1px solid var(--line);
          border-radius: var(--r, 16px); background: var(--surface);
          text-decoration: none; color: inherit; transition: box-shadow 0.15s ease;
        }
        .faq-kategori-card:hover { box-shadow: var(--shadow-md); }
        .faq-kategori-card div { display: flex; flex-direction: column; gap: 0.2rem; }

        .table-wrap { overflow-x: auto; }
        .sla-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
        .sla-table th { text-align: left; padding: 0.6rem 0.75rem; background: var(--bg-2); font-weight: 600; border-bottom: 2px solid var(--line); }
        .sla-table td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--line-2); }
        .sla-table tr:hover td { background: var(--surface-hover); }
        .sla-badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px; font-weight: 600; font-size: 0.75rem; }
        .sla-baik { background: var(--ok-bg); color: var(--ok); }
        .sla-cukup { background: var(--warn-bg); color: var(--warn); }
        .sla-kurang { background: var(--bad-bg); color: var(--bad); }

        .bantuan-grid-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 640px) { .bantuan-grid-2col { grid-template-columns: 1fr; } }
        .card { padding: 1.25rem; border: 1px solid var(--line); border-radius: var(--r, 16px); background: var(--surface); }
        .card h3 { font-size: 1rem; }
      `}</style>
    </>
  );
}
