#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kosongkan I3 L1-2 & L2-2 (Literasi Digital tidak sesuai) + arsip file."""
import json, shutil, os

d = json.load(open('data/pemdi.json'))

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I3':
            continue
        for b in i.get('bukti_dukung', []):
            if b.get('status') == 'lengkap':
                b['status'] = 'belum'
                b.pop('url_preview', None)
                b.pop('_ext', None)
                b['catatan'] = 'Dikosongkan 8 Ags 2026: Literasi Digital 2023 = survei statistik, bukan bukti "penggunaan aplikasi dasar" (L1-2) / "peningkatan kompetensi" (L2-2) - rawan ditolak. Butuh dokumen dari BKPSDM.'
                n += 1
                print(f"KOSONGKAN {b['id']}")

src = 'public/bukti-dukung/Penyelenggara_I3_01_Literasi-Digital-2023_2023.pdf'
dst = 'arsip-bukti-dukung/bukti-dukung/Penyelenggara_I3_01_Literasi-Digital-2023_2023.pdf'
if os.path.exists(src):
    shutil.move(src, dst)
    print(f"ARSIP: {src.split('/')[-1]}")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"\nTotal dikosongkan: {n}")
