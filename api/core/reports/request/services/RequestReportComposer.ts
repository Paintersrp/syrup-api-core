import { RequestReportGenerator } from '../RequestReportGenerator';
import { RequestLogMetrics, RequestLogReport } from '../types';

/**
 * Class used to compose a report from metrics.
 */
export class RequestReportComposer {
  protected generator: RequestReportGenerator;

  /**
   * @param generator The generator to use
   * @constructor
   */
  constructor(generator: RequestReportGenerator) {
    this.generator = generator;
  }

  /**
   * This method creates a report from the provided metrics.
   *
   * @param metrics The metrics to create a report from
   * @returns The created report
   */
  public createReport(metrics: RequestLogMetrics): Partial<RequestLogReport> {
    return {
      totalRequests: metrics.totalRequests,
      averageRequestDuration: metrics.totalDuration / metrics.totalRequests,
      errorCount: metrics.errorCount,
      longestDuration: metrics.longestDuration,
      shortestDuration: isFinite(metrics.shortestDuration) ? metrics.shortestDuration : 0,
      averageResponseSize: metrics.totalResponseSize / metrics.totalRequests,
      uniqueIPs: metrics.ipAddresses.size,
      requestByHour: metrics.requestFrequency,
      numberOfUsers: Object.keys(metrics.userIdsCount).length,
      topUsers: this.generator.getTop(metrics.userIdsCount, 10),
      topEndpoints: this.generator.getTop(metrics.pathsCount, 10),
      statusCodes: metrics.statusCodesCount,
      topStatusCodes: this.generator.getTop(metrics.statusCodesCount, 10).map(Number),
      requestsByMethod: metrics.methodsCount,
      topUserAgents: this.generator.getTop(metrics.userAgentsCount, 10),
      topIPAddresses: this.generator.getTopMap(metrics.ipAddresses, 10),
      endpointPerformance: metrics.endpointPerformance,
      responseTimeBuckets: metrics.responseTimeBuckets,
    };
  }
}
