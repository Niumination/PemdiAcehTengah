import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const STARS = [1, 2, 3, 4, 5];

export default function RatingWidget() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const widgetRef = useRef(null);
  const router = useRouter();

  // Tutup saat klik di luar
  useEffect(() => {
    function handleClick(e) {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating < 1) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          halaman: router.asPath,
          komentar: komentar.trim(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSent(true);
      } else {
        setError(json.error || 'Gagal menyimpan');
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setOpen(false);
    setRating(0);
    setHover(0);
    setKomentar('');
    setSent(false);
    setError('');
  }

  if (sent) {
    return (
      <div className="rating-widget" ref={widgetRef}>
        <button className="rating-trigger" onClick={handleReset} aria-label="Tutup">
          ✅
        </button>
        <div className="rating-panel">
          <p className="rating-thanks">Terima kasih atas penilaian Anda! 🙏</p>
          <button className="rating-close-btn" onClick={handleReset}>Tutup</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rating-widget ${open ? 'is-open' : ''}`} ref={widgetRef}>
      <button
        className="rating-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Beri rating halaman ini"
        title="Beri penilaian"
      >
        {open ? '✕' : '★'}
      </button>

      {open && (
        <form className="rating-panel" onSubmit={handleSubmit}>
          <p className="rating-title">Apakah halaman ini membantu?</p>

          <div className="rating-stars">
            {STARS.map((s) => (
              <button
                key={s}
                type="button"
                className={`star ${s <= (hover || rating) ? 'star-active' : ''}`}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${s} bintang`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="rating-input"
            placeholder="Ada saran? (opsional)"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value.slice(0, 1000))}
            rows={2}
          />

          {error && <p className="rating-error">{error}</p>}

          <button
            type="submit"
            className="rating-submit"
            disabled={rating < 1 || loading}
          >
            {loading ? 'Menyimpan...' : 'Kirim'}
          </button>
        </form>
      )}
    </div>
  );
}
