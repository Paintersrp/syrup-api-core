import fs from 'fs/promises';
import path from 'path';
import { ExportFormat, ExportFileOptions } from '../types';

/**
 * Class for exporting a report in different formats.
 */
export class ReportExporter {
  /**
   * Exports the error report in the given format.
   * @param {any} report - The report to export.
   * @param {ExportFormat} format - The format in which to export the report.
   * @param {ExportFileOptions} [options] - The options for exporting the report.
   * @returns {string} The exported report.
   */
  public async exportReport(
    report: any,
    format: ExportFormat,
    options?: ExportFileOptions
  ): Promise<string> {
    let exportedReport: string;

    switch (format) {
      case 'json':
        exportedReport = this.exportAsJSON(report);
        break;
      case 'csv':
        exportedReport = this.exportAsCSV(report);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    if (options?.dir) {
      const fileName = options.fileName || `report-${Date.now()}`;
      const filePath = path.join(options.dir, `${fileName}.${format}`);
      await fs.writeFile(filePath, exportedReport);
    }

    return exportedReport;
  }

  /**
   * Exports the error report in JSON format.
   * @param {ErrorLogReport} report
   * @return {string}
   */
  private exportAsJSON(report: any): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Exports the error report in CSV format.
   * @param {ErrorLogReport} report
   * @return {string}
   */
  private exportAsCSV(report: any): string {
    const rows: string[] = [];
    const entries = Object.entries(report);

    const primitiveEntries = entries.filter(
      ([_, v]) => typeof v === 'number' || typeof v === 'string'
    );
    const objectEntries = entries.filter(([_, v]) => typeof v === 'object');

    for (const [key, value] of primitiveEntries) {
      rows.push(`${key},${value}`);
    }

    for (const [key, value] of objectEntries) {
      rows.push(
        `${key},${Object.entries(value!)
          .map(([k, v]) => `${k}:${v}`)
          .join(',')}`
      );
    }

    return rows.join('\n');
  }
}
