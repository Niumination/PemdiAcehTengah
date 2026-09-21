/**
 * usePersona — persona aktif dari URL (?view=) dengan fallback localStorage.
 * SSG merender default; setelah hydrate, query & preferensi tersimpan dibaca.
 * `hydrated` dipakai halaman untuk menahan konten sampai persona pasti.
 *
 * Mode internal (NEXT_PUBLIC_PERSONA_PUBLIK != "on", lib/modeSitus): selalu `asesor`;
 * query & localStorage diabaikan. Hook tetap dipanggil dalam urutan tetap (rules-of-hooks).
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PERSONA_ASESOR, PERSONA_DEFAULT, PERSONA_KEY, PERSONA_PUBLIK, parsePersona, personaHref } from '@/lib/persona';
import { PUBLIK_AKTIF } from '@/lib/modeSitus';

export function usePersona() {
  const router = useRouter();
  const fromQuery = PUBLIK_AKTIF ? parsePersona(router.query?.view) : null;
  const [stored, setStored] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let s = null;
    if (PUBLIK_AKTIF) {
      try { s = parsePersona(window.localStorage.getItem(PERSONA_KEY)); } catch { /* noop */ }
    }
    setStored(s);
    setHydrated(true);
  }, []);

  // Beranda tanpa ?view= tetapi preferensi tersimpan = asesor → sinkronkan URL (shallow, tanpa reload)
  useEffect(() => {
    if (!PUBLIK_AKTIF || !hydrated || !router.isReady || router.pathname !== '/') return;
    if (!fromQuery && stored && stored !== PERSONA_PUBLIK) {
      router.replace(personaHref(stored), undefined, { shallow: true, scroll: false });
    }
  }, [hydrated, router, fromQuery, stored]);

  const persona = PUBLIK_AKTIF
    ? fromQuery || (hydrated ? stored : null) || PERSONA_DEFAULT
    : PERSONA_ASESOR;
  return { persona, hydrated: hydrated && router.isReady, fromQuery };
}
