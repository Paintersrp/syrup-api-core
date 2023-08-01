import { SyLFUCache } from '../SyLFUCache';

/**
 * Class LFUOperations provides methods to interact with the LFU cache,
 * including operations to set, get, and delete items, both singularly and in bulk.
 */
export class LFUOperations<T> {
  private client: SyLFUCache<T>;

  /**
   * @constructor
   * @param {SyLFUCache<T>} client - The LFU cache instance.
   */
  constructor(client: SyLFUCache<T>) {
    this.client = client;
  }

  /**
   * @method set
   * @param {number} key - The key of the item.
   * @param {number} value - The value of the item.
   * @param {number | null} ttl - Optional TTL. If not provided, the default TTL is used.
   * @description Sets a value in the cache, creating a new entry or updating an existing one.
   */
  public set(key: number, value: number, ttl: number | null = this.client.defaultTTL): void {
    if (this.client.isCacheEmpty()) {
      return;
    }

    const existingNode = this.client.cache.get(key);
    if (existingNode) {
      this.client.frequencyManager.updateExistingNode(existingNode, value, ttl);
    } else {
      this.client.evictionPolicy.evictIfFull();
      this.client.frequencyManager.createAndInsertNewNode(key, value, ttl);
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
    ttl: number | null = this.client.defaultTTL
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
    const node = this.client.cache.get(key);

    if (!node) {
      return this.client.incrementCacheMisses();
    }

    const now = Date.now();

    if (node.isExpired(now)) {
      this.del(key);
      return;
    }

    // Probabilistic early expiration
    if (this.client.evictionPolicy.shouldExpireEarly(node, now)) {
      this.del(key);
      return;
    }

    this.client.frequencyManager.updateFrequency(node);
    this.client.incrementCacheHits();

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
    const node = this.client.cache.get(key);
    return node ? node.value : undefined;
  }

  /**
   * @method clear
   * @description Clears the entire cache.
   */
  public clear(): void {
    this.client.cache.clear();
    this.client.logger.info('Cache cleared.');
  }

  /**
   * @method del
   * @param {number} key - The key of the item to be removed.
   * @description Deletes an item from the cache using its key.
   */
  public del(key: number): void {
    const node = this.client.cache.get(key);
    if (node) {
      this.client.frequencyManager.removeNodeFromFrequencyList(node);
      this.client.cache.delete(key);
      this.client.size--;
      this.client.logger.debug(`Deleted item: ${key} from the cache.`);
    } else {
      this.client.logger.warn(`Failed to delete item: ${key} from the cache.`);
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
}
