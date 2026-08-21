#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Hitung ulang capaian nilai Indeks Pemdi SESUAI PERMENPANRB 8/2026.

Menggantikan metode lama `update-indeks-aktual.py` (Indikator eksternal
dinilai 0; UI memakai field `nilai` campuran manual).

Rumus resmi (Lampiran PermenPANRB 8/2026 — Pedoman Evaluasi Kinerja Pemdi,
Bagian B "Metode Penghitungan Indeks Pemdi", hlm. -37- s.d. -39-):
  1. Indeks Aspek_i = Σ(wIj × NIj) / wAi
  2. Indeks Pemdi   = Σ(wAspek_i × Indeks Aspek_i)

Nilai indikator (NIj) = tingkat kematangan 1–5 dari bukti dukung:
level kontinu tertinggi yang SEMUA item bukti utamanya "lengkap"
(aturan berjenjang — L1 belum lengkap ⇒ level atas tidak dinilai).

Indikator eksternal (I5 SDI/Bappenas, I6 SJIG/BIG, I7 EPSS/BPS, I18 —
strategi tim) memakai field `eksternal.nilai`; selama null dipakai nilai
minimum 1 (skala kuesioner dimulai dari 1 = Kurang/Merintis) dengan status
"menunggu".

Target indikator mengikuti Panduan Peningkatan Indeks Pemdi Aceh Tengah
(docs/Panduan_Peningkatan_Indeks_Pemdi_Aceh_Tengah.md Bab 4.2); target aspek
diturunkan dengan rumus resmi dari target indikator (konsisten). Skenario
proyeksi Bab 8.5 (2,375 → Cukup; 2,50 → Baik) disimpan sebagai pembanding.

Idempoten — aman dijalankan berulang. Backup: data/pemdi.json.bak-capaian.
"""
import json
import os
import shutil
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA = os.path.join(ROOT, "data", "pemdi.json")

# ── Target indikator (Panduan Bab 4.2 — Matriks Prioritas Perbaikan) ──
TARGET_INDIKATOR = {
    "I1": 2.5, "I2": 2.0,            # Prioritas 1
    "I3": 2.0, "I4": 2.5,            # Prioritas 2
    "I5": 2.5, "I6": 1.5, "I7": 1.5, "I8": 2.0,
    "I9": 2.0, "I10": 2.0, "I11": 1.5, "I12": 2.0,
    "I13": 2.0, "I14": 2.0,
    "I15": 2.5, "I16": 2.5, "I17": 2.5, "I18": 2.0,
    "I19": 2.5, "I20": 3.0,
}

# ── Indikator eksternal (auto-scored sistem nasional / strategi tim) ──
EKSTERNAL = {
    "I5": {"aktif": True, "sistem": "Skor Satu Data Indonesia (SDI)", "pembina": "Bappenas", "nilai": None, "status": "menunggu"},
    "I6": {"aktif": True, "sistem": "Skor SJIG (Simpul Jaringan Informasi Geospasial)", "pembina": "BIG", "nilai": None, "status": "menunggu"},
    "I7": {"aktif": True, "sistem": "Nilai EPSS (Evaluasi Penyelenggaraan Statistik Sektoral)", "pembina": "BPS", "nilai": None, "status": "menunggu"},
    "I18": {"aktif": True, "sistem": "Kuesioner Interoperabilitas Data (item modul dikosongkan sesuai strategi tim)", "pembina": "Bappenas", "nilai": None, "status": "menunggu"},
}

# Skenario proyeksi — Panduan Bab 8.5 (angka baku dokumen, pembanding)
SKENARIO_BAB85 = {"cukup": 2.375, "baik": 2.50}


def nilai_indikator(ind):
    """Nilai indikator 1–5 (level kontinu semua-bukti-lengkap; utama saja)."""
    if ind.get("eksternal", {}).get("aktif"):
        ext = ind["eksternal"].get("nilai")
        if isinstance(ext, (int, float)) and ext > 0:
            return ext, False
        return 1, True  # minimum skala — menunggu nilai eksternal
    bd = ind.get("bukti_dukung", [])
    lv_tercapai = 0
    for lv in range(1, 6):
        items = [b for b in bd if b.get("level") == lv and b.get("_peran", "utama") != "pendukung"]
        if items and all(b.get("status") == "lengkap" for b in items):
            lv_tercapai = lv
        else:
            break
    return lv_tercapai, False


def indeks_aspek(aspek, mode="aktual"):
    w_a = aspek.get("bobot", 0)
    total = 0.0
    for ind in aspek.get("indikator", []):
        if mode == "target":
            n = ind.get("target", 0)
        else:
            n, _menunggu = nilai_indikator(ind)
        total += ind.get("bobot", 0) * n
    return (total / w_a) if w_a else 0.0


def main():
    shutil.copyfile(DATA, DATA + ".bak-capaian")
    d = json.load(open(DATA))

    stat = {"total": 0, "lengkap": 0, "proses": 0, "belum": 0}
    for a in d["aspek"]:
        a_lengkap, a_total = 0, 0
        for ind in a["indikator"]:
            # field eksternal
            if ind["id"] in EKSTERNAL:
                # pertahankan `nilai` eksternal bila pernah diisi manual
                ext = dict(EKSTERNAL[ind["id"]])
                old = ind.get("eksternal", {}).get("nilai")
                if isinstance(old, (int, float)) and old > 0:
                    ext["nilai"] = old
                    ext["status"] = "tersedia"
                ind["eksternal"] = ext
            # target & nilai
            ind["target"] = TARGET_INDIKATOR.get(ind["id"], ind.get("target", 2.5))
            nilai, menunggu = nilai_indikator(ind)
            ind["nilai"] = nilai
            ind["nilai_aktual"] = nilai
            if menunggu:
                ind["_nilai_menunggu_eksternal"] = True
            else:
                ind.pop("_nilai_menunggu_eksternal", None)
            ind["sumber"] = (
                f"{ind['eksternal']['sistem']} — {'menunggu nilai eksternal' if menunggu else 'tersedia'}"
                if ind.get("eksternal", {}).get("aktif")
                else f"Bukti dukung terverifikasi ({sum(1 for b in ind.get('bukti_dukung', []) if b.get('status') == 'lengkap')}"
                     f"/{len(ind.get('bukti_dukung', []))} item)"
            )
            for b in ind.get("bukti_dukung", []):
                a_total += 1
                stat["total"] += 1
                if b.get("status") == "lengkap":
                    a_lengkap += 1
                    stat["lengkap"] += 1
                elif b.get("status") == "proses":
                    stat["proses"] += 1
                else:
                    stat["belum"] += 1
        a["nilai_aktual"] = round(indeks_aspek(a, "aktual"), 4)
        a["nilai"] = a["nilai_aktual"]
        a["target"] = round(indeks_aspek(a, "target"), 2)
        a["total_item"] = a_total
        a["item_aktual"] = a_lengkap
        a["item_gap"] = a_total - a_lengkap

    indeks_aktual = round(sum(a["bobot"] / 100 * a["nilai_aktual"] for a in d["aspek"]), 2)
    proyeksi_target = round(sum(a["bobot"] / 100 * a["target"] for a in d["aspek"]), 2)

    d["total_item_bukti"] = stat["total"]
    d["target_item_bukti"] = stat["total"]
    d["indeks_terkini"] = indeks_aktual
    d["indeks_aktual"] = indeks_aktual
    d["indeks_label"] = (
        f"Capaian terverifikasi dari {stat['lengkap']} bukti lengkap · {stat['total']} item · "
        f"target {d.get('target_indeks', 2.5)}"
    )
    d["indeks_sumber"] = (
        f"Rumus resmi PermenPANRB 8/2026 (Lampiran, hlm. -37- s.d. -39-) · {stat['lengkap']} bukti lengkap · "
        f"{stat['total']} item"
    )
    d["catatan"] = (
        f"STATUS: {stat['lengkap']} item bukti lengkap, {stat['proses']} proses, {stat['belum']} belum "
        f"(total {stat['total']}). Nilai indikator = level kontinu semua-bukti-lengkap (bukti utama). "
        f"Indikator eksternal I5/I6/I7/I18 memakai nilai minimum 1 selama skor eksternal belum tersedia."
    )
    d["perhitungan"] = {
        "rumus_aspek": "Indeks Aspek_i = Σ(wIj × NIj) / wAi",
        "rumus_indeks": "Indeks Pemdi = Σ(wAspek_i × Indeks Aspek_i)",
        "sumber_rumus": "PermenPANRB No. 8 Tahun 2026 — Lampiran Pedoman Evaluasi Kinerja Pemdi, Bagian B Metode Penghitungan Indeks Pemdi (hlm. -37- s.d. -39-)",
        "nilai_indikator": "Tingkat kematangan 1–5 — level kontinu dengan seluruh bukti dukung utama ber-status lengkap",
        "indikator_eksternal": "I5 (SDI/Bappenas), I6 (SJIG/BIG), I7 (EPSS/BPS), I18 (strategi tim) — nilai minimum 1 selama `eksternal.nilai` belum diisi",
        "diperbarui": str(date.today()),
    }
    d["proyeksi"] = {
        "target_indeks": d.get("target_indeks", 2.5),
        "proyeksi_target_indikator": proyeksi_target,
        "ket_target_indikator": "Proyeksi indeks bila SELURUH target indikator (Panduan Bab 4.2) tercapai — dihitung rumus resmi",
        "skenario_panduan_bab8_5": SKENARIO_BAB85,
        "ket_skenario": "Skenario Panduan Bab 8.5: seluruh fase dijalankan → 2,375 (Cukup); kerja keras kepuasan pengguna (I20 ≥ 3,5) → 2,50 (Baik)",
    }

    json.dump(d, open(DATA, "w"), ensure_ascii=False, indent=1)
    print(f"indeks_aktual      : {indeks_aktual}")
    print(f"proyeksi target    : {proyeksi_target}")
    print(f"bukti              : {stat['lengkap']} lengkap / {stat['proses']} proses / {stat['belum']} belum (total {stat['total']})")
    for a in d["aspek"]:
        inds = ", ".join(f"{i['id']}={i['nilai']}" for i in a["indikator"])
        print(f"  A{a['id']} {a['singkat']:<16} nilai={a['nilai']:.2f} target={a['target']:.2f} [{inds}]")


if __name__ == "__main__":
    main()
