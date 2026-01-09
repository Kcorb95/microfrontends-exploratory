/**
 * Library ESLint Configuration (Flat Config Format)
 * For shared packages/libraries (non-React)
 */
import baseConfig from './base.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Include base config
  ...baseConfig,

  // Library-specific configuration
  {
    rules: {
      // Allow console in libraries for debugging during development
      'no-console': 'off',
    },
  },
];
