import { marked } from "marked";
import { parseFrontMatter } from "./frontMatter";
import type { ArticleCategory } from "./site";

export interface ArticleFrontMatter {
  title: string;
  date: string;
  description?: string;
  category: ArticleCategory;
  tags?: string[];
  thumbnail?: string;
  ogImage?: string;
  noindex?: boolean;
  /** レース分析記事向け: レース名 */
  raceName?: string;
  /** レース分析記事向け: レース情報（開催日・場・距離など） */
  raceInfo?: string;
  /** レース予想（注目レース）向け: 競馬場。開催日データとの紐付けに使用 */
  venue?: string;
  /** レース予想（注目レース）向け: レース番号 */
  raceNumber?: number;
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  frontMatter: ArticleFrontMatter;
  contentHtml: string;
}

const articleModules = import.meta.glob(
  [
    "../articles/blog/**/index.md",
    "../articles/study/**/index.md",
    "../articles/analysis/**/index.md",
    "../articles/predict/*/*/index.md",
  ],
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
) as Record<string, string>;

function parseArticlePath(
  path: string,
): { category: ArticleCategory; slug: string } | null {
  const predictRace = path.match(
    /articles\/predict\/\d{4}-\d{2}-\d{2}\/([^/]+)\/index\.md$/,
  );
  if (predictRace) {
    return { category: "predict", slug: predictRace[1] };
  }

  const match = path.match(
    /articles\/(blog|study|analysis)\/([^/]+)\/index\.md$/,
  );
  if (!match) return null;
  return { category: match[1] as ArticleCategory, slug: match[2] };
}

function extractTitleFromContent(content: string): string | undefined {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function normalizeFrontMatter(
  data: Record<string, unknown>,
  category: ArticleCategory,
  slug: string,
  content: string,
): ArticleFrontMatter {
  const title =
    (typeof data.title === "string" && data.title) ||
    extractTitleFromContent(content) ||
    slug;
  const date =
    (typeof data.date === "string" && data.date) ||
    "1970-01-01";
  const rawCategory = data.category;
  const resolvedCategory =
    rawCategory === "blog" ||
    rawCategory === "study" ||
    rawCategory === "analysis" ||
    rawCategory === "predict"
      ? rawCategory
      : category;

  return {
    title,
    date,
    description:
      typeof data.description === "string" ? data.description : undefined,
    category: resolvedCategory,
    tags: Array.isArray(data.tags)
      ? data.tags.filter((t): t is string => typeof t === "string")
      : undefined,
    thumbnail:
      typeof data.thumbnail === "string" ? data.thumbnail : undefined,
    ogImage: typeof data.ogImage === "string" ? data.ogImage : undefined,
    noindex: data.noindex === true,
    raceName: typeof data.raceName === "string" ? data.raceName : undefined,
    raceInfo: typeof data.raceInfo === "string" ? data.raceInfo : undefined,
    venue: typeof data.venue === "string" ? data.venue : undefined,
    raceNumber:
      typeof data.raceNumber === "number" && Number.isInteger(data.raceNumber)
        ? data.raceNumber
        : undefined,
  };
}

function parseArticle(path: string, raw: string): Article | null {
  const parsed = parseArticlePath(path);
  if (!parsed) return null;

  const { data, content } = parseFrontMatter(raw);
  const frontMatter = normalizeFrontMatter(
    data as Record<string, unknown>,
    parsed.category,
    parsed.slug,
    content,
  );

  return {
    slug: parsed.slug,
    category: parsed.category,
    frontMatter,
    contentHtml: marked.parse(content, { async: false }) as string,
  };
}

let cachedArticles: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cachedArticles) return cachedArticles;

  cachedArticles = Object.entries(articleModules)
    .map(([path, raw]) => parseArticle(path, raw))
    .filter((article): article is Article => article !== null)
    .filter((article) => article.slug !== "template");

  return cachedArticles;
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return getAllArticles()
    .filter((article) => article.category === category)
    .sort(
      (a, b) =>
        new Date(b.frontMatter.date).getTime() -
        new Date(a.frontMatter.date).getTime(),
    );
}

export function getArticle(
  category: ArticleCategory,
  slug: string,
): Article | undefined {
  return getAllArticles().find(
    (article) => article.category === category && article.slug === slug,
  );
}

const TOKYO_TIME_ZONE = "Asia/Tokyo";

function parseDateAsTokyo(dateStr: string): Date | null {
  const day = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (day) {
    const parsed = new Date(`${day[1]}-${day[2]}-${day[3]}T00:00:00+09:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(dateStr: string): string {
  const date = parseDateAsTokyo(dateStr);
  if (!date) return dateStr;
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: TOKYO_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
