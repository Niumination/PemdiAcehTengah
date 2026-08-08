#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""I13: isi L1-2 & L2-2 (substansi RAN Pemdi) dengan Renstra+Renja."""
import json, fitz, os, shutil

PUB = 'public/bukti-dukung'
d = json.load(open('data/pemdi.json'))

# Build PDF substansi RAN Pemdi (Renstra + Renja)
merged = fitz.open()
for s in ['TataKelola_I1_15_Renstra-Diskominfo_2026.pdf', 'TataKelola_I1_16_Renja-Diskominfo_2026.pdf']:
    doc = fitz.open(os.path.join(PUB, s))
    merged.insert_pdf(doc)
    doc.close()
merged.save('/tmp/_i13.pdf', deflate=True, garbage=3)
merged.close()
sz = os.path.getsize('/tmp/_i13.pdf') / 1048576
if sz > 45:
    out = fitz.open()
    m = fitz.open('/tmp/_i13.pdf')
    for pg in m:
        pix = pg.get_pixmap(matrix=fitz.Matrix(0.7, 0.7), colorspace=fitz.csRGB)
        np_ = out.new_page(width=pg.rect.width, height=pg.rect.height)
        np_.insert_image(np_.rect, stream=pix.tobytes('jpeg', 58))
    out.save(os.path.join(PUB, 'final', 'I13_L12_Substansi-RAN_2026.pdf'), deflate=True, garbage=3)
    out.close()
    m.close()
else:
    shutil.copy('/tmp/_i13.pdf', os.path.join(PUB, 'final', 'I13_L12_Substansi-RAN_2026.pdf'))
os.remove('/tmp/_i13.pdf')
print(f"OK I13_L12_Substansi-RAN_2026.pdf: {os.path.getsize(os.path.join(PUB,'final','I13_L12_Substansi-RAN_2026.pdf'))//1024}K")

# Update item L1-2 & L2-2
n = 0
for a in d['aspek']:
    for i in a.get('indikator', []):
        if i.get('id') != 'I13':
            continue
        for b in i.get('bukti_dukung', []):
            if b['level'] in (1, 2) and 'Substansi Rencana Aksi Pemerintah Digital pada Perencanaan' in b['nama']:
                b['status'] = 'lengkap'
                b['url_preview'] = '/bukti-dukung/final/I13_L12_Substansi-RAN_2026.pdf'
                b['_ext'] = 'pdf'
                b['catatan'] = 'Renstra Diskominfo 2025-2029 + Renja TA 2026 - substansi RAN Pemdi pada perencanaan IPPD. Satu set dokumen dengan I1/I2 (wajar multi-indikator: modul I13 juga meminta substansi RAN Pemdi pada perencanaan).'
                n += 1
                print(f"UPDATE {b['id']}")

json.dump(d, open('data/pemdi.json', 'w'), ensure_ascii=False, indent=1)
print(f"Updated: {n}")
