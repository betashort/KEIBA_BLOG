/** 馬券ポートフォリオ。月次成績は `src/articles/baken/{YYYY-MM}/index.md` で管理する */

import { marked } from "marked";
import { parseFrontMatter } from "../utils/frontMatter";

export interface BakenSummary {
  purchaseYen: number;
  payoutYen: number;
  hitRate: number;
  ticketCount: number;
  hitCount: number;
}

export interface MonthlyResult {
  yearMonth: string;
  profitYen: number;
  purchaseYen: number;
  payoutYen: number;
}

export interface TicketTypeStat {
  type: string;
  count: number;
  hitCount: number;
  hitRate: number;
  recoveryRate: number;
  profitYen: number;
}

export interface PurchaseHistoryItem {
  date: string;
  race: string;
  ticketType: string;
  result: "的中" | "不的中";
  profitYen: number;
}

export interface BakenMonthArticle {
  yearMonth: string;
  title: string;
  date: string;
  description?: string;
  noindex: boolean;
  purchaseYen: number;
  payoutYen: number;
  ticketCount: number;
  hitCount: number;
  ticketTypes: TicketTypeInput[];
  history: PurchaseHistoryItem[];
  contentHtml: string;
}

interface TicketTypeInput {
  type: string;
  count: number;
  hitCount: number;
  purchaseYen: number;
  payoutYen: number;
}

const TICKET_TYPE_ORDER = [
  "単勝",
  "複勝",
  "馬連",
  "ワイド",
  "馬単",
  "3連複",
  "3連単",
];

const bakenModules = import.meta.glob("../articles/baken/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseYearMonthFromPath(path: string): string | null {
  const match = path.match(/articles\/baken\/(\d{4}-\d{2})\/index\.md$/);
  return match?.[1] ?? null;
}

function parseTicketTypes(raw: unknown): TicketTypeInput[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const type = asString(row.type);
    if (!type) return [];
    return [
      {
        type,
        count: asNumber(row.count),
        hitCount: asNumber(row.hitCount),
        purchaseYen: asNumber(row.purchaseYen),
        payoutYen: asNumber(row.payoutYen),
      },
    ];
  });
}

function parseHistory(raw: unknown): PurchaseHistoryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const result = row.result === "的中" || row.result === "不的中" ? row.result : null;
    const race = asString(row.race);
    const date = asString(row.date);
    if (!result || !race || !date) return [];
    return [
      {
        date,
        race,
        ticketType: asString(row.ticketType),
        result,
        profitYen: asNumber(row.profitYen),
      },
    ];
  });
}

function parseMonthArticle(path: string, raw: string): BakenMonthArticle | null {
  const yearMonth = parseYearMonthFromPath(path);
  if (!yearMonth) return null;

  const { data, content } = parseFrontMatter(raw);
  const fm = data as Record<string, unknown>;
  const title =
    (typeof fm.title === "string" && fm.title) || `${formatYearMonthLabel(yearMonth)}の馬券成績`;
  const date = (typeof fm.date === "string" && fm.date) || `${yearMonth}-01`;

  return {
    yearMonth,
    title,
    date,
    description: typeof fm.description === "string" ? fm.description : undefined,
    noindex: fm.noindex === true,
    purchaseYen: asNumber(fm.purchaseYen),
    payoutYen: asNumber(fm.payoutYen),
    ticketCount: asNumber(fm.ticketCount),
    hitCount: asNumber(fm.hitCount),
    ticketTypes: parseTicketTypes(fm.ticketTypes),
    history: parseHistory(fm.history),
    contentHtml: marked.parse(content, { async: false }) as string,
  };
}

let cachedMonths: BakenMonthArticle[] | null = null;

export function getBakenMonths(): BakenMonthArticle[] {
  if (cachedMonths) return cachedMonths;

  cachedMonths = Object.entries(bakenModules)
    .map(([path, raw]) => parseMonthArticle(path, raw))
    .filter((article): article is BakenMonthArticle => article !== null)
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));

  return cachedMonths;
}

export function getBakenMonth(yearMonth: string): BakenMonthArticle | undefined {
  return getBakenMonths().find((article) => article.yearMonth === yearMonth);
}

export function getBakenSummary(): BakenSummary {
  const months = getBakenMonths();
  const purchaseYen = months.reduce((sum, month) => sum + month.purchaseYen, 0);
  const payoutYen = months.reduce((sum, month) => sum + month.payoutYen, 0);
  const ticketCount = months.reduce((sum, month) => sum + month.ticketCount, 0);
  const hitCount = months.reduce((sum, month) => sum + month.hitCount, 0);

  return {
    purchaseYen,
    payoutYen,
    ticketCount,
    hitCount,
    hitRate: hitRate(hitCount, ticketCount),
  };
}

export function getBakenMonthlyResults(): MonthlyResult[] {
  return getBakenMonths().map((month) => ({
    yearMonth: month.yearMonth,
    purchaseYen: month.purchaseYen,
    payoutYen: month.payoutYen,
    profitYen: month.payoutYen - month.purchaseYen,
  }));
}

export function getBakenTicketTypes(): TicketTypeStat[] {
  const byType = new Map<string, TicketTypeInput>();

  for (const month of getBakenMonths()) {
    for (const row of month.ticketTypes) {
      const current = byType.get(row.type) ?? {
        type: row.type,
        count: 0,
        hitCount: 0,
        purchaseYen: 0,
        payoutYen: 0,
      };
      current.count += row.count;
      current.hitCount += row.hitCount;
      current.purchaseYen += row.purchaseYen;
      current.payoutYen += row.payoutYen;
      byType.set(row.type, current);
    }
  }

  return [...byType.values()]
    .sort((a, b) => {
      const aIndex = TICKET_TYPE_ORDER.indexOf(a.type);
      const bIndex = TICKET_TYPE_ORDER.indexOf(b.type);
      const aOrder = aIndex === -1 ? TICKET_TYPE_ORDER.length : aIndex;
      const bOrder = bIndex === -1 ? TICKET_TYPE_ORDER.length : bIndex;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.type.localeCompare(b.type, "ja");
    })
    .map((row) => toTicketTypeStat(row));
}

export function getBakenHistory(): PurchaseHistoryItem[] {
  return getBakenMonths()
    .flatMap((month) => month.history)
    .sort((a, b) => b.date.localeCompare(a.date) || b.race.localeCompare(a.race, "ja"));
}

export function monthTicketTypes(month: BakenMonthArticle): TicketTypeStat[] {
  return month.ticketTypes.map((row) => toTicketTypeStat(row));
}

function toTicketTypeStat(row: TicketTypeInput): TicketTypeStat {
  return {
    type: row.type,
    count: row.count,
    hitCount: row.hitCount,
    hitRate: hitRate(row.hitCount, row.count),
    recoveryRate: recoveryRate({
      purchaseYen: row.purchaseYen,
      payoutYen: row.payoutYen,
    }),
    profitYen: row.payoutYen - row.purchaseYen,
  };
}

export function hitRate(hitCount: number, ticketCount: number): number {
  if (ticketCount === 0) return 0;
  return (hitCount / ticketCount) * 100;
}

export function profitYen(summary: Pick<BakenSummary, "purchaseYen" | "payoutYen">): number {
  return summary.payoutYen - summary.purchaseYen;
}

export function recoveryRate(summary: Pick<BakenSummary, "purchaseYen" | "payoutYen">): number {
  if (summary.purchaseYen === 0) return 0;
  return (summary.payoutYen / summary.purchaseYen) * 100;
}

export function formatYen(value: number, signed = true): string {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ja-JP")}円`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function formatYearMonth(yearMonth: string): string {
  const [, month] = yearMonth.split("-");
  return `${Number(month)}月`;
}

export function formatYearMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${year}年${Number(month)}月`;
}
