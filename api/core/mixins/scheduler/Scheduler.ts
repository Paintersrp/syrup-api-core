/**
 * A class representing the Scheduler.
 * @class
 */
export class Scheduler {
  private intervalId?: NodeJS.Timeout;

  /**
   * @constructor
   * @param {Function} callback - Callback function to execute.
   * @param {number} intervalMs - Interval for the execution of the callback function in milliseconds.
   */
  constructor(private callback: () => void, private intervalMs: number) {
    this.start();
  }

  /**
   * Start the execution of the callback function at specified intervals.
   */
  public start(): void {
    if (this.intervalId) {
      this.stop();
    }
    this.intervalId = setInterval(this.callback, this.intervalMs);
  }

  /**
   * Stop the execution of the callback function.
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Change the interval of execution for the callback function.
   * @param {number} intervalMs - The new interval in milliseconds.
   */
  public changeInterval(intervalMs: number): void {
    this.intervalMs = intervalMs;
    this.start();
  }
}
