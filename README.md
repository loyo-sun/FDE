# FDE 从入门到精通

一套面向现场交付工程师的中文知识库，覆盖岗位成长、项目交付、AI 应用实施、故障排查、验收运维和知识治理。

[访问在线知识库](https://fde.loyo.work/) · [查看知识地图](https://fde.loyo.work/docs/knowledge-map/) · [开始学习交付流程](https://fde.loyo.work/docs/delivery-lifecycle/)

## 为什么做这个项目

FDE 的工作横跨产品、技术、项目和客户现场。很多关键经验散落在聊天记录、项目文档和个人笔记里，遇到问题时很难快速找到，更难复用。

这个项目尝试把这些经验整理成一套可以直接执行的知识体系。文档按现场任务和问题组织，每篇内容尽量写清适用范围、操作步骤、验证方法、失败回退和风险提示。

它适合：

- 正在了解或准备转向 FDE 岗位的人
- 需要独立负责客户现场交付的工程师
- 负责 AI 应用、RAG 或 Agent 项目落地的交付人员
- 希望统一团队交付标准和文档规范的负责人

## 知识库包含什么

| 知识域 | 主要内容 |
| --- | --- |
| 开始使用 | FDE 岗位认知、职责边界、能力模型和成长路径 |
| 项目交付 | 售前交接、启动、现场勘查、部署、联调、试运行和验收 |
| AI 应用交付 | 大模型基础、Prompt、RAG、Agent、数据工程和模型选型 |
| 故障排查 | 影响判断、证据链、根因定位、应急止损和复盘方法 |
| 运维与安全 | 监控、告警、变更、备份、权限、隐私和 AI 安全 |
| 项目管理 | 计划、沟通、风险、问题升级和范围变更 |
| 案例与工具 | 项目案例、现场检查工具、调试方法和交付模板 |
| 知识治理 | 文档标准、内容审核、版本管理、培训和能力认证 |

当前已经整理 17 篇基础文档。它们构成第一版知识骨架，后续内容会继续从真实交付场景中补充。

## 推荐阅读路径

初次接触 FDE，可以按下面的顺序阅读：

1. [FDE 知识地图](https://fde.loyo.work/docs/knowledge-map/)
2. [FDE 岗位与能力模型](https://fde.loyo.work/docs/role-and-competency/)
3. [交付生命周期](https://fde.loyo.work/docs/delivery-lifecycle/)
4. [现场实施标准作业](https://fde.loyo.work/docs/site-delivery-sop/)
5. [故障排查方法](https://fde.loyo.work/docs/troubleshooting-method/)

如果主要负责 AI 项目，可以从这些内容开始：

1. [AI 基础与能力边界](https://fde.loyo.work/docs/ai-foundations/)
2. [AI 应用交付](https://fde.loyo.work/docs/ai-delivery/)
3. [RAG 知识工程](https://fde.loyo.work/docs/rag-knowledge-engineering/)
4. [AI 评测与验收](https://fde.loyo.work/docs/ai-evaluation-and-acceptance/)
5. [AI 系统常见故障](https://fde.loyo.work/docs/ai-troubleshooting/)

## 网站特点

- 纯静态生成，页面打开快，部署简单
- 支持中文全文搜索，可查标题、正文、标签和故障关键词
- 每篇文档有独立标题、描述、canonical 和结构化数据
- 自动生成 Sitemap、robots、`llms.txt` 和机器可读内容索引
- 同时提供网页和原始 Markdown，方便搜索引擎与 AI 工具读取
- 内容使用 Git 管理，可以审阅、追踪和回退
- 桌面端和移动端均可使用

这个版本没有接入收费模型、数据库或在线 AI 问答，因此可以保持较低的运行成本。AI 相关能力目前集中在内容结构和索引适配上。

## 参与建设

知识库使用 Markdown 和 MDX 编写。欢迎补充真实、可复现、已脱敏的交付经验，例如：

- 一个有明确现象和根因的故障案例
- 一份经过项目验证的检查清单
- 某个交付阶段容易遗漏的风险
- AI 项目中的评测、召回或成本问题
- 可以跨项目复用的脚本、模板和方法

提交内容前，请删除客户名称、账号、密钥、内网地址、未脱敏日志和其他敏感信息。

## 内容如何维护

文档存放在 `content/docs/`。新增文档时创建一个 `.mdx` 文件，并填写头信息：

```yaml
---
title: 文档标题
description: 一句话说明文档解决的问题
slug: unique-slug
category: troubleshooting
order: 10
updatedAt: 2026-09-14
status: published
tags:
  - 故障排查
aiIndex: true
searchIndex: true
---
```

构建程序会根据这些信息更新站内搜索、Sitemap、原始 Markdown、`llms.txt` 和 `content.json`。

## 技术实现

- Next.js App Router
- TypeScript
- Markdown / MDX
- 静态导出
- GitHub 版本管理
- Vercel 部署

项目不依赖数据库。正式站点地址通过环境变量配置：

```text
NEXT_PUBLIC_SITE_URL=https://fde.loyo.work
```

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000` 查看本地网站。

生产构建：

```bash
npm run build
```

静态文件会输出到 `out/`。Vercel 导入本仓库后可以直接完成构建和发布。
