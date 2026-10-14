[![FDE 知识框架：六个交付阶段 × 七个能力领域，包含 58 项工作](https://fde.loyo.work/diagrams/fde-framework.svg)](https://fde.loyo.work/diagrams/fde-framework.svg)

# FDE 从入门到精通

面向 **Forward Deployed Engineer（前沿部署工程师）** 的中文知识库。从客户问题出发，学习设计、编写和集成软件与 AI 系统，验证业务价值，并将项目经验沉淀为可复用的能力。

**[在线阅读](https://fde.loyo.work/) · [知识框架](https://fde.loyo.work/docs/knowledge-map/#framework) · [学习路线](https://fde.loyo.work/docs/knowledge-map/#learning-routes) · [项目实战](https://fde.loyo.work/docs/capstone-project/)**

## 从哪里开始

| 你的目标 | 推荐入口 | 预期产出 |
| --- | --- | --- |
| 了解 FDE 的职责和能力 | [岗位与能力模型](https://fde.loyo.work/docs/role-and-competency/) | 明确职责边界与个人能力差距 |
| 系统入门 | [新人入门路线](https://fde.loyo.work/docs/knowledge-map/#route-beginner) | 最小服务与一页问题定义 |
| 完成一个项目 | [项目实战路线](https://fde.loyo.work/docs/knowledge-map/#route-project) | 实现、评测与移交项目包 |
| 处理复杂交付问题 | [进阶提升路线](https://fde.loyo.work/docs/knowledge-map/#route-advanced) | 运行证据与可复用方案 |
| 按当前任务查资料 | [整体知识框架](https://fde.loyo.work/docs/knowledge-map/#framework) | 找到对应工作、前置条件和产出 |

网站支持全文搜索、阶段与领域筛选、学习路线切换及已读进度。阅读进度保存在当前浏览器。

## 知识体系

整体框架以 **6 个交付阶段 × 7 个能力领域** 组织 **58 项工作**，关联 **46 个主题**。

- **交付阶段**：发现与立项 → 方案与计划 → 构建与验证 → 上线与采用 → 运行与改进 → 复用与演进。
- **能力领域**：业务与价值、架构与集成、数据与知识、AI 与自动化、工程与运行、安全与治理、协作与产品。
- **贯穿全程的基础能力**：岗位与责任边界、工程基础与开发环境、学习与能力评估。

整体地图完整展开，每项工作可直接进入对应文章。文章展示相关阶段与相邻领域的局部图，深色标出当前主题、虚线标出相关前置工作；返回总图可定位原来的工作。阶段可以往返迭代，项目可按目标与风险选择适用活动。

按文章专题查阅：

| 专题 | 主要内容 | 主题数 |
| --- | --- | --- |
| [岗位与学习基础](https://fde.loyo.work/topics/foundations/) | 角色、工程基础、学习与能力评估 | 4 |
| [客户问题与业务价值](https://fde.loyo.work/topics/discovery/) | 访谈、场景筛选、成功指标、交付经济性 | 5 |
| [方案设计与技术决策](https://fde.loyo.work/topics/design/) | 架构、业务语义、集成契约、原型验证 | 4 |
| [软件工程与数据实现](https://fde.loyo.work/topics/engineering/) | API、数据管道、工作流、测试与审查 | 4 |
| [AI 应用与知识工程](https://fde.loyo.work/topics/ai/) | 模型选型、RAG、Agent、评测与验收 | 6 |
| [项目交付与上线验收](https://fde.loyo.work/topics/delivery/) | 部署、联调、验收、迁移与系统退出 | 5 |
| [可靠性与故障诊断](https://fde.loyo.work/topics/reliability/) | 可观测性、故障诊断、变更、性能与成本 | 5 |
| [安全、权限与数据治理](https://fde.loyo.work/topics/security/) | 身份授权、隐私、威胁建模与安全验证 | 4 |
| [客户协作与产品反馈](https://fde.loyo.work/topics/collaboration/) | 风险沟通、用户采用、价值复核与方案复用 | 5 |
| [实战、模板与知识沉淀](https://fde.loyo.work/topics/practice/) | 综合项目、交付模板、案例与知识治理 | 4 |

## 实战与可下载资源

以“企业售后工单助手”为教学案例，覆盖问题定义、架构设计、实现、评测、上线和复盘。案例使用合成人物、资料与指标，初始范围是授权检索、草稿生成和人工审核。

- [端到端实战项目](https://fde.loyo.work/docs/capstone-project/)：阶段任务、交付证据、评分与进阶要求。
- [7 份交付模板](public/templates/)：问题定义、架构决策、实验、评测、上线、移交与复盘。
- [20 条评测种子](public/examples/evaluation-seed.json)与[合成资料](public/examples/ticket-fixtures.json)：用于复现教学练习。
- [离线检索演示](public/examples/offline-retrieval.py)：使用 Python 标准库验证关键词检索和范围过滤。

```sh
python3 public/examples/offline-retrieval.py
```

教学练习用于理解方法。真实身份集成、模型接入和生产效果需要在实际项目中验证，教学样本通过率不代表生产质量。

## 本地运行与发布

网站采用 **Next.js App Router + TypeScript + MDX**，生产构建导出静态文件。

```sh
npm install
npm run dev
```

打开 <http://localhost:3000>。构建与检查：

```sh
npm run build
npm run typecheck
npm run check:content
npm run check:framework
npm run check:seo
```

构建前自动生成整体框架、文章局部图、分享图片和内容索引。静态产物位于 `out/`，可发布至静态托管平台。正式域名通过 `NEXT_PUBLIC_SITE_URL` 配置，默认 `https://fde.loyo.work`。

## 内容维护

| 文件或目录 | 用途 |
| --- | --- |
| [content/docs/](content/docs/) | MDX 正文及标题、描述、分类、标签、更新时间等元数据 |
| [content/framework.json](content/framework.json) | 交付阶段、能力领域、工作、前置关系及文章默认位置 |
| [content/architecture.json](content/architecture.json) | 10 个内容专题 |
| [lib/learning-paths.ts](lib/learning-paths.ts) | 新人入门、项目实战和进阶提升路线 |
| [public/templates/](public/templates/) | 交付模板 |
| [scripts/](scripts/) | 图解与索引生成、内容及 SEO 检查 |

新增或修改文章时，同步维护框架位置、专题与学习路线，并更新 `updatedAt`。文档状态分为 `outline`（待完善大纲）、`guide`（基础指南）和 `playbook`（具备前置条件、操作、验证与回退的操作手册）。详细规范见[知识库治理与文档标准](content/docs/16-governance.mdx)。

配图在图内统一标注“来源：fde.loyo.work”。[图解来源记录](public/diagrams/sources.json)与[分享图片来源记录](public/social/sources.json)随构建更新；图解也可单独运行 `npm run build:diagrams` 重新生成。公开材料使用合成数据或经授权、已脱敏的内容。

## 搜索与内容分发

- 每页独立标题、描述、canonical、分享图片和结构化数据；文章提供关键词、相关阅读与图片 Alt。
- [sitemap.xml](https://fde.loyo.work/sitemap.xml) 覆盖首页、46 个主题及 10 个专题页，随内容更新维护。
- 提供 [robots.txt](https://fde.loyo.work/robots.txt)、[llms.txt](https://fde.loyo.work/llms.txt)、[完整正文索引](https://fde.loyo.work/llms-full.txt)及原始 Markdown。
- 内容检查覆盖站内链接、配图来源与教学资源；框架检查覆盖文章映射、前置关系和上下文链接；SEO 检查覆盖元数据、Alt、结构化数据与 sitemap。

发现内容问题或希望补充主题，可通过 [GitHub Issues](https://github.com/loyo-sun/FDE/issues) 反馈。
