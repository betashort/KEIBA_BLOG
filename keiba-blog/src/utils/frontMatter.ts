import yaml from "js-yaml";

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** ブラウザ向け Front Matter 解析（gray-matter は Node の Buffer に依存するため不使用） */
export function parseFrontMatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(FRONT_MATTER_RE);
  if (!match) {
    return { data: {}, content: raw };
  }

  let data: Record<string, unknown> = {};
  try {
    const parsed = yaml.load(match[1]);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      data = parsed as Record<string, unknown>;
    }
  } catch {
    // YAML 不正時は本文のみ扱う
  }

  return { data, content: match[2] };
}
