import { ErrorLogObject, ErrorLogReport } from './types';
import { BaseReportGenerator } from '../base';
import { ErrorMetricsAggregator, ErrorReportComposer } from './services';

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
  private metricsAggregator = new ErrorMetricsAggregator();
  private reportComposer = new ErrorReportComposer();

  /**
   * Analyzes the logs and generates a report.
   * @return {Promise<ErrorLogReport>}
   */
  public async analyzeLogs(): Promise<ErrorLogReport> {
    if (this.logs.length < 1) {
      await this.loadLogs();
    }

    const metrics = this.metricsAggregator.collectMetrics(this.logs);
    return this.reportComposer.createReport(metrics);
  }

  /**
   * Retrieves errors that occurred within a specific time range.
   * @param {Date} start - The start of the time range.
   * @param {Date} end - The end of the time range.
   * @return {ErrorLogObject[]}
   */
  public async getErrorsWithinTimeRange(start: Date, end: Date): Promise<ErrorLogObject[]> {
    if (this.logs.length < 1) {
      await this.loadLogs();
    }

    return this.logs.filter((log) => {
      const logTime = new Date(log.time);
      return logTime >= start && logTime <= end;
    });
  }
}
