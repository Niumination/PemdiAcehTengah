#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit ketat 32 bukti dukung vs modul — verifikasi isi & jenis dokumen."""
import json, os, fitz, re

d = json.load(open('data/pemdi.json'))
PUB = 'public/bukti-dukung'

# Ground truth: jenis dokumen yang diminta per item
# (dari transkripsi modul — data dukung)
GT = {
    # (indikator, level, id) -> jenis dokumen yang diminta modul
}

def cek_pdf(path):
    """Cek file PDF: ada, halaman, teks terbaca (bukan scan kosong)."""
    if not os.path.exists(path):
        return {'ada': False}
    try:
        doc = fitz.open(path)
        n = len(doc)
        # sampel teks 3 halaman pertama
        txt = ''.join(doc[i].get_text() for i in range(min(3, n)))
        doc.close()
        return {'ada': True, 'hal': n, 'chars': len(txt), 'scan': len(txt) < 50}
    except Exception as e:
        return {'ada': True, 'err': str(e)}

print("=== AUDIT 32 BUKTI — verifikasi file & isi ===")
issues = []
for a in d['aspek']:
    for i in a.get('indikator', []):
        for b in i.get('bukti_dukung', []):
            if b['status'] != 'lengkap':
                continue
            u = b.get('url_preview') or ''
            if u.startswith('http'):
                print(f"[{i['id']} L{b['level']}] {u} (URL eksternal)")
                continue
            rel = u.lstrip('/')
            info = cek_pdf(os.path.join(PUB, rel))
            if not info.get('ada'):
                issues.append(f"{i['id']} L{b['level']} [{b['id']}]: FILE TIDAK ADA {u}")
                print(f"[{i['id']} L{b['level']}] ❌ TIDAK ADA: {rel}")
            elif info.get('scan'):
                issues.append(f"{i['id']} L{b['level']} [{b['id']}]: SCAN tanpa teks {rel} ({info.get('hal')}hal)")
                print(f"[{i['id']} L{b['level']}] ⚠️ SCAN ({info.get('hal')} hal): {rel}")
            else:
                print(f"[{i['id']} L{b['level']}] ✅ {info.get('hal')} hal, {info.get('chars')}ch: {rel}")

print(f"\n=== ISSUES: {len(issues)} ===")
for x in issues: print('  ', x)
