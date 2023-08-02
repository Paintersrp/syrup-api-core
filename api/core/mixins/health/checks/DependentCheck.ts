import { HealthCheck } from '../types';
import { CheckInterface, CheckType } from './types';

/**
 * @class DependentCheck
 * It provides a way to perform a health check that depends on the success of another health check, with optional event hooks for before and after the checks and on error.
 *
 * @hook {() => void} onBeforeCheck - An optional function that is called before the health checks are performed.
 * @hook {(result: boolean) => void} onAfterCheck - An optional function that is called after the health checks have been performed with the overall result of the checks.
 * @hook {(error: Error) => void} onError - An optional function that is called if any of the health checks throw an error.
 *
 * @example
 * ```typescript
 * const primaryCheck = new SimpleCheck('primaryCheck', someCheck);
 * const dependentCheck = new DependentCheck('dependentCheck', primaryCheck, anotherCheck);
 * dependentCheck.onBeforeCheck = () => console.log('Starting the checks...');
 * dependentCheck.onAfterCheck = (result) => console.log(`Checks completed. Overall result: ${result}`);
 * dependentCheck.onError = (error) => console.log(`An error occurred during one of the checks: ${error}`);
 * ```
 */
export class DependentCheck implements CheckInterface {
  readonly name: string;
  private dependency: CheckType;
  private check: HealthCheck;

  public onBeforeCheck: (() => void) | null = null;
  public onAfterCheck: ((result: boolean) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;

  /**
   * @param {string} name - The name of the health check.
   * @param {CheckType} dependency - The check that this check depends on.
   * @param {HealthCheck} check - The main health check function.
   * @constructor
   */
  constructor(name: string, dependency: CheckType, check: HealthCheck) {
    this.name = name;
    this.dependency = dependency;
    this.check = check;
  }

  /**
   * Performs the health check. If the dependency check fails, this check is not performed and returns false.
   *
   * @returns {Promise<boolean>} - Returns a promise that resolves with the result of the health check.
   */
  async perform(): Promise<boolean> {
    this.onBeforeCheck?.();
    try {
      const dependencyResult = await this.dependency.perform();
      if (!dependencyResult) {
        this.onAfterCheck?.(false);
        return false;
      }
      const result = await this.check();
      this.onAfterCheck?.(result);
      return result;
    } catch (error: any) {
      this.onError?.(error);
      throw error;
    }
  }
}
