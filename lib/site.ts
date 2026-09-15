const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fde.loyo.work";

export const siteUrl = configuredUrl.replace(/\/$/, "");
export const siteName = "FDE 从入门到精通";
export const siteDescription =
  "面向 Forward Deployed Engineer（前沿部署工程师）的中文知识库，连接客户问题、软件工程、AI 应用与业务价值，提供分阶段学习路线与持续完善的知识大纲。";
