# OGP

1. [OGPとは](#ogpとは)
   1. [🔍 具体的には何ができる？](#-具体的には何ができる)
   2. [OGPの主なタグ（HTMLの`<head>`内に記述）](#ogpの主なタグhtmlのhead内に記述)
   3. [🖼 表示例](#-表示例)
   4. [✅ なぜ重要？](#-なぜ重要)
2. [記事ごとにHTMLを生成して OGP を埋め込む方法](#記事ごとにhtmlを生成して-ogp-を埋め込む方法)
3. [Markdown から自動生成する仕組みを導入する方法](#markdown-から自動生成する仕組みを導入する方法)
   1. [Markdown例](#markdown例)
   2. [🔧 HTML生成スクリプト（Nodeなど）](#-html生成スクリプトnodeなど)

## OGPとは

OGPとは **Open Graph Protocol（オープン・グラフ・プロトコル）** の略で、
WebページがSNS（Twitter、Facebook、LINEなど）でシェアされたときに、**どのように表示されるかを制御するための仕組み**です。

---

### 🔍 具体的には何ができる？

たとえば、あなたのブログ記事をSNSでシェアしたときに：

* サムネイル画像
* タイトル
* 説明文（ディスクリプション）
* URL

などを **意図したとおりに表示**することができます。

---

### OGPの主なタグ（HTMLの`<head>`内に記述）

```html
<meta property="og:title" content="記事のタイトル" />
<meta property="og:description" content="記事の説明文" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="サイト名" />
```

```html
  <!-- Twitterカード（任意） -->
  <meta name="twitter:card" content="summary_large_image" />
```

---

### 🖼 表示例

たとえばブログ記事をFacebookやX（旧Twitter）に貼ったとき、次のようなカード形式になります：

```
[ サムネイル画像 ]
記事タイトル
説明文
example.com
```

---

### ✅ なぜ重要？

* 見た目が良くなる → クリック率アップ
* 内容が伝わりやすい → ユーザーに信頼感
* SEOにもプラスになることがある

---

## 記事ごとにHTMLを生成して OGP を埋め込む方法

もしあなたのブログ記事が Markdown から生成されるなら、
**Markdown → HTML 変換時に OGP タグも埋め込む** ようにします。


## Markdown から自動生成する仕組みを導入する方法

もしブログ記事を Markdown で管理している場合、
`frontmatter` に OGP情報を記載し、それをHTML生成時に埋め込むようにすれば自動化できます。

### Markdown例

```markdown
---
title: スピード指数の解説
description: 競馬のスピード指数の意味と算出方法を解説します。
image: /images/post1.jpg
date: 2025-08-10

---

# スピード指数の解説
本文...
```

### 🔧 HTML生成スクリプト（Nodeなど）

Viteビルド前に `scripts/generate-html.js` のようなスクリプトを実行して
OGPタグ入りHTMLを `dist/blog/` に出力します。

```js
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";

const posts = fs.readdirSync("./posts");

for (const file of posts) {
  const md = fs.readFileSync(`./posts/${file}`, "utf8");
  const { data, content } = matter(md);
  const html = marked(content);

  const page = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>${data.title} | 競馬ブログ</title>
    <meta property="og:title" content="${data.title}" />
    <meta property="og:description" content="${data.description}" />
    <meta property="og:image" content="https://yourdomain.com${data.image}" />
    <meta property="og:url" content="https://yourdomain.com/blog/${file.replace('.md','.html')}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="競馬ブログ" />
  </head>
  <body>
    <div id="root">${html}</div>
  </body>
  </html>
  `;

  fs.writeFileSync(`./dist/blog/${file.replace(".md", ".html")}`, page);
}
```