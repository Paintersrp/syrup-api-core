import { Sequelize } from 'sequelize';

import { CacheInterface, SyCacheOptions } from '../../types';
import { SyBaseCache } from '../../base/SyBaseCache';

import { SyLogger } from '../../../logging/SyLogger';

import { EvictionPolicy } from './mixins/EvictionPolicy';
import { FrequencyManager } from './mixins/FrequencyManager';
import { ListItem } from './mixins/ListItem';
import { CACHE } from '../../const';
import { LFUOperations } from './mixins/LFUOperations';

/**
 * @class SyLFUCache
 * @extends {SyBaseCache<T>}
 * @description An LFU (Least Frequently Used) cache implementation. This class composes behaviors
 * from several objects, namely `FrequencyManager` (manages frequency of cache usage),
 * `EvictionPolicy` (manages eviction of cache items), and `LFUOperations` (provides basic operations on cache).
 * @template T - The type of value that the cache holds.
 */
export class SyLFUCache<T> extends SyBaseCache<T> implements CacheInterface<T> {
  public size: number = 0;
  public cache: Map<number, ListItem> = new Map();

  public frequencyManager: FrequencyManager;
  public evictionPolicy: EvictionPolicy<T>;
  public lfuOperations: LFUOperations<T>;

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

    this.defaultTTL = options.defaultTTL || CACHE.OPTIONS.defaultTTL;
    this.maxCacheSize = options.maxCacheSize || CACHE.OPTIONS.maxCacheSize;
    this.evictInterval = options.evictInterval || CACHE.OPTIONS.evictInterval;

    this.frequencyManager = new FrequencyManager(this.cache, this.size, this.logger);
    this.evictionPolicy = new EvictionPolicy(this, this.logger, this.frequencyManager);
    this.lfuOperations = new LFUOperations(this);
  }

  /**
   * @method stopEvictingExpiredItems
   * @see {@link EvictionPolicy#stopEvictingExpiredItems}
   */
  public stopEvictingExpiredItems(): void {
    this.evictionPolicy.stopEvictingExpiredItems();
  }

  /**
   * @method startEvictingExpiredItems
   * @see {@link EvictionPolicy#startEvictingExpiredItems}
   */
  public startEvictingExpiredItems(): void {
    this.evictionPolicy.startEvictingExpiredItems();
  }

  /**
   * @method evictItems
   * @see {@link EvictionPolicy#evictItems}
   */
  public evictItems(count: number): void {
    this.evictionPolicy.evictItems(count);
  }

  /**
   * @method set
   * @see {@link LFUOperations#set}
   */
  public set(key: number, value: number, ttl: number | null = this.defaultTTL): void {
    this.lfuOperations.set(key, value, ttl);
  }

  /**
   * @method mset
   * @see {@link LFUOperations#mset}
   */
  public mset(
    items: Array<{ key: number; value: number }>,
    ttl: number | null = this.defaultTTL
  ): void {
    this.lfuOperations.mset(items, ttl);
  }

  /**
   * @method get
   * @see {@link LFUOperations#get}
   */
  public get(key: number): number | void {
    return this.lfuOperations.get(key);
  }

  /**
   * @method mget
   * @see {@link LFUOperations#mget}
   */
  public mget(keys: Array<number>): Array<number | void> {
    return this.lfuOperations.mget(keys);
  }

  /**
   * @method peek
   * @see {@link LFUOperations#peek}
   */
  public peek(key: number): number | void {
    return this.lfuOperations.peek(key);
  }

  /**
   * @method clear
   * @see {@link LFUOperations#clear}
   */
  public clear(): void {
    return this.lfuOperations.clear();
  }

  /**
   * @method del
   * @see {@link LFUOperations#del}
   */
  public del(key: number): void {
    this.lfuOperations.del(key);
  }

  /**
   * @method mdel
   * @see {@link LFUOperations#mdel}
   */
  public mdel(keys: Array<number>): void {
    this.lfuOperations.mdel(keys);
  }

  /**
   * @method isCacheEmpty
   * @returns {boolean} - Returns true if the cache size is zero or less, false otherwise.
   * @description Checks if the cache is empty.
   */
  public isCacheEmpty(): boolean {
    return this.maxCacheSize <= 0;
  }
}
