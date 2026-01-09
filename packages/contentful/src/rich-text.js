/**
 * Contentful Rich Text Utilities
 *
 * This module provides utilities for rendering Contentful rich text content.
 * In production, use @contentful/rich-text-react-renderer.
 *
 * Example real implementation:
 *
 * ```javascript
 * import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
 * import { BLOCKS, INLINES } from '@contentful/rich-text-types';
 *
 * export const richTextOptions = {
 *   renderNode: {
 *     [BLOCKS.EMBEDDED_ASSET]: (node) => <Asset node={node} />,
 *     [BLOCKS.EMBEDDED_ENTRY]: (node) => <Entry node={node} />,
 *     [INLINES.HYPERLINK]: (node, children) => (
 *       <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
 *         {children}
 *       </a>
 *     ),
 *   },
 * };
 *
 * export function renderRichText(document) {
 *   return documentToReactComponents(document, richTextOptions);
 * }
 * ```
 */

/**
 * Block types for Contentful rich text
 */
export const BLOCKS = {
  DOCUMENT: 'document',
  PARAGRAPH: 'paragraph',
  HEADING_1: 'heading-1',
  HEADING_2: 'heading-2',
  HEADING_3: 'heading-3',
  HEADING_4: 'heading-4',
  HEADING_5: 'heading-5',
  HEADING_6: 'heading-6',
  UL_LIST: 'unordered-list',
  OL_LIST: 'ordered-list',
  LIST_ITEM: 'list-item',
  QUOTE: 'blockquote',
  HR: 'hr',
  EMBEDDED_ENTRY: 'embedded-entry-block',
  EMBEDDED_ASSET: 'embedded-asset-block',
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  TABLE_HEADER_CELL: 'table-header-cell',
};

/**
 * Inline types for Contentful rich text
 */
export const INLINES = {
  HYPERLINK: 'hyperlink',
  ENTRY_HYPERLINK: 'entry-hyperlink',
  ASSET_HYPERLINK: 'asset-hyperlink',
  EMBEDDED_ENTRY: 'embedded-entry-inline',
};

/**
 * Mark types for Contentful rich text
 */
export const MARKS = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  CODE: 'code',
  SUPERSCRIPT: 'superscript',
  SUBSCRIPT: 'subscript',
};

/**
 * Check if a node is a text node
 * @param {Object} node
 * @returns {boolean}
 */
export function isText(node) {
  return node.nodeType === 'text';
}

/**
 * Check if a node is a block node
 * @param {Object} node
 * @returns {boolean}
 */
export function isBlock(node) {
  return Object.values(BLOCKS).includes(node.nodeType);
}

/**
 * Check if a node is an inline node
 * @param {Object} node
 * @returns {boolean}
 */
export function isInline(node) {
  return Object.values(INLINES).includes(node.nodeType);
}

/**
 * Extract plain text from a rich text document
 * @param {Object} document - Contentful rich text document
 * @returns {string}
 */
export function documentToPlainText(document) {
  if (!document || !document.content) {
    return '';
  }

  function extractText(nodes) {
    return nodes
      .map((node) => {
        if (isText(node)) {
          return node.value;
        }
        if (node.content) {
          return extractText(node.content);
        }
        return '';
      })
      .join('');
  }

  return extractText(document.content);
}

/**
 * Stub renderer for rich text (returns plain text)
 * In production, use documentToReactComponents from @contentful/rich-text-react-renderer
 * @param {Object} document - Contentful rich text document
 * @param {Object} [options] - Render options
 * @returns {string}
 */
export function renderRichText(document, _options = {}) {
  // This is a stub - in production, use @contentful/rich-text-react-renderer
  return documentToPlainText(document);
}
