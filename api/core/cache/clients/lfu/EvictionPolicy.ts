import os from 'os';

import { SyLogger } from '../../../logging/SyLogger';
import { SyLFUCache } from './SyLFUCache';

export class EvictionPolicy<T> {
  public originalEvictInterval: number;
  public evictionIntervalId?: NodeJS.Timeout;

  constructor(private cache: SyLFUCache<T>, private logger: SyLogger) {
    this.originalEvictInterval = this.cache.evictInterval;
    this.startEvictingExpiredItems();
  }

  /**
   * Stops the recurring process started by `startEvictingExpiredItems()` that evicts expired items
   * from the cache.
   * @public
   */
  public stopEvictingExpiredItems(): void {
    if (this.evictionIntervalId) {
      clearInterval(this.evictionIntervalId);
      this.evictionIntervalId = undefined;
    }
  }

  /**
   * Starts a recurring process that automatically evicts expired items from the cache.
   * @public
   */
  public startEvictingExpiredItems(): void {
    this.evictionIntervalId = setInterval(() => {
      this.autoEvictExpiredItems();
      this.updateEvictionInterval();
    }, this.cache.evictInterval);
  }

  /**
   * Automatically evicts expired items from the cache.
   * @returns {void}
   * @public
   */
  private autoEvictExpiredItems(): void {
    const now = Date.now();
    for (const [key, node] of this.cache.cache.entries()) {
      if (node.expires && node.expires < now) {
        this.cache.frequencyList.get(node.frequency)!.removeNode(node);
        this.cache.cache.delete(key);
        this.cache.size--;
        this.cache.cacheStats.evictions++;
        this.logger.info(`Evicted key ${key} due to expiration.`);
      }
    }
  }

  /**
   * Automatically update  expired items from the cache.
   * @returns {void}
   * @public
   */
  private updateEvictionInterval(): void {
    this.cache.evictInterval = this.originalEvictInterval;

    const load = os.loadavg()[0];
    const newSize = this.cache.size / this.cache.maxCacheSize;
    const newLoad = load / os.cpus().length; // Normalize load by the number of CPU cores

    this.cache.evictInterval = this.cache.evictInterval * (1 - newSize - newLoad);
  }

  /**
   * Manually evicts least frequently used items from the cache based on the given count.
   * @param {number} count - The number of items to evict.
   * @public
   */
  public evictLFUItems(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.cache.size === 0) {
        break;
      }

      let minFreqList = this.cache.frequencyList.get(this.cache.minFrequency)!;
      let nodeToRemove = minFreqList.removeTail();
      this.cache.cache.delete(nodeToRemove.key);
      this.cache.size--;

      this.logger.info(`Evicted key ${nodeToRemove.key} due to manual eviction.`);
    }
  }
}
