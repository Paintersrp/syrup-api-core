import {
  ArrayValidator,
  GeneralValidator,
  NumberValidator,
  ObjectValidator,
  StringValidator,
} from './sub';

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
  protected readonly arrayValidator: ArrayValidator = new ArrayValidator();
  protected readonly generalValidator: GeneralValidator = new GeneralValidator();
  protected readonly numberValidator: NumberValidator = new NumberValidator();
  protected readonly objectValidator: ObjectValidator = new ObjectValidator();
  protected readonly stringValidator: StringValidator = new StringValidator();

  /**
   * Asserts that a given parameter exists
   * @see {GeneralValidator#assertExists}
   */
  public assertExists<T>(options: AssertOptions<T>): NonNullable<T> {
    return this.generalValidator.assertExists(options);
  }

  /**
   * Asserts that a given parameter is of a specific type
   * @see {GeneralValidator#assertType}
   */
  public assertType<T>(options: AssertTypeOptions<T>): T {
    return this.generalValidator.assertType(options);
  }

  /**
   * Asserts that a given parameter is a boolean
   * @see {GeneralValidator#assertBoolean}
   */
  public assertBoolean<T>(options: AssertOptions<T>): BooleanReturn<T> {
    return this.generalValidator.assertBoolean(options);
  }

  /**
   * Asserts that a given parameter is an array
   * @see {ArrayValidator#assertArray}
   */
  public assertArray<T>(options: AssertOptions<T>): T {
    return this.arrayValidator.assertArray(options);
  }

  /**
   * Asserts that a given parameter is an object
   * @see {ObjectValidator#assertObject}
   */
  public assertObject<T>(options: AssertOptions<T>): T {
    return this.objectValidator.assertObject(options);
  }

  /**
   * Asserts that a given object has a specific key
   * @see {ObjectValidator#assertHasKey}
   */
  public assertHasKey<T extends object, K extends keyof any>(
    options: AssertKeyOptions<T, K>
  ): RequestBody<T, K> {
    return this.objectValidator.assertHasKey(options);
  }

  /**
   * Asserts that a given object has a specific keys
   * @see {ObjectValidator#assertHasKeys}
   */
  public assertHasKeys<T extends object, K extends keyof any>(
    options: AssertKeysOptions<T, K>
  ): RequestBody<T, K> {
    return this.objectValidator.assertHasKeys(options);
  }

  /**
   * Asserts that a given number is within a specific range
   * @see {NumberValidator#assertNumber}
   */
  public assertNumber(options: AssertOptions<number>): number {
    return this.numberValidator.assertNumber(options);
  }

  /**
   * Asserts that a given number is within a specific range
   * @see {NumberValidator#assertNumberInRange}
   */
  public assertNumberInRange(options: AssertRangeOptions<number>): number {
    return this.numberValidator.assertNumberInRange(options);
  }

  /**
   * Asserts that a given parameter's length is within a specific range
   * @see {StringValidator#assertLengthInRange}
   */
  public assertLengthInRange(options: AssertRangeOptions<string | any[]>): string | any[] {
    return this.stringValidator.assertLengthInRange(options);
  }

  /**
   * Asserts that a given parameter matches a regex
   * @see {StringValidator#assertMatchesRegex}
   */
  public assertMatchesRegex(options: AssertRegexOptions<string>): StringReturn<string> {
    return this.stringValidator.assertMatchesRegex(options);
  }

  /**
   * Asserts that a given parameter is alphanumeric
   * @see {StringValidator#assertAlphanumeric}
   */
  public assertAlphanumeric(options: AssertOptions<string>): boolean {
    return this.stringValidator.assertAlphanumeric(options);
  }

  /**
   * Asserts that a given parameter is a valid date
   * @see {StringValidator#assertDate}
   */
  public assertDate(options: AssertOptions<string>): StringReturn<string> {
    return this.stringValidator.assertDate(options);
  }

  /**
   * Asserts that a given parameter is a valid email
   * @see {StringValidator#assertEmail}
   */
  public assertEmail(options: AssertOptions<string>): StringReturn<string> {
    return this.stringValidator.assertEmail(options);
  }

  /**
   * Asserts that a given parameter is a valid URL
   * @see {StringValidator#assertURL}
   */
  public assertURL(options: AssertOptions<string>): StringReturn<string> {
    return this.stringValidator.assertURL(options);
  }

  /**
   * Asserts that a given parameter is a valid UUID
   * @see {StringValidator#assertUUID}
   */
  public assertUUID(options: AssertOptions<string>): StringReturn<string> {
    return this.stringValidator.assertUUID(options);
  }
}
