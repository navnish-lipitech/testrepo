import type { StorybookConfig } from "@storybook/react-vite";

const configs: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-interactions",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        viteConfigPath: require.resolve("../vite.config.ts"),
      },
    },
  },
  viteFinal: (config) => {
    // modify the Vite config here
    return config;
  },
  docs: {
    autodocs: false,
  },
  core: {
    builder: "@storybook/builder-vite",
  },
};

export default configs;
