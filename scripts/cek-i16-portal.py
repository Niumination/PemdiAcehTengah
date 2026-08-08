#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cek screenshot portal + daftar layanan (bukti integrasi aplikasi)."""
import fitz, os

# Screenshot portal - cek bisa dibuka
for f in ['public/bukti-dukung/Keterpaduan_I17_05_Screenshot-Portal_2026.png',
          'public/bukti-dukung/Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png']:
    print(f"{f}: {os.path.getsize(f)//1024}K")

# Lihat daftar layanan (PNG) - OCR
doc = fitz.open()
page = doc.new_page(width=595, height=842)
page.insert_image(page.rect, filename='public/bukti-dukung/Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png')
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), colorspace=fitz.csRGB)
pix.save('/tmp/daftar_layanan.png')
doc.close()
print("rendered daftar layanan")
