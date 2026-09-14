import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName}｜现场交付工程师知识库`, template: `%s｜${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "FDE",
    "现场交付工程师",
    "Field Delivery Engineer",
    "项目交付",
    "AI 应用交付",
    "RAG 知识库",
    "故障排查",
    "运维验收",
  ],
  authors: [{ name: "FDE Team" }],
  creator: "FDE Team",
  publisher: "FDE Team",
  category: "technology",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: siteUrl,
    siteName,
    title: `${siteName}｜现场交付工程师知识库`,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: `${siteName}｜现场交付工程师知识库`,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <span>{siteName}</span>
          <span>内容版本化 · 搜索友好 · AI 可索引</span>
        </footer>
      </body>
    </html>
  );
}
