#!/usr/bin/env python3
"""Generează imaginile Open Graph (1200x630) pentru pagina principală și pentru fiecare produs.
Folosire: python3 scripts/og-images.py        (necesită: pip install pillow)
Rezultat: public/og/home.jpg și public/og/<slug>.jpg
"""
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.path.join(ROOT, "scripts", "fonts")
OUT = os.path.join(ROOT, "public", "og")
os.makedirs(OUT, exist_ok=True)
W, H = 1200, 630
INK = (11, 42, 91); SOFT = (59, 74, 102); MUTED = (91, 107, 133); BRAND = (18, 86, 214)
TINTS = {"rufe": (220, 233, 251), "vase-pardoseli": (230, 240, 252), "odorizante": (207, 224, 249), "curatenie": (220, 233, 251), "servetele-umede": (230, 240, 252), "cosmetice": (207, 224, 249), "dulciuri": (195, 216, 246)}

def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, f"Montserrat-{name}.ttf"), size)

def wordmark(d, x, y):
    f = font("Bold", 46)
    # letter-spaced wordmark
    cx = x
    for ch in "DETERGINO":
        d.text((cx, y), ch, font=f, fill=INK)
        cx += d.textlength(ch, font=f) + 10
    d.text((x + 2, y + 58), "G A B I S   F O R T U N A", font=font("SemiBold", 15), fill=BRAND)
    return cx

def wrap(d, text, f, max_w):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= max_w: cur = t
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def paste_product(canvas, src, box):
    im = Image.open(src).convert("RGBA")
    bx, by, bw, bh = box
    im.thumbnail((bw, bh), Image.LANCZOS)
    canvas.alpha_composite(im, (bx + (bw - im.width) // 2, by + (bh - im.height) // 2))

def footer(d):
    d.text((80, 548), "Cere ofertă pe WhatsApp  ·  +40 723 767 435  ·  detergino.ro", font=font("SemiBold", 22), fill=BRAND)

data = json.load(open(os.path.join(ROOT, "src", "data", "catalog.json"), encoding="utf-8"))
cats = data["categories"]; products = data["products"]
brands = sorted({p["brand"] for p in products if p["brand"]})

# ---- home ----
canvas = Image.new("RGBA", (W, H), (255, 255, 255, 255))
d = ImageDraw.Draw(canvas)
d.rectangle([700, 0, W, H], fill=TINTS["rufe"] + (255,))
wordmark(d, 80, 80)
y = 190
for line in wrap(d, "Detergenți și produse de curățenie en-gros", font("Light", 44), 560):
    d.text((80, y), line, font=font("Light", 44), fill=INK); y += 54
d.text((80, y + 14), f"{len(products)} de produse  ·  {len(brands)} branduri  ·  Brașov", font=font("Regular", 24), fill=SOFT)
for i, slug in enumerate(["detergent-lichid-de-rufe-super-wash-ocean-fresh-5-l", "balsam-de-rufe-free-gold-heart-4-l", "odorizant-de-camera-spray-golf-lavender-260-ml"]):
    src = os.path.join(ROOT, "public", "products", f"{slug}.png")
    if os.path.exists(src): paste_product(canvas, src, (720 + i * 150, 120 + (0 if i == 1 else 40), 200, 400))
footer(d)
canvas.convert("RGB").save(os.path.join(OUT, "home.jpg"), quality=86, optimize=True)

# ---- products ----
for p in products:
    tint = TINTS.get(cats[p["category"]]["group"], TINTS["rufe"])
    canvas = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(canvas)
    d.rectangle([720, 0, W, H], fill=tint + (255,))
    wordmark(d, 80, 70)
    y = 180
    f = font("Light", 40)
    lines = wrap(d, p["name"], f, 580)[:4]
    for line in lines:
        d.text((80, y), line, font=f, fill=INK); y += 50
    sub = " · ".join([x for x in [p.get("size"), (f"{p['washes']} de spălări" if p.get("washes") else None), p.get("brand")] if x])
    if sub: d.text((80, y + 10), sub, font=font("Regular", 24), fill=SOFT)
    if p.get("barcode"): d.text((80, y + 48), f"Cod de bare {p['barcode']}", font=font("Regular", 18), fill=MUTED)
    if p["images"]:
        paste_product(canvas, os.path.join(ROOT, "public", p["images"][0]["src"].lstrip("/")), (760, 60, 400, 500))
    else:
        d.text((800, 300), "Imagine în curs de adăugare", font=font("Regular", 20), fill=MUTED)
    footer(d)
    canvas.convert("RGB").save(os.path.join(OUT, f"{p['slug']}.jpg"), quality=84, optimize=True)
print("og images:", len(os.listdir(OUT)))
