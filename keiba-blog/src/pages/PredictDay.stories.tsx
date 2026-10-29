import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import PredictDay from "./PredictDay";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: predict/day.md — レース予想ページ `/race-predict/{YYYYMMDD}`
 * その日の競馬場タブと、レースごとの予想印・買い目
 */
const meta = {
  title: "Pages/Predict/Day",
  component: PredictDay,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "指定した開催日の競馬場・レースごとの予想印と買い目（UI_design/predict/day.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/race-predict/:date" element={<PredictDay />} />
    </Routes>
  ),
} satisfies Meta<typeof PredictDay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "開催日の予想印",
  parameters: {
    initialEntries: ["/race-predict/20250719"],
  },
};

export const NotFoundDay: Story = {
  name: "開催日なし（404）",
  parameters: {
    initialEntries: ["/race-predict/19990101"],
  },
};
