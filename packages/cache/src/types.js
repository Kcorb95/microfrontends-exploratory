/**
 * Cache Type Definitions (JSDoc)
 */

/**
 * @typedef {Object} CacheEntry
 * @property {any} value - Cached value
 * @property {number} timestamp - Cache timestamp
 * @property {number} [ttl] - Time to live in seconds
 * @property {string[]} [tags] - Cache tags for invalidation
 */

/**
 * @typedef {Object} CacheConfig
 * @property {number} [maxSize] - Maximum number of entries (default: 1000)
 * @property {number} [defaultTTL] - Default TTL in seconds (default: 3600)
 * @property {boolean} [enableTags] - Enable tag-based invalidation (default: true)
 */

/**
 * @typedef {Object} CacheStore
 * @property {(key: string) => Promise<CacheEntry|null>} get - Get cache entry
 * @property {(key: string, entry: CacheEntry) => Promise<void>} set - Set cache entry
 * @property {(key: string) => Promise<void>} delete - Delete cache entry
 * @property {(tags: string[]) => Promise<void>} revalidateTag - Invalidate by tags
 * @property {() => Promise<void>} clear - Clear all cache
 */

/**
 * @typedef {Object} IncrementalCacheValue
 * @property {string} kind - Cache kind
 * @property {Object} [html] - HTML content
 * @property {Object} [json] - JSON data
 * @property {number} [revalidate] - Revalidate interval
 * @property {string[]} [tags] - Cache tags
 */

export {};
