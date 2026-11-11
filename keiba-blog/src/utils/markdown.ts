import { marked } from "marked";
import { parseFrontMatter } from "./frontMatter";
import {
  compactDate,
  predictRacePath,
  raceSegment,
} from "./predictUrl";
import { CATEGORY_CONFIG, type ArticleCategory } from "./site";

const PREDICT_MARKS = ["◎", "〇", "▲", "△", "★"] as const;

export type PredictArticleMark = (typeof PREDICT_MARKS)[number];

export interface PredictFeaturedHorse {
  number: number;
  name: string;
  note: string;
}

export interface PredictEntry {
  number: number;
  name: string;
  speed: number;
  stamina: number;
  power: number;
  guts: number;
  intelligence: number;
  timeIndex: number;
  matchIndex: number;
  rating: number;
}

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
  /** レース予想詳細: 予想印 */
  marks?: Partial<Record<PredictArticleMark, string>>;
  /** レース予想詳細: 買い目 */
  bets?: string[];
  /** レース予想詳細: 注目馬 */
  featured?: PredictFeaturedHorse[];
  /** レース予想詳細: 出馬表 */
  entries?: PredictEntry[];
}

export interface Article {
  slug: string;
  category: ArticleCategory;
  frontMatter: ArticleFrontMatter;
  contentHtml: string;
  /** レース予想詳細の開催日フォルダ（YYYY-MM-DD） */
  predictDate?: string;
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
): { category: ArticleCategory; slug: string; predictDate?: string } | null {
  if (path.includes("/template/")) return null;

  const predictRace = path.match(
    /articles\/predict\/(\d{4}-\d{2}-\d{2})\/([^/]+)\/index\.md$/,
  );
  if (predictRace) {
    return {
      category: "predict",
      slug: predictRace[2],
      predictDate: predictRace[1],
    };
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
    marks: parsePredictMarks(data.marks),
    bets: parseStringList(data.bets),
    featured: parseFeatured(data.featured),
    entries: parseEntries(data.entries),
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function positiveInt(value: unknown): number | null {
  const n = finiteNumber(value);
  if (n === null || !Number.isInteger(n) || n <= 0) return null;
  return n;
}

function parsePredictMarks(
  value: unknown,
): Partial<Record<PredictArticleMark, string>> | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  const marks: Partial<Record<PredictArticleMark, string>> = {};
  for (const mark of PREDICT_MARKS) {
    const horse = rec[mark];
    if (typeof horse === "string" && horse.trim()) marks[mark] = horse;
  }
  return Object.keys(marks).length > 0 ? marks : undefined;
}

function parseStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.trim() !== "",
  );
  return items.length > 0 ? items : undefined;
}

function parseFeatured(value: unknown): PredictFeaturedHorse[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const horses = value.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec) return [];
    const number = positiveInt(rec.number);
    if (number === null || typeof rec.name !== "string" || !rec.name.trim()) {
      return [];
    }
    const note = typeof rec.note === "string" ? rec.note : "";
    return [{ number, name: rec.name, note }];
  });
  return horses.length > 0 ? horses : undefined;
}

function parseEntries(value: unknown): PredictEntry[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const entries = value.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec) return [];
    const number = positiveInt(rec.number);
    const speed = finiteNumber(rec.speed);
    const stamina = finiteNumber(rec.stamina);
    const power = finiteNumber(rec.power);
    const guts = finiteNumber(rec.guts);
    const intelligence = finiteNumber(rec.intelligence);
    const timeIndex = finiteNumber(rec.timeIndex);
    const matchIndex = finiteNumber(rec.matchIndex);
    const rating = finiteNumber(rec.rating);
    if (
      number === null ||
      typeof rec.name !== "string" ||
      !rec.name.trim() ||
      speed === null ||
      stamina === null ||
      power === null ||
      guts === null ||
      intelligence === null ||
      timeIndex === null ||
      matchIndex === null ||
      rating === null
    ) {
      return [];
    }
    return [
      {
        number,
        name: rec.name,
        speed,
        stamina,
        power,
        guts,
        intelligence,
        timeIndex,
        matchIndex,
        rating,
      },
    ];
  });
  return entries.length > 0
    ? entries.sort((a, b) => a.number - b.number)
    : undefined;
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
    predictDate: parsed.predictDate,
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

export function getArticlePath(article: Article): string {
  if (
    article.category === "predict" &&
    article.predictDate &&
    article.frontMatter.venue &&
    article.frontMatter.raceNumber
  ) {
    const compact = compactDate(article.predictDate);
    const segment = raceSegment(
      article.frontMatter.venue,
      article.frontMatter.raceNumber,
    );
    if (compact && segment) return predictRacePath(compact, segment);
  }
  return `${CATEGORY_CONFIG[article.category].path}/${article.slug}`;
}

export function getPredictArticle(
  compact: string,
  raceKey: string,
): Article | undefined {
  return getAllArticles().find((article) => {
    if (article.category !== "predict" || !article.predictDate) return false;
    if (compactDate(article.predictDate) !== compact) return false;
    const venue = article.frontMatter.venue;
    const raceNumber = article.frontMatter.raceNumber;
    if (!venue || !raceNumber) return false;
    return raceSegment(venue, raceNumber) === raceKey;
  });
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
