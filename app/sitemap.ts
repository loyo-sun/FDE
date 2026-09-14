import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...getAllDocs().map((doc) => ({
      url: `${siteUrl}/docs/${doc.slug}/`,
      lastModified: new Date(doc.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
