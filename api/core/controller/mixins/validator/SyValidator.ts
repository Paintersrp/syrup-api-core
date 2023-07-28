import { BadRequestError } from '../../../errors/client';
import { ValidationResponses } from '../../../lib/responses';

/**
 * @class
 * @classdesc A robust and comprehensive utility class to handle general validation.
 */
export class SyValidator {
  /**
   * @constructor
   */
  constructor() {}

  /**
   * @public
   * @description Asserts that a given parameter exists.
   * @param {T} param - The parameter to check.
   * @param {string} errorMessage - The error message to throw if the parameter does not exist.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the parameter does not exist.
   * @returns {NonNullable<T>} The validated parameter.
   */
  public assertExists<T>(param: T, errorMessage: string, context: string): NonNullable<T> {
    if (!param) {
      throw new BadRequestError(errorMessage, context);
    }

    return param as NonNullable<T>;
  }

  /**
   * @public
   * @description Asserts that the parameter is of a certain type.
   * @param {T} param - The parameter to check.
   * @param {string} type - The type the parameter is expected to be.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the parameter is not of the expected type.
   * @returns {T} The validated parameter.
   */
  public assertType<T>(param: T, type: string, context: string): T {
    if (typeof param !== type) {
      throw new BadRequestError(ValidationResponses.TYPE_FAIL(type, param), context);
    }

    return param;
  }

  /**
   * @public
   * @description Asserts that the parameter is a boolean.
   * @param {T} param - The parameter to check.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the parameter is not a boolean.
   * @returns {T} The validated parameter.
   */
  public assertBoolean<T>(param: T, context: string): Extract<T, boolean> {
    return this.assertType(param, 'boolean', context) as Extract<T, boolean>;
  }

  /**
   * @public
   * @description Asserts that the parameter is an array.
   * @param {T} param - The parameter to check.
   * @param {string} context - The URL where the error occurred.
   * @throws {BadRequestError} If the parameter is not an array.
   * @returns {T} The validated parameter.
   */
  public assertArray<T>(param: T, context: string): T {
    if (!Array.isArray(param)) {
      throw new BadRequestError(ValidationResponses.ARRAY_FAIL(param), context);
    }

    return param;
  }

  /**
   * @public
   * @description Asserts that the parameter is an object.
   * @param {T} param - The parameter to check.
   * @param {string} context - The URL where the error occurred.
   * @throws {BadRequestError} If the parameter is not an object.
   * @returns {T} The validated parameter.
   */
  public assertObject<T>(param: T, context: string): T {
    if (typeof param !== 'object' || Array.isArray(param) || param === null) {
      throw new BadRequestError(ValidationResponses.OBJECT_FAIL(param), context);
    }

    return param;
  }

  /**
   * @public
   * @description Asserts that the object has a specific key.
   * @param {T} obj - The object to check.
   * @param {K extends keyof any} key - The key the object is expected to have.
   * @param {string} context - The URL where the error occurred.
   * @throws {BadRequestError} If the object does not have the expected key.
   * @returns {T} The validated object.
   */
  public assertHasKey<T extends object, K extends keyof any>(obj: T, key: K, context: string): T {
    this.assertObject(obj, context);
    if (!(key in obj)) {
      throw new BadRequestError(ValidationResponses.KEY_FAIL(String(key)), context);
    }
    return obj;
  }

  /**
   * @public
   * @description Asserts that an object has specific keys.
   * @param {T} obj - The object to check.
   * @param {K[]} keys - The keys the object is expected to have.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the object does not have the expected keys.
   * @returns {T} The validated object.
   */
  public assertObjectHasKeys<T extends object, K extends keyof any>(
    obj: T,
    keys: K[],
    context: string
  ): T {
    this.assertObject(obj, context);
    for (const key of keys) {
      if (!(key in obj)) {
        throw new BadRequestError(
          `The object is missing the required key: ${String(key)}`,
          context
        );
      }
    }
    return obj;
  }

  /**
   * @public
   * @description Asserts that the parameter is a number and within a specific range.
   * @param {number} param - The parameter to check.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @param {string} context - The URL where the error occurred.
   * @throws {BadRequestError} If the parameter is not a number or is out of range.
   * @returns {number} The validated parameter.
   */
  public assertNumberInRange(param: number, min: number, max: number, context: string): number {
    this.assertType(param, 'number', context);
    if (param < min || param > max) {
      throw new BadRequestError(ValidationResponses.RANGE_FAIL(min, max, param), context);
    }
    return param;
  }

  /**
   * @public
   * @description Asserts that the parameter's length is within a specific range.
   * @param {string | any[]} param - The parameter to check.
   * @param {number} min - The minimum length.
   * @param {number} max - The maximum length.
   * @param {string} context - The URL where the error occurred.
   * @throws {BadRequestError} If the parameter's length is out of range.
   * @returns {string | any[]} The validated parameter.
   */
  public assertLengthInRange(
    param: string | any[],
    min: number,
    max: number,
    context: string
  ): string | any[] {
    if (typeof param === 'string' || Array.isArray(param)) {
      if (param.length < min || param.length > max) {
        throw new BadRequestError(ValidationResponses.LENGTH_FAIL(min, max, param.length), context);
      }
    } else {
      throw new BadRequestError(ValidationResponses.LENGTH_TYPE_FAIL(param), context);
    }
    return param;
  }

  /**
   * @public
   * @description Asserts that the parameter is a string and matches a certain regular expression.
   * @param {T} param - The parameter to check.
   * @param {RegExp} regex - The regular expression the string is expected to match.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the parameter is not a string or does not match the regex.
   * @returns {T} The validated parameter.
   */
  public assertMatchesRegex<T>(param: T, regex: RegExp, context: string): Extract<T, string> {
    const str = this.assertType(param, 'string', context) as Extract<T, string>;
    if (!regex.test(str)) {
      throw new BadRequestError(ValidationResponses.REGEX_FAIL(str, regex.toString()), context);
    }

    return str;
  }

  /**
   * @public
   * @description Asserts that the parameter is a string and contains only alphanumeric characters.
   * @param {T} param - The parameter to check.
   * @param {string} context - The context where the error occurred.
   * @throws {BadRequestError} If the parameter is not a string or does not contain only alphanumeric characters.
   * @returns {T} The validated parameter.
   */
  public assertAlphanumeric<T>(param: T, context: string): boolean {
    const str = this.assertType(param, 'string', context) as Extract<T, string>;
    const isAlphanumeric = /^[a-zA-Z0-9]+$/.test(str);

    if (!isAlphanumeric) {
      throw new BadRequestError(ValidationResponses.ALPHANUMERIC_FAIL(str), context);
    }

    return isAlphanumeric;
  }
}
