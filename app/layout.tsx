import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import "./globals.css";

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
  },
  twitter: {
    card: "summary",
    title: `${siteName}｜前沿部署工程师知识库`,
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
          <div className="footer-about"><span>{siteName}</span><p>面向前沿部署工程师，持续完善的学习与实践知识库。</p></div>
          <nav aria-label="页脚导航">
            <a href="https://github.com/loyo-sun/FDE" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="https://github.com/loyo-sun/FDE/issues" target="_blank" rel="noreferrer">内容纠错 ↗</a>
            <a href="https://github.com/loyo-sun/FDE#参与贡献" target="_blank" rel="noreferrer">参与贡献 ↗</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
