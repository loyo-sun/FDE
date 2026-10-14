import type { MetadataRoute } from "next";
import { categories, getAllDocs } from "@/lib/docs";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();
  const latest = (items: typeof docs) => new Date(items.map(doc => doc.updatedAt).sort().at(-1) ?? "2026-10-14");
  return [
    { url: `${siteUrl}/`, lastModified: latest(docs), changeFrequency: "weekly", priority: 1 },
    ...categories.map(category => ({ url: `${siteUrl}/topics/${category.id}/`, lastModified: latest(docs.filter(doc => doc.category === category.id)), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...docs.map(doc => ({ url: `${siteUrl}/docs/${doc.slug}/`, lastModified: new Date(doc.updatedAt), changeFrequency: "monthly" as const, priority: doc.slug === "knowledge-map" ? 0.9 : 0.7, images: [`${siteUrl}/diagrams/articles/${doc.slug}.svg`] })),
  ];
}
