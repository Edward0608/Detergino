import Image from "next/image";
import Link from "next/link";
import { brands, groupPath, groupTint, groups, listRo, plural, productsOfBrand, productsOfCategory, productsOfGroup, products, sizeRange, sizeText, type Product } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { HeroSlider, type Slide } from "@/components/hero-slider";
import { ProductRail } from "@/components/product-rail";
import { BrandTabs } from "@/components/brand-tabs";
import { FeaturedPicker } from "@/components/featured-picker";
import { Reveal } from "@/components/reveal";
import { ProductImage } from "@/components/product-image";
import { IconWhatsApp } from "@/components/icons";
import { generalOfferUrl } from "@/lib/whatsapp";

/** One factual line for a hero slide: how many products, which brands, which pack sizes. Nothing invented. */
function lead(list: Product[]): string {
  const count = new Map<string, number>();
  for (const p of list) if (p.brand) count.set(p.brand, (count.get(p.brand) ?? 0) + 1);
  const brandList = listRo([...count.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b));
  const [lo, hi] = sizeRange(list);
  const range = lo && hi && lo !== hi ? `, ambalaje de la ${sizeText(lo)} la ${sizeText(hi)}` : "";
  return `${plural(list.length, "produs", "produse")} ${brandList}${range}.`;
}

const SLIDES: Slide[] = [
  {
    title: "Detergenți lichizi de rufe Super Wash, Ultra&Free și JO",
    lead: lead(productsOfCategory("detergent-lichid-rufe")),
    cta: "Vezi detergenții de rufe",
    href: "/catalog/rufe/detergent-lichid-rufe/",
    tint: "bg-brand",
    photo: { wide: "/banner/hero-rufe.webp", square: "/banner/hero-rufe-m.webp", alt: "Detergent lichid de rufe Super Wash Ocean Fresh 5 L, Ultra&Free Pro Black 4 L și JO Color 5 L" },
    dark: true,
  },
  {
    title: "Odorizante de cameră Golf și Moon",
    lead: lead(productsOfGroup("odorizante")),
    cta: "Vezi odorizantele",
    href: "/catalog/odorizante/",
    tint: "bg-g-odorizante",
    photo: { wide: "/banner/hero-odorizante.webp", square: "/banner/hero-odorizante-m.webp", alt: "Odorizant Golf Ocean 260 ml, difuzor Golf Visul Bosforului și difuzor Moon Cherry" },
  },
  {
    title: "Șervețele umede Fibril",
    lead: lead(productsOfGroup("servetele-umede")),
    cta: "Vezi șervețelele",
    href: "/catalog/servetele-umede/",
    tint: "bg-brand-navy",
    photo: { wide: "/banner/hero-servetele.webp", square: "/banner/hero-servetele-m.webp", alt: "Șervețele umede Fibril Lavandă și șervețele pentru suprafețe Fibril XL" },
    dark: true,
  },
  {
    title: "Dulciuri Mon Mio, Fly Mio și Colibri",
    lead: lead(productsOfGroup("dulciuri")),
    cta: "Vezi dulciurile",
    href: "/catalog/dulciuri/",
    tint: "bg-g-dulciuri",
    photo: { wide: "/banner/hero-dulciuri.webp", square: "/banner/hero-dulciuri-m.webp", alt: "Bomboane Mon Mio Sharsan, croissant Mon Mio și bomboane Fly Mio Cheesecake" },
  },
];

const BRAND_TABS = ["Super Wash", "Free", "Ultra&Free", "Golf", "Fibril", "Mon Mio"];
const HOWTO = ["detergent-praf-de-rufe-free-universal-9-kg", "balsam-de-rufe-free-pink-dream-4-l", "detergent-lichid-de-vase-free-lamaie-1-l"];

export default function HomePage() {
  const rufeAll = productsOfCategory("detergent-lichid-rufe");
  const rufe = rufeAll.slice(0, 12);
  const tabs = BRAND_TABS.map((b) => ({ brand: b, products: productsOfBrand(b).slice(0, 12) })).filter((t) => t.products.length);
  const tiles = groups.map((g) => ({ group: g, sample: productsOfGroup(g.slug).find((p) => p.images.length) }));
  const odorizante = productsOfGroup("odorizante").length;
  const odorParts = [
    [productsOfCategory("odorizant-camera").length, "spray de cameră", "spray-uri de cameră"],
    [productsOfCategory("difuzoare-betisoare").length, "difuzor cu bețișoare", "difuzoare cu bețișoare"],
    [productsOfCategory("odorizant-wc").length, "odorizant WC", "odorizante WC"],
  ] as const;
  const odorLead = `${plural(odorizante, "produs", "produse")}: ${listRo(odorParts.filter(([n]) => n > 0).map(([n, one, many]) => plural(n, one, many)))}.`;

  return (
    <>
      <h1 className="sr-only">Detergino: catalog en-gros de detergenți, produse de curățenie și dulciuri</h1>
      <HeroSlider slides={SLIDES} />

      {/* Kiko's second block: image left, headline + text + CTA right. */}
      <section className="container-site mt-8 md:mt-12">
        <Reveal>
        <div className="grid items-center gap-6 md:grid-cols-[1.25fr_1fr] md:gap-10">
          {/* One studio photo of the Free family (scripts/studio-photo.py), the products a buyer would put on one list. */}
          <Link href="/lista-oferta/" tabIndex={-1} aria-hidden="true" className="panel relative block aspect-square overflow-hidden bg-g-vase-pardoseli sm:aspect-[4/3]">
            <Image src="/banner/lista-oferta.webp" alt="" fill loading="eager" sizes="(min-width: 768px) 55vw, 100vw" className="object-cover object-bottom" />
          </Link>
          <div className="px-2 text-center md:px-6">
            <h2 className="heading-xl">Lista de ofertă: toate produsele într-un singur mesaj</h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft md:text-base">
              Adaugi produsele din catalog cu butonul de listă, setezi cantitățile și trimiți o singură cerere pe WhatsApp. Prețurile pentru bax și palet le primești în răspuns.
            </p>
            <Link href="/cum-comanzi/" className="btn-light mt-6 min-w-[200px]">
              Cum ceri o ofertă
            </Link>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="container-site mt-16 md:mt-24">
        <Reveal>
        <h2 className="heading-xl text-center">Detergenți lichizi de rufe</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink-soft">
          {plural(rufeAll.length, "variantă", "variante")} în catalog, de la 2 la 6 litri. Fiecare produs are un buton de cerere de ofertă pe WhatsApp.
        </p>
        <div className="mt-8">
          <ProductRail products={rufe} label="Detergenți lichizi de rufe" />
        </div>
        <p className="mt-6 text-center">
          <Link href="/catalog/rufe/detergent-lichid-rufe/" className="btn-light min-w-[220px]">
            Toți detergenții lichizi
          </Link>
        </p>
        </Reveal>
      </section>

      {/* Kiko's full-width campaign banner: a navy text block, and a product lineup that steps over the colour edge. */}
      <section className="container-site mt-16 md:mt-24">
        <Reveal>
        <div className="panel relative grid overflow-hidden md:grid-cols-[42%_1fr]">
          <div className="flex flex-col justify-center bg-violet-deep px-6 py-8 text-white md:px-10 md:py-12 md:pr-[12%]">
            <h2 className="text-2xl font-light leading-[1.1] tracking-tight md:text-3xl lg:text-[2.4rem]">Odorizante de cameră Golf și Moon</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 md:text-base">{odorLead}</p>
            <Link href="/catalog/odorizante/" className="btn-light mt-6 self-start">
              Vezi toate odorizantele
            </Link>
          </div>
          {/* One edited studio photo (scripts/studio-photo.py): backdrop gradient, contact shadow and floor reflection. */}
          <div className="relative aspect-[4/3] bg-g-odorizante md:aspect-[3/2]">
            <Image src="/banner/odorizante.webp" alt="Difuzor cu bețișoare Golf Lavender, cutie și sticlă" fill loading="eager" sizes="(min-width: 768px) 60vw, 100vw" className="object-cover object-bottom" />
          </div>
        </div>
        </Reveal>
      </section>

      <section className="mt-16 bg-tint-4 py-14 md:mt-24 md:py-20">
        <div className="container-site">
          <BrandTabs tabs={tabs} />
        </div>
      </section>

      <section className="container-site mt-16 md:mt-24">
        <Reveal>
          <h2 className="heading-xl text-center">Categorii principale</h2>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {tiles.map(({ group, sample }, i) => (
            <li key={group.slug} className="text-center">
              <Link href={groupPath(group)} className="group/tile block">
                <Reveal delay={i * 60}>
                  <span className={`mx-auto block aspect-square w-full max-w-[150px] overflow-hidden rounded-pill border-2 border-transparent p-5 transition-all duration-300 group-hover/tile:-translate-y-1 group-hover/tile:shadow-card motion-reduce:transition-none bg-white ring-1 ring-inset ring-line ${groupTint(group.slug).border}`}>
                    <span className="block h-full w-full transition-transform duration-300 group-hover/tile:scale-110 motion-reduce:transition-none">{sample && <ProductImage product={sample} sizes="150px" decorative />}</span>
                  </span>
                </Reveal>
                <span className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-navy">{group.name}</span>
                <span className="mt-1 block text-xs text-muted">{plural(productsOfGroup(group.slug).length, "produs", "produse")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Kiko's two-column block with the small product selector, on the navy band. */}
      <section className="mt-16 bg-brand-navy py-14 text-white md:mt-24 md:py-20">
        <div className="container-site grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <div>
            <h2 className="heading-xl text-white">Cum ceri o ofertă de preț</h2>
            <ol className="mt-6 space-y-4 text-sm leading-relaxed text-brand-100 md:text-base">
              <li>
                <span className="font-semibold text-white">1. Alegi produsele.</span> Din orice categorie, cu butonul „Cere ofertă” pentru un singur produs sau cu „Adaugă în lista de ofertă” pentru mai multe.
              </li>
              <li>
                <span className="font-semibold text-white">2. Trimiți mesajul pe WhatsApp.</span> Mesajul se completează singur cu numele produselor, ambalajul și codul de bare. Îl poți modifica înainte de trimitere.
              </li>
              <li>
                <span className="font-semibold text-white">3. Primești prețurile.</span> Răspundem pe WhatsApp la {SITE.phoneDisplay} sau pe email la {SITE.email}, cu prețuri pentru bax și palet.
              </li>
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={generalOfferUrl()} target="_blank" rel="noopener" className="btn bg-white text-brand-navy hover:bg-brand-50">
                <IconWhatsApp width={16} height={16} />
                Scrie-ne pe WhatsApp
              </a>
              <Link href="/cum-comanzi/" className="btn border border-white text-white hover:bg-white/10">
                Cum ceri o ofertă
              </Link>
            </div>
          </div>
          <div className="panel bg-white p-4 text-ink md:p-6">
            <FeaturedPicker slugs={HOWTO} tint="bg-tint-1" photos={Object.fromEntries(HOWTO.map((slug) => [slug, `/banner/howto-${slug}.webp`]))} />
          </div>
        </div>
      </section>

      <section className="container-site mt-16 md:mt-24">
        <h2 className="heading-xl text-center">Șervețele umede și articole de curățenie</h2>
        <div className="mt-8">
          <ProductRail products={[...productsOfGroup("servetele-umede"), ...productsOfGroup("curatenie")].slice(0, 12)} label="Șervețele umede și articole de curățenie" />
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          {plural(products.length, "produs", "produse")} din {plural(brands.length, "brand", "branduri")} în total.{" "}
          <Link href="/catalog/" className="font-medium text-ink link-underline">
            Vezi tot catalogul
          </Link>
        </p>
      </section>
    </>
  );
}
