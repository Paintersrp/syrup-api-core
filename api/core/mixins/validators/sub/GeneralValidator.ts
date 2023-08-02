import { ValidationResponses } from '../../../lib/responses';
import { AssertOptions, AssertTypeOptions, BooleanReturn } from '../types';
import { BaseValidator } from '../base/BaseValidator';

/**
 * GeneralValidator Class
 */
export class GeneralValidator extends BaseValidator {
  /**
   * Asserts that a given parameter exists
   * @param options - object containing parameter, context and error message
   * @returns The asserted parameter
   */
  public assertExists<T>({ param, context, errorMessage }: AssertOptions<T>): NonNullable<T> {
    errorMessage = this.getErrorMessage(ValidationResponses.EXIST_FAIL<T>(param), errorMessage);
    this.assert(param !== null || param !== undefined, errorMessage, context);
    return param as NonNullable<T>;
  }

  /**
   * Asserts that a given parameter is of a specific type
   * @param options - object containing parameter, type, context and error message
   * @returns The asserted parameter
   */
  public assertType<T>({ param, type, context, errorMessage }: AssertTypeOptions<T>): T {
    errorMessage = this.getErrorMessage(ValidationResponses.TYPE_FAIL(type, param), errorMessage);
    this.assert(typeof param === type, errorMessage, context);

    return param;
  }

  /**
   * Asserts that a given parameter is a boolean
   * @param options - object containing parameter, context and error message
   * @returns The asserted boolean parameter
   */
  public assertBoolean<T>({ param, context, errorMessage }: AssertOptions<T>): BooleanReturn<T> {
    return this.assertType({ param, type: 'boolean', context, errorMessage }) as Extract<
      T,
      boolean
    >;
  }
}
