import { ErrorLogObject, ErrorLogMetrics, ErrorLogReport } from './types';
import { BaseReportGenerator } from '../base/BaseReportGenerator';
import { ErrorSeverity } from './enums';

/**
 * `ErrorReportGenerator` class provides functionalities to analyze error logs
 *
 * Example Usage:
 * ```typescript
 * const generator = new ErrorReportGenerator(logsArray);
 * const report = await generator.analyzeLogs();
 * console.log(report);
 * ```
 *
 * @extends {BaseReportGenerator<ErrorLogObject>}
 */
export class ErrorReportGenerator extends BaseReportGenerator<ErrorLogObject> {
  private static readonly BATCH_SIZE = 1000;

  /**
   * Retrieves errors that occurred within a specific time range.
   * @param {Date} start - The start of the time range.
   * @param {Date} end - The end of the time range.
   * @return {ErrorLogObject[]}
   */
  public getErrorsWithinTimeRange(start: Date, end: Date): ErrorLogObject[] {
    return this.logs.filter((log) => {
      const logTime = new Date(log.time);
      return logTime >= start && logTime <= end;
    });
  }

  /**
   * Analyzes the logs and generates a report.
   * @return {Promise<ErrorLogReport>}
   */
  public async analyzeLogs(): Promise<ErrorLogReport> {
    await this.loadLogs();
    const metrics = this.collectMetrics();
    return this.createReport(metrics);
  }

  /**
   * Collects metrics from the logs.
   * @private
   * @return {ErrorLogMetrics}
   */
  private collectMetrics(): ErrorLogMetrics {
    const metrics = this.initializeMetrics();

    for (let i = 0; i < this.logs.length; i += ErrorReportGenerator.BATCH_SIZE) {
      const batch = this.logs.slice(i, i + ErrorReportGenerator.BATCH_SIZE);
      for (const log of batch) {
        this.updateMetrics(log, metrics);
      }
    }

    return metrics;
  }

  /**
   * Initializes the metrics object.
   * @private
   * @return {ErrorLogMetrics}
   */
  private initializeMetrics(): ErrorLogMetrics {
    return {
      totalErrors: 0,
      errorCodes: {},
      paths: {},
      methods: {},
      userAgents: {},
      ipAddresses: {},
      errorCountByHour: {},
      errorCountByDay: {},
      classifications: {},
      severityCounts: {},
    };
  }

  /**
   * Updates the metrics object based on a log.
   * @private
   * @param {ErrorLogObject} log
   * @param {ErrorLogMetrics} metrics
   */
  private updateMetrics(log: ErrorLogObject, metrics: ErrorLogMetrics): void {
    const { status, path, method, userAgent, ipAddress, time } = log;

    const hour = this.getHour(time);
    const classification = this.classifyError(log);
    const severity = this.getSeverityForError(log);

    metrics.totalErrors++;
    metrics.errorCodes[status] = (metrics.errorCodes[status] || 0) + 1;
    metrics.paths[path] = (metrics.paths[path] || 0) + 1;
    metrics.methods[method] = (metrics.methods[method] || 0) + 1;
    metrics.userAgents[userAgent] = (metrics.userAgents[userAgent] || 0) + 1;
    metrics.ipAddresses[ipAddress] = (metrics.ipAddresses[ipAddress] || 0) + 1;

    metrics.errorCountByHour[hour] = (metrics.errorCountByHour[hour] || 0) + 1;
    metrics.errorCountByDay[this.getDay(time)] =
      (metrics.errorCountByDay[this.getDay(time)] || 0) + 1;
    metrics.classifications[classification] = (metrics.classifications[classification] || 0) + 1;
    metrics.severityCounts[severity] = (metrics.severityCounts[severity] || 0) + 1;
  }

  /**
   * Creates a report based on the collected metrics.
   * @private
   * @param {ErrorLogMetrics} metrics
   * @return {ErrorLogReport}
   */
  private createReport(metrics: ErrorLogMetrics): ErrorLogReport {
    return {
      totalErrors: metrics.totalErrors,
      uniqueIPs: Object.keys(metrics.ipAddresses).length,
      errorCodes: metrics.errorCodes,
      topErrorEndpoints: this.getTopWithCount(metrics.paths),
      errorsByMethod: metrics.methods,
      topErrorUserAgents: this.getTopWithCount(metrics.userAgents),
      peakErrorHour: this.getPeakHour(metrics.errorCountByHour),
      errorCountByHour: metrics.errorCountByHour,
      errorCountByDay: metrics.errorCountByDay,
      classifications: metrics.classifications,
      severityCounts: metrics.severityCounts,
    };
  }

  private getHour(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.getUTCHours().toString();
  }

  private getDay(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.getUTCDate().toString();
  }

  private getPeakHour(frequency: { [key: string]: number }): string {
    let max = 0;
    let peakHour = '';
    for (const key in frequency) {
      if (frequency[key] > max) {
        max = frequency[key];
        peakHour = key;
      }
    }
    return peakHour;
  }

  private getTopWithCount(
    items: { [key: string]: number },
    limit: number = 5
  ): { [key: string]: number } {
    // Assuming values range from 0 to some MAX_VALUE
    const MAX_VALUE = 1000; // Adjust based on your knowledge of the data
    const buckets: string[][] = Array.from({ length: MAX_VALUE + 1 }, () => []);

    for (const [key, value] of Object.entries(items)) {
      if (value <= MAX_VALUE) {
        // Ensure value is within the expected range
        buckets[value].push(key);
      }
    }

    const result: { [key: string]: number } = {};
    for (let i = MAX_VALUE; i >= 0 && Object.keys(result).length < limit; i--) {
      for (const key of buckets[i]) {
        if (Object.keys(result).length < limit) {
          result[key] = i;
        } else {
          break;
        }
      }
    }

    return result;
  }

  // improve with domain knowledge..
  private classifyError(log: ErrorLogObject): string {
    if (log.errorMessage) {
      if (log.errorMessage.includes('timeout')) {
        return 'Timeout Error';
      }

      if (log.errorMessage.includes('database')) {
        return 'Database Error';
      }
    }

    return 'General Error';
  }

  // improve with domain knowledge..
  private getSeverityForError(log: ErrorLogObject): ErrorSeverity {
    switch (log.status) {
      case 404:
        return ErrorSeverity.LOW;
      case 500:
        return ErrorSeverity.CRITICAL;
      default:
        return ErrorSeverity.MEDIUM;
    }
  }
}
