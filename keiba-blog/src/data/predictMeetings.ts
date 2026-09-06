/** レース予想一覧。開催データは `src/articles/predict/{YYYY-MM-DD}/index.md` */

import { parseFrontMatter } from "../utils/frontMatter";

export type PredictMark = "◎" | "〇" | "▲" | "△" | "★";

const PREDICT_MARKS: PredictMark[] = ["◎", "〇", "▲", "△", "★"];

export interface PredictRace {
  number: number;
  className: string;
  name: string;
  course: string;
  runners: number;
  marks: Partial<Record<PredictMark, string>>;
  bets: string[];
  /** 詳細記事がある場合の slug（/predict/{slug}） */
  articleSlug?: string;
}

export interface PredictMeeting {
  year: number;
  date: string; // M/D
  venue: string;
  races: PredictRace[];
}

const meetingModules = import.meta.glob("../articles/predict/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const raceArticleModules = import.meta.glob(
  "../articles/predict/*/*/index.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
) as Record<string, string>;

const DATE_FOLDER_RE = /articles\/predict\/(\d{4}-\d{2}-\d{2})\/index\.md$/;
const RACE_ARTICLE_RE =
  /articles\/predict\/(\d{4}-\d{2}-\d{2})\/([^/]+)\/index\.md$/;

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toPositiveInt(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

function formatListDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${Number(match[2])}/${Number(match[3])}`;
}

function raceArticleKey(isoDate: string, venue: string, raceNumber: number): string {
  return `${isoDate}\0${venue}\0${raceNumber}`;
}

function loadRaceArticleSlugs(): Map<string, string> {
  const slugs = new Map<string, string>();
  for (const [path, raw] of Object.entries(raceArticleModules)) {
    const match = path.match(RACE_ARTICLE_RE);
    if (!match || match[2] === "template") continue;
    const { data } = parseFrontMatter(raw);
    if (typeof data.venue !== "string") continue;
    const raceNumber = toPositiveInt(data.raceNumber);
    if (raceNumber === null) continue;
    slugs.set(raceArticleKey(match[1], data.venue, raceNumber), match[2]);
  }
  return slugs;
}

function parseMarks(value: unknown): Partial<Record<PredictMark, string>> {
  const rec = asRecord(value);
  if (!rec) return {};
  const marks: Partial<Record<PredictMark, string>> = {};
  for (const mark of PREDICT_MARKS) {
    const horse = rec[mark];
    if (typeof horse === "string" && horse.trim()) {
      marks[mark] = horse;
    }
  }
  return marks;
}

function parseBets(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((bet): bet is string => typeof bet === "string");
}

function parseRace(
  value: unknown,
  isoDate: string,
  venue: string,
  articleSlugs: Map<string, string>,
): PredictRace | null {
  const rec = asRecord(value);
  if (!rec) return null;
  const number = toPositiveInt(rec.number);
  const runners = toPositiveInt(rec.runners);
  if (
    number === null ||
    runners === null ||
    typeof rec.className !== "string" ||
    typeof rec.name !== "string" ||
    typeof rec.course !== "string"
  ) {
    return null;
  }

  const explicitSlug =
    typeof rec.articleSlug === "string" ? rec.articleSlug : undefined;

  return {
    number,
    className: rec.className,
    name: rec.name,
    course: rec.course,
    runners,
    marks: parseMarks(rec.marks),
    bets: parseBets(rec.bets),
    articleSlug:
      explicitSlug ?? articleSlugs.get(raceArticleKey(isoDate, venue, number)),
  };
}

function parseMeetingFile(
  path: string,
  raw: string,
  articleSlugs: Map<string, string>,
): PredictMeeting[] {
  const isoDate = path.match(DATE_FOLDER_RE)?.[1];
  if (!isoDate) return [];

  const { data } = parseFrontMatter(raw);
  const year = Number(isoDate.slice(0, 4));
  const date = formatListDate(isoDate);
  if (!Array.isArray(data.meetings)) return [];

  return data.meetings.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec || typeof rec.venue !== "string") return [];
    const venue = rec.venue;
    const races = Array.isArray(rec.races)
      ? rec.races
          .map((race) => parseRace(race, isoDate, venue, articleSlugs))
          .filter((race): race is PredictRace => race !== null)
          .sort((a, b) => a.number - b.number)
      : [];
    return [{ year, date, venue, races }];
  });
}

function loadMeetings(): PredictMeeting[] {
  const articleSlugs = loadRaceArticleSlugs();
  return Object.entries(meetingModules)
    .flatMap(([path, raw]) => parseMeetingFile(path, raw, articleSlugs))
    .sort((a, b) => {
      const byYear = b.year - a.year;
      if (byYear !== 0) return byYear;
      return compareListDate(b.date, a.date);
    });
}

function compareListDate(a: string, b: string): number {
  const [aMonth, aDay] = a.split("/").map(Number);
  const [bMonth, bDay] = b.split("/").map(Number);
  return aMonth - bMonth || aDay - bDay;
}

export const PREDICT_MEETINGS: PredictMeeting[] = loadMeetings();

export function getPredictYears(meetings = PREDICT_MEETINGS): number[] {
  return [...new Set(meetings.map((meeting) => meeting.year))].sort(
    (a, b) => b - a,
  );
}

export function getPredictDates(
  year: number,
  meetings = PREDICT_MEETINGS,
): string[] {
  return [
    ...new Set(
      meetings.filter((meeting) => meeting.year === year).map((m) => m.date),
    ),
  ].sort((a, b) => compareListDate(b, a));
}

export function getPredictVenues(
  year: number,
  date: string,
  meetings = PREDICT_MEETINGS,
): string[] {
  return [
    ...new Set(
      meetings
        .filter((meeting) => meeting.year === year && meeting.date === date)
        .map((m) => m.venue),
    ),
  ];
}

export function getPredictMeeting(
  year: number,
  date: string,
  venue: string,
  meetings = PREDICT_MEETINGS,
): PredictMeeting | undefined {
  return meetings.find(
    (meeting) =>
      meeting.year === year &&
      meeting.date === date &&
      meeting.venue === venue,
  );
}
