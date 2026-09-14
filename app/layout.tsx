import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FDE Knowledge Base", template: "%s · FDE Knowledge Base" },
  description: "面向现场交付工程师的交付流程、AI 应用实施、故障处理与项目治理知识库。",
  applicationName: "FDE Knowledge Base",
  authors: [{ name: "FDE Team" }],
  creator: "FDE Team",
  openGraph: { type: "website", locale: "zh_CN", siteName: "FDE Knowledge Base" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <span>FDE Knowledge Base</span>
          <span>内容版本化 · 搜索友好 · AI 可索引</span>
        </footer>
      </body>
    </html>
  );
}
