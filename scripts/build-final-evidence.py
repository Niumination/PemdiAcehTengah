#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kompilasi bukti final per (indikator, level).
Strategi anti-duplikasi:
- 1 sumber  -> url_preview = file sumber asli (tanpa file baru)
- multi     -> kompilasi PDF + kompres halaman scan (jpeg q70, max 2000px)
"""
import fitz, os, json

BASE = '/Users/zaryu/Desktop/Niumination/apps/PemdiAcehTengah'
SRC = os.path.join(BASE, 'public/bukti-dukung')
FINAL = os.path.join(SRC, 'final')

DECISIONS = json.load(open(os.path.join(os.path.dirname(__file__), 'final-decisions.json')))

def compress_pages(doc, max_px=2000, quality=70):
    out = fitz.open()
    for page in doc:
        w, h = page.rect.width, page.rect.height
        scale = min(1.0, max_px / max(w, h))
        if scale < 1.0:
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), colorspace=fitz.csRGB)
        else:
            pix = page.get_pixmap(colorspace=fitz.csRGB)
        img = pix.tobytes('jpeg', quality)
        np_ = out.new_page(width=w, height=h)
        np_.insert_image(np_.rect, stream=img)
    return out

os.makedirs(FINAL, exist_ok=True)
results = {}
errors = []
created = []
for ik, levels in DECISIONS.items():
    for lv, (item_nama, srcs, catatan) in levels.items():
        # 1 sumber: pakai asli
        if len(srcs) == 1:
            sp = os.path.join(SRC, srcs[0])
            if not os.path.exists(sp):
                errors.append(f"MISS {srcs[0]} (I{ik} L{lv})")
                continue
            results[f"{ik}_{lv}"] = {'file': f"/bukti-dukung/{srcs[0]}", 'pages': None,
                                     'kb': os.path.getsize(sp)//1024, 'item': item_nama,
                                     'catatan': catatan, 'sumber': srcs}
            print(f"LINK {ik} L{lv} -> {srcs[0]} ({os.path.getsize(sp)//1024}K)")
            continue
        # multi: kompilasi + kompres
        out_name = f"{ik}_L{lv}_Final.pdf"
        out_path = os.path.join(FINAL, out_name)
        merged = fitz.open()
        ok = True
        for s in srcs:
            sp = os.path.join(SRC, s)
            if not os.path.exists(sp):
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
            # kompres jika >8MB (repo kecil + aturan portal), downscale agresif utk besar
            merged.save('/tmp/_m_tmp.pdf', deflate=True, garbage=3)
            size_mb = os.path.getsize('/tmp/_m_tmp.pdf') / 1048576
            if size_mb > 8:
                if size_mb > 80:
                    max_px, quality = 1100, 55
                elif size_mb > 30:
                    max_px, quality = 1400, 58
                else:
                    max_px, quality = 1600, 62
                comp = compress_pages(merged, max_px=max_px, quality=quality)
                comp.save(out_path, deflate=True, garbage=3)
                comp.close()
            else:
                import shutil
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
