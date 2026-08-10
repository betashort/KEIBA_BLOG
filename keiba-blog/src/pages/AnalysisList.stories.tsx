import type { Meta, StoryObj } from "@storybook/react-vite";
import AnalysisList from "./AnalysisList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: analysis/list.md — レース分析一覧 `/analysis`
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
          "レース分析カテゴリの記事一覧。現状記事 0 件時は空状態（UI_design/analysis/list.md）。",
      },
    },
  },
} satisfies Meta<typeof AnalysisList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（空状態の可能性あり）",
};
