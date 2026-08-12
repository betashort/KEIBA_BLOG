import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import AibaDiary from "./AibaDiary";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: profile/aiba-diary.md — 愛馬日記 `/profile/hitokuchi-portfolio/{bamei}`
 */
const meta = {
  title: "Pages/Profile/Aiba Diary",
  component: AibaDiary,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    docs: {
      description: {
        component:
          "出資馬ごとの日記・観戦記。パンくず・馬情報・本文・写真・イベント（UI_design/profile/aiba-diary.md）。",
      },
    },
  },
  render: () => (
    <Routes>
      <Route path="/profile/hitokuchi-portfolio/:bamei" element={<AibaDiary />} />
    </Routes>
  ),
} satisfies Meta<typeof AibaDiary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/サンプルスター"],
  },
};

export const FemaleHorse: Story = {
  name: "牝馬",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/テストローズ"],
  },
};

export const NotFoundHorse: Story = {
  name: "馬なし（404）",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/does-not-exist"],
  },
};
