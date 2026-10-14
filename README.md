# FDE 从入门到精通

面向 **Forward Deployed Engineer（前沿部署工程师）** 的中文知识库。从客户问题出发，学习设计、编写和集成软件与 AI 系统，验证业务价值，并把项目经验反馈给产品。

[在线知识库](https://fde.loyo.work/) · [学习路线](https://fde.loyo.work/docs/knowledge-map/) · [岗位与能力模型](https://fde.loyo.work/docs/role-and-competency/)

## 整体框架与内容专题

整体框架以 **六个交付阶段 × 七个能力领域** 组织 58 项工作，每项工作明确关联文章、前置工作和产出。矩阵结构参考用户提供的 PMBOK 流程图，FDE 内容独立编排，未转载参考图片。阶段可迭代，能力贯穿多个阶段；不是所有项目都需要全部 AI 活动。

- 阶段：发现立项、方案计划、构建验证、上线采用、持续运营、复用演进。
- 能力：业务价值、架构集成、数据知识、AI 自动化、工程运行、安全治理、协作产品。
- 基础：岗位边界、工程基础与能力评估，支撑全程。
- 进入文章后只显示相关的局部矩阵；突出当前工作、前置与产出，不显示章节卡片，也不浮动占据阅读区。
- 同一篇指南可能支持多个阶段。从总图进入时，链接中的上下文保留对应阶段，回到总图可重新定位。

下表是查阅文章的 10 个内容专题，与矩阵的能力轴用途不同：

| 内容专题 | 学习目标 | 主题数 |
| --- | --- | --- |
| 岗位与学习基础 | 能解释角色边界，规划自己的能力成长。 | 4 |
| 客户问题与业务价值 | 形成可验证的问题定义与成功标准。 | 5 |
| 方案设计与技术决策 | 能解释方案取舍，并用原型验证最大风险。 | 4 |
| 软件工程与数据实现 | 交付可运行、有测试、可追踪的软件变更。 | 4 |
| AI 应用与知识工程 | 能验证 AI 系统的效果、成本与安全边界。 | 6 |
| 项目交付与上线验收 | 交付上线证据与可接手的运维资料。 | 5 |
| 可靠性与故障诊断 | 能用证据定位问题，验证恢复和后续改进。 | 5 |
| 安全、权限与数据治理 | 形成可核验的访问边界和安全测试清单。 | 4 |
| 客户协作与产品反馈 | 能推动客户采用，并把共性需求反馈给产品团队。 | 5 |
| 实战、模板与知识沉淀 | 以代码、评测和复盘展示完整项目能力。 | 4 |

共 46 个主题。新增立项经济性、模型选型与替换、部署平台与迁移、性能与成本、持续价值复核及系统退出六篇基础指南。现有地址保持不变。教学案例采用合成数据，生产操作仍需实际环境验证。

## 学习路线

- **新人入门**：岗位认知 → 工程基础 → 客户问题定义 → 交付生命周期。产出最小服务与一页问题定义。
- **项目实战**：成功指标 → 方案架构 → AI 应用交付 → 评测验收 → 运维移交。产出实现、评测与交接项目包。
- **进阶提升**：Agent → 可观测性 → 威胁建模 → 产品反馈 → 方案复用。产出运行证据与可复用方案。

首页提供整体框架、学习路线与实战入口，避免重复罗列全部文章。`/docs/knowledge-map/` 先展示整体交付矩阵，再提供学习路线，支持路线切换、知识域与关键词筛选、已读进度及继续学习。进度仅保存在当前浏览器。10 个专题页集中展示相关主题；文章关键词可跳到学习页继续筛选。

## 项目实战与资源

采用“企业售后工单助手”贯穿全部知识域，人物、资料与指标均为合成设定。首期边界为授权检索、草稿和人工审核。

- [学习路线](content/docs/01-knowledge-map.mdx)：六阶段、七类能力、58 项工作、46 个主题；网页提供整体矩阵、局部定位与学习进度。
- [端到端实战](content/docs/capstone-project.mdx)：六阶段任务、评分和进阶要求。
- [7 份交付模板](public/templates/)：问题定义、ADR、实验、评测、上线、移交与复盘。
- [20 条评测种子](public/examples/evaluation-seed.json)与[合成资料](public/examples/ticket-fixtures.json)。
- [离线检索演示](public/examples/offline-retrieval.py)：仅验证关键词与范围过滤，无网络、无模型、无真实身份系统。
- [图片来源清单](public/diagrams/sources.json)：局部矩阵从全局能力框架生成，突出文章对应的交付工作，不从正文标题摘取节点；来源只在图内标注。全部为知识库原创 SVG，由 Codex 绘制。

```sh
python3 public/examples/offline-retrieval.py
```

当前建设完成知识体系、正文与教学材料；后续深化真实身份、模型接入、生产试点与经过授权的真实案例。不要把教学样本通过率当作生产质量结论。

## 内容维护

文档存放在 `content/docs/`，分类元数据在 `content/architecture.json`，首页路线在 `lib/learning-paths.ts`。

```yaml
---
title: 文档标题
description: 一句话说明要解决的问题
slug: unique-slug
category: engineering
order: 300
updatedAt: "2026-10-14"
status: guide
tags: [软件工程, FDE]
aiIndex: true
searchIndex: true
---
```

状态说明：

- `outline`：待完善大纲，列出学习目标、计划章节和交付物。
- `guide`：基础指南，提供概念、方法、判断依据或检查要点。
- `playbook`：操作手册，补齐适用版本、前置条件、步骤、验证、回退、风险与审核证据后才能使用此状态。

新增或调整内容时同步维护能力框架、专题目录与学习路线。公开资料只能使用合成数据或已脱敏材料，不能包含客户密钥、账号、内网地址或未脱敏日志。

## 网站与搜索

- Next.js App Router、TypeScript、MDX，生产环境静态导出。
- 全站使用同一个顶部搜索框，支持中文全文检索、方向键、回车、Escape 与点击外部关闭。
- 首页、学习路线、10 个专题页、45 篇正文合计 57 个独立页面，均静态导出。
- 每页独立标题、描述、canonical 与分享信息；文章展示关键词与相关阅读。
- 提供 WebSite、CollectionPage、TechArticle、BreadcrumbList 结构化数据；图片有可读描述及图内来源。
- sitemap 使用实际内容更新时间，覆盖 57 个页面及文章对应的局部框架；robots 保留渲染资源可抓取。
- 47 张 PNG 分享图在构建时生成，包含图片 Alt 和来源；源记录位于 `public/social/sources.json`。
- 搜索按标题相关性排序，同等相关性优先基础指南；多关键词需全部匹配。
- 提供 sitemap、robots、JSON-LD、原始 Markdown、`llms.txt` 和全文索引。
- 不接入收费模型、数据库或在线 AI 问答。

## 运行与验证

```sh
npm install
npm run dev
```

打开 `http://localhost:3000`。

```sh
npm run build
npm run typecheck
npm run check:content
npm run check:seo
npm run check:framework
```

构建前自动生成内容索引。`check:content` 验证分类、状态、唯一地址、内容链接、图片来源、教学资源和静态输出。原创图解可用 `npm run build:diagrams` 重新生成。构建前会重新生成框架映射、局部图、分享图和内容索引；`check:seo` 核验唯一标题/描述/canonical、结构化数据、局部框架位置和 sitemap。导出文件位于 `out/`，可由静态托管平台发布。正式域名通过 `NEXT_PUBLIC_SITE_URL` 配置，默认 `https://fde.loyo.work`。

## 本轮验证与依赖维护（2026-10-14）

46 个主题已更新，构建与类型检查通过；内容检查覆盖图片来源、教学资源及站内链接，离线检索种子 20/20 通过。`llms-full.txt` 保留完整正文、表格和代码块，搜索索引使用精简文本。

框架已升级至 Next.js 16.4.0，并更新 source-map-js。安装检查仍报告 4 项中危依赖告警（gray-matter 依赖链相关；sharp 已更新至 0.35.5），本轮未进行强制破坏性升级。当前站点静态导出，不使用线上模型、动态服务或图像优化服务；这不替代后续依赖审查。

## SEO 维护原则

以读者任务和可抓取内容为核心，不靠关键词堆砌。关键词标签同时服务浏览和页面语义，meta keywords 不作为搜索排名承诺。优化参考 [Google SEO 入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)、[图片最佳实践](https://developers.google.com/search/docs/appearance/google-images)和 [sitemap 指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)。收录和排名需发布后由搜索引擎决定；当前未执行 Search Console 账号验证或提交。

## 框架维护

`content/framework.json` 是全局关系的数据源。`focus` 为每篇文章指定默认工作位置；工作可引用前置活动并说明产出。新增文章不能自动从标题生成图示，必须明确对应的工作或基础能力。

构建生成整体 SVG、每篇文章的默认局部 SVG、58 项工作各自的入口上下文及图片来源。`check:framework` 检查文章覆盖、前置关系、局部裁取范围、当前主题高亮和全景深链接；`check:seo` 继续验证所有页面的元数据、canonical、Alt、sitemap 与结构化数据。
