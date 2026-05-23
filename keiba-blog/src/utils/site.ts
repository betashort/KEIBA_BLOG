export const SITE_NAME = "競馬ブログ";
export const SITE_DESCRIPTION =
  "競馬に関するブログ・研究・レース分析・レース予想を発信する個人サイトです。";
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export type ArticleCategory = "blog" | "study" | "analysis" | "predict";

export const CATEGORY_CONFIG: Record<
  ArticleCategory,
  { label: string; path: string }
> = {
  blog: { label: "ブログ", path: "/blog" },
  study: { label: "競馬研究", path: "/study" },
  analysis: { label: "レース分析", path: "/analysis" },
  predict: { label: "レース予想", path: "/predict" },
};
