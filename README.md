# FDE 从入门到精通

面向 **Forward Deployed Engineer（前沿部署工程师）** 的中文知识库。从客户问题出发，学习设计、编写和集成软件与 AI 系统，验证业务价值，并把项目经验反馈给产品。

[在线知识库](https://fde.loyo.work/) · [完整知识地图](https://fde.loyo.work/docs/knowledge-map/) · [岗位与能力模型](https://fde.loyo.work/docs/role-and-competency/)

## 新版知识架构

| 知识域 | 能力目标 | 主题数 |
| --- | --- | --- |
| 岗位与学习基础 | 理解职责，补齐基础并规划成长 | 4 |
| 客户问题与业务价值 | 访谈、流程分析、场景筛选与成功指标 | 4 |
| 方案设计与技术决策 | 架构、数据建模、集成设计与原型验证 | 4 |
| 软件工程与数据实现 | 服务、数据管道、业务应用与工程质量 | 4 |
| AI 应用与知识工程 | 模型边界、AI 交付、RAG、Agent 与评测 | 5 |
| 项目交付与上线验收 | 项目生命周期、部署联调与验收移交 | 3 |
| 可靠性与故障诊断 | 可观测性、诊断、AI 故障与变更运维 | 4 |
| 安全、权限与数据治理 | 身份权限、隐私、AI 治理与威胁建模 | 4 |
| 客户协作与产品反馈 | 项目协作、用户采用、产品反馈与方案复用 | 4 |
| 实战、模板与知识沉淀 | 端到端项目、案例工具、模板与文档治理 | 4 |

共 40 个主题：40 篇基础指南，已补齐方法、判断表、合成案例与练习。配有 **12 张原创 SVG 图解、7 份交付模板、20 条评测种子和离线检索演示**。这些学习材料不代表经过客户现场验证的生产操作手册。原有 17 篇文档的 URL 保持不变。

## 学习路线

- **新人入门**：岗位认知 → 工程基础 → 客户问题定义 → 交付生命周期。产出最小服务与一页问题定义。
- **项目实战**：成功指标 → 方案架构 → AI 应用交付 → 评测验收 → 运维移交。产出实现、评测与交接项目包。
- **进阶提升**：Agent → 可观测性 → 威胁建模 → 产品反馈 → 方案复用。产出运行证据与可复用方案。

首页展示三条路线和各知识域的全部文章。所有主题已从大纲补齐为基础指南；状态在首页、搜索、侧栏与 Markdown 索引中保持一致。

## 项目实战与资源

采用“企业售后工单助手”贯穿全部知识域，人物、资料与指标均为合成设定。首期边界为授权检索、草稿和人工审核。

- [完整知识地图](content/docs/01-knowledge-map.mdx)：10 个知识域、40 个主题、三条路线与维护规划。
- [端到端实战](content/docs/capstone-project.mdx)：六阶段任务、评分和进阶要求。
- [7 份交付模板](public/templates/)：问题定义、ADR、实验、评测、上线、移交与复盘。
- [20 条评测种子](public/examples/evaluation-seed.json)与[合成资料](public/examples/ticket-fixtures.json)。
- [离线检索演示](public/examples/offline-retrieval.py)：仅验证关键词与范围过滤，无网络、无模型、无真实身份系统。
- [图片来源清单](public/diagrams/sources.json)：全部配图为知识库原创 SVG，由 Codex 绘制，非外部照片或真实系统截图。

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

新增或调整内容时同步维护知识地图与学习路线。公开资料只能使用合成数据或已脱敏材料，不能包含客户密钥、账号、内网地址或未脱敏日志。

## 网站与搜索

- Next.js App Router、TypeScript、MDX，生产环境静态导出。
- 全站使用同一个顶部搜索框，支持中文全文检索、方向键、回车、Escape 与点击外部关闭。
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
```

构建前自动生成内容索引。`check:content` 验证分类、状态、唯一地址、内容链接、图片来源、教学资源和静态输出。原创图解可用 `npm run build:diagrams` 重新生成。导出文件位于 `out/`，可由静态托管平台发布。正式域名通过 `NEXT_PUBLIC_SITE_URL` 配置，默认 `https://fde.loyo.work`。

## 本轮验证与依赖维护（2026-10-14）

40 个主题已更新，构建与类型检查通过；内容检查覆盖图片来源、教学资源及站内链接，离线检索种子 20/20 通过。`llms-full.txt` 保留完整正文、表格和代码块，搜索索引使用精简文本。

框架已升级至 Next.js 16.4.0，并更新 source-map-js。安装检查仍报告 5 项已有依赖告警（sharp 相关 1 项高危、gray-matter 依赖链相关 4 项中危），本轮未进行强制破坏性升级。当前站点静态导出，不使用线上模型、动态服务或图像优化服务；这不替代后续依赖审查。
