import type { Meta, StoryObj } from "@storybook/react-vite";
import BlogCard from "./BlogCard";
import type { Article } from "../utils/markdown";

const baseArticle: Article = {
  slug: "sample-article",
  category: "blog",
  frontMatter: {
    title: "サンプル記事タイトル",
    date: "2026-08-01",
    category: "blog",
    tags: ["馬券", "初心者"],
    description: "サンプル説明",
  },
  contentHtml: "<p>本文</p>",
};

/**
 * UI設計: blog/list.md — BlogCard
 * サムネイル / タイトル / 公開日 / カテゴリ / タグ
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
          "一覧用カード。サムネイル・タイトル・公開日・カテゴリ・タグを表示（UI_design/blog/list.md）。",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
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
