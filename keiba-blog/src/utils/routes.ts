import { getBakenMonths } from "../data/bakenPortfolio";
import { HITOKUCHI_HORSES } from "../data/hitokuchiHorses";
import { getAllArticles, getArticlesByCategory } from "./markdown";
import { CATEGORY_CONFIG, type ArticleCategory } from "./site";

export interface PublicRoute {
  path: string;
  includeInSitemap: boolean;
  lastmod?: string;
  changefreq?: "weekly" | "monthly";
  priority?: string;
}

/** プリレンダーで NotFound を描画するためのパス（sitemap には含めない） */
export const NOT_FOUND_PRERENDER_PATH = "/__404__";

function latestArticleDate(category?: ArticleCategory): string | undefined {
  const articles = category
    ? getArticlesByCategory(category)
    : [...getAllArticles()].sort((a, b) =>
        b.frontMatter.date.localeCompare(a.frontMatter.date),
      );
  return articles[0]?.frontMatter.date;
}

function latestEventDate(dates: string[]): string | undefined {
  return [...dates].sort((a, b) => b.localeCompare(a))[0];
}

function latestBakenMonthDate(): string | undefined {
  const months = [...getBakenMonths()].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  return months[0]?.date;
}

export function getPublicRoutes(): PublicRoute[] {
  const routes: PublicRoute[] = [
    {
      path: "/",
      includeInSitemap: true,
      lastmod: latestArticleDate(),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      path: "/blog",
      includeInSitemap: true,
      lastmod: latestArticleDate("blog"),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      path: "/study",
      includeInSitemap: true,
      lastmod: latestArticleDate("study"),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      path: "/analysis",
      includeInSitemap: true,
      lastmod: latestArticleDate("analysis"),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      path: "/predict",
      includeInSitemap: true,
      lastmod: latestArticleDate("predict"),
      changefreq: "weekly",
      priority: "0.8",
    },
    {
      path: "/profile",
      includeInSitemap: true,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      path: "/profile/hitokuchi-portfolio",
      includeInSitemap: true,
      changefreq: "monthly",
      priority: "0.5",
    },
    {
      path: "/profile/baken-portfolio",
      includeInSitemap: true,
      lastmod: latestBakenMonthDate(),
      changefreq: "monthly",
      priority: "0.5",
    },
  ];

  for (const article of getAllArticles()) {
    routes.push({
      path: `${CATEGORY_CONFIG[article.category].path}/${article.slug}`,
      includeInSitemap: article.frontMatter.noindex !== true,
      lastmod: article.frontMatter.date,
      changefreq: "monthly",
      priority: "0.7",
    });
  }

  for (const horse of HITOKUCHI_HORSES) {
    routes.push({
      path: `/profile/hitokuchi-portfolio/${horse.bamei}`,
      includeInSitemap: true,
      lastmod:
        latestEventDate(horse.events.map((event) => event.date)) ?? horse.date,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  for (const month of getBakenMonths()) {
    routes.push({
      path: `/profile/baken-portfolio/${month.yearMonth}`,
      includeInSitemap: month.noindex !== true,
      lastmod: month.date,
      changefreq: "monthly",
      priority: "0.6",
    });
  }

  return routes;
}
