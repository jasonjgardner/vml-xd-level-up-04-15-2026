import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/components/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  typescript: { reactDocgen: "react-docgen-typescript" },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), ...tailwindcss()];
    return config;
  },
};

export default config;
