import { BinaryHeap } from '../../../lib/structures/BinaryHeap';
import { MinHeap } from '../../../lib/structures/MinHeap';

/**
 * Class for performing various operations on reports.
 */
export class ReportOperations {
  /**
   * Count the occurrences of items in an array and return a map of item to count.
   *
   * @param {any[]} array - The array of items to count.
   * @returns {Record<string, number>} A map from item to count.
   */
  public countItems(array: any[]): Record<string, number> {
    return array.reduce((countMap, item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      return countMap;
    }, {} as Record<string, number>);
  }

  /**
   * Adds an item to a list if the item is not already in the list.
   * @param {string[]} list - The list to which the item should be added.
   * @param {string} item - The item to add.
   */
  public addIfUnique(list: string[], item: string): void {
    if (!list.includes(item)) {
      list.push(item);
    }
  }

  /**
   * Get the top N items with the highest counts from a count map.
   *
   * @param {Record<string, number>} countMap - A map from item to count.
   * @param {number} [limit=5] - The maximum number of items to return.
   * @returns {string[]} The top N items with the highest counts.
   */
  public getTop(
    countMap: Record<string, number> | Record<number, number>,
    limit: number = 5
  ): string[] {
    return Object.entries(countMap)
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, limit)
      .map(([item]) => item);
  }

  /**
   * Returns the top K items with the highest values from an input map.
   * @param {Record<string, number>} items - The input map.
   * @param {number} k - The maximum number of items to return.
   * @returns {Array<{ id: string; ms: number }>} The top K items with the highest values.
   */
  public getTopK(items: { [id: string]: number }, k: number): { id: string; ms: number }[] {
    const heap = new BinaryHeap<{ id: string; ms: number }>((a, b) => a.ms - b.ms);
    const entries = Object.entries(items);

    for (let i = 0; i < entries.length; i++) {
      const [id, ms] = entries[i];
      if (heap.size() < k) {
        heap.push({ id, ms });
      } else if (ms > heap.peek().ms) {
        heap.pop();
        heap.push({ id, ms });
      }
    }

    const sortedItems: { id: string; ms: number }[] = [];
    while (heap.size() > 0) {
      sortedItems.push(heap.pop());
    }
    return sortedItems.reverse();
  }

  public getTopMap(map: Map<string, number>, topN: number): [string, number][] {
    const heap = new MinHeap();

    map.forEach((count, ip) => {
      heap.add([count, ip]);
      if (heap.size() > topN) {
        heap.remove();
      }
    });

    const result: [string, number][] = [];
    while (heap.size() > 0) {
      const [count, ip] = heap.remove();
      result.push([ip, count]);
    }

    return result.reverse();
  }
}
