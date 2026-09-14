const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fde-knowledge-base.vercel.app";

export const siteUrl = configuredUrl.replace(/\/$/, "");
