import { QueryFrequencyAggregator } from './QueryFrequencyAggregator';
import { QueryReportLogObject } from '../types';

export class QueryLogTransformer {
  private readonly invalidTypes = new Set(['SHOWTABLES', 'SHOWINDEXES', 'DEFERRED']);
  private frequencyAggregator: QueryFrequencyAggregator;

  constructor(frequencyAggregator: QueryFrequencyAggregator) {
    this.frequencyAggregator = frequencyAggregator;
  }

  /**
   * Transforms and filters the log based on its validity.
   * It also aggregates the query frequency based on the log's timestamp.
   *
   * @param {QueryReportLogObject} log - The log to transform.
   * @returns {QueryReportLogObject | null} The transformed log or null if the log is not valid.
   */
  public transformLog(log: QueryReportLogObject): QueryReportLogObject | null {
    if (!this.isValidLog(log)) {
      return null;
    }

    const duration = log.context.duration || 0;

    this.frequencyAggregator.aggregateFrequencies(log, duration);

    return log;
  }

  /**
   * Checks if a log is valid based on its type and SQL content.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to check.
   * @returns {boolean} True if the log is valid, false otherwise.
   */
  private isValidLog(log: QueryReportLogObject): boolean {
    return !this.invalidTypes.has(log.context.type) && log.context.sql !== 'SELECT 1+1 AS result';
  }
}
