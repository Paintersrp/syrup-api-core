import { Logger } from 'pino';
import { Sequelize } from 'sequelize';
import { Cache } from '../../../../models';
interface CacheItem<T> {
  value: T;
  frequency: number;
  lastAccessed: Date;
  expiry: number;
}

export class LFUCache<T> {
  private readonly database: Sequelize;
  private readonly logger: Logger;
  private readonly maxCacheSize: number;
  private cacheMap: Map<string, CacheItem<T>>;

  constructor(database: Sequelize, logger: Logger, maxCacheSize: number) {
    this.database = database;
    this.logger = logger;
    this.maxCacheSize = maxCacheSize;
    this.cacheMap = new Map<string, CacheItem<T>>();

    this.loadCacheFromDatabase().then(() => {
      this.evictExpiredItems();
    });
  }

  private async loadCacheFromDatabase(): Promise<void> {
    try {
      const cacheRecord = await Cache.findOne({ order: [['createdAt', 'DESC']] });

      if (cacheRecord) {
        this.cacheMap = new Map(Object.entries(cacheRecord.contents));
      }
    } catch (error) {
      this.logger.error('Error loading cache from database:', error);
      throw error;
    }
  }

  private async saveCacheToDatabase(): Promise<void> {
    try {
      const cacheDataObject: { [key: string]: CacheItem<T> } = {};
      this.cacheMap.forEach((value, key) => {
        cacheDataObject[key] = value;
      });

      await Cache.create({ contents: JSON.parse(JSON.stringify(cacheDataObject)) });
    } catch (error) {
      this.logger.error('Error saving cache to database:', error);
      throw error;
    }
  }

  private evictExpiredItems(): void {
    const now = Date.now();

    for (const [key, cacheItem] of this.cacheMap.entries()) {
      if (cacheItem.expiry <= now) {
        this.cacheMap.delete(key);
      }
    }
  }

  private evictLFUItem(): void {
    let minFreq = Infinity;
    let LFUKey: string | null = null;

    for (const [key, cacheItem] of this.cacheMap.entries()) {
      if (cacheItem.frequency < minFreq) {
        LFUKey = key;
        minFreq = cacheItem.frequency;
      } else if (cacheItem.frequency === minFreq) {
        const LFUItem = this.cacheMap.get(LFUKey!);
        if (cacheItem.lastAccessed < LFUItem!.lastAccessed) {
          LFUKey = key;
        }
      }
    }

    if (LFUKey) {
      this.cacheMap.delete(LFUKey);
      this.logger.debug(`Evicted item: ${LFUKey} from the cache.`);
    }
  }

  async set(key: string, value: T, ttl: number): Promise<void> {
    this.evictExpiredItems();

    if (this.cacheMap.size >= this.maxCacheSize) {
      this.evictLFUItem();
    }

    this.cacheMap.set(key, {
      value,
      frequency: 1,
      lastAccessed: new Date(),
      expiry: Date.now() + ttl * 1000,
    });

    this.logger.debug(`Set item: ${key} in the cache.`);
  }

  get(key: string): T | null {
    this.evictExpiredItems();

    const cacheItem = this.cacheMap.get(key);

    if (cacheItem) {
      if (cacheItem.expiry > Date.now()) {
        cacheItem.frequency += 1;
        cacheItem.lastAccessed = new Date();
        return cacheItem.value;
      } else {
        this.cacheMap.delete(key);
      }
    }

    this.logger.warn(`Missed cache for key: ${key}`);
    return null;
  }

  del(key: string): void {
    if (this.cacheMap.delete(key)) {
      this.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.logger.warn(`Failed to delete item: ${key} from the cache.`);
    }
  }

  clear(): void {
    this.cacheMap.clear();
    this.logger.info('Cache cleared.');
  }

  async close(): Promise<void> {
    try {
      await this.saveCacheToDatabase();
    } catch (error) {
      this.logger.error('Error during cache close:', error);
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      await Cache.destroy({ truncate: true });
      this.logger.info('Cache database cleared.');
    } catch (error) {
      this.logger.error('Error clearing cache database:', error);
    }
  }
}
