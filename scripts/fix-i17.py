#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""I17: perbaiki L1-1/L1-2/L2-2 — bukti portal digital (screenshot + URL) bukan MPP fisik."""
import json, shutil, os, fitz

ARSIP = 'arsip-bukti-dukung/bukti-dukung'
PUB = 'public/bukti-dukung'
d = json.load(open('data/pemdi.json'))

# 1. Pindah bukti portal dari arsip ke public
for f in ['Keterpaduan_I17_01_Perbup-30-Penyelenggaraan_2022.pdf',
          'Keterpaduan_I17_02_PortalLayanan_2026.pdf',
          'Keterpaduan_I17_05_Screenshot-Portal_2026.png',
          'Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png']:
    src = os.path.join(ARSIP, f)
    if os.path.exists(src):
        shutil.move(src, os.path.join(PUB, f))
        print(f"pindah: {f}")

# 2. Build I17 L1 (Perbup 30 + screenshot portal + daftar layanan)
merged = fitz.open()
doc = fitz.open(os.path.join(PUB, 'Keterpaduan_I17_01_Perbup-30-Penyelenggaraan_2022.pdf'))
merged.insert_pdf(doc)
doc.close()
# tambah PNG screenshot & daftar layanan
for png in ['Keterpaduan_I17_05_Screenshot-Portal_2026.png', 'Keterpaduan_I17_06_Daftar-Layanan-Portal_2026.png']:
    pp = os.path.join(PUB, png)
    page = merged.new_page(width=595, height=842)  # A4
    page.insert_image(page.rect, filename=pp)
merged.save('/tmp/_i17.pdf', deflate=True, garbage=3)
merged.close()
sz = os.path.getsize('/tmp/_i17.pdf') / 1048576
if sz > 45:
    out = fitz.open()
    m = fitz.open('/tmp/_i17.pdf')
    for pg in m:
        pix = pg.get_pixmap(matrix=fitz.Matrix(0.7, 0.7), colorspace=fitz.csRGB)
        np_ = out.new_page(width=pg.rect.width, height=pg.rect.height)
        np_.insert_image(np_.rect, stream=pix.tobytes('jpeg', 58))
    out.save(os.path.join(PUB, 'final', 'I17_L1_Portal-Instansi_2026.pdf'), deflate=True, garbage=3)
    out.close()
    m.close()
else:
    shutil.copy('/tmp/_i17.pdf', os.path.join(PUB, 'final', 'I17_L1_Portal-Instansi_2026.pdf'))
os.remove('/tmp/_i17.pdf')
print(f"OK I17_L1_Portal-Instansi_2026.pdf: {os.path.getsize(os.path.join(PUB,'final','I17_L1_Portal-Instansi_2026.pdf'))//1024}K")

# 3. Update JSON
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I17':
            continue
        for b in i.get('bukti_dukung', []):
            if b['level'] == 1 and 'Portal Layanan Digital Pemerintah pada Instansi Pemerintah' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/final/I17_L1_Portal-Instansi_2026.pdf'
                b['_ext'] = 'pdf'
                b['catatan'] = 'Perbup 30/2022 Penyelenggaraan MPP + screenshot portal layanan digital (acehtengahkab.go.id) + daftar layanan portal - bukti keberadaan portal layanan digital pada instansi pemerintah daerah.'
                print(f"UPDATE {b['id']} -> I17_L1_Portal-Instansi")
            if b['level'] == 1 and 'Portal Layanan Digital Pemerintah pada IPPD' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = 'https://acehtengahkab.go.id'
                b['_ext'] = 'url'
                b['catatan'] = 'Portal resmi Pemerintah Kabupaten Aceh Tengah (acehtengahkab.go.id) - portal layanan digital pada IPPD, aktif.'
                print(f"UPDATE {b['id']} -> URL portal")
            if b['level'] == 2 and 'pada sebagian Layanan Digital Pemerintah' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/final/I17_L2_Final.pdf'
                b['url_lampiran'] = ['/bukti-dukung/Keterpaduan_I17_02_PortalLayanan_2026.pdf']
                b['_ext'] = 'pdf'
                b['catatan'] = 'Perbup 30/2022 + laporan ketersediaan portal layanan digital (sebagian layanan) + lampiran dokumen portal layanan digital daerah.'
                print(f"UPDATE {b['id']} -> I17_L2_Final + lampiran")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print("done")
