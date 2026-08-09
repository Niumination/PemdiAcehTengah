#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""I19/I20: buat bukti SLA 25 layanan + SKM Online dari sistem portal yang berjalan."""
import json, os, shutil
import openpyxl
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm

PUB = 'public/bukti-dukung'

# 1. Pindah file arsip yang dibutuhkan
for f in ['Kepuasan_I19_01_Perbup-21-Pedoman_2021.pdf',
          'Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx',
          'Kepuasan_I20_02_SKM-Kebayakan_2025.pdf',
          'TataKelola_I2_01_Perbup-126-Standar-Pelayanan_2019.pdf',
          'TataKelola_I2_05_Pedoman-Pengaduan-RSUD_2026.pdf']:
    src = os.path.join('arsip-bukti-dukung/rujukan-opd', f)
    if os.path.exists(src):
        shutil.move(src, os.path.join(PUB, f))
        print(f"pindah: {f}")

# 2. PDF SLA 25 layanan (dari layanan.json)
layanan = json.load(open('data/layanan.json'))
rows = []
for k in layanan['kategori']:
    for l in k.get('layanan', []):
        rows.append([l.get('nama', ''), k.get('nama', ''), l.get('waktu', l.get('sla', '')), l.get('biaya', '')])

doc = SimpleDocTemplate(os.path.join(PUB, 'final', 'I19_L1_SLA-Layanan-Digital_2026.pdf'),
                        pagesize=landscape(A4), leftMargin=12*mm, rightMargin=12*mm,
                        topMargin=14*mm, bottomMargin=12*mm)
styles = getSampleStyleSheet()
story = [
    Paragraph('<b>Daftar Service Level Agreement (SLA) Layanan Digital</b>', styles['Title']),
    Paragraph('Pemerintah Kabupaten Aceh Tengah - Portal Layanan Digital Pemdi (25 layanan di 7 sektor)', styles['Normal']),
    Spacer(1, 8),
]
data = [['Layanan', 'Kategori', 'SLA/Waktu', 'Biaya']] + [[str(c) or '-' for c in r] for r in rows]
t = Table(data, repeatRows=1)
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1F2A44')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 7),
    ('GRID', (0,0), (-1,-1), 0.3, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F5F1E8')]),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
]))
story.append(t)
doc.build(story)
print(f"OK I19_L1_SLA: {os.path.getsize(os.path.join(PUB,'final','I19_L1_SLA-Layanan-Digital_2026.pdf'))//1024}K, {len(rows)} layanan")

# 3. PDF SKM Online (dari skm.json + hasil xlsx)
skm = json.load(open('data/skm.json'))
wb = openpyxl.load_workbook(os.path.join(PUB, 'Kepuasan_I19_06_Hasil-Survei-Kepuasan_2026.xlsx'), data_only=True)
hasil = []
for ws in wb.worksheets:
    for r in ws.iter_rows(values_only=True):
        if r and r[0] and str(r[0]).startswith('kemendagri') is False and r[4]:
            hasil.append([str(r[4]), str(r[5]), str(r[6])])

doc2 = SimpleDocTemplate(os.path.join(PUB, 'final', 'I20_L1_SKM-Online_2026.pdf'),
                         pagesize=A4, leftMargin=15*mm, rightMargin=15*mm,
                         topMargin=14*mm, bottomMargin=12*mm)
story2 = [
    Paragraph('<b>Survei Kepuasan Masyarakat (SKM) Online</b>', styles['Title']),
    Paragraph(f"Pemerintah Kabupaten Aceh Tengah - {skm['metadata']['judul']}", styles['Normal']),
    Paragraph(f"Periode: {skm['metadata']['periode']} | Update: {skm['metadata']['update']} | Target respon: {skm['metadata']['target_respon']}", styles['Normal']),
    Spacer(1, 6),
    Paragraph('<b>Unit Pelayanan Peserta SKM Online:</b>', styles['Heading2']),
    Paragraph('; '.join(skm['unit_pelayanan']), styles['Normal']),
    Spacer(1, 8),
    Paragraph('<b>Hasil Indeks Kepuasan Masyarakat (OpenData, Jan-Mei 2026):</b>', styles['Heading2']),
]
data2 = [['Indikator', 'Periode', 'Nilai IKM']] + hasil
t2 = Table(data2, repeatRows=1)
t2.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1F2A44')),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('GRID', (0,0), (-1,-1), 0.3, colors.grey),
]))
story2.append(t2)
doc2.build(story2)
print(f"OK I20_L1_SKM-Online: {os.path.getsize(os.path.join(PUB,'final','I20_L1_SKM-Online_2026.pdf'))//1024}K, {len(hasil)} baris hasil")
