/**
 * Next.js Pages Router ESLint Configuration (Flat Config Format)
 * For Next.js Pages Router applications (legacy)
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
      // Next.js recommended rules (without core-web-vitals for pages router)
      ...nextPlugin.configs.recommended.rules,

      // Custom overrides
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
