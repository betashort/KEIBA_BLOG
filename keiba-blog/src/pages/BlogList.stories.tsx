import type { Meta, StoryObj } from "@storybook/react-vite";
import BlogList from "./BlogList";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: blog/list.md — ブログ一覧 `/blog`
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
          "ブログカテゴリの記事を新着順で一覧表示。BlogCard × N + AdUnit（UI_design/blog/list.md）。",
      },
    },
  },
} satisfies Meta<typeof BlogList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "通常（記事あり）",
};
