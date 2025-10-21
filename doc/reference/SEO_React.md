# Reactの静的サイトのSEO対策

1. [✅ 基本方針](#-基本方針)
   1. [❗React（クライアントレンダリング）だけだとSEOに弱い](#reactクライアントレンダリングだけだとseoに弱い)
   2. [🔄 対応策：静的HTMLを生成する](#-対応策静的htmlを生成する)
2. [🧩 SEO対策の具体的な方法](#-seo対策の具体的な方法)
   1. [① React Helmetでmetaタグを動的に設定する](#-react-helmetでmetaタグを動的に設定する)
      1. [インストール:](#インストール)
      2. [使用例:](#使用例)
   2. [② 検索エンジン向けの`robots.txt`と`sitemap.xml`を用意する](#-検索エンジン向けのrobotstxtとsitemapxmlを用意する)
      1. [`public/robots.txt`（ルートに設置）](#publicrobotstxtルートに設置)
      2. [`sitemap.xml`](#sitemapxml)
   3. [③ サイト構造をわかりやすくする](#-サイト構造をわかりやすくする)
   4. [④ サムネイル画像とOGP設定](#-サムネイル画像とogp設定)
   5. [⑤ パフォーマンス最適化（Core Web Vitals）](#-パフォーマンス最適化core-web-vitals)
   6. [⑥ Googleへの登録・分析](#-googleへの登録分析)
3. [🛠 静的ブログ構成の例](#-静的ブログ構成の例)
4. [🔚 まとめ](#-まとめ)


## ✅ 基本方針

### ❗React（クライアントレンダリング）だけだとSEOに弱い

GoogleなどはクライアントサイドのJavaScriptをある程度クロールできますが、**SSR（サーバーサイドレンダリング）や静的HTML生成**されたページに比べるとSEO効果が低いことが多いです。

### 🔄 対応策：静的HTMLを生成する

React + Viteなどを使っている場合、ビルド時に**静的なHTMLファイルを生成**するようにすればSEOにも強くなります。

---

## 🧩 SEO対策の具体的な方法

### ① React Helmetでmetaタグを動的に設定する

`react-helmet` を使って、各ページに適切な `<title>` や `<meta>` タグを設定します。

#### インストール:

```bash
npm install react-helmet
```

#### 使用例:

```jsx
import { Helmet } from "react-helmet";

function BlogPost({ title, description }) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Helmet>
      <h1>{title}</h1>
      {/* 本文 */}
    </>
  );
}
```

---

### ② 検索エンジン向けの`robots.txt`と`sitemap.xml`を用意する

#### `public/robots.txt`（ルートに設置）

```txt
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

#### `sitemap.xml`

記事一覧などを元に自動生成スクリプトを書くことも可能です。

---

### ③ サイト構造をわかりやすくする

* トップページから各記事へのリンクを配置
* パンくずリストを表示
* カテゴリ・タグ構造を導入

---

### ④ サムネイル画像とOGP設定

SNSシェアや検索結果の見栄え改善のため、`meta` タグに以下を追加：

```html
<meta property="og:image" content="https://yourdomain.com/images/ogp.jpg" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

---

### ⑤ パフォーマンス最適化（Core Web Vitals）

* 画像は`<img loading="lazy" />`で遅延読み込み
* Reactのコード分割（`React.lazy`）で初期読み込み軽量化
* Google Fontsの最適化（`display=swap` など）

---

### ⑥ Googleへの登録・分析

* Google Search Console にサイトマップ登録
* Google Analytics や GA4 を導入して解析

---

## 🛠 静的ブログ構成の例

```
public/
  images/
  robots.txt
  sitemap.xml
posts/
  2025-07-01-example.md
  2025-07-02-another.md
src/
  components/
    BlogList.jsx
    BlogPost.jsx
  App.jsx
  main.jsx
```

ビルド時にMarkdownからHTMLを生成する仕組みを組み込むことで、完全に静的なSEO対応ブログが可能です（例：`vite-plugin-mdx`, `markdown-to-jsx` など使用）。

---

## 🔚 まとめ

| SEO対策項目       | 実装方法                             |
| ------------- | -------------------------------- |
| metaタグの設定     | `react-helmet`でページごとに設定          |
| サイトマップ・robots | `public`フォルダに設置                  |
| OGP・SNS対策     | `<meta property="og:*">` をページに追加 |
| HTMLの事前生成     | Markdown→HTMLへのビルドスクリプトで静的化      |
| パフォーマンス改善     | 遅延読み込み、コード分割、画像最適化など             |
| Googleへの登録    | Search Consoleでsitemap登録、GA4で解析  |

---

ご希望があれば、以下も具体的に作成できます：

* Markdown記事からHTMLに変換するReactコンポーネント
* 自動でsitemap.xmlを生成するNodeスクリプト
* OGP対応の`react-helmet`テンプレート

必要なものがあれば教えてください！
