import type { Metadata } from "next";
import Link from "next/link";
import { brands, groups, groupPath, plural, products, productsOfGroup } from "@/lib/catalog";
import { SITE } from "@/lib/site";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Despre Gabis Fortuna SRL",
  description: `${SITE.company}, ${SITE.address}: ${SITE.tagline.toLowerCase()}. ${plural(products.length, "produs", "produse")}, ${plural(brands.length, "brand", "branduri")}, vânzare la bax și palet.`,
};

export default function AboutPage() {
  return (
    <PageShell title="Despre Gabis Fortuna" lead={`${SITE.company} este ${SITE.tagline.toLowerCase()}, cu adresa de contact în Brașov, pe strada Carierei 158.`}>
      <p>
        Catalogul Detergino cuprinde {plural(products.length, "produs", "produse")} din {plural(brands.length, "brand", "branduri")}: detergenți lichizi și praf, capsule, balsam de rufe, detergent de vase și de pardoseli, odorizante de cameră și WC, mopuri și accesorii de curățenie, șervețele umede, săpunuri lichide și o gamă de dulciuri.
      </p>
      <p>Vindem en-gros, la bax și la palet. Pe site nu afișăm prețuri: fiecare produs are un buton prin care ceri oferta pe WhatsApp, iar pentru mai multe produse folosești lista de ofertă.</p>
      <h2>Gamele din catalog</h2>
      <ul className="list-disc space-y-1 pl-5">
        {groups.map((g) => (
          <li key={g.slug}>
            <Link href={groupPath(g)}>{g.name}</Link>: {plural(productsOfGroup(g.slug).length, "produs", "produse")}
          </li>
        ))}
      </ul>
      <h2>Branduri</h2>
      <p>{brands.map((b) => b.name).join(", ")}.</p>
      <h2>Contact</h2>
      <p>
        {SITE.address} · <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      <p className="text-xs text-muted">[DE COMPLETAT: anul înființării, depozit, zone de livrare, fotografii cu depozitul și echipa, dacă doriți să apară pe site.]</p>
    </PageShell>
  );
}
