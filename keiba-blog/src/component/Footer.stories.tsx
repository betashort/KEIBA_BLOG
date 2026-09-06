import type { Meta, StoryObj } from "@storybook/react-vite";
import Footer from "./Footer";

/**
 * UI設計: common.md — Footer
 */
const meta = {
  title: "Common/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "全画面共通の Footer。コピーライト（サイト名・年号）を表示する（UI_design/common.md）。",
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
