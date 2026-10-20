"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import Link from "next/link";
import {
  brandPath,
  brands,
  brandsOfGroup,
  categoriesOfGroup,
  categoryPath,
  groupPath,
  groups,
  plural,
  productPath,
  products,
  productsOfBrand,
  productsOfGroup,
  type Product,
} from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { generalOfferUrl } from "@/lib/whatsapp";
import { useDialog } from "@/lib/use-dialog";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { ProductImage } from "@/components/product-image";
import { useOfferList } from "@/components/offer-list";
import { IconChevronDown, IconClose, IconHelp, IconList, IconMenu, IconPhone, IconPin, IconSearch, IconWhatsApp } from "@/components/icons";

type NavItem = { key: string; label: string; href: string; columns: { title: string; links: { label: string; href: string }[] }[]; tiles: Product[] };

const SWEET_BRANDS = ["Mon Mio", "Fly Mio", "Colibri", "Lagoda", "Augustino"];

function pickTiles(list: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of list) {
    if (p.images.length === 0) continue;
    const k = `${p.category}|${p.brand}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
    if (out.length === 2) break;
  }
  return out;
}

const NAV: NavItem[] = [
  ...groups.map((g) => ({
    key: g.slug,
    label: g.name,
    href: groupPath(g),
    columns: [
      {
        title: "Categorii",
        links: [
          ...categoriesOfGroup(g.slug).map((c) => ({ label: c.name, href: categoryPath(c) })),
          { label: `Toate produsele din categoria „${g.name}”`, href: groupPath(g) },
        ],
      },
      { title: "Branduri", links: brandsOfGroup(g.slug).map((b) => ({ label: b, href: brandPath(b) })) },
    ],
    tiles: pickTiles(productsOfGroup(g.slug)),
  })),
  {
    key: "branduri",
    label: "Branduri",
    href: "/branduri/",
    columns: [
      { title: "Curățenie, menaj și cosmetice", links: brands.filter((b) => !SWEET_BRANDS.includes(b.name)).map((b) => ({ label: b.name, href: brandPath(b.name) })) },
      { title: "Dulciuri", links: brands.filter((b) => SWEET_BRANDS.includes(b.name)).map((b) => ({ label: b.name, href: brandPath(b.name) })) },
    ],
    tiles: pickTiles([...productsOfBrand("Super Wash"), ...productsOfBrand("Golf")]),
  },
];

/** Slim trust bar: three real facts, no carousel. The WhatsApp number is the one coloured element. */
function TopBar() {
  const facts = [`${plural(products.length, "produs", "produse")} în catalog`, "Bax și palet", SITE.city];
  return (
    <div className="bg-bar text-white">
      <div className="container-site flex h-10 items-center justify-between gap-4 text-[12px]">
        <Link href="/contact/" className="hidden items-center gap-2 whitespace-nowrap text-white/80 transition-colors hover:text-white lg:inline-flex">
          <IconPin className="text-brand-light" />
          {SITE.address}
        </Link>
        <ul className="flex min-w-0 flex-1 items-center justify-center gap-x-3 whitespace-nowrap text-white/80 md:flex-none" aria-label="Pe scurt">
          {facts.map((f, i) => (
            <li key={f} className={`items-center gap-3 ${i === 2 ? "hidden sm:flex" : "flex"}`}>
              {i > 0 && <span className="h-1 w-1 rounded-pill bg-brand-light" aria-hidden="true" />}
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-5 md:flex">
          <Link href="/contact/" className="inline-flex items-center gap-1.5 whitespace-nowrap text-white/80 transition-colors hover:text-white">
            <IconHelp />
            Ajutor
          </Link>
          <a
            href={generalOfferUrl()}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 whitespace-nowrap font-semibold text-whatsapp transition-colors hover:text-white"
            onClick={() => track("Cere oferta", { canal: "whatsapp", sursa: "bara-sus" })}
          >
            <IconWhatsApp width={16} height={16} />
            {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </div>
  );
}

function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  return (
    <div id={`meniu-${item.key}`} className="absolute left-0 right-0 top-full z-40 animate-rise rounded-b-[var(--radius-panel)] border-t border-line bg-white shadow-card motion-reduce:animate-none">
      <div className="container-site grid grid-cols-[1fr_1fr_1.3fr] gap-10 py-8">
        {item.columns.map((col) => (
          <div key={col.title}>
            <p className="label-caps mb-4 text-brand" id={`meniu-${item.key}-${col.title}`}>
              {col.title}
            </p>
            <ul className="space-y-2.5" aria-labelledby={`meniu-${item.key}-${col.title}`}>
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} onClick={onClose} className="text-sm link-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          {item.tiles.map((p) => (
            <Link key={p.slug} href={productPath(p)} onClick={onClose} className="block">
              <span className={`block aspect-square overflow-hidden rounded-md p-3 bg-white ring-1 ring-inset ring-line`}>
                <ProductImage product={p} sizes="200px" decorative />
              </span>
              <span className="mt-2 block text-xs font-medium leading-snug">{p.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopNav() {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onDown = (e: globalThis.MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null);
  };
  // Click only (no hover): a click opens the panel, a second click closes it. The panel itself links to the whole group.
  const toggle = (key: string) => setOpen((cur) => (cur === key ? null : key));
  return (
    <nav ref={navRef} aria-label="Categorii de produse" className="relative hidden bg-nav md:block" onBlur={onBlur}>
      <ul className="container-site flex h-10 items-center justify-center-safe gap-5 overflow-x-auto lg:gap-9">
        {NAV.map((item) => (
          <li key={item.key} className="h-full">
            <button
              type="button"
              aria-expanded={open === item.key}
              aria-controls={`meniu-${item.key}`}
              onClick={() => toggle(item.key)}
              className={`flex h-full cursor-pointer items-center whitespace-nowrap border-b-2 text-[10px] font-medium uppercase tracking-[0.14em] text-nav-ink transition-colors lg:text-[11px] lg:tracking-[0.16em] ${open === item.key ? "border-white" : "border-transparent hover:border-white/60"}`}
            >
              {item.label}
            </button>
            {open === item.key && <MegaMenu item={item} onClose={() => setOpen(null)} />}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  useDialog(open, onClose, ref);
  return (
    <div className={open ? "fixed inset-0 z-[70] md:hidden" : "pointer-events-none fixed inset-0 z-[70] md:hidden"} inert={!open}>
      <button type="button" aria-label="Închide meniul" onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside ref={ref} role="dialog" aria-modal="true" aria-label="Meniu" className={`absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="label-caps">Meniu</span>
          <button type="button" className="btn-icon" aria-label="Închide" onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-line">
            {NAV.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  aria-expanded={expanded === item.key}
                  onClick={() => setExpanded(expanded === item.key ? null : item.key)}
                  className="flex h-14 w-full items-center justify-between px-4 text-[12px] font-medium uppercase tracking-[0.16em]"
                >
                  {item.label}
                  <IconChevronDown className={`transition-transform ${expanded === item.key ? "rotate-180" : ""}`} />
                </button>
                {expanded === item.key && (
                  <div className="bg-surface px-4 pb-4">
                    {item.columns.map((col) => (
                      <div key={col.title} className="pt-3">
                        <p className="label-caps mb-2 text-ink-soft">{col.title}</p>
                        <ul className="space-y-1">
                          {col.links.map((l) => (
                            <li key={l.href + l.label}>
                              <Link href={l.href} onClick={onClose} className="block py-2 text-sm">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li>
              <Link href="/despre/" onClick={onClose} className="flex h-14 items-center px-4 text-[12px] font-medium uppercase tracking-[0.16em]">
                Despre noi
              </Link>
            </li>
            <li>
              <Link href="/contact/" onClick={onClose} className="flex h-14 items-center px-4 text-[12px] font-medium uppercase tracking-[0.16em]">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="border-t border-line p-4 text-xs text-ink-soft">
          <a href={`tel:${SITE.phoneTel}`} className="block py-1 text-sm font-medium text-ink">
            {SITE.phoneDisplay}
          </a>
          <span className="block">{SITE.address}</span>
        </div>
      </aside>
    </div>
  );
}

export function SiteHeader() {
  const { count, setOpen, hydrated } = useOfferList();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <div className="sticky top-0 z-50 bg-white">
      <TopBar />
      <header className="border-b border-line">
        <div className="container-site grid h-16 grid-cols-[auto_1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-2">
            <button type="button" className="btn-icon -ml-3 border-0 md:hidden" aria-label="Deschide meniul" onClick={() => setMenu(true)}>
              <IconMenu />
            </button>
            <div className="hidden w-full max-w-[300px] md:block">
              <SearchBox />
            </div>
          </div>
          <Logo className="justify-self-center" />
          <div className="flex items-center justify-end md:gap-2">
            <button type="button" className="btn-icon border-0 md:hidden" aria-label={search ? "Închide căutarea" : "Caută un produs"} aria-expanded={search} onClick={() => setSearch(!search)}>
              {search ? <IconClose /> : <IconSearch />}
            </button>
            <a href={`tel:${SITE.phoneTel}`} className="btn-icon border-0 text-brand-navy md:w-auto md:gap-2 md:px-2" aria-label={`Sună la ${SITE.phoneDisplay}`}>
              <IconPhone />
              <span className="hidden text-xs font-medium lg:inline">{SITE.phoneDisplay}</span>
            </a>
            <button type="button" onClick={() => setOpen(true)} className="btn-icon relative -mr-3 border-0 md:mr-0" aria-label={`Deschide lista de ofertă${hydrated && count > 0 ? `, ${plural(count, "produs", "produse")}` : ""}`}>
              <IconList />
              {hydrated && count > 0 && (
                <span key={count} className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-pill bg-brand px-1 text-[10px] font-semibold text-white motion-reduce:animate-none" aria-hidden="true">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
        {search && (
          <div className="container-site border-t border-line py-3 md:hidden">
            <SearchBox autoFocus onNavigate={() => setSearch(false)} />
          </div>
        )}
      </header>
      <DesktopNav />
      <MobileMenu open={menu} onClose={closeMenu} />
    </div>
  );
}
