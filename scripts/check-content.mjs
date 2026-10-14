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
const fullIndex = fs.readFileSync("public/llms-full.txt", "utf8");
const imageSources = JSON.parse(fs.readFileSync("public/diagrams/sources.json", "utf8"));
const attributedImages = new Map(imageSources.map((item) => [item.file, item]));
assert.equal(attributedImages.size, imageSources.length, "Duplicate image attribution");
for (const item of imageSources) {
  assert(item.source && item.alt && item.createdAt && item.generator, `Incomplete attribution: ${item.file}`);
  assert.equal(item.source.replace(/^来源：/, ""), "fde.loyo.work", `Incorrect image source: ${item.file}`);
  assert(fs.existsSync(path.join("public", item.file)), `Missing original image: ${item.file}`);
  assert(fs.existsSync(path.join("out", item.file)), `Missing exported image: ${item.file}`);
  for (const root of ["public", "out"]) {
    assert(fs.readFileSync(path.join(root, item.file), "utf8").includes(">来源：fde.loyo.work</text>"), `Incorrect in-image credit: ${root}${item.file}`);
  }
}
const socialSources = JSON.parse(fs.readFileSync("public/social/sources.json", "utf8"));
for (const item of socialSources) assert.equal(item.source, "fde.loyo.work", `Incorrect share image source: ${item.file}`);
assert.equal(index.length, docs.length, "Index differs from source");
for (const category of categories) assert(docs.some(({ data }) => data.category === category.id), `Empty category ${category.id}`);
for (const { data, content } of docs) {
  assert(fullIndex.includes(content.trim()), `Full index omits source content: ${data.slug}`);
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
  for (const [, target] of content.matchAll(/\]\((\/(?!\/)[^#)\s]+)(?:#[^)]*)?\)/g)) {
    if (target.startsWith("/docs/") || target.startsWith("/topics/")) continue;
    assert(fs.existsSync(path.join("public", target)), `Missing content asset: ${data.slug}: ${target}`);
    assert(fs.existsSync(path.join("out", target)), `Missing exported asset: ${target}`);
  }
  const images = [...content.matchAll(/!\[([^\]]*)\]\((\/diagrams\/[^)]+)\)/g)];
  if (data.status !== "outline") {
    assert(images.length > 0, `Missing topic diagram: ${data.slug}`);
    assert(!content.includes("*图片来源："), `Redundant external image caption: ${data.slug}`);
  }
  for (const [, alt, target] of images) {
    assert(alt && attributedImages.has(target), `Unattributed image: ${data.slug}: ${target}`);
    assert(fs.readFileSync(path.join("public", target), "utf8").includes("来源："), `Missing in-image credit: ${target}`);
  }
}
const fixtures = JSON.parse(fs.readFileSync("public/examples/ticket-fixtures.json", "utf8"));
const evaluation = JSON.parse(fs.readFileSync("public/examples/evaluation-seed.json", "utf8"));
const fixtureIds = new Set(fixtures.documents.map((doc) => doc.id));
assert.equal(fixtureIds.size, fixtures.documents.length, "Duplicate fixture ID");
assert.equal(new Set(evaluation.cases.map((item) => item.id)).size, evaluation.cases.length, "Duplicate evaluation ID");
for (const item of evaluation.cases) {
  assert(Array.isArray(item.groups) && Array.isArray(item.expected) && item.category, `Invalid evaluation: ${item.id}`);
  for (const id of item.expected) assert(fixtureIds.has(id), `Unknown expected fixture: ${id}`);
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
console.log(`Validated ${categories.length} domains, ${docs.length} topics, ${imageSources.length} attributed diagrams, ${evaluation.cases.length} evaluation seeds and ${links} exported local links.`);
