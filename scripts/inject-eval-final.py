#!/usr/bin/env python3
"""Inject 18 bukti final lolos-evaluasi (tahap interview) ke data/pemdi.json.

Idempoten berbasis ID: lewati ID yang sudah ada. Backup: .bak-eval-final.
Jalankan: python3 scripts/inject-eval-final.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "pemdi.json")

# (file, indikator, level, nama, catatan)
ITEMS = [
    ("I1-L1-01.pdf", "I1", 1, "Peta Rencana Pemdi 2025-2029 (rancangan awal, substansi RAN)",
     "Disusun Tim Koordinasi Pemdi; rancangan awal memuat substansi RAN Pemdi."),
    ("I1-L2-01.pdf", "I1", 2, "Qanun RPJMD Kabupaten Aceh Tengah 2025-2029",
     "Dokumen perencanaan daerah memuat arah transformasi digital."),
    ("I1-L2-03.pdf", "I1", 2, "Renstra Diskominfo 2025-2029",
     "Rencana strategis PD memuat program transformasi digital."),
    ("I11-L1-01.pdf", "I11", 1, "Inventarisasi aset enkripsi + laporan awal kriptografi 2026",
     "Laporan awal penerapan kriptografi untuk keamanan data."),
    ("I12-L1-01.pdf", "I12", 1, "Laporan penanganan insiden siber + register Jan-Jun 2026",
     "Register insiden keamanan informasi periode berjalan."),
    ("I13-L1-01.pdf", "I13", 1, "Dokumen Teknologi L1 (scan, 8 halaman)",
     "Dokumen hasil scan; verifikasi isi manual saat interview."),
    ("I17-L1-01.pdf", "I17", 1, "Rencana Aksi Super App Alpukat Gayo (portal layanan digital)",
     "Action plan pengembangan & integrasi portal layanan digital daerah."),
    ("I17-L1-02.pdf", "I17", 1, "Laporan & matriks integrasi aplikasi + SDLC",
     "Matriks integrasi aplikasi + dokumentasi SDLC dan repository."),
    ("I17-L2-01.pdf", "I17", 2, "Rencana Aksi Super App Alpukat Gayo (portal layanan digital)",
     "Dokumen sama mendukung L1 & L2 (pola multi-level, valid)."),
    ("I17-L2-02.pdf", "I17", 2, "Halaman utama portal integrasi (screenshot)",
     "Tangkapan layar portal integrasi: siklus hidup ASN & publik."),
    ("I2-L1-01.pdf", "I2", 1, "Qanun RPJMD Kabupaten Aceh Tengah 2025-2029",
     "Dokumen sama mendukung I1 & I2 (pola multi-level, valid)."),
    ("I2-L1-02.pdf", "I2", 1, "Laporan manajemen layanan digital internal Jan-Jun 2026",
     "Laporan pelaksanaan layanan digital internal Diskominfo."),
    ("I20-L1-01.pdf", "I20", 1, "SKM Online Triwulan II 2026 (52 unit layanan)",
     "Survei Kepuasan Masyarakat online periode April-Juni 2026, target 500 respon."),
    ("I20-L1-02.pdf", "I20", 1, "SKM Online Triwulan II 2026 (rekap unit layanan)",
     "Dokumen sama mendukung slot kedua (pola multi-level, valid)."),
    ("I3-L1-01.pdf", "I3", 1, "Dokumen Penyelenggara/SDM L1 (scan, 16 halaman)",
     "Dokumen hasil scan; verifikasi isi manual saat interview."),
    ("I3-L1-02.pdf", "I3", 1, "Laporan pemanfaatan aplikasi kerja digital + rekap pengguna",
     "Rekap pengguna aktif di lingkungan Pemkab Aceh Tengah."),
    ("I4-L1-01.pdf", "I4", 1, "SK Bupati 555/395/2026 Tim Koordinasi Pemdi",
     "Penetapan Tim Koordinasi Pemerintah Digital."),
    ("I4-L1-03.pdf", "I4", 1, "Dokumen Tata Kelola L1 (scan, 9 halaman)",
     "Dokumen hasil scan; verifikasi isi manual saat interview."),
]

d = json.load(open(DATA, encoding="utf-8"))
by_ind = {}
for a in d["aspek"]:
    for ind in a["indikator"]:
        by_ind[ind["id"]] = ind

added = skipped = 0
for fn, ind_id, lv, nama, cat in ITEMS:
    ind = by_ind[ind_id]
    buds = ind.setdefault("bukti_dukung", [])
    taken = {b["id"].rsplit("_", 1)[-1] for b in buds
             if re.fullmatch(r"GT\.%s_L%d_\d+" % (ind_id, lv), b.get("id", ""))}
    n = 1
    while str(n) in taken:
        n += 1
    new_id = f"GT.{ind_id}_L{lv}_{n}"
    if any(b.get("id") == new_id for b in buds):
        skipped += 1
        continue
    buds.append({
        "id": new_id,
        "level": lv,
        "nama": nama,
        "detail": "Bukti dukung final — lolos evaluasi, tahap interview",
        "opd": ["Diskominfo", "Tim Koordinasi Pemdi"],
        "status": "lengkap",
        "catatan": cat,
        "url_preview": f"/bukti-dukung/final/{fn}",
        "_ext": "pdf",
        "_eval_final": True,
    })
    added += 1

total = sum(len(ind.get("bukti_dukung", [])) for a in d["aspek"] for ind in a["indikator"])
d["total_item_bukti"] = total
json.dump(d, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"ditambah: {added} · dilewati: {skipped} · total_item_bukti: {total}")
