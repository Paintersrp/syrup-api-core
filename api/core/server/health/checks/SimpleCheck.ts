import { HealthCheckWithRemediation } from '../types';
import { CheckInterface } from './types';

/**
 * @class SimpleCheck
 * It provides a simple way to run a single health check and optional event hooks for before and after the check and on error.
 *
 * @hook {() => void} onBeforeCheck - An optional function that is called before the health check is performed.
 * @hook {(result: boolean) => void} onAfterCheck - An optional function that is called after the health check has been performed with the result of the check.
 * @hook {(error: Error) => void} onError - An optional function that is called if the health check throws an error.
 *
 * @example
 * ```typescript
 * const myCheck = new SimpleCheck('myCheck', someCheck);
 * myCheck.onBeforeCheck = () => console.log('Starting the check...');
 * myCheck.onAfterCheck = (result) => console.log(`Check completed. Result: ${result}`);
 * myCheck.onError = (error) => console.log(`An error occurred: ${error}`);
 * ```
 */
export class SimpleCheck implements CheckInterface {
  readonly name: string;
  private check: HealthCheckWithRemediation;

  public onBeforeCheck: (() => void) | null = null;
  public onAfterCheck: ((result: boolean) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;

  /**
   * @param {string} name - The name of the health check.
   * @param {HealthCheck} check - The main health check function.
   * @constructor
   */
  constructor(name: string, check: HealthCheckWithRemediation) {
    this.name = name;
    this.check = check;
  }

  /**
   * Performs the health check and returns a Promise that resolves to a boolean indicating the health status.
   * @returns {Promise<boolean>}
   */
  async perform(): Promise<boolean> {
    this.onBeforeCheck?.();
    try {
      const result = await this.check.check();
      this.onAfterCheck?.(result);
      return result;
    } catch (error: any) {
      this.onError?.(error);
      throw error;
    }
  }
}
