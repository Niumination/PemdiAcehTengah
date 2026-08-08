#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""OCR cek SK CSIRT 2026 & SK Tim CSIRT 2024."""
import fitz

for f, tag in [('public/bukti-dukung/KeamananSiber_I12_01_SK-CSIRT-Aceh-Tengah_2026.pdf', 'csirt2026'),
               ('arsip-bukti-dukung/bukti-dukung/KeamananSiber_I12_02_SK-Tim-CSIRT_2024.pdf', 'csirt2024')]:
    doc = fitz.open(f)
    print(f"=== {f.split('/')[-1]} ({len(doc)} hal) ===")
    for i in range(min(2, len(doc))):
        pix = doc[i].get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csRGB)
        pix.save(f'/tmp/{tag}_{i}.png')
    doc.close()
print("rendered")
