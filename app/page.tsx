import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, ClipboardCheck, LifeBuoy, Route, SearchCheck, ShieldCheck } from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { categories, getAllDocs } from "@/lib/docs";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteName}｜现场交付工程师知识库`,
  description: siteDescription,
  alternates: { canonical: siteUrl },
};

const categoryIcons = {
  start: Route,
  delivery: ClipboardCheck,
  ai: Bot,
  troubleshooting: LifeBuoy,
  operations: ShieldCheck,
  management: Route,
  practice: SearchCheck,
  governance: ClipboardCheck,
};

export default function Home() {
  const docs = getAllDocs();
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    alternateName: ["FDE 知识库", "现场交付工程师知识库"],
    description: siteDescription,
    inLanguage: "zh-CN",
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/#knowledge-base`,
    url: siteUrl,
    name: `${siteName}｜现场交付工程师知识库`,
    description: siteDescription,
    inLanguage: "zh-CN",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: docs.length,
      itemListElement: docs.map((doc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: doc.title,
        url: `${siteUrl}/docs/${doc.slug}/`,
      })),
    },
  };
  return (
    <main>
      <section className="home-intro">
        <div className="eyebrow">现场交付工程师知识库 · FIELD DELIVERY ENGINEERING</div>
        <h1>FDE 从入门到精通</h1>
        <p>从岗位能力和交付流程开始，系统掌握 AI 应用实施、RAG 知识工程、故障排查、项目验收与持续运维。</p>
        <SearchBox />
        <div className="quick-links">
          <span>常用入口</span>
          <Link href="/docs/delivery-lifecycle/">交付生命周期</Link>
          <Link href="/docs/ai-delivery/">AI 应用交付</Link>
          <Link href="/docs/troubleshooting-method/">故障排查方法</Link>
        </div>
      </section>

      <section className="home-grid" aria-labelledby="knowledge-map-title">
        <div className="section-heading">
          <div><span>KNOWLEDGE MAP</span><h2 id="knowledge-map-title">知识库大纲</h2></div>
          <p>{docs.length} 篇基础文档 · 8 个知识域</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => {
            const first = docs.find((doc) => doc.category === category.id);
            const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
            return (
              <Link className="category-card" href={first ? `/docs/${first.slug}/` : "/"} key={category.id}>
                <div className="category-top"><Icon size={21} /><span>{String(docs.filter((doc) => doc.category === category.id).length).padStart(2, "0")}</span></div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <span className="card-link">查看文档 <ArrowRight size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="principles">
        <div><span className="principle-number">01</span><h2>按现场任务组织</h2><p>从现象和交付阶段进入，而不是从部门架构进入。</p></div>
        <div><span className="principle-number">02</span><h2>每篇都能执行</h2><p>统一包含前置条件、步骤、验证、回退和风险提示。</p></div>
        <div><span className="principle-number">03</span><h2>对机器同样清晰</h2><p>结构化元数据、原始 Markdown 和可追踪引用共同服务 AI 索引。</p></div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
    </main>
  );
}
