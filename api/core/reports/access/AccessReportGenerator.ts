import { RBACLogObject, AccessLogReport } from './types';
import { BaseReportGenerator } from '../base';
import { AccessMetricsAggregator, AccessReportComposer } from './services';

/**
 * The AccessReportGenerator class provides methods for analyzing access logs and generating reports.
 * It extends the BaseReportGenerator class, adding functionality specific to access logs.
 */
export class AccessReportGenerator extends BaseReportGenerator<RBACLogObject> {
  private metricsAggregator = new AccessMetricsAggregator();
  private reportComposer = new AccessReportComposer(this);

  /**
   * Analyzes the loaded logs and generates a report.
   * @returns A promise that resolves with the generated report.
   */
  public async analyzeLogs(): Promise<Partial<AccessLogReport>> {
    await this.loadLogs();
    const metrics = this.metricsAggregator.collectMetrics(this.logs);
    return this.reportComposer.createReport(metrics);
  }
}
