import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import AnalysisPost from "./AnalysisPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: analysis/article.md — レース分析記事 `/analysis/{article_name}`
 * 上部にレース名・レース情報、本文は Markdown
 */
const meta = {
  title: "Pages/Analysis/Article",
  component: AnalysisPost,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "対象レースの分析記事。レース名・レース情報を上部に表示（UI_design/analysis/article.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/analysis/:article_name" element={<AnalysisPost />} />
    </Routes>
  ),
} satisfies Meta<typeof AnalysisPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "レース名・情報あり",
  parameters: {
    initialEntries: ["/analysis/sample-race"],
  },
};

export const NotFoundArticle: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/analysis/does-not-exist"],
  },
};
