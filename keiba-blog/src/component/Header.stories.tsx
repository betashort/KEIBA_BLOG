import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Header from "./Header";

/**
 * UI設計: common.md — Header（ロゴ＋ハンバーガー）
 */
const meta = {
  title: "Common/Header",
  component: Header,
  tags: ["autodocs"],
  args: {
    onMenuClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        component:
          "全画面共通の Header。サイトロゴとハンバーガーボタンのみ。ナビは SideNav（UI_design/common.md）。",
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navOpen: false,
  },
  parameters: {
    initialEntries: ["/"],
  },
};

export const MenuOpen: Story = {
  name: "メニュー開（aria-expanded）",
  args: {
    navOpen: true,
  },
};
