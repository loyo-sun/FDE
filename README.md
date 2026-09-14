# FDE Knowledge Base

面向现场交付工程师的静态知识库基础架构，重点支持中文检索、SEO 和 AI 内容索引。

## 技术栈

- Next.js App Router + TypeScript
- Markdown / MDX 内容源
- 构建时生成搜索索引、Sitemap、`llms.txt`、原始 Markdown 和内容 JSON
- GitHub 版本管理，Vercel 静态部署

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 构建

```bash
npm run build
```

产物输出到 `out/`，Vercel 导入本仓库后可自动识别 Next.js 并部署。

在 Vercel 项目环境变量中设置正式地址，Sitemap、robots 和 canonical 会在部署时使用它：

```text
NEXT_PUBLIC_SITE_URL=https://你的正式域名
```

## 新增文档

在 `content/docs/` 新增 `.mdx` 文件，使用以下头信息：

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

提交后，构建程序会自动更新站内检索及 AI 友好文件。
