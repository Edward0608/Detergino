"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { plural, productPath, searchProducts, sizeLabel } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";
import { IconSearch } from "@/components/icons";
import { track } from "@/lib/analytics";

export function SearchBox({ autoFocus = false, onNavigate }: { autoFocus?: boolean; onNavigate?: () => void }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const results = q.trim().length >= 2 ? searchProducts(q, 6) : [];
  const show = focused && q.trim().length >= 2;
  const listId = `${id}-results`;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = () => {
    const term = q.trim();
    if (!term) return;
    setFocused(false);
    onNavigate?.();
    track("Cautare", { termen: term.toLowerCase() });
    router.push(`/cautare/?q=${encodeURIComponent(term)}`);
  };

  return (
    <div
      ref={wrap}
      className="relative w-full"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex h-11 items-center gap-2 border-b border-line focus-within:border-brand"
      >
        <IconSearch className="shrink-0 text-brand" />
        <label htmlFor={id} className="sr-only">
          Caută un produs
        </label>
        <input
          id={id}
          type="search"
          autoComplete="off"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setFocused(false);
          }}
          placeholder="Caută un produs..."
          className="h-full w-full bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={show}
          aria-controls={listId}
          aria-haspopup="listbox"
        />
      </form>
      <p className="sr-only" role="status">
        {show ? (results.length === 0 ? "Niciun rezultat" : `${plural(results.length, "rezultat", "rezultate")}, apasă Enter pentru toate`) : ""}
      </p>
      {show && (
        <div id={listId} className="panel absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] overflow-hidden border border-line bg-white shadow-card md:w-[420px]">
          {results.length === 0 ? (
            <p className="p-4 text-sm text-ink-soft">Niciun produs pentru „{q.trim()}”.</p>
          ) : (
            <ul className="divide-y divide-line" aria-label="Sugestii">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={productPath(p)}
                    onClick={() => {
                      setFocused(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-surface"
                  >
                    <span className="block h-12 w-12 shrink-0 rounded-md bg-brand-50">
                      <ProductImage product={p} sizes="48px" decorative />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-medium leading-snug">{p.name}</span>
                      <span className="block text-xs text-muted">{sizeLabel(p)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={go} className="block w-full border-t border-line p-3 text-left text-xs uppercase tracking-wider hover:bg-surface">
            Vezi toate rezultatele pentru „{q.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
