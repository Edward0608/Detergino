#!/usr/bin/env python3
"""Marchează în src/data/catalog.json pozele care și-au păstrat fundalul alb (opaque: true).
Site-ul le afișează pe panou alb în loc de tenta colorată a grupei. Necesită: pip install pillow numpy
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(ROOT, "src", "data", "catalog.json")
data = json.load(open(CAT, encoding="utf-8")); n = 0
for p in data["products"]:
    for im in p["images"]:
        a = np.array(Image.open(os.path.join(ROOT, "public", im["src"].lstrip("/"))).convert("RGBA"))[:, :, 3]
        ys, xs = np.where(a > 8)
        box = a[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
        if (box > 200).mean() > 0.985:
            im["opaque"] = True; n += 1
        else:
            im.pop("opaque", None)
json.dump(data, open(CAT, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"{n} poze marcate ca opace")
