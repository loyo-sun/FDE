import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const statusLabels = { outline: "待完善大纲", guide: "基础指南", playbook: "操作手册" };

const projectRoot = process.cwd();
const contentDir = path.join(projectRoot, "content", "docs");
const publicDir = path.join(projectRoot, "public");
const markdownDir = path.join(publicDir, "docs-md");

fs.mkdirSync(markdownDir, { recursive: true });

const files = fs
  .readdirSync(contentDir)
  .filter((file) => file.endsWith(".mdx"))
  .sort();

const docs = files
  .map((file) => {
    const source = fs.readFileSync(path.join(contentDir, file), "utf8");
    const { data, content } = matter(source);
    const slug = data.slug || file.replace(/\.mdx$/, "");
    const markdown = `# ${data.title}\n\n状态：${statusLabels[data.status] ?? "基础指南"}\n\n${data.description}\n\n${content.trim()}\n`;
    fs.writeFileSync(path.join(markdownDir, `${slug}.md`), markdown);

    return {
      status: data.status ?? "guide",
      title: data.title,
      description: data.description,
      slug,
      category: data.category,
      order: data.order ?? 999,
      updatedAt: String(data.updatedAt),
      tags: data.tags ?? [],
      url: `/docs/${slug}/`,
      markdown: `/docs-md/${slug}.md`,
      content: content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`\[\]()|-]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    };
  })
  .filter((doc) => doc.title)
  .sort((a, b) => a.order - b.order);

fs.writeFileSync(path.join(publicDir, "content.json"), JSON.stringify(docs, null, 2));

const list = docs.map((doc) => `- [${doc.title}](${doc.url}) — ${statusLabels[doc.status]}：${doc.description}`).join("\n");
const llms = `# FDE 从入门到精通\n\n> 面向 Forward Deployed Engineer（前沿部署工程师）的中文知识库，覆盖客户问题、软件工程、AI 系统、业务价值与产品反馈。内容分为基础指南和待完善大纲，后者不代表完整教程。\n\nCanonical: https://fde.loyo.work/\n\n## Documentation\n\n${list}\n`;
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);

const full = docs
  .map((doc) => `# ${doc.title}\n\n状态：${statusLabels[doc.status]}\n\n${doc.description}\n\nSource: ${doc.url}\n\n${doc.content}`)
  .join("\n\n---\n\n");
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), full);

console.log(`Generated indexes for ${docs.length} documents.`);
