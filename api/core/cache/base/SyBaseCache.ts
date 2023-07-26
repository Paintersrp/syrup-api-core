import { Logger } from 'pino';
import { Sequelize } from 'sequelize';
import { CacheInterface, CacheStats } from '../types';
import { SyPersistMixin } from '../mixins/SyPersistMixin';
import { SyLogger } from '../../logging/SyLogger';

export class SyBaseCache<T> {
  public cacheMap: Map<string, CacheInterface<T>>;
  public database: Sequelize;
  public readonly logger: SyLogger;
  public cacheStats: CacheStats;
  public isInitialised: boolean;

  public evictionIntervalId?: NodeJS.Timeout;
  public declare persistMixin: SyPersistMixin<T>;

  constructor(database: Sequelize, logger: SyLogger) {
    this.logger = logger;
    this.database = database;
    this.cacheMap = new Map();
    this.cacheStats = { hits: 0, misses: 0, evictions: 0 };

    this.persistMixin = new SyPersistMixin(this.cacheMap, this.database, this.logger);
    this.registerShutdownHandler();
    this.isInitialised = false;
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
   * Stops the recurring process started by `startEvictingExpiredItems()` that evicts expired items
   * from the cache.
   */
  public stopEvictingExpiredItems(): void {
    if (this.evictionIntervalId) {
      clearInterval(this.evictionIntervalId);
      this.evictionIntervalId = undefined;
    }
  }

  /**
   * Starts the cache.
   * @returns {Promise<void>}
   */
  public async start(): Promise<void> {
    if (!this.isInitialised) {
      try {
        this.logger.info('Cache Initiated');

        await this.persistMixin.loadCacheFromDatabase();
        this.isInitialised = true;
      } catch (error: any) {
        this.logger.error('Error during cache start:', error);
        throw error;
      }
    }
  }

  /**
   * Closes the cache.
   * @returns {Promise<void>}
   */
  public async close(): Promise<void> {
    try {
      this.stopEvictingExpiredItems();
      await this.persistMixin.saveCacheToDatabase();
      this.isInitialised = false;
    } catch (error: any) {
      this.logger.error('Error during cache close:', error);
    }
  }

  /**
   * Gets the size of the cache.
   * @returns {Promise<number>} The size of the cache.
   */
  public async getCacheSize(): Promise<number> {
    return this.cacheMap.size;
  }

  /**
   * Gets the cache stats.
   * @returns {{ hits: number; misses: number; evictions: number }} The cache stats.
   */
  public getCacheStats(): { hits: number; misses: number; evictions: number } {
    return this.cacheStats;
  }

  /**
   * Monitors the performance of the cache.
   */
  public monitorCachePerformance(): void {
    const hitRatio = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses);
    if (hitRatio < 0.8) {
      this.logger.error(`Cache hit ratio dropped below 80%: ${hitRatio}`);
    }

    if (this.cacheStats.evictions > 100) {
      this.logger.error(`Cache evictions exceeded 100: ${this.cacheStats.evictions}`);
    }
  }
}
