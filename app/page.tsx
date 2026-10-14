import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories, getAllDocs } from "@/lib/docs";
import { statusLabels } from "@/lib/content-status";
import { learningPaths } from "@/lib/learning-paths";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteName}｜前沿部署工程师知识库` },
  description: siteDescription,
  alternates: { canonical: siteUrl },
};

export default function Home() {
  const docs = getAllDocs();
  const guides = docs.filter((doc) => doc.status !== "outline").length;
  const outlines = docs.length - guides;
  const schema = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: siteName, url: siteUrl, description: siteDescription, inLanguage: "zh-CN",
    isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: siteName, url: siteUrl, description: siteDescription, inLanguage: "zh-CN" },
    mainEntity: { "@type": "ItemList", numberOfItems: docs.length, itemListElement: docs.map((doc, index) => ({ "@type": "ListItem", position: index + 1, name: doc.title, url: `${siteUrl}/docs/${doc.slug}/` })) },
  };
  return (
    <main id="main-content">
      <section className="home-intro">
        <div className="eyebrow">FORWARD DEPLOYED ENGINEER · 前沿部署工程师</div>
        <h1>FDE 从入门到精通</h1>
        <p>深入客户问题，构建软件与 AI 方案，交付可验证的业务结果。</p>
        <div className="intro-actions"><Link className="primary-link" href="#learning-paths">选择学习路线 <ArrowRight size={17} /></Link><Link href="/docs/knowledge-map/">查看完整知识地图 <ArrowRight size={16} /></Link></div>
        <p className="intro-note">{categories.length} 个知识域 · {docs.length} 个主题 · {guides} 篇基础指南{outlines > 0 && ` · ${outlines} 篇待完善大纲`} · 12 张原创图解</p>
      </section>

      <section className="learning-section" id="learning-paths" aria-labelledby="learning-title">
        <div className="section-heading"><div><span>LEARNING PATHS</span><h2 id="learning-title">从你的阶段开始</h2></div><p>沿着项目产出学习，按需补齐能力</p></div>
        <div className="learning-grid">{learningPaths.map((path, index) => (
          <article className="learning-card" key={path.title}>
            <span className="path-step">路线 {index + 1}</span><h3>{path.title}</h3><p>{path.description}</p>
            <ol>{path.slugs.map((slug) => { const doc = docs.find((item) => item.slug === slug)!; return <li key={slug}><Link href={`/docs/${slug}/`}>{doc.title}</Link>{doc.status === "outline" && <span className="mini-status">大纲</span>}</li>; })}</ol>
            <strong className="path-outcome">{path.outcome}</strong>
          </article>
        ))}</div>
      </section>

      <section className="home-grid" aria-labelledby="knowledge-map-title">
        <div className="section-heading"><div><span>KNOWLEDGE MAP</span><h2 id="knowledge-map-title">完整知识体系</h2></div><p>{categories.length} 个知识域 · {docs.length} 个主题</p></div>
        <p className="section-description">按能力与项目任务查找内容。每个知识域直接列出全部主题，标注当前完成状态。</p>
        <nav className="domain-nav" aria-label="知识域快速跳转">{categories.map((category) => <a href={`#domain-${category.id}`} key={category.id}>{category.title}</a>)}</nav>
        <div className="category-grid">{categories.map((category) => {
          const articles = docs.filter((doc) => doc.category === category.id);
          return <section className="category-card" id={`domain-${category.id}`} key={category.id} aria-labelledby={`title-${category.id}`}>
            <div className="category-top"><h3 id={`title-${category.id}`}>{category.title}</h3><span>{articles.length} 篇文档</span></div>
            <p>{category.description}</p><p className="domain-outcome">{category.outcome}</p>
            <ul className="topic-list">{articles.map((doc) => <li key={doc.slug}><Link href={`/docs/${doc.slug}/`}><span>{doc.title}</span><span className={`status-badge ${doc.status}`}>{statusLabels[doc.status]}</span></Link></li>)}</ul>
          </section>;
        })}</div>
      </section>

      <section className="resource-section" aria-labelledby="resource-title">
        <div className="section-heading"><div><span>LEARN BY BUILDING</span><h2 id="resource-title">带着项目学习，留下可复核的证据</h2></div></div>
        <a className="resource-diagram" href="/diagrams/practice.svg" aria-label="查看实战项目证据包图解原图"><img src="/diagrams/practice.svg" alt="实战项目证据包：问题、方案、实现、验证、上线与知识六阶段" width="1000" height="570" loading="lazy" /></a>
        <p className="image-credit">图片来源：FDE 知识库原创 SVG，由 Codex 绘制 · <a href="/diagrams/sources.json">查看全部 12 张图片来源</a></p>
        <div className="resource-links"><Link href="/docs/capstone-project/">端到端合成项目 →</Link><Link href="/docs/delivery-templates/">7 份可下载交付模板 →</Link><a href="/examples/evaluation-seed.json">20 条评测种子 →</a><a href="/examples/offline-retrieval.py">离线检索演示 →</a></div>
      </section>

      <section className="build-status" aria-labelledby="build-title"><div><span className="eyebrow">持续建设</span><h2 id="build-title">用同一个项目，贯通全部知识域</h2><p>40 篇基础指南已补齐正文、判断表与练习。以合成售后工单项目串联学习，提供交付模板、评测种子与离线检索演示；生产操作仍需实际环境验证。</p></div><Link href="/docs/capstone-project/">进入端到端实战 <ArrowRight size={16} /></Link></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
