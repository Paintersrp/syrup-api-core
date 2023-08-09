import fs from 'fs';
import readline from 'readline';

/**
 * Class for importing logs.
 */
export class ReportImporter {
  /**
   * Load logs from a file and store them internally.
   *
   * @public
   * @param {string} filePath - The path to the log file.
   * @returns {Promise<void>} Resolves when the logs have been loaded.
   * @throws Will throw an error if the logs cannot be loaded or parsed.
   */
  public async loadLogs<T>(filePath: string, logs: T[]): Promise<void> {
    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      const failedLines: string[] = [];

      for await (const line of rl) {
        try {
          logs.push(JSON.parse(line));
        } catch (err: any) {
          failedLines.push(line);
        }
      }

      if (failedLines.length > 0) {
        throw new Error(
          `Failed to parse ${failedLines.length} log lines. First failed line: ${failedLines[0]}`
        );
      }
    } catch (err: any) {
      throw new Error(`Failed to load logs: ${err.message}`);
    }
  }
}
