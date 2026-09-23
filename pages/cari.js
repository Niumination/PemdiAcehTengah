import { useState, useMemo, useRef, useEffect } from 'react';
import Ikon from '@/components/ui/Ikon';
import React from 'react';
// Patch 10 (Tahap 3a): tampilan gaya Ruang Kendali (rk-cari, rk-hasil); mesin pencari Fuse tidak berubah.
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
  OPD: 'gedung',
  'Aspek Pemdi': 'kompas',
  'Indikator Pemdi': 'daftar',
  Glosarium: 'modul',
  'Dokumen Kunci': 'dokumen',
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

  const perTipe = useMemo(() => {
    const m = {};
    hasil.forEach((h) => { m[h.type] = (m[h.type] || 0) + 1; });
    return m;
  }, [hasil]);
  const [tipe, setTipe] = useState('');
  const tampil = tipe ? hasil.filter((h) => h.type === tipe) : hasil;

  return (
    <>
      <Head>
        <title>{query ? `Pencarian: ${query}` : 'Pencarian'} — Dashboard Pemerintah Digital Aceh Tengah</title>
        <meta name="description" content="Pencarian dashboard Pemdi Aceh Tengah — cari indikator, OPD, glosarium, dan dokumen kunci." />
      </Head>
      <div className="rk-grid">
        <section className="rk-panel rk-cari">
          <h2>Pencarian <span className="rk-act faint">{statistik} entri terindeks · OPD, aspek, indikator, glosarium, dokumen kunci · Ctrl K untuk palet perintah</span></h2>
          <label className="rk-cari-box">
            <Ikon nama="cari" size={18} />
            <input
              ref={inputRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik kata kunci: Diskominfo, keamanan, SIAP Digital, I15…" aria-label="Kata kunci pencarian" autoComplete="off"
            />
            {query ? <button type="button" className="rk-btn kecil" onClick={() => setQuery('')} aria-label="Hapus"><Ikon nama="tutup" size={14} /></button> : null}
          </label>
          {hasil.length > 0 ? (
            <div className="rk-filter" role="group" aria-label="Saring jenis">
              <button type="button" className="rk-chip" aria-pressed={!tipe} onClick={() => setTipe('')}>Semua ({hasil.length})</button>
              {Object.entries(perTipe).map(([t, n]) => <button key={t} type="button" className="rk-chip" aria-pressed={tipe === t} onClick={() => setTipe(tipe === t ? '' : t)}><Ikon nama={TYPE_ICON[t] || 'dokumen'} size={13} /> {t} ({n})</button>)}
            </div>
          ) : null}
        </section>

        {searched && hasil.length === 0 ? (
          <section className="rk-panel"><p className="muted" style={{ margin: 0 }}>Tidak ada hasil untuk “{query}”. Coba kata yang lebih umum, singkatan OPD, atau kode indikator (I1–I20).</p></section>
        ) : null}

        {!searched ? (
          <section className="rk-panel">
            <h2>Contoh pencarian</h2>
            <div className="rk-chips">
              {['Diskominfo', 'keamanan siber', 'arsitektur SPBE', 'I15', 'kepuasan pengguna', 'Bappeda', 'PDP'].map((k) => <button key={k} type="button" className="rk-chip" onClick={() => setQuery(k)}>{k}</button>)}
            </div>
          </section>
        ) : null}

        {tampil.length > 0 ? (
          <section className="rk-panel">
            <h2>{tampil.length} hasil untuk “{query}”</h2>
            <ol className="rk-hasil">
              {tampil.map((item, i) => (
                <li key={item.id || i}>
                  <a href={item.url}>
                    <span className="ic"><Ikon nama={TYPE_ICON[item.type] || 'dokumen'} size={16} /></span>
                    <span className="tx"><b>{highlight(item.label, query)}</b><small>{item.sublabel}</small></span>
                    <span className="rk-tag">{item.type}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
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
          className: 'rk-mark',
        }, s.text)
      : s.text
  );
}

export async function getStaticProps() {
  const items = buildSearchIndex();
  return { props: { items } };
}
