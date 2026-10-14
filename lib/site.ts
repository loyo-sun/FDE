const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fde.loyo.work";

export const siteUrl = configuredUrl.replace(/\/$/, "");
export const siteName = "FDE 从入门到精通";
export const siteDescription =
  "面向 Forward Deployed Engineer（前沿部署工程师）的中文知识库，涵盖客户访谈、软件工程、RAG、Agent、AI 评测与项目交付，提供 46 个学习主题、阶段与能力矩阵、交互学习路线和实战模板。";
