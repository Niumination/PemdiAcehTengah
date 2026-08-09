#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fase 2: Kategorikan arsip → hapus permanen vs pertahankan."""
import os

ARS = 'arsip-bukti-dukung/bukti-dukung'

# Kategori hapus permanen:
# 1. Final usang (indikator dikosongkan — tidak direferensikan)
# 2. Duplikat hash (sama dengan public)
# 3. Preview/placeholder (PNG kecil, xlsx metadata)
hapus = {
    # Final dari indikator yang dikosongkan (I3, I8, I11, I12)
    'I3_L1_Final.pdf', 'I8_L1_Final.pdf', 'I8_L2_Final.pdf',
    'I11_L1_Final.pdf', 'I11_L2_Final.pdf', 'I12_L1_Final.pdf',
    # Duplikat (sama dengan public/I1_12)
    'Teknologi_I13_03_DPA-Bapokting_2026.pdf',
    'Teknologi_I13_04_DPA-Bapokting_2026.pdf',
    # Final-src kecil (konversi sementara, bisa dibuat ulang)
    'final-src/I06_Data_Peta_RDTR.pdf',
    'final-src/I19_I20_Hasil_Survei_SKM_2026.pdf',
    'final-src/I1_Capaian_Realisasi_RKPD.pdf',
    # Preview/placeholder
    'Data_I8_04_Indeks-KAMI-5.0-Preview_2026.png',
    'TataKelola_I1_05_Capaian-RKPD-Preview_2026.png',
}

# Kategori pertahankan (nilai/berpotensi dipakai lagi):
pertahankan_reason = {
    'Data_I5_01_Perbup-60-Satu-Data_2022.pdf': 'Regulasi SDI — rujukan I5 (terintegrasi tapi dokumen dasar)',
    'Data_I5_02_SOP-EPSS_2026.pdf': 'SOP statistik sektoral — rujukan I7',
    'Data_I5_05_SK-Forum-Satu-Data_2025.pdf': 'SK Forum SDI — rujukan I5',
    'Data_I6_01_Data-Peta-RDTR_2026.xlsx': 'Dataset RDTR — rujukan I6',
    'Data_I8_04_Indeks-KAMI-5.0-Full_2026.pdf': 'Hasil KAMI 5.0 — rujukan I8 PDP',
    'Data_I8_04_Indeks-KAMI-5.0_2026.xlsx': 'Data KAMI — rujukan I8',
    'KeamananSiber_I11_06_Perbup-Penyelenggaraan-Persandian-Full_2025.pdf': 'Perbup persandian — rujukan I11',
    'KeamananSiber_I9_02_Laporan-Pengawasan-Kinerja_2026.xlsx': 'Laporan pengawasan — rujukan I9',
    'TataKelola_I1_01_Perbup-48-Arsitektur-SPBE_2025.pdf': 'Perbup 48 (versi JDIH) — arsip regulasi',
    'TataKelola_I1_02_Perbup-8-Rencana-SPBE_2022.pdf': 'Perbup 8 Rencana SPBE — regulasi dasar',
    'TataKelola_I1_05_Capaian-Realisasi-RKPD_2026.xlsx': 'Data capaian RKPD — rujukan I1',
    'TataKelola_I1_06_Perbup-70-SOTK-Diskominfo_2016.pdf': 'SOTK Diskominfo — rujukan I1/I3',
    'TataKelola_I1_08_Laporan-Reviu-Kinerja_2026.xlsx': 'Reviu kinerja — rujukan I1',
    'TataKelola_I1_18_RPJMD-2025-2029_2026.pdf': 'RPJMD — dokumen perencanaan',
    'TataKelola_I1_24_Penjelasan-RPJMD-Pemdi_2025.docx': 'Penjelasan RPJMD — sumber I1 L1',
    'TataKelola_I1_27_LHE-Reviu-RKPD_2027.pdf': 'LHE Reviu RKPD — rujukan I1',
    'Teknologi_I13_12_BAST-Aplikasi-Lepat_2026.pdf': 'BAST Lepat — rujukan I13',
    'Teknologi_I13_17_Screenshot-Aplikasi-Bapokting_2026.pdf': 'Screenshot Bapokting — rujukan I13',
    'Teknologi_I13_18_Screenshot-Aplikasi-Gemasih_2026.pdf': 'Screenshot Gemasih — rujukan I13',
}

print('=== RENCANA HAPUS PERMANEN ===')
tot_hapus = 0
for f in sorted(hapus):
    p = os.path.join(ARS, f)
    if os.path.exists(p):
        mb = os.path.getsize(p)/1048576
        tot_hapus += mb
        print(f'  HAPUS {mb:6.1f}MB  {f}')
print(f'Total hapus: {tot_hapus:.1f}MB, {len(hapus)} file')

print('\n=== PERTAHANKAN ===')
tot_pert = 0
for f, reason in sorted(pertahankan_reason.items()):
    p = os.path.join(ARS, f)
    if os.path.exists(p):
        mb = os.path.getsize(p)/1048576
        tot_pert += mb
        print(f'  KEEP  {mb:6.1f}MB  {f} — {reason}')
print(f'Total pertahankan: {tot_pert:.1f}MB')

# Cek file arsip yang tidak masuk kategori (untuk review)
print('\n=== FILE TIDAK TERKATEGORI ===')
all_files = set()
for root, dirs, files in os.walk(ARS):
    for f in files:
        if f != '.DS_Store': all_files.add(f)
uncat = all_files - hapus - set(pertahankan_reason.keys())
for f in sorted(uncat):
    print(f'  ? {f}')
