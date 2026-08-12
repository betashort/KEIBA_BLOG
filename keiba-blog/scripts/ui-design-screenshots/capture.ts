import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import {
  DEFAULT_VIEWPORT,
  SCREENSHOT_TARGETS,
  UI_DESIGN_ROOT,
  type ScreenshotEntry,
  type Viewport,
} from "./manifest.ts";

export type CaptureOptions = {
  baseUrl: string;
  repoRoot: string;
  viewport?: Viewport;
};

function storyUrl(baseUrl: string, storyId: string): string {
  return `${baseUrl}/iframe.html?id=${storyId}&viewMode=story`;
}

function screenshotPath(repoRoot: string, docPath: string, filename: string): string {
  return path.join(repoRoot, UI_DESIGN_ROOT, path.dirname(docPath), filename);
}

function collectEntries(): ScreenshotEntry[] {
  return SCREENSHOT_TARGETS.flatMap((target) =>
    target.kind === "page" ? [target.entry] : target.entries,
  );
}

export async function captureScreenshots({
  baseUrl,
  repoRoot,
  viewport = DEFAULT_VIEWPORT,
}: CaptureOptions): Promise<void> {
  const entries = collectEntries();
  const browser: Browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const entry of entries) {
      const outputPath = screenshotPath(
        repoRoot,
        findDocPathForEntry(entry),
        entry.filename,
      );
      await mkdir(path.dirname(outputPath), { recursive: true });

      await page.goto(storyUrl(baseUrl, entry.storyId), {
        waitUntil: "networkidle",
      });
      await page.waitForSelector("#storybook-root", { timeout: 30_000 });
      await page.screenshot({ path: outputPath, fullPage: true });
      console.log(`  captured: ${path.relative(repoRoot, outputPath)}`);
    }
  } finally {
    await browser.close();
  }
}

function findDocPathForEntry(entry: ScreenshotEntry): string {
  for (const target of SCREENSHOT_TARGETS) {
    if (target.kind === "page" && target.entry.storyId === entry.storyId) {
      return target.docPath;
    }
    if (target.kind === "common") {
      const match = target.entries.find((item) => item.storyId === entry.storyId);
      if (match) {
        return target.docPath;
      }
    }
  }
  throw new Error(`docPath not found for story: ${entry.storyId}`);
}
