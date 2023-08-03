import fs from 'fs';
import readline from 'readline';
import { AggregatedQuery } from './query/types';

/**
 * Class representing a log analyzer for request logs.
 */
export abstract class BaseReportGenerator<T> {
  protected logs: T[] = [];

  /**
   * Load logs from a file and store them internally.
   *
   * @public
   * @param {string} filePath - The path to the log file.
   * @returns {Promise<void>} Resolves when the logs have been loaded.
   * @throws Will throw an error if the logs cannot be loaded.
   */
  public async loadLog(filePath: string): Promise<void> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        try {
          this.logs.push(JSON.parse(line));
        } catch (err: any) {
          console.error(`Failed to parse log line: ${line}. Error: ${err.message}`);
        }
      }
    } catch (err: any) {
      throw new Error(`Failed to load logs: ${err.message}`);
    }
  }

  /**
   * Clear the loaded logs.
   *
   * @public
   * @returns {void}
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Count the occurrences of items in an array and return a map of item to count.
   *
   * @protected
   * @param {any[]} array - The array of items to count.
   * @returns {Record<string, number>} A map from item to count.
   */
  protected countItems(array: any[]): Record<string, number> {
    return array.reduce((countMap, item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      return countMap;
    }, {} as Record<string, number>);
  }

  /**
   * Get the top N items with the highest counts from a count map.
   *
   * @protected
   * @param {Record<string, number>} countMap - A map from item to count.
   * @param {number} [limit=5] - The maximum number of items to return.
   * @returns {string[]} The top N items with the highest counts.
   */
  protected getTop(
    countMap: Record<string, number> | AggregatedQuery,
    limit: number = 5
  ): string[] {
    return Object.entries(countMap)
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, limit)
      .map(([item]) => item);
  }
}
