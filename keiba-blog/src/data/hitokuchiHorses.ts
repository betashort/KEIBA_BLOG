/** 一口馬主ポートフォリオ・愛馬日記。馬データと本文は `src/articles/hitokuchi/{bamei}/index.md` */

import { marked } from "marked";
import { parseFrontMatter } from "../utils/frontMatter";

export const HORSE_CLASSES = [
  "オープン",
  "3勝クラス",
  "2勝クラス",
  "1勝クラス",
  "新馬戦",
  "未勝利",
  "未登録",
  "引退",
] as const;

export type HorseClass = (typeof HORSE_CLASSES)[number];

export type HorseSex = "牡" | "牝" | "セ";

export interface Club {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface AibaDiaryPhoto {
  alt: string;
  caption?: string;
}

export interface AibaDiaryEvent {
  date: string;
  title: string;
  detail?: string;
}

export interface HitokuchiHorse {
  /** URL パラメータ `{bamei}`（記事フォルダ名） */
  bamei: string;
  name: string;
  sex: HorseSex;
  clubId: string;
  stable: string;
  /** 獲得賞金（万円） */
  prizeMan: number;
  className: HorseClass;
  record: string;
  /** Front Matter の date。sitemap lastmod のフォールバック */
  date?: string;
  description?: string;
  contentHtml: string;
  photos: AibaDiaryPhoto[];
  events: AibaDiaryEvent[];
}

export const CLUBS: Club[] = [
  { id: "shadai", name: "社台サラブレッドクラブ", code: "ST", color: "#c41e3a" },
  { id: "carrot", name: "キャロットクラブ", code: "CR", color: "#e67e22" },
  { id: "silk", name: "シルクホースクラブ", code: "SK", color: "#8e44ad" },
  { id: "sunday", name: "サンデーサラブレッドクラブ", code: "SD", color: "#2980b9" },
  { id: "hiroo", name: "広尾レース", code: "HR", color: "#27ae60" },
];

const horseModules = import.meta.glob("../articles/hitokuchi/**/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseHorsePath(path: string): string | null {
  const match = path.match(/articles\/hitokuchi\/([^/]+)\/index\.md$/);
  if (!match || match[1] === "template") return null;
  return match[1];
}

function isHorseClass(value: unknown): value is HorseClass {
  return (
    typeof value === "string" &&
    (HORSE_CLASSES as readonly string[]).includes(value)
  );
}

function isHorseSex(value: unknown): value is HorseSex {
  return value === "牡" || value === "牝" || value === "セ";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function parsePhotos(value: unknown): AibaDiaryPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec || typeof rec.alt !== "string") return [];
    return [
      {
        alt: rec.alt,
        caption: typeof rec.caption === "string" ? rec.caption : undefined,
      },
    ];
  });
}

function parseEvents(value: unknown): AibaDiaryEvent[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec || typeof rec.date !== "string" || typeof rec.title !== "string") {
      return [];
    }
    return [
      {
        date: rec.date,
        title: rec.title,
        detail: typeof rec.detail === "string" ? rec.detail : undefined,
      },
    ];
  });
}

function parseHorse(path: string, raw: string): HitokuchiHorse | null {
  const bamei = parseHorsePath(path);
  if (!bamei) return null;

  const { data, content } = parseFrontMatter(raw);
  if (!isHorseSex(data.sex) || !isHorseClass(data.className)) return null;
  if (typeof data.clubId !== "string" || typeof data.stable !== "string") {
    return null;
  }
  if (typeof data.record !== "string" || typeof data.prizeMan !== "number") {
    return null;
  }

  const name =
    (typeof data.title === "string" && data.title) || bamei;

  return {
    bamei,
    name,
    sex: data.sex,
    clubId: data.clubId,
    stable: data.stable,
    prizeMan: data.prizeMan,
    className: data.className,
    record: data.record,
    date: typeof data.date === "string" ? data.date : undefined,
    description:
      typeof data.description === "string" ? data.description : undefined,
    contentHtml: marked.parse(content, { async: false }) as string,
    photos: parsePhotos(data.photos),
    events: parseEvents(data.events),
  };
}

function loadHorses(): HitokuchiHorse[] {
  return Object.entries(horseModules)
    .map(([path, raw]) => parseHorse(path, raw))
    .filter((horse): horse is HitokuchiHorse => horse !== null)
    .sort((a, b) => b.prizeMan - a.prizeMan || a.name.localeCompare(b.name, "ja"));
}

export const HITOKUCHI_HORSES: HitokuchiHorse[] = loadHorses();

export function getClub(clubId: string): Club | undefined {
  return CLUBS.find((club) => club.id === clubId);
}

export function getHorse(bamei: string): HitokuchiHorse | undefined {
  return HITOKUCHI_HORSES.find((horse) => horse.bamei === bamei);
}

export function getHorsesByClass(className: HorseClass): HitokuchiHorse[] {
  return HITOKUCHI_HORSES.filter((horse) => horse.className === className);
}

export function formatPrizeMan(prizeMan: number): string {
  return `${prizeMan.toLocaleString("ja-JP")}万円`;
}

export function sexTextClass(sex: HorseSex): string {
  if (sex === "牝") return "text-red-600";
  if (sex === "牡") return "text-blue-600";
  return "text-gray-700";
}
