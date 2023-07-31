import { Sequelize } from 'sequelize';
import { CacheInterface, SyCacheOptions } from '../../types';
import { SyBaseCache } from '../../base/SyBaseCache';
import { SyLogger } from '../../../logging/SyLogger';

/**
 * SyLRUCache class extends the SyBaseCache class.
 * It's an implementation of the Least Recently Used (LRU) caching algorithm.
 *
 * @public
 */
export class SyLRUCache<T> extends SyBaseCache<T> {
  public defaultTTL: number | null;
  public maxCacheSize: number;
  public evictInterval: number;
  public evictionIntervalId?: NodeJS.Timeout;

  /**
   * @param {Sequelize} database - The Sequelize instance for the database.
   * @param {SyLogger} logger - The Logger instance for logging actions.
   * @param {SyCacheOptions} options - The options for the cache configuration.
   */
  constructor(database: Sequelize, logger: SyLogger, options: SyCacheOptions = {}) {
    super(database, logger);

    this.defaultTTL = options.defaultTTL || null;
    this.maxCacheSize = options.maxCacheSize || 5000;
    this.evictInterval = options.evictInterval || 30000;

    this.startEvictingExpiredItems();
  }

  /**
   * Method to start automatic eviction of expired items from the cache. It sets an interval to run eviction method.
   */
  public startEvictingExpiredItems(): void {
    this.evictionIntervalId = setInterval(() => this.autoEvictExpiredItems(), this.evictInterval);
  }

  /**
   * Automatically evicts expired items from the cache.
   * @returns {void}
   */
  public autoEvictExpiredItems(): void {
    const now = new Date();
    for (const [key, cacheItem] of this.cacheMap.entries()) {
      if (cacheItem.expires && cacheItem.expires < now) {
        this.logger.info(`Cleared ${key}`);
        this.cacheMap.delete(key);
        this.cacheStats.evictions++;
      }
    }
  }

  /**
   * Method to evict least recently used (LRU) item from the cache.
   */
  private evictLRUItem(): void {
    let lruKey = null;
    let lruLastAccess = new Date();

    this.cacheMap.forEach((value, key) => {
      if (!value.lastAccessed || value.lastAccessed < lruLastAccess) {
        lruKey = key;
        lruLastAccess = value.lastAccessed!;
      }
    });

    if (lruKey) {
      this.cacheMap.delete(lruKey);
      this.cacheStats.evictions++;
      this.logger.debug(`Evicted item: ${lruKey} from the cache.`);
    }
  }

  /**
   * Method to refresh the expiration of a cache item.
   *
   * @param {string} key - The key of the cache item.
   * @param {CacheInterface<T>} cacheItem - The cache item.
   */
  private refreshItemExpiration(key: string, cacheItem: CacheInterface<T>): void {
    const refreshThreshold = 0.2;
    if (
      cacheItem.expires &&
      Date.now() - cacheItem.expires.getTime() < refreshThreshold * this.defaultTTL!
    ) {
      this.set(key, cacheItem.value, this.defaultTTL);
      this.logger.debug(`Refreshed expiration for item: ${key}`);
    }
  }

  /**
   * Clears the cache.
   */
  public clear(): void {
    this.cacheMap.clear();
    this.logger.info('Cache cleared.');
  }

  /**
   * Deletes a value from the cache.
   * @param key - The key of the item.
   */
  public del(key: string): void {
    if (this.cacheMap.delete(key)) {
      this.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.logger.warn(`Failed to delete item: ${key} from the cache.`);
    }
  }

  /**
   * Deletes multiple values from the cache.
   *
   * @param {string[]} keys - An array of keys to delete from the cache.
   */
  public mdel(keys: string[]): void {
    keys.forEach((key) => {
      this.del(key);
    });
  }

  /**
   * Gets a value from the cache.
   * @param key - The key of the item.
   * @returns {T | null} The value of the item, or null if not found.
   */
  public get(key: string): T | null {
    const cacheItem = this.cacheMap.get(key);
    if (cacheItem) {
      cacheItem.lastAccessed = new Date();
      this.cacheStats.hits++;
      this.refreshItemExpiration(key, cacheItem);
      return cacheItem.value;
    } else {
      this.cacheStats.misses++;
      this.logger.warn(`Missed cache for key: ${key}`);
      return null;
    }
  }

  /**
   * Gets multiple values from the cache.
   *
   * @param {string[]} keys - An array of keys.
   * @returns {(T | null)[]} An array of values corresponding to the keys, or null if a key is not found.
   */
  public mget(keys: string[]): (T | null)[] {
    return keys.map((key) => this.get(key));
  }

  /**
   * Sets a value in the cache.
   * @param key - The key of the item.
   * @param value - The value of the item.
   * @param ttl - The TTL of the item.
   * @returns {void}
   */
  public set(key: string, value: T, ttl: number | null = this.defaultTTL): void {
    if (this.cacheMap.size >= this.maxCacheSize) {
      this.evictLRUItem();
    }

    const cacheItem: CacheInterface<T> = {
      value,
      lastAccessed: new Date(),
      expires: ttl ? new Date(Date.now() + ttl) : null,
    };

    this.cacheMap.set(key, cacheItem);
    this.logger.debug(`Set item: ${key} in the cache.`);
  }

  /**
   * Sets multiple values in the cache.
   *
   * @param {Map<string, T>} entries - A map of key-value pairs to set in the cache.
   * @param {number | null} ttl - The TTL for the cache entries.
   */
  public mset(entries: Map<string, T>, ttl: number | null = this.defaultTTL): void {
    entries.forEach((value, key) => {
      this.set(key, value, ttl);
    });
  }
}
