import Head from 'next/head';
import Link from 'next/link';
import faq from '@/data/faq.json';
import { useState, useEffect } from 'react';
import { MotifEmun, MotifRante } from '@/components/motif/KerawangMotifs';
import { sanitizeHtml } from '@/lib/sanitize';

const FEEDBACK_KEY = 'pemdi_faq_fb';

export default function FAQPage() {
  const [buka, setBuka] = useState(null);
  const [cari, setCari] = useState('');
  const [kategoriAktif, setKategoriAktif] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '{}');
      setFeedback(saved);
    } catch {}
  }, []);

  const recordFeedback = (uid, type) => {
    const next = { ...feedback, [uid]: type };
    setFeedback(next);
    try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next)); } catch {}
  };

  const semuaQA = faq.kategori.flatMap(k =>
    k.pertanyaan.map((q, i) => ({ ...q, kategori: k.nama, kategoriId: k.id, ikon: k.ikon, uid: `${k.id}-${i}` }))
  );

  const filtered = cari
    ? semuaQA.filter(q =>
        q.tanya.toLowerCase().includes(cari.toLowerCase()) ||
        q.jawab.toLowerCase().includes(cari.toLowerCase()) ||
        q.kategori.toLowerCase().includes(cari.toLowerCase())
      )
    : kategoriAktif
      ? semuaQA.filter(q => q.kategoriId === kategoriAktif)
      : semuaQA;

  return (
    <>
      <Head>
        <title>FAQ — Pemdi Aceh Tengah</title>
        <meta name="description" content="Pertanyaan umum seputar Pemerintah Digital Aceh Tengah — portal, layanan, SPBE, Pemdi, dan teknis." />
      </Head>

      <section data-reveal style={{
        background: 'var(--hero-grad)',
        borderRadius: 'var(--r)',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: -18, right: 6, opacity: 0.5, pointerEvents: 'none' }}>
          <MotifEmun size={300} />
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: -12, left: 10, opacity: 0.32, pointerEvents: 'none' }}>
          <MotifRante size={170} />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.875rem' }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
            ← Beranda
          </Link>
          <div style={{ marginTop: '1rem' }}>
            <h1 className="gold-head" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Pertanyaan Umum (FAQ)</h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>Jawaban cepat untuk pertanyaan yang sering diajukan tentang portal dan layanan Pemda Aceh Tengah</p>
          </div>
          <div style={{ position: 'relative', maxWidth: '480px', marginTop: '1.25rem' }}>
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.875rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={cari}
              onChange={e => setCari(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', background: 'rgba(255,255,255,0.15)',
                color: '#fff', outline: 'none', backdropFilter: 'blur(4px)',
              }}
            />
            {cari && <button onClick={() => setCari('')}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.875rem', opacity: 0.7 }}>✕</button>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* ── Kategori Tabs ── */}
          <div className="faq-tabs" role="tablist">
            <button
              className={`faq-tab ${!kategoriAktif ? 'active' : ''}`}
              onClick={() => { setKategoriAktif(null); setCari(''); }}
              role="tab"
              aria-selected={!kategoriAktif}
            >
              Semua
            </button>
            {faq.kategori.map(k => (
              <button
                key={k.id}
                className={`faq-tab ${kategoriAktif === k.id ? 'active' : ''}`}
                onClick={() => { setKategoriAktif(k.id); setCari(''); }}
                role="tab"
                aria-selected={kategoriAktif === k.id}
              >
                {k.ikon} {k.nama}
              </button>
            ))}
          </div>

          {/* ── Daftar QA ── */}
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
                <div key={q.uid} id={q.kategoriId === kategoriAktif ? undefined : q.kategoriId} className={`faq-item ${buka === q.uid ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => toggle(buka, q.uid, setBuka)}>
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
                      {/* ── Feedback 👍/👎 ── */}
                      <div className="faq-feedback">
                        <span className="faq-feedback-label">Apakah ini membantu?</span>
                        <button
                          className={`faq-fb-btn ${feedback[q.uid] === 'y' ? 'on' : ''}`}
                          onClick={() => recordFeedback(q.uid, 'y')}
                          disabled={!!feedback[q.uid]}
                          aria-label="Ya, membantu"
                        >👍</button>
                        <button
                          className={`faq-fb-btn ${feedback[q.uid] === 'n' ? 'on' : ''}`}
                          onClick={() => recordFeedback(q.uid, 'n')}
                          disabled={!!feedback[q.uid]}
                          aria-label="Tidak membantu"
                        >👎</button>
                        {feedback[q.uid] && <span className="faq-fb-done">Terima kasih!</span>}
                      </div>
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
        .faq-tabs {
          display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
        }
        .faq-tab {
          padding: 0.45rem 1rem; border-radius: 999px; border: 1px solid var(--line);
          background: var(--surface); font-family: var(--font-body); font-size: 0.8125rem;
          cursor: pointer; color: var(--ink-secondary); transition: all 0.15s ease;
        }
        .faq-tab:hover { border-color: var(--primary); color: var(--primary); }
        .faq-tab.active { background: var(--primary); color: white; border-color: var(--primary); }

        .faq-list { max-width: 800px; margin: 0 auto; }
        .faq-item {
          border: 1px solid var(--line);
          border-radius: var(--r, 16px);
          margin-bottom: 0.5rem;
          overflow: hidden;
          background: var(--surface);
          transition: box-shadow 0.2s ease;
        }
        .faq-item:hover { box-shadow: var(--sh-sm); }
        .faq-item.open { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary-50); }
        .faq-question {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 1rem 1.25rem; background: none; border: none; cursor: pointer;
          font-family: var(--font-body); font-size: 0.9375rem; font-weight: 500;
          color: var(--ink); text-align: left; line-height: 1.4;
        }
        .faq-question:hover { background: var(--surface-hover); }
        .faq-kategori-badge { font-size: 1.25rem; flex-shrink: 0; }
        .faq-text { flex: 1; }
        .faq-chevron {
          font-size: 0.6875rem; color: var(--muted); transition: transform 0.2s ease; flex-shrink: 0;
        }
        .faq-chevron.rotated { transform: rotate(180deg); color: var(--primary); }
        .faq-answer-inner { padding: 0 1.25rem 1rem; font-size: 0.875rem; color: var(--ink-secondary); line-height: 1.7; }
        .faq-answer-inner p { margin: 0; }
        .faq-answer-inner :global(a) { font-weight: 500; }

        .faq-feedback { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--line-2); }
        .faq-feedback-label { font-size: 0.75rem; color: var(--muted); }
        .faq-fb-btn { background: none; border: 1px solid var(--line); border-radius: 999px; padding: 0.2rem 0.6rem; cursor: pointer; font-size: 0.875rem; transition: all 0.15s ease; }
        .faq-fb-btn:hover:not(:disabled) { border-color: var(--primary); }
        .faq-fb-btn.on { background: var(--primary-50); border-color: var(--primary); }
        .faq-fb-btn:disabled { opacity: 0.5; cursor: default; }
        .faq-fb-done { font-size: 0.75rem; color: var(--ok); }
      `}</style>
    </>
  );
}

function toggle(buka, uid, setBuka) {
  setBuka(buka === uid ? null : uid);
}
