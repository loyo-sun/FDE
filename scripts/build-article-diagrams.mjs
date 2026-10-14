import fs from 'node:fs';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const plain = s => s.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/[*`_]/g,'').trim();
const diagrams={};
const sourceFile='public/diagrams/sources.json';
const sources=JSON.parse(fs.readFileSync(sourceFile,'utf8')).filter(item=>!item.file.startsWith('/diagrams/articles/'));
fs.mkdirSync('public/diagrams/articles',{recursive:true});
for(const file of fs.readdirSync('content/docs').filter(f=>f.endsWith('.mdx'))){
 const {data,content}=matter(fs.readFileSync(`content/docs/${file}`,'utf8'));
 const slugger=new GithubSlugger();
 const sections=[];
 let inCode=false;
 for(const line of content.split('\n')){
  if(line.startsWith('```')){inCode=!inCode;continue;}
  if(inCode) continue;
  const heading=line.match(/^(#{2,3}) (.+)$/);
  if(!heading)continue;
  const title=plain(heading[2]);const id=slugger.slug(title);
  if(heading[1].length===2 && !['主题图解','学习路线总览','参考阅读与使用边界'].includes(title)) sections.push({id,title});
 }
 const parts=content.split(/^## /m).slice(1);
 const steps=sections.map(section=>{
  const part=parts.find(p=>plain(p.split('\n')[0])===section.title)??'';
  let code=false; const prose=[];
  for(const raw of part.split('\n').slice(1)) {
   if(raw.startsWith('```')) { code=!code; continue; }
   if(code || /^[#|!\[]/.test(raw)) continue;
   const value=plain(raw).replace(/^[-*>]\s+/, '').replace(/^\d+[.、]\s*/, '');
   if(value)prose.push(value);
  }
  const line=prose[0];
  const summary=line?line.replace(/^\*\*/,'').slice(0,26)+(line.length>26?'…':''):'方法、示例与验证要点';
  return {...section,summary};
 });
 diagrams[data.slug]={title:data.title,description:data.description,steps};
 const cols=3,w=960,h=135+Math.ceil(steps.length/cols)*130+45;
 const boxes=steps.map((step,i)=>{const x=30+(i%cols)*310,y=132+Math.floor(i/cols)*130;const lines=[step.title.slice(0,14),step.title.slice(14,28)];return `<a href="/docs/${data.slug}/#${encodeURIComponent(step.id)}"><g><rect x="${x}" y="${y}" width="290" height="112" rx="12" fill="#fff" stroke="#b9d4dc"/><text x="${x+16}" y="${y+25}" font-size="13" fill="#147c87">PART ${String(i+1).padStart(2,'0')}</text>${lines.map((line,j)=>`<text x="${x+16}" y="${y+52+j*22}" font-size="18" fill="#14384a">${escape(line)}</text>`).join('')}<text x="${x+16}" y="${y+98}" font-size="12" fill="#536c78">${escape(step.summary.slice(0,20))}</text></g></a>`}).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escape(data.title)}章节图解</title><desc id="desc">${escape(steps.map(s=>s.title).join(' → '))}</desc><rect width="${w}" height="${h}" rx="18" fill="#edf5f5"/><path d="M0 0 H960 V106 H0" fill="#102d40"/><g font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,sans-serif"><text x="30" y="48" font-size="28" fill="#fff">${escape(data.title)}</text><text x="30" y="80" font-size="16" fill="#b5dce0">${escape(data.description)}</text>${boxes}<text x="30" y="${h-18}" font-size="13" fill="#53717b">来源：FDE 知识库原创 · Codex 绘制 · 2026-10-14</text></g></svg>`;
 const target=`/diagrams/articles/${data.slug}.svg`;fs.writeFileSync('public'+target,svg);
 sources.push({file:target,title:data.title+'章节图解',alt:steps.map(s=>s.title).join(' → '),source:'FDE 知识库原创；Codex 绘制',createdAt:'2026-10-14',generator:'scripts/build-article-diagrams.mjs'});
}
fs.writeFileSync('content/article-diagrams.json',JSON.stringify(diagrams,null,2)+'\n');
fs.writeFileSync(sourceFile,JSON.stringify(sources,null,2)+'\n');
console.log(`Generated ${Object.keys(diagrams).length} chapter diagrams.`);
