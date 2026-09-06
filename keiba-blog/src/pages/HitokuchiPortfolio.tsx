import { useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import ClubMark from "../component/ClubMark";
import MetaTags from "../component/MetaTags";
import {
  getClub,
  getHorsesByClass,
  HITOKUCHI_HORSES,
  HORSE_CLASSES,
  formatPrizeMan,
  sexTextClass,
  type HitokuchiHorse,
  type HorseClass,
} from "../data/hitokuchiHorses";
import { SITE_DESCRIPTION } from "../utils/site";

type PortfolioTab = "horses" | "analysis";

const TABS: { id: PortfolioTab; label: string }[] = [
  { id: "horses", label: "出資馬" },
  { id: "analysis", label: "分析" },
];

function HorseCell({ horse }: { horse: HitokuchiHorse }) {
  const club = getClub(horse.clubId);

  return (
    <div className="min-w-[9.5rem] rounded border border-gray-200 px-2 py-2">
      <div className="flex items-start gap-1.5">
        {club ? <ClubMark club={club} /> : null}
        <Link
          to={`/profile/hitokuchi-portfolio/${horse.bamei}`}
          className={`text-sm font-semibold hover:underline ${sexTextClass(horse.sex)}`}
        >
          {horse.name}
        </Link>
      </div>
      <p className="mt-1 text-xs text-gray-600">
        ({horse.stable}, {formatPrizeMan(horse.prizeMan)})
      </p>
    </div>
  );
}

function HorsesMatrix() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">クラス別の出資馬一覧</caption>
        <tbody>
          {HORSE_CLASSES.map((className) => (
            <ClassRow key={className} horseClass={className} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ClassRow({ horseClass }: { horseClass: HorseClass }) {
  const horses = getHorsesByClass(horseClass);

  return (
    <tr className="border-b border-gray-200">
      <th
        scope="row"
        className="w-24 shrink-0 bg-gray-50 px-2 py-3 text-left align-top font-semibold text-gray-800"
      >
        {horseClass}
      </th>
      <td className="px-2 py-3">
        {horses.length === 0 ? (
          <p className="text-xs text-gray-400">—</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {horses.map((horse) => (
              <HorseCell key={horse.bamei} horse={horse} />
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

function AnalysisDummy() {
  const total = HITOKUCHI_HORSES.length;
  const retired = HITOKUCHI_HORSES.filter((horse) => horse.className === "引退").length;
  const unregistered = HITOKUCHI_HORSES.filter(
    (horse) => horse.className === "未登録",
  ).length;
  const active = total - retired - unregistered;
  const classCounts = HORSE_CLASSES.map((className) => ({
    className,
    count: getHorsesByClass(className).length,
  }));
  const maxCount = Math.max(...classCounts.map((item) => item.count), 1);

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-3 gap-2 text-center">
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">総出資馬</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{total}頭</dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">現役</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{active}頭</dd>
        </div>
        <div className="border border-gray-200 px-2 py-3">
          <dt className="text-xs text-gray-500">引退</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">{retired}頭</dd>
        </div>
      </dl>
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-900">クラス別頭数</h2>
        <ul className="space-y-2">
          {classCounts.map((item) => (
            <li key={item.className} className="flex items-center gap-2 text-sm">
              <span className="w-20 shrink-0 text-gray-700">{item.className}</span>
              <div className="h-3 flex-1 bg-gray-100">
                <div
                  className="h-3 bg-blue-400"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-gray-600">{item.count}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/**
 * UI設計: profile/hitokuchi-portfolio.md
 * タブ（出資馬 / 分析）＋ クラス別 8×2 マトリクス
 */
export default function HitokuchiPortfolio() {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("horses");

  return (
    <>
      <MetaTags
        title="一口馬主ポートフォリオ"
        description={`一口馬主の出資馬一覧とポートフォリオ。${SITE_DESCRIPTION}`}
        path="/profile/hitokuchi-portfolio"
        ogImage="/images/og/hitokuchi/default.png"
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: "プロフィール", path: "/profile" },
            { label: "一口馬主ポートフォリオ" },
          ]}
        />
        <h1 className="mb-6 flex flex-wrap items-center gap-2 text-2xl font-bold text-gray-900">
          一口馬主ポートフォリオ
        </h1>

        <div
          role="tablist"
          aria-label="ポートフォリオ"
          className="mb-6 flex gap-2 border-b border-gray-200"
        >
          {TABS.map((tab) => {
            const selected = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`hitokuchi-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`hitokuchi-panel-${tab.id}`}
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
          id={`hitokuchi-panel-${activeTab}`}
          aria-labelledby={`hitokuchi-tab-${activeTab}`}
        >
          {activeTab === "horses" ? <HorsesMatrix /> : <AnalysisDummy />}
        </div>
      </div>
    </>
  );
}
