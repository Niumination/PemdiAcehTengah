import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import faqData from '@/data/faq.json';

/* ---------- helpers ---------- */
function normalise(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function tokenise(s) {
  return normalise(s).split(/\s+/).filter(Boolean);
}

function matchScore(question, queryTokens) {
  const qTokens = tokenise(question);
  if (!qTokens.length || !queryTokens.length) return 0;
  const matches = queryTokens.filter(t => qTokens.some(q => q.includes(t) || t.includes(q)));
  const ratio = matches.length / Math.max(queryTokens.length, qTokens.length);
  // bonus for exact substring match
  const exactBonus = normalise(question).includes(normalise(queryTokens.join(' '))) ? 0.3 : 0;
  return Math.min(ratio + exactBonus, 1);
}

/* ---------- build corpus ---------- */
const corpus = faqData.kategori.flatMap(k =>
  k.pertanyaan.map(p => ({ ...p, kategori: k.nama, kategoriIkon: k.ikon }))
);

/* quick replies */
const quickList = [
  { label: 'Apa itu Pemdi?', query: 'Apa itu Pemdi Aceh Tengah' },
  { label: 'Nilai SPBE', query: 'nilai SPBE Aceh Tengah' },
  { label: 'Cara urus KTP', query: 'mengurus KTP-el' },
  { label: 'Biaya KTP', query: 'biaya pembuatan KTP' },
  { label: 'Lapor masalah', query: 'melaporkan pelayanan tidak sesuai' },
];

/* ---------- component ---------- */
export default function TanyaPage() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Halo! 👋 Saya asisten virtual Pemdi Aceh Tengah. Tanyakan apa pun tentang layanan publik, SPBE, atau portal ini.' },
  ]);
  const [input, setInput] = useState('');
  const [mengetik, setMengetik] = useState(false);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mengetik]);

  function handleSend(q) {
    const query = (q || input).trim();
    if (!query) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    cariJawaban(query);
  }

  function cariJawaban(query) {
    setMengetik(true);
    const qt = tokenise(query);

    // score all
    const scored = corpus
      .map(p => ({ ...p, score: matchScore(p.tanya, qt) }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];

    // simulate typing delay
    setTimeout(() => {
      setMengetik(false);
      if (best && best.score >= 0.2) {
        setMessages(prev => [...prev, { role: 'bot', text: best.jawab, kategori: best.kategori }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `Maaf, saya belum menemukan jawaban untuk pertanyaan itu. 😅 Coba cek <Link href="/faq">halaman FAQ</Link> atau tanya dengan kata kunci berbeda.`,
          isHtml: true,
        }]);
      }
    }, 600 + Math.random() * 600);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      <Head>
        <title>Tanya Jawab — Pemdi Aceh Tengah</title>
        <meta name="description" content="Asisten virtual portal Pemdi Aceh Tengah. Tanya jawab tentang layanan publik, SPBE, perangkat daerah, dan informasi lainnya." />
      </Head>

      {/* ====== HERO ====== */}
      <section className="chat-hero">
        <div className="container">
          <Link href="/" className="back-link">← Beranda</Link>
          <div style={{ marginTop: '1rem' }}>
            <h1>Tanya Jawab</h1>
            <p>Asisten virtual Pemdi Aceh Tengah — tanyakan apa saja tentang layanan dan portal ini</p>
          </div>
        </div>
      </section>

      {/* ====== CHAT BOX ====== */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="chat-container">
            <div className="chat-messages" role="log" aria-label="Percakapan chatbot" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
                  {m.role === 'bot' && <span className="chat-avatar">🤖</span>}
                  <div className="chat-text">
                    {m.isHtml ? (
                      <span dangerouslySetInnerHTML={{ __html: m.text }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: m.text }} />
                    )}
                    {m.kategori && <span className="chat-tag">📌 {m.kategori}</span>}
                  </div>
                  {m.role === 'user' && <span className="chat-avatar user-avatar">👤</span>}
                </div>
              ))}
              {mengetik && (
                <div className="chat-bubble chat-bot">
                  <span className="chat-avatar">🤖</span>
                  <div className="chat-text">
                    <span className="chat-typing">Mengetik<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span></span>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {/* Quick replies */}
            <div className="chat-quick">
              {quickList.map((q, i) => (
                <button key={i} className="quick-btn" onClick={() => handleSend(q.query)}>
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="chat-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Ketik pertanyaan Anda..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                aria-label="Ketik pertanyaan untuk chatbot"
              />
              <button
                className="chat-send"
                onClick={() => handleSend()}
                disabled={!input.trim() || mengetik}
                aria-label="Kirim pertanyaan"
              >
                Kirim
              </button>
            </div>
          </div>

          <div className="chat-footer">
            <p>
              Belum menemukan jawaban? Kunjungi <Link href="/faq">FAQ Lengkap</Link> atau laporkan melalui <Link href="/skm">Survei & Laporan</Link>
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .chat-hero {
          background: linear-gradient(135deg, #004098 0%, #002060 100%);
          color: white;
          padding: 2.5rem 0 2rem;
        }
        .chat-hero .back-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 0.875rem; }
        .chat-hero .back-link:hover { color: white; }
        .chat-hero h1 { color: white; font-size: 2rem; margin-bottom: 0.5rem; }
        .chat-hero p { color: rgba(255,255,255,0.85) !important; font-size: 1rem; }

        .chat-container {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
          border: 1px solid var(--gray-200);
        }
        .chat-messages {
          padding: 1.25rem;
          max-height: 480px;
          min-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #f9fafb;
        }
        .chat-bubble {
          display: flex;
          gap: 0.625rem;
          max-width: 84%;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .chat-user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-bot { align-self: flex-start; }
        .chat-avatar {
          font-size: 1.5rem;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-100);
          border-radius: 50%;
        }
        .user-avatar { background: #dbeafe; }
        .chat-text {
          background: white;
          padding: 0.625rem 0.875rem;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.6;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
          color: #1a1a1a;
        }
        .chat-user .chat-text {
          background: #1d70b8;
          color: white;
        }
        .chat-text :global(a) { color: inherit; text-decoration: underline; }
        .chat-user .chat-text :global(a) { color: #bfdbfe; }
        .chat-tag {
          display: inline-block;
          font-size: 0.625rem;
          background: var(--gray-100);
          padding: 0.125rem 0.5rem;
          border-radius: 100px;
          margin-top: 0.375rem;
          color: var(--gray-600);
        }
        .chat-typing { color: var(--muted); font-style: italic; }
        .dot-1 { animation: dot 1.4s infinite; }
        .dot-2 { animation: dot 1.4s infinite 0.2s; }
        .dot-3 { animation: dot 1.4s infinite 0.4s; }
        @keyframes dot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }

        .chat-quick {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          flex-wrap: wrap;
          border-top: 1px solid var(--gray-200);
          background: white;
        }
        .quick-btn {
          padding: 0.375rem 0.75rem;
          border-radius: 100px;
          border: 1px solid var(--gray-300);
          background: var(--gray-50);
          font-size: 0.75rem;
          cursor: pointer;
          font-family: var(--font-body);
          color: var(--gray-700);
          transition: all 0.15s ease;
        }
        .quick-btn:hover { background: var(--primary-light); border-color: var(--primary); color: var(--primary); }

        .chat-input-wrap {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1rem 1rem;
          border-top: 1px solid var(--gray-200);
          background: white;
        }
        .chat-input {
          flex: 1;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          font-family: var(--font-body);
          font-size: 0.875rem;
          outline: none;
        }
        .chat-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        .chat-send {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          border: none;
          background: var(--primary);
          color: white;
          font-weight: 600;
          font-size: 0.8125rem;
          cursor: pointer;
          font-family: var(--font-body);
          transition: background 0.15s ease;
        }
        .chat-send:hover:not(:disabled) { background: #003078; }
        .chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

        .chat-footer {
          text-align: center;
          padding: 1rem;
          font-size: 0.75rem;
          color: var(--muted);
        }
      `}</style>
    </>
  );
}
