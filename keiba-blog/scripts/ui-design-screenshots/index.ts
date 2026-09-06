import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { captureScreenshots } from "./capture.ts";
import { startStaticServer } from "./static-server.ts";
import { updateDesignDocs } from "./update-docs.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEIBA_BLOG_ROOT = path.resolve(__dirname, "../..");
const REPO_ROOT = path.resolve(KEIBA_BLOG_ROOT, "..");
const STORYBOOK_STATIC = path.join(KEIBA_BLOG_ROOT, "storybook-static");
const DEFAULT_PORT = 6010;

async function isStorybookReachable(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/index.json`);
    return response.ok;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const envUrl = process.env.STORYBOOK_URL;
  let baseUrl = envUrl;
  let closeServer: (() => Promise<void>) | undefined;

  console.log("UI設計スクリーンショット更新を開始します…");

  if (!baseUrl) {
    const devUrl = "http://127.0.0.1:6006";
    if (await isStorybookReachable(devUrl)) {
      baseUrl = devUrl;
      console.log(`  Storybook 開発サーバーを利用: ${baseUrl}`);
    }
  }

  if (!baseUrl) {
    console.log("  Storybook をビルドしています…");
    execSync("npm run build-storybook", {
      cwd: KEIBA_BLOG_ROOT,
      stdio: "inherit",
    });

    const server = await startStaticServer(STORYBOOK_STATIC, DEFAULT_PORT);
    baseUrl = server.url;
    closeServer = server.close;
    console.log(`  静的 Storybook を起動: ${baseUrl}`);
  }

  try {
    console.log("  Playwright でスクリーンショットを撮影…");
    await captureScreenshots({
      baseUrl,
      repoRoot: REPO_ROOT,
    });

    console.log("  UI設計書を更新…");
    await updateDesignDocs(REPO_ROOT);

    console.log("完了しました。");
  } finally {
    if (closeServer) {
      await closeServer();
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
