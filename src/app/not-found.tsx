import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductRail } from "@/components/product-rail";

export default function NotFound() {
  const sample = products.filter((p) => p.images.length).slice(0, 8);
  return (
    <div className="container-site pt-16 text-center">
      <h1 className="mt-3 text-3xl font-semibold text-brand-navy md:text-4xl">Nu există această pagină</h1>
      <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft">Adresa poate fi greșită sau produsul a fost scos din catalog. Caută produsul sau mergi la pagina principală.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-dark min-w-[200px]">
          Pagina principală
        </Link>
        <Link href="/catalog/" className="btn-light min-w-[200px]">
          Tot catalogul
        </Link>
      </div>
      <section className="mt-20 text-left">
        <h2 className="heading-xl text-center">Din catalog</h2>
        <div className="mt-8">
          <ProductRail products={sample} label="Produse din catalog" />
        </div>
      </section>
    </div>
  );
}
