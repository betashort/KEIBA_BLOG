import { Link, useParams } from "react-router-dom";
// import AdUnit from "../component/AdUnit";
import Breadcrumb from "../component/Breadcrumb";
import MetaTags from "../component/MetaTags";
import NotFound from "./NotFound";
import { formatDate, getPredictArticle } from "../utils/markdown";
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
        {/* <AdUnit /> */}
        <div
          className="article-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        {/* <AdUnit /> */}
      </article>
    </>
  );
}
