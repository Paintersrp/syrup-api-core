import { BaseReportGenerator } from '../base/BaseReportGenerator';
import {
  AggregatedQueryMetrics,
  QueryFrequencies,
  QueryFrequency,
  QueryLogReport,
  QueryReportLogObject,
} from './types';

/**
 * @class QueryLogAnalyzer
 * @extends {BaseReportGenerator<QueryReportLogObject>}
 *
 * Class that provides functionality for analyzing query logs.
 * It provides methods to sort, filter, and analyze logs, as well as to
 * count parameters and aggregate metrics and frequencies.
 */
export class QueryReportGenerator extends BaseReportGenerator<QueryReportLogObject> {
  private readonly invalidTypes = new Set(['SHOWTABLES', 'SHOWINDEXES', 'DEFERRED']);

  private totalDuration = 0;
  private longestDuration = 0;
  private shortestDuration = Infinity;
  private totalValidQueries = 0;

  private typeMetrics: Map<string, AggregatedQueryMetrics> = new Map();
  private modelNameMetrics: Map<string, AggregatedQueryMetrics> = new Map();
  private frequencies: QueryFrequencies;

  private queryDurations: { [key: string]: number } = {};
  private durationBuckets: Record<string, number> = {};

  /**
   * Constructs a new instance of the QueryReportGenerator class.
   *
   * @param {string} logDir The directory containing the logs to be analyzed.
   */
  constructor(logDir: string) {
    super(logDir);

    this.setupFrequencies();
  }

  /**
   * Setups the frequencies object with initial values.
   */
  private setupFrequencies(): void {
    this.frequencies = {
      hourly: this.initializeFrequenciesForAllKeys(24),
      daily: this.initializeFrequenciesForAllKeys(31),
      weekly: this.initializeFrequenciesForAllKeys(5),
      monthly: this.initializeFrequenciesForAllKeys(12),
    };
  }

  /**
   * Initializes an object with provided number of keys.
   *
   * @param {number} numKeys - The number of keys to initialize in the object.
   * @returns {QueryFrequency} An object with keys initialized to 0.
   */
  private initializeFrequenciesForAllKeys(numKeys: number): QueryFrequency {
    const frequencies: { [key: number]: number } = {};

    for (let i = 0; i < numKeys; i++) {
      frequencies[i] = 0;
    }

    return frequencies;
  }

  /**
   * Analyzes the loaded logs and returns a report of various metrics.
   *
   * @public
   * @returns {Promise<QueryLogReport>} A report of various metrics about the loaded logs.
   * @throws Will throw an error if no logs have been loaded.
   */
  public async analyzeLogs(): Promise<QueryLogReport> {
    await this.loadLogs();

    const numBuckets = 10;
    const durationBucketCount = new Array(numBuckets).fill(0);

    this.logs.forEach((log) => {
      const transformedLog = this.transformLog(log);
      if (transformedLog) {
        const duration = transformedLog.context.duration || 0;

        this.accumulateMetrics(transformedLog);

        const range = (this.longestDuration - this.shortestDuration) / numBuckets;
        const bucketIndex = Math.floor((duration - this.shortestDuration) / range);
        durationBucketCount[bucketIndex]++;
      }
    });

    this.durationBuckets = this.createDurationBuckets(
      durationBucketCount,
      this.shortestDuration,
      this.longestDuration,
      numBuckets
    );

    return this.createReport();
  }

  /**
   * Transforms and filters the log based on its validity.
   * It also aggregates the query frequency based on the log's timestamp.
   *
   * @param {QueryReportLogObject} log - The log to transform.
   * @returns {QueryReportLogObject | null} The transformed log or null if the log is not valid.
   */
  private transformLog(log: QueryReportLogObject): QueryReportLogObject | null {
    if (!this.isValidLog(log)) {
      return null;
    }

    const duration = log.context.duration || 0;

    this.aggregateFrequencies(log, duration);

    return log;
  }

  /**
   * Accumulates metrics from a log. The log should be previously transformed.
   *
   * @param {QueryReportLogObject | null} log - The transformed log from which to accumulate metrics.
   */
  private accumulateMetrics(log: QueryReportLogObject | null): void {
    if (!log) return;

    const duration = log.context.duration || 0;
    this.totalDuration += duration;
    this.longestDuration = Math.max(this.longestDuration, duration);
    this.shortestDuration = Math.min(this.shortestDuration, duration);
    this.totalValidQueries++;

    this.aggregateMetrics(log, this.typeMetrics, 'type');
    this.aggregateMetrics(log, this.modelNameMetrics, 'modelName');
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

  /**
   * Aggregates metrics for a particular context field from a log
   * and updates the passed aggregate object with the metrics.
   *
   * @param {QueryReportLogObject} log - The log to aggregate metrics from.
   * @param {Map<string, AggregatedQueryMetrics>} aggregate - The aggregate object to update with metrics.
   * @param {keyof QueryReportLogObject['context']} field - The context field to aggregate metrics for.
   */
  private aggregateMetrics(
    log: QueryReportLogObject,
    aggregate: Map<string, AggregatedQueryMetrics>,
    field: keyof QueryReportLogObject['context']
  ): void {
    const key = log.context[field] as string;
    const duration = log.context.duration || 0;
    if (key) {
      const metrics = aggregate.get(key) || this.initializeEmptyMetrics();
      metrics.totalQueries++;
      metrics.totalDuration += duration;
      metrics.maxDuration = Math.max(metrics.maxDuration, duration);
      metrics.minDuration = Math.min(metrics.minDuration, duration);
      aggregate.set(key, metrics);
      if (metrics.totalQueries > 0) {
        metrics.avgDuration = metrics.totalDuration / metrics.totalQueries;
      }
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
   * Aggregates frequencies for different time divisions.
   *
   * @param {QueryReportLogObject} log - The log to aggregate frequencies from.
   * @param {number} duration - The duration of the log.
   */
  private aggregateFrequencies(log: QueryReportLogObject, duration: number): void {
    this.queryDurations[log.context.id] = duration;
    const date = new Date(log.time);

    this.frequencies.hourly[date.getHours()]++;
    this.frequencies.daily[date.getDate()]++;
    this.frequencies.weekly[Math.floor(date.getDate() / 7)]++;
    this.frequencies.monthly[date.getMonth()]++;
  }

  /**
   * Creates dynamic duration buckets after all logs have been processed.
   *
   * @private
   * @param {number[]} durationBucketCount - The count of logs in each duration bucket.
   * @param {number} minDuration - The minimum duration of all logs.
   * @param {number} maxDuration - The maximum duration of all logs.
   * @param {number} numBuckets - The number of buckets to create.
   * @returns {Record<string, number>} The duration buckets.
   */
  private createDurationBuckets(
    durationBucketCount: number[],
    minDuration: number,
    maxDuration: number,
    numBuckets: number
  ): Record<string, number> {
    const bucketSize = (maxDuration - minDuration) / numBuckets;
    const durationBuckets: Record<string, number> = {};

    for (let i = 0; i < numBuckets; i++) {
      const bucketStart = i * bucketSize + minDuration;
      const bucketEnd = bucketStart + bucketSize;
      const bucketLabel = `${bucketStart.toFixed(2)}-${bucketEnd.toFixed(2)}ms`;
      durationBuckets[bucketLabel] = durationBucketCount[i];
    }

    return durationBuckets;
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
      topModels: this.getTopKMap(this.modelNameMetrics, 3),
      slowestQueries: this.getTopK(this.queryDurations, 10),
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
    return this.frequencies;
  }

  /**
   * Extracts the top K entries from the provided metrics map based on the totalDuration.
   *
   * @param {Map<string, AggregatedQueryMetrics>} metrics - The metrics map to extract entries from.
   * @param {number} k - The number of entries to extract.
   * @returns {Array<{type: string, totalDuration: number}>} The top K entries.
   */
  protected getTopKMap(
    metrics: Map<string, AggregatedQueryMetrics>,
    k: number
  ): { type: string; totalDuration: number }[] {
    const heap: { type: string; totalDuration: number; avgDuration: number }[] = [];
    const entries = Array.from(metrics.entries());

    for (let i = 0; i < entries.length; i++) {
      const [type, metric] = entries[i];
      if (i < k) {
        heap.push({ type, totalDuration: metric.totalDuration, avgDuration: metric.avgDuration });
      } else if (metric.totalDuration > heap[0].totalDuration) {
        heap[0] = { type, totalDuration: metric.totalDuration, avgDuration: metric.avgDuration };
      }
      heap.sort((a, b) => a.totalDuration - b.totalDuration);
    }

    return heap.reverse();
  }
}
