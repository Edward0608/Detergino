import { plural, type Product } from "@/lib/catalog";
import { SITE } from "@/lib/site";

function pack(p: Product): string {
  const k = p.packaging;
  const bits: string[] = [];
  if (k.bucBax) bits.push(`${plural(k.bucBax, "bucată", "bucăți")} per bax`);
  if (k.baxPal) bits.push(`${plural(k.baxPal, "bax", "baxuri")} per palet`);
  if (k.bucPalet) bits.push(`${plural(k.bucPalet, "bucată", "bucăți")} per palet`);
  return bits.length ? `Ambalare: ${bits.join(", ")}.` : "";
}

/** Factual, templated description built only from catalogue fields. */
export function describe(p: Product): string[] {
  const brand = p.brand ? ` ${p.brand}` : "";
  const variant = p.variant ? `, varianta ${p.variant}` : "";
  const size = p.size ? `, ambalaj de ${p.size}` : "";
  const washes = p.washes ? `, pentru aproximativ ${plural(p.washes, "spălare", "spălări")}` : "";
  const note = p.note ? ` (${p.note})` : "";
  const first = `${p.type}${brand}${variant}${size}${washes}${note}.`;
  const second = `Produs din catalogul en-gros ${SITE.name}, importat și distribuit de ${SITE.company}, ${SITE.city}.`;
  const third = pack(p);
  return [first, second, third].filter(Boolean);
}

export function metaDescription(p: Product): string {
  const d = describe(p);
  return `${d[0]} Fără prețuri afișate: cere ofertă pe WhatsApp la ${SITE.phoneDisplay}.`;
}
