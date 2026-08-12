/** 一口馬主ポートフォリオ・愛馬日記用のダミーデータ（UI_design/profile/hitokuchi-portfolio.md） */

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
  /** URL パラメータ `{bamei}` */
  bamei: string;
  name: string;
  sex: HorseSex;
  clubId: string;
  stable: string;
  /** 獲得賞金（万円） */
  prizeMan: number;
  className: HorseClass;
  record: string;
  diaryMarkdown: string;
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

export const HITOKUCHI_HORSES: HitokuchiHorse[] = [
  {
    bamei: "サンプルスター",
    name: "サンプルスター",
    sex: "牡",
    clubId: "shadai",
    stable: "美浦・サンプル厩舎",
    prizeMan: 8500,
    className: "オープン",
    record: "12戦3勝",
    diaryMarkdown: [
      "パドックで初めて会った日から、落ち着いた歩様が印象に残っている。",
      "重賞初挑戦では直線で伸びきれず悔しい結果になったが、次走に向けた調整は順調だ。",
    ].join("\n\n"),
    photos: [
      { alt: "パドックの様子", caption: "重賞前のパドック" },
      { alt: "レース直後", caption: "ゴール後の引き揚げ" },
    ],
    events: [
      { date: "2025-03-30", title: "大阪杯 5着", detail: "阪神芝2000m" },
      { date: "2025-06-08", title: "安田記念 出走", detail: "東京芝1600m" },
    ],
  },
  {
    bamei: "テストローズ",
    name: "テストローズ",
    sex: "牝",
    clubId: "carrot",
    stable: "栗東・モック厩舎",
    prizeMan: 6200,
    className: "オープン",
    record: "9戦2勝",
    diaryMarkdown:
      "牝馬ながら先行力があり、メンバーが揃うオープンでも存在感を見せている。",
    photos: [{ alt: "調教後の姿", caption: "CWコースでの追い切り後" }],
    events: [
      { date: "2025-04-13", title: "阪神牝馬S 3着", detail: "阪神芝1600m" },
    ],
  },
  {
    bamei: "モックヒーロー",
    name: "モックヒーロー",
    sex: "牡",
    clubId: "silk",
    stable: "美浦・ダミー厩舎",
    prizeMan: 3100,
    className: "3勝クラス",
    record: "8戦3勝",
    diaryMarkdown: "3勝クラスで安定した走りを見せている。オープン入りが近い。",
    photos: [{ alt: "勝利時の記念撮影", caption: "3勝目のウイナーズサークル" }],
    events: [
      { date: "2025-05-18", title: "3勝クラス 1着", detail: "東京芝1800m" },
    ],
  },
  {
    bamei: "ダミーライト",
    name: "ダミーライト",
    sex: "牝",
    clubId: "sunday",
    stable: "栗東・サンプル厩舎",
    prizeMan: 1800,
    className: "2勝クラス",
    record: "6戦2勝",
    diaryMarkdown: "小回り巧者で、コーナーワークが持ち味。",
    photos: [{ alt: "厩舎での近況", caption: "放牧明けの姿" }],
    events: [
      { date: "2025-02-09", title: "2勝クラス 2着", detail: "小倉芝1200m" },
    ],
  },
  {
    bamei: "プレースホルダ",
    name: "プレースホルダ",
    sex: "牡",
    clubId: "hiroo",
    stable: "美浦・テスト厩舎",
    prizeMan: 1450,
    className: "2勝クラス",
    record: "7戦2勝",
    diaryMarkdown: "ダート替わりで一変。次走もダートで期待したい。",
    photos: [{ alt: "レース映像の一場面", caption: "直線の追い比べ" }],
    events: [
      { date: "2025-01-25", title: "2勝クラス 1着", detail: "中山ダ1800m" },
    ],
  },
  {
    bamei: "フィクスチャー",
    name: "フィクスチャー",
    sex: "牝",
    clubId: "carrot",
    stable: "栗東・プレース厩舎",
    prizeMan: 720,
    className: "1勝クラス",
    record: "5戦1勝",
    diaryMarkdown: "新馬勝ちから一戦挟み、1勝クラスで再スタート。",
    photos: [{ alt: "新馬戦のパドック", caption: "デビュー戦当日" }],
    events: [
      { date: "2024-12-15", title: "新馬戦 1着", detail: "阪神芝1600m" },
    ],
  },
  {
    bamei: "ニューカマー",
    name: "ニューカマー",
    sex: "牡",
    clubId: "shadai",
    stable: "美浦・サンプル厩舎",
    prizeMan: 0,
    className: "新馬戦",
    record: "0戦0勝",
    diaryMarkdown: "デビューに向けた調教が進んでいる。初走りが楽しみだ。",
    photos: [{ alt: "デビュー前の姿", caption: "美浦での調教" }],
    events: [
      { date: "2025-08-01", title: "新馬戦 登録", detail: "新潟芝1800m 予定" },
    ],
  },
  {
    bamei: "ルーキーラン",
    name: "ルーキーラン",
    sex: "牝",
    clubId: "silk",
    stable: "栗東・モック厩舎",
    prizeMan: 200,
    className: "未勝利",
    record: "3戦0勝",
    diaryMarkdown: "デビュー戦は出遅れ。次走はスタートに注意したい。",
    photos: [{ alt: "未勝利戦の引き揚げ", caption: "3戦目のあと" }],
    events: [
      { date: "2025-07-06", title: "未勝利 6着", detail: "中京芝1400m" },
    ],
  },
  {
    bamei: "エントリー前",
    name: "エントリー前",
    sex: "牡",
    clubId: "sunday",
    stable: "未所属",
    prizeMan: 0,
    className: "未登録",
    record: "—",
    diaryMarkdown: "クラブ募集馬。登録・所属厩舎が決まり次第、近況を追記する。",
    photos: [{ alt: "募集時の写真", caption: "募集カタログより" }],
    events: [],
  },
  {
    bamei: "リタイアキング",
    name: "リタイアキング",
    sex: "セ",
    clubId: "hiroo",
    stable: "引退",
    prizeMan: 12400,
    className: "引退",
    record: "28戦5勝",
    diaryMarkdown:
      "現役を退き、功労馬として第二の馬生を歩んでいる。応援してくれた日々に感謝。",
    photos: [
      { alt: "現役時代の記念", caption: "重賞勝利の日" },
      { alt: "引退後の姿", caption: "功労馬としての近況" },
    ],
    events: [
      { date: "2024-11-03", title: "引退", detail: "現役28戦5勝" },
    ],
  },
];

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
