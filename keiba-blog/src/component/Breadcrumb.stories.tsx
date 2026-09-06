import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumb from "./Breadcrumb";

/**
 * UI設計: blog/article.md 等 — パンくずリスト
 */
const meta = {
  title: "Common/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "記事詳細などのパンくず。例: ホーム > ブログ > 記事タイトル（UI_design/blog/article.md）。",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BlogArticle: Story = {
  name: "ブログ記事",
  args: {
    items: [
      { label: "ホーム", path: "/" },
      { label: "ブログ", path: "/blog" },
      { label: "馬券の買い方" },
    ],
  },
};

export const StudyArticle: Story = {
  name: "競馬研究記事",
  args: {
    items: [
      { label: "ホーム", path: "/" },
      { label: "競馬研究", path: "/study" },
      { label: "予想研究ノート" },
    ],
  },
};

export const AnalysisArticle: Story = {
  name: "レース分析記事",
  args: {
    items: [
      { label: "ホーム", path: "/" },
      { label: "レース分析", path: "/analysis" },
      { label: "有馬記念 分析" },
    ],
  },
};

export const PredictArticle: Story = {
  name: "レース予想記事",
  args: {
    items: [
      { label: "ホーム", path: "/" },
      { label: "レース予想", path: "/predict" },
      { label: "日本ダービー 予想" },
    ],
  },
};
