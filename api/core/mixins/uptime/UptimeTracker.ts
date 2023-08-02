import { UptimeResponses } from '../../lib/responses/uptime';
import { Scheduler } from '../scheduler/Scheduler';
import { UptimeRecordsObject } from './types';
import { UptimeRecord } from './UptimeRecord';

/**
 * A class representing the uptime tracker.
 * @class
 */
export class UptimeTracker {
  protected uptimeRecords: Map<string, UptimeRecord> = new Map();
  protected autoUpdateScheduler?: Scheduler;

  /**
   * @constructor
   * @param {number} autoUpdateIntervalMs - Optional interval for automatic record update in milliseconds.
   */
  constructor(autoUpdateIntervalMs?: number) {
    if (autoUpdateIntervalMs) {
      this.autoUpdateScheduler = new Scheduler(
        () => this.autoUpdateRecords(),
        autoUpdateIntervalMs
      );
    }
  }

  /**
   * Automatically update all uptime records.
   */
  public autoUpdateRecords() {
    const now = Date.now();
    for (let key of this.uptimeRecords.keys()) {
      this.updateUptimeRecord(key, now, true);
    }
  }

  /**
   * Stop automatically updating the records.
   */
  public stopAutoUpdate() {
    if (this.autoUpdateScheduler) {
      this.autoUpdateScheduler.stop();
    }
  }

  /**
   * Set the interval for automatically updating the records.
   * @param {number} intervalMs - Interval for automatic record update in milliseconds.
   */
  public setAutoUpdateIntervalMs(intervalMs: number): void {
    if (!this.autoUpdateScheduler) {
      this.autoUpdateScheduler = new Scheduler(() => this.autoUpdateRecords(), intervalMs);
    } else {
      this.autoUpdateScheduler.changeInterval(intervalMs);
    }
  }

  /**
   * Update a specific uptime record.
   * @param {string} checkName - The name of the record.
   * @param {number} now - The current time.
   * @param {boolean} [checkResult] - The result of the check (optional).
   */
  public updateUptimeRecord(checkName: string, now: number, checkResult?: boolean): void {
    let record = this.uptimeRecords.get(checkName);

    if (record) {
      record.updateUptime(now, checkResult);
    } else {
      record = new UptimeRecord(now);
      this.uptimeRecords.set(checkName, record);
    }
  }

  /**
   * Process the result of a check and update the corresponding record.
   * @param {boolean} checkResult - The result of the check.
   * @param {string} key - The name of the record.
   */
  public processUptimeChange(checkResult: boolean, key: string) {
    const now = Date.now();
    this.updateUptimeRecord(key, now, checkResult);
  }

  /**
   * Get the uptime ratio of a specific record.
   * @param {string} name - The name of the record.
   * @returns {number} The uptime ratio (in percentage).
   */
  public getUptime(name: string): number {
    const record = this.uptimeRecords.get(name);

    if (!record) {
      console.warn(UptimeResponses.NO_RECORD(name));
      return -1;
    }

    const uptimeRatio = record.calculateUptimeRatio();

    return uptimeRatio * 100;
  }

  /**
   * Get all uptime records.
   * @returns {Object} The uptime records.
   */
  public getAllUptimes(): Record<string, UptimeRecordsObject> {
    let allUptimes: Record<string, UptimeRecordsObject> = {};
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    this.uptimeRecords.forEach((record, key) => {
      allUptimes[key] = record.toObject(rtf);
    });

    return allUptimes;
  }

  /**
   * Delete a specific uptime record.
   * @param {string} checkName - The name of the record.
   */
  public deleteUptimeRecord(checkName: string): void {
    if (!this.uptimeRecords.has(checkName)) {
      console.warn(UptimeResponses.NO_RECORD(checkName));
      return;
    }

    this.uptimeRecords.delete(checkName);
  }
}
