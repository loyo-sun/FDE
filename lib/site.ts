const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fde.loyo.work";

export const siteUrl = configuredUrl.replace(/\/$/, "");
export const siteName = "FDE 从入门到精通";
export const siteDescription =
  "面向现场交付工程师的系统化知识库，覆盖 FDE 岗位能力、项目交付流程、AI 应用实施、RAG 知识工程、故障排查、验收运维与项目治理。";
