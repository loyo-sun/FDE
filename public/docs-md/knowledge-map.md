# FDE 知识框架与学习路线

状态：基础指南

用六个交付阶段、七个能力领域和 58 项工作理解 FDE 全局，沿 46 个主题安排学习并形成交付证据。

## 整体框架

[![FDE 整体知识框架：六个交付阶段与七个能力领域](/diagrams/fde-framework.svg)](/diagrams/fde-framework.svg)

FDE 在这里指深入客户工作流、编写与集成软件并验证业务价值的工程角色。这份框架以“项目在哪个阶段、需要什么能力、正在完成什么工作、留下什么证据”组织知识，避免把文章章节排成一条线。

全景图按 FDE 交付阶段和能力领域组织工作与产出，用于学习和项目评审。实际项目可按规模、风险与交付目标选择需要执行的工作。

## 如何读图

- **横向七个能力领域**：业务与价值、架构与集成、数据与知识、AI 与自动化、工程与运行、安全与治理、协作与产品。
- **纵向六个交付阶段**：发现与立项、方案与计划、构建与验证、上线与采用、运行与改进、复用与演进。
- **格子中的卡片**：一项具体工作，而不是文章标题或二级目录；卡片说明应形成的产出。
- **阶段门禁**：说明进入下一阶段需要什么证据，不能以会议结束代替完成。
- **局部框架**：进入文章后只呈现相关阶段与相邻领域，深色标出当前工作，虚线标出相关前置。若从不同工作进入同一篇文章，局部位置随入口保留。

项目可往返迭代，架构、安全和价值管理都贯穿多个阶段。AI 列按任务适用性选择，不要求所有项目使用模型或 Agent。

## 六个阶段与退出证据

| 阶段 | 主要判断 | 阶段门禁 |
| --- | --- | --- |
| 发现与立项 | 确认值得解决的问题 | 问题、范围、数据权限与投入上限获得共识 |
| 方案与计划 | 把约束变成可执行方案 | 架构、契约、评测与风险控制可以被验证 |
| 构建与验证 | 实现最小完整业务链路 | 实现、数据、质量与权限通过预定验证 |
| 上线与采用 | 在受控范围证明可用 | 灰度、培训、验收与运行责任准备齐全 |
| 运行与改进 | 持续兑现质量和业务价值 | 服务、成本、知识与用户效果持续被核对 |
| 复用与演进 | 把项目变成长期能力 | 产品反馈、复用边界或退出安排明确 |

## 全景工作矩阵

| 阶段 | 业务与价值 | 架构与集成 | 数据与知识 | AI 与自动化 | 工程与运行 | 安全与治理 | 协作与产品 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 发现与立项 | [识别用户问题](/docs/business-discovery/#context-problem)；[筛选场景与边界](/docs/use-case-prioritization/#context-scope)；[判断交付经济性](/docs/commercial-scoping/#context-economics) | [摸清现有系统](/docs/integration-design/#context-system-landscape) | [清点资料与数据](/docs/data-architecture/#context-source-inventory) | [判断是否需要 AI](/docs/ai-foundations/#context-ai-fit) | [约定交付阶段](/docs/delivery-lifecycle/#context-delivery-gates) | [确认数据用途](/docs/data-privacy/#context-data-purpose) | [观察真实工作流](/docs/workflow-mapping/#context-workflow)；[识别决策与使用者](/docs/stakeholder-adoption/#context-stakeholders) |
| 方案与计划 | [定义价值基线](/docs/success-metrics/#context-baseline) | [设计组件与边界](/docs/solution-architecture/#context-architecture)；[约定集成契约](/docs/integration-design/#context-contracts) | [统一业务语义](/docs/data-architecture/#context-business-model) | [比较模型与部署形态](/docs/model-selection/#context-model-choice)；[设计评测与门槛](/docs/ai-evaluation-and-acceptance/#context-eval-plan) | [验证最大技术风险](/docs/prototype-validation/#context-prototype)；[规划部署与环境](/docs/deployment-platform/#context-platform-plan) | [设计身份与资源授权](/docs/identity-access/#context-authorization)；[建模攻击面](/docs/ai-threat-modeling/#context-threats) | [建立风险与变更机制](/docs/project-communication-risk/#context-delivery-plan) |
| 构建与验证 | [核对范围与验收假设](/docs/use-case-prioritization/#context-business-check) | [实现确定性接口](/docs/api-engineering/#context-api) | [建立可重跑数据管道](/docs/data-pipelines/#context-pipeline)；[构建知识检索与引用](/docs/rag-knowledge-engineering/#context-rag) | [接入受控 AI 能力](/docs/ai-delivery/#context-ai-application)；[约束工具与动作](/docs/agent-workflows/#context-agent) | [构建任务工作台](/docs/workflow-apps/#context-workbench)；[运行测试与审查](/docs/engineering-quality/#context-quality)；[组织项目证据包](/docs/delivery-templates/#context-evidence) | [验证安全控制](/docs/security-privacy-ai-governance/#context-safety-tests) | [与用户共同验证](/docs/stakeholder-adoption/#context-co-review) |
| 上线与采用 | [比较试点价值](/docs/value-realization/#context-pilot-value) | [验证跨系统业务链](/docs/integration-design/#context-integration-test) | [发布并核验知识版本](/docs/rag-knowledge-engineering/#context-index-release) | [评测 AI 质量与失败](/docs/ai-evaluation-and-acceptance/#context-ai-acceptance) | [部署联调与灰度](/docs/site-delivery-sop/#context-release)；[完成验收和运维移交](/docs/acceptance-and-handover/#context-handover) | [审核上线风险](/docs/security-privacy-ai-governance/#context-security-gate) | [培训与试点采用](/docs/stakeholder-adoption/#context-adoption) |
| 运行与改进 | [复核实际业务收益](/docs/value-realization/#context-realized-value) | [复审容量与架构约束](/docs/solution-architecture/#context-architecture-review) | [更新、删除与撤权](/docs/data-pipelines/#context-knowledge-refresh) | [定位模型与检索退化](/docs/ai-troubleshooting/#context-ai-diagnosis) | [观测用户任务与 SLO](/docs/observability/#context-slo)；[控制影响并诊断故障](/docs/troubleshooting-method/#context-incident)；[优化性能与单任务成本](/docs/performance-cost/#context-cost-performance)；[执行变更与恢复](/docs/operations-and-change/#context-operations) | [复核权限与数据保留](/docs/data-privacy/#context-access-review) | [沉淀运行与失败案例](/docs/cases-and-toolkit/#context-case-review) |
| 复用与演进 | [决定扩大、调整或退出](/docs/commercial-scoping/#context-expansion) | [提炼可配置的方案边界](/docs/reusable-solutions/#context-reuse-boundary) | [治理文档与知识资产](/docs/knowledge-governance/#context-knowledge-governance) | [比较模型升级与替换](/docs/model-selection/#context-ai-evolution) | [演练平台升级与迁移](/docs/deployment-platform/#context-platform-upgrade) | [退出与数据善后](/docs/solution-exit/#context-exit) | [把现场问题反馈产品](/docs/product-feedback/#context-product-feedback)；[用综合项目检验能力](/docs/capstone-project/#context-capstone) |

## 从基础能力进入

- [岗位与责任边界](/docs/role-and-competency/)：能解释工程、业务与客户协作责任。
- [工程基础与开发环境](/docs/engineering-foundations/)：能复现服务、数据、网络与测试。
- [学习与能力评估](/docs/training-and-certification/)：以项目证据检验独立交付能力。

## 三条学习路线

| 路线 | 推荐顺序 | 产出 |
| --- | --- | --- |
| 新人入门 | 岗位与工程基础 → 问题定义 → 整体交付生命周期 | 最小服务与一页问题定义 |
| 项目实战 | 范围与价值 → 架构与模型 → 实现验证 → 上线与移交 | 有实现、评测和恢复证据的项目包 |
| 进阶提升 | Agent 与权限 → 可观测性与成本 → 价值复核 → 产品与复用 | 可靠性证据与可迁移方案 |

网页可在[学习区域](/docs/knowledge-map/#learning-routes)切换路线、筛选主题和记录已读；进度保存在当前浏览器。先用全景图理解关系，再按自身基础选择阅读顺序。

## 本轮补齐的六处缺口

| 新主题 | 补齐的判断 |
| --- | --- |
| [立项与交付经济性](/docs/commercial-scoping/) | 值不值得做、能投入多少、什么时候停止 |
| [模型选型、部署与替换](/docs/model-selection/) | 如何比较任务方案、锁定版本并验证替换 |
| [部署平台、环境与迁移](/docs/deployment-platform/) | 如何准备运行边界、发布与平台演进 |
| [性能、容量与单任务成本](/docs/performance-cost/) | 如何一起观察时间、质量、费用与人工负担 |
| [上线价值复核](/docs/value-realization/) | 试点通过之后，收益是否持续兑现 |
| [系统退出与数据善后](/docs/solution-exit/) | 停止或迁移时，如何处理任务、权限、数据和责任 |

## 实战与维护

目前包含 46 个主题、58 项交付工作、7 份项目模板和 20 条合成教学样本。以[售后工单助手](/docs/capstone-project/)贯穿学习，所有人物、资料与示例收益均为合成设定；不代表真实客户验证。

框架的数据源是 `content/framework.json`。新增主题时应明确它对应的工作、阶段、领域、前置与产出，再更新[内容治理](/docs/knowledge-governance/)及构建验证。文章局部图由同一个框架生成，不再从二级标题自动摘取节点。

配图来源在图内；[统一来源清单](/diagrams/sources.json)保留可追踪记录。所有正文为基础指南，现场操作仍需实际版本、权限、步骤、验证与恢复证据。
