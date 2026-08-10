import { useParams } from "react-router-dom";
import AdUnit from "../component/AdUnit";
import Breadcrumb from "../component/Breadcrumb";
import MetaTags from "../component/MetaTags";
import NotFound from "./NotFound";
import { getArticle } from "../utils/markdown";
import {
  CATEGORY_CONFIG,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
} from "../utils/site";

/**
 * UI設計: analysis/article.md
 * レース名・レース情報を上部に表示し、本文は Markdown
 */
export default function AnalysisPost() {
  const { article_name: articleName } = useParams<{ article_name: string }>();
  const config = CATEGORY_CONFIG.analysis;

  if (!articleName) {
    return <NotFound />;
  }

  const article = getArticle("analysis", articleName);
  if (!article) {
    return <NotFound />;
  }

  const { frontMatter, contentHtml, slug } = article;
  const articlePath = `${config.path}/${slug}`;
  const ogImage = frontMatter.ogImage ?? DEFAULT_OG_IMAGE;
  const raceName = frontMatter.raceName ?? frontMatter.title;
  const raceInfo = frontMatter.raceInfo ?? frontMatter.description;

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
          <h1 className="text-2xl font-bold text-gray-900">{raceName}</h1>
          {raceInfo ? (
            <p className="mt-2 text-sm text-gray-600">{raceInfo}</p>
          ) : null}
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
