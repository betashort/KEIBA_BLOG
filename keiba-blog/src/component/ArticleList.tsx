import BlogCard from "./BlogCard";
import AdUnit from "./AdUnit";
import MetaTags from "./MetaTags";
import { getArticlesByCategory } from "../utils/markdown";
import {
  CATEGORY_CONFIG,
  SITE_DESCRIPTION,
  type ArticleCategory,
} from "../utils/site";

interface ArticleListProps {
  category: ArticleCategory;
}

export default function ArticleList({ category }: ArticleListProps) {
  const config = CATEGORY_CONFIG[category];
  const articles = getArticlesByCategory(category);

  return (
    <>
      <MetaTags
        title={config.label}
        description={`${config.label}の記事一覧。${SITE_DESCRIPTION}`}
        path={config.path}
      />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{config.label}</h1>
        <AdUnit />
        {articles.length === 0 ? (
          <p className="text-gray-600">記事はまだありません。</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <li key={article.slug}>
                <BlogCard article={article} />
              </li>
            ))}
          </ul>
        )}
        <AdUnit />
      </div>
    </>
  );
}
