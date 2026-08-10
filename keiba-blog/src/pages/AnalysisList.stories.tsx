import type { Meta, StoryObj } from "@storybook/react-vite";
import AnalysisList from "./AnalysisList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: analysis/list.md — レース分析一覧 `/analysis`
 * 新着カード縦並び一覧（blog/study と同型）＋ページネーション
 */
const meta = {
  title: "Pages/Analysis/List",
  component: AnalysisList,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/analysis"],
    docs: {
      description: {
        component:
          "レース分析カテゴリの新着カード一覧（縦並び・最大10件/ページ）（UI_design/analysis/list.md）。",
      },
    },
  },
} satisfies Meta<typeof AnalysisList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（記事あり）",
};
