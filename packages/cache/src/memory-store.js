/**
 * LRU Memory Cache Store
 * Simple in-memory cache with LRU eviction and tag-based invalidation
 */

/**
 * Memory cache store class
 */
export class MemoryStore {
  constructor(config = {}) {
    this.maxSize = config.maxSize || 1000;
    this.defaultTTL = config.defaultTTL || 3600; // 1 hour
    this.enableTags = config.enableTags ?? true;

    /** @type {Map<string, import('./types.js').CacheEntry>} */
    this.cache = new Map();

    /** @type {Map<string, Set<string>>} */
    this.tagIndex = new Map();
  }

  /**
   * Get cache entry
   * @param {string} key
   * @returns {Promise<import('./types.js').CacheEntry|null>}
   */
  async get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (this._isExpired(entry)) {
      await this.delete(key);
      return null;
    }

    // Move to end (LRU behavior)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry;
  }

  /**
   * Set cache entry
   * @param {string} key
   * @param {import('./types.js').CacheEntry} entry
   * @returns {Promise<void>}
   */
  async set(key, entry) {
    // Evict oldest entries if at capacity
    while (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      await this.delete(oldestKey);
    }

    // Store entry
    this.cache.set(key, {
      ...entry,
      timestamp: entry.timestamp || Date.now(),
      ttl: entry.ttl ?? this.defaultTTL,
    });

    // Index by tags
    if (this.enableTags && entry.tags) {
      entry.tags.forEach((tag) => {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag).add(key);
      });
    }
  }

  /**
   * Delete cache entry
   * @param {string} key
   * @returns {Promise<void>}
   */
  async delete(key) {
    const entry = this.cache.get(key);

    if (entry?.tags) {
      entry.tags.forEach((tag) => {
        this.tagIndex.get(tag)?.delete(key);
      });
    }

    this.cache.delete(key);
  }

  /**
   * Invalidate entries by tags
   * @param {string[]} tags
   * @returns {Promise<void>}
   */
  async revalidateTag(tags) {
    const keysToDelete = new Set();

    tags.forEach((tag) => {
      const keys = this.tagIndex.get(tag);
      if (keys) {
        keys.forEach((key) => keysToDelete.add(key));
        this.tagIndex.delete(tag);
      }
    });

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
    });

    console.log(`[Cache] Revalidated ${keysToDelete.size} entries for tags: ${tags.join(', ')}`);
  }

  /**
   * Clear all cache entries
   * @returns {Promise<void>}
   */
  async clear() {
    this.cache.clear();
    this.tagIndex.clear();
    console.log('[Cache] Cleared all entries');
  }

  /**
   * Get cache stats
   * @returns {Object}
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      tagCount: this.tagIndex.size,
    };
  }

  /**
   * Check if entry is expired
   * @param {import('./types.js').CacheEntry} entry
   * @returns {boolean}
   */
  _isExpired(entry) {
    if (!entry.ttl || entry.ttl <= 0) {
      return false; // Never expires
    }

    const age = (Date.now() - entry.timestamp) / 1000;
    return age > entry.ttl;
  }
}

// Singleton instance
let memoryStore = null;

/**
 * Get or create memory store instance
 * @param {import('./types.js').CacheConfig} [config]
 * @returns {MemoryStore}
 */
export function getMemoryStore(config) {
  if (!memoryStore) {
    memoryStore = new MemoryStore(config);
  }
  return memoryStore;
}

/**
 * Reset memory store (for testing)
 */
export function resetMemoryStore() {
  memoryStore = null;
}
