"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { brandPath, categoryPath, getCategory, getGroup, groupPath, plural, productPath } from "@/lib/catalog";
import { describe } from "@/lib/describe";
import { SITE } from "@/lib/site";
import { useExtras } from "@/components/extras-provider";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGallery } from "@/components/product-gallery";
import { ProductActions } from "@/components/product-actions";
import { Barcode } from "@/components/barcode";
import { ShareRow } from "@/components/share-row";

/** Product page for items added from the admin: rendered in the browser from /api/catalog.php (/produs/?s=<slug>). */
export function ProductShell() {
  const slug = useSearchParams().get("s") ?? "";
  const { extras, loaded } = useExtras();
  const p = extras.find((x) => x.slug === slug);

  if (!loaded) return <div className="container-site py-20 text-center text-sm text-ink-soft">Se încarcă produsul…</div>;
  if (!p) {
    return (
      <div className="container-site py-20 text-center">
        <h1 className="heading-xl">Produsul nu a fost găsit</h1>
        <p className="mt-3 text-sm text-ink-soft">Este posibil să fi fost șters sau ascuns.</p>
        <Link href="/catalog/" className="btn-dark mt-6">
          Vezi catalogul
        </Link>
      </div>
    );
  }

  const cat = getCategory(p.category);
  const group = cat ? getGroup(cat.group) : undefined;
  const k = p.packaging ?? {};
  const gtin = p.barcode && /^(\d{8}|\d{12,14})$/.test(p.barcode) ? p.barcode : null;
  const subtitle = [p.size, p.washes ? plural(p.washes, "spălare", "spălări") : null, p.note].filter(Boolean).join(" · ");
  const rows: [string, number | null | undefined][] = [
    ["Bucăți per bax", k.bucBax],
    ["Baxuri per rând de palet", k.baxRand],
    ["Rânduri per palet", k.randPal],
    ["Baxuri per palet", k.baxPal],
    ["Bucăți per palet", k.bucPalet],
  ];
  const shown = rows.filter(([, v]) => v);

  return (
    <div className="container-site pt-6 pb-16">
      <Breadcrumbs
        items={[
          { label: "Catalog", href: "/catalog/" },
          ...(group ? [{ label: group.name, href: groupPath(group) }] : []),
          ...(cat ? [{ label: cat.name, href: categoryPath(cat) }] : []),
          { label: p.name },
        ]}
      />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <ProductGallery product={p} />
        <div>
          <h1 className="text-2xl font-medium leading-snug text-brand-navy md:text-3xl">{p.name}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {p.brand && (
              <>
                <Link href={brandPath(p.brand)} className="font-medium text-ink link-underline">
                  {p.brand}
                </Link>
                {subtitle && " · "}
              </>
            )}
            {subtitle}
          </p>
          {p.variant && (
            <p className="mt-3 text-sm text-ink-soft">
              Varianta: <span className="font-medium text-ink">{p.variant}</span>
            </p>
          )}
          <div className="mt-6">
            <ProductActions product={p} />
          </div>
          <div className="mt-8 space-y-3 text-sm leading-relaxed text-ink-soft">
            {describe(p).filter((t) => !t.startsWith("Ambalare:")).map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          {shown.length > 0 && (
            <table className="mt-6 w-full border-y border-line text-sm text-ink">
              <tbody>
                {shown.map(([label, v]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-soft">
                      {label}
                    </th>
                    <td className="py-2 text-right font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {gtin && (
            <figure className="mt-6">
              <Barcode code={gtin} className="h-auto max-w-[240px]" />
              <figcaption className="mt-2 text-xs text-muted">Cod de bare: {gtin}</figcaption>
            </figure>
          )}
          <div className="mt-8 border-t border-line pt-5">
            <ShareRow url={`${SITE.url}${productPath(p)}`} title={`${p.name}${p.size ? `, ${p.size}` : ""}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
