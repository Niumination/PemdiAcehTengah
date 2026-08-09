#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kompilasi bukti final per (indikator, level).
FIX KUALITAS (v2):
- Render baseline 150dpi (matrix 2.1x) — teks tajam, bukan 72dpi blur
- Kompres hanya jika >45MB (aturan portal eval 50MB), downscale bertahap
- jpeg q78 (seimbang kualitas/ukuran)
"""
import fitz, os, json, shutil

BASE = '/Users/zaryu/Desktop/Niumination/apps/PemdiAcehTengah'
PUB = os.path.join(BASE, 'public/bukti-dukung')          # file TAMPIL (referensi langsung)
SRC_K = os.path.join(BASE, 'arsip-bukti-dukung/sumber-kompilasi')  # sumber kompilasi (tidak deploy)
FINAL = os.path.join(PUB, 'final')

DECISIONS = json.load(open(os.path.join(os.path.dirname(__file__), 'final-decisions.json')))

def resolve(name):
    """Cari file sumber: public dulu (file LINK/tampil), lalu sumber-kompilasi."""
    for base in (PUB, SRC_K):
        p = os.path.join(base, name)
        if os.path.exists(p):
            return p
    return None

def raster_page(page, scale, quality):
    """Render halaman ke gambar raster (JPEG) dengan skala tertentu."""
    w, h = page.rect.width, page.rect.height
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB, alpha=False)
    img = pix.tobytes('jpeg', quality)
    np_ = fitz.open().new_page(width=w, height=h)
    np_.insert_image(np_.rect, stream=img)
    return np_

def compress_pages(doc, scale, quality):
    """Raster semua halaman dengan skala konsisten."""
    out = fitz.open()
    for page in doc:
        np_ = raster_page(page, scale, quality)
        out.insert_pdf(np_)
    return out

def should_raster(doc, threshold_mb=45):
    """Cek ukuran asli — raster hanya jika > threshold."""
    doc.save('/tmp/_size_check.pdf', deflate=True, garbage=3)
    mb = os.path.getsize('/tmp/_size_check.pdf') / 1048576
    os.remove('/tmp/_size_check.pdf')
    return mb > threshold_mb

os.makedirs(FINAL, exist_ok=True)
results = {}
errors = []
created = []
for ik, levels in DECISIONS.items():
    for lv, (item_nama, srcs, catatan) in levels.items():
        # 1 sumber: pakai asli
        if len(srcs) == 1:
            sp = resolve(srcs[0])
            if not sp:
                errors.append(f"MISS {srcs[0]} (I{ik} L{lv})")
                continue
            results[f"{ik}_{lv}"] = {'file': f"/bukti-dukung/{srcs[0]}", 'pages': None,
                                     'kb': os.path.getsize(sp)//1024, 'item': item_nama,
                                     'catatan': catatan, 'sumber': srcs}
            print(f"LINK {ik} L{lv} -> {srcs[0]} ({os.path.getsize(sp)//1024}K)")
            continue
        # multi: kompilasi
        out_name = f"{ik}_L{lv}_Final.pdf"
        out_path = os.path.join(FINAL, out_name)
        merged = fitz.open()
        ok = True
        for s in srcs:
            sp = resolve(s)
            if not sp:
                errors.append(f"MISS {s} untuk {ik} L{lv}")
                ok = False
                break
            try:
                doc = fitz.open(sp)
                merged.insert_pdf(doc)
                doc.close()
            except Exception as e:
                errors.append(f"ERR {s}: {e}")
                ok = False
                break
        if ok and merged.page_count > 0:
            if should_raster(merged):
                # Raster hanya file besar (>45MB): 150dpi baseline, turun jika masih besar
                scale, quality = 2.1, 78
                comp = compress_pages(merged, scale, quality)
                comp.save(out_path, deflate=True, garbage=3)
                # Jika masih >48MB, turunkan kualitas
                if os.path.getsize(out_path) / 1048576 > 48:
                    comp.close()
                    comp = compress_pages(merged, 1.6, 65)
                    comp.save(out_path, deflate=True, garbage=3)
                comp.close()
            else:
                # Salin asli (tanpa raster — kualitas 100%)
                merged.save('/tmp/_m_tmp.pdf', deflate=True, garbage=3)
                shutil.copy('/tmp/_m_tmp.pdf', out_path)
                os.remove('/tmp/_m_tmp.pdf')
            merged.close()
            kb = os.path.getsize(out_path)//1024
            results[f"{ik}_{lv}"] = {'file': f"/bukti-dukung/final/{out_name}", 'pages': None,
                                     'kb': kb, 'item': item_nama, 'catatan': catatan, 'sumber': srcs}
            created.append(out_name)
            print(f"BUILD {ik} L{lv}: {len(srcs)} src -> {kb}K")
        else:
            results[f"{ik}_{lv}"] = None

json.dump(results, open('/tmp/final_evidence.json', 'w'), ensure_ascii=False, indent=1)
print(f"\nTotal: {sum(1 for v in results.values() if v)} | error: {len(errors)}")
for e in errors: print('  !', e)
print("Dibuat:", len(created))
