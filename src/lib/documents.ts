import fs from "node:fs";
import path from "node:path";
import type { Product } from "@/lib/catalog";

/**
 * Build-time scan of public/documente: a PDF named "<slug>-fisa-tehnica.pdf" or
 * "<cod de bare>-declaratie-conformitate.pdf" is listed on that product's page.
 * Only used from server components (static export renders at build time).
 */
const DIR = path.join(process.cwd(), "public", "documente");
const KINDS: [string, string][] = [
  ["fisa-tehnica", "Fișă tehnică"],
  ["declaratie-conformitate", "Declarație de conformitate"],
  ["fisa-securitate", "Fișă cu date de securitate"],
  ["certificat", "Certificat"],
  ["prospect", "Prospect"],
];

export type ProductDocument = { title: string; href: string; sizeKb: number };

export function documentsFor(p: Product): ProductDocument[] {
  if (!fs.existsSync(DIR)) return [];
  const keys = [p.slug, p.barcode].filter((k): k is string => Boolean(k));
  return fs
    .readdirSync(DIR)
    .filter((f) => /\.pdf$/i.test(f))
    .filter((f) => keys.some((k) => f === `${k}.pdf` || f.startsWith(`${k}-`)))
    .sort()
    .map((f) => {
      const stem = f.replace(/\.pdf$/i, "");
      const suffix = keys.reduce((s, k) => (s.startsWith(k) ? s.slice(k.length).replace(/^-/, "") : s), stem);
      const kind = KINDS.find(([k]) => suffix.startsWith(k));
      const title = kind ? kind[1] : suffix ? suffix.replace(/-/g, " ") : "Document";
      const sizeKb = Math.round(fs.statSync(path.join(DIR, f)).size / 1024);
      return { title, href: `/documente/${encodeURIComponent(f)}`, sizeKb };
    });
}
