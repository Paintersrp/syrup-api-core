import { Logger } from 'pino';
import { Sequelize } from 'sequelize';
import { SyCacheOptions } from './types';
import { SyBaseCache } from './base/SyBaseCache';
import { ListItem } from './helpers/ListItem';
import { DoublyLinkedList } from './helpers/DoublyLinkedList';
import { SyLogger } from '../logging/SyLogger';

/**
 * @todo get cache size, etc
 * @todo event emitter
 */

/**
 * This class implements a least frequently used (LFU) cache strategy, where
 * the least frequently used items are removed first. The module also provides
 * the ability to limit the cache size, automatically evict expired items,
 * manually evict least frequently used items, among other features.
 *
 * @module SyLFUCache
 * @template T - The type of the items to be stored in the cache.
 */
export class SyLFUCache<T> extends SyBaseCache<T> {
  private size: number;
  private minFrequency: number;
  private cache: { [key: number]: ListItem };
  private frequencyList: { [frequency: number]: DoublyLinkedList };

  public defaultTTL: number | null;
  public maxCacheSize: number;
  public evictInterval: number;
  public evictionIntervalId?: NodeJS.Timeout;

  /**
   * Creates a new instance of SyLFUCache
   * @param {Sequelize} database - Sequelize instance representing the database.
   * @param {SyLogger} logger - Pino logger instance.
   * @param {SyCacheOptions} options - Optional cache configurations.
   */
  constructor(database: Sequelize, logger: SyLogger, options: SyCacheOptions = {}) {
    super(database, logger);

    this.defaultTTL = options.defaultTTL || null;
    this.maxCacheSize = options.maxCacheSize || 5000;
    this.evictInterval = options.evictInterval || 30000;

    this.size = 0;
    this.minFrequency = 0;

    this.cache = {};
    this.frequencyList = {};

    this.startEvictingExpiredItems();
  }

  /**
   * Updates the frequency of a node in the cache.
   * @param {ListItem} node - Node which frequency is to be updated.
   * @private
   */
  private updateFrequency(node: ListItem): void {
    let freq = node.frequency;
    this.frequencyList[freq].removeNode(node);

    if (!this.frequencyList[freq].head.next!.next && freq === this.minFrequency) {
      this.minFrequency++;
    }

    node.frequency++;
    if (!this.frequencyList[node.frequency]) {
      this.frequencyList[node.frequency] = new DoublyLinkedList();
    }
    this.frequencyList[node.frequency].insertAtHead(node);
  }

  /**
   * Starts a recurring process that automatically evicts expired items from the cache.
   * @public
   */
  public startEvictingExpiredItems(): void {
    this.evictionIntervalId = setInterval(() => this.autoEvictExpiredItems(), this.evictInterval);
  }

  /**
   * Automatically evicts expired items from the cache.
   * @returns {void}
   * @public
   */
  public autoEvictExpiredItems(): void {
    const now = Date.now();
    for (const key in this.cache) {
      const node = this.cache[key];
      if (node.expires && node.expires < now) {
        this.frequencyList[node.frequency].removeNode(node);
        delete this.cache[key];
        this.size--;
        this.cacheStats.evictions++;
        this.logger.info(`Evicted key ${key} due to expiration.`);
      }
    }
  }

  /**
   * Clears the cache.
   * @public
   */
  public clear(): void {
    this.cache = {};
    this.logger.info('Cache cleared.');
  }

  /**
   * Deletes multiple values from the cache at once.
   * @param {Array<number>} keys - An array of keys.
   * @public
   */
  public del(key: number): void {
    let node = this.cache[key];
    if (node) {
      this.frequencyList[node.frequency].removeNode(node);
      delete this.cache[key];
      this.size--;
      this.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.logger.warn(`Failed to delete item: ${key} from the cache.`);
    }
  }

  /**
   * Gets a value from the cache.
   * @param {number} key - The key of the item.
   * @returns {number | void} The value of the item, or undefined if not found.
   * @public
   */
  public mdel(keys: Array<number>): void {
    keys.forEach((key) => this.del(key));
  }

  /**
   * Gets a value from the cache.
   * @param {number} key - The key of the item.
   * @returns {number | void} The value of the item, or undefined if not found.
   * @public
   */
  public get(key: number): number | void {
    if (!this.cache[key]) {
      return;
    }

    let node = this.cache[key];
    this.updateFrequency(node);

    return node.value;
  }

  /**
   * Gets multiple values from the cache at once.
   * @param {Array<number>} keys - An array of keys.
   * @returns {Array<number | void>} An array of the values of the items, or undefined for those not found.
   * @public
   */
  public mget(keys: Array<number>): (number | void)[] {
    return keys.map((key) => this.get(key));
  }

  /**
   * Sets a value in the cache.
   * @param {number} key - The key of the item.
   * @param {number} value - The value of the item.
   * @param {number | null} ttl - The TTL of the item. Defaults to this.defaultTTL.
   * @returns {void}
   * @public
   */
  public set(key: number, value: number, ttl: number | null = this.defaultTTL): void {
    if (this.maxCacheSize <= 0) {
      return;
    }

    let node = this.cache[key];

    if (node) {
      node.value = value;
      node.expires = ttl ? Date.now() + ttl : null;
      this.updateFrequency(node);
    } else {
      if (this.size === this.maxCacheSize) {
        let minFreqList = this.frequencyList[this.minFrequency];
        let nodeToRemove = minFreqList.removeTail();
        delete this.cache[nodeToRemove.key];
        this.size--;
      }

      this.minFrequency = 1;
      let newNode = new ListItem(key, value, this.minFrequency, ttl);

      if (!this.frequencyList[this.minFrequency]) {
        this.frequencyList[this.minFrequency] = new DoublyLinkedList();
      }
      this.frequencyList[this.minFrequency].insertAtHead(newNode);

      this.cache[key] = newNode;
      this.size++;
    }
  }

  /**
   * Sets multiple values in the cache at once.
   * @param {Array<{ key: number; value: number }>} items - An array of keys and their corresponding values.
   * @param {number | null} ttl - The TTL of the items. Defaults to this.defaultTTL.
   * @public
   */
  public mset(
    items: Array<{ key: number; value: number }>,
    ttl: number | null = this.defaultTTL
  ): void {
    items.forEach((item) => {
      this.set(item.key, item.value, ttl);
    });
  }

  /**
   * Manually evicts least frequently used items from the cache based on the given count.
   * @param {number} count - The number of items to evict.
   * @public
   */
  public evictLFUItems(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.size === 0) {
        break;
      }

      let minFreqList = this.frequencyList[this.minFrequency];
      let nodeToRemove = minFreqList.removeTail();
      delete this.cache[nodeToRemove.key];
      this.size--;

      this.logger.info(`Evicted key ${nodeToRemove.key} due to manual eviction.`);
    }
  }
}
