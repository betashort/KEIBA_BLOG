import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../component/BlogCard";
import MetaTags from "../component/MetaTags";
import { getAllArticles, getArticlesByCategory } from "../utils/markdown";
import {
  CATEGORY_CONFIG,
  SITE_DESCRIPTION,
  SITE_NAME,
  type ArticleCategory,
} from "../utils/site";

type HomeTab = Exclude<ArticleCategory, "analysis">;

const TABS: { id: HomeTab; label: string }[] = [
  { id: "predict", label: CATEGORY_CONFIG.predict.label },
  { id: "study", label: CATEGORY_CONFIG.study.label },
  { id: "blog", label: CATEGORY_CONFIG.blog.label },
];

const SLIDE_LIMIT = 5;
const TAB_ARTICLE_LIMIT = 5;
const SLIDE_INTERVAL_MS = 5000;

export default function Home() {
  const slides = useMemo(
    () =>
      [...getAllArticles()]
        .sort(
          (a, b) =>
            new Date(b.frontMatter.date).getTime() -
            new Date(a.frontMatter.date).getTime(),
        )
        .slice(0, SLIDE_LIMIT),
    [],
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<HomeTab>("predict");

  const tabArticles = useMemo(
    () => getArticlesByCategory(activeTab).slice(0, TAB_ARTICLE_LIMIT),
    [activeTab],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[slideIndex];

  return (
    <>
      <MetaTags title={SITE_NAME} description={SITE_DESCRIPTION} path="/" />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <section aria-label="新着記事スライドショー" className="mb-10">
          {currentSlide ? (
            <div className="relative overflow-hidden border border-gray-200 bg-gray-50">
              <Link
                to={`${CATEGORY_CONFIG[currentSlide.category].path}/${currentSlide.slug}`}
                className="block"
              >
                {currentSlide.frontMatter.thumbnail ? (
                  <img
                    src={currentSlide.frontMatter.thumbnail}
                    alt=""
                    className="h-48 w-full object-cover sm:h-64"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-200 text-sm text-gray-500 sm:h-64">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500">
                    {CATEGORY_CONFIG[currentSlide.category].label}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    {currentSlide.frontMatter.title}
                  </h2>
                </div>
              </Link>
              {slides.length > 1 ? (
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-2">
                  <button
                    type="button"
                    className="rounded bg-white/90 px-2 py-1 text-sm text-gray-700 shadow"
                    aria-label="前のスライド"
                    onClick={() =>
                      setSlideIndex(
                        (current) =>
                          (current - 1 + slides.length) % slides.length,
                      )
                    }
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="rounded bg-white/90 px-2 py-1 text-sm text-gray-700 shadow"
                    aria-label="次のスライド"
                    onClick={() =>
                      setSlideIndex((current) => (current + 1) % slides.length)
                    }
                  >
                    &gt;
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="rounded border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
              新着記事はまだありません。
            </p>
          )}
          {slides.length > 1 ? (
            <div className="mt-3 flex justify-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.slug}
                  type="button"
                  aria-label={`スライド ${index + 1}`}
                  aria-current={index === slideIndex}
                  className={`h-2 w-2 rounded-full ${
                    index === slideIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setSlideIndex(index)}
                />
              ))}
            </div>
          ) : null}
        </section>

        <section aria-label="カテゴリ別新着">
          <div
            role="tablist"
            aria-label="カテゴリタブ"
            className="flex border-b border-gray-200"
          >
            {TABS.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`home-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`home-panel-${tab.id}`}
                  className={`flex-1 px-2 py-3 text-sm sm:text-base ${
                    selected
                      ? "border-b-2 border-blue-600 font-semibold text-blue-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`home-panel-${activeTab}`}
            aria-labelledby={`home-tab-${activeTab}`}
            className="border-b border-gray-200"
          >
            {tabArticles.length === 0 ? (
              <p className="py-8 text-sm text-gray-600">
                このカテゴリの記事はまだありません。
              </p>
            ) : (
              <ul>
                {tabArticles.map((article) => (
                  <li key={`${article.category}-${article.slug}`}>
                    <BlogCard article={article} showExcerpt />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
