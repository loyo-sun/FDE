import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';

const docs = fs.readdirSync('content/docs').filter(file => file.endsWith('.mdx')).map(file => matter(fs.readFileSync(`content/docs/${file}`, 'utf8')).data);
const categories = JSON.parse(fs.readFileSync('content/architecture.json', 'utf8'));
const diagrams = JSON.parse(fs.readFileSync('content/article-diagrams.json', 'utf8'));
const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fde.loyo.work').replace(/\/$/, '');
const pages = [{ path: '/', kind: 'CollectionPage' }, ...docs.map(doc => ({ path: `/docs/${doc.slug}/`, kind: doc.slug === 'knowledge-map' ? 'CollectionPage' : 'TechArticle', doc })), ...categories.map(category => ({ path: `/topics/${category.id}/`, kind: 'CollectionPage' }))];
const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
for (const page of pages) {
  const html = fs.readFileSync(`out${page.path}index.html`, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Missing or duplicate title: ${page.path}`); titles.add(title);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Expected one H1: ${page.path}`);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
  const getMeta = name => attr(meta.find(tag => attr(tag, 'name') === name || attr(tag, 'property') === name) ?? '', 'content');
  const description = getMeta('description');
  assert((description?.length ?? 0) > 8, `Missing description: ${page.path}`);
  assert(!descriptions.has(description), `Duplicate description: ${page.path}`); descriptions.add(description);
  assert(getMeta('keywords')?.includes('FDE'), `Missing keyword metadata: ${page.path}`);
  assert.equal(getMeta('og:url'), `${site}${page.path}`, `Wrong Open Graph URL: ${page.path}`);
  assert.equal(getMeta('twitter:card'), 'summary_large_image', `Missing Twitter card: ${page.path}`);
  const cover = getMeta('og:image');
  assert(cover?.startsWith(`${site}/social/`), `Missing sharing image: ${page.path}`);
  assert(fs.existsSync(`out${cover.slice(site.length)}`), `Sharing image not exported: ${page.path}`);
  assert(getMeta('og:image:alt'), `Missing sharing image alt: ${page.path}`);
  const canonicalTags = [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => attr(tag, 'rel') === 'canonical');
  assert.equal(canonicalTags.length, 1, `Canonical count: ${page.path}`);
  const canonical = attr(canonicalTags[0], 'href');
  assert.equal(canonical, `${site}${page.path}`, `Wrong canonical: ${page.path}`);
  assert(!canonicals.has(canonical), `Duplicate canonical: ${page.path}`); canonicals.add(canonical);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert(schemas.some(schema => schema['@type'] === page.kind), `Missing structured data: ${page.path}`);
  if (page.path !== '/') assert(schemas.some(schema => schema['@type'] === 'BreadcrumbList'), `Missing breadcrumb schema: ${page.path}`);
  for (const [, image] of html.matchAll(/(<img\b[^>]*>)/g)) assert(attr(image, 'alt'), `Missing image alt: ${page.path}`);
  if (page.doc) {
    assert(html.includes('keyword-tags'), `Missing visible keyword navigation: ${page.path}`);
    assert(fs.readFileSync(`public/diagrams/articles/${page.doc.slug}.svg`, 'utf8').includes('来源：'), `Missing in-image source: ${page.path}`);
    if (page.doc.slug !== 'knowledge-map') {
      assert(html.includes('aria-label="随阅读高亮的章节图解"'), `Missing interactive diagram: ${page.path}`);
      assert(!html.includes('*图片来源：') && !html.includes('图片来源：FDE 知识库原创 SVG 示意图'), `Duplicate image caption: ${page.path}`);
      for (const step of diagrams[page.doc.slug].steps) {
        assert(html.includes(`id="${step.id}"`), `Diagram points to missing chapter: ${page.path}#${step.id}`);
        assert(html.includes(`data-step="${step.id}"`), `Diagram missing chapter node: ${page.path}#${step.id}`);
      }
    }
  }
}
const sitemap = fs.readFileSync('out/sitemap.xml', 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]));
assert.equal(locations.length, pages.length, 'Unexpected sitemap URL count');
assert.equal(new Set(locations).size, locations.length, 'Duplicate sitemap URL');
for (const page of pages) assert(locations.includes(`${site}${page.path}`), `Missing sitemap URL: ${page.path}`);
assert.equal((sitemap.match(/<image:loc>/g) || []).length, docs.length, 'Missing sitemap images');
const robots = fs.readFileSync('out/robots.txt', 'utf8');
assert(robots.includes(`Sitemap: ${site}/sitemap.xml`), 'Missing robots sitemap');
assert(!robots.includes('Disallow: /_next/'), 'Search engines must access rendering assets');
const learning = fs.readFileSync('out/docs/knowledge-map/index.html', 'utf8');
for (const doc of docs) assert(learning.includes(`href="/docs/${doc.slug}/"`), `Learning topic not available in initial HTML: ${doc.slug}`);
console.log(`SEO verified: ${pages.length} unique pages, titles and canonicals; ${docs.length} chapter diagrams and sitemap images; crawlable topic links, metadata, alt and JSON-LD.`);
