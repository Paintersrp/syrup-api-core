import { UptimeResponses } from '../../lib/responses/uptime';
import { RelativeUptime } from './types';

/**
 * A class representing the UptimeRecord.
 * @class
 */
export class UptimeRecord {
  public uptime: number;
  public lastChecked: number;

  /**
   * @constructor
   * @param {number} lastChecked - The last time the record was checked.
   * @param {number} [uptime] - The uptime (optional).
   */
  constructor(lastChecked: number, uptime?: number) {
    this.lastChecked = lastChecked;
    this.uptime = uptime ?? 0;
  }

  /**
   * Update the uptime of the record.
   * @param {number} now - The current time.
   * @param {boolean} [checkResult] - The result of the check (optional).
   */
  public updateUptime(now: number, checkResult?: boolean) {
    if (isNaN(now) || now <= 0) {
      console.warn(UptimeResponses.INVALID_TIMESTAMP(now));
      return;
    }

    if (checkResult === undefined || checkResult) {
      this.uptime += now - this.lastChecked;
    } else if (checkResult === false) {
      this.uptime = 0;
    }

    this.lastChecked = now;
  }

  /**
   * Calculate the uptime ratio.
   * @returns {number} The uptime ratio.
   */
  public calculateUptimeRatio(): number {
    const totalDuration = Date.now() - this.lastChecked;
    return totalDuration === 0 ? 0 : this.uptime / totalDuration;
  }

  /**
   * Convert the UptimeRecord to an object.
   * @param {Intl.RelativeTimeFormat} rtf - The format for relative time.
   * @returns {Object} The UptimeRecord as an object.
   */
  public toObject(rtf: Intl.RelativeTimeFormat): Record<string, any> {
    const relativeUptime = this.calculateRelativeUptime();
    const relativeLastChecked = this.calculateRelativeLastChecked(rtf);

    return {
      uptime: relativeUptime,
      lastChecked: relativeLastChecked,
    };
  }

  /**
   * Convert the uptime to a human readable format.
   * @returns {string} The uptime in a human readable format.
   * @private
   */
  private calculateRelativeUptime(): string {
    const { hours, minutes, seconds } = this.msToTime(this.uptime);
    return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
  }

  /**
   * Convert milliseconds to time.
   * @param {number} duration - The duration in milliseconds.
   * @returns {RelativeUptime} The time (hours, minutes, and seconds).
   * @private
   */
  private msToTime(duration: number): RelativeUptime {
    let seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    return {
      hours,
      minutes,
      seconds,
    };
  }

  /**
   * Calculate the relative last checked time.
   * @param {Intl.RelativeTimeFormat} rtf - The format for relative time.
   * @returns {string} The relative last checked time.
   * @private
   */
  private calculateRelativeLastChecked(rtf: Intl.RelativeTimeFormat): string {
    const now = Date.now();
    const lastCheckedDate = new Date(this.lastChecked);
    const relativeLastChecked = rtf.format(-Math.floor((now - this.lastChecked) / 1000), 'second');

    return `${lastCheckedDate.toLocaleDateString()} ${lastCheckedDate.toLocaleTimeString()} (${relativeLastChecked} ago)`;
  }
}
