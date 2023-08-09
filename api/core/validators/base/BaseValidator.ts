import { ValidationError } from '../../errors/client';

export abstract class BaseValidator {
  /**
   * Asserts a condition and throws a BadRequest error if the condition is not met
   * @param condition - The condition to assert
   * @param errorMessage - The error message for the BadRequest error
   * @param context - The context for the BadRequest error
   */
  protected assert(condition: boolean, errorMessage: string, context: any): asserts condition {
    if (!condition) {
      this.throwError(errorMessage, context);
    }
  }

  /**
   * Retrieves an error message given a default and an optional custom message
   * @param defaultMessage - The default error message to return
   * @param customMessage - An optional custom error message
   * @returns The custom message if provided, otherwise the default message
   */
  protected getErrorMessage(defaultMessage: string, customMessage?: string): string {
    return customMessage || defaultMessage;
  }

  /**
   * Throws a BadRequest error with a specific message and context
   * @param errorMessage - The error message for the BadRequest error
   * @param context - The context for the BadRequest error
   */
  protected throwError(errorMessage: string, context: any) {
    throw new ValidationError(errorMessage, context);
  }
}
