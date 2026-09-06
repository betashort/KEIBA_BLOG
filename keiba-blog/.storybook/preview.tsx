import type { Preview } from "@storybook/react-vite";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const initialEntries =
        (context.parameters.initialEntries as string[] | undefined) ?? ["/"];

      return (
        <HelmetProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Story />
          </MemoryRouter>
        </HelmetProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
