import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoriesOfGroup, firstLower, getGroup, groups, listRo, plural, productsOfGroup } from "@/lib/catalog";
import { CatalogView } from "@/components/catalog-view";

export function generateStaticParams() {
  return groups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalog/[group]">): Promise<Metadata> {
  const { group } = await params;
  const g = getGroup(group);
  if (!g) return {};
  const cats = categoriesOfGroup(g.slug).map((c) => firstLower(c.name));
  return {
    title: `${g.name}: ${plural(productsOfGroup(g.slug).length, "produs", "produse")} en-gros`,
    description: `${g.name} în catalogul Detergino: ${listRo(cats)}. Fără prețuri afișate: cere ofertă pe WhatsApp pentru bax sau palet.`,
  };
}

export default async function GroupPage({ params }: PageProps<"/catalog/[group]">) {
  const { group } = await params;
  const g = getGroup(group);
  if (!g) notFound();
  return (
    <CatalogView
      title={g.name}
      crumbs={[{ label: "Catalog", href: "/catalog/" }, { label: g.name }]}
      products={productsOfGroup(g.slug)}
      place={{ group: g.slug }}
      scope={{ group: g.slug }}
    />
  );
}
