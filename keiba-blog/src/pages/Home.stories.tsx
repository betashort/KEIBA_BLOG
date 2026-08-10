import type { Meta, StoryObj } from "@storybook/react-vite";
import Home from "./Home";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: home/home.md — ホーム `/`
 * 新着スライドショー ＋ カテゴリタブ（レース予想 / 競馬研究 / ブログ）最大5件
 */
const meta = {
  title: "Pages/Home",
  component: Home,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/"],
    docs: {
      description: {
        component:
          "サイトトップ。新着記事スライドと、タブ付きカテゴリ新着（最大5件・縦並び）（UI_design/home/home.md）。",
      },
    },
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
