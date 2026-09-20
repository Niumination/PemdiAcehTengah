/**
 * HeroPublik — Hero Mode A (Phase 2): satu pertanyaan, satu kotak cari besar (⌘K),
 * 5 kata kunci populer. Tanpa metrik birokrasi (indeks, revisi bukti).
 */
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { KATA_KUNCI_POPULER } from '@/lib/sektorLayanan';

export default function HeroPublik({ totalLayanan = 25, totalOpd = 52 }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const go = (e) => {
    e.preventDefault();
    router.push(q.trim() ? `/cari?q=${encodeURIComponent(q.trim())}` : '/cari');
  };
  return (
    <section className="hero hero-publik" id="hero" aria-labelledby="hero-title">
      <span className="pill">🏛️ Pemerintah Kabupaten Aceh Tengah</span>
      <h1 id="hero-title" className="gold-head">Apa yang ingin Anda selesaikan hari ini?</h1>
      <p>
        Cari {totalLayanan} layanan publik dari {totalOpd} perangkat daerah — syarat, biaya, dan lama proses dalam satu tempat.
      </p>

      <form className="hero-search-box hero-search-lg" role="search" onSubmit={go}>
        <span aria-hidden="true" style={{ fontSize: '1.3rem' }}>🔍</span>
        <label htmlFor="hero-q" className="sr-only">Cari layanan publik</label>
        <input
          id="hero-q"
          type="search"
          className="hero-search-input"
          placeholder="Contoh: KTP hilang, izin usaha, bayar PBB…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
        <kbd className="hero-kbd" aria-hidden="true">⌘K</kbd>
        <button type="submit" className="btn btn-primary">Cari</button>
      </form>

      <div className="hero-keywords">
        <span>Populer:</span>
        {KATA_KUNCI_POPULER.map((k) => (
          <Link key={k.label} href={`/cari?q=${encodeURIComponent(k.query)}`} className="hero-chip">
            {k.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
