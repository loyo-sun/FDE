import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, FileText } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { DocsSidebar } from "@/components/docs-sidebar";
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
    mainEntityOfPage: `/docs/${doc.slug}/`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "知识库", item: "/" },
      { "@type": "ListItem", position: 2, name: category?.title ?? doc.category },
      { "@type": "ListItem", position: 3, name: doc.title },
    ],
  };

  return (
    <main className="docs-layout">
      <DocsSidebar docs={docs} current={slug} />
      <article className="doc-article">
        <div className="breadcrumbs"><Link href="/">知识库</Link><span>/</span><span>{category?.title}</span></div>
        <header className="doc-header">
          <span className="doc-type"><FileText size={15} /> STANDARD PLAYBOOK</span>
          <h1>{doc.title}</h1>
          <p>{doc.description}</p>
          <div className="doc-meta"><span><CalendarDays size={15} /> 更新于 {doc.updatedAt}</span><span>{doc.tags.join(" · ")}</span></div>
        </header>
        <div className="mdx-content">
          <MDXRemote source={doc.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
        </div>
        <nav className="doc-pagination" aria-label="文档翻页">
          {previous ? <Link href={`/docs/${previous.slug}/`}><ArrowLeft size={17} /><span><small>上一篇</small>{previous.title}</span></Link> : <span />}
          {next ? <Link className="next" href={`/docs/${next.slug}/`}><span><small>下一篇</small>{next.title}</span><ArrowRight size={17} /></Link> : <span />}
        </nav>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      </article>
      <aside className="doc-aside">
        <span>本文档</span>
        <a href={`/docs-md/${doc.slug}.md`}>查看 Markdown</a>
        <a href="/llms.txt">AI 内容索引</a>
        <a href="/content.json">结构化数据</a>
      </aside>
    </main>
  );
}
