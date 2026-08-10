import type { Meta, StoryObj } from "@storybook/react-vite";
import BlogList from "./BlogList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: blog/list.md — ブログ一覧 `/blog`
 * 縦並びカード（サムネ・タイトル・公開日・タグ）＋ 10件/ページのページネーション
 */
const meta = {
  title: "Pages/Blog/List",
  component: BlogList,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/blog"],
    docs: {
      description: {
        component:
          "ブログカテゴリの新着カード一覧（縦並び・最大10件/ページ）（UI_design/blog/list.md）。",
      },
    },
  },
} satisfies Meta<typeof BlogList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（記事あり）",
};
