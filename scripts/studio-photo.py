#!/usr/bin/env python3
"""Fotografie „de studio” dintr-unul sau mai multe decupaje transparente (WebP/PNG cu alpha):
cicloramă albastră cu gradient, umbră de contact și reflexie pe podea pentru fiecare produs.

Folosire:
  python3 scripts/studio-photo.py [--palette bleu|albastru|bleumarin|hex,hex,hex] [--horizon 0.78] [--free-left 0.46] <out.webp> <W> <H> <poza@inaltime@centru_x> [...]

  inaltime  = înălțimea produsului ca fracție din înălțimea canvasului (0.70)
  centru_x  = centrul produsului ca fracție din lățimea canvasului (0.5)
  Produsele se desenează în ordinea dată: primul în spate, ultimul în față.

Exemplu:
  python3 scripts/studio-photo.py public/banner/odorizante.webp 1600 1100 public/products/difuzor-cu-betisoare-golf-lavanda-110-ml.webp@0.72@0.5
Necesită: pip install pillow
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

# paleta implicită: cicloramă bleu (ca tentele site-ului). Alte palete: --palette albastru | bleumarin | hex,hex,hex
PALETTES = {
    "bleu": ((228, 236, 252), (195, 216, 246), (176, 202, 240)),
    "albastru": ((30, 102, 230), (14, 69, 173), (9, 52, 136)),
    "bleumarin": ((22, 58, 115), (11, 42, 91), (7, 30, 66)),
    "lavanda": ((243, 238, 253), (217, 200, 248), (192, 170, 240)),
    "piersica": ((255, 245, 232), (253, 224, 190), (247, 203, 152)),
    "menta": ((236, 250, 246), (198, 240, 230), (168, 228, 213)),
}
TOP, BOT, FLOOR = PALETTES["bleu"]
SHADOW = (11, 42, 91)
HORIZON = 0.78
FREE_LEFT = 0.0   # --free-left 0.46: nothing is drawn left of 46% of the width (text column)


def hexrgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def backdrop(W, H, horizon):
    bg = Image.new("RGB", (W, H), TOP)
    px = bg.load()
    for y in range(H):
        if y < horizon:
            t = y / horizon
            c = tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3))
        else:
            t = (y - horizon) / max(1, H - horizon)
            c = tuple(int(BOT[i] + (FLOOR[i] - BOT[i]) * t) for i in range(3))
        for x in range(W):
            px[x, y] = c
    return bg.convert("RGBA")


def place(bg, path, ph, xc, horizon):
    W, H = bg.size
    im = Image.open(path).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox())
    scale = (H * ph) / im.height
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    x0 = round(W * xc - im.width / 2)
    y0 = horizon - im.height + round(H * 0.02)
    base_y = y0 + im.height

    # contact shadow: a wide soft ellipse plus a tight darker one at the base
    for spread, alpha, blur in ((1.0, 110, 0.035), (0.55, 150, 0.012)):
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        ew, eh = int(im.width * 0.62 * spread), int(im.height * 0.06 * (0.6 if spread < 1 else 1))
        d.ellipse((W * xc - ew, base_y - eh, W * xc + ew, base_y + eh), fill=SHADOW + (alpha,))
        bg.alpha_composite(layer.filter(ImageFilter.GaussianBlur(int(H * blur))))

    # reflection: the flipped product fading out over the top 38% of its height
    refl = im.transpose(Image.FLIP_TOP_BOTTOM)
    fade = int(refl.height * 0.38)
    mask = Image.new("L", refl.size, 0)
    mp = mask.load()
    for y in range(fade):
        v = int(70 * (1 - y / fade) ** 1.6)
        for x in range(refl.width):
            mp[x, y] = v
    refl.putalpha(Image.composite(mask, Image.new("L", refl.size, 0), refl.getchannel("A")))
    bg.alpha_composite(refl.filter(ImageFilter.GaussianBlur(1.2)), (x0, base_y + 2))

    bg.alpha_composite(im, (x0, y0))
    return im.size, (x0, y0)


def main():
    global TOP, BOT, FLOOR, SHADOW, HORIZON, FREE_LEFT
    args = sys.argv[1:]
    while args and args[0].startswith("--"):
        flag = args.pop(0)
        val = args.pop(0)
        if flag == "--palette":
            if val in PALETTES:
                TOP, BOT, FLOOR = PALETTES[val]
            else:
                TOP, BOT, FLOOR = (hexrgb(x) for x in val.split(","))
            if val in ("albastru", "bleumarin"):
                SHADOW = (0, 0, 0)
        elif flag == "--horizon":
            HORIZON = float(val)
        elif flag == "--free-left":
            FREE_LEFT = float(val)
        else:
            print("flag necunoscut:", flag); sys.exit(1)
    if len(args) < 4:
        print(__doc__); sys.exit(1)
    out, W, H = args[0], int(args[1]), int(args[2])
    horizon = int(H * HORIZON)
    bg = backdrop(W, H, horizon)
    items = []
    for item in args[3:]:
        path, ph, xc = item.split("@")
        items.append([path, float(ph), float(xc)])
    if FREE_LEFT > 0 and items:
        # measure each product's width at its target height, then shift/scale the group so it starts right of the free zone
        def span(it):
            im = Image.open(it[0]).convert("RGBA")
            bb = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
            w, h = bb[2] - bb[0], bb[3] - bb[1]
            half = (H * it[1]) * (w / h) / 2
            return it[2] * W - half, it[2] * W + half
        lefts = [span(it)[0] for it in items]; rights = [span(it)[1] for it in items]
        lo, hi = min(lefts), max(rights)
        free, edge = FREE_LEFT * W, 0.99 * W
        shift = max(0.0, free - lo)
        if hi + shift > edge:
            # the group does not fit after the shift: scale it so it spans exactly [free, edge]
            scale = (edge - free) / (hi - lo)
            for it in items:
                it[1] *= scale
                it[2] = (free + (it[2] * W - lo) * scale) / W
            shift = 0.0
            print("grup redus la", round(scale, 3))
        for it in items:
            it[2] += shift / W
        print("zona libera", FREE_LEFT, "deplasare px", round(shift))
    for path, ph, xc in items:
        size, pos = place(bg, path, ph, xc, horizon)
        print("produs", path.split("/")[-1], size, "la", pos)
    bg.convert("RGB").save(out, "WEBP", quality=86, method=6)
    print("ok", out, (W, H))


if __name__ == "__main__":
    main()
