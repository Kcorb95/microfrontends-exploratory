/**
 * ESLint Configuration for Analytics Package
 * Uses React configuration for analytics components and hooks
 */
import reactConfig from '@repo/config/eslint/react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...reactConfig,
  {
    // Package-specific overrides can be added here
  },
];
