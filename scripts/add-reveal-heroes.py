#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Tambahkan data-reveal ke hero section (pola variatif)."""
import re, os

files = ['opd', 'spbe', 'faq', 'glosarium', 'probis', 'skm', 'requirement', 'cari',
         'admin', 'lapor', 'dashboard-kepuasan', 'kebijakan-privasi']

changed = []
for name in files:
    p = f'pages/{name}.js'
    if not os.path.exists(p):
        continue
    src = open(p).read()
    orig = src

    # Pola A: <section\n        style={{\n          background: 'var(--hero-grad)'
    pat_a = re.compile(r"(<section)(\s*\n(\s*)style=\{\{\s*\n\s*background: 'var\(--hero-grad\)')", re.M)
    src, n = pat_a.subn(lambda m: f"<section data-reveal{m.group(2)}", src, count=1)

    # Pola B: <section style={{ ... background: 'var(--hero-grad)' (inline)
    if n == 0:
        pat_b = re.compile(r"(<section\s+)(style=\{\{[^}]*background: 'var\(--hero-grad\)')", re.M)
        src, n = pat_b.subn(lambda m: f"<section data-reveal {m.group(2)}", src, count=1)

    if n > 0:
        open(p, 'w').write(src)
        changed.append(name)
        print(f"OK {name}")
    else:
        print(f"-- {name}: pola tidak cocok")

print(f"\nTotal: {len(changed)}")
