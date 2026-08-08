#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OCR halaman 1 KAK & BAST Bapokting (verifikasi keaslian/TTD)."""
import fitz

files = [
    ('arsip-bukti-dukung/bukti-dukung/Teknologi_I13_05_KAK-Aplikasi-Bapokting_2026.pdf', 'kak'),
    ('arsip-bukti-dukung/bukti-dukung/Teknologi_I13_10_BAST-Aplikasi-Bapokting_2026.pdf', 'bast'),
    ('arsip-bukti-dukung/bukti-dukung/Teknologi_I13_06_Laporan-Aplikasi-Bapokting_2026.pdf', 'lap'),
]
for f, tag in files:
    doc = fitz.open(f)
    for i in range(min(1, len(doc))):
        pix = doc[i].get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csRGB)
        pix.save(f'/tmp/{tag}_0.png')
    doc.close()
print("rendered")
