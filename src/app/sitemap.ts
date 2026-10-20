import type { MetadataRoute } from "next";
import { brandPath, brands, categories, categoryPath, groupPath, groups, productPath, products } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["/", "/catalog/", "/branduri/", "/despre/", "/contact/", "/cum-comanzi/", "/termeni/", "/confidentialitate/", "/cookies/"];
  return [
    ...statics.map((u) => ({ url: `${SITE.url}${u}`, changeFrequency: "monthly" as const, priority: u === "/" ? 1 : 0.6 })),
    ...groups.map((g) => ({ url: `${SITE.url}${groupPath(g)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...categories.map((c) => ({ url: `${SITE.url}${categoryPath(c)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...brands.map((b) => ({ url: `${SITE.url}${brandPath(b.name)}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({ url: `${SITE.url}${productPath(p)}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
