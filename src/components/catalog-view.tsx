"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { categoriesOfGroup, categoryPath, getCategory, getGroup, groupPath, groupTint, groups, matchesScope, plural, products as allProducts, productsOfCategory, productsOfGroup, sizeValue, sortByName, type Product, type Scope } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { useExtras } from "@/components/extras-provider";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { IconChevronDown, IconClose } from "@/components/icons";

type Option = { value: string; label: string; count: number };
/** A facet is a few labelled groups of options, so 37 pack sizes read as "Lichide", "Greutate", "Bucăți", "Multipack" instead of one alphabetical column. */
type Facet = { key: "category" | "brand" | "size"; title: string; groups: { label?: string; options: Option[] }[]; total: number };

function sizeGroup(size: string): { label: string; order: number } {
  if (/\d\s*x\s*\d/i.test(size)) return { label: "Multipack", order: 3 };
  const unit = size.split(" ").pop()?.toLowerCase();
  if (unit === "l" || unit === "ml") return { label: "Lichide", order: 0 };
  if (unit === "kg" || unit === "g") return { label: "Greutate", order: 1 };
  if (unit === "buc") return { label: "Bucăți", order: 2 };
  return { label: "Altele", order: 4 };
}

function countBy(list: Product[], get: (p: Product) => string | null | undefined): Map<string, number> {
  const m = new Map<string, number>();
  for (const p of list) {
    const v = get(p);
    if (v) m.set(v, (m.get(v) ?? 0) + 1);
  }
  return m;
}

function grouped(entries: Option[], groupOf: (o: Option) => { label: string; order: number }, sortIn: (a: Option, b: Option) => number): Facet["groups"] {
  const by = new Map<string, { label: string; order: number; options: Option[] }>();
  for (const o of entries) {
    const g = groupOf(o);
    const slot = by.get(g.label) ?? { ...g, options: [] };
    slot.options.push(o);
    by.set(g.label, slot);
  }
  return Array.from(by.values())
    .sort((a, b) => a.order - b.order)
    .map((g) => ({ label: g.label, options: g.options.sort(sortIn) }));
}

function buildFacets(list: Product[], hideCategory: boolean): Facet[] {
  const byLabel = (a: Option, b: Option) => a.label.localeCompare(b.label, "ro", { numeric: true });
  const facets: Facet[] = [];

  const cats = Array.from(countBy(list, (p) => p.category)).map(([value, count]) => ({ value, label: getCategory(value)?.name ?? value, count }));
  if (!hideCategory && cats.length > 1) {
    const order = new Map(groups.map((g, i) => [g.slug, i]));
    const catGroups = grouped(cats, (o) => {
      const g = getCategory(o.value)?.group ?? "";
      return { label: getGroup(g)?.name ?? "Altele", order: order.get(g) ?? 99 };
    }, byLabel);
    facets.push({ key: "category", title: "Categorie", groups: catGroups.length > 1 ? catGroups : catGroups.map((g) => ({ options: g.options })), total: cats.length });
  }

  const br = Array.from(countBy(list, (p) => p.brand)).map(([value, count]) => ({ value, label: value, count })).sort(byLabel);
  if (br.length > 1) facets.push({ key: "brand", title: "Brand", groups: [{ options: br }], total: br.length });

  const sz = Array.from(countBy(list, (p) => p.size)).map(([value, count]) => ({ value, label: value, count }));
  if (sz.length > 1) {
    const szGroups = grouped(sz, (o) => sizeGroup(o.value), (a, b) => sizeValue(a.value) - sizeValue(b.value));
    facets.push({ key: "size", title: "Ambalaj", groups: szGroups.length > 1 ? szGroups : szGroups.map((g) => ({ options: g.options })), total: sz.length });
  }
  return facets;
}

/** Where the visitor is in the catalogue; drives the highlighted row and which group is expanded. */
export type CatalogPlace = { root?: boolean; group?: string; category?: string };

function NavRow({ href, active, children, count, dot }: { href: string; active: boolean; children: ReactNode; count: number; dot?: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-9 items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${active ? "bg-brand-50 font-semibold text-brand" : "text-ink hover:bg-surface"}`}
    >
      <span className="flex items-center gap-2">
        {dot && <span className={`h-2.5 w-2.5 shrink-0 rounded-pill ${dot}`} aria-hidden="true" />}
        {children}
      </span>
      <span className={`text-xs tabular-nums ${active ? "text-brand" : "text-muted"}`}>{count}</span>
    </Link>
  );
}

/** Catalogue tree: every group, with the categories of the current group opened beneath it. Static, no state. */
function CatalogNav({ place }: { place: CatalogPlace }) {
  return (
    <nav aria-labelledby="catalog-nav-titlu" className="border-b border-line pb-4">
      <p id="catalog-nav-titlu" className="hidden py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy lg:block">
        Catalog
      </p>
      <ul className="mt-1 space-y-0.5">
        <li>
          <NavRow href="/catalog/" active={place.root === true} count={allProducts.length}>
            Toate produsele
          </NavRow>
        </li>
        {groups.map((g) => {
          const cats = categoriesOfGroup(g.slug);
          const open = place.group === g.slug;
          const showCats = cats.length > 1;
          return (
            <li key={g.slug}>
              <NavRow href={groupPath(g)} active={open && (!place.category || !showCats)} count={productsOfGroup(g.slug).length} dot={groupTint(g.slug).dot}>
                {g.name}
              </NavRow>
              {open && showCats && (
                <ul className="my-1 ml-3 space-y-0.5 border-l border-line pl-2">
                  {cats.map((c) => (
                    <li key={c.slug}>
                      <NavRow href={categoryPath(c)} active={place.category === c.slug} count={productsOfCategory(c.slug).length}>
                        {c.name}
                      </NavRow>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function CatalogView({ title, intro, crumbs, products: baseProducts, hideCategory = false, place = {}, header, scope }: { title: string; intro?: string; crumbs: Crumb[]; products: Product[]; hideCategory?: boolean; place?: CatalogPlace; header?: ReactNode; scope?: Scope }) {
  const { extras } = useExtras();
  const products = useMemo(() => (scope ? [...baseProducts, ...extras.filter((e) => matchesScope(e, scope))] : baseProducts), [baseProducts, extras, scope]);
  const [sel, setSel] = useState<Record<string, Set<string>>>({});
  const [sort, setSort] = useState<"name" | "brand">("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  /* Which facets are open: the user's toggles win; before any toggle, short lists start open and long ones closed. */
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  /* Long facets preview their first options; "Arată toate" reveals the rest (selected options are always shown). */
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const firstSummary = useRef<HTMLElement>(null);
  const facets = useMemo(() => buildFacets(products, hideCategory), [products, hideCategory]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      Object.entries(sel).every(([k, set]) => set.size === 0 || set.has((p[k as "category" | "brand" | "size"] ?? "") as string)),
    );
    list = sortByName(list);
    if (sort === "brand") list = [...list].sort((a, b) => (a.brand ?? "zz").localeCompare(b.brand ?? "zz", "ro") || a.name.localeCompare(b.name, "ro"));
    return list;
  }, [products, sel, sort]);

  const toggle = (k: string, v: string) =>
    setSel((prev) => {
      const next = new Set(prev[k] ?? []);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return { ...prev, [k]: next };
    });
  const activeCount = Object.values(sel).reduce((n, s) => n + s.size, 0);

  const filterPanel = (
    <div className="space-y-4">
      {facets.map((f, idx) => (
        <details
          key={f.key}
          open={openKeys[f.key] ?? f.total <= 12}
          onToggle={(e) => {
            const isOpen = e.currentTarget.open;
            setOpenKeys((prev) => (prev[f.key] === isOpen ? prev : { ...prev, [f.key]: isOpen }));
          }}
          className="group border-b border-line pb-3"
        >
          <summary ref={idx === 0 ? firstSummary : undefined} tabIndex={0} className="flex min-h-9 cursor-pointer list-none items-center justify-between py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy">
            <span>
              {f.title}
              {(sel[f.key]?.size ?? 0) > 0 && <span className="ml-2 rounded-pill bg-brand px-1.5 py-0.5 text-[10px] text-white">{sel[f.key]?.size}</span>}
            </span>
            <IconChevronDown className="transition-transform group-open:rotate-180" />
          </summary>
          {(() => {
            const PREVIEW = 10;
            const selected = sel[f.key] ?? new Set<string>();
            const expanded = showAll[f.key] || f.total <= PREVIEW + 2;
            let budget = PREVIEW;
            const visible = f.groups
              .map((g) => ({
                label: g.label,
                options: g.options.filter((o) => {
                  if (expanded || selected.has(o.value)) return true;
                  if (budget > 0) {
                    budget -= 1;
                    return true;
                  }
                  return false;
                }),
              }))
              .filter((g) => g.options.length > 0);
            const asList = f.key === "category";
            return (
              <div className="mt-2 space-y-3">
                {visible.map((g, gi) => (
                  <div key={g.label ?? gi}>
                    {g.label && <p className="mb-1 text-[11px] text-muted">{g.label}</p>}
                    <ul className={asList ? "space-y-0.5" : "flex flex-wrap gap-1"}>
                      {g.options.map((o) => {
                        const checked = selected.has(o.value);
                        return (
                          <li key={o.value}>
                            <label
                              className={
                                asList
                                  ? `flex min-h-8 cursor-pointer items-center gap-2.5 rounded-md px-1.5 text-xs hover:bg-surface ${checked ? "font-medium text-brand" : ""}`
                                  : `chip h-8 cursor-pointer gap-1 px-2.5 text-[11px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${checked ? "chip-active" : ""}`
                              }
                            >
                              <input type="checkbox" checked={checked} onChange={() => toggle(f.key, o.value)} className={asList ? "h-4 w-4 accent-brand" : "sr-only"} />
                              {asList ? <span className="flex-1">{o.label}</span> : o.label}
                              <span className={`text-[10px] tabular-nums ${checked && !asList ? "text-white/80" : "text-muted"}`}>{o.count}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {f.total > PREVIEW + 2 && (
                  <button type="button" onClick={() => setShowAll((prev) => ({ ...prev, [f.key]: !expanded }))} className="inline-flex min-h-9 items-center text-xs link-underline">
                    {expanded ? "Mai puține" : `Arată toate (${f.total})`}
                  </button>
                )}
              </div>
            );
          })()}
        </details>
      ))}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => {
            firstSummary.current?.focus();
            setSel({});
          }}
          className="inline-flex min-h-9 items-center gap-1 text-xs uppercase tracking-wider link-underline"
        >
          <IconClose width={14} height={14} /> Șterge filtrele
        </button>
      )}
    </div>
  );

  return (
    <div className="container-site pt-6">
      <Breadcrumbs items={crumbs} />

      {/* Page header on the full width, like Kiko's collection title; the sidebar below keeps only navigation and filters. */}
      <header className={`panel mt-6 flex flex-col gap-5 px-6 py-7 md:flex-row md:items-end md:justify-between md:gap-10 md:px-10 md:py-9 ${place.group ? groupTint(place.group).bg : "bg-brand-50"}`}>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight text-brand-navy md:text-4xl">{title}</h1>
          <p className={`mt-2 text-xs font-semibold ${place.group ? groupTint(place.group).ink : "text-brand"}`} role="status">
            {plural(filtered.length, "produs", "produse")}
            {filtered.length !== products.length && ` din ${products.length}`}
          </p>
          {intro && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{intro}</p>}
        </div>
        {header}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-[9.75rem] lg:-mx-1 lg:-mt-1 lg:max-h-[calc(100vh-10.5rem)] lg:self-start lg:overflow-y-auto lg:px-1 lg:pt-1 lg:pr-3 lg:[scrollbar-color:var(--line)_transparent] lg:[scrollbar-width:thin]">
          {/* Phones: two toggles side by side, so the products start right under the title. Desktop: the tree and the facets are always open. */}
          <div className="lg:hidden">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setNavOpen(!navOpen)} aria-expanded={navOpen} className={`chip h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] ${navOpen ? "chip-active" : ""}`}>
                Catalog
                <IconChevronDown width={14} height={14} className={navOpen ? "rotate-180" : ""} />
              </button>
              {facets.length > 0 && (
                <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} className={`chip h-11 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] ${filtersOpen ? "chip-active" : ""}`}>
                  Filtre {activeCount > 0 && `(${activeCount})`}
                  <IconChevronDown width={14} height={14} className={filtersOpen ? "rotate-180" : ""} />
                </button>
              )}
              {filtered.length > 1 && (
                <select aria-label="Sortare" value={sort} onChange={(e) => setSort(e.target.value as "name" | "brand")} className="field ml-auto h-11 w-auto px-2 pr-7 text-xs">
                  <option value="name">Alfabetic</option>
                  <option value="brand">După brand</option>
                </select>
              )}
            </div>
            {navOpen && (
              <div className="mt-4">
                <CatalogNav place={place} />
              </div>
            )}
            {filtersOpen && <div className="mt-4">{filterPanel}</div>}
          </div>
          <div className="hidden lg:block">
            <CatalogNav place={place} />
            {facets.length > 0 && <div className="mt-4">{filterPanel}</div>}
          </div>
        </aside>
        <div>
          {filtered.length > 1 && (
            <div className="mb-6 hidden items-center justify-end gap-3 text-xs lg:flex">
              <label htmlFor="sortare" className="uppercase tracking-wider text-ink-soft">
                Sortare
              </label>
              <select id="sortare" value={sort} onChange={(e) => setSort(e.target.value as "name" | "brand")} className="field h-9 w-auto pr-8 text-xs">
                <option value="name">Alfabetic</option>
                <option value="brand">După brand</option>
              </select>
            </div>
          )}
          {filtered.length === 0 ? (
            products.length === 0 && intro ? null : (
              <p className="py-16 text-center text-sm text-ink-soft">
                {products.length === 0 ? "Niciun produs de afișat." : "Niciun produs nu corespunde filtrelor alese."}
                {products.length > 0 && (
                  <>
                    {" "}
                    <button type="button" onClick={() => setSel({})} className="text-ink link-underline">
                      Șterge filtrele
                    </button>
                  </>
                )}
              </p>
            )
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              {filtered.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 4} headingLevel={2} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
