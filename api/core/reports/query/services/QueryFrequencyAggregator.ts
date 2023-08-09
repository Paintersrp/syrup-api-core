import { QueryFrequencies, QueryFrequency, QueryReportLogObject } from '../types';

export class QueryFrequencyAggregator {
  private frequencies: QueryFrequencies;
  private queryDurations: { [key: string]: number } = {};

  constructor() {
    this.setupFrequencies();
  }

  /**
   * Setups the frequencies object with initial values.
   */
  private setupFrequencies(): void {
    this.frequencies = {
      hourly: this.initializeFrequenciesForAllKeys(24),
      daily: this.initializeFrequenciesForAllKeys(31),
      weekly: this.initializeFrequenciesForAllKeys(5),
      monthly: this.initializeFrequenciesForAllKeys(12),
    };
  }

  /**
   * Initializes an object with provided number of keys.
   *
   * @param {number} numKeys - The number of keys to initialize in the object.
   * @returns {QueryFrequency} An object with keys initialized to 0.
   */
  private initializeFrequenciesForAllKeys(numKeys: number): QueryFrequency {
    const frequencies: { [key: number]: number } = {};

    for (let i = 0; i < numKeys; i++) {
      frequencies[i] = 0;
    }

    return frequencies;
  }

  /**
   * Aggregates frequencies for different time divisions.
   *
   * @param {QueryReportLogObject} log - The log to aggregate frequencies from.
   * @param {number} duration - The duration of the log.
   */
  public aggregateFrequencies(log: QueryReportLogObject, duration: number): void {
    this.queryDurations[log.context.id] = duration;
    const date = new Date(log.time);

    this.frequencies.hourly[date.getHours()]++;
    this.frequencies.daily[date.getDate()]++;
    this.frequencies.weekly[Math.floor(date.getDate() / 7)]++;
    this.frequencies.monthly[date.getMonth()]++;
  }

  /**
   * Returns the QueryFrequencies object for the report
   *
   * @private
   * @returns {QueryFrequencies} QueryFrequencies object
   */
  public getFrequencies(): QueryFrequencies {
    return this.frequencies;
  }

  /**
   * Returns the QueryDurations object for the report
   *
   * @private
   * @returns {[key: string]: number}
   */
  public getQueryDurations(): { [key: string]: number } {
    return this.queryDurations;
  }
}
