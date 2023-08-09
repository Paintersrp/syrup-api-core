import { ExtendedRequestLogObject, RequestLogReport } from './types';
import { BaseReportGenerator } from '../base';
import { RequestMetricsAggregator, RequestReportComposer } from './services';

/**
 * Class representing a log analyzer for request logs.
 *
 * @extends BaseReportGenerator
 */
export class RequestReportGenerator extends BaseReportGenerator<ExtendedRequestLogObject> {
  private metricsAggregator = new RequestMetricsAggregator();
  private reportComposer = new RequestReportComposer(this);

  /**
   * This method analyzes the logs, it first loads the logs then
   * it collects the metrics using the metricsAggregator, and finally
   * creates a report using the reportComposer.
   *
   * @returns A promise that resolves to a partial report of request logs
   */
  public async analyzeLogs(): Promise<Partial<RequestLogReport>> {
    await this.loadLogs();
    const metrics = this.metricsAggregator.collectMetrics(this.logs);
    return this.reportComposer.createReport(metrics);
  }
}
