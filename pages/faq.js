import Head from 'next/head';
import Link from 'next/link';
import faqData from '@/data/faq.json';
import { sanitizeHtml } from '@/lib/safeRichText';
import { useState } from 'react';

export default function FAQPage() {
  const [buka, setBuka] = useState(null);
  const [cari, setCari] = useState('');

  const toggle = (id) => setBuka(buka === id ? null : id);

  const semuaQA = faqData.kategori.flatMap(k =>
    k.pertanyaan.map((q, i) => ({ ...q, kategori: k.nama, kategoriId: k.id, ikon: k.ikon, uid: `${k.id}-${i}` }))
  );

  const filtered = cari
    ? semuaQA.filter(q =>
        q.tanya.toLowerCase().includes(cari.toLowerCase()) ||
        q.jawab.toLowerCase().includes(cari.toLowerCase()) ||
        q.kategori.toLowerCase().includes(cari.toLowerCase())
      )
    : semuaQA;

  return (
    <>
      <Head>
        <title>FAQ — Pemdi Aceh Tengah</title>
        <meta name="description" content="Pertanyaan umum seputar Pemerintah Digital Aceh Tengah — portal, layanan, SPBE, Pemdi, dan teknis." />
        <meta property="og:title" content="FAQ — Pemdi Aceh Tengah" />
        <meta property="og:description" content="Pertanyaan umum seputar Pemerintah Digital Aceh Tengah — portal, layanan, SPBE, Pemdi, dan teknis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pemdi-aceh-tengah.vercel.app/faq" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — Pemdi Aceh Tengah" />
        <meta name="twitter:description" content="Pertanyaan umum seputar Pemerintah Digital Aceh Tengah — portal, layanan, SPBE, Pemdi." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              name: 'FAQ Pemdi Aceh Tengah',
              description: 'Pertanyaan umum seputar Pemerintah Digital Aceh Tengah',
              url: 'https://pemdi-aceh-tengah.vercel.app/faq',
              isPartOf: { '@type': 'WebSite', name: 'Pemdi Aceh Tengah', url: 'https://pemdi-aceh-tengah.vercel.app' },
              mainEntity: faqData.kategori.flatMap(k =>
                k.pertanyaan.map(q => ({
                  '@type': 'Question',
                  name: q.tanya,
                  acceptedAnswer: { '@type': 'Answer', text: q.jawab.replace(/<[^>]*>/g, '') },
                }))
              ),
            }),
          }}
        />
      </Head>
      <section className="section-hero-faq">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Pertanyaan Umum (FAQ)</h1>
            <p>Jawaban cepat untuk pertanyaan yang sering diajukan tentang portal dan layanan Pemda Aceh Tengah</p>
          </div>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={cari}
              onChange={e => setCari(e.target.value)}
              className="search-input"
            />
            {cari && <button className="search-clear" onClick={() => setCari('')}>✕</button>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p style={{ fontWeight: 500 }}>Pertanyaan tidak ditemukan</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                Coba kata kunci lain, atau{' '}
                <Link href="/skm">laporkan pertanyaan Anda</Link>
              </p>
            </div>
          ) : (
            <div className="faq-list">
              {filtered.map((q) => (
                <div key={q.uid} className={`faq-item ${buka === q.uid ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggle(q.uid)}>
                    <span className="faq-kategori-badge">{q.ikon}</span>
                    <span className="faq-text">{q.tanya}</span>
                    <span className={`faq-chevron ${buka === q.uid ? 'rotated' : ''}`}>▼</span>
                  </button>
                  <div
                    className="faq-answer"
                    style={{
                      maxHeight: buka === q.uid ? '500px' : '0',
                      opacity: buka === q.uid ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div className="faq-answer-inner">
                      <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(q.jawab) }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center" style={{ marginTop: '2rem', gap: '0.75rem', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', textAlign: 'center' }}>
              Tidak menemukan jawaban?{' '}
              <Link href="/skm">Hubungi kami melalui halaman Survei & Laporan</Link>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section-hero-faq {
          background: linear-gradient(135deg, #004098 0%, #1565c0 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .section-hero-faq .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .section-hero-faq .back-link:hover { color: white; text-decoration: underline; }
        .section-hero-faq h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .section-hero-faq p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }
        .search-wrap { position: relative; max-width: 480px; margin-top: 1.25rem; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.875rem; }
        .search-input {
          width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: 8px; border: none;
          font-family: var(--font-body); font-size: 0.875rem; background: rgba(255,255,255,0.15);
          color: white; outline: none; backdrop-filter: blur(4px);
        }
        .search-input::placeholder { color: rgba(255,255,255,0.6); }
        .search-clear { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; cursor: pointer; font-size: 0.875rem; opacity: 0.7; }

        .faq-list { max-width: 800px; margin: 0 auto; }
        .faq-item {
          border: 1px solid var(--gray-200);
          border-radius: var(--radius);
          margin-bottom: 0.5rem;
          overflow: hidden;
          background: var(--white);
          transition: box-shadow 0.2s ease;
        }
        .faq-item:hover { box-shadow: var(--shadow-sm); }
        .faq-item.open { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary-light); }
        .faq-question {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem 1.25rem; background: none; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.9375rem; font-weight: 500;
          color: var(--gray-900); text-align: left; line-height: 1.4;
        }
        .faq-question:hover { background: var(--gray-50); }
        .faq-kategori-badge { font-size: 1.25rem; flex-shrink: 0; }
        .faq-text { flex: 1; }
        .faq-chevron {
          font-size: 0.6875rem; color: var(--gray-400); transition: transform 0.2s ease; flex-shrink: 0;
        }
        .faq-chevron.rotated { transform: rotate(180deg); color: var(--primary); }
        .faq-answer-inner { padding: 0 1.25rem 1rem; font-size: 0.875rem; color: var(--gray-700); line-height: 1.7; }
        .faq-answer-inner p { margin: 0; }
        .faq-answer-inner :global(a) { font-weight: 500; }
      `}</style>
    </>
  );
}
