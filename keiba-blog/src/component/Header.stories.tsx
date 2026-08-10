import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "./Header";

/**
 * UI設計: common.md — Header（グローバルナビ）
 * ナビ: ブログ / 競馬研究 / レース分析 / レース予想 / プロフィール
 */
const meta = {
  title: "Common/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "全画面共通の Header。サイトロゴとグローバルナビを表示する（UI_design/common.md）。",
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    initialEntries: ["/"],
  },
};

export const BlogActive: Story = {
  name: "ブログがアクティブ",
  parameters: {
    initialEntries: ["/blog"],
  },
};

export const StudyActive: Story = {
  name: "競馬研究がアクティブ",
  parameters: {
    initialEntries: ["/study"],
  },
};

export const AnalysisActive: Story = {
  name: "レース分析がアクティブ",
  parameters: {
    initialEntries: ["/analysis"],
  },
};

export const PredictActive: Story = {
  name: "レース予想がアクティブ",
  parameters: {
    initialEntries: ["/predict"],
  },
};

export const ProfileActive: Story = {
  name: "プロフィールがアクティブ",
  parameters: {
    initialEntries: ["/profile"],
  },
};
