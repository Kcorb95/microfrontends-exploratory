/**
 * Next.js Custom Cache Handler
 * Implements the Next.js cache handler interface for custom caching
 *
 * Usage in next.config.js:
 * ```javascript
 * module.exports = {
 *   cacheHandler: require.resolve('@repo/cache/handler'),
 *   cacheMaxMemorySize: 0, // Disable default memory cache
 * };
 * ```
 */

import { getMemoryStore } from './memory-store.js';

/** @type {import('./memory-store.js').MemoryStore} */
let cacheStore = null;

/**
 * Initialize cache store
 * @returns {import('./memory-store.js').MemoryStore}
 */
function getCacheStore() {
  if (!cacheStore) {
    cacheStore = getMemoryStore({
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
      defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '3600', 10),
    });
  }
  return cacheStore;
}

/**
 * Next.js Cache Handler class
 */
export default class CacheHandler {
  constructor(options) {
    this.options = options;
    this.store = getCacheStore();

    console.log('[CacheHandler] Initialized with options:', {
      maxSize: this.store.maxSize,
      defaultTTL: this.store.defaultTTL,
    });
  }

  /**
   * Get cached value
   * @param {string} key
   * @returns {Promise<Object|null>}
   */
  async get(key) {
    try {
      const entry = await this.store.get(key);

      if (!entry) {
        return null;
      }

      return {
        value: entry.value,
        lastModified: entry.timestamp,
        tags: entry.tags || [],
      };
    } catch (error) {
      console.error('[CacheHandler] Get error:', error);
      return null;
    }
  }

  /**
   * Set cached value
   * @param {string} key
   * @param {Object} data
   * @param {Object} ctx
   */
  async set(key, data, ctx) {
    try {
      const { revalidate, tags } = ctx || {};

      await this.store.set(key, {
        value: data,
        timestamp: Date.now(),
        ttl: revalidate ? revalidate : this.store.defaultTTL,
        tags: tags || [],
      });
    } catch (error) {
      console.error('[CacheHandler] Set error:', error);
    }
  }

  /**
   * Revalidate entries by tag
   * @param {string} tag
   */
  async revalidateTag(tag) {
    try {
      await this.store.revalidateTag([tag]);
    } catch (error) {
      console.error('[CacheHandler] RevalidateTag error:', error);
    }
  }
}

// Export for programmatic use
export { getCacheStore };
