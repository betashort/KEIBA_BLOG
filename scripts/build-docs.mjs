/**
 * doc/ の Markdown・YAML・JSON を doc-view/ の静的 HTML にする。
 * サーバは立てない。生成後は doc-view/index.html をブラウザで開く。
 *
 * docker compose exec node sh -c "cd keiba-blog && npm run docs:view"
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from '../keiba-blog/node_modules/marked/lib/marked.esm.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const docRoot = path.join(repoRoot, 'doc');
const outRoot = path.join(repoRoot, 'doc-view');
const assetSrc = path.join(scriptDir, 'doc-viewer');

const DOC_EXT = new Set(['.md', '.yaml', '.yml', '.json']);

const TOP_ORDER = [
  '01_requirement',
  '02_specification',
  '03_design',
  '04_detailed_design',
  'manual',
  'dev_env',
  'reference',
  'design-image-catalog',
  'design-emblem',
  'predict-output',
];

const FOLDER_LABELS = {
  '01_requirement': '要求仕様',
  '02_specification': '要件定義',
  '03_design': '設計',
  '04_detailed_design': '詳細設計',
  manual: 'マニュアル',
  dev_env: '開発環境',
  reference: 'リファレンス',
  'design-image-catalog': 'デザインカタログ',
  'design-emblem': 'エンブレム',
  'predict-output': '予想出力',
  UI_design: 'UI設計',
  assets: '素材',
  'baken-predict-format': '馬券予想フォーマット',
};

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function encodeHref(href) {
  const hashAt = href.indexOf('#');
  const pathPart = hashAt >= 0 ? href.slice(0, hashAt) : href;
  const hash = hashAt >= 0 ? href.slice(hashAt) : '';
  try {
    return encodeURI(pathPart) + hash;
  } catch {
    return href;
  }
}

function splitHref(href) {
  let pathPart = href.trim();
  let hash = '';
  let query = '';
  const hashAt = pathPart.indexOf('#');
  if (hashAt >= 0) {
    hash = pathPart.slice(hashAt);
    pathPart = pathPart.slice(0, hashAt);
  }
  const queryAt = pathPart.indexOf('?');
  if (queryAt >= 0) {
    query = pathPart.slice(queryAt);
    pathPart = pathPart.slice(0, queryAt);
  }
  return { path: pathPart, query, hash };
}

function isExternal(href) {
  return /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');
}

function outputRel(docRel) {
  const ext = path.posix.extname(docRel).toLowerCase();
  const htmlRel = ext ? docRel.slice(0, -ext.length) + '.html' : `${docRel}.html`;
  return htmlRel === 'README.html' ? 'index.html' : htmlRel;
}

function relativeUrl(fromFile, toFile) {
  const fromDir = path.posix.dirname(fromFile);
  const fromParts = fromDir === '.' ? [] : fromDir.split('/');
  const toParts = toFile.split('/');
  let shared = 0;
  while (shared < fromParts.length && fromParts[shared] === toParts[shared]) shared += 1;
  const parts = Array(fromParts.length - shared).fill('..');
  parts.push(...toParts.slice(shared));
  return parts.join('/') || path.posix.basename(toFile);
}

function resolveDocPath(fromDocRel, hrefPath) {
  const fromDir = path.posix.dirname(fromDocRel);
  const base = fromDir === '.' ? hrefPath : path.posix.join(fromDir, hrefPath);
  const resolved = path.posix.normalize(base);
  if (resolved === '.' || resolved.startsWith('../') || resolved.startsWith('/')) return null;
  return resolved;
}

function inlinePlain(tokens) {
  let text = '';
  for (const token of tokens ?? []) {
    if (token.type === 'text' || token.type === 'escape' || token.type === 'codespan') {
      text += token.text ?? '';
    } else if (token.type === 'html' || token.type === 'tag') {
      text += String(token.text ?? '').replace(/<[^>]*>/g, '');
    } else if (token.tokens) {
      text += inlinePlain(token.tokens);
    } else if (typeof token.text === 'string') {
      text += token.text;
    }
  }
  return text;
}

function slugify(text) {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'section';
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const state = {
  slugs: new Map(),
  currentDocRel: 'README.md',
  knownDocs: new Set(),
  warnings: [],
};

function uniqueSlug(text) {
  const base = slugify(text);
  const seen = state.slugs.get(base) ?? 0;
  state.slugs.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen}`;
}

function rewriteHref(href) {
  if (!href || href.startsWith('#')) return href;
  if (/^\s*javascript:/i.test(href)) return null;
  if (isExternal(href)) return href;

  const { path: hrefPath, query, hash } = splitHref(href);
  if (!hrefPath) return `${query}${hash}`;

  let resolved = resolveDocPath(state.currentDocRel, hrefPath.replace(/\\/g, '/'));
  if (!resolved) return href;
  resolved = resolved.replace(/\/+$/, '');

  const readme = `${resolved}/README.md`;
  if (!path.posix.extname(resolved) && state.knownDocs.has(readme)) resolved = readme;

  const ext = path.posix.extname(resolved).toLowerCase();
  const fromOut = path.posix.join('doc-view', outputRel(state.currentDocRel));
  if (!state.knownDocs.has(resolved)) {
    state.warnings.push(`${state.currentDocRel} → ${resolved}（ファイルがない）`);
  }
  const target = DOC_EXT.has(ext)
    ? path.posix.join('doc-view', outputRel(resolved))
    : path.posix.join('doc', resolved);
  return `${relativeUrl(fromOut, target)}${query}${hash}`;
}

const renderer = {
  heading({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const id = uniqueSlug(inlinePlain(tokens));
    return `<h${depth} id="${escapeHtml(id)}">${text}</h${depth}>\n`;
  },
  link({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const rewritten = rewriteHref(href);
    if (rewritten === null) return text;
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const external = isExternal(rewritten) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${escapeHtml(encodeHref(rewritten))}"${titleAttr}${external}>${text}</a>`;
  },
  image({ href, title, tokens, text }) {
    const alt = tokens ? inlinePlain(tokens) : (text ?? '');
    const rewritten = rewriteHref(href);
    if (rewritten === null) return escapeHtml(alt);
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${escapeHtml(encodeHref(rewritten))}" alt="${escapeHtml(alt)}"${titleAttr}>`;
  },
};

function pageHtml({ title, docRel, outRel, body }) {
  const depth = path.posix.dirname(outRel) === '.' ? 0 : path.posix.dirname(outRel).split('/').length;
  const asset = `${'../'.repeat(depth)}assets/`;
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · ドキュメント</title>
<link rel="stylesheet" href="${asset}style.css">
</head>
<body data-doc="${escapeHtml(outRel)}">
<header class="topbar">
  <button type="button" id="nav-toggle" aria-expanded="false" aria-controls="nav">目次</button>
  <a class="brand" href="${escapeHtml(relativeUrl(outRel, 'index.html'))}">ドキュメント</a>
  <form id="search-form" role="search">
    <input id="search" type="search" placeholder="検索" autocomplete="off" enterkeyhint="search">
    <div id="search-panel" hidden></div>
  </form>
</header>
<div class="layout">
  <nav id="nav" aria-label="ドキュメント"></nav>
  <div class="content-wrap">
    <article class="doc">
${body}
      <p class="source">正本 <code>doc/${escapeHtml(docRel)}</code></p>
    </article>
    <aside id="toc" aria-label="このページ"></aside>
  </div>
</div>
<script src="${asset}doc-data.js"></script>
<script src="${asset}viewer.js"></script>
</body>
</html>
`;
}

function plainPageBody(docRel, source) {
  const lang = path.posix.extname(docRel).slice(1).toLowerCase();
  return `<h1 id="file">${escapeHtml(path.posix.basename(docRel))}</h1>
<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(source)}</code></pre>
`;
}

function folderLabel(key) {
  return FOLDER_LABELS[key] ?? key;
}

function buildNav(pages) {
  const root = { children: [] };
  for (const page of pages) {
    if (page.outRel === 'index.html') continue;
    const parts = page.outRel.split('/');
    let node = root;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const key = parts[i];
      let group = node.children.find((child) => child.type === 'group' && child.key === key);
      if (!group) {
        group = { type: 'group', key, title: folderLabel(key), children: [] };
        node.children.push(group);
      }
      node = group;
    }
    node.children.push({ type: 'page', title: page.title, href: page.outRel });
  }
  sortNav(root.children, true);
  return [
    { type: 'page', title: pages.find((page) => page.outRel === 'index.html')?.title ?? 'ドキュメント', href: 'index.html' },
    ...root.children,
  ];
}

function sortNav(nodes, isTop) {
  const topIndex = (key) => {
    const index = TOP_ORDER.indexOf(key);
    return index === -1 ? TOP_ORDER.length : index;
  };
  const rank = (node) => {
    if (node.type === 'page' && /(^|\/)(README|index)\.html$/.test(node.href)) return 0;
    if (node.type === 'page') return 1;
    return 2;
  };
  nodes.sort((a, b) => {
    if (isTop && a.type === 'group' && b.type === 'group') {
      const order = topIndex(a.key) - topIndex(b.key);
      if (order !== 0) return order;
    }
    const byRank = rank(a) - rank(b);
    if (byRank !== 0) return byRank;
    return a.title.localeCompare(b.title, 'ja');
  });
  for (const node of nodes) {
    if (node.children) sortNav(node.children, false);
  }
}

async function walk(dir, rel = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const childPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(childPath, childRel));
    else files.push({ abs: childPath, rel: toPosix(childRel) });
  }
  return files;
}

async function main() {
  const files = await walk(docRoot);
  const knownDocs = new Set(files.map((file) => file.rel));
  const sources = files.filter((file) => DOC_EXT.has(path.posix.extname(file.rel).toLowerCase()));
  sources.sort((a, b) => a.rel.localeCompare(b.rel, 'ja'));

  state.knownDocs = knownDocs;
  const marked = new Marked({ renderer, gfm: true });
  const pages = [];

  await fs.rm(outRoot, { recursive: true, force: true });
  await fs.mkdir(path.join(outRoot, 'assets'), { recursive: true });

  for (const file of sources) {
    const source = await fs.readFile(file.abs, 'utf8');
    const ext = path.posix.extname(file.rel).toLowerCase();
    const outRel = outputRel(file.rel);
    let title = path.posix.basename(file.rel);
    let body;

    if (ext === '.md') {
      const tokens = marked.lexer(source);
      const heading = tokens.find((token) => token.type === 'heading');
      if (heading) title = inlinePlain(heading.tokens).trim() || title;
      state.slugs = new Map();
      state.currentDocRel = file.rel;
      body = marked.parser(tokens).replace(/<table(\s|>)/g, '<div class="table-wrap"><table$1').replace(/<\/table>/g, '</table></div>');
    } else {
      title = path.posix.basename(file.rel);
      body = plainPageBody(file.rel, source.replace(/^\uFEFF/, ''));
    }

    pages.push({ title, docRel: file.rel, outRel, text: stripTags(body) });
    const html = pageHtml({ title, docRel: file.rel, outRel, body });
    const dest = path.join(outRoot, ...outRel.split('/'));
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html, 'utf8');
  }

  const nav = buildNav(pages);
  const search = pages.map((page) => ({ title: page.title, href: page.outRel, text: page.text }));
  const data = `window.DOC_NAV = ${JSON.stringify(nav)};\nwindow.DOC_SEARCH = ${JSON.stringify(search).replace(/</g, '\\u003c')};\n`;
  await fs.writeFile(path.join(outRoot, 'assets', 'doc-data.js'), data, 'utf8');
  await fs.copyFile(path.join(assetSrc, 'style.css'), path.join(outRoot, 'assets', 'style.css'));
  await fs.copyFile(path.join(assetSrc, 'viewer.js'), path.join(outRoot, 'assets', 'viewer.js'));

  const uniqueWarnings = [...new Set(state.warnings)];
  console.log(`${pages.length} ページを doc-view/ に書き出しました。`);
  console.log('doc-view/index.html をブラウザで開いてください。');
  if (uniqueWarnings.length) {
    console.log(`リンク先がない参照: ${uniqueWarnings.length} 件`);
    for (const warning of uniqueWarnings) console.log(`  ${warning}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
