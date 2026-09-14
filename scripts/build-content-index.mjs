import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
    const markdown = `# ${data.title}\n\n${data.description}\n\n${content.trim()}\n`;
    fs.writeFileSync(path.join(markdownDir, `${slug}.md`), markdown);

    return {
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

const list = docs.map((doc) => `- [${doc.title}](${doc.url}) — ${doc.description}`).join("\n");
const llms = `# FDE 从入门到精通\n\n> 面向现场交付工程师的系统化知识库，覆盖岗位能力、项目交付、AI 应用实施、RAG 知识工程、故障排查、验收运维与项目治理。\n\nCanonical: https://fde.loyo.work/\n\n## Documentation\n\n${list}\n`;
fs.writeFileSync(path.join(publicDir, "llms.txt"), llms);

const full = docs
  .map((doc) => `# ${doc.title}\n\n${doc.description}\n\nSource: ${doc.url}\n\n${doc.content}`)
  .join("\n\n---\n\n");
fs.writeFileSync(path.join(publicDir, "llms-full.txt"), full);

console.log(`Generated indexes for ${docs.length} documents.`);
