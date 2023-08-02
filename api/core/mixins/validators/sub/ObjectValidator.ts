import { ValidationResponses } from '../../../lib/responses';
import { AssertKeyOptions, AssertKeysOptions, AssertOptions, RequestBody } from '../types';
import { BaseValidator } from '../base/BaseValidator';

/**
 * ObjectValidator Class
 */
export class ObjectValidator extends BaseValidator {
  /**
   * Asserts that a given parameter is an object
   * @param options - object containing parameter, context and error message
   * @returns The asserted object parameter
   */
  public assertObject<T>({ param, context, errorMessage }: AssertOptions<T>): T {
    const condition = typeof param !== 'object' || Array.isArray(param) || param === null;
    errorMessage = this.getErrorMessage(ValidationResponses.OBJECT_FAIL(param), errorMessage);

    this.assert(condition, errorMessage, context);
    return param;
  }

  /**
   * Asserts that a given object has a specific key
   * @param options - object containing parameter, key, context and error message
   * @returns The asserted object with the key
   */
  public assertHasKey<T extends object, K extends keyof any>({
    param,
    key,
    context,
    errorMessage,
  }: AssertKeyOptions<T, K>): RequestBody<T, K> {
    this.assertObject({ param, context, errorMessage });
    errorMessage = this.getErrorMessage(ValidationResponses.KEY_FAIL(String(key)), errorMessage);

    this.assert(!(key in param), errorMessage, context);
    return param as RequestBody<T, K>;
  }

  /**
   * Asserts that a given object has specific keys
   * @param options - object containing parameter, keys, context and error message
   * @returns The asserted object with the keys
   */
  public assertHasKeys<T extends object, K extends keyof any>({
    param,
    keys,
    context,
    errorMessage,
  }: AssertKeysOptions<T, K>): RequestBody<T, K> {
    this.assertObject({ param, context, errorMessage });

    for (const key of keys) {
      const keyError = this.getErrorMessage(
        ValidationResponses.KEY_FAIL(String(key)),
        errorMessage
      );

      this.assert(!(key in param), keyError, context);
    }
    return param as RequestBody<T, K>;
  }
}
