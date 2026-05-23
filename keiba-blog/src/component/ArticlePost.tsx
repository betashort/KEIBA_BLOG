import { Link, useParams } from "react-router-dom";
import AdUnit from "./AdUnit";
import Breadcrumb from "./Breadcrumb";
import MetaTags from "./MetaTags";
import NotFound from "../pages/NotFound";
import { formatDate, getArticle } from "../utils/markdown";
import {
  CATEGORY_CONFIG,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  type ArticleCategory,
} from "../utils/site";

interface ArticlePostProps {
  category: ArticleCategory;
}

export default function ArticlePost({ category }: ArticlePostProps) {
  const { article_name: articleName } = useParams<{ article_name: string }>();
  const config = CATEGORY_CONFIG[category];

  if (!articleName) {
    return <NotFound />;
  }

  const article = getArticle(category, articleName);
  if (!article) {
    return <NotFound />;
  }

  const { frontMatter, contentHtml, slug } = article;
  const articlePath = `${config.path}/${slug}`;
  const ogImage = frontMatter.ogImage ?? DEFAULT_OG_IMAGE;

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
        <div
          className="article-body prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <AdUnit />
      </article>
    </>
  );
}
