import type { Meta, StoryObj } from "@storybook/react-vite";
import PredictList from "./PredictList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/list.md — レース予想一覧 `/race-predict`
 * 開催日カード（サムネ・日付・競馬場）＋ 10件/ページのページネーション
 */
const meta = {
  title: "Pages/Predict/List",
  component: PredictList,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/race-predict"],
    docs: {
      description: {
        component:
          "開催日ごとのレース予想ページを新しい順のカードで表示する（UI_design/predict/list.md）。",
      },
    },
  },
} satisfies Meta<typeof PredictList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "開催日カード",
};
