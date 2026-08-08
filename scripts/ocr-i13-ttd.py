#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OCR halaman terakhir BAST & KAK (cek TTD)."""
import fitz

for f, tag, pg in [('arsip-bukti-dukung/bukti-dukung/Teknologi_I13_10_BAST-Aplikasi-Bapokting_2026.pdf', 'bast', 0),
                   ('arsip-bukti-dukung/bukti-dukung/Teknologi_I13_05_KAK-Aplikasi-Bapokting_2026.pdf', 'kak', 7)]:
    doc = fitz.open(f)
    idx = min(pg, len(doc) - 1)
    pix = doc[idx].get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csRGB)
    pix.save(f'/tmp/{tag}_last.png')
    doc.close()
print("rendered")
