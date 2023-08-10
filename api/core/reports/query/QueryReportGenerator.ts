import { BinaryHeap } from '../../structures/BinaryHeap/BinaryHeap';
import { BaseReportGenerator } from '../base';
import { QueryFrequencyAggregator, QueryLogTransformer, QueryMetricsAggregator } from './services';
import { AggregatedQueryMetrics, QueryLogReport, QueryReportLogObject } from './types';

/**
 * @class QueryLogAnalyzer
 * @extends {BaseReportGenerator<QueryReportLogObject>}
 *
 * Class that provides functionality for analyzing query logs.
 * It provides methods to sort, filter, and analyze logs, as well as to
 * count parameters and aggregate metrics and frequencies.
 */
export class QueryReportGenerator extends BaseReportGenerator<QueryReportLogObject> {
  public totalDuration = 0;
  public longestDuration = 0;
  public shortestDuration = Infinity;
  public totalValidQueries = 0;

  public typeMetrics: Map<string, AggregatedQueryMetrics> = new Map();
  public modelNameMetrics: Map<string, AggregatedQueryMetrics> = new Map();

  private durationBuckets: Record<string, number> = {};

  private logTransformer: QueryLogTransformer;
  private metricsAggregator: QueryMetricsAggregator;
  private frequencyAggregator: QueryFrequencyAggregator;
  // private queryReportCreator: QueryReportCreator;

  /**
   * Constructs a new instance of the QueryReportGenerator class.
   *
   * @param {string} logDir The directory containing the logs to be analyzed.
   */
  constructor(logDir: string) {
    super(logDir);

    this.frequencyAggregator = new QueryFrequencyAggregator();
    this.logTransformer = new QueryLogTransformer(this.frequencyAggregator);

    this.metricsAggregator = new QueryMetricsAggregator(this);
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
      const transformedLog = this.logTransformer.transformLog(log);
      if (transformedLog) {
        const duration = transformedLog.context.duration || 0;

        this.metricsAggregator.accumulateMetrics(transformedLog);

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
    const queryDurations = this.frequencyAggregator.getQueryDurations();
    const shortestDuration = isFinite(this.shortestDuration) ? this.shortestDuration : 0;

    return {
      totalQueries: this.totalValidQueries,
      averageQueryDuration: this.getAverageQueryDuration(),
      longestDuration: this.longestDuration,
      shortestDuration: shortestDuration,
      queriesByType: this.typeMetrics,
      queriesByModel: this.modelNameMetrics,
      queryFrequency: this.frequencyAggregator.getFrequencies(),
      durationBuckets: this.durationBuckets,
      topModels: this.getSlowestQueries(this.modelNameMetrics, 3),
      slowestQueries: this.getTopK(queryDurations, 10),
    };
  }

  /**
   * Returns the average query duration for the report
   *
   * @returns {number} Average query duration
   */
  public getAverageQueryDuration(): number {
    return this.totalValidQueries > 0 ? this.totalDuration / this.totalValidQueries : 0;
  }

  /**
   * Extracts the top K entries from the provided metrics map based on the totalDuration.
   *
   * @param {Map<string, AggregatedQueryMetrics>} metrics - The metrics map to extract entries from.
   * @param {number} k - The number of entries to extract.
   * @returns {Array<{type: string, totalDuration: number}>} The top K entries.
   */
  public getSlowestQueries(
    metrics: Map<string, any>,
    k: number
  ): { type: string; totalDuration: number; avgDuration: number }[] {
    const heap = new BinaryHeap<{ type: string; totalDuration: number; avgDuration: number }>(
      (a, b) => a.totalDuration - b.totalDuration
    );

    for (const [type, metric] of metrics) {
      const item = { type, totalDuration: metric.totalDuration, avgDuration: metric.avgDuration };
      if (heap.size() < k) {
        heap.push(item);
      } else if (metric.totalDuration > heap.peek().totalDuration) {
        heap.pop();
        heap.push(item);
      }
    }

    const topKItems: { type: string; totalDuration: number; avgDuration: number }[] = [];
    while (heap.size() > 0) {
      topKItems.push(heap.pop());
    }
    return topKItems.reverse();
  }
}
