import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import BlogPost from "./BlogPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: blog/article.md — ブログ記事 `/blog/{article_name}`
 */
const meta = {
  title: "Pages/Blog/Article",
  component: BlogPost,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "パンくず・タイトル・公開日・カテゴリ・タグ・本文・広告枠（UI_design/blog/article.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/blog/:article_name" element={<BlogPost />} />
    </Routes>
  ),
} satisfies Meta<typeof BlogPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/blog/howtobet-baken"],
  },
};

export const NotFoundArticle: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/blog/does-not-exist"],
  },
};
