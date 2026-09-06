import type { Meta, StoryObj } from "@storybook/react-vite";
import PredictList from "./PredictList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/list.md — レース予想一覧 `/predict`
 * 年・開催日・競馬場タブ。レース行に予想印・買い目。詳細記事は任意リンク
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
          "開催日・競馬場単位のレース予想一覧。予想印（◎〇▲△★）・買い目・詳細記事リンク（UI_design/predict/list.md）。",
      },
    },
  },
} satisfies Meta<typeof PredictList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "開催日・場のレース一覧",
};
