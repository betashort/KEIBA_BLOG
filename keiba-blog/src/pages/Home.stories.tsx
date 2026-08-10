import type { Meta, StoryObj } from "@storybook/react-vite";
import Home from "./Home";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: home/home.md — ホーム `/`
 * サイトタイトル・説明・各セクション導線
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
          "サイトトップ。ブログ・研究・レース分析・レース予想・プロフィールへの導線（UI_design/home/home.md）。",
      },
    },
  },
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
