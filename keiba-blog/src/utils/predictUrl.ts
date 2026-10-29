/** 競馬場の表示名と URL 用英名。アーキテクチャ設計書「レース予想の URL」と対応する */
export const VENUE_SLUGS: Record<string, string> = {
  札幌: "sapporo",
  函館: "hakodate",
  福島: "fukushima",
  新潟: "niigata",
  東京: "tokyo",
  中山: "nakayama",
  中京: "chukyo",
  京都: "kyoto",
  阪神: "hanshin",
  小倉: "kokura",
};

export function venueSlug(venue: string): string | undefined {
  return VENUE_SLUGS[venue];
}

/** `YYYY-MM-DD` を URL 用の `YYYYMMDD` にする */
export function compactDate(isoDate: string): string | undefined {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return undefined;
  return `${match[1]}${match[2]}${match[3]}`;
}

/** `YYYYMMDD` を `YYYY-MM-DD` にする */
export function isoDateFromCompact(compact: string): string | undefined {
  const match = compact.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (!match) return undefined;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

/** 一覧カード・見出し用。`2026/10/25` */
export function displaySlashDate(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;
  return `${match[1]}/${match[2]}/${match[3]}`;
}

export function raceSegment(venue: string, raceNumber: number): string | undefined {
  const slug = venueSlug(venue);
  if (!slug) return undefined;
  return `${slug}-${raceNumber}R`;
}

export function predictDayPath(compact: string): string {
  return `/race-predict/${compact}`;
}

export function predictRacePath(compact: string, segment: string): string {
  return `/race-predict/${compact}/${segment}`;
}
