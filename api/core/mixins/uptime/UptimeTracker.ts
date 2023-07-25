import { UptimeRecord, UptimeRecords } from './types';

/**
 * UptimeTracker class responsible for maintaining uptime records for a series of health checks.
 * @class
 */
export class UptimeTracker {
  /**
   * A map to store all uptime records with the key as check name and value as an UptimeRecord object.
   * @protected
   * @type {UptimeRecords}
   */
  protected uptimeRecords: UptimeRecords = new Map();

  constructor() {}

  /**
   * Updates the uptime record for a health check.
   *
   * If a health check with the specified name exists, it will update the record accordingly.
   * If the optional parameter checkResult is provided and is false, the uptime for the check will be reset.
   * If the health check does not exist, it will create a new record with the current timestamp as the last checked time and 0 uptime.
   *
   * @param {string} checkName - The name of the health check.
   * @param {number} now - The current timestamp.
   * @param {boolean} [checkResult] - The result of the health check.
   * @public
   */
  public updateUptimeRecord(checkName: string, now: number, checkResult?: boolean): void {
    if (this.uptimeRecords.has(checkName)) {
      const record = this.uptimeRecords.get(checkName);
      if (record) {
        if (checkResult === undefined || checkResult) {
          record.uptime += now - record.lastChecked;
        } else if (checkResult === false) {
          record.uptime = 0;
        }
        record.lastChecked = now;
      }
    } else {
      this.uptimeRecords.set(checkName, { uptime: 0, lastChecked: now });
    }
  }

  /**
   * Processes changes in uptime based on the result of a health check.
   *
   * If the health check with the specified key exists, it will update the record accordingly.
   * If the check result is false, the uptime will not be increased.
   * If the health check does not exist, it will create a new record with the current timestamp as the last checked time and 0 uptime.
   *
   * @param {boolean} checkResult - The result of a health check.
   * @param {string} key - The key of the uptime record to update.
   */
  public processUptimeChange(checkResult: boolean, key: string) {
    const now = Date.now();
    if (this.uptimeRecords.has(key)) {
      let record = this.uptimeRecords.get(key)!;
      if (checkResult) {
        record.uptime += now - record.lastChecked;
      }
      record.lastChecked = now;
    } else {
      this.uptimeRecords.set(key, { uptime: 0, lastChecked: now });
    }
  }

  /**
   * Retrieves the uptime ratio of a specific health check.
   *
   * The uptime ratio is calculated by dividing the uptime by the total duration since the last check and multiplying by 100.
   * If there is no record for the specified health check, it will throw an error.
   *
   * @param {string} checkName - The name of the health check.
   * @returns {number} - The uptime ratio as a percentage.
   * @throws {Error} - If there is no uptime record for the specified health check.
   */
  public getUptime(checkName: string): number {
    const record = this.uptimeRecords.get(checkName);

    if (!record) {
      throw new Error(`No uptime record for health check ${checkName}`);
    }

    const totalDuration = Date.now() - record.lastChecked;
    const uptimeRatio = totalDuration === 0 ? 0 : record.uptime / totalDuration;

    return uptimeRatio * 100;
  }

  /**
   * Retrieves the uptimes and last checked times of all health checks in a human-readable format.
   *
   * @returns {Object} - An object where each key is a health check name and each value is an object containing the human-readable uptime and last checked time.
   */
  public getAllUptimes(): { [key: string]: { uptime: string; lastChecked: string } } {
    let allUptimes: { [key: string]: { uptime: string; lastChecked: string } } = {};
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    this.uptimeRecords.forEach((record, key) => {
      const relativeUptime = this.calculateRelativeUptime(record);
      const relativeLastChecked = this.calculateRelativeLastChecked(record, rtf);

      allUptimes[key] = {
        uptime: relativeUptime,
        lastChecked: relativeLastChecked,
      };
    });

    return allUptimes;
  }

  /**
   * Calculates the relative uptime given a record object and formats it in a readable way.
   *
   * The uptime is formatted as hours, minutes, and seconds.
   *
   * @param {UptimeRecord} record - The uptime record to calculate.
   * @returns {string} - The formatted uptime string.
   * @private
   */
  private calculateRelativeUptime(record: UptimeRecord): string {
    const uptimeMilliseconds = record.uptime;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);
    const uptimeMinutes = Math.floor(uptimeSeconds / 60);
    const uptimeHours = Math.floor(uptimeMinutes / 60);

    return `${uptimeHours} hours, ${uptimeMinutes % 60} minutes, and ${uptimeSeconds % 60} seconds`;
  }

  /**
   * Calculates the time of the last check relative to the current time given a record object and formats it in a readable way.
   *
   * The last checked time is formatted as a date and time, and also shows the time elapsed since the last check.
   *
   * @param {UptimeRecord} record - The record object containing the last checked time.
   * @param {Intl.RelativeTimeFormat} rtf - An object that enables the relative time to be formatted.
   * @returns {string} - The formatted relative last checked string.
   * @private
   */
  private calculateRelativeLastChecked(record: UptimeRecord, rtf: Intl.RelativeTimeFormat): string {
    const now = Date.now();
    const lastCheckedDate = new Date(record.lastChecked);
    const relativeLastChecked = rtf.format(
      -Math.floor((now - record.lastChecked) / 1000),
      'second'
    );

    return `${lastCheckedDate.toLocaleDateString()} ${lastCheckedDate.toLocaleTimeString()} (${relativeLastChecked} ago)`;
  }
}
