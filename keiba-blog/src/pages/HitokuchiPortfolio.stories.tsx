import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";
import HitokuchiPortfolio from "./HitokuchiPortfolio";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: profile/hitokuchi-portfolio.md — 一口馬主ポートフォリオ `/profile/hitokuchi-portfolio`
 * タブ（出資馬 / 分析）＋ クラス別 8×2 マトリクス。馬名リンクは愛馬日記へ
 */
const meta = {
  title: "Pages/Profile/Hitokuchi Portfolio",
  component: HitokuchiPortfolio,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/profile/hitokuchi-portfolio"],
    docs: {
      description: {
        component:
          "出資馬をクラス別マトリクスで表示。牡馬は青・牝馬は赤。分析タブはダミー（UI_design/profile/hitokuchi-portfolio.md）。",
      },
    },
  },
} satisfies Meta<typeof HitokuchiPortfolio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "出資馬タブ",
};

export const Analysis: Story = {
  name: "分析タブ",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole("tab", { name: "分析" }));
  },
};
