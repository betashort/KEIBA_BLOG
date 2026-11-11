import { Link, useParams } from "react-router-dom";
import AdUnit from "../component/AdUnit";
import Breadcrumb from "../component/Breadcrumb";
import MetaTags from "../component/MetaTags";
import NotFound from "./NotFound";
import {
  formatDate,
  getPredictArticle,
  type PredictArticleMark,
  type PredictEntry,
  type PredictFeaturedHorse,
} from "../utils/markdown";
import {
  displaySlashDate,
  isoDateFromCompact,
  predictDayPath,
  predictRacePath,
} from "../utils/predictUrl";
import {
  CATEGORY_CONFIG,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
} from "../utils/site";

const MARK_ORDER: PredictArticleMark[] = ["◎", "〇", "▲", "△", "★"];

const ENTRY_PARAMS: {
  key: "speed" | "stamina" | "power" | "guts" | "intelligence";
  label: string;
}[] = [
  { key: "speed", label: "スピード" },
  { key: "stamina", label: "スタミナ" },
  { key: "power", label: "パワー" },
  { key: "guts", label: "根性" },
  { key: "intelligence", label: "賢さ" },
];

function PredictMarks({
  marks,
  bets,
}: {
  marks?: Partial<Record<PredictArticleMark, string>>;
  bets?: string[];
}) {
  const shown = MARK_ORDER.filter((mark) => marks?.[mark]);
  if (shown.length === 0 && !bets?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">印・買い目</h2>
      <dl className="space-y-2 text-sm text-gray-800">
        {shown.length > 0 && (
          <div>
            <dt className="mb-1 font-medium">予想印</dt>
            <dd className="flex flex-wrap gap-x-3 gap-y-1">
              {shown.map((mark) => (
                <span key={mark}>
                  {mark} {marks?.[mark]}
                </span>
              ))}
            </dd>
          </div>
        )}
        {bets && bets.length > 0 && (
          <div>
            <dt className="mb-1 font-medium">買い目</dt>
            <dd>{bets.join(" / ")}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

function FeaturedHorses({ horses }: { horses?: PredictFeaturedHorse[] }) {
  if (!horses?.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">注目馬</h2>
      <ul className="space-y-3">
        {horses.map((horse) => (
          <li key={horse.number}>
            <p className="font-semibold text-gray-900">
              {horse.number} {horse.name}
            </p>
            {horse.note && (
              <p className="text-sm leading-relaxed text-gray-700">
                {horse.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function EntryTable({ entries }: { entries?: PredictEntry[] }) {
  if (!entries?.length) return null;

  const head =
    "border border-gray-300 bg-gray-50 px-2 py-1 text-center font-semibold whitespace-nowrap";
  const cell =
    "border border-gray-300 px-2 py-1 text-center tabular-nums whitespace-nowrap";

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-gray-900">出馬表</h2>
      <div className="overflow-x-auto">
        <table className="w-max border-collapse text-xs">
          <thead>
            <tr>
              <th className={head} rowSpan={2}>
                馬番
              </th>
              <th className={head} rowSpan={2}>
                馬名
              </th>
              <th className={head} colSpan={ENTRY_PARAMS.length}>
                馬パラメータ
              </th>
              <th className={head} rowSpan={2}>
                タイム指数
              </th>
              <th className={head} rowSpan={2}>
                対戦指数
              </th>
              <th className={head} rowSpan={2}>
                レーティング
              </th>
            </tr>
            <tr>
              {ENTRY_PARAMS.map((param) => (
                <th key={param.key} className={head}>
                  {param.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.number}>
                <td className={cell}>{entry.number}</td>
                <td className={`${cell} text-left`}>{entry.name}</td>
                {ENTRY_PARAMS.map((param) => (
                  <td key={param.key} className={cell}>
                    {entry[param.key]}
                  </td>
                ))}
                <td className={cell}>{entry.timeIndex}</td>
                <td className={cell}>{entry.matchIndex}</td>
                <td className={cell}>{entry.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PredictPost() {
  const { date, race } = useParams<{ date: string; race: string }>();
  const config = CATEGORY_CONFIG.predict;
  const isoDate = date ? isoDateFromCompact(date) : undefined;
  const article = date && race ? getPredictArticle(date, race) : undefined;

  if (!date || !race || !isoDate || !article) {
    return <NotFound />;
  }

  const { frontMatter, contentHtml } = article;
  const articlePath = predictRacePath(date, race);
  const ogImage = frontMatter.ogImage ?? DEFAULT_OG_IMAGE;
  const dayLabel = displaySlashDate(isoDate);

  return (
    <>
      <MetaTags
        title={frontMatter.title}
        description={frontMatter.description ?? SITE_DESCRIPTION}
        ogType="article"
        ogImage={ogImage}
        path={articlePath}
        noindex={frontMatter.noindex}
      />
      <article className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "ホーム", path: "/" },
            { label: config.label, path: config.path },
            { label: dayLabel, path: predictDayPath(date) },
            { label: frontMatter.title },
          ]}
        />
        <header className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {frontMatter.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <time dateTime={frontMatter.date}>
              {formatDate(frontMatter.date)}
            </time>
            <span>·</span>
            <Link to={config.path} className="text-blue-600 hover:underline">
              {config.label}
            </Link>
          </div>
          {frontMatter.tags && frontMatter.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1">
              {frontMatter.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>
        <AdUnit />
        <PredictMarks marks={frontMatter.marks} bets={frontMatter.bets} />
        <FeaturedHorses horses={frontMatter.featured} />
        <EntryTable entries={frontMatter.entries} />
        <div
          className="article-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </>
  );
}
