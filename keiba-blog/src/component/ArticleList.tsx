import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import AdUnit from "./AdUnit";
import MetaTags from "./MetaTags";
import Pagination from "./Pagination";
import { getArticlesByCategory } from "../utils/markdown";
import {
  CATEGORY_CONFIG,
  SITE_DESCRIPTION,
  type ArticleCategory,
} from "../utils/site";

const PAGE_SIZE = 10;

interface ArticleListProps {
  category: Exclude<ArticleCategory, "predict">;
}

export default function ArticleList({ category }: ArticleListProps) {
  const config = CATEGORY_CONFIG[category];
  const articles = getArticlesByCategory(category);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return articles.slice(start, start + PAGE_SIZE);
  }, [articles, currentPage]);

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
          <>
            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {pageArticles.map((article) => (
                <li key={article.slug}>
                  <BlogCard article={article} />
                </li>
              ))}
            </ul>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
        <AdUnit />
      </div>
    </>
  );
}
