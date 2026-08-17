import { useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import ClubMark from "../component/ClubMark";
import DummyBadge from "../component/DummyBadge";
import MetaTags from "../component/MetaTags";
import PedigreeTable from "../component/PedigreeTable";
import {
  finishTextClass,
  formatPrizeMan,
  formatRecruitPrice,
  getClub,
  getHorse,
  hasPedigree,
  sexTextClass,
  type HitokuchiHorse,
  type HorseRaceResult,
} from "../data/hitokuchiHorses";
import { formatDate } from "../utils/markdown";
import { SITE_DESCRIPTION } from "../utils/site";
import NotFound from "./NotFound";

type DiaryTab = "profile" | "diary" | "pedigree" | "analysis";

const TABS: { id: DiaryTab; label: string }[] = [
  { id: "profile", label: "紹介" },
  { id: "diary", label: "日記" },
  { id: "pedigree", label: "血統" },
  { id: "analysis", label: "分析" },
];

function dash(value: string | number | undefined): string {
  if (value === undefined || value === "") return "—";
  return String(value);
}

function formatRate(count: number, total: number): string {
  if (total === 0) return "—";
  return `${Math.round((count / total) * 100)}%`;
}

function countBy(values: string[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ja"));
}

function RaceResultsTable({
  races,
  onSelectRace,
}: {
  races: HorseRaceResult[];
  onSelectRace?: (slug: string) => void;
}) {
  return (
    <section aria-label="レース成績">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">レース成績</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700">
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">日付</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">開催</th>
              <th className="border border-gray-200 px-2 py-2">レース</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">コース</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">着順</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">人気</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">騎手</th>
              <th className="border border-gray-200 px-2 py-2 whitespace-nowrap">タイム</th>
            </tr>
          </thead>
          <tbody>
            {races.map((race) => (
              <tr key={race.diarySlug}>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap tabular-nums">
                  {race.date}
                </td>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">
                  {race.venue}
                  {race.number ? ` ${race.number}R` : ""}
                </td>
                <td className="border border-gray-200 px-2 py-2">
                  <a
                    href={`#${race.diarySlug}`}
                    className="text-blue-600 hover:underline"
                    onClick={() => onSelectRace?.(race.diarySlug)}
                  >
                    {race.name}
                  </a>
                </td>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">
                  {dash(race.course)}
                  {race.going ? ` ${race.going}` : ""}
                </td>
                <td
                  className={`border border-gray-200 px-2 py-2 whitespace-nowrap tabular-nums ${finishTextClass(race.finish)}`}
                >
                  {race.finish}着
                  {race.fieldSize ? `/${race.fieldSize}` : ""}
                </td>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap tabular-nums">
                  {race.popularity ? `${race.popularity}人気` : "—"}
                </td>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">
                  {dash(race.jockey)}
                </td>
                <td className="border border-gray-200 px-2 py-2 whitespace-nowrap tabular-nums">
                  {dash(race.time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProfileTable({ horse }: { horse: HitokuchiHorse }) {
  const rows = [
    {
      label: "誕生日",
      value: horse.birthDate ? formatDate(horse.birthDate) : undefined,
    },
    { label: "毛色", value: horse.coatColor },
    { label: "生産牧場", value: horse.breeder },
    { label: "育成牧場", value: horse.rearingFarm },
    {
      label: "募集価格",
      value: formatRecruitPrice(horse.recruitPriceMan, horse.sharePriceMan),
    },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  if (rows.length === 0) return null;

  return (
    <section aria-label="紹介">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">紹介</h2>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="w-28 border border-gray-200 bg-gray-50 px-2 py-2 text-left font-medium text-gray-700"
              >
                {row.label}
              </th>
              <td className="border border-gray-200 px-2 py-2 text-gray-900">
                {row.label === "誕生日" && horse.birthDate ? (
                  <time dateTime={horse.birthDate}>{row.value}</time>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ProfilePanel({
  horse,
  onSelectRace,
}: {
  horse: HitokuchiHorse;
  onSelectRace?: (slug: string) => void;
}) {
  const overviewHtml = horse.contentHtml.trim();

  return (
    <div className="space-y-8">
      <ProfileTable horse={horse} />

      {overviewHtml ? (
        <div
          className="article-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: overviewHtml }}
        />
      ) : null}

      {horse.races.length > 0 ? (
        <RaceResultsTable races={horse.races} onSelectRace={onSelectRace} />
      ) : (
        <p className="text-sm text-gray-500">出走成績はまだありません。</p>
      )}
    </div>
  );
}

function DiaryPanel({ horse }: { horse: HitokuchiHorse }) {
  const hasContent = horse.diaries.length > 0 || horse.photos.length > 0;

  if (!hasContent) {
    return <p className="text-sm text-gray-500">日記はまだありません。</p>;
  }

  return (
    <div className="space-y-8">
      {horse.diaries.length > 0 ? (
        <section aria-label="観戦記">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">観戦記</h2>
          <div className="space-y-8">
            {horse.diaries.map((entry) => (
              <article
                key={entry.slug}
                id={entry.slug}
                className="scroll-mt-20 border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
              >
                <h3 className="text-base font-semibold text-gray-900">{entry.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </p>
                {entry.contentHtml.trim() ? (
                  <div
                    className="article-body prose prose-gray mt-3 max-w-none"
                    dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {horse.photos.length > 0 ? (
        <section aria-label="写真">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">写真</h2>
          <ul className="grid grid-cols-2 gap-3">
            {horse.photos.map((photo) => (
              <li key={photo.alt}>
                <div className="flex aspect-[4/3] items-center justify-center bg-gray-200 text-sm text-gray-500">
                  {photo.alt}
                </div>
                {photo.caption ? (
                  <p className="mt-1 text-xs text-gray-600">{photo.caption}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function BarList({
  items,
  emptyLabel,
}: {
  items: { label: string; count: number }[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">{emptyLabel}</p>;
  }

  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-sm">
          <span className="w-20 shrink-0 text-gray-700">{item.label}</span>
          <div className="h-3 flex-1 bg-gray-100">
            <div
              className="h-3 bg-blue-400"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right tabular-nums text-gray-600">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

function HorsePedigreePanel({ horse }: { horse: HitokuchiHorse }) {
  if (!hasPedigree(horse.pedigree) || !horse.pedigree) {
    return <p className="text-sm text-gray-500">血統表はまだありません。</p>;
  }
  return <PedigreeTable pedigree={horse.pedigree} />;
}

function HorseAnalysis({ horse }: { horse: HitokuchiHorse }) {
  const races = horse.races;
  const starts = races.length;
  const wins = races.filter((race) => race.finish === 1).length;
  const quinella = races.filter((race) => race.finish <= 2).length;
  const show = races.filter((race) => race.finish <= 3).length;
  const board = races.filter((race) => race.finish <= 5).length;
  const finishCounts = [1, 2, 3, 4, 5].map((finish) => ({
    label: `${finish}着`,
    count: races.filter((race) => race.finish === finish).length,
  }));
  finishCounts.push({
    label: "6着以下",
    count: races.filter((race) => race.finish >= 6).length,
  });
  const venueCounts = countBy(races.map((race) => race.venue));
  const courseCounts = countBy(
    races.flatMap((race) => (race.course ? [race.course] : [])),
  );

  return (
    <div className="space-y-6">
      <p className="rounded border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600">
        詳細な分析内容は未定のため、出走成績からの簡易集計を表示しています。
      </p>
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">出走</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{starts}戦</dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">勝利</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{wins}勝</dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">獲得賞金</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            {formatPrizeMan(horse.prizeMan)}
          </dd>
        </div>
      </dl>
      <dl className="grid grid-cols-2 gap-2 text-center">
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">勝率</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">
            {formatRate(wins, starts)}
          </dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">連対率</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">
            {formatRate(quinella, starts)}
          </dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">複勝率</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">
            {formatRate(show, starts)}
          </dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">掲示板率</dt>
          <dd className="mt-1 text-base font-semibold text-gray-900">
            {formatRate(board, starts)}
          </dd>
        </div>
      </dl>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">着順分布</h2>
        <BarList items={finishCounts} emptyLabel="出走成績がまだありません。" />
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">開催場</h2>
        <BarList items={venueCounts} emptyLabel="開催場の集計はありません。" />
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">コース</h2>
        <BarList items={courseCounts} emptyLabel="コースの集計はありません。" />
      </section>
    </div>
  );
}

/**
 * UI設計: profile/aiba-diary.md
 * タブ（紹介 / 日記 / 血統 / 分析）＋ 出資馬ごとの日記・観戦記・思い出
 */
export default function AibaDiary() {
  const { bamei } = useParams<{ bamei: string }>();
  const horse = bamei ? getHorse(bamei) : undefined;
  const [activeTab, setActiveTab] = useState<DiaryTab>("profile");

  if (!bamei || !horse) {
    return <NotFound />;
  }

  const club = getClub(horse.clubId);
  const path = `/profile/hitokuchi-portfolio/${horse.bamei}`;

  return (
    <>
      <MetaTags
        title={`${horse.name}｜愛馬日記`}
        description={
          horse.description
            ? horse.description
            : `${horse.name}の日記・観戦記。${SITE_DESCRIPTION}`
        }
        ogType="article"
        path={path}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: "プロフィール", path: "/profile" },
            {
              label: "一口馬主ポートフォリオ",
              path: "/profile/hitokuchi-portfolio",
            },
            { label: horse.name },
          ]}
        />
        <header className="mb-6">
          <h1
            className={`flex flex-wrap items-center gap-2 text-2xl font-bold ${sexTextClass(horse.sex)}`}
          >
            {horse.name}
            <DummyBadge />
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
            {club ? (
              <>
                <ClubMark club={club} />
                <span>{club.name}</span>
                <span aria-hidden="true">/</span>
              </>
            ) : null}
            <span>{horse.className}</span>
            <span aria-hidden="true">/</span>
            <span>{horse.record}</span>
            <span aria-hidden="true">/</span>
            <span>{formatPrizeMan(horse.prizeMan)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{horse.stable}</p>
        </header>

        <div
          role="tablist"
          aria-label="愛馬日記"
          className="mb-6 flex gap-2 border-b border-gray-200"
        >
          {TABS.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`aiba-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`aiba-panel-${tab.id}`}
                className={`px-3 py-2 text-sm ${
                  selected
                    ? "border-b-2 border-blue-600 font-semibold text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`aiba-panel-${activeTab}`}
          aria-labelledby={`aiba-tab-${activeTab}`}
        >
          {activeTab === "profile" ? (
            <ProfilePanel
              horse={horse}
              onSelectRace={() => setActiveTab("diary")}
            />
          ) : activeTab === "diary" ? (
            <DiaryPanel horse={horse} />
          ) : activeTab === "pedigree" ? (
            <HorsePedigreePanel horse={horse} />
          ) : (
            <HorseAnalysis horse={horse} />
          )}
        </div>
      </div>
    </>
  );
}
