import { Sequelize } from 'sequelize';

import { SyCacheOptions } from '../../types';
import { SyBaseCache } from '../../base/SyBaseCache';
import { ListItem } from '../../helpers/ListItem';
import { DoublyLinkedList } from '../../helpers/DoublyLinkedList';
import { SyLogger } from '../../../logging/SyLogger';
import { EvictionPolicy } from './EvictionPolicy';

const DEFAULT_CACHE_SIZE = 200;
const DEFAULT_EVICTION_INTERVAL = 30000;
const DEFAULT_EARLY_EXPIRATION_WINDOW_RATIO = 0.2;
const DEFAULT_PROBABILITY_FOR_EARLY_EXPIRATION = 0.5;

/**
 * @class SyLFUCache
 * @extends {SyBaseCache<T>}
 * @description An LFU (Least Frequently Used) cache implementation.
 * @template T - The type of value that the cache holds.
 */
export class SyLFUCache<T> extends SyBaseCache<T> {
  public size: number = 0;
  public minFrequency: number = 0;
  public cache: Map<number, ListItem> = new Map();
  public frequencyList: Map<number, DoublyLinkedList> = new Map();

  private evictionPolicy: EvictionPolicy<T>;

  public defaultTTL: number | null;
  public maxCacheSize: number;
  public evictInterval: number;

  /**
   * @constructor
   * @param {Sequelize} database - The database instance.
   * @param {SyLogger} logger - The logger instance.
   * @param {SyCacheOptions} options - Optional configuration parameters.
   */
  constructor(database: Sequelize, logger: SyLogger, options: SyCacheOptions = {}) {
    super(database, logger);

    this.defaultTTL = options.defaultTTL || null;
    this.maxCacheSize = options.maxCacheSize || DEFAULT_CACHE_SIZE;
    this.evictInterval = options.evictInterval || DEFAULT_EVICTION_INTERVAL;

    this.evictionPolicy = new EvictionPolicy(this, logger);
  }

  /**
   * @method stopEvictingExpiredItems
   * @description Stops the process of evicting expired items.
   */
  public stopEvictingExpiredItems(): void {
    this.evictionPolicy.stopEvictingExpiredItems();
  }

  /**
   * @method startEvictingExpiredItems
   * @description Starts the process of evicting expired items.
   */
  public startEvictingExpiredItems(): void {
    this.evictionPolicy.startEvictingExpiredItems();
  }

  /**
   * @method evictLFUItems
   * @param {number} count - The number of LFU items to evict.
   * @description Evicts the least frequently used items.
   */
  public evictLFUItems(count: number): void {
    this.evictionPolicy.evictLFUItems(count);
  }

  /**
   * @method set
   * @param {number} key - The key of the item.
   * @param {number} value - The value of the item.
   * @param {number | null} ttl - Optional TTL. If not provided, the default TTL is used.
   * @description Sets a value in the cache, creating a new entry or updating an existing one.
   */
  public set(key: number, value: number, ttl: number | null = this.defaultTTL): void {
    if (this.isCacheEmpty()) {
      return;
    }

    const existingNode = this.cache.get(key);
    if (existingNode) {
      this.updateExistingNode(existingNode, value, ttl);
    } else {
      this.evictNodesIfCacheIsFull();
      this.createAndInsertNewNode(key, value, ttl);
    }
  }

  /**
   * @method mset
   * @param {Array<{ key: number; value: number }>} items - An array of items to be set in the cache.
   * @param {number | null} ttl - Optional TTL. If not provided, the default TTL is used.
   * @description Sets multiple values in the cache, each having a key-value pair.
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
   * @method get
   * @param {number} key - The key of the item.
   * @returns {number | void} - The value of the item if it exists, undefined otherwise.
   * @description Retrieves a value from the cache using its key.
   */
  public get(key: number): number | void {
    if (!this.cache.has(key)) {
      this.incrementCacheMisses();
      return;
    }

    const node = this.cache.get(key)!;
    const now = Date.now();

    if (node.isExpired(now)) {
      this.del(key);
      return;
    }

    // Probabilistic early expiration
    if (this.shouldNodeExpireEarly(node, now)) {
      this.del(key);
      return;
    }

    this.updateFrequency(node);
    this.incrementCacheHits();

    return node.value;
  }

  /**
   * @method mget
   * @param {Array<number>} keys - An array of keys.
   * @returns {Array<number | void>} - An array of values for the given keys.
   * @description Retrieves multiple values from the cache using their keys.
   */
  public mget(keys: Array<number>): Array<number | void> {
    return keys.map((key) => this.get(key));
  }

  /**
   * @method peek
   * @param {number} key - The key of the item.
   * @returns {number | void} - The value of the item if it exists, undefined otherwise.
   * @description Gets the value of an item in the cache without affecting its frequency.
   */
  public peek(key: number): number | void {
    const node = this.cache.get(key);
    return node ? node.value : undefined;
  }

  /**
   * @method clear
   * @description Clears the entire cache.
   */
  public clear(): void {
    this.cache.clear();
    this.logger.info('Cache cleared.');
  }

  /**
   * @method del
   * @param {number} key - The key of the item to be removed.
   * @description Deletes an item from the cache using its key.
   */
  public del(key: number): void {
    const node = this.cache.get(key);
    if (node) {
      this.removeNodeFromFrequencyList(node);
      this.cache.delete(key);
      this.size--;
      this.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.logger.warn(`Failed to delete item: ${key} from the cache.`);
    }
  }

  /**
   * @method mdel
   * @param {Array<number>} keys - An array of keys.
   * @description Deletes multiple items from the cache using their keys.
   */
  public mdel(keys: Array<number>): void {
    keys.forEach((key) => this.del(key));
  }

  private isCacheEmpty(): boolean {
    return this.maxCacheSize <= 0;
  }

  private shouldNodeExpireEarly(node: ListItem, now: number): boolean {
    if (node.expires) {
      const remainingTtl = node.expires - now;
      const earlyExpirationWindow = this.defaultTTL! * DEFAULT_EARLY_EXPIRATION_WINDOW_RATIO;
      return (
        remainingTtl < earlyExpirationWindow &&
        Math.random() < DEFAULT_PROBABILITY_FOR_EARLY_EXPIRATION
      );
    }
    return false;
  }

  private removeNodeFromFrequencyList(node: ListItem): void {
    const frequencyList = this.frequencyList.get(node.frequency);
    if (frequencyList) {
      frequencyList.removeNode(node);
      this.frequencyList.set(node.frequency, frequencyList);
    }
  }

  private updateExistingNode(node: ListItem, value: number, ttl: number | null): void {
    node.value = value;
    node.expires = ttl ? Date.now() + ttl : Date.now();
    this.updateFrequency(node);
  }

  private createAndInsertNewNode(key: number, value: number, ttl: number | null): void {
    this.minFrequency = 1;
    const newNode = new ListItem(key, value, this.minFrequency, ttl);

    if (!this.frequencyList.has(this.minFrequency)) {
      this.frequencyList.set(this.minFrequency, new DoublyLinkedList());
    }

    this.frequencyList.get(this.minFrequency)!.insertAtHead(newNode);
    this.cache.set(key, newNode);
    this.size++;
  }

  private evictNodesIfCacheIsFull(): void {
    if (this.size === this.maxCacheSize) {
      const minFreqList = this.frequencyList.get(this.minFrequency)!;
      const nodeToRemove = minFreqList.removeTail();
      this.cache.delete(nodeToRemove.key);

      if (this.cache.has(nodeToRemove.key)) {
        this.logger.error(`Failed to evict item: ${nodeToRemove.key}`);
        return;
      }

      this.size--;
    }
  }

  private updateFrequency(node: ListItem): void {
    const currentFrequency = node.frequency;
    const frequencyList = this.frequencyList.get(currentFrequency)!;
    frequencyList.removeNode(node);

    // Check if current frequency is minimum and the list has become empty
    if (!frequencyList.head.next!.next && currentFrequency === this.minFrequency) {
      this.minFrequency++;
    }

    // Increase the frequency of the node and insert it in the new frequency list
    node.frequency++;
    if (!this.frequencyList.has(node.frequency)) {
      this.frequencyList.set(node.frequency, new DoublyLinkedList());
    }
    this.frequencyList.get(node.frequency)!.insertAtHead(node);
  }
}
