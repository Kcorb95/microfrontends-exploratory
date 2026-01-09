/**
 * @repo/contentful - Contentful CMS Package
 *
 * This package provides Contentful CMS integration for the micro-frontends POC.
 * It supports pages, templates, and documentation content.
 *
 * Usage:
 * ```javascript
 * import { createContentfulClient } from '@repo/contentful';
 *
 * const client = createContentfulClient({
 *   spaceId: process.env.CONTENTFUL_SPACE_ID,
 *   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
 * });
 *
 * const page = await client.getPage('home');
 * const templates = await client.getTemplates();
 * const doc = await client.getDoc(['getting-started']);
 * ```
 */

// Client
export {
  createContentfulClient,
  CONTENTFUL_PROVIDER_INFO,
  isContentfulConfigured,
  getContentfulCdnUrl,
  getContentfulPreviewUrl,
} from './client.js';

// Rich Text
export { BLOCKS, INLINES, MARKS, isText, isBlock, isInline, documentToPlainText, renderRichText } from './rich-text.js';

// Mock data (for development)
export { MOCK_PAGES, MOCK_TEMPLATES, MOCK_DOCS, MOCK_DOC_NAVIGATION } from './mock-data.js';
