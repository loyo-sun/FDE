import fs from 'node:fs';
const diagrams = [
 ['foundations','FDE 能力成长闭环','用项目证据连接业务判断与工程能力',['角色与边界|确认责任及协作对象','工程基础|服务、数据与测试','问题定义|观察真实业务任务','端到端实现|构建最小可用流程','价值验证|评测、试点与复盘','能力复用|沉淀模板及产品反馈']],
 ['discovery','从客户诉求到可验证问题','先收集事实，再决定范围与成功标准',['访谈取证|最近一次任务与例外','流程还原|参与人、等待及交接','问题陈述|用户、障碍与影响','场景筛选|价值、可行性及风险','指标基线|样本、分母与观察窗口','范围共识|纳入、排除与验收人']],
 ['design','从业务约束到方案决策','优先验证风险最大的假设',['约束清单|时延、成本及数据边界','业务模型|对象、关系及状态','组件边界|身份、服务及存储','集成契约|错误、重试及一致性','原型实验|对照基线与失败条件','决策记录|证据、代价及重审触发']],
 ['engineering','让一次请求成为可靠业务动作','服务端负责验证权限和状态',['用户输入|交互校验及任务上下文','接口入口|身份、参数及限流','业务服务|权限、状态及幂等','数据事务|约束、审计及事件','异步处理|重试、隔离及补偿','结果反馈|进度、失败及追踪编号']],
 ['ai','AI 交付的证据链','从简单基线开始，按任务增加复杂度',['任务样本|答案要点与风险标签','确定性基线|搜索、规则或人工流程','方案实验|提示词、RAG 或工作流','离线评测|质量、成本及安全','受控试点|人工复核及降级','版本回归|应用、模型及知识索引']],
 ['delivery','从启动到可移交的交付门禁','每个阶段以证据结束，而非以会议结束',['启动与范围|角色、指标及依赖','方案与原型|契约、架构及风险','实施与联调|版本、配置及测试','试运行|分组观察及故障演练','验收|冻结样本及签署结论','移交|值班、恢复及遗留事项']],
 ['reliability','故障诊断与恢复闭环','先控制影响，再用证据排除假设',['发现影响|用户、范围及开始时间','止损处置|降级、隔离或回退','还原时间线|发布、依赖及数据变化','验证假设|一次只改变一个变量','业务恢复|用户任务及数据一致性','复盘改进|负责人、期限及回归测试']],
 ['security','沿数据与动作边界设置控制','模型输出不能替代服务端授权',['身份边界|用户、服务及租户','数据入口|分类、用途及最小收集','检索边界|权限过滤及缓存隔离','模型边界|不可信内容与输出校验','动作边界|工具白名单及人工批准','审计与删除|证据、保留及撤销验证']],
 ['collaboration','把现场经验变成可复用价值','交付结果需要用户采用与产品承接',['共同目标|负责人、用户及验收人','协作节奏|风险、问题及决策','试点采用|培训、任务及反馈','效果复盘|价值、限制及未解问题','需求抽象|共性、差异及产品边界','规模化复用|配置、升级及维护责任']],
 ['practice','实战项目的证据包','所有示范材料使用合成数据',['问题包|访谈、范围及指标','方案包|架构、契约及决策','实现包|代码、数据及运行说明','验证包|评测、权限及异常','上线包|灰度、监控及回退','知识包|复盘、模板及维护计划']],
 ['rag','RAG 检索与知识更新链路','文档权限贯穿接入、召回与回答',['接入与解析|文档版本、来源及权限','切片与索引|语义边界、哈希及删除','查询与过滤|身份、租户及当前版本','召回与排序|关键词、向量及去重','回答与引用|仅使用证据，无据转人工','回归与更新|失效、撤权及召回抽检']],
 ['agent','受控 Agent 的工具执行边界','每次写操作在服务端重新授权',['任务与身份|限定目标、用户及预算','计划与选择|只提供允许调用的工具','参数与权限|结构校验及资源授权','审批与执行|读写分离、幂等及确认','结果与状态|审计、超时及人工接管','结束与复核|步数上限及结果验证']],
];
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
fs.mkdirSync('public/diagrams',{recursive:true});
const positions = [[48,170],[360,170],[672,170],[672,370],[360,370],[48,370]];
for(const [id,title,subtitle,steps] of diagrams){
 const boxes=steps.map((step,i)=>{const [label,detail]=step.split('|');const [x,y]=positions[i];return `<g><rect x="${x}" y="${y}" width="280" height="120" rx="16" fill="#fff" stroke="#c4d8e1"/><text x="${x+20}" y="${y+30}" fill="#087e8b" font-size="15">STEP 0${i+1}</text><text x="${x+20}" y="${y+65}" fill="#102d40" font-size="23" font-weight="600">${escape(label)}</text><text x="${x+20}" y="${y+96}" fill="#4f6473" font-size="16">${escape(detail)}</text></g>`}).join('');
 const arrows=['M328 230 H350','M640 230 H662','M812 290 V360','M672 430 H650','M360 430 H338'].map(d=>`<path d="${d}" stroke="#087e8b" stroke-width="3" fill="none" marker-end="url(#arrow)"/>`).join('');
 fs.writeFileSync(`public/diagrams/${id}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 570" role="img" aria-labelledby="title desc"><title id="title">${escape(title)}</title><desc id="desc">${steps.map(s=>escape(s.replace('|','：'))).join(' → ')}</desc><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="#087e8b"/></marker></defs><rect width="1000" height="570" rx="20" fill="#eef5f8"/><path d="M0 0 H1000 V132 H0" fill="#102d40"/><g font-family="PingFang SC,Microsoft YaHei,Noto Sans CJK SC,sans-serif"><text x="48" y="58" fill="#fff" font-size="32" font-weight="700">${escape(title)}</text><text x="48" y="98" fill="#b6d9e3" font-size="19">${escape(subtitle)}</text>${arrows}${boxes}<text x="48" y="540" fill="#536d7c" font-size="14">来源：fde.loyo.work</text></g></svg>`);
}
fs.writeFileSync('public/diagrams/sources.json', JSON.stringify(diagrams.map(([id,title,,steps])=>({file:`/diagrams/${id}.svg`,title,alt:steps.map(s=>s.replace('|','：')).join(' → '),source:'fde.loyo.work',createdAt:'2026-10-14',generator:'scripts/build-diagrams.mjs',usage:'本知识库配图；外部参考资料的授权不适用于这些原创示意图'})),null,2)+'\n');
console.log(`Generated ${diagrams.length} original diagrams and attribution manifest.`);
