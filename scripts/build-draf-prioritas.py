#!/usr/bin/env python3
"""Bangun data/draf-bukti-prioritas.json — daftar bukti dukung yang harus SEGERA
disusun (untuk halaman /requirement "Draf Bukti Dukung Prioritas").

Sumber: data/pemdi.json (status hasil Tahap 1 eval.spbe.go.id) + data/modul-indikator.json
(data_dukung_modul per level) + data/panduan-bukti-l1.json (template/draf yang sudah ada).

Prioritas:
  P0  Revisi asesor        — butir ber-status `revisi` (unggah ulang paling cepat menaikkan level)
  P1  Gap ke level berikut — butir pada level (nilai+1) yang belum `diterima`, diurutkan
                             berdasarkan "daya ungkit" = bobot indikator / jumlah butir yang kurang
Indikator eksternal (I5/I6/I7/I18) dikecualikan — nilainya dari sistem pembina.

Jalankan ulang setiap kali data/pemdi.json berubah:  python3 scripts/build-draf-prioritas.py
"""
import json
import os
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda *p: os.path.join(ROOT, "data", *p)

pemdi = json.load(open(D("pemdi.json"), encoding="utf-8"))
modul = {m["indikator_id"]: m for m in json.load(open(D("modul-indikator.json"), encoding="utf-8"))["modules"]}
panduan = {i["indikator"]: i for i in json.load(open(D("panduan-bukti-l1.json"), encoding="utf-8"))["indikator"]}
EKSTERNAL = {"I5", "I6", "I7", "I18"}


def contoh_modul(ind_id, level):
    dd = modul.get(ind_id, {}).get("data_dukung_modul", [])
    lv = next((x for x in dd if x["level"] == level), None)
    return lv["items"] if lv else []


def template_panduan(ind_id, level):
    if level != 1:
        return []
    return [{"judul": d["judul"], "file": d["file"], "jenis": d["jenis"]} for d in panduan.get(ind_id, {}).get("dokumen", [])]


revisi, gap = [], []
for a in pemdi["aspek"]:
    for ind in a["indikator"]:
        if ind["id"] in EKSTERNAL:
            continue
        bd = [b for b in ind.get("bukti_dukung", []) if b.get("_peran") != "pendukung"]
        nilai = int(ind.get("nilai") or 0)
        pic = ind.get("penanggung_jawab", {}).get("lead", "Diskominfo")
        for b in bd:
            if b["status"] == "revisi":
                revisi.append({
                    "kode": b["eval"]["kode"], "id": b["id"], "indikator": ind["id"], "indikator_nama": ind["nama"],
                    "aspek": a["singkat"], "level": b["level"], "butir": b["nama"], "catatan_asesor": b.get("catatan", ""),
                    "pic": pic, "contoh_modul": contoh_modul(ind["id"], b["level"]),
                    "template": template_panduan(ind["id"], b["level"]),
                    "dampak": "Menghapus status revisi; prasyarat agar Level %d dapat dinilai penuh." % b["level"],
                })
        if nilai >= 5:
            continue
        nxt = nilai + 1
        kurang = [b for b in bd if b["level"] == nxt and b["status"] != "diterima"]
        total_lv = [b for b in bd if b["level"] == nxt]
        if not total_lv:
            continue
        ungkit = (ind.get("bobot") or 0) / max(1, len(kurang))
        gap.append({
            "indikator": ind["id"], "indikator_nama": ind["nama"], "aspek": a["singkat"], "bobot": ind.get("bobot"),
            "nilai_sekarang": nilai, "level_target": nxt, "pic": pic, "daya_ungkit": round(ungkit, 2),
            "butir_kurang": len(kurang), "butir_total": len(total_lv),
            "kenaikan_indeks": round((ind.get("bobot") or 0) / 100, 3),
            "butir": [{
                "id": b["id"], "kode_rencana": "I%s-L%d-%02d" % (ind["id"][1:], b["level"], int(b["id"].rsplit("_", 1)[-1])),
                "nama": b["nama"], "status": b["status"], "catatan": b.get("catatan", ""),
                "arsip_lokal": b.get("_arsip"),
            } for b in kurang],
            "contoh_modul": contoh_modul(ind["id"], nxt),
            "template": template_panduan(ind["id"], nxt),
        })

gap.sort(key=lambda g: (-g["daya_ungkit"], g["butir_kurang"], int(g["indikator"][1:])))
revisi.sort(key=lambda r: (int(r["indikator"][1:]), r["level"], r["kode"]))

out = {
    "judul": "Draf Bukti Dukung Prioritas — Tahap 2 Evaluasi Pemdi",
    "dibangun": str(date.today()),
    "sumber": "data/pemdi.json (hasil Tahap 1 eval.spbe.go.id) · data/modul-indikator.json · data/panduan-bukti-l1.json",
    "penilaian_tahap1": pemdi.get("penilaian_tahap1"),
    "ringkas": {
        "revisi": len(revisi),
        "indikator_gap": len(gap),
        "butir_gap": sum(g["butir_kurang"] for g in gap),
        "indeks_simulasi": pemdi.get("indeks_aktual"),
        "indeks_jika_semua_gap_l_berikut": round(pemdi.get("indeks_aktual", 0) + sum(g["kenaikan_indeks"] for g in gap), 2),
    },
    "revisi": revisi,
    "gap": gap,
}
json.dump(out, open(D("draf-bukti-prioritas.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("revisi:", len(revisi), "· indikator gap:", len(gap), "· butir gap:", out["ringkas"]["butir_gap"],
      "· indeks jika semua L-berikut diterima:", out["ringkas"]["indeks_jika_semua_gap_l_berikut"])
for g in gap:
    print(f"  {g['indikator']:4} L{g['level_target']} kurang {g['butir_kurang']}/{g['butir_total']} ungkit {g['daya_ungkit']}")
