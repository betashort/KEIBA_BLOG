import type { Meta, StoryObj } from "@storybook/react-vite";
import { Route, Routes } from "react-router-dom";
import { userEvent, within } from "storybook/test";
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
          "タブ（紹介 / 日記 / 血統 / 分析）。紹介は写真・プロフィール・レース成績。日記は目次と観戦記（UI_design/profile/aiba-diary.md）。",
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
  name: "紹介タブ",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/flashing-ruby"],
  },
};

export const Diary: Story = {
  name: "日記タブ",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/flashing-ruby"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("tab", { name: "日記" }));
  },
};

export const Analysis: Story = {
  name: "分析タブ",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/flashing-ruby"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("tab", { name: "分析" }));
  },
};

export const Pedigree: Story = {
  name: "血統タブ",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/flashing-ruby"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("tab", { name: "血統" }));
  },
};

export const NotFoundHorse: Story = {
  name: "馬なし（404）",
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio/does-not-exist"],
  },
};
