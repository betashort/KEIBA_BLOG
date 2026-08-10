import type { Meta, StoryObj } from "@storybook/react-vite";
import NotFound from "./NotFound";
import { withAppLayout } from "../storybook/decorators";

/**
 * 画面設計: 記事未存在時の 404 相当表示
 */
const meta = {
  title: "Pages/NotFound",
  component: NotFound,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/missing"],
    docs: {
      description: {
        component: "お探しのページが見つからない場合の表示。",
      },
    },
  },
} satisfies Meta<typeof NotFound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
