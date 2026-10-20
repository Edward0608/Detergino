import { SITE, whatsappUrl } from "@/lib/site";
import { productPath, type Product } from "@/lib/catalog";

/** Above this many lines the barcodes are dropped to keep the wa.me URL short. */
const COMPACT_ABOVE = 25;

function line(p: Product, qty: number, withCode: boolean): string {
  const bits = [p.name];
  if (p.size) bits.push(p.size);
  const head = bits.join(", ");
  const tail = withCode && p.barcode ? ` (cod ${p.barcode})` : "";
  return `${qty} buc. x ${head}${tail}`;
}

/** Single-product offer request. */
export function productOfferUrl(p: Product, qty = 1): string {
  const msg = `Bună! Aș dori o ofertă de preț pentru:\n• ${line(p, qty, true)}\n\n${SITE.url}${productPath(p)}`;
  return whatsappUrl(msg);
}

/** Multi-product offer request from the offer list. */
export function listOfferUrl(items: { product: Product; qty: number }[]): string {
  const withCode = items.length <= COMPACT_ABOVE;
  const lines = items.map((i) => `• ${line(i.product, i.qty, withCode)}`).join("\n");
  const msg = `Bună! Aș dori o ofertă de preț pentru următoarele produse:\n${lines}\n\nTrimis de pe ${SITE.url}`;
  return whatsappUrl(msg);
}

export function generalOfferUrl(): string {
  return whatsappUrl("Bună! Aș dori o ofertă de preț pentru produsele din catalogul Detergino.");
}

/* ---------- Email alternative (mailto:, CRLF line breaks per RFC 6068) ---------- */

function mailto(subject: string, bodyLines: string[]): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\r\n"))}`;
}

export function productOfferMailto(p: Product, qty = 1): string {
  return mailto(`Cerere ofertă: ${p.name}${p.size ? `, ${p.size}` : ""}`, [
    "Bună ziua,",
    "",
    "Aș dori o ofertă de preț pentru:",
    `- ${line(p, qty, true)}`,
    `${SITE.url}${productPath(p)}`,
    "",
    "Firma: [completați]",
    "Localitate: [completați]",
    "Telefon: [completați]",
    "",
    "Mulțumesc.",
  ]);
}

export function listOfferMailto(items: { product: Product; qty: number }[]): string {
  return mailto(`Cerere ofertă: ${items.length} produse din catalogul Detergino`, [
    "Bună ziua,",
    "",
    "Aș dori o ofertă de preț pentru următoarele produse:",
    ...items.map((i) => `- ${line(i.product, i.qty, true)}`),
    "",
    "Firma: [completați]",
    "Localitate: [completați]",
    "Telefon: [completați]",
    "",
    "Mulțumesc.",
  ]);
}
