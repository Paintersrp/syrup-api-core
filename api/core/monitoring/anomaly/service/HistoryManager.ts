import { Anomaly, AnomalyMap } from '../types';

/**
 * `HistoryManager` is responsible for initializing, updating, and retrieving the history
 * of anomalies. It also encapsulates the logic to check if a history is already initialized
 * for a specific key.
 *
 * @class
 */
export class HistoryManager {
  private history: AnomalyMap = new Map();
  private seasonLength: number;

  /**
   * Constructs a new instance of HistoryManager
   *
   * @param {number} seasonLength - length of a season. If history length is less than
   * this value, getAndUpdateHistory will return null.
   */
  constructor(seasonLength: number) {
    this.seasonLength = seasonLength;
  }

  /**
   * Checks if a history exists for a specific key and if not, initializes it.
   *
   * @param {string} key - the key to check and initialize history for
   */
  public initializeHistoryIfNeeded(key: string) {
    if (!this.history.has(key)) {
      this.history.set(key, []);
    }
  }

  /**
   * Updates the history for a specific key with the provided value, and then retrieves the updated
   * history.
   *
   * @param {Anomaly[] | undefined} itemHistory - updates a specific anomaly type's history
   * @param {number} value - the new value to be added to the history
   * @returns {void}
   */
  public updateHistory(itemHistory: Anomaly[] | undefined, value: number): void {
    itemHistory?.push({ time: Date.now(), value });
  }

  /**
   * Retrieves the history for a specific key.
   * If the history's length is less than or equal to the seasonLength, the method will return null.
   *
   * @param {string} key - the key for which the history is retrieved
   * @returns {Anomaly[] | null} - the history for the key or null
   */
  public getHistory(key: string): Anomaly[] | undefined {
    const history = this.history.get(key);

    // if (history && history.length > this.seasonLength) {
    //   return history;
    // }
    return history;
  }

  /**
   * Retrieves the entire history map.
   *
   * @returns {AnomalyMap} - the entire history map
   */
  public getHistoryMap(): AnomalyMap {
    return this.history;
  }

  /**
   * Sets the entire history map to a new map.
   *
   * @param {AnomalyMap} history - the new history map
   */
  public setHistoryMap(history: AnomalyMap) {
    this.history = history;
  }
}
