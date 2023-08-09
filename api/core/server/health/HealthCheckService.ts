import {
  HealthCheck,
  HealthChecks,
  HealthCheckWithRemediation,
  RemediationFunction,
} from './types';
import { UptimeTracker } from '../../monitoring/uptime/UptimeTracker';
import { SyLogger } from '../../logging/SyLogger';
import { HealthCheckOperations, HealthCheckScheduler } from './services';
import { HealthCheckError } from '../../errors/server';
import { HealthResponses } from '../../lib/responses/health';

/**
 * A class providing functionality to monitor and log the uptime and health status of the application.
 *
 * @class HealthCheckService
 */
export class HealthCheckService {
  public readonly logger: SyLogger;
  protected healthChecks: HealthChecks = new Map();
  protected uptimeTracker: UptimeTracker;
  protected operations: HealthCheckOperations;
  protected scheduler: HealthCheckScheduler;

  /**
   * @constructor
   * @param {SyLogger} logger
   */
  constructor(logger: SyLogger) {
    this.logger = logger;
    this.uptimeTracker = new UptimeTracker();
    this.operations = new HealthCheckOperations(this.logger, this.healthChecks, this.uptimeTracker);
    this.scheduler = new HealthCheckScheduler(this.logger, this.operations);
  }

  /**
   * Registers a new health check function with a given name.
   *
   * @public
   * @param {string} name - The name of the health check.
   * @param {HealthCheck} check - The health check function.
   * @param {RemediationFunction} [remediate] - An optional remediation function.
   * @throws {Error} If a health check with the given name already exists.
   */
  public registerHealthCheck(name: string, check: HealthCheck, remediate?: RemediationFunction) {
    this.checkIfHealthCheckExists(name);
    this.healthChecks = new Map([...this.healthChecks, [name, { check, remediate }]]);
  }

  /**
   * Unregisters a health check function with a given name.
   *
   * @public
   * @param {string} name - The name of the health check to unregister.
   * @throws {Error} If a health check with the given name does not exist.
   */
  public unregisterHealthCheck(name: string): void {
    this.checkIfHealthCheckExists(name);
    this.healthChecks.delete(name);
  }

  /**
   * Performs all registered health checks.
   *
   * @see {HealthCheckOperations#performHealthChecks}
   */
  public async performHealthChecks(): Promise<boolean> {
    return await this.operations.performHealthChecks();
  }

  /**
   * Executes a health check function by either name or directly using the function itself, logs an error if the check fails.
   *
   * @see {HealthCheckOperations#performHealthCheck}
   */
  public async performHealthCheck(check: string | HealthCheckWithRemediation): Promise<boolean> {
    return await this.operations.performHealthCheck(check);
  }

  /**
   * Schedules health checks at a given interval in milliseconds, logs the result.
   *
   * @see {HealthCheckScheduler#scheduleHealthChecks}
   */
  public scheduleHealthChecks(interval: number): void {
    this.scheduler.scheduleHealthChecks(interval);
  }

  /**
   * Pauses scheduled health checks if they are currently running.
   *
   * @see {HealthCheckScheduler#pauseScheduledHealthChecks}
   */
  public pauseScheduledHealthChecks(): void {
    this.scheduler.pauseScheduledHealthChecks();
  }

  /**
   * Resumes paused health checks, starting from where they left off.
   *
   * @see {HealthCheckScheduler#resumeScheduledHealthChecks}
   */
  public resumeScheduledHealthChecks(interval: number): void {
    this.scheduler.resumeScheduledHealthChecks(interval);
  }

  /**
   * Stops scheduled health checks if they are currently running.
   *
   * @see {HealthCheckScheduler#stopScheduledHealthChecks}
   */
  public stopScheduledHealthChecks(): void {
    this.scheduler.stopScheduledHealthChecks();
  }

  /**
   * Checks if a health check exists by a given key name
   */
  private checkIfHealthCheckExists(name: string): void {
    if (!this.healthChecks.has(name)) {
      throw new HealthCheckError(HealthResponses.HEALTH_CHECK_FAIL(name));
    }
  }
}
