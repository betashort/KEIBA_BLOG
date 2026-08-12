/** 馬券ポートフォリオ用のダミーデータ（UI_design/profile/baken-portfolio.md） */

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

export const BAKEN_SUMMARY: BakenSummary = {
  purchaseYen: 1_250_000,
  payoutYen: 1_375_400,
  hitRate: 28.4,
  ticketCount: 186,
  hitCount: 53,
};

export const BAKEN_MONTHLY: MonthlyResult[] = [
  { yearMonth: "2024-09", profitYen: -18200, purchaseYen: 82000, payoutYen: 63800 },
  { yearMonth: "2024-10", profitYen: 24100, purchaseYen: 91000, payoutYen: 115100 },
  { yearMonth: "2024-11", profitYen: -45300, purchaseYen: 105000, payoutYen: 59700 },
  { yearMonth: "2024-12", profitYen: 61200, purchaseYen: 128000, payoutYen: 189200 },
  { yearMonth: "2025-01", profitYen: -8900, purchaseYen: 76000, payoutYen: 67100 },
  { yearMonth: "2025-02", profitYen: 15400, purchaseYen: 88000, payoutYen: 103400 },
  { yearMonth: "2025-03", profitYen: 38200, purchaseYen: 112000, payoutYen: 150200 },
  { yearMonth: "2025-04", profitYen: -22100, purchaseYen: 99000, payoutYen: 76900 },
  { yearMonth: "2025-05", profitYen: 17800, purchaseYen: 101000, payoutYen: 118800 },
  { yearMonth: "2025-06", profitYen: -33400, purchaseYen: 94000, payoutYen: 60600 },
  { yearMonth: "2025-07", profitYen: 42600, purchaseYen: 118000, payoutYen: 160600 },
  { yearMonth: "2025-08", profitYen: 54000, purchaseYen: 156000, payoutYen: 210000 },
];

export const BAKEN_TICKET_TYPES: TicketTypeStat[] = [
  { type: "単勝", count: 42, hitCount: 11, hitRate: 26.2, recoveryRate: 98.4, profitYen: -2100 },
  { type: "複勝", count: 38, hitCount: 18, hitRate: 47.4, recoveryRate: 112.6, profitYen: 8400 },
  { type: "馬連", count: 31, hitCount: 8, hitRate: 25.8, recoveryRate: 121.3, profitYen: 18600 },
  { type: "ワイド", count: 24, hitCount: 9, hitRate: 37.5, recoveryRate: 108.1, profitYen: 5200 },
  { type: "馬単", count: 18, hitCount: 3, hitRate: 16.7, recoveryRate: 89.2, profitYen: -7800 },
  { type: "3連複", count: 21, hitCount: 3, hitRate: 14.3, recoveryRate: 134.5, profitYen: 41200 },
  { type: "3連単", count: 12, hitCount: 1, hitRate: 8.3, recoveryRate: 156.0, profitYen: 61900 },
];

export const BAKEN_HISTORY: PurchaseHistoryItem[] = [
  { date: "2025-08-10", race: "新潟11R 関屋記念", ticketType: "馬連", result: "的中", profitYen: 18400 },
  { date: "2025-08-10", race: "札幌11R 札幌記念", ticketType: "3連複", result: "不的中", profitYen: -2400 },
  { date: "2025-08-03", race: "新潟11R レパードS", ticketType: "単勝", result: "的中", profitYen: 6200 },
  { date: "2025-07-27", race: "新潟11R アイビスSD", ticketType: "ワイド", result: "的中", profitYen: 1800 },
  { date: "2025-07-20", race: "小倉11R 中京記念", ticketType: "馬単", result: "不的中", profitYen: -3000 },
  { date: "2025-07-13", race: "函館11R 函館記念", ticketType: "3連単", result: "不的中", profitYen: -5000 },
  { date: "2025-07-06", race: "福島11R 七夕賞", ticketType: "複勝", result: "的中", profitYen: 900 },
  { date: "2025-06-29", race: "阪神11R 宝塚記念", ticketType: "馬連", result: "不的中", profitYen: -4000 },
];

export function profitYen(summary: BakenSummary): number {
  return summary.payoutYen - summary.purchaseYen;
}

export function recoveryRate(summary: BakenSummary): number {
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
