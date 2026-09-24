/**
 * pages/404.js — Halaman tidak ditemukan bergaya Ruang Kendali (Patch 12, Tahap 3c).
 * Menampilkan jalur yang diminta, tebakan tujuan (cocokkan potongan URL dengan rute utama), dan pintasan.
 */
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Ikon from '@/components/ui/Ikon';

const TUJUAN = [
  { href: '/dashboard', label: 'Dashboard', ikon: 'kompas', kata: ['dashboard', 'beranda', 'home', 'index', 'ringkasan', 'pemdi-publik'] },
  { href: '/indikator', label: 'Indikator', ikon: 'daftar', kata: ['indikator', 'aspek', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7'] },
  { href: '/antrean', label: 'Antrean butir', ikon: 'antrean', kata: ['antrean', 'butir', 'bukti', 'requirement', 'kebutuhan'] },
  { href: '/pemdi', label: 'Simulasi penilaian mandiri', ikon: 'aspek', kata: ['pemdi', 'penilaian', 'mandiri', 'simulasi', 'skor'] },
  { href: '/modul-indikator', label: 'Modul indikator', ikon: 'modul', kata: ['modul', 'kriteria', 'level'] },
  { href: '/opd', label: 'Perangkat daerah', ikon: 'gedung', kata: ['opd', 'dinas', 'badan', 'kecamatan', 'perangkat'] },
  { href: '/probis', label: 'Proses bisnis', ikon: 'probis', kata: ['probis', 'proses', 'ppb', 'bisnis'] },
  { href: '/spbe', label: 'SPBE 2025', ikon: 'grafik', kata: ['spbe', 'domain'] },
  { href: '/glosarium', label: 'Glosarium', ikon: 'buku', kata: ['glosarium', 'istilah', 'kamus'] },
  { href: '/admin', label: 'CMS Ruang Kendali', ikon: 'roda', kata: ['admin', 'cms', 'login', 'masuk'] },
];

export default function Custom404() {
  const router = useRouter();
  const [jalur, setJalur] = useState('');
  useEffect(() => { setJalur(router.asPath || ''); }, [router.asPath]);
  const potongan = jalur.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const tebakan = TUJUAN.filter((t) => t.kata.some((k) => potongan.includes(k))).slice(0, 3);
  const pintasan = TUJUAN.filter((t) => !tebakan.includes(t)).slice(0, 6);

  return (
    <>
      <Head>
        <title>404 — Halaman tidak ditemukan | Dashboard Pemdi Aceh Tengah</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="rk-grid">
        <section className="rk-panel rk-c12 rk-404">
          <div className="kode" aria-hidden="true">404</div>
          <div className="isi">
            <h1>Halaman tidak ditemukan</h1>
            <p>Rute {jalur ? <code>{jalur}</code> : 'yang diminta'} tidak ada di dashboard ini — mungkin sudah dipindah saat reposisi ke persona internal (persona publik diarsipkan September 2026), atau alamatnya salah ketik.</p>
            {tebakan.length ? (
              <div className="tebak">
                <div className="lbl">Mungkin yang dimaksud</div>
                <div className="rk-chips">
                  {tebakan.map((t) => <Link key={t.href} href={t.href} className="rk-chip utama"><Ikon nama={t.ikon} size={14} /> {t.label}</Link>)}
                </div>
              </div>
            ) : null}
            <div className="tebak">
              <div className="lbl">Pintasan</div>
              <div className="rk-chips">
                {pintasan.map((t) => <Link key={t.href} href={t.href} className="rk-chip"><Ikon nama={t.ikon} size={14} /> {t.label}</Link>)}
                <Link href="/cari" className="rk-chip"><Ikon nama="cari" size={14} /> Cari (Ctrl+K)</Link>
              </div>
            </div>
            <p className="rk-catatan">Menu navigasi ada di tombol tepi kiri layar; palet perintah dengan Ctrl+K.</p>
          </div>
        </section>
      </div>
    </>
  );
}
