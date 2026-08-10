import { Link } from "react-router-dom";
import type { Article } from "../utils/markdown";
import { formatDate } from "../utils/markdown";
import { CATEGORY_CONFIG } from "../utils/site";

interface BlogCardProps {
  article: Article;
  /** ホームのタブ一覧など、抜粋を出す場合に指定 */
  showExcerpt?: boolean;
}

export default function BlogCard({
  article,
  showExcerpt = false,
}: BlogCardProps) {
  const { frontMatter, slug, category } = article;
  const basePath = CATEGORY_CONFIG[category].path;
  const articlePath = `${basePath}/${slug}`;

  return (
    <article className="py-4">
      <Link to={articlePath} className="flex gap-4">
        {frontMatter.thumbnail ? (
          <img
            src={frontMatter.thumbnail}
            alt=""
            className="h-20 w-28 shrink-0 object-cover sm:h-24 sm:w-36"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-28 shrink-0 items-center justify-center bg-gray-100 text-xs text-gray-400 sm:h-24 sm:w-36">
            No Image
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            {frontMatter.title}
          </h2>
          <time
            dateTime={frontMatter.date}
            className="mt-1 block text-sm text-gray-500"
          >
            {formatDate(frontMatter.date)}
          </time>
          {showExcerpt && frontMatter.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {frontMatter.description}
            </p>
          ) : null}
          {!showExcerpt && frontMatter.tags && frontMatter.tags.length > 0 ? (
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
          ) : null}
        </div>
      </Link>
    </article>
  );
}
