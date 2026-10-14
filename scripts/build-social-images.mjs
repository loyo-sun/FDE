import fs from 'node:fs';
import sharp from 'sharp';
import matter from 'gray-matter';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const docs=fs.readdirSync('content/docs').filter(f=>f.endsWith('.mdx')).map(file=>matter(fs.readFileSync(`content/docs/${file}`,'utf8')).data);
const images=[{slug:'site',title:'FDE 学习与实战知识库',description:'从客户问题出发，构建软件与 AI 系统，交付可验证的业务价值。'},...docs];
fs.mkdirSync('public/social',{recursive:true});
for(const doc of images){
 const titleLines=[doc.title.slice(0,17),doc.title.slice(17,34)].filter(Boolean);
 const subtitle=doc.description.slice(0,43);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#102d40"/><path d="M950 0V630M1040 0V630M1130 0V630M0 110H1200M0 520H1200" stroke="#234456"/><circle cx="1130" cy="110" r="180" fill="#137b80" opacity=".3"/><g font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,sans-serif"><text x="76" y="104" font-size="24" letter-spacing="4" fill="#7ad5d7">FORWARD DEPLOYED ENGINEER</text>${titleLines.map((line,i)=>`<text x="76" y="${260+i*78}" font-size="58" font-weight="700" fill="#fff">${escape(line)}</text>`).join('')}<text x="76" y="430" font-size="23" fill="#b6cdd8">${escape(subtitle)}</text><text x="76" y="570" font-size="21" fill="#71c9ce">fde.loyo.work · 从入门到精通</text><text x="830" y="570" font-size="15" fill="#b6cdd8">来源：fde.loyo.work</text></g></svg>`;
 await sharp(Buffer.from(svg)).png().toFile(`public/social/${doc.slug}.png`);
}
fs.writeFileSync('public/social/sources.json',JSON.stringify(images.map(doc=>({file:`/social/${doc.slug}.png`,title:doc.title,source:'fde.loyo.work',generator:'scripts/build-social-images.mjs',createdAt:'2026-10-14'})),null,2)+'\n');
console.log(`Generated ${images.length} social sharing images.`);
