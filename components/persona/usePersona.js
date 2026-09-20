/**
 * usePersona — persona aktif dari URL (?view=) dengan fallback localStorage.
 * SSG merender default `publik`; setelah hydrate, query & preferensi tersimpan
 * dibaca. `hydrated` dipakai halaman untuk menahan konten sampai persona pasti
 * (mencegah kedip publik→asesor dan layout shift).
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PERSONA_DEFAULT, PERSONA_KEY, PERSONA_PUBLIK, parsePersona, personaHref } from '@/lib/persona';

export function usePersona() {
  const router = useRouter();
  const fromQuery = parsePersona(router.query?.view);
  const [stored, setStored] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let s = null;
    try { s = parsePersona(window.localStorage.getItem(PERSONA_KEY)); } catch { /* noop */ }
    setStored(s);
    setHydrated(true);
  }, []);

  // Beranda tanpa ?view= tetapi preferensi tersimpan = asesor → sinkronkan URL (shallow, tanpa reload)
  useEffect(() => {
    if (!hydrated || !router.isReady || router.pathname !== '/') return;
    if (!fromQuery && stored && stored !== PERSONA_PUBLIK) {
      router.replace(personaHref(stored), undefined, { shallow: true, scroll: false });
    }
  }, [hydrated, router, fromQuery, stored]);

  const persona = fromQuery || (hydrated ? stored : null) || PERSONA_DEFAULT;
  return { persona, hydrated: hydrated && router.isReady, fromQuery };
}
