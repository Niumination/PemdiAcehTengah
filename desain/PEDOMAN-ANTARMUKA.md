# Pedoman Antarmuka Ruang Kendali Pemdi (Patch 16, 25 Sep 2026)

Daftar periksa mekanis untuk setiap perubahan UI. Diadaptasi dan diterjemahkan dari **Vercel Web Interface Guidelines** (`vercel-labs/web-interface-guidelines`, versi 24 Sep 2026), dipangkas ke stack repo ini (Next.js Pages Router, CSS murni, tanpa Tailwind) dan ditambah ketentuan lokal (navy+emas, Kerawang Gayo, Bahasa Indonesia, tanpa pustaka UI berat). Disalin lokal dengan sengaja — tidak memuat aturan dari URL saat runtime.

Cara pakai: tinjau berkas yang diubah terhadap semua butir; laporkan temuan dalam format `berkas:baris — masalah`. Butir bertanda **[cek-ui]** sudah dijaga otomatis oleh `scripts/cek-ui.mjs`; butir **[audit-ui]** diukur `scripts/audit-ui.mjs` di peramban.

## Aksesibilitas
- Tombol hanya-ikon wajib `aria-label`; ikon dekoratif `aria-hidden="true"`.
- Kontrol form wajib `<label htmlFor>` atau `aria-label`; label bisa diklik.
- `<button>` untuk aksi, `<Link>`/`<a>` untuk navigasi — bukan `<div onClick>`; `<tr>`/`<div>` yang bisa diklik wajib `tabIndex={0}` + `onKeyDown` (Enter/Spasi) + `role`.
- Pembaruan asinkron (toast, validasi, "Disalin") pakai `aria-live="polite"`.
- Heading berurutan `h1`→`h6`; satu `h1` per halaman; sediakan *skip link* ke `#konten`; `scroll-margin-top` pada heading yang jadi target anchor (header lengket 64px).
- Semantik dulu (`table`, `button`, `nav`, `dialog`), ARIA kemudian.

## Fokus & keyboard
- Setiap elemen interaktif punya fokus terlihat: `:focus-visible { outline: 2px solid var(--rk-emas); outline-offset: 2px }`.
- Dilarang `outline: none` tanpa pengganti fokus yang setara.
- Header lengket, drawer, palet, menu radial tidak boleh menutupi elemen yang sedang fokus.
- Overlay (drawer/palet/menu) memerangkap fokus, Esc menutup, fokus kembali ke pemicu.

## Form
- `<input>` wajib `name`, `type` yang benar (`search`, `email`, `number`), `inputMode`, `autoComplete` (`off` untuk bukan-autentikasi), `spellCheck={false}` untuk kode/ID.
- Jangan blokir tempel (`onPaste` + `preventDefault`).
- Galat ditampilkan inline di samping kontrol; fokus ke galat pertama saat kirim.
- Placeholder diakhiri `…` dan memberi contoh pola (`Cari kode butir, mis. I19-L1-01…`).
- Tombol kirim tetap aktif sampai permintaan mulai; tampilkan status "Menyimpan…".
- Peringatkan sebelum meninggalkan halaman bila ada perubahan belum disimpan (CMS).

## Animasi & gerak
- Hormati `prefers-reduced-motion` (marquee berhenti, menu radial tanpa transisi, akordeon langsung).
- Hanya animasikan `transform` dan `opacity`; **[cek-ui 7]** dilarang `transition: all` — sebutkan propertinya.
- Gerak hanya di 1–2 momen kunci (buka menu, buka drawer). Tanpa fade-in massal saat halaman dimuat.
- Marquee (satu-satunya gerak otomatis >5 detik) wajib bisa dijeda (hover/fokus/tombol) dan berhenti pada reduced-motion.

## Tipografi & angka
- Elipsis `…` bukan `...`; kutip lengkung `“ ”`.
- Angka dalam kolom/perbandingan: `font-variant-numeric: tabular-nums`; desimal koma (`1,24`) via `Intl.NumberFormat('id-ID')`, bukan string tetap.
- Spasi tak putus untuk satuan dan nama: `2,50&nbsp;target`, `Kab.&nbsp;Aceh Tengah`.
- Judul panel memakai `text-wrap: balance`; badan `text-wrap: pretty`.
- Ukuran teks ≥ 11px **[cek-ui 2]**; kontras teks ≥ 4,5:1 terhadap latarnya (token `tokens.css`).

## Konten panjang & keadaan kosong
- Kontainer teks tahan konten panjang: `min-width: 0` pada anak flex, `overflow-wrap: anywhere` untuk kode butir/nama OPD, `line-clamp` untuk ringkasan.
- Selalu rancang keadaan kosong (tidak ada butir / hasil cari nol / OPD tanpa PJ) — bukan panel kosong tanpa teks.
- Uji dengan konten pendek, rata-rata, dan sangat panjang (nama OPD terpanjang: 60+ karakter).

## Gambar & media
- **[cek-ui 9]** `<img>` wajib `width` + `height`; di bawah lipatan `loading="lazy"`.
- Ikon SVG inline lewat `<Ikon>`; tidak ada emoji sebagai ikon **[cek-ui 1]**.

## Navigasi & state
- URL mencerminkan state yang layak dibagikan: filter, tab, OPD terpilih, butir terbuka (`?tab=`, `?opd=`, `?butir=`). Tautan harus bisa dikirim ke PJ OPD lewat WhatsApp dan membuka keadaan yang sama.
- Navigasi memakai `<Link>` (Ctrl/Cmd+klik & klik tengah berfungsi).
- Aksi destruktif (hapus catatan di CMS) butuh konfirmasi atau jendela urungkan.

## Sentuh & ponsel
- **[audit-ui]** target sentuh ≥ 44×44px di ≤ 860px (desktop ≥ 32px); jarak antar target ≥ 8px.
- `touch-action: manipulation` pada tombol/tautan; `-webkit-tap-highlight-color` ditetapkan sadar.
- `overscroll-behavior: contain` di drawer, palet, menu, dialog pratinjau.
- Gestur (geser, tekan lama) selalu punya alternatif ketuk & keyboard.
- `autoFocus` hanya di desktop dan hanya untuk satu input utama (palet cari); tidak di ponsel.
- Aksi utama di ponsel berada di sepertiga bawah layar (zona ibu jari); pemicu menu terlihat ≥ 44px dengan ikon.
- **[cek-ui 8]** viewport tidak boleh melarang zum (`user-scalable=no`, `maximum-scale=1`).

## Tata letak & area aman
- **[audit-ui]** tidak ada overflow horizontal: `scrollWidth ≤ clientWidth` di 390/1024/1440. Tabel lebar berada dalam `.rk-table-wrap` **atau** berubah ke mode kartu/kolom-prioritas di ponsel.
- Tepi penuh memakai `env(safe-area-inset-*)` (header, pemicu menu, bilah bawah).
- Grid/flex untuk tata letak, bukan pengukuran JS; tanpa `getBoundingClientRect` di jalur render.
- Skala spasi terbatas: 4 · 8 · 12 · 16 · 24 · 32 · 48 px (token `--sp-*`); nilai di luar skala harus beralasan.
- **[audit-ui]** anak header tidak saling tumpang tindih di semua viewport.

## Tema
- `color-scheme` pada `<html>` mengikuti tema; `<meta name="theme-color">` sama dengan warna latar tema aktif.
- `<select>` asli diberi `background-color` dan `color` eksplisit.

## Lokal & bahasa
- Tanggal via `Intl.DateTimeFormat('id-ID')`; angka via `Intl.NumberFormat('id-ID')`.
- Kode butir (`I19-L1-01`), nama sistem (`SIAP Digital`, `eval.spbe.go.id`) dibungkus `translate="no"`.
- Salinan: kalimat aktif, orang kedua, spesifik ("Unggah SK Tim Koordinasi", bukan "Lanjut"); pesan galat menyertakan langkah perbaikan; angka ditulis numerik ("8 butir").
- Istilah baku PermenPANRB 8/2026 tidak diparafrase; satu istilah untuk satu konsep (butir ≠ bukti ≠ indikator ≠ aspek).

## Hidrasi
- `<input value>` wajib `onChange` (atau `defaultValue`); tanggal/waktu yang berbeda server-klien dirender setelah `useEffect`; `suppressHydrationWarning` hanya bila benar-benar perlu.

## Hover & umpan balik
- Tombol/tautan punya hover dan active yang lebih kontras dari keadaan diam; `cursor: pointer` pada semua yang bisa diklik.
- Umpan balik tindakan ≤ 100 ms (mis. "Disalin ✓" pada tombol Salin).

## Anti-pola yang langsung ditolak
`user-scalable=no` · `onPaste preventDefault` · `transition: all` · `outline: none` tanpa pengganti · `<div onClick>` untuk navigasi · `<img>` tanpa dimensi · `.map()` >200 baris tanpa virtualisasi/`content-visibility: auto` · input tanpa label · tombol ikon tanpa `aria-label` · format tanggal/angka tetap · `autoFocus` tanpa alasan · gestur tanpa alternatif · emoji sebagai ikon · gradien ungu/indigo, teks gradien pada angka, kartu seragam rounded+bayangan, ikon-dalam-kotak (lihat `AGENTS.md` §anti-slop).

## Format laporan tinjauan
```
## components/rk/Panel.js
components/rk/Panel.js:41 — tombol ikon tanpa aria-label
components/rk/Panel.js:88 — tabel tanpa mode ponsel (overflow 453px @390)
## pages/cari.js
✓ lolos
```
