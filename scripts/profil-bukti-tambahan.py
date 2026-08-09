#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ekstrak profil isi semua 95 file tambahan — teks/scan untuk pemetaan ke indikator."""
import os, fitz, json, hashlib

BASE = '/Users/zaryu/Documents/Bukti-Dukung-Utama'
OUT = {}

for folder in ['Whatsapp-Grup-PEMDI', 'Dokumen Evidence Bukti Dukung PEMDI (File responses) Google Drive', 'Bukti Dukung SPBE 2025', 'eval.spbe.go.id']:
    fdir = os.path.join(BASE, folder)
    for root, dirs, files in os.walk(fdir):
        for f in files:
            if f == '.DS_Store':
                continue
            p = os.path.join(root, f)
            rel = os.path.relpath(p, BASE)
            sz = os.path.getsize(p)
            h = hashlib.md5(open(p, 'rb').read()).hexdigest()[:10]
            info = {'folder': folder, 'size_kb': sz//1024, 'hash': h}
            if f.lower().endswith('.pdf'):
                try:
                    doc = fitz.open(p)
                    info['pages'] = len(doc)
                    txt = ''.join(pg.get_text() for pg in doc[:5])
                    info['chars'] = len(txt)
                    info['scan'] = len(txt) < 100
                    info['preview'] = txt[:200].replace('\n', ' | ')
                    doc.close()
                except Exception as e:
                    info['err'] = str(e)
            elif f.lower().endswith(('.doc', '.docx')):
                info['type'] = 'doc'
                info['preview'] = '(word)'
            elif f.lower().endswith('.xlsx'):
                info['type'] = 'xlsx'
                info['preview'] = '(excel)'
            OUT[rel] = info

json.dump(OUT, open('/tmp/bukti_tambahan_profil.json', 'w'), ensure_ascii=False, indent=1)
print(f'Total: {len(OUT)} file')
for rel, info in sorted(OUT.items()):
    scan = 'SCAN' if info.get('scan') else f"{info.get('chars',0)}ch"
    print(f"[{info['folder'][:12]:<12}] {info.get('pages','?'):>3}hal {scan:<8} {rel[:80]}")
