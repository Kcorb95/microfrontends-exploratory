import baseConfig from '@repo/config/tailwind/base';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [baseConfig],
  content: [
    './app/**/*.{js,jsx}',
    '../../packages/ui/src/**/*.{js,jsx}',
    '../../packages/search/src/**/*.{js,jsx}',
    '../../packages/analytics/src/**/*.{js,jsx}',
  ],
};
