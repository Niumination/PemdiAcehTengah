#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""I12: L1-1 dikosongkan (SK != dokumentasi pelaksanaan), L2-1 valid + lampiran SK 2024."""
import json, shutil, os

d = json.load(open('data/pemdi.json'))

# 1. Pindah SK Tim CSIRT 2024 ke public (jadi lampiran L2-1)
src = 'arsip-bukti-dukung/bukti-dukung/KeamananSiber_I12_02_SK-Tim-CSIRT_2024.pdf'
dst = 'public/bukti-dukung/KeamananSiber_I12_02_SK-Tim-CSIRT_2024.pdf'
if os.path.exists(src):
    shutil.move(src, dst)
    print("pindah: SK Tim CSIRT 2024 -> public")

# 2. Update item
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I12':
            continue
        for b in i.get('bukti_dukung', []):
            if b['level'] == 1 and 'Dokumentasi pelaksanaan penanganan insiden' in b['nama']:
                b['status'] = 'belum'
                b.pop('url_preview', None)
                b.pop('_ext', None)
                b['catatan'] = 'Dikosongkan 8 Ags 2026: SK CSIRT 2026 + SK Tim 2024 = penetapan tim, bukan "dokumentasi pelaksanaan penanganan insiden" yang diminta modul. Draf "Laporan Penanganan Insiden Siber & Register Insiden Jan-Jun 2026" (workspace) = jenis persis tapi placeholder [LAMBANG] -> perlu difinalisasi Bidang Persandian Diskominfo.'
                print(f"KOSONGKAN {b['id']}")
            if b['level'] == 2 and 'Penetapan TTIS' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/KeamananSiber_I12_01_SK-CSIRT-Aceh-Tengah_2026.pdf'
                b['url_lampiran'] = ['/bukti-dukung/KeamananSiber_I12_02_SK-Tim-CSIRT_2024.pdf']
                b['_ext'] = 'pdf'
                b['catatan'] = 'Keputusan Bupati No. 070/273/DISKOMINFO/2025 tentang Penunjukan/Penetapan Tim Tanggap Insiden Siber (AcehTengah-CSIRT) + lampiran Keputusan No. 070/696/DISKOMINFO/2024 (pembentukan TTIS CSIRT).'
                print(f"VALIDASI {b['id']}: tetap lengkap + lampiran SK 2024")

# 3. Arsip I12_L1_Final (tidak direferensikan lagi)
f = 'public/bukti-dukung/final/I12_L1_Final.pdf'
if os.path.exists(f):
    shutil.move(f, 'arsip-bukti-dukung/bukti-dukung/I12_L1_Final.pdf')
    print("ARSIP: I12_L1_Final.pdf")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print("done")
