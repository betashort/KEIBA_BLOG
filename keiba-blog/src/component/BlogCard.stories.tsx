import type { Meta, StoryObj } from "@storybook/react-vite";
import BlogCard from "./BlogCard";
import type { Article } from "../utils/markdown";

const baseArticle: Article = {
  slug: "sample-article",
  category: "blog",
  frontMatter: {
    title: "ダミー サンプル記事タイトル",
    date: "2026-08-01",
    category: "blog",
    tags: ["馬券", "初心者"],
    description: "ダミー。ホームのタブ一覧では抜粋として表示される。",
  },
  contentHtml: "<p>本文</p>",
};

/**
 * UI設計: blog/list.md — BlogCard（縦並び一覧用・横並びカード）
 */
const meta = {
  title: "Common/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "一覧用カード。サムネ・タイトル・公開日・タグを横並びに表示（UI_design/blog/list.md）。",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl border-t border-b border-gray-200">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithThumbnail: Story = {
  name: "サムネイルあり",
  args: {
    article: {
      ...baseArticle,
      frontMatter: {
        ...baseArticle.frontMatter,
        thumbnail: "https://placehold.co/640x360/e5e7eb/6b7280?text=Thumbnail",
      },
    },
  },
};

export const WithoutThumbnail: Story = {
  name: "サムネイルなし（プレースホルダ）",
  args: {
    article: baseArticle,
  },
};

export const WithExcerpt: Story = {
  name: "抜粋あり（ホーム用）",
  args: {
    showExcerpt: true,
    article: {
      ...baseArticle,
      frontMatter: {
        ...baseArticle.frontMatter,
        thumbnail: "https://placehold.co/640x360/e5e7eb/6b7280?text=Thumbnail",
      },
    },
  },
};

export const WithoutTags: Story = {
  name: "タグなし",
  args: {
    article: {
      ...baseArticle,
      frontMatter: {
        ...baseArticle.frontMatter,
        tags: undefined,
      },
    },
  },
};

export const StudyCategory: Story = {
  name: "競馬研究カテゴリ",
  args: {
    article: {
      ...baseArticle,
      category: "study",
      frontMatter: {
        ...baseArticle.frontMatter,
        category: "study",
        title: "競馬予想の研究ノート",
        tags: ["研究"],
      },
    },
  },
};
