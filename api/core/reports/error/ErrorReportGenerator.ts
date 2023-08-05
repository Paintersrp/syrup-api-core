import { ErrorLogObject, ErrorLogMetrics, ErrorLogReport } from './types';
import { BaseReportGenerator } from '../BaseReportGenerator';

/**
 * `ErrorLogAnalyzer` class provides functionalities to analyze error logs.
 * @extends {BaseReportGenerator<ErrorLogObject>}
 */
export class ErrorReportGenerator extends BaseReportGenerator<ErrorLogObject> {
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
    for (const log of this.logs) {
      this.updateMetrics(log, metrics);
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
      errorLevels: {},
      errorFrequency: {},
      errorCountByHour: {},
      errorCountByDay: {},
      errorSources: [],
      errorMessages: [],
    };
  }

  /**
   * Updates the metrics object based on a log.
   * @private
   * @param {ErrorLogObject} log
   * @param {ErrorLogMetrics} metrics
   */
  private updateMetrics(log: ErrorLogObject, metrics: ErrorLogMetrics): void {
    metrics.totalErrors++;
    metrics.errorCodes[log.status] = (metrics.errorCodes[log.status] || 0) + 1;
    metrics.paths[log.path] = (metrics.paths[log.path] || 0) + 1;
    metrics.methods[log.method] = (metrics.methods[log.method] || 0) + 1;
    metrics.userAgents[log.userAgent] = (metrics.userAgents[log.userAgent] || 0) + 1;
    metrics.ipAddresses[log.ipAddress] = (metrics.ipAddresses[log.ipAddress] || 0) + 1;
    metrics.errorLevels[log.errorLevel] = (metrics.errorLevels[log.errorLevel] || 0) + 1;
    metrics.errorFrequency[this.getErrorHour(log.timestamp)] =
      (metrics.errorFrequency[this.getErrorHour(log.timestamp)] || 0) + 1;
    metrics.errorCountByHour[this.getHour(log.timestamp)] =
      (metrics.errorCountByHour[this.getHour(log.timestamp)] || 0) + 1;
    metrics.errorCountByDay[this.getDay(log.timestamp)] =
      (metrics.errorCountByDay[this.getDay(log.timestamp)] || 0) + 1;
    metrics.errorSources.push(log.path);
    metrics.errorMessages.push(log.errorMessage);
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
      errorLevels: metrics.errorLevels,
      peakErrorHour: this.getPeakHour(metrics.errorFrequency),
      errorCountByHour: metrics.errorCountByHour,
      errorCountByDay: metrics.errorCountByDay,
      errorSources: metrics.errorSources,
      errorMessages: metrics.errorMessages,
    };
  }

  private getErrorHour(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.getUTCHours().toString();
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
    return Object.entries(items)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .reduce((obj, [key, val]) => {
        obj[key] = val;
        return obj;
      }, {} as { [key: string]: number });
  }
}
