import * as fs from 'fs';
import { Anomaly, AnomalyDetectorParams, AnomalyMap, AnomalyRecords } from './types';

/**
 * @todo Persistence Mixin?
 */

/**
 * This class represents an advanced anomaly detector.
 */
export class AnomalyDetector {
  /** Historical data stored by keys. */
  private history: AnomalyMap = new Map();

  /** Anomaly logs stored by keys. */
  private anomalyLog: AnomalyMap = new Map();

  /** Parameters used for forecasting, stored by keys. */
  private parameters: AnomalyDetectorParams = new Map();

  /** The length of the seasonality to consider. */
  private seasonLength: number;

  /** The rate at which to age past observations. */
  private agingRate: number;

  /**
   * @constructor
   * @param {number} seasonLength The length of the seasonality to consider. Default value is 24.
   * @param {number} agingRate The rate at which to age past observations. Default value is 0.1.
   */
  constructor(seasonLength: number = 2, agingRate: number = 0.1) {
    this.seasonLength = seasonLength;
    this.agingRate = agingRate;
  }

  /**
   * A static method that calculates the forecasted value based on historical data, season length, and alpha, beta, gamma parameters.
   * @param history The historical data to use for forecasting.
   * @param seasonLength The length of the seasonality to consider.
   * @param params The alpha, beta, and gamma parameters to use for forecasting.
   * @returns The forecasted value.
   */
  private calculateForecast(
    history: { time: number; value: number }[],
    seasonLength: number,
    params: { alpha: number; beta: number; gamma: number }
  ): number {
    let { alpha, beta, gamma } = params;

    // Initialize base, trend and seasonality
    let base = history[0].value;
    let trend = 0;
    let seasonality: number[] = new Array(seasonLength).fill(1);

    for (let i = 0; i < history.length; i++) {
      const { value } = history[i];
      const lastBase = base;
      const lastSeason = seasonality[i % seasonLength];

      // Calculate base, trend and seasonality using triple exponential smoothing
      base = alpha * (value / lastSeason) + (1 - alpha) * (lastBase + trend);
      trend = beta * (base - lastBase) + (1 - beta) * trend;
      seasonality[i % seasonLength] = gamma * (value / base) + (1 - gamma) * lastSeason;
    }

    // Calculate forecast for the next period
    return (base + trend) * seasonality[history.length % seasonLength];
  }

  /**
   * Set default parameters for a given key if they do not exist.
   * @param key The key to set default parameters for.
   */
  private setDefaultParameters(key: string): void {
    if (!this.history.has(key)) {
      this.history.set(key, []);
      this.anomalyLog.set(key, []);
      this.parameters.set(key, { alpha: 0.5, beta: 0.5, gamma: 0.5, threshold: 50 });
    }
  }

  /**
   * Adjust a parameter value within the range [0, 1] based on the adjustment rate and direction.
   * @param parameter The parameter to adjust.
   * @param adjustmentRate The rate at which to adjust the parameter.
   * @param adjustmentDirection The direction of the adjustment. Should be 1 or -1.
   * @returns The adjusted parameter.
   */
  private adjustParameter(
    parameter: number,
    adjustmentRate: number,
    adjustmentDirection: number
  ): number {
    return Math.min(Math.max(parameter + adjustmentRate * adjustmentDirection, 0), 1);
  }

  /**
   * Adjust the alpha, beta, gamma, and threshold parameters for a given key based on the error, forecast, and actual value.
   * @param key The key to adjust parameters for.
   * @param error The error of the last forecast.
   * @param forecast The last forecasted value.
   * @param value The actual value.
   */
  private adjustParameters(key: string, error: number, forecast: number, value: number) {
    const adjustmentRate = 0.01;
    let params = this.parameters.get(key);
    const adjustmentDirection = value > forecast ? 1 : -1;

    if (error > params!.threshold) {
      params!.threshold = error;
    }

    params!.alpha = this.adjustParameter(params!.alpha, adjustmentRate, adjustmentDirection);
    params!.beta = this.adjustParameter(params!.beta, adjustmentRate, adjustmentDirection);
    params!.gamma = this.adjustParameter(params!.gamma, adjustmentRate, adjustmentDirection);
  }

  /**
   * Check if a new observation is an anomaly based on historical data and forecasting.
   * @param key The key to check for anomalies.
   * @param value The new observation.
   * @returns True if the value is an anomaly, false otherwise.
   */
  checkAnomaly(key: string, value: number): boolean {
    this.setDefaultParameters(key);

    let historyForKey = this.history.get(key) || [];
    historyForKey.push({ time: Date.now(), value: value });
    this.history.set(key, historyForKey);

    console.log(historyForKey);

    // If the history is not long enough for seasonality, return false
    if (historyForKey.length <= this.seasonLength) {
      return false;
    }

    // Age past observations
    historyForKey = historyForKey.map((record, index) => {
      if (index < historyForKey.length - 1) {
        record.value *= 1 - this.agingRate;
      }
      return record;
    });

    const params = this.parameters.get(key)!;
    const forecast = this.calculateForecast(historyForKey, this.seasonLength, params);

    // Calculate the absolute error and adjust paramaters
    const error = Math.abs(value - forecast);
    this.adjustParameters(key, error, forecast, value);

    // If error is above the threshold, mark as an anomaly and add to the log
    const isAnomaly = error > params.threshold;

    if (isAnomaly) {
      let anomaliesForKey = this.anomalyLog.get(key) || [];
      anomaliesForKey.push({ time: Date.now(), value: value });
      this.anomalyLog.set(key, anomaliesForKey);
    }

    return isAnomaly;
  }

  /**
   * Save the historical data to a file.
   * @param fileName The name of the file to save the history to.
   */
  saveHistory(fileName: string) {
    fs.writeFileSync(fileName, JSON.stringify(Array.from(this.history.entries())));
  }

  /**
   * Load the historical data from a file.
   * @param fileName The name of the file to load the history from.
   */
  loadHistory(fileName: string) {
    if (fs.existsSync(fileName)) {
      const loadedHistory = new Map(JSON.parse(fs.readFileSync(fileName, 'utf-8'))) as AnomalyMap;
      this.history = loadedHistory;
    }
  }

  /**
   * Get the anomaly logs for a given key.
   * @param key The key to get anomalies for.
   * @returns An array of the anomalies for the given key.
   */
  getAnomalies(key: string): Anomaly[] {
    return this.anomalyLog.get(key) || [];
  }

  /**
   * Get all anomaly logs.
   * @returns An object containing all the anomaly logs for all keys.
   */
  getAllAnomalies(): AnomalyRecords {
    let anomalyObject: AnomalyRecords = {};

    for (let [key, value] of this.anomalyLog.entries()) {
      anomalyObject[key] = value;
    }

    return anomalyObject;
  }
}
