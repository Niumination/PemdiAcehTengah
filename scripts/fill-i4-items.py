#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tandai I4 L1-3 lengkap: bukti kolaborasi antar OPD."""
import json

d = json.load(open('data/pemdi.json'))

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I4':
            continue
        for b in i.get('bukti_dukung', []):
            if b['level'] == 1 and 'Bukti Pelaksanaan Kolaborasi antar unit kerja' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/final/I4_L13_Kolaborasi-OPD_2026.pdf'
                b['_ext'] = 'pdf'
                b['catatan'] = 'Paket kegiatan kolaborasi antar perangkat daerah: undangan dan susunan acara Rapat Koordinasi Transformasi Digital (25-26 Jun 2026, lintas OPD) + notulen Orientasi Penyusunan Dokumen Perencanaan memuat agenda substansi RAN Pemdi (9 Jan 2025, Bappeda) + daftar hadir. Sesuai modul: undangan, notulensi, dokumentasi kegiatan kolaborasi.'
                n += 1
                print(f"UPDATE {b['id']} -> I4_L13_Kolaborasi-OPD_2026.pdf")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"Updated: {n}")
