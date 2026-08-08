#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kosongkan I11 L1 & L2 (Perbup != laporan penerapan kriptografi) + arsip."""
import json, shutil, os

d = json.load(open('data/pemdi.json'))

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I11':
            continue
        for b in i.get('bukti_dukung', []):
            if b.get('status') == 'lengkap':
                b['status'] = 'belum'
                b.pop('url_preview', None)
                b.pop('_ext', None)
                b['catatan'] = 'Dikosongkan 8 Ags 2026: Perbup 1/2025, Perbup 2/2025, Perbup Sertifikat Elektronik 2021 = regulasi, bukan "laporan pelaksanaan penerapan teknologi kriptografi" yang diminta modul. Rawan ditolak. Butuh laporan dari Diskominfo Bidang Persandian (ada draf kerja di workspace: Inventarisasi Aset Dienkripsi & Laporan Awal Kriptografi 2026 — perlu difinalisasi logo/TTD).'
                n += 1
                print(f"KOSONGKAN {b['id']}")

for f in ['I11_L1_Final.pdf', 'I11_L2_Final.pdf']:
    src = os.path.join('public/bukti-dukung/final', f)
    if os.path.exists(src):
        shutil.move(src, os.path.join('arsip-bukti-dukung/bukti-dukung', f))
        print(f"ARSIP: {f}")

# Perbup 1/2/2025 & Sertifikat Elektronik -> arsip (tidak dipakai lagi)
for f in ['KeamananSiber_I11_03_Perbup-1-Penataan-Pola-Sandi_2025.pdf',
          'KeamananSiber_I11_04_Perbup-2-Penyelenggaraan-Persandian_2025.pdf',
          'KeamananSiber_I11_05_Perbup-Sertifikat-Elektronik_2021.pdf',
          'KeamananSiber_I11_06_Perbup-Penyelenggaraan-Persandian-Full_2025.pdf']:
    src = os.path.join('public/bukti-dukung', f)
    if os.path.exists(src):
        shutil.move(src, os.path.join('arsip-bukti-dukung/bukti-dukung', f))
        print(f"ARSIP: {f}")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"\nTotal dikosongkan: {n}")
