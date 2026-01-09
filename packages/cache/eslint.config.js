/**
 * ESLint Configuration for Cache Package
 * Uses library configuration (non-React)
 */
import libraryConfig from '@repo/config/eslint/library';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...libraryConfig,
  {
    // Package-specific overrides can be added here
  },
];
