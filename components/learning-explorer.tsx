"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { learningPaths } from "@/lib/learning-paths";
import type { DocMeta } from "@/lib/docs";

type Category = { id: string; title: string; description: string; outcome: string };
const storageKey = "fde-learning-progress-v1";
const routes = [{ id: "all", title: "全部主题", description: "按内容专题查阅完整内容。", outcome: "自由组合你的学习计划", slugs: [] as string[] }, ...learningPaths.map((path, i) => ({ ...path, id: ["beginner", "project", "advanced"][i] }))];

export function LearningExplorer({ docs, categories }: { docs: DocMeta[]; categories: Category[] }) {
  const [route, setRoute] = useState("all");
  const [domain, setDomain] = useState("all");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(saved)) setCompleted(saved.filter((value): value is string => typeof value === "string" && docs.some(doc => doc.slug === value)));
    } catch { setStorageAvailable(false); }
    setStorageReady(true);
    const fromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith("route-")) {
        const id = hash.slice(6);
        if (routes.some(item => item.id === id)) { setRoute(id); setDomain("all"); setQuery(""); }
      } else if (hash.startsWith("domain-")) {
        const id = hash.slice(7);
        if (categories.some(item => item.id === id)) { setDomain(id); setRoute("all"); setQuery(""); }
      } else if (hash.startsWith("tag-")) {
        try { setQuery(decodeURIComponent(hash.slice(4))); setRoute("all"); setDomain("all"); } catch { /* Invalid fragment leaves the full library available. */ }
      }
    };
    fromHash(); window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [docs, categories]);
  useEffect(() => {
    if (!storageReady || !storageAvailable) return;
    try { localStorage.setItem(storageKey, JSON.stringify(completed)); } catch { setStorageAvailable(false); }
  }, [completed, storageReady, storageAvailable]);

  const selected = routes.find(item => item.id === route)!;
  const routeDocs = route === "all" ? docs : selected.slugs.map(slug => docs.find(doc => doc.slug === slug)!).filter(Boolean);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = routeDocs.filter(doc => (domain === "all" || doc.category === domain) && terms.every(term => `${doc.title} ${doc.description} ${doc.tags.join(" ")}`.toLowerCase().includes(term)));
  const done = routeDocs.filter(doc => completed.includes(doc.slug)).length;
  const next = routeDocs.find(doc => doc.slug !== "knowledge-map" && !completed.includes(doc.slug));
  const chooseRoute = (id: string) => { setRoute(id); setDomain("all"); setQuery(""); window.history.replaceState(null, "", `#route-${id}`); };
  const chooseDomain = (id: string) => { setDomain(id); setRoute("all"); window.history.replaceState(null, "", id === "all" ? "#route-all" : `#domain-${id}`); };
  const toggle = (slug: string) => setCompleted(items => items.includes(slug) ? items.filter(item => item !== slug) : [...items, slug]);

  return <div className="learning-explorer">
    <div className="route-switch" role="group" aria-label="选择学习路线">{routes.map((item, i) => <button type="button" id={`route-${item.id}`} key={item.id} aria-pressed={route === item.id} onClick={() => chooseRoute(item.id)}><span>0{i + 1}</span>{item.title}</button>)}</div>
    <section className="route-summary" aria-label="当前学习计划">
      <div><span className="eyebrow">你的学习计划</span><h2>{selected.title}</h2><p>{selected.description}</p><strong>{selected.outcome}</strong></div>
      <div className="route-progress"><span>{done} / {routeDocs.length} 篇已读</span><progress max={routeDocs.length || 1} value={done} aria-label="当前路线阅读进度" />{next ? <Link href={`/docs/${next.slug}/`}>从《{next.title}》继续 →</Link> : <p>本路线正文已读，可切换其他路线继续学习。</p>}<small>{storageAvailable ? "进度仅保存在当前浏览器，可随时取消标记。" : "当前浏览器无法保存进度，本次标记仍可使用。"}</small></div>
    </section>
    <div className="explorer-tools"><label htmlFor="topic-filter">筛选主题<input id="topic-filter" type="search" placeholder="搜索主题或关键词，如 RAG、权限" value={query} onChange={event => setQuery(event.target.value)} /></label><label htmlFor="domain-filter">内容专题<select id="domain-filter" value={domain} onChange={event => chooseDomain(event.target.value)}><option value="all">全部内容专题</option>{categories.map(category => <option value={category.id} key={category.id}>{category.title}</option>)}</select></label><p role="status">找到 {filtered.length} 个主题</p></div>
    {filtered.length === 0 && <div className="empty-topics"><h2>没有匹配的主题</h2><p>试试更短的关键词，或查看完整目录。</p><button type="button" onClick={() => chooseRoute("all")}>清除筛选</button></div>}
    <div className={`curriculum-grid ${route !== "all" ? "is-route" : ""}`}>{(route === "all" ? categories : [{ id: "route", title: "按顺序完成这些主题", description: selected.description, outcome: selected.outcome }]).map(category => {
      const items = filtered.filter(doc => route !== "all" || doc.category === category.id);
      if (!items.length) return null;
      return <section className="curriculum-domain" id={`domain-${category.id}`} key={category.id} aria-labelledby={`curriculum-${category.id}`}><header><h2 id={`curriculum-${category.id}`}>{category.title}</h2>{route === "all" && <Link href={`/topics/${category.id}/`}>专题介绍 ↗</Link>}</header><p>{category.outcome}</p><ol>{items.map((doc, stepIndex) => <li key={doc.slug} className={completed.includes(doc.slug) ? "is-complete" : ""}>{route !== "all" && <span className="sequence-number">{String(stepIndex + 1).padStart(2, "0")}</span>}<div><Link href={`/docs/${doc.slug}/`}>{doc.title}</Link><p>{doc.description}</p><span className="topic-keywords">{doc.tags.slice(0, 3).join(" · ")}</span></div><button type="button" aria-pressed={completed.includes(doc.slug)} aria-label={`${completed.includes(doc.slug) ? "取消已读" : "标记已读"}：${doc.title}`} onClick={() => toggle(doc.slug)}>{completed.includes(doc.slug) ? "✓ 已读" : "标记已读"}</button></li>)}</ol></section>;
    })}</div>
    <noscript>主题链接可直接阅读；路线筛选和进度记录需要启用 JavaScript。</noscript>
  </div>;
}
