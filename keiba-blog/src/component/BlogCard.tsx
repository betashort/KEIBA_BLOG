import { Link } from "react-router-dom";
import type { Article } from "../utils/markdown";
import { formatDate } from "../utils/markdown";
import { CATEGORY_CONFIG } from "../utils/site";

interface BlogCardProps {
  article: Article;
}

export default function BlogCard({ article }: BlogCardProps) {
  const { frontMatter, slug, category } = article;
  const basePath = CATEGORY_CONFIG[category].path;
  const articlePath = `${basePath}/${slug}`;

  return (
    <article className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={articlePath} className="block">
        {frontMatter.thumbnail ? (
          <img
            src={frontMatter.thumbnail}
            alt=""
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-40 items-center justify-center bg-gray-100 text-sm text-gray-400">
            No Image
          </div>
        )}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {frontMatter.title}
          </h2>
          <time
            dateTime={frontMatter.date}
            className="mt-1 block text-sm text-gray-500"
          >
            {formatDate(frontMatter.date)}
          </time>
          <p className="mt-1 text-xs text-gray-500">
            {CATEGORY_CONFIG[category].label}
          </p>
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
        </div>
      </Link>
    </article>
  );
}
