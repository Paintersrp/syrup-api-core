import moment from 'moment';

import { RequestLogMetrics, RequestLogObject, RequestLogReport } from './types';
import { BaseReportGenerator } from '../BaseReportGenerator';

/**
 * Class representing a log analyzer for request logs.
 *
 * @extends BaseReportGenerator
 */
export class RequestReportGenerator extends BaseReportGenerator<RequestLogObject> {
  /**
   * Analyze the loaded logs and return a partial report of various metrics.
   *
   * @returns {Partial<RequestLogReport>} A report of various metrics about the loaded logs.
   * @throws Will throw an error if no logs have been loaded.
   */
  public async analyzeLogs(): Promise<Partial<RequestLogReport>> {
    await this.loadLogs();
    const metrics = this.collectMetrics();
    return this.createReport(metrics);
  }

  /**
   * Collects various metrics from the loaded logs.
   *
   * @private
   * @returns {RequestLogMetrics} An object containing the collected metrics.
   */
  private collectMetrics(): RequestLogMetrics {
    const metrics = this.initializeMetrics();

    for (const log of this.logs) {
      this.addLogToMetrics(log, metrics);
    }

    return metrics;
  }

  /**
   * Initializes an object with the default metrics.
   *
   * @private
   * @returns {RequestLogMetrics} The initialized metrics object.
   */
  private initializeMetrics(): RequestLogMetrics {
    return {
      totalRequests: this.logs.length,
      totalDuration: 0,
      totalResponseSize: 0,
      errorCount: 0,
      shortestDuration: Infinity,
      longestDuration: 0,
      userIds: [],
      paths: [],
      statusCodes: [],
      methods: [],
      userAgents: [],
      ipAddresses: [],
      requestFrequency: {},
    };
  }

  /**
   * Adds the details from a log to the metrics object.
   *
   * @private
   * @param {RequestLogObject} log - The log object.
   * @param {RequestLogMetrics} metrics - The metrics object.
   */
  private addLogToMetrics(log: RequestLogObject, metrics: RequestLogMetrics): void {
    metrics.userIds.push(this.extractUserId(log));
    metrics.paths.push(log.path);
    metrics.statusCodes.push(log.status || 0);
    metrics.methods.push(log.method);
    metrics.userAgents.push(log.userAgent);
    metrics.ipAddresses.push(log.ipAddress);

    if (log.responseSize) {
      metrics.totalResponseSize += log.responseSize;
    }

    if (log.duration) {
      this.updateDurationMetrics(log.duration, metrics);
    }

    if ('error' in log) {
      metrics.errorCount++;
    }

    const hour = moment(log.timestamp).format('HH');
    metrics.requestFrequency[hour] = (metrics.requestFrequency[hour] || 0) + 1;
  }

  /**
   * Extracts the user ID from a request log object.
   *
   * @private
   * @param {RequestLogObject} log - The request log object.
   * @returns {string} - The user ID as a string or an empty string if no user ID was found.
   */
  private extractUserId(log: RequestLogObject): string {
    return typeof log.user === 'string' ? log.user : log.user?.username || 'Anonymous';
  }

  /**
   * Updates duration related metrics in the provided metrics object based on the provided duration value.
   *
   * @private
   * @param {number} duration - The duration of a request.
   * @param {RequestLogMetrics} metrics - The metrics object to update.
   */
  private updateDurationMetrics(duration: number, metrics: RequestLogMetrics): void {
    metrics.totalDuration += duration;
    metrics.longestDuration = Math.max(metrics.longestDuration, duration);
    metrics.shortestDuration = Math.min(metrics.shortestDuration, duration);
  }

  /**
   * Creates a report based on the collected metrics.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @returns {Partial<RequestLogReport>} - A partial report based on the metrics.
   */
  private createReport(metrics: RequestLogMetrics): Partial<RequestLogReport> {
    const report = this.initializeReport(metrics);

    this.addUserIdReport(metrics, report);
    this.addPathReport(metrics, report);
    this.addStatusCodeReport(metrics, report);
    this.addMethodReport(metrics, report);
    this.addUserAgentReport(metrics, report);

    return report;
  }

  /**
   * Initializes a report object with some default values based on the metrics.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @returns {Partial<RequestLogReport>} - A partial report with the initialized values.
   */
  private initializeReport(metrics: RequestLogMetrics): Partial<RequestLogReport> {
    return {
      totalRequests: metrics.totalRequests,
      averageRequestDuration: metrics.totalDuration / metrics.totalRequests,
      errorCount: metrics.errorCount,
      longestDuration: metrics.longestDuration,
      shortestDuration: isFinite(metrics.shortestDuration) ? metrics.shortestDuration : 0,
      averageResponseSize: metrics.totalResponseSize / metrics.totalRequests,
      uniqueIPs: new Set(metrics.ipAddresses).size,
    };
  }

  /**
   * Adds user ID related details to the report.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @param {Partial<RequestLogReport>} report - The report to add details to.
   */
  private addUserIdReport(metrics: RequestLogMetrics, report: Partial<RequestLogReport>): void {
    const userIdsCount = this.countItems(metrics.userIds);
    report.numberOfUsers = Object.keys(userIdsCount).length;
    report.topUsers = this.getTop(userIdsCount);
  }

  /**
   * Adds path related details to the report.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @param {Partial<RequestLogReport>} report - The report to add details to.
   */
  private addPathReport(metrics: RequestLogMetrics, report: Partial<RequestLogReport>): void {
    const pathsCount = this.countItems(metrics.paths);
    report.topEndpoints = this.getTop(pathsCount);
  }

  /**
   * Adds status code related details to the report.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @param {Partial<RequestLogReport>} report - The report to add details to.
   */
  private addStatusCodeReport(metrics: RequestLogMetrics, report: Partial<RequestLogReport>): void {
    const statusCodesCount = this.countItems(metrics.statusCodes);
    report.statusCodes = statusCodesCount;
    report.topStatusCodes = this.getTop(statusCodesCount).map(Number);
  }

  /**
   * Adds method related details to the report.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @param {Partial<RequestLogReport>} report - The report to add details to.
   */
  private addMethodReport(metrics: RequestLogMetrics, report: Partial<RequestLogReport>): void {
    const methodsCount = this.countItems(metrics.methods);
    report.requestsByMethod = methodsCount;
  }

  /**
   * Adds user agent related details to the report.
   *
   * @private
   * @param {RequestLogMetrics} metrics - The collected metrics.
   * @param {Partial<RequestLogReport>} report - The report to add details to.
   */
  private addUserAgentReport(metrics: RequestLogMetrics, report: Partial<RequestLogReport>): void {
    const userAgentsCount = this.countItems(metrics.userAgents);
    report.topUserAgents = this.getTop(userAgentsCount);
  }
}
