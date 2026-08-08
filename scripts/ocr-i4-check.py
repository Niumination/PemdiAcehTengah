#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OCR cek notulen & daftar hadir untuk I4 L1-3."""
import fitz

files = [
    ('arsip-bukti-dukung/bukti-dukung/TataKelola_I1_23_Notulen-Perencanaan_2025.pdf', 3, 'notulen'),
    ('arsip-bukti-dukung/bukti-dukung/TataKelola_I1_21_Daftar-Hadir-Perencanaan_2025.pdf', 2, 'daftar'),
]
for name, pages, tag in files:
    doc = fitz.open(name)
    print(f"=== {name.split('/')[-1]} ({len(doc)} hal) ===")
    for i in range(min(pages, len(doc))):
        pix = doc[i].get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csRGB)
        pix.save(f'/tmp/cek_{tag}{i}.png')
    doc.close()
print("rendered")
