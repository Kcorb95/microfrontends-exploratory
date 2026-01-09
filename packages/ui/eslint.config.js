/**
 * ESLint Configuration for UI Package
 * Uses React configuration for component library
 */
import reactConfig from '@repo/config/eslint/react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...reactConfig,
  {
    // Package-specific overrides can be added here
  },
];
