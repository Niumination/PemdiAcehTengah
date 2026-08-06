#!/usr/bin/env python3
"""
Rename bukti dukung → format "Aspek_I#_NoUrut_Nama_Tahun.ext"
Aspek disingkat; NoUrut = urutan item per indikator (level 1→5, urutan kriteria per level).
Referensi di data/pemdi.json ikut di-update (url_preview, url_sumber, raw github).
Verifikasi akhir: semua referensi punya file fisik, 0 duplikat.
"""
import json, os, re, sys, subprocess

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, 'public', 'bukti-dukung')
JSON_PATH = os.path.join(BASE, 'data', 'pemdi.json')

# file lama → file baru (Aspek_I#_NoUrut_Nama_Tahun.ext)
RENAME = {
    "Capaian_RKPD_preview.png": "TataKelola_I1_05_Capaian-RKPD-Preview_2026.png",
    "Capaian_Realisasi_RKPD_Diskominfo.xlsx": "TataKelola_I1_05_Capaian-Realisasi-RKPD_2026.xlsx",
    "DPA_Diskominfo_2026_lengkap.pdf": "TataKelola_I1_14_DPA-SKPD-Diskominfo_2026.pdf",
    "Indeks_KAMI_5.0_Diskominfo_2026.xlsx": "Data_I8_04_Indeks-KAMI-5.0_2026.xlsx",
    "Indeks_KAMI_5.0_preview.png": "Data_I8_04_Indeks-KAMI-5.0-Preview_2026.png",
    "PG_04_01_SK-Koordinasi_2026.pdf": "TataKelola_I1_04_SK-Tim-Koordinasi-Pemdi_2026.pdf",
    "PG_04_02_DPA_2026.pdf": "TataKelola_I1_12_DPA-0037-TataKelola-SPBE_2026.pdf",
    "PG_04_03_RapatPemdi_2026.pdf": "TataKelola_I1_13_Rapat-Koordinasi-Pemdi_2026.pdf",
    "Perbup Penataan Pola Hub Kom Sandi - Sandi Diskominfo.pdf": "KeamananSiber_I11_03_Perbup-1-Penataan-Pola-Sandi_2025.pdf",
    "Perbup Penyelenggaraan Persandian - Sandi Diskominfo.pdf": "KeamananSiber_I11_04_Perbup-2-Penyelenggaraan-Persandian_2025.pdf",
    "RENSTRA 25-29 GO LIVE.pdf": "TataKelola_I1_15_Renstra-Diskominfo_2026.pdf",
    "REVISI SK PEDOMAN FORUM SATU DATA ACEH TENGAH TAHUN 2025.pdf": "Data_I5_05_SK-Forum-Satu-Data_2025.pdf",
    "RKA_Rincian_0037_TataKelolaSPBE_2026.pdf": "TataKelola_I1_17_RKA-0037-TataKelola-SPBE_2026.pdf",
    "RPJMD AT 2025-2029 rankhir.pdf": "TataKelola_I1_18_RPJMD-2025-2029_2026.pdf",
    "Ranhir Renja Diskominfo 2026.pdf": "TataKelola_I1_16_Renja-Diskominfo_2026.pdf",
    "TD_13_01_KAK-Bapokting_2026.pdf": "Teknologi_I13_05_KAK-Aplikasi-Bapokting_2026.pdf",
    "TD_13_02_DPA_2026.pdf": "Teknologi_I13_07_DPA-Aplikasi-Bapokting_2026.pdf",
    "TD_13_04_LaporanBapokting_2026.pdf": "Teknologi_I13_06_Laporan-Aplikasi-Bapokting_2026.pdf",
    "TD_13_05_DPA_2026.pdf": "Teknologi_I13_08_DPA-Aplikasi-Bapokting_2026.pdf",
    "jdih-28818ade-peraturan-bupati-aceh-tengah-nomor-48-tahun-2025-tentang-ars.pdf": "TataKelola_I1_01_Perbup-48-Arsitektur-SPBE_2025.pdf",
    "jdih-2a0b0c2f-peraturan-bupati-aceh-tengah-nomor-73-tahun-2020-tentang-pel.pdf": "TataKelola_I2_02_Perbup-73-Pelayanan_2020.pdf",
    "jdih-407b38e8-peraturan-bupati-aceh-tengah-nomor-30-tahun-2022-tentang-pen.pdf": "Keterpaduan_I17_01_Perbup-30-Penyelenggaraan_2022.pdf",
    "jdih-6cd5c436-peraturan-bupati-aceh-tengah-nomor-137-tahun-2019-tentang-pe.pdf": "Data_I8_06_Perbup-137-Penyelenggaraan_2019.pdf",
    "jdih-ade79cb3-peraturan-bupati-aceh-tengah-nomor-6-tahun-2025-tentang-sist.pdf": "Data_I8_01_Perbup-6-Sistem-Pemdi_2025.pdf",
    "jdih-af9a42bf-peraturan-bupati-aceh-tengah-nomor-9-tahun-2025-tentang-sotk.pdf": "Penyelenggara_I3_02_Perbup-9-SOTK_2025.pdf",
    "jdih-d0d9a4c9-peraturan-bupati-aceh-tengah-nomor-21-tahun-2021-tentang-ped.pdf": "Kepuasan_I19_01_Perbup-21-Pedoman_2021.pdf",
    "jdih-d6720ace-peraturan-bupati-aceh-tengah-nomor-8-tahun-2022-tentang-renc.pdf": "TataKelola_I1_02_Perbup-8-Rencana-SPBE_2022.pdf",
    "jdih-d9671249-peraturan-bupati-aceh-tengah-nomor-60-tahun-2022-tentang-sat.pdf": "Data_I5_01_Perbup-60-Satu-Data_2022.pdf",
    "jdih-e8187833-peraturan-bupati-aceh-tengah-nomor-126-tahun-2019-tentang-pe.pdf": "TataKelola_I2_01_Perbup-126-Standar-Pelayanan_2019.pdf",
    "jdih-edee8e80-peraturan-bupati-aceh-tengah-nomor-70-tahun-2019-tentang-ped.pdf": "Penyelenggara_I4_01_Perbup-70-Pedoman-SPBE_2019.pdf",
    "opendata-data-peta-rdtr-data-dan-peta-rdtr-yang-dikelola-di-aceh-tengah-ta.xlsx": "Data_I6_01_Data-Peta-RDTR_2026.xlsx",
    "opendata-data-rdtr-sop-epss-dari-diskominfo-tt-basah-pdf.pdf": "Data_I5_02_SOP-EPSS_2026.pdf",
    "opendata-hasil-survei-kepuasan-hasil-survei-kepuasan-masyarakat-di-kabupaten-aceh.xlsx": "Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx",
    "opendata-laporan-pengawasan-kinerja-laporan-hasil-pengawasan-kinerja-pemerintah-daerah.xlsx": "KeamananSiber_I9_02_Laporan-Pengawasan-Kinerja_2026.xlsx",
    "opendata-laporan-reviu-kinerja-laporan-hasil-reviu-laporan-kinerja-di-aceh-tengah.xlsx": "TataKelola_I1_08_Laporan-Reviu-Kinerja_2026.xlsx",
    "opendata-literasi-digital-literasi-digital-sektor-pemerintahan-pdf.pdf": "Penyelenggara_I3_01_Literasi-Digital-2023_2023.pdf",
    "pedoman_pengaduan_rsud.pdf": "TataKelola_I2_05_Pedoman-Pengaduan-RSUD_2026.pdf",
    "perbup_70_2016_kominfo SOTK - Sandi Diskominfo.pdf": "TataKelola_I1_06_Perbup-70-SOTK-Diskominfo_2016.pdf",
    "skm_kebayakan_2025.pdf": "Kepuasan_I20_02_SKM-Kebayakan_2025.pdf",
}


def main():
    only_plan = '--plan' in sys.argv
    files = sorted(os.listdir(DIR))
    files = [f for f in files if not f.startswith('.')]

    # validasi: semua file fisik ada di mapping & sebaliknya
    missing = [f for f in files if f not in RENAME]
    extra = [n for n in RENAME if n not in files]
    if missing or extra:
        print(f"⚠️ File tanpa mapping: {missing}")
        print(f"⚠️ Mapping tanpa file: {extra}")
        if not only_plan:
            sys.exit(1)

    # validasi nama baru unik & format benar
    new_names = list(RENAME.values())
    dups = {n for n in new_names if new_names.count(n) > 1}
    fmt = re.compile(r'^(TataKelola|Penyelenggara|Data|KeamananSiber|Teknologi|Keterpaduan|Kepuasan)_I\d+_\d{2}_[A-Za-z0-9.-]+_\d{4}\.(pdf|xlsx|png)$')
    bad = [n for n in new_names if not fmt.match(n)]
    print(f"Validasi: {len(RENAME)} file | duplikat nama: {dups} | format salah: {bad}")

    if only_plan:
        for old in files:
            print(f"  {old}  →  {RENAME[old]}")
        return

    # backup JSON
    bak = JSON_PATH + '.bak-rename'
    if not os.path.exists(bak):
        subprocess.run(['cp', JSON_PATH, bak], check=True)
        print(f"Backup: {bak}")

    # git mv
    for old in files:
        new = RENAME[old]
        src, dst = os.path.join(DIR, old), os.path.join(DIR, new)
        r = subprocess.run(['git', 'mv', src, dst], cwd=BASE, capture_output=True, text=True)
        if r.returncode != 0:
            print(f"  git mv GAGAL {old}: {r.stderr.strip()[:80]}")
            return
    print(f"✅ git mv {len(files)} file")

    # update referensi di pemdi.json
    txt = open(JSON_PATH).read()
    for old, new in RENAME.items():
        old_ref, new_ref = f'bukti-dukung/{old}', f'bukti-dukung/{new}'
        n = txt.count(old_ref)
        if n:
            txt = txt.replace(old_ref, new_ref)
    # cek referensi lama tersisa
    sisa = [old for old in RENAME if f'bukti-dukung/{old}' in txt]
    json.dump(json.loads(txt), open(JSON_PATH, 'w'), ensure_ascii=False, indent=1)
    print(f"✅ pemdi.json diupdate | referensi lama tersisa: {sisa}")

    # verifikasi: semua referensi punya file
    p = json.load(open(JSON_PATH))
    refs = set()
    for a in p['aspek']:
        for ind in a['indikator']:
            for b in ind.get('bukti_dukung', []):
                for uf in ('url_preview', 'url_sumber'):
                    m = re.search(r'bukti-dukung/([^/"?#]+)', b.get(uf, '') or '')
                    if m:
                        refs.add(m.group(1))
    fisik = set(os.listdir(DIR))
    fisik = {f for f in fisik if not f.startswith('.')}
    miss = [r for r in refs if r not in fisik]
    print(f"Verifikasi: {len(refs)} referensi unik | file fisik {len(fisik)} | MISSING: {miss}")


if __name__ == '__main__':
    main()
