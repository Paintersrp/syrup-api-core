import { ReportExporter, ReportImporter, ReportOperations } from './services';
import { ExportFileOptions, ExportFormat } from './types';

/**
 * Class representing a log analyzer for request logs.
 *
 * @abstract
 * @template T
 */
export abstract class BaseReportGenerator<T> {
  protected logDir: string;
  protected logs: T[] = [];

  protected reportExporter = new ReportExporter();
  protected reportImporter = new ReportImporter();
  protected reportOperations = new ReportOperations();

  /**
   * @param {string} logDir - The directory where logs are located.
   * @constructor
   */
  constructor(logDir: string) {
    this.logDir = logDir;
  }

  /**
   * Clears the internally stored logs.
   * @public
   * @returns {void}
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Loads logs from a file and stores them internally.
   * @see {@link ReportImporter.loadLogs}
   */
  public async loadLogs(filePath?: string): Promise<void> {
    await this.reportImporter.loadLogs(filePath ? filePath : this.logDir, this.logs);
  }

  /**
   * Counts the occurrences of items in an array and returns a map of item to count.
   * @see {@link ReportOperations.countItems}
   */
  public countItems(array: any[]): Record<string, number> {
    return this.reportOperations.countItems(array);
  }

  /**
   * Adds an item to the list if it's not already there.
   * @see {@link ReportOperations.addIfUnique}
   */
  public addIfUnique(list: string[], item: string): void {
    this.reportOperations.addIfUnique(list, item);
  }

  /**
   * Gets the top N items with the highest counts from a count map.
   * @see {@link ReportOperations.getTop}
   */
  public getTop(countMap: Record<any, any>, limit: number = 5): string[] {
    return this.reportOperations.getTop(countMap, limit);
  }

  /**
   * Gets the top K items from the given items map.
   * @see {@link ReportOperations.getTopK}
   */
  public getTopK(items: { [id: string]: number }, k: number): { id: string; ms: number }[] {
    return this.reportOperations.getTopK(items, k);
  }

  /**
   * Gets the top K items from the given items map.
   * @see {@link ReportOperations.getTopMap}
   */
  public getTopMap(map: Map<string, number>, topN: number): [string, number][] {
    return this.reportOperations.getTopMap(map, topN);
  }

  /**
   * Exports the report in the given format.
   * @see {@link ReportExporter.exportReport}
   */
  public async exportReport(
    report: any,
    format: ExportFormat,
    options?: ExportFileOptions
  ): Promise<string> {
    return await this.reportExporter.exportReport(report, format, options);
  }
}
