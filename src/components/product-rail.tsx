"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { IconChevron } from "@/components/icons";

export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ overflow: false, atStart: true, atEnd: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      setState({ overflow, atStart: el.scrollLeft <= 1, atEnd: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [products]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className="relative">
      <ul ref={ref} className="rail flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-6" aria-label={label}>
        {products.map((p) => (
          <li key={p.slug} className="w-[72vw] max-w-[280px] shrink-0 snap-start sm:w-[44vw] md:w-[260px] lg:w-[280px]">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
      {state.overflow && (
        <>
          <button type="button" onClick={() => scrollBy(-1)} disabled={state.atStart} className="btn-icon absolute -left-3 top-[30%] hidden shadow-card disabled:opacity-30 md:inline-flex lg:-left-5" aria-label="Produsele anterioare">
            <IconChevron className="rotate-180" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={state.atEnd} className="btn-icon absolute -right-3 top-[30%] hidden shadow-card disabled:opacity-30 md:inline-flex lg:-right-5" aria-label="Produsele următoare">
            <IconChevron />
          </button>
        </>
      )}
    </div>
  );
}
