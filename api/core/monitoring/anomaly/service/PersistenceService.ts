import * as fs from 'fs/promises';
import { Anomaly } from '../types';

/**
 * @class
 *
 * `PersistenceService` class provides functionalities for persisting (saving) and retrieving
 * the anomaly detection history data. It uses the file system to store the history data and load it back when needed.
 */
export class PersistenceService {
  /**
   * Save history to a file.
   * @param {string} fileName - the name of the file
   */
  async saveHistory(fileName: string, history: Map<string, Anomaly[]>): Promise<void> {
    await fs.writeFile(fileName, JSON.stringify(Array.from(history.entries())));
  }

  /**
   * Load history from a file.
   * @param {string} fileName - the name of the file
   */
  async loadHistory(fileName: string): Promise<Map<string, Anomaly[]>> {
    try {
      const data = await fs.readFile(fileName, 'utf-8');
      return new Map(JSON.parse(data)) as Map<string, Anomaly[]>;
    } catch (error) {
      console.error(`Failed to load history: ${error}`);
      return new Map();
    }
  }
}
