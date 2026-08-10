/** レース予想一覧用の開催データ（UI_design/predict/list.md） */

export type PredictMark = "◎" | "〇" | "▲" | "△" | "★";

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
  date: string; // MM/DD
  venue: string;
  races: PredictRace[];
}

export const PREDICT_MEETINGS: PredictMeeting[] = [
  {
    year: 2025,
    date: "7/19",
    venue: "福島",
    races: [
      {
        number: 1,
        className: "未勝利",
        name: "3歳未勝利",
        course: "芝1200m",
        runners: 16,
        marks: {
          "◎": "1 サンプルホース",
          "〇": "5 テストスター",
          "▲": "8 ダミージョッキー",
          "△": "12 モックランナー",
          "★": "3 プレースホルダ",
        },
        bets: ["単勝 1", "馬連 1-5"],
        articleSlug: undefined,
      },
      {
        number: 2,
        className: "1勝クラス",
        name: "いわき特別",
        course: "ダート1700m",
        runners: 15,
        marks: {
          "◎": "4 サンプルホース",
          "〇": "7 テストスター",
          "▲": "2 ダミージョッキー",
        },
        bets: ["単勝 4", "ワイド 4-7"],
      },
    ],
  },
  {
    year: 2025,
    date: "7/19",
    venue: "小倉",
    races: [
      {
        number: 11,
        className: "G3",
        name: "中京記念",
        course: "芝1600m",
        runners: 18,
        marks: {
          "◎": "6 サンプルホース",
          "〇": "10 テストスター",
          "▲": "1 ダミージョッキー",
          "△": "14 モックランナー",
          "★": "9 プレースホルダ",
        },
        bets: ["単勝 6", "3連複 6-10-1"],
        articleSlug: "sample-predict",
      },
    ],
  },
  {
    year: 2025,
    date: "7/20",
    venue: "函館",
    races: [
      {
        number: 1,
        className: "未勝利",
        name: "2歳未勝利",
        course: "芝1200m",
        runners: 12,
        marks: {
          "◎": "2 サンプルホース",
          "〇": "5 テストスター",
        },
        bets: ["単勝 2"],
      },
    ],
  },
];

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
  ];
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
