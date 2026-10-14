import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, FileText } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { DocToc } from "@/components/doc-toc";
import { collectHeadings, type Heading } from "@/lib/headings";
import { siteUrl } from "@/lib/site";
import { pageMetadata, structuredData } from "@/lib/seo";
import { FrameworkContext } from "@/components/framework-context";
import { KnowledgeFramework } from "@/components/knowledge-framework";
import { LearningExplorer } from "@/components/learning-explorer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { statusLabels } from "@/lib/content-status";
import { categories, getAllDocs, getCategory, getDoc } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const doc = getDoc((await params).slug);
  if (!doc) return {};
  return pageMetadata({ title: doc.title, description: doc.description, path: `/docs/${doc.slug}/`, keywords: doc.tags, image: doc.slug, article: doc.slug !== "knowledge-map", updatedAt: doc.updatedAt });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const docs = getAllDocs();
  if (slug === "knowledge-map") {
    const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: doc.title, description: doc.description, url: `${siteUrl}/docs/knowledge-map/`, inLanguage: "zh-CN", isPartOf: { "@id": `${siteUrl}/#website` }, mainEntity: { "@type": "ItemList", numberOfItems: docs.length, itemListElement: docs.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.title, url: `${siteUrl}/docs/${item.slug}/` })) } };
    const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "FDE 知识库", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: doc.title, item: `${siteUrl}/docs/knowledge-map/` }] };
    return <main id="main-content" className="learning-page"><nav className="breadcrumbs" aria-label="面包屑"><Link href="/">FDE 知识库</Link><span>/</span><span>知识框架与学习路线</span></nav><header className="learning-header"><span className="eyebrow">BUILD YOUR LEARNING PATH</span><h1>FDE 知识框架</h1><p>以交付阶段和能力领域理解整体，再沿学习路线补齐能力。每项工作都有产出，进入文章即可看到它在全局中的位置。</p><nav className="framework-page-nav" aria-label="框架与学习入口"><a href="#framework">查看整体框架 ↓</a><a href="#learning-routes">选择学习路线 ↓</a></nav><nav className="keyword-tags" aria-label="学习路线关键词">{doc.tags.map(tag => <a key={tag} href={`#tag-${encodeURIComponent(tag)}`}>{tag}</a>)}</nav></header><KnowledgeFramework /><section className="learning-routes-section" id="learning-routes"><div className="section-heading"><div><span>LEARNING PATHS</span><h2>从你的阶段开始学习</h2></div><p>总图帮助理解关系，路线帮助安排学习顺序。</p></div><LearningExplorer docs={docs} categories={categories} /></section><section className="learning-resources"><h2>边学边做</h2><Link href="/docs/capstone-project/">端到端合成项目 →</Link><Link href="/docs/delivery-templates/">可下载交付模板 →</Link><Link href="/docs/training-and-certification/">八周学习与能力评估 →</Link><a href="/docs-md/knowledge-map.md">完整路线 Markdown →</a></section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(schema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(breadcrumb) }} /></main>;
  }
  const headings: Heading[] = [];
  const { content } = await compileMDX({ source: doc.content.replace(/\n## (?:主题图解|框架位置|学习路线总览)\n[\s\S]*?(?=\n## )/, ""), options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [collectHeadings, { headings }]] } } });
  const index = docs.findIndex((item) => item.slug === slug);
  const previous = docs[index - 1];
  const next = docs[index + 1];
  const category = getCategory(doc.category);
  const related = docs.filter(item => item.slug !== slug && item.slug !== "knowledge-map")
    .map(item => ({ item, score: (item.category === doc.category ? 5 : 0) + item.tags.filter(tag => doc.tags.includes(tag)).length }))
    .filter(entry => entry.score > 0).sort((a, b) => b.score - a.score || a.item.order - b.item.order).slice(0, 3).map(entry => entry.item);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    dateModified: doc.updatedAt,
    inLanguage: "zh-CN",
    keywords: doc.tags.join(", "),
    image: `${siteUrl}/social/${slug}.png`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    publisher: { "@type": "Organization", name: "FDE Team" },
    author: { "@type": "Organization", name: "FDE Team" },
    mainEntityOfPage: `${siteUrl}/docs/${doc.slug}/`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "知识库", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: category?.title ?? doc.category, item: `${siteUrl}/topics/${doc.category}/` },
      { "@type": "ListItem", position: 3, name: doc.title, item: `${siteUrl}/docs/${slug}/` },
    ],
  };

  return (
    <main className="docs-layout">
      <DocsSidebar key={`sidebar-${slug}`} docs={docs} current={slug} />
      <article className="doc-article" id="main-content" tabIndex={-1}>
        <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">知识库</Link><span>/</span><Link href={`/topics/${doc.category}/`}>{category?.title}</Link></nav>
        <header className="doc-header">
          <span className="doc-type"><FileText size={15} /> {statusLabels[doc.status]}</span>
          <h1>{doc.title}</h1>
          <p>{doc.description}</p>
          <nav className="keyword-tags" aria-label="文章关键词">{doc.tags.map(tag => <Link key={tag} href={`/docs/knowledge-map/#tag-${encodeURIComponent(tag)}`}>{tag}</Link>)}</nav>
          <div className="doc-meta"><span><CalendarDays size={15} /> 更新于 <time dateTime={doc.updatedAt}>{doc.updatedAt}</time></span></div>
        </header>
        {doc.status === "outline" && <div className="content-notice outline"><p>本页是待完善大纲，提供学习目标、计划章节与预期交付物，正文和示例将逐步补充。</p></div>}
        <FrameworkContext slug={slug} />
        <DocToc key={`${slug}-mobile`} headings={headings} mobile />
        <div className="mdx-content">{content}</div>
        <section className="related-reading" aria-labelledby="related-reading-title"><h2 id="related-reading-title">接着阅读</h2><div>{related.map(item => <Link href={`/docs/${item.slug}/`} key={item.slug}><strong>{item.title}</strong><span>{item.description}</span></Link>)}</div><Link className="back-to-route" href={`/docs/knowledge-map/#domain-${doc.category}`}>回到学习路线，记录进度 →</Link></section>
        <div className="article-tools" aria-label="文章辅助操作">
          <a href={`/docs-md/${doc.slug}.md`}>Markdown 原文</a>
          <a href={`https://github.com/loyo-sun/FDE/issues/new?title=${encodeURIComponent(`内容反馈：${doc.title}`)}&body=${encodeURIComponent(`文章：${siteUrl}/docs/${doc.slug}/\n\n问题描述：\n\n建议修改：\n`)}`} target="_blank" rel="noreferrer">反馈本页问题 ↗</a>
        </div>
        <nav className="doc-pagination" aria-label="文档翻页">
          {previous ? <Link href={`/docs/${previous.slug}/`}><ArrowLeft size={17} /><span><small>上一篇{previous.category !== doc.category ? ` · ${getCategory(previous.category)?.title}` : ""}</small>{previous.title}</span></Link> : <span />}
          {next ? <Link className="next" href={`/docs/${next.slug}/`}><span><small>下一篇{next.category !== doc.category ? ` · ${getCategory(next.category)?.title}` : ""}</small>{next.title}</span><ArrowRight size={17} /></Link> : <span />}
        </nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(breadcrumbLd) }} />
      </article>
      <DocToc key={`toc-${slug}`} headings={headings} />
    </main>
  );
}
