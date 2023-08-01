import { CacheInputError, CacheOperationsError } from '../../../../errors/server';
import { SyLogger } from '../../../../logging/SyLogger';
import { DoublyLinkedList } from './DoublyLinkedList';
import { ListItem } from './ListItem';

/**
 * Manages the frequency of items in an LFU Cache.
 */
export class FrequencyManager {
  public minFrequency: number;
  public frequencyList: Map<number, DoublyLinkedList>;
  public cache: Map<number, ListItem>;
  public size: number;
  private logger: SyLogger;

  /**
   * @constructor
   * @param {Map<number, ListItem>} cache - The cache instance.
   * @param {number} size - The size of the cache.
   * @param {SyLogger} logger - The logger instance.
   */
  constructor(cache: Map<number, ListItem>, size: number, logger: SyLogger) {
    this.checkInputValidity(cache, size);
    this.minFrequency = 0;
    this.frequencyList = new Map();
    this.cache = cache;
    this.size = size;
    this.logger = logger;
  }

  /**
   * @private
   * @method checkInputValidity
   * @description Checks the validity of the cache and size input.
   */
  private checkInputValidity(cache: Map<number, ListItem>, size: number): void {
    if (!cache) {
      throw new CacheInputError('Invalid cache input');
    }

    if (!Number.isInteger(size) || size < 0) {
      throw new CacheInputError('Invalid size input');
    }
  }

  /**
   * @method createAndInsertNewNode
   * @description Creates a new node and inserts it into the frequency list.
   */
  public createAndInsertNewNode(key: number, value: number, ttl: number | null): void {
    this.minFrequency = 1;
    const newNode = new ListItem({ key, value, frequency: this.minFrequency, ttl });
    this.insertNodeIntoFrequencyList(newNode);
  }

  /**
   * @method updateExistingNode
   * @description Updates an existing node and increases its frequency.
   */
  public updateExistingNode(node: ListItem, value: number, ttl: number | null): void {
    if (!node) {
      throw new Error('Invalid node input');
    }

    node.value = value;
    node.renewTTL(ttl || Date.now());
    this.updateFrequency(node);
  }

  /**
   * @method removeNodeFromFrequencyList
   * @description Removes a node from its frequency list.
   */
  public removeNodeFromFrequencyList(node: ListItem): void {
    if (!node) {
      throw new CacheInputError('Invalid node input');
    }

    const frequencyList = this.frequencyList.get(node.frequency);
    if (frequencyList) {
      frequencyList.removeNode(node);
    } else {
      this.logger.warn(
        `Attempted to remove node from non-existent frequency list (frequency: ${node.frequency})`
      );
    }
  }

  /**
   * @method updateFrequency
   * @description Increases the frequency of a node and updates the frequency list.
   */
  public updateFrequency(node: ListItem): void {
    if (!node) {
      throw new CacheInputError('Invalid node input');
    }

    let frequencyList = this.frequencyList.get(node.frequency);
    if (frequencyList) {
      frequencyList.removeNode(node);
      this.updateMinFrequency(node, frequencyList);
    } else {
      throw new CacheOperationsError(
        `Frequency list does not exist for frequency ${node.frequency}`
      );
    }

    node.frequency++;
    this.insertNodeIntoFrequencyList(node);
  }

  /**
   * @private
   * @method insertNodeIntoFrequencyList
   * @description Inserts a node into the frequency list.
   */
  private insertNodeIntoFrequencyList(node: ListItem): void {
    let frequencyList = this.frequencyList.get(node.frequency) ?? new DoublyLinkedList();
    frequencyList.insertAtHead(node);
    this.frequencyList.set(node.frequency, frequencyList);
    this.cache.set(node.key, node);
    this.size++;
  }

  /**
   * @private
   * @method updateMinFrequency
   * @description Updates the minimum frequency.
   */
  private updateMinFrequency(node: ListItem, frequencyList: DoublyLinkedList): void {
    if (!frequencyList.head.next!.next && node.frequency === this.minFrequency) {
      this.minFrequency++;
    }
  }
}
