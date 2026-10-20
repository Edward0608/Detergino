#!/usr/bin/env python3
"""Importă fotografii de produs în public/products/.

Folosire:
  python3 scripts/import-poze.py <folder-cu-poze> [--cutout]

Fiecare fișier din folder trebuie denumit după codul de bare sau după slug-ul produsului
(vezi docs/lista-poze.csv), cu orice extensie: 4841980005311.jpg, detergent-lichid-de-rufe-super-wash-ocean-fresh-5-l.png.
Pentru produse cu mai multe poze: <slug>-2.jpg, <slug>-3.jpg.

Scriptul: decupează marginile goale, centrează poza pe un canvas pătrat transparent cu 8% margine,
limitează la 1600 px, salvează WebP cu transparență și actualizează dimensiunea în src/data/catalog.json.
Cu --cutout elimină și fundalul (necesită: pip install "rembg[cpu]").
Fără --cutout poza rămâne pe fundalul ei alb; după import rulează `python3 scripts/marcheaza-opace.py` ca site-ul să afișeze aceste poze pe panou alb.
Necesită: pip install pillow
"""
import json, os, re, sys
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "src", "data", "catalog.json")
OUT = os.path.join(ROOT, "public", "products")
MAX = 1600

def square(im, pad=0.08):
    im = im.convert("RGBA")
    alpha = im.getchannel("A")
    if alpha.getextrema()[0] == 255:  # opaque: treat near-white as background for trimming only
        rgb = im.convert("RGB")
        diff = ImageChops.difference(rgb, Image.new("RGB", im.size, (255, 255, 255)))
        bbox = diff.convert("L").point(lambda p: 255 if p > 18 else 0).getbbox()
    else:
        bbox = alpha.point(lambda p: 255 if p > 8 else 0).getbbox()
    if bbox: im = im.crop(bbox)
    w, h = im.size
    s = int(max(w, h) * (1 + 2 * pad))
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    canvas.alpha_composite(im, ((s - w) // 2, (s - h) // 2))
    if s > MAX:
        canvas = canvas.resize((MAX, MAX), Image.LANCZOS)
    return canvas

def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src = sys.argv[1]; cutout = "--cutout" in sys.argv
    remove = None
    if cutout:
        from rembg import remove as _remove, new_session
        session = new_session("u2net")
        remove = lambda im: _remove(im, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=15, alpha_matting_erode_size=5, post_process_mask=True)
    data = json.load(open(CATALOG, encoding="utf-8"))
    by_key = {}
    for p in data["products"]:
        by_key[p["slug"]] = p
        if p["barcode"]: by_key[p["barcode"]] = p
    done = 0
    for f in sorted(os.listdir(src)):
        stem, ext = os.path.splitext(f)
        if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"): continue
        m = re.match(r"^(.*?)(?:-(\d+))?$", stem)
        key, idx = m.group(1), int(m.group(2) or 1)
        p = by_key.get(key)
        if not p:
            print("fără corespondență în catalog:", f); continue
        im = Image.open(os.path.join(src, f))
        if remove: im = remove(im.convert("RGBA"))
        im = square(im)
        name = f"{p['slug']}.webp" if idx == 1 else f"{p['slug']}-{idx}.webp"
        im.save(os.path.join(OUT, name), "WEBP", quality=84, method=6)
        entry = {"src": f"/products/{name}", "px": im.size[0]}
        imgs = p["images"]
        while len(imgs) < idx: imgs.append(entry)
        imgs[idx - 1] = entry
        done += 1
        print("ok", f, "->", name, im.size[0], "px")
    json.dump(data, open(CATALOG, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    print(f"{done} poze importate. Rulează: npm run build")

if __name__ == "__main__":
    main()
