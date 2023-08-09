import { QueryReportGenerator } from '../QueryReportGenerator';
import { AggregatedQueryMetrics, QueryReportLogObject } from '../types';

export class QueryMetricsAggregator {
  private generator: QueryReportGenerator;

  constructor(generator: QueryReportGenerator) {
    this.generator = generator;
  }

  /**
   * Aggregates metrics for a particular context field from a log
   * and updates the passed aggregate object with the metrics.
   *
   * @param {QueryReportLogObject} log - The log to aggregate metrics from.
   * @param {Map<string, AggregatedQueryMetrics>} aggregate - The aggregate object to update with metrics.
   * @param {keyof QueryReportLogObject['context']} field - The context field to aggregate metrics for.
   */
  public aggregateMetrics(
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
   * Accumulates metrics from a log. The log should be previously transformed.
   *
   * @param {QueryReportLogObject | null} log - The transformed log from which to accumulate metrics.
   */
  public accumulateMetrics(log: QueryReportLogObject | null): void {
    if (!log) return;

    const duration = log.context.duration || 0;
    this.generator.totalDuration += duration;
    this.generator.longestDuration = Math.max(this.generator.longestDuration, duration);
    this.generator.shortestDuration = Math.min(this.generator.shortestDuration, duration);
    this.generator.totalValidQueries++;

    this.aggregateMetrics(log, this.generator.typeMetrics, 'type');
    this.aggregateMetrics(log, this.generator.modelNameMetrics, 'modelName');
  }
}
