/**
 * ESLint Configuration for Docs App
 * Uses Next.js Pages Router configuration
 */
import nextPagesConfig from '@repo/config/eslint/next-pages';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextPagesConfig,
  {
    // App-specific overrides can be added here
  },
];
