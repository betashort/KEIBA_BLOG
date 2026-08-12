import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import PredictPost from "./PredictPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/article.md — レース予想記事 `/predict/{article_name}`
 */
const meta = {
  title: "Pages/Predict/Article",
  component: PredictPost,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "ブログ記事と同様。パンくずの親は「レース予想」（UI_design/predict/article.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/predict/:article_name" element={<PredictPost />} />
    </Routes>
  ),
} satisfies Meta<typeof PredictPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/predict/sample-predict"],
  },
};

export const NotFoundArticle: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/predict/does-not-exist"],
  },
};
