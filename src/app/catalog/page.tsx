import type { Metadata } from "next";
import { plural, products } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog-view";

export const metadata: Metadata = {
  title: "Tot catalogul de produse",
  description: `Toate cele ${plural(products.length, "produs", "produse")} Detergino: detergenți, balsam, detergent de vase și pardoseli, odorizante, articole de curățenie, șervețele umede, săpunuri și dulciuri. Cere ofertă pe WhatsApp.`,
};

export default function CatalogPage() {
  return (
    <CatalogView
      title="Tot catalogul"
      intro="Toate produsele importate și distribuite de Gabis Fortuna SRL. Alege o grupă din stânga sau filtrează după categorie, brand și ambalaj."
      crumbs={[{ label: "Catalog" }]}
      products={products}
      place={{ root: true }}
      scope={{}}
    />
  );
}
