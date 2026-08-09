import { useState, useEffect, useRef } from 'react';

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * useCountUp — angka count-up yang ANTI-GAGAL.
 *
 * Prinsip:
 *  1. SSR/hydration pertama menampilkan TARGET (bukan 0) → aman untuk SEO,
 *     aksesibilitas, dan pengguna tanpa JS.
 *  2. Tiga jalur menuju nilai akhir:
 *     a. prefers-reduced-motion  → langsung target (tanpa animasi).
 *     b. IntersectionObserver    → animasi 0 → target saat masuk viewport.
 *     c. Fallback timeout 2.5s   → paksa target (IO gagal/blocked/hidden tab).
 *  3. Tidak ada kondisi di mana angka 0 tampil permanen.
 *
 * @param {number} target  nilai akhir
 * @param {Object} opts    { duration(ms), decimals }
 * @returns {[ref, displayValue]}
 */
export default function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  // State awal = target (render pertama & hydration match dengan SSR)
  const [value, setValue] = useState(target);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  // 1) Observasi viewport + jalur cepat (reduced / no-IO) + fallback timeout
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      setPlaying(false);
      return;
    }

    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setValue(target);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    // Fallback: apa pun yang terjadi, nilai akhir pasti muncul ≤ 2.5 detik
    const timer = setTimeout(() => {
      setInView(true);
      setValue(target);
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [target]);

  // 2) Animasi count-up ketika masuk viewport
  useEffect(() => {
    if (!inView || playing) return;
    setPlaying(true);

    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return;
    }

    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setValue(target * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, playing, target, duration]);

  const display = Number.isFinite(value)
    ? value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : target.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return [ref, display];
}