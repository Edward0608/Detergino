"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { brandPath, type Product } from "@/lib/catalog";
import { ProductRail } from "@/components/product-rail";

export function BrandTabs({ tabs }: { tabs: { brand: string; products: Product[] }[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (tabs.length === 0) return null;
  const idx = Math.min(active, tabs.length - 1);
  const tab = tabs[idx];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const map: Record<string, number> = { ArrowRight: idx + 1, ArrowLeft: idx - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <h2 className="heading-xl text-center" aria-live="polite">
        {tab.brand}
      </h2>
      <div className="mb-8 mt-6 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Branduri">
        {tabs.map((t, i) => (
          <button
            key={t.brand}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-controls="brand-panel"
            id={`brand-tab-${i}`}
            tabIndex={i === idx ? 0 : -1}
            onKeyDown={onKey}
            onClick={() => setActive(i)}
            className={`chip h-11 px-5 text-[11px] font-semibold uppercase tracking-[0.12em] ${i === idx ? "chip-active" : ""}`}
          >
            {t.brand}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="brand-panel" aria-labelledby={`brand-tab-${idx}`}>
        <ProductRail products={tab.products} label={`Produse ${tab.brand}`} />
        <p className="mt-6 text-center">
          <Link href={brandPath(tab.brand)} className="btn-light min-w-[220px]">
            Toate produsele {tab.brand}
          </Link>
        </p>
      </div>
    </div>
  );
}
