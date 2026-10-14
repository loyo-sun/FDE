import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getAllDocs, getCategory } from "@/lib/docs";
import { pageMetadata, structuredData } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() { return categories.map(category => ({ category: category.id })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const category = getCategory((await params).category);
  if (!category) return {};
  const docs = getAllDocs().filter(doc => doc.category === category.id);
  return pageMetadata({ title: `${category.title}专题`, description: `${category.description}${category.outcome}包含${docs.map(doc => doc.title).slice(0, 3).join("、")}等学习主题。`, path: `/topics/${category.id}/`, keywords: [category.title, ...new Set(docs.flatMap(doc => doc.tags))] });
}
export default async function TopicPage({ params }: { params: Promise<{ category: string }> }) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const docs = getAllDocs().filter(doc => doc.category === category.id);
  const related = categories.filter(item => item.id !== category.id).slice(Math.max(0, categories.findIndex(item => item.id === category.id) - 1), Math.max(0, categories.findIndex(item => item.id === category.id) - 1) + 3);
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: category.title, description: category.description, url: `${siteUrl}/topics/${category.id}/`, inLanguage: "zh-CN", isPartOf: { "@id": `${siteUrl}/#website` }, mainEntity: { "@type": "ItemList", numberOfItems: docs.length, itemListElement: docs.map((doc, index) => ({ "@type": "ListItem", position: index + 1, name: doc.title, url: `${siteUrl}/docs/${doc.slug}/` })) } };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "FDE 知识库", item: `${siteUrl}/` }, { "@type": "ListItem", position: 2, name: category.title, item: `${siteUrl}/topics/${category.id}/` }] };
  return <main className="topic-page" id="main-content"><nav className="breadcrumbs" aria-label="面包屑"><Link href="/">FDE 知识库</Link><span>/</span><span>{category.title}</span></nav><header><span className="eyebrow">TOPIC COLLECTION · {docs.length} 个主题</span><h1>{category.title}</h1><p>{category.description}</p><strong>{category.outcome}</strong><Link className="topic-route-link" href={`/docs/knowledge-map/#domain-${category.id}`}>加入我的学习计划 →</Link></header><section className="topic-reading-list" aria-label="专题阅读顺序">{docs.map((doc, index) => <article key={doc.slug}><span>{String(index + 1).padStart(2, "0")}</span><div><h2><Link href={`/docs/${doc.slug}/`}>{doc.title}</Link></h2><p>{doc.description}</p><nav className="keyword-tags" aria-label={`${doc.title}关键词`}>{doc.tags.map(tag => <Link key={tag} href={`/docs/knowledge-map/#tag-${encodeURIComponent(tag)}`}>{tag}</Link>)}</nav></div></article>)}</section><section className="related-topics"><h2>继续探索</h2>{related.map(item => <Link key={item.id} href={`/topics/${item.id}/`}>{item.title} →</Link>)}</section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(schema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData(breadcrumb) }} /></main>;
}
