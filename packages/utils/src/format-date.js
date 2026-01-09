/**
 * Format options for dates
 * @typedef {Object} FormatDateOptions
 * @property {string} [locale] - Locale string (default: 'en-US')
 * @property {Intl.DateTimeFormatOptions} [options] - Intl.DateTimeFormat options
 */

/**
 * Format a date to a human-readable string
 * @param {Date | string | number} date - The date to format
 * @param {FormatDateOptions} [formatOptions] - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(date, formatOptions = {}) {
  const { locale = 'en-US', options = {} } = formatOptions;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param {Date | string | number} date - The date to format
 * @param {string} [locale] - Locale string (default: 'en-US')
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, locale = 'en-US') {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}
