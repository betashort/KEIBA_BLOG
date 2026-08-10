import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import StudyPost from "./StudyPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: study/article.md — 競馬研究記事 `/study/{article_name}`
 */
const meta = {
  title: "Pages/Study/Article",
  component: StudyPost,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "ブログ記事と同様。パンくずの親は「競馬研究」（UI_design/study/article.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/study/:article_name" element={<StudyPost />} />
    </Routes>
  ),
} satisfies Meta<typeof StudyPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/study/keiba-predict"],
  },
};

export const NotFoundArticle: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/study/does-not-exist"],
  },
};
