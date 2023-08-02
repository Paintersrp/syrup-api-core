import { LogAnalyzer } from '../base/LogAnalyzer';
import {
  AggregatedQuery,
  AggregatedQueryMetrics,
  QueryFrequencies,
  QueryFrequency,
  QueryLogReport,
  QueryReportLogObject,
} from './types';

/**
 * @class QueryLogAnalyzer
 * @extends {LogAnalyzer<QueryReportLogObject>}
 *
 * Class that provides functionality for analyzing query logs.
 * It provides methods to sort, filter, and analyze logs, as well as to
 * count parameters and aggregate metrics and frequencies.
 */
export class QueryLogAnalyzer extends LogAnalyzer<QueryReportLogObject> {
  private totalDuration = 0;
  private longestDuration = 0;
  private shortestDuration = Infinity;
  private totalValidQueries = 0;

  private typeMetrics: AggregatedQuery = {};
  private modelNameMetrics: AggregatedQuery = {};

  private hourlyFrequency: QueryFrequency = {};
  private dailyFrequency: QueryFrequency = {};
  private weeklyFrequency: QueryFrequency = {};
  private monthlyFrequency: QueryFrequency = {};

  private queryDurations: Record<string, number> = {};
  private durationBuckets: Record<string, number> = {};

  /**
   * Analyzes the loaded logs and returns a report of various metrics.
   *
   * @public
   * @returns {QueryLogReport} A report of various metrics about the loaded logs.
   * @throws Will throw an error if no logs have been loaded.
   */
  public analyzeLogs(): QueryLogReport {
    for (const log of this.logs) {
      this.collectMetrics(log);
    }

    this.createDurationBuckets(10);
    this.calculateAverageDurations(this.typeMetrics);
    this.calculateAverageDurations(this.modelNameMetrics);

    return this.createReport();
  }

  /**
   * Collects various metrics from a log
   *
   * @private
   * @param {QueryReportLogObject} log - The log from which to collect metrics.
   */
  private collectMetrics(log: QueryReportLogObject) {
    if (!this.isValidLog(log)) {
      return;
    }

    const duration = log.context.duration || 0;
    this.totalDuration += duration;
    this.longestDuration = Math.max(this.longestDuration, duration);
    this.shortestDuration = Math.min(this.shortestDuration, duration);
    this.queryDurations[log.context.id] = duration;

    this.aggregateMetrics(log, this.typeMetrics, 'type');
    this.aggregateMetrics(log, this.modelNameMetrics, 'modelName');

    this.aggregateHourlyFrequency(log);
    this.aggregateDailyFrequency(log);
    this.aggregateWeeklyFrequency(log);
    this.aggregateMonthlyFrequency(log);

    this.totalValidQueries++;
  }

  /**
   * Checks if a log is valid based on its type and SQL content.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to check.
   * @returns {boolean} True if the log is valid, false otherwise.
   */
  private isValidLog(log: QueryReportLogObject): boolean {
    return (
      !['SHOWTABLES', 'SHOWINDEXES', 'DEFERRED'].includes(log.context.type) &&
      log.context.sql !== 'SELECT 1+1 AS result'
    );
  }

  /**
   * Aggregates metrics for a particular context field from a log
   * and updates the passed aggregate object with the metrics.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to aggregate metrics from.
   * @param {AggregatedQuery} aggregate - The aggregate object to update with metrics.
   * @param {keyof QueryReportLogObject['context']} field - The context field to aggregate metrics for.
   */
  private aggregateMetrics(
    log: QueryReportLogObject,
    aggregate: AggregatedQuery,
    field: keyof QueryReportLogObject['context']
  ): void {
    const key = log.context[field];
    const duration = log.context.duration || 0;
    if (key) {
      const metrics = aggregate[key] || this.initializeEmptyMetrics();
      metrics.totalQueries++;
      metrics.totalDuration += duration;
      metrics.maxDuration = Math.max(metrics.maxDuration, duration);
      metrics.minDuration = Math.min(metrics.minDuration, duration);
      aggregate[key] = metrics;
    }
  }

  /**
   * Initializes and returns an empty metrics object.
   *
   * @private
   * @returns {AggregatedQueryMetrics} The newly initialized empty metrics object.
   */
  private initializeEmptyMetrics(): AggregatedQueryMetrics {
    return {
      totalQueries: 0,
      totalDuration: 0,
      avgDuration: 0,
      maxDuration: 0,
      minDuration: Infinity,
    };
  }

  /**
   * Aggregates the frequency of queries based on the hour of their timestamp.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to aggregate frequency from.
   */
  private aggregateHourlyFrequency(log: QueryReportLogObject): void {
    const hour = new Date(log.time).getHours();
    this.hourlyFrequency[hour] = (this.hourlyFrequency[hour] || 0) + 1;
  }

  /**
   * Aggregates the frequency of queries based on the day of their timestamp.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to aggregate frequency from.
   */
  private aggregateDailyFrequency(log: QueryReportLogObject): void {
    const day = new Date(log.time).getDate();
    this.dailyFrequency[day] = (this.dailyFrequency[day] || 0) + 1;
  }

  /**
   * Aggregates the frequency of queries based on the week of their timestamp.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to aggregate frequency from.
   */
  private aggregateWeeklyFrequency(log: QueryReportLogObject): void {
    const week = Math.floor(new Date(log.time).getDate() / 7);
    this.weeklyFrequency[week] = (this.weeklyFrequency[week] || 0) + 1;
  }

  /**
   * Aggregates the frequency of queries based on the month of their timestamp.
   *
   * @private
   * @param {QueryReportLogObject} log - The log to aggregate frequency from.
   */
  private aggregateMonthlyFrequency(log: QueryReportLogObject): void {
    const month = new Date(log.time).getMonth();
    this.monthlyFrequency[month] = (this.monthlyFrequency[month] || 0) + 1;
  }

  /**
   * Creates dynamic duration buckets after all logs have been processed.
   *
   * @private
   * @param {number} numBuckets - The number of buckets to create.
   */
  private createDurationBuckets(numBuckets: number): void {
    const durations = Object.values(this.queryDurations);
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    const bucketSize = (maxDuration - minDuration) / numBuckets;

    durations.forEach((duration) => {
      const bucketIndex = Math.floor((duration - minDuration) / bucketSize);
      const bucketStart = bucketIndex * bucketSize + minDuration;
      const bucketEnd = bucketStart + bucketSize;
      const bucketLabel = `${bucketStart.toFixed(2)}-${bucketEnd.toFixed(2)}ms`;
      this.durationBuckets[bucketLabel] = (this.durationBuckets[bucketLabel] || 0) + 1;
    });
  }

  /**
   * Calculates average duration of queries the total queries and accumulated duration.
   *
   * @private
   * @param {AggregatedQuery} metrics - The metrics to calculate average duration for.
   */
  private calculateAverageDurations(metrics: AggregatedQuery): void {
    for (const key in metrics) {
      if (metrics[key].totalQueries > 0) {
        metrics[key].avgDuration = metrics[key].totalDuration / metrics[key].totalQueries;
      }
    }
  }

  /**
   * Constructs a `QueryLogReport` based on the provided metrics.
   *
   * @private
   * @returns {QueryLogReport} A report of various metrics about the loaded logs.
   */
  private createReport(): QueryLogReport {
    return {
      totalQueries: this.totalValidQueries,
      averageQueryDuration: this.getAverageQueryDuration(),
      longestDuration: this.longestDuration,
      shortestDuration: isFinite(this.shortestDuration) ? this.shortestDuration : 0,
      queriesByType: this.typeMetrics,
      queriesByModel: this.modelNameMetrics,
      queryFrequency: this.getQueryFrequency(),
      durationBuckets: this.durationBuckets,
      top10QueryTypes: this.getTop(this.typeMetrics, 10),
      top10SlowestQueries: this.getTop(this.queryDurations, 10),
    };
  }

  /**
   * Returns the average query duration for the report
   *
   * @private
   * @returns {number} Average query duration
   */
  private getAverageQueryDuration(): number {
    return this.totalValidQueries > 0 ? this.totalDuration / this.totalValidQueries : 0;
  }

  /**
   * Returns the QueryFrequencies object for the report
   *
   * @private
   * @returns {QueryFrequencies} QueryFrequencies object
   */
  private getQueryFrequency(): QueryFrequencies {
    return {
      hourly: this.hourlyFrequency,
      daily: this.dailyFrequency,
      weekly: this.weeklyFrequency,
      monthly: this.monthlyFrequency,
    };
  }
}
