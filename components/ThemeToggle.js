import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage unavailable */
  }
}

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  // Default SELALU light — palette Navy/Beige/Gold adalah tema resmi
  return 'light';
}

export default function ThemeToggle({ className, style: overrideStyle }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getPreferredTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    persistTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Tidak perlu mengikuti prefers-color-scheme OS — tema terang resmi default.
    // Pengguna bisa toggle manual; pilihan tersimpan di localStorage.
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      persistTheme(next);
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Beralih tema"
        className={`theme-tg ${className || ''}`.trim()}
        style={{ visibility: 'hidden', ...overrideStyle }}
      />
    );
  }

  const label = theme === 'dark' ? 'Beralih ke tema terang' : 'Beralih ke tema gelap';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`theme-tg ${className || ''}`.trim()}
      style={overrideStyle}
    >
      <span className="sun" aria-hidden="true">☀️</span>
      <span className="moon" aria-hidden="true">🌙</span>
    </button>
  );
}
