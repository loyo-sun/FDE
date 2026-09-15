import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type DocMeta = {
  title: string;
  description: string;
  slug: string;
  category: string;
  order: number;
  updatedAt: string;
  tags: string[];
  aiIndex: boolean;
  searchIndex: boolean;
  status: "outline" | "guide" | "playbook";
};

export type Doc = DocMeta & { content: string };

export { default as categories } from "@/content/architecture.json";
import categories from "@/content/architecture.json";

const contentDir = path.join(process.cwd(), "content", "docs");

export function getAllDocs(): DocMeta[] {
  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const raw = fs.readFileSync(path.join(contentDir, name), "utf8");
      const { data } = matter(raw);
      return {
        status: data.status ?? "guide",
        title: data.title,
        description: data.description,
        slug: data.slug || name.replace(/\.mdx$/, ""),
        category: data.category,
        order: data.order ?? 999,
        updatedAt: String(data.updatedAt),
        tags: data.tags ?? [],
        aiIndex: data.aiIndex !== false,
        searchIndex: data.searchIndex !== false,
      };
    })
    .filter((doc) => doc.title && doc.slug)
    .sort((a, b) => a.order - b.order);
}

export function getDoc(slug: string): Doc | null {
  const meta = getAllDocs().find((doc) => doc.slug === slug);
  if (!meta) return null;
  const file = fs
    .readdirSync(contentDir)
    .find((name) => name.endsWith(".mdx") && (name.replace(/\.mdx$/, "") === slug || matter(fs.readFileSync(path.join(contentDir, name), "utf8")).data.slug === slug));
  if (!file) return null;
  const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
  const { content } = matter(raw);
  return { ...meta, content };
}

export function getCategory(category: string) {
  return categories.find((item) => item.id === category);
}
