import { Sequelize } from 'sequelize';
import { SyLogger } from '../logging/SyLogger';
import { ListItem } from './clients/lfu/mixins/ListItem';
import { SyPersistMixin } from './base/mixins/SyPersistMixin';

/**
 * Interface representing a cached item.
 */
export interface CacheContents<T> {
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
}

//doc
export type CacheStats = { hits: number; misses: number; evictions: number };
export type MSetItemsType = Array<{ key: number; value: number }>;
export type TimeToLiveType = number | null;

export interface ListItemOptions {
  key: number;
  value: number;
  frequency: number;
  ttl?: number | null;
}

export type ListItemOptionsArray = Array<ListItemOptions>;

export interface BaseCacheInterface<T> {
  // cacheMap: Map<string, CacheContents<T>>;

  database: Sequelize;
  logger: SyLogger;
  cacheStats: CacheStats;
  isInitialised: boolean;
  evictionIntervalId?: NodeJS.Timeout;
  persistMixin: SyPersistMixin<T>;

  stopEvictingExpiredItems(): void;

  start(): Promise<void>;
  close(): Promise<void>;

  // getCacheSize(): number;
  getCacheStats(): CacheStats;

  monitorCachePerformance(): void;

  incrementCacheMisses(): void;
  incrementCacheHits(): void;
}

export interface CacheInterface<T> extends BaseCacheInterface<T> {
  size: number;
  cache: Map<number, ListItem>;
  defaultTTL: TimeToLiveType;
  maxCacheSize: number;
  evictInterval: number;

  stopEvictingExpiredItems(): void;
  startEvictingExpiredItems(): void;
  evictItems(count: number): void;

  set(key: number, value: number, ttl?: TimeToLiveType): void;
  mset(items: MSetItemsType, ttl?: TimeToLiveType): void;

  get(key: number): number | void;
  mget(keys: Array<number>): Array<number | void>;

  peek(key: number): number | void;

  clear(): void;

  del(key: number): void;
  mdel(keys: Array<number>): void;
}
