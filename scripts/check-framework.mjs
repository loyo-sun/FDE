import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';
const framework=JSON.parse(fs.readFileSync('content/framework.json','utf8'));
const contexts=JSON.parse(fs.readFileSync('content/article-diagrams.json','utf8'));
const processes=JSON.parse(fs.readFileSync('content/process-diagrams.json','utf8'));
const docs=fs.readdirSync('content/docs').filter(file=>file.endsWith('.mdx')).map(file=>matter(fs.readFileSync(`content/docs/${file}`,'utf8')).data);
const slugs=new Set(docs.map(doc=>doc.slug));
const ids=new Set(framework.processes.map(p=>p.id));
assert.equal(ids.size,framework.processes.length,'Duplicate framework work ID');
assert.equal(new Set(framework.phases.map(p=>p.id)).size,framework.phases.length,'Duplicate phase');
assert.equal(new Set(framework.lanes.map(p=>p.id)).size,framework.lanes.length,'Duplicate lane');
for(const process of framework.processes){
 assert(slugs.has(process.slug),`Work points to missing article: ${process.id}`);
 assert(process.label && process.output,`Missing work or output: ${process.id}`);
 assert(framework.phases.some(p=>p.id===process.phase),`Unknown phase: ${process.id}`);
 assert(framework.lanes.some(p=>p.id===process.lane),`Unknown lane: ${process.id}`);
 for(const prerequisite of process.requires){assert(ids.has(prerequisite),`Unknown prerequisite: ${process.id} -> ${prerequisite}`);assert.notEqual(prerequisite,process.id,'Self dependency');}
 const context=processes[process.id]; assert(context,`Missing entry-specific context: ${process.id}`);
 assert(context.phaseIds.includes(process.phase) && context.laneIds.includes(process.lane),`Local slice loses current position: ${process.id}`);
 assert(context.phaseIds.length<=3 && context.laneIds.length<=2,`Local slice is not local: ${process.id}`);
 const svg=fs.readFileSync(`public/diagrams/processes/${process.id}.svg`,'utf8');
 assert.equal((svg.match(/data-current="true"/g)||[]).length,1,`Ambiguous current work: ${process.id}`);
 assert(svg.includes(`data-process="${process.id}" data-current="true"`),`Wrong current work: ${process.id}`);
 assert(fs.existsSync(`out/diagrams/processes/${process.id}.svg`),`Missing exported process slice: ${process.id}`);
}
for(const doc of docs.filter(doc=>doc.slug!=='knowledge-map')){
 const focus=framework.focus[doc.slug];assert(focus,`Unmapped article: ${doc.slug}`);
 if(focus.startsWith('foundation:'))assert(framework.foundations.some(f=>focus==='foundation:'+f.id && f.slug===doc.slug),`Bad foundation mapping: ${doc.slug}`);
 else assert(framework.processes.some(p=>p.id===focus && p.slug===doc.slug),`Bad article mapping: ${doc.slug}`);
 assert(contexts[doc.slug].processId===focus,`Generated context differs from framework: ${doc.slug}`);
}
const map=fs.readFileSync('out/docs/knowledge-map/index.html','utf8');
assert(map.includes('id="framework"') && map.includes('id="learning-routes"'),'Missing framework/learning separation');
for(const process of framework.processes){assert(map.includes(`id="process-${process.id}"`),`Work missing from initial map HTML: ${process.id}`);assert(map.includes(`href="/docs/${process.slug}/#context-${process.id}"`),`Map loses entry context: ${process.id}`);}
assert(fs.existsSync('out/diagrams/fde-framework.svg'),'Missing full framework export');
console.log(`Framework verified: ${framework.phases.length} stages × ${framework.lanes.length} lanes, ${ids.size} delivery activities, ${docs.length-1} mapped guides, ${ids.size} entry-specific local contexts.`);
