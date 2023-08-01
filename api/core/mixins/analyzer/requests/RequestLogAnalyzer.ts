import fs from 'fs';
import readline from 'readline';
import moment from 'moment';

import { RequestLogReport, RequestLogObject } from './types';

/**
 * Class representing a log analyzer for request logs.
 */
export class RequestLogAnalyzer {
  private logs: RequestLogObject[] = [];

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
   * Analyze the loaded logs and return a report of various metrics.
   *
   * @public
   * @returns {RequestLogReport} A report of various metrics about the loaded logs.
   * @throws Will throw an error if no logs have been loaded.
   */
  public analyzeLogs(): RequestLogReport {
    const totalRequests = this.logs.length;
    let totalDuration = 0;
    let totalResponseSize = 0;
    let errorCount = 0;
    let shortestDuration = Infinity;
    let longestDuration = 0;

    const userIds: string[] = [];
    const paths: string[] = [];
    const statusCodes: number[] = [];
    const methods: string[] = [];
    const userAgents: string[] = [];
    const ipAddresses: string[] = [];
    const requestFrequency: Record<string, number> = {};

    this.logs.forEach((log) => {
      const userId = typeof log.user === 'string' ? log.user : log.user?.id;
      if (userId) userIds.push(String(userId));

      paths.push(log.path);

      if (log.status) statusCodes.push(log.status);

      methods.push(log.method);
      userAgents.push(log.userAgent);
      ipAddresses.push(log.ipAddress);

      if (log.responseSize) totalResponseSize += log.responseSize;

      if (log.duration) {
        totalDuration += log.duration;
        longestDuration = Math.max(longestDuration, log.duration);
        shortestDuration = Math.min(shortestDuration, log.duration);
      }

      const hour = moment(log.timestamp).format('HH');
      requestFrequency[hour] = (requestFrequency[hour] || 0) + 1;

      if ('error' in log) errorCount++;
    });

    const userIdsCount = this.countItems(userIds);
    const pathsCount = this.countItems(paths);
    const statusCodesCount = this.countItems(statusCodes);
    const methodsCount = this.countItems(methods);
    const userAgentsCount = this.countItems(userAgents);

    return {
      totalRequests,
      averageRequestDuration: totalDuration / totalRequests,
      numberOfUsers: Object.keys(userIdsCount).length,
      topEndpoints: this.getTop(pathsCount),
      topUsers: this.getTop(userIdsCount),
      errorCount,
      requestFrequency,
      statusCodes: statusCodesCount,
      topStatusCodes: this.getTop(statusCodesCount).map(Number),
      longestDuration,
      shortestDuration: isFinite(shortestDuration) ? shortestDuration : 0,
      requestsByMethod: methodsCount,
      topUserAgents: this.getTop(userAgentsCount),
      averageResponseSize: totalResponseSize / totalRequests,
      uniqueIPs: new Set(ipAddresses).size,
    };
  }

  /**
   * Count the occurrences of items in an array and return a map of item to count.
   *
   * @private
   * @param {any[]} array - The array of items to count.
   * @returns {Record<string, number>} A map from item to count.
   */
  private countItems(array: any[]): Record<string, number> {
    return array.reduce((countMap, item) => {
      countMap[item] = (countMap[item] || 0) + 1;
      return countMap;
    }, {} as Record<string, number>);
  }

  /**
   * Get the top N items with the highest counts from a count map.
   *
   * @private
   * @param {Record<string, number>} countMap - A map from item to count.
   * @param {number} [limit=5] - The maximum number of items to return.
   * @returns {string[]} The top N items with the highest counts.
   */
  private getTop(countMap: Record<string, number>, limit = 5): string[] {
    return Object.entries(countMap)
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, limit)
      .map(([item]) => item);
  }
}
