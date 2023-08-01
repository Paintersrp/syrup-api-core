import os from 'os';

import { SyLogger } from '../../../../logging/SyLogger';
import { ListItem } from './ListItem';
import { FrequencyManager } from './FrequencyManager';
import { SyLFUCache } from '../SyLFUCache';

/**
 * Implements the eviction policy for the Least Frequently Used Cache.
 */
export class EvictionPolicy<T> {
  public originalEvictInterval: number;
  public evictionIntervalId?: NodeJS.Timeout;

  private client: SyLFUCache<T>;
  private logger: SyLogger;
  private frequencyManager: FrequencyManager;

  /**
   * @constructor
   * @param {SyLFUCache<T>} client - The cache client.
   * @param {SyLogger} logger - The logger instance.
   * @param {FrequencyManager} frequencyManager - The frequency manager instance.
   */
  constructor(client: SyLFUCache<T>, logger: SyLogger, frequencyManager: FrequencyManager) {
    this.client = client;
    this.logger = logger;
    this.frequencyManager = frequencyManager;

    this.originalEvictInterval = this.client.evictInterval;
    this.startEvictingExpiredItems();
  }

  /**
   * Starts evicting expired items from the cache.
   * @returns {void}
   */
  public startEvictingExpiredItems(): void {
    this.evictionIntervalId = setInterval(() => {
      this.autoEvictExpiredItems();
      this.updateEvictionInterval();
    }, this.client.evictInterval);
  }

  /**
   * Stops evicting expired items from the cache.
   * @returns {void}
   */
  public stopEvictingExpiredItems(): void {
    if (this.evictionIntervalId) {
      clearInterval(this.evictionIntervalId);
      this.evictionIntervalId = undefined;
    }
  }

  /**
   * Evicts items from the cache if it is full.
   * @returns {void}
   */
  public evictIfFull(): void {
    if (this.client.size === this.client.maxCacheSize) {
      this.evictMinFreqNode();
    }
  }

  /**
   * Evicts a given number of items from the cache.
   * @param {number} count - The number of items to evict.
   * @returns {void}
   */
  public evictItems(count: number): void {
    for (let i = 0; i < count && this.client.size > 0; i++) {
      this.evictMinFreqNode();
    }
  }

  /**
   * Checks if a node should expire early.
   * @param {ListItem} node - The node to check.
   * @param {number} now - The current timestamp.
   * @returns {boolean} True if the node should expire early, otherwise false.
   */
  public shouldExpireEarly(node: ListItem, now: number): boolean {
    if (!node.expires) {
      return false;
    }

    const remainingTtl = node.expires - now;
    const earlyExpirationWindow = 30000 * 0.2;
    return remainingTtl < earlyExpirationWindow && Math.random() < 0.5;
  }

  /**
   * Evicts a node with minimal frequency from the cache.
   * @returns {void}
   * @private
   */
  private evictMinFreqNode(): void {
    const minFreqList = this.frequencyManager.frequencyList.get(
      this.frequencyManager.minFrequency
    )!;
    const nodeToRemove = minFreqList.removeTail();
    this.client.cache.delete(nodeToRemove.key);
    this.client.size--;

    this.logger.info(`Evicted key ${nodeToRemove.key} due to manual eviction.`);
  }

  /**
   * Automatically evicts expired items from the cache.
   * @returns {void}
   * @private
   */
  private autoEvictExpiredItems(): void {
    const now = Date.now();
    for (const [key, node] of this.client.cache.entries()) {
      if (node.expires && node.expires < now) {
        this.frequencyManager.frequencyList.get(node.frequency)!.removeNode(node);
        this.client.cache.delete(key);
        this.client.size--;
        this.client.cacheStats.evictions++;
        this.logger.info(`Evicted key ${key} due to expiration.`);
      }
    }
  }

  /**
   * Automatically updates the eviction interval based on system load and cache size.
   * @returns {void}
   * @private
   */
  private updateEvictionInterval(): void {
    this.client.evictInterval = this.originalEvictInterval;

    const load = os.loadavg()[0];
    const newSize = this.client.size / this.client.maxCacheSize;
    const newLoad = load / os.cpus().length; // Normalize load by the number of CPU cores

    this.client.evictInterval *= 1 - newSize - newLoad;
  }
}
