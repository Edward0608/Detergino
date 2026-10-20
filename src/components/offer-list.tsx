"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { getProduct, plural, productPath, sizeLabel, type Product } from "@/lib/catalog";
import { listOfferMailto, listOfferUrl } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { useDialog } from "@/lib/use-dialog";
import { ProductImage } from "@/components/product-image";
import { QtyField, clampQty } from "@/components/qty-field";
import { IconClose, IconList, IconMail, IconTrash, IconWhatsApp } from "@/components/icons";

type Item = { slug: string; qty: number };

type Ctx = {
  items: Item[];
  /** Number of distinct products. */
  count: number;
  /** Sum of quantities. */
  pieces: number;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  hydrated: boolean;
};

const OfferListContext = createContext<Ctx | null>(null);
const KEY = "detergino:lista-oferta";
const EMPTY: Item[] = [];

/* Tiny external store so the list can be read with useSyncExternalStore
   (server snapshot: empty; client snapshot: localStorage). */
const listeners = new Set<() => void>();
let state: Item[] = EMPTY;
let loaded = false;

function normalise(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return EMPTY;
  const seen = new Set<string>();
  const out: Item[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const { slug, qty } = x as { slug?: unknown; qty?: unknown };
    if (typeof slug !== "string" || seen.has(slug) || !getProduct(slug)) continue;
    const q = typeof qty === "number" && Number.isInteger(qty) && qty >= 1 && qty <= 999 ? qty : 1;
    seen.add(slug);
    out.push({ slug, qty: q });
  }
  return out;
}
function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = normalise(JSON.parse(raw));
  } catch {
    /* storage unavailable or corrupt */
  }
}
function getSnapshot(): Item[] {
  load();
  return state;
}
function getServerSnapshot(): Item[] {
  return EMPTY;
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
function commit(next: Item[]) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}
const noop = () => () => {};
function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function OfferListProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);

  const add = useCallback((slug: string, qty = 1) => {
    const prev = getSnapshot();
    const q = clampQty(qty);
    const i = prev.findIndex((x) => x.slug === slug);
    if (i === -1) commit([...prev, { slug, qty: q }]);
    else {
      const next = [...prev];
      next[i] = { slug, qty: clampQty(next[i].qty + q) };
      commit(next);
    }
    setOpen(true);
  }, []);
  const remove = useCallback((slug: string) => commit(getSnapshot().filter((x) => x.slug !== slug)), []);
  const setQty = useCallback((slug: string, qty: number) => {
    commit(getSnapshot().map((x) => (x.slug === slug ? { ...x, qty: clampQty(qty) } : x)));
  }, []);
  const clear = useCallback(() => commit([]), []);
  const has = useCallback((slug: string) => items.some((x) => x.slug === slug), [items]);
  const count = items.length;
  const pieces = items.reduce((n, i) => n + i.qty, 0);

  const value = useMemo<Ctx>(
    () => ({ items, count, pieces, add, remove, setQty, clear, has, open, setOpen, hydrated }),
    [items, count, pieces, add, remove, setQty, clear, has, open, hydrated],
  );

  return (
    <OfferListContext.Provider value={value}>
      {children}
      <OfferDrawer />
    </OfferListContext.Provider>
  );
}

export function useOfferList(): Ctx {
  const ctx = useContext(OfferListContext);
  if (!ctx) throw new Error("useOfferList must be used inside OfferListProvider");
  return ctx;
}

export function resolveItems(items: Item[]): { product: Product; qty: number }[] {
  return items
    .map((i) => ({ product: getProduct(i.slug), qty: i.qty }))
    .filter((x): x is { product: Product; qty: number } => Boolean(x.product));
}

export function OfferListRows({ compact = false }: { compact?: boolean }) {
  const { items, setQty, remove, pieces, setOpen } = useOfferList();
  const rows = resolveItems(items);
  const leave = () => setOpen(false);
  if (rows.length === 0) {
    return (
      <div className="animate-rise py-12 text-center motion-reduce:animate-none">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-pill bg-brand-50 text-brand">
          <IconList width={24} height={24} />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink">Lista de ofertă este goală.</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-ink-soft">Adaugă produse din catalog, apoi trimite-le pe WhatsApp într-un singur mesaj.</p>
        <Link href="/catalog/" onClick={leave} className="btn-light mt-5">
          Mergi la catalog
        </Link>
      </div>
    );
  }
  return (
    <>
      <ul className="divide-y divide-line">
        {rows.map(({ product, qty }) => (
          <li key={product.slug} className="group/row flex animate-rise gap-4 py-4 motion-reduce:animate-none">
            <Link
              href={productPath(product)}
              onClick={leave}
              className={`block h-20 w-20 shrink-0 overflow-hidden rounded-md p-1 transition-transform bg-white ring-1 ring-inset ring-line duration-200 group-hover/row:scale-[1.04] motion-reduce:transition-none`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <ProductImage product={product} sizes="80px" decorative />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={productPath(product)} onClick={leave} className="block text-sm font-semibold leading-snug text-ink link-underline">
                {product.name}
              </Link>
              <p className="mt-0.5 text-xs text-muted">{sizeLabel(product)}</p>
              <div className="mt-2.5 flex items-center gap-3">
                <QtyField value={qty} onChange={(n) => setQty(product.slug, n)} label={`Cantitate pentru ${product.name}`} size={compact ? "sm" : "md"} />
                <button
                  type="button"
                  className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-pill border border-danger/30 bg-white text-danger transition-all duration-200 hover:scale-105 hover:border-danger hover:bg-danger hover:text-white focus-visible:border-danger focus-visible:bg-danger focus-visible:text-white motion-reduce:transition-none"
                  aria-label={`Scoate ${product.name} din listă`}
                  onClick={() => remove(product.slug)}
                >
                  <IconTrash />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-md bg-surface px-4 py-3 text-xs text-ink-soft">
        <span>
          {plural(rows.length, "produs", "produse")} · {plural(pieces, "bucată", "bucăți")} în total
        </span>
        <Link href="/catalog/" onClick={leave} className="font-semibold text-brand link-underline">
          Adaugă alte produse
        </Link>
      </div>
    </>
  );
}

export function OfferListActions({ aside }: { aside?: ReactNode }) {
  const { items, clear } = useOfferList();
  const rows = resolveItems(items);
  if (rows.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <a href={listOfferUrl(rows)} target="_blank" rel="noopener" className="btn-dark h-12 w-full" onClick={() => track("Lista: trimite", { canal: "whatsapp", produse: rows.length })}>
        <IconWhatsApp width={18} height={18} />
        Trimite lista pe WhatsApp
      </a>
      <a href={listOfferMailto(rows)} className="btn-light w-full" onClick={() => track("Lista: trimite", { canal: "email", produse: rows.length })}>
        <IconMail />
        Trimite lista pe email
      </a>
      <p className="text-center text-xs text-muted">Se deschide WhatsApp sau aplicația de email cu mesajul pregătit. Prețurile le primești în răspuns.</p>
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-wider">
        <button type="button" onClick={clear} className="inline-flex min-h-9 items-center gap-1.5 text-danger link-underline">
          <IconTrash width={14} height={14} />
          Golește lista
        </button>
        {aside}
      </div>
    </div>
  );
}

function OfferDrawer() {
  const { open, setOpen, count } = useOfferList();
  const ref = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), [setOpen]);
  useDialog(open, close, ref);
  return (
    <div className={open ? "fixed inset-0 z-[70]" : "pointer-events-none fixed inset-0 z-[70]"} inert={!open}>
      <button
        type="button"
        aria-label="Închide lista de ofertă"
        onClick={close}
        className={`absolute inset-0 bg-brand-navy/40 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lista-oferta-titlu"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-card transition-transform duration-300 ease-out motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex h-16 items-center justify-between border-b border-line bg-brand-50 px-5">
          <h2 id="lista-oferta-titlu" className="label-caps flex items-center gap-2 text-brand-navy">
            Lista de ofertă
            {count > 0 && (
              <span key={count} className="inline-flex h-6 min-w-6 animate-pop items-center justify-center rounded-pill bg-brand px-2 text-[11px] font-semibold tracking-normal text-white motion-reduce:animate-none">
                {count}
              </span>
            )}
          </h2>
          <button type="button" className="btn-icon" aria-label="Închide" onClick={close}>
            <IconClose />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5">
          <OfferListRows compact />
        </div>
        <footer className="border-t border-line p-5">
          <OfferListActions
            aside={
              <Link href="/lista-oferta/" onClick={close} className="inline-flex min-h-9 items-center text-ink-soft link-underline">
                Vezi pagina listei
              </Link>
            }
          />
        </footer>
      </aside>
    </div>
  );
}
