"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import Link from "next/link";
import { getProduct, productPath, sizeLabel } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";
import { IconPause, IconPlay } from "@/components/icons";

/** Kiko-style mini selector: pause button + thumbnails that swap the featured product. `photos` maps a slug to a pre-rendered studio photo (scripts/studio-photo.py). */
export function FeaturedPicker({ slugs, tint, photos = {} }: { slugs: string[]; tint: string; photos?: Record<string, string> }) {
  const prods = slugs.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const held = useRef(false);
  const n = prods.length;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!playing || reduced || n < 2) return;
    const t = window.setTimeout(() => {
      if (!held.current) setI((x) => (x + 1) % n);
    }, 5000);
    return () => window.clearTimeout(t);
  }, [playing, reduced, n, i]);

  if (n === 0) return null;
  const p = prods[i];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.5fr] md:items-center" onMouseEnter={() => (held.current = true)} onMouseLeave={() => (held.current = false)}>
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center gap-2 md:justify-start" role="group" aria-label="Alege produsul prezentat">
          <button type="button" onClick={() => setPlaying(!playing)} className="btn-icon" aria-label={playing ? "Oprește schimbarea automată" : "Pornește schimbarea automată"}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          {prods.map((x, k) => (
            <button
              key={x.slug}
              type="button"
              onClick={() => setI(k)}
              aria-label={x.name}
              aria-current={k === i ? "true" : undefined}
              className={`h-11 w-11 overflow-hidden rounded-pill border-2 bg-white p-1 ${k === i ? "border-brand" : "border-line"}`}
            >
              <ProductImage product={x} sizes="44px" decorative />
            </button>
          ))}
        </div>
        <p className="mt-5 text-2xl font-semibold leading-tight text-brand-navy md:text-3xl" aria-live="polite">
          {p.name}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{sizeLabel(p)}</p>
        <Link href={productPath(p)} className="btn-light mt-5 min-w-[200px]">
          Vezi produsul
        </Link>
      </div>
      <Link href={productPath(p)} tabIndex={-1} aria-hidden="true" className={`panel relative flex aspect-square items-end justify-center overflow-hidden px-2 pt-2 ${tint}`}>
        {photos[p.slug] ? (
          /* All photos stay mounted and cross-fade, so switching never shows an empty panel while the next one decodes. */
          prods.map((x, k) =>
            photos[x.slug] ? (
              <Image key={x.slug} src={photos[x.slug]} alt="" fill loading="eager" sizes="(min-width: 768px) 40vw, 90vw" className={`object-cover transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-0"}`} />
            ) : null,
          )
        ) : (
          <span className="block aspect-square w-full [filter:drop-shadow(0_18px_18px_rgba(11,42,91,0.25))]">
            <ProductImage product={p} sizes="(min-width: 768px) 40vw, 90vw" decorative />
          </span>
        )}
      </Link>
    </div>
  );
}
