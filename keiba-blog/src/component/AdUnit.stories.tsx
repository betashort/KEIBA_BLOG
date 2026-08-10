import type { Meta, StoryObj } from "@storybook/react-vite";
import AdUnit from "./AdUnit";

/**
 * UI設計: common.md — AdUnit（CLS 抑制のため領域確保）
 */
const meta = {
  title: "Common/AdUnit",
  component: AdUnit,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "広告枠。読み込み前に領域を確保し CLS を抑制する（UI_design/common.md）。",
      },
    },
  },
} satisfies Meta<typeof AdUnit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSlot: Story = {
  name: "スロット指定",
  args: {
    slot: "article-top",
  },
};
