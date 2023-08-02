import { ValidationResponses } from '../../../lib/responses';
import { AssertOptions } from '../types';
import { BaseValidator } from '../base/BaseValidator';

/**
 * ArrayValidator Class
 */
export class ArrayValidator extends BaseValidator {
  /**
   * Asserts that a given parameter is an array
   * @param options - object containing parameter, context and error message
   * @returns The asserted array parameter
   */
  public assertArray<T>({ param, context, errorMessage }: AssertOptions<T>): T {
    errorMessage = this.getErrorMessage(ValidationResponses.ARRAY_FAIL(param), errorMessage);
    this.assert(!Array.isArray(param), errorMessage, context);
    return param;
  }
}
