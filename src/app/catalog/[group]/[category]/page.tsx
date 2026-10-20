import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, getGroup, groupPath, listRo, plural, productsOfCategory } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog-view";

export function generateStaticParams() {
  return categories.map((c) => ({ group: c.group, category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalog/[group]/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  const list = productsOfCategory(c.slug);
  const brandsIn = listRo(Array.from(new Set(list.map((p) => p.brand).filter((b): b is string => Boolean(b)))));
  return {
    title: `${c.name}: ${plural(list.length, "produs", "produse")} en-gros`,
    description: `${c.name}${brandsIn ? ` de la ${brandsIn}` : ""} în catalogul Detergino, Brașov. Ambalare la bax și palet. Cere ofertă pe WhatsApp.`,
  };
}

export default async function CategoryPage({ params }: PageProps<"/catalog/[group]/[category]">) {
  const { group, category } = await params;
  const c = getCategory(category);
  const g = getGroup(group);
  if (!c || !g || c.group !== g.slug) notFound();
  return (
    <CatalogView
      title={c.name}
      crumbs={[{ label: "Catalog", href: "/catalog/" }, { label: g.name, href: groupPath(g) }, { label: c.name }]}
      products={productsOfCategory(c.slug)}
      place={{ group: g.slug, category: c.slug }}
      scope={{ category: c.slug }}
      hideCategory
    />
  );
}
