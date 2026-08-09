#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rebuild file final yang hilang (ad-hoc items) dengan kualitas 150dpi."""
import fitz, os, shutil

PUB = 'public/bukti-dukung'
FINAL = os.path.join(PUB, 'final')

def build(out_name, srcs, raster_if_big=True):
    merged = fitz.open()
    for s in srcs:
        p = os.path.join(PUB, s)
        if not os.path.exists(p):
            print(f"  MISS SRC {s}")
            merged.close()
            return False
        doc = fitz.open(p)
        merged.insert_pdf(doc)
        doc.close()
    merged.save('/tmp/_t.pdf', deflate=True, garbage=3)
    mb = os.path.getsize('/tmp/_t.pdf') / 1048576
    if mb > 45 and raster_if_big:
        # Raster 150dpi
        scale, quality = 2.1, 78
        out = fitz.open()
        for pg in merged:
            pix = pg.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB, alpha=False)
            np_ = out.new_page(width=pg.rect.width, height=pg.rect.height)
            np_.insert_image(np_.rect, stream=pix.tobytes('jpeg', quality))
        out.save(os.path.join(FINAL, out_name), deflate=True, garbage=3)
        out.close()
    else:
        shutil.copy('/tmp/_t.pdf', os.path.join(FINAL, out_name))
    os.remove('/tmp/_t.pdf')
    merged.close()
    kb = os.path.getsize(os.path.join(FINAL, out_name)) // 1024
    print(f"OK {out_name}: {kb}K")
    return True

jobs = {
    'I1_L23_Konsolidasi-Tim_2026.pdf': ['TataKelola_I1_13_Rapat-Koordinasi-Pemdi_2026.pdf'],
    'I1_L24_Anggaran-SPBE_2026.pdf': [
        'TataKelola_I1_12_DPA-0037-TataKelola-SPBE_2026.pdf',
        'TataKelola_I1_17_RKA-0037-TataKelola-SPBE_2026.pdf',
        'TataKelola_I1_20_DPA-Pengolahan-Data_2026.pdf',
    ],
    'I1_L31_Perencanaan-Full_2026.pdf': [
        'TataKelola_I1_28_RPJMK-2025-2029_2026.pdf',
        'TataKelola_I1_15_Renstra-Diskominfo_2026.pdf',
        'TataKelola_I1_16_Renja-Diskominfo_2026.pdf',
    ],
    'I1_L33_Konsolidasi-Tim-Full_2026.pdf': ['TataKelola_I1_13_Rapat-Koordinasi-Pemdi_2026.pdf'],
    'I2_L11_Substansi-RAN_2026.pdf': [
        'TataKelola_I1_15_Renstra-Diskominfo_2026.pdf',
        'TataKelola_I1_16_Renja-Diskominfo_2026.pdf',
    ],
    'I4_L13_Kolaborasi-OPD_2026.pdf': [
        'TataKelola_I1_13_Rapat-Koordinasi-Pemdi_2026.pdf',
        'TataKelola_I1_23_Notulen-Perencanaan_2025.pdf',
        'TataKelola_I1_21_Daftar-Hadir-Perencanaan_2025.pdf',
    ],
    'I13_L12_Substansi-RAN_2026.pdf': [
        'TataKelola_I1_15_Renstra-Diskominfo_2026.pdf',
        'TataKelola_I1_16_Renja-Diskominfo_2026.pdf',
    ],
    'I17_L1_Portal-Instansi_2026.pdf': [
        'Keterpaduan_I17_01_Perbup-30-Penyelenggaraan_2022.pdf',
        'Keterpaduan_I17_05_Screenshot-Portal_2026.png',
        'Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png',
    ],
}

os.makedirs(FINAL, exist_ok=True)
for name, srcs in jobs.items():
    build(name, srcs)
print("Selesai")
