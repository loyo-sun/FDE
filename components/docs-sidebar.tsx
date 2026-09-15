import Link from "next/link";
import { statusLabels } from "@/lib/content-status";
import { categories, type DocMeta } from "@/lib/docs";

export function DocsSidebar({ docs, current }: { docs: DocMeta[]; current?: string }) {
  return (
    <aside className="docs-sidebar" aria-label="知识库目录">
      {categories.map((category) => {
        const categoryDocs = docs.filter((doc) => doc.category === category.id);
        if (!categoryDocs.length) return null;
        return (
          <section key={category.id}>
            <h2>{category.title}</h2>
            {categoryDocs.map((doc) => (
              <Link className={current === doc.slug ? "active" : ""} href={`/docs/${doc.slug}/`} key={doc.slug} aria-current={current === doc.slug ? "page" : undefined}>{doc.title}<small>{statusLabels[doc.status]}</small></Link>
            ))}
          </section>
        );
      })}
    </aside>
  );
}
