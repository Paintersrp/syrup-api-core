import { ValidationResponses } from '../../lib/responses';
import { BaseValidator } from '../base/BaseValidator';
import { ALPHANUMERIC_REGEX, EMAIL_REGEX, UUID_REGEX } from '../regex';
import { AssertOptions, AssertRangeOptions, AssertRegexOptions, StringReturn } from '../types';

/**
 * StringValidator Class
 */
export class StringValidator extends BaseValidator {
  protected ALPHANUMERIC_REGEX = ALPHANUMERIC_REGEX;
  protected EMAIL_REGEX = EMAIL_REGEX;
  protected UUID_REGEX = UUID_REGEX;

  public assertString({ param, context, errorMessage }: AssertOptions<string>): string {
    errorMessage = this.getErrorMessage(ValidationResponses.STRING_FAIL(param), errorMessage);
    this.assert(typeof param === 'string', errorMessage, context);

    return param;
  }

  /**
   * Asserts that a given parameter's length is within a specific range
   * @param options - object containing parameter, minimum, maximum, context and error message
   * @returns The asserted parameter
   */
  public assertLengthInRange({
    param,
    min,
    max,
    context,
    errorMessage,
  }: AssertRangeOptions<string | any[]>): string | any[] {
    const typeError = this.getErrorMessage(
      ValidationResponses.LENGTH_TYPE_FAIL(param),
      errorMessage
    );
    this.assert(typeof param === 'string' || Array.isArray(param), typeError, context);

    const lengthError = this.getErrorMessage(
      ValidationResponses.LENGTH_FAIL(min, max, param.length),
      errorMessage
    );
    this.assert(param.length < min || param.length > max, lengthError, context);

    return param;
  }

  /**
   * Asserts that a given parameter matches a regex
   * @param options - object containing parameter, regex, context and error message
   * @returns The asserted parameter
   */
  public assertMatchesRegex({
    param,
    regex,
    context,
    errorMessage,
  }: AssertRegexOptions<string>): StringReturn<string> {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    errorMessage = this.getErrorMessage(
      ValidationResponses.REGEX_FAIL(str, regex.toString()),
      errorMessage
    );

    this.assert(!regex.test(str), errorMessage, context);
    return str;
  }

  /**
   * Asserts that a given parameter is alphanumeric
   * @param options - object containing parameter, context and error message
   * @returns True if parameter is alphanumeric, otherwise false
   */
  public assertAlphanumeric({ param, context, errorMessage }: AssertOptions<string>): boolean {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    const isAlphanumeric = this.ALPHANUMERIC_REGEX.test(str);
    errorMessage = this.getErrorMessage(ValidationResponses.ALPHANUMERIC_FAIL(str), errorMessage);

    this.assert(isAlphanumeric, errorMessage, context);
    return isAlphanumeric;
  }

  /**
   * Asserts that a given parameter is a valid date
   * @param options - object containing parameter, context and error message
   * @returns The asserted date parameter
   */
  public assertDate({ param, context, errorMessage }: AssertOptions<string>): StringReturn<string> {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    const date = new Date(str);
    errorMessage = this.getErrorMessage(ValidationResponses.DATE_FAIL(str), errorMessage);
    errorMessage = errorMessage || ValidationResponses.DATE_FAIL(str);

    this.assert(isNaN(date.getTime()), errorMessage, context);
    return str;
  }

  /**
   * Asserts that a given parameter is a valid email
   * @param options - object containing parameter, context and error message
   * @returns The asserted email parameter
   */
  public assertEmail({
    param,
    context,
    errorMessage,
  }: AssertOptions<string>): StringReturn<string> {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    const isEmail = this.EMAIL_REGEX.test(str);
    errorMessage = this.getErrorMessage(ValidationResponses.EMAIL_FAIL(str), errorMessage);

    this.assert(!isEmail, errorMessage, context);
    return str;
  }

  /**
   * Asserts that a given parameter is a valid URL
   * @param options - object containing parameter, context and error message
   * @returns The asserted URL parameter
   */
  public assertURL({ param, context, errorMessage }: AssertOptions<string>): StringReturn<string> {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    errorMessage = this.getErrorMessage(ValidationResponses.URL_FAIL(str), errorMessage);

    try {
      new URL(str);
    } catch (e) {
      this.throwError(errorMessage, context);
    }

    return str;
  }

  /**
   * Asserts that a given parameter is a valid UUID
   * @param options - object containing parameter, context and error message
   * @returns The asserted UUID parameter
   */
  public assertUUID({ param, context, errorMessage }: AssertOptions<string>): StringReturn<string> {
    const str = this.assertString({ param, context, errorMessage }) as StringReturn<string>;

    const isUUID = this.UUID_REGEX.test(str);
    errorMessage = this.getErrorMessage(ValidationResponses.UUID_FAIL(str), errorMessage);

    this.assert(!isUUID, errorMessage, context);
    return str;
  }
}
