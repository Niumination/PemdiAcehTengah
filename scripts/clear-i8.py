#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kosongkan I8 L1-1 & L2-5 (Perbup umum != uraian PDP / privacy notice) + arsip file."""
import json, shutil, os

d = json.load(open('data/pemdi.json'))

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I8':
            continue
        for b in i.get('bukti_dukung', []):
            if b.get('status') == 'lengkap':
                b['status'] = 'belum'
                b.pop('url_preview', None)
                b.pop('_ext', None)
                b['catatan'] = 'Dikosongkan 8 Ags 2026: Perbup 6/2025 (klasifikasi keamanan arsip) + Perbup 73/2020 (adminduk) + Perbup 137/2019 (PPID) adalah regulasi umum, bukan dokumen PDP spesifik yang diminta modul (uraian kondisi existing PDP / privacy notice + screenshot kebijakan). Rawan ditolak. Butuh dokumen PDP sesuai UU 27/2022 dari OPD.'
                n += 1
                print(f"KOSONGKAN {b['id']}")

# Arsipkan PDF final I8
for f in ['I8_L1_Final.pdf', 'I8_L2_Final.pdf']:
    src = os.path.join('public/bukti-dukung/final', f)
    if os.path.exists(src):
        shutil.move(src, os.path.join('arsip-bukti-dukung/bukti-dukung', f))
        print(f"ARSIP: {f}")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"\nTotal dikosongkan: {n}")
