"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown, BookOpenText } from "lucide-react";
import categories from "@/content/architecture.json";
import type { DocMeta } from "@/lib/docs";

export function DocsSidebar({ docs, current }: { docs: DocMeta[]; current: string }) {
  const currentCategory = docs.find((doc) => doc.slug === current)?.category;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(() => new Set(currentCategory ? [currentCategory] : []));
  const id = useId();
  return (
    <aside className={`docs-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="知识库导航">
      <button type="button" className="sidebar-toggle" aria-expanded={mobileOpen} aria-controls={id} onClick={() => setMobileOpen(!mobileOpen)}><BookOpenText size={17} />知识库目录<ChevronDown size={16} /></button>
      <nav id={id} className="sidebar-content" aria-label="知识库目录">
        <Link className="sidebar-map" href="/docs/knowledge-map/">完整知识地图</Link>
        {categories.map((category) => {
          const categoryDocs = docs.filter((doc) => doc.category === category.id);
          if (!categoryDocs.length) return null;
          return <details className="sidebar-group" key={category.id} open={openCategories.has(category.id)} onToggle={(event) => {
            const shouldOpen = event.currentTarget.open;
            setOpenCategories((previous) => {
              const updated = new Set(previous);
              if (shouldOpen) updated.add(category.id);
              else updated.delete(category.id);
              return updated;
            });
          }}>
            <summary>{category.title}<ChevronDown size={14} aria-hidden="true" /></summary>
            <div>{categoryDocs.map((doc) => <Link className={current === doc.slug ? "active" : ""} href={`/docs/${doc.slug}/`} key={doc.slug} aria-current={current === doc.slug ? "page" : undefined} onClick={() => setMobileOpen(false)}><span>{doc.title}</span>{doc.status === "outline" && <small>大纲</small>}</Link>)}</div>
          </details>;
        })}
      </nav>
    </aside>
  );
}
