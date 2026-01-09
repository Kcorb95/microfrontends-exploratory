/**
 * ESLint Configuration for Platform App
 * Uses Next.js App Router configuration
 */
import nextConfig from '@repo/config/eslint/next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextConfig,
  {
    // App-specific overrides can be added here
  },
];
