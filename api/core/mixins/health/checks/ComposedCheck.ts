import { CheckInterface } from './types';
import { SimpleCheck } from './SimpleCheck';

/**
 * @class ComposedCheck
 * It provides a way to perform multiple health checks at once and provide optional event hooks for before and after the checks and on error.
 *
 * @hook {() => void} onBeforeCheck - An optional function that is called before the health checks are performed.
 * @hook {(result: boolean) => void} onAfterCheck - An optional function that is called after the health checks have been performed with the overall result of the checks.
 * @hook {(error: Error) => void} onError - An optional function that is called if any of the health checks throw an error.
 *
 * @example
 * ```typescript
 * const check1 = new SimpleCheck('check1', someCheck1);
 * const check2 = new SimpleCheck('check2', someCheck2);
 * const composedCheck = new ComposedCheck('composedCheck', [check1, check2]);
 * composedCheck.onBeforeCheck = () => console.log('Starting the checks...');
 * composedCheck.onAfterCheck = (result) => console.log(`Checks completed. Overall result: ${result}`);
 * composedCheck.onError = (error) => console.log(`An error occurred during one of the checks: ${error}`);
 * ```
 */
export class ComposedCheck implements CheckInterface {
  readonly name: string;
  private checks: CheckInterface[];

  public onBeforeCheck: (() => void) | null = null;
  public onAfterCheck: ((result: boolean) => void) | null = null;
  public onError: ((error: Error) => void) | null = null;

  /**
   * @param {string} name - The name of the health check.
   * @param {CheckInterface[]} checks - The array of checks that this check is composed of.
   * @constructor
   */
  constructor(name: string, checks: SimpleCheck[]) {
    this.name = name;
    this.checks = checks;
  }

  /**
   * Performs all the checks that this check is composed of.
   *
   * @returns {Promise<boolean>} - Returns a promise that resolves with the result of the health check.
   */
  async perform(): Promise<boolean> {
    this.onBeforeCheck?.();
    try {
      const results = await Promise.all(this.checks.map((check) => check.perform()));
      const overallResult = results.every((result) => result);
      this.onAfterCheck?.(overallResult);
      return overallResult;
    } catch (error: any) {
      this.onError?.(error);
      throw error;
    }
  }
}
