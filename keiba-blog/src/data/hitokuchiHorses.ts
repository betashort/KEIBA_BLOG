/** 一口馬主ポートフォリオ・愛馬日記。馬データは `src/articles/hitokuchi/{bamei}/index.md`、日記は同フォルダの `{YYYY-MM-DD}-{slug}.md` */

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

/** 勝負服風の幾何学模様。未指定は単色塗り */
export type ClubSilkPattern = "vertical-thirds" | "horizontal-thirds";

export interface Club {
  id: string;
  name: string;
  code: string;
  /** 主色（胴など） */
  color: string;
  /** 副色（中央ストライプなど）。silkPattern 指定時に使用 */
  secondaryColor?: string;
  silkPattern?: ClubSilkPattern;
}

export interface AibaDiaryPhoto {
  alt: string;
  caption?: string;
  /** `public/` からのサイトルートパス（例: `/images/hitokuchi/flashing-ruby/body.jpg`） */
  src?: string;
}

export interface HorseRaceResult {
  date: string;
  venue: string;
  name: string;
  finish: number;
  number?: number;
  className?: string;
  course?: string;
  going?: string;
  fieldSize?: number;
  frame?: number;
  horseNumber?: number;
  popularity?: number;
  odds?: number;
  jockey?: string;
  weightKg?: number;
  time?: string;
  margin?: string;
  last3f?: string;
  passing?: string;
  burdenKg?: number;
  /** 対応する日記エントリの slug（ページ内アンカー） */
  diarySlug: string;
}

export interface AibaDiaryEntry {
  slug: string;
  date: string;
  title: string;
  contentHtml: string;
  race?: HorseRaceResult;
  photos: AibaDiaryPhoto[];
}

export interface PedigreeNode {
  name: string;
  color?: string;
  sire?: PedigreeNode;
  dam?: PedigreeNode;
}

export interface HorsePedigree {
  sire?: PedigreeNode;
  dam?: PedigreeNode;
}

export interface HitokuchiHorse {
  /** URL パラメータ `{bamei}`（英名 kebab-case の記事フォルダ名） */
  bamei: string;
  name: string;
  /** 英名（任意） */
  englishName?: string;
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
  /** 誕生日（YYYY-MM-DD） */
  birthDate?: string;
  /** 生産牧場 */
  breeder?: string;
  /** 育成牧場 */
  rearingFarm?: string;
  /** 毛色 */
  coatColor?: string;
  /** 募集価格（万円） */
  recruitPriceMan?: number;
  /** 一口価格（万円） */
  sharePriceMan?: number;
  /** 5代血統（父・母から） */
  pedigree?: HorsePedigree;
  contentHtml: string;
  photos: AibaDiaryPhoto[];
  diaries: AibaDiaryEntry[];
  races: HorseRaceResult[];
}

export const CLUBS: Club[] = [
  { id: "shadai", name: "社台サラブレッドクラブ", code: "ST", color: "#c41e3a" },
  { id: "carrot", name: "キャロットクラブ", code: "CR", color: "#e67e22" },
  {
    id: "silk",
    name: "シルクホースクラブ",
    code: "SLK",
    color: "#45b5d4",
    secondaryColor: "#dc1f2e",
    silkPattern: "vertical-thirds",
  },
  { id: "sunday", name: "サンデーサラブレッドクラブ", code: "SD", color: "#2980b9" },
  { id: "hiroo", name: "広尾レース", code: "HR", color: "#27ae60" },
  {
    id: "dmm",
    name: "DMMバヌーシー",
    code: "DMM",
    color: "#111111",
    secondaryColor: "#00a33a",
    silkPattern: "horizontal-thirds",
  },
];

const horseArticleModules = import.meta.glob("../articles/hitokuchi/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const INDEX_PATH_RE = /articles\/hitokuchi\/([^/]+)\/index\.md$/;
const DIARY_PATH_RE =
  /articles\/hitokuchi\/([^/]+)\/(\d{4}-\d{2}-\d{2}-[^/]+)\.md$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
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

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

function toPositiveInt(value: unknown): number | undefined {
  const n = toFiniteNumber(value);
  if (n === undefined || !Number.isInteger(n) || n <= 0) return undefined;
  return n;
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function optionalNonNegativeNumber(value: unknown): number | undefined {
  const n = toFiniteNumber(value);
  if (n === undefined || n < 0) return undefined;
  return n;
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
        src: optionalString(rec.src),
      },
    ];
  });
}

function parsePedigreeNode(value: unknown): PedigreeNode | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  const name = optionalString(rec.name);
  if (!name) return undefined;
  return {
    name,
    color: optionalString(rec.color),
    sire: parsePedigreeNode(rec.sire),
    dam: parsePedigreeNode(rec.dam),
  };
}

function parsePedigree(value: unknown): HorsePedigree | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  const sire = parsePedigreeNode(rec.sire);
  const dam = parsePedigreeNode(rec.dam);
  if (!sire && !dam) return undefined;
  return { sire, dam };
}

function parseRace(
  value: unknown,
  date: string,
  diarySlug: string,
): HorseRaceResult | undefined {
  const rec = asRecord(value);
  if (!rec) return undefined;
  if (typeof rec.venue !== "string" || typeof rec.name !== "string") {
    return undefined;
  }
  const finish = toPositiveInt(rec.finish);
  if (finish === undefined) return undefined;

  return {
    date,
    venue: rec.venue,
    name: rec.name,
    finish,
    diarySlug,
    number: toPositiveInt(rec.number),
    className: typeof rec.className === "string" ? rec.className : undefined,
    course: typeof rec.course === "string" ? rec.course : undefined,
    going: typeof rec.going === "string" ? rec.going : undefined,
    fieldSize: toPositiveInt(rec.fieldSize),
    frame: toPositiveInt(rec.frame),
    horseNumber: toPositiveInt(rec.horseNumber),
    popularity: toPositiveInt(rec.popularity),
    odds: toFiniteNumber(rec.odds),
    jockey: typeof rec.jockey === "string" ? rec.jockey : undefined,
    weightKg: toPositiveInt(rec.weightKg),
    time: typeof rec.time === "string" ? rec.time : undefined,
    margin: typeof rec.margin === "string" ? rec.margin : undefined,
    last3f: typeof rec.last3f === "string" ? rec.last3f : undefined,
    passing: typeof rec.passing === "string" ? rec.passing : undefined,
    burdenKg: toFiniteNumber(rec.burdenKg),
  };
}

function parseHorse(bamei: string, raw: string): HitokuchiHorse | null {
  const { data, content } = parseFrontMatter(raw);
  if (!isHorseSex(data.sex) || !isHorseClass(data.className)) return null;
  if (typeof data.clubId !== "string" || typeof data.stable !== "string") {
    return null;
  }
  if (typeof data.record !== "string" || typeof data.prizeMan !== "number") {
    return null;
  }

  const name = (typeof data.title === "string" && data.title) || bamei;

  return {
    bamei,
    name,
    englishName: optionalString(data.englishName),
    sex: data.sex,
    clubId: data.clubId,
    stable: data.stable,
    prizeMan: data.prizeMan,
    className: data.className,
    record: data.record,
    date: typeof data.date === "string" ? data.date : undefined,
    description:
      typeof data.description === "string" ? data.description : undefined,
    birthDate: optionalString(data.birthDate),
    breeder: optionalString(data.breeder),
    rearingFarm: optionalString(data.rearingFarm),
    coatColor: optionalString(data.coatColor),
    recruitPriceMan: optionalNonNegativeNumber(data.recruitPriceMan),
    sharePriceMan: optionalNonNegativeNumber(data.sharePriceMan),
    pedigree: parsePedigree(data.pedigree),
    contentHtml: marked.parse(content, { async: false }) as string,
    photos: parsePhotos(data.photos),
    diaries: [],
    races: [],
  };
}

function parseDiary(slug: string, filenameDate: string, raw: string): AibaDiaryEntry | null {
  const { data, content } = parseFrontMatter(raw);
  const date =
    (typeof data.date === "string" && data.date) || filenameDate;
  const title =
    (typeof data.title === "string" && data.title) || slug;
  const race = parseRace(data.race, date, slug);

  return {
    slug,
    date,
    title,
    contentHtml: marked.parse(content, { async: false }) as string,
    race,
    photos: parsePhotos(data.photos),
  };
}

function loadHorses(): HitokuchiHorse[] {
  const horses = new Map<string, HitokuchiHorse>();
  const diariesByBamei = new Map<string, AibaDiaryEntry[]>();

  for (const [path, raw] of Object.entries(horseArticleModules)) {
    const indexMatch = path.match(INDEX_PATH_RE);
    if (indexMatch) {
      const bamei = indexMatch[1];
      if (bamei === "template") continue;
      const horse = parseHorse(bamei, raw);
      if (horse) horses.set(bamei, horse);
      continue;
    }

    const diaryMatch = path.match(DIARY_PATH_RE);
    if (!diaryMatch) continue;
    const bamei = diaryMatch[1];
    if (bamei === "template") continue;
    const slug = diaryMatch[2];
    const filenameDate = slug.slice(0, 10);
    const entry = parseDiary(slug, filenameDate, raw);
    if (!entry) continue;
    const list = diariesByBamei.get(bamei) ?? [];
    list.push(entry);
    diariesByBamei.set(bamei, list);
  }

  return [...horses.values()]
    .map((horse) => {
      const diaries = (diariesByBamei.get(horse.bamei) ?? []).sort(
        (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
      );
      const races = diaries.flatMap((entry) => (entry.race ? [entry.race] : []));
      return { ...horse, diaries, races };
    })
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

export function formatRecruitPrice(
  recruitPriceMan?: number,
  sharePriceMan?: number,
): string | undefined {
  const share =
    sharePriceMan !== undefined
      ? `一口 ${formatPrizeMan(sharePriceMan)}`
      : undefined;
  if (recruitPriceMan !== undefined && share) {
    return `${formatPrizeMan(recruitPriceMan)}（${share}）`;
  }
  if (recruitPriceMan !== undefined) return formatPrizeMan(recruitPriceMan);
  return share;
}

export function hasPedigree(pedigree?: HorsePedigree): boolean {
  return Boolean(pedigree?.sire || pedigree?.dam);
}

export function sexTextClass(sex: HorseSex): string {
  if (sex === "牝") return "text-red-600";
  if (sex === "牡") return "text-blue-600";
  return "text-gray-700";
}

export function finishTextClass(finish: number): string {
  if (finish === 1) return "font-semibold text-red-600";
  if (finish === 2) return "font-semibold text-blue-600";
  if (finish === 3) return "font-semibold text-green-700";
  return "text-gray-900";
}
