const HEAD_TAG_RE =
  /<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*\/?>|<base\b[^>]*\/?>/gi;

/** renderToString 結果から title/meta を抜き、#root 外の head へ移す */
export function hoistHelmetTags(appHtml: string): {
  html: string;
  head: string;
} {
  const tags: string[] = [];
  const html = appHtml.replace(HEAD_TAG_RE, (tag) => {
    tags.push(tag);
    return "";
  });
  return { html, head: tags.join("") };
}
