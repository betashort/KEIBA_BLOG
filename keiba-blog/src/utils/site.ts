export const SITE_NAME = "競馬βLab";
export const SITE_DESCRIPTION =
  "競馬に関するブログ・研究・レース分析・レース予想を発信する個人サイトです。";
export const DEFAULT_OG_IMAGE = "/images/og-default.jpg";

export const AUTHOR_NAME = "βshort";
export const AUTHOR_TITLE = "運営者 / ソフトウェアエンジニア";
export const AUTHOR_ICON = "/images/author/icon.png";
export const AUTHOR_STANCE = "再現性のある予想を!";
export const AUTHOR_FAVORITE_COURSE = "東京競馬場";
export const AUTHOR_FAVORITE_RACE = "ジャパンカップ";
export const AUTHOR_FAVORITE_TICKETS = [
  "ワイド",
  "三連複",
  "3連単",
  "WIN5",
] as const;
export const AUTHOR_DISCLAIMER =
  "当サイトの予想・買い目は個人の見解です。馬券の購入は自己責任でお願いします。的中を保証するものではありません。";

export const AUTHOR_SOCIALS = [
  {
    id: "x",
    label: "X",
    href: "https://x.com/i_thinking_reed",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/betashort",
  },
] as const;

/** 公開オリジン。末尾スラッシュなし。OGP・sitemap の絶対 URL に使う */
export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_ORIGIN ?? "https://example.com"
).replace(/\/$/, "");

export function toAbsoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (!path || path === "/") {
    return SITE_ORIGIN;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const encoded = normalized
    .split("/")
    .map((segment) => (segment === "" ? "" : encodeURIComponent(segment)))
    .join("/");
  return `${SITE_ORIGIN}${encoded}`;
}

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
