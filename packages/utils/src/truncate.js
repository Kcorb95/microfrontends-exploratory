/**
 * Truncate a string to a specified length
 * @param {string} text - The text to truncate
 * @param {number} [maxLength] - Maximum length (default: 100)
 * @param {Object} [options] - Truncation options
 * @param {string} [options.suffix] - Suffix to append (default: '...')
 * @param {boolean} [options.wordBoundary] - Break at word boundary (default: true)
 * @returns {string} Truncated string
 */
export function truncate(text, maxLength = 100, options = {}) {
  const { suffix = '...', wordBoundary = true } = options;

  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  const truncateLength = maxLength - suffix.length;

  if (truncateLength <= 0) {
    return suffix;
  }

  let truncated = text.slice(0, truncateLength);

  if (wordBoundary) {
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      truncated = truncated.slice(0, lastSpace);
    }
  }

  return truncated.trim() + suffix;
}
