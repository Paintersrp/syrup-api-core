import { ErrorSeverity } from '../enums';
import { ErrorLogMetrics, ErrorLogObject } from '../types';

export class ErrorMetricsAggregator {
  private readonly BATCH_SIZE = 1000;
  /**
   * Collects metrics from the logs.
   * @return {ErrorLogMetrics}
   */
  public collectMetrics(logs: ErrorLogObject[]): ErrorLogMetrics {
    const metrics = this.initializeMetrics();

    for (let i = 0; i < logs.length; i += this.BATCH_SIZE) {
      const batch = logs.slice(i, i + this.BATCH_SIZE);
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
   * Updates the metrics object based on a log
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

  private getHour(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.getUTCHours().toString();
  }

  private getDay(timestamp: Date): string {
    const date = new Date(timestamp);
    return date.getUTCDate().toString();
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
