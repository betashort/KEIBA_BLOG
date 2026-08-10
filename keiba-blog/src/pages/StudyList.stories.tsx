import type { Meta, StoryObj } from "@storybook/react-vite";
import StudyList from "./StudyList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: study/list.md — 競馬研究一覧 `/study`
 * 縦並びカード＋ページネーション
 */
const meta = {
  title: "Pages/Study/List",
  component: StudyList,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/study"],
    docs: {
      description: {
        component:
          "研究カテゴリの新着カード一覧（縦並び・最大10件/ページ）（UI_design/study/list.md）。",
      },
    },
  },
} satisfies Meta<typeof StudyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（記事あり）",
};
