import { InitialParams } from './const';
import {
  AnomalyManager,
  CalculatorService,
  HistoryManager,
  ParameterService,
  PersistenceService,
} from './service';
import {
  Anomaly,
  AnomalyMap,
  AnomalyRecords,
  AnomalyStatisticsModified,
} from './types';

import { SyLogger } from '../../logging/SyLogger';

/**
 * @todo Independent zScore thresholds, passed with checkAnomaly
 * @todo Modified zScore vs Standard zScore Decision / Testing
 */

/**
 * @class
 *
 * This class provides functionalities for detecting anomalies in the data. It maintains a history of
 * data and uses statistical techniques to detect anomalies.
 *
 * A specific value is considered an anomaly if it deviates significantly from the expected value, based on historical data.
 * The expectation is calculated using a forecasting model and parameters are adjusted based on the observed errors in the forecast.
 *
 * Anomalies are detected based on the modified z-score of the observed value. The modified z-score provides a measure
 * that indicates how many standard deviations an element is from the mean, and it is particularly useful for identifying
 * outliers in datasets that may be skewed or have heavy-tailed distributions.
 *
 * @see {AnomalyManager} - Manages anomalies.
 * @see {HistoryManager} - Manages the historical data.
 * @see {PersistenceService} - Service for persisting and retrieving historical data.
 * @see {ParameterService} - Service for managing parameters of the forecasting model.
 * @see {CalculatorService} - Service for performing calculations, including the modified z-score.
 */
export class AnomalyDetector {
  private anomalyManager: AnomalyManager;
  private historyManager: HistoryManager;
  private persistenceService: PersistenceService;
  private parameterService: ParameterService;
  private calculatorService: CalculatorService;

  /**
   * Constructs a new instance of AnomalyDetector
   * @param {number} seasonLength - length of season
   * @param {number} learningRate - learning rate
   * @param {number} zScoreThreshold - threshold for Z-Score
   */
  constructor(
    logger: SyLogger,
    seasonLength: number = InitialParams.SEASON_LENGTH,
    learningRate: number = InitialParams.LEARNING_RATE,
    zScoreThreshold: number = InitialParams.ZSCORE_THRESHOLD
  ) {
    this.anomalyManager = new AnomalyManager(logger);
    this.historyManager = new HistoryManager(seasonLength);
    this.persistenceService = new PersistenceService();
    this.parameterService = new ParameterService(seasonLength, learningRate);
    this.calculatorService = new CalculatorService(seasonLength, zScoreThreshold);
  }

  /**
   * Check whether a value for a given key is an anomaly.
   * @param {string} key - the key to check
   * @param {number} value - the value to check
   * @returns {boolean} - true if the value is an anomaly, false otherwise
   */
  public async checkAnomaly(key: string, value: any): Promise<boolean> {
    this.initialize(key);
    const history = this.historyManager.getHistory(key);

    if (!history) {
      return false;
    }

    this.historyManager.updateHistory(history, value);
    const forecast = this.getForecast(key);
    const error = this.calculatorService.calculateError(value, forecast);
    this.parameterService.adjustParameters(key, error, forecast, value);

    const stats = this.calculateStatsModified(history, value);
    this.anomalyManager.logAnomalies(key, stats);
    this.anomalyManager.handleAnomalies(key, value, stats.isAnomaly);

    return stats.isAnomaly;
  }

  /**
   * Initializes the instance variables for a given key.
   * @private
   * @param {string} key - the key to initialize
   */
  private initialize(key: string) {
    this.historyManager.initializeHistoryIfNeeded(key);
    this.anomalyManager.initializeAnomalyLogIfNeeded(key);
    this.parameterService.initializeParamtersIfNeeded(key);
  }

  /**
   * Calculate the forecast for a specific key.
   * @private
   * @param {string} key - the key for which the forecast is calculated
   * @returns {number} - the calculated forecast
   */
  private getForecast(key: string): number {
    const history = this.historyManager.getHistory(key)!;
    const { alpha, beta, gamma } = this.parameterService.getParameters(key)!;
    const seasonality = this.parameterService.getSeasonality(key)!;

    return this.calculatorService.calculateForecast(history, alpha, beta, gamma, seasonality);
  }

  /**
   * Calculate statistics based on the history and the provided value using modified zScore formula for easing sensitivity to data spikes and outliers
   * @private
   * @param {Anomaly[]} history - the history data
   * @param {number} value - the value to calculate statistics from
   * @returns {AnomalyStatistics} - the calculated statistics
   */
  private calculateStatsModified(history: Anomaly[], value: number): AnomalyStatisticsModified {
    const values = history.map((item) => item.value);
    const median = this.calculatorService.calculateMedian(values);
    const mad = this.calculatorService.calculateMAD(values, median);
    const zScore = this.calculatorService.calculateModifiedZScore(value, median, mad);
    const isAnomaly = this.calculatorService.calculateAnomaly(zScore);

    return { median, mad, zScore, isAnomaly };
  }

  /**
   * Get anomalies for a given key.
   *
   * @see {AnomalyManager#getAnomalies}
   */
  public getAnomalies(key: string): Anomaly[] | undefined {
    return this.anomalyManager.getAnomalies(key);
  }

  /**
   * Get all anomalies across all keys.
   *
   * @see {AnomalyManager#getAllAnomalies}
   */
  public getAllAnomalies(): AnomalyRecords {
    return this.anomalyManager.getAllAnomalies();
  }

  /**
   * Retrieves the history for a specific key.
   *
   * @see {HistoryManager#getHistory}
   */
  public getHistory(key: string): Anomaly[] | undefined {
    return this.historyManager.getHistory(key);
  }

  /**
   * Retrieves the entire history map.
   *
   * @see {HistoryManager#getHistoryMap}
   */
  public getHistoryMap(): AnomalyMap {
    return this.historyManager.getHistoryMap();
  }

  /**
   * Save history to a file.
   *
   * @see {PersistenceService#saveHistory}
   */
  public async saveHistory(fileName: string) {
    await this.persistenceService.saveHistory(fileName, this.getHistoryMap());
  }

  /**
   * Load history from a file.
   *
   * @see {PersistenceService#loadHistory}
   */
  public async loadHistory(fileName: string) {
    this.historyManager.setHistoryMap(await this.persistenceService.loadHistory(fileName));
  }

  /**
   * Retrieves the anomaly data for a specific key.
   * @param {string} key - the key to retrieve data for
   * @returns {AnomalyStatisticsModified[]} - a list of anomaly data
   */
  public getAnomalyData(key: string): AnomalyStatisticsModified[] {
    const history = this.historyManager.getHistory(key);
    const data: AnomalyStatisticsModified[] = [];

    if (history) {
      for (let i = 0; i < history.length; i++) {
        data.push(this.calculateStatsModified(history.slice(0, i + 1), history[i].value));
      }
    }

    return data;
  }
}

// /**
//  * Calculate statistics based on the history and the provided value.
//  * @private
//  * @param {Anomaly[]} history - the history data
//  * @param {number} value - the value to calculate statistics from
//  * @returns {AnomalyStatistics} - the calculated statistics
//  */
// private calculateStats(history: Anomaly[], value: number): AnomalyStatistics {
//   const mean = this.calculatorService.calculateMean(history);
//   const standardDeviation = this.calculatorService.calculateStandardDeviation(history, mean);
//   const zScore = this.calculatorService.calculateZScore(value, mean, standardDeviation);
//   const isAnomaly = this.calculatorService.calculateAnomaly(zScore);

//   return { mean, stdDev: standardDeviation, zScore, isAnomaly };
// }
