import { ListItemOptions, ListItemOptionsArray } from '../../../types';

/**
 * Represents a list item with key-value pairs and frequency, also can track the expiration time and the previous and next item in the list.
 */
export class ListItem {
  public key: number;
  public value: number;
  public frequency: number; // Represents how often the list item is accessed or used
  public expires: number; // Timestamp representing when the list item expires
  public prev: ListItem | null; // Reference to the previous list item
  public next: ListItem | null; // Reference to the next list item

  /**
   * Creates a new ListItem.
   *
   * @param {number} options.key - The key of the list item.
   * @param {number} options.value - The value of the list item.
   * @param {number} options.frequency - The frequency of usage of the list item.
   * @param {number | null} [options.ttl=null] - Optional Time to Live (TTL) in milliseconds. If provided, it's added to the current timestamp to set the expiration time.
   */
  constructor({ key, value, frequency, ttl = null }: ListItemOptions) {
    if (key == null || value == null || frequency == null) {
      throw new Error('Key, value and frequency are required parameters');
    }

    this.key = key;
    this.value = value;
    this.frequency = frequency;
    this.prev = null;
    this.next = null;

    this.expires = Date.now() + (ttl ?? 0);
  }

  /**
   * Checks if the list item has expired.
   *
   * @returns {boolean} - Returns true if the list item has expired; otherwise, false.
   */
  public isExpired(now: number): boolean {
    return now >= this.expires;
  }

  /**
   * Renews the TTL for the list item, effectively extending its expiration time.
   *
   * @param {number} [ttl] - Time to Live (TTL) in milliseconds. If provided, it's added to the current timestamp to set the expiration time.
   */
  public renewTTL(ttl: number) {
    this.expires = Date.now() + ttl;
  }

  /**
   * Creates a copy of the ListItem.
   *
   * @param {number} [ttl] - Time to Live (TTL) in milliseconds. If provided, it's added to the current timestamp to set the expiration time.
   */
  public copy(ttl: number): ListItem {
    return new ListItem({ key: this.key, value: this.value, frequency: this.frequency, ttl });
  }

  /**
   * Creates a clone of the ListItem, copying the `prev` and `next` references too.
   *
   * @param {number} [ttl] - Time to Live (TTL) in milliseconds. If provided, it's added to the current timestamp to set the expiration time.
   */
  public clone(ttl: number = 0): ListItem {
    const clone = this.copy(ttl);
    clone.prev = this.prev;
    clone.next = this.next;
    return clone;
  }

  /**
   * Compares this ListItem with another for equality.
   *
   * @param {ListItem} other - The other ListItem to compare with.
   * @returns {boolean} - Returns true if the two ListItems are equal; otherwise, false.
   */
  public equals(other: ListItem): boolean {
    return this.key === other.key && this.value === other.value;
  }

  /**
   * Batch creates ListItems from an array of parameters.
   *
   * @param {ListItemOptionsArray} items - An array of parameters for ListItem creation.
   * @returns {Array<ListItem>} - Returns an array of created ListItems.
   *
   * @example
   * let items = ListItem.batchCreate([
   *  { key: 1, value: 'value1', frequency: 2, ttl: 5000 },
   *  { key: 2, value: 'value2', frequency: 3, ttl: null },
   *  // More items...
   * ]);
   */
  public static batchCreate(items: ListItemOptionsArray): Array<ListItem> {
    let listItems: Array<ListItem> = [];
    for (let item of items) {
      try {
        listItems.push(new ListItem(item));
      } catch (error: any) {
        console.error(`Failed to create ListItem: ${error.message}`);
      }
    }
    return listItems;
  }

  /**
   * Returns an iterator that iterates through the list in the forward direction.
   *
   * @returns {Generator<ListItem>}
   */
  public *iterator(): Generator<ListItem> {
    let current: ListItem | null = this;
    while (current) {
      yield current;
      current = current.next;
    }
  }

  /**
   * Returns an iterator that iterates through the list in the backward direction.
   *
   * @returns {Generator<ListItem>}
   */
  public *reverseIterator(): Generator<ListItem> {
    let current: ListItem | null = this;
    while (current) {
      yield current;
      current = current.prev;
    }
  }
}
