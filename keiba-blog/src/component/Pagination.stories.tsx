import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Pagination from "./Pagination";

/**
 * UI設計: blog/list.md 等 — 一覧ページネーション（10件/ページ）
 */
const meta = {
  title: "Common/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "記事一覧のページ切り替え。1ページあたり最大10件（UI_design 各 list.md）。",
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationDemo({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1);
  return (
    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
  );
}

export const MultiplePages: Story = {
  name: "複数ページ",
  args: {
    page: 1,
    totalPages: 3,
    onChange: () => undefined,
  },
  render: () => <PaginationDemo totalPages={3} />,
};

export const HiddenWhenSingle: Story = {
  name: "1ページのみ（非表示）",
  args: {
    page: 1,
    totalPages: 1,
    onChange: () => undefined,
  },
};
