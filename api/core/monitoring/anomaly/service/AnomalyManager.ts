import { SyLogger } from '../../../logging/SyLogger';
import {
  Anomaly,
  AnomalyMap,
  AnomalyRecords,
  AnomalyStatistics,
  AnomalyStatisticsModified,
} from '../types';

/**
 * `AnomalyManager` is responsible for managing and logging anomalies. It maintains
 * a log of anomalies and provides methods to handle and log anomaly check results.
 *
 * @class
 */
export class AnomalyManager {
  public anomalyLog: AnomalyMap = new Map();
  private logger: SyLogger;

  /**
   * Constructs a new instance of AnomalyManager
   *
   * @param {SyLogger} logger - the logger to be used by the AnomalyManager
   */
  constructor(logger: SyLogger) {
    this.logger = logger;
  }

  /**
   * Checks if an anomaly log exists for a specific key and if not, initializes it.
   *
   * @param {string} key - the key to check and initialize anomaly log for
   */
  public initializeAnomalyLogIfNeeded(key: string) {
    if (!this.anomalyLog.has(key)) {
      this.anomalyLog.set(key, []);
    }
  }

  /**
   * Handles detected anomalies by adding them to the anomaly log.
   *
   * @param {string} key - the key for which the anomaly check was performed
   * @param {number} value - the value that was checked
   * @param {boolean} isAnomaly - whether or not the value is considered an anomaly
   */
  public handleAnomalies(key: string, value: number, isAnomaly: boolean) {
    if (isAnomaly) {
      this.anomalyLog.get(key)!.push({ time: Date.now(), value });
    }
  }

  /**
   * Logs the anomaly check results using the provided statistics.
   *
   * @param {string} key - the key for which the anomaly check was performed
   * @param {AnomalyStatistics} stats - the anomaly check statistics
   */
  public logAnomalies(key: string, stats: AnomalyStatistics | AnomalyStatisticsModified) {
    const logMessage = `Anomaly Check [${key.charAt(0).toUpperCase() + key.slice(1)}]`;

    this.logger.warn(logMessage, stats);
  }

  /**
   * Retrieves the anomalies for a specific key.
   *
   * @param {string} key - the key for which the anomalies are retrieved
   * @returns {Anomaly[]} - the anomalies for the key
   */
  public getAnomalies(key: string): Anomaly[] | undefined {
    return this.anomalyLog.get(key);
  }

  /**
   * Retrieves all anomalies across all keys.
   *
   * @returns {AnomalyRecords} - a record of all anomalies
   */
  public getAllAnomalies(): AnomalyRecords {
    return Object.fromEntries(this.anomalyLog.entries());
  }
}
