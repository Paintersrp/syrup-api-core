import { SyLogger } from '../../../logging/SyLogger';
import { HealthCheckOperations } from './HealthCheckOperations';

/**
 * A class to schedule and execute periodic health checks.
 *
 * @remarks
 * This class uses the `HealthCheckOperations` class to execute health checks at a given interval.
 * It utilizes the `SyLogger` class to log the results of the checks.
 *
 * @param logger - An instance of `SyLogger` used for logging.
 * @param operations - A `HealthCheckOperations` object to execute the health checks.
 *
 * @class
 */
export class HealthCheckScheduler {
  private healthCheckIntervalId?: NodeJS.Timeout;
  private logger: SyLogger;
  private operations: HealthCheckOperations;

  private lastRun: number;
  private isPaused: boolean;

  constructor(logger: SyLogger, operations: HealthCheckOperations) {
    this.logger = logger;
    this.operations = operations;

    this.lastRun = Date.now();
    this.isPaused = false;
  }

  /**
   * Schedules health checks at a given interval in milliseconds, logs the result.
   * @param {number} interval - The interval at which to perform health checks, in milliseconds.
   */
  public scheduleHealthChecks(interval: number): void {
    this.healthCheckIntervalId = setInterval(async () => {
      this.lastRun = Date.now();
      const isHealthy = await this.operations.performHealthChecks();
      if (isHealthy) {
        this.logger.info('Health check passed');
      } else {
        this.logger.warn('Health check failed');
      }
    }, interval);
  }

  /**
   * Pauses scheduled health checks if they are currently running.
   */
  public pauseScheduledHealthChecks(): void {
    if (this.healthCheckIntervalId) {
      this.isPaused = true;
      clearInterval(this.healthCheckIntervalId);
    }
  }

  /**
   * Resumes health checks if they are currently paused.
   */
  public resumeScheduledHealthChecks(interval: number): void {
    if (this.isPaused) {
      const timeSinceLastRun = Date.now() - this.lastRun;
      const nextInterval = interval - timeSinceLastRun;

      setTimeout(() => {
        this.operations.performHealthChecks();
        this.healthCheckIntervalId = setInterval(() => {
          this.lastRun = Date.now();
          this.operations.performHealthChecks();
        }, interval);
      }, nextInterval);

      this.isPaused = false;
    }
  }

  /**
   * Stops scheduled health checks if they are currently running.
   */
  public stopScheduledHealthChecks(): void {
    if (this.healthCheckIntervalId) {
      clearInterval(this.healthCheckIntervalId);
      this.healthCheckIntervalId = undefined;
    }
  }
}
