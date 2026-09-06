import { Link } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import DummyBadge from "../component/DummyBadge";
import MetaTags from "../component/MetaTags";
import {
  formatPercent,
  formatYen,
  formatYearMonth,
  getBakenHistory,
  getBakenMonthlyResults,
  getBakenSummary,
  getBakenTicketTypes,
  profitYen,
  recoveryRate,
} from "../data/bakenPortfolio";
import { SITE_DESCRIPTION } from "../utils/site";

function MonthlyChart() {
  const monthly = getBakenMonthlyResults();
  const maxAbs = Math.max(...monthly.map((item) => Math.abs(item.profitYen)), 1);

  if (monthly.length === 0) {
    return <p className="text-sm text-gray-500">月次成績の記事がまだありません。</p>;
  }

  return (
    <ul className="space-y-2">
      {monthly.map((item) => {
        const positive = item.profitYen >= 0;
        return (
          <li key={item.yearMonth} className="flex items-center gap-2 text-sm">
            <Link
              to={`/profile/baken-portfolio/${item.yearMonth}`}
              className="w-10 shrink-0 text-blue-600 hover:underline"
            >
              {formatYearMonth(item.yearMonth)}
            </Link>
            <div className="h-3 flex-1 bg-gray-100">
              <div
                className={positive ? "h-3 bg-emerald-500" : "h-3 bg-red-400"}
                style={{
                  width: `${(Math.abs(item.profitYen) / maxAbs) * 100}%`,
                }}
              />
            </div>
            <span
              className={`w-24 shrink-0 text-right tabular-nums ${
                positive ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {formatYen(item.profitYen)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * UI設計: profile/baken-portfolio.md
 * 全体サマリ・収支グラフ・券種別分析・購入履歴
 * 月次成績は src/articles/baken/{YYYY-MM}/index.md から集計
 */
export default function BakenPortfolio() {
  const summary = getBakenSummary();
  const ticketTypes = getBakenTicketTypes();
  const history = getBakenHistory();
  const pl = profitYen(summary);
  const recovery = recoveryRate(summary);

  return (
    <>
      <MetaTags
        title="馬券ポートフォリオ"
        description={`馬券成績（収支・的中率・回収率）の可視化。${SITE_DESCRIPTION}`}
        path="/profile/baken-portfolio"
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: "プロフィール", path: "/profile" },
            { label: "馬券ポートフォリオ" },
          ]}
        />
        <h1 className="mb-6 flex flex-wrap items-center gap-2 text-2xl font-bold text-gray-900">
          馬券ポートフォリオ
          <DummyBadge />
        </h1>

        <section aria-label="全体サマリ" className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">全体サマリ</h2>
          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-gray-200 px-2 py-3">
              <dt className="text-xs text-gray-500">収支</dt>
              <dd
                className={`mt-1 text-base font-semibold ${
                  pl >= 0 ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {formatYen(pl)}
              </dd>
            </div>
            <div className="border border-gray-200 px-2 py-3">
              <dt className="text-xs text-gray-500">的中率</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900">
                {formatPercent(summary.hitRate)}
              </dd>
            </div>
            <div className="border border-gray-200 px-2 py-3">
              <dt className="text-xs text-gray-500">回収率</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900">
                {formatPercent(recovery)}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-gray-500">
            購入 {formatYen(summary.purchaseYen, false)} / 払戻{" "}
            {formatYen(summary.payoutYen, false)} / {summary.hitCount} /{" "}
            {summary.ticketCount} 的中
          </p>
        </section>

        <section aria-label="収支・成績グラフ" className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            収支・成績グラフ（年月別 / 全体）
          </h2>
          <MonthlyChart />
        </section>

        <section aria-label="券種別詳細分析" className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            券種 / カテゴリ別 詳細分析
          </h2>
          {ticketTypes.length === 0 ? (
            <p className="text-sm text-gray-500">券種別の集計データがありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-700">
                    <th className="border border-gray-200 px-2 py-2">券種</th>
                    <th className="border border-gray-200 px-2 py-2">件数</th>
                    <th className="border border-gray-200 px-2 py-2">的中率</th>
                    <th className="border border-gray-200 px-2 py-2">回収率</th>
                    <th className="border border-gray-200 px-2 py-2">収支</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketTypes.map((row) => (
                    <tr key={row.type}>
                      <td className="border border-gray-200 px-2 py-2">{row.type}</td>
                      <td className="border border-gray-200 px-2 py-2 tabular-nums">
                        {row.count}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 tabular-nums">
                        {formatPercent(row.hitRate)}
                      </td>
                      <td className="border border-gray-200 px-2 py-2 tabular-nums">
                        {formatPercent(row.recoveryRate)}
                      </td>
                      <td
                        className={`border border-gray-200 px-2 py-2 tabular-nums ${
                          row.profitYen >= 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {formatYen(row.profitYen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-label="購入履歴まとめ">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            購入履歴まとめ
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">購入履歴がありません。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-700">
                    <th className="border border-gray-200 px-2 py-2">日付</th>
                    <th className="border border-gray-200 px-2 py-2">レース</th>
                    <th className="border border-gray-200 px-2 py-2">券種</th>
                    <th className="border border-gray-200 px-2 py-2">結果</th>
                    <th className="border border-gray-200 px-2 py-2">収支</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={`${row.date}-${row.race}-${row.ticketType}`}>
                      <td className="border border-gray-200 px-2 py-2 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">{row.race}</td>
                      <td className="border border-gray-200 px-2 py-2">
                        {row.ticketType}
                      </td>
                      <td className="border border-gray-200 px-2 py-2">
                        {row.result}
                      </td>
                      <td
                        className={`border border-gray-200 px-2 py-2 tabular-nums ${
                          row.profitYen >= 0 ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {formatYen(row.profitYen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
