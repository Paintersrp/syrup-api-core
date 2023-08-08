import fs from 'fs';
import readline from 'readline';
import { AggregatedQuery } from '../query/types';

/**
 * Class representing a log analyzer for request logs.
 */
export abstract class BaseReportGenerator<T> {
  protected logDir: string;
  protected logs: T[] = [];

  constructor(logDir: string) {
    this.logDir = logDir;
  }

  /**
   * Load logs from a file and store them internally.
   *
   * @public
   * @param {string} filePath - The path to the log file.
   * @returns {Promise<void>} Resolves when the logs have been loaded.
   * @throws Will throw an error if the logs cannot be loaded.
   */
  public async loadLogs(filePath?: string): Promise<void> {
    try {
      const fileStream = fs.createReadStream(filePath ? filePath : this.logDir);
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
    countMap: Record<string, number> | AggregatedQuery | Record<number, number>,
    limit: number = 5
  ): string[] {
    return Object.entries(countMap)
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, limit)
      .map(([item]) => item);
  }

  protected getTopK(items: { [id: string]: number }, k: number): { id: string; ms: number }[] {
    const heap: { id: string; ms: number }[] = [];
    const entries = Object.entries(items);

    for (let i = 0; i < entries.length; i++) {
      const [id, ms] = entries[i];
      if (i < k) {
        heap.push({ id, ms });
      } else if (ms > heap[0].ms) {
        heap[0] = { id, ms };
      }
      heap.sort((a, b) => a.ms - b.ms);
    }

    return heap.reverse();
  }

  protected addToListIfUnique(list: string[], item: string): void {
    if (!list.includes(item)) {
      list.push(item);
    }
  }

  /**
   * Exports the error report in JSON format.
   * @param {ErrorLogReport} report
   * @return {string}
   */
  private exportAsJSON(report: any): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Exports the error report in CSV format.
   * @param {ErrorLogReport} report
   * @return {string}
   */
  private exportAsCSV(report: any): string {
    const rows: string[] = [];

    for (const [key, value] of Object.entries(report)) {
      if (typeof value === 'number' || typeof value === 'string') {
        rows.push(`${key},${value}`);
      } else if (typeof value === 'object') {
        rows.push(
          `${key},${Object.entries(value!)
            .map(([k, v]) => `${k}:${v}`)
            .join(',')}`
        );
      }
    }

    return rows.join('\n');
  }

  /**
   * Exports the error report in the given format.
   * @param {ErrorLogReport} report
   * @param {'json' | 'csv'} format
   * @return {string}
   */
  public exportReport(report: any, format: 'json' | 'csv'): string {
    switch (format) {
      case 'json':
        return this.exportAsJSON(report);
      case 'csv':
        return this.exportAsCSV(report);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}
