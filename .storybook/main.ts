import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "!../src/presentation/components/ui/**/*.stories.*",
    "!../src/**/useLocalTranslatorTargetLanguage/**/*.stories.*",
    "!../src/**/useQuickMenuIsActive/**/*.stories.*",
    "!../src/infrastructure/datasource/**/*.stories.*"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '~@': path.resolve(__dirname, '../src'),
        '#imports': path.resolve(__dirname, '../__mocks__/wxt-imports.js'),
      };
    }
    return config;
  },
};
export default config;