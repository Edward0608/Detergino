"use client";

import Link from "next/link";
import { getCategory, getGroup, listRo, photoPanel, productPath, productTint, sizeLabel, sizeOptions, variantOptions, type Product } from "@/lib/catalog";
import { productOfferUrl } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ProductImage } from "@/components/product-image";
import { IconCheck, IconList, IconWhatsApp } from "@/components/icons";
import { useOfferList } from "@/components/offer-list";

export function ProductCard({ product, priority = false, headingLevel = 3 }: { product: Product; priority?: boolean; headingLevel?: 2 | 3 }) {
  const { add, has, hydrated } = useOfferList();
  const inList = hydrated && has(product.slug);
  const href = productPath(product);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  // Kiko shows the other shades as swatches under the name; here the swatches are the sibling variants' packshots.
  const variants = product.variant ? variantOptions(product) : [];
  const sizes = !product.variant && product.size ? sizeOptions(product) : [];
  const SHOW = 4;
  const tint = productTint(product);
  const group = getGroup(getCategory(product.category)?.group ?? "");

  return (
    <article className="group/card flex h-full flex-col">
      <Link
        href={href}
        className={`panel block aspect-square overflow-hidden p-3 transition-all duration-300 group-hover/card:-translate-y-1 group-hover/card:shadow-card motion-reduce:transition-none motion-reduce:group-hover/card:translate-y-0 ${photoPanel(product)}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className="block h-full w-full transition-transform duration-300 group-hover/card:scale-105 motion-reduce:transition-none">
          <ProductImage product={product} priority={priority} decorative />
        </span>
      </Link>
      <div className="flex flex-1 flex-col items-center px-1 pt-3 text-center">
        {group && <span className={`mb-1.5 inline-flex h-5 max-w-full items-center truncate whitespace-nowrap rounded-pill px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white ${tint.dot}`}>{group.name}</span>}
        <Heading className="text-sm font-semibold leading-snug">
          <Link href={href} className="link-underline">
            {product.name}
          </Link>
        </Heading>
        <p className="mt-1 text-xs text-muted">{sizeLabel(product) || " "}</p>
        {product.variant && (
          <div className="mt-2 flex flex-col items-center gap-1.5">
            <span className="text-xs font-medium text-ink">{product.variant}</span>
            {variants.length > 1 && (
              <ul className="flex items-center gap-1" aria-label={`Variante: ${listRo(variants.map((v) => v.variant ?? ""))}`}>
                {variants.slice(0, SHOW).map((v) =>
                  v.slug === product.slug ? (
                    <li key={v.slug}>
                      <span className="block h-7 w-7 overflow-hidden rounded-pill border-2 border-brand bg-white p-0.5" aria-current="true" title={v.variant ?? undefined}>
                        <ProductImage product={v} sizes="28px" decorative />
                      </span>
                    </li>
                  ) : (
                    <li key={v.slug}>
                      <Link
                        href={productPath(v)}
                        className="block h-7 w-7 overflow-hidden rounded-pill border border-line bg-white p-0.5 transition-all duration-150 hover:scale-110 hover:border-brand motion-reduce:transition-none"
                        aria-label={`${product.name}, varianta ${v.variant}`}
                        title={v.variant ?? undefined}
                      >
                        <ProductImage product={v} sizes="28px" decorative />
                      </Link>
                    </li>
                  ),
                )}
                {variants.length > SHOW && <li className="text-[11px] font-medium text-muted">+{variants.length - SHOW}</li>}
              </ul>
            )}
          </div>
        )}
        {sizes.length > 1 && (
          <ul className="mt-2 flex flex-wrap justify-center gap-1" aria-label="Ambalaje disponibile">
            {sizes.slice(0, SHOW).map((x) => (
              <li key={x.slug}>
                {x.slug === product.slug ? (
                  <span className="chip chip-active h-7 px-2.5 text-[11px] font-semibold" aria-current="true">
                    {x.size}
                  </span>
                ) : (
                  <Link href={productPath(x)} className="chip h-7 px-2.5 text-[11px] font-semibold" aria-label={`${product.name}, ${x.size}`}>
                    {x.size}
                  </Link>
                )}
              </li>
            ))}
            {sizes.length > SHOW && <li className="self-center text-[11px] font-medium text-muted">+{sizes.length - SHOW}</li>}
          </ul>
        )}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <a
          href={productOfferUrl(product)}
          target="_blank"
          rel="noopener"
          className="btn-dark min-w-0 flex-1 whitespace-normal px-3 text-center text-[10px] leading-tight sm:flex-none sm:px-4 sm:text-[11px]"
          aria-label={`Cere ofertă pe WhatsApp pentru ${product.name}`}
          onClick={() => track("Cere oferta", { produs: product.slug, canal: "whatsapp", sursa: "card" })}
        >
          <IconWhatsApp width={16} height={16} className="hidden shrink-0 sm:block" />
          Cere ofertă
        </a>
        <button
          type="button"
          onClick={() => {
            add(product.slug);
            track("Adauga in lista", { produs: product.slug, sursa: "card" });
          }}
          className={`btn-icon shrink-0 ${inList ? "border-ink bg-ink text-white hover:bg-ink" : ""}`}
          aria-label={inList ? `${product.name} este în lista de ofertă; adaugă încă o bucată` : `Adaugă ${product.name} în lista de ofertă`}
          title={inList ? "În lista de ofertă" : "Adaugă în lista de ofertă"}
        >
          {inList ? <IconCheck /> : <IconList width={20} height={20} />}
        </button>
      </div>
    </article>
  );
}
