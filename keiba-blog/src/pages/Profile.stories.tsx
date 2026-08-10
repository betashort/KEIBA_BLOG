import type { Meta, StoryObj } from "@storybook/react-vite";
import Profile from "./Profile";
import { withAppLayout } from "../storybook/decorators";

/**
 * UI設計: profile/profile.md — プロフィール `/profile`
 */
const meta = {
  title: "Pages/Profile",
  component: Profile,
  tags: ["autodocs"],
  decorators: [withAppLayout],
  parameters: {
    initialEntries: ["/profile"],
    docs: {
      description: {
        component:
          "運営者の自己紹介とサイト概要（UI_design/profile/profile.md）。",
      },
    },
  },
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
