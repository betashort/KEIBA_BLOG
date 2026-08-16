import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { buildRobotsTxt, buildSitemapXml } from "./sitemap.ts";

interface RenderResult {
  html: string;
  head: string;
}

interface PublicRoute {
  path: string;
  includeInSitemap: boolean;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");

function outputFileForPath(urlPath: string): string {
  if (urlPath === "/") {
    return path.join(distDir, "index.html");
  }
  return path.join(distDir, urlPath.replace(/^\//, ""), "index.html");
}

function injectHtml(template: string, appHtml: string, head: string): string {
  const withoutTitle = template.replace(/<title>[\s\S]*?<\/title>/i, "");
  const withHead = withoutTitle.replace("</head>", `${head}\n</head>`);
  const injected = withHead.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${appHtml}</div>`,
  );
  if (injected === withHead) {
    throw new Error('dist/index.html に <div id="root"></div> がありません');
  }
  return injected;
}

async function main(): Promise<void> {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");

  const vite = await createServer({
    root,
    configFile: false,
    plugins: [react()],
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
  });

  try {
    const { render } = (await vite.ssrLoadModule("/src/entry-server.tsx")) as {
      render: (url: string) => RenderResult;
    };
    const { getPublicRoutes, NOT_FOUND_PRERENDER_PATH } =
      (await vite.ssrLoadModule("/src/utils/routes.ts")) as {
        getPublicRoutes: () => PublicRoute[];
        NOT_FOUND_PRERENDER_PATH: string;
      };
    const { toAbsoluteUrl } = (await vite.ssrLoadModule(
      "/src/utils/site.ts",
    )) as {
      toAbsoluteUrl: (path: string) => string;
    };

    const routes = getPublicRoutes();
    console.log(`プリレンダー対象: ${routes.length} URL`);

    for (const route of routes) {
      const { html, head } = render(route.path);
      const outFile = outputFileForPath(route.path);
      await mkdir(path.dirname(outFile), { recursive: true });
      await writeFile(outFile, injectHtml(template, html, head), "utf8");
    }

    const notFound = render(NOT_FOUND_PRERENDER_PATH);
    await writeFile(
      path.join(distDir, "404.html"),
      injectHtml(template, notFound.html, notFound.head),
      "utf8",
    );

    const sitemapXml = buildSitemapXml(
      routes
        .filter((route) => route.includeInSitemap)
        .map((route) => ({
          loc: toAbsoluteUrl(route.path),
          lastmod: route.lastmod,
          changefreq: route.changefreq,
          priority: route.priority,
        })),
    );
    await writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");
    await writeFile(
      path.join(distDir, "robots.txt"),
      buildRobotsTxt(toAbsoluteUrl("/sitemap.xml")),
      "utf8",
    );

    console.log("sitemap.xml / robots.txt / 404.html を出力しました");
  } finally {
    await vite.close();
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
