import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const categories = JSON.parse(fs.readFileSync("content/architecture.json", "utf8"));
const docs = fs.readdirSync("content/docs").filter((file) => file.endsWith(".mdx")).map((file) => matter(fs.readFileSync(path.join("content/docs", file), "utf8")));
const slugs = new Set(docs.map(({ data }) => data.slug));
assert.equal(slugs.size, docs.length, "Duplicate slug");
const ids = new Set(categories.map((category) => category.id));
assert.equal(ids.size, categories.length, "Duplicate category");
const index = JSON.parse(fs.readFileSync("public/content.json", "utf8"));
assert.equal(index.length, docs.length, "Index differs from source");
for (const category of categories) assert(docs.some(({ data }) => data.category === category.id), `Empty category ${category.id}`);
for (const { data, content } of docs) {
  assert(ids.has(data.category), `Unknown category: ${data.slug}`);
  assert(["outline", "guide", "playbook"].includes(data.status), `Invalid status: ${data.slug}`);
  assert(!Number.isNaN(Date.parse(data.updatedAt)), `Invalid date: ${data.slug}`);
  assert(fs.existsSync(`out/docs/${data.slug}/index.html`), `Missing static page: ${data.slug}`);
  assert(fs.existsSync(`out/docs-md/${data.slug}.md`), `Missing Markdown: ${data.slug}`);
  assert.equal(index.find((item) => item.slug === data.slug)?.status, data.status, `Index status differs: ${data.slug}`);
  if (data.status === "outline") {
    for (const heading of ["## 学习目标", "## 计划章节", "## 预期交付物"]) assert(content.includes(heading), `Missing ${heading}: ${data.slug}`);
  }
  for (const [, slug] of content.matchAll(/\]\(\/docs\/([^/#)]+)\/?(?:#[^)]*)?\)/g)) assert(slugs.has(slug), `Broken content link: ${slug}`);
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
let links = 0;
for (const file of walk("out").filter((file) => file.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/href="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const target = decodeURIComponent(href);
    const destination = path.join("out", target.endsWith("/") ? `${target}index.html` : target);
    assert(fs.existsSync(destination), `${file}: missing ${target}`);
    links++;
  }
}
const home = fs.readFileSync("out/index.html", "utf8");
assert.equal((home.match(/role="combobox"/g) ?? []).length, 1, "Homepage must have one search");
for (const category of categories) assert(home.includes(`id="domain-${category.id}"`), `Missing category anchor ${category.id}`);
assert(!home.includes("FIELD DELIVERY"), "Old positioning on homepage");
console.log(`Validated ${categories.length} domains, ${docs.length} topics and ${links} local links across exported pages.`);
