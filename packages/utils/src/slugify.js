/**
 * Convert a string to a URL-safe slug
 * @param {string} text - The text to convert
 * @param {Object} [options] - Options for slug generation
 * @param {string} [options.separator] - Separator character (default: '-')
 * @param {boolean} [options.lowercase] - Convert to lowercase (default: true)
 * @returns {string} URL-safe slug
 */
export function slugify(text, options = {}) {
  const { separator = '-', lowercase = true } = options;

  if (!text || typeof text !== 'string') {
    return '';
  }

  let slug = text
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and underscores with separator
    .replace(/[\s_]+/g, separator)
    // Remove non-word characters except separator
    .replace(new RegExp(`[^\\w${separator}]+`, 'g'), '')
    // Replace multiple separators with single separator
    .replace(new RegExp(`${separator}+`, 'g'), separator)
    // Remove leading/trailing separators
    .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

  if (lowercase) {
    slug = slug.toLowerCase();
  }

  return slug;
}
