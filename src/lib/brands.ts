import fs from "node:fs";
import path from "node:path";
import brandsJson from "@/data/brands.json";
import { brandSlug, getCategory, listRo, plural, productsOfBrand } from "@/lib/catalog";

type BrandInfo = { description?: string; website?: string };
const INFO = brandsJson as Record<string, BrandInfo>;

/** Client-supplied text for a brand, if any (src/data/brands.json). */
export function brandInfo(name: string): BrandInfo | undefined {
  const i = INFO[brandSlug(name)];
  return i && (i.description || i.website) ? i : undefined;
}

/** Logo path if public/branduri/<slug>.(svg|png|jpg) exists at build time. */
export function brandLogo(name: string): string | null {
  const slug = brandSlug(name);
  for (const ext of ["svg", "png", "jpg", "webp"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "branduri", `${slug}.${ext}`))) return `/branduri/${slug}.${ext}`;
  }
  return null;
}

/** Factual summary computed from the catalogue only. */
export function brandSummary(name: string): string {
  const list = productsOfBrand(name);
  const byCat = new Map<string, number>();
  for (const p of list) byCat.set(p.category, (byCat.get(p.category) ?? 0) + 1);
  const cats = Array.from(byCat)
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => `${(getCategory(c)?.name ?? c).charAt(0).toLowerCase()}${(getCategory(c)?.name ?? c).slice(1)} (${n})`);
  const sizes = Array.from(new Set(list.map((p) => p.size).filter((s): s is string => Boolean(s)))).sort((a, b) => a.localeCompare(b, "ro", { numeric: true }));
  const first = `${name} are în catalogul Detergino ${plural(list.length, "produs", "produse")}, în ${cats.length === 1 ? "categoria" : "categoriile"} ${listRo(cats)}.`;
  const second = sizes.length ? ` Ambalaje: ${sizes.join(", ")}.` : "";
  return first + second;
}
