import { SyLogger } from '../../../logging/SyLogger';
import { UptimeTracker } from '../../uptime';
import { HealthChecks, HealthCheckWithRemediation } from '../types';

/**
 * A class to perform health checks and remediations if required.
 *
 * @remarks
 * This class accepts an instance of `SyLogger` for logging, a `HealthChecks` object to perform health checks,
 * and an `UptimeTracker` object to track the uptime of the services.
 * @class
 */
export class HealthCheckOperations {
  private logger: SyLogger;
  private healthChecks: HealthChecks;
  private uptimeTracker: UptimeTracker;

  constructor(logger: SyLogger, healthChecks: HealthChecks, uptimeTracker: UptimeTracker) {
    this.logger = logger;
    this.healthChecks = healthChecks;
    this.uptimeTracker = uptimeTracker;
  }

  /**
   * Performs all registered health checks.
   *
   * @public
   * @returns {Promise<boolean>} A promise that resolves to true if all health checks pass, or false if any health check fails.
   */
  public async performHealthChecks(): Promise<boolean> {
    for (let check of this.healthChecks.values()) {
      if (!(await this.performHealthCheck(check))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Executes a health check function by either name or directly using the function itself, logs an error if the check fails.
   *
   * @param {string | HealthCheckWithRemediation} check The name of a registered health check, or a HealthCheckWithRemediation object.
   * @returns {Promise<boolean>} A promise that resolves to true if the health check passes, or false if it fails.
   * @throws {Error} If the provided check does not exist, or if the argument is of an invalid type.
   */
  public async performHealthCheck(check: string | HealthCheckWithRemediation): Promise<boolean> {
    if (typeof check === 'string') {
      const healthCheck = this.healthChecks.get(check);

      if (!healthCheck) {
        throw new Error(`Health check ${check} does not exist.`);
      }

      return this.runHealthCheck(healthCheck);
    } else if (typeof check === 'function') {
      return this.runHealthCheck(check);
    } else {
      throw new Error(
        'Invalid argument provided to performHealthCheck. Expected a string or function.'
      );
    }
  }

  /**
   * Executes a health check function, logs an error if the check fails.
   *
   * @param {HealthCheckWithRemediation} check A HealthCheckWithRemediation object.
   * @returns {Promise<boolean>} A promise that resolves to true if the health check passes, or false if it fails.
   * @private
   */
  private async runHealthCheck(check: HealthCheckWithRemediation): Promise<boolean> {
    const checkName = check.check.name;
    const now = Date.now();

    try {
      const result = await check.check();
      return result
        ? this.handleSuccessfulCheck(checkName, now)
        : this.handleFailedCheck(check, checkName, now);
    } catch (error: any) {
      return this.handleFailedCheck(check, checkName, now, error);
    }
  }

  /**
   * Handles the result of a successful health check.
   *
   * @param {string} checkName The name of the health check.
   * @param {number} now The current timestamp.
   * @returns {boolean} Always returns true.
   * @private
   */
  private handleSuccessfulCheck(checkName: string, now: number): boolean {
    this.uptimeTracker.updateUptimeRecord(checkName, now);
    return true;
  }

  /**
   * Handles the result of a failed health check.
   *
   * @param {HealthCheckWithRemediation} check The failed health check.
   * @param {string} checkName The name of the health check.
   * @param {number} now The current timestamp.
   * @param {Error} [error] The error that caused the health check to fail.
   * @returns {boolean} Always returns false.
   * @private
   */
  private handleFailedCheck(
    check: HealthCheckWithRemediation,
    checkName: string,
    now: number,
    error?: Error
  ): boolean {
    this.logger.error('Health check failed:', error);
    this.attemptRemediation(check);
    this.uptimeTracker.updateUptimeRecord(checkName, now);
    return false;
  }

  /**
   * Attempts to run the remediation function of a failed health check, if one exists.
   *
   * @param {HealthCheckWithRemediation} check The failed health check.
   * @returns {Promise<void>}
   * @private
   */
  private async attemptRemediation(check: HealthCheckWithRemediation): Promise<void> {
    if (!check.remediate) {
      return;
    }

    try {
      await check.remediate();
      this.logger.info('Remediation attempted for health check failure');
    } catch (remediationError: any) {
      this.logger.error('Remediation failed:', remediationError);
    }
  }
}
