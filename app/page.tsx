import Link from "next/link";
import { ArrowUpRight, BookOpen, Compass, Layers } from "lucide-react";
import { categories, getAllDocs } from "@/lib/docs";
import { pageMetadata, structuredData } from "@/lib/seo";
import { framework } from "@/lib/framework";
import { siteDescription, siteUrl } from "@/lib/site";

export const metadata = pageMetadata({ title: "FDE 知识库：学习路线、软件工程与 AI 交付", description: siteDescription, path: "/", keywords: ["前沿部署工程师", "FDE学习路线", "客户问题", "软件工程", "AI交付", "RAG", "Agent"] });
const entries = [
  { number: "01", title: "先看整体框架", description: "沿六个交付阶段，理解七类能力如何协作。", href: "/docs/knowledge-map/#framework", label: "打开 FDE 全景", icon: Compass },
  { number: "02", title: "沿路线学习", description: "选择适合你的阶段，逐步完成项目产出。", href: "/docs/knowledge-map/#learning-routes", label: "选择学习路线", icon: Layers },
  { number: "03", title: "动手做项目", description: "用合成工单案例串联设计、验证与移交。", href: "/docs/capstone-project/", label: "进入项目实战", icon: BookOpen },
];

export default function Home() {
  const docs = getAllDocs();
  const picks = ["role-and-competency", "rag-knowledge-engineering", "ai-evaluation-and-acceptance", "delivery-templates"].map(slug => docs.find(doc => doc.slug === slug)!);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "FDE 学习与实战知识库", url: `${siteUrl}/`, description: siteDescription, inLanguage: "zh-CN", isPartOf: { "@id": `${siteUrl}/#website` }, mainEntity: { "@type": "ItemList", itemListElement: categories.map((category, index) => ({ "@type": "ListItem", position: index + 1, name: category.title, url: `${siteUrl}/topics/${category.id}/` })) } };
  return <main id="main-content" className="home-v2">
    <section className="home-hero">
      <div className="hero-copy"><span className="eyebrow">FORWARD DEPLOYED ENGINEER</span><h1>FDE 学习与实战知识库</h1><p>从客户问题出发，学会构建软件与 AI 系统，交付可验证的业务价值。</p><Link className="hero-cta" href="/docs/knowledge-map/">查看 FDE 整体知识框架 <ArrowUpRight size={18} /></Link><div className="hero-stats"><span><strong>{framework.lanes.length}</strong> 个能力领域</span><span><strong>{docs.length}</strong> 个主题</span><span><strong>{framework.phases.length}</strong> 个交付阶段</span></div></div>
      <aside className="hero-note"><span>FIELD NOTES / 001</span><h2>带着真实任务学习</h2><p>发现问题 → 设计方案 → 编写软件 → 验证效果 → 交付与复用</p><Link href="/docs/role-and-competency/">先了解 FDE 做什么 ↗</Link></aside>
    </section>
    <section className="home-entry" id="learning-paths" aria-label="知识库浏览入口">{entries.map(entry => <article key={entry.number}><div><span>{entry.number}</span><entry.icon size={21} /></div><h2>{entry.title}</h2><p>{entry.description}</p><Link href={entry.href}>{entry.label} <ArrowUpRight size={15} /></Link></article>)}</section>
    <section className="home-domains" id="knowledge-domains" aria-labelledby="domains-title"><div className="section-heading"><div><span>EXPLORE THE LIBRARY</span><h2 id="domains-title">按专题查阅</h2></div><Link href="/docs/knowledge-map/#route-all">全部主题 ↗</Link></div><div className="domain-tiles">{categories.map((category, index) => <Link id={`domain-${category.id}`} href={`/topics/${category.id}/`} key={category.id}><span>{String(index + 1).padStart(2, "0")} / {docs.filter(doc => doc.category === category.id).length} 篇</span><h3>{category.title}</h3><ArrowUpRight size={16} /></Link>)}</div></section>
    <section className="home-picks" aria-labelledby="picks-title"><div className="section-heading"><div><span>START HERE</span><h2 id="picks-title">值得先读的四篇</h2></div></div><div>{picks.map(doc => <Link key={doc.slug} href={`/docs/${doc.slug}/`}><h3>{doc.title}</h3><p>{doc.description}</p><span>{doc.tags.slice(0, 2).join(" · ")}</span></Link>)}</div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(schema) }} />
  </main>;
}
