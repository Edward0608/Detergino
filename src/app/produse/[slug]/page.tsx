import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  brandPath,
  categoryPath,
  familyOf,
  getCategory,
  getProduct,
  groupOfProduct,
  groupPath,
  plural,
  productPath,
  products,
  productsOfCategory,
  sizeOptions,
  sizeSiblings,
  variantOptions,
  variantSiblings,
} from "@/lib/catalog";
import { describe, metaDescription } from "@/lib/describe";
import { documentsFor } from "@/lib/documents";
import { SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductGallery } from "@/components/product-gallery";
import { ProductActions } from "@/components/product-actions";
import { ProductRail } from "@/components/product-rail";
import { IconBox, IconChevronDown, IconFile, IconPallet } from "@/components/icons";
import { ProductImage } from "@/components/product-image";
import { Barcode } from "@/components/barcode";
import { ShareRow } from "@/components/share-row";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name}${p.size ? `, ${p.size}` : ""}`,
    description: metaDescription(p),
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: SITE.name,
      url: `${SITE.url}${productPath(p)}`,
      title: `${p.name}${p.size ? `, ${p.size}` : ""} | ${SITE.name}`,
      description: metaDescription(p),
      images: [{ url: `/og/${p.slug}.jpg`, width: 1200, height: 630, alt: p.name }],
    },
    twitter: { card: "summary_large_image" },
  };
}

function PackRow({ label, value }: { label: string; value?: number | null }) {
  if (!value) return null;
  return (
    <tr className="border-b border-line">
      <th scope="row" className="py-2 pr-4 text-left font-normal text-ink-soft">
        {label}
      </th>
      <td className="py-2 text-right font-medium">{value}</td>
    </tr>
  );
}

function Accordion({ title, open = false, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] font-semibold uppercase tracking-[0.14em]">
        {title}
        <IconChevronDown className="transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: PageProps<"/produse/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const group = groupOfProduct(p);
  const variants = variantSiblings(p);
  const sizes = sizeSiblings(p);
  const variantOpts = variantOptions(p);
  const sizeOpts = sizeOptions(p);
  const family = familyOf(p).filter((x) => !variants.includes(x) && !sizes.includes(x));
  const related = productsOfCategory(p.category).filter((x) => x.family !== p.family).slice(0, 12);
  const paragraphs = describe(p);
  const intro = paragraphs.filter((t) => !t.startsWith("Ambalare:"));
  const docs = documentsFor(p);
  const k = p.packaging;
  const gtin = p.barcode && /^(\d{8}|\d{12,14})$/.test(p.barcode) ? p.barcode : null;
  const subtitle = [p.size, p.washes ? plural(p.washes, "spălare", "spălări") : null, p.note].filter(Boolean).join(" · ");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    ...(p.images[0] ? { image: `${SITE.url}${p.images[0].src}` } : {}),
    description: paragraphs.join(" "),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(gtin ? { gtin } : {}),
    url: `${SITE.url}${productPath(p)}`,
  };

  return (
    <div className="container-site pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "Catalog", href: "/catalog/" },
          ...(group ? [{ label: group.name, href: groupPath(group) }] : []),
          ...(cat ? [{ label: cat.name, href: categoryPath(cat) }] : []),
          { label: p.name },
        ]}
      />

      {/* Kiko's product block: title column, gallery, then the variant/CTA/accordion panel. */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[0.8fr_1.3fr_1fr] lg:gap-10 xl:gap-14">
        <div className="order-2 lg:order-1">
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
          {p.variant && <p className="mt-4 text-sm text-ink-soft">Varianta: <span className="font-medium text-ink">{p.variant}</span></p>}

          {/* Desktop only: the description, the packing facts and the share row fill the title column. On phones they stay below the CTA. */}
          <div className="mt-6 hidden space-y-3 text-sm leading-relaxed text-ink-soft lg:block">
            {intro.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          {(k.bucBax || k.baxPal || k.bucPalet || p.barcode) && (
            <dl className="mt-6 hidden grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-line pt-5 text-sm lg:grid">
              {k.bucBax && (
                <>
                  <dt className="whitespace-nowrap text-muted">Bax</dt>
                  <dd className="font-medium">{plural(k.bucBax, "bucată", "bucăți")}</dd>
                </>
              )}
              {k.baxPal ? (
                <>
                  <dt className="whitespace-nowrap text-muted">Palet</dt>
                  <dd className="font-medium">{plural(k.baxPal, "bax", "baxuri")}</dd>
                </>
              ) : k.bucPalet ? (
                <>
                  <dt className="whitespace-nowrap text-muted">Palet</dt>
                  <dd className="font-medium">{plural(k.bucPalet, "bucată", "bucăți")}</dd>
                </>
              ) : null}
              {p.barcode && (
                <>
                  <dt className="whitespace-nowrap text-muted">Cod de bare</dt>
                  <dd className="font-mono font-medium tracking-wider">{p.barcode}</dd>
                </>
              )}
            </dl>
          )}
          <p className="mt-4 hidden text-sm lg:block">
            <a href="#fisa-produs" className="link-underline">
              Vezi fișa completă a produsului
            </a>
          </p>
          <div className="mt-8 hidden border-t border-line pt-5 lg:block">
            <ShareRow url={`${SITE.url}${productPath(p)}`} title={`${p.name}${p.size ? `, ${p.size}` : ""}`} />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <ProductGallery product={p} />
        </div>

        <div className="order-3">
          {(variantOpts.length > 1 || p.variant) && (
            <div id="variante">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Varianta: {p.variant}</h2>
                {variantOpts.length > 1 && cat && (
                  <Link href={categoryPath(cat)} className="text-xs text-ink-soft link-underline">
                    Toate variantele ({variantOpts.length})
                  </Link>
                )}
              </div>
              {variantOpts.length > 1 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {variantOpts.map((v) => {
                    const thumb = (
                      <span className="block h-8 w-8 overflow-hidden rounded-pill bg-white p-0.5">
                        <ProductImage product={v} sizes="32px" decorative />
                      </span>
                    );
                    return (
                      <li key={v.slug}>
                        {v.slug === p.slug ? (
                          <span className="chip chip-active h-11 pl-1.5" aria-current="true">
                            {thumb}
                            {v.variant}
                          </span>
                        ) : (
                          <Link href={productPath(v)} className="chip h-11 pl-1.5">
                            {thumb}
                            {v.variant}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {sizeOpts.length > 1 && (
            <div className="mt-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Ambalaj: {p.size}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sizeOpts.map((s) => (
                  <li key={s.slug}>
                    {s.slug === p.slug ? (
                      <span className="chip chip-active h-11 px-5 font-semibold" aria-current="true">
                        {s.size}
                      </span>
                    ) : (
                      <Link href={productPath(s)} className="chip h-11 px-5 font-semibold">
                        {s.size}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={variantOpts.length > 1 || p.variant || sizeOpts.length > 1 ? "mt-6" : ""}>
            <ProductActions product={p} />
          </div>

          <div className="mt-8 border-t border-line lg:hidden">
            <Accordion title="Descriere" open>
              <div className="space-y-3">
                {paragraphs.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </Accordion>
          </div>
          <div className="divide-y divide-line border-y border-line lg:mt-8">
            <Accordion title="Ambalare și logistică">
              <table className="w-full text-ink">
                <tbody>
                  <PackRow label="Bucăți per bax" value={k.bucBax} />
                  <PackRow label="Baxuri per rând de palet" value={k.baxRand} />
                  <PackRow label="Rânduri per palet" value={k.randPal} />
                  <PackRow label="Baxuri per palet" value={k.baxPal} />
                  <PackRow label="Bucăți per palet" value={k.bucPalet} />
                </tbody>
              </table>
              {!k.bucBax && !k.baxPal && !k.bucPalet && <p>Detaliile de ambalare se comunică la cererea de ofertă.</p>}
            </Accordion>
            {docs.length > 0 && (
              <Accordion title="Documente" open>
                <ul className="space-y-2">
                  {docs.map((doc) => (
                    <li key={doc.href}>
                      <a href={doc.href} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-ink underline underline-offset-4">
                        <IconFile />
                        {doc.title} <span className="text-xs text-muted">(PDF, {doc.sizeKb} KB)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}
            <Accordion title="Cum primești prețul">
              <p>
                Apasă „Cere ofertă pe WhatsApp”: se deschide o conversație cu {SITE.phoneDisplay}, cu numele produsului și codul de bare deja completate. Răspundem cu prețul pentru bax și palet. Poți scrie și pe email la{" "}
                <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-4">
                  {SITE.email}
                </a>
                .
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Fișă produs: the spec sheet a buyer needs for reception and stock software. */}
      <section className="mt-12 border-t-2 border-brand-navy md:mt-16" aria-labelledby="fisa-produs">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-4">
          <h2 id="fisa-produs" className="text-base font-semibold uppercase tracking-[0.12em] text-brand-navy">
            Fișă produs
          </h2>
          <p className="text-xs text-muted">
            Importator: {SITE.company}, {SITE.city}
          </p>
        </div>
        <div className="grid gap-8 py-6 md:grid-cols-[1fr_auto] md:items-center">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted">Marcă</dt>
              <dd className="mt-1 font-medium">{p.brand ? <Link href={brandPath(p.brand)} className="underline underline-offset-4">{p.brand}</Link> : "Nespecificată"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Tip</dt>
              <dd className="mt-1 font-medium">{p.type}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Cantitate</dt>
              <dd className="mt-1 font-medium">{subtitle || "La cerere"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Ambalare</dt>
              <dd className="mt-1 font-medium">
                {k.bucBax ? `Bax de ${plural(k.bucBax, "bucată", "bucăți")}` : "La cerere"}
                {k.baxPal ? `, palet de ${plural(k.baxPal, "bax", "baxuri")}` : k.bucPalet ? `, palet de ${plural(k.bucPalet, "bucată", "bucăți")}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Cod de bare {p.barcode && (p.barcode.length === 13 ? "(EAN-13)" : p.barcode.length === 12 ? "(UPC-A)" : "")}</dt>
              <dd className="mt-1 font-mono font-medium tracking-wider">{p.barcode ?? "La cerere"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Categorie</dt>
              <dd className="mt-1 font-medium">{cat ? <Link href={categoryPath(cat)} className="underline underline-offset-4">{cat.name}</Link> : "Nespecificată"}</dd>
            </div>
          </dl>
          {gtin && (
            <figure className="justify-self-center text-center md:justify-self-end">
              <Barcode code={gtin} className="h-auto max-w-[240px]" />
              <figcaption className="mt-2 max-w-[240px] text-xs text-muted">Codul de bare de pe ambalaj, pentru recepție și sistemul de gestiune.</figcaption>
            </figure>
          )}
        </div>
        {(k.bucBax || k.baxPal || k.bucPalet) && (
          <ul className="flex flex-wrap gap-x-10 gap-y-3 border-y border-line py-4 text-xs uppercase tracking-[0.12em] text-ink-soft" aria-label="Ambalare pe scurt">
            {k.bucBax && (
              <li className="flex items-center gap-3">
                <IconBox className="text-brand" />
                <span>
                  <span className="font-semibold text-ink">{k.bucBax}</span> buc. / bax
                </span>
              </li>
            )}
            {k.baxPal && (
              <li className="flex items-center gap-3">
                <IconPallet className="text-brand" />
                <span>
                  <span className="font-semibold text-ink">{k.baxPal}</span> baxuri / palet
                </span>
              </li>
            )}
            {!k.baxPal && k.bucPalet && (
              <li className="flex items-center gap-3">
                <IconPallet className="text-brand" />
                <span>
                  <span className="font-semibold text-ink">{k.bucPalet}</span> buc. / palet
                </span>
              </li>
            )}
          </ul>
        )}
      </section>

      <div className="mt-6 border-b border-line pb-6 lg:hidden">
        <ShareRow url={`${SITE.url}${productPath(p)}`} title={`${p.name}${p.size ? `, ${p.size}` : ""}`} />
      </div>

      {family.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="heading-xl text-center">Din aceeași gamă</h2>
          <div className="mt-8">
            <ProductRail products={family.slice(0, 12)} label="Produse din aceeași gamă" />
          </div>
        </section>
      )}
      {related.length > 0 && cat && (
        <section className="mt-16 md:mt-24">
          <h2 className="heading-xl text-center">Alte produse din categoria „{cat.name}”</h2>
          <div className="mt-8">
            <ProductRail products={related} label={`Alte produse din categoria ${cat.name}`} />
          </div>
          <p className="mt-6 text-center">
            <Link href={categoryPath(cat)} className="btn-light min-w-[220px]">
              Toată categoria
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
