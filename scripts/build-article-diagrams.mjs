import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
const f=JSON.parse(fs.readFileSync('content/framework.json','utf8'));
const docs=fs.readdirSync('content/docs').filter(file=>file.endsWith('.mdx')).map(file=>matter(fs.readFileSync(`content/docs/${file}`,'utf8')).data);
const byId=new Map(f.processes.map(p=>[p.id,p]));
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const pale=color=>'#'+[1,3,5].map(i=>Math.round(parseInt(color.slice(i,i+2),16)*.08+255*.92).toString(16).padStart(2,'0')).join('');
const credit='来源：fde.loyo.work';
const sources=JSON.parse(fs.readFileSync('public/diagrams/sources.json','utf8')).filter(s=>!s.file.startsWith('/diagrams/articles/')&&!s.file.startsWith('/diagrams/processes/')&&s.file!=='/diagrams/fde-framework.svg');
const definitions={};
function text(x,y,value,size=14,color='#244354',weight=400,anchor='start'){return `<text text-anchor="${anchor}" x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${escape(value)}</text>`;}
function document(title,description,w,h,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${escape(description)}</desc><rect width="${w}" height="${h}" fill="#fff"/><g font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,sans-serif">${body}</g></svg>`;}
function matrix({phases,lanes,current,local=false,title,description}){
 const w=local?900:1610, left=local?132:170, top=local?142:166, col=local?374:200, nodeHeight=local?42:40;
 let y=top,body=`<rect width="${w}" height="98" fill="#143849"/>${text(24,42,title,local?26:34,'#fff',700)}${text(24,76,description,local?14:18,'#c2dde4')}`;
 body+=text(20,top-20,'交付阶段 ↓',13,'#526c7d',600);
 lanes.forEach((lane,i)=>{const x=left+i*col;body+=`<rect x="${x}" y="106" width="${col-8}" height="${top-114}" fill="${lane.color}"/>${text(x+18,local?126:142,lane.title,local?17:20,'white',650)}`;});
 const prerequisites=new Set(current?.requires??[]);
 for(const phase of phases){
  const groups=lanes.map(lane=>f.processes.filter(p=>p.phase===phase.id&&p.lane===lane.id));
  const height=Math.max(...groups.map(items=>items.length),1)*(nodeHeight+8)+20;
  body+=`<rect x="14" y="${y}" width="${left-20}" height="${height-6}" fill="#edf1f4"/>${text(25,y+28,phase.title,local?16:19,'#274856',650)}`;
  if(!local)body+=text(25,y+55,phase.intent,12,'#657b85');
  groups.forEach((items,index)=>{
   const lane=lanes[index], x=left+index*col;
   body+=`<rect x="${x}" y="${y}" width="${col-8}" height="${height-6}" fill="${pale(lane.color)}"/>`;
   items.forEach((process,i)=>{
    const py=y+10+i*(nodeHeight+8),selected=process.id===current?.id,required=prerequisites.has(process.id),fill=selected?lane.color:'#fff';
    body+=`<a href="/docs/${process.slug}/#context-${process.id}" aria-label="${escape(process.label)}"><g data-process="${process.id}" data-current="${selected}"><title>${escape(process.label+'；产出：'+process.output)}</title><rect x="${x+8}" y="${py}" width="${col-24}" height="${nodeHeight}" rx="3" fill="${fill}" stroke="${lane.color}" stroke-width="${selected?3:1}"${required?' stroke-dasharray="5 3"':''}/>${text(x+18,py+26,process.label,local?16:13,selected?'#fff':lane.color,selected?700:500)}</g></a>`;
   });
  });y+=height;
 }
 if(local&&current){body+=text(24,y+23,'前置：'+(current.requires.length?current.requires.map(id=>byId.get(id).label).join(' · '):'客户任务、现场事实与已确认约束'),13,'#526c78');body+=text(24,y+47,'产出：'+current.output,14,'#254b5a',650);body+=text(24,y+74,'深色为当前主题 · 虚线为相关前置工作',12,'#71828b')+text(w-24,y+74,credit,12,'#71828b',400,'end');return document(title,description,w,y+93,body);}
 body+=text(24,y+30,'贯穿全程的基础能力',18,'#244354',650);
 f.foundations.forEach((base,i)=>{const x=24+i*510;body+=`<a href="/docs/${base.slug}/"><rect x="${x}" y="${y+44}" width="492" height="56" rx="3" fill="#f1f5f6" stroke="#cedbdd"/>${text(x+16,y+69,base.label,17,'#244354',650)}${text(x+16,y+89,base.output,12,'#607b85')}</a>`;});
 body+=text(24,y+129,credit,13,'#6a7f8a');return document(title,description,w,y+150,body);
}
function foundation(base){
 const w=900;let b=`<rect width="900" height="100" fill="#143849"/>${text(24,43,base.label,28,'#fff',700)}${text(24,77,'基础能力贯穿各阶段；不是文章章节目录。',16,'#c2dde4')}`;
 f.foundations.forEach((item,i)=>{const x=24+i*292,selected=item.id===base.id;b+=`<a href="/docs/${item.slug}/"><g data-process="foundation:${item.id}" data-current="${selected}"><rect x="${x}" y="126" width="270" height="96" rx="6" fill="${selected?'#245d70':'#f0f5f6'}" stroke="#c6d8de"/>${text(x+16,159,item.label,19,selected?'white':'#2c5061',650)}${text(x+16,191,item.output.slice(0,16),12,selected?'#cee6eb':'#637c84')}</g></a>`;});
 b+=text(24,267,'应用到整个交付生命周期',17,'#244354',650);
 f.phases.forEach((phase,i)=>{const x=24+i*145;b+=`<rect x="${x}" y="287" width="130" height="54" rx="4" fill="#edf2f5"/>${text(x+12,319,phase.title,16,'#416576')}`;});
 b+=text(24,379,'产出：'+base.output,16,'#284e5c',650)+text(24,415,'深色为当前主题',12,'#6a7f8a')+text(w-24,415,credit,12,'#6a7f8a',400,'end');
 return document(base.label+'在 FDE 知识框架中的位置',base.output+'；支撑六个交付阶段。',w,438,b);
}
fs.mkdirSync('public/diagrams/articles',{recursive:true});
const full=matrix({phases:f.phases,lanes:f.lanes,title:f.title,description:'六个交付阶段 × 七个能力领域 · 读工作、看产出、沿依赖理解全局'});
fs.writeFileSync('public/diagrams/fde-framework.svg',full);
sources.push({file:'/diagrams/fde-framework.svg',title:f.title,alt:f.description,source:credit,createdAt:'2026-10-14',generator:'scripts/build-article-diagrams.mjs'});
for(const doc of docs){
 let svg,definition,alt;
 if(doc.slug==='knowledge-map') {svg=full;definition={kind:'overview',processId:null,phaseIds:f.phases.map(p=>p.id),laneIds:f.lanes.map(l=>l.id)};alt=f.description;}
 else {
  const focus=f.focus[doc.slug];assert(focus,`Article has no deliberate framework mapping: ${doc.slug}`);
  if(focus.startsWith('foundation:')){
   const base=f.foundations.find(item=>focus==='foundation:'+item.id);assert(base);svg=foundation(base);definition={kind:'foundation',processId:focus,focusColumn:f.foundations.findIndex(item=>item.id===base.id),output:base.output,phaseIds:f.phases.map(p=>p.id),laneIds:[]};alt=base.label+'为六个交付阶段提供基础；深色板块为当前主题';
  } else {
   const current=byId.get(focus);assert(current);const pi=f.phases.findIndex(p=>p.id===current.phase);
   const phases=f.phases.slice(Math.max(0,pi-1),Math.min(f.phases.length,pi+2));
   const lanes=f.lanes.filter(l=>[current.lane,f.neighbors[current.lane]].includes(l.id));
   const stage=f.phases[pi],lane=f.lanes.find(l=>l.id===current.lane);
   alt=`${stage.title} × ${lane.title}：当前工作是${current.label}，产出${current.output}；显示相关阶段和相邻领域`;
   svg=matrix({phases,lanes,current,local:true,title:'局部框架 · '+lane.title,description:stage.title+' / '+current.label});
   definition={kind:'matrix',processId:current.id,focusColumn:lanes.findIndex(item=>item.id===current.lane),phase:stage.title,lane:lane.title,phaseIds:phases.map(p=>p.id),laneIds:lanes.map(l=>l.id),requires:current.requires,output:current.output};
  }
 }
 const file=`/diagrams/articles/${doc.slug}.svg`;fs.writeFileSync('public'+file,svg);
 const size=svg.match(/viewBox="0 0 (\d+) (\d+)"/);
 definitions[doc.slug]={title:doc.title,alt,width:Number(size[1]),height:Number(size[2]),...definition};
 sources.push({file,title:doc.title+'局部知识框架',alt,source:credit,createdAt:'2026-10-14',generator:'scripts/build-article-diagrams.mjs'});
}
const processContexts={};
fs.mkdirSync('public/diagrams/processes',{recursive:true});
for(const current of f.processes){
 const pi=f.phases.findIndex(p=>p.id===current.phase),stage=f.phases[pi],lane=f.lanes.find(l=>l.id===current.lane);
 const phases=f.phases.slice(Math.max(0,pi-1),Math.min(f.phases.length,pi+2));
 const lanes=f.lanes.filter(l=>[current.lane,f.neighbors[current.lane]].includes(l.id));
 const alt=`${stage.title} × ${lane.title}：当前工作是${current.label}，产出${current.output}；显示相关阶段和相邻领域`;
 const svg=matrix({phases,lanes,current,local:true,title:'局部框架 · '+lane.title,description:stage.title+' / '+current.label});
 const size=svg.match(/viewBox="0 0 (\d+) (\d+)"/);
 const file=`/diagrams/processes/${current.id}.svg`;fs.writeFileSync('public'+file,svg);
 processContexts[current.id]={title:current.label,alt,kind:'matrix',processId:current.id,focusColumn:lanes.findIndex(item=>item.id===current.lane),phase:stage.title,lane:lane.title,width:Number(size[1]),height:Number(size[2]),phaseIds:phases.map(p=>p.id),laneIds:lanes.map(l=>l.id),requires:current.requires,output:current.output};
 sources.push({file,title:current.label+'局部知识框架',alt,source:credit,createdAt:'2026-10-14',generator:'scripts/build-article-diagrams.mjs'});
}
fs.writeFileSync('content/process-diagrams.json',JSON.stringify(processContexts,null,2)+'\n');
fs.writeFileSync('content/article-diagrams.json',JSON.stringify(definitions,null,2)+'\n');
fs.writeFileSync('public/diagrams/sources.json',JSON.stringify(sources,null,2)+'\n');
console.log(`Generated framework overview and ${docs.length} deliberate article contexts from ${f.processes.length} delivery activities.`);
