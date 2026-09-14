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
};

export type Doc = DocMeta & { content: string };

export const categories = [
  { id: "start", title: "开始使用", description: "认识 FDE 岗位、能力模型与知识库使用方式" },
  { id: "delivery", title: "项目交付", description: "从售前交接到验收移交的标准交付路径" },
  { id: "ai", title: "AI 应用交付", description: "模型、RAG、Agent、数据与评测的实施方法" },
  { id: "troubleshooting", title: "故障排查", description: "按现象组织的诊断、止损、修复和复盘方法" },
  { id: "operations", title: "运维与安全", description: "监控、升级、备份、安全和合规要求" },
  { id: "management", title: "项目管理", description: "计划、沟通、风险、变更和客户协作" },
  { id: "practice", title: "案例与工具", description: "可复用案例、现场工具和常用模板" },
  { id: "governance", title: "知识治理", description: "文档标准、审核机制、培训和持续维护" },
];

const contentDir = path.join(process.cwd(), "content", "docs");

export function getAllDocs(): DocMeta[] {
  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const raw = fs.readFileSync(path.join(contentDir, name), "utf8");
      const { data } = matter(raw);
      return {
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
