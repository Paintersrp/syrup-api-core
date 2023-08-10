import { UptimeResponses } from '../../lib/responses/uptime';
import { UptimeRecordsObject } from './types';
import { UptimeRecord } from './UptimeRecord';

import { Job } from '../../jobs';
import { Scheduler } from '../../scheduler';

/**
 * A class representing the uptime tracker.
 * @class
 */
export class UptimeTracker {
  protected uptimeRecords: Map<string, UptimeRecord> = new Map();
  protected autoUpdateScheduler?: Scheduler;
  protected autoUpdateJob?: Job;

  constructor(autoUpdateIntervalCron?: string) {
    if (autoUpdateIntervalCron) {
      this.autoUpdateScheduler = new Scheduler();
      this.autoUpdateJob = new Job({
        name: 'autoUpdateUptimeRecords',
        task: async () => this.autoUpdateRecords(),
        schedule: autoUpdateIntervalCron,
      });
      this.autoUpdateScheduler.addJob(this.autoUpdateJob);
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
    if (this.autoUpdateScheduler && this.autoUpdateJob) {
      this.autoUpdateScheduler.stopJob(this.autoUpdateJob.name);
    }
  }

  public setAutoUpdateIntervalCron(intervalCron: string): void {
    if (!this.autoUpdateScheduler || !this.autoUpdateJob) {
      this.autoUpdateScheduler = new Scheduler();
      this.autoUpdateJob = new Job({
        name: 'autoUpdateUptimeRecords',
        task: async () => this.autoUpdateRecords(),
        schedule: intervalCron,
      });
      this.autoUpdateScheduler.addJob(this.autoUpdateJob);
    } else {
      this.autoUpdateScheduler.rescheduleJob(this.autoUpdateJob.name, intervalCron);
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
