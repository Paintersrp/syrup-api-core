/**
 * Interface representing a cached item.
 */
export interface CacheInterface<T> {
  value: T; // The value of the cached item.
  expires?: Date | null; // The expiration date of the cached item.
  lastAccessed?: Date; // The last access date of the cached item.
}

/**
 * Interface for SyCache options.
 */
export interface SyCacheOptions {
  defaultTTL?: number; // The default TTL for cached items.
  maxCacheSize?: number; // The maximum number of items that can be stored in the cache.
  evictInterval?: number; // The interval between cache eviction runs.
  evictionPolicy?: string; // The type of eviction policy to implement
}

//doc
export type CacheStats = { hits: number; misses: number; evictions: number };
