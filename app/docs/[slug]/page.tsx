import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, FileText } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { DocToc } from "@/components/doc-toc";
import { collectHeadings, type Heading } from "@/lib/headings";
import { siteUrl } from "@/lib/site";
import { DocsSidebar } from "@/components/docs-sidebar";
import { statusLabels } from "@/lib/content-status";
import { getAllDocs, getCategory, getDoc } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
    keywords: doc.tags,
    alternates: { canonical: `/docs/${doc.slug}/` },
    openGraph: { title: doc.title, description: doc.description, type: "article" },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const headings: Heading[] = [];
  const { content } = await compileMDX({ source: doc.content, options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [collectHeadings, { headings }]] } } });
  const docs = getAllDocs();
  const index = docs.findIndex((item) => item.slug === slug);
  const previous = docs[index - 1];
  const next = docs[index + 1];
  const category = getCategory(doc.category);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    dateModified: doc.updatedAt,
    inLanguage: "zh-CN",
    author: { "@type": "Organization", name: "FDE Team" },
    mainEntityOfPage: `${siteUrl}/docs/${doc.slug}/`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "知识库", item: siteUrl },
      { "@type": "ListItem", position: 2, name: category?.title ?? doc.category, item: `${siteUrl}/#domain-${doc.category}` },
      { "@type": "ListItem", position: 3, name: doc.title },
    ],
  };

  return (
    <main className="docs-layout">
      <DocsSidebar key={`sidebar-${slug}`} docs={docs} current={slug} />
      <article className="doc-article" id="main-content" tabIndex={-1}>
        <nav className="breadcrumbs" aria-label="面包屑"><Link href="/">知识库</Link><span>/</span><Link href={`/#domain-${doc.category}`}>{category?.title}</Link></nav>
        <header className="doc-header">
          <span className="doc-type"><FileText size={15} /> {statusLabels[doc.status]}</span>
          <h1>{doc.title}</h1>
          <p>{doc.description}</p>
          <div className="doc-meta"><span><CalendarDays size={15} /> 更新于 <time dateTime={doc.updatedAt}>{doc.updatedAt}</time></span></div>
        </header>
        {doc.status === "outline" && <div className="content-notice outline"><p>本页是待完善大纲，提供学习目标、计划章节与预期交付物，正文和示例将逐步补充。</p></div>}
        <DocToc key={`${slug}-mobile`} headings={headings} mobile />
        <div className="mdx-content">{content}</div>
        <div className="article-tools" aria-label="文章辅助操作">
          <a href={`/docs-md/${doc.slug}.md`}>Markdown 原文</a>
          <a href={`https://github.com/loyo-sun/FDE/issues/new?title=${encodeURIComponent(`内容反馈：${doc.title}`)}&body=${encodeURIComponent(`文章：${siteUrl}/docs/${doc.slug}/\n\n问题描述：\n\n建议修改：\n`)}`} target="_blank" rel="noreferrer">反馈本页问题 ↗</a>
        </div>
        <nav className="doc-pagination" aria-label="文档翻页">
          {previous ? <Link href={`/docs/${previous.slug}/`}><ArrowLeft size={17} /><span><small>上一篇{previous.category !== doc.category ? ` · ${getCategory(previous.category)?.title}` : ""}</small>{previous.title}</span></Link> : <span />}
          {next ? <Link className="next" href={`/docs/${next.slug}/`}><span><small>下一篇{next.category !== doc.category ? ` · ${getCategory(next.category)?.title}` : ""}</small>{next.title}</span><ArrowRight size={17} /></Link> : <span />}
        </nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      </article>
      <DocToc key={`toc-${slug}`} headings={headings} />
    </main>
  );
}
