import { AuditLogFetcher, AuditLogProcessor } from './services';
import { AuditLogMetrics } from './types';

/**
 * The AuditReportGenerator class provides methods for loading, analyzing, and reporting on audit logs.
 */
export class AuditReportGenerator {
  private fetcher: AuditLogFetcher;
  private processor: AuditLogProcessor;

  constructor(
    fetcher: AuditLogFetcher = new AuditLogFetcher(),
    processor: AuditLogProcessor = new AuditLogProcessor()
  ) {
    this.fetcher = fetcher;
    this.processor = processor;
  }

  /**
   * Analyzes audit logs and returns metrics about them.
   * @returns The metrics derived from the audit logs.
   */
  public async analyzeLogs(): Promise<AuditLogMetrics> {
    let page = 1;
    let metrics = this.processor.initializeMetrics();

    while (true) {
      try {
        const batch = await this.fetcher.fetchBatch(page);

        if (batch.length === 0) {
          break;
        }

        this.processor.processBatch(batch, metrics);
        page++;
      } catch (error) {
        console.error(`Error processing logs on page ${page}:`, error);
        page++;
      }
    }

    return metrics;
  }
}
