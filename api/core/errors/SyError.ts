import { Context } from 'koa';

import { ErrorCategory, ErrorCodes } from './enums';
import { ErrorResponse } from './types';
import { Logger } from 'pino';

/**
 * Base class for system errors.
 */
export abstract class SyError extends Error {
  public readonly status: number;
  public readonly category: ErrorCategory;
  public readonly details?: unknown;
  public readonly errorCode: ErrorCodes;
  public readonly internalErrorCode?: string;
  public readonly timestamp: string;
  public readonly cleanStack: string[] | undefined;

  /**
   * @param status - HTTP status code of the error.
   * @param category - Error category, automatically determined.
   * @param errorCode - Specific error code representing the type of error.
   * @param message - Human-readable message providing more details about the error.
   * @param details - Detailed information about the error.
   * @param internalErrorCode - Localized error code to better trace
   */
  constructor(
    status: number,
    category: ErrorCategory,
    errorCode: ErrorCodes,
    message: string,
    details?: unknown,
    internalErrorCode?: string
  ) {
    super(message);

    this.status = status;
    this.category = category;
    this.errorCode = errorCode;
    this.details = details;
    this.internalErrorCode = internalErrorCode;
    this.timestamp = new Date().toISOString();

    if (new.target !== SyError) {
      Object.setPrototypeOf(this, new.target.prototype);
    }

    Error.captureStackTrace(this, this.constructor);
    this.cleanStack = this.cleanStackTrace(this.stack);
  }

  /**
   * Converts the error object into a standard error response format.
   * @returns An error response object.
   */
  public toResponse(ctx: Context): ErrorResponse {
    const response: ErrorResponse = {
      message: this.message,
      status: this.status,
      code: this.errorCode,
      details: this.details,
      internalErrorCode: this.internalErrorCode,
      timestamp: this.timestamp,
      stack: this.stack,
    };

    if (ctx.state.user) {
      response.user = ctx.state.user;
    }

    if (ctx.requestId) {
      response.requestId = ctx.requestId;
    }

    if (ctx.request) {
      response.request = {
        method: ctx.request.method,
        url: ctx.request.url,
        headers: ctx.request.headers,
        body: ctx.request.body,
      };
    }

    return response;
  }

  protected cleanStackTrace(stack: string | undefined): string[] | undefined {
    return stack?.split('\n').map((line: string) => line.trim());
  }

  /**
   * Logs the error details for debugging and tracing.
   */
  public logError(ctx: Context, logger: Logger): void {
    const logData: Record<string, unknown> = {
      status: this.status,
      code: this.errorCode,
      details: this.details,
      internalErrorCode: this.internalErrorCode,
      timestamp: this.timestamp,
      stack: this.cleanStack,
    };

    if (ctx.requestId) {
      logData.requestId = ctx.requestId;
    }

    if (ctx.state.user) {
      logData.user = ctx.state.user;
    }

    if (ctx.request) {
      logData.request = {
        method: ctx.request.method,
        url: ctx.request.url,
        headers: ctx.request.headers,
        body: ctx.request.body,
      };
    }

    logger.error(this.message, logData);
  }

  /**
   * Returns stringified version of the error for outside usage.
   */
  public toString(ctx: Context): string {
    return (
      `SyError: ${this.status} ${this.errorCode} ${this.message}` +
      (this.internalErrorCode ? ` (${this.internalErrorCode})` : '') +
      (this.details ? `\nDetails: ${JSON.stringify(this.details)}` : '') +
      `\nRequest ID: ${ctx.requestId}` +
      `\nRequest Method: ${ctx.request.method}` +
      `\nRequest URL: ${ctx.request.url}` +
      (this.timestamp ? `\nTimestamp: ${JSON.stringify(this.timestamp)}` : '') +
      (this.stack ? `\nStack trace:\n${this.stack}` : '')
    );
  }

  /**
   * Creates a specific instance of SyError
   *
   * @param {number} status - HTTP status code of the error.
   * @param {ErrorCategory} category - Error category, automatically determined.
   * @param {ErrorCodes} errorCode - Specific error code representing the type of error.
   * @returns A constructor function for a subclass of SyError.
   */
  public static createErrorType(status: number, category: ErrorCategory, errorCode: ErrorCodes) {
    return class extends SyError {
      constructor(message: string, details?: unknown, internalErrorCode?: string) {
        super(status, category, errorCode, message, details, internalErrorCode);
      }
    };
  }
}
