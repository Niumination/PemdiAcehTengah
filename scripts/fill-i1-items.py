#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tandai 4 item I1 (L2-3, L2-4, L3-1, L3-3) sebagai lengkap."""
import json

d = json.load(open('data/pemdi.json'))

updates = [
    {'level': 2, 'sub': 'kegiatan konsolidasi kolaboratif',
     'url': '/bukti-dukung/final/I1_L23_Konsolidasi-Tim_2026.pdf',
     'catatan': 'Undangan dan susunan acara Rapat Koordinasi Penerapan Transformasi Digital Pemerintah (25-26 Juni 2026) - tindak lanjut Surat Bupati 473.1/1130/DISKOMINFO (5 Mei 2026) penyiapan bukti dukung Pemdi. Konsolidasi Tim Koordinasi Pemdi dalam menyusun substansi RAN Pemdi.'},
    {'level': 2, 'sub': 'Perencanaan dan Anggaran yang mendukung sebagian',
     'url': '/bukti-dukung/final/I1_L24_Anggaran-SPBE_2026.pdf',
     'catatan': 'DPA/RKA sub kegiatan 2.16.03.2.02.0037 (Koordinasi Tata Kelola SPBE) + DPA Pengolahan Data - anggaran program SPBE/Pemdi pada perencanaan IPPD.'},
    {'level': 3, 'sub': 'Seluruh substansi Rencana Aksi Nasional Pemerintah Digital pada perencanaan IP',
     'url': '/bukti-dukung/final/I1_L31_Perencanaan-Full_2026.pdf',
     'catatan': 'Qanun RPJMK 2025-2029 + Renstra Diskominfo + Renja Diskominfo - substansi RAN Pemdi pada perencanaan IPPD (seluruh). Satu set dokumen dengan L2-1, klaim level berbeda (sebagian vs seluruh).'},
    {'level': 3, 'sub': 'kegiatan konsolidasi kolaboratif Tim Koordinasi Pemerintah Digital dalam menyusun substansi Rencana Aksi Nasional Pemerintah Digital pada perencanaan Instansi Pemerintah (100%)',
     'url': '/bukti-dukung/final/I1_L33_Konsolidasi-Tim-Full_2026.pdf',
     'catatan': 'Undangan dan susunan acara Rapat Koordinasi Transformasi Digital (25-26 Juni 2026) - konsolidasi Tim Koordinasi Pemdi (100%). Satu set dengan L2-3, klaim level berbeda.'},
]

n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I1':
            continue
        for b in i.get('bukti_dukung', []):
            for u in updates:
                if b['level'] == u['level'] and u['sub'].lower() in b['nama'].lower():
                    b['status'] = 'lengkap'
                    b['url_preview'] = u['url']
                    b['_ext'] = 'pdf'
                    b['catatan'] = u['catatan']
                    n += 1
                    print(f"UPDATE {b['id']} (L{b['level']}) -> {u['url'].split('/')[-1]}")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"\nUpdated: {n} item")
