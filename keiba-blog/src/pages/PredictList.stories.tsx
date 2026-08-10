import type { Meta, StoryObj } from "@storybook/react-vite";
import PredictList from "./PredictList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/list.md — レース予想一覧 `/predict`
 */
const meta = {
  title: "Pages/Predict/List",
  component: PredictList,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/predict"],
    docs: {
      description: {
        component:
          "レース予想カテゴリの記事一覧。現状記事 0 件時は空状態（UI_design/predict/list.md）。",
      },
    },
  },
} satisfies Meta<typeof PredictList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（空状態の可能性あり）",
};
