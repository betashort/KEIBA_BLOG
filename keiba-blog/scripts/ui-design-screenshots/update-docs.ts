import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  SCREENSHOT_TARGETS,
  UI_DESIGN_ROOT,
  type ScreenshotEntry,
} from "./manifest.ts";

const MARKER_BEGIN = "<!-- ui-design-screenshot:begin -->";
const MARKER_END = "<!-- ui-design-screenshot:end -->";
const WIREFRAME_HEADING = "**ワイヤーフレーム**";

function docFilePath(repoRoot: string, docPath: string): string {
  return path.join(repoRoot, UI_DESIGN_ROOT, docPath);
}

function renderScreenshotBlock(entries: ScreenshotEntry[]): string {
  const images = entries
    .map(
      (entry) =>
        `![${entry.label}（Storybook）](./${entry.filename})`,
    )
    .join("\n\n");

  return [
    MARKER_BEGIN,
    "",
    "**実装スクリーンショット**（Storybook 自動撮影）",
    "",
    images,
    "",
    MARKER_END,
  ].join("\n");
}

function replaceMarkedBlock(content: string, block: string): string {
  const pattern = new RegExp(
    `${escapeRegExp(MARKER_BEGIN)}[\\s\\S]*?${escapeRegExp(MARKER_END)}`,
    "m",
  );

  if (pattern.test(content)) {
    return content.replace(pattern, block);
  }

  return content;
}

function insertAfterWireframe(content: string, block: string): string {
  const wireframeIndex = content.indexOf(WIREFRAME_HEADING);
  if (wireframeIndex === -1) {
    throw new Error("ワイヤーフレーム見出しが見つかりません");
  }

  const fenceStart = content.indexOf("```", wireframeIndex);
  if (fenceStart === -1) {
    throw new Error("ワイヤーフレームのコードブロックが見つかりません");
  }

  const fenceEnd = content.indexOf("```", fenceStart + 3);
  if (fenceEnd === -1) {
    throw new Error("ワイヤーフレームのコードブロックが閉じられていません");
  }

  const insertAt = fenceEnd + 3;
  return `${content.slice(0, insertAt)}\n\n${block}\n${content.slice(insertAt)}`;
}

function insertBeforeHeading(content: string, heading: string, block: string): string {
  const index = content.indexOf(heading);
  if (index === -1) {
    throw new Error(`見出しが見つかりません: ${heading}`);
  }

  return `${content.slice(0, index)}${block}\n\n${content.slice(index)}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function updateDesignDocs(repoRoot: string): Promise<void> {
  for (const target of SCREENSHOT_TARGETS) {
    const filePath = docFilePath(repoRoot, target.docPath);
    const original = await readFile(filePath, "utf8");
    const entries = target.kind === "page" ? [target.entry] : target.entries;
    const block = renderScreenshotBlock(entries);

    let updated = replaceMarkedBlock(original, block);

    if (updated === original) {
      updated =
        target.kind === "page"
          ? insertAfterWireframe(original, block)
          : insertBeforeHeading(original, target.insertBefore, block);
    }

    if (updated !== original) {
      await writeFile(filePath, updated, "utf8");
      console.log(`  updated: ${path.relative(repoRoot, filePath)}`);
    }
  }
}
