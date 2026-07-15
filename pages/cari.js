import { useState, useMemo, useRef, useEffect } from 'react';
import React from 'react';
import Head from 'next/head';
import Fuse from 'fuse.js';
import buildSearchIndex from '@/lib/search-index';

const fuseOptions = {
  keys: [
    { name: 'label', weight: 3 },
    { name: 'sublabel', weight: 1.5 },
    { name: 'keywords', weight: 2 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 1,
  includeScore: true,
  tokenMatch: 'any',
  useTokenSearch: true,
};

const TYPE_ICON = {
  OPD: '🏛️',
  Layanan: '📋',
  FAQ: '❓',
  Survei: '📝',
  'Indikator Pemdi': '📊',
};

const TYPE_CLASS = {
  OPD: 'badge-blue',
  Layanan: 'badge-purple',
  FAQ: 'badge-green',
  Survei: 'badge-orange',
  'Indikator Pemdi': 'badge-cyan',
};

export default function Cari({ items }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const fuseRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fuseRef.current = new Fuse(items, fuseOptions);
    inputRef.current?.focus();

    // Handle ?q=… from URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setQuery(q);
  }, [items]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const fused = fuseRef.current.search(query.trim());
    setResults(fused.slice(0, 50));
    setSearched(true);
  }, [query]);

  const hasil = results.map(r => r.item);
  const statistik = items.length;

  return (
    <>
      <Head>
        <title>{query ? `Pencarian: ${query}` : 'Pencarian'} — Pemdi Aceh Tengah</title>
        <meta name="description" content="Pencarian global portal Pemdi Aceh Tengah — cari OPD, layanan publik, FAQ, dan indikator Pemdi." />
      </Head>

      <section style={{ padding: '3rem 0 1.5rem', background: 'var(--hero-grad)', color: '#fff' }}>
        <div className="container">
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem' }}>🔍 Pencarian</h1>
          <p style={{ opacity: 0.85, marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
            Cari OPD, layanan publik, FAQ, dan indikator Pemdi — {statistik} item tersedia
          </p>
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              type="search"
              placeholder="Cari… (contoh: pendidikan, KTP, SKM)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-label="Cari OPD, layanan, FAQ, dan indikator Pemdi"
              style={{
                width: '100%',
                padding: '0.875rem 1rem 0.875rem 3rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1.1rem',
                color: '#1a1a2e',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}
            />
            <span style={{
              position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '1.25rem', opacity: 0.5, pointerEvents: 'none',
            }}>🔍</span>
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '2rem 0' }}>
        {!searched && !query && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ fontSize: '1.125rem' }}>Ketik kata kunci untuk memulai pencarian</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Cari berdasarkan nama OPD, layanan, pertanyaan FAQ, atau indikator Pemdi
            </p>
          </div>
        )}

        {searched && hasil.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>😕</div>
            <p style={{ fontSize: '1.125rem' }}>Tidak ditemukan untuk "{query}"</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Coba kata kunci lain</p>
          </div>
        )}

        {hasil.length > 0 && (
          <>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              {hasil.length} hasil untuk "{query}"
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hasil.map((item, i) => (
                <a
                  key={item.id || i}
                  href={item.url}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '1rem', borderRadius: '8px', background: '#fff',
                    border: '1px solid #e5e7eb', textDecoration: 'none',
                    color: 'inherit', transition: 'box-shadow 0.15s, transform 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0, width: '2rem', textAlign: 'center' }}>
                    {TYPE_ICON[item.type] || '📄'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.125rem' }}>
                      {highlight(item.label, query)}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.sublabel}
                    </div>
                  </div>
                  <span className={`badge ${TYPE_CLASS[item.type] || 'badge-gray'} badge-sm`} style={{ flexShrink: 0 }}>
                    {item.type}
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        section.container :global(a:hover) {
          border-color: #1d70b8;
        }
      `}</style>
    </>
  );
}

/** Simple highlight — wraps matching text in <mark>, returns React nodes */
function highlight(text = '', query) {
  if (!query.trim()) return text;
  const words = query.trim().split(/\s+/).filter(Boolean);
  let segments = [{ text, match: false }];
  for (const word of words) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    const newSegments = [];
    for (const seg of segments) {
      if (seg.match) {
        newSegments.push(seg);
        continue;
      }
      const parts = seg.text.split(re);
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;
        newSegments.push({ text: parts[i], match: i % 2 === 1 });
      }
    }
    segments = newSegments;
  }
  return segments.map((s, i) =>
    s.match
      ? React.createElement('mark', {
          key: i,
          style: { background: '#fef08a', borderRadius: 2, padding: '0 2px', color: '#000' },
        }, s.text)
      : s.text
  );
}

export async function getStaticProps() {
  const items = buildSearchIndex();
  return { props: { items } };
}
