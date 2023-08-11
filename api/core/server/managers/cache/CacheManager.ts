import { SyLFUCache } from '../../../cache/clients/lfu/SyLFUCache';
import { SyLRUCache } from '../../../cache/clients/lru/SyLRUCache';

/**
 * Manages the caching functionality of the application.
 * This class is responsible for starting and closing the cache.
 * It supports both LFU (Least Frequently Used) and LRU (Least Recently Used) caching strategies.
 */
export class CacheManager {
  /**
   * @param {SyLFUCache<any> | SyLRUCache<any>} cache - An instance of the cache client (either LFU or LRU).
   */
  constructor(private cache: SyLFUCache<any> | SyLRUCache<any>) {}

  /**
   * Starts the cache.
   * Initializes the cache connection, allowing it to be ready for usage.
   * @public
   * @async
   * @returns {Promise<void>}
   */
  async start(): Promise<void> {
    await this.cache.start();
  }

  /**
   * Closes the cache.
   * Cleans up and closes the cache connection, releasing any resources it's holding.
   * @public
   * @async
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    await this.cache.close();
  }
}
