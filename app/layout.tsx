import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";
import { structuredData } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${siteName}｜前沿部署工程师知识库`, template: `%s｜${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "FDE",
    "前沿部署工程师",
    "Forward Deployed Engineer",
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
    title: `${siteName}｜前沿部署工程师知识库`,
    description: siteDescription,
    images: [{ url: "/social/site.png", width: 1200, height: 630, alt: "FDE 从入门到精通 — 学习路线与实战知识库" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}｜前沿部署工程师知识库`,
    description: siteDescription,
    images: ["/social/site.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName, alternateName: "FDE 中文知识库", url: `${siteUrl}/`, description: siteDescription, inLanguage: "zh-CN", publisher: { "@type": "Organization", name: "FDE Team" } }) }} />
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-about"><span>{siteName}</span><p>面向前沿部署工程师，持续完善的学习与实践知识库。</p></div>
          <nav aria-label="页脚导航">
            <a href="https://github.com/loyo-sun/FDE" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://github.com/loyo-sun/FDE/issues" target="_blank" rel="noreferrer">内容纠错 ↗</a>
            <a href="/docs/knowledge-map/" target="_blank" rel="noreferrer">学习路线 →</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
