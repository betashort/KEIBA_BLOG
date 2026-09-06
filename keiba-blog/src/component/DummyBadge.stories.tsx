import type { Meta, StoryObj } from "@storybook/react-vite";
import DummyBadge from "./DummyBadge";

/**
 * ダミーデータであることを示すラベル
 */
const meta = {
  title: "Common/DummyBadge",
  component: DummyBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "ダミーデータを表示している画面・項目に付けるラベル。",
      },
    },
  },
} satisfies Meta<typeof DummyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
