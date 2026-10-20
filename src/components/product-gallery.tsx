"use client";

import { useState } from "react";
import { photoPanel, type Product } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";
import { IconChevron } from "@/components/icons";

export function ProductGallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const n = product.images.length;
  return (
    <div>
      <div className={`panel relative aspect-square overflow-hidden p-4 md:p-6 ${photoPanel(product, i)}`}>
        <ProductImage product={product} index={i} sizes="(min-width: 1024px) 50vw, 100vw" priority />
        {n > 1 && (
          <>
            <button type="button" onClick={() => setI((i - 1 + n) % n)} className="btn-icon absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 shadow-card" aria-label="Imaginea anterioară">
              <IconChevron className="rotate-180" />
            </button>
            <button type="button" onClick={() => setI((i + 1) % n)} className="btn-icon absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 shadow-card" aria-label="Imaginea următoare">
              <IconChevron />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <ul className="mt-3 flex gap-2" aria-label="Imagini">
          {product.images.map((img, k) => (
            <li key={img.src}>
              <button type="button" onClick={() => setI(k)} aria-label={`Imaginea ${k + 1}`} aria-current={k === i} className={`block h-16 w-16 overflow-hidden rounded-md border p-1 bg-white ${k === i ? "border-brand" : "border-line"}`}>
                <ProductImage product={product} index={k} sizes="64px" decorative />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
