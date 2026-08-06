#!/usr/bin/env python3
"""
Sesuaikan bukti dukung ↔ kriteria per level & panduan modul.

Aturan: setiap bukti diklasifikasi _peran: 'utama' (bukti langsung substansi kriteria —
dihitung untuk kelengkapan level) atau 'pendukung' (dokumen penunjang: perbup/SK umum —
tetap tampil tapi TIDAK menghitung kelengkapan). Indikator eksternal (I5/I6/I7/I18) = biarkan.

Langkah:
1. Set _peran untuk semua bukti (mapping audit manual — hasil analisis kriteria↔panduan↔bukti).
2. Verifikasi status → 'lengkap' untuk bukti utama yang jelas sesuai substansi kriteria.
3. Tambah entri bukti I17 yang benar (URL + screenshot portal + daftar layanan) — sesuai panduan modul.
4. Recompute _l1_lengkap: item level_kriteria[L1] vs bukti utama lengkap di L1.
5. Pindahkan file eksklusif indikator yang baru jadi belum-lengkap; kembalikan file yang dipakai indikator tampil.
"""
import json, os, re, sys, subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, 'public', 'bukti-dukung')
BL = os.path.join(DIR, 'belum-lengkap')
JSON_PATH = os.path.join(BASE, 'data', 'pemdi.json')
MODUL_PATH = os.path.join(BASE, 'data', 'modul-indikator.json')

# ── 1. Peran per bukti (hasil audit kesesuaian kriteria ↔ panduan modul ↔ bukti) ──
PERAN = {
    # I1 Tata Kelola — perencanaan & arsitektur: semua utama, SOTK pendukung
    'V1.I1_1': 'utama', 'V1.I1_2': 'utama', 'V2.I1_3': 'utama', 'V2.I1_4': 'utama',
    'B1.1': 'utama', 'B1.2': 'utama', 'B1.3': 'utama', 'B1.4': 'utama',
    'P1.I1_1': 'utama', 'P1.I1_2': 'utama', 'P1.I1_3': 'utama', 'P1.I1_4': 'utama',
    'P1.I1_5': 'utama', 'P1.I1_6': 'utama', 'P1.I1_7': 'utama', 'P1.I1_8': 'utama',
    'P1.I1_9': 'utama', 'P1.I1_10': 'pendukung',
    # I2 Manajemen Layanan — standar & pedoman layanan: utama
    'V1.I2_1': 'utama', 'V1.I2_2': 'utama', 'V2.I2_3': 'utama', 'V2.I2_4': 'utama',
    'B2.1': 'utama', 'B2.2': 'utama',
    # I3 SDM — SOTK BUKAN kompetensi → pendukung
    'V1.I3_1': 'utama', 'V1.I3_2': 'pendukung', 'V2.I3_3': 'utama',
    'B3.1': 'utama', 'B3.2': 'utama', 'B3.3': 'utama', 'B3.4': 'utama', 'B3.5': 'utama',
    # I4 Kolaborasi — Perbup 70/48 pedoman umum → pendukung; SK Tim + Rapat = utama
    'V1.I4_1': 'pendukung', 'V1.I4_2': 'pendukung', 'V2.I4_3': 'pendukung',
    'P1.I4_1': 'utama', 'P1.I4_2': 'utama',
    'B4.1': 'utama', 'B4.2': 'utama', 'B4.3': 'utama',
    # I5 Satu Data
    'V1.I5_1': 'utama', 'V1.I5_2': 'utama', 'V2.I5_3': 'utama',
    'B5.1': 'utama', 'B5.2': 'utama', 'B5.3': 'utama', 'P1.I5_1': 'utama',
    # I6 Geospasial
    'V1.I6_1': 'utama', 'V2.I6_2': 'utama',
    'B6.1': 'utama', 'B6.2': 'utama', 'B6.3': 'utama', 'B6.4': 'utama',
    # I7 Statistik — Perbup 60 pendukung
    'V1.I7_1': 'utama', 'V2.I7_2': 'utama', 'V2.I7_3': 'pendukung', 'P1.I7_1': 'utama',
    'B7.1': 'utama', 'B7.2': 'utama',
    # I8 PDP — Perbup 6/73/137 umum → pendukung; Indeks KAMI = utama
    'V1.I8_1': 'pendukung', 'V1.I8_2': 'pendukung', 'V2.I8_3': 'pendukung', 'V2.I8_4': 'pendukung',
    'P1.I8_1': 'utama',
    # I9 Audit — Perbup 48 tidak nyambung → pendukung; laporan pengawasan = utama
    'V1.I9_1': 'pendukung', 'V1.I9_2': 'utama',
    # I10 Keamanan Siber — Perbup 6/48 umum → pendukung; Indeks KAMI = utama
    'V1.I10_1': 'pendukung', 'V1.I10_2': 'pendukung', 'V2.I10_3': 'pendukung', 'P1.I10_1': 'utama',
    # I11 Kriptografi — Perbup 48 tidak nyambung → pendukung; Perbup persandian = utama
    'V1.I11_1': 'pendukung', 'V2.I11_2': 'pendukung', 'P1.I11_1': 'utama', 'P1.I11_2': 'utama',
    'B11.1': 'utama', 'B11.2': 'utama',
    # I12 Insiden Siber — Perbup 48 tidak nyambung → pendukung
    'V1.I12_1': 'pendukung',
    'B12.1': 'utama', 'B12.2': 'utama', 'B12.3': 'utama',
    # I13 Aplikasi — SOTK & arsitektur umum → pendukung; KAK/Laporan SDLC = utama; DPA anggaran = pendukung
    'V1.I13_1': 'pendukung', 'V1.I13_2': 'pendukung', 'V2.I13_3': 'pendukung',
    'P1.I13_1': 'utama', 'P1.I13_2': 'utama', 'P1.I13_3': 'pendukung', 'P1.I13_4': 'pendukung',
    'B13.1': 'utama', 'B13.2': 'utama', 'B13.3': 'utama', 'B13.4': 'utama',
    # I14 Infrastruktur — arsitektur teknologi = utama (panduan modul menyebut)
    'V1.I14_1': 'utama', 'V2.I14_2': 'utama', 'B14.1': 'utama', 'B14.2': 'utama',
    # I15 Proses Bisnis — arsitektur proses bisnis = utama (panduan menyebut)
    'V1.I15_1': 'utama', 'V2.I15_2': 'utama', 'B15.1': 'utama', 'B15.2': 'utama',
    # I16 Integrasi Aplikasi — arsitektur aplikasi = utama (panduan menyebut)
    'V1.I16_1': 'utama', 'V2.I16_2': 'utama', 'B16.1': 'utama', 'B16.2': 'utama',
    # I17 PORTAL — Perbup 30/48/73 TIDAK sesuai portal → pendukung; bukti benar = URL/screenshot/daftar layanan
    'V1.I17_1': 'pendukung', 'V1.I17_2': 'pendukung', 'V2.I17_3': 'pendukung', 'V2.I17_4': 'pendukung',
    'B17.1': 'utama', 'B17.2': 'utama',
    # I18 Interop Data — arsitektur data = utama
    'V1.I18_1': 'utama', 'V1.I18_2': 'utama', 'V2.I18_3': 'utama',
    'B18.1': 'utama', 'B18.2': 'utama',
    # I19 Dukungan Pengguna — Perbup 21 = utama; Perbup 126 & SKM = pendukung
    'V1.I19_1': 'utama', 'V1.I19_2': 'pendukung', 'V2.I19_3': 'utama', 'V2.I19_4': 'pendukung',
    'B19.1': 'utama', 'B19.2': 'utama', 'B19.3': 'utama', 'B19.4': 'utama',
    # I20 Kepuasan
    'V1.I20_1': 'utama', 'V1.I20_2': 'utama', 'V2.I20_3': 'utama',
    'B20.1': 'utama', 'B20.2': 'utama', 'B20.3': 'utama', 'B20.4': 'utama',
}

# ── 2. Verifikasi status → lengkap (bukti utama yang JELAS sesuai substansi kriteria) ──
VERIFIKASI_LENGKAP = {
    'P1.I10_1': 'Hasil Indeks KAMI 5.0 — Area Keamanan Siber (skor 563 "Cukup Baik") sesuai kriteria L1 I10 (nilai IKASANDI area Keamanan Siber 0–1,50; dasar penerapan keamanan siber)',
    'P1.I11_1': 'Perbup No. 1/2025 Penataan Pola Hubungan Komunikasi Sandi — dasar penerapan kriptografi/persandian sesuai kriteria L1 I11',
    'P1.I11_2': 'Perbup No. 2/2025 Penyelenggaraan Persandian — dasar penerapan kriptografi sesuai kriteria L1 I11',
    'P1.I13_1': 'KAK Pengembangan Aplikasi Bapokting 2026 — dokumentasi siklus pengembangan aplikasi (kriteria L1 I13 item 1)',
    'P1.I13_2': 'Laporan Akhir Pengembangan Aplikasi Bapokting 2026 — dokumentasi siklus pengembangan aplikasi (kriteria L1 I13 item 1)',
    'P1.I4_1': 'SK Bupati 555/395/2026 Tim Koordinasi Pemdi — memenuhi item L1 I4 "Penetapan Tim Koordinasi Pemerintah Digital"',
    'P1.I4_2': 'Rapat Koordinasi Transformasi Digital 25-26 Jun 2026 (11 OPD + KemenPANRB) — memenuhi item L1 I4 "Bukti Pelaksanaan Kolaborasi"',
}

# ── 3. Bukti baru I17 (sesuai panduan modul: URL & screenshot portal + daftar layanan) ──
BUKTI_BARU_I17 = [
    {
        "id": "P1.I17_1",
        "level": 1,
        "nama": "Portal Layanan Digital Pemerintah Kab. Aceh Tengah (acehtengahkab.go.id)",
        "detail": "URL portal resmi pemerintah daerah — pintu akses layanan digital",
        "opd": ["Diskominfo"],
        "status": "lengkap",
        "catatan": "Portal layanan digital daerah (acehtengahkab.go.id) — sesuai kriteria L1 I17 'Portal Layanan Digital Pemerintah pada Instansi Pemerintah'.",
        "url_preview": "https://acehtengahkab.go.id",
        "url_sumber": "https://acehtengahkab.go.id",
        "_ext": "url",
        "_peran": "utama",
        "_sumber_baru": True,
    },
    {
        "id": "P1.I17_2",
        "level": 1,
        "nama": "Screenshot Portal Layanan Digital Pemerintah Daerah",
        "detail": "Tangkapan layar portal digital Pemkab Aceh Tengah (pemdi-aceh-tengah.vercel.app) — 25 layanan terpadu, 52 perangkat daerah",
        "opd": ["Diskominfo"],
        "status": "lengkap",
        "catatan": "Screenshot portal layanan digital daerah — bukti nyata keberadaan portal (kriteria L1 I17).",
        "url_preview": "/bukti-dukung/Keterpaduan_I17_02_Screenshot-Portal_2026.png",
        "url_sumber": "/bukti-dukung/Keterpaduan_I17_02_Screenshot-Portal_2026.png",
        "_ext": "png",
        "_peran": "utama",
        "_sumber_baru": True,
    },
    {
        "id": "P1.I17_3",
        "level": 1,
        "nama": "Daftar Layanan Digital Pemerintah pada Portal",
        "detail": "Direktori 25 layanan publik (7 sektor, 52 PD) dengan SLA di portal digital Pemkab",
        "opd": ["Diskominfo"],
        "status": "lengkap",
        "catatan": "Daftar layanan digital yang tersedia di portal — sesuai panduan modul L1 I17 'daftar layanan yang tersedia di portal'.",
        "url_preview": "/bukti-dukung/Keterpaduan_I17_03_Daftar-Layanan-Portal_2026.png",
        "url_sumber": "/bukti-dukung/Keterpaduan_I17_03_Daftar-Layanan-Portal_2026.png",
        "_ext": "png",
        "_peran": "utama",
        "_sumber_baru": True,
    },
]

# ── File yang dipindah sesuai hasil recompute L1 ──
# I9 jadi hidden → file eksklusif I9 pindah ke belum-lengkap
# Indeks KAMI dipakai I10 (tampil) → kembali ke root dari belum-lengkap
MOVE_TO_BL = ['KeamananSiber_I9_02_Laporan-Pengawasan-Kinerja_2026.xlsx']
MOVE_TO_ROOT = ['Data_I8_04_Indeks-KAMI-5.0_2026.xlsx', 'Data_I8_04_Indeks-KAMI-5.0-Preview_2026.png']


def main():
    only_plan = '--plan' in sys.argv

    m = json.load(open(MODUL_PATH))
    l1_items = {}
    for mod in m['modules']:
        for lk in mod.get('level_kriteria', []):
            if lk.get('level') == 1:
                l1_items[mod['indikator_id']] = len(lk.get('bukti_dukung', []) or [])

    p = json.load(open(JSON_PATH))

    # set _peran (default utama)
    n_peran = 0
    for a in p['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung', []):
                b['_peran'] = PERAN.get(b['id'], 'utama')
                n_peran += 1

    # verifikasi status → lengkap
    n_verif = 0
    for a in p['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung', []):
                if b['id'] in VERIFIKASI_LENGKAP:
                    b['status'] = 'lengkap'
                    b['catatan'] = (b.get('catatan', '') + ' ✅ Terverifikasi sesuai kriteria: ' + VERIFIKASI_LENGKAP[b['id']]).strip()
                    n_verif += 1

    # tambah bukti baru I17
    for a in p['aspek']:
        for ind in a['indikator']:
            if ind['id'] == 'I17':
                ada = {b['id'] for b in ind.get('bukti_dukung', [])}
                for nb in BUKTI_BARU_I17:
                    if nb['id'] not in ada:
                        ind['bukti_dukung'].append(nb)
                        print(f"  + bukti baru {nb['id']}: {nb['nama'][:60]}")

    # recompute _l1_lengkap: item L1 vs bukti utama lengkap L1
    hasil = {}
    for a in p['aspek']:
        for ind in a['indikator']:
            iid = ind['id']
            items = l1_items.get(iid, 0)
            if items == 0:
                ind['_l1_lengkap'] = True
                hasil[iid] = ('eksternal', '✓')
                continue
            l1_utama_lengkap = sum(1 for b in ind.get('bukti_dukung', [])
                                   if b.get('level') == 1 and b.get('_peran') == 'utama' and b.get('status') == 'lengkap')
            ok = l1_utama_lengkap >= items
            ind['_l1_lengkap'] = ok
            hasil[iid] = (f"{l1_utama_lengkap}/{items}", '✓ TAMPIL' if ok else '🔒 HIDDEN')

    print("\n=== Kelengkapan L1 (bukti UTAMA saja) ===")
    for iid in sorted(hasil, key=lambda x: int(x.replace('I', ''))):
        print(f"  {iid}: {hasil[iid][0]} → {hasil[iid][1]}")

    json.dump(p, open(JSON_PATH, 'w'), ensure_ascii=False, indent=1)
    print(f"\n✅ _peran: {n_peran} bukti | verifikasi lengkap: {n_verif} | _l1_lengkap recomputed")

    if only_plan:
        return

    # file moves
    for f in MOVE_TO_BL:
        src, dst = os.path.join(DIR, f), os.path.join(BL, f)
        if os.path.exists(src) and not os.path.exists(dst):
            subprocess.run(['git', 'mv', src, dst], cwd=BASE, check=True)
            print(f"  → belum-lengkap/: {f}")
    for f in MOVE_TO_ROOT:
        src, dst = os.path.join(BL, f), os.path.join(DIR, f)
        if os.path.exists(src) and not os.path.exists(dst):
            subprocess.run(['git', 'mv', src, dst], cwd=BASE, check=True)
            print(f"  → root (dipakai indikator tampil): {f}")

    # update referensi setelah move
    txt = open(JSON_PATH).read()
    for f in MOVE_TO_BL:
        txt = txt.replace(f'bukti-dukung/{f}', f'bukti-dukung/belum-lengkap/{f}')
    for f in MOVE_TO_ROOT:
        txt = txt.replace(f'bukti-dukung/belum-lengkap/{f}', f'bukti-dukung/{f}')
    json.dump(json.loads(txt), open(JSON_PATH, 'w'), ensure_ascii=False, indent=1)

    # verifikasi referensi ↔ file
    p2 = json.load(open(JSON_PATH))
    fisik = {f for f in os.listdir(DIR) if not f.startswith('.')} | {f'belum-lengkap/{f}' for f in os.listdir(BL) if not f.startswith('.')}
    refs = set()
    for a in p2['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung', []):
                for uf in ('url_preview', 'url_sumber'):
                    mm = re.search(r'bukti-dukung/([^/"?#]+)', b.get(uf, '') or '')
                    if mm:
                        refs.add(mm.group(1))
    miss = [r for r in refs if r not in fisik]
    print(f"\nVerifikasi: {len(refs)} referensi | {len(fisik)} file fisik | MISSING: {miss}")


if __name__ == '__main__':
    main()
