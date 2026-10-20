import Link from "next/link";
import { brandPath, brands, groupPath, groups } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand-navy text-white">
      <div className="container-site grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-light leading-tight text-brand-100">Noutăți din catalog</p>
          <h2 className="mt-1 text-3xl font-semibold leading-tight">Abonează-te la newsletter</h2>
          <NewsletterForm tone="dark" />
        </div>
        <nav aria-label="Linkuri din catalog">
          <h3 className="label-caps mb-4 text-brand-100">Catalog</h3>
          <ul className="space-y-2.5 text-sm">
            {groups.map((g) => (
              <li key={g.slug}>
                <Link href={groupPath(g)} className="link-underline">
                  {g.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalog/" className="link-underline">
                Toate produsele
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Branduri">
          <h3 className="label-caps mb-4 text-brand-100">Branduri</h3>
          <ul className="space-y-2.5 text-sm">
            {brands.slice(0, 8).map((b) => (
              <li key={b.slug}>
                <Link href={brandPath(b.name)} className="link-underline">
                  {b.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/branduri/" className="link-underline">
                Toate brandurile
              </Link>
            </li>
          </ul>
        </nav>
        <nav aria-label="Ajutor">
          <h3 className="label-caps mb-4 text-brand-100">Ajutor</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/cum-comanzi/" className="link-underline">
                Cum ceri o ofertă
              </Link>
            </li>
            <li>
              <Link href="/despre/" className="link-underline">
                Despre Gabis Fortuna
              </Link>
            </li>
            <li>
              <Link href="/contact/" className="link-underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/lista-oferta/" className="link-underline">
                Lista de ofertă
              </Link>
            </li>
            <li>
              <Link href="/termeni/" className="link-underline">
                Termeni și condiții
              </Link>
            </li>
            <li>
              <Link href="/confidentialitate/" className="link-underline">
                Politica de confidențialitate
              </Link>
            </li>
            <li>
              <Link href="/cookies/" className="link-underline">
                Politica de cookie-uri
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/15">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-brand-100 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="font-medium text-white">{SITE.company}</span> · {SITE.tagline.toLowerCase()}
            {(SITE.cui || SITE.regCom) && (
              <>
                {" · "}
                {[SITE.cui && `CUI ${SITE.cui}`, SITE.regCom && `Reg. Com. ${SITE.regCom}`].filter(Boolean).join(" · ")}
              </>
            )}
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>{SITE.address}</span>
            <a href={`mailto:${SITE.email}`} className="link-underline">
              {SITE.email}
            </a>
            <a href={`tel:${SITE.phoneTel}`} className="link-underline">
              {SITE.phoneDisplay}
            </a>
          </p>
        </div>
        {/* Official ANPC pictograms (SAL and SOL), 175 x 50, linked as required for online traders. */}
        <div className="container-site flex flex-wrap items-center gap-4 pb-6">
          <a href="https://reclamatiisal.anpc.ro/Depune-cerere-SAL" target="_blank" rel="noopener" className="inline-block transition-transform duration-200 hover:-translate-y-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anpc/sal.svg" alt="ANPC SAL: Soluționarea Alternativă a Litigiilor" width={175} height={50} className="h-[50px] w-[175px]" />
          </a>
          <a href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener" className="inline-block transition-transform duration-200 hover:-translate-y-0.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/anpc/sol.svg" alt="ANPC SOL: Soluționarea Online a Litigiilor" width={175} height={50} className="h-[50px] w-[175px]" />
          </a>
        </div>
        <div className="container-site border-t border-white/10 py-5 text-center text-xs text-brand-100">
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span>© {new Date().getFullYear()}</span>
            <span aria-hidden="true">•</span>
            <span>
              Built with <span className="text-danger" aria-label="dragoste">♥</span> by{" "}
              <a href="https://eduard-dev.ro/" target="_blank" rel="noopener" className="font-semibold text-white link-underline">
                Eduard
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
