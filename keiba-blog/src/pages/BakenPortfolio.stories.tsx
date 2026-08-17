import type { Meta, StoryObj } from "@storybook/react-vite";
import BakenPortfolio from "./BakenPortfolio";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: profile/baken-portfolio.md — 馬券ポートフォリオ `/profile/baken-portfolio`
 * 全体サマリ・年月別グラフ・券種別分析・購入履歴。年月は月次記事へリンク
 */
const meta = {
  title: "Pages/Profile/Baken Portfolio",
  component: BakenPortfolio,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/profile/baken-portfolio"],
    docs: {
      description: {
        component:
          "月次記事から集計した馬券成績。収支・的中率・回収率、券種別分析、購入履歴。年月から月次記事へ（UI_design/profile/baken-portfolio.md）。",
      },
    },
  },
} satisfies Meta<typeof BakenPortfolio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
