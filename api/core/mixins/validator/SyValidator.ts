import { Logger } from 'pino';
import { ValidationError } from '../../errors/client';
import { ValidationResponses } from '../../lib/responses';
import { ALPHANUMERIC_REGEX, EMAIL_REGEX, UUID_REGEX } from './regex';
import {
  AssertKeyOptions,
  AssertKeysOptions,
  AssertOptions,
  AssertRangeOptions,
  AssertRegexOptions,
  AssertTypeOptions,
  BooleanReturn,
  RequestBody,
  StringReturn,
} from './types';

/**
 * SyValidator Class
 */
export class SyValidator {
  protected logger: Logger;

  protected ALPHANUMERIC_REGEX = ALPHANUMERIC_REGEX;
  protected EMAIL_REGEX = EMAIL_REGEX;
  protected UUID_REGEX = UUID_REGEX;

  /**
   * Constructor function for SyValidator
   * @param logger - a logger instance
   */
  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Retrieves an error message given a default and an optional custom message
   * @param defaultMessage - The default error message to return
   * @param customMessage - An optional custom error message
   * @returns The custom message if provided, otherwise the default message
   */
  private getErrorMessage(defaultMessage: string, customMessage?: string): string {
    return customMessage || defaultMessage;
  }

  /**
   * Throws a BadRequest error with a specific message and context
   * @param errorMessage - The error message for the BadRequest error
   * @param context - The context for the BadRequest error
   */
  private throwError(errorMessage: string, context: any) {
    throw new ValidationError(errorMessage, context);
  }

  /**
   * Asserts a condition and throws a BadRequest error if the condition is not met
   * @param condition - The condition to assert
   * @param errorMessage - The error message for the BadRequest error
   * @param context - The context for the BadRequest error
   */
  private assert(condition: boolean, errorMessage: string, context: any): asserts condition {
    if (!condition) {
      console.log(condition);
      this.throwError(errorMessage, context);
    }
  }

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
  public assertObjectHasKeys<T extends object, K extends keyof any>({
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
    this.assertType({ param, type: 'number', context });

    errorMessage = this.getErrorMessage(
      ValidationResponses.RANGE_FAIL(min, max, param),
      errorMessage
    );

    this.assert(param < min || param > max, errorMessage, context);
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
  public assertMatchesRegex<T>({
    param,
    regex,
    context,
    errorMessage,
  }: AssertRegexOptions<T>): StringReturn<T> {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
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
  public assertAlphanumeric<T>({ param, context, errorMessage }: AssertOptions<T>): boolean {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
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
  public assertDate<T>({ param, context, errorMessage }: AssertOptions<T>): StringReturn<T> {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
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
  public assertEmail<T>({ param, context, errorMessage }: AssertOptions<T>): StringReturn<T> {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
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
  public assertURL<T>({ param, context, errorMessage }: AssertOptions<T>): StringReturn<T> {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
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
  public assertUUID<T>({ param, context, errorMessage }: AssertOptions<T>): StringReturn<T> {
    const str = this.assertType({ param, type: 'string', context }) as StringReturn<T>;
    const isUUID = this.UUID_REGEX.test(str);
    errorMessage = this.getErrorMessage(ValidationResponses.UUID_FAIL(str), errorMessage);

    this.assert(!isUUID, errorMessage, context);
    return str;
  }
}
