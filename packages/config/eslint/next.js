/**
 * Next.js ESLint Configuration (Flat Config Format)
 * For Next.js App Router applications
 */
import nextPlugin from '@next/eslint-plugin-next';

import reactConfig from './react.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Include React config (which includes base)
  ...reactConfig,

  // Next.js plugin configuration
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      // Next.js recommended rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Custom overrides
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
