import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Header from "./Header";
import SideNav from "./SideNav";

/**
 * UI設計: common.md — SideNav（ドロワー）
 */
const meta = {
  title: "Common/SideNav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ハンバーガーから右側に開くドロワー型グローバルナビ。ホーム・各一覧・プロフィールへ遷移（UI_design/common.md）。",
      },
    },
  },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

function SideNavDemo({ initiallyOpen }: { initiallyOpen: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <div className="relative min-h-[320px] bg-gray-50">
      <Header
        navOpen={open}
        onMenuClick={() => setOpen((current) => !current)}
      />
      <SideNav open={open} onClose={() => setOpen(false)} />
      <p className="px-4 py-8 text-sm text-gray-600">
        背面コンテンツ（オーバーレイで暗転・スクロールロック）。
      </p>
    </div>
  );
}

export const Closed: Story = {
  name: "閉じた状態",
  args: {
    open: false,
    onClose: () => undefined,
  },
  render: () => <SideNavDemo initiallyOpen={false} />,
};

export const Open: Story = {
  name: "開いた状態",
  args: {
    open: true,
    onClose: () => undefined,
  },
  render: () => <SideNavDemo initiallyOpen />,
  parameters: {
    initialEntries: ["/blog"],
  },
};
