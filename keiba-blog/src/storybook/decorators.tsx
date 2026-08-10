import type { Decorator } from "@storybook/react-vite";
import Header from "../component/Header";
import Footer from "../component/Footer";

/** 画面設計書の共通レイアウト: Header + Main + Footer */
export const withAppLayout: Decorator = (Story) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <Story />
    </main>
    <Footer />
  </div>
);
