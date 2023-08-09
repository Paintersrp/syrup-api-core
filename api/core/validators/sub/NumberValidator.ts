import { ValidationResponses } from '../../lib/responses';
import { BaseValidator } from '../base/BaseValidator';
import { AssertOptions, AssertRangeOptions } from '../types';

/**
 * NumberValidator Class
 */
export class NumberValidator extends BaseValidator {
  public assertNumber({ param, context, errorMessage }: AssertOptions<number>): number {
    errorMessage = this.getErrorMessage(ValidationResponses.NUMBER_FAIL(param), errorMessage);
    this.assert(typeof param === 'number', errorMessage, context);

    return param;
  }

  /**
   * Asserts that a given number is within a specific range
   * @param options - object containing parameter, minimum, maximum, context and error message
   * @returns The asserted number
   */
  public assertNumberInRange({
    param,
    min,
    max,
    context,
    errorMessage,
  }: AssertRangeOptions<number>): number {
    this.assertNumber({ param, context, errorMessage });

    errorMessage = this.getErrorMessage(
      ValidationResponses.RANGE_FAIL(min, max, param),
      errorMessage
    );

    this.assert(param < min || param > max, errorMessage, context);
    return param;
  }
}
