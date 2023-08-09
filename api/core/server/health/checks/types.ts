import { ComposedCheck } from './ComposedCheck';
import { DependentCheck } from './DependentCheck';
import { SimpleCheck } from './SimpleCheck';

/**
 * The interface for health check classes.
 *
 * @interface CheckInterface
 */
export interface CheckInterface {
  /**
   * The name of the health check.
   *
   * @type {string}
   * @readonly
   */
  readonly name: string;

  /**
   * The function to perform the health check. Must return a Promise that resolves with a boolean.
   *
   * @returns {Promise<boolean>}
   */
  perform(): Promise<boolean>;

  /**
   * Optional hook that is called before the health check is performed.
   * This is typically used to perform setup or logging.
   *
   * @type {(() => void) | null}
   */
  onBeforeCheck?: (() => void) | null;

  /**
   * Optional hook that is called after the health check is performed, with the result of the check.
   * This is typically used to perform cleanup or logging.
   *
   * @type {((result: boolean) => void) | null}
   */
  onAfterCheck?: ((result: boolean) => void) | null;

  /**
   * Optional hook that is called if an error is thrown during the health check.
   * This is typically used to handle or log errors.
   *
   * @type {((error: Error) => void) | null}
   */
  onError?: ((error: Error) => void) | null;
}

export type CheckType = SimpleCheck | ComposedCheck | DependentCheck;
