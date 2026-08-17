import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import BakenMonthlyPost from "./BakenMonthlyPost";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: profile/baken-monthly.md — 月次馬券成績 `/profile/baken-portfolio/{yearMonth}`
 */
const meta = {
  title: "Pages/Profile/Baken Monthly",
  component: BakenMonthlyPost,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "月次の馬券成績記事。サマリ・本文・券種・購入履歴（UI_design/profile/baken-monthly.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route
        path="/profile/baken-portfolio/:yearMonth"
        element={<BakenMonthlyPost />}
      />
    </Routes>
  ),
} satisfies Meta<typeof BakenMonthlyPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/profile/baken-portfolio/2025-08"],
  },
};

export const NotFoundMonth: Story = {
  name: "記事なし（404）",
  parameters: {
    initialEntries: ["/profile/baken-portfolio/1999-01"],
  },
};
