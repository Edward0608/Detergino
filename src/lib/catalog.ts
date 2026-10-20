import data from "@/data/catalog.json";

export type Packaging = {
  bucBax?: number | null;
  baxRand?: number | null;
  randPal?: number | null;
  baxPal?: number | null;
  bucPalet?: number | null;
};

export type ProductImage = { src: string; px: number; /** White studio background kept (thin parts would be lost by cutout): show on white. */ opaque?: boolean };

export type Product = {
  slug: string;
  name: string;
  type: string;
  brand: string | null;
  variant: string | null;
  family: string;
  category: string;
  size: string | null;
  washes: number | null;
  barcode: string | null;
  packaging: Packaging;
  note: string | null;
  images: ProductImage[];
  source: { pdf: string; page: number };
  /** Added from the admin at runtime (not part of the static build). */
  extra?: boolean;
};

export type Category = { slug: string; name: string; group: string };
export type Group = { slug: string; name: string };

type Catalog = {
  groups: Record<string, string>;
  categories: Record<string, { name: string; group: string }>;
  products: Product[];
};

const catalog = data as unknown as Catalog;

export const products: Product[] = catalog.products;

export const groups: Group[] = Object.entries(catalog.groups).map(([slug, name]) => ({ slug, name }));

export const categories: Category[] = Object.entries(catalog.categories).map(([slug, c]) => ({
  slug,
  name: c.name,
  group: c.group,
}));

export function getGroup(slug: string): Group | undefined {
  return groups.find((g) => g.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Products added from the admin, loaded in the browser from /api/catalog.php. */
let extraProducts: Product[] = [];

export function setExtraProducts(list: Product[]): void {
  extraProducts = list;
}

export type Scope = { group?: string; category?: string; brand?: string };

/** Does a runtime product belong to a catalogue page (group, category or brand)? An empty scope matches everything. */
export function matchesScope(p: Product, scope: Scope): boolean {
  if (scope.category && p.category !== scope.category) return false;
  if (scope.group && getCategory(p.category)?.group !== scope.group) return false;
  if (scope.brand && p.brand !== scope.brand) return false;
  return true;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug) ?? extraProducts.find((p) => p.slug === slug);
}

export function categoriesOfGroup(group: string): Category[] {
  return categories.filter((c) => c.group === group);
}

export function productsOfCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function productsOfGroup(group: string): Product[] {
  const cats = new Set(categoriesOfGroup(group).map((c) => c.slug));
  return products.filter((p) => cats.has(p.category));
}

export function productsOfBrand(brand: string): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function brandSlug(brand: string): string {
  return brand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const brands: { name: string; slug: string; count: number }[] = Array.from(
  products.reduce((m, p) => {
    if (p.brand) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
    return m;
  }, new Map<string, number>()),
)
  .map(([name, count]) => ({ name, slug: brandSlug(name), count }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ro"));

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function brandsOfGroup(group: string): string[] {
  const set = new Set<string>();
  for (const p of productsOfGroup(group)) if (p.brand) set.add(p.brand);
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ro"));
}

/** Products in the same family (same type + brand). */
export function familyOf(product: Product): Product[] {
  return products.filter((p) => p.family === product.family && p.slug !== product.slug);
}

/** Other scents/variants at the same size. */
export function variantSiblings(product: Product): Product[] {
  return products.filter(
    (p) => p.family === product.family && p.size === product.size && p.variant !== product.variant,
  );
}

/** Other sizes of the same variant. */
export function sizeSiblings(product: Product): Product[] {
  return products.filter(
    (p) => p.family === product.family && p.variant === product.variant && p.size !== product.size,
  );
}

/** Numeric weight of a size label for sorting: "0,5 L" < "1 L" < "4 L"; "1 x 50 g" < "4 x 50 g". */
export function sizeValue(size: string): number {
  const nums = size.match(/\d+(?:[.,]\d+)?/g)?.map((n) => parseFloat(n.replace(",", "."))) ?? [];
  const qty = nums.reduce((a, b) => a * b, 1);
  return /\b(l|kg)\b/i.test(size) ? qty * 1000 : qty;
}

/** Smallest and largest size among the products, or nulls when the units differ (no sense comparing 50 g with 400 ml). */
export function sizeRange(list: Product[]): [string | null, string | null] {
  const sizes = list.map((p) => p.size).filter((x): x is string => Boolean(x));
  const units = new Set(sizes.map((x) => x.split(" ").pop()?.toLowerCase()));
  if (sizes.length < 2 || units.size !== 1) return [null, null];
  const sorted = [...sizes].sort((a, b) => sizeValue(a) - sizeValue(b));
  return [sorted[0], sorted[sorted.length - 1]];
}

/** A size label fit for prose: "72 buc" becomes "72 de bucăți", "2 L" stays "2 L". */
export function sizeText(size: string): string {
  const m = size.match(/^(\d+) buc$/);
  return m ? plural(Number(m[1]), "bucată", "bucăți") : size;
}

/** Every variant of the family at this size, in catalogue order, the product itself included. */
export function variantOptions(product: Product): Product[] {
  return products.filter((p) => p.family === product.family && p.size === product.size && p.variant);
}

/** Every size of this variant, smallest first, the product itself included. */
export function sizeOptions(product: Product): Product[] {
  return products
    .filter((p) => p.family === product.family && p.variant === product.variant && p.size)
    .sort((a, b) => sizeValue(a.size as string) - sizeValue(b.size as string));
}

/** Tailwind classes for a catalogue group's colour: light tint for panels, ink for dots and accents. Literal class names so Tailwind can see them. */
const GROUP_TINTS: Record<string, { bg: string; dot: string; ink: string; border: string }> = {
  rufe: { bg: "bg-g-rufe", dot: "bg-g-rufe-ink", ink: "text-g-rufe-ink", border: "hover:border-g-rufe-ink" },
  "vase-pardoseli": { bg: "bg-g-vase-pardoseli", dot: "bg-g-vase-pardoseli-ink", ink: "text-g-vase-pardoseli-ink", border: "hover:border-g-vase-pardoseli-ink" },
  odorizante: { bg: "bg-g-odorizante", dot: "bg-g-odorizante-ink", ink: "text-g-odorizante-ink", border: "hover:border-g-odorizante-ink" },
  curatenie: { bg: "bg-g-curatenie", dot: "bg-g-curatenie-ink", ink: "text-g-curatenie-ink", border: "hover:border-g-curatenie-ink" },
  "servetele-umede": { bg: "bg-g-servetele-umede", dot: "bg-g-servetele-umede-ink", ink: "text-g-servetele-umede-ink", border: "hover:border-g-servetele-umede-ink" },
  cosmetice: { bg: "bg-g-cosmetice", dot: "bg-g-cosmetice-ink", ink: "text-g-cosmetice-ink", border: "hover:border-g-cosmetice-ink" },
  dulciuri: { bg: "bg-g-dulciuri", dot: "bg-g-dulciuri-ink", ink: "text-g-dulciuri-ink", border: "hover:border-g-dulciuri-ink" },
};
const DEFAULT_TINT = { bg: "bg-brand-50", dot: "bg-brand", ink: "text-brand", border: "hover:border-brand" };

export function groupTint(groupSlug: string | undefined): { bg: string; dot: string; ink: string; border: string } {
  return (groupSlug && GROUP_TINTS[groupSlug]) || DEFAULT_TINT;
}

export function productTint(product: Product) {
  return groupTint(getCategory(product.category)?.group);
}

/** Panel classes behind a product photo: always white with a hairline, so cutouts and studio photos look the same. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function photoPanel(_product?: Product, _index?: number): string {
  return "bg-white ring-1 ring-inset ring-line";
}

export function groupOfProduct(product: Product): Group | undefined {
  const cat = getCategory(product.category);
  return cat ? getGroup(cat.group) : undefined;
}

export function productPath(p: Product): string {
  return p.extra ? `/produs/?s=${encodeURIComponent(p.slug)}` : `/produse/${p.slug}/`;
}

export function categoryPath(c: Category): string {
  return `/catalog/${c.group}/${c.slug}/`;
}

export function groupPath(g: Group): string {
  return `/catalog/${g.slug}/`;
}

export function brandPath(name: string): string {
  return `/branduri/${brandSlug(name)}/`;
}

/** Display label for the card subtitle: "5 L · 125 de spălări" */
export function sizeLabel(p: Product): string {
  const parts: string[] = [];
  if (p.size) parts.push(p.size);
  if (p.washes) parts.push(plural(p.washes, "spălare", "spălări"));
  if (p.note) parts.push(p.note);
  return parts.join(" · ");
}

/** Lowercase only the first letter, keeping acronyms such as "WC". */
export function firstLower(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** "a, b și c" */
export function listRo(items: string[]): string {
  return new Intl.ListFormat("ro", { type: "conjunction" }).format(items);
}

function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function searchProducts(query: string, limit = 50): Product[] {
  const q = fold(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = [...products, ...extraProducts]
    .map((p) => {
      const hay = fold([p.name, p.brand ?? "", p.variant ?? "", p.size ?? "", p.barcode ?? "", getCategory(p.category)?.name ?? ""].join(" "));
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += fold(p.name).startsWith(t) ? 3 : fold(p.name).includes(t) ? 2 : 1;
      }
      return { p, score };
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name, "ro"));
  return scored.slice(0, limit).map((x) => x.p);
}

export function sortByName(list: Product[]): Product[] {
  return [...list].sort((a, b) => a.name.localeCompare(b.name, "ro") || (a.size ?? "").localeCompare(b.size ?? "", "ro", { numeric: true }));
}

/** Romanian count label: "1 produs", "12 produse", "37 de produse", "101 produse". */
export function plural(n: number, one: string, many: string): string {
  if (n === 1) return `1 ${one}`;
  const last = n % 100;
  const de = n >= 20 && !(last >= 1 && last <= 19);
  return `${n}${de ? " de" : ""} ${many}`;
}
