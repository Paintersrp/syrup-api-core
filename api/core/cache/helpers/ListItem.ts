/**
 * Represents a list item with key-value pairs and frequency, also can track the expiration time and the previous and next item in the list.
 */
export class ListItem {
  public key: number; // Represents the key of the list item
  public value: number; // Represents the value of the list item
  public frequency: number; // Represents how often the list item is accessed or used
  public expires: number; // Timestamp representing when the list item expires
  public prev: ListItem | null; // Reference to the previous list item
  public next: ListItem | null; // Reference to the next list item

  /**
   * Creates a new ListItem.
   *
   * @param {number} key - The key of the list item.
   * @param {number} value - The value of the list item.
   * @param {number} frequency - The frequency of usage of the list item.
   * @param {number | null} [ttl=null] - Optional Time to Live (TTL) in milliseconds. If provided, it's added to the current timestamp to set the expiration time.
   */
  constructor(key: number, value: number, frequency: number, ttl: number | null = null) {
    this.key = key;
    this.value = value;
    this.frequency = frequency;
    this.prev = null;
    this.next = null;

    if (ttl) {
      this.expires = Date.now() + ttl; // If TTL is provided, calculate the expiration time
    } else {
      this.expires = Date.now(); // If no TTL is provided, the item doesn't expire
    }
  }

  /**
   * Checks if the list item has expired.
   *
   * @returns {boolean} - Returns true if the list item has expired; otherwise, false.
   */
  public isExpired(now: number): boolean {
    return now >= this.expires;
  }
}
