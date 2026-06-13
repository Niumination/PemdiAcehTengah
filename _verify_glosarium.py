import json
d = json.load(open("data/glosarium.json"))
print(f"Jumlah entri: {len(d)}")
for x in d[:5]:
    s = len(x.get("singkat", ""))
    l = len(x.get("lengkap", ""))
    print(f"  - {x['istilah']}: singkat={s} chars, lengkap={l} chars")
