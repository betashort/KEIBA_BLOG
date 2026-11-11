import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import PredictPost from "./PredictPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/article.md — レース予想詳細 `/race-predict/{YYYYMMDD}/{venueSlug}-{number}R`
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
          "パンくず、印・買い目、注目馬、出馬表、本文（UI_design/predict/article.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/race-predict/:date/:race" element={<PredictPost />} />
    </Routes>
  ),
} satisfies Meta<typeof PredictPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/race-predict/20250719/kokura-11R"],
  },
};

export const NotFoundArticle: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/race-predict/20250719/kyoto-11R"],
  },
};
