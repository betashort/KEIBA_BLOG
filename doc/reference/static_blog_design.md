## 🏗️ 全体構成（フォルダ構成）

```bash
my-blog/
├─ public/
│  └─ posts/
│     ├─ first-post.md
│     ├─ second-post.md
│     └─ ...
├─ src/
│  ├─ components/
│  │  ├─ BlogList.tsx
│  │  ├─ BlogCard.tsx
│  │  └─ BlogPost.tsx
│  ├─ pages/
│  │  ├─ Blog.tsx
│  │  └─ BlogPostPage.tsx
│  ├─ utils/
│  │  └─ markdown.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ types.ts
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

---

## ⚙️ 必要なライブラリ

Markdown → HTML変換に以下を使用します。

```bash
npm install gray-matter marked
```

* **gray-matter**：Markdown内のFrontMatter（タイトルや日付などのメタ情報）を抽出
* **marked**：Markdown → HTML変換ライブラリ

---

## 🧩 utils/markdown.ts（Markdown読み込み・変換）

```ts
import matter from "gray-matter";
import { marked } from "marked";

export interface PostData {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export async function loadMarkdownFiles(): Promise<PostData[]> {
  const postFiles = import.meta.glob("/public/posts/*.md", { as: "raw" });
  const posts: PostData[] = [];

  for (const path in postFiles) {
    const slug = path.split("/").pop()?.replace(".md", "") || "";
    const raw = await postFiles[path]();
    const { data, content } = matter(raw);
    const html = marked.parse(content);

    posts.push({
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      content: html,
    });
  }

  // 日付順で並び替え
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}
```

---

## 🧱 BlogCard.tsx（一覧カード）

```tsx
import React from "react";
import { Link } from "react-router-dom";
import { PostData } from "../utils/markdown";

interface Props {
  post: PostData;
}

const BlogCard: React.FC<Props> = ({ post }) => {
  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition">
      <Link to={`/blog/${post.slug}`}>
        <h2 className="text-xl font-bold">{post.title}</h2>
        <p className="text-sm text-gray-500">{post.date}</p>
      </Link>
    </div>
  );
};

export default BlogCard;
```

---

## 📃 BlogList.tsx（記事一覧）

```tsx
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { loadMarkdownFiles, PostData } from "../utils/markdown";

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    loadMarkdownFiles().then(setPosts);
  }, []);

  return (
    <div className="grid gap-4 p-4">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default BlogList;
```

---

## 📰 BlogPost.tsx（記事ページ）

```tsx
import React from "react";
import { useParams } from "react-router-dom";
import { loadMarkdownFiles, PostData } from "../utils/markdown";

const BlogPost: React.FC = () => {
  const { article_name } = useParams<{ article_name: string }>();
  const [post, setPost] = React.useState<PostData | null>(null);

  React.useEffect(() => {
    loadMarkdownFiles().then((posts) => {
      const found = posts.find((p) => p.slug === article_name);
      setPost(found || null);
    });
  }, [article_name]);

  if (!post) return <div className="p-4">記事が見つかりません。</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-4">{post.date}</p>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default BlogPost;
```

---

## 🧭 ページルーティング設定（App.tsx）

```tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:article_name" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
```

---

## 🪶 Markdownサンプル（`public/posts/first-post.md`）

```md
---
title: Reactでブログを作る
date: 2025-10-30
---

# ReactでMarkdownブログを作る方法

この記事では、ReactとViteを使ってMarkdownベースの静的ブログを構築する方法を紹介します。
```

---

## 💡 補足

* Markdownは `public/posts` に置くことで、ビルド後も参照可能。
* `vite build` 時に静的ファイルが `/dist/posts` にコピーされます。
* Markdownは全て事前にHTML化され、**クライアントサイドで静的に表示可能**。

---

## ✅ 拡張案

* タグ機能を付けたい場合 → FrontMatter に `tags: [“React”, “ブログ”]` を追加
* 目次生成 → `marked-toc`などを組み込み可能
* 検索機能 → Fuse.js を組み合わせ

