#!/usr/bin/env python3
"""Hitung ulang indeks aktual Pemdi dari status bukti (metode indeks-aktual)."""
import json, os

ROOT = "/Users/zaryu/Desktop/Niumination/apps/PemdiAcehTengah"
DATA = f"{ROOT}/data/pemdi.json"
d = json.load(open(DATA))


def nilai_indikator(ind):
    bd = ind.get("bukti_dukung", [])
    if not bd:
        return 0
    max_level = max(b["level"] for b in bd)
    for lv in range(1, max_level + 1):
        items = [b for b in bd if b["level"] == lv]
        if not items:
            continue
        if not all(b["status"] == "lengkap" for b in items):
            return lv - 1
    return max_level


# hitung ulang nilai per indikator + aspek
for a in d["aspek"]:
    inds = a.get("indikator", [])
    for i in inds:
        i["nilai_aktual"] = nilai_indikator(i)
    if inds:
        bobot = sum(i.get("bobot", 1) for i in inds)
        a["nilai_aktual"] = sum(i["nilai_aktual"] * i.get("bobot", 1) for i in inds) / bobot if bobot else 0

# indeks keseluruhan
bobot_aspek = sum(a.get("bobot", 1) for a in d["aspek"])
indeks = sum(a["nilai_aktual"] * a.get("bobot", 1) for a in d["aspek"]) / bobot_aspek if bobot_aspek else 0

# hitung statistik lengkap
total = 0
lengkap = 0
for a in d["aspek"]:
    for i in a.get("indikator", []):
        for b in i.get("bukti_dukung", []):
            total += 1
            if b["status"] == "lengkap":
                lengkap += 1

d["indeks_aktual"] = round(indeks, 2)
d["indeks_label"] = f"Dihitung dari {lengkap} bukti lengkap · {total} item · target {d.get('target_indeks', 2.5)}"

json.dump(d, open(DATA, "w"), ensure_ascii=False, indent=1)
print(f"indeks_aktual: {indeks:.2f}")
print(f"lengkap: {lengkap}/{total}")
print(f"label: {d['indeks_label']}")
