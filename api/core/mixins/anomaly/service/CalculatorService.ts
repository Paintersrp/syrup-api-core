import { EPSILON, NORMAL_SCALE_FACTOR } from '../const';

/**
 * Service class for managing calculations.
 *
 * @class
 */
export class CalculatorService {
  private seasonLength: number;
  private zScoreThreshold: number;

  /**
   * Constructs a new instance of CalculatorService
   * @param {number} seasonLength - The length of the season
   * @param {number} zScoreThreshold - The threshold value for the Z-score
   */
  constructor(seasonLength: number, zScoreThreshold: number) {
    this.seasonLength = seasonLength;
    this.zScoreThreshold = zScoreThreshold;
  }

  /**
   * Calculate the forecast for a specific key.
   * @param {Array<any>} history - The historical data
   * @param {number} alpha - The alpha value for calculation
   * @param {number} beta - The beta value for calculation
   * @param {number} gamma - The gamma value for calculation
   * @param {Array<any>} seasonality - The seasonality data
   * @returns {number} - The calculated forecast
   */
  public calculateForecast(
    history: any,
    alpha: number,
    beta: number,
    gamma: number,
    seasonality: any
  ): number {
    let base = history[0].value;
    let trend = 0;

    for (let i = 0; i < history.length; i++) {
      const { value } = history[i];
      const lastBase = base;
      const lastSeason = seasonality[i % this.seasonLength];

      base = this.calculateBase(alpha, value, lastSeason, lastBase, trend);
      trend = this.calculateTrend(beta, base, lastBase, trend);
      seasonality[i % this.seasonLength] = this.calculateSeasonality(
        gamma,
        value,
        base,
        lastSeason
      );
    }

    return this.calculateForecastValue(base, trend, seasonality, history.length);
  }

  /**
   * Calculate the new base value.
   *
   * @param {number} alpha - The alpha value for calculation.
   * @param {number} value - The current value from history.
   * @param {number} lastSeason - The value of last season.
   * @param {number} lastBase - The last base value.
   * @param {number} trend - The current trend value.
   *
   * @returns {number} - The new base value.
   */
  private calculateBase(
    alpha: number,
    value: number,
    lastSeason: number,
    lastBase: number,
    trend: number
  ): number {
    const alphaWeightedValue = alpha * (value / lastSeason);
    const weightedBaseTrend = (1 - alpha) * (lastBase + trend);
    return alphaWeightedValue + weightedBaseTrend;
  }

  /**
   * Calculate the new trend value.
   *
   * @param {number} beta - The beta value for calculation.
   * @param {number} base - The current base value.
   * @param {number} lastBase - The last base value.
   * @param {number} trend - The current trend value.
   *
   * @returns {number} - The new trend value.
   */
  private calculateTrend(beta: number, base: number, lastBase: number, trend: number): number {
    const betaWeightedBaseChange = beta * (base - lastBase);
    const weightedTrend = (1 - beta) * trend;
    return betaWeightedBaseChange + weightedTrend;
  }

  /**
   * Calculate the new seasonality value.
   *
   * @param {number} gamma - The gamma value for calculation.
   * @param {number} value - The current value from history.
   * @param {number} base - The current base value.
   * @param {number} lastSeason - The value of last season.
   *
   * @returns {number} - The new seasonality value.
   */
  private calculateSeasonality(
    gamma: number,
    value: number,
    base: number,
    lastSeason: number
  ): number {
    const gammaWeightedSeasonality = gamma * (value / base);
    const weightedLastSeason = (1 - gamma) * lastSeason;
    return gammaWeightedSeasonality + weightedLastSeason;
  }

  /**
   * Calculate the final forecast value.
   *
   * @param {number} base - The current base value.
   * @param {number} trend - The current trend value.
   * @param {Array<number>} seasonality - The seasonality data.
   * @param {number} historyLength - The length of the history.
   *
   * @returns {number} - The forecasted value.
   */
  private calculateForecastValue(
    base: number,
    trend: number,
    seasonality: Array<number>,
    historyLength: number
  ): number {
    return (base + trend) * seasonality[historyLength % this.seasonLength];
  }

  /**
   * Calculate the absolute error between value and forecast.
   * @public
   * @param {number} value - the current value
   * @param {number} forecast - the predicted value
   * @returns {number} - the calculated error
   */
  public calculateError(value: number, forecast: number): number {
    return Math.abs(value - forecast);
  }

  /**
   * Calculate the mean of the historical values.
   * @public
   * @param {Anomaly[]} history - the history for which the mean is calculated
   * @returns {number} - the mean value
   */
  public calculateMean(history: any[]): number {
    return history.reduce((sum, { value }) => sum + value, 0) / history.length;
  }

  /**
   * Calculate the standard deviation of the historical values.
   * @public
   * @param {Anomaly[]} history - the history for which the standard deviation is calculated
   * @param {number} mean - the mean value of the history
   * @returns {number} - the standard deviation
   */
  public calculateStandardDeviation(history: any[], mean: number): number {
    return Math.sqrt(
      history.reduce((sum, { value }) => sum + Math.pow(value - mean, 2), 0) / history.length
    );
  }

  /**
   * Calculate the z-score for a value.
   * @public
   * @param {number} value - the value for which the z-score is calculated
   * @param {number} mean - the mean value
   * @param {number} standardDeviation - the standard deviation
   * @returns {number} - the calculated z-score
   */
  public calculateZScore(value: number, mean: number, standardDeviation: number): number {
    return (value - mean) / (standardDeviation + EPSILON);
  }

  /**
   * Calculate the Modified Z-Score for a given value.
   *
   * The Modified Z-Score is a measure of the 'unusualness' of a data point, taking into account the
   * distribution's median and Median Absolute Deviation (MAD).
   * Unlike the traditional Z-score, the Modified Z-Score is more robust against outliers.
   *
   * @param {number} value - the value for which the Modified Z-Score is to be calculated
   * @param {number} median - the median of the dataset the value belongs to
   * @param {number} mad - the Median Absolute Deviation of the dataset the value belongs to
   * @returns {number} - the calculated Modified Z-Score. Returns 0 if MAD is 0 to avoid division by zero
   */
  public calculateModifiedZScore(value: number, median: number, mad: number): number {
    return mad === 0 ? 0 : (NORMAL_SCALE_FACTOR * (value - median)) / mad;
  }

  /**
   * Determine if a value is an anomaly based on the z-score.
   * @public
   * @param {number} zScore - the z-score for the value
   * @returns {boolean} - true if the value is an anomaly, false otherwise
   */
  public calculateAnomaly(zScore: number): boolean {
    return Math.abs(zScore) > this.zScoreThreshold;
  }

  /**
   * Calculate the median of a list of numbers
   * @param {Anomaly[]} list - the list of numbers
   * @returns {number} - the calculated median
   */
  public calculateMedian(list: number[]): number {
    const sortedValues = [...list].sort((a, b) => a - b);
    const midpoint = Math.floor(sortedValues.length / 2);
    const isEven = sortedValues.length % 2 === 0;

    if (isEven) {
      // If the list length is even, return the average of the two middle values
      return (sortedValues[midpoint - 1] + sortedValues[midpoint]) / 2.0;
    } else {
      // If the list length is odd, return the middle value
      return sortedValues[midpoint];
    }
  }

  /**
   * Calculate the Median Absolute Deviation (MAD) of a list of numbers
   * @param {Anomaly[]} list - the list of numbers
   * @param {number} median - the median of the list
   * @returns {number} - the calculated MAD
   */
  public calculateMAD(list: number[], median: number): number {
    const deviations = list.map((item) => Math.abs(item - median));
    return this.calculateMedian(deviations);
  }
}
