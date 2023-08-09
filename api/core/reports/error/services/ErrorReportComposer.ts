import { ErrorLogMetrics, ErrorLogReport } from '../types';

export class ErrorReportComposer {
  /**
   * Creates a report based on the collected metrics.
   * @param {ErrorLogMetrics} metrics
   * @return {ErrorLogReport}
   */
  public createReport(metrics: ErrorLogMetrics): ErrorLogReport {
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
}
