import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { brands, getBrand, plural, productsOfBrand } from "@/lib/catalog";
import { brandInfo, brandLogo, brandSummary } from "@/lib/brands";
import { CatalogView } from "@/components/catalog-view";

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/branduri/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) return {};
  return {
    title: `${b.name}: ${plural(b.count, "produs", "produse")} en-gros`,
    description: brandSummary(b.name),
  };
}

export default async function BrandPage({ params }: PageProps<"/branduri/[slug]">) {
  const { slug } = await params;
  const b = getBrand(slug);
  if (!b) notFound();
  const logo = brandLogo(b.name);
  const info = brandInfo(b.name);
  return (
    <CatalogView
      title={b.name}
      crumbs={[{ label: "Branduri", href: "/branduri/" }, { label: b.name }]}
      products={productsOfBrand(b.name)}
      scope={{ brand: b.name }}
      intro={[info?.description, brandSummary(b.name)].filter(Boolean).join(" ")}
      header={
        logo || info?.website ? (
          <div className="mt-4 flex flex-col gap-3">
            {logo && (
              <span className="panel block w-40 border border-line bg-white p-4">
                <Image src={logo} alt={`Logo ${b.name}`} width={320} height={160} className="h-auto w-full object-contain" />
              </span>
            )}
            {info?.website && (
              <a href={info.website} target="_blank" rel="noopener" className="text-sm text-ink underline underline-offset-4">
                Site-ul producătorului
              </a>
            )}
          </div>
        ) : undefined
      }
    />
  );
}
