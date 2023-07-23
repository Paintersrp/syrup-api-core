import { Logger } from 'pino';
import { Sequelize, Transaction } from 'sequelize';
import { Cache } from '../../models/cache';

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
}

/**
 * SyCache is a caching system for the application.
 * It uses the LRU (Least Recently Used) policy for cache eviction.
 */
export class SyCache<T> {
  private cacheMap: Map<string, CacheInterface<T>>;
  private database: Sequelize;
  private logger: Logger;

  private defaultTTL: number | null;
  private maxCacheSize: number;
  private evictInterval: number;

  private cacheStats: { hits: number; misses: number; evictions: number };
  private isInitialised: boolean;

  private evictionIntervalId?: NodeJS.Timeout;

  /**
   * Constructs a new SyCache object. Sets the default options and starts the cache.
   * Registers a shutdown handler for graceful shutdowns.
   *
   * @param {Sequelize} database - The Sequelize database connection object.
   * @param {Logger} logger - The Pino logger object.
   * @param {SyCacheOptions} options - The options for the cache. These are:
   *    - defaultTTL (Optional): The default Time To Live for cached items in milliseconds.
   *      If specified, cached items will automatically be evicted after this duration.
   *    - maxCacheSize (Optional): The maximum number of items that can be stored in the cache.
   *      If specified, the cache will evict least recently used items when the limit is reached.
   *    - evictInterval (Optional): The interval in milliseconds between automatic eviction runs.
   *      If specified, the cache will automatically attempt to evict expired items at this interval.
   */
  constructor(database: Sequelize, logger: Logger, options: SyCacheOptions = {}) {
    this.logger = logger;
    this.database = database;

    this.defaultTTL = options.defaultTTL || null;
    this.maxCacheSize = options.maxCacheSize || 5000;
    this.evictInterval = options.evictInterval || 30000;

    this.cacheMap = new Map();
    this.cacheStats = { hits: 0, misses: 0, evictions: 0 };

    this.registerShutdownHandler();
    this.isInitialised = false;
  }

  /**
   * Starts a recurring process that automatically evicts expired items from the cache.
   */
  private startEvictingExpiredItems(): void {
    this.evictionIntervalId = setInterval(() => this.autoEvictExpiredItems(), this.evictInterval);
  }

  /**
   * Stops the recurring process started by `startEvictingExpiredItems()` that evicts expired items
   * from the cache.
   */
  private stopEvictingExpiredItems(): void {
    if (this.evictionIntervalId) {
      clearInterval(this.evictionIntervalId);
      this.evictionIntervalId = undefined;
    }
  }

  /**
   * Executes a database transaction. This method automatically commits the transaction if
   * all operations are successful, or rolls back the transaction if any operation fails.
   * In case of a failure, it also logs the error.
   *
   * @param {function} action - A callback function that receives the transaction object and
   * returns a Promise. This function should include all the database operations to be
   * executed in the transaction.
   * @returns {Promise<void>}
   * @throws Will throw an error if the transaction fails.
   */
  private async executeDatabaseTransaction(
    action: (transaction: Transaction) => Promise<void>
  ): Promise<void> {
    const transaction = await this.database.transaction();
    try {
      await action(transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      this.logger.error('Error executing database transaction:', error);
      throw error;
    }
  }

  /**
   * Loads the cache from the database.
   * @returns {Promise<void>}
   */
  private async loadCacheFromDatabase(): Promise<void> {
    try {
      await this.executeDatabaseTransaction(async (transaction) => {
        const cacheData = await Cache.findOne({
          order: [['createdAt', 'DESC']],
          transaction,
        });

        if (cacheData) {
          this.cacheMap = new Map(Object.entries(cacheData.contents));
        }
      });
    } catch (error) {
      this.logger.error('Error loading cache to database:', error);
      throw error;
    }
  }

  /**
   * Saves the cache to the database.
   * @returns {Promise<void>}
   */
  private async saveCacheToDatabase(): Promise<void> {
    try {
      await this.executeDatabaseTransaction(async (transaction) => {
        const cacheDataObject: { [key: string]: CacheInterface<T> } = {};
        this.cacheMap.forEach((value, key) => {
          cacheDataObject[key] = value;
        });

        await Cache.create(
          {
            contents: JSON.parse(JSON.stringify(cacheDataObject)),
          },
          { transaction }
        );
      });
    } catch (error) {
      this.logger.error('Error saving cache to database:', error);
      throw error;
    }
  }

  /**
   * Automatically evicts expired items from the cache.
   * @returns {Promise<void>}
   */
  private async autoEvictExpiredItems(): Promise<void> {
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
   * Evicts the least recently used item from the cache.
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
   * Refreshes the expiration of a cache item.
   * @param key - The key of the cache item.
   * @param cacheItem - The cache item.
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
   * Registers a shutdown handler.
   */
  private registerShutdownHandler(): void {
    process.on('SIGTERM', async () => {
      this.logger.info('Process is shutting down...');
      await this.close();
      process.exit(0);
    });
  }

  /**
   * Starts the cache.
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    if (!this.isInitialised) {
      try {
        this.logger.info('Cache Initiated');
        await this.loadCacheFromDatabase();
        this.startEvictingExpiredItems();
        this.isInitialised = true;
      } catch (error) {
        this.logger.error('Error during cache start:', error);
        throw error;
      }
    }
  }

  /**
   * Sets a value in the cache.
   * @param key - The key of the item.
   * @param value - The value of the item.
   * @param ttl - The TTL of the item.
   * @returns {Promise<void>}
   */
  async set(key: string, value: T, ttl: number | null = this.defaultTTL): Promise<void> {
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
   * Gets a value from the cache.
   * @param key - The key of the item.
   * @returns {T | null} The value of the item, or null if not found.
   */
  get(key: string): T | null {
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
   * Deletes a value from the cache.
   * @param key - The key of the item.
   */
  del(key: string): void {
    if (this.cacheMap.delete(key)) {
      this.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.logger.warn(`Failed to delete item: ${key} from the cache.`);
    }
  }

  /**
   * Clears the cache.
   */
  clear(): void {
    this.cacheMap.clear();
    this.logger.info('Cache cleared.');
  }

  /**
   * Closes the cache.
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    try {
      this.stopEvictingExpiredItems();
      await this.saveCacheToDatabase();
      this.isInitialised = false;
    } catch (error) {
      this.logger.error('Error during cache close:', error);
    }
  }

  /**
   * Clears the cache database.
   * @returns {Promise<void>}
   */
  async clearDatabase(): Promise<void> {
    try {
      await Cache.destroy({ truncate: true });
      this.logger.info('Cache database cleared.');
    } catch (error) {
      this.logger.error('Error clearing cache database:', error);
    }
  }

  /**
   * Gets the size of the cache.
   * @returns {Promise<number>} The size of the cache.
   */
  async getCacheSize(): Promise<number> {
    return this.cacheMap.size;
  }

  /**
   * Gets the cache stats.
   * @returns {{ hits: number; misses: number; evictions: number }} The cache stats.
   */
  getCacheStats(): { hits: number; misses: number; evictions: number } {
    return this.cacheStats;
  }

  /**
   * Monitors the performance of the cache.
   */
  monitorCachePerformance(): void {
    const hitRatio = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses);
    if (hitRatio < 0.8) {
      this.logger.error(`Cache hit ratio dropped below 80%: ${hitRatio}`);
    }

    if (this.cacheStats.evictions > 100) {
      this.logger.error(`Cache evictions exceeded 100: ${this.cacheStats.evictions}`);
    }
  }
}
