import { useEffect, useState } from 'react';

const STORAGE_KEY = 'diarista-theme';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStored() {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' ? v : null;
}

// Theme is one of 'light' | 'dark'. Honors stored preference, falls back to
// system preference on first launch. Persists explicit toggles.
export function useTheme() {
  const [theme, setTheme] = useState(() => readStored() ?? getSystemTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#000000' : '#F2F2F7',
    );
  }, [theme]);

  function toggle() {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }

  return { theme, toggle };
}
