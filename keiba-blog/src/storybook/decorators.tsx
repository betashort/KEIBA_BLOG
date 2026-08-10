import type { Decorator } from "@storybook/react-vite";
import AppShell from "../component/AppShell";

/** 画面設計書の共通レイアウト: Header + SideNav + Main + Footer */
export const withAppLayout: Decorator = (Story) => (
  <AppShell>
    <Story />
  </AppShell>
);
