export type RequestBody<T extends object, K extends keyof any> = T & Record<K, unknown>;

export type BooleanReturn<T> = Extract<T, boolean>;
export type StringReturn<T> = Extract<T, string>;

export interface AssertOptions<T> {
  /**
   * The parameter to check.
   */
  param: T;

  /**
   * The context where the error occurred.
   */
  context: string;

  /**
   * The error message to throw.
   */
  errorMessage?: string;
}

export interface AssertTypeOptions<T> extends AssertOptions<T> {
  /**
   * The type the parameter is expected to be.
   */
  type: string;
}

export interface AssertKeyOptions<T, K> extends AssertOptions<T> {
  /**
   * The key to check.
   */
  key: K;
}

export interface AssertKeysOptions<T, K> extends AssertOptions<T> {
  /**
   * The keys to check.
   */
  keys: K[];
}

export interface AssertRangeOptions<T> extends AssertOptions<T> {
  /**
   * The minimum number of a range being checked.
   */
  min: number;

  /**
   * The maximum number of a range being checked.
   */
  max: number;
}

export interface AssertRegexOptions<T> extends AssertOptions<T> {
  /**
   * The regular expression the string is expected to match.
   */
  regex: RegExp;
}
