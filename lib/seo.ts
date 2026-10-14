import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";

export function pageMetadata({ title, description, path, keywords, image = "site", article = false, updatedAt }: { title: string; description: string; path: string; keywords: string[]; image?: string; article?: boolean; updatedAt?: string }): Metadata {
  const fullTitle = `${title}｜${siteName}`;
  const url = `${siteUrl}${path}`;
  const cover = { url: `${siteUrl}/social/${image}.png`, width: 1200, height: 630, alt: `${title} — FDE 中文学习与实战知识库` };
  return {
    title, description, keywords: [...new Set(["FDE", "Forward Deployed Engineer", ...keywords])],
    alternates: { canonical: url },
    openGraph: { title: fullTitle, description, url, siteName, locale: "zh_CN", type: article ? "article" : "website", images: [cover], ...(article && updatedAt ? { modifiedTime: `${updatedAt}T00:00:00+08:00` } : {}) },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: cover.url, alt: cover.alt }] },
  };
}

export function structuredData(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
