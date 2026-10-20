import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { brandPath, brands, plural, productsOfBrand } from "@/lib/catalog";
import { brandLogo } from "@/lib/brands";
import { ProductImage } from "@/components/product-image";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Branduri importate și distribuite",
  description: `Cele ${plural(brands.length, "brand", "branduri")} din catalogul Detergino: ${brands.map((b) => b.name).join(", ")}.`,
};

export default function BrandsPage() {
  return (
    <div className="container-site pt-6">
      <Breadcrumbs items={[{ label: "Branduri" }]} />
      <h1 className="mt-6 text-3xl font-semibold text-brand-navy md:text-4xl">Branduri</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">Brandurile importate și distribuite de Gabis Fortuna SRL, cu numărul de produse din catalog.</p>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {brands.map((b) => {
          const sample = productsOfBrand(b.name).find((p) => p.images.length);
          const logo = brandLogo(b.name);
          return (
            <li key={b.slug}>
              <Link href={brandPath(b.name)} className="block text-center">
                <span className="panel flex aspect-square items-center justify-center bg-brand-50 p-6 transition-colors hover:bg-brand-100">
                  {logo ? <Image src={logo} alt="" width={320} height={160} className="h-auto max-h-full w-full object-contain" /> : sample && <ProductImage product={sample} sizes="300px" decorative />}
                </span>
                <span className="mt-3 block text-sm font-semibold uppercase tracking-[0.12em] text-brand-navy">{b.name}</span>
                <span className="mt-1 block text-xs text-muted">{plural(b.count, "produs", "produse")}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
