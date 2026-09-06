import { useParams } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";
import DummyBadge from "../component/DummyBadge";
import MetaTags from "../component/MetaTags";
import {
  formatPercent,
  formatYen,
  formatYearMonthLabel,
  getBakenMonth,
  hitRate,
  monthTicketTypes,
  profitYen,
  recoveryRate,
} from "../data/bakenPortfolio";
import { SITE_DESCRIPTION } from "../utils/site";
import NotFound from "./NotFound";

/**
 * UI設計: profile/baken-monthly.md
 * 月次の馬券成績記事。サマリ・券種・購入履歴・本文
 */
export default function BakenMonthlyPost() {
  const { yearMonth } = useParams<{ yearMonth: string }>();
  const article = yearMonth ? getBakenMonth(yearMonth) : undefined;

  if (!yearMonth || !article) {
    return <NotFound />;
  }

  const path = `/profile/baken-portfolio/${article.yearMonth}`;
  const pl = profitYen(article);
  const recovery = recoveryRate(article);
  const monthHitRate = hitRate(article.hitCount, article.ticketCount);
  const ticketTypes = monthTicketTypes(article);

  return (
    <>
      <MetaTags
        title={article.title}
        description={article.description ?? SITE_DESCRIPTION}
        ogType="article"
        path={path}
        noindex={article.noindex}
      />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: "プロフィール", path: "/profile" },
            { label: "馬券ポートフォリオ", path: "/profile/baken-portfolio" },
            { label: formatYearMonthLabel(article.yearMonth) },
          ]}
        />
        <header className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-gray-900">
            {article.title}
            <DummyBadge />
          </h1>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
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
                {formatPercent(monthHitRate)}
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
            購入 {formatYen(article.purchaseYen, false)} / 払戻{" "}
            {formatYen(article.payoutYen, false)} / {article.hitCount} /{" "}
            {article.ticketCount} 的中
          </p>
        </header>

        {article.contentHtml.trim() ? (
          <div
            className="article-body prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        ) : null}

        {ticketTypes.length > 0 ? (
          <section className="mt-8" aria-label="券種別">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">券種別</h2>
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
          </section>
        ) : null}

        {article.history.length > 0 ? (
          <section className="mt-8" aria-label="購入履歴">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">購入履歴</h2>
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
                  {article.history.map((row) => (
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
          </section>
        ) : null}
      </article>
    </>
  );
}
