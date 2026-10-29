/** レース予想一覧。開催データは `src/articles/predict/{YYYY-MM-DD}/index.md` */

import { parseFrontMatter } from "../utils/frontMatter";
import {
  compactDate,
  displaySlashDate,
  predictRacePath,
  raceSegment,
} from "../utils/predictUrl";

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
  /** 詳細記事がある場合の公開パス */
  detailPath?: string;
}

export interface PredictMeeting {
  year: number;
  isoDate: string;
  compactDate: string;
  /** カード・見出し用。`2026/10/25` */
  label: string;
  venue: string;
  races: PredictRace[];
}

export interface PredictDaySummary {
  isoDate: string;
  compactDate: string;
  label: string;
  venues: string[];
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

function raceArticleKey(isoDate: string, venue: string, raceNumber: number): string {
  return `${isoDate}\0${venue}\0${raceNumber}`;
}

function loadRaceDetailPaths(): Map<string, string> {
  const paths = new Map<string, string>();
  for (const [path, raw] of Object.entries(raceArticleModules)) {
    if (path.includes("/template/")) continue;
    const match = path.match(RACE_ARTICLE_RE);
    if (!match) continue;
    const { data } = parseFrontMatter(raw);
    if (typeof data.venue !== "string") continue;
    const raceNumber = toPositiveInt(data.raceNumber);
    if (raceNumber === null) continue;
    const segment = raceSegment(data.venue, raceNumber);
    const compact = compactDate(match[1]);
    if (!segment || !compact) continue;
    paths.set(
      raceArticleKey(match[1], data.venue, raceNumber),
      predictRacePath(compact, segment),
    );
  }
  return paths;
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
  detailPaths: Map<string, string>,
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

  return {
    number,
    className: rec.className,
    name: rec.name,
    course: rec.course,
    runners,
    marks: parseMarks(rec.marks),
    bets: parseBets(rec.bets),
    detailPath: detailPaths.get(raceArticleKey(isoDate, venue, number)),
  };
}

function parseMeetingFile(
  path: string,
  raw: string,
  detailPaths: Map<string, string>,
): PredictMeeting[] {
  const isoDate = path.match(DATE_FOLDER_RE)?.[1];
  const compact = isoDate ? compactDate(isoDate) : undefined;
  if (!isoDate || !compact) return [];

  const { data } = parseFrontMatter(raw);
  const year = Number(isoDate.slice(0, 4));
  const label = displaySlashDate(isoDate);
  if (!Array.isArray(data.meetings)) return [];

  return data.meetings.flatMap((item) => {
    const rec = asRecord(item);
    if (!rec || typeof rec.venue !== "string") return [];
    const venue = rec.venue;
    const races = Array.isArray(rec.races)
      ? rec.races
          .map((race) => parseRace(race, isoDate, venue, detailPaths))
          .filter((race): race is PredictRace => race !== null)
          .sort((a, b) => a.number - b.number)
      : [];
    return [{ year, isoDate, compactDate: compact, label, venue, races }];
  });
}

function loadMeetings(): PredictMeeting[] {
  const detailPaths = loadRaceDetailPaths();
  return Object.entries(meetingModules)
    .filter(([path]) => !path.includes("/template/"))
    .flatMap(([path, raw]) => parseMeetingFile(path, raw, detailPaths))
    .sort((a, b) => b.compactDate.localeCompare(a.compactDate));
}

export const PREDICT_MEETINGS: PredictMeeting[] = loadMeetings();

export function getPredictDays(meetings = PREDICT_MEETINGS): PredictDaySummary[] {
  const byDate = new Map<string, PredictDaySummary>();
  for (const meeting of meetings) {
    const existing = byDate.get(meeting.compactDate);
    if (!existing) {
      byDate.set(meeting.compactDate, {
        isoDate: meeting.isoDate,
        compactDate: meeting.compactDate,
        label: meeting.label,
        venues: [meeting.venue],
      });
      continue;
    }
    if (!existing.venues.includes(meeting.venue)) {
      existing.venues.push(meeting.venue);
    }
  }
  return [...byDate.values()].sort((a, b) =>
    b.compactDate.localeCompare(a.compactDate),
  );
}

export function getPredictDay(
  compact: string,
  meetings = PREDICT_MEETINGS,
): { label: string; isoDate: string; meetings: PredictMeeting[] } | undefined {
  const dayMeetings = meetings.filter(
    (meeting) => meeting.compactDate === compact,
  );
  if (dayMeetings.length === 0) return undefined;
  return {
    label: dayMeetings[0].label,
    isoDate: dayMeetings[0].isoDate,
    meetings: dayMeetings,
  };
}
